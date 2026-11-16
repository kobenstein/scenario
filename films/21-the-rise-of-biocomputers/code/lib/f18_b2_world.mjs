// Film 18 · B2 · ONE plan sequence for c05 → c08 (230.62 → 413.64 s): the value stays · the doors · what scarcity pays · the first
// picture again · the rise to the board on the table · the two sets of rules. scenes/sc05–sc08.mjs each return ONE entry that draws
// this same world (so the inner seams c05|c06, c06|c07, c07|c08 are identical frames by construction).
// Plan: docs/shots.md 5.01–8.07 · rules: docs/MOTION.md · kit: lib/f18_kit.mjs · props: lib/f18_b2_props.mjs.
//
// | shots     | anchors (words)                                  | picture                                                             | camera                         |
// |-----------|--------------------------------------------------|---------------------------------------------------------------------|--------------------------------|
// | seam      | And the value                                    | plateHook (the empty hook over the column of value)                 | –                              |
// | 5.01–5.02 | search engines · nothing · seventeen thousand    | the column stands on your field, you at its foot; the search bar     | pull back out of the plate     |
// |           |                                                  | grows across it; the column rises and nudges the empty ring aside    |                                |
// | 5.03      | vanished · value stayed                          | the empty ring glints · the column breathes warm                     | breathing hold                 |
// | 5.04–5.05 | door · Music found one · retreats · subscribe     | the column pours onto the road, the light runs to the record's door; | follow the light (truck right) |
// |           |                                                  | the coin rolls through, the door swings half shut; you look back     |                                |
// | 5.06–5.07★| Watch · ground · power · chips                    | the light runs round the corner; three tall doors rise, take tags   | rise to the far edge           |
// | 5.08–5.09 | Sam Altman · electricity · bill · power chips ground | quote card over the doors → the bill; each line lights its door  | slow pull back                 |
// | 6.01–6.03 | Nvidia · ninety-six billion · three quarters · scarcity pays | the chip door close: NVIDIA $96.2B; a coin rolls out (¾)  | push in to the chip door       |
// | 6.04      | Loudoun · biggest cluster · two to six million   | the ground door's field fills with data-centre roofs; one acre      | travel left, rise              |
// | 6.05–6.06★| oldest door · every month · eighty percent · dirt | your house, its tag swings; the earth under it is cut open, glows  | travel to the house, sink      |
// | 7.01–7.02 | first picture · record margins · record low · follow the price | the earth's light rises as the left coin (firstPicture); the coins sink into the loop, the coin follows the price | rise |
// | 7.03★     | nearly free · very few people                    | the board almost without tags, three tall doors, a keeper at each   | pull back wide                 |
// | 7.04      | hungry · at the door · Every month · ground power chips | you walk; coins leave your hand for the doors; the moon turns  | down behind you                |
// | 7.05      | the machine · the ground the machine stands on   | the data centre; the ground under it glows                          | travel, sink to the ground     |
// | 8.01★     | law of nature · set of rules                     | the rise: the board lies on a table under a lamp, its fields light  | rise + pull back               |
// | 8.02–8.04 | Lizzie Magie · Monopoly · Landlord's · Henry George | the board folds up into the patent drawing; words; one field: value flows in from everyone and back out | 2D |
// | 8.05–8.07 | two sets · single player · everybody wins · forgotten · abundant | the two rule cards; II slides under the board; II comes back and turns to us | push in → plateRules |
import * as E from './f10_editorial.mjs';
import * as F from './f18_kit.mjs';
import * as B from './f18_b2_props.mjs';
import { plateHook, plateRules, RULES_PLATE, HOOK_PLATE, SEAM_HALF } from './f18_seams.mjs';
import { Path2D } from '@napi-rs/canvas';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, cam3, F0, halo, prng, drift } = E;
const { BOARD, LOOP, gp, wp, stand, loopPt, loopU, loopDir, COOL, bump, rise, maskLine } = F;
const GY = BOARD.GY;

// ===================================================================================================================== the set (world units)
const Z0 = 3000;
const COL = { X: -250, Z: 3000, H0: 2400, H1: 3100 };              // the column of value on your field
const PF = 6000, PS = 1.25;                                         // the plate camera: focal length, plate px per world unit at the column
const HOOKZ = COL.Z - 20;                                           // the empty hook hangs just in front of the column
const YOU = { X: -560, h: 200 };
const REC = { X: 1300, Z: 3350, h: 560, rX: 1820 };                 // the record's field: its door (3.10) and the record of light
const DOOR_H = 2100, DTAG = 640;
const DOORS = [
  { id: 'ground', X: -3400, Z: 8700, label: 'THE GROUND' },
  { id: 'power', X: 300, Z: 9300, label: 'THE POWER' },
  { id: 'chips', X: 3600, Z: 8700, label: 'THE CHIPS' },
];
const HOUSE = { X: -1450, Z: 3350, w: 600, h: 420 };
const YOU2 = { X0: -700, X1: 250, Z: 6850 };                         // 7.04: you on the far road, in front of the doors
const DCS = { X: -6250, Z: 6200, w: 4300, d: 1500 };              // 7.05: the cut through the ground in front of the data centre
const DCZ = { X0: -8200, X1: -4500, Z0: 6300, Z1: 9800 };          // the data-centre field beside the ground door (Loudoun)
const DCB = (() => { const r = prng(2606), out = []; let i = 0;
  for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) {
    const X0 = DCZ.X0 + col * 1300 + r() * 60, Z0 = DCZ.Z0 + row * 950 + r() * 60;
    if (row === 0 && col === 1) { out.acre = { X0, X1: X0 + 1060, Z0, Z1: Z0 + 640 }; continue; }   // the empty acre (6.04)
    out.push({ X0, X1: X0 + 1000 + r() * 100, Z0, Z1: Z0 + 640, h: 480 + r() * 160, seed: ++i, d: Math.hypot(X0 + 540 - DOORS[0].X, Z0 - DOORS[0].Z) });
  }
  return out; })();
const MAXD = Math.max(...DCB.map((b) => b.d));
// the town of c01 (same seed), minus the houses that would stand in a door's way
const TOWN = (() => { const r = E.prng(1808), out = [];
  for (let i = 0; i < 14; i++) { const side = i % 3, w = 300 + r() * 260, h = 240 + r() * 200;
    const X = side === 0 ? -LOOP.half - 500 - r() * 900 : side === 1 ? LOOP.half + 500 + r() * 900 : -2200 + r() * 4400;
    const Z = side === 2 ? LOOP.cz + LOOP.half + 500 + r() * 700 : LOOP.cz - LOOP.half + 900 + r() * (2 * LOOP.half - 600);
    out.push({ X, Z, w, h, n: 1 + Math.floor(r() * 2.5), seed: 10 + i }); }
  return out.filter((hs) => DOORS.every((d) => Math.hypot(hs.X - d.X, hs.Z - d.Z) > 1500) && Math.hypot(hs.X - HOUSE.X, hs.Z - HOUSE.Z) > 700 && !(hs.X < -2400 && hs.Z > 4300)); })();

// camera that shows world point (X, Y from the ground, up = −, Z) at screen (sx, sy) with s px per world unit (sc01's camFor)
const camFor = (X, Y, Z, s, sx = W / 2, sy = H / 2, f = F0) => { const dz = f / s; return { ...cam3({ x: X - (sx - W / 2) / s, y: Y + GY - (sy - H / 2) / s, z: Z - dz, f }), Zs: Z }; };
// camera keys with a subject depth each (Zs): z is interpolated in log-distance to the farther subject of the pair (constant-speed
// feel of a flight); everything else sine-S (or the key's ease)
function camAt2(t, K) {
  if (t <= K[0][0]) return { ...K[0][1] };
  if (t >= K[K.length - 1][0]) return { ...K[K.length - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const a = K[i][1], b = K[i + 1][1], e = { s: sineIO, q: quartIO, i: expoIn, o: expoOut }[K[i + 1][2] || 's'];
  const u = e((t - K[i][0]) / (K[i + 1][0] - K[i][0])), out = cam3();
  for (const k of ['x', 'y', 'f']) out[k] = lerp(a[k], b[k], u);
  const ref = Math.max(a.Zs ?? 0, b.Zs ?? 0, a.z + 300, b.z + 300), da = ref - a.z, db = ref - b.z;
  out.z = ref - Math.exp(lerp(Math.log(da), Math.log(db), u));
  return out;
}
// screen point of a world point with Y from the ground
const sp = (c, X, Y, Z) => wp(c, X, GY + Y, Z);
// fill a polygon lying on the ground (XZ points), clipped to the front of the camera
function groundPoly(ctx, c, pts, fill, o = {}) {
  const zMin = c.z + 60, out = [];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], ia = a[1] >= zMin, ib = b[1] >= zMin; if (ia) out.push(a); if (ia !== ib) { const f = (zMin - a[1]) / (b[1] - a[1]); out.push([lerp(a[0], b[0], f), zMin]); } }
  const q = out.map((p) => gp(c, p[0], p[1])).filter(Boolean); if (q.length < 3) return null;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (o.op) ctx.globalCompositeOperation = o.op;
  ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  if (fill) { ctx.fillStyle = typeof fill === 'function' ? fill(q) : fill; ctx.fill(); }
  if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw ?? 2; if (o.dash) ctx.setLineDash(o.dash); ctx.stroke(); }
  ctx.restore(); return q;
}
const ellipsePts = (cx, cz, rx, rz, n = 40, wob = 0, seed = 1) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2, k = 1 + wob * Math.sin(a * 3 + seed) * Math.sin(a * 5 + seed * 2); return [cx + Math.cos(a) * rx * k, cz + Math.sin(a) * rz * k]; });
const label = (ctx, s, x, y, size, u, o = {}) => { if (u > 0) maskLine(ctx, [[s, o.warm ?? 0]], x, y, size, u, { serif: o.serif ?? false, align: o.align ?? 'center', col: o.col ?? P.cream, glow: o.glow ?? false, weight: 600 }); };
const inOut = (t, a0, a1, b0, b1) => rise(span(t, a0, a1)) * (1 - expoIn(span(t, b0, b1)));   // text: rises on a0→a1, sinks b0→b1
// c08's big words: the sink accelerates evenly (the line drops k = 1 − s², no last-frame vanish: maskLine maps u through expoOut)
const inOutW = (t, a0, a1, b0, b1) => { const q = span(t, b0, b1); return rise(span(t, a0, a1)) * (q <= 0 ? 1 : clamp(-Math.log2(Math.max(1e-3, q * q)) / 10)); };

// ===================================================================================================================== build
const CACHE = new WeakMap();
export function b2World(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  E.prepareEditorial();
  const G = (p, after = 0, n = 0) => T.G(p, n, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  // c05
  a.T0 = G('And the value'); a.value = G('value', a.T0); a.study = G('In a study', a.T0); a.search = G('search engines', a.T0); a.nothing = G('nothing', a.search);
  a.seventeen = G('seventeen thousand', a.T0); a.vanished = G('vanished', a.seventeen); a.stayed = G('value stayed', a.seventeen);
  a.looking = G('Value with no price', a.T0); a.door1 = G('door', a.looking); a.music = G('Music found one', a.T0); a.cap = G("Capitalism doesn't vanish", a.T0);
  a.retreats = G('retreats', a.T0); a.behind = G('behind the doors', a.T0); a.follow = G('If you want to follow', a.T0); a.subscribe = G('subscribe', a.follow);
  a.watch = G('Watch where it goes', a.T0); a.watchE = GE('Watch where it goes', a.T0); a.doors = G('The doors are', a.T0); a.copied = G("can't be copied", a.T0);
  a.ground = G('The ground', a.copied); a.power = G('The power', a.copied); a.chips = G('The chips', a.copied);
  a.altman = G('Sam Altman', a.T0); a.cost = G('cost of intelligence', a.altman); a.elec = G('electricity', a.cost); a.elecE = GE('electricity', a.cost);
  a.read = G('Read it from the other side', a.altman); a.bill = G('bill', a.read); a.bPower = G('the power', a.bill); a.bChips = G('The chips', a.bill);
  a.bGround = G('The ground under', a.bill); a.bGroundE = GE('data center', a.bGround);
  // c06
  a.nvidia = G('Nvidia', a.bill); a.ninety = G('ninety-six billion', a.nvidia); a.quarter = G('single quarter', a.nvidia); a.summerE = GE('this summer', a.nvidia);
  a.threeQ = G('three quarters', a.nvidia); a.gross = G('gross profit', a.nvidia); a.villainy = G("That isn't villainy", a.nvidia); a.scarcity = G('scarcity pays', a.nvidia);
  a.loudoun = G('Loudoun County', a.nvidia); a.cluster = G('biggest cluster', a.loudoun); a.landFor = G('land for one', a.loudoun); a.million = G('two to six million', a.loudoun); a.acreE = GE('an acre', a.million);
  a.oldest = G('The oldest door', a.nvidia); a.month = G('every month', a.oldest); a.fourteen = G('fourteen', a.oldest); a.eighty = G('eighty percent', a.oldest);
  a.underneath = G('land underneath', a.oldest); a.bricks = G('Not the bricks', a.oldest); a.dirt = G('The dirt', a.oldest); a.dirtE = GE('The dirt', a.oldest);
  // c07
  a.c07 = G('Now look at the first picture'); a.firstPic = G('first picture', a.c07); a.margins = G('record margins', a.c07); a.low = G('record low', a.c07);
  a.direction = G('direction', a.low); a.markets = G('Markets are doing', a.c07); a.followP = G('follow the price', a.c07); a.followPE = GE('follow the price', a.c07);
  a.crash = G('Not a crash', a.c07); a.nearly = G('nearly free', a.c07); a.fewThings = G('the few things', a.nearly); a.fewPeople = G('very few people', a.c07);
  a.inWorld = G('In that world', a.c07); a.hungry = G("don't go hungry", a.c07); a.atDoor = G('at the door', a.hungry); a.every = G('Every month', a.hungry);
  a.g1 = G('ground', a.every); a.p1 = G('power', a.g1); a.c1 = G('chips', a.p1);
  a.story = G("I don't think the real story", a.c07); a.machine = G('the machine', a.c1); a.standsOn = G('the ground the machine stands', a.c1); a.standsE = GE('stands on', a.standsOn);
  // c08
  a.c08 = G("That isn't a law of nature"); a.law = G('law of nature', a.c08); a.rules = G('set of rules', a.c08); a.rulesE = GE('set of rules', a.c08);
  a.nineteen = G('In nineteen oh four', a.c08); a.magie = G('Lizzie Magie', a.c08); a.boardGame = G('board game', a.c08); a.teach = G('teach exactly', a.c08);
  a.youKnow = G('You know it as', a.c08); a.monopoly = G('Monopoly', a.c08); a.landlord = G("The Landlord's Game", a.c08); a.landlordE = GE("The Landlord's Game", a.c08);
  a.built = G('It was built on', a.c08); a.george = G('Henry George', a.c08); a.land = G('land is valuable', a.george); a.everyone = G('everyone around it', a.c08); a.belongs = G('belongs to everyone', a.c08); a.belongsE = GE('belongs to everyone', a.c08);
  a.twoSets = G('two sets of rules', a.c08); a.single = G('single player', a.c08); a.owning = G('owning everything', a.c08); a.wins = G('everybody wins', a.c08);
  a.kept = G('kept the first', a.c08); a.forgotten = G('forgotten', a.c08); a.whatLook = G('What would it look like', a.c08); a.abundant = G('abundant', a.whatLook);
  a.shared = G('shared, fairly', a.whatLook); a.T1 = G('The second set of rules', a.c08);
  const w = { a, draw: scene(a) };
  CACHE.set(T, w); return w;
}

// ===================================================================================================================== the scene
function scene(a) {
  const T0 = a.T0, tIn = T0 + SEAM_HALF, T1 = a.T1, tOut = T1 - SEAM_HALF;
  let ctx0 = null;
  const Cp = camFor(COL.X, -COL.H0, COL.Z, PS, HOOK_PLATE.x, HOOK_PLATE.colTop, PF);      // the plate camera (the column's top at the plate)
  // ---------------------------------------------------------------------------------------------------------- times of things
  const tm = {
    pull: [tIn, a.study + 3.4],
    bar: [a.search - .15, a.search + 1.1], barOut: [a.looking - .8, a.looking + .2],
    rise: [a.seventeen - .1, a.seventeen + 1.3],
    pour: [a.looking + .15, a.music - .2],
    coin: [a.cap - .3, a.retreats + .7],
    shut: [a.behind - .1, a.behind + 1.3],
    walk: [a.looking + 1.4, a.subscribe - .5],
    run2: [a.watch - .2, a.doors + .4],          // the light runs from the record's door round the corner to the far edge
    dRise: [a.ground, a.power, a.chips].map((x) => [x - .5, x + .75]),
    quote: [a.altman + .1, a.read + .35],
    billU: [a.read + .5, a.bill + .1], billUp: [a.bGroundE + .25, a.nvidia + .2],
  };
  // the coin's road path (5.04): from the column's foot along the near edge to the record's door, then into the doorway
  const uCol = loopU(COL.X), uRec = loopU(REC.X);
  // ---------------------------------------------------------------------------------------------------------- the camera
  const doorOf = (id) => DOORS.find((d) => d.id === id);
  const dC = doorOf('chips'), dG = doorOf('ground');
  const K = [
    [tIn, Cp],
    [tm.pull[1], camFor(COL.X, -1220, COL.Z, .29, 1110, 500)],                                   // pull back: the column on your field
    [a.seventeen - .25, camFor(COL.X, -1260, COL.Z, .305, 1105, 500)],                          // breathing push while the bar grows
    [a.seventeen + 1.8, camFor(COL.X, -1560, COL.Z, .262, 1060, 476)],                          // make room for the risen column
    [a.looking - .1, camFor(COL.X, -1580, COL.Z, .27, 1050, 476)],                              // breathing hold (vanished · stayed)
    [a.music + .2, camFor(560, -420, 3150, .43, 960, 600)],                                     // follow the light down onto the road
    [a.retreats + .5, camFor(1020, -380, 3300, .5, 960, 610)],                                  // to the record's door
    [a.subscribe + .3, camFor(1180, -300, 3350, .6, 960, 640)],                                 // push to you at the door
    [a.watch - .1, camFor(1200, -300, 3350, .615, 960, 640)],
    [a.doors + .3, cam3({ x: 500, y: -2150, z: -900, f: 850, Zs: 5500 })],                     // rise with the light round the corner: the loop
    [a.chips + 1.3, cam3({ x: 200, y: -1900, z: 400, f: 850, Zs: 8800 })],                       // ★ slow push to the far edge as the doors rise
    [a.cost - .2, camFor(100, 0, 8800, .108, 960, 860, 1300)],                                   // room for the quote above the doors
    [a.bill + .3, camFor(100, 0, 8800, .122, 960, 862, 1300)],
    [a.bGroundE - 1.2, camFor(250, 0, 8800, .128, 960, 860, 1300)],
    [a.nvidia + 1.6, camFor(dC.X, 0, dC.Z, .29, 640, 880)],                                      // c06: push to the chip door
    [a.villainy - .55, camFor(dC.X + 40, 0, dC.Z, .3, 640, 880)],
    [(a.villainy + a.loudoun) / 2 + .6, camFor(-1400, 0, 8400, .14, 900, 820, 1300)],            // travel left on an arc: back a little, across
    [a.loudoun + 1.2, camFor(-6000, 0, 7300, .29, 820, 790, 1300)],                               // ... and down into the ground door's field
    [a.million + .4, camFor(-6000, 0, 7300, .32, 820, 790, 1300)],
    [a.acreE + .6, camFor(-5960, 0, 7300, .32, 820, 790, 1300)],
    [a.month - .4, camFor(HOUSE.X + 150, -330, HOUSE.Z, .52, 960, 560)],                         // your house (along the road, left)
    [a.fourteen + .3, camFor(HOUSE.X, 0, HOUSE.Z, .5, 960, 600)],                               // ★ sink: the cut face of the earth
    [a.dirtE + .3, camFor(HOUSE.X, 0, HOUSE.Z, .515, 960, 601)],
    [a.margins + .3, cam3({ x: HOUSE.X + 700, y: -6000, z: -300, f: 850, Zs: 5500 })],            // c07: rise straight up; the coins above
    [a.direction - .9, cam3({ x: HOUSE.X + 760, y: -6100, z: -260, f: 850, Zs: 5500 })],
    [a.followP + .3, cam3({ x: 0, y: -2100, z: -1400, f: 850, Zs: 5500 })],                      // the loop from high (as c01's ★)
    [a.followP + 2.7, cam3({ x: 80, y: -2040, z: -1250, f: 850, Zs: 5500 })],                     // (a breathing hold while the coin runs)
    [a.nearly + .4, camFor(300, 0, 8800, .19, 960, 800, 1000)],                                  // ★ down the road to the doors: the world of the doors
    [a.inWorld - .1, camFor(300, 0, 8800, .184, 960, 804, 1000)],
    [a.atDoor - .2, camFor(220, 0, YOU2.Z, .55, 960, 820, 700)],                                 // down to you on the road before the doors
    [a.c1 + .9, camFor(300, 0, YOU2.Z, .565, 960, 822, 700)],
    [a.machine + .3, camFor(-5600, -300, DCS.Z, .3, 960, 600, 1000)],                             // travel to the data centre
    [a.standsOn + .9, camFor(-6200, 0, DCS.Z, .42, 960, 520, 1300)],                              // sink to the ground under it: the cut glows
    [a.c08 + .1, camFor(-6200, 0, DCS.Z, .43, 960, 518, 1300)],
    [a.rules + .2, cam3({ x: -800, y: -5000, z: -11000, f: 850, Zs: 7000 })],                    // ★ the rise: the board on the table
    [a.magie, cam3({ x: -600, y: -5100, z: -11400, f: 850, Zs: 7000 })],
  ];
  const tFold = [a.nineteen - .2, a.magie + .9];                              // the board folds up into the patent drawing (2D from here)
  const camT = (t) => {
    const amt = smooth(span(t, tIn, tIn + 1.5));
    return E.camDrift(camAt2(t, K), t, .9 * amt);
  };
  // the fold captures the 3D picture at its start (one fixed camera) and morphs it into the top-down drawing
  const CF = camAt2(tFold[0], K);

  const drawFn = (ctx, t) => {
    if (t < tFold[0]) world(ctx, t, camT(t));
    else drawing(ctx, t);
    if (t < tIn) plateHook(ctx, t);
    if (t >= tOut) plateRules(ctx, t);
  };

  // ================================================================================================================= the 3D world
  function world(ctx, t, c) {
    ctx0 = ctx;
    // background: the plate's night over the kit sky at the start (it gives way as the board rises in), the air later, the room at the end
    const pm = 1 - smooth(span(t, tIn + .4, tm.pull[1] - .2));
    const air = .25 + .75 * smooth(span(t, a.crash - 1, a.nearly + .5)) - .3 * smooth(span(t, a.atDoor, a.atDoor + 2));
    F.sky(ctx, c, t, { air });
    const room = smooth(span(t, a.law - .4, a.rules + .3));                    // 8.01: the sky becomes the dark room (the plate's night)
    if (pm > 0) B.plateNight(ctx, t, pm);
    if (room > 0) B.plateNight(ctx, t, room);
    moonAt(ctx, t, c);
    if (room > 0) lampPool(ctx, t, c, room);
    // the road light: base glow + the flows of this sequence
    const lit = roadLit(t);
    F.board(ctx, c, t, { road: .34 + .12 * smooth(span(t, a.rules - .3, a.rules + .5)), lit, ticks: .35 + .65 * smooth(span(t, a.rules - .2, a.rules + .7)), zero: 1 - room * .7, edge: room });
    if (room > 0) boardSlab(ctx, c, room);
    lightHeads(ctx, c, t);
    groundThings(ctx, t, c);
    // standing things, far → near
    const L = [];
    for (const hs of TOWN) L.push([hs.Z, () => packStand(ctx, c, t, hs.X, hs.Z, hs.h * 1.6, () => F.house(ctx, t, hs.w, hs.h, { win: hs.n, lit: .45 + .25 * smooth(span(t, a.inWorld, a.hungry)), seed: hs.seed }))]);
    for (const d of DOORS) L.push([d.Z, () => doorThing(ctx, t, c, d)]);
    L.push([REC.Z, () => packStand(ctx, c, t, REC.X, REC.Z, REC.h * 1.3, () => recordDoor(ctx, t))]);
    L.push([REC.Z + 10, () => packStand(ctx, c, t, REC.rX, REC.Z + 10, 520, () => B.record(ctx, t, 230))]);
    L.push([HOUSE.Z, () => packStand(ctx, c, t, HOUSE.X, HOUSE.Z, HOUSE.h * 1.7, () => yourHouse(ctx, t))]);
    L.push([HOUSE.Z - 30, () => stand(ctx, c, HOUSE.X, HOUSE.Z - 30, () => houseSection(ctx, t))]);
    L.push([DCS.Z, () => stand(ctx, c, DCS.X, DCS.Z, () => dcSection(ctx, t))]);
    L.push([COL.Z, () => column(ctx, t, c)]);
    L.push([HOOKZ, () => hook(ctx, t, c)]);
    for (const it of coins(t)) L.push([it.Z, () => stand(ctx, c, it.X, it.Z, () => { F.coin(ctx, t, 0, -it.r - (it.y ?? 0), it.r, { spin: it.spin ?? 0, a: it.a ?? 1, pie: it.pie }); halo(ctx, 0, -it.r - (it.y ?? 0), it.r * 3.5, .45 * (it.a ?? 1), P.halo0, P.core1); })]);
    for (const p of people(t)) L.push([p.Z, () => stand(ctx, c, p.X, p.Z, () => p.draw())]);
    L.sort((p, q) => q[0] - p[0]);
    for (const [, fn] of L) fn();
    // screen-space: labels and explainers grown from board things
    doorLabels(ctx, t, c);
    c05Text(ctx, t, c);
    c06Text(ctx, t, c);
    c07Over(ctx, t, c);
  }

  // ---------------------------------------------------------------------------------------------------------- road light
  function roadLit(t) {
    const lit = [];
    // 5.04: the column pours onto the road and runs right to the record's door (water: fast start, long settle)
    const pq = span(t, tm.pour[0], tm.pour[1] + 1.5);
    heads.length = 0;
    if (pq > 0) { const fr = lerp(uCol, uRec + .01, expoOut(pq * 1.1)), back = lerp(uCol, uCol - .025, smooth(pq)); lit.push([back, fr, .75 * (1 - .55 * smooth(span(t, a.subscribe, a.watch + 3)))]); heads.push([fr, 1 - smooth(span(pq, .55, .8))]); }
    // 5.06: from the door round the corner, up the right edge, along the far edge (to the doors)
    const rq = span(t, tm.run2[0], tm.run2[1]);
    if (rq > 0) { const u0 = uRec, fr = lerp(u0, .62, sineIO(rq)); lit.push([u0, fr, .7 * (1 - .5 * smooth(span(t, a.chips + 1, a.altman + 2)))]); heads.push([fr, 1 - smooth(span(rq, .85, 1))]); }
    // 7.02: the coin follows the price toward the doors (a band of light runs ahead of it)
    const fq = span(t, a.direction - .4, a.followP + 1.6);
    if (fq > 0 && t < a.inWorld + 1) { const u = coin702U(t); lit.push([u - .04, u + .002, .7 * (1 - smooth(span(t, a.nearly, a.inWorld + 1)))]); }
    return lit;
  }
  const heads = [];
  function lightHeads(ctx, c, t) {
    for (const [u, al] of heads) { if (al <= 0) continue; const [x, z] = loopPt(u); stand(ctx, c, x, z, () => { halo(ctx, 0, -20, 420, .8 * al, P.halo0, P.core0); E.dust(ctx, 41, 60, -60, -60, 160, 50, t, .7 * al, P.core1); }); }
  }
  // 8.01: the pieces sink into the board before it folds into the drawing (a wave from the board's centre outward)
  const packK = (t, X, Z) => { const d = clamp(Math.hypot(X, Z - BOARD.cz) / 9000); return sineIO(span(t, a.law + .5 + .55 * d, a.law + 1.5 + .55 * d)); };
  function packStand(ctx, c, t, X, Z, h, fn) {
    const k = packK(t, X, Z); if (k >= 1) return;
    stand(ctx, c, X, Z, () => {
      if (k <= 0) return fn();
      ctx.save(); ctx.beginPath(); ctx.rect(-1e5, -1e5, 2e5, 1e5); ctx.clip(); ctx.translate(0, h * k); fn(); ctx.restore();
    });
  }
  // the coin of 7.02: starts on the near edge (where the two coins sank) and rolls clockwise toward the far edge's doors
  const U702 = [loopU(0), .56];
  const coin702U = (t) => lerp(U702[0], U702[1], quartIO(span(t, a.direction + .3, a.followP + 1.4)));

  // ---------------------------------------------------------------------------------------------------------- ground decals
  function groundThings(ctx, t, c) {
    // the bare earth round the ground door (5.07): rises with its door
    const dg = DOORS[0], eu = expoOut(span(t, tm.dRise[0][0], tm.dRise[0][1] + .3));
    const eu1 = eu * (1 - packK(t, dg.X, dg.Z));
    if (eu1 > 0) groundPoly(ctx, c, ellipsePts(dg.X - 300, dg.Z + 500, 1500 * eu1, 1100 * eu1, 48, .08, 3), (q) => { const y0 = Math.min(...q.map((p) => p[1])), y1 = Math.max(...q.map((p) => p[1])); return E.lin(ctx, 0, y0, 0, y1, [[0, mixHex(P.shade0, P.night1, .55)], [1, mixHex(P.shade0, P.night1, .7)]]); });
    // the warm ground under the data centre (7.05: the ground the machine stands on), the acre (6.04)
    const gw = smooth(span(t, a.standsOn - .2, a.standsOn + 1.2)) * (1 - smooth(span(t, a.rules, a.rules + 1.2)));
    if (gw > 0) groundPoly(ctx, c, ellipsePts((DCZ.X0 + DCZ.X1) / 2, (DCZ.Z0 + DCZ.Z1) / 2, 2700, 2400, 48, .06, 7), (q) => { const cx = q.reduce((s, p) => s + p[0], 0) / q.length, cy = q.reduce((s, p) => s + p[1], 0) / q.length; return E.rad(ctx, cx, cy, Math.max(...q.map((p) => Math.hypot(p[0] - cx, p[1] - cy))), [[0, rgba(P.core1, .55 * gw)], [.5, rgba(P.halo0, .35 * gw)], [1, rgba(P.halo1, 0)]]); }, { op: 'lighter' });
    const ac = DCB.acre, au = smooth(span(t, a.landFor - .2, a.landFor + .9)) * (1 - smooth(span(t, a.oldest - .5, a.oldest + .3)));
    if (au > 0) { const pts = [[ac.X0, ac.Z0], [ac.X1, ac.Z0], [ac.X1, ac.Z1], [ac.X0, ac.Z1]]; groundPoly(ctx, c, pts, rgba(P.halo0, .28 * au), { stroke: rgba(P.core1, .95 * au), lw: 4 }); }
    // the data-centre roofs: they spread over the field from the ground door on "biggest cluster" (6.04)
    const spread = span(t, a.loudoun + .5, a.cluster + 2.4);
    if (spread > 0) for (const b of DCB) { const u = span(spread, b.d / MAXD * .65, b.d / MAXD * .65 + .35); dcBlockSorted(ctx, c, t, b, u, packK(t, (b.X0 + b.X1) / 2, (b.Z0 + b.Z1) / 2)); }
    // 7.02: arrows of light on the road pointing the way the coin goes
    const ar = smooth(span(t, a.followP - .3, a.followP + .6)) * (1 - smooth(span(t, a.nearly, a.inWorld)));
    if (ar > 0) for (let k = 0; k < 14; k++) {
      const u = U702[0] + .02 + k * .025, [x, z] = loopPt(u), [dx, dz] = loopDir(u), sz = 150, on = ar * clamp(1.2 - Math.abs(((t * .9 - k * .12) % 1.4 + 1.4) % 1.4 - .3) * 2);
      const tip = gp(c, x + dx * sz, z + dz * sz), l = gp(c, x - dz * sz * .8, z + dx * sz * .8), r = gp(c, x + dz * sz * .8, z - dx * sz * .8);
      if (!tip || !l || !r) continue;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = rgba(P.core1, .35 + .55 * on); ctx.lineWidth = Math.max(1.5, 26 * tip[2]); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(tip[0], tip[1]); ctx.lineTo(r[0], r[1]); ctx.stroke(); ctx.restore();
    }
  }
  function dcBlockSorted(ctx, c, t, b, u, sink = 0) { B.dcBlock(ctx, c, t, b.X0, b.X1, b.Z0, b.Z1, b.h, u, { sink, seed: b.seed, lit: .5 * bump(t, a.machine - .3, 1.6) }); }

  // ---------------------------------------------------------------------------------------------------------- the column + the hook
  // plate px → world at depth Z (through the plate camera Cp): stand at the world point that Cp shows at the frame centre
  function plateSpace(ctx, c, Z, fn) {
    const s = PF / (Z - Cp.z);
    return stand(ctx, c, Cp.x, Z, () => { ctx.scale(1 / s, 1 / s); ctx.translate(-W / 2, -H / 2); fn(s); }, Cp.y);
  }
  const colHeight = (t) => {
    let h = lerp(COL.H0, COL.H1, expoOut(span(t, tm.rise[0], tm.rise[1])));
    h *= 1 - sineIO(span(t, tm.pour[0], tm.pour[1]));
    return h;
  };
  const colW = (t) => lerp(1, 2.6, sineIO(span(t, tIn + .2, tm.pull[1] + .4)));
  const hookK = (t) => lerp(1, 3.2, sineIO(span(t, tIn + .2, tm.pull[1] + .4)));
  function column(ctx, t, c) {
    const hc = colHeight(t); if (hc < 4) return;
    const k = smooth(span(t, tIn, tm.pull[1]));                                // after the plate: the column's foot glow moves to its foot
    const groundV = HOOK_PLATE.colTop + COL.H0 * PS, top = HOOK_PLATE.colTop - (hc - COL.H0) * PS;
    const pulse = .8 * bump(t, a.stayed - .2, 1.6) + .5 * bump(t, a.seventeen - .1, 1.4);
    plateSpace(ctx, c, COL.Z, () => {
      B.columnPlate(ctx, t, { wk: colW(t), top, bottom: groundV, coreEnd: lerp(H, groundV - 400, k), glowY: lerp(H + 200, groundV - 150, k), glowA: 1 + .3 * k, pulse, dust: .4 * (1 - smooth(span(t, tm.pour[0], tm.pour[0] + .8))) });
    });
    // the light pooling at the column's foot on the road while it pours
    const pu = bump(t, tm.pour[0] - .2, tm.pour[1] - tm.pour[0] + 1.6);
    if (pu > 0) stand(ctx, c, COL.X, COL.Z - 60, () => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.scale(1, .16); ctx.fillStyle = E.rad(ctx, 0, 0, 900, [[0, rgba(P.core1, .55 * pu)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 900, 0, 6.29); ctx.fill(); ctx.restore(); });
  }
  function hook(ctx, t, c) {
    const sh = PF / (HOOKZ - Cp.z);
    plateSpace(ctx, c, HOOKZ, () => {
      // the ring is nudged aside by the rising column (it then rests against its side) and swings a little
      const top = HOOK_PLATE.colTop - (colHeight(t) - COL.H0) * PS;     // the column's top in plate px (the hook hangs at ≈ the same depth)
      const pass = clamp((HOOK_PLATE.y + 22 * hookK(t) + 60 - top) / 120);
      const nudge = (HOOK_PLATE.colW * .5 * colW(t) + HOOK_PLATE.r * hookK(t) + 4) * smooth(pass) * (1 - smooth(span(t, tm.pour[0] + .6, tm.pour[0] + 2.2)));
      const swing = 26 * Math.sin((t - tm.rise[0]) * 3.1) * Math.exp(-Math.max(0, t - tm.rise[0] - .3) * 1.2) * (t > tm.rise[0] + .3 ? 1 : 0);
      const x = HOOK_PLATE.x + 3 * Math.sin(t * 1.1) + nudge + swing * smooth(pass);
      const y = HOOK_PLATE.y - 10 * smooth(pass) - 9000 * expoIn(span(t, a.behind - .4, a.subscribe + .6));
      const lift = smooth(span(t, tIn, tm.pull[1]));                            // the thread's top leaves the frame's edge for the sky
      ctx.save(); ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(HOOK_PLATE.x, -40000); ctx.lineTo(HOOK_PLATE.x, lerp(-10, -9000, lift)); ctx.stroke(); ctx.restore();
      B.hookPlate(ctx, t, x, y, HOOK_PLATE.x, lerp(-10, -9000, lift), { glint: bump(t, a.vanished - .15, 1.3), k: hookK(t) });
    });
  }

  // ---------------------------------------------------------------------------------------------------------- the record's door (3.10)
  function recordDoor(ctx, t) {
    const lit = .55 + .45 * smooth(span(t, a.music - .3, a.music + .5)) + .2 * bump(t, tm.coin[1] - .5, 1.2);
    const open = lerp(.8, .35, expoOut(span(t, tm.shut[0], tm.shut[1])));
    const d = F.door(ctx, t, 0, 0, REC.h, { lit: clamp(lit), open });
    // the record's tag hangs on its door (it moved there in 3.10)
    F.tag(ctx, t, d.hook[0], d.hook[1], 190, { swing: .02 * Math.sin(t * 1.2 + 1) + .05 * bump(t, tm.shut[0], 1.4) * Math.sin((t - tm.shut[0]) * 6), thread: 3000, glow: .9 });
  }

  // ---------------------------------------------------------------------------------------------------------- the three tall doors
  function doorThing(ctx, t, c, d) {
    const i = DOORS.indexOf(d), r = tm.dRise[i], u = span(t, r[0], r[1]);
    if (u <= 0) return;
    const sink = smooth(span(t, a.law + .3, a.rules + .4));                    // 8.01: the doors sink into the board for the drawing
    // glow: the bill's lines (5.09), "electricity" (power), Nvidia (chips), scarcity pays (chips)
    const billLit = [a.bGround, a.bPower, a.bChips][i];
    let g = .7 + .3 * smooth(span(t, billLit - .1, billLit + .5)) * (1 - smooth(span(t, a.nvidia + 2, a.nvidia + 4)));
    if (d.id === 'power') g += .35 * bump(t, a.elec - .1, 1.6);
    if (d.id === 'chips') g += .3 * bump(t, a.bChips, 1.4) + .4 * bump(t, a.scarcity - .1, 1.8);
    g *= 1 - .8 * smooth(span(t, a.oldest - 1.5, a.oldest)) * (1 - smooth(span(t, a.direction, a.followP)));     // your house is the hero of 6.05–7.01
    const settle = 1 - expoOut(u) + .025 * Math.sin(Math.min(1, span(t, r[1] - .25, r[1] + .35)) * Math.PI) ;
    stand(ctx, c, d.X, d.Z, () => {
      ctx.save(); ctx.beginPath(); ctx.rect(-6000, -9000, 12000, 9000); ctx.clip();        // it rises out of the board: nothing below the ground
      ctx.translate(0, (DOOR_H * 1.35) * Math.max(settle, sink));
      if (d.id === 'chips') B.chipBlock(ctx, t, DOOR_H * 1.25, { lit: .4 + .6 * clamp(g - .7) });
      if (d.id === 'power') { ctx.save(); ctx.translate(-1400, 0); B.pylon(ctx, t, DOOR_H * 1.45, {}); ctx.restore(); }
      const dd = F.door(ctx, t, 0, 0, DOOR_H, { lit: clamp(g), open: .55 });
      // the heavy tag lowers onto the door's hook from the dark (it left everything else)
      const tl = sineIO(span(t, r[0] + .35, r[1] + .9));
      if (tl > 0) F.tag(ctx, t, dd.hook[0], dd.hook[1] - (1 - tl) * 5200, DTAG, { swing: .01 * Math.sin(t * 1.1 + i * 2) + .05 * (1 - tl) * Math.sin(t * 2.4 + i), thread: 9000, glow: .8 + .4 * clamp(g - .7) });
      if (d.id === 'power') { // the wire from the pylon to the door's slab
        ctx.strokeStyle = rgba(P.halo1, .5); ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-1400 + DOOR_H * 1.45 * .34 * .95, -DOOR_H * 1.45 * .75); ctx.quadraticCurveTo(-700, -DOOR_H * .95, -DOOR_H * .39, -DOOR_H * 1.1); ctx.stroke();
      }
      ctx.restore();
      // dust on the sill as it lands (heavy)
      const du = span(t, r[1] - .3, r[1] + 1.2);
      if (du > 0 && du < 1) E.dust(ctx, 80 + i, 120, 0, -60, 700 * (.5 + du), 120, t, .7 * (1 - du));
      // 7.03: the keeper steps out of the doorway on "very few people"
      const ku = span(t, a.fewPeople - .3, a.fewPeople + 1.1), kOut = smooth(span(t, a.machine - 1, a.machine + .5));
      if (ku > 0 && kOut < 1) {
        const x = 0 + lerp(0, 480, sineIO(ku)), sc = lerp(.6, 1, sineIO(ku));
        ctx.save(); ctx.beginPath(); ctx.rect(-6000, -9000, 12000, 9000); ctx.clip();
        E.person(ctx, x, 0, 560 * sc, { dir: 1, light: -1, walk: ku < 1 ? t * 4 : undefined, rim: mixHex(P.blue0, P.halo1, .5), long: true });
        ctx.restore();
      }
    });
  }
  function doorLabels(ctx, t, c) {
    for (let i = 0; i < 3; i++) {
      const d = DOORS[i], key = [a.ground, a.power, a.chips][i];
      const u = inOut(t, key - .1, key + .6, a.altman - .4 + i * .08, a.altman + .2 + i * .08);
      const u2 = (d.id === 'chips' ? 0 : 1) * inOut(t, a.crash + .3 + i * .15, a.crash + 1.1 + i * .15, a.atDoor - .9, a.atDoor - .3);
      const uu = Math.max(u, u2); if (uu <= 0) continue;
      const p = gp(c, d.X + 0, d.Z - 200); if (!p) continue;
      label(ctx, d.label, p[0], p[1] + 58, 38, uu, { col: P.cream });
    }
    // 7.03: the chips label comes back too
    const d = DOORS[2], u3 = inOut(t, a.crash + .6, a.crash + 1.4, a.atDoor - .9, a.atDoor - .3);
    if (u3 > 0) { const p = gp(c, d.X, d.Z - 200); if (p) label(ctx, d.label, p[0], p[1] + 58, 38, u3); }
  }

  // ---------------------------------------------------------------------------------------------------------- your house (6.05) + section (6.06)
  function yourHouse(ctx, t) {
    const lift = expoOut(span(t, a.bricks - .1, a.bricks + 1.4)) * (1 - smooth(span(t, a.low + 1, a.followP)));
    const back = smooth(span(t, a.low + 1, a.followP));                        // c07: the house is back on its ground (later shots)
    ctx.save(); ctx.translate(0, -lift * 2600);
    F.house(ctx, t, HOUSE.w, HOUSE.h, { win: 2, lit: .55 + .3 * smooth(span(t, a.hungry - .8, a.hungry + .4)), seed: 31, door: .5 + .5 * bump(t, a.month - .3, 1.6) + .3 * smooth(span(t, a.hungry - .8, a.hungry + .4)) });
    ctx.restore();
    void back;
  }
  function houseSection(ctx, t) {
    const op = sineIO(span(t, a.fourteen - .6, a.fourteen + .9)) * (1 - smooth(span(t, a.c07 + .2, a.margins + .4)));
    // the monthly tag over the front door: it swings once on "every month", stays when the house lifts, lowers onto the dirt
    const tagOn = smooth(span(t, a.oldest - .6, a.oldest + .6)) * (1 - expoIn(span(t, a.firstPic - .2, a.firstPic + .6)));
    if (op > 0) B.earthSection(ctx, t, 2600, 1500, { open: op, glow: smooth(span(t, a.eighty - .15, a.eighty + 1.2)) * (1 - smooth(span(t, a.margins - .6, a.margins + .4)) * .85), cx: 0 });
    if (tagOn > 0) {
      const sw = .16 * bump(t, a.month - .1, 1.8) * Math.sin((t - a.month) * 4.4) + .01 * Math.sin(t * 1.2);
      const yEye = lerp(-HOUSE.h - 520, -380, sineIO(span(t, a.dirt - .4, a.dirt + 1.2)));
      F.tag(ctx, t, HOUSE.w * .3 - 40, yEye + (1 - tagOn) * -2400, 210, { swing: sw, thread: 6000, glow: 1 + .3 * smooth(span(t, a.dirt, a.dirt + 1)) });
    }
  }

  // 7.05: the ground the machine stands on — the cut opens in front of the data centre and the dirt glows (as under your house)
  function dcSection(ctx, t) {
    const op = sineIO(span(t, a.standsOn - .6, a.standsOn + 1.0)) * (1 - smooth(span(t, a.law + .2, a.rules)));
    if (op > 0) B.earthSection(ctx, t, DCS.w, DCS.d, { open: op, glow: smooth(span(t, a.standsOn + .1, a.standsE + .8)), gain: 2.4, cx: 0 });
  }
  // ---------------------------------------------------------------------------------------------------------- coins
  function coins(t) {
    const out = [];
    // 5.04: the coin condenses at the column's foot and rolls along the road to the record's door, then slips in
    const q = span(t, tm.coin[0], a.retreats);
    if (t >= tm.coin[0] && t < tm.coin[1] + .2) {
      const [x0] = loopPt(uCol + .004);
      const x = lerp(x0 + 60, REC.X, quartIO(q)), z = lerp(LOOP.cz - LOOP.half, REC.Z - 40, smooth(span(t, a.retreats - .25, tm.coin[1])));
      const r = 46 * smooth(span(t, tm.coin[0], tm.coin[0] + .5)) * (1 - .55 * smooth(span(t, a.retreats + .2, tm.coin[1])));
      out.push({ X: x, Z: z, r: Math.max(1, r), spin: x / 46, a: 1 - smooth(span(t, tm.coin[1] - .25, tm.coin[1] + .1)) });
    }
    // 6.02–6.03: the margin coin rolls out of the chip door, fills to three quarters, rolls back in on "scarcity pays"
    const dc = DOORS[2];
    const co = span(t, a.summerE - .2, a.threeQ - .1), ci = span(t, a.scarcity - .2, a.scarcity + 1.1);
    if (co > 0 && ci < 1) {
      const xo = lerp(0, 2300, sineIO(co)) * (1 - sineIO(ci)), zo = lerp(40, -500, sineIO(co)) * (1 - sineIO(ci));
      const rr = 470 * lerp(.55, 1, sineIO(co)) * lerp(1, .55, sineIO(ci));
      out.push({ X: dc.X + xo, Z: dc.Z + zo - 20, r: rr, spin: (co < 1 ? (1 - sineIO(co)) * 9 : 0) + (ci > 0 ? sineIO(ci) * 9 : 0), pie: .75 * smooth(span(t, a.threeQ - .05, a.threeQ + .9)), a: 1 - smooth(span(ci, .75, 1)) });
    }
    // 7.02: the one coin (where the two sank) rolls toward the doors
    if (t >= a.direction - .2 && t < a.nearly + .5) {
      const u = coin702U(t), [x, z] = loopPt(u), ap = smooth(span(t, a.direction - .2, a.direction + .2)) * (1 - smooth(span(t, a.nearly - .2, a.nearly + .5)));
      out.push({ X: x, Z: z, r: 70, spin: u * 90, a: ap });
    }
    // 7.04: coins leave your hand for the doors (world arcs)
    const throws = [[a.atDoor - .05, 0], [a.g1 - .1, 0], [a.p1 - .1, 1], [a.c1 - .1, 2]];
    for (const [t0, di] of throws) {
      const qq = span(t, t0, t0 + 1.7); if (qq <= 0 || qq >= 1) continue;
      const hx = youX(t) + 40, d = DOORS[di], tx = d.X + 0, e = sineIO(qq);
      const X = lerp(hx, tx, e), Z = lerp(YOU2.Z - 10, d.Z - 30, e), arcY = Math.sin(Math.PI * e) * 1300 + lerp(120, 300, e);
      out.push({ X, Z, r: lerp(26, 60, e), y: arcY - 26, spin: qq * 20, a: 1 - smooth(span(qq, .85, 1)) });
    }
    return out;
  }

  // ---------------------------------------------------------------------------------------------------------- you, the keepers
  const youX = (t) => {
    // c05: beside the column → walk to the record's door; c07: walk along the near edge past your house
    if (t < a.c07) return lerp(YOU.X, REC.X - 330, sineIO(span(t, tm.walk[0], tm.walk[1])));
    return lerp(YOU2.X0, YOU2.X1, sineIO(span(t, a.inWorld - .2, a.every + .4)));
  };
  function people(t) {
    const out = [];
    const show05 = t < a.watchE + 4, show07 = t >= a.inWorld - 3 && t < a.c08 + 1;
    if (show05) {
      const wq = span(t, tm.walk[0], tm.walk[1]), walking = wq > 0 && wq < 1;
      const lookBack = smooth(span(t, a.subscribe - .45, a.subscribe + .3));
      const look = .5 + .3 * bump(t, a.seventeen, 2.4) - .4 * smooth(span(t, a.looking, a.looking + 1)) + .25 * lookBack;
      out.push({ X: youX(t), Z: Z0 + 40, draw: () => E.du(ctx0, 0, 0, YOU.h, { dir: lookBack > .5 ? -1 : 1, walk: walking ? (t - tm.walk[0]) * 5.2 : undefined, look: clamp(look), light: 1, armR: walking ? undefined : [.14 + .02 * Math.sin(t * 1.6), .1], armL: walking ? undefined : [-.16, -.08] }) });
    }
    if (show07) {
      const wq = span(t, a.inWorld - .2, a.every + .4), walking = wq > 0 && wq < 1;
      const throwA = Math.max(...[a.atDoor, a.g1, a.p1, a.c1].map((x) => bump(t, x - .35, .8)));
      out.push({ X: youX(t), Z: YOU2.Z, draw: () => E.du(ctx0, 0, 0, YOU.h, { dir: 1, walk: walking ? (t - a.inWorld) * 5 : undefined, look: .45, light: 1, armR: walking && throwA < .05 ? undefined : [lerp(.12, 2.2, throwA), lerp(.1, 1.0, throwA)], armL: walking ? undefined : [-.15, -.08] }) });
    }
    return out;
  }

  // ---------------------------------------------------------------------------------------------------------- the moon (7.04) and the lamp (8.01)
  function moonAt(ctx, t, c) {
    const mu = smooth(span(t, a.inWorld - 1.5, a.inWorld + .5)) * (1 - smooth(span(t, a.machine, a.machine + 1.5)));
    if (mu <= 0) return;
    const ph = .15 + .4 * expoOut(span(t, a.every - .1, a.every + 1.1));
    B.moon(ctx, t, 1560 + drift(t, 4, 3), 170 + drift(t, 3, 5) - 30 * (1 - mu), 34, ph, mu);
  }
  function lampPool(ctx, t, c, room) {
    const p = gp(c, 0, BOARD.cz); if (!p) return;
    const r0 = 20000 * p[2];
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.translate(p[0], p[1]); ctx.scale(1, .2);
    ctx.fillStyle = E.rad(ctx, 0, 0, r0 * 1.1, [[0, rgba(P.halo1, .2 * room)], [.6, rgba(P.halo1, .08 * room)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, r0 * 1.1, 0, 6.29); ctx.fill(); ctx.restore();
    // the lamp itself hangs above the table, top centre (its shade lit from inside)
    const ly = lerp(-160, 40, smooth(span(t, a.law, a.rules + .6))), lx = W / 2 + drift(t, 3, 9);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = room;
    ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lx, -10); ctx.lineTo(lx, ly); ctx.stroke();
    const sh = new Path2D(); sh.moveTo(lx - 40, ly); sh.lineTo(lx + 40, ly); sh.lineTo(lx + 120, ly + 90); sh.lineTo(lx - 120, ly + 90); sh.closePath();
    ctx.fillStyle = E.lin(ctx, lx - 120, 0, lx + 120, 0, [[0, P.night1], [.5, mixHex(P.night1, P.ind2, .7)], [1, P.night0]]); ctx.fill(sh);
    ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = 3; ctx.stroke(sh);
    halo(ctx, lx, ly + 96, 200, .55, P.halo0, P.core0);
    ctx.fillStyle = P.core0; ctx.beginPath(); ctx.ellipse(lx, ly + 92, 110, 10, 0, 0, 6.29); ctx.fill();
    ctx.restore();
  }
  // the board's front edge as a slab (a game board has a thickness) in the table view
  function boardSlab(ctx, c, room) {
    const { half, cz } = BOARD, zn = cz - half, a0 = gp(c, -half, zn), b0 = gp(c, half, zn);
    if (!a0 || !b0) return;
    const th = 380 * a0[2];
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = room;
    ctx.fillStyle = E.lin(ctx, 0, a0[1], 0, a0[1] + th, [[0, mixHex(P.ind1, P.blue0, .4)], [1, P.night1]]);
    ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(b0[0], b0[1]); ctx.lineTo(b0[0], b0[1] + th); ctx.lineTo(a0[0], a0[1] + th); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(P.halo1, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(b0[0], b0[1]); ctx.stroke();
    ctx.restore();
  }

  // ---------------------------------------------------------------------------------------------------------- c05 text + explainers
  function c05Text(ctx, t, c) {
    // 5.02: $17,000 A YEAR beside the column (it rose on the word)
    const u = inOut(t, a.seventeen - .05, a.seventeen + .8, a.looking - .7, a.looking - .1);
    if (u > 0) {
      const p = sp(c, COL.X + 520, -COL.H1 * .7, COL.Z); if (p) {
        const x = p[0], y = p[1];
        maskLine(ctx, [['$17,000', smooth(span(t, a.seventeen + .3, a.seventeen + 1))]], x, y, 150, u, {});
        label(ctx, 'A YEAR', x + 4, y + 58, 40, u, { align: 'left' });
        label(ctx, 'TO GIVE UP SEARCH', x + 4, y + 108, 32, u, { align: 'left', col: P.halo0 });
        label(ctx, 'PNAS 2019', x + 4, y + 148, 24, u, { align: 'left', col: P.halo2 });
      }
    }
    // the search bar (world) — grows on "search engines", folds back into the column before it pours
    const bu = span(t, tm.bar[0], tm.bar[1]), bo = 1 - sineIO(span(t, tm.barOut[0], tm.barOut[1]));
    if (bu > 0 && bo > 0) stand(ctx, c, COL.X, COL.Z - 40, () => B.searchBar(ctx, t, 0, -1050, 1800, 180, bu * bo));
    // 5.08: the quote card over the doors; it sinks into the bill (5.09)
    if (t > tm.quote[0] - .2 && t < tm.billU[1] + 1)
      F.quote(ctx, t, { text: 'the cost of intelligence should eventually converge to near the cost of electricity.', attr: 'SAM ALTMAN · “THE GENTLE SINGULARITY”, 2025', x: 960, y: 140, size: 62, w: 1250, align: 'center', t0: tm.quote[0], t1: tm.quote[1], gold: [['near the cost of electricity.', a.elec]] });
    // 5.09: the bill unrolls where the quote was; each line lights on its word (its door glows below)
    const unroll = span(t, tm.billU[0], tm.billU[1] + .5) * (1 - span(t, tm.billUp[0], tm.billUp[1]));
    if (unroll > 0) {
      const rows = [
        { k: 'THINKING', v: '≈ 0', dim: 1 },
        { k: 'POWER', lit: smooth(span(t, a.bPower - .1, a.bPower + .4)) },
        { k: 'CHIPS', lit: smooth(span(t, a.bChips - .1, a.bChips + .4)) + .4 * bump(t, a.bGroundE, 1.4) },
        { k: 'GROUND', lit: smooth(span(t, a.bGround - .1, a.bGround + .4)) },
      ];
      B.bill(ctx, t, 960 + drift(t, 3, 1), 70, 720, rows, sineIO(unroll), { rowH: 74, size: 38 });
    }
  }

  // ---------------------------------------------------------------------------------------------------------- c06 text + explainers
  function c06Text(ctx, t, c) {
    // 6.01: NVIDIA + $96.2B beside the chip door
    const dC = DOORS[2], q0 = sp(c, dC.X + 2650, -DOOR_H * 1.02, dC.Z);
    const un = inOut(t, a.nvidia - .1, a.nvidia + .6, a.summerE + .1, a.summerE + .6);
    const uc = inOut(t, a.ninety - .15, a.ninety + .5, a.summerE + .1, a.summerE + .65);
    if (q0 && (un > 0 || uc > 0)) {
      const x = q0[0], y = q0[1];
      label(ctx, 'NVIDIA', x, y, 54, un, { col: P.cream });
      const k = expoOut(span(t, a.ninety - .1, a.ninety + 1.3)), v = (96.2 * k).toFixed(1);
      maskLine(ctx, [[`$${v}B`, smooth(span(t, a.ninety + .6, a.ninety + 1.4))]], x, y + 175, 160, uc, { align: 'center' });
      label(ctx, 'ONE QUARTER · TO JULY 2026', x, y + 240, 34, inOut(t, a.quarter - .2, a.quarter + .5, a.summerE + .15, a.summerE + .7), { col: P.halo0 });
    }
    // 6.02: 75 % GROSS MARGIN above the margin coin
    const um = inOut(t, a.threeQ, a.threeQ + .7, a.villainy + .3, a.villainy + .9);
    if (um > 0) {
      const p = sp(c, dC.X + 2300, -1250, dC.Z - 520); if (p) {
        maskLine(ctx, [['75 %', smooth(span(t, a.threeQ + .4, a.threeQ + 1.2))]], p[0], p[1] - 40, 140, um, { align: 'center' });
        label(ctx, 'GROSS MARGIN', p[0], p[1] + 14, 36, inOut(t, a.gross - .2, a.gross + .5, a.villainy + .3, a.villainy + .9), { col: P.halo0 });
      }
    }
    // 6.04: Loudoun
    const ul = inOut(t, a.loudoun + .1, a.loudoun + .9, a.oldest - .9, a.oldest - .3);
    if (ul > 0) { label(ctx, 'LOUDOUN COUNTY, VIRGINIA', 960, 150, 44, ul, { col: P.cream }); }
    const ua = inOut(t, a.million - .1, a.million + .6, a.oldest - .9, a.oldest - .3);
    if (ua > 0) {
      const ac = DCB.acre, p = sp(c, (ac.X0 + ac.X1) / 2, -700, (ac.Z0 + ac.Z1) / 2); if (p) {
        maskLine(ctx, [['$2–6 MILLION', smooth(span(t, a.million + .3, a.million + 1.1))]], p[0], p[1] - 60, 120, ua, { align: 'center' });
        label(ctx, 'AN ACRE', p[0], p[1] - 4, 36, inOut(t, a.acreE - .5, a.acreE + .2, a.oldest - .9, a.oldest - .3), { col: P.halo0 });
        // a thin rule from the text down to the acre
        const g = gp(c, (ac.X0 + ac.X1) / 2, (ac.Z0 + ac.Z1) / 2); if (g) F.rule(ctx, p[0], p[1] + 14, g[0], g[1] - 6, ua * smooth(span(t, a.landFor, a.landFor + .8)), { w: 2 });
      }
    }
    // 6.06: 80 % in the dirt
    const ue = inOut(t, a.eighty - .1, a.eighty + .7, a.margins - .9, a.margins - .3);
    if (ue > 0) {
      const p = sp(c, HOUSE.X, 390, HOUSE.Z - 40); if (p) {
        maskLine(ctx, [['80 %', smooth(span(t, a.eighty + .2, a.eighty + 1))]], p[0], p[1], 170, ue, { align: 'center' });
        label(ctx, 'OF THE RISE IN HOUSE PRICES', p[0], p[1] + 62, 38, ue, { col: P.cream });
        label(ctx, '14 COUNTRIES · SINCE 1950 · KNOLL, SCHULARICK & STEGER 2017', p[0], p[1] + 110, 24, ue, { col: P.halo2 });
      }
    }
  }

  // ---------------------------------------------------------------------------------------------------------- c07: the first picture again
  function c07Over(ctx, t, c) {
    if (t < a.c07 - 1 || t > a.followP + 2) return;
    // the dirt's light gathers and rises to the left coin's place; the right coin rises from the bare ground beside it
    const riseL = span(t, a.c07 - .2, a.margins - .2), riseR = span(t, a.margins + .3, a.low - .1);
    const g0 = sp(c, HOUSE.X - 200, 250, HOUSE.Z - 40), g1 = sp(c, HOUSE.X + 500, 250, HOUSE.Z - 40);
    const L0 = [560, 440], R0 = [1360, 440];
    const sinkU = span(t, a.direction - 1.1, a.direction + .5);              // 7.02: the coins sink into the loop and merge
    const tgt = gp(c, ...loopPt(U702[0])) || [960, 900];
    const path = (g, P0, q) => { if (!g) return P0; const e = expoOut(q); return [lerp(g[0], P0[0], e), lerp(g[1], P0[1], e) - Math.sin(Math.PI * e) * 60]; };
    let cL = path(g0, L0, riseL), cR = path(g1, R0, riseR);
    if (sinkU > 0) { const e = sineIO(sinkU); cL = [lerp(L0[0], tgt[0], e), lerp(L0[1], tgt[1] - 70 * (tgt[2] ?? .1), e)]; cR = [lerp(R0[0], tgt[0], e), lerp(R0[1], tgt[1] - 70 * (tgt[2] ?? .1), e)]; }
    const uL = Math.min(1, .25 + 1.1 * riseL), uR = riseR > 0 ? Math.min(1, .25 + 1.1 * riseR) : 0;
    const txt = 1 - expoIn(span(t, a.direction - 1.3, a.direction - .6));
    const rs = lerp(1, .3, sineIO(sinkU)), merged = sinkU >= 1;
    if (!merged && riseL > 0) B.firstPictureB2(ctx, t, { uL, uR, cL, cR, txt, rs, hiL: smooth(span(t, a.margins - .1, a.margins + .6)) * (1 - span(t, a.direction - 1, a.direction)), hiR: smooth(span(t, a.low - .1, a.low + .6)) * (1 - span(t, a.direction - 1, a.direction)), pie: 1 - smooth(span(sinkU, .5, .95)) });
    // the merge: a flash where the two coins meet (they become the one coin on the road)
    const fl = bump(t, a.direction + .2, .9);
    if (fl > 0) halo(ctx, tgt[0], tgt[1] - 70 * (tgt[2] ?? .1), 240, .9 * fl, P.halo0, P.core0);
  }

  // ================================================================================================================= c08: the 2D drawing
  // The 3D board (captured through the fixed camera CF at the fold) folds up into Lizzie Magie's patent drawing: a top-down square
  // in gold lines. The loop road becomes the ring of fields, its 40 ticks the field lines, the far edge (the zero line) the top edge.
  const DR = { cx: 690, cy: 500, S: 660 };                                     // the drawing (square) on screen
  const top2 = (X, Z) => [DR.cx + X / BOARD.half * DR.S / 2, DR.cy - (Z - BOARD.cz) / BOARD.half * DR.S / 2];
  let CFl = CF;                                                                // the live camera (it keeps rising through the fold)
  const proj3 = (X, Z) => { const p = gp(CFl, X, Z); return p ? [p[0], p[1]] : [W / 2, H]; };
  const SQ = [[-BOARD.half, BOARD.cz - BOARD.half], [BOARD.half, BOARD.cz - BOARD.half], [BOARD.half, BOARD.cz + BOARD.half], [-BOARD.half, BOARD.cz + BOARD.half]];
  const RING = Array.from({ length: 121 }, (_, i) => loopPt(i / 120));
  const TICKS = Array.from({ length: 40 }, (_, i) => { const u = i / 40, [x, z] = loopPt(u), [dx, dz] = loopDir(u), hw = LOOP.w * 7; return [[x - dz * hw, z + dx * hw], [x + dz * hw, z - dx * hw], u]; });
  // fields of the ring (for colouring): 40 quads between ticks
  const FIELDS = TICKS.map((tk, i) => { const nx = TICKS[(i + 1) % 40]; return [tk[0], tk[1], nx[1], nx[0]]; });
  const PEOPLE = (() => { const r = prng(3804); return Array.from({ length: 46 }, (_, i) => { const ang = i / 46 * Math.PI * 2 + r() * .1, rr = 1.12 + r() * .35; return [ang, rr, r()]; }); })();

  function drawing(ctx, t) {
    const fold = sineIO(span(t, tFold[0], tFold[1]));
    CFl = camT(t);
    // the 2D view: zoom to the middle field for Henry George (8.04), back for the cards (8.05), push in on card II at the end (8.07)
    const zIn = sineIO(span(t, a.built - .2, a.george + .6)) * (1 - sineIO(span(t, a.belongsE + .2, a.twoSets + .3)));
    const push = sineIO(span(t, a.abundant + 1.4, tOut));
    const breathe = 1 + .035 * sineIO(span(t, tFold[1], a.twoSets)) * (1 - sineIO(span(t, a.twoSets, a.twoSets + 2)));   // a slow push on the drawing
    const V = { s: lerp(1, 1.22, zIn) * breathe, ox: lerp(0, 110, zIn), oy: lerp(0, 560 - DR.cy, zIn) };
    // background: the dark room (= the plates' night) + the lamp pool (it converges onto plateRules' bottom glow)
    B.plateNight(ctx, t, 1);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    let gx = lerp(DR.cx, 960, push), gyy = lerp(DR.cy + 120, 1180, push), gr = lerp(780, 1100, push), gsy = 1;
    const pp = gp(CFl, 0, BOARD.cz);                                           // at the fold's start: the lamp pool of the 3D view (lampPool)
    if (pp && fold < 1) { gx = lerp(pp[0], gx, fold); gyy = lerp(pp[1], gyy, fold); gr = lerp(22000 * pp[2], gr, fold); gsy = lerp(.2, 1, fold); }
    ctx.translate(gx, gyy); ctx.scale(1, gsy);
    ctx.fillStyle = E.rad(ctx, 0, 0, gr, [[0, rgba(P.halo1, lerp(.2, .18, fold))], [.6, rgba(P.halo1, lerp(.08, .07, fold))], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, gr, 0, 6.29); ctx.fill(); ctx.restore();
    // the lamp rises out of frame as the board folds up toward us
    const ly = lerp(40, -260, smooth(span(t, tFold[0], tFold[1] + .5)));
    if (ly > -250) { ctx.save(); const lx = W / 2 + drift(t, 3, 9); ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lx, -10); ctx.lineTo(lx, ly); ctx.stroke();
      const sh = new Path2D(); sh.moveTo(lx - 40, ly); sh.lineTo(lx + 40, ly); sh.lineTo(lx + 120, ly + 90); sh.lineTo(lx - 120, ly + 90); sh.closePath();
      ctx.fillStyle = E.lin(ctx, lx - 120, 0, lx + 120, 0, [[0, P.night1], [.5, mixHex(P.night1, P.ind2, .7)], [1, P.night0]]); ctx.fill(sh); ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = 3; ctx.stroke(sh);
      halo(ctx, lx, ly + 96, 200, .55, P.halo0, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.ellipse(lx, ly + 92, 110, 10, 0, 0, 6.29); ctx.fill(); ctx.restore(); }
    // push: the whole drawing and card I scale up around card II's final place and leave the frame
    // (the scale centre lies right of the board, so the board leaves the frame to the left; card I flies up and out on its own)
    const PX = { s: lerp(1, 4.6, push), cx: 1400, cy: 520 };
    // the two cards come out from under the board on "two sets of rules" (they were under it all along); card II goes back under on
    // "forgotten" and comes out again on "abundant". While a card is (partly) under the board it is drawn before the board.
    const under = smooth(span(t, a.forgotten - .2, a.forgotten + 1.4)), back = smooth(span(t, a.abundant - .3, a.abundant + 1.4));
    const em1 = sineIO(span(t, a.twoSets - .1, a.twoSets + 1.1)), em2 = sineIO(span(t, a.twoSets + .35, a.twoSets + 1.55));
    const g2 = back > 0 ? outGeom(t, back, push) : null, outUnder = g2 && push <= 0 && g2.x - g2.wv * g2.turn / 2 < DR.cx + DR.S / 2 + 4;
    const c2Under = (em2 > 0 && em2 < 1) || (under > 0 && back < 1);
    if (em1 > 0 && (em1 < 1 || back > 0)) cardI(ctx, t, em1, push);           // (from "abundant" on below card II: card II passes over it)
    if (c2Under) cardII(ctx, t, em2, under, back);
    if (outUnder) cardIIOut(ctx, g2);
    ctx.save();
    ctx.translate(PX.cx, PX.cy); ctx.scale(PX.s, PX.s); ctx.translate(-PX.cx, -PX.cy);
    ctx.translate(960, 560); ctx.scale(V.s, V.s); ctx.translate(-960 + V.ox / V.s, -560 + V.oy / V.s);
    patent(ctx, t, fold, V);
    ctx.restore();
    if (em1 >= 1 && back <= 0) cardI(ctx, t, 1, push);
    if (em2 >= 1 && !c2Under) cardII(ctx, t, 1, under, back);
    // words (screen space: right column)
    words(ctx, t, push);
    // card II at the end: comes out from behind the board, turns to us and lands on the plate (drawn last, above the push)
    if (g2 && !outUnder) cardIIOut(ctx, g2);
  }
  // card II's resting place beside the drawing (8.05) and its path under the board (8.06)
  const C1 = { x: 1460, y: 305, w: 660 }, C2 = { x: 1460, y: 728, w: 660 };
  const UO = { x: DR.cx + 60, y: DR.cy + 40 };                                 // where the cards lie under the board
  function cardI(ctx, t, em, push) {
    if (em <= 0) return;
    const glow = .55 + .5 * bump(t, a.single - .1, 2.4) + .6 * smooth(span(t, a.kept - .1, a.kept + .6)) * (1 - smooth(span(t, a.forgotten + 1.5, a.abundant)));
    const x = lerp(UO.x, C1.x, em) + drift(t, 2, 3) + 260 * push, y = lerp(UO.y, C1.y, em) - Math.sin(Math.PI * em) * 30 - 1100 * push * push;
    F.ruleCard(ctx, t, x, y, lerp(C1.w * .8, C1.w, em), { n: 'I', sub: 'one player owns it all', glow });
  }
  function cardII(ctx, t, em, under, back) {
    if (em <= 0 || (back > 0 && under >= 1)) return;
    const e = sineIO(under);
    const x0 = lerp(UO.x, C2.x, em), y0 = lerp(UO.y, C2.y, em) + Math.sin(Math.PI * em) * 30;
    const x = lerp(x0, UO.x, e), y = lerp(y0, UO.y, e), wv = lerp(lerp(C2.w * .8, C2.w, em), C2.w * .8, e);
    const glow = 1 + .5 * bump(t, a.wins - .1, 2.4);
    F.ruleCard(ctx, t, x + drift(t, 2, 5), y, wv, { n: 'II', sub: 'everybody wins', glow });
  }
  function outGeom(t, back, push) {
    // from under the board back out, turning (x-scale .22 → 1), then the push carries it onto the plate
    const e = sineIO(back);
    const x1 = 1330, y1 = 520;
    let x = lerp(UO.x, x1, e), y = lerp(UO.y, y1, e) - Math.sin(Math.PI * e) * 40, wv = lerp(C2.w * .8, 620, e);
    x = lerp(x, RULES_PLATE.x + 2 * drift(t, 1, 5), push); y = lerp(y, RULES_PLATE.y, push); wv = lerp(wv, RULES_PLATE.w, push);
    const turn = lerp(.22, 1, expoOut(span(t, a.abundant + .2, a.abundant + 1.6)));
    const glow = lerp(1, 1 + .05 * Math.sin(t * 1.2), push) + .35 * bump(t, a.shared - .1, 1.6) * (1 - push);
    return { x, y, wv, turn, glow };
  }
  function cardIIOut(ctx, g) {
    ctx.save(); ctx.translate(g.x, g.y); ctx.scale(g.turn, 1); ctx.translate(-g.x, -g.y);
    F.ruleCard(ctx, 0, g.x, g.y, g.wv, { n: 'II', sub: 'everybody wins', glow: g.glow });
    ctx.restore();
  }

  // the patent drawing (fold = 0: the 3D board as seen through CF; 1: top-down drawing)
  function patent(ctx, t, fold, V) {
    const P2 = (X, Z) => { const A = proj3(X, Z), Bq = top2(X, Z); return [lerp(A[0], Bq[0], fold), lerp(A[1], Bq[1], fold)]; };
    // as it folds, the loop road grows out to the board's edge: the ring of fields of a board game (Monopoly's track)
    const ex = sineIO(span(t, tFold[0] + .4, tFold[1] + .2)), kx = lerp(1, 3.13, ex), zc = lerp(LOOP.cz, BOARD.cz, ex);
    const P2L = (X, Z) => P2(LOOP.cx + (X - LOOP.cx) * kx, zc + (Z - LOOP.cz) * kx);
    ctx.save();
    // board surface (opaque: card II can slide under it)
    const sq = SQ.map(([x, z]) => P2(x, z));
    ctx.beginPath(); sq.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
    const yT = Math.min(sq[2][1], sq[3][1]), yB = lerp(Math.max(yT + 60, H), Math.max(sq[0][1], sq[1][1]), fold);   // fold 0 = F.board's own fill
    ctx.fillStyle = E.lin(ctx, 0, yT, 0, yB, [[0, mixHex(mixHex(P.ind1, P.blue1, .35), P.night1, .3 * fold)], [lerp(.12, .3, fold), mixHex(P.night1, P.ind1, .5)], [lerp(.55, .99, fold), P.night1], [1, mixHex(P.night0, P.night1, fold)]]);
    ctx.fill();
    ctx.strokeStyle = rgba(P.halo1, .45 + .45 * fold); ctx.lineWidth = 2 + 2 * fold / V.s; ctx.stroke();
    if (fold < 1) {
      // the 3D board's zero line (far edge) and its front slab, as in the table view; they flatten away as it folds
      const zA = sq[3], zB = sq[2], zz = .3 * (1 - fold);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = E.lin(ctx, 0, zA[1] - 90, 0, zA[1] + 6, [[0, rgba(P.blue0, 0)], [.7, rgba(P.blue0, .22 * zz)], [1, rgba(P.halo1, .2 * zz)]]); ctx.fillRect(Math.min(zA[0], zB[0]) - 40, zA[1] - 90, Math.abs(zB[0] - zA[0]) + 80, 96);
      ctx.restore();
      ctx.strokeStyle = rgba(mixHex(P.halo2, P.cream, .5), .55 * zz); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(zA[0], zA[1]); ctx.lineTo(zB[0], zB[1]); ctx.stroke();
      const f0 = gp(CFl, -BOARD.half, BOARD.cz - BOARD.half), a0 = sq[0], b0 = sq[1];
      const th = (f0 ? 380 * f0[2] : 0) * (1 - fold);
      if (th > .5) {
        ctx.fillStyle = E.lin(ctx, 0, a0[1], 0, a0[1] + th, [[0, mixHex(P.ind1, P.blue0, .4)], [1, P.night1]]);
        ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(b0[0], b0[1]); ctx.lineTo(b0[0], b0[1] + th); ctx.lineTo(a0[0], a0[1] + th); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = rgba(P.halo1, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(b0[0], b0[1]); ctx.stroke();
      }
    }
    // the inner border of a game board (gold patent line) — drawn by the fold
    const inset = 1 - .06;
    const sq2 = SQ.map(([x, z]) => P2(x * inset, BOARD.cz + (z - BOARD.cz) * inset));
    // the patent's inner border draws itself on "patented" (a line of light running round the board)
    const pd = sineIO(span(t, a.magie + .7, a.magie + 2.4));
    if (fold > 0 && pd > 0) { ctx.save(); ctx.globalAlpha = fold; ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 2.4 / V.s; ctx.setLineDash([4000 * pd, 4000]); ctx.beginPath(); [sq2[3], sq2[2], sq2[1], sq2[0]].forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke(); ctx.restore();
      if (pd < 1) { const L = [sq2[3], sq2[2], sq2[1], sq2[0], sq2[3]], segs = L.slice(1).map((q, i) => Math.hypot(q[0] - L[i][0], q[1] - L[i][1])); let r = 4000 * pd, k = 0; while (k < 3 && r > segs[k]) { r -= segs[k]; k++; } const f = clamp(r / segs[k]), hx = lerp(L[k][0], L[k + 1][0], f), hy = lerp(L[k][1], L[k + 1][1], f); halo(ctx, hx, hy, 60, .8, P.halo0, P.core0); } }
    // 8.06–8.07: the second set's light shows through the board while it lies under it (it is still there)
    const leak = smooth(span(t, a.forgotten + .6, a.abundant - .2)) * (1 - smooth(span(t, a.abundant - .2, a.abundant + 1.2)));
    if (leak > 0) { const c0 = P2(0, BOARD.cz), br = 1 + .08 * Math.sin(t * 2.1); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, c0[0] + 60, c0[1] + 40, 260 * br, [[0, rgba(P.halo0, .32 * leak)], [.5, rgba(P.halo1, .12 * leak)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(c0[0] - 340, c0[1] - 300, 800, 700); ctx.restore(); }
    // fields of the ring: one colour + a door each (single player) → all warm (everybody wins) → back to one colour (we kept the first)
    const one = smooth(span(t, a.single - .1, a.single + 1.2)) * (1 - smooth(span(t, a.wins - .2, a.wins + .8))) + smooth(span(t, a.kept - .1, a.kept + .9)) * (1 - smooth(span(t, a.abundant + 1.4, tOut)));
    const warm = smooth(span(t, a.wins - .1, a.wins + 1.2)) * (1 - smooth(span(t, a.kept - .1, a.kept + .9)));
    FIELDS.forEach((f, i) => {
      const q = f.map(([x, z]) => P2L(x, z)), wave = clamp((t - (a.single - .1) - i * .018) * 2), wv2 = clamp((t - (a.wins - .1) - i * .018) * 2);
      const o1 = one * wave, w1 = warm * wv2;
      if (o1 <= 0 && w1 <= 0) return;
      ctx.beginPath(); q.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
      if (o1 > 0) { ctx.fillStyle = rgba(mixHex(COOL.deep, COOL.edge, .3), .75 * o1); ctx.fill(); }
      if (w1 > 0) { ctx.fillStyle = rgba(P.halo0, .8 * w1); ctx.fill(); }
      if (o1 > .3) { const cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4; B.doorGlyph(ctx, cx, cy + 9, 18, rgba(COOL.core, o1), .4 * o1); }
    });
    // the road ring (two lines) and its 40 field lines
    // the road ribbon (fold 0 = F.road's look in the table view) widens into the ring of fields; its edges become the two patent lines
    const wf = sineIO(clamp(fold * 1.25)), hwR = lerp(LOOP.w / 2, LOOP.w * 7, wf), L1 = .46 * .55;
    const edge = (off, w) => RING.map(([x, z], i) => { const [dx, dz] = loopDir(i / 120); return P2L(x - dz * w * off, z + dx * w * off); });
    if (fold < 1) {
      const gl = 1 - smooth(clamp(fold * 2));
      if (gl > 0) { const Lg = edge(-1, LOOP.w * 2.5), Rg = edge(1, LOOP.w * 2.5); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.halo1, .07 * L1 * gl); ctx.beginPath(); Lg.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); Rg.slice().reverse().forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill('evenodd'); ctx.restore(); }
      const Lr = edge(-1, hwR), Rr = edge(1, hwR), ra = 1 - smooth(clamp(fold * 1.6));
      if (ra > 0) { ctx.save(); ctx.globalAlpha = ra; ctx.fillStyle = mixHex(mixHex(P.ind2, P.shade0, .5), mixHex(P.halo0, P.core1, .5), L1); ctx.beginPath(); Lr.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); Rr.slice().reverse().forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill('evenodd'); ctx.restore(); }
    }
    ctx.strokeStyle = rgba(P.halo0, .9); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const la = smooth(clamp(fold * 3));
    if (la > 0) for (const off of [-1, 1]) {
      const pts = edge(off, hwR); ctx.lineWidth = lerp(1.2, 2.6, fold) / V.s; ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.globalAlpha = la; ctx.stroke(); ctx.globalAlpha = 1;
    }
    // the field ticks (F.road's faint ticks → the drawing's field lines)
    const s0 = gp(CFl, 0, LOOP.cz - LOOP.half), tw0 = Math.max(.8, 5 * (s0 ? s0[2] : .1));
    ctx.strokeStyle = fold < 1 ? rgba(mixHex(P.halo1, P.halo0, fold), lerp(.28 * (.4 + .6 * .46), .75, fold)) : rgba(P.halo0, .75); ctx.lineWidth = lerp(tw0, 1.6, fold) / V.s;
    const tk = lerp(LOOP.w / 2 * 2.2, LOOP.w * 7, wf);
    for (const [, , u] of TICKS) { const [x, z] = loopPt(u), [dx, dz] = loopDir(u), A = P2L(x - dz * tk, z + dx * tk), Bq = P2L(x + dz * tk, z - dx * tk); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(Bq[0], Bq[1]); ctx.stroke(); }
    // "a board game": a light runs once round the track (the road's light, now the game's), lighting the field lines it passes
    const sw = span(t, a.boardGame + .2, a.teach + 1.6);
    if (sw > 0 && sw < 1) {
      const hu = (.75 + quartIO(sw)) % 1, fa = Math.sin(Math.PI * sw);
      ctx.save(); ctx.strokeStyle = rgba(P.core0, .9); ctx.lineWidth = 2.6 / V.s;
      for (const [, , u] of TICKS) { const dd = Math.min(Math.abs(u - hu), 1 - Math.abs(u - hu)), k = Math.exp(-(dd * dd) / (2 * .035 * .035)) * fa; if (k < .03) continue;
        const [x, z] = loopPt(u), [dx, dz] = loopDir(u), A = P2L(x - dz * tk, z + dx * tk), Bq = P2L(x + dz * tk, z - dx * tk); ctx.globalAlpha = k; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(Bq[0], Bq[1]); ctx.stroke(); }
      const [hx, hz] = loopPt(hu), hp = P2L(hx, hz); ctx.globalAlpha = 1; halo(ctx, hp[0], hp[1], 70 / V.s, .7 * fa, P.halo0, P.core0);
      ctx.restore();
    }
    // the corner squares of the drawing
    if (fold > 0) {
      ctx.save(); ctx.globalAlpha = fold; ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 2 / V.s;
      for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const cx = LOOP.cx + sx * LOOP.half, cz = LOOP.cz + sz * LOOP.half, d = LOOP.w * 7; const q = [[cx - d, cz - d], [cx + d, cz - d], [cx + d, cz + d], [cx - d, cz + d]].map(([x, z]) => P2L(x, z)); ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke(); }
      ctx.restore();
    }
    // the player's token: it hops round the ring field by field from "board game" on (the game is played), a field lights where it lands
    const tq = Math.min(t - (a.boardGame - .3), a.single + .2 - (a.boardGame - .3)) / .5;
    if (tq > 0) {
      const n = Math.floor(tq), f = tq - n, hop = expoOut(clamp(f * 2.4)), u = (30 + n + hop) / 40 % 1, [x, z] = loopPt(u), [tx, ty] = P2L(x, z);
      const on = smooth(span(t, a.boardGame - .3, a.boardGame + .2)), r = 16 / V.s * on;
      const land = 1 - clamp(f * 2.4 - 1);
      halo(ctx, tx, ty, 46 / V.s, .55 * on * land, P.halo0, P.core0);
      F.coin(ctx, t, tx, ty - Math.sin(Math.PI * clamp(f * 2.4)) * 16 / V.s - r, r, { spin: n * .7 + hop * .7 });
    }
    // 8.04: the field in the middle (the land) — value flows in from everyone around it, then back out to all of them
    const mid = [[-LOOP.half + 600, LOOP.cz - LOOP.half + 600], [LOOP.half - 600, LOOP.cz - LOOP.half + 600], [LOOP.half - 600, LOOP.cz + LOOP.half - 600], [-LOOP.half + 600, LOOP.cz + LOOP.half - 600]].map(([x, z]) => P2L(x, z));
    const fin = smooth(span(t, a.everyone - .1, a.everyone + 1.6)), fout = smooth(span(t, a.belongs - .1, a.belongs + 1.6));
    const fieldLit = fin * (1 - .75 * fout), hgU = span(t, a.built - .3, a.george + .3) * (1 - smooth(span(t, a.belongsE + .3, a.twoSets + .2)));
    if (hgU > 0) {
      ctx.save(); ctx.globalAlpha = smooth(hgU);
      ctx.beginPath(); mid.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
      ctx.strokeStyle = rgba(P.core1, .5); ctx.lineWidth = 2 / V.s; ctx.stroke();
      const md = sineIO(span(t, a.land - .3, a.land + 1.1));                    // "land": its border lights round once
      if (md > 0) { ctx.save(); ctx.strokeStyle = rgba(P.core0, .95); ctx.lineWidth = 4 / V.s; ctx.setLineDash([3000 * md, 3000]); ctx.beginPath(); [mid[3], mid[2], mid[1], mid[0]].forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke(); ctx.restore(); ctx.beginPath(); mid.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); }
      if (fieldLit > 0) { const mx = (mid[0][0] + mid[2][0]) / 2, my = (mid[0][1] + mid[2][1]) / 2, mr = Math.abs(mid[2][0] - mid[0][0]) * .75; ctx.fillStyle = E.rad(ctx, mx, my, mr, [[0, rgba(P.core0, .8 * fieldLit)], [.45, rgba(P.halo0, .5 * fieldLit)], [1, rgba(P.halo1, .18 * fieldLit)]]); ctx.fill(); }
      // the people round it (points of light just outside the ring), and the flows
      const mc = [DR.cx, DR.cy], R0 = DR.S * .5;
      for (const [ang, rr, ph] of PEOPLE) {
        const px = mc[0] + Math.cos(ang) * R0 * rr * .95, py = mc[1] + Math.sin(ang) * R0 * rr * .95, br = .55 + .45 * fout;
        ctx.fillStyle = rgba(P.core1, .8 * br); ctx.beginPath(); ctx.arc(px, py, (4 + 2 * fout) / V.s * 1.4, 0, 6.29); ctx.fill();
        // in: grains from each person to the field
        for (const [dir, f0] of [[1, fin], [-1, fout]]) {
          if (f0 <= 0 || f0 >= 1) continue;
          for (let k = 0; k < 3; k++) {
            const q = ((f0 * 1.6 - k * .22 - ph * .3) % 1 + 1) % 1, e = dir > 0 ? q : 1 - q;
            const x = lerp(px, mc[0] + Math.cos(ang) * R0 * .2, e), y = lerp(py, mc[1] + Math.sin(ang) * R0 * .2, e);
            ctx.fillStyle = rgba(P.core0, .85 * Math.sin(Math.PI * q)); ctx.fillRect(x - 2.5 / V.s, y - 2.5 / V.s, 5 / V.s, 5 / V.s);
          }
        }
        if (fout > 0) halo(ctx, px, py, 18 * fout / V.s * 1.4, .5 * fout, P.halo0, P.core0);
      }
      ctx.restore();
    }
    ctx.restore();
  }
  // the words in the right column (screen space)
  function words(ctx, t, push) {
    const x = 1460, aw = 1 - push;
    if (aw <= 0) return;
    ctx.save(); ctx.globalAlpha = 1;
    const u1 = inOutW(t, a.magie - .1, a.magie + .7, a.youKnow - .6, a.youKnow);
    label(ctx, 'LIZZIE MAGIE', x, 430, 84, u1, { serif: true, col: P.cream, glow: true });
    label(ctx, 'PATENTED 1904', x, 490, 36, inOutW(t, a.magie + .3, a.magie + 1, a.youKnow - .5, a.youKnow + .1), { col: P.halo0 });
    const u2 = inOutW(t, a.monopoly - .1, a.monopoly + .6, a.landlord - .5, a.landlord);
    label(ctx, 'MONOPOLY', x, 580, 104, u2, { serif: true, col: P.cream, glow: true });
    const u3 = inOutW(t, a.landlord, a.landlord + .7, a.built + .6, a.built + 1.2);
    label(ctx, 'THE LANDLORD’S', x, 545, 84, u3, { serif: true, col: P.cream, glow: true, warm: smooth(span(t, a.landlord + .4, a.landlord + 1.2)) });
    label(ctx, 'GAME', x, 635, 84, inOutW(t, a.landlord + .15, a.landlord + .85, a.built + .65, a.built + 1.25), { serif: true, col: P.cream, glow: true, warm: smooth(span(t, a.landlord + .5, a.landlord + 1.3)) });
    const u4 = inOutW(t, a.george - .1, a.george + .6, a.belongsE + .4, a.twoSets - .2);
    label(ctx, 'HENRY GEORGE', x + 70, 230, 64, u4, { serif: true, col: P.cream, glow: true });
    label(ctx, 'ECONOMIST', x + 70, 280, 30, u4, { col: P.halo0 });
    ctx.restore();
  }
  return drawFn;
}

export const B2 = { COL, DOORS, HOUSE, REC, DCZ };
