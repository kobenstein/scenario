// Film 19 · B3 · c09 + c10 + c11 + end screen as ONE plan sequence on THE SHEET (builder B3). The three scene files return one entry
// each with the same draw function (b3World), so the chunk seams c09→c10 and c10→c11 are identical frames by construction.
// Incoming seam: plateWheel (B2 → B3) at T.G('Right now, though'): this module draws the plate for [T0, T0 + .5) and grows its world
// out of it (the plate's first own frame = the plate: same camera, sheet light, glow and wheel; everything else starts at 0).
//
// THE SHEET geography of B3 (design px; the 1960 chart lives at x 160…1633, y ≤ 1010, the light line at x 1960…2620):
//   the wheel room (9.01–9.02)      below the chart: wheel (960, 1900) r 330, floor y 2290, the tall window (arch) behind it
//   the lights (9.02)               the whole lower sheet (y > 1080) around the window: eight billion points of light
//   the knee + arrows (9.03)        the real line 1880→2026 becomes tiny gold arrows (they stay on the sheet for c11)
//   the kitchen (9.04)              on the light line's baseline (floor y 960): window frames the light line, table, lamp, you
//   the shop (9.05)                 x 2950…3500, floor y 960: lit shop window, the question card on the glass
//   the candle + slip (10.01, 11.05) candle (3900, 960), slip pin (3990, 600) — the warm hero of c10/c11
//   the 1973 card (10.02–10.03)     pin (3650, −430); the screen of buttons (10.04) left of it (2700, −700); the gauge over the
//                                   phone and the § page (10.05) at y −1010; tutor | form (10.06) at y −1500…−1960
//   c11                              the light line with hands → the knee (you) → CURVE AHEAD → answer cards → the fan → the slip
//                                   with candle, ∞ and ≈ 8.3 BILLION → pull back to the whole sheet (end screen: content in the
//                                   bottom strip, the free areas left as night/paper)
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
import * as B from './f19_b3_kit.mjs';
import { plateWheel, WHEEL_PLATE, PLATE_DRIFT, youAtKnee, LINES_PLATE } from './f19_seams.mjs';
const { W, H, rgba, mixHex, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, camAt, camDrift, aim, cardM, prng, drift } = E;
const { PAL, ZS, CH, KNEE, yearX, popY, realPop, realPts, aiPts, sheet, chart1960, onSheet, lifted, label, ink, lightLine, partial, bump } = F;

export const PRINT = F.PRINT19;
const S = span, EO = expoOut;
const easeOut3 = (x) => 1 - (1 - clamp(x)) ** 3;

// ================================================================================================================ anchors (phrases)
export function anchors(T) {
  const G = (p, after = -1) => T.G(p, 0, after), GE = (p, after = -1) => T.GE(p, 0, after);
  const a = {};
  a.c09 = T.G('Right now, though'); a.few = G('a few people', a.c09); a.calls = G('big calls', a.c09);
  a.build = G('build these', a.c09); a.fund = G('fund them', a.c09); a.rules = G('write their rules', a.c09);
  a.villain = G('villain', a.c09); a.heavy = G('heavy load', a.c09); a.veryfew = G('very few', a.heavy); a.nosmall = G('no small group', a.heavy);
  a.eight = G('eight billion', a.nosmall); a.need = G('need', a.eight);
  a.first = G('The first line bent', a.eight); a.plan = G('one shared plan', a.first); a.family = G('family decisions', a.first);
  a.machine = G('machine line', a.first); a.steered = G('steered the same way', a.first);
  a.nofam = G('No family decides', a.first); a.howfast = G('how fast', a.nofam); a.learn = G('learn', a.howfast); a.billions = G('billions of us', a.nofam);
  a.forr = G("what they're for", a.nofam); a.everyday = G('Every day', a.nofam); a.use = G('what we use', a.everyday); a.refuse = G('refuse', a.everyday); a.ballot = G('ballot box', a.everyday);
  a.still = G('Still, choosing', a.ballot); a.shiny = G('shiny', a.still); a.how = G('How can you tell', a.still); a.bigger = G('bigger, or', a.how); a.smaller = G('smaller', a.bigger);
  a.c10 = T.G('To tell bigger from smaller'); a.man = G('the man behind', a.c10); a.test = G('left a test', a.c10);
  a.y73 = G('nineteen seventy-three', a.test); a.single = G('single line', a.y73); a.act = G('Act always', a.y73); a.choicesE = GE('number of choices', a.act);
  a.quoteW = T.GW('Act always', 'choices', a.y73);
  a.picky = G('picky', a.act); a.lastword = G('last word', a.picky); a.notopt = G('Not options', a.lastword); a.optE = GE('Not options', a.lastword); a.Choices = G('Choices', a.optE);
  a.screen = G('A screen full', a.Choices); a.buttons = G('buttons', a.screen); a.options2 = G('options', a.buttons); a.choice = G('A choice is', a.buttons); a.yours = G('truly yours', a.choice);
  a.hold = G('Hold his rule up', a.yours); a.app = G('an app', a.hold); a.law = G('a law', a.app); a.arrives = G('After it arrives', a.law);
  a.more = G('more of their own', a.arrives); a.including = G('Including', a.arrives); a.own = G('own decisions', a.arrives); a.fewer = G('or fewer', a.own); a.sayno = G('say no', a.fewer);
  a.tutor = G('A tutor', a.sayno); a.kid = G('any kid', a.tutor); a.passes = G('passes the test', a.tutor); a.system = G('A system that', a.passes); a.quietly = G('quietly decides', a.system); a.fails = G('fails it', a.system);
  a.c11 = T.G("The test isn't how smart"); a.smart = G('how smart', a.c11); a.hands = G('human hands', a.c11); a.handsE = GE('human hands', a.c11);
  a.moreC = G('More choices bent', a.hands); a.quiet = G('quietly', a.moreC); a.lifetime = G('inside your lifetime', a.moreC); a.nextbend = G('The next bend', a.lifetime); a.see = G('see coming', a.nextbend);
  a.one = G('one choice', a.see); a.answer = G('answer below', a.one); a.want = G('really want', a.answer);
  a.second = G('the second line to go', a.answer); a.everyone = G('for everyone', a.second); a.justfew = G('just a few', a.everyone); a.subscribe = G('subscribe', a.justfew); a.channel = G('this channel', a.subscribe);
  a.friday = G('This Friday, the formula', a.channel); a.infinity = G('infinity', a.friday); a.eight2 = G('eight billion', a.infinity); a.stillC = G('Still choosing', a.eight2);
  a.ending = G("Friday isn't an ending", a.stillC); a.checkpoint = G('checkpoint', a.ending); a.both = G('both lines', a.checkpoint); a.bday = G('a birthday', a.both);
  a.happy = G('Happy birthday, Heinz', a.bday); a.heinz = G('Heinz', a.happy); a.vo = GE('Happy birthday, Heinz', a.bday);
  a.end = T.duration;
  a.es = Math.max(a.vo + .9, a.end - 15);   // end screen start (film end − 15 s; follows timing.json, no fixed seconds)
  return a;
}

// ================================================================================================================ fixed geometry
const WH = WHEEL_PLATE;                        // wheel (960, 1900) r 330
const FLOOR9 = 2290, WIN9 = { x: 960, y: FLOOR9, w: 760, h: 1180 };
const KIT = { win: [2270, 160, 400, 540], table: [2120, 2760, 850], lampX: 2720, floor: 960, youX: 2160, youH: 230 };
const SHOP = { x: 2950, y: 380, w: 550, h: 500, card: [3330, 418], youX: 2885 };
const CAND = { x: 3900, y: 960, h: 185 }, SLIPB = { x: 3995, y: 590, w: 170 };
const CARD73 = { x: 3650, y: 1300, w: 860 };
const SCR = { x: 2690, y: 1420, w: 460, h: 300 };
const PHONE = [3420, 2215], PARA = [3990, 2215];
const GA = { x: 3420, y: 1990, w: 560 }, GB = { x: 3990, y: 1990, w: 560 };
const TUT = { x: 2380, y: 2470, h: 420 }, FORM = { x: 3090, y: 1990, w: 250 };
const OK_PTS = [[2875, 1915], [2925, 1975], [3010, 1850]];
const INF = { x: 4280, y: 500 }, BIL = { x: 4280, y: 700 };
const HEINZ = { x: 4520, y: 960, h: 250 };
const onReal = (yr) => [yearX(yr), popY(realPop(yr))];

// polyline helpers
const arcLen = (pts) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; };
function along(pts, L, f) { const d = clamp(f) * L[L.length - 1]; let i = 1; while (i < pts.length - 1 && L[i] < d) i++; const g = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], g), lerp(pts[i - 1][1], pts[i][1], g), Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])]; }
const RP = realPts(2026).filter((p) => p[0] >= yearX(1870)), RPL = arcLen(RP);
const AIL = arcLen(aiPts);
// a polyline drawn by its head and taken back by its tail: u 0..1 draws, v 0..1 undraws (from the start)
function strokeSpan(ctx, pts, u, v, w, col) {
  if (u - v < .004) return; const L = arcLen(pts), T = L[L.length - 1], a = v * T, b = u * T, out = [];
  for (let i = 0; i < pts.length; i++) { if (L[i] > a && L[i] < b) out.push(pts[i]); }
  const pa = along(pts, L, v), pb = along(pts, L, u); out.unshift([pa[0], pa[1]]); out.push([pb[0], pb[1]]);
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); out.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
}
// 2-bone arm IK for E.figure: shoulder → target, returns [s1, s2] (angles from straight down, + = forward)
function armTo(x, y, h, dir, side, tx, ty) {
  const sx = x + dir * side * .098 * h, sy = y - .74 * h, L1 = .17 * h, L2 = .155 * h;
  const dx = (tx - sx) * dir, dy = ty - sy, d = Math.min(Math.hypot(dx, dy), (L1 + L2) * .995), phi = Math.atan2(dx, dy);
  const beta = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const s1 = phi + beta, ex = Math.sin(s1) * L1, ey = Math.cos(s1) * L1, s2 = Math.atan2(dx - ex, dy - ey);
  return [s1, s2];
}
const lerpArm = (a0, a1, k) => [lerp(a0[0], a1[0], k), lerp(a0[1], a1[1], k)];

// ================================================================================================================ fixed fields
// eight billion lights (9.02): around the tall window, the lower sheet
const LIGHTS = B.makeLights(808, 960, 1750, 3400, 3200, 1300).filter((p) => p.y > 1090 && p.y < 2650 && p.x > -2550 && p.x < 2300);
// the tiny arrows on the real line (9.03): fixed slots along the line, each fed by one light that flies up
const NARR = 64;
const ARR = (() => { const r = prng(2026), o = []; for (let i = 0; i < NARR; i++) { const f = (i + .5) / NARR, [x, y, ang] = along(RP, RPL, f), side = i % 2 ? 1 : -1; o.push({ x: x - Math.sin(ang) * side * 12, y: y + Math.cos(ang) * side * 12, ang, turn: (r() - .5) * 2.2, res: (r() - .5) * .3, src: null, d0: r() }); } return o; })();
(() => { const cand = LIGHTS.map((p, i) => [p, i]).filter(([p]) => p.y < 1700 && p.x > -800 && p.x < 2900); const r = prng(55); for (const a of ARR) { const k = Math.floor(r() * cand.length); a.src = cand[k][1]; cand.splice(k, 1); } })();
const SRC = new Set(ARR.map((a) => a.src));
// cool arrows along the light line (9.03)
const CARR = (() => { const r = prng(77), o = []; for (let i = 0; i < 46; i++) { const f = .03 + i / 46 * .62, [x, y, ang] = along(aiPts, AIL, f), side = i % 2 ? 1 : -1; o.push({ f, x: x - Math.sin(ang) * side * 7, y: y + Math.cos(ang) * side * 7, ang, res: (r() - .5) * .3 }); } return o; })();
// the 8.3 billion dots under the label (11.05)
const DOTS11 = B.makeLights(83, BIL.x, BIL.y + 92, 700, 290, 36, 70);
// hands on the light line (11.01) and on the fan (11.04)
const HAND_F = (() => { const o = []; for (let i = 0; i < 9; i++) { const yy = lerp(840, 90, i / 8); let f = 0; while (f < 1 && along(aiPts, AIL, f)[1] > yy) f += .002; o.push(f); } return o; })();
const FAN = (() => { let f0 = 0; while (along(aiPts, AIL, f0)[1] > 860) f0 += .002; const base = along(aiPts, AIL, f0), o = []; const tail = [[base[0], base[1]], ...aiPts.filter((p) => p[0] > base[0] && p[1] > 860 - 820)]; for (const d of [-.78, -.56, -.36, -.18, .16, .32, .48]) { const c = Math.cos(d), s = Math.sin(d); o.push({ d, pts: tail.map(([x, y]) => { const dx = x - base[0], dy = y - base[1]; return [base[0] + dx * c - dy * s, base[1] + dx * s + dy * c]; }) }); } return o; })();
const FANP = (() => { let l = 1732, r = 3020; return FAN.map((fan) => { const L = arcLen(fan.pts), [tx, ty] = along(fan.pts, L, .4), left = fan.d < 0, x = left ? l : r; if (left) l += 56; else r += 64; return { x, dir: left ? 1 : -1, tx, ty }; }); })();

// ================================================================================================================ the camera
function keys(a) {
  const P = WH.cam;
  return [
    [a.c09 + .5, P],                                                   // = the plate (first own frame)
    [a.calls + .7, aim(ZS, 960, 1830, .64)],                            // 9.01 pull back: the huge wheel in the quiet room
    [a.rules + .7, aim(ZS, 960, 1880, .68)],                            // breathing push with the props
    [a.heavy + 1.0, aim(ZS, 960, 1960, .76)],                           // lean in as the wheel dips
    [a.nosmall + .2, aim(ZS, 960, 1930, .73)],
    [a.eight + 1.4, aim(ZS, 980, 1110, .34)],                            // 9.02 ★ the big pull back: eight billion lights
    [a.first, aim(ZS, 1000, 1090, .355)],                                // breathing (lights twinkle)
    [a.plan + .9, aim(ZS, KNEE.x - 40, KNEE.y + 30, 1.28)],             // 9.03 rise with the lights to the knee
    [a.family + 1.2, aim(ZS, KNEE.x - 10, KNEE.y + 10, 1.4)],           // breathing push while the arrows turn
    [a.steered + .9, aim(ZS, 2020, 720, .92)],                          // truck right: the same arrows on the light line
    [a.nofam + 1.6, aim(ZS, 2430, 620, 1.0)],                           // 9.04 the kitchen lifts round the light line
    [a.forr, aim(ZS, 2410, 640, 1.07)],
    [a.use - .2, aim(ZS, 2350, 720, 1.24)],                             // push toward you and the phone
    [a.ballot + 1.0, aim(ZS, 2390, 720, 1.3)],
    [a.still + 2.2, aim(ZS, 3150, 640, 1.02)],                          // 9.05 truck right with you to the shop window
    [a.bigger + .4, aim(ZS, 3240, 610, 1.12)],
    [a.c10 + 2.0, aim(ZS, 3600, 660, 1.12)],                            // 10.01 right: the card and the candle, the shop goes dark
    [a.y73 - .3, aim(ZS, 3640, 700, 1.18)],
    [a.single + .9, aim(ZS, 3650, 1610, .84)],                         // 10.02 tilt down to the 1973 card (it drops in on its pin)
    [a.choicesE + .6, aim(ZS, 3660, 1615, .9)],                        // breathing push while the quote writes
    [a.Choices + 1.0, aim(ZS, 3700, 1640, 1.0)],                       // 10.03 push to the ring round CHOICES
    [a.buttons + .7, aim(ZS, 3000, 1620, 1.28)],                        // 10.04 follow the ring left: it becomes a button
    [a.yours + 1.4, aim(ZS, 2980, 1700, 1.26)],                         // you draw your own line (below the screen)
    [a.app + .3, aim(ZS, 3520, 2130, 1.08)],                            // 10.05 ★ the card becomes the gauge over the phone
    [a.law + .9, aim(ZS, 3820, 2130, 1.12)],                            // … over the page with §
    [a.sayno + .9, aim(ZS, 3900, 2110, 1.24)],                          // push to the NO switch
    [a.tutor + 1.5, aim(ZS, 2880, 2170, 1.0)],                          // 10.06 left: tutor | form
    [a.fails + .3, aim(ZS, 2860, 2160, 1.06)],
    [a.c11 + 1.3, aim(ZS, 2600, 1230, .66)],                            // 11.01 the ✓ runs on up into the light line
    [a.smart + 1.8, aim(ZS, 2460, 430, .86)],                            // HOW SMART greys out
    [a.handsE + 1.0, aim(ZS, 2420, 440, .96)],                          // hands rise along the line and hold it
    [a.moreC + 2.0, aim(ZS, 1520, 600, 1.28)],                          // 11.02 left to the knee: you
    [a.lifetime + 1.2, aim(ZS, 1600, 690, 1.3)],
    [a.see + .8, aim(ZS, 1930, 730, .98)],                              // look right along the light line: CURVE AHEAD
    [a.answer + 1.6, aim(ZS, 1820, 760, 1.06)],                         // 11.03 the answer cards, you write on one
    [a.everyone + .9, aim(ZS, 2330, 430, .62)],                         // 11.04 the line fans out, hands on all of them
    [a.channel + .6, aim(ZS, 2360, 450, .66)],
    [a.friday + 1.5, aim(ZS, 3930, 650, 1.04)],                         // 11.05 the slip with the candle: ∞, ≈ 8.3 BILLION
    [a.stillC + .9, aim(ZS, 3970, 660, 1.12)],
    [a.both + .4, aim(ZS, 2400, 90, .42)],                             // 11.06 pull back: both lines, checkpoints
    [a.bday + .9, aim(ZS, 2300, 120, .39)],
    [a.happy + 1.4, END_A],                                             // 11.07 ★ the whole picture under the lamp
    [a.end, END_B],                                                     // 11.08 end screen: slow pull back
  ];
}
// end screen framing: the content (chart x 160 → candle/∞ x 4460, light line top −1540 → year labels 1010) in the bottom strip
// (the steep parts of both lines fall into the centre column x 783–1132; everything else sits below y 700: free areas stay paper)
const END_A = aim(ZS, 2110, 960, .332, W / 2, 1022);
const END_B = aim(ZS, 2110, 960, .316, W / 2, 1020);
// design point at the screen centre for a camera
function centre(c) { const M = cardM(c, ZS); return M ? [(W / 2 - M.e) / M.k, (H / 2 - M.f) / M.k, M.k] : [0, 0, 1]; }

// ================================================================================================================ the world
export function b3World(T) {
  E.prepareEditorial();
  const a = anchors(T), K = keys(a), T0 = a.c09;
  const QW = a.quoteW.map((w) => [w.s, w.e]);
  // the sheet light: the lamp follows the camera; warmer toward c11 (a warm pool on top grows)
  return (ctx, t) => {
    if (t < T0 + .5) return plateWheel(ctx, t);
    const dAmt = lerp(PLATE_DRIFT, .7, smooth(S(t, T0 + .5, T0 + 2.5)));
    const c = camDrift(camAt(t, K, ZS), t, dAmt);
    const [cx, cy, k] = centre(c);
    // ---- sheet: starts exactly as plateWheel's ({lamp: [960, 1700], lampR 1300, dim .05}) and follows the camera
    const lk = smooth(S(t, T0 + .5, T0 + 3.5));
    const lampX = lerp(960, cx, lk), lampY = lerp(1700, cy - 120 / Math.max(.2, k), lk), lampR = lerp(1300, lerp(1250, 760, smooth(S(t, a.c10 - 1, a.c10 + 3))) / Math.max(.16, k), lk);   // the pool tightens in c10/c11 (no room veil there: keeps luma in range)
    const coolA = smooth(S(t, a.machine - .5, a.steered + 1)) * (1 - .6 * smooth(S(t, a.c10, a.c10 + 3))) + .7 * smooth(S(t, a.c11, a.c11 + 3)) * (1 - .5 * smooth(S(t, a.happy - 2, a.happy + 2)));
    sheet(ctx, c, t, { lamp: [lampX, lampY], lampR, dim: .05 * (1 - lk), cool: [2480, 300, 1500, coolA * .55] });
    const warm = .12 * smooth(S(t, a.c10 - 2, a.c10 + 6)) + .12 * smooth(S(t, a.c11, a.happy));
    onSheet(ctx, c, () => B.pool(ctx, lampX, lampY, lampR * .8, warm, B.WARM));
    // ---- the 1960 page (the world stays): masthead, axes, dashed formula, the real line, NOW, the light line (no top slip: B3's slip
    // with the candle stands on the floor right of the shop; the ∞ is written beside it in 11.05)
    chart1960(ctx, c, t, { mast: 0, axes: 1, pplLab: 1, fu: 1, dash: 1, ru: 2026, now: 1, ai: 1, aiLab: 1, aiSpill: 0 });
    onSheet(ctx, c, () => {
      lightsAndArrows(ctx, t, a);
      if (t < a.c10 + 6) kitchenFlat(ctx, t, a);
      if (t > a.c11 - 1) c11Flat(ctx, t, a);
    });
    // ---- the night of the rooms (veil with lit holes), then the lifted layers
    roomsVeil(ctx, c, t, a);
    if (t < a.first + 5) wheelRoom(ctx, c, t, a);
    if (t > a.nofam - 1 && t < a.c10 + 1) kitchen(ctx, c, t, a);
    if (t > a.nofam && t < a.c10 + 6) youRoom(ctx, c, t, a);
    if (t > a.still - 1 && t < a.c11 + 9) shopAndCandle(ctx, c, t, a);
    else if (t >= a.c11 + 9) candleOnly(ctx, c, t, a);
    if (t > a.y73 - 2) c10Things(ctx, c, t, a, QW);
    if (t > a.c11 - 1) c11Things(ctx, c, t, a);
  };
}

// ================================================================================================================ c09 · the wheel room
function wheelRoom(ctx, c, t, a) {
  const T0 = a.c09, archU = smooth(S(t, T0 + .5, T0 + 2.4)), floorU = easeOut3(S(t, T0 + .7, T0 + 2.0));
  const lightsU = S(t, a.eight - .3, a.eight + 1.7);
  // the gold light the wheel stands in (exactly the plate's), then the tall window opens out of it
  onSheet(ctx, c, () => {
    const P = WH, R = P.r * 1.75 * (1 + .015 * Math.sin(t * .9));
    ctx.fillStyle = E.rad(ctx, P.x, P.y, R, [[0, rgba(PAL.gold1, .62)], [.42, rgba(PAL.gold2, .3)], [1, rgba(PAL.gold2, 0)]]); ctx.fillRect(P.x - R, P.y - R, R * 2, R * 2);
    if (archU > 0) {
      const ap = B.arch(WIN9.x, WIN9.y, WIN9.w, WIN9.h);
      ctx.save(); ctx.clip(ap); ctx.beginPath(); ctx.arc(P.x, P.y, lerp(0, 1500, archU), 0, 6.29); ctx.clip();
      ctx.fillStyle = E.lin(ctx, 0, WIN9.y - WIN9.h, 0, WIN9.y, [[0, rgba(PAL.gold0, .34)], [.5, rgba(PAL.gold1, .26)], [1, rgba(PAL.gold2, .16)]]); ctx.fillRect(WIN9.x - WIN9.w, WIN9.y - WIN9.h, WIN9.w * 2, WIN9.h);
      ctx.restore();
    }
  });
  // the window's bars (cut paper, drawn by their heads), the floor and the helm stand
  lifted(ctx, c, .25, () => {
    const bu = S(t, T0 + 1.6, T0 + 3.0);
    if (bu > 0) {
      const x0 = WIN9.x - WIN9.w / 2, x1 = WIN9.x + WIN9.w / 2, yS = WIN9.y - WIN9.h + WIN9.w / 2;
      const bar = (pts, u) => strokeSpan(ctx, pts, u, 0, 16, PAL.cut0);
      bar([[WIN9.x - WIN9.w / 6, WIN9.y], [WIN9.x - WIN9.w / 6, yS - Math.sqrt((WIN9.w / 2) ** 2 - (WIN9.w / 6) ** 2) + 4]], EO(bu));
      bar([[WIN9.x + WIN9.w / 6, WIN9.y], [WIN9.x + WIN9.w / 6, yS - Math.sqrt((WIN9.w / 2) ** 2 - (WIN9.w / 6) ** 2) + 4]], EO(S(bu, .1, 1)));
      bar([[x0, yS + 120], [x1, yS + 120]], EO(S(bu, .25, 1)));
      ctx.strokeStyle = PAL.cut0; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(WIN9.x, yS, WIN9.w / 2, Math.PI, Math.PI + Math.PI * EO(S(bu, .05, .9))); ctx.stroke();
      strokeSpan(ctx, [[x0, yS], [x0, WIN9.y]], EO(S(bu, .05, .9)), 0, 22, PAL.cut0); strokeSpan(ctx, [[x1, yS], [x1, WIN9.y]], EO(S(bu, .05, .9)), 0, 22, PAL.cut0);
    }
  }, { shadow: .6 });
  // the floor: a cut strip drawn from the centre outward; the stand rises from it to the hub
  lifted(ctx, c, .55, () => {
    if (floorU > 0) { const hw = 1250 * floorU; ctx.fillStyle = PAL.cut1; ctx.fillRect(WH.x - hw, FLOOR9, hw * 2, 16); ctx.fillStyle = rgba(PAL.gold2, .35); ctx.fillRect(WH.x - hw, FLOOR9, hw * 2, 3); }
    const su = EO(S(t, T0 + 1.0, T0 + 2.2)); if (su > 0) { ctx.fillStyle = PAL.cut1; const y1 = lerp(FLOOR9, WH.y + 40, su); ctx.beginPath(); ctx.moveTo(WH.x - 58, FLOOR9); ctx.lineTo(WH.x - 26, y1); ctx.lineTo(WH.x + 26, y1); ctx.lineTo(WH.x + 58, FLOOR9); ctx.closePath(); ctx.fill(); }
  });
  // the wheel (as on the plate) + its weight: on "heavy load" it dips (anticipation up, then down, settles low)
  const dipK = S(t, a.heavy - .25, a.heavy + 1.4), dip = -.18 * bump(t, a.heavy - .25, .35) + (dipK > .18 ? easeOut3(S(dipK, .18, 1)) : 0);
  const wy = WH.y + 26 * dip, turn = .02 * Math.sin(t * .8) + .1 * dip + .015 * Math.sin(t * 1.7) * dip;
  lifted(ctx, c, .7, () => F.wheel(ctx, t, WH.x + drift(t, 2, 3), wy, WH.r, { turn }));
  // a few people at its rim (indigo silhouettes, no faces): they stand up from the floor and take the rim
  lifted(ctx, c, .74, () => {
    const ppl = [[568, 1, 2010, 1985], [700, 1, 2140, 2120], [1222, -1, 2140, 2120], [1352, -1, 2010, 1985]];
    ppl.forEach(([x, dir, ty1, ty2], i) => {
      const up = EO(S(t, a.few - .1 + i * .14, a.few + .9 + i * .14)); if (up <= 0) return;
      const h = 300 * up, grip = smooth(S(t, a.calls - .2 + i * .1, a.calls + .8 + i * .1));
      const rimX = (ty) => WH.x - dir * Math.sqrt(Math.max(0, WH.r ** 2 - (ty - wy) ** 2)) * .97;
      const R = armTo(x, FLOOR9, 300, dir, 1, rimX(ty1 + 26 * dip) + dir * 6, ty1 + 26 * dip), L = armTo(x, FLOOR9, 300, dir, -1, rimX(ty2 + 26 * dip) + dir * 10, ty2 + 26 * dip);
      const lean = .06 * dip * (1 + .3 * (i % 2)) + .01 * Math.sin(t * 1.3 + i);
      F.other(ctx, x, FLOOR9, h, { dir, light: dir, look: .25 + .1 * Math.sin(t * .5 + i), lean, armR: lerpArm([.25, .15], R, grip), armL: lerpArm([-.2, -.1], L, grip), rim: PAL.gold2, long: i % 2 === 1 });
    });
    // build · fund · write their rules: three small papers land on the floor beside them
    const drop = (tw, x, w, fn) => { const k = S(t, tw - .35, tw + .45); if (k <= 0) return; const e = k < .7 ? expoIn(k / .7) : 1, y = lerp(FLOOR9 - 1250, FLOOR9, e) - 14 * bump(t, tw + .14, .3); ctx.save(); ctx.translate(x, y); ctx.rotate((1 - e) * .5 * (x > WH.x ? 1 : -1)); fn(w); ctx.restore(); };
    drop(a.build, 395, 150, (w) => { ctx.fillStyle = PAL.cool3; ctx.fillRect(-w / 2, -w * .62, w, w * .62); ctx.strokeStyle = rgba(PAL.cool0, .75); ctx.lineWidth = 2; for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-w / 2 + i * w / 6, -w * .62); ctx.lineTo(-w / 2 + i * w / 6, 0); ctx.stroke(); } for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-w / 2, -i * w * .155); ctx.lineTo(w / 2, -i * w * .155); ctx.stroke(); } ctx.strokeStyle = PAL.cool0; ctx.lineWidth = 4; ctx.strokeRect(-w * .3, -w * .45, w * .34, w * .28); });
    drop(a.fund, 1520, 110, (w) => { for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? PAL.gold2 : PAL.gold3; ctx.beginPath(); ctx.ellipse((i % 2) * 3, -i * w * .12 - w * .06, w / 2, w * .07, 0, 0, 6.29); ctx.fill(); } ctx.fillStyle = PAL.gold1; ctx.beginPath(); ctx.ellipse(3, -6 * w * .12 + w * .03, w / 2, w * .07, 0, 0, 6.29); ctx.fill(); });
    drop(a.rules, 1660, 130, (w) => { ctx.fillStyle = PAL.card; ctx.fillRect(-w / 2, -w * .28, w, w * .28); ctx.fillStyle = PAL.cInk1; ctx.fillRect(-w / 2, -w * .28, w * .08, w * .28); ctx.fillStyle = PAL.cardShade; ctx.fillRect(-w / 2, -w * .5, w * .92, w * .22); ctx.fillStyle = PAL.cInk0; ctx.fillRect(-w / 2, -w * .5, w * .08, w * .22); label(ctx, '§', w * .1, -w * .07, w * .2, 1, { serif: true, align: 'center', col: PAL.cInk0 }); });
  });
}

// the night of the rooms: the wheel room (arch), the kitchen (window), the street with the shop window. Lights, not fades: the
// room darkens as its window opens, the walls fall away when the eight billion lights spread, the kitchen lamp sets the night, the
// shop window glows, and the candle in c10 lets it go.
function roomsVeil(ctx, c, t, a) {
  const T0 = a.c09;
  const room = .38 * smooth(S(t, T0 + .5, T0 + 2.6)) * (1 - smooth(S(t, a.eight - .2, a.eight + 1.8)));
  const kit = .4 * smooth(S(t, a.nofam - .2, a.nofam + 1.6)) * (1 - .25 * smooth(S(t, a.still, a.still + 2))) * (1 - smooth(S(t, a.c10 + .5, a.c10 + 4.5)));
  onSheet(ctx, c, () => {
    if (room > 0) B.veil(ctx, room, [{ arch: [WIN9.x, WIN9.y, WIN9.w, WIN9.h] }]);
    if (kit > 0) {
      const [wx, wy, ww, wh] = KIT.win, kOut = S(t, a.still + .3, a.still + 1.8);
      const holes = []; if (kOut < 1) holes.push({ rect: [wx, wy, ww, wh] });
      const shopLit = shopLight(t, a); if (shopLit > .02) holes.push({ rect: [SHOP.x, SHOP.y, SHOP.w, SHOP.h] });
      B.veil(ctx, kit, holes);
    }
  });
}
function shopLight(t, a) {
  // the shop light warms on with one soft stutter (no frame-to-frame toggling: smooth.py flags those as lurches) and fades off at c10
  const on = smooth(S(t, a.still + .45, a.still + 1.15)) * (1 - .3 * bump(t, a.still + .78, .22));
  const off = smooth(S(t, a.c10 + .1, a.c10 + 1.6)) + .15 * bump(t, a.c10 + .3, .25);
  return clamp(on * (1 - off));
}

// ================================================================================================================ 9.02–9.03 lights → arrows
function lightsAndArrows(ctx, t, a) {
  const lu = S(t, a.eight - .3, a.eight + 1.7);
  if (lu > 0 && t < a.c10) {
    const fly0 = a.first + .15;
    B.lights(ctx, t, LIGHTS, lu, 9, { glow: true, skip: (i) => SRC.has(i) && t > fly0, tw: .18 });
  }
  // the flight: each source light rises along an arc to its slot on the real line and becomes a tiny arrow
  if (t > a.first) {
    const turnK = smooth(S(t, a.family - .2, a.family + 1.6));
    for (let i = 0; i < ARR.length; i++) {
      const ar = ARR[i], p = LIGHTS[ar.src], t0 = a.first + .15 + ar.d0 * 1.7, k = S(t, t0, t0 + 1.6);
      if (k <= 0) continue;
      if (k < 1) {
        const e = sineIO(k), mx = (p.x + ar.x) / 2 + (ar.x - p.x) * .1, my = Math.min(p.y, ar.y) - 380;
        const x = (1 - e) ** 2 * p.x + 2 * (1 - e) * e * mx + e * e * ar.x, y = (1 - e) ** 2 * p.y + 2 * (1 - e) * e * my + e * e * ar.y;
        const r = 11 * p.s * (1 - .5 * e); ctx.fillStyle = PAL.gold0; ctx.fillRect(x - r / 2, y - r / 2, r, r);
        if (e > .5) { ctx.fillStyle = rgba(PAL.gold1, .35); ctx.fillRect(x - r, y - r, r * 2, r * 2); }
        continue;
      }
      const g = EO(S(t, t0 + 1.6, t0 + 2.1)), ang = ar.ang + lerp(ar.turn, ar.res, turnK) + .04 * Math.sin(t * 1.4 + i);
      B.tick(ctx, ar.x, ar.y, ang, 24 * g + 4, PAL.gold0, 3.4);
    }
  }
  // the same tiny arrows appear along the light line (cool), swept from its foot
  const sw = S(t, a.steered - .15, a.steered + 1.3);
  if (sw > 0) for (const ar of CARR) { const g = EO(clamp((sw * 1.1 - ar.f / .65) * 6)); if (g <= 0) continue; B.tick(ctx, ar.x, ar.y, ar.ang + ar.res + .04 * Math.sin(t * 1.3 + ar.f * 30), 15 * g + 3, PAL.cool0, 2.6); }
}

// ================================================================================================================ 9.04 the kitchen
function kitchenFlat(ctx, t, a) {
  // the light line's own pace ("how fast"): a cool bead runs up it, seen through the window
  const pu = S(t, a.howfast - .2, a.learn + .6);
  if (pu > 0 && pu < 1) { const [x, y] = along(aiPts, AIL, lerp(.45, 1, sineIO(pu))); E.halo(ctx, x, y, 60, .9, PAL.cool1, PAL.cool0); ctx.fillStyle = PAL.cool0; ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.29); ctx.fill(); }
}
function kitchen(ctx, c, t, a) {
  const kU = S(t, a.nofam - .2, a.nofam + 1.5), kOut = S(t, a.still + .3, a.still + 1.8);
  if (kU <= 0) return;
  const [wx, wy, ww, wh] = KIT.win, [tx0, tx1, ty] = KIT.table, F9 = KIT.floor;
  // the window frame (bars drawn by their heads, taken back by their tails when you leave)
  lifted(ctx, c, .3, () => {
    const u = EO(kU), v = smooth(kOut), col = PAL.cut0;
    strokeSpan(ctx, [[wx, wy + wh], [wx, wy], [wx + ww, wy], [wx + ww, wy + wh], [wx, wy + wh]], u, v, 20, col);
    strokeSpan(ctx, [[wx + ww / 2, wy + wh], [wx + ww / 2, wy]], EO(S(kU, .3, 1)), v, 12, col);
    strokeSpan(ctx, [[wx, wy + wh * .45], [wx + ww, wy + wh * .45]], EO(S(kU, .4, 1)), v, 12, col);
    strokeSpan(ctx, [[wx - 30, wy + wh + 12], [wx + ww + 30, wy + wh + 12]], EO(S(kU, .2, 1)), v, 14, PAL.cut1);   // sill
  }, { shadow: .7 });
  // the lamp: comes down on its cord; warm pool on the table; it goes back up when you leave
  const ld = EO(S(t, a.nofam + .2, a.nofam + 1.6)) * (1 - smooth(S(t, a.still + .2, a.still + 1.6))), ly = lerp(-420, 470, ld);
  onSheet(ctx, c, () => { if (ld > 0) { B.pool(ctx, KIT.lampX, ty - 10, 520 * ld, .9 * ld, B.WARM); } });
  lifted(ctx, c, .55, () => {
    if (ld <= 0) return;
    ctx.strokeStyle = PAL.cut1; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(KIT.lampX, ly - 1200); ctx.lineTo(KIT.lampX, ly); ctx.stroke();
    E.halo(ctx, KIT.lampX, ly + 46, 120 * ld, .8 * ld, B.WARM, PAL.gold0);
    ctx.fillStyle = PAL.cut1; ctx.beginPath(); ctx.moveTo(KIT.lampX - 26, ly); ctx.lineTo(KIT.lampX + 26, ly); ctx.lineTo(KIT.lampX + 78, ly + 52); ctx.lineTo(KIT.lampX - 78, ly + 52); ctx.closePath(); ctx.fill();
    ctx.fillStyle = PAL.gold0; ctx.beginPath(); ctx.ellipse(KIT.lampX, ly + 54, 34, 9, 0, 0, 6.29); ctx.fill();
  });
  // the table (top drawn from the left, legs grow down), the phone, the ballot box and its slip, you
  lifted(ctx, c, .45, () => {
    const u = EO(S(kU, .2, 1)), v = smooth(S(kOut, .2, 1));
    strokeSpan(ctx, [[tx0, ty], [tx1, ty]], u, v, 22, PAL.cut1);
    const lg = EO(S(kU, .55, 1)) * (1 - v);
    if (lg > 0) { ctx.fillStyle = PAL.cut1; ctx.fillRect(tx0 + 40, ty, 16, (F9 - ty) * lg); ctx.fillRect(tx1 - 56, ty, 16, (F9 - ty) * lg); }
    if (u < 1 || v > .6) return;
    // the phone: on the table (dark slab) → in your hand (lit) → face down on the table (dark)
    if (t < a.use - .1) { ctx.fillStyle = PAL.cInk0; ctx.fillRect(2276, ty - 17, 48, 7); }
    // the ballot box on the table; the folded slip hops from the table into its slot
    B.ballotBox(ctx, 2560, ty - 11, 96);
    const hop = S(t, a.ballot - .25, a.ballot + .45);
    if (hop < 1) { const e = hop, sx = lerp(2440, 2560, e), sy = lerp(ty - 16, ty - 11 - 77, e) - 110 * Math.sin(Math.PI * Math.min(1, e * 1.05)); if (e < .98) B.foldSlip(ctx, sx, sy, 40, -.3 * e + .05); }
  });
}

// you in the kitchen and on to the shop window: you stand up at the table (as the people stood up at the wheel), look out at the
// line, take the phone (it lights), put it face down, vote; then walk right to the shop window and look up at it.
const PH = { held: false };
function youRoom(ctx, c, t, a) {
  const F9 = KIT.floor, ty = KIT.table[2];
  lifted(ctx, c, .45, () => {
    const upK = EO(S(t, a.nofam + .8, a.nofam + 1.8)); if (upK <= 0) return;
    const leaveK = smooth(S(t, a.still + .3, a.still + 2.4)), x = lerp(KIT.youX, SHOP.youX, leaveK), walking = leaveK > 0 && leaveK < 1;
    const look = .1 + .55 * smooth(S(t, a.billions - .2, a.billions + .8)) * (1 - smooth(S(t, a.use - .6, a.use + .2))) + .2 * smooth(S(t, a.use, a.use + .5)) * (1 - smooth(S(t, a.refuse, a.refuse + .5)));
    const up = smooth(S(t, a.use - .25, a.use + .45)), down = smooth(S(t, a.refuse - .2, a.refuse + .5)), vote = bump(t, a.ballot - .55, 1.1);
    const br = .03 * Math.sin(t * 1.6);
    let armR = lerpArm(lerpArm(lerpArm([.2 + br, .1], [1.05, .62], smooth(S(t, a.use - .7, a.use - .25))), [1.25, 2.55], up), [1.3, 1.45], down);
    armR = lerpArm(armR, [.2 + br, .1], smooth(S(t, a.refuse + .5, a.refuse + 1.0)));
    if (vote > 0) armR = lerpArm(armR, [1.55, 1.55], vote);
    const atShop = smooth(S(t, a.still + 2.2, a.still + 3)), lookShop = .35 + .3 * smooth(S(t, a.how - .3, a.how + .6)), turnC = smooth(S(t, a.c10 + .2, a.c10 + 1.4));
    const shopLit = shopLight(t, a), rim = mixHex(mixHex(PAL.coat, PAL.gold0, .5), PAL.cool0, .6 * shopLit * atShop);
    let hs;
    if (walking) hs = F.you(ctx, x, F9, KIT.youH, { dir: 1, walk: (x - KIT.youX) / KIT.youH * 5.2, light: 1, rim, look: .15 });
    else if (leaveK >= 1) hs = F.you(ctx, x, F9, KIT.youH, { dir: 1, light: 1, rim, look: lerp(lerp(.15, lookShop, atShop), .2, turnC), armR: [.15 + br, .1], armL: [-.12 - br, -.05] });
    else hs = F.you(ctx, x, F9, KIT.youH * upK, { dir: 1, light: 1, look, armR, rim, lean: .03 * vote });
    PH.held = up > .35 && down < .55 && leaveK <= 0;
    if (PH.held) B.phone(ctx, t, hs.R[0] + 4, hs.R[1] - 18, 26, { lit: smooth(S(t, a.use + .05, a.use + .4)), rot: -.15 });
    else if (down >= .55 && leaveK < .5) { ctx.fillStyle = PAL.cInk0; ctx.fillRect(2306, ty - 17, 48, 7); }
  });
}

// ================================================================================================================ 9.05 the shop + 10.01 the candle
function shopAndCandle(ctx, c, t, a) {
  const shU = S(t, a.still + .1, a.still + 1.3), lit = shopLight(t, a);
  const upG = EO(S(t, a.still + .7, a.still + 1.6)) * (1 - smooth(S(t, a.c10 + .9, a.c10 + 2.3)));
  const frameV = smooth(S(t, a.c10 + 1.8, a.c10 + 3.2));
  // the lit glass (light on the paper) with its gadgets
  onSheet(ctx, c, () => {
    if (lit > 0) { B.pool(ctx, SHOP.x + SHOP.w / 2, SHOP.y + SHOP.h + 40, 700 * lit, .7 * lit, PAL.cool1); B.gadgets(ctx, t, SHOP.x, SHOP.y, SHOP.w, SHOP.h, { lit, glit: smooth(S(t, a.shiny - .3, a.shiny + .5)) * (1 - smooth(S(t, a.how + .5, a.bigger))), up: upG }); }
    // the pencilled arrows beside the question card: up on "bigger", down on "smaller"
    const ax = SHOP.card[0] + 210, ay = SHOP.card[1] + 110;
    const u1 = EO(S(t, a.bigger - .05, a.bigger + .45)), u2 = EO(S(t, a.smaller - .05, a.smaller + .45));
    if (u1 > 0) { ink(ctx, [[ax, ay - 10], [ax + 2, ay - 120]], u1, { w: 6, col: PAL.ink0, glow: false, head: false }); if (u1 > .9) ink(ctx, [[ax - 22, ay - 92], [ax + 2, ay - 122], [ax + 26, ay - 92]], S(u1, .9, 1) * 10, { w: 6, col: PAL.ink0, glow: false, head: false }); }
    if (u2 > 0) { ink(ctx, [[ax + 60, ay - 120], [ax + 62, ay - 10]], u2, { w: 6, col: PAL.ink0, glow: false, head: false }); if (u2 > .9) ink(ctx, [[ax + 38, ay - 38], [ax + 62, ay - 8], [ax + 86, ay - 38]], S(u2, .9, 1) * 10, { w: 6, col: PAL.ink0, glow: false, head: false }); }
  });
  // the frame and the awning (cut paper, drawn; taken back when the shop goes dark)
  lifted(ctx, c, .3, () => {
    const u = EO(shU); if (u <= 0 || frameV >= 1) return;
    const { x, y, w, h } = SHOP;
    strokeSpan(ctx, [[x, y + h], [x, y], [x + w, y], [x + w, y + h]], u, frameV, 18, PAL.cut0);
    strokeSpan(ctx, [[x - 40, y - 46], [x + w + 40, y - 46]], EO(S(shU, .25, 1)), frameV, 40, PAL.cut1);
    strokeSpan(ctx, [[x - 40, y + h + 14], [x + w + 40, y + h + 14]], EO(S(shU, .1, 1)), frameV, 14, PAL.cut1);
  }, { shadow: .6 });
  candleOnly(ctx, c, t, a);
  // the question card drops in on its pin on the glass: BIGGER OR SMALLER?, then (lit by the candle) A TEST
  lifted(ctx, c, .35, () => {
    const dr = S(t, a.bigger - .45, a.bigger + .55); if (dr <= 0) return;
    F.qcard(ctx, t, SHOP.card[0], SHOP.card[1], 300, { lines: ['BIGGER OR', 'SMALLER?'], u: S(t, a.bigger - .1, a.bigger + .6), drop: dr, dropH: 420, answer: 'A test', au: S(t, a.test - .05, a.test + .75) });
  });
}
// the candle 115 and the calendar slip: the candle is struck as the shop window goes dark (the light passes to the flame)
function candleOnly(ctx, c, t, a) {
  const lit = S(t, a.c10 - .4, a.c10 + .6), bright = .5 * smooth(S(t, a.test - .4, a.test + .4)) * (1 - .4 * smooth(S(t, a.y73, a.y73 + 2))) + .9 * smooth(S(t, a.bday - .3, a.bday + .8)) + .6 * smooth(S(t, a.happy, a.es));
  onSheet(ctx, c, () => { if (lit > 0) B.pool(ctx, CAND.x, CAND.y - 260, 900 * EO(lit) * (1 + .3 * bright), .9, B.WARM); });
  lifted(ctx, c, .4, () => {
    F.slip(ctx, t, SLIPB.x, SLIPB.y, SLIPB.w, { day: 'FRI', num: '13', mon: 'NOV 2026' });
    B.candle(ctx, t, CAND.x, CAND.y, CAND.h, { lit: t < a.c10 - .4 ? 0 : (t < a.c10 - .1 ? (Math.sin(t * 50) > 0 ? .3 : 0) : lit), bright });
  });
}

// ================================================================================================================ c10 · the 1973 card → buttons → gauge → tutor | form
function c10Things(ctx, c, t, a, QW) {
  // the card drops in on its pin, the quote writes itself word by word with the voice
  const drop = S(t, a.y73 - .5, a.single + .2);
  const words = QW.map(([s, e]) => ['', S(t, s - .04, e + .02)]);
  const g1 = smooth(S(t, a.hold - .1, a.hold + 1.2)), gA = smooth(S(t, a.app - .5, a.app + .4)), gB = smooth(S(t, a.law - .25, a.law + .7));
  // card → gauge: shrink, go vellum, move over the phone, then over the § page
  const gx = lerp(lerp(CARD73.x, GA.x, gA), GB.x, gB), gy = lerp(CARD73.y, GA.y, gA), gw = lerp(CARD73.w, GA.w, gA);
  // the phone and the page with § lie on the sheet (already there; the gauge is held over them)
  onSheet(ctx, c, () => {
    B.phone(ctx, t, PHONE[0], PHONE[1], 78, { lit: .9 });
    const [px, py] = PARA; ctx.fillStyle = PAL.card; ctx.fillRect(px - 80, py - 105, 160, 210); ctx.fillStyle = PAL.cardShade; ctx.fillRect(px - 80, py + 100, 160, 7);
    label(ctx, '§', px, py + 5, 96, 1, { serif: true, align: 'center', col: PAL.cInk0 });
    ctx.fillStyle = rgba(PAL.cInk1, .5); for (let i = 0; i < 3; i++) ctx.fillRect(px - 56, py + 34 + i * 18, 112 - (i === 2) * 50, 5);
    // your own line (10.04): drawn in gold ink by your hand, right of the screen; it has a small bend of its own
    const yu = S(t, a.yours - .1, a.yours + 1.4);
    if (yu > 0) ink(ctx, YOURLINE, yu, { w: 7, head: yu < 1 });
    // tutor | form (10.06)
    const tk = S(t, a.tutor - .4, a.tutor + .6);
    if (tk > 0) {
      B.tutor(ctx, t, TUT.x, TUT.y, TUT.h * EO(tk), { okPts: OK_PTS, u: S(t, a.kid - .2, a.passes - .1), ok: S(t, a.passes - .05, a.passes + .6) });
      const fk = EO(S(t, a.tutor + .2, a.tutor + 1.0));
      if (fk > 0) { ctx.save(); ctx.translate(FORM.x + FORM.w / 2, FORM.y + FORM.w * 1.3); ctx.scale(1, fk); ctx.translate(-FORM.x - FORM.w / 2, -FORM.y - FORM.w * 1.3); B.form(ctx, t, FORM.x, FORM.y, FORM.w, { u: S(t, a.system - .1, a.quietly + .9), no: S(t, a.fails - .05, a.fails + .6) }); ctx.restore(); }
      // the ✓ runs on: its last stroke carries on as gold ink across the sheet into the light line (→ c11)
      const ru = S(t, a.fails + .55, a.c11 + 1.4);
      const rf = 1 - smooth(S(t, a.c11 + 1.5, a.c11 + 3.2));
      if (ru > 0 && rf > 0) { ctx.save(); ctx.globalAlpha *= rf; ink(ctx, RUNON, sineIO(ru), { w: 9, head: ru < 1 }); ctx.restore(); }
    }
  });
  // the screen of buttons (10.04): the gold ring lifts off CHOICES, flies left, lands as one button; the screen opens round it
  const fl = S(t, a.screen - .45, a.buttons - .05);
  const scrK = S(t, a.buttons - .15, a.buttons + .55);
  lifted(ctx, c, .3, () => {
    if (scrK > 0 && t < a.checkpoint) {   // off the page before the pull-back in 11.06 (off-frame at that moment)
      const bx = SCR.x + SCR.w / 6 * 2.5, by = SCR.y + SCR.h / 4 * 1.5;
      ctx.save(); ctx.beginPath(); ctx.arc(bx, by, lerp(20, 520, smooth(scrK)), 0, 6.29); ctx.clip();
      const hov = smooth(S(t, a.buttons + .6, a.buttons + 1.2)) * (1 - smooth(S(t, a.yours - .5, a.yours)));
      B.buttons(ctx, t, SCR.x, SCR.y, SCR.w, SCR.h, { u: S(t, a.buttons + .05, a.options2 + .2), lit: .5 + .5 * smooth(scrK), hover: [3, 2], hoverA: hov });
      ctx.restore();
    }
  });
  lifted(ctx, c, .5, () => {
    if (drop <= 0 || t > a.c11 + 6) return;
    const st = {
      words, att: S(t, a.choicesE + .2, a.choicesE + 1.0), under: S(t, a.lastword - .1, a.lastword + .6),
      opt: S(t, a.notopt - .25, a.notopt + .4), optX: S(t, a.optE - .1, a.optE + .45), cho: S(t, a.Choices - .05, a.Choices + .75) * (1 - smooth(S(t, a.screen - .45, a.screen - .1))),
      vellum: g1, a: 1,
    };
    // the card swings as it is carried (follow-through)
    st.swing = .03 * Math.sin((t - a.app) * 3) * bump(t, a.app - .5, 1.6) + .03 * Math.sin((t - a.law) * 3) * bump(t, a.law - .25, 1.6);
    const dy = (1 - sineIO(drop)) * 560;   // rises in through the bottom edge of the frame (no pop)
    B.bigCard(ctx, t, gx, gy + dy, gw, st);
    // the gauge on the vellum (drawn as the card turns)
    if (g1 > 0) {
      const hy = gy + gw * .04 + gw * .62 * .64, r = gw * .3;
      const v = lerp(0, .78, smooth(S(t, a.more - .2, a.own + .5))) + lerp(0, -1.3, smooth(S(t, a.fewer - .15, a.fewer + .45))) + lerp(0, .82, smooth(S(t, a.sayno - .5, a.sayno + .3)));
      B.gauge(ctx, t, gx, hy, r, { noAt: [gx + gw * .34, gy + gw * .04 + gw * .62 * .17], u: S(t, a.hold + .3, a.hold + 1.6), lab: S(t, a.hold + 1.0, a.hold + 2.0), v, no: S(t, a.sayno - .05, a.sayno + .35), noU: S(t, a.including - .2, a.including + .5) });
    }
    // the gold ring lifts off CHOICES and flies to the screen
    if (fl > 0 && fl < 1 && st._choices) {
      const [lx, ly] = st._choices, sx = gx + lx, sy = gy + ly, ex = SCR.x + SCR.w / 6 * 2.5, ey = SCR.y + SCR.h / 4 * 1.5, e = sineIO(fl);
      const x = lerp(sx, ex, e), y = lerp(sy, ey, e) - 260 * Math.sin(Math.PI * e), rr = lerp(70, 26, e);
      ctx.strokeStyle = mixHex(PAL.gold2, PAL.cool1, e); ctx.lineWidth = lerp(5, 7, e); ctx.beginPath(); ctx.ellipse(x, y, rr, rr * lerp(.8, 1, e), 0, 0, 6.29); ctx.stroke();
      E.halo(ctx, x, y, rr * 2.2, .4, mixHex(B.WARM, PAL.cool1, e), PAL.gold0);
    }
  });
  // your hand (yellow sleeve) at the screen: hovers over the buttons, then turns away and draws your own line
  lifted(ctx, c, .7, () => {
    const hk = S(t, a.buttons - .3, a.buttons + 1.2); if (hk <= 0 || t > a.hold + 1.5) return;
    const away = smooth(S(t, a.hold - .2, a.hold + 1.2));
    const yu = S(t, a.yours - .1, a.yours + 1.4), pen = yu > 0 ? partial(YOURLINE, yu) : null, ph = pen ? pen[pen.length - 1] : null;
    const hover = [SCR.x + SCR.w / 6 * 3.5 + 18 * Math.sin(t * 1.1), SCR.y + SCR.h / 4 * 2.5 + 30 + 10 * Math.sin(t * 1.7)];
    const toPen = smooth(S(t, a.yours - .6, a.yours));
    let tx = lerp(hover[0], YOURLINE[0][0], toPen), ty = lerp(hover[1], YOURLINE[0][1], toPen);
    if (ph) { tx = ph[0]; ty = ph[1]; }
    const enter = 700 * (1 - sineIO(hk)); ty += enter + 1100 * away;   // the whole hand slides up into frame from below, and leaves the same way
    const rootX = tx + lerp(150, 90, toPen), rootY = ty + 300, R = B.reachTo(rootX, rootY, tx, ty);
    B.handUp(ctx, rootX, rootY, R.len, R.ang, { sleeve: PAL.coat, grip: .3 + toPen * .6, lit: PAL.cool1 });
  });
}
const YOURLINE = [[2760, 1905], [2850, 1890], [2930, 1872], [2990, 1846], [3022, 1800], [3036, 1735]];
const RUNON = [[3010, 1850], [3110, 1720], [3185, 1560], [3195, 1350], [3120, 1150], [2950, 990], [2720, 870], [2472, 790]];

// ================================================================================================================ c11
function c11Flat(ctx, t, a) {
  // the tall height scale beside the light line: drawn up, then greyed out (it is not the measure)
  const su = S(t, a.c11 - .1, a.smart + .3), grey = smooth(S(t, a.smart + .3, a.smart + 1.3)), gone = 0;
  if (su > 0 && gone < 1) {
    const x = 2235, y0 = 960, y1 = 110, yy = lerp(y0, y1, EO(su)), col = mixHex(PAL.cool1, PAL.ink2, grey), al = (1 - .55 * grey) * (1 - gone);
    ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, yy); ctx.stroke();
    for (let y = y0 - 100; y > yy; y -= 100) { ctx.lineWidth = (y % 500 === 460 % 500) ? 4 : 2.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + ((Math.round((y0 - y) / 100) % 5) ? 26 : 50), y); ctx.stroke(); }
    ctx.restore();
    label(ctx, 'HOW SMART', x - 6, y1 - 34, 44, S(t, a.smart - .1, a.smart + .6) * (1 - gone), { col, a: al });
    if (grey > 0) { const w = F.measure('HOW SMART', 44) * 1.12; F.strike(ctx, x - 6, y1 - 48, w, S(t, a.smart + .6, a.smart + 1.3)); }
  }
  // 11.02 the bracket of your lifetime under the axis, from your birth dot to NOW
  const bk = S(t, a.lifetime - .1, a.lifetime + .8);
  if (bk > 0) {
    const x0 = yearX(1980), x1 = yearX(2026), y = CH.y0 + 86;
    ctx.fillStyle = PAL.coat; ctx.beginPath(); ctx.arc(x0, CH.y0, 9 * EO(S(bk, 0, .3)), 0, 6.29); ctx.fill();
    ink(ctx, [[x0, y - 18], [x0, y], [lerp(x0, x1, .5), y], [lerp(x0, x1, .5), y + 10], [lerp(x0, x1, .5), y], [x1, y], [x1, y - 18]], EO(bk), { w: 3.5, col: PAL.ink0, glow: false, head: false });
    label(ctx, 'YOUR LIFETIME', lerp(x0, x1, .5), y + 52, 30, S(bk, .4, 1), { align: 'center', col: PAL.ink0 });
  }
  // 11.04 the fan: the light line opens into many fine lines of light
  const fu = S(t, a.everyone - .1, a.everyone + 1.5);
  if (fu > 0) FAN.forEach((f, i) => lightLine(ctx, f.pts, clamp(fu * 1.3 - Math.abs(f.d) * .45), { w: 3.2, a: .85, spill: 0 }));
  // 11.05 ∞ and ≈ 8.3 BILLION beside the slip; the dots under it (shimmer on "Still choosing")
  const iu = S(t, a.infinity - .1, a.infinity + .9);
  if (iu > 0) F.infinity(ctx, INF.x, INF.y, 72, iu);
  const bu = S(t, a.eight2 - .1, a.eight2 + .7);
  if (bu > 0) {
    { const w1 = F.measure('8.3 BILLION', 62, true), w0 = F.measure('≈ ', 56); label(ctx, '≈', BIL.x - (w0 + w1) / 2, BIL.y - 4, 56, bu, { col: PAL.ink0, weight: 500, spacing: 0 }); label(ctx, '8.3 BILLION', BIL.x - (w0 + w1) / 2 + w0, BIL.y, 62, S(bu, .1, 1), { serif: true, col: PAL.ink0 }); }
    B.lights(ctx, t, DOTS11, S(t, a.eight2 + .2, a.eight2 + 1.4), 4.2, { tw: .2 + .45 * smooth(S(t, a.stillC - .2, a.stillC + .6)) * (1 - .3 * smooth(S(t, a.ending, a.ending + 2))) });
  }
  // 11.06 a pencil checkpoint at 2026 on both lines (a small gate across each line + a flag)
  const ck = (x, y, ang, u) => { if (u <= 0) return; const nx = -Math.sin(ang), ny = Math.cos(ang); ink(ctx, [[x - nx * 34, y - ny * 34], [x + nx * 34, y + ny * 34]], EO(u), { w: 5, col: PAL.ink0, glow: false, head: false }); const fx = x - nx * 34, fy = y - ny * 34, fk = EO(S(u, .4, 1)); if (fk > 0) { ctx.fillStyle = PAL.ink0; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + 30 * fk, fy + 9); ctx.lineTo(fx, fy + 18); ctx.closePath(); ctx.fill(); } };
  const [gx, gy] = onReal(2025.6), gAng = Math.atan2(onReal(2026)[1] - onReal(2024)[1], onReal(2026)[0] - onReal(2024)[0]);
  ck(gx, gy, gAng, S(t, a.checkpoint - .1, a.checkpoint + .6));
  const [lx, ly, lAng] = along(aiPts, AIL, .5); ck(lx, ly, lAng, S(t, a.both - .05, a.both + .65));
}
function c11Things(ctx, c, t, a) {
  // 11.01 human hands: small people stand up on the axis and throw reins up to the light line; the reins pull taut (the line is held)
  // 11.04 for everyone: more people take the fine lines of the fan
  onSheet(ctx, c, () => {
    const holder = (x, h, dir, tx, ty, kUp, kThrow, kTaut, i) => {
      const up = EO(kUp); if (up <= 0) return;
      const hh = h * up, side = 1, R = armTo(x, CH.y0, hh, dir, side, tx, ty), arm = lerpArm([.2, .1], R, smooth(kThrow));
      const sx = x + dir * side * .098 * hh, sy = CH.y0 - .74 * hh, L1 = .17 * hh, L2 = .155 * hh;
      const hx = sx + dir * (Math.sin(arm[0]) * L1 + Math.sin(arm[1]) * L2), hy = sy + Math.cos(arm[0]) * L1 + Math.cos(arm[1]) * L2;
      if (kThrow > 0) {
        const u = EO(kThrow), ex = lerp(hx, tx, u), ey = lerp(hy, ty, u), sag = (1 - smooth(kTaut)) * 70 * u + 6;
        ctx.save(); ctx.strokeStyle = rgba(PAL.ink0, .82); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hx, hy);
        ctx.quadraticCurveTo((hx + ex) / 2, (hy + ey) / 2 + sag, ex, ey); ctx.stroke();
        if (u > .98) { ctx.fillStyle = PAL.ink0; ctx.beginPath(); ctx.arc(tx, ty, 5, 0, 6.29); ctx.fill(); }
        ctx.restore();
      }
      const lean = -.05 * smooth(kTaut) * dir + .008 * Math.sin(t * 1.1 + i * 1.7);
      F.other(ctx, x, CH.y0, hh, { dir, light: -dir, look: .55 * smooth(kThrow), lean, armR: arm, rim: PAL.cool1 });
    };
    HAND_F.forEach((f, i) => {
      const [tx, ty] = along(aiPts, AIL, f), x = 2400 + i * 58, o = i * .11;
      holder(x, 112 + (i % 3) * 6, -1, tx, ty, S(t, a.hands - .7 + o, a.hands + .1 + o), S(t, a.hands - .2 + o, a.hands + .55 + o), S(t, a.hands + .5 + o, a.hands + 1.2 + o), i);
    });
    const fh = (i) => a.everyone + .2 + i * .14;
    FANP.forEach((p, i) => holder(p.x, 108 + (i % 2) * 8, p.dir, p.tx, p.ty, S(t, fh(i) - .5, fh(i) + .2), S(t, fh(i) - .1, fh(i) + .6), S(t, fh(i) + .5, fh(i) + 1.2), i + 9));
  });
  // 11.02/11.03 you at the knee; the answer cards land; you write on one
  onSheet(ctx, c, () => {
    const write = smooth(S(t, a.answer - .3, a.answer + .5)) * (1 - smooth(S(t, a.second, a.second + 1)));
    const look = lerp(.55, .25, smooth(S(t, a.nextbend, a.see + .4)));
    const yo = { look: lerp(look, .05, write), lean: .32 * write, rim: mixHex(PAL.coat, PAL.gold0, .5) }; if (write > 0) yo.armR = lerpArm([.12, .08], [.75 + .05 * Math.sin(t * 7), .35], write);
    youAtKnee(ctx, t, yo);
    CARDS.forEach((cd, i) => B.scribbleCard(ctx, t, cd[0], cd[1], cd[2], { land: S(t, a.one - .2 + i * .32, a.one + .9 + i * .32), fill: i === 0 ? S(t, a.answer, a.answer + 2.2) : S(t, a.answer - 1.2 + i * .25, a.answer + 1.2 + i * .3), seed: 11 + i, drop: 380 }));
    // 11.04 THE GOOD TAKEOFF, printed small in the sheet's corner
    label(ctx, 'THE GOOD TAKEOFF', 2640, 1088, 46, S(t, a.subscribe - .1, a.subscribe + .7), { serif: true, col: PAL.ink0, spacing: .06 });
  });
  // CURVE AHEAD beside the light line
  lifted(ctx, c, .4, () => B.roadSign(ctx, t, 2290, 960, 130, { u: S(t, a.see - .35, a.see + .5), lab: S(t, a.see + .1, a.see + .8) }), { shadow: .7 });
  // 11.07 the silhouette (the birthday man, 6.02): stands up beside the candle, small, at the sheet's edge
  lifted(ctx, c, .4, () => {
    const up = EO(S(t, a.happy - .3, a.happy + 1.1)); if (up <= 0) return;
    F.other(ctx, HEINZ.x, HEINZ.y, HEINZ.h * up, { dir: -1, light: -1, look: .2, long: true, rim: PAL.gold1, pal: { base: mixHex(PAL.cut2, PAL.ink2, .3), lit: PAL.ink1, shade: PAL.cut1, deep: PAL.cut0 } });
  });
}
const CARDS = [[1575, 700, 96], [1745, 1092, 100], [1855, 1092, 100], [1965, 1092, 100], [2075, 1092, 100], [2185, 1092, 100]];
