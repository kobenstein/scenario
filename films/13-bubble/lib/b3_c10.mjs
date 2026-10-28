// Film 13 · c10 (B3) · "And sometimes, people build the rails themselves" → "…had to run its penny train." · ONE take, one long world
// that the camera travels through from left to right while the light of the day turns (dusk → night → dawn → evening → night):
//   FARM   (x 0–1900)     the 1932 newspaper (seam plate c09|c10) is carried by the wind over a farm at dusk and lands by the fence
//                         (collapsed). Its pages riffle (the years after). Three farmers carry a pole in, raise it, a wire runs to the
//                         farmhouse: one bulb lights (co-operatives) = the hero.
//   PLAIN  (pull-back)    power lines branch out from that bulb across the plain, lights everywhere (42 million · ~900 CO-OPS · NRECA).
//   FIELD  (x 3500–5400)  dawn: a green hillside in Lancashire; villagers dig a trench, an orange duct goes in; on "own the network" a
//                         light runs through the duct and the houses on the hill light (B4RN · ~15,000 HOMES · OWNED BY ITS MEMBERS).
//   TABLE  (x 5500–6500)  evening: a piece of the duct flies right onto a table under a lamp post, next to the other pieces of this
//                         station (bulb, door, wafer wedge, APERTUS file); an empty chair (seat).
//   A3 ★                  the table top runs out to both sides and becomes the rail; the pieces fly together into a small warm car
//                         (duct → roof trim, door → door, chair → seat, bulb → the lamp inside, wedge → the lantern). No platform.
//   RULE                  a ticket machine rises beside the car; coin (heavy), tax receipt (light), plug fall in; a ticket comes out
//                         and writes its rows; it goes into a student's hand; three board from the ground; a copy of the last ticket
//                         rises, the camera tilts into the night, the 1844 ticket drifts in beside it → seam plate c10|c11.
import { Path2D, PathOp } from '@napi-rs/canvas';
import { E, K, B, rise, ramp, sramp, herm, bump, label, PUSH, zoomAt, nightBack, sheetState, sheetDraw, sheetFace, TK, ticketNew, ticketOld, plateTickets } from './b3_common.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, rad, prng, halo, card, camAt, camDrift, aim, project, cardM, F0 } = E;
const { COL } = B;

// ------------------------------------------------------------------------------------------------ the world (design, plane F0)
const HZ = 742;
const BARN = { x0: 150, x1: 520, y: 786 }, MILL = { x: 800, y: 790, top: 470 }, HOUSE = { x0: 1470, x1: 1790, y: 806 }, WIN = { x: 1560, y: 690, w: 76, h: 62 };
const POLE = { x: 1200, y: 838, L: 336 };
const FENCE = { x0: -900, x1: 1110, y: 818 };
const FARMER_Y = 842, FARMER_H = 200;
const DUCT = { c: '#c4733a', hi: '#e8a266', lo: '#6e3d22' };    // the orange duct (a thing, never the yellow of your coat)
const GREEN = '#5d7468';
// the hill and the trench (Lancashire)
const HILL = (() => { const a = []; for (let i = 0; i <= 80; i++) { const x = lerp(2900, 6100, i / 80); a.push([x, HZ - 130 * Math.exp(-(((x - 5000) / 650) ** 2)) - 46 * Math.exp(-(((x - 3900) / 480) ** 2)) - 5 * Math.sin(i * 1.3)]); } return a; })();
const hillY = (x) => { const i = clamp((x - 2900) / 3200) * 80, j = Math.min(79, Math.floor(i)); return lerp(HILL[j][1], HILL[j + 1][1], i - j); };
const TR = (() => { const a = []; for (let i = 0; i <= 48; i++) { const x = lerp(3600, 5060, i / 48); a.push([x, 876 - 26 * Math.sin(i / 48 * Math.PI * .9) - 10 * Math.sin(i * .55)]); } return a; })();
const trY = (x) => { const i = clamp((x - 3600) / 1460) * 48, j = Math.min(47, Math.floor(i)); return lerp(TR[j][1], TR[j + 1][1], i - j); };
const SEG_X = 4930;                                             // the last piece of duct (it flies to the table)
const DIGGERS = [[3820, 1, 0], [4080, -1, 1.3], [4330, 1, 2.1], [4600, -1, .7]];
const HOMES = [4780, 4930, 5080, 5230, 5380].map((x, i) => [x, hillY(x) + 3, i]);
const GRASS = (() => { const r = prng(4471), a = []; for (let i = 0; i < 240; i++) { const x = 3200 + r() * 2700; a.push([x, hillY(x) + 8 + r() * 330, 9 + r() * 15, r() * 6.3]); } return a; })();
const HILLS_FAR = (() => { const r = prng(7781), a = []; for (let x = -7000; x <= 15000; x += 140) a.push([x, 655 - 40 * r() - 30 * Math.sin(x * .0013) - 18 * Math.sin(x * .0041)]); return a; })();
// the table and its pieces (evening)
const TABLE = { x0: 5730, x1: 6290, y: 690, legs: 110 };
const LAMP = { x: 5560, y: 800, top: 352 };
const CHAIR = { x: 6400, y: 800 };
const PIECES = { bulb: [5790, 690], door: [5878, 690], wedge: [5985, 690], file: [6085, 690], duct: [6200, 690] };
// the car (A3) on the rail = the table top
const RAILY = TABLE.y, CAR = { x0: 5800, x1: 6260, yb: RAILY - 30, h: 176 };
CAR.top = CAR.yb - CAR.h; CAR.door = { x0: 6082, x1: 6146, y0: CAR.top + 18, y1: CAR.yb - 2 };
const DOORX = (CAR.door.x0 + CAR.door.x1) / 2;
const CARWIN = [[5826, 5930], [5950, 6060], [6166, 6240]];
const MACH = { x: 6440, y: 806, w: 84, h: 236 };
MACH.slot = MACH.y - MACH.h + 22;
const TKW = { x: 6330, y: 470, w: 420 };
const GROUND_Y = 776, PH = 140;                                 // where the riders stand, their height
// the plain: lights branching out from the bulb (a tree: each light's parent is the nearest earlier one)
const ROOT = [WIN.x + WIN.w / 2, WIN.y + WIN.h / 2];
const NODES = (() => {
  const r = prng(4242), pts = [], cl = [];
  for (let i = 0; i < 26; i++) cl.push([lerp(-2300, 4300, r()), lerp(800, 2600, r() ** .8)]);
  for (let i = 0; i < 340; i++) { const c = cl[i % cl.length], q = r() * 6.28, d = 50 + r() * 330; pts.push([c[0] + Math.cos(q) * d * 1.4, Math.max(780, c[1] + Math.sin(q) * d * .6)]); }
  pts.forEach((p) => p.push(Math.hypot(p[0] - ROOT[0], (p[1] - ROOT[1]) * 1.4)));
  pts.sort((p, q) => p[2] - q[2]);
  const out = [[ROOT[0], ROOT[1], 0, -1]];
  for (const p of pts) { let bi = 0, bd = 1e9; out.forEach((q, k) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; bi = k; } }); out.push([p[0], p[1], p[2], bi]); }
  return out;
})();
const DMAX = Math.max(...NODES.map((n) => n[2]));

// ------------------------------------------------------------------------------------------------ the light of the day
const NIGHT = [[0, P.night0], [.38, mixHex(P.night0, P.night1, .38 / .62)], [.62, P.night1], [1, mixHex(P.ind0, P.night1, .3)]];   // = nightBack default
const SKIES = {
  dusk: { s: [[0, '#0e1b4e'], [.38, '#26387a'], [.62, '#6a5c78'], [1, '#a9845e']], st: .12, g: ['#2f2d4e', '#1c1d3e'], sun: 1 },
  night: { s: NIGHT, st: .5, g: [P.night1, P.night0], sun: 0 },
  day: { s: [[0, '#22407a'], [.38, '#3d5892'], [.62, '#7b8692'], [1, '#aca690']], st: 0, g: ['#3f505e', '#28384a'], sun: 0 },
  eve: { s: [[0, '#0c194c'], [.38, '#22357a'], [.62, '#574f7a'], [1, '#86695c']], st: .22, g: ['#232955', '#141a40'], sun: 0 },
};

export function make(T, R) {
  E.prepareEditorial();
  const at = T.seq(R.a), a = {};
  a.T0 = R.a; a.themselves = at('themselves'); a.n1932 = at('nineteen thirty-two'); a.collapsed = at('collapsed'); a.small = at('Small investors');
  a.lost = at('lost their savings'); a.years = at('years after'); a.farmers = at('farmers'); a.coop = at('co-operatives'); a.today = at('Today');
  a.forty = at('forty-two million'); a.north = at('north of England'); a.villagers = at('villagers'); a.trenches = at('trenches'); a.ownN = at('own the network');
  a.together = at('together'); a.allof = at('All of this'); a.protects = at('protects the rails'); a.none = at('None of it'); a.seat = at('seat');
  a.notyet = at('Not yet'); a.missing = at('missing piece'); a.call = at('Call it'); a.penny = at('penny train'); a.proposal = at('proposal');
  a.rule = at('The rule'); a.pubm = at('public money'); a.tax = at('tax break'); a.grid = at('grid connection'); a.basic = at('basic service');
  a.everyone = at('For everyone'); a.good = at('Good'); a.uptodate = at('up-to-date'); a.smallp = at('small, fixed price'); a.everyday = at('Every day');
  a.student = at('student'); a.startup = at('start-up'); a.hospital = at('hospital'); a.theway = at('The way'); a.y1844 = at('eighteen forty-four');
  a.pennyT = at('penny train'); a.T1 = R.b;
  const tQ = a.T0 + .5, tPlate = a.T1 - .5;
  const tL = sheetState(a.T0 + 99, a.T0).tL;                          // the newspaper lands

  // ================================================================ camera
  const KC = [
    [tQ, aim(F0, 960, 540, 1)],
    [a.lost, aim(F0, 1040, 596, 1.05)],
    [a.farmers - .2, aim(F0, 1120, 612, 1.0)],
    [a.coop + .3, aim(F0, 1330, 640, 1.1)],
    [a.forty + .5, aim(F0, 1500, 880, .32, 960, 600), 'q'],          // the pull-back over the plain
    [a.north - .1, aim(F0, 1700, 900, .31, 960, 600)],
    [a.trenches + .2, aim(F0, 4300, 800, .92, 960, 600), 'q'],       // across to the hillside at dawn
    [a.together, aim(F0, 4520, 790, .96, 960, 600)],
    [a.allof + .1, aim(F0, 4620, 780, .96, 960, 600)],
    [a.none, aim(F0, 6000, 640, 1.5), 'q'],                        // with the flying duct to the table
    [a.missing, aim(F0, 6010, 636, 1.56)],
    [a.penny + .2, aim(F0, 6030, 600, .92, 960, 620)],               // A3: the rail runs out, the car forms
    [a.rule, aim(F0, 6060, 600, .95, 960, 620)],
    [a.pubm - .2, aim(F0, 6320, 600, 1.12, 960, 560)],               // to the ticket machine
    [a.basic + .3, aim(F0, 6350, 610, 1.16, 960, 560)],
    [a.good + .5, aim(F0, TKW.x, TKW.y, 1.6, 960, 520)],             // the ticket writes its rows
    [a.everyday + .25, aim(F0, TKW.x + 10, TKW.y, 1.65, 960, 520)],
    [a.student + .35, aim(F0, 6080, 610, 1.12, 960, 600)],          // into a hand, along the car
    [a.hospital + .6, aim(F0, 5910, 615, 1.08, 960, 600)],
    [a.y1844 + .6, aim(F0, 5910, -800, .95, 960, 600), 'q'],         // tilt up into the night
    [a.T1, aim(F0, 5910, -860, .96, 960, 600)],
  ];
  const camW = (t) => camDrift(camAt(Math.max(t, tQ), KC), t, .55 * ramp(t, tQ, tQ + 3), 7);
  // the landed newspaper, carried into the world by the camera at tL
  const mL = cardM(camW(tL), F0), sL = sheetState(tL, a.T0);
  const paperW = { ...sL, x: (sL.x - mL.e) / mL.k, y: (sL.y - mL.f) / mL.k, w: sL.w / mL.k, h: sL.h / mL.k };

  // ================================================================ the light of the day (time keys)
  const SK = [[a.T0, 'dusk'], [a.coop + .2, 'dusk'], [a.today + .9, 'night'], [a.north - .4, 'night'], [a.trenches - .1, 'day'], [a.allof - .2, 'day'], [a.none - .2, 'eve'], [a.theway, 'eve'], [a.pennyT - .3, 'night']];
  const skyAt = (t) => {
    let i = 0; while (i < SK.length - 2 && t > SK[i + 1][0]) i++;
    const [ta, A] = SK[i], [tb, Bn] = SK[i + 1], u = sineIO(span(t, ta, tb)), sa = SKIES[A], sb = SKIES[Bn];
    return { stops: sa.s.map(([o, c], k) => [o, mixHex(c, sb.s[k][1], u)]), st: lerp(sa.st, sb.st, u), g0: mixHex(sa.g[0], sb.g[0], u), g1: mixHex(sa.g[1], sb.g[1], u),
      sun: lerp(sa.sun, sb.sun, u), day: (A === 'day' ? 1 - u : 0) + (Bn === 'day' ? u : 0), dark: (A === 'night' ? 1 - u : 0) + (Bn === 'night' ? u : 0) };
  };

  // ================================================================ timing
  const tCarry0 = a.collapsed + .2, tCarry1 = a.farmers - .25;             // the farmers carry the pole in
  const tRaise0 = a.farmers - .1, tRaise1 = a.coop - .55;                 // and raise it
  const tWire0 = a.coop - .6, tWire1 = a.coop - .08, tBulb = a.coop;
  const tSpread0 = a.today - .3, tSpread1 = a.north - .2;                  // the lights branch out
  const tDig0 = a.north - .4, tDig1 = a.ownN - .5;                         // the trench and the duct go in
  const tPulse0 = a.ownN - .1, tPulse1 = a.ownN + 1.1;
  const tSeg0 = a.allof + .05, tSeg1 = a.none - .1;                        // the duct piece flies to the table
  const t3 = a.missing - .05;                                              // A3
  const tFly0 = t3 + .55, tCarUp0 = t3 + .5, tCarUp1 = t3 + 1.5;
  const tMach0 = a.rule - .15, tMach1 = a.rule + .65;
  const tCoin = a.pubm, tRec = a.tax, tPlug = a.grid;
  const tOut0 = a.basic - .15, tOut1 = a.basic + .55, tFloat0 = a.everyone - .1, tFloat1 = a.good + .45;
  const tHand0 = a.everyday + .55, tHand1 = a.student + .3;
  // riders: [xWait, tArrive (they walk in from the left before), tGo (walk to the door), kind]
  const RIDERS = [
    { x: 6010, tIn0: a.smallp - .5, tIn1: a.everyday + .3, tGo: a.student + .32, kind: 'student' },
    { x: 5936, tIn0: a.smallp + .1, tIn1: a.student + .2, tGo: a.startup + .12, kind: 'laptop' },
    { x: 5872, tIn0: a.smallp + .4, tIn1: a.student + .5, tGo: a.startup + .4, kind: 'duo' },
    { x: 5790, tIn0: a.everyday - .3, tIn1: a.startup - .1, tGo: a.hospital + .3, kind: 'nurse' },
  ].map((r) => ({ ...r, tStep: r.tGo + (DOORX - r.x) / 300 }));
  const tRel = a.hospital + .2;                                             // the copy of the last ticket rises

  // the pieces on the table → fly into the car
  const fly = (t, i) => sramp(t, tFly0 + i * .09, tFly0 + .95 + i * .09);
  function arc(p0, p1, u, lift) { return [lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u) - lift * Math.sin(Math.PI * u)]; }
  const carGrow = (t) => ramp(t, tCarUp0, tCarUp1);
  const carLit = (t) => ramp(t, tFly0 + .9, tFly0 + 1.4);
  const carDrop = (t) => 3 * Math.sin(Math.min(1, Math.max(0, t - tCarUp1)) * 9) * Math.exp(-Math.max(0, t - tCarUp1) * 4);
  return (ctx, t) => {
    if (t >= tPlate) { plateTickets(ctx, t, a.T1); return; }
    const sky = skyAt(t), c = camW(t);
    nightBack(ctx, t, { stops: sky.stops, starA: sky.st, gy: 500, seed: 1011 });
    // the low sun (far)
    if (sky.sun > .01) card(ctx, c, 30000, () => {
      const sy = 700 + 90 * (1 - sky.sun);
      halo(ctx, 1560, sy, 900, .3 * sky.sun, P.halo1, P.halo0);
    });
    // far hills
    card(ctx, c, 4200, () => {
      const p = new Path2D(); p.moveTo(HILLS_FAR[0][0], 3000); for (const [x, y] of HILLS_FAR) p.lineTo(x, y); p.lineTo(HILLS_FAR[HILLS_FAR.length - 1][0], 3000); p.closePath();
      ctx.fillStyle = lin(ctx, 0, 600, 0, 900, [[0, mixHex(sky.g0, sky.stops[2][1], .35)], [1, sky.g1]]); ctx.fill(p);
      ctx.strokeStyle = rgba(mixHex(P.halo1, P.blue0, .5 + .5 * sky.dark), .25); ctx.lineWidth = 2; ctx.stroke(p);
    });
    card(ctx, c, F0, (k) => world(ctx, t, sky, k));
    // the newspaper while it is still in the air (screen space; c09's seam plate)
    if (t < tL) sheetDraw(ctx, t, a.T0);
    texts(ctx, t, c);
    tickets(ctx, t, c);
  };

  // ================================================================================================ the world
  function world(ctx, t, sky, k) {
    // ground
    ctx.fillStyle = lin(ctx, 0, HZ, 0, HZ + 900, [[0, sky.g0], [1, sky.g1]]); ctx.fillRect(-9000, HZ, 26000, 6000);
    ctx.fillStyle = rgba(mixHex(P.halo1, P.blue0, .4 + .6 * sky.dark), .22); ctx.fillRect(-9000, HZ - 1, 26000, 2);
    farm(ctx, t, sky);
    plain(ctx, t, sky, k);
    field(ctx, t, sky);
    station(ctx, t, sky);
  }

  // ------------------------------------------------------------------------------------------------ FARM
  function farm(ctx, t, sky) {
    if (t > a.trenches + 1) return;
    const rimC = rgba(P.halo1, .5 * (1 - sky.dark) + .1), body = [[0, mixHex(P.ind2, P.blue1, .25)], [1, P.night1]];
    // barn + silo
    ctx.save();
    const b = new Path2D(); b.moveTo(BARN.x0, BARN.y); b.lineTo(BARN.x0, 650); b.lineTo(BARN.x0 + 60, 585); b.lineTo((BARN.x0 + BARN.x1) / 2, 548); b.lineTo(BARN.x1 - 60, 585); b.lineTo(BARN.x1, 650); b.lineTo(BARN.x1, BARN.y); b.closePath();
    ctx.fillStyle = lin(ctx, 0, 548, 0, BARN.y, body); ctx.fill(b);
    ctx.strokeStyle = rimC; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo((BARN.x0 + BARN.x1) / 2, 548); ctx.lineTo(BARN.x1 - 60, 585); ctx.lineTo(BARN.x1, 650); ctx.lineTo(BARN.x1, BARN.y); ctx.stroke();
    ctx.strokeStyle = rgba(P.night0, .6); ctx.lineWidth = 3; ctx.strokeRect(285, 680, 100, 106); ctx.beginPath(); ctx.moveTo(285, 680); ctx.lineTo(385, 786); ctx.moveTo(385, 680); ctx.lineTo(285, 786); ctx.stroke();
    ctx.fillStyle = lin(ctx, 540, 0, 620, 0, [[0, P.night1], [1, mixHex(P.ind2, P.blue1, .3)]]); ctx.fillRect(540, 575, 76, BARN.y - 575);
    ctx.beginPath(); ctx.ellipse(578, 575, 38, 22, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = rimC; ctx.fillRect(613, 575, 3, BARN.y - 575);
    // the windmill (turns in the wind)
    ctx.strokeStyle = mixHex(P.ind2, P.blue1, .2); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(MILL.x - 42, MILL.y); ctx.lineTo(MILL.x - 6, MILL.top); ctx.moveTo(MILL.x + 42, MILL.y); ctx.lineTo(MILL.x + 6, MILL.top); ctx.stroke();
    ctx.lineWidth = 2; for (let i = 1; i < 6; i++) { const y0 = lerp(MILL.y, MILL.top, i / 6), y1 = lerp(MILL.y, MILL.top, (i + 1) / 6), w0 = lerp(42, 6, i / 6), w1 = lerp(42, 6, (i + 1) / 6); ctx.beginPath(); ctx.moveTo(MILL.x - w0, y0); ctx.lineTo(MILL.x + w1, y1); ctx.moveTo(MILL.x + w0, y0); ctx.lineTo(MILL.x - w1, y1); ctx.stroke(); }
    const ang = t * .9;
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .35);
    for (let i = 0; i < 14; i++) { const q = ang + i * Math.PI * 2 / 14; ctx.save(); ctx.translate(MILL.x, MILL.top); ctx.rotate(q); ctx.beginPath(); ctx.moveTo(8, -3); ctx.lineTo(70, -9); ctx.lineTo(70, 9); ctx.lineTo(8, 3); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(MILL.x, MILL.top, 9, 0, 6.29); ctx.fill();
    ctx.beginPath(); ctx.moveTo(MILL.x, MILL.top - 4); ctx.lineTo(MILL.x - 70, MILL.top - 14); ctx.lineTo(MILL.x - 74, MILL.top + 10); ctx.lineTo(MILL.x, MILL.top + 4); ctx.fill();
    // the farmhouse
    const hx0 = HOUSE.x0, hx1 = HOUSE.x1, top = 664;
    ctx.fillStyle = lin(ctx, 0, 580, 0, HOUSE.y, body); ctx.fillRect(hx0, top, hx1 - hx0, HOUSE.y - top);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .4); ctx.beginPath(); ctx.moveTo(hx0 - 24, top + 2); ctx.lineTo((hx0 + hx1) / 2, 578); ctx.lineTo(hx1 + 24, top + 2); ctx.closePath(); ctx.fill();
    ctx.fillRect(hx1 - 80, 590, 26, 50);
    ctx.strokeStyle = rimC; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo((hx0 + hx1) / 2, 578); ctx.lineTo(hx1 + 24, top + 2); ctx.stroke();
    ctx.fillStyle = P.night0; ctx.fillRect(hx1 - 76, 720, 44, 86);
    // the window and its bulb (the hero)
    const flick = t < tBulb ? (t > tBulb - .22 ? .35 * (Math.sin((t - tBulb) * 90) > 0 ? 1 : 0) : 0) : 1;
    const lit = Math.max(flick * (t > tBulb - .22 ? 1 : 0), expoOut(span(t, tBulb, tBulb + .5))) * (1 - .15 * sky.day);
    ctx.fillStyle = mixHex('#141a3a', P.halo0, lit); ctx.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
    if (lit > 0) {
      ctx.fillStyle = rgba(P.core0, lit); ctx.beginPath(); ctx.arc(ROOT[0], ROOT[1] - 4, 9, 0, 6.29); ctx.fill();
      halo(ctx, ROOT[0], ROOT[1] - 4, 210, .75 * lit, P.halo1, P.core0);
      ctx.save(); ctx.globalAlpha = .55 * lit; E.lightPool(ctx, WIN.x - 4, WIN.x + WIN.w + 4, HOUSE.y + 2, 60, 90, 1); ctx.restore();
    }
    ctx.strokeStyle = P.night1; ctx.lineWidth = 4; ctx.strokeRect(WIN.x, WIN.y, WIN.w, WIN.h); ctx.beginPath(); ctx.moveTo(WIN.x + WIN.w / 2, WIN.y); ctx.lineTo(WIN.x + WIN.w / 2, WIN.y + WIN.h); ctx.stroke();
    // fence
    ctx.fillStyle = mixHex(P.night1, P.ind2, .5);
    for (let x = FENCE.x0; x <= FENCE.x1; x += 64) ctx.fillRect(x, FENCE.y - 52, 8, 52);
    ctx.fillRect(FENCE.x0, FENCE.y - 42, FENCE.x1 - FENCE.x0, 5); ctx.fillRect(FENCE.x0, FENCE.y - 22, FENCE.x1 - FENCE.x0, 5);
    ctx.restore();
    // the newspaper on the ground, its pages riffle in the wind ("in the years after")
    if (t >= tL) sheetFace(ctx, paperW, { after: (cx, s) => riffle(cx, s, t) });
    // the pole, the farmers, the wire
    poleAndFarmers(ctx, t, sky);
  }
  function riffle(ctx, s, t) {
    for (let i = 0; i < 3; i++) {
      const u = sineIO(span(t, a.years - .25 + i * .42, a.years + .5 + i * .42)); if (u <= 0 || u >= 1) continue;
      const th = u * Math.PI, X = (s.w / 2) * Math.cos(th), L = (s.w / 2) * Math.sin(th) * .55 / s.sy;
      const p = new Path2D(); p.moveTo(0, -s.h / 2); p.lineTo(0, s.h / 2); p.lineTo(X, s.h / 2 - L); p.lineTo(X, -s.h / 2 - L); p.closePath();
      ctx.fillStyle = mixHex(COL.paper2, COL.paper0, .45 + .55 * Math.abs(Math.cos(th))); ctx.fill(p);
      ctx.strokeStyle = rgba(COL.ink2, .2); ctx.lineWidth = 1.5; ctx.stroke(p);
    }
  }
  function poleAndFarmers(ctx, t, sky) {
    if (t < tCarry0 - .1) return;
    const cxW = herm(t, tCarry0, tCarry1, -520, 1030, 0, 0), walking = t < tCarry1 + .05;
    const ph = sramp(t, tRaise0, tRaise1), phi = ph * Math.PI / 2, settle = ramp(t, tRaise0, tRaise0 + .5);
    const bx = lerp(cxW + 170, POLE.x, settle), by = lerp(FARMER_Y - FARMER_H * .74, POLE.y, settle);
    const tipX = bx - POLE.L * Math.cos(phi), tipY = by - POLE.L * Math.sin(phi);
    // the farmers (indigo; never yellow)
    const xs = [cxW - 140, cxW, cxW + 140];
    xs.forEach((x, i) => {
      const lift = ramp(t, tRaise0 + i * .1, tRaise0 + .6 + i * .1) * (1 - ramp(t, tRaise1 + .3, tRaise1 + 1.2));
      E.person(ctx, x, FARMER_Y, FARMER_H - i * 6, {
        dir: 1, walk: walking ? (x / (FARMER_H * .16)) + i : undefined, view: walking ? 'side' : undefined,
        armR: walking ? [2.55, 3.05] : [lerp(.2, 2.7, lift), lerp(.1, 2.95, lift)], armL: walking ? [-2.6, -3.0] : [lerp(-.2, -2.6, lift), lerp(-.1, -2.9, lift)],
        look: .3 + .5 * lift + .1 * Math.sin(t * .7 + i), light: -1, rim: mixHex(P.halo1, P.blue0, .6),
      });
    });
    // the pole (wood)
    ctx.save(); ctx.strokeStyle = mixHex('#4a3a3a', P.night1, .3); ctx.lineCap = 'round'; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tipX, tipY); ctx.stroke();
    ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx + 4, by); ctx.lineTo(tipX + 4, tipY); ctx.stroke();
    // crossbar at the top
    const cbx = bx - (POLE.L - 26) * Math.cos(phi), cby = by - (POLE.L - 26) * Math.sin(phi), nx = Math.sin(phi), ny = -Math.cos(phi);
    ctx.strokeStyle = mixHex('#4a3a3a', P.night1, .3); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cbx - nx * 34, cby - ny * 34); ctx.lineTo(cbx + nx * 34, cby + ny * 34); ctx.stroke();
    ctx.restore();
    // the wire to the house (a sagging line that runs from the pole to the eave)
    const uw = sramp(t, tWire0, tWire1);
    if (uw > 0) {
      const A = [cbx + nx * 30, cby + ny * 30], Bp = [HOUSE.x0 + 6, 668], pts = [];
      for (let i = 0; i <= 24; i++) { const s = i / 24; pts.push([lerp(A[0], Bp[0], s), lerp(A[1], Bp[1], s) + 46 * Math.sin(Math.PI * s)]); }
      B.inkLine(ctx, pts, uw, { col: mixHex(P.night0, P.halo1, .25 + .5 * ramp(t, tBulb, tBulb + .4)), w: 3 });
      if (uw < 1) { const q = pts[Math.floor(uw * 24)]; halo(ctx, q[0], q[1], 40, .5, P.halo1, P.core0); }
    }
  }

  // ------------------------------------------------------------------------------------------------ PLAIN
  function plain(ctx, t, sky, k) {
    if (t < tSpread0 || t > a.allof) return;
    const off = 1 - .9 * sky.day;
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 1; i < NODES.length; i++) {
      const [x, y, d, pi] = NODES[i], t0 = tSpread0 + Math.pow(d / DMAX, .75) * (tSpread1 - tSpread0), u = span(t, t0, t0 + .35);
      if (u <= 0) continue;
      const [px, py] = NODES[pi];
      ctx.strokeStyle = rgba(P.halo1, .32 * off); ctx.lineWidth = 2.2 / Math.max(.4, k);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(lerp(px, x, u), lerp(py, y, u)); ctx.stroke();
      if (u >= 1) {
        const l = expoOut(span(t, t0 + .35, t0 + .7)) * off * (.85 + .15 * Math.sin(t * 2 + i));
        halo(ctx, x, y, 34 / Math.max(.4, k), .55 * l, P.halo1, P.core0);
        ctx.fillStyle = rgba(P.core0, l); ctx.beginPath(); ctx.arc(x, y, 3.2 / Math.max(.4, k), 0, 6.29); ctx.fill();
      }
    }
    ctx.restore();
  }

  // ------------------------------------------------------------------------------------------------ FIELD
  function field(ctx, t, sky) {
    if (t < a.today - 1 || t > a.missing + 1) return;
    const g = mixHex(mixHex(sky.g0, GREEN, .2 + .55 * sky.day), P.night1, .2);
    const p = new Path2D(); p.moveTo(HILL[0][0], 3000); for (const [x, y] of HILL) p.lineTo(x, y); p.lineTo(HILL[HILL.length - 1][0], 3000); p.closePath();
    // the green lies on the plain's ground and thins out to both sides (no edge): horizontal alpha ramp, then the vertical shade
    ctx.save(); ctx.clip(p);
    ctx.fillStyle = lin(ctx, 2900, 0, 6100, 0, [[0, rgba(sky.g0, 0)], [.22, rgba(sky.g0, 1)], [.85, rgba(sky.g0, 1)], [1, rgba(sky.g0, 0)]]); ctx.fillRect(2900, 400, 3200, 2600);
    ctx.globalCompositeOperation = 'source-atop';
    const gm = lin(ctx, 2900, 0, 6100, 0, [[0, rgba(g, 0)], [.22, rgba(g, 1)], [.85, rgba(g, 1)], [1, rgba(g, 0)]]);
    ctx.fillStyle = gm; ctx.fillRect(2900, 400, 3200, 2600);
    ctx.restore();
    ctx.save(); ctx.strokeStyle = lin(ctx, 2900, 0, 6100, 0, [[0, rgba(P.halo2, 0)], [.25, rgba(mixHex(P.halo2, P.blue0, sky.dark), .35)], [.85, rgba(mixHex(P.halo2, P.blue0, sky.dark), .35)], [1, rgba(P.halo2, 0)]]);
    ctx.lineWidth = 2.5; ctx.beginPath(); HILL.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
    // grass in the wind
    ctx.save(); ctx.strokeStyle = rgba(mixHex(g, P.halo2, .35), .55); ctx.lineWidth = 2; ctx.lineCap = 'round';
    for (const [x, y, l, ph] of GRASS) { const w = 5 * Math.sin(t * 1.7 + ph + x * .004); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + w * .4, y - l * .6, x + w, y - l); ctx.stroke(); }
    ctx.restore();
    // the houses on the hill (their windows light when the duct's light reaches them)
    for (const [x, y, i] of HOMES) {
      ctx.fillStyle = mixHex(P.night1, g, .25); ctx.fillRect(x - 34, y - 34, 68, 34);
      ctx.beginPath(); ctx.moveTo(x - 40, y - 33); ctx.lineTo(x, y - 60); ctx.lineTo(x + 40, y - 33); ctx.closePath(); ctx.fill();
      const l = expoOut(span(t, tPulse0 + .5 + i * .14, tPulse0 + .9 + i * .14));
      ctx.fillStyle = mixHex('#1a2040', P.halo0, l); ctx.fillRect(x - 10, y - 26, 20, 16);
      if (l > 0) halo(ctx, x, y - 18, 70, .5 * l, P.halo1, P.core0);
    }
    // the trench: a dark cut that runs along the slope behind the diggers; the duct goes in behind it
    const uDig = sramp(t, tDig0, tDig1), xf = lerp(3600, 5060, uDig), xd = lerp(3600, 5060, sramp(t, tDig0 + .7, tDig1 + .35));
    const segGone = t >= tSeg0;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const pathTo = (x1) => { const pp = new Path2D(); let first = true; for (const [x, y] of TR) { if (x > x1) { pp.lineTo(x1, trY(x1)); break; } first ? pp.moveTo(x, y) : pp.lineTo(x, y); first = false; } return pp; };
    if (xf > 3602) {
      ctx.strokeStyle = rgba(mixHex(g, '#3b2c2a', .5), .9); ctx.lineWidth = 22; ctx.stroke(pathTo(xf));   // the spoil beside it
      ctx.strokeStyle = P.night0; ctx.lineWidth = 11; ctx.stroke(pathTo(xf));
    }
    const xdd = Math.min(xd, segGone ? SEG_X : 5060);
    if (xdd > 3602) {
      ctx.strokeStyle = DUCT.lo; ctx.lineWidth = 8; ctx.stroke(pathTo(xdd));
      ctx.strokeStyle = DUCT.c; ctx.lineWidth = 5; ctx.stroke(pathTo(xdd));
      ctx.strokeStyle = rgba(DUCT.hi, .8); ctx.lineWidth = 1.6; ctx.save(); ctx.translate(0, -2); ctx.stroke(pathTo(xdd)); ctx.restore();
      // the light runs through it ("own the network")
      const up = span(t, tPulse0, tPulse1);
      if (up > 0) {
        const xp = lerp(3600, 5060, sineIO(up)), glowA = ramp(t, tPulse0, tPulse0 + .6) * (1 - .5 * ramp(t, a.allof, a.none));
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo0, .45 * glowA); ctx.lineWidth = 4; ctx.stroke(pathTo(Math.min(xp, xdd))); ctx.restore();
        if (up < 1) halo(ctx, xp, trY(xp), 90, .8, P.halo1, P.core0);
      }
    }
    ctx.restore();
    // the diggers (indigo, boots, spades)
    DIGGERS.forEach(([x, dir, ph], i) => {
      const y = trY(x) - 8, sw = Math.sin(t * 3.1 + ph), work = ramp(t, tDig0 - 1.5, tDig0) * (1 - ramp(t, a.ownN, a.ownN + .8));
      const hands = E.person(ctx, x, y, 186 - (i % 2) * 8, {
        dir, lean: (.1 + .07 * sw) * work, look: .55 * (1 - work) * ramp(t, a.ownN, a.ownN + .8) - .2 * work,
        armR: [lerp(.4, 1.5 + .45 * sw, work), lerp(.2, 2.1 + .35 * sw, work)], armL: [lerp(-.3, 1.2 + .4 * sw, work), lerp(-.1, 1.9 + .3 * sw, work)],
        light: dir, rim: mixHex(P.halo1, P.blue0, .5 + .5 * sky.dark),
      });
      const hx = hands.R[0], hy = hands.R[1], tipx = x + dir * 70, tipy = y + 6 - 18 * Math.max(0, sw) * work;
      ctx.save(); ctx.strokeStyle = mixHex('#4a3a3a', P.night1, .2); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tipx, tipy); ctx.stroke();
      const ang = Math.atan2(tipy - hy, tipx - hx); ctx.translate(tipx, tipy); ctx.rotate(ang); ctx.fillStyle = mixHex(P.blue1, P.cream, .25); ctx.fillRect(-2, -8, 20, 16); ctx.restore();
    });
    // the last piece of duct, before it flies
    if (!segGone && xd >= 5060) ductPiece(ctx, (SEG_X + 5060) / 2, trY(4995) - 1, 130, Math.atan2(trY(5060) - trY(SEG_X), 5060 - SEG_X));
  }
  function ductPiece(ctx, x, y, len, rot, glow = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = DUCT.lo; ctx.beginPath(); ctx.roundRect(-len / 2, -5, len, 10, 5); ctx.fill();
    ctx.fillStyle = DUCT.c; ctx.beginPath(); ctx.roundRect(-len / 2, -4, len, 6.5, 3.5); ctx.fill();
    ctx.fillStyle = rgba(DUCT.hi, .85); ctx.fillRect(-len / 2 + 4, -3.4, len - 8, 1.6);
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(len / 2, 0, 2.2, 4.6, 0, 0, 6.29); ctx.fill();
    ctx.restore();
    if (glow > 0) halo(ctx, x, y, 60, .4 * glow, P.halo1, P.core0);
  }

  // ------------------------------------------------------------------------------------------------ TABLE · A3 · the RULE
  function station(ctx, t, sky) {
    if (t < a.north) return;
    const eve = 1 - sky.day, lampL = ramp(t, a.allof, a.protects + .4) * (1 + .06 * Math.sin(t * 1.3)) * (1 - .5 * ramp(t, a.theway, a.y1844 + 1));
    // the lamp post
    ctx.save();
    ctx.fillStyle = mixHex(P.night1, P.ind2, .4); ctx.fillRect(LAMP.x - 5, LAMP.top, 10, LAMP.y - LAMP.top); ctx.fillRect(LAMP.x - 16, LAMP.y - 10, 32, 10);
    ctx.beginPath(); ctx.moveTo(LAMP.x - 22, LAMP.top + 4); ctx.lineTo(LAMP.x + 22, LAMP.top + 4); ctx.lineTo(LAMP.x + 14, LAMP.top - 36); ctx.lineTo(LAMP.x - 14, LAMP.top - 36); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex('#26304e', P.core1, lampL); ctx.fillRect(LAMP.x - 11, LAMP.top - 30, 22, 30);
    ctx.restore();
    if (lampL > 0) {
      halo(ctx, LAMP.x, LAMP.top - 16, 520, .45 * lampL, P.halo1, P.core0);
      ctx.save(); ctx.globalAlpha = .4 * lampL; E.lightPool(ctx, LAMP.x - 30, LAMP.x + 30, 760, 220, 120, 1); ctx.restore();
    }
    const u3 = ramp(t, t3, t3 + .6);                                     // the table turns into the rail
    const railR = expoOut(span(t, t3 + .1, t3 + 1.7)), sl = ramp(t, t3 + .4, t3 + 1.6);
    // rail (grows out of the table top to both sides)
    if (t >= t3) B.rail(ctx, lerp(TABLE.x0, TABLE.x0 - 4200, railR), lerp(TABLE.x1, TABLE.x1 + 4200, railR), RAILY, t, { sleepers: sl, ballast: sl, rim: .4 + .6 * u3, w: 8 });
    // the table: plank + legs (the legs draw up into the plank, the plank thins into the rail)
    if (u3 < 1) {
      const th = lerp(16, 8, u3), legs = TABLE.legs * (1 - u3);
      ctx.fillStyle = mixHex('#3c2f3c', P.night1, .2);
      for (const lx of [TABLE.x0 + 26, TABLE.x1 - 36]) ctx.fillRect(lx, TABLE.y + th - 2, 10, legs);
      ctx.fillStyle = lin(ctx, 0, TABLE.y, 0, TABLE.y + th, [[0, mixHex('#5a4646', P.halo1, .3 * lampL)], [1, '#2c2333']]); ctx.fillRect(TABLE.x0, TABLE.y, TABLE.x1 - TABLE.x0, th);
      ctx.fillStyle = rgba(P.halo1, .5 * lampL); ctx.fillRect(TABLE.x0, TABLE.y - 1, TABLE.x1 - TABLE.x0, 2);
    }
    const car = t >= tCarUp0;
    if (car) carBack(ctx, t);
    // riders inside the car (seen through the door)
    if (car) riders(ctx, t, true);
    if (car) carBody(ctx, t, sky);
    pieces(ctx, t, lampL);
    machine(ctx, t);
    if (car) riders(ctx, t, false);
  }
  function pieces(ctx, t, lampL) {
    if (t > tCarUp1 + 1.5) return;
    // bulb → the lamp inside the car
    { const u = fly(t, 0), [x, y] = arc([PIECES.bulb[0], PIECES.bulb[1] - 26], [6005, CAR.top + 40], u, 120), r = 12 * (1 - .4 * u);
      if (u < 1) { ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill(); ctx.fillStyle = mixHex(P.night1, P.blue1, .4); ctx.fillRect(x - 5, y + r - 2, 10, 9); halo(ctx, x, y, 90, .6, P.halo1, P.core0); } }
    // door (small, open, lit) → the car's door
    { const u = fly(t, 1); if (u < 1) {
      const p0 = [PIECES.door[0], PIECES.door[1] - 40], p1 = [DOORX, (CAR.door.y0 + CAR.door.y1) / 2], [x, y] = arc(p0, p1, u, 90);
      const w = lerp(36, CAR.door.x1 - CAR.door.x0, u), h = lerp(74, CAR.door.y1 - CAR.door.y0, u);
      ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fillRect(x - w / 2 - 4, y - h / 2 - 4, w + 8, h + 4);
      ctx.fillStyle = lin(ctx, 0, y - h / 2, 0, y + h / 2, [[0, P.core1], [1, P.halo1]]); ctx.fillRect(x - w / 2, y - h / 2, w, h);
      ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.fillRect(x - w / 2, y - h / 2, w * .3, h);
      halo(ctx, x, y, 70, .35, P.halo1, P.core0);
    } }
    // the wafer wedge (gold) → the lantern at the car's end
    { const u = fly(t, 2); if (u < 1) {
      const [x, y] = arc([PIECES.wedge[0], PIECES.wedge[1] - 8], [CAR.x1 + 4, CAR.yb - 52], u, 140), s = 1 - .45 * u;
      ctx.save(); ctx.translate(x, y); ctx.rotate(-.3 + u * (Math.PI * 2 - .3)); ctx.scale(s, s);
      ctx.fillStyle = lin(ctx, -30, 0, 30, 0, [[0, P.shade0], [.5, P.halo0], [1, P.core1]]); ctx.beginPath(); ctx.moveTo(-34, 6); ctx.lineTo(34, 6); ctx.lineTo(0, -10); ctx.closePath(); ctx.fill(); ctx.restore();
      halo(ctx, x, y, 50, .3, P.halo1, P.core0);
    } }
    // the APERTUS file → the plate on the car's side
    { const u = fly(t, 3); if (u < 1) {
      const [x, y] = arc([PIECES.file[0], PIECES.file[1] - 32], [5900, CAR.yb - 34], u, 110), w = lerp(46, 52, u), h = lerp(60, 18, u);
      ctx.fillStyle = COL.paper0; ctx.beginPath(); ctx.moveTo(x - w / 2, y - h / 2); ctx.lineTo(x + w / 2 - 10 * (1 - u), y - h / 2); ctx.lineTo(x + w / 2, y - h / 2 + 10 * (1 - u)); ctx.lineTo(x + w / 2, y + h / 2); ctx.lineTo(x - w / 2, y + h / 2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba(COL.ink2, .5); for (let i = 0; i < 4; i++) ctx.fillRect(x - w * .35, y - h * .3 + i * h * .18, w * (.7 - (i % 2) * .2), Math.max(1, h * .05));
    } }
    // the duct piece: flies over from the trench, lands on the table; then rises and bends into the roof trim
    if (t >= tSeg0) {
      const uf = sramp(t, tSeg0, tSeg1), p0 = [(SEG_X + 5060) / 2, trY(4995)], p3 = [PIECES.duct[0], PIECES.duct[1] - 6];
      const q = (s) => { const P1 = [5300, 420], P2 = [5900, 360]; const m = 1 - s; return [m ** 3 * p0[0] + 3 * m * m * s * P1[0] + 3 * m * s * s * P2[0] + s ** 3 * p3[0], m ** 3 * p0[1] + 3 * m * m * s * P1[1] + 3 * m * s * s * P2[1] + s ** 3 * p3[1]]; };
      const u2 = fly(t, 4);
      if (u2 <= 0) { const [x, y] = q(uf), r0 = Math.atan2(trY(5060) - trY(SEG_X), 130); ductPiece(ctx, x, y, 130, lerp(r0, -Math.PI * 2, uf) + .06 * Math.sin(t * 3) * (1 - uf), .5 * bump(uf, 0, 1)); }
      else if (u2 < 1) { const [x, y] = arc(p3, [(CAR.x0 + CAR.x1) / 2, CAR.top - 6], u2, 80); ductPiece(ctx, x, y, lerp(130, CAR.x1 - CAR.x0 - 20, u2), 0, .4); }
    }
    // the chair → the seat behind the middle window
    { const u = fly(t, 5); if (u < 1) {
      const [x, y] = arc([CHAIR.x, CHAIR.y], [6005, CAR.top + 120], u, 130), s = 1 - .55 * u;
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = mixHex('#3c2f3c', P.night1, .2);
      ctx.fillRect(-34, -80, 68, 9); ctx.fillRect(-32, -80, 7, 80); ctx.fillRect(25, -80, 7, 80); ctx.fillRect(25, -190, 7, 110); ctx.fillRect(-32, -190 + 0, 7, 0); ctx.fillRect(-4, -186, 36, 7); ctx.fillRect(-4, -150, 36, 6);
      const seatGlow = bump(t, a.seat - .2, a.seat + 1.6) * (1 - u);
      ctx.fillStyle = rgba(P.halo1, .35 + .45 * seatGlow); ctx.fillRect(-34, -81, 68, 2); ctx.fillRect(31, -190, 1.5, 110);
      ctx.restore();
      if (seatGlow > 0) halo(ctx, x, y - 80, 120, .3 * seatGlow, P.halo1, P.core0);
    } }
  }
  // the car: interior light (behind), body with the door cut out (front), lantern, trim, light pool
  function carShape() {   // a small coach: straight sides, an arched roof
    const p = new Path2D(), { x0, x1, yb, top } = CAR;
    p.moveTo(x0, yb - 10); p.lineTo(x0, top + 26); p.quadraticCurveTo(x0, top + 6, x0 + 26, top + 2); p.quadraticCurveTo((x0 + x1) / 2, top - 16, x1 - 26, top + 2);
    p.quadraticCurveTo(x1, top + 6, x1, top + 26); p.lineTo(x1, yb - 10); p.quadraticCurveTo(x1, yb, x1 - 10, yb); p.lineTo(x0 + 10, yb); p.quadraticCurveTo(x0, yb, x0, yb - 10); p.closePath(); return p;
  }
  function roofLine() { const p = new Path2D(), { x0, x1, top } = CAR; p.moveTo(x0 + 14, top + 5); p.quadraticCurveTo(x0 + 18, top + 1, x0 + 30, top + 1); p.quadraticCurveTo((x0 + x1) / 2, top - 17, x1 - 30, top + 1); p.quadraticCurveTo(x1 - 18, top + 1, x1 - 14, top + 5); return p; }
  function carClip(ctx, t) { const g = carGrow(t); ctx.beginPath(); ctx.rect(CAR.x0 - 40, RAILY + 2 - (CAR.h + 70) * g, CAR.x1 - CAR.x0 + 80, (CAR.h + 70) * g); ctx.clip(); }
  function carBack(ctx, t) {
    const lit = carLit(t), d = CAR.door, dy = carDrop(t);
    ctx.save(); carClip(ctx, t); ctx.translate(0, dy);
    ctx.fillStyle = lin(ctx, 0, d.y0, 0, d.y1, [[0, mixHex(P.night1, P.core1, lit)], [1, mixHex(P.night1, P.halo1, lit)]]); ctx.fillRect(d.x0, d.y0, d.x1 - d.x0, d.y1 - d.y0);
    for (const [x0, x1] of CARWIN) { ctx.fillStyle = lin(ctx, 0, CAR.top + 28, 0, CAR.top + 92, [[0, mixHex(P.night1, P.core1, lit)], [1, mixHex(P.night1, P.halo1, lit)]]); ctx.fillRect(x0, CAR.top + 28, x1 - x0, 64); }
    // seats (the chair is the middle one)
    // seat backs in the windows (the chair became the one in the middle window)
    const wb = CAR.top + 92; ctx.fillStyle = mixHex(P.night1, '#3c2f3c', .4);
    for (const x of [5846, 5890, 5968, 6176]) { ctx.beginPath(); ctx.roundRect(x, wb - 24, 22, 30, 7); ctx.fill(); }
    if (fly(t, 5) >= 1) { ctx.beginPath(); ctx.roundRect(6012, wb - 30, 24, 36, 7); ctx.fill(); ctx.fillStyle = rgba(P.halo1, .7); ctx.fillRect(6034, wb - 26, 2, 26); }
    ctx.restore();
  }
  function carBody(ctx, t, sky) {
    const g = carGrow(t), lit = carLit(t), dy = carDrop(t), d = CAR.door;
    if (g <= 0) return;
    ctx.save(); carClip(ctx, t); ctx.translate(0, dy);
    let shell = carShape();
    { const h = new Path2D(); h.rect(d.x0, d.y0, d.x1 - d.x0, d.y1 - d.y0 + 4); shell = shell.op(h, PathOp.Difference); }
    for (const [x0, x1] of CARWIN) { const h = new Path2D(); h.roundRect(x0, CAR.top + 28, x1 - x0, 64, 8); shell = shell.op(h, PathOp.Difference); }
    ctx.fillStyle = lin(ctx, 0, CAR.top, 0, CAR.yb, [[0, mixHex(P.ind2, P.blue1, .45)], [.2, P.ind2], [1, P.night1]]); ctx.fill(shell);
    
    // roof trim = the duct (once it has arrived)
    if (fly(t, 4) >= 1) { ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = DUCT.lo; ctx.lineWidth = 8; ctx.stroke(roofLine()); ctx.strokeStyle = DUCT.c; ctx.lineWidth = 4.5; ctx.translate(0, -1.5); ctx.stroke(roofLine()); ctx.restore(); }
    // the side plate (the file) and the lantern (the wedge)
    if (fly(t, 3) >= 1) { ctx.fillStyle = COL.paper0; ctx.fillRect(5874, CAR.yb - 43, 52, 18); }
    if (fly(t, 2) >= 1) { const lx = CAR.x1 + 6, ly = CAR.yb - 52; ctx.fillStyle = P.night0; ctx.fillRect(lx - 9, ly - 12, 18, 26); ctx.fillStyle = P.core1; ctx.fillRect(lx - 6, ly - 8, 12, 18); ctx.fillStyle = P.halo0; ctx.beginPath(); ctx.moveTo(lx - 12, ly - 12); ctx.lineTo(lx + 12, ly - 12); ctx.lineTo(lx, ly - 22); ctx.closePath(); ctx.fill(); halo(ctx, lx, ly, 120, .55, P.halo1, P.core0); }
    // underframe, two bogies
    ctx.fillStyle = P.night0; ctx.fillRect(CAR.x0 + 20, CAR.yb, CAR.x1 - CAR.x0 - 40, 10);
    for (const bx of [CAR.x0 + 70, CAR.x1 - 70]) for (const o of [-24, 24]) {
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(bx + o, RAILY - 14, 15, 0, 6.29); ctx.fill();
      ctx.strokeStyle = rgba(P.halo1, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx + o, RAILY - 14, 11, -2.6 + t * 0, -1.0); ctx.stroke();
    }
    // the step below the door (riders board from the ground)
    ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fillRect(d.x0 + 6, d.y1 + 10, d.x1 - d.x0 - 12, 5); ctx.fillRect(d.x0 + 10, d.y1 + 40, d.x1 - d.x0 - 20, 5);
    ctx.restore();
    if (lit > 0) {
      halo(ctx, 6005, CAR.top + 60, 330, .35 * lit, P.halo1, P.core0);
      ctx.save(); ctx.globalAlpha = .5 * lit; E.lightPool(ctx, CAR.x0 + 20, CAR.x1 - 20, RAILY + 30, 80, 110, 1); ctx.restore();
    }
  }
  // the ticket machine (rises out of the ground) and what falls into it
  function machine(ctx, t) {
    if (t < tMach0) return;
    const g = sramp(t, tMach0, tMach1), sh = (tc) => (t > tc + .05 ? 3 * Math.exp(-(t - tc - .05) * 10) * Math.sin((t - tc) * 50) : 0);
    const dx = sh(tCoin) + .4 * sh(tRec) + .7 * sh(tPlug), m = MACH, x0 = m.x - m.w / 2, y0 = m.y - m.h;
    ctx.save(); ctx.beginPath(); ctx.rect(x0 - 40, m.y - (m.h + 40) * g, m.w + 80, (m.h + 40) * g + 2); ctx.clip();
    ctx.translate(dx, (1 - g) * 30);
    ctx.fillStyle = lin(ctx, x0, 0, x0 + m.w, 0, [[0, P.night1], [.6, mixHex(P.ind2, P.blue1, .3)], [1, mixHex(P.ind2, P.blue1, .5)]]); ctx.beginPath(); ctx.roundRect(x0, y0, m.w, m.h, 10); ctx.fill();
    ctx.fillStyle = rgba(P.halo1, .55); ctx.fillRect(x0 + 8, y0, m.w - 16, 2);
    ctx.fillStyle = P.night0; ctx.fillRect(m.x - 24, m.slot - 4, 48, 8);                                  // the slot on top
    const scr = .5 + .5 * ramp(t, tCoin, tCoin + .3);
    ctx.fillStyle = mixHex(COL.coolDeep, COL.cool, .35 * scr); ctx.fillRect(m.x - 26, y0 + 46, 52, 34);    // a small screen
    ctx.fillStyle = P.night0; ctx.fillRect(m.x - 30, y0 + 120, 60, 10);                                    // the mouth
    ctx.restore();
    if (scr > .5) halo(ctx, m.x, y0 + 63, 70, .25 * scr, COL.cool2, COL.cool);
    const clipAbove = () => { ctx.beginPath(); ctx.rect(m.x - 600, -4000, 1200, 4000 + m.slot); ctx.clip(); };
    // coin: heavy, fast, a short hard stop
    { const u = span(t, tCoin - .55, tCoin); if (u > 0 && t < tCoin + .1) { ctx.save(); clipAbove(); const y = lerp(40, m.slot + 8, u * u); ctx.translate(m.x, y); ctx.scale(Math.max(.15, Math.abs(Math.cos(t * 9))), 1); B.coin(ctx, 0, 0, 20, { lit: 1 }); ctx.restore(); } }
    // tax receipt: light paper, sways down
    { const u = span(t, tRec - 1.1, tRec); if (u > 0 && t < tRec + .2) { ctx.save(); clipAbove(); const y = lerp(40, m.slot + 30, sineIO(u)), x = m.x + 60 * Math.sin(u * 7) * (1 - u), r = .5 * Math.sin(u * 7 + .6) * (1 - u) + Math.PI / 2 * u;
      ctx.translate(x, y); ctx.rotate(r); const p = new Path2D(); p.rect(-20, -28, 40, 56); B.paperFill(ctx, p, { lum: .9, seed: 77 }); ctx.fillStyle = rgba(COL.ink2, .5); for (let i = 0; i < 5; i++) ctx.fillRect(-14, -20 + i * 9, 24 - (i % 2) * 8, 2); ctx.restore(); } }
    // grid plug: drops on its cable
    { const u = span(t, tPlug - .7, tPlug); if (u > 0 && t < tPlug + .9) { ctx.save(); clipAbove(); const y = lerp(-60, m.slot + 34, Math.min(1, u * u * 1.0)) + Math.max(0, t - tPlug) * 260;
      ctx.strokeStyle = P.night0; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(m.x + 4, -400); ctx.lineTo(m.x + 4, y - 20); ctx.stroke();
      ctx.fillStyle = mixHex(P.ind2, P.cream, .25); ctx.fillRect(m.x - 12, y - 22, 32, 26); ctx.fillStyle = COL.cool; ctx.fillRect(m.x - 6, y + 4, 4, 12); ctx.fillRect(m.x + 6, y + 4, 4, 12); ctx.restore(); } }
  }
  // riders: inside (clipped to the door, before the body) or outside (in front)
  function riderState(r, t) {
    // walk in from the left (offscreen while the camera is on the ticket), wait, walk to the door, step up, walk in
    if (t < r.tIn0) return null;
    let x, y = GROUND_Y, walk = null, inside = false, step = 0;
    if (t < r.tIn1) { x = herm(t, r.tIn0, r.tIn1, r.x - 760, r.x, 300, 0); walk = x / (PH * .16); }
    else if (t < r.tGo) x = r.x;
    else if (t < r.tStep) { x = lerp(r.x, DOORX, span(t, r.tGo, r.tStep)); walk = x / (PH * .16); }
    else { const u = span(t, r.tStep, r.tStep + .38); step = u; x = DOORX + 4 * u; y = lerp(GROUND_Y, CAR.door.y1 - 2, sineIO(u)) - 10 * Math.sin(Math.PI * u); if (u >= 1) { inside = true; x = DOORX + 4 + 120 * span(t, r.tStep + .38, r.tStep + 1.1); walk = x / (PH * .16); } }
    return { x, y, walk, inside, step };
  }
  function riderRaise(r, t) { return r.kind === 'student' ? ramp(t, tHand0 - .3, tHand1 - .2) : ramp(t, r.tGo - 1.1, r.tGo - .5); }
  function riders(ctx, t, inside) {
    if (t < RIDERS[0].tIn0) return;
    for (const r of [...RIDERS].reverse()) {
      const s = riderState(r, t); if (!s || s.inside !== inside) continue;
      if (inside && t > r.tStep + 1.2) continue;
      ctx.save();
      if (inside) { ctx.beginPath(); ctx.rect(CAR.door.x0, CAR.door.y0, CAR.door.x1 - CAR.door.x0, CAR.door.y1 - CAR.door.y0 + 2); ctx.clip(); }
      const showT = r.kind === 'student' ? span(t, tHand1 - .1, tHand1 + .2) : ramp(t, r.tGo - .9, r.tGo - .5);
      const raise = riderRaise(r, t);
      const o = { dir: 1, walk: s.walk ?? undefined, view: s.walk != null ? 'side' : undefined, look: .25 + .15 * raise, light: -1, rim: mixHex(P.halo1, P.blue0, .4),
        armR: [lerp(.2, 2.0, raise), lerp(.1, 2.3, raise)], long: r.kind === 'nurse' };
      if (r.kind === 'student') { ctx.fillStyle = mixHex(P.ind2, P.blue1, .3); ctx.beginPath(); ctx.roundRect(s.x - PH * .2, s.y - PH * .78, PH * .16, PH * .28, 6); ctx.fill(); }
      const hands = r.kind === 'nurse' ? B.worker(ctx, s.x, s.y, PH, t, { ...o, seed: 3 }) : E.person(ctx, s.x, s.y, PH - (r.kind === 'duo' ? 8 : 0), o);
      if (r.kind === 'student') { ctx.fillStyle = mixHex(P.ind2, P.blue1, .45); ctx.beginPath(); ctx.roundRect(s.x - PH * .2, s.y - PH * .78, PH * .1, PH * .28, 5); ctx.fill(); }
      if (r.kind === 'laptop') { const [lx, ly] = hands.L; ctx.fillStyle = mixHex(COL.coolDeep, COL.cool, .5); ctx.fillRect(lx - 4, ly - 30, 34, 22); halo(ctx, lx + 12, ly - 19, 50, .3, COL.cool2, COL.cool); }
      if (r.kind !== 'student' && raise > 0) ticketNew(ctx, hands.R[0] + 6, hands.R[1] - 8, 30, -.2, { glow: .6 * raise, a: 1 });
      if (r.kind === 'student' && t >= tHand1) ticketNew(ctx, hands.R[0] + 6, hands.R[1] - 8, 30, -.2, { glow: .6, rows: TROWS(t) });
      ctx.restore();
    }
  }
  // today's ticket from the machine: its rows
  function TROWS(t) {
    return [['One basic service', .2, true, 1], ['GOOD, UP-TO-DATE', .085, false, span(t, a.uptodate - .2, a.uptodate + .5)], ['ARTIFICIAL INTELLIGENCE', .085, false, span(t, a.uptodate + .1, a.uptodate + .8)],
      ['SMALL FIXED PRICE', .085, false, span(t, a.smallp - .1, a.smallp + .6)], ['EVERY DAY', .085, false, span(t, a.everyday - .1, a.everyday + .6)]];
  }

  // ================================================================================================ type (screen space)
  function texts(ctx, t, c) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // 42 million (counts up to the word)
    if (t > a.forty - .8 && t < a.north + .6) {
      const n = Math.round(42 * expoOut(span(t, a.forty - .5, a.forty + .35)));
      label(ctx, [[`${n} million`, 120, P.cream, true], ['PEOPLE · ~900 CO-OPS · NRECA', 34]], 150, 250, span(t, a.forty - .6, a.forty + .5), { out: span(t, a.north - .5, a.north + .3) });
    }
    if (t > a.villagers - .3 && t < a.none) label(ctx, [['B4RN · ~15,000 HOMES', 34], ['OWNED BY ITS MEMBERS', 34]], 150, 200, span(t, a.villagers - .2, a.villagers + .7), { out: span(t, a.allof - .3, a.allof + .4) });
    if (t > a.penny - .3 && t < a.rule + .8) {
      const out = span(t, a.rule - .25, a.rule + .45);
      label(ctx, [['The penny train', 96, P.cream, true], ['OF ARTIFICIAL INTELLIGENCE', 34]], 150, 200, span(t, a.penny - .25, a.penny + .9), { out });
      label(ctx, [['OUR PROPOSAL · NOT LAW ANYWHERE', 34]], 150, 372, span(t, a.proposal - .2, a.proposal + .5), { out });
    }
    // the three signs that fall into the machine
    if (t > tCoin - .1 && t < a.basic + .6) {
      const [sx, sy] = project(c, F0, MACH.x + 70, MACH.y - MACH.h + 30), out = span(t, a.basic - .4, a.basic + .3);
      label(ctx, [['PUBLIC MONEY', 34]], sx, sy, span(t, tCoin, tCoin + .5), { out });
      label(ctx, [['TAX BREAK', 34]], sx, sy + 52, span(t, tRec, tRec + .5), { out });
      label(ctx, [['GRID CONNECTION', 34]], sx, sy + 104, span(t, tPlug, tPlug + .5), { out });
    }
    if (t > a.y1844 - .3) label(ctx, [['EVERY NEW LINE FROM 1844', 34], ['ONE TRAIN EVERY WEEKDAY · EACH WAY', 34]], 960, 790, span(t, a.y1844 - .2, a.y1844 + .7), { align: 'center', out: span(t, tPlate - 1, tPlate - .35) });
    ctx.restore();
  }

  // ================================================================================================ the tickets
  function tickets(ctx, t, c) {
    // today's ticket: out of the machine → floats up, writes its rows → into the student's hand (world)
    if (t >= tOut0 && t < tHand1) {
      let x, y, w, rot;
      const u0 = sramp(t, tOut0, tOut1), m = MACH;
      if (t < tFloat0) { x = m.x; y = m.slot - 70 * u0 + 40; w = 110; rot = -Math.PI / 2; }
      else if (t < tHand0) { const u = sramp(t, tFloat0, tFloat1); x = lerp(m.x, TKW.x, u); y = lerp(m.slot - 30, TKW.y, u) - 60 * Math.sin(Math.PI * u) + 4 * Math.sin(t * 1.1); w = Math.exp(lerp(Math.log(110), Math.log(TKW.w), u)); rot = lerp(-Math.PI / 2, -.03, u) + .02 * Math.sin(t * .8); }
      else { const hd = handAt(RIDERS[0], t), u = sramp(t, tHand0, tHand1); x = lerp(TKW.x, hd[0] + 6, u); y = lerp(TKW.y, hd[1] - 8, u) - 40 * Math.sin(Math.PI * u); w = Math.exp(lerp(Math.log(TKW.w), Math.log(30), u)); rot = lerp(-.03, -.2, u); }
      card(ctx, c, F0, () => {
        if (t < tFloat0) { ctx.save(); ctx.beginPath(); ctx.rect(m.x - 400, -4000, 800, 4000 + m.slot); ctx.clip(); }
        ticketNew(ctx, x, y, w, rot, { glow: .45 + .35 * bump(t, a.everyone - .2, a.everyone + 1.6), rows: TROWS(t) });
        if (t < tFloat0) ctx.restore();
      });
    }
    // the copy of the last ticket rises (plate space) → TK.r; the 1844 ticket drifts in → TK.l
    const z = Math.exp(PUSH * (t - tPlate));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); zoomAt(ctx, z, 960, 500);
    if (t >= a.y1844 - .6) {
      const u = span(t, a.y1844 - .6, tPlate - .3), e = sineIO(u);
      const x = herm(t, a.y1844 - .6, tPlate - .3, -260, TK.l[0], 260, 0) + 70 * Math.sin(u * 5.5) * (1 - e);
      const y = herm(t, a.y1844 - .6, tPlate - .3, 120, TK.l[1], 120, 0) + 3 * Math.sin(t * .8);
      ticketOld(ctx, x, y, TK.w, TK.rot[0] + .35 * Math.sin(u * 5.5 + .5) * (1 - e), { glow: .35 });
    }
    if (t >= tRel) {
      const r = RIDERS[3], hd = handAt(r, tRel);
      const p = project(camW(tRel), F0, hd[0] + 6, hd[1] - 8), z0 = Math.exp(PUSH * (tRel - tPlate));
      const px = (p[0] - 960) / z0 + 960, py = (p[1] - 500) / z0 + 500, w0 = 30 * p[2] / z0;
      const b = .5 + .5 * Math.sin(t * 1.2);
      const x = herm(t, tRel, tPlate - .3, px, TK.r[0], 0, 0), y = herm(t, tRel, tPlate - .3, py, TK.r[1], -320, 0) + 3 * Math.sin(t * .8 + 1.4) * ramp(t, tRel, tRel + 2);
      const w = Math.exp(herm(t, tRel, tPlate - .3, Math.log(w0), Math.log(TK.w), 0, 0)), rot = herm(t, tRel, tPlate - .3, -.2, TK.rot[1], 0, 0);
      ticketNew(ctx, x, y, w, rot, { glow: .6 + .15 * b });
    }
    ctx.restore();
  }
  function handAt(r, tt) {
    // the rider's right hand at time tt (same arm maths as the figure; standing, not walking)
    const st = riderState(r, tt), raise = riderRaise(r, tt), s1 = lerp(.2, 2.0, raise), s2 = lerp(.1, 2.3, raise), h = PH - (r.kind === 'duo' ? 8 : 0);
    const side = st.walk != null, sx = side ? .098 * .74 - .01 : .098, el = [sx + Math.sin(s1) * .17, -.74 + Math.cos(s1) * .17], hd = [el[0] + Math.sin(s2) * .155, el[1] + Math.cos(s2) * .155];
    return [st.x + h * hd[0], st.y + h * hd[1]];
  }

}
