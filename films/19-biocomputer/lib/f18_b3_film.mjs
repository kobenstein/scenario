// Film 18 · builder B3 · c09 + c10 + c11 (+ end screen) as ONE plan sequence on THE BOARD, built once and shared by sc09/sc10/sc11.
// All three chunks draw the same function with the same camera keys, so the chunk seams (c09|c10 at 'Housing', c10|c11 at
// "Capitalism won't end") are identical frames by construction. Plan: docs/shots.md 9.01–11.07 · world: docs/MOTION.md · kit: f18_kit.
//
// | ID     | anchor                         | picture (one idea)                                                          | camera                      |
// |--------|--------------------------------|-----------------------------------------------------------------------------|-----------------------------|
// | 9.01   | already in play · quietly      | from plateRules: card II lays itself down onto the board, the board lights  | rise + pull back            |
// | 9.02   | set free                       | the card's loop glyph grows into the loop: the road lights warm, end to end | breathing hold              |
// | 9.03   | GPS · whole world · free       | three satellites glide in; signal rings fall onto the road; map pins rise   | hold                        |
// | 9.04   | one point four trillion        | from the near pin a thread rises: $1.4 TRILLION (NIST 2019)                 | slow push                   |
// | 9.05   | everyone earns                 | the road's light runs into the houses: windows light round the loop         | settle                      |
// | 9.06★  | free layer · at a door · Lagos · Ohio | widest: a door rises on the road and folds flat; down to the near edge: the kid (Lagos) and the plumber (Ohio) lit by the same road | rise, then descend |
// | 9.07   | run together · Land first      | points of people gather round the middle field; its outline lights          | to the middle               |
// | 9.08   | Baden-Württemberg · land alone | the ground opens as a section: a house above, the land below; the TAX tag hooks onto the land | descend into the cut |
// | 9.09   | doesn't rise · upheld          | the house grows two floors, the tag stays; UPHELD 2026 stamp                | hold                        |
// | 9.10   | nobody made · people build     | the land glows warm, the house plain light; the house widens into the block | slight pull back            |
// | 10.01  | Vienna · two thirds            | the Vienna block, Riesenrad + St. Stephen's rise behind; 8 of 12 bays warm  | hold                        |
// | 10.02  | capped                         | the land's tag grows and stops at a lid line (€188 / m²)                     | hold                        |
// | 10.03  | still argues                   | three windows flicker, two people in each                                   | push, then travel right     |
// | 10.04  | Copenhagen · wind farm         | the board's edge becomes the sea; an arc of 20 turbines rises               | travel → hold               |
// | 10.05  | Half · utility · 8,500 · co-op | half cool (city utility), half warm; a stream of people runs into the warm half | hold                    |
// | 10.06★ | always free · chose to share   | wind streaks through; a door on the shore opens; people walk through, you among them | push to the door    |
// | 10.07  | data center · Virginia · Who owns the door | back across the board: the data-centre hall rises at Loudoun, its tag swings | travel left           |
// | 10.08  | zoning meetings · can't vote · You can | into the town-hall window: the room, the hall outside blinks; you raise your hand | push through the window |
// | 10.09  | up front · the few · everyone  | out again: the door's value as light that forks: a thin branch to three hands, a wide one to every house | pull back |
// | 11.01  | encyclopedia · one price at a time · value stays | the shelf: its tags evaporate one by one, the books keep their light | travel to the shelf |
// | 11.02  | behind the doors · two sets of rules | rise: the whole board, the three doors; rule cards I and II stand up beside it | rise                 |
// | 11.03★ | best news · survive · design   | down to you: you draw a new line of light along the ground; on design it joins the road | descend           |
// | 11.04  | in its place · in the room     | you walk into the town hall; you in its window                               | pan + push                  |
// | 11.05  | which price · subscribe        | your tag lowers over the town hall, a ? on it, it swings; you step out under it | breathing                 |
// | 11.06  | free · ground it stands on · Your move | your tag evaporates; first light at the zero line; the middle field glows; you take one step | rise   |
// | 11.07  | (end screen)                   | pull back and rise over the board at first light; free areas left and right | pull back                   |
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f18_kit.mjs';
import * as B from './f18_b3_world.mjs';
import { plateRules, SEAM_HALF } from './f18_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, cam3, camDrift, F0, halo } = E;
const { BOARD, LOOP, gp, wp, stand, loopPt, loopU, COOL, bump } = F;
const { camFor, camK } = B;

export const PRINT = F.PRINT18;

// ===================================================================================================================== the set
const MID = { X: 0, Z: LOOP.cz };
const ZS = B.CARD.Zb;                                   // the section plane: the near edge of the middle field (where card II lies)
const ZB = ZS + 40;                                     // the house / Vienna block stands on the field just behind the cut
const LAGOS = { X: -820, Z: 2700 }, OHIO = { X: 820, Z: 2700 };
const RDOOR = { X: 0, Z: LOOP.cz - LOOP.half };         // the door that stands on the road and folds away (9.06)
const PINS = [{ X: -900, Z: LOOP.cz - LOOP.half }, { X: LOOP.half, Z: 4700 }, { X: 700, Z: LOOP.cz + LOOP.half }];
const SATS = [[520, 170], [960, 120], [1400, 185]];
const DOORS3 = [{ X: -2600, Z: 9000 }, { X: 0, Z: 9300 }, { X: 2600, Z: 9000 }];
const RIES = { X: -3700, Z: 10600, r: 820 }, SPIRE = { X: 3300, Z: 10900, h: 2400 };
const SDOOR = { X: 4120, Z: 3000 };
const DC = { X: -6100, Z: 5100, w: 3000, h: 820 };
const THL = { X: -4500, Z: 3300, depth: 1400 };
const SHELF = { X: 1500, Z: 2450 };
const YOU3 = { X: -3450, Z: 2550 };
const FEW = [[-8150, 4700], [-8450, 4950], [-7900, 5000]];
// the turbine arc (Middelgrunden): 10 turbines on a gentle arc off the shore; 0..4 the co-op (warm), 5..9 the city utility (cool)
const TURB = Array.from({ length: 10 }, (_, i) => { const u = i / 9, a = [5000, 6900], c = [7500, 5700], b = [10100, 7200];
  return { X: (1 - u) ** 2 * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0], Z: (1 - u) ** 2 * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1] }; });
// the town round the loop (same seed as c01)
const TOWN = (() => { const r = E.prng(1808), out = [];
  for (let i = 0; i < 14; i++) { const side = i % 3, w = 300 + r() * 260, h = 240 + r() * 200;
    const X = side === 0 ? -LOOP.half - 500 - r() * 900 : side === 1 ? LOOP.half + 500 + r() * 900 : -2200 + r() * 4400;
    const Z = side === 2 ? LOOP.cz + LOOP.half + 500 + r() * 700 : LOOP.cz - LOOP.half + 900 + r() * (2 * LOOP.half - 600);
    out.push({ X, Z, w, h, n: 1 + Math.floor(r() * 2.5), seed: 10 + i, side, ang: Math.atan2(Z - LOOP.cz, X) }); }
  return out; })();
// (houses that would stand inside the town hall's room or the data-centre field are left out of rules II's board)
for (let i = TOWN.length - 1; i >= 0; i--) { const h = TOWN[i]; if ((Math.abs(h.X - THL.X) < 1600 && h.Z < THL.Z + THL.depth + 400) || (Math.abs(h.X - DC.X) < DC.w / 2 + 500 && Math.abs(h.Z - DC.Z) < 900)) TOWN.splice(i, 1); }
const TOWN_FAR = [...TOWN].sort((p, q) => q.Z - p.Z);
const SHORE = TOWN.filter((h) => h.side === 1);
const SMALLTAGS = TOWN.filter((h) => h.side === 2).slice(0, 3).concat(TOWN.filter((h) => h.side === 1).slice(0, 1));
const COIN_U = loopU(0);

// ===================================================================================================================== build
export function makeB3(T) {
  E.prepareEditorial();
  const T0 = T.G('The second set of rules');
  const G = (p, after = T0, n = 0) => T.G(p, n, after), GE = (p, after = T0) => T.GE(p, 0, after);
  const a = {};
  a.T0 = T0; a.inplay = G('already in play'); a.quietly = G('quietly'); a.setfree = G('set free'); a.gps = G('GPS'); a.whole = G('whole world');
  a.free = G('free', a.whole); a.trillion = G('one point four trillion'); a.everyone = G('everyone earns'); a.rule = G("That's the rule");
  a.freeLayer = G('free layer'); a.roads = G('like roads'); a.paid = G('paid for together'); a.atDoor = G('at a door'); a.oneby = G('one by one');
  a.lagos = G('Lagos'); a.ohio = G('Ohio'); a.scarce = G('what stays scarce'); a.runTog = G('run together'); a.land1 = G('Land first');
  a.nobody = G('nobody made it'); a.bw = G('Baden'); a.landAlone = G('land alone'); a.notB = G('not the building'); a.build = G('Build on it');
  a.noRise = G("tax doesn't rise"); a.court = G('top tax court'); a.upheld = G('upheld'); a.taxWhat = G('Tax what nobody'); a.people = G('people build');
  a.housing = G('Housing'); a.vienna = G('Vienna'); a.twoThirds = G('two thirds'); a.affordable = G('affordable'); a.capped = G('capped');
  a.argues = G('still argues'); a.energy = G('Energy'); a.copen = G('Copenhagen'); a.wind = G('wind farm'); a.y2000 = G('two thousand');
  a.half = G('Half belongs'); a.utility = G('utility', a.half); a.other = G('The other half'); a.k8 = G('eight and a half thousand');
  a.coop = G('cooperative'); a.alwaysFree = G('always free'); a.theDoor = G('The door to it'); a.share = G('chose to share');
  a.nowAsk = G('Now ask'); a.dc = G('data center', a.nowAsk); a.virginia = G('Virginia', a.nowAsk); a.who = G('Who owns the door');
  a.legis = G('state legislatures'); a.zoning = G('zoning meetings'); a.cantVote = G("can't vote"); a.youCan = G('You can', a.cantVote);
  a.none = G('None of this'); a.owns = G('already owns'); a.upFront = G('up front'); a.few = G('the few'); a.everyone2 = G('to everyone', a.few);
  a.cap = G("Capitalism won't end"); a.crash = G('crash', a.cap); a.ency = G('encyclopedia', a.cap); a.onePrice = G('one price at a time');
  a.valueStays = G('value stays', a.cap); a.behind = G('behind the doors'); a.sameBoard = G('same board'); a.twoSets = G('two sets of rules', a.cap);
  a.best = G('best news'); a.survive = G('survive', a.best); a.design = G('design', a.survive); a.question = G('The question was never');
  a.place = G('in its place'); a.room = G('in the room'); a.tell = G('Tell me below'); a.which = G('which price'); a.sub = G('subscribe', a.which);
  a.channel = G("That's what this channel"); a.thinking = G('The thinking is about'); a.ground = G('ground it stands on'); a.move = G('Your move');
  a.voEnd = GE('Your move'); a.END = T.duration;
  const st = state(a);
  const K = keys(a);
  const draw = (ctx, t) => {
    if (t < T0 + SEAM_HALF) { plateRules(ctx, t); return; }
    const dAmt = smooth(span(t, T0 + SEAM_HALF, T0 + 2.2));
    const c = camDrift(camK(t, K), t, 2 * dAmt);
    world(ctx, t, c, a, st);
  };
  return { draw, a, K };
}

// ===================================================================================================================== camera
function keys(a) {
  const C0 = cam3(B.C0);
  const SECT = camFor(0, 0, ZS, .5, 960, 700, 1700);                         // the cut: ground line at y 700, the house above
  const VIE = camFor(0, 0, ZS, .4, 960, 760, 1700);                         // a little wider for the Vienna block
  const SEA1 = cam3({ x: 7300, y: -80, z: 2200, f: 1250 });
  const DOORV = camFor(SDOOR.X + 120, 0, SDOOR.Z, .5, 900, 820, 1250);
  const DCV = camFor(DC.X + 500, -350, DC.Z, .34, 960, 600, 1250);
  const WIN = camFor(THL.X, -400, THL.Z, 2.6, 960, 560, 1250);                // the town-hall window fills the frame
  const IN = cam3({ x: THL.X + B.TH.win[0] + B.TH.win[2] / 2, y: BOARD.GY + B.TH.win[1] + B.TH.win[3] / 2, z: THL.Z - 75, f: 900 });   // centred in the window: its edges pass evenly     // in the window (it fills the frame): the room
  const FORK = cam3({ x: -4300, y: -1650, z: -1500, f: 1000 });
  const SH = camFor(SHELF.X, -200, SHELF.Z, .52, 980, 650, 1500);
  const HIGH = cam3({ x: 0, y: -3300, z: -2900, f: 850 });
  const YOUV = camFor(YOU3.X + 700, -60, YOU3.Z + 120, .62, 960, 800, 1500);
  const THV = camFor(THL.X + 150, -420, THL.Z, .95, 960, 520, 1500);
  const NEAR = camFor(0, -120, RDOOR.Z, .62, 960, 740, 1300);
  const NEAR2 = camFor(0, -150, LAGOS.Z, .86, 960, 690, 1300);
  const ENDC = cam3({ x: -300, y: -3800, z: -5200, f: 850 });
  const near = (c, dx = 0, dy = 0, dz = 0, df = 0) => ({ ...c, x: c.x + dx, y: c.y + dy, z: c.z + dz, f: c.f + df });
  return [
    // c09
    [a.T0 + SEAM_HALF, C0],
    [a.quietly + 1.7, cam3({ x: 0, y: -2050, z: -700, f: 900 })],                 // rise + pull back while the card lies down
    [a.whole + .2, cam3({ x: -420, y: -2250, z: -380, f: 900 })],                // a slow drift left and in while the road lights and the rings come down
    [a.everyone + .9, cam3({ x: 380, y: -2060, z: -150, f: 890 })],               // ... and back right over the counter and the windows
    [a.freeLayer + .9, NEAR],                                                    // ★ down onto the near edge: the free road
    [a.oneby, near(NEAR, 0, 0, 60)],
    [a.lagos - .2, NEAR2],                                                        // closer: the kid and the plumber
    [a.ohio + 1.8, near(NEAR2, 0, -10, 90)],
    [a.runTog + .9, camFor(MID.X, 0, ZS, .32, 960, 860, 1400)],                 // the middle field
    [a.nobody + .7, near(camFor(MID.X, 0, ZS, .32, 960, 860, 1400), 0, 0, 120)],
    [a.bw - .3, SECT],                                                            // into the cut (the ground opens, down)
    [a.court, near(SECT, 0, 0, 60)],
    [a.people + .4, near(SECT, 0, 0, 90)],
    // c10
    [a.vienna + .2, VIE],
    [a.capped + .8, near(VIE, 60, 0, 70)],
    [a.argues + .75, cam3({ x: 3650, y: -1400, z: -600, f: 1475 }), 'a'],          // up and back on the way (the windows argue as we leave) ...
    [a.copen + .6, SEA1, 'b'],                                                    // ... and down to the sea
    [a.k8 + 1, near(SEA1, -60, 0, 160)],
    [a.alwaysFree + .4, near(SEA1, -150, 0, 220)],
    [a.share - .1, DOORV],                                                        // push to the shore door
    [a.nowAsk - .3, near(DOORV, 0, 0, 120)],
    [(a.nowAsk + a.virginia) / 2 - .1, cam3({ x: -600, y: -1900, z: -1800, f: 1250 }), 'a'],   // up and back across the board ...
    [a.virginia - .3, DCV, 'b'],                                                  // ... and down to Loudoun
    [a.who + .7, near(DCV, 30, 0, 160)],
    [a.zoning - .6, WIN, 's'],                                                     // to the town-hall window
    [a.cantVote - .1, { ...IN, ref: THL.Z }, 's'],                          // through it
    [a.youCan + .3, near(IN, 10, -6, 15)],
    [a.upFront + .4, { ...FORK, ref: THL.Z }, 's'],                           // out again and up: the fork
    [a.everyone2 + 1.2, near(FORK, 40, 0, 160)],
    // c11
    [a.cap + 1.4, SH],                                                             // along the board to the shelf
    [a.valueStays + .9, near(SH, 30, 0, 140)],
    [a.sameBoard + .4, HIGH],                                                      // rise: the whole board
    [a.twoSets + 1.1, near(HIGH, 0, 0, 180)],
    [a.survive - .2, YOUV],                                                        // down to you
    [a.design + 1.2, near(YOUV, 40, 0, 130)],
    [a.room - .2, THV],                                                            // the town-hall window, small
    [a.tell + .6, near(THV, 60, 0, 140)],
    [a.which + 1.4, near(THV, 1500, -60, -500)],
    [a.channel + .8, near(THV, 900, -260, -1100)],
    [a.move - .2, cam3({ x: -2700, y: -1150, z: -500, f: 1150 })],                // rise: first light
    [a.END - 1.5, ENDC],
    [a.END + 1, near(ENDC, 0, -40, -150)],
  ];
}

// ===================================================================================================================== state (pure functions of t)
function state(a) {
  const land = a.quietly + .2;                                 // card II lands on the board
  const ringT = [land + .15, a.setfree - .85];
  return { land, ringT };
}

// ===================================================================================================================== the world
function world(ctx, t, c, a, st) {
  // ---- light of the board: night (plate) → lit; warm at first light (c11)
  const dark = 1 - smooth(span(t, a.T0 + .9, a.quietly + .9));
  const warm = .12 * smooth(span(t, a.setfree, a.setfree + 3)) + .25 * smooth(span(t, a.cap, a.cap + 6)) + .6 * smooth(span(t, a.thinking - .4, a.voEnd + 3));
  const air = .08 + .2 * smooth(span(t, a.onePrice, a.valueStays + 1)) + .15 * smooth(span(t, a.thinking, a.voEnd + 4));
  // ---- the road: dim until the glyph ring reaches it; set free: warm end to end
  const rg = span(t, st.ringT[0], st.ringT[1]), ringIn = smooth(span(t, st.ringT[1] - .2, st.ringT[1] + .3));
  const sf = sineIO(span(t, a.setfree - .1, a.setfree + 1.3));
  const lit = [[0, 1, .35 * ringIn]];
  if (sf > 0) lit.push(sf >= 1 ? [0, 1, .85] : [COIN_U - sf / 2, COIN_U + sf / 2, .85]);
  // pulses: the door's light flows into the road (9.06), your line joins it (11.03)
  const dp = bump(t, a.atDoor + .9, 1.2), jp = bump(t, a.design - .05, 1.6);
  if (dp > 0) lit.push([COIN_U - .05, COIN_U + .05, .85 + .15 * dp]);
  if (jp > 0) { const ju = loopU(-1900), w = .5 * sineIO(span(t, a.design - .05, a.design + 1.2)); lit.push([ju - w, ju + w, .9 + .1 * jp]); }
  const sea = span(t, a.energy - .7, a.copen + .3) * (1 - 0);
  B.sky3(ctx, c, t, { lift: 1 - dark, warm, air });
  B.board3(ctx, c, t, { lift: 1 - dark, road: .25 + .25 * ringIn + .1 * warm, lit, ticks: .35, pres: 1 - dark, zero: 1, warm, sea: Math.max(sea, t > a.copen ? 1 : 0) });

  // ---- ground layer (lies on the board): card II (once down), its glyph ring, people points, the fork's feet, your line
  const th = cardAngle(t, a, st);
  if (dark <= 0) cardOnGround(ctx, c, t, a, st, th, warm);
  if (rg > 0 && ringIn < 1) {
    const e = sineIO(rg), hs = lerp(B.GLYPH.hs, LOOP.half, e), zc = lerp(B.GLYPH.Z, LOOP.cz, e), r = lerp(B.GLYPH.r, LOOP.r, e);
    B.groundSquare(ctx, c, 0, zc, hs, r, { w: (2.5 + 2 * e) * (1 - .5 * ringIn), a: 1 - ringIn });
  }
  people(ctx, c, t, a);
  yourLine(ctx, c, t, a);

  // ---- standing things, far → near
  const items = [];
  const add = (Z, X, fn) => items.push([Z, X, fn]);
  DOORS3.forEach((d, i) => { const u = span(t, a.behind - .5 + i * .12, a.behind + .7 + i * .12); if (u > 0) add(d.Z, d.X, () => stand(ctx, c, d.X, d.Z, () => B.popUp(ctx, u, () => farDoor(ctx, t, a, d)))); });
  vienna(add, ctx, c, t, a);
  for (const hs of TOWN_FAR) add(hs.Z, hs.X, () => stand(ctx, c, hs.X, hs.Z, () => townHouse(ctx, t, a, hs)));
  turbines(add, ctx, c, t, a);
  dcField(add, ctx, c, t, a);
  townHall(add, ctx, c, t, a);
  { const u = Math.min(span(t, a.cap - 1.4, a.cap + .2), 1 - span(t, a.sameBoard - .9, a.sameBoard + .5)); if (u > 0) add(SHELF.Z, SHELF.X, () => stand(ctx, c, SHELF.X, SHELF.Z, () => B.popUp(ctx, u, () => shelfField(ctx, t, a)))); }   // the shelf rises from the board as we turn to it (c11)
  section(add, ctx, c, t, a);
  roadDoor(add, ctx, c, t, a);
  pins(add, ctx, c, t, a);
  lagosOhio(add, ctx, c, t, a);
  shoreDoor(add, ctx, c, t, a);
  you(add, ctx, c, t, a);
  rulesBeside(add, ctx, c, t, a);
  items.sort((p, q) => q[0] - p[0]);
  for (const it of items) it[2]();

  // ---- the plate's night over the board while the light comes up (9.01), then the card falling
  if (dark > 0) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = dark;
    ctx.fillStyle = E.lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind0, P.blue1, .2)]]); ctx.fillRect(0, 0, W, H);
    E.stars(ctx, 1818, 90, t, [0, 0, W, H], .55);
    ctx.restore();
  }
  const glow = 1 - smooth(span(t, a.T0 + .8, land(st) + .4));
  if (glow > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, 960, 1180, 1100, [[0, rgba(P.halo1, .18 * glow)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(0, 0, W, H); ctx.restore(); }
  if (dark > 0) cardOnGround(ctx, c, t, a, st, th, warm);

  // ---- the sky: explainers grown from board things
  satellites(ctx, c, t, a);
  counter(ctx, c, t, a);
  fork(ctx, c, t, a);
  labels(ctx, c, t, a);
}
const land = (st) => st.land;

// ===================================================================================================================== c09 pieces
function cardAngle(t, a, st) {
  const u = span(t, a.T0 + SEAM_HALF + .25, st.land);
  const fall = Math.pow(u, 2.3) * Math.PI / 2;
  const settle = .045 * Math.sin(Math.PI * span(t, st.land, st.land + .38)) * (1 - span(t, st.land, st.land + .38));
  return Math.max(0, fall - settle);
}
function cardOnGround(ctx, c, t, a, st, th, warm) {
  // the card's light leaves into the ring/road after it lands, it stays as the middle field (dim); it glows again on "Land first"
  const dim = 1 - .62 * smooth(span(t, st.land + .2, a.setfree + .6));
  const again = .3 * bump(t, a.land1 - .1, 2.4) + .45 * smooth(span(t, a.ground - .2, a.ground + 1.2));
  B.cardDown(ctx, c, t, th, { a: Math.min(1, dim + again), jit: 1 - smooth(span(t, a.T0 + .6, st.land)) });
  if (th > 1.4 && t < st.land + 1) { const p = gp(c, 0, B.CARD.Zb + 300); if (p) E.dust(ctx, 1809, 140, p[0], p[1], 600 * p[2], 60 * p[2], t, .7 * (1 - span(t, st.land, st.land + 1))); }
  // the field's outline lights on "Land first" (the ground nobody made)
  const ol = smooth(span(t, a.land1 - .2, a.land1 + .6)) * (1 - smooth(span(t, a.bw, a.bw + 1))) + .8 * smooth(span(t, a.ground - .2, a.ground + 1.2));
  if (ol > 0) { const k = B.CARD.Wc / 2, z0 = B.CARD.Zb, z1 = B.CARD.Zb + B.CARD.Wc * .62; B.groundTrail(ctx, c, [[-k, z0], [k, z0], [k, z1], [-k, z1], [-k, z0]], 0, ol, { w: 3, spark: false }); }
}
function satellites(ctx, c, t, a) {
  for (let i = 0; i < 3; i++) {
    const ta = a.gps - .45 + i * .28, u = span(t, ta - 1.7, ta), out = expoIn(span(t, a.trillion - 2.4 + i * .2, a.trillion - .2 + i * .2));
    if (u <= 0 || out >= 1) continue;
    const [tx, ty] = SATS[i], e = expoOut(u), x = lerp(tx + 900, tx, e) + 8 * (t - ta) * (u >= 1 ? 1 : 0) + out * 700, y = lerp(ty - 260, ty, e) - out * 330 + Math.sin(t * .7 + i) * 3;
    B.satellite(ctx, t, x, y, 1.25 + .15 * (i === 1), { rot: -.1 + .05 * i - .2 * (1 - e) });
    // signal rings: on "whole world" they fall onto the board; on "free" they touch the road
    const p = gp(c, PINS[i].X, PINS[i].Z);
    if (!p) continue;
    for (let k = 0; k < 4; k++) {
      const t0 = a.whole - .05 + i * .1 + k * .3, q = span(t, t0, t0 + 1.05); if (q <= 0 || q >= 1) continue;
      const e2 = sineIO(q), rx = lerp(40, 220, e2), cx = lerp(x, p[0], e2), cy = lerp(y + 40, p[1], e2);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo0, .95 * Math.sin(Math.PI * q)); ctx.lineWidth = 6;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, rx * .32, 0, .1, Math.PI - .1); ctx.stroke(); ctx.restore();
    }
  }
  const gl = F.rise(span(t, a.gps - .1, a.gps + .6)) * (1 - expoIn(span(t, a.whole + 1.2, a.whole + 1.8)));
  if (gl > 0) B.label(ctx, SATS[1][0], SATS[1][1] + 118, 'GPS', null, gl, { align: 'center', s1: 40 });
}
function pins(add, ctx, c, t, a) {
  PINS.forEach((p, i) => {
    const u = span(t, a.free - .05 + i * .14, a.free + .55 + i * .14), down = span(t, a.rule - .2 + i * .1, a.rule + .5 + i * .1);
    if (u <= 0 || down >= 1) return;
    add(p.Z, p.X, () => stand(ctx, c, p.X, p.Z, () => B.popUp(ctx, u * (1 - expoIn(down)), () => B.pin(ctx, t, 520 + (i === 0) * 160))));
  });
}
function counter(ctx, c, t, a) {
  const tIn = a.trillion - .9, tOut = a.everyone - 1.2;
  const p = wp(c, PINS[0].X, BOARD.GY - 640, PINS[0].Z); if (!p || t < tIn - .6 || t > tOut + 1) return;
  const top = [960, 380], th = smooth(span(t, tIn - .6, tIn + .3)), back = smooth(span(t, tOut, tOut + .7));
  if (th > 0) F.trailSpan(ctx, [[p[0], p[1]], [lerp(p[0], top[0], .5), lerp(p[1], top[1], .6)], top], back, th, { w: 3, spark: th < 1 || back > 0 });
  const u = F.rise(span(t, tIn, tIn + .8)) * (1 - smooth(span(t, tOut - .5, tOut + .5)));
  if (u <= 0) return;
  const v = 1.4 * span(t, a.trillion - .15, a.trillion + .55);
  F.maskLine(ctx, [[`$${v.toFixed(1)}`, smooth(span(t, a.trillion + .8, a.trillion + 1.4))], [' TRILLION', 0]], 960, 320, 150, u, { align: 'center' });
  const u2 = F.rise(span(t, a.trillion + .5, a.trillion + 1.3)) * (1 - smooth(span(t, tOut - .6, tOut + .4)));
  if (u2 > 0) {
    F.maskLine(ctx, [['GAINED BY U.S. COMPANIES BY 2017', 0]], 960, 132, 40, u2, { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
    F.maskLine(ctx, [['NIST 2019', 0]], 960, 176, 26, u2, { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
  }
}
function townHouse(ctx, t, a, hs) {
  // 9.05: the road's light runs into every field: windows light round the loop, starting at the near middle
  const order = Math.abs(Math.atan2(Math.sin(hs.ang + Math.PI / 2), Math.cos(hs.ang + Math.PI / 2))) / Math.PI;
  const t0 = a.everyone - .4 + order * 1.2, L = .14 + .7 * smooth(span(t, t0, t0 + .45)) + .15 * flowLit(t, a, hs);
  F.house(ctx, t, hs.w, hs.h, { win: hs.n, lit: Math.min(1, L), seed: hs.seed });
  const si = SMALLTAGS.indexOf(hs);
  if (si >= 0) {   // a small price tag over a few houses; at the end screen they drift up into the air
    // on "which price in your line of work": everybody's work has a tag; at the end they drift up into the air
    const m = span(t, a.voEnd + 1.5 + si * 2.6, a.voEnd + 4.5 + si * 2.6), lo = sineIO(span(t, a.which - .6 + si * .25, a.which + 1.2 + si * .25));
    if (m < 1 && lo > 0) F.tag(ctx, t, 0, lerp(-4400, -hs.h * 1.45 - 420, lo) - 30 * Math.sin(t * .4 + si), 260, { melt: m, emit: (ts) => (ts > a.voEnd + 1.5 + si * 2.6 ? .5 : 0), swing: .02 * Math.sin(t * 1.1 + si), thread: 3000, seed: 40 + si, glow: .7 });
  }
}
function farDoor(ctx, t, a, d) {
  // the three doors (ground, power, chips): they rise on "behind the doors"; at first light they stand open (shared)
  const op = smooth(span(t, a.ground - .3, a.ground + 1.5));
  F.door(ctx, t, 0, 0, 1000, { lit: .75 + .25 * op, open: lerp(.3, .85, op) });
  const lo = sineIO(span(t, a.behind - .2, a.behind + 1.1)), sw = .01 * Math.sin(t * 1.1 + d.X);
  if (lo > 0) F.tag(ctx, t, 0, lerp(-4800, -1000 * 1.27 - 560, lo), 440, { swing: sw, thread: 3600, glow: .8 });
}
function roadDoor(add, ctx, c, t, a) {
  const up = span(t, a.roads + .45, a.roads + 1.25), fold = span(t, a.atDoor + .05, a.atDoor + .95);
  if (up <= 0 || fold >= 1) return;
  add(RDOOR.Z, RDOOR.X, () => stand(ctx, c, RDOOR.X, RDOOR.Z, () => {
    const k = expoOut(up) * Math.cos(Math.PI / 2 * fold * fold);
    ctx.save(); ctx.scale(1, Math.max(.001, k)); F.door(ctx, t, 0, 0, 640, { lit: .9, open: .15 }); ctx.restore();
    if (fold > 0) E.dust(ctx, 1907, 120, 0, -10, 300, 40, t, .6 * Math.sin(Math.PI * fold));
  }));
}
function lagosOhio(add, ctx, c, t, a) {
  if (t < a.atDoor - 1 || t > a.bw) return;
  const lL = smooth(span(t, a.lagos - .3, a.lagos + .5)), lO = smooth(span(t, a.ohio - .3, a.ohio + .5));
  for (const [P0, l, fn] of [[LAGOS, lL, B.kid], [OHIO, lO, B.plumber]]) {
    add(P0.Z, P0.X, () => stand(ctx, c, P0.X, P0.Z, () => {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.scale(1, .16); ctx.fillStyle = E.rad(ctx, 0, 0, 520, [[0, rgba(P.halo0, .55 * l)], [1, rgba(P.halo0, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 520, 0, 6.29); ctx.fill(); ctx.restore();
      fn(ctx, t, 0, fn === B.kid ? 230 : 330, { rim: mixHex(P.blue0, P.halo0, l), lit: l });
    }));
  }
}
function people(ctx, c, t, a) {
  // 9.07: points of people come off the road and gather round the middle field (we run it together); they stay round it
  const t0 = a.runTog - 1.2, t1 = a.bw - .2; if (t < t0 || t > t1 + .6) return;
  const out = smooth(span(t, t1, t1 + .6));
  for (let i = 0; i < 44; i++) {
    const u = i / 44, [rx, rz] = loopPt(u + .013), ang = u * 6.283 - Math.PI / 2;
    const tx = MID.X + Math.cos(ang) * 1120, tz = MID.Z + Math.sin(ang) * 760 + 0;
    const q = sineIO(span(t, t0 + (i % 11) * .06, t0 + 1.5 + (i % 11) * .06));
    const X = lerp(rx, tx, q), Z = lerp(rz, tz, q), p = gp(c, X, Z); if (!p) continue;
    const r = Math.max(2.2, 34 * p[2]) * (1 - out);
    halo(ctx, p[0], p[1] - r, r * 4, .55 * (1 - out), P.halo0, P.core1);
    ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(p[0], p[1] - r, r * .55, 0, 6.29); ctx.fill();
  }
}
function section(add, ctx, c, t, a) {
  const open = expoOut(span(t, a.nobody + .5, a.bw + .3)) * (1 - sineIO(span(t, a.argues + .7, a.copen - .4)));
  const bIn = span(t, a.bw - .3, a.bw + .6), out = t > a.copen + 1.5;
  if (out) return;
  // the house → the Vienna block (stands on the middle field just behind the cut)
  if (bIn > 0) add(ZB, 0, () => stand(ctx, c, 0, ZB, () => B.popUp(ctx, bIn, () => house3(ctx, t, a))));
  if (open > 0) add(ZS - 1, 0, () => stand(ctx, c, 0, ZS, () => {
    const warm = smooth(span(t, a.taxWhat - .1, a.taxWhat + .9)) * (1 - .55 * smooth(span(t, a.vienna - .3, a.twoThirds))), mark = smooth(span(t, a.landAlone, a.landAlone + .6)) * (1 - smooth(span(t, a.vienna, a.vienna + 1)));
    const pw = lerp(1000, 2900, sineIO(span(t, a.people + .3, a.vienna - .5)));
    B.earth(ctx, t, { open, plotW: pw, warm, mark });
    landTag(ctx, t, a, pw);
  }));
}
function houseDims(t, a) {
  const g1 = sineIO(span(t, a.build - .05, a.build + .9)), g2 = sineIO(span(t, a.people + .3, a.vienna - .5));
  return { w: lerp(4 * B.BX, 12 * B.BX, g2), h: lerp(lerp(2 * B.FY, 4 * B.FY, g1), 5 * B.FY, g2), g2 };
}
function house3(ctx, t, a) {
  const { w, h, g2 } = houseDims(t, a);
  const plain = smooth(span(t, a.people - .2, a.people + .6));
  const third = (b) => { const k = b + 6; return k < 8 ? smooth(span(t, a.twoThirds - .1 + k * .06, a.twoThirds + .35 + k * .06)) : 0; };
  const flick = [[-4, 2], [-1, 3], [3, 1]], fl = (b, f) => { const i = flick.findIndex(([bb, ff]) => bb === b && ff === f); return i < 0 ? 0 : bump(t, a.argues - .5 + i * .25, 2.2) * (.5 + .5 * Math.sin(t * 17 + i * 2)); };
  B.blockB(ctx, t, w, h, {
    lit: (b, f) => .32 + .28 * plain + .5 * third(b) + .4 * fl(b, f),
    wcol: (b) => third(b),
    arch: smooth(span(g2, .7, 1)),
    who: (cx, b, f, x, y, ww, wh) => { const k = fl(b, f); if (k <= 0) return; for (const s of [-1, 1]) { const ph = t * 6 + s * 2 + b; E.person(cx, x + s * ww * .22, y + wh, wh * .9, { dir: -s, light: s, armR: [1.2 + .6 * Math.sin(ph), 1.3], armL: [-.3, -.2] }); } },
  });
}
function landTag(ctx, t, a, pw) {
  // the TAX tag lowers on its thread past the house and hooks onto the land (ground line); its thread lets go and rises away
  const x = 620, lo = sineIO(span(t, a.landAlone - .9, a.landAlone + .2)), y = lerp(-3400, 10, lo);
  if (lo <= 0) return;
  const g = smooth(span(t, a.capped - .9, a.capped - .05)), stop = smooth(span(t, a.capped - .05, a.capped + .25));
  const w = 300 + Math.min(22, 34 * g) - 3 * bump(t, a.capped - .05, .35);
  const free = expoIn(span(t, a.landAlone + .55, a.landAlone + 1.5)), sw = .03 * Math.sin(Math.PI * span(t, a.landAlone + .1, a.landAlone + 1.4)) * (1 - span(t, a.landAlone + .6, a.landAlone + 1.4)) + .005 * Math.sin(t * 1.3);
  if (free < 1) { ctx.strokeStyle = rgba(P.halo1, .55); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y - 3600); ctx.lineTo(x, lerp(y, y - 3600, free)); ctx.stroke(); }
  F.tag(ctx, t, x, y, w, { text: 'TAX', size: .27, swing: sw, thread: 0 });
  // the building gets none: an empty hook comes down over the house and goes back up
  const { h } = houseDims(t, a), hk = sineIO(span(t, a.notB - .55, a.notB)) * (1 - expoIn(span(t, a.notB + .45, a.notB + 1.2)));
  if (hk > 0) { const hy = lerp(-3600, -h - 130, hk); ctx.strokeStyle = rgba(P.halo1, .5); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-60, hy - 3000); ctx.lineTo(-60, hy); ctx.stroke(); ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(-60, hy + 18, 18, 0, 6.29); ctx.stroke(); }
  // "tax doesn't rise": a dotted level line at the tag's bottom, across under the house
  const lv = smooth(span(t, a.noRise - .2, a.noRise + .6)) * (1 - smooth(span(t, a.taxWhat - .4, a.taxWhat + .2)));
  if (lv > 0) { const by = y + w * 1.32; ctx.save(); ctx.setLineDash([16, 14]); ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + w / 2 + 20, by); ctx.lineTo(x + w / 2 + 20 - lv * 1500, by); ctx.stroke(); ctx.restore(); }
  // the cap (Vienna): a lid line slides in under the tag; the tag grows and stops on it
  const lid = smooth(span(t, a.capped - .35, a.capped + .15)) * (1 - smooth(span(t, a.argues + .3, a.argues + 1)));
  if (lid > 0) { F.rule(ctx, x + 400, 10 + (300 + 22) * 1.32 + 8, lerp(x + 400, x - 260, lid), 10 + (300 + 22) * 1.32 + 8, 1, { w: 7, spark: lid < 1 }); }
}
// ===================================================================================================================== c10 pieces
function vienna(add, ctx, c, t, a) {
  const r = span(t, a.vienna - .25, a.vienna + .9), s = span(t, a.vienna + .05, a.vienna + 1.2);
  if (r > 0) add(RIES.Z, RIES.X, () => stand(ctx, c, RIES.X, RIES.Z, () => B.popUp(ctx, r, () => B.riesenrad(ctx, t, RIES.r, { lit: .5 }))));
  if (s > 0) add(SPIRE.Z, SPIRE.X, () => stand(ctx, c, SPIRE.X, SPIRE.Z, () => B.popUp(ctx, s, () => B.spire(ctx, t, SPIRE.h))));
}
function turbines(add, ctx, c, t, a) {
  if (t < a.wind - .6) return;
  TURB.forEach((p, i) => {
    const u = span(t, a.wind - .45 + i * .07, a.wind + .75 + i * .07);
    const coop = i < 5, k = coop ? i : i - 5;
    const lc = coop ? smooth(span(t, a.other + .2 + k * .05, a.other + .8 + k * .05)) : smooth(span(t, a.half + .1 + k * .05, a.half + .7 + k * .05));
    const fed = coop ? bump(t, a.k8 + .9 + k * .08, 1.2) : 0;
    add(p.Z, p.X, () => stand(ctx, c, p.X, p.Z, () => B.popUp(ctx, u, () => B.turbine(ctx, t, 780, { rot: t * (.8 + .25 * smooth(span(t, a.alwaysFree - .6, a.alwaysFree + .6))) + i * .9, warm: coop ? lc : 0, light: .25 + .75 * lc + .4 * fed }))));
  });
}
function streamPts(t, a) {
  // 10.05: people (points) run from the shore houses out to the warm half (the co-op)
  const out = [];
  for (let k = 0; k < 54; k++) {
    const h = SHORE[k % SHORE.length], tb = TURB[k % 5], t0 = a.k8 - .35 + (k % 18) * .055 + Math.floor(k / 18) * .2, q = span(t, t0, t0 + 1.5);
    if (q <= 0 || q >= 1) continue;
    const e = sineIO(q), X = lerp(h.X + 120, tb.X, e), Z = lerp(h.Z, tb.Z, e);
    out.push([X, Z, Math.sin(Math.PI * q)]);
  }
  return out;
}
function shoreDoor(add, ctx, c, t, a) {
  const up = span(t, a.theDoor - .55, a.theDoor + .35); if (up <= 0 || t > a.virginia + 2) return;
  const op = sineIO(span(t, a.share - .7, a.share + .3));
  add(SDOOR.Z, SDOOR.X, () => stand(ctx, c, SDOOR.X, SDOOR.Z, () => B.popUp(ctx, up, () => F.door(ctx, t, 0, 0, 620, { lit: 1, open: lerp(.1, 1, op) }))));
  // the people: a short line walks along the shore and through the open door (you are the fourth)
  for (let k = 0; k < 8; k++) {
    const t0 = a.share - .35 + k * .34, q = span(t, t0, t0 + 2.3); if (q <= 0) continue;
    const enter = span(t, t0 + 2.3, t0 + 2.75); if (enter >= 1) continue;
    const X = lerp(SDOOR.X - 1100, SDOOR.X, sineIO(q)), Z = SDOOR.Z - 30 - k * 4;
    add(Z, X, () => stand(ctx, c, X, Z, () => {
      ctx.save();
      if (enter > 0) { const dw = 620 * .46; ctx.beginPath(); ctx.rect(-dw / 2 - (X - SDOOR.X), -620, dw, 640); ctx.clip(); ctx.translate(0, -40 * enter); ctx.scale(1 - .35 * enter, 1 - .35 * enter); }
      const o = { dir: 1, walk: (t - t0) * 6.2 + k, light: 1, rim: mixHex(P.blue0, P.halo0, .6) };
      if (k === 3) E.du(ctx, 0, 0, 210, o); else E.person(ctx, 0, 0, 200 + (k % 3) * 14, o);
      ctx.restore();
    }));
  }
}
function dcField(add, ctx, c, t, a) {
  const up = span(t, a.dc - .2, a.dc + 1.5); if (up <= 0) return;
  const blinkOff = Math.max(bump(t, a.cantVote - .05, .35), bump(t, a.cantVote + .45, .35));
  const dl = .55 + .45 * smooth(span(t, a.who + .5, a.who + 1.1));
  add(DC.Z, DC.X, () => stand(ctx, c, DC.X, DC.Z, () => {
    B.popUp(ctx, up, () => B.dcHall(ctx, t, DC.w, DC.h, { blink: 1 - blinkOff, door: dl }));
    if (up < 1) E.dust(ctx, 2007, 160, 0, -10, DC.w * .55, 50, t, .6 * Math.sin(Math.PI * up));
    // its tag lowers out of the dark as it rises; on "Who owns the door?" it swings
    const lo = sineIO(span(t, a.virginia - 1.2, a.virginia + .3)) * (1 - sineIO(span(t, a.question - .3, a.question + 1.3)));
    if (lo > 0) { const sw = .16 * Math.sin((t - a.who) * 3.6) * Math.exp(-(t - a.who) * .9) * (t > a.who ? 1 : 0) + .008 * Math.sin(t * 1.2);
      F.tag(ctx, t, 0, lerp(-4200, -DC.h - 1150, lo), 620, { swing: sw, thread: 4000, glow: .9 }); }
    // the few: three people beside the hall; their hands go up when the thin branch reaches them
    FEW.forEach(([X, Z], i) => { const hu = smooth(span(t, a.few + .5 + i * .1, a.few + 1.1 + i * .1)); E.person(ctx, X - DC.X, Z - DC.Z, 260, { dir: 1, light: 1, armR: [lerp(.2, 2.7, hu), lerp(.1, 2.8, hu)], rim: mixHex(P.blue0, P.halo0, hu) }); });
  }));
}
function townHall(add, ctx, c, t, a) {
  const inside = c.z > THL.Z - 80;   // close to the window plane the window fills the frame: from there on we draw the room unclipped
  const [wx, wy, ww, wh] = B.TH.win;
  const back = THL.Z + THL.depth;
  const roomLit = .8;
  const drawRoom = () => {
    // clip to the window while we are outside
    ctx.save();
    if (!inside) {
      const p0 = wp(c, THL.X + wx, BOARD.GY + wy, THL.Z), p1 = wp(c, THL.X + wx + ww, BOARD.GY + wy + wh, THL.Z);
      if (!p0 || !p1) { ctx.restore(); return; }
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1]); ctx.clip();
    }
    stand(ctx, c, THL.X, back, () => {
      const p = new Path2D(); p.rect(-2200, -1800, 4400, 1800); p.rect(-700, -1250, 1400, 620);
      ctx.fillStyle = E.lin(ctx, 0, -1800, 0, 0, [[0, P.night1], [.6, mixHex(P.night1, P.ind2, .6)], [1, mixHex(P.ind2, P.shade0, .25)]]); ctx.fill(p, 'evenodd');
      ctx.strokeStyle = rgba(P.halo1, .5); ctx.lineWidth = 10; ctx.strokeRect(-700, -1250, 1400, 620);
      halo(ctx, 0, -1500, 1300, .25 * roomLit, P.halo0, P.core1);
      // the council table with three people facing us
      for (const x of [-500, 0, 500]) E.person(ctx, x, -60, 300, { dir: 1, light: 1, armR: [.6, 1.3], armL: [-.6, -1.3], rim: mixHex(P.blue0, P.halo0, .4) });
      ctx.fillStyle = mixHex(P.ind2, P.shade0, .3); ctx.fillRect(-900, -250, 1800, 250);
      ctx.fillStyle = mixHex(P.ind2, P.shade0, .42); ctx.fillRect(-940, -280, 1880, 40);
    });
    // rows of people (backs to us), chairs; you in the middle row while you are here
    const youHere = (t > a.dc && t < a.cap) || (t > a.place + .5 && t < a.tell + 3.8);
    const raise = smooth(span(t, a.youCan - .15, a.youCan + .45)) * (1 - smooth(span(t, a.owns, a.owns + 1))) + .7 * smooth(span(t, a.room - .2, a.room + .5)) * (1 - smooth(span(t, a.tell, a.tell + 1)));
    [[THL.Z + 1000, 7], [THL.Z + 760, 7], [THL.Z + 520, 6]].forEach(([Z, n], r) => stand(ctx, c, THL.X, Z, () => {
      for (let k = 0; k < n; k++) {
        const x = (k - (n - 1) / 2) * 300 + (r % 2) * 60, isYou = youHere && r === 1 && k === 2;
        const o = { dir: 1, view: 'back', light: 1, rim: mixHex(P.blue0, P.halo0, .35), armR: isYou ? [lerp(.2, 2.85, raise), lerp(.1, 2.95, raise)] : undefined };
        if (isYou) E.du(ctx, x, 60, 250, o); else E.person(ctx, x, 60, 240 + ((k * 7 + r) % 3) * 12, o);
        ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.beginPath(); ctx.roundRect(x - 95, -105, 190, 120, 14); ctx.fill();
        ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 4; ctx.stroke();
      }
    }));
    ctx.restore();
  };
  add(back, THL.X, () => {
    // the hall outside the back window is drawn by dcField (it stands behind); the room itself only when it can be seen
    const p = wp(c, THL.X, BOARD.GY - 400, THL.Z); if (!inside && (!p || p[2] < .05)) return;
    drawRoom();
  });
  if (!inside) add(THL.Z, THL.X, () => stand(ctx, c, THL.X, THL.Z, () => B.townHallFacade(ctx, t, { mull: smooth(span(THL.Z - c.z, 120, 420)), lit: roomLit, door: .5 + .4 * bump(t, a.place + 2.6, 1.2) + .4 * bump(t, a.tell + 3.6, 1.2) })));
}
function fork(ctx, c, t, a) {
  const t0 = a.upFront - .5; if (t < t0 || t > a.cap) return;
  const door = wp(c, DC.X, BOARD.GY - 140, DC.Z), node = wp(c, DC.X + 300, BOARD.GY - 2300, DC.Z - 200); if (!door || !node) return;
  const back = sineIO(span(t, a.cap - 2.2, a.cap - .9));                     // the light sinks back into the field before we travel on
  const s = smooth(span(t, t0, a.upFront + .6));
  F.trailSpan(ctx, [door.slice(0, 2), [lerp(door[0], node[0], .3), lerp(door[1], node[1], .7)], node.slice(0, 2)], back, s, { w: 6, spark: s < 1 });
  if (s >= 1 && back < 1) halo(ctx, node[0], node[1], 70, .6 * (1 - back), P.halo0, P.core1);
  // the few: a thin branch down to three raised hands
  const fu = smooth(span(t, a.few - .2, a.few + .8));
  if (fu > 0) FEW.forEach(([X, Z]) => { const h = wp(c, X, BOARD.GY - 330, Z); if (!h) return; F.trailSpan(ctx, [node.slice(0, 2), [lerp(node[0], h[0], .6), node[1] - 30], h.slice(0, 2)], back, fu, { w: 1.6, spark: fu < 1 }); });
  // everyone: a wide branch that fans out to every house round the field (their windows light when it arrives)
  const eu = smooth(span(t, a.everyone2 - .25, a.everyone2 + 1.3));
  if (eu > 0) TOWN.forEach((hs, i) => { const h = wp(c, hs.X, BOARD.GY - hs.h * 1.1, hs.Z); if (!h || h[0] < -100 || h[0] > W + 100) return; const mid = [lerp(node[0], h[0], .4), Math.min(node[1], h[1]) - 60]; F.trailSpan(ctx, [node.slice(0, 2), mid, h.slice(0, 2)], back, clamp(eu * 1.15 - (i % 5) * .03), { w: 2.6, a: .85, spark: eu < 1 }); });
}
const flowLit = (t, a, hs) => smooth(span(t, a.everyone2 + .6, a.everyone2 + 1.6)) * (1 - smooth(span(t, a.cap + 2, a.cap + 4)));
// ===================================================================================================================== c11 pieces
function shelfField(ctx, t, a) {
  const g = .45 + .55 * smooth(span(t, a.valueStays - .2, a.valueStays + .8));
  B.shelf(ctx, t, { glow: g });
  const tags = [[-330, 300, 0], [60, 250, 1], [400, 210, 2]];
  for (const [x, w, i] of tags) {
    const t0 = a.onePrice - .25 + i * .6, m = span(t, t0, t0 + 1.1); if (m >= 1) continue;
    const lo = sineIO(span(t, a.cap - 1.6 + i * .3, a.cap + .6 + i * .3)); if (lo <= 0) continue;   // they lower out of the dark as we arrive
    F.tag(ctx, t, x, lerp(-4200, -640 - 260 - w * 1.32 - i * 60, lo), w, { melt: m, emit: (ts) => (ts > t0 ? .7 : 0), swing: .01 * Math.sin(t * 1.2 + i), thread: 3000, seed: 60 + i, glow: .85 });
  }
}
function rulesBeside(add, ctx, c, t, a) {
  const uI = span(t, a.sameBoard - .2, a.sameBoard + .8), uII = span(t, a.twoSets + .1, a.twoSets + 1.1), down = span(t, a.best + .3, a.best + 1.5);
  if (uI <= 0 || down >= 1) return;
  for (const [X, u, n] of [[-6600, uI, 'I'], [6600, uII, 'II']]) {
    if (u <= 0) continue;
    add(9600, X, () => stand(ctx, c, X, 9600, () => { ctx.save(); ctx.scale(1, Math.max(.001, expoOut(u) * Math.cos(Math.PI / 2 * expoIn(down)))); F.ruleCard(ctx, t, 0, -6200 * .62 / 2 - 150, 6200, { n, sub: n === 'II' ? 'everybody wins' : 'single player', glow: n === 'II' ? 1 : .5 }); ctx.restore(); }));
  }
}
function yourLine(ctx, c, t, a) {
  const u = sineIO(span(t, a.survive - 1.4, a.design + .05)); if (u <= 0) return;
  const pts = [[YOU3.X + 70, YOU3.Z - 10], [YOU3.X + 500, YOU3.Z + 60], [-2500, 2760], [-1900, LOOP.cz - LOOP.half]];
  const sm = E.catmull(pts, 10);
  const join = bump(t, a.design - .05, 1.4);
  B.groundTrail(ctx, c, sm, 0, u, { w: 3.2 + 2 * join, spark: u < 1 });
}
function you(add, ctx, c, t, a) {
  // c10: you walk through the shore door (shoreDoor) and sit in the town hall (townHall). c11: you stand near the town hall,
  // draw your line, walk in, come out under your tag, take one step.
  if (t < a.cap - .5) return;
  const walkIn = span(t, a.place - .9, a.place + 1.6), inside = t > a.place + 1.6 && t < a.tell + 3.6, outW = span(t, a.tell + 3.6, a.tell + 5.6);
  const door = { X: THL.X + B.TH.door[0] + B.TH.door[2] / 2, Z: THL.Z - 30 };
  const after = { X: THL.X + 520, Z: THL.Z - 520 };
  let X = YOU3.X, Z = YOU3.Z, dir = 1, walk, view, armR, look = .15;
  const draw = smooth(span(t, a.survive - 1.8, a.survive - 1.2)) * (1 - smooth(span(t, a.design + .4, a.design + 1.2)));
  armR = [lerp(.15, 1.15, draw), lerp(.1, .85, draw)];
  if (walkIn > 0 && walkIn < 1) { const e = sineIO(walkIn); X = lerp(YOU3.X, door.X, e); Z = lerp(YOU3.Z, door.Z, e); dir = -1; walk = t * 5.6; armR = undefined; }
  if (inside) return;
  if (walkIn >= 1 && !inside) { const e = sineIO(outW); X = lerp(door.X, after.X, e); Z = lerp(door.Z, after.Z, e); dir = 1; walk = outW > 0 && outW < 1 ? t * 5.6 : undefined; armR = undefined;
    look = .2 + .75 * smooth(span(t, a.tell + 5.4, a.tell + 6.4)) * (1 - smooth(span(t, a.thinking + 1, a.ground)));
    const step = span(t, a.move - .05, a.move + .75); if (step > 0) { X += 160 * sineIO(step); walk = step < 1 ? (t - a.move) * 5.6 : undefined; }
  }
  const enter = walkIn > .85 && walkIn < 1 ? span(walkIn, .85, 1) : 0;
  add(Z, X, () => stand(ctx, c, X, Z, () => {
    ctx.save(); if (enter > 0) { ctx.globalAlpha = 1 - enter; }
    E.du(ctx, 0, 0, 230, { dir, walk, armR, look, light: 1 });
    ctx.restore();
    // your tag (11.05): it lowers over you once you are out, a ? on its face; it swings on "which price"; it evaporates on "free"
  }));
  yourTag(add, ctx, c, t, a, after);
}
function yourTag(add, ctx, c, t, a, after) {
  const lo = sineIO(span(t, a.tell - .8, a.which + .1)); if (lo <= 0) return;
  const m = span(t, a.thinking + .3, a.thinking + 2.2); if (m >= 1) return;
  const X = lerp(THL.X + 150, after.X, sineIO(span(t, a.tell + 3.8, a.tell + 6))), Z = THL.Z - 520;
  const sw = .14 * Math.sin((t - a.which) * 3.2) * Math.exp(-(t - a.which) * .7) * (t > a.which ? 1 : 0) + .012 * Math.sin(t * 1.3);
  add(Z - 1, X, () => stand(ctx, c, X, Z, () => F.tag(ctx, t, 0, lerp(-5200, -1180, lo), 340, { text: '?', size: .5, swing: sw, thread: 4000, melt: m, emit: (ts) => (ts > a.thinking + .3 ? .6 : 0), seed: 77 })));
}
// ===================================================================================================================== labels (screen space)
function labels(ctx, c, t, a) {
  const io = (t0, t1, d = .8) => F.rise(span(t, t0, t0 + d)) * (1 - expoIn(span(t, t1, t1 + .5)));
  // Lagos / Ohio over the two people
  for (const [P0, t0, txt, hh] of [[LAGOS, a.lagos, 'LAGOS', 230], [OHIO, a.ohio, 'OHIO', 330]]) {
    const u = io(t0 - .1, a.scarce - .3); if (u <= 0) continue;
    const p = wp(c, P0.X, BOARD.GY - hh - 90, P0.Z); if (p) F.maskLine(ctx, [[txt, 0]], p[0], p[1], 46, u, { serif: false, weight: 600, align: 'center', col: P.cream });
  }
  B.label(ctx, 110, 150, 'BADEN-WÜRTTEMBERG', 'TAX ON LAND VALUE · SINCE 2025', io(a.bw - .1, a.court - .45), { s1: 54, s2: 32 });
  B.label(ctx, 110, 150, 'FEDERAL FISCAL COURT (BFH)', null, io(a.court - .1, a.people + .5), { s1: 46 });
  const sp = wp(c, 0, BOARD.GY + 400, ZS);
  if (sp && t > a.upheld - .3 && t < a.people + 2) B.stampSoft(ctx, t, 'UPHELD 2026', sp[0] - 120, sp[1], { t0: a.upheld + .1, size: 46, out: a.people + .9 });
  B.label(ctx, 110, 150, 'VIENNA · SINCE 2019', null, io(a.vienna - .05, a.argues + .4), { s1: 54 });
  // ⅔ AFFORDABLE over the 8 warm bays (a bracket)
  const bu = io(a.twoThirds + .3, a.argues + .4);
  if (bu > 0) {
    const { w, h } = houseDims(t, a), l = wp(c, -w / 2, BOARD.GY - h - 70, ZB), r = wp(c, -w / 2 + 8 * B.BX, BOARD.GY - h - 70, ZB);
    if (l && r) { F.rule(ctx, l[0], l[1], lerp(l[0], r[0], bu), l[1], 1, { w: 4, spark: bu < 1 });
      F.maskLine(ctx, [['⅔ AFFORDABLE', 0]], (l[0] + r[0]) / 2, l[1] - 22, 44, bu, { serif: false, weight: 600, align: 'center', col: P.cream }); }
  }
  const cu = io(a.capped - .1, a.argues + .4), cp = wp(c, 0, BOARD.GY, ZS);
  if (cp) B.label(ctx, 1330, 110, 'LAND PRICE CAPPED', '€188 / m²', cu, { s1: 40, s2: 52 });
  B.label(ctx, 110, 150, 'MIDDELGRUNDEN', 'OFF COPENHAGEN · SINCE 2000', io(a.copen - .05, a.half - .3), { s1: 54, s2: 32 });
  const cool = wp(c, TURB[7].X, BOARD.GY - 1140, TURB[7].Z), warmP = wp(c, TURB[2].X, BOARD.GY - 1140, TURB[2].Z);
  if (cool) F.maskLine(ctx, [['CITY UTILITY', 0]], cool[0], cool[1], 40, io(a.utility - .2, a.alwaysFree - .2), { serif: false, weight: 600, align: 'center', col: mixHex(P.cream, COOL.mid, .5) });
  if (warmP) B.label(ctx, warmP[0], warmP[1] - 50, '≈ 8,500 PEOPLE', 'CO-OP', io(a.k8 + .2, a.alwaysFree - .2), { s1: 44, s2: 34, align: 'center' });
  B.label(ctx, 110, 930, 'LOUDOUN COUNTY, VIRGINIA', null, io(a.virginia - .05, a.zoning - .6), { s1: 48 });
  // 10.05 the people points over the water
  for (const [X, Z, al] of streamPts(t, a)) { const p = gp(c, X, Z); if (!p) continue; const r = Math.max(2.5, 30 * p[2]); halo(ctx, p[0], p[1] - r, r * 4, .5 * al, P.halo0, P.core1); ctx.fillStyle = rgba(P.core1, al); ctx.beginPath(); ctx.arc(p[0], p[1] - r, r * .5, 0, 6.29); ctx.fill(); }
  // 10.06 the wind: long streaks of light through the sky (it was always free)
  const wu = span(t, a.alwaysFree - 1.2, a.alwaysFree + 1.6);
  if (wu > 0 && wu < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 7; k++) { const y = 140 + k * 52 + 20 * Math.sin(k * 2.3), x1 = lerp(W + 300, -900, clamp(wu * 1.25 - k * .04)), len = 520 + 120 * (k % 3);
      ctx.strokeStyle = E.lin(ctx, x1, 0, x1 + len, 0, [[0, rgba(P.halo1, .5)], [1, rgba(P.halo1, 0)]]); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x1, y); ctx.quadraticCurveTo(x1 + len / 2, y - 18, x1 + len, y + 6); ctx.stroke(); }
    ctx.restore(); }
}
