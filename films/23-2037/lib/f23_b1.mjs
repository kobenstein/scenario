// Film 23 · B1 · c03–c05 (07:30 the tutor · 09:00 the night shift · 12:00 the agent) as ONE plan sequence (80.72 – 239.02 s).
// The three scene files return this one draw function, so the chunk seams c03→c04 and c04→c05 are identical frames by construction.
//   c03  plateGenius → pull back: the voice-light over the kitchen table, the kid in pajamas · the private ring + three beads · the two
//        columns · ★ the black hole, the sealed cube, the ladder of '?' · the blueprint · she stomps off · the camera rises to the skyline
//   c04  settles into the hallway: you at the tall window with the tablet · the headlines (germ + capsule, globe + few points, moon) ·
//        the drizzle of breakthroughs · the flight out of the window up to the tower · ★ the night shift (the tower opens, the lines
//        stream in) · the hunch and its fan of rays · the road to the testers' house · the wait · the road back to your table
//   c05  noon: the agent rises to your shoulder (gold thread to your wrist) · the day row · the forms caught · the coin at the gate ·
//        the plan bars on the light wall · ★ the makers' cool thread slides off · the agent in your pocket · the walk → Dad's window
// Group seams: plateGenius at 'Seven-thirty' (in), plateWindow at "Four o'clock" (out; Dad's facade is patched to the plate's look).
import * as E from './f10_editorial.mjs';
import * as K from './f23_kit.mjs';
import { plateGenius, plateWindow, plateWindowContent, WINDOW_GLASS, WINDOW_PLATE, SEAM_HALF, GENIUS_WALL } from './f23_seams.mjs';
import * as S from './f23_street.mjs';
const { W, H, P, F0, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, quartIO, trapIO, rgba, mixHex, lin, rad, halo, cam3, prng, drift } = E;
const { ZS, ZB, KITCHEN, LIGHTWALL, look, wp, atZ, COOL, WARM } = K;
const KY = KITCHEN.floor, TT = KITCHEN.table.top, SEAT = KITCHEN.seatY;
const bump = (t, a, d) => Math.sin(Math.PI * span(t, a, a + d));
const EASE = { s: sineIO, l: trapIO, q: quartIO, o: expoOut, i: expoIn };

// ================================================================================================ camera helpers
// Catmull-Rom through cameras (x, y, log distance to ref), u 0..1 over all of them
function crCam(cams, u, ref) {
  const n = cams.length - 1, x = clamp(u) * n, i = Math.min(n - 1, Math.floor(x)), f = x - i;
  const P_ = (k) => cams[Math.max(0, Math.min(n, k))], v = (c) => [c.x, c.y, Math.log(Math.max(1, ref - c.z))];
  const a = v(P_(i - 1)), b = v(P_(i)), c = v(P_(i + 1)), d = v(P_(i + 2));
  const cr = (j) => .5 * (2 * b[j] + (-a[j] + c[j]) * f + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * f * f + (-a[j] + 3 * b[j] - 3 * c[j] + d[j]) * f * f * f);
  return cam3({ x: cr(0), y: cr(1), z: ref - Math.exp(cr(2)), f: F0 });
}
// segments: [t0, t1, [cams], ease, ref]; holds the last camera between segments
function camPath(t, SEG) {
  let last = SEG[0][2][0];
  for (const [t0, t1, cams, ez, ref] of SEG) {
    if (t < t0) return { ...last };
    if (t <= t1) return crCam(cams, EASE[ez || 's']((t - t0) / (t1 - t0)), ref);
    last = cams[cams.length - 1];
  }
  return { ...last };
}

// ================================================================================================ Dad's facade = the seam plate (B1 → B2)
// The plate (screen space) mapped onto Dad's facade through the final camera, so the push lands on it exactly. Exported for B2's pull back.
export const DAD_WIN = [5116, -1800];                                    // Dad's window (level 3, flat a), world X, Y on ZS
export const CAM_DAD = look(DAD_WIN[0], DAD_WIN[1], ZS, WINDOW_PLATE.h / 230, WINDOW_PLATE.x, WINDOW_PLATE.y);
const plateContent = (ctx, t) => plateWindowContent(ctx, t);   // = plateWindow without its setTransform (11-09: daylight, in f23_seams)
// call inside the ZS plane (world units), e.g. from world o.over(ctx, s)
export function dadFacade(ctx, t, L) {
  const D = K.STREET.dad, C = CAM_DAD, s = C.f / (ZS - C.z), top = K.floorY(D.floors);
  const vx0 = C.x - (W / 2) / s, vx1 = C.x + (W / 2) / s, vy0 = C.y - (H / 2) / s, vy1 = C.y + (H / 2) / s;   // the plate's viewport in world
  ctx.save(); ctx.beginPath(); ctx.rect(D.x0 - 44, top + 3, D.x1 - D.x0 + 88, -top - 3); ctx.clip();
  ctx.save(); ctx.transform(1 / s, 0, 0, 1 / s, C.x - (W / 2) / s, C.y - (H / 2) / s); plateContent(ctx, t); ctx.restore();
  // the rest of the facade's windows (outside the plate's viewport, so the plate frame stays exact)
  ctx.beginPath(); ctx.rect(D.x0 - 44, top, D.x1 - D.x0 + 88, -top); ctx.rect(vx1, vy0, vx0 - vx1, vy1 - vy0); ctx.clip('evenodd');
  for (let l = 0; l < D.floors; l++) for (let i = 0; i < 6; i++) {
    const X = D.x0 + 180 + i * 368, Y = K.floorY(l) - 260, lit = ((l * 7 + i * 3) % 10) < 2 + (L ? L.win * 6 : 1);
    ctx.fillStyle = WINDOW_GLASS; ctx.fillRect(X - 85, Y - 115, 170, 230);
    if (lit && !(l === D.level)) { ctx.fillStyle = lin(ctx, 0, Y - 115, 0, Y + 115, [[0, rgba(P.halo1, .9)], [1, rgba(P.core1, .9)]]); ctx.fillRect(X - 85, Y - 115, 170, 230); }
  }
  ctx.restore();
}

// ================================================================================================ small drawing helpers
const ell = (ctx, x, y, rx, ry, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, Math.max(.01, rx), Math.max(.01, ry), 0, 0, 6.29); ctx.fill(); };
function strokePath(ctx, pts, w, col, a = 1) {
  if (pts.length < 2) return; ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = rgba(col, a); ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
}
function polyAt(pts, u) {   // point at share u of a polyline's length + the sub-polyline up to it
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = len[len.length - 1] * clamp(u); let i = 1; while (i < pts.length - 1 && len[i] < T) i++;
  const f = (T - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1]), p = [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)];
  return { p, sub: [...pts.slice(0, i), p] };
}
function bezPts(a, b, lift, n = 20) { const out = [], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - lift; for (let i = 0; i <= n; i++) { const v = i / n, w = 1 - v; out.push([w * w * a[0] + 2 * w * v * mx + v * v * b[0], w * w * a[1] + 2 * w * v * my + v * v * b[1]]); } return out; }
// the black hole (dark disc, thin gold accretion ring, soft lensing glow): x, y, r
function blackHole(ctx, x, y, r, t, k = 1) {
  if (r <= .3) return;
  ctx.save();
  ctx.fillStyle = rad(ctx, x, y, r * 2.6, [[0, rgba(COOL.edge, .0)], [.38, rgba(COOL.mid, .35 * k)], [.55, rgba(COOL.edge, .16 * k)], [1, rgba(COOL.deep, 0)]]); ctx.fillRect(x - r * 2.6, y - r * 2.6, r * 5.2, r * 5.2);
  ctx.strokeStyle = rgba(P.halo0, .35 * k); ctx.lineWidth = r * .16; ctx.beginPath(); ctx.ellipse(x, y, r * 1.75, r * .38, -.12, Math.PI, 0); ctx.stroke();   // the far half of the disc
  ell(ctx, x, y, r, r, P.night0);
  ctx.strokeStyle = rgba(P.core1, .95 * k); ctx.lineWidth = r * .05; ctx.beginPath(); ctx.arc(x, y, r * 1.04, 0, 6.29); ctx.stroke();   // the photon ring
  ctx.strokeStyle = rgba(P.halo0, .5 * k); ctx.lineWidth = r * .2; ctx.beginPath(); ctx.ellipse(x, y, r * 1.75, r * .38, -.12, 0, Math.PI); ctx.stroke();   // the near half
  ctx.strokeStyle = rgba(P.core1, .95 * k); ctx.lineWidth = r * .045; ctx.beginPath(); ctx.ellipse(x, y, r * 1.7, r * .34, -.12, 0, Math.PI); ctx.stroke();
  const a = t * .9; halo(ctx, x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * .34, r * .25, .55 * k * (Math.sin(a) > 0 ? 1 : .3));
  ctx.restore();
}
// a spiky germ (cool), cured 0..1 (spikes retract, it darkens)
function germ(ctx, x, y, r, t, g, cured) {
  if (g <= 0) return; const R = r * expoOut(g), sp = 1 - .8 * smooth(cured);
  ctx.save();
  ctx.fillStyle = rad(ctx, x, y, R * 2.4, [[0, rgba(COOL.mid, .3 * (1 - cured * .6))], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(x - R * 2.4, y - R * 2.4, R * 4.8, R * 4.8);
  ctx.strokeStyle = rgba(COOL.mid, .9); ctx.lineWidth = R * .09; ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 + t * .15, w = 1 + .06 * Math.sin(t * 3 + i); ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * R * .9, y + Math.sin(a) * R * .9); ctx.lineTo(x + Math.cos(a) * R * (1 + .45 * sp * w), y + Math.sin(a) * R * (1 + .45 * sp * w)); ctx.stroke(); ell(ctx, x + Math.cos(a) * R * (1 + .45 * sp * w), y + Math.sin(a) * R * (1 + .45 * sp * w), R * .07, R * .07, rgba(COOL.core, .9)); }
  ctx.fillStyle = rad(ctx, x - R * .3, y - R * .3, R, [[0, mixHex(COOL.core, P.blue1, cured * .7)], [1, mixHex(COOL.edge, P.ind1, cured * .7)]]); ctx.beginPath(); ctx.arc(x, y, R, 0, 6.29); ctx.fill();
  ctx.restore();
}
function pill(ctx, x, y, w, rot, col) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); ctx.roundRect(-w / 2, -w * .21, w, w * .42, w * .21); ctx.fillStyle = col; ctx.fill(); ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(0, -w * .21, w / 2, w * .42); ctx.restore(); }
// a small form / document card (cream sheet with lines)
function sheet(ctx, x, y, w, rot, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const h = w * 1.3;
  ctx.fillStyle = rgba(P.cream, .92 * a); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = rgba(P.blue1, .7 * a); for (let i = 0; i < 4; i++) ctx.fillRect(-w * .36, -h * .32 + i * h * .17, w * (i === 0 ? .5 : .72), Math.max(.6, w * .06));
  ctx.restore();
}
function coinFlat(ctx, x, y, r, a = 1) { ell(ctx, x, y + r * .12, r, r * .36, rgba(WARM.deep, a)); ell(ctx, x, y, r, r * .36, rgba(P.core1, a)); ell(ctx, x - r * .2, y - r * .05, r * .5, r * .16, rgba(P.core0, .8 * a)); }
function coinUp(ctx, x, y, r, cool) { ctx.fillStyle = rad(ctx, x, y, r * 2.4, [[0, rgba(cool ? COOL.mid : P.halo0, .35)], [1, rgba(cool ? COOL.edge : P.halo0, 0)]]); ctx.fillRect(x - r * 2.4, y - r * 2.4, r * 4.8, r * 4.8); ell(ctx, x, y, r, r, cool ? COOL.mid : P.core1); ell(ctx, x, y, r * .62, r * .62, cool ? COOL.core : P.core0); }
function lockGlyph(ctx, x, y, s, col, w) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(x, y - s * .25, s * .32, Math.PI, 0); ctx.lineTo(x + s * .32, y); ctx.moveTo(x - s * .32, y - s * .25); ctx.lineTo(x - s * .32, y); ctx.stroke(); ctx.strokeRect(x - s * .48, y, s * .96, s * .7); ctx.restore(); }
function dashed(ctx, a, b, u, col, w, dash) { if (u <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(lerp(a[0], b[0], u), lerp(a[1], b[1], u)); ctx.stroke(); ctx.restore(); }

// the kid sitting on the left stool, side view facing the table (her upper body is the kit's kid, her legs bent on the stool)
function kidSeated(ctx, X, t, o) {
  const h = 100, dir = 1, rise = o.rise ?? 0;   // rise 0..1: she slides off (legs straighten)
  const hip = [X + dir * 1, SEAT + rise * -7], kn = [X + dir * lerp(21, 6, rise), lerp(SEAT + 1, SEAT + 19, rise)], ft = [X + dir * lerp(24, 4, rise), KY - 2];
  const pants = P.night1, pl = mixHex(P.night1, P.blue1, .45);
  ctx.save(); ctx.lineCap = 'round';
  for (const [d, col] of [[-2, pants], [2, pl]]) {
    ctx.strokeStyle = col; ctx.lineWidth = 7.2; ctx.beginPath(); ctx.moveTo(hip[0] + d, hip[1]); ctx.lineTo(kn[0] + d, kn[1]); ctx.lineTo(ft[0] + d, ft[1]); ctx.stroke();
    ell(ctx, ft[0] + d + 3, ft[1], 5.6, 2.4, P.night0);
  }
  ctx.beginPath(); ctx.rect(X - 200, SEAT - 400, 400, 404 + rise * -7); ctx.clip();
  const hands = K.kid(ctx, X, SEAT + .47 * h + rise * -7, h, t, { view: 'side', dir, eyes: o.eyes, lean: o.lean ?? .3, look: o.look ?? .2, armR: o.armR, armL: o.armL, seed: 2 });
  ctx.restore();
  return hands;
}

// ================================================================================================ B1
let MEMO = null;
export function b1(T) {
  if (MEMO && MEMO.T === T) return MEMO;
  const G = (p, after = -1) => T.G(p, 0, after), GE = (p, after = -1) => T.GE(p, 0, after);
  // ---- anchors (phrases only; fenced by the chunk's first phrase)
  const t03 = G('Seven-thirty'), t04 = G("Nine o'clock", t03), t05 = G('Noon', t04), t06 = G("Four o'clock", t05);
  const tPaj = G('pajamas', t03), tAlone = G('belongs to her', t03), tBored = G('bored', t03), tBluff = G('bluffing', t03), tLaugh = G('laugh', t03);
  const tPhys = G('more physics', t03), tProf = G('professor', t03), tBH = G('black holes', t03), tWants = G('wants the answer', t03), tWont = G("won't give it", t03);
  const tQ = G('question instead', t03), tAnother = G('Then another', t03), tGroan = G('groans', t03), tWaits = G('waits', t03), tBuilt = G('built this way', t03);
  const tNever = G('never once', t03), tWhy = G('Why would anyone', t03), tStomp = G('stomps off', t03), tKept = G('only one kept', t03);
  const tNews = G('morning news', t04), tAnti = G('antibiotic', t04), tShrug = G('shrugged off', t04), tRare = G('disease so rare', t04), tFew = G('few hundred', t04);
  const tOvernight = G('designed overnight', t04), tBarely = G('barely look up', t04), tWeather = G('like weather', t04), tNight = G('Every night', t04);
  const tWritten = G('everything ever written', t04), tHunch = G('hunch', t04), tThousand = G('thousand different', t04), tSunrise = G('before sunrise', t04);
  const tShift = G('night shift now', t04), tYet = G('And yet', t04), tPatient = G('single patient', t04), tTesters = G('outside testers', t04);
  const tMakers = G("don't work for the makers", t04), tOpen = G('In the open', t04), tMonths = G('for months', t04), tHate = G('hate the wait', t04);
  const tLives = G('costs lives', t04), tWrong = G('not wrong', t04), tThisPat = G('this patient', t04), tMean = G('Meanwhile', t04), tMorning = G('whole morning', t04), tMoney = G('your money', tMean);
  const tChecks = G('checks in', t05), tThu = G('booked for Thursday', t05), tNeeds = G('everything it needs', t05), tForm = G('single form', t05);
  const tDep = G('deposit', t05), tAsks = G('it asks', tDep), tSpends = G('spends your money', t05), tIns = G('health insurance', t05), tLunch = G('making lunch', t05);
  const tPlans = G('every plan', t05), tMarket = G('market', tPlans), tCheap = G('cheaper one', t05), tMuch = G('just as much', t05), tEarn = G('would earn more', t05);
  const tStayed = G('stayed where', t05), tAnyway = G('tells you anyway', t05), tLawyer = G('sharpest lawyer', t05), tPocket = G('pocket', t05), tBuy = G('nobody can buy', t05);
  const tAllowed = G("isn't allowed", t05), tAhead = G('ahead of you', t05), tAnswer = G('answer to you', t05), tJob = G('one job', t05), tDad = G('Telling your dad', t05);
  const tGenEnd = t03 + SEAM_HALF, tWinStart = t06 - SEAM_HALF;

  // ---- places
  const LZ = 3428;                                   // the kid / voice-light plane (over the table)
  const VL = [-1300, TT - 72, LZ], VLR = 15;         // the voice-light (world), radius
  const KID_X = -1500;                               // the left stool
  const YOU3 = [-1720, 3480];                        // you at the counter (07:30, 12:00)
  const YOU5 = [1900, 2900];                          // you at noon: on the market street (pavement, in front of the shops) [X, Z]
  const HB = [-1330, -1250], CUBE = [-1330, -1405], S1 = [-1468, -1232], S2 = [-1424, -1312];   // black hole, cube, the two steps (wall ZB)
  const HALLWIN = { x: -2490, y: K.KITCHEN.ceil + 70, w: 190, h: 360 };   // the hallway's tall window (back wall)
  const ZH = 3545;                                   // the headline objects' plane (just inside the window)
  const ZT = 15900;                                  // the night-shift explainer plane (in front of the tower)
  const AG_TABLE = [-1290, TT - 16, LZ];             // the agent on the table (4.08)

  // ---- cameras
  const CLOSE = look(VL[0], VL[1], VL[2], GENIUS_R() / VLR, 960, 500);
  function GENIUS_R() { return 150; }
  const TABLE = look(-1330, -1215, ZB, 1.75, 960, 520), TABLE_IN = look(-1342, -1222, ZB, 1.85, 960, 520);
  const TABLE_EX = look(-1360, -1280, ZB, 1.95, 960, 500), TABLE_EX2 = look(-1365, -1284, ZB, 2.04, 960, 500);
  const SKY3 = cam3({ x: -1000, y: -2900, z: 0 });   // (unused since the 11-09 rework: c03 now pulls back out to the street)
  // 2026-11-09 rework (daylight + street life): c03 ends on the street (the kid takes the school shuttle), c04 opens wide on the living
  // street with the quiet flat above it, c05 plays out on the market street in front of the shops.
  const STREET9 = look(-1950, -640, ZS, .56, 960, 540), STREET9B = look(-2000, -660, ZS, .6, 960, 540);
  const OUT3 = look(-1500, -1000, ZS, 1.0, 960, 520);
  const HALL = look(-2330, -1205, ZB, 1.95, 960, 540), HALL_IN = look(-2345, -1212, ZB, 2.06, 960, 540);
  const PANE = cam3({ x: -2348, y: -1385, z: 3440 }), BEHIND = cam3({ x: -2330, y: -1470, z: 3900 }), UP = cam3({ x: -2150, y: -3000, z: 4300 }), RISE = cam3({ x: -1300, y: -3350, z: 5700 });
  const TOWER_C = look(4000, -5100, 16000, .2, 1250, 540), TOWER_C2 = look(4000, -5100, 16000, .212, 1250, 540);
  const SKYX = look(4000, -7200, 16000, .1, 1480, 140), SKYX_IN = look(3100, -4300, ZT, .107, 1180, 420);
  const KT2 = look(-1480, -1215, ZB, 1.75, 960, 520), KT2_IN = look(-1475, -1220, ZB, 1.84, 960, 520);
  const TK = look(-1450, -1700, ZS, .62, 900, 540), YOU_M = look(-1640, -1108, 3470, 3.3, 780, 590), YOU_M2 = look(-1636, -1108, 3470, 3.5, 780, 590);
  const TABLE_H = look(-1335, -1220, ZB, 1.82, 960, 520);
  const WIDE = look(1900, -1450, ZS, .22, 960, 540);
  const BACK5 = look(-1350, -1350, ZS, .95, 760, 560);   // (unused since the 11-09 rework)
  // c05 on the market street: you at the fruit stall, the shop window (a light window: the plan bars) right of you, the clinic off left
  // the market square (X ≈ 900–3400, no kerb trees/lamps: FRONT_GAP) in front of the low building (X 1600–2600, 1100 high): the sky strip
  // with the noon sun and the makers' tower shows above it
  const OUT5 = look(400, -760, ZS, .66, 960, 540), MKT = look(2150, 0, 2900, .66, 960, 880), MKT_IN = look(2130, 0, 2900, .72, 960, 880);
  const MKT_W = look(2250, -900, ZS, .5, 960, 470), YOU_C = look(YOU5[0] + 25, -112, 2900, 3.0, 780, 590), YOU_C2 = look(YOU5[0] + 28, -112, 2900, 3.2, 780, 590);
  const RISE5 = look(3500, -1500, ZS, .42, 960, 560);
  const FRONT_GAP = [[900, 3400]];
  const SEG = [
    [tGenEnd, tPaj + .4, [CLOSE, TABLE], 'l', LZ + 1],
    [tAlone - .3, tPhys - .1, [TABLE, TABLE_IN], 'l', ZB],
    [tBH - 1.0, tWants + .3, [TABLE_IN, TABLE_EX], 's', ZB],
    [tWants + .3, tWhy + 2.4, [TABLE_EX, TABLE_EX2], 'l', ZB],
    [tStomp - .1, tKept - .7, [TABLE_EX2, TABLE], 's', ZB],
    [tKept - .7, tKept + 3.0, [TABLE, OUT3, STREET9], 's', ZS],      // out of the kitchen to the street: the kid takes the shuttle to school
    [tKept + 3.0, tNews - .9, [STREET9, STREET9B], 'l', ZS],          // 09:00 · the quiet flat over the living street (a slow breath in)
    [tNews - .9, tAnti + .3, [STREET9B, HALL], 's', ZB],              // push into the hallway: the morning news
    [tAnti + .3, tBarely, [HALL, HALL_IN], 'l', ZB],
    [tBarely + .7, tNight + 1.5, [HALL_IN, PANE, BEHIND, UP, RISE, TOWER_C], 's', 20000],
    [tNight + 1.5, tShift, [TOWER_C, TOWER_C2], 'l', 16000],
    [tShift + .1, tShift + 2.7, [TOWER_C2, SKYX], 's', 16000],
    [tShift + 2.7, tMean, [SKYX, SKYX_IN], 'l', 16000],
    [tMean + .1, tMorning + .2, [SKYX_IN, TABLE], 's', ZB],
    [tMorning + .2, tMoney + .6, [TABLE, TABLE_H], 's', ZB],   // the agent arrives: a slow breath in (no frozen hold)
    [tMoney + .6, tChecks + 1.8, [TABLE_H, OUT5, MKT], 's', ZS],      // noon: out of the flat, down to the market street where you are
    [tChecks + 1.8, tMuch + .3, [MKT, MKT_IN], 'l', 2901],
    [tMuch + .45, tEarn - .05, [MKT_IN, MKT_W], 's', ZS],           // ★ wide: the makers' tower over the roofs
    [tAnyway + 1.5, tPocket + .2, [MKT_W, YOU_C], 's', 2901],
    [tPocket + .2, tJob, [YOU_C, YOU_C2], 'l', 2901],
    [tJob + .15, tWinStart, [YOU_C2, RISE5, CAM_DAD], 's', ZS],
  ];
  const driftK = (t) => smooth(span(t, tGenEnd, tGenEnd + 3)) * (1 - smooth(span(t, tWinStart - 2.2, tWinStart)));
  const camOf = (t) => { const c = camPath(t, SEG), k = driftK(t); return k > 0 ? E.camDrift(c, t, .55 * k, 11) : c; };

  // ---- the hour (world light): 07:30 → 09:00 → the night shift (night, then dawn) → morning → noon
  const hourAt = (t) => {
    let h = lerp(6.25, 7.5, sineIO(span(t, t03, tGenEnd + 1.5)));
    h = lerp(h, 9, sineIO(span(t, t04, t04 + 1.2)));
    h = lerp(h, -1.5, sineIO(span(t, tBarely + .9, tNight + .9)));   // (11-09) the window darkens as the camera goes through it: a memory of the night (the dark way round)
    h = lerp(h, 6.0, sineIO(span(t, tSunrise - .2, tSunrise + 1.6)));
    h = lerp(h, 10.5, sineIO(span(t, tMean + .2, tMorning + .3)));
    h = lerp(h, 12.9, sineIO(span(t, t05, t05 + 1.2)));   // (11-09) the sun just past its top, so it stands in the market's sky strip
    return h;
  };
  const towerOpen = (t) => smooth(span(t, tNight + .7, tNight + 3.4)) * (1 - smooth(span(t, tMean + .4, tMean + 3.6)));
  const skyNight = (t) => t > tNight - .1 && t < tMorning + .5;   // sun/moon off while the explainer sky time-lapses

  // ================================================================ c03 · the tutor
  const talkAt = (t) => lerp(.25, .12, span(t, tGenEnd, tGenEnd + 2)) + .45 * (bump(t, tQ - .9, 1.5) + bump(t, tAnother - .3, .9)) - .12 * span(t, tWaits, tWaits + .5) + .3 * bump(t, tWont - .3, .9);
  // the voice-light: world position over the table; at 'stomps off' it sinks to a pilot dot on the table
  const vlState = (t) => {
    const dim = sineIO(span(t, tStomp + .5, tStomp + 1.6));
    return { X: VL[0], Y: lerp(VL[1], TT - 5, dim), Z: VL[2], r: lerp(VLR, 3.2, dim), talk: Math.max(0, talkAt(t)) * (1 - dim) };
  };
  const ringU = (t) => expoOut(span(t, tAlone, tAlone + .95)) * (1 - expoIn(span(t, tPhys - .45, tPhys + .2)));
  const RING = { cx: -1405, cy: TT - 52, rx: 138, ry: 74 }, RING_A0 = Math.atan2((VL[1] - RING.cy) / RING.ry, (VL[0] - RING.cx) / RING.rx);
  const BEADS = [[tBored, -2.45, 'bored'], [tBluff, -1.62, 'bluff'], [tLaugh, -.95, 'laugh']];
  function ringItem(ctx, t) {
    const u = ringU(t); if (u <= 0) return;
    const a0 = RING_A0, a1 = a0 - 6.283 * u;
    ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = rgba(COOL.edge, .35); ctx.lineWidth = 4.5; ctx.beginPath(); ctx.ellipse(RING.cx, RING.cy, RING.rx, RING.ry, 0, a1, a0); ctx.stroke();
    ctx.strokeStyle = rgba(COOL.core, .9); ctx.lineWidth = 1.3; ctx.stroke();
    if (u < 1) halo(ctx, RING.cx + Math.cos(a1) * RING.rx, RING.cy + Math.sin(a1) * RING.ry, 9, .8, COOL.mid, COOL.core);
    ctx.restore();
    for (const [tb, ang, kind] of BEADS) {   // a bead leaves the light, runs along the ring to its place, then shows its word
      const k = span(t, tb - .35, tb + .35); if (k <= 0) continue;
      const a = lerp(a0, ang, expoOut(k)), back = expoIn(span(t, tPhys - .45, tPhys + .1)), aa = lerp(a, a0, back);
      let x = RING.cx + Math.cos(aa) * RING.rx, y = RING.cy + Math.sin(aa) * RING.ry; const after = span(t, tb + .35, tb + 2.5);
      if (kind === 'bored' && after > 0) { y += 6 * smooth(span(t, tb + .3, tb + .9)); ctx.strokeStyle = rgba(COOL.mid, .8); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 12, y - 5); ctx.quadraticCurveTo(x, y + 9 + Math.sin(t * 1.3), x + 12, y - 5); ctx.stroke(); }
      if (kind === 'bluff' && after > 0) x += 4 * Math.sin(t * 24) * (1 - after) * span(t, tb + .3, tb + .5);
      if (kind === 'laugh') y -= 10 * Math.abs(Math.sin(Math.PI * 2 * span(t, tb + .3, tb + 1.3))) * (1 - span(t, tb + .3, tb + 1.3));
      if (back < 1) { coinUp(ctx, x, y, 3.6 * (1 - back * .5), true); }
    }
  }
  // the two columns on the wall (professor warm, tutor cool), the black hole, the cube, the ladder
  function wall03(ctx, LW, t) {
    const wbase = LW.y + LW.h;   // the wall's light area bottom (behind the table)
    // warm column + the professor at its foot
    const pr = expoOut(span(t, tPhys - .05, tPhys + .45)) * (1 - expoIn(span(t, tBH - 1.1, tBH - .4)));
    if (pr > 0) {
      const x = -1505, top = wbase - 175 * expoOut(span(t, tPhys + .25, tPhys + 1.0)) * (1 - expoIn(span(t, tBH - 1.1, tBH - .4)));
      ctx.save(); ctx.beginPath(); ctx.rect(x - 80, wbase - 400, 160, 400); ctx.clip();
      if (top < wbase) { ctx.fillStyle = rad(ctx, x, (top + wbase) / 2, 90, [[0, rgba(P.halo0, .25)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(x - 90, top - 40, 180, wbase - top + 40); ctx.fillStyle = lin(ctx, 0, top, 0, wbase, [[0, P.core0], [1, P.halo0]]); ctx.fillRect(x - 24, top, 48, wbase - top); }
      ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(x - 120, wbase - 60, 80, 60); ctx.clip(); K.other(ctx, x - 52, wbase + 46 * (1 - pr), 46, t, { light: 1, seed: 9, look: .3 }); ctx.restore();
    }
    // the tutor's cool column (behind the light), runs out of the top; on 'black holes' it folds down into the hole
    const cu = expoOut(span(t, tPhys + .55, tProf + .9)), fold = quartIO(span(t, tBH - .9, tBH + .1));
    if (cu > 0 && fold < 1) {
      const x = HB[0], bot = lerp(wbase, HB[1] + 30, fold), top = lerp(wbase - 640 * cu, HB[1] - 30, fold), wd = lerp(36, 30, fold);
      ctx.fillStyle = rad(ctx, x, (top + bot) / 2, 120, [[0, rgba(COOL.mid, .22)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(x - 120, top - 60, 240, bot - top + 120);
      ctx.fillStyle = lin(ctx, 0, top, 0, bot, [[0, COOL.core], [.5, COOL.mid], [1, COOL.edge]]); ctx.fillRect(x - wd, top, wd * 2, bot - top);
    }
    // ★ the black hole above the book
    const bh = expoOut(span(t, tBH - .05, tBH + .7)), gone = expoIn(span(t, tStomp - .5, tStomp + .1));
    if (bh > 0 && gone < 1) blackHole(ctx, HB[0], HB[1], 40 * bh * (1 - gone), t);
    // the sealed answer cube rises out of it on 'wants the answer'
    const cb = expoOut(span(t, tWants - .1, tWants + .7)), cgone = expoIn(span(t, tStomp - .9, tStomp - .3));
    if (cb > 0 && cgone < 1) {
      const y = lerp(HB[1], CUBE[1], cb) + 3 * Math.sin(t * 1.2), sz = 58 * cb * (1 - cgone);
      if (cgone > 0) { const yy = lerp(y, HB[1], cgone); K.answerCube(ctx, CUBE[0], yy, sz, t, { seal: 1 }); }
      else K.answerCube(ctx, CUBE[0], y, sz, t, { seal: 1 });
      const gl = bump(t, tWont + .05, .5) + .9 * bump(t, tNever + .1, .7);
      if (gl > 0) halo(ctx, CUBE[0], y, 26 * gl, .95 * gl);
    }
    // the ladder of questions (two steps from her toward the cube)
    for (const [tq, S, sz] of [[tQ + .35, S1, 44], [tAnother + .25, S2, 44]]) {
      const u = span(t, tq, tq + .6) * (1 - span(t, tStomp - 1.1, tStomp - .5)); if (u <= 0) continue;
      K.qStep(ctx, S[0], S[1], sz, t, { u, lit: 0 });
    }
  }
  // the spark of each '?' dropping from the voice-light to its step (screen space)
  function stepSparks(ctx, c, t, vls) {
    for (const [tq, S] of [[tQ - .25, S1], [tAnother - .3, S2]]) {
      const k = span(t, tq, tq + .6); if (k <= 0 || k >= 1) continue;
      const a = wp(c, vls.X, vls.Y, vls.Z), b = wp(c, S[0], S[1] - 12, ZB); if (!a || !b) continue;
      const pts = bezPts([a[0], a[1]], [b[0], b[1]], 60), { p, sub } = polyAt(pts, expoOut(k));
      strokePath(ctx, sub.slice(-6), 1.6, COOL.core, .6); halo(ctx, p[0], p[1], 14, .9, COOL.mid, COOL.core);
    }
    // on 'stomps off' the black hole's last point flies back into the light
    const k = span(t, tStomp + .05, tStomp + .55);
    if (k > 0 && k < 1) { const a = wp(c, HB[0], HB[1], ZB), b = wp(c, vls.X, vls.Y, vls.Z); if (a && b) { const pts = bezPts([a[0], a[1]], [b[0], b[1]], 30), { p } = polyAt(pts, expoIn(k)); halo(ctx, p[0], p[1], 12, .9, COOL.mid, COOL.core); } }
  }
  // the blueprint (3.04): the light, the cube with its lock, a dotted line from the light to the ladder (not to the cube)
  function blueprint(ctx, c, t, vls) {
    const u = expoOut(span(t, tBuilt - .1, tBuilt + 1.1)) * (1 - expoIn(span(t, tStomp - 1.3, tStomp - .6))); if (u <= 0) return;
    const br = .85 + .15 * Math.sin(t * 1.6), col = rgba(P.core1, .95 * br), L = wp(c, vls.X, vls.Y, vls.Z), Cb = wp(c, CUBE[0], CUBE[1], ZB), s1 = wp(c, S1[0], S1[1] - 22, ZB), s2 = wp(c, S2[0], S2[1] - 22, ZB);
    if (!L || !Cb) return;
    ctx.save(); ctx.lineCap = 'round'; ctx.shadowColor = rgba(P.halo0, .8); ctx.shadowBlur = 14;
    ctx.strokeStyle = col; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(L[0], L[1], VLR * L[2] * 1.7, -Math.PI / 2, -Math.PI / 2 + 6.283 * u); ctx.stroke();                        // the light, redrawn
    for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(L[0] + d * VLR * L[2] * 2.1, L[1]); ctx.lineTo(L[0] + d * VLR * L[2] * (2.1 + .9 * u), L[1]); ctx.stroke(); }   // axis ticks
    const cs = 58 * Cb[2] * 1.32, ph = Math.min(1, u * 1.2);
    ctx.beginPath(); const sq = [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]].map(([a, b]) => [Cb[0] + a * cs / 2, Cb[1] + b * cs / 2]);
    const { sub } = polyAt(sq, ph); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();      // the cube, redrawn
    const lk = 1 + .35 * bump(t, tNever + .1, .7);
    if (u > .6) lockGlyph(ctx, Cb[0] + cs * .74, Cb[1] - cs * .12, 36 * lk * Cb[2] / 2, rgba(P.core1, .95 * br), 2.8 * lk);          // the lock
    if (lk > 1.02) halo(ctx, Cb[0] + cs * .72, Cb[1], 30 * (lk - 1) * 3, .7 * (lk - 1) * 3);
    if (s1 && s2) { const v = span(t, tBuilt + .6, tBuilt + 1.6); dashed(ctx, [L[0], L[1]], [s1[0], s1[1]], v, col, 2.6, [3, 9]); dashed(ctx, [s1[0], s1[1]], [s2[0], s2[1]], v, col, 2.6, [3, 9]); }
    ctx.restore();
  }
  // the kid over c03: seated (alive, chin forward), slumps on 'groans', slides off and stomps out on 'stomps off'
  const kidWalk0 = tStomp + .3;
  function kidItem(ctx, t, s) {
    if (t < tStomp) {
      const slump = smooth(span(t, tGroan - .1, tGroan + .5)) * (1 - smooth(span(t, tWaits + 1.2, tWaits + 2.2)));
      const lean = lerp(.32, -.12, slump) + .05 * bump(t, tAlone, 1.4);
      const armR = slump > .5 ? [lerp(1.15, .2, (slump - .5) * 2), lerp(2.45, .4, (slump - .5) * 2)] : [1.15, 2.45];
      const armL = [lerp(.95, .15, slump), lerp(2.25, .3, slump)];
      kidSeated(ctx, KID_X, t, { lean, look: .25 + .2 * bump(t, tWants, 1.2), armR, armL, eyes: true });
      return;
    }
    if (t < kidWalk0) { kidSeated(ctx, KID_X - 22 * smooth(span(t, tStomp, kidWalk0)), t, { rise: smooth(span(t, tStomp, kidWalk0)), lean: 0, eyes: true }); return; }
    // the stomp: a real gait toward the door (left), a little bob on each heel strike; she leaves through the door (X −2000)
    const d = (t - kidWalk0) * 135, X = KID_X - 22 - d, ph = d / 100 * Math.PI * 1.15 + Math.PI * .5;
    if (X < KITCHEN.x0 - 60) return;
    ctx.save(); ctx.beginPath(); ctx.rect(KITCHEN.x0, KY - 300, 2000, 400); ctx.clip();
    K.kid(ctx, X, KY - 2.2 * Math.abs(Math.cos(ph)), 100, t, { pose: 'walk', walk: ph, dir: -1, lean: .06, seed: 2 });
    ctx.restore();
  }
  function youItem03(ctx, t) {
    const sip = bump(t, tGroan + .2, 1.6), watch = smooth(span(t, tStomp + .2, tStomp + .7));
    K.you(ctx, YOU3[0], KY, 140, t, { pose: 'hold', cup: 'R', dir: watch > .5 ? -1 : 1, look: .1 + .25 * sip, armR: [lerp(.75, 1.25, sip), lerp(2.35, 2.95, sip)], steam: 1, seed: 1 });
  }
  function bookItem(ctx, c, t) {   // the open book on the table in front of her
    const y = TT - .5, x0 = -1450, x1 = -1385, z0 = LZ - 22, z1 = LZ + 18;
    K.quad(ctx, c, [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], mixHex(P.cream, P.blue1, .35));
    K.quad(ctx, c, [[(x0 + x1) / 2 - 1, y - .3, z0], [(x0 + x1) / 2 + 1, y - .3, z0], [(x0 + x1) / 2 + 1, y - .3, z1], [(x0 + x1) / 2 - 1, y - .3, z1]], rgba(P.blue1, .6));
  }

  // ================================================================ c04 · the night shift
  const youHall = [-2238, 3472];
  const tWalkH = [tKept + .4, tKept + 3.6];   // (11-09) after the kid leaves you cross from the counter to the hallway window (seen wide)
  function youHallDraw(ctx, c, t) {
    let hands = null; const up = bump(t, tBarely - .05, 1.1);
    if (t < tWalkH[1]) {
      const u = sineIO(span(t, tWalkH[0], tWalkH[1])), X = lerp(YOU3[0], youHall[0], u), Z = lerp(YOU3[1], youHall[1], u);
      atZ(ctx, c, Z, () => { K.you(ctx, X, KY, 140, t, { pose: 'walk', walk: (YOU3[0] - X) / 120 * Math.PI, dir: -1, cup: 'R', armR: [.75, 2.35], steam: 0, seed: 1 }); });
      return null;
    }
    atZ(ctx, c, youHall[1], () => { hands = K.you(ctx, youHall[0], KY, 140, t, { pose: 'hold', dir: -1, armR: [.82 + .05 * Math.sin(t * 2.2) * span(t, tNews, tNews + 1), 2.3], look: .05 + .35 * up, lean: .02, seed: 1 }); });
    // the tablet: a thin sheet of cool light in the right hand
    const hp = hands && hands.R; if (!hp) return null;
    const p = wp(c, hp[0] - 6, hp[1] - 6, youHall[1]); if (!p) return null;
    ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(-.35); const tw = 26 * p[2], th = 3.4 * p[2];
    ctx.fillStyle = rad(ctx, 0, 0, tw * 1.4, [[0, rgba(COOL.mid, .35)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(-tw * 1.4, -tw * 1.4, tw * 2.8, tw * 2.8);
    ctx.fillStyle = COOL.core; ctx.fillRect(-tw / 2, -th / 2, tw, th); ctx.restore();
    return [p[0], p[1]];
  }
  // headline objects: germ + pills + gold capsule; globe + a few hundred warm points; the moon mark. World points on ZH; they fall
  // through the glass into the drizzle from 'barely look up'.
  const GERM = [-2430, -1335], GLOBE = [-2392, -1192], MOON = [-2330, -1408];
  const HL = { germ: tAnti + .35, globe: tRare + .35, moon: tOvernight + .25 };
  const fallK = (t, i) => smooth(span(t, tBarely + .15 + i * .35, tBarely + 1.6 + i * .35));
  const objPos = (base, t, i) => { const f = fallK(t, i); return [base[0] + 30 * f * (i - 1), base[1] + 260 * f * f, lerp(ZH, ZB + 500, f), 1 - .75 * f]; };
  const FEW = (() => { const r = prng(4242), a = []; for (let i = 0; i < 140; i++) { const th = r() * 6.283, rr = Math.sqrt(r()) * .94; a.push([Math.cos(th) * rr, Math.sin(th) * rr, r()]); } return a; })();
  function headlines(ctx, c, t, which) {   // which: 'in' (inside the glass) | 'out' (behind it)
    const draw = (key, i, fn) => {
      const [X, Y, Z, k] = objPos(key, t, i); if ((Z > ZB) !== (which === 'out')) return;
      atZ(ctx, c, Z, () => fn(X, Y, k));
    };
    const g = span(t, HL.germ, HL.germ + .55), cured = span(t, tShrug + 1.75, tShrug + 2.3);
    if (g > 0) draw(GERM, 0, (X, Y, k) => {
      germ(ctx, X, Y, 26 * k, t, g, cured);
      for (let j = 0; j < 3; j++) {   // three old drugs bounce off
        const t0 = tShrug + j * .3, u = span(t, t0, t0 + .5), v = span(t, t0 + .5, t0 + 1.3); if (u <= 0 || v >= 1) continue;
        const sx = X + 120, sy = Y + 40 - j * 30, hx = X + 34, hy = Y - 4 + j * 6;
        const x = u < 1 ? lerp(sx, hx, expoIn(u)) : hx + 70 * expoOut(v), y = u < 1 ? lerp(sy, hy, u) : hy + 160 * v * v - 40 * v;
        pill(ctx, x, y, 16 * k, .6 + v * 4, mixHex(P.blue2, P.cream, .4));
      }
      const cp = span(t, tShrug + 1.2, tShrug + 1.8); if (cp > 0) { const x = lerp(X + 110, X + 30, expoOut(cp)), y = lerp(Y - 70, Y - 22, expoOut(cp)); K.capsule(ctx, x, y, 30 * k, t, { cool: 0 }); }
    });
    const gb = span(t, HL.globe, HL.globe + .6);
    if (gb > 0) draw(GLOBE, 1, (X, Y, k) => {
      const R = 46 * expoOut(gb) * k;
      ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.arc(X, Y, R, 0, 6.29); ctx.fill();
      ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(X, Y, R, 0, 6.29); ctx.stroke();
      ctx.strokeStyle = rgba(P.halo2, .35); ctx.lineWidth = .9; for (const e of [.35, .72]) { ctx.beginPath(); ctx.ellipse(X, Y, R * e, R, 0, 0, 6.29); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(X - R, Y); ctx.lineTo(X + R, Y); ctx.stroke();
      const n = Math.round(FEW.length * span(t, tFew, tFew + .9));
      for (let j = 0; j < n; j++) { const [u, v, r] = FEW[j]; ell(ctx, X + u * R, Y + v * R, 1.15 * k, 1.15 * k, rgba(r < .5 ? P.core1 : P.halo0, .95)); }
    });
    const mn = span(t, HL.moon, HL.moon + .55);
    if (mn > 0) draw(MOON, 2, (X, Y, k) => {
      const R = 14 * expoOut(mn) * k; ell(ctx, X, Y, R, R, P.cream); ell(ctx, X + R * .42, Y - R * .22, R * .86, R * .86, mixHex(P.night1, P.ind1, .5)); halo(ctx, X, Y, R * 2.2, .35);
    });
  }
  function headSparks(ctx, c, t, tab) {   // each object grows out of the tablet: a cool spark runs from it to the object's place
    {
      for (const [key, t0] of [[GERM, HL.germ], [GLOBE, HL.globe], [MOON, HL.moon]]) {
        const k = span(t, t0 - .5, t0); if (k <= 0 || k >= 1) continue;
        const b = wp(c, key[0], key[1], ZH); if (!b) continue;
        const pts = bezPts(tab, [b[0], b[1]], 70), { p, sub } = polyAt(pts, expoOut(k));
        strokePath(ctx, sub.slice(-7), 1.5, COOL.core, .55); halo(ctx, p[0], p[1], 14, .9, COOL.mid, COOL.core);
      }
    }
  }
  // the drizzle of breakthroughs: small lights falling past the glass (world, behind the window), amt 0..1 = share of drops
  const DRZ = (() => { const r = prng(777), a = []; for (let i = 0; i < 260; i++) a.push([-3600 + r() * 2900, r() * 3600, 3750 + r() * 2600, .7 + r() * .6, r()]); return a; })();
  const drizzleAmt = (t) => t < tBarely - .3 || t > tNight + 3 ? 0 : smooth(span(t, tBarely - .3, tWeather + .6));
  function drizzle(ctx, c, t) {
    const amt = drizzleAmt(t), n = Math.round(DRZ.length * amt); if (!n) return;
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const [X, ph, Z, sp, q] = DRZ[i], Y = -3900 + ((t * 170 * sp + ph) % 3600);
      const a = wp(c, X, Y, Z), b = wp(c, X, Y - 26, Z); if (!a || !b) continue;
      if (a[0] < -20 || a[0] > W + 20 || a[1] < -40 || a[1] > H + 40) continue;
      ctx.strokeStyle = rgba(q < .55 ? P.core1 : COOL.core, .85); ctx.lineWidth = Math.max(.8, 3.2 * a[2]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      if (a[2] > .25) halo(ctx, a[0], a[1], 9 * a[2] + 2, .35, q < .55 ? P.halo0 : COOL.mid, q < .55 ? P.core0 : COOL.core);
    }
    ctx.restore();
  }
  // the outside world seen through the hallway window (so the camera can fly through it): same layers as world() behind ZB
  function windowPatch(ctx, c, t, oo) {
    if (c.z >= ZB - 40) return;
    const a = wp(c, HALLWIN.x, HALLWIN.y, ZB), b = wp(c, HALLWIN.x + HALLWIN.w, HALLWIN.y + HALLWIN.h, ZB); if (!a || !b) return;
    if (b[0] < 0 || a[0] > W || b[1] < 0 || a[1] > H) return;
    ctx.save(); ctx.beginPath(); ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.clip();
    K.sky(ctx, c, t, oo); K.skyline(ctx, c, t, oo); K.tower(ctx, c, t, { ...oo.tower, L: oo.L }); if (oo.L.day > .05) skyDrones(ctx, c, t, oo.L); K.backRow(ctx, c, t, K.STREET.rows[1], oo); K.testersHouse(ctx, c, t, {}); K.backRow(ctx, c, t, K.STREET.rows[0], oo);
    drizzle(ctx, c, t); headlines(ctx, c, t, 'out');
    ctx.restore();
    atZ(ctx, c, ZB, () => {   // the frame and the cross (as the kit draws them)
      const { x, y, w, h } = HALLWIN; ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(x + w / 2 - 4, y, 8, h); ctx.fillRect(x, y + h * .45, w, 8); ctx.fillRect(x - 10, y + h, w + 20, 10);
    });
  }
  // ---- the night-shift explainer (plane ZT in front of the tower)
  const sT = (c) => c.f / (ZT - c.z);
  const fromSkyx = (sx, sy) => { const s = sT(SKYX); return [SKYX.x + (sx - W / 2) / s, SKYX.y + (sy - H / 2) / s]; };   // design in the SKYX frame
  const OH = [2700, -4400], WH = [3420, -4900];                 // the hunch's origin (left of the tower) and its window
  const ROAD = [fromSkyx(1352, 419), fromSkyx(1300, 470), fromSkyx(1180, 478), fromSkyx(1010, 478), fromSkyx(760, 478), fromSkyx(470, 478)];
  const HOUSE = fromSkyx(1010, 478), GAP = fromSkyx(1268, 476), HOUSE_M = 2.79;
  const DESC3 = [[ROAD[5][0], ROAD[5][1], ZT], [ROAD[5][0] - 2600, ROAD[5][1] + 500, ZT - 1500], [-2600, -3400, 9000], [-1200, -1900, 3300], [AG_TABLE[0], AG_TABLE[1], AG_TABLE[2]]];
  const LINES = (() => { const r = prng(3131), a = []; for (let i = 0; i < 170; i++) a.push({ x0: -3800 + r() * 5600, y0: -1000 - r() * 900, x1: 3380 + r() * 1240, y1: -7000 + r() * 3200, t0: tWritten - .4 + r() * 2.4, d: 1.0 + r() * .6, len: 240 + r() * 300 }); return a; })();
  const RAYS = (() => { const r = prng(9191), a = []; for (let i = 0; i < 520; i++) { const th = Math.PI * (.52 + r() * .52), L = 2300 + r() * 1300; a.push([Math.cos(th) * L, Math.sin(th) * L, r()]); } return a; })();
  const LIT = [17, 88, 151, 240, 333, 409];
  const PEOPLE = [[-150, 0], [-40, 1], [90, 2], [210, 3]];
  const vcamHouse = (c) => { const sE = sT(c), m = HOUSE_M; return { x: (c.x - HOUSE[0]) / m + K.STREET.testers.x, y: (c.y - HOUSE[1]) / m, z: K.STREET.testers.z - c.f / (m * sE), f: c.f, roll: 0 }; };
  function nightShift(ctx, c, t) {
    if (t < tWritten - .5 || t > tMorning + 2) return;
    // the gold text lines stream up from the city into the tower
    if (t < tHunch + .2) {
      ctx.save(); ctx.lineCap = 'round';
      for (const Ln of LINES) {
        const u = span(t, Ln.t0, Ln.t0 + Ln.d); if (u <= 0 || u >= 1) continue;
        const e = expoIn(u) * .25 + u * .75, mx = (Ln.x0 + Ln.x1) / 2 - 900, my = Math.min(Ln.y0, Ln.y1) + 600;
        const P2 = (v) => { const w = 1 - v; return [w * w * Ln.x0 + 2 * w * v * mx + v * v * Ln.x1, w * w * Ln.y0 + 2 * w * v * my + v * v * Ln.y1]; };
        const [X, Y] = P2(e), p = wp(c, X, Y, ZT), q = wp(c, ...P2(Math.max(0, e - .18)), ZT); if (!p || !q) continue;
        ctx.strokeStyle = rgba(P.halo0, .5); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();   // its thread
        const L = Ln.len * p[2] * (1 - .6 * e);
        ctx.strokeStyle = rgba(P.core1, 1); ctx.lineWidth = Math.max(2.4, 14 * p[2]); ctx.beginPath(); ctx.moveTo(p[0] - L / 2, p[1]); ctx.lineTo(p[0] + L / 2, p[1]); ctx.stroke();
        ctx.strokeStyle = rgba(P.core1, .7); ctx.lineWidth = Math.max(1.6, 9 * p[2]); ctx.beginPath(); ctx.moveTo(p[0] - L / 2, p[1] + Math.max(5, 30 * p[2])); ctx.lineTo(p[0] + L * .2, p[1] + Math.max(5, 30 * p[2])); ctx.stroke();
      }
      ctx.restore();
    }
    // the hunch: one cool point leaves the tower; on 'thousand different ways' a fan of hair-thin rays; most go dim, a few stay lit;
    // on 'And yet' the lit ones gather back into one capsule
    const hk = span(t, tHunch - .1, tHunch + .7);
    const fan = expoOut(span(t, tThousand - .05, tThousand + .9)), dim = smooth(span(t, tThousand + 1.0, tThousand + 2.2));
    const back = expoIn(span(t, tYet - .9, tYet + .1)), litBack = quartIO(span(t, tYet - .3, tYet + .7));
    const o = wp(c, OH[0], OH[1], ZT);
    if (hk > 0 && o && t < tYet + .9) {
      if (fan > 0) {
        ctx.save(); ctx.lineCap = 'round';
        ctx.strokeStyle = rgba(COOL.mid, lerp(.5, .12, dim)); ctx.lineWidth = .8; ctx.beginPath();
        const uu = fan * (1 - back);
        for (let i = 0; i < RAYS.length; i++) { if (LIT.includes(i)) continue; const [dx, dy, r] = RAYS[i], v = clamp(uu * (1.15 - .3 * r)); if (v <= 0) continue; const e = wp(c, OH[0] + dx * v, OH[1] + dy * v, ZT); if (!e) continue; ctx.moveTo(o[0], o[1]); ctx.lineTo(e[0], e[1]); }
        ctx.stroke();
        for (const i of LIT) {
          const [dx, dy] = RAYS[i], v = fan * (1 - litBack), e = wp(c, OH[0] + dx * v, OH[1] + dy * v, ZT); if (!e) continue;
          ctx.strokeStyle = rgba(mixHex(COOL.core, P.core1, dim), .95); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
          halo(ctx, e[0], e[1], 10, .8 * (1 - litBack));
        }
        ctx.restore();
      }
      const w0 = wp(c, WH[0], WH[1], ZT), pp = hk < 1 && w0 ? [lerp(w0[0], o[0], expoOut(hk)), lerp(w0[1], o[1], expoOut(hk))] : [o[0], o[1]];
      if (t < tYet + .5) halo(ctx, pp[0], pp[1], 16, .95, COOL.mid, COOL.core);
    }
    // the road: from the tower's side to the testers' house, on to the people waiting; later down into your kitchen
    const rd = expoOut(span(t, tYet + .3, tPatient + .2));
    const rpts = ROAD.map(([X, Y]) => wp(c, X, Y, ZT)).filter(Boolean).map((p) => [p[0], p[1], 3]);
    if (rd > 0 && rpts.length === ROAD.length) E.trail(ctx, rpts, rd, { w: 2.6, spark: rd < 1 });
    // the gap between the tower and the house glows (a gold rule)
    const gp = expoOut(span(t, tMakers - .05, tMakers + .6));
    if (gp > 0) { const a = wp(c, GAP[0], GAP[1] - 950 * gp, ZT), b = wp(c, GAP[0], GAP[1] + 60, ZT); if (a && b) { strokePath(ctx, [[a[0], a[1]], [b[0], b[1]]], 3, P.halo0, .3); strokePath(ctx, [[a[0], a[1]], [b[0], b[1]]], 1.4, P.core1, .95); } }
    // the testers' house (the kit's house, placed on the road in this explainer space): its front opens 'In the open'
    const hs = expoOut(span(t, tTesters - .9, tTesters + .2));
    if (hs > 0) {
      const vc = vcamHouse(c), opn = smooth(span(t, tOpen - .05, tOpen + 1.5));
      ctx.save(); const hb = wp(c, HOUSE[0], HOUSE[1], ZT); if (hb) { ctx.beginPath(); ctx.rect(0, 0, W, hb[1] + 1); ctx.clip(); }
      // it rises from the road (mask from its base line)
      const lift = (1 - hs) * 900 * HOUSE_M; const vc2 = { ...vc, y: vc.y - lift / HOUSE_M };
      K.testersHouse(ctx, vc2, t, { open: opn });
      ctx.restore();
      const br = .5 + .5 * Math.sin(t * 1.3); if (hb && t > tThisPat - .3) halo(ctx, hb[0], hb[1] - 120 * hb[2] * HOUSE_M * .5, 40 * hb[2] * 10, .25 + .15 * br);
    }
    // the capsule: the lit rays gather into it, it travels on the road to the testers' door and waits there
    if (t > tYet + .1) {
      const mv = sineIO(span(t, tPatient - .1, tTesters + .9)), door = 3 / 5 * .62;
      const { p: P0 } = polyAt(ROAD, mv * door + .0);
      const q = wp(c, P0[0], P0[1] - 140, ZT);
      if (q) { const sz = 640 * q[2] * expoOut(span(t, tYet + .2, tYet + .8)), bob = t > tTesters + .9 ? Math.sin(t * 1.4) * 2 : 0; K.capsule(ctx, q[0], q[1] + bob, sz, t, { cool: lerp(.85, .4, span(t, tOpen, tOpen + 2)) }); }
    }
    // month ticks unroll from the door toward the people; 'costs lives' they darken one by one
    const mt = span(t, tMonths - .2, tMonths + 1.3);
    if (mt > 0) {
      for (let i = 0; i < 6; i++) {
        const u = clamp(mt * 6 - i); if (u <= 0) continue;
        const [X, Y] = polyAt(ROAD, .64 + i * .062).p, p = wp(c, X, Y, ZT); if (!p) continue;
        const dk = smooth(span(t, tLives + .1 + i * .18, tLives + .5 + i * .18)), hgt = 26 * expoOut(u);
        ctx.fillStyle = rgba(mixHex(P.core1, P.blue1, .8 * dk), .95); ctx.fillRect(p[0] - 1.8, p[1] - hgt, 3.6, hgt * 2);
      }
    }
    // the people waiting at the far end; one turns toward the testers on 'They're not wrong'
    for (const [dx, i] of PEOPLE) {
      const u = expoOut(span(t, tHate - .1 + i * .15, tHate + .5 + i * .15)); if (u <= 0) continue;
      const [X, Y] = ROAD[5], turn = i === 2 && t > tWrong + .1;
      const hp = wp(c, X + dx * 4.2 - 420, Y - 520, ZT); if (hp) halo(ctx, hp[0], hp[1], 900 * hp[2], .22 * u, P.halo2, P.cream);
      atZ(ctx, c, ZT, () => { ctx.save(); ctx.beginPath(); ctx.rect(X - 3200, Y - 3000, 6400, 3000); ctx.clip(); K.other(ctx, X + dx * 4.2 - 420, Y + 1050 * (1 - u), 1000 + i * 45, t, { dir: turn ? 1 : -1, light: 1, seed: 20 + i, look: turn ? .1 : 0, lean: turn ? .03 : 0, rim: mixHex(P.blue0, P.cream, .55) }); ctx.restore(); });
    }
  }
  function descent(ctx, c, t) {
    // 'Meanwhile': the road leads down into the city, into your kitchen, to the table where the agent sits
    const dsc = span(t, tMean + .05, tMorning - .1);
    if (dsc > 0) {
      const sp = E.catmull(DESC3, 10), pts = [];
      const lim = lerp(ZT + 1, ZB, smooth(span(c.z, 700, 2100)));   // near the house only the part inside the room is drawn (the far part would cross the facade)
      for (const q of sp) { if (q[2] > lim) { if (pts.length) break; continue; } const p = wp(c, q[0], q[1], q[2]); if (p) pts.push([p[0], p[1], 2.6]); else if (pts.length) break; }
      const r0 = expoIn(span(t, tMorning - .2, tMorning + 1.1));
      const u = sineIO(dsc), q = r0 > 0 ? pts.slice(Math.min(pts.length - 2, Math.floor(r0 * (pts.length - 1)))) : pts;
      if (q.length > 1 && r0 < 1) E.trail(ctx, q, r0 > 0 ? 1 : u, { w: 2.6, spark: u < 1 });
    }
  }

  // ================================================================ c05 · the agent
  // the agent's place (world [X, Y, Z]) over time
  const AG_SH = [YOU5[0] + 35, -140 * .93, YOU5[1] - 6];       // at your shoulder (on the street, ground Y 0)
  const AG_POCKET = [YOU5[0] - 8, -140 * .42, YOU5[1] - 8];
  const youX5 = (t) => YOU5[0] + 470 * smooth(span(t, tJob + .3, tJob + 2.8));
  const tFly0 = t05 - .6;   // noon: the agent leaves the table, out through the open front, down to you on the market street ('checks in')
  const agentPos = (t) => {
    if (t < tFly0) return AG_TABLE;
    const f = span(t, tFly0, tChecks + .35), dx = youX5(t) - YOU5[0], xf = sineIO(f), zf = expoOut(clamp(f * 1.5));
    let p = [lerp(AG_TABLE[0], AG_SH[0], xf), lerp(AG_TABLE[1], AG_SH[1], xf) - 220 * Math.sin(Math.PI * xf) * (1 - xf), lerp(AG_TABLE[2], AG_SH[2], zf)];
    const lean = bump(t, tAnyway, 1.3); p = [p[0] + 30 * lean, p[1] - 8 * lean, p[2]];
    const dn = sineIO(span(t, tAnyway + 1.4, tAnyway + 2.1)); p = [lerp(p[0], AG_POCKET[0], dn) + dx, lerp(p[1], AG_POCKET[1], dn), lerp(p[2], AG_POCKET[2], dn)];
    return p;
  };
  const agentA = (t) => expoOut(span(t, tMorning - .4, tMorning + .4)) * (1 - .6 * smooth(span(t, tJob, tJob + .8)));
  // the stacks of coins on the table (4.08)
  const COINS = (() => { const r = prng(55), a = []; for (let i = 0; i < 12; i++) { const st = i % 3; a.push({ x0: -1440 + r() * 300, z0: LZ - 60 + r() * 120, x1: -1335 + st * 35, z1: LZ + 12, k: Math.floor(i / 3), t0: tMoney - .1 + i * .07 }); } return a; })();
  function coinsItem(ctx, c, t) {
    if (t < tMean || t > tChecks + 6) return;
    for (const C of COINS) {
      const u = sineIO(span(t, C.t0, C.t0 + .45)), X = lerp(C.x0, C.x1, u), Z = lerp(C.z0, C.z1, u), Y = TT - 1.2 - C.k * 2.4 * u;
      const p = wp(c, X, Y, Z); if (!p) continue; coinFlat(ctx, p[0], p[1], 8 * p[2]);
    }
  }
  // you in c05: at the counter's end; nod on 'it asks'; turn and cut on 'making lunch'; the hand comes up (wrist + thread) for 5.04–5.05; walk on 'one job'
  // (11-09 rework) you are OUT on the market street: the raincoat (hood down, sunny noon); on 'making lunch' you turn to the fruit stall,
  // reach and take a paper bag of lunch; the bag stays in your hand; the wrist comes up for 5.04–5.05; on 'one job' you walk on (right)
  function youItem05(ctx, t) {
    const nod = bump(t, tAsks + .75, .35) + bump(t, tAsks + 1.15, .35);
    const wristUp = smooth(span(t, tAnyway + 1.6, tAnyway + 2.3)) * (1 - smooth(span(t, tJob, tJob + .5)));
    const X = youX5(t), walking = t > tJob + .3 && t < tJob + 2.8, buy = t > tLunch - .2 && t < tLunch + 1.6, bag = t > tLunch + .55;
    let hands;
    if (walking) { const d = X - YOU5[0]; hands = K.you(ctx, X, 0, 140, t, { pose: 'walk', walk: d / 120 * Math.PI, dir: 1, out: true, hood: false, seed: 1 }); }
    else if (buy) { const r = bump(t, tLunch, 1.3); hands = K.you(ctx, X, 0, 140, t, { pose: 'stand', dir: -1, out: true, hood: false, armR: [lerp(.2, 1.35, r), lerp(.1, 1.5, r)], lean: .06 * r, look: .05, seed: 1 }); }
    else {
      const lookUp = .1 + .25 * bump(t, tChecks, 1.6) - .3 * nod + .3 * bump(t, tNeeds, 2) + .25 * bump(t, tPlans, 2.4);
      hands = K.you(ctx, X, 0, 140, t, { pose: 'stand', dir: 1, out: true, hood: false, armR: [lerp(.2, .62, wristUp), lerp(.1, 2.05, wristUp)], look: clamp(lookUp + .15 * smooth(span(t, tJob + 2.8, tJob + 3.4))), seed: 1 });
    }
    if (bag && hands && hands.R) { const [hx, hy] = hands.R; ctx.fillStyle = mixHex(P.shade0, P.halo1, .4); ctx.beginPath(); ctx.roundRect(hx - 9, hy - 2, 18, 20, 3); ctx.fill(); ctx.fillStyle = rgba(P.night1, .25); ctx.fillRect(hx - 9, hy + 12, 18, 3); ell(ctx, hx - 3, hy - 3, 4, 3, P.halo0); }
    return hands;
  }
  // the shop window right of you: in 2037 a shop's glass can show light (like the kitchen's light wall); the c05 graphics (the day row,
  // the plan bars) are drawn on it through a map of the kitchen's LIGHTWALL onto the glass (world units, plane ZS)
  const SHOP = { x: 2040, y: -470, k: .8 };
  const shopPt = (X, Y) => [SHOP.x + (X - LIGHTWALL.x) * SHOP.k, SHOP.y + (Y - LIGHTWALL.y) * SHOP.k];
  const shopGlow = (t) => .15 * smooth(span(t, tMean, tMean + 1.5)) + .25 * span(t, tPlans, tPlans + 1);
  function shopWindow(ctx, t, L) {
    const w = LIGHTWALL.w * SHOP.k, h = LIGHTWALL.h * SHOP.k, g = shopGlow(t);
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .35 + .2 * L.day); ctx.fillRect(SHOP.x - 30, SHOP.y - 70, w + 60, -SHOP.y + 70);   // the shop front
    for (let i = 0; i < 7; i++) { ctx.fillStyle = i % 2 ? mixHex(P.blue1, P.cream, .35) : mixHex(P.ind1, P.blue1, .5); ctx.fillRect(SHOP.x - 30 + i * (w + 60) / 7, SHOP.y - 70, (w + 60) / 7, 34); }   // a striped awning band
    ctx.fillStyle = lin(ctx, 0, SHOP.y, 0, SHOP.y + h, [[0, mixHex(P.night1, P.ind1, .7)], [1, mixHex(P.night1, P.ind0, .5)]]); ctx.fillRect(SHOP.x, SHOP.y, w, h);   // dark glass
    ctx.fillStyle = rad(ctx, SHOP.x + w / 2, SHOP.y + h * .55, w * .7, [[0, rgba(P.blue0, .5 * g)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(SHOP.x, SHOP.y, w, h);
    ctx.fillStyle = rgba(P.cream, .05 * L.day); ctx.beginPath(); ctx.moveTo(SHOP.x, SHOP.y + h * .8); ctx.lineTo(SHOP.x + w * .5, SHOP.y); ctx.lineTo(SHOP.x + w * .7, SHOP.y); ctx.lineTo(SHOP.x + w * .1, SHOP.y + h); ctx.lineTo(SHOP.x, SHOP.y + h); ctx.closePath(); ctx.fill();   // sky sheen
    ctx.save(); ctx.beginPath(); ctx.rect(SHOP.x, SHOP.y, w, h); ctx.clip();
    ctx.translate(SHOP.x, SHOP.y); ctx.scale(SHOP.k, SHOP.k); ctx.translate(-LIGHTWALL.x, -LIGHTWALL.y); wall05(ctx, LIGHTWALL, t);
    ctx.restore();
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(SHOP.x - 8, SHOP.y + h, w + 16, 10);
  }
  // light-wall graphics of c05: the day row (TUE · WED · THU), the plan bars with their coverage ticks
  const BARS = [175, 136, 208, 109, 162, 223, 146], YOURS = 2, GOLD = 3, COV = [.5, .62, .8, .45, .7, .78, .55];
  const BX0 = -1565, BW = 34, BGAP = 23, BBASE = LIGHTWALL.y + LIGHTWALL.h - 34;
  function wall05(ctx, LW, t) {
    // the day row
    const dr = span(t, tThu - .25, tThu + .35) * (1 - span(t, tNeeds + .9, tNeeds + 1.4));
    if (dr > 0) {
      const y = LW.y + 118, x0 = -1395; ctx.save(); ctx.beginPath(); ctx.rect(x0 - 120, y - 40, 320, 50); ctx.clip();
      const off = 40 * (1 - expoOut(dr));
      E.glowText(ctx, 'TUE   ·   WED   ·', x0 - 95, y + off, { size: 22, spacing: .18, col: P.halo2, glow: false });
      E.glowText(ctx, 'THU', x0 + 100, y + off, { size: 22, spacing: .18, col: P.cream });
      ctx.restore();
      const rg = expoOut(span(t, tThu + .5, tThu + 1.2)) * (1 - span(t, tNeeds + .9, tNeeds + 1.4));
      if (rg > 0) { ctx.strokeStyle = rgba(P.core1, .95); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x0 + 122, y - 8, 38, 20, 0, -Math.PI / 2, -Math.PI / 2 + 6.283 * rg); ctx.stroke(); }
    }
    // the plan bars (price = height), each with its coverage tick in a band above; yours outlined, the cheaper gold one lifts its tick
    const fanned = span(t, tPlans + .7, tPlans + 1.0), grow = expoOut(span(t, tMarket, tMarket + .8)), gold = expoOut(span(t, tCheap - .05, tCheap + .45));
    const lift = sineIO(span(t, tMuch, tMuch + .8)), away = expoIn(span(t, tAnyway + .9, tAnyway + 2.4));
    if (fanned <= 0 || away >= 1) return;
    const band = BBASE - 240;
    for (let i = 0; i < BARS.length; i++) {
      const x = BX0 + i * (BW + BGAP), h = BARS[i] * grow * (1 - away), isG = i === GOLD, isY = i === YOURS;
      if (h > 1) {
        ctx.fillStyle = isG && gold > 0 ? lin(ctx, 0, BBASE - h, 0, BBASE, [[0, mixHex(P.blue1, P.core1, gold)], [1, mixHex(P.blue0, P.halo0, gold)]]) : lin(ctx, 0, BBASE - h, 0, BBASE, [[0, mixHex(P.blue1, COOL.mid, .35)], [1, P.blue0]]);
        ctx.fillRect(x, BBASE - h, BW, h);
        if (isY) { ctx.strokeStyle = rgba(P.cream, .95); ctx.lineWidth = 2; ctx.strokeRect(x - 3, BBASE - h - 3, BW + 6, h + 3); }
        if (isG && gold > 0) halo(ctx, x + BW / 2, BBASE - h, 30 * gold, .6 * gold);
      }
      const cv = isG ? lerp(COV[i], COV[YOURS], lift) : COV[i], ty = band - 90 * cv;
      const tw = BW * grow * (1 - away);
      if (tw > 1) { ctx.fillStyle = isG && gold > 0 ? P.core1 : isY ? P.cream : rgba(P.halo2, .8); ctx.fillRect(x + BW / 2 - tw / 2 - 3, ty - 1.5, tw + 6, 3); }
    }
    const lv = band - 90 * COV[YOURS], dl = span(t, tMuch - .1, tMuch + .5) * (1 - away);
    if (dl > 0) dashed(ctx, [BX0 + YOURS * (BW + BGAP) + BW + 4, lv], [BX0 + GOLD * (BW + BGAP) + BW + 30, lv], dl, rgba(P.cream, .7), 1.4, [5, 6]);
  }
  // the plan cards fly from the agent onto the wall (screen space) before they become the bars
  function planCards(ctx, c, t, ag) {
    const k0 = span(t, tPlans - .1, tPlans + .9); if (k0 <= 0 || k0 >= 1 || !ag) return;
    for (let i = 0; i < BARS.length; i++) {
      const k = span(t, tPlans - .1 + i * .06, tPlans + .7 + i * .06); if (k <= 0 || k >= 1) continue;
      const b = wp(c, ...shopPt(BX0 + i * (BW + BGAP) + BW / 2, BBASE - 80), ZS); if (!b) continue;
      const pts = bezPts(ag, [b[0], b[1]], 120 - i * 8), { p } = polyAt(pts, expoOut(k));
      sheet(ctx, p[0], p[1], 22 * b[2] * (.6 + .4 * k), -.3 + .3 * k);
    }
  }
  // the clinic's gold line (from the agent out to the left), the documents sliding along it, the coin and the gate
  const CL_END = (ag) => [-60, ag[1] - 90];
  function clinicLine(ctx, c, t, ag) {
    const u = expoOut(span(t, tNeeds - .55, tNeeds + .05)), out = expoIn(span(t, tSpends + 1.4, tSpends + 2.2));
    if (u <= 0 || out >= 1 || !ag) return;
    const e = CL_END(ag), pts = bezPts(e, ag, 70, 30);   // drawn from the left (the clinic) to the agent
    E.trail(ctx, pts.map((p) => [p[0], p[1], 1.6]), u, { w: 1.6, spark: u < 1 });
    const back = pts.slice().reverse();
    for (let j = 0; j < 3; j++) {   // the documents slide out along it
      const k = span(t, tNeeds + .1 + j * .22, tNeeds + 1.3 + j * .22); if (k <= 0 || k >= 1) continue;
      const { p } = polyAt(back, sineIO(k)); sheet(ctx, p[0], p[1] - 12, 20, -.15, 1);
    }
    // the gate on the line (35 % from the agent), the coin stops at it; it lifts a '?' toward you; you nod; the coin passes
    const gpos = polyAt(back, .42).p, gate = expoOut(span(t, tDep - .3, tDep + .2)) * (1 - out), open = sineIO(span(t, tAsks + 1.7, tAsks + 2.2));
    if (gate > 0) {
      ctx.save(); ctx.translate(gpos[0], gpos[1]); ctx.strokeStyle = rgba(P.core1, .95); ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, 6); ctx.lineTo(0, -34 * gate); ctx.stroke();
      ctx.rotate(-open * 1.3); ctx.beginPath(); ctx.moveTo(0, -30 * gate); ctx.lineTo(26 * gate, -30 * gate); ctx.stroke(); ctx.restore();
    }
    const cm = sineIO(span(t, tDep, tDep + .8)), cp = sineIO(span(t, tSpends - .1, tSpends + 1.3));
    if (cm > 0 && cp < 1) { const { p } = polyAt(back, lerp(0, .38, cm) + .62 * cp); coinUp(ctx, p[0], p[1] - 6, 9, false); }
    const q = span(t, tAsks + .05, tAsks + .65), qback = span(t, tAsks + 1.3, tAsks + 1.7);
    if (q > 0 && qback < 1) {
      const to = [ag[0] - 40, ag[1] - 70], pts2 = bezPts([gpos[0], gpos[1] - 40], to, 50), { p } = polyAt(pts2, expoOut(q) * (1 - expoIn(qback)));
      E.glowText(ctx, '?', p[0], p[1], { size: 40, serif: true, align: 'center', col: mixHex(COOL.core, P.core1, span(t, tAsks + .9, tAsks + 1.3)) });
    }
  }
  // the flurry of forms flies at you and is caught by the agent (it pulses with each)
  const FORMS = (() => { const r = prng(808), a = []; for (let i = 0; i < 8; i++) a.push({ y: 420 + r() * 300, t0: tForm - .2 + i * .17, rot: (r() - .5) * 1.2, lift: 60 + r() * 120 }); return a; })();
  function forms(ctx, t, ag) {
    if (!ag) return 0; let pulse = 0;
    for (const F of FORMS) {
      const k = span(t, F.t0, F.t0 + .95); if (k <= 0) continue;
      if (k >= 1) { pulse = Math.max(pulse, 1 - span(t, F.t0 + .95, F.t0 + 1.25)); continue; }
      const pts = bezPts([W + 60, F.y], ag, F.lift), { p } = polyAt(pts, sineIO(k)), sc = k > .8 ? 1 - (k - .8) / .2 : 1;
      sheet(ctx, p[0], p[1], 34 * sc, F.rot * (1 - k));
    }
    return pulse;
  }
  // ★ the makers' cool thread from the tower: reaches for the agent's thread, cannot attach, slides off and falls back
  const TW_PT = [3350, -6200, 16000];
  function coolThread(ctx, c, t, ag, wrist) {
    const u = expoOut(span(t, tEarn - .5, tEarn + .6)), sl = span(t, tEarn + .65, tStayed + .7), ret = expoIn(span(t, tStayed + .5, tAnyway - .1));
    if (u <= 0 || ret >= 1 || !ag || !wrist) return;
    const a = wp(c, ...TW_PT); if (!a) return;
    const mid = [lerp(ag[0], wrist[0], .5), lerp(ag[1], wrist[1], .5)];
    K.thread(ctx, [a[0], a[1]], mid, t, { u: u * (1 - ret), cool: true, slide: sl, sag: 90, w: 1.8 });
    if (sl > 0 && sl < .5) halo(ctx, mid[0], mid[1], 22, .7 * (1 - sl * 2), COOL.mid, COOL.core);
  }
  function coolCoins(ctx, c, t, ag) {
    if (!ag) return;
    for (let j = 0; j < 3; j++) {
      const t0 = tBuy - .3 + j * .35, k = span(t, t0, t0 + .8), v = span(t, t0 + .8, t0 + 1.8); if (k <= 0 || v >= 1) continue;
      const src = [W + 80, 120 + j * 70], hit = [ag[0] + 10, ag[1] - 8];
      const p = k < 1 ? polyAt(bezPts(src, hit, 140), expoIn(k) * .3 + k * .7).p : [hit[0] + 90 * v * (1 + j * .3), hit[1] - 70 * v + 260 * v * v];
      coinUp(ctx, p[0], p[1], 20, true);
      if (k >= 1 && v < .15) halo(ctx, hit[0], hit[1], 26, .8 * (1 - v / .15));
    }
  }

  // ================================================================ street life (11-09 rework: the day is out in a living street)
  // far drones over the city (ambient; behind the back rows' roofs, slow); world planes Z 9000–13000
  const SKYD = [[-14000, -4300, 11000, 160, 1], [6000, -5200, 12500, -130, -1], [-3000, -3800, 9500, 110, 1], [16000, -4700, 13000, -150, -1]];
  function skyDrones(ctx, c, t, L) {
    for (const [x0, Y, Z, v, d] of SKYD) atZ(ctx, c, Z, (s) => { const X = S.pace(t, 0, x0 - 20000, x0 + 20000, 40000 / Math.abs(v)); S.drone(ctx, d > 0 ? X : -X + 2 * x0, Y, 2.2, t, { dir: d, box: true, tilt: .08, day: L.day }); });
  }
  const STOP3 = -1900, KID_X3 = -2560;   // the school shuttle's stop in front of your building; where the kid comes out (the stairwell)
  const sh3X = (t) => { const a = span(t, tKept - .6, tKept + 1.6), d = span(t, tKept + 3.9, tKept + 7.4); return a < 1 ? lerp(-4600, STOP3, 1 - (1 - a) ** 2.2) : STOP3 + 2800 * d * d; };
  const kid3X = (t) => KID_X3 + 190 * Math.max(0, t - (tKept + 1.55));
  const MED = (t) => [lerp(-500, -3000, span(t, t04 - .4, t04 + 6.3)), -880 + 30 * Math.sin(t * .8)];
  function streetLife(ctx, c, t, L) {
    const day = L.day, items = []; let hands = null;
    // c03 end → c04: the kid comes down to the street and takes the school shuttle; then the 09:00 street
    if (t > tKept - .8 && t < tNews + 3) {
      items.push([2620, () => S.shuttle(ctx, sh3X(t), 0, 1, t, { dir: 1, riders: 2, day, roll: sh3X(t), doors: smooth(span(t, tKept + 2.1, tKept + 2.5)) * (1 - smooth(span(t, tKept + 3.3, tKept + 3.6))) })]);
      const kx = kid3X(t);
      if (t > tKept + 1.5 && kx < STOP3 - 40) items.push([2880, () => K.kid(ctx, kx, -2.2 * Math.abs(Math.cos(kx / 30)), 100, t, { pose: 'walk', walk: kx / 30, dir: 1, lean: .06, seed: 2, colors: { base: mixHex(P.ind1, P.blue1, .35), lit: P.blue1, shade: P.night1, deep: P.night0, hem: .44 } })]);
      items.push([2930, () => S.deliveryRobot(ctx, -3050 + 65 * (t - t04), 0, 1, t, { dir: 1, roll: 65 * (t - t04), day })]);
      items.push([2948, () => S.deliveryRobot(ctx, -700 - 55 * (t - tKept), 0, .95, t, { dir: -1, roll: 55 * (t - tKept), day, lid: .15 })]);
      items.push([2965, () => S.passerby(ctx, -3150 + 105 * (t - tKept), 0, 138, t, { dir: 1, seed: 31, walk: (t - tKept) * 4.6, bag: true })]);
      items.push([2975, () => S.passerby(ctx, -500 - 95 * (t - tKept), 0, 132, t, { dir: -1, seed: 33, walk: (t - tKept) * 4.3 })]);
      if (t > t04 - .5 && t < t04 + 6.5) { const [mx, my] = MED(t); items.push([2950, () => S.drone(ctx, mx, my, 1, t, { dir: -1, med: true, tilt: .1, day })]); }
    }
    // c05: the market street (stalls stand all day; the walkers, the crate robot and you from 'Meanwhile' on)
    items.push([2935, () => S.stall(ctx, 1760, 0, 1, t, { goods: 'fruit', awn: 'gold', day })]);
    items.push([2945, () => S.stall(ctx, 1180, 0, 1, t, { goods: 'bread', awn: 'gold', day })]);
    items.push([2945, () => S.stall(ctx, 2700, 0, 1, t, { goods: 'flowers', awn: 'gold', day })]);
    items.push([2990, () => S.shuttleStop(ctx, 1000, 0, 1, t, { day })]);
    if (t > tMean) {
      items.push([2992, () => S.passerby(ctx, 1090, 0, 136, t, { stand: true, seed: 41, look: .1 })]);
      items.push([2985, () => S.passerby(ctx, 1280, 0, 140, t, { stand: true, dir: -1, seed: 43, lean: .05 })]);
      items.push([2968, () => S.deliveryRobot(ctx, 3100 - 85 * (t - t05), 0, 1, t, { dir: -1, crates: 2, flag: false, roll: 85 * (t - t05), day })]);
      items.push([2975, () => S.passerby(ctx, 300 + 105 * (t - t05), 0, 138, t, { dir: 1, seed: 45, walk: (t - t05) * 4.6, bag: true })]);
      items.push([2978, () => S.passerby(ctx, 3400 - 100 * (t - tLunch), 0, 134, t, { dir: -1, seed: 47, walk: (t - tLunch) * 4.4 })]);
      items.push([YOU5[1], () => { hands = youItem05(ctx, t); }]);
    }
    items.sort((a, b) => b[0] - a[0]);
    for (const [Z, fn] of items) atZ(ctx, c, Z, fn);
    return hands;
  }

  // ================================================================ the frame
  function draw(ctx, t) {
    if (t < tGenEnd) { plateGenius(ctx, t); return; }
    if (t >= tWinStart) { plateWindow(ctx, t); return; }
    const c = camOf(t), hour = hourAt(t), L = K.hourLook(hour), night = skyNight(t);
    const inC03 = t < t04, inHall = t >= tWalkH[0] && t < tBarely + 3.2, inSky = t >= tBarely + 1.15 && t < tMorning + .6, inC05 = t >= tMean;
    let hands5 = null, vls = inC03 ? vlState(t) : null;
    // ---- the kitchen's contents for this moment
    const people = [];
    if (inC03) {
      people.push([LZ - 2, (cx) => kidItem(cx, t)]);
      if (t < tWalkH[0]) people.push([YOU3[1], (cx) => youItem03(cx, t)]);
      people.push([LZ - 30, (cx) => ringItem(cx, t)]);
      people.push([LZ + 20, () => bookItem(ctx, c, t)]);
    }
    if (inC05) {
      people.push([LZ - 1, () => coinsItem(ctx, c, t)]);
    }
    const kitchen = {
      lamp: inC03 ? .4 * (1 - L.day) * (1 - span(t, tKept, tKept + 1)) : 0, wall: inC03 ? (.12 + .2 * span(t, tPhys, tPhys + 1) * (1 - span(t, tStomp, tStomp + 1))) * (1 - smooth(span(t, tKept, tKept + 1.5))) : inC05 ? .1 * smooth(span(t, tMean, tMean + 1.5)) + .15 * span(t, tPlans, tPlans + 1) : 0,
      scan: null, kettle: { steam: 0 }, people,
      wallFn: inC03 ? (cx, LW) => wall03(cx, LW, t) : null,
    };
    const oo = {
      winFn: (w) => (w.Z === ZS && w.X > 1000 && w.X < 3400 && w.Y > -700 ? { lit: 0, gold: 0, cool: 0 } : null),   // the market's ground floors stay unlit (no lit window next to the plan bars)
      hour, sun: night || (t > tKept - .3 && t < tMorning + .5) ? false : undefined, moon: night ? false : undefined,
      tower: { open: towerOpen(t) },
      you: { hallLamp: (lerp(.9, .45, smooth(span(t, tKept, t04 + 1))) + .1 * smooth(span(t, tMean, tMorning))) * (1 - .8 * L.day), kitchen },
      frontGap: FRONT_GAP, sunArc: .62,
      over: (cx) => { shopWindow(cx, t, L); if (inC05 && t > tJob) dadFacade(cx, t, L); },
    };
    // the kit's world() with one more layer: the night-shift diagram (plane ZT) between the tower and the back rows
    { const ow = { ...oo, L };
      K.sky(ctx, c, t, ow); K.skyline(ctx, c, t, ow); K.tower(ctx, c, t, { ...oo.tower, L }); if (L.day > .05) skyDrones(ctx, c, t, L);
      if (t > tWritten - .5 && t < tMorning + 2) nightShift(ctx, c, t);
      K.backRow(ctx, c, t, K.STREET.rows[1], ow); K.testersHouse(ctx, c, t, {}); K.backRow(ctx, c, t, K.STREET.rows[0], ow);
      K.streetRow(ctx, c, t, ow);
      const sl = streetLife(ctx, c, t, L); if (sl) hands5 = sl;
      K.streetFront(ctx, c, t, ow); }
    if (t > tKept - .2 && t < tBarely + 3.5 && c.z < ZB - 40) windowPatch(ctx, c, t, { hour, L, sun: false, moon: night ? false : undefined, tower: { open: towerOpen(t) } });
    // ---- c03 overlays
    if (inC03) {
      stepSparks(ctx, c, t, vls);
      blueprint(ctx, c, t, vls);
      const p = wp(c, vls.X, vls.Y, vls.Z);
      // growing out of plateGenius: the dark of the plate lifts as the room's dawn light comes up around the voice-light
      const dk = 1 - smooth(span(t, tGenEnd, tGenEnd + 1.7));
      if (dk > 0) { ctx.save(); ctx.globalAlpha = dk; ctx.fillStyle = GENIUS_WALL; ctx.fillRect(0, 0, W, H); ctx.restore(); }   // the plate's own wall, lifting
      if (p) K.voiceLight(ctx, p[0], p[1], vls.r * p[2], t, { talk: vls.talk });
    }
    // ---- c04 overlays: the hallway (window, headlines, you), the sky explainer
    if (inHall) {
      if (c.z < ZB - 40) {
        headlines(ctx, c, t, 'in');
        const tab = youHallDraw(ctx, c, t);
        if (tab) headSparks(ctx, c, t, tab);
      } else { drizzle(ctx, c, t); headlines(ctx, c, t, 'out'); }
    }
    if (t > tMean && t < tMorning + 2) descent(ctx, c, t);
    // ---- c05 overlays: the agent, its gold thread to your wrist, the clinic line, the forms, the cards, the cool thread, the coins
    if (t > tMorning - .5) {
      const AP = agentPos(t), ag = wp(c, AP[0], AP[1], AP[2]), aA = agentA(t);
      let wrist = null;
      if (hands5 && hands5.R) { const w = wp(c, hands5.R[0], hands5.R[1], YOU5[1]); if (w) wrist = [w[0], w[1]]; }
      const agS = ag ? [ag[0], ag[1]] : null;
      clinicLine(ctx, c, t, agS);
      const pulse = forms(ctx, t, agS);
      planCards(ctx, c, t, agS);
      coolThread(ctx, c, t, agS, wrist);
      coolCoins(ctx, c, t, agS);
      if (ag && wrist && t > tChecks + .7) {   // the gold thread: it belongs to you
        const u = expoOut(span(t, tChecks + .7, tChecks + 1.4)), br = 1 + .8 * span(t, tAnyway, tAnyway + .6) * (1 - span(t, tAnyway + 2.5, tAnyway + 4)) + .9 * bump(t, tAnswer + .2, .9);
        K.thread(ctx, agS, wrist, t, { u, sag: Math.min(10 * ag[2], .25 * Math.hypot(wrist[0] - agS[0], wrist[1] - agS[1])), w: 1.3 * br * Math.max(1, ag[2] * .5), a: Math.min(1, .7 + .3 * br) });
        const knot = bump(t, tAnswer + .2, .9); if (knot > 0) halo(ctx, wrist[0], wrist[1], 30 * knot * Math.max(1, ag[2] * .4), .9 * knot);
        // 'isn't allowed': a straight gold rule under the thread
        const rl = expoOut(span(t, tAllowed + .1, tAllowed + .9)) * (1 - expoIn(span(t, tJob, tJob + .5)));
        if (rl > 0) { const dx = wrist[0] - agS[0], dy = wrist[1] - agS[1], L2 = Math.hypot(dx, dy) || 1, nx = -dy / L2, ny = dx / L2, off = 14, ext = .35;
          const a0 = [agS[0] - dx * ext + nx * off, agS[1] - dy * ext + ny * off], b0 = [agS[0] + dx * (1 + ext) + nx * off, agS[1] + dy * (1 + ext) + ny * off];
          strokePath(ctx, [a0, [lerp(a0[0], b0[0], rl), lerp(a0[1], b0[1], rl)]], 2, P.core1, .95);
          for (let i = 0; i <= 8; i++) { const v = i / 8; if (v > rl) break; const px = lerp(a0[0], b0[0], v), py = lerp(a0[1], b0[1], v); strokePath(ctx, [[px, py], [px - nx * 6, py - ny * 6]], 1.4, P.core1, .9); } }
      }
      if (ag && aA > 0) {
        const r = 12 * ag[2] * (1 + .25 * pulse);
        if (t < tMorning + .4) { const g = expoOut(span(t, tMorning - .4, tMorning + .4)); K.agentLight(ctx, ag[0], ag[1], r * g, t, { warm: .35 }); }
        else K.agentLight(ctx, ag[0], ag[1], r, t, { warm: lerp(.35, .8, span(t, tChecks + .8, tChecks + 1.6)), a: aA });
        if (pulse > 0) halo(ctx, ag[0], ag[1], r * 3, .5 * pulse);
      }
    }
  }
  MEMO = { T, draw, t03, t04, t05, t06 };
  return MEMO;
}
