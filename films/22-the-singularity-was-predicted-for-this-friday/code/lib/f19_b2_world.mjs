// Film 19 · builder B2 · c06 + c07 + c08 as ONE plan sequence (203.99 'A date sounds precise' → 335.47 'Right now, though').
// The three scene files call world(T) and draw the same function with the same t, so the chunk seams c06|c07 and c07|c08 are identical
// frames by construction. Group seams: plateSlip (B1 → B2) for t < T6 + .5, plateWheel (B2 → B3) for t ≥ T9 − .5 (lib/f19_seams.mjs).
//
// THE WAY THROUGH THE SHEET (design coords of the sheet, ZS):
//   6.01  the slip (2610,−1150) tears: FRI 13 → pull back → push into the top of the asymptote (1639,−860): LATE 2026, ±5.5 y → back to the 13
//   6.02★ beside the slip: the Vienna skyline, the man (silhouette), the index card, the candles 1 1 5 light (warm hero)
//   6.03  sweep left to the masthead: the subtitle rises, the IF is ringed; PROJECTION / FORECAST at the dashed formula
//   6.04  the car closes in round the camera (the dashed formula is the road ahead); the GPS lights; you turn the wheel, the route bends
//   6.05  push into the GPS: the route becomes the machine line (cool light on graph paper), FRI ?; the question card on the dash
//   7.01  pull back: the glass fogs from the edges; your hand wipes a swath (the swath follows your hand) → fly through it onto the sheet
//   7.02  census slips land on the real gold line (one point each), again and again; they fold into gold beads
//   7.03  right to the light line: the stopwatch stands up, each click prints a point; the public chart, copies fan out; HYPE / PANIC erased
//   7.04★ down to the doorframe: the stack of tasks thins, the kid grows past the ruler
//   7.05  the ruler's tape runs up along the light line and keeps pace as it grows; the lamp opens; the weather strip
//   8.01  the car closes in again, now on the light line: the empty wheel, your hands in your lap
//   8.02  through the windshield onto the sheet: billions of gold dots at the knee; the light line forks (everyone / a few); FOR EVERYONE?
//   8.03  a yellow dot lands and grows into you; the hourglass stands up on the fork, tips and pours into your hands; contract, bill, napkin
//   8.04★ the papers fly down-left to the expert's door; the dark wall closes in; two pass the rope; the rope drops, the door opens,
//         the light floods over you; you step in; the camera flies through the doorway into the light → the wheel rises: plateWheel
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
import * as P from './f19_b2_props.mjs';
import { plateSlip, plateWheel, SLIP_PLATE, WHEEL_PLATE, SEAM_HALF, PLATE_DRIFT } from './f19_seams.mjs';
const { W, H, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, camAt, camDrift, aim, cam3, rad, lin, drift, prng } = E;
const { PAL, ZS, sheet, chart1960, onSheet, lifted, label, ink, lightLine, partial, aiPts, KNEE, yearX, popY, realPop, slip, qcard, ring, stopwatch, hourglass, wheel, you, other, strike, bump } = F;
const { popUp, easeBack } = P;

// ---------------------------------------------------------------------------------------------------------------- anchors
export function anchors(T) {
  const G = (p, after = 0) => T.G(p, 0, after);
  const a = {};
  a.T6 = G('A date sounds precise'); a.precise = G('precise', a.T6); a.pure = G('pure math', a.T6); a.formula = G('formula only said', a.pure);
  a.late = G('late twenty', a.formula); a.give = G('give or take', a.late); a.thir = G('thirteenth came', a.give); a.else = G('somewhere else', a.thir);
  a.bday = G('birthday', a.else); a.man = G('man behind the formula', a.bday); a.heinz = G('Heinz von Foerster', a.man); a.born = G('born in Vienna', a.heinz);
  a.vienna = G('Vienna', a.heinz); a.nov = G('November thirteenth', a.vienna); a.reportedly = G('Reportedly', a.nov); a.exact = G('exact day', a.reportedly);
  a.joke = G('joke', a.exact); a.onFri = G('On Friday', a.joke); a.h115 = G('hundred and fifteen', a.onFri);
  a.dayWas = G('The day was a wink', a.h115); a.wink = G('wink', a.dayWas); a.mathnot = G('math was not', a.wink); a.ifc = G('came with an if', a.mathnot);
  a.keep = G('keep growing', a.ifc); a.proj = G('projection', a.keep); a.forecast = G('not a forecast', a.proj);
  a.like = G('A projection is like', a.forecast); a.gps = G('GPS', a.like); a.same = G('same way', a.gps); a.turn = G('another turn', a.same); a.changes = G('changes', a.turn);
  a.mline = G('machine line is a projection', a.changes); a.too = G('too', a.mline); a.headed = G('where we', a.too); a.nothing = G('nothing changes', a.headed);
  a.canwe = G('Can we change', a.nothing); a.route = G('change the route', a.nothing);
  a.T7 = G('Only if we can see it'); a.see = G('see it', a.T7); a.nobody = G('Nobody steers', a.see); a.closed = G('eyes closed', a.nobody);
  a.firstEasy = G('first line was easy', a.closed); a.counted = G('counted their people', a.firstEasy); a.again = G('again and again', a.counted);
  a.visible = G('machine line is visible', a.again); a.stopw = G('stopwatch', a.visible); a.indep = G('Independent researchers', a.stopw); a.measure = G('measure it', a.indep);
  a.share = G('share what they find', a.measure); a.public = G('in public', a.share); a.realN = G('With real numbers', a.public); a.guess = G('guess between', a.realN);
  a.hype = G('hype and panic', a.guess); a.panic = G('panic', a.hype);
  a.admit = G('researchers admit', a.panic); a.problem = G('problem', a.admit); a.best = G('best systems', a.problem); a.hard = G('hard enough', a.best);
  a.kid = G('growing kid', a.hard); a.ruler = G('ruler', a.kid); a.short = G('too short', a.ruler);
  a.grow = G('grow as fast', a.short); a.open = G('Out in the open', a.grow); a.check = G('easy to check', a.open); a.weather = G('tomorrow', a.check);
  // 7.06 the channel's call (VO s11b, lead 7.11.): everyone on the sheet, a SUBSCRIBE card by you
  a.chan = G('This channel exists', a.weather); a.si = G('superintelligence turns out', a.chan); a.forAll = G('well for everyone', a.si);
  a.wantToo = G('If you want that too', a.forAll); a.subscr = G('subscribe', a.wantToo);
  a.T8 = G("But seeing the road isn't steering"); a.steer = G('steering', a.T8); a.bent = G('first line bent', a.steer); a.fam = G('billions of families', a.bent);
  a.who = G('Who will these machines', a.fam); a.choicesTo = G('more choices to', a.who); a.every = G('Everyone', a.choicesTo); a.few = G('just a few', a.every);
  a.pic = G('Picture that', a.few); a.wday = G('working day', a.pic); a.aimed = G('aimed at your own', a.wday); a.contract = G('contract', a.aimed);
  a.bill = G('medical bill', a.contract); a.idea = G('business idea', a.bill); a.shelved = G('shelved years ago', a.idea);
  a.most = G('For most of history', a.shelved); a.rare = G('rare and expensive', a.most); a.lucky = G('lucky few', a.rare); a.now = G('Now it could be', a.lucky);
  a.anyone = G('on call for anyone', a.now); a.mc = G('more choices could', a.anyone);
  a.T9 = G('Right now, though', a.mc);
  return a;
}

// ---------------------------------------------------------------------------------------------------------------- geometry
const SL = SLIP_PLATE;                                   // the slip of the seam: pin (2610, −1150), w 190
const SLIP_H = SL.w * 1.18, SLIP_13 = [SL.x, SL.y + SL.w * .06 + SLIP_H * .6];
const ASX = yearX(2026.87), BR_Y = -862;                 // the asymptote and the bracket over the top of the formula
// the light line (the machine): kit aiPts, drawn up to a head height (the head sits just under the slip: the slip is its flag)
const AIL = (() => { const L = [0]; for (let i = 1; i < aiPts.length; i++) L.push(L[i - 1] + Math.hypot(aiPts[i][0] - aiPts[i - 1][0], aiPts[i][1] - aiPts[i - 1][1])); return L; })();
const uAtY = (y) => { let i = 1; while (i < aiPts.length - 1 && aiPts[i][1] > y) i++; const f = (aiPts[i - 1][1] - y) / Math.max(1e-6, aiPts[i - 1][1] - aiPts[i][1]); return lerp(AIL[i - 1], AIL[i], clamp(f)) / AIL[AIL.length - 1]; };
const AI_U0 = uAtY(-700), AI_U1 = uAtY(-880);
const aiAt = (s) => aiPts[Math.round(clamp(s) * 160)];
// the car: composed in screen coords of a reference camera; layers at these depths (nearest first: you, wheel, dash, frame, fog)
const ZY = 450, ZW = 490, ZD = 540, ZF = 600, ZG = 612;
const R6 = aim(ZS, 1600, 150, .83), R8 = aim(ZS, 2520, -170, .83);
export function carAim(R, Z, sx, sy, m) { const k = (Z - R.z) / R.f; return cam3({ x: R.x + (sx - W / 2) * k, y: R.y + (sy - H / 2) * k, z: Z - (Z - R.z) / m, f: R.f }); }
// draw fn in car-screen coords (as the reference camera R sees it) on a layer at depth Z; close 0..1 = the layer closes in from round the
// camera (scaled about the screen centre from 9× down to 1×: it enters from the frame edges). Returns false when the camera has passed it.
let CAR_THIN = false;   // only during the two fly-throughs: layers thin out as the camera passes them
function carCard(ctx, c, R, Z, close, fn) {
  const dz = Z - c.z; if (dz < 30) return false;
  const k = (Z - R.z) / R.f * c.f / dz, bx = W / 2 + (R.x - c.x - W / 2 * (Z - R.z) / R.f) * c.f / dz, by = H / 2 + (R.y - c.y - H / 2 * (Z - R.z) / R.f) * c.f / dz;
  if (close <= 0) return true;
  const S = Math.exp(lerp(Math.log(9), 0, sineIO(clamp(close)))), px = k * 960 + bx, py = k * 480 + by;   // pivot: the windshield centre
  ctx.save(); ctx.globalAlpha *= smooth(clamp(close * 1.8)) * (CAR_THIN ? clamp((dz - 40) / 420) : 1);   // materialises as it closes in; thins out as the camera passes it
  ctx.setTransform(k * S, 0, 0, k * S, px + (bx - px) * S, py + (by - py) * S); fn(k * S); ctx.restore(); return true;
}
// the driver (you from behind) and the wheel; IK puts the hands on the rim (Gate 5: the hands are where the rim is)
const YOU_CAR = { x: 470, y: 1310, h: 700 }, WHEEL_CAR = { x: 482, y: 900, r: 200 };
function ik(x, y, h, sd, P) {   // shoulder angles [s1, s2] (figure convention: from straight down, + = toward +x) for hand target P
  const sx = x + sd * .098 * h, sy = y - .74 * h, a = .17 * h, b = .155 * h, dx = P[0] - sx, dy = P[1] - sy, d = clamp(Math.hypot(dx, dy), Math.abs(a - b) + 1, a + b - 1);
  const th = Math.atan2(dx, dy), al = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1)), s1 = th - sd * al;   // elbows out and down
  const ex = sx + Math.sin(s1) * a, ey = sy + Math.cos(s1) * a; return [s1, Math.atan2(P[0] - ex, P[1] - ey)];
}
const armHand = (x, y, h, sd, [s1, s2]) => { const sx = x + sd * .098 * h, sy = y - .74 * h; return [sx + (Math.sin(s1) * .17 + Math.sin(s2) * .155) * h, sy + (Math.cos(s1) * .17 + Math.cos(s2) * .155) * h]; };
// the wipe: the right hand rises to the glass and sweeps; the clear swath is the path of that hand (sampled once)
const WIPE_ARM = (u) => [lerp(2.15, 2.55, u) + .25 * Math.sin(u * Math.PI), lerp(2.0, 2.95, u)];
const WIPE_PTS = Array.from({ length: 25 }, (_, i) => armHand(YOU_CAR.x, YOU_CAR.y, YOU_CAR.h, 1, WIPE_ARM(i / 24)));
const WIPE_MID = WIPE_PTS[12], WIPE_SHEET = [R6.x + 960 + (WIPE_MID[0] - W / 2) / .83, R6.y + 540 + (WIPE_MID[1] - H / 2) / .83];
// 8.02 the fork on the light line, 8.03 you and the hourglass
const FK = aiAt(.62), FK_B = [[FK[0], FK[1]], [FK[0] + 120, FK[1] - 55], [FK[0] + 250, FK[1] - 95], [FK[0] + 330, FK[1] - 118]], FK_A = [[FK[0], FK[1]], [FK[0] + 110, FK[1] + 60], [FK[0] + 220, FK[1] + 115], [FK[0] + 300, FK[1] + 140]];
const FEW = [[FK[0] + 372, FK[1] - 132], [FK[0] + 404, FK[1] - 112], [FK[0] + 436, FK[1] - 134]];
const FAN = (() => { const r = prng(808), o = []; for (let i = 0; i < 1400; i++) { const ang = lerp(-.55, .95, r()), d = 20 + Math.pow(r(), .7) * 430; o.push([FK_A[3][0] + Math.cos(ang) * d * 1.1, FK_A[3][1] + Math.sin(ang) * d * .75, r(), 1 + r() * 1.8]); } return o; })();
const FAMILIES = (() => { const r = prng(4242), o = []; for (let i = 0; i < 1600; i++) { const yr = lerp(1900, 2026, Math.pow(r(), .6)), x = yearX(yr), y = popY(realPop(yr)); const ang = r() * 6.283, d = Math.pow(r(), 1.6) * 70; o.push([x + Math.cos(ang) * d, y + Math.sin(ang) * d * .7, (yr - 1900) / 126, 1 + r() * 1.6]); } return o; })();
const YOU8 = { x: FK[0] - 175, y: FK[1] + 95, h: 168 };
// 8.04 the expert's door on the wall layer (sheet-aligned coords round the plate's light), the wall at height 1500 (Z 200)
const DOOR = { cx: 960, yb: 2050, w: 300, h: 520 }, ZWALL = 200, WALL_BOX = [-700, 900, 2620, 2900];
const DOOR_CAM = cam3({ x: 0, y: WHEEL_PLATE.y - H / 2, z: -1700 });
// census slips (7.02): decade → land order
const CENSUS = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 1940, 1930, 1920, 1910, 1900];
// copies of the public chart (7.03): fly out from the pinned one far across the sheet
const COPIES = [[1250, -420, -.3], [1180, 300, .2], [1300, 1000, -.15], [3350, -380, .25], [3450, 330, -.2], [3300, 1050, .12]];
const MAIN_CHART = [2205, 40];
// 7.04 doorframe, kid, ruler, tasks
const DF = { x: 2410, yb: 1650, w: 250, h: 470 }, KID_X = 2505, RUL = { x: 2612, L: 300, w: 34 };
// 7.05 the tape: up from the ruler's top, then along the light line (right of it) to the head
const TAPE_PTS = (() => { const s0 = .74, i0 = Math.round(s0 * 160), off = P.offsetPts(aiPts.slice(i0 - 2), 52).slice(2); const head = [[RUL.x, DF.yb - RUL.L], [RUL.x, 1100], [RUL.x - 8, 960], [RUL.x - 30, 760], [off[0][0] + 10, off[0][1] + 140]]; return [...head, ...off.filter((p) => p[1] > -900)]; })();
const TAPE_L = P.polyLen(TAPE_PTS);
const tapeUAtY = (y) => { let acc = 0; for (let i = 1; i < TAPE_PTS.length; i++) { const l = Math.hypot(TAPE_PTS[i][0] - TAPE_PTS[i - 1][0], TAPE_PTS[i][1] - TAPE_PTS[i - 1][1]); if (TAPE_PTS[i][1] <= y) { const f = (TAPE_PTS[i - 1][1] - y) / Math.max(1e-6, TAPE_PTS[i - 1][1] - TAPE_PTS[i][1]); return (acc + l * f) / TAPE_L; } acc += l; } return 1; };

// ---------------------------------------------------------------------------------------------------------------- keyed values
function keyed(t, K) {
  if (t <= K[0][0]) return K[0][1]; if (t >= K[K.length - 1][0]) return K[K.length - 1][1];
  let i = 0; while (t > K[i + 1][0]) i++;
  const u = smooth((t - K[i][0]) / (K[i + 1][0] - K[i][0])), A = K[i][1], B = K[i + 1][1], out = {};
  for (const k of Object.keys(A)) out[k] = Array.isArray(A[k]) ? A[k].map((v, j) => lerp(v, B[k][j], u)) : lerp(A[k], B[k], u);
  return out;
}

// ---------------------------------------------------------------------------------------------------------------- the world
const CACHE = new WeakMap();
export function world(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  E.prepareEditorial();
  const a = anchors(T), d = build(a); CACHE.set(T, d); return d;
}

function build(a) {
  const T6 = a.T6, T9 = a.T9, tPlate = T9 - SEAM_HALF;
  // ---------------- the camera (one plan sequence; keys on words; sine-S unless marked)
  const PC = SL.cam;
  const K = [
    [T6 + SEAM_HALF, PC],
    [a.pure - .1, aim(ZS, 2612, -1006, 3.25)],                         // breathing push while the ? page tears off
    [a.pure + 2.1, aim(ZS, 2150, -880, .95)],                           // pull back: the slip, the formula's top, the light line
    [a.late + .15, aim(ZS, 1780, -880, 2.1)],                          // push into the top of the asymptote: LATE 2026
    [a.thir - .1, aim(ZS, 1768, -888, 2.34)],
    [a.else + .45, aim(ZS, 2570, -1012, 1.78)],                         // back to the slip: the 13 is ringed
    [a.bday + .25, aim(ZS, 2565, -1015, 1.86)],
    [a.heinz + .2, aim(ZS, 2890, -1010, 1.28)],                          // pull back left: the man, the card
    [a.reportedly + .3, aim(ZS, 2910, -1000, 1.34)],
    [a.h115 + .7, aim(ZS, 2700, -1000, 1.42)],                          // toward the candles
    [a.wink + .45, aim(ZS, 2690, -995, 1.48)],
    [a.mathnot + .6, aim(ZS, 1700, -760, .72)],                         // sweep left (arc pull back) …
    [a.ifc + .25, aim(ZS, 860, -560, 1.12)],                            // … onto the masthead
    [a.proj - .2, aim(ZS, 900, -545, 1.19)],
    [a.forecast + .45, aim(ZS, 1060, -470, 1.15)],
    [a.like + 2.0, R6],                                                  // the car closes in round the camera
    [a.gps + .6, carAim(R6, ZD, 1120, 690, 1.1)],
    [a.turn - .2, carAim(R6, ZD, 1010, 660, 1.16)],
    [a.changes + .6, carAim(R6, ZD, 1080, 680, 1.22)],
    [a.too + .5, carAim(R6, ZD, 1336, 770, 4.1)],                        // push into the GPS
    [a.nothing - .5, carAim(R6, ZD, 1330, 768, 4.3)],
    [a.canwe + .9, carAim(R6, ZD, 1190, 700, 2.55)],                    // back: the card drops in beside the GPS
    [a.route + 1.6, carAim(R6, ZD, 1170, 712, 2.4)],                     // a little back: the card beside the GPS
    [a.see + .1, carAim(R6, ZD, 1010, 690, 1.5)],                       // back out: the fogged glass, SEE IT
    [a.closed - .8, carAim(R6, ZG, WIPE_MID[0] + 60, WIPE_MID[1] - 20, 1.18)],   // the wipe
    [a.closed + 1.45, carAim(R6, ZG, WIPE_MID[0] + 60, WIPE_MID[1] - 20, 7)],    // straight dolly (constant x,y) to just before the glass
    [a.firstEasy + .35, aim(ZS, WIPE_SHEET[0] + 72, WIPE_SHEET[1] - 24, 1.7), 'o'],   // through the swath onto the sheet
    [a.counted - .1, aim(ZS, 1365, 690, 2.0)],                          // down onto the gold line: census
    [a.again + 1.3, aim(ZS, 1200, 640, 1.38)],
    [a.stopw + .1, aim(ZS, 2400, 425, 1.15)],                           // right to the light line
    [a.share - .1, aim(ZS, 2345, 395, 1.22)],
    [a.realN + .1, aim(ZS, 2300, 400, .97)],                            // the copies fan out
    [a.panic + 1.0, aim(ZS, 2330, 400, 1.05)],
    [a.problem + .5, aim(ZS, 2480, 1430, 1.25)],                        // down to the doorframe
    [a.hard + .4, aim(ZS, 2470, 1435, 1.33)],
    [a.short - .15, aim(ZS, 2560, 1450, 1.55)],                         // push toward the kid and the ruler
    [a.short + .9, aim(ZS, 2530, 1420, 1.32)],                          // ★ back a little as the kid outgrows it
    [a.grow + 1.2, aim(ZS, 2520, 420, 1.0)],                            // tilt up after the tape's head
    [a.open + 1.0, aim(ZS, 2470, -330, 1.0)],
    [a.weather + .8, aim(ZS, 2420, -560, 1.13)],                        // the weather strip
    [a.chan + .4, aim(ZS, 2080, -120, .74)],                            // 7.06 back from the strip …
    [a.si + .3, aim(ZS, 1520, 330, .5)],                                // … to the whole sheet: both lines, the ground below
    [a.forAll + .7, aim(ZS, 1490, 720, .64)],                           // the light reaches everyone
    [a.wantToo + .2, aim(ZS, 1500, 1090, 1.3)],                       // in on you
    [a.subscr + .1, aim(ZS, 1535, 1095, 1.5)],                        // the card beside you
    [a.subscr + 1.9, aim(ZS, 1900, 640, .82)],                           // back out over the sheet …
    [a.T8 + .1, aim(ZS, 2450, -60, .95)],                               // up the light line to its head …
    [a.T8 + .75, R8],                                                     // the car closes in again (the road = the light line)
    [a.steer + .2, carAim(R8, ZW, 560, 720, 1.25)],                     // settle on the empty wheel
    [a.bent - .2, carAim(R8, ZF, 900, 470, 1.12)],                      // look out through the glass
    [a.bent + .55, carAim(R8, ZF, 900, 470, 14)],                       // straight dolly (constant x,y) up to the glass
    [a.bent + 1.6, aim(ZS, 2470, -200, 1.6), 'o'],                      // through the windshield onto the sheet (close to the same ray)
    [a.fam + 1.2, aim(ZS, 2250, 520, .99)],                             // pull back: the knee, the light line
    [a.few + .8, aim(ZS, 2222, 548, .92)],
    [a.wday + .7, aim(ZS, 2330, 640, 1.65)],                            // toward the fork
    [a.aimed + .6, aim(ZS, 2300, 640, 2.3)],                            // close on your hands
    [a.idea + 1.0, aim(ZS, 2230, 600, 1.95)],
    [a.most + .5, aim(ZS, 1640, 1150, .78)],                            // follow the papers down-left …
    [a.rare + .1, DOOR_CAM],                                             // … the door
    [a.mc - 1.0, cam3({ x: 30, y: DOOR_CAM.y - 20, z: -1200 })],
    [tPlate, WHEEL_PLATE.cam],                                           // fly through the doorway into the light: the plate
  ];
  // the drift: plate amount at both seams; damped when the camera is close to the car layers
  const carW = (t) => Math.max(span(t, a.forecast + .4, a.like + 1.2) * (1 - span(t, a.closed, a.firstEasy + .3)), span(t, a.T8 - .7, a.T8 + .5) * (1 - span(t, a.steer + .4, a.bent + 1.2)));
  const camera = (t) => {
    const c0 = camAt(t, K, ZS);
    { const u = span(t, a.rare + .1, tPlate); if (u > 0 && u < 1) c0.z += 200 * Math.sin(Math.PI * u ** 3) ** 2; }   // the door section never stops (no dead key between door and fly-in)
    let amt = PLATE_DRIFT + (3 - PLATE_DRIFT) * smooth(span(t, T6 + .5, T6 + 2.2)) * (1 - smooth(span(t, tPlate - 1.6, tPlate)));   // 3×: no key ever freezes the frame
    const cw = carW(t); if (cw > 0) amt *= lerp(1, clamp((ZD - c0.z) / 1100, .12, 1), smooth(cw));
    return camDrift(c0, t, amt);
  };
  // ---------------- the sheet light (lamp pool, dimming, the cool spill of the light line)
  const SK = [
    [T6, { lamp: [2500, -900], lampR: 1600, dim: .1, cool: [2620, -700, 900, .55] }],
    [a.pure + 2.1, { lamp: [2100, -850], lampR: 1900, dim: .1, cool: [2600, -650, 1000, .5] }],
    [a.late + .15, { lamp: [1700, -820], lampR: 1500, dim: .05, cool: [2600, -650, 1000, .42] }],
    [a.else + .45, { lamp: [2450, -1000], lampR: 1500, dim: .06, cool: [2620, -650, 900, .4] }],
    [a.heinz, { lamp: [2800, -1000], lampR: 1500, dim: .08, cool: [2620, -650, 900, .35] }],
    [a.h115, { lamp: [2700, -1000], lampR: 1450, dim: .1, cool: [2620, -650, 900, .3] }],
    [a.h115 + .9, { lamp: [2450, -980], lampR: 1250, dim: .22, cool: [2620, -650, 900, .12] }],
    [a.mathnot + .4, { lamp: [2000, -900], lampR: 1500, dim: .15, cool: [2620, -650, 900, .12] }],
    [a.ifc + .25, { lamp: [900, -560], lampR: 1700, dim: .05, cool: [2620, -650, 900, .1] }],
    [a.forecast + .5, { lamp: [1100, -480], lampR: 1600, dim: .1, cool: [2600, -300, 900, .12] }],
    [a.like + 1.3, { lamp: [1600, -450], lampR: 1350, dim: .4, cool: [2500, -100, 900, .2] }],
    [a.closed, { lamp: [1500, -350], lampR: 1450, dim: .35, cool: [2500, -100, 900, .2] }],
    [a.firstEasy + .35, { lamp: [1350, -100], lampR: 1700, dim: .1, cool: [2500, 0, 900, .25] }],
    [a.counted, { lamp: [1350, 650], lampR: 1500, dim: 0, cool: [2500, 200, 900, .3] }],
    [a.stopw, { lamp: [2250, 400], lampR: 1600, dim: .05, cool: [2480, 250, 1100, .6] }],
    [a.panic + 1, { lamp: [2300, 450], lampR: 1600, dim: .05, cool: [2480, 250, 1100, .55] }],
    [a.problem + .5, { lamp: [2520, 1380], lampR: 1250, dim: .1, cool: [2480, 300, 900, .22] }],
    [a.short, { lamp: [2540, 1380], lampR: 1250, dim: .1, cool: [2480, 300, 900, .22] }],
    [a.short + .6, { lamp: [2560, 1330], lampR: 1600, dim: 0, cool: [2480, 300, 900, .22] }],
    [a.grow + 1.2, { lamp: [2450, 300], lampR: 1600, dim: .05, cool: [2540, -100, 1000, .5] }],
    [a.open + 1.0, { lamp: [2420, -320], lampR: 2300, dim: 0, cool: [2560, -300, 1100, .6] }],
    [a.weather + .8, { lamp: [2400, -500], lampR: 2000, dim: .05, cool: [2560, -400, 1000, .55] }],
    [a.si + .3, { lamp: [1600, 350], lampR: 2700, dim: .08, cool: [2450, 0, 1300, .5] }],
    [a.wantToo + .35, { lamp: [1500, 1100], lampR: 1600, dim: .12, cool: [2450, 300, 1100, .4] }],
    [a.T8 + .6, { lamp: [2450, -300], lampR: 1500, dim: .38, cool: [2550, -300, 900, .5] }],
    [a.bent + 1.4, { lamp: [2400, 0], lampR: 1700, dim: .12, cool: [2540, -100, 1000, .5] }],
    [a.fam + 1.2, { lamp: [1950, 560], lampR: 1900, dim: .04, cool: [2450, 450, 1100, .48] }],
    [a.wday + .7, { lamp: [2300, 640], lampR: 1500, dim: .3, cool: [2450, 500, 900, .32] }],
    [a.idea + 1.0, { lamp: [2250, 620], lampR: 1500, dim: .3, cool: [2450, 500, 900, .25] }],
    [a.rare - .3, { lamp: [960, 1700], lampR: 1300, dim: .05, cool: [2450, 500, 900, 0] }],
  ];
  // the slip's swing (the plate's own swing, plus a jolt when the page tears)
  const slipSwing = (t) => .012 * Math.sin(t * 1.1) + .045 * bump(t, a.precise - .05, .9) * Math.sin((t - a.precise) * 14);

  return (ctx, t) => {
    if (t < T6 + SEAM_HALF) return plateSlip(ctx, t);
    if (t >= tPlate) return plateWheel(ctx, t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const c = camera(t);
    const sk = { ...keyed(t, SK) }, dimAdd = lerp(.23, .16, smooth(span(t, a.T7 - 2, a.T7 - .2))) * smooth(span(t, T6 + SEAM_HALF, T6 + 2.5)) * (1 - smooth(span(t, tPlate - 2.5, tPlate)));   // a touch darker between the plates (luma)
    sk.dim = Math.min(1, (sk.dim ?? 0) + dimAdd);
    sheet(ctx, c, t, sk);
    drawSheet(ctx, c, t, a);
    drawLifted(ctx, c, t, a, slipSwing);
    drawCar(ctx, c, t, a);
    drawDoor(ctx, c, t, a);
    ctx.restore();
  };
}

// ---------------------------------------------------------------------------------------------------------------- on the sheet
function drawSheet(ctx, c, t, a) {
  // the 1960 page (as the world left it: dashed formula, the real line to 2026, NOW); the subtitle stays once it has risen
  chart1960(ctx, c, t, { mast: 1, axes: 1, pplLab: 1 - span(t, a.like, a.like + .8) * (1 - span(t, a.firstEasy, a.firstEasy + 1)), fu: 1, dash: 1, ru: 2026, now: 1,
    sub: span(t, a.ifc - .05, a.ifc + 1.2), ifR: span(t, a.keep - .1, a.keep + .8) });
  onSheet(ctx, c, () => {
    // 6.01 the asymptote (pencil, drawn down from the top) and the bracket LATE 2026 (widens to 2021 – 2032 and closes again)
    const asU = span(t, a.formula - .1, a.formula + 1.2);
    if (asU > 0) P.pencil(ctx, [[ASX, -940], [ASX, -560]], asU, { dash: [10, 12], w: 2.2, a: .55 * (1 - span(t, a.forecast + .6, a.like)), col: PAL.ink0 });
    const bu = span(t, a.late - .05, a.late + .5), wide = smooth(span(t, a.give, a.give + .7)) * (1 - smooth(span(t, a.give + 1.6, a.thir - .05)));
    if (bu > 0) {
      const hw = lerp(9, 5.5 * F.CH.pxYear, wide), y = BR_Y;
      if (wide > 0) { ctx.fillStyle = lin(ctx, 0, y + 10, 0, y + 200, [[0, rgba(PAL.ink0, .13 * wide)], [1, rgba(PAL.ink0, 0)]]); ctx.fillRect(ASX - hw, y + 10, hw * 2, 190); }
      ink(ctx, [[ASX - hw, y + 16], [ASX - hw, y], [ASX + hw, y], [ASX + hw, y + 16]], bu, { w: 4.5, head: false });
      const sink = 1 - span(t, a.else, a.else + .7);
      label(ctx, 'LATE 2026', ASX, y - 40, 54, Math.min(span(t, a.late, a.late + .7), sink), { serif: true, align: 'center', col: PAL.ink0 });
      label(ctx, 't₀ = 2026.87', ASX + 48, y + 14, 19, Math.min(span(t, a.late + .35, a.late + 1.0), sink), { col: PAL.ink1, spacing: .06 });
      const wl = Math.min(span(t, a.give + .2, a.give + .8), 1 - span(t, a.give + 1.7, a.thir - .1));
      if (wl > 0) label(ctx, '2021 – 2032', ASX - 50, y + 14, 21, wl, { align: 'right', col: PAL.ink0, spacing: .06 });
    }
    // 6.03 PROJECTION at the dashed formula; FORECAST struck
    const pu = Math.min(span(t, a.proj - .05, a.proj + .6), 1 - span(t, a.like - .4, a.like + .4));
    if (pu > 0) {
      label(ctx, 'PROJECTION', 1548, -318, 42, pu, { align: 'right', col: PAL.gold1 });
      const fw = label(ctx, 'FORECAST', 1548, -262, 36, Math.min(pu, span(t, a.forecast - .2, a.forecast + .4)), { align: 'right', col: PAL.ink1 });
      if (fw > 0 && pu >= 1) strike(ctx, 1548 - fw - 4, -274, fw + 8, span(t, a.forecast + .15, a.forecast + .7), { w: 4.5 });
    }
    // 6.04 the road ahead (pencil edges converging where the dashed formula leaves the page)
    const ru = span(t, a.like - .3, a.like + .9), re = smooth(span(t, a.firstEasy - .3, a.firstEasy + .9));
    if (ru > 0 && re < 1) { const vp = [1588, -470]; for (const b of [[930, 760], [2230, 760]]) P.pencil(ctx, [vp, [lerp(b[0], vp[0], re), lerp(b[1], vp[1], re)]], ru, { w: 3.5, a: .42 * (1 - .5 * re), col: PAL.ink0 }); }
    // the light line: up to its head under the slip; 7.03 printed points; 7.05 it grows a little (the tape keeps pace)
    const g = smooth(span(t, a.grow, a.grow + 2.0)), uAI = lerp(AI_U0, AI_U1, g);
    lightLine(ctx, aiPts, uAI, { w: 7, spill: .35 * bump(t, a.grow, 2.2) + .45 * bump(t, a.si - .1, 1.6) });
    const pts = [.6, .68, .75, .81, .86], clicks = [a.indep, a.indep + .55, a.measure, a.measure + .5, a.share];
    pts.forEach((s, i) => { const k = span(t, clicks[i], clicks[i] + .25); if (k <= 0) return; const [x, y] = aiAt(s); E.halo(ctx, x, y, 60 * (1 - .6 * k), .7 * (1 - k) + .15, PAL.cool1, PAL.cool0); ctx.fillStyle = PAL.cool0; ctx.beginPath(); ctx.arc(x, y, 9 * easeBack(k, 2), 0, 6.29); ctx.fill(); ctx.strokeStyle = rgba(PAL.cool1, .8); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, 17 * expoOut(k), 0, 6.29); ctx.stroke(); });
    // 7.02 census slips land on the real line (each one is a point of it), then fold into gold beads as the camera leaves
    CENSUS.forEach((yr, i) => {
      const tl = i < 3 ? a.counted + .05 + i * .38 : a.again + (i - 3) * .13, k = span(t, tl - .05, tl + .4); if (k <= 0) return;
      const x = yearX(yr), y = popY(realPop(yr)), fold = span(t, a.visible + .05 + (12 - i) * .04, a.visible + .6 + (12 - i) * .04);
      if (fold >= 1) { ctx.fillStyle = PAL.gold0; ctx.beginPath(); ctx.arc(x, y, 4.2, 0, 6.29); ctx.fill(); return; }
      ctx.save(); ctx.translate(x, y); ctx.scale(1, 1 - expoIn(fold)); ctx.translate(-x, -y);
      P.censusSlip(ctx, t, x, y - (1 - expoOut(k)) * 140, 66, yr, { rot: (i % 2 ? .05 : -.04) * (1 - .6 * expoOut(k)) + .02 * Math.sin(t * .9 + i) });
      ctx.restore();
    });
    // 7.03 HYPE / PANIC (smudgy pencil), erased outward from the line
    const hw = span(t, a.guess - .1, a.guess + .5), er = span(t, a.panic + .15, a.panic + 1.0);
    if (hw > 0 && er < 1) {
      const lx = 2440;
      for (const [s, x, al] of [['HYPE', 2140, 'right'], ['PANIC', 2740, 'left']]) {
        ctx.save(); const e = expoIn(er) * 520, left = x < lx;
        ctx.beginPath(); if (left) ctx.rect(1300, 300, lx - e - 1300, 500); else ctx.rect(lx + e, 300, 3000, 500); ctx.clip();
        label(ctx, s, x, 575, 64, hw, { align: al, col: PAL.ink1, a: .62, weight: 700, spacing: .2 });
        ctx.restore();
        if (er > 0) { const ex = left ? lx - e : lx + e; ctx.fillStyle = rgba(PAL.ink1, .14 * (1 - er)); ctx.fillRect(ex - (left ? 0 : 40), 515, 40, 80); }
      }
    }
    // 7.05 the measuring tape (from the ruler's top up along the line, keeping pace with the head); it snaps back in 8.02
    const tu0 = span(t, a.grow - .9, a.grow + .5), tu1 = tapeUAtY(lerp(-700, -880, g) + 18), back = expoIn(span(t, a.bent + 1.2, a.fam + .4));
    const tu = lerp(0, tu1, smooth(tu0)) * (1 - back);
    if (tu > 0 && back < 1) P.tape(ctx, TAPE_PTS, tu, 30);
    // 7.05 the weather strip
    const wu = span(t, a.weather - .1, a.weather + 1.6) * (1 - span(t, a.bent + 1.5, a.fam + .2));
    if (wu > 0) P.weatherStrip(ctx, t, 2105, -790, 92, wu);
    // 8.02 billions of families: gold dots light along the real line (left → right through the century)
    const fu = span(t, a.fam - .1, a.fam + 1.4);
    if (fu > 0) { ctx.fillStyle = PAL.gold1; for (const [x, y, f, r] of FAMILIES) { const k = clamp((fu * 1.25 - f) * 6); if (k <= 0) continue; ctx.globalAlpha = .45 + .45 * k; ctx.beginPath(); ctx.arc(x, y, r * (k < 1 ? 1 + 1.2 * (1 - k) : 1), 0, 6.29); ctx.fill(); } ctx.globalAlpha = 1; }
    // 8.02 the fork: two branches of cool light; EVERYONE fans into thousands of dots, A FEW narrows into three
    const bA = span(t, a.choicesTo - .05, a.choicesTo + .9), bB = span(t, a.choicesTo + .15, a.choicesTo + 1.05);
    if (bA > 0) {
      const fan = span(t, a.every - .05, a.every + 1.1), nar = span(t, a.few - .05, a.few + .7);
      const hdA = lightLine(ctx, FK_A, bA, { w: 5.5, spill: .5 * (1 - fan) });
      lightLine(ctx, FK_B, bB, { w: lerp(5.5, 2.5, nar), spill: .4 * (1 - nar) });
      if (fan > 0) { ctx.fillStyle = PAL.cool1; for (const [x, y, f, r] of FAN) { const k = clamp((fan * 1.3 - f) * 5); if (k <= 0) continue; const e = expoOut(k); ctx.globalAlpha = .5 + .4 * f; ctx.beginPath(); ctx.arc(lerp(hdA[0], x, e), lerp(hdA[1], y, e), r * .9, 0, 6.29); ctx.fill(); } ctx.globalAlpha = 1; }
      if (nar > 0) FEW.forEach(([x, y], i) => { const k = expoOut(span(nar, i * .15, i * .15 + .6)); if (k <= 0) return; const hb = FK_B[3]; E.halo(ctx, lerp(hb[0], x, k), lerp(hb[1], y, k), 40, .5, PAL.cool1, PAL.cool0); ctx.fillStyle = PAL.cool0; ctx.beginPath(); ctx.arc(lerp(hb[0], x, k), lerp(hb[1], y, k), 8, 0, 6.29); ctx.fill(); });
    }
    // 8.04 the light the doorway opens onto (exactly the plate's pool, so the fly-in lands on it)
    const pl = span(t, a.most, a.rare);
    if (pl > 0) { const Pw = WHEEL_PLATE, R = Pw.r * 1.75 * (1 + .015 * Math.sin(t * .9)); ctx.fillStyle = rad(ctx, Pw.x, Pw.y, R, [[0, rgba(PAL.gold1, .62 * pl)], [.42, rgba(PAL.gold2, .3 * pl)], [1, rgba(PAL.gold2, 0)]]); ctx.fillRect(Pw.x - R, Pw.y - R, R * 2, R * 2); }
  });
}

// ---------------------------------------------------------------------------------------------------------------- lifted things
function drawLifted(ctx, c, t, a, slipSwing) {
  // --- the slip (6.01 tear, the ring round the 13, its wink) and the birthday beside it (6.02)
  const tear = span(t, a.precise - .12, a.precise + .95), sw = slipSwing(t);
  const ringU = span(t, a.else - .1, a.else + .8), wink = bump(t, a.joke + .02, .42);
  // the man (silhouette) stands up behind the card; the skyline rises behind him; the card drops in; the candles rise and light
  const manU = span(t, a.man - .05, a.man + .85), skyU = span(t, a.vienna - .1, a.vienna + 1.3), cardD = span(t, a.heinz - .15, a.heinz + .75);
  const bday = t < a.counted;   // the birthday group stays behind in c06 (off screen from the census on)
  if (bday && skyU > 0) lifted(ctx, c, .28, () => P.skyline(ctx, 3075, -862, skyU, { win: span(t, a.h115, a.h115 + 1) * .6 + .4 }));
  if (bday && manU > 0) lifted(ctx, c, .42, () => popUp(ctx, 3150, -868, easeBack(manU, 1.1), () => other(ctx, 3150, -868, 330, { view: 'side', dir: -1, light: 1, look: .1 + .25 * smooth(span(t, a.exact - .2, a.exact + .8)) - .15 * smooth(span(t, a.h115 + .4, a.h115 + 1.4)), armR: [.08, .04], armL: [-.06, -.02], rim: mixHex(PAL.cutLit, PAL.flame, .7 * span(t, a.h115 + .1, a.h115 + 1)) })));
  onSheet(ctx, c, () => {
    slip(ctx, t, SL.x, SL.y, SL.w, { ...SL.face, swing: sw, tear, under: { day: 'FRI', num: '13', mon: 'NOV 2026' }, ring: 0 });
    if (ringU > 0) { ctx.save(); ctx.translate(SL.x, SL.y); ctx.rotate(sw); ring(ctx, 0, SL.w * .06 + SLIP_H * .6, SL.w * .3, SL.w * .26 * (1 - .82 * wink), ringU, { w: SL.w * .025 }); ctx.restore(); }
  });
  // the index card drops in on its pin; its three lines rise on their words (name · born · Vienna)
  if (bday && cardD > 0) lifted(ctx, c, .6, () => qcardStaged(ctx, t, 2885, -1112, 300, { drop: cardD, dropH: 600 }, ['HEINZ VON FOERSTER', 'BORN 13 NOV 1911', 'VIENNA'],
    [span(t, a.heinz + .35, a.heinz + 1.0), span(t, a.born - .1, a.born + .55), span(t, a.vienna, a.vienna + .6)]));
  const cr = span(t, a.h115 - .55, a.h115 + .05);
  if (bday && cr > 0) {
    const lit = [span(t, a.h115 + .1, a.h115 + .35), span(t, a.h115 + .2, a.h115 + .45), span(t, a.h115 + .3, a.h115 + .55)];
    lifted(ctx, c, .5, () => P.candle115(ctx, t, 2420, -916, 112, { glow: 1.5, rise: cr, lit, dip: span(t, a.wink - .1, a.wink + .6) }));
  }
  // --- 7.03 the stopwatch stands up beside the line, clicks, and folds flat again; the public chart and its copies
  const swU = span(t, a.stopw - .25, a.stopw + .45), swF = span(t, a.problem - .4, a.problem + .3);
  if (swU > 0 && swF < 1) {
    const clicks = [a.indep, a.indep + .55, a.measure, a.measure + .5, a.share]; let run = 0; clicks.forEach((tc) => { run += 6 * expoOut(span(t, tc, tc + .12)); });
    lifted(ctx, c, .45, () => popUp(ctx, 2230, 460, easeBack(swU, 1.2) * (1 - expoIn(swF)), () => stopwatch(ctx, t, 2230, 330, 112, { run: run + .4 * Math.sin(t * .8), wedge: run / 60 })));
  }
  const pin = span(t, a.public - .15, a.public + .5);
  if (pin > 0 && swF < 1) {
    COPIES.forEach(([x, y, r], i) => { const k = span(t, a.public + .35 + i * .09, a.public + 1.6 + i * .09); if (k <= 0) return; const e = sineIO(k); lifted(ctx, c, .35 + .3 * Math.sin(Math.PI * k), () => P.chartCopy(ctx, lerp(MAIN_CHART[0], x, e), lerp(MAIN_CHART[1], y, e), 170, lerp(0, r, e) + .4 * Math.sin(Math.PI * e))); });
    lifted(ctx, c, .45, () => { const dy = (1 - expoOut(pin)) * -420; P.chartCopy(ctx, MAIN_CHART[0], MAIN_CHART[1] + dy, 230, .03 * Math.sin(t * .9) + (1 - pin) * .1, { lab: 'METR · PUBLIC' }); ctx.fillStyle = PAL.red1; ctx.beginPath(); ctx.arc(MAIN_CHART[0], MAIN_CHART[1] + dy - 70, 8, 0, 6.29); ctx.fill(); });
  }
  // --- 7.04 the doorframe, the task stack, the kid and the ruler (stand up; ★ the kid grows past the ruler); fold flat at 8.0x
  const dfU = span(t, a.admit - .1, a.problem + .8), dfF = span(t, a.weather + .5, a.weather + 2.2);
  if (dfU > 0 && dfF < 1) {
    const up = easeBack(dfU, 1.05) * (1 - expoIn(dfF));
    lifted(ctx, c, .4, () => popUp(ctx, DF.x, DF.yb, up, () => P.doorframe(ctx, DF.x, DF.yb, DF.w, DF.h, { mu: span(t, a.problem, a.problem + 1.5) })));
    lifted(ctx, c, .35, () => popUp(ctx, 2250, DF.yb, up, () => P.taskStack(ctx, t, 2250, DF.yb, 130, 12, lerp(12, 2, smooth(span(t, a.hard - .5, a.hard + 1.1))))));
    const kidH = lerp(lerp(205, 236, smooth(span(t, a.kid - .1, a.kid + .9))), 362, easeBack(span(t, a.short - .05, a.short + .65), 1.15));
    lifted(ctx, c, .5, () => popUp(ctx, KID_X, DF.yb, up, () => other(ctx, KID_X, DF.yb, kidH, { dir: 1, light: 1, look: .15 + .3 * span(t, a.short, a.short + .8), rim: PAL.ink0, armR: [.15, .08], armL: [-.15, -.08] })));
    const wob = .05 * bump(t, a.short + .08, .7) * Math.sin((t - a.short) * 16);
    const rTop = DF.yb - RUL.L, ringK = span(t, a.short + .35, a.short + 1.0);
    lifted(ctx, c, .52, () => popUp(ctx, RUL.x, DF.yb, up, () => { P.ruler(ctx, RUL.x, DF.yb, RUL.L, RUL.w, { rot: wob }); }));
    if (ringK > 0 && dfF <= 0) onSheet(ctx, c, () => ring(ctx, RUL.x, rTop, 36, 22, ringK * (1 - span(t, a.grow - .3, a.grow + .2)), { w: 4 }));
  }
  // --- 8.03 you: a yellow dot lands and grows into you; the hourglass stands up on the fork, tips toward your hands and pours; papers rise
  const dotT = a.pic - .05, gU = span(t, dotT + .35, dotT + 1.2);
  const flyP = span(t, a.most - .2, a.rare - .2);   // 8.04 the papers fly down-left to the door
  if (t > dotT && t < a.rare + 1) {
    const yx = YOU8.x, yy = YOU8.y, h = YOU8.h;
    const open = smooth(span(t, a.wday + .4, a.wday + 1.4)), out = span(t, a.most + .2, a.rare);
    onSheet(ctx, c, () => {
      if (gU < .08) { const land = expoOut(span(t, dotT, dotT + .35)); ctx.fillStyle = PAL.coat; ctx.beginPath(); ctx.arc(yx, yy - 8 - (1 - land) * 160, 7 * land + 2, 0, 6.29); ctx.fill(); return; }
      if (out >= 1) return;
      // you walk off down-left after the papers (step out of frame), as the camera leaves
      const wx = yx - expoIn(out) * 260, br = Math.sin(t * 1.6) * .03;
      you(ctx, wx, yy, h * expoOut(gU), { dir: out > 0 ? -1 : 1, view: out > 0 ? 'side' : undefined, walk: out > 0 ? out * 14 : undefined, look: .35 + .2 * open, light: 1, rim: PAL.gold1,
        armR: out > 0 ? undefined : [lerp(.12 + br, 1.25, open), lerp(.08, 1.95, open)], armL: out > 0 ? undefined : [lerp(-.14 - br, 1.05, open), lerp(-.06, 1.75, open)] });
    });
    // the glow in your hands (the working day, poured)
    const hx = yx + h * .2, hy = yy - h * .48, pour = span(t, a.aimed - .6, a.aimed + 1.2), glow = smooth(pour) * (1 - span(t, a.most, a.rare));
    // the hourglass
    const hgU = span(t, a.wday - .15, a.wday + .55), tip = smooth(span(t, a.wday + .7, a.aimed - .3)), hgF = span(t, a.contract - .9, a.contract - .2);
    if (hgU > 0 && hgF < 1) {
      const hx0 = FK[0], hy0 = FK[1] - 80;
      lifted(ctx, c, .55, () => popUp(ctx, hx0, FK[1], easeBack(hgU, 1.2) * (1 - expoIn(hgF)), () => hourglass(ctx, t, lerp(hx0, hx0 - 30, tip), lerp(hy0, hy0 - 40, tip), 150, { sand: lerp(.15, .75, pour), tip: -2.05 * tip, label: false }))); 
      { const lu = span(t, a.wday, a.wday + .7) * (1 - tip) * (1 - hgF); if (lu > 0) lifted(ctx, c, .55, () => label(ctx, 'ONE WORKING DAY', hx0 - 40, hy0 - 95, 22, lu, { align: 'right' })); }   // up-left of the glass, clear of the line
      if (pour > 0 && pour < 1) onSheet(ctx, c, () => { const sx = lerp(hx0, hx0 - 30, tip) - 18, sy = hy0 - 40 + 30; ctx.fillStyle = PAL.flame; for (let i = 0; i < 26; i++) { const f = ((i / 26) + t * 1.7) % 1, x = lerp(sx, hx, f) + Math.sin(i * 7.3) * 3, y = lerp(sy, hy - 6, f) + f * (1 - f) * -40; ctx.globalAlpha = .9 * Math.sin(Math.PI * clamp(pour * 3)) * (pour < .9 ? 1 : (1 - pour) * 10); ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.29); ctx.fill(); } ctx.globalAlpha = 1; });
    }
    if (glow > 0) onSheet(ctx, c, () => E.halo(ctx, hx, hy - 6, 90 * glow, .55 * glow, PAL.flame, PAL.gold0));
    // the papers rise one per phrase from your hands, hover, then fly to the door
    const KINDS = [['contract', a.contract, [YOU8.x - 120, YOU8.y - 245, -.12]], ['bill', a.bill, [YOU8.x + 5, YOU8.y - 290, .06]], ['napkin', a.idea, [YOU8.x + 125, YOU8.y - 250, .14]]];
    KINDS.forEach(([kind, tk, [tx, ty, tr]], i) => {
      const k = span(t, tk - .1, tk + .9); if (k <= 0) return;
      const e = expoOut(k), bob = Math.sin(t * 1.3 + i * 2) * 5;
      let x = lerp(hx, tx, e), y = lerp(hy - 10, ty, e) + bob * e, r = lerp(0, tr, e), w = lerp(30, 108, e);
      const f = span(t, a.most - .25 + i * .12, a.rare + .1 + i * .12);
      if (f > 0) { const q = sineIO(f), p0 = [tx, ty], p1 = [1750 - i * 60, 900 + i * 30], p2 = [DOOR.cx + (i - 1) * 40, DOOR.yb - 160]; x = (1 - q) ** 2 * p0[0] + 2 * q * (1 - q) * p1[0] + q * q * p2[0]; y = (1 - q) ** 2 * p0[1] + 2 * q * (1 - q) * p1[1] + q * q * p2[1]; r = tr + q * (2.4 + i * .6); w = lerp(108, 70, q); }
      if (f >= 1) return;
      const gone = smooth(span(f, .8, 1));   // into the light of the doorway
      ctx.save(); ctx.globalAlpha *= 1 - gone; lifted(ctx, c, .6 + .3 * Math.sin(Math.PI * f), () => P.paper(ctx, kind, x, y, w * (1 - .45 * gone), r)); ctx.restore();
    });
  }
  drawCall(ctx, c, t, a);
}

// ---------------------------------------------------------------------------------------------------------------- 7.06 the channel's call
// On 'superintelligence' a pulse runs down the light line; from its foot the light spreads along the ground under the chart and
// everyone stands up in it (small silhouettes, you among them in yellow). On 'subscribe' a cream card drops in on its pin beside you.
const ROW_Y = 1215, YOU_ROW = 21;
const ROW = (() => { const r = prng(1906), o = []; for (let i = 0; i < 43; i++) { const x = 300 + i * 56 + (r() - .5) * 26; o.push({ x: i === YOU_ROW ? 1470 : x, y: ROW_Y + (r() - .5) * 14, h: 64 + r() * 14, dir: r() < .5 ? -1 : 1, ph: r() * 6 }); } return o; })();
function drawCall(ctx, c, t, a) {
  if (t < a.si - .2 || t > a.T8 + 1.2) return;
  const xo = clamp(aiAt(0)[0], 400, 2600), R = 2500 * smooth(span(t, a.si + .35, a.forAll + .5));
  const sink = smooth(span(t, a.T8 + .2, a.T8 + 1.1));   // they lie down again once the car has closed round the camera (off screen)
  // the light along the ground
  if (R > 0) onSheet(ctx, c, () => {
    const g = lin(ctx, xo - R, 0, xo + R, 0, [[0, rgba(PAL.gold2, 0)], [.12, rgba(PAL.gold2, .5)], [.5, rgba(PAL.gold1, .75)], [.88, rgba(PAL.gold2, .5)], [1, rgba(PAL.gold2, 0)]]);
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = g; ctx.globalAlpha *= .3 * (1 - sink); ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(xo - R, ROW_Y + 6); ctx.lineTo(xo + R, ROW_Y + 6); ctx.stroke();
    ctx.globalAlpha /= .3; ctx.globalAlpha *= .85; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
  });
  lifted(ctx, c, .3, () => {
    ctx.shadowColor = 'transparent';   // (43 figures: a blurred shadow per stroke costs seconds a frame; each figure has its own ground shadow)
    ROW.forEach((p, i) => {
      const lit = smooth(clamp((R - Math.abs(p.x - xo)) / 260)); if (lit <= 0) return;
      const up = easeBack(clamp(lit * 1.4), 1.15) * (1 - sink);
      if (up <= .01) return;
      E.halo(ctx, p.x, p.y - p.h * .45, p.h * .9, .22 * lit * (1 - sink), PAL.gold1, PAL.gold2);
      const look = .15 + .1 * Math.sin(t * .7 + p.ph);
      popUp(ctx, p.x, p.y, up, () => {
        if (i === YOU_ROW) you(ctx, p.x, p.y, p.h * 1.04, { dir: 1, light: 1, look: look + .15 * smooth(span(t, a.wantToo, a.wantToo + .8)), rim: PAL.gold1 });
        else other(ctx, p.x, p.y, p.h, { dir: p.dir, light: 1, look, rim: mixHex(PAL.cutLit, PAL.gold1, lit) });
      });
    });
  });
  // the card
  const cd = span(t, a.subscr - .3, a.subscr + .55);
  if (cd > 0) lifted(ctx, c, .45, () => popUp(ctx, 1545, 1150, 1 - sink, () => qcardStaged(ctx, t, 1545, 1028, 178, { drop: cd, dropH: 300 }, ['SUBSCRIBE'], [span(t, a.subscr - .1, a.subscr + .45)])));
}

// ---------------------------------------------------------------------------------------------------------------- the car
function drawCar(ctx, c, t, a) {
  // which car, how far closed in; the c06 car (R6, road = the dashed formula) and the c08 car (R8, road = the light line)
  let R = null, close = 0, st = null;
  if (t > a.forecast && t < a.counted) {
    R = R6; close = span(t, a.forecast - .4, a.like + 2.5);
    st = { on: span(t, a.gps - .15, a.gps + .55), route: span(t, a.gps + .45, a.same - .2), bend: smooth(span(t, a.turn + .05, a.turn + .85)), roll: span(t, a.changes - .05, a.changes + .45),
      light: smooth(span(t, a.mline + .1, a.too + .3)), flag: span(t, a.too - .1, a.too + .5), flagLab: span(t, a.too + .1, a.too + .7), branch: span(t, a.route - .05, a.route + .8) };
  } else if (t > a.T8 - .65 && t < a.bent + 1.25) {   // (gone once the camera is through the glass: it pulls back over the sheet later)
    R = R8; close = span(t, a.T8 - .45, a.T8 + .75);
    st = { on: 1, route: 1, bend: 0, roll: 1, light: 1, flag: 1, flagLab: 1, branch: 1 };
  }
  if (!R) return;
  const c06 = R === R6;
  CAR_THIN = c06 ? t > a.closed - .3 : t > a.bent - .1;
  // the fog (c06 car, 7.01): creeps in from the edges as we pull back out of the GPS; the wipe follows your hand
  const fogU = c06 ? span(t, a.route + .2, a.see + .2) : 0;
  const wipeU = c06 ? span(t, a.see + .25, a.nobody + .55) : 0, clearU = c06 ? smooth(span(t, a.closed - .35, a.closed + .9)) : 0;
  const wipe = wipeU > 0 ? { pts: partial(WIPE_PTS, Math.max(.05, wipeU)), r: lerp(50, 150, smooth(clamp(wipeU * 3))) } : null;
  if (fogU > 0 && clearU < 1) { ctx.save(); ctx.globalAlpha *= (1 - clearU) * clamp((ZG - c.z - 120) / 500); carCard(ctx, c, R, ZG, close, () => P.fog(ctx, t, fogU, wipe)); ctx.restore(); }   // the rest of the fog lifts as we go through
  carCard(ctx, c, R, ZF, close, () => P.carFrame(ctx, { edge: c06 ? PAL.cutLit : mixHex(PAL.cutLit, PAL.cool2, .4) }));
  carCard(ctx, c, R, ZD, clamp(close * 1.08), () => {
    P.carDash(ctx, t, { gps: st, glow: st.on });
    // the question card on the dash beside the GPS (6.05), answered in 7.01; the note for the curious under it
    if (c06) {
      const qd = span(t, a.canwe - .45, a.canwe + .85);
      if (qd > 0) {
        qcard(ctx, t, 1005, 600, 290, { drop: qd, dropH: 420, lines: ['CAN WE', 'STEER THIS ONE?'], u: span(t, a.canwe + .1, a.canwe + .7), answer: 'SEE IT', au: span(t, a.see - .05, a.see + .6) });
        label(ctx, 'CYBERNETICS = THE SCIENCE OF STEERING', 1005, 820, 13, span(t, a.see + .3, a.see + 1.1), { align: 'center', col: PAL.ink1, spacing: .14 });
      }
    }
  });
  // the wheel and you (from behind): hands on the rim (c06), turning on 'another turn'; empty wheel, hands in the lap (c08)
  const turn = c06 ? .5 * easeBack(span(t, a.turn - .05, a.turn + .7), 1.05) * (1 - smooth(span(t, a.changes + .3, a.changes + 1.6))) : .015 * Math.sin(t * .7);
  carCard(ctx, c, R, ZW, clamp(close * 1.15), () => wheel(ctx, t, WHEEL_CAR.x, WHEEL_CAR.y, WHEEL_CAR.r, { turn }));
  carCard(ctx, c, R, ZY, clamp(close * 1.22), () => {
    const Y = YOU_CAR, br = Math.sin(t * 1.5) * .012;
    let armR, armL;
    if (c06 && wipeU <= 0) {
      const hp = (ang) => [WHEEL_CAR.x + Math.cos(ang + turn) * WHEEL_CAR.r * .96, WHEEL_CAR.y + Math.sin(ang + turn) * WHEEL_CAR.r * .96];
      armR = ik(Y.x, Y.y, Y.h, 1, hp(-.35)); armL = ik(Y.x, Y.y, Y.h, -1, hp(Math.PI + .35));
    } else if (c06) {
      const lift = smooth(span(wipeU, 0, .12)) * (1 - smooth(span(t, a.closed - .2, a.closed + 1.3)));   // the arm comes down slowly as we move in
      const rest = ik(Y.x, Y.y, Y.h, 1, [WHEEL_CAR.x + Math.cos(-.35) * WHEEL_CAR.r * .96, WHEEL_CAR.y + Math.sin(-.35) * WHEEL_CAR.r * .96]), wa = WIPE_ARM(clamp(wipeU));
      armR = [lerp(rest[0], wa[0], lift), lerp(rest[1], wa[1], lift)]; armL = ik(Y.x, Y.y, Y.h, -1, [WHEEL_CAR.x + Math.cos(Math.PI + .35) * WHEEL_CAR.r * .96, WHEEL_CAR.y + Math.sin(Math.PI + .35) * WHEEL_CAR.r * .96]);
    } else { armR = [.16 + br, .3]; armL = [-.16 - br, -.3]; }
    ctx.save(); ctx.beginPath(); ctx.rect(-600, -600, W + 1200, 1222 + 600); ctx.clip();   // nothing of you below the seat (the legs)
    you(ctx, Y.x, Y.y, Y.h, { view: 'back', dir: 1, light: 1, look: .1 + .05 * Math.sin(t * .6), armR, armL, rim: c06 ? mixHex(PAL.cutLit, PAL.cool1, .4 * (st.on ?? 0)) : PAL.cool1 });
    ctx.restore(); P.seat(ctx);
  });
}

// ---------------------------------------------------------------------------------------------------------------- the expert's door (8.04)
function drawDoor(ctx, c, t, a) {
  if (t < a.rare - .95) return;
  // the wall gathers round the doorway (an iris: the doorway is the whole screen first, the papers fly into it), then the door shuts
  const close = span(t, a.rare - .9, a.rare + .8), shut = smooth(span(t, a.rare + .45, a.rare + 1.05));
  const leafA = smooth(span(t, a.lucky + .1, a.lucky + .8)) * .32 * (1 - smooth(span(t, a.lucky + 1.9, a.now))), leafB = smooth(span(t, a.anyone + .2, a.anyone + 1.1));
  const open = Math.max(1 - shut, leafA, leafB), flood = smooth(span(t, a.anyone + .4, a.anyone + 1.5));
  const dr = span(t, a.anyone - .05, a.anyone + .8);
  const S = Math.exp(lerp(Math.log(9), 0, sineIO(close)));
  // the wheel rises out of the light as we fly in (it resolves from the hub outward); it meets the plate (lifted .7) at the seam
  const wr = span(t, a.mc + .55, T9Plate(a));
  if (wr > 0) {
    const P0 = WHEEL_PLATE;
    lifted(ctx, c, .7 * smooth(wr), () => { ctx.save(); ctx.beginPath(); ctx.arc(P0.x, P0.y, P0.r * 1.06 * expoOut(clamp(wr * 1.6)), 0, 6.29); ctx.clip(); wheel(ctx, t, P0.x + drift(t, 2, 3), P0.y, P0.r, { turn: .02 * Math.sin(t * .8) }); ctx.restore(); });
  }
  const dz = ZWALL - c.z; if (dz < 30) return;
  lifted(ctx, c, 1, (k) => {
    const { cx, yb, w: dw, h: dh } = DOOR;
    // close-in about the door's centre (the wall gathers from the frame edges round the light)
    const m = ctx.getTransform(), px = m.a * cx + m.e, py = m.d * (yb - dh / 2) + m.f;
    ctx.setTransform(m.a * S, 0, 0, m.d * S, px + (m.e - px) * S, py + (m.f - py) * S);
    P.wall(ctx, cx, yb, dw, dh, WALL_BOX, { lightA: .35 + .65 * Math.max(flood, open * 1.4), spill: Math.max(flood, open * .8) });
    // light leaking round the closed leaf
    if (open < .99) { ctx.save(); ctx.strokeStyle = rgba(PAL.gold1, (.5 + .15 * Math.sin(t * 2.3) + .08 * Math.sin(t * 5.1)) * (1 - open)); ctx.lineWidth = 5 + 1.5 * Math.sin(t * 1.7); ctx.stroke(P.doorPath(cx, yb, dw * .985, dh * .995)); ctx.restore(); }
    P.doorLeaf(ctx, cx, yb, dw, dh, open);
    // two silhouettes pass the rope (the lucky few) and go into the light
    for (let i = 0; i < 2; i++) {
      const wk = span(t, a.lucky - .3 + i * .45, a.lucky + 1.6 + i * .45); if (wk <= 0 || wk >= 1) continue;
      const x = lerp(cx - 760 + i * 70, cx - 20 + i * 40, sineIO(wk)), sc = lerp(1, .78, smooth(span(wk, .7, 1))), into = smooth(span(wk, .78, 1));
      ctx.save(); ctx.globalAlpha *= 1 - into;
      other(ctx, x, yb - into * 18, 190 * sc, { dir: 1, walk: wk * 20, light: 1, rim: mixHex(PAL.cutLit, PAL.gold1, .5 + .5 * into) });
      ctx.restore();
    }
    // the rope (unhooks and drops on 'on call for anyone')
    P.rope(ctx, t, cx - 120, cx + 120, yb + 40, 95, dr);
    // you: outside, then in the flood of light, then you step in
    const st = span(t, a.mc - .05, a.mc + .9), into = smooth(span(st, .55, 1));
    if (into < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - into;
      const sag = smooth(span(t, a.rare + .8, a.rare + 1.9)) * (1 - smooth(span(t, a.lucky - .2, a.lucky + .8)));   // the door shuts: you step back a little, head down; up again for the lucky few
      const x = lerp(cx - 330 - 48 * sag, cx - 10, sineIO(st)), sc = lerp(1, .8, smooth(span(st, .5, 1)));
      you(ctx, x, yb + 70 - st * 70, 175 * sc, { dir: 1, view: st > 0 ? 'side' : undefined, walk: st > 0 ? st * 16 : (sag > 0 && sag < 1 ? sag * 3 : undefined), light: 1, back: .25 + .7 * flood, look: .3 + .2 * flood - .45 * sag, rim: mixHex(PAL.cutLit, PAL.gold1, flood) });
      ctx.restore();
    }
  }, { depth: ZS - ZWALL, shadow: 0 });
}
const T9Plate = (a) => a.T9 - SEAM_HALF;
// the kit's question card with its lines rising one by one (same transform as qcard: pin, drop, swing)
function qcardStaged(ctx, t, x, y, w, o, lines, us) {
  qcard(ctx, t, x, y, w, { ...o, lines: [] });
  const h = w * .6, drop = o.drop ?? 1, dy = (1 - expoOut(drop)) * -(o.dropH ?? 500), sw = .015 * Math.sin(t * .9) + (1 - drop) * .05 * Math.sin(t * 6);
  ctx.save(); ctx.translate(x, y + dy); ctx.rotate(sw);
  lines.forEach((s, i) => label(ctx, s, 0, w * .04 + h * .2 + (i + 1) * h * .16 - h * .03, w * .085, us[i], { align: 'center', col: PAL.cInk0, spacing: .08 }));
  ctx.restore();
}
