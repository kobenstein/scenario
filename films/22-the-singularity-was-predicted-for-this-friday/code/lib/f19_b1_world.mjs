// Film 19 · B1 · c02–c05 as ONE plan sequence on THE SHEET (41.58 → 203.99). Owned by builder B1.
// The four chunk files (scenes/sc02.mjs … sc05.mjs) all return one entry whose draw is world(T): the same function with the same t on both
// sides of every inner chunk seam, so the seams c02|c03|c04|c05 are invisible by construction. The group seams sit on the lead's plates:
//   41.58  plateLines (lib/f19_seams.mjs) for [T0, T0 + .5), then this world grows out of it (same chart state, same you, push into the knee)
//   203.99 plateSlip for [T0 − .5, T0): the camera, the sheet light and every value converge onto SLIP_PLATE (the blank slip FRI ?).
// Sheet map (design px, see docs/shots.md c02–c05): the 1960 chart (c01) · question card (1120, 250) · WAR/FAMINE right of the trunk ·
// the family tree under the knee (1310–1730, 1318–1690) · THE LOOP L1 (480, 1500) r 280 with its little gold line ML (860–1140) ·
// the kids-per-woman row (1300–1720, y 1990) · the light line (c01) · the machine loop L2 (3250, −380) r 230, the SINGULARITY tag beside it ·
// the slip FRI ? (2610, −1150) · the desk diorama + stopwatch (2000–2820, 1130–1730) · the task bar (2050 → , 1880) · the cool stairs on
// the light line's field (from 1960, 960) · the gold stairs on the formula · the tracing paper (the ghost).
//
// Clip frames: the kit's renderer never loads the real clip frames (film.mjs has no film.prepare; kit.prepareClips is never called), so
// this module adds Film.prototype.prepare = (t) => prepareClips(this.T, t) if it is missing (render.mjs and tools/seam.mjs await it).
// KIT WISH: wire film.prepare in film.mjs, then this shim is a no-op.
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
import * as S from './f19_seams.mjs';
import * as P from './f19_b1_props.mjs';
import { prepareClips, clipFrame } from './kit.mjs';
import { Film } from '../engine.mjs';
const { W, H, rgba, mixHex, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, aim, camDrift, cardM } = E;
const { PAL, ZS, LIFT, KNEE, sheet, chart1960, onSheet, lifted, label, ink, lightLine, partial, bump, aiPts } = F;

if (!Film.prototype.prepare) Film.prototype.prepare = function (t) { return this.T ? prepareClips(this.T, t) : undefined; };

// ===================================================================================================================== anchors
function anchors(T) {
  const G = (p, after = -1, n = 0) => T.G(p, n, after), GE = (p, after = -1) => T.GE(p, 0, after);
  const a = {};
  a.c02 = G('So what bent the first line'); a.bentQ = G('bent the first line', a.c02); a.steer = G('help steer', a.c02);
  a.war = G('Not war', a.steer); a.warW = G('war', a.war + .1); a.famine = G('Not famine', a.war); a.famW = G('famine', a.famine + .1);
  a.tree1 = G('family tree', a.famine);
  a.drove = G('What drove', a.tree1); a.loop = G('loop', a.drove);
  a.people = G('More people means', a.loop); a.inventors = G('more inventors', a.people);
  a.progress = G('more progress', a.inventors); a.food = G('more food', a.progress); a.medicine = G('better medicine', a.food);
  a.morePeople = G('more people', a.medicine); a.every = G('every round', a.morePeople); a.faster = G('faster', a.every);
  const c1 = T.clip('C1'), c2 = T.clip('C2'), c3 = T.clip('C3');
  a.C1s = c1.start; a.C1e = c1.end; a.C2s = c2.start; a.C2e = c2.end; a.C3s = c3.start; a.C3e = c3.end;
  a.left = G('Left alone', a.C1e - 1); a.straight = G('straight up', a.left); a.sing = G('singularity', a.straight);
  a.today = G('Today', a.sing); a.same = G('same loop', a.today); a.ai2 = G('artificial intelligence', a.same); a.machines = G('machines that build', a.ai2);
  a.c03 = G('But the human loop broke'); a.broke = G('broke', a.c03); a.stopped = G('stopped meaning', a.broke);
  a.tree2 = G('family tree', a.stopped); a.survived = G('survived', a.tree2); a.somany = G('so many', a.survived);
  a.school = G('school', a.somany); a.plan = G('plan their families', a.school); a.world = G('Worldwide', a.plan); a.average = G('average woman', a.plan);
  a.five = G('five', a.average); a.two = G('two', a.five);
  a.bent3 = G('bent the first line', a.two); a.choices = G('more choices', a.bent3);
  a.mtree = G('Machines don', a.choices); a.tree3 = G('family tree', a.mtree); a.slow = G('slow down', a.tree3); a.friday = G('Friday of its own', a.slow);
  a.c04 = G('To find out'); a.indep = G('independent researchers', a.c04); a.stopwatch = G('stopwatch', a.indep);
  a.real = G('real tasks', a.stopwatch); a.prog = G('programming work', a.real); a.skilled = G('skilled person', a.prog);
  a.biggest = G('biggest task', a.skilled); a.alone = G('alone', a.biggest); a.half = G('half the time', a.alone);
  a.few = G('Every few months', a.C2e - 1); a.doubles = G('doubles', a.few); a.bynow = G('By now', a.doubles);
  a.expert = G('expert', a.bynow); a.wday = G('working day', a.bynow); a.coffee = G('Morning coffee', a.wday); a.quit = G('quitting time', a.coffee); a.some = G('then some', a.quit);
  a.c05 = G("That's fast"); a.steady = G('steady doubling', a.c05); a.straight5 = G('straight up', a.steady); a.climbing = G('keeps climbing', a.straight5);
  a.old = G('The old formula', a.climbing); a.fasterLast = G('faster than the last', a.old); a.stood = G('stood straight up', a.fasterLast); a.date = G('date', a.stood);
  a.newer = G('Newer measurements', a.date); a.sped = G('sped up once', a.newer); a.oldShape = G('old shape', a.sped); a.withDate = G('shape with a date', a.oldShape);
  a.forecasts = G('Some forecasts', a.withDate);
  a.c06 = G('A date sounds precise');
  return a;
}

// ===================================================================================================================== splines
// monotone cubic (Fritsch–Carlson) through keys [[t, v]]: continuous velocity, no overshoot, zero velocity at both ends
function mono(ts, vs) {
  const n = ts.length, d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((vs[i + 1] - vs[i]) / Math.max(1e-6, ts[i + 1] - ts[i]));
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) { m[i] = 0; continue; }
    const h0 = ts[i] - ts[i - 1], h1 = ts[i + 1] - ts[i], w1 = 2 * h1 + h0, w2 = h1 + 2 * h0;
    m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
  }
  return (t) => {
    if (t <= ts[0]) return vs[0]; if (t >= ts[n - 1]) return vs[n - 1];
    let i = 0; while (t > ts[i + 1]) i++;
    const h = ts[i + 1] - ts[i], s = (t - ts[i]) / h, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * vs[i] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * vs[i + 1] + (s3 - s2) * h * m[i + 1];
  };
}
// camera spline over aim() cameras: x, y and log(distance to the sheet) interpolate monotone-cubic
function camSpline(K) {
  const ts = K.map((k) => k[0]);
  const fx = mono(ts, K.map((k) => k[1].x)), fy = mono(ts, K.map((k) => k[1].y)), fz = mono(ts, K.map((k) => Math.log(ZS - k[1].z)));
  return (t) => E.cam3({ x: fx(t), y: fy(t), z: ZS - Math.exp(fz(t)) });
}
// calm camera (Jakob's calm meter): hold-and-glide. Each key is a place the camera ARRIVES at by its time and then breathes
// (a slow push); the glide to the next key takes as long as its on-screen travel needs at an even pace (vAvg px/s on 1920×1080,
// sine in-out → peak ≈ 1.57 × vAvg), departing as late as possible. A glide that does not fit makes the camera arrive earlier.
// cruise ease: velocity rises on a half-sine over the first 30 %, cruises, and falls the same way (peak = 1.43 × average;
// a plain sine in-out would be 1.57 ×), so a glide of the same length is shorter at the same top speed
const CR = .3, CRV = 1 / (1 - CR);
function cruise(u) {
  if (u <= 0) return 0; if (u >= 1) return 1;
  if (u < CR) return CRV * (u / 2 - CR / (2 * Math.PI) * Math.sin(Math.PI * u / CR));
  if (u > 1 - CR) return 1 - cruise(1 - u);
  return CRV * (u - CR / 2);
}
const PTS25 = []; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) PTS25.push([160 + i * 400, 90 + j * 225]);
function disp(A, B) { let s = 0; for (const [x, y] of PTS25) { const u = (x - A.e) / A.k, v = (y - A.f) / A.k; s += Math.hypot(B.e + u * B.k - x, B.f + v * B.k - y); } return s / PTS25.length; }
function schedCam(K, { vAvg = 275, minD = 1.1, P = .05, tau = 5, Q = .006 } = {}) {
  const n = K.length, st = (c) => ({ x: c.x, y: c.y, l: Math.log(ZS - c.z) });
  const toCam = (s) => E.cam3({ x: s.x, y: s.y, z: ZS - Math.exp(s.l) });
  const lerpS = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), l: lerp(a.l, b.l, u) });
  const travel = (a, b) => { let D = 0, prev = cardM(toCam(a), ZS); for (let j = 1; j <= 32; j++) { const m = cardM(toCam(lerpS(a, b, j / 32)), ZS); D += disp(prev, m); prev = m; } return D; };
  const S0 = K.map((k) => st(k[1])), arr = K.map((k) => k[0]), dep = new Array(n).fill(0), dur = new Array(n).fill(0);
  const pushOf = (i, dt) => (i === 0 || i === n - 1 || K[i][2]?.still ? 0 : P * (1 - Math.exp(-Math.max(0, dt) / tau)) + Q * Math.max(0, dt));   // a breathing push that never quite stops
  // backwards: arrive at each key by its time; leave the previous key late enough to glide at the even pace
  for (let pass = 0; pass < 2; pass++) for (let i = n - 2; i >= 0; i--) {
    const a = { ...S0[i], l: S0[i].l - pushOf(i, (arr[i + 1] - arr[i]) * .5) };   // estimate of the pushed hold state
    dur[i] = Math.max(minD, travel(a, S0[i + 1]) / (vAvg * (K[i + 1][2]?.v ?? 1)));   // {v}: a slower glide into this key
    dep[i] = arr[i + 1] - dur[i];
    if (i > 0) arr[i] = Math.min(K[i][0], dep[i]);
  }
  if (dep[0] < arr[0]) { dep[0] = arr[0]; dur[0] = arr[1] - arr[0]; }   // the first glide is squeezed if it must (reported by tools)
  const held = (i, t) => ({ ...S0[i], l: S0[i].l - pushOf(i, t - arr[i]) });
  // arc length on screen: the glide runs at an even on-screen speed (pan and zoom mixed), so the cruise peak is the real peak
  const ARC = [];
  for (let i = 0; i < n - 1; i++) {
    const A = held(i, dep[i]), B = S0[i + 1], cum = [0]; let prev = cardM(toCam(A), ZS);
    for (let j = 1; j <= 96; j++) { const m = cardM(toCam(lerpS(A, B, j / 96)), ZS); cum.push(cum[j - 1] + disp(prev, m)); prev = m; }
    const tot = cum[96] || 1; ARC.push(cum.map((x) => x / tot));
  }
  const uOf = (i, q) => { const c = ARC[i]; if (c[96] === 0 || !isFinite(c[96])) return q; let j = 0; while (j < 95 && c[j + 1] < q) j++; const d = c[j + 1] - c[j]; return (j + (d > 0 ? (q - c[j]) / d : 0)) / 96; };
  const f = (t) => {
    if (t <= arr[0]) return toCam(S0[0]); if (t >= arr[n - 1]) return toCam(S0[n - 1]);
    let i = 0; while (i < n - 1 && t >= arr[i + 1]) i++;
    if (t <= dep[i]) return toCam(held(i, t));
    return toCam(lerpS(held(i, dep[i]), S0[i + 1], uOf(i, cruise(span(t, dep[i], arr[i + 1])))));
  };
  f.plan = K.map((k, i) => ({ key: k[0], arr: arr[i], dep: dep[i], dur: dur[i] }));
  return f;
}
function multi(K, keys) {   // light keys: [[t, {k: number | [numbers]}]]
  const ts = K.map((k) => k[0]), out = {};
  for (const key of keys) {
    const v0 = K[0][1][key];
    out[key] = Array.isArray(v0) ? v0.map((_, j) => mono(ts, K.map((k) => k[1][key][j]))) : mono(ts, K.map((k) => k[1][key]));
  }
  return (t) => Object.fromEntries(keys.map((key) => [key, Array.isArray(out[key]) ? out[key].map((f) => f(t)) : out[key](t)]));
}
// a camera that frames design point (u, v) of a LIFTED layer (lift 0..1) at s× (lifted() draws at Z = ZS − lift·LIFT, scaled by ZS/Z)
function aimL(lift, u, v, s, sx, sy) { const Z = ZS - lift * LIFT, g = ZS / Z; return aim(Z, W / 2 + (u - W / 2) * g, H / 2 + (v - H / 2) * g, s / g, sx, sy); }

// ===================================================================================================================== geometry
const L1 = { x: 480, y: 1500, r: 280 }, L2 = { x: 3250, y: -380, r: 230 };
const CARD = { x: 1120, y: 250, w: 440 }, CARD2 = { x: 2230, y: 330 }, WATCH = { x: 2410, y: 1150, r: 92 };
const C1F = { w: 1100, h: 619 }, C1C = { x: 930, y: 1290 };   // the C1 window grows out of the loop's centre to the middle of the view
const TAGP = { x: 2850, y: -650, s: 1.2 };
const WINX = [1080, 1520, 1960], WINY = 1442, WINS = 1.35, WLIFT = 2.4;   // the windows lift far off the sheet (big, near the camera)
const KIDS = [0, 1, 2, 3, 4].map((i) => [1305 + i * 104, 1990]);
const U = P.BAR.hour, HG = { x: P.BAR.x + 8 * U, y: 1660, h: 280 }, VLIFT = .6;
const SP = S.SLIP_PLATE;
const C3F = { w: 300, h: 169 };
const PENCIL_X = 2800;

// ===================================================================================================================== beads (integrated speed)
// pos(t) = ∫ v dt from t0, tabulated at 120 Hz (so a speed change never makes a bead jump or run backwards)
function integ(v, t0, t1) {
  const dt = 1 / 120, n = Math.ceil((t1 - t0) / dt), pos = new Float64Array(n + 1);
  for (let i = 1; i <= n; i++) pos[i] = pos[i - 1] + v(t0 + (i - .5) * dt) * dt;
  return (t) => { const x = (t - t0) / dt; if (x <= 0) return 0; const i = Math.min(n - 1, Math.floor(x)), f = Math.min(1, x - i); return lerp(pos[i], pos[i + 1], f); };
}
function beadTrack(a) {
  const v = (t) => {   // laps per second
    if (t < a.morePeople + .5) return 0;
    if (t < a.C1s) return lerp(.5, 1.7, smooth(span(t, a.morePeople + .5, a.C1s)));
    if (t < a.left) return lerp(1.7, .45, smooth(span(t, a.C1s, a.C1s + 2.5)));
    if (t < a.today) return lerp(.45, 4.2, smooth(span(t, a.left, a.straight + .2))) * (1 - .55 * smooth(span(t, a.sing + .3, a.today)));
    return lerp(1.9, .5, smooth(span(t, a.today, a.today + 2.5)));
  };
  const at = integ(v, a.morePeople + .5, a.broke + 3);
  // on "broke" the bead rolls on to the tear (the middle of PROGRESS → PEOPLE, angle 7π/6) and stops there
  const gapF = (7 * Math.PI / 6 + Math.PI / 2) / (Math.PI * 2), tb = a.broke - .2, D = 1.4;
  const pb = at(tb); let tgt = Math.floor(pb) + gapF; if (tgt < pb + .25) tgt += 1;
  return {
    pos: (t) => (t < tb ? at(t) : lerp(pb, tgt, 1 - Math.pow(1 - span(t, tb, tb + D), 3))),
    v: (t) => (t < tb ? v(t) : 3 * (tgt - pb) / D * Math.pow(1 - span(t, tb, tb + D), 2)),
  };
}
// ML steepness: one notch per finished lap while "every round goes faster" (lap times found once)
function mlK(a, bead) {
  const laps = [];
  for (let n = 1; n <= 4; n++) { let lo = a.morePeople + .5, hi = a.C1s + .5; if (bead.pos(hi) < n) break; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (bead.pos(m) < n) lo = m; else hi = m; } laps.push(hi); }
  return (t) => laps.reduce((k, tn) => k + smooth(span(t, tn + .06, tn + .4)), 0) + (4 - laps.length) * smooth(span(t, a.C1s - .4, a.C1s));
}
// the machine loop's bead: calm, faster on "slow down" (nothing slows it), calm again
function bead2(a) {
  const v = (t) => .55 + 1.1 * smooth(span(t, a.slow - .4, a.slow + .4)) * (1 - smooth(span(t, a.friday + .8, a.friday + 2.6))) - .35 * smooth(span(t, a.c05 - 2, a.c05));
  return integ(v, a.ai2, a.c06 + 1);
}

// ===================================================================================================================== the world
const CACHE = new WeakMap();
export function world(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  E.prepareEditorial();
  const a = anchors(T), bead = beadTrack(a), mk = mlK(a, bead), b2 = bead2(a);
  const T0 = a.c02, T1 = a.c06, HALF = S.SEAM_HALF;
  const LP = S.LINES_PLATE;
  // ---- the camera: one plan sequence on word keys (monotone cubic: no stop-and-go between keys)
  // calm plan (Jakob's calm meter): few wide framings that hold several beats each; the story plays INSIDE them (the lamp pool
  // and the onsets lead the eye); glides only where the narration changes place. Third element {still:true}: no breathing push.
  const K = [
    [T0 + HALF, LP.cam],
    [a.steer - .2, aim(ZS, 1460, 560, .78)],                          // 2.01 the knee, the card on its pin, the arrow toward the light; 2.02 the struck answers
    [a.tree1 + 1.2, aim(ZS, 930, 1300, .8)],                          //      down the trunk: the family tree and THE LOOP with its little line in one frame
                                                                      // 2.03 the loop draws; 2.04 the frame opens in its centre and grows to the middle of the view; 2.05 C1;
                                                                      // 2.06 it closes back into the loop: the bead's ring, the line straight up, the tag (no camera move)
    [a.ai2 - .2, aim(ZS, 1760, 430, .5), { v: .85 }],                             // 2.07 wide with the SINGULARITY tag (the carrier): both lines, both loops
    [a.c03 + .9, aim(ZS, 1420, 1370, .66)],                           // 3.01 back to the broken loop, the tree, the kids row (the seam c02 | c03 at the end of this glide);
                                                                      // 3.02 the windows lift off toward the camera; 3.03 ★ – 3.05 lit in turn; 3.06 the kids row
    [a.bent3 + 1.0, aim(ZS, 1400, 950, .66)],                         // 3.07 up with the two kids into the knee; the card
    [a.slow + .3, aim(ZS, 2450, -120, .55)],                          // 3.08 with the card to the light line; the machine loop; the slip FRI ? pins at the top
    [a.indep + 2.6, aim(ZS, 2440, 1380, .94)],                        // 4.01 down to the desk: the card flips into the stopwatch; 4.02, 4.03 the bar begins
    [a.C2s - .7, aimL(WLIFT_D(), 2640, 1437, 1.75), { still: true }],                       //      push into the cool screen; it grows into the clip frame; 4.04 C2
    [a.C2e - .1, aimL(WLIFT_D(), 2640, 1437, 1.75)],
    [a.few + 2.6, aim(ZS, 2920, 1640, .82)],                           // 4.05 pull back out, down to the bar as it doubles; 4.06 ★ the hourglass; the bar to 16 h
    [a.steady + .6, aim(ZS, 2150, 10, .5), { v: 1.25 }],                       //      up with them: 5.02 the old formula beside, its stairs narrow, the date; 5.03 the ghost
    [a.oldShape + .3, aim(ZS, 2400, -560, .8), { v: 1.25 }],
    [a.C3s - .7, SP.cam, { still: true, v: 1.25 }],                                 //      push into the blank slip (the plateSlip camera): its window grows into the clip frame; 5.04 C3
    [a.C3e - .1, SP.cam, { still: true }],
    [T1 - HALF, SP.cam],                                              //      onto plateSlip
  ];
  function WLIFT_D() { return .75; }
  const cam = process.env.B1CAM === "spline" ? camSpline(K) : schedCam(K);
  // ---- the sheet light: the lamp pool follows the action; the cool spill sits on the light line when it is the hero
  const LS = LP.sheet;
  const LK = [
    [T0 + HALF, { lamp: LS.lamp, R: LS.lampR, dim: LS.dim, cool: LS.cool }],
    [a.steer, { lamp: [1300, 520], R: 1900, dim: .2, cool: [2450, -250, 1700, .6] }],
    [a.tree1 + 1, { lamp: [1520, 1250], R: 1500, dim: .08, cool: [2450, -250, 1700, .35] }],
    [a.loop + .3, { lamp: [640, 1460], R: 1400, dim: .04, cool: [2450, -250, 1700, .25] }],
    [a.C1e, { lamp: [600, 1460], R: 1400, dim: .06, cool: [2450, -250, 1700, .25] }],
    [a.ai2, { lamp: [2500, 100], R: 1700, dim: .3, cool: [2800, -300, 1500, .9] }],
    [a.machines + .5, { lamp: [2800, -200], R: 1700, dim: .32, cool: [2950, -350, 1500, .95] }],
    [a.c03 + .5, { lamp: [1700, 700], R: 2600, dim: .22, cool: [2700, -300, 1600, .6] }],
    [a.stopped, { lamp: [720, 1450], R: 1500, dim: .06, cool: [2700, -300, 1600, .3] }],
    [a.tree2 + .5, { lamp: [1520, 1400], R: 1300, dim: .12, cool: [2700, -300, 1600, .2] }],
    [a.average, { lamp: [1480, 1850], R: 1400, dim: .05, cool: [2700, -300, 1600, .2] }],
    [a.bent3 + 1, { lamp: [1350, 600], R: 1600, dim: .1, cool: [2700, -300, 1600, .35] }],
    [a.tree3 + .3, { lamp: [2400, 200], R: 1700, dim: .26, cool: [2800, -300, 1500, .8] }],
    [a.friday + .5, { lamp: [2750, -650], R: 1600, dim: .3, cool: [2800, -500, 1400, .85] }],
    [a.indep + 1, { lamp: [2350, 1350], R: 1300, dim: .06, cool: [2640, 1400, 700, .25] }],
    [a.biggest + .6, { lamp: [2350, 1350], R: 1300, dim: .1, cool: [2640, 1420, 800, .55] }],
    [a.C2e, { lamp: [2400, 1450], R: 1300, dim: .1, cool: [2640, 1420, 800, .5] }],
    [a.bynow, { lamp: [2550, 1820], R: 1300, dim: .06, cool: [2600, 1880, 1000, .45] }],
    [a.wday + .3, { lamp: [HG.x, 1700], R: 1200, dim: .05, cool: [3000, 1880, 1000, .3] }],
    [a.some + .5, { lamp: [3300, 1800], R: 1600, dim: .06, cool: [3500, 1880, 1300, .45] }],
    [a.steady + .5, { lamp: [2200, 900], R: 1900, dim: .18, cool: [2400, 200, 1400, .55] }],
    [a.fasterLast, { lamp: [1600, 200], R: 2200, dim: .18, cool: [2450, -250, 1500, .55] }],
    [a.sped, { lamp: [2100, 0], R: 2200, dim: .2, cool: [2500, -300, 1500, .65] }],
    [a.forecasts + .5, { lamp: [2450, -700], R: 1800, dim: .14, cool: [2600, -650, 1100, .6] }],
    [T1 - HALF, { lamp: [2500, -900], R: 1600, dim: .1, cool: [2620, -700, 900, .55] }],
  ];
  const light = multi(LK, ['lamp', 'R', 'dim', 'cool']);
  // ---- small helpers
  let t = 0;
  const sp = (x0, x1) => span(t, x0, x1);
  const keepA = (t0, d = 2) => 1 - span(t, t0, t0 + d);   // a clean-up while the camera is far away (never in view, see the notes)

  const draw = (ctx, tt) => {
    t = tt;
    if (t < T0 + HALF) return S.plateLines(ctx, t);
    if (t >= T1 - HALF) return S.plateSlip(ctx, t);
    const dAmt = lerp(lerp(S.PLATE_DRIFT, 1, smooth(span(t, T0 + HALF, T0 + HALF + 1.6))), S.PLATE_DRIFT, smooth(span(t, T1 - HALF - 1.6, T1 - HALF)));
    const c = camDrift(cam(t), t, dAmt);
    const M = cardM(c, ZS), V = M ? [(-60 - M.e) / M.k, (-60 - M.f) / M.k, (W + 60 - M.e) / M.k, (H + 60 - M.f) / M.k] : [0, 0, 0, 0];
    const inV = (x0, y0, x1, y1) => x1 >= V[0] && x0 <= V[2] && y1 >= V[1] && y0 <= V[3];
    const L = light(t);
    sheet(ctx, c, t, { lamp: L.lamp, lampR: L.R, dim: L.dim, cool: L.cool });

    // ---- the 1960 page (the lead's chart, plate state); the light line drawn here (so it can leave the plateSlip view under the clip)
    const st = { ...LP.st, ai: 0, slip: { ...LP.st.slip, ring: span(t, a.date - .05, a.date + .75), swing: .012 * Math.sin(t * 1.1) + .045 * bump(t, a.date - .1, .6) * Math.sin(t * 30) } };
    chart1960(ctx, c, t, st);
    const aiA = 1 - span(t, a.C3s + 1.5, a.C3e - 1.5);

    onSheet(ctx, c, () => {
      if (aiA > 0) lightLine(ctx, aiPts, 1, { w: 7, spill: 0, a: aiA });

      // ---- 2.01 the pencil arrow from the card toward the light line and the seed of the steering wheel
      const arA = keepA(a.indep + 1.2);
      if (arA > 0 && t < a.indep + 3.3 && inV(1300, 300, 2850, 900)) {
        const arr = [], A0 = [CARD.x + CARD.w / 2 + 20, 400], A1 = [2080, 560];
        for (let i = 0; i <= 30; i++) { const s = i / 30; arr.push([lerp(A0[0], A1[0], s), lerp(A0[1], A1[1], s) - Math.sin(Math.PI * s) * 150]); }
        const u = sp(a.steer - .15, a.steer + .85);
        ctx.save(); ctx.globalAlpha *= arA; ctx.strokeStyle = P.graphite(.6); ctx.lineWidth = 3; ctx.lineCap = 'round'; P.stroke(ctx, partial(arr, u));
        if (u >= 1) { const [p, q] = [arr[28], arr[30]], ang = Math.atan2(q[1] - p[1], q[0] - p[0]); ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(-22, -12); ctx.lineTo(0, 0); ctx.lineTo(-22, 12); ctx.stroke(); ctx.restore(); }
        P.pencilWheel(ctx, 2200, 560, 92, sp(a.steer + .5, a.steer + 1.8), { a: .55 });
        ctx.restore();
      }
      // ---- 2.02 WAR · FAMINE, struck (clean-up later while the camera is at the top of the light line)
      const wfA = keepA(a.friday - 1);
      if (wfA > 0 && t < a.friday + 1.2 && inV(1560, 660, 2000, 860)) {
        ctx.save(); ctx.globalAlpha *= wfA;
        const ww = label(ctx, 'WAR', 1600, 742, 66, sp(a.war - .1, a.war + .5), { col: PAL.ink0, spacing: .1 });
        F.strike(ctx, 1600, 742 - 24, ww, sp(a.warW + .05, a.warW + .4), { w: 7 });
        const fw = label(ctx, 'FAMINE', 1600, 836, 66, sp(a.famine - .1, a.famine + .5), { col: PAL.ink0, spacing: .1 });
        F.strike(ctx, 1600, 836 - 24, fw, sp(a.famW + .05, a.famW + .45), { w: 7 });
        ctx.restore();
      }
      // ---- 2.02 / 3.02 the family tree under the knee (the ink runs down from the knee)
      const trA = keepA(a.friday - 1);
      if (trA > 0 && t < a.friday + 1.2 && inV(1280, 600, 1760, 1720)) P.tree(ctx, t, sp(a.tree1 - .55, a.tree1 + 2.3), { a: trA });

      // ---- 2.03 THE LOOP + its little line
      if (inV(L1.x - L1.r - 120, L1.y - L1.r - 120, P.ML.x0 + P.ML.w + 300, L1.y + L1.r + 120)) {
        const ic = [sp(a.people - .15, a.people + .5), sp(a.inventors - .05, a.inventors + .6), sp(a.progress - .05, a.progress + .6)];
        const arrows = sp(a.inventors - .25, a.inventors + .65) + sp(a.progress - .25, a.progress + .65) + sp(a.morePeople - .35, a.morePeople + .55);
        const bv = bead.v(t), ring = smooth(span(bv, 2.2, 3.8));
        // the little line: draws in beside the loop, one notch steeper per lap, straight up, then (c03) it bends over
        const mlU = sp(a.loop + .1, a.people + .4);
        if (mlU > 0) {
          ctx.save(); ctx.strokeStyle = P.graphite(.55 * smooth(mlU * 3)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(P.ML.x0 - 20, P.ML.y0 + 12); ctx.lineTo(P.ML.x0 - 20 + 290 * smooth(clamp(mlU * 2)), P.ML.y0 + 12); ctx.moveTo(P.ML.x0 - 20, P.ML.y0 + 12); ctx.lineTo(P.ML.x0 - 20, P.ML.y0 + 12 - 620 * smooth(clamp(mlU * 2))); ctx.stroke(); ctx.restore();
          const pts = P.mlPts({ k: mk(t), vert: sp(a.straight - .35, a.straight + .65), bend: sp(a.stopped + .05, a.stopped + 1.4) });
          ink(ctx, pts, mlU, { w: 6.5, head: mlU < 1 || (t > a.straight - .35 && t < a.straight + .65) });
          // the bend glows where the kids of c03 … no: the knee of the little line catches the light when it bends
        }
        // the C1 window in the loop's centre (a 16:9 window cut into the paper, cream mat)
        const win = sineIO(sp(a.C1s - .65, a.C1s + .3)) * (1 - sineIO(sp(a.C1e + .02, a.C1e + 1.45)));   // frames exist from start − .7 to end + .7
        P.loop(ctx, t, L1.x, L1.y, L1.r, { u: sp(a.loop - .55, a.loop + .7), icons: ic, arrows, lab: 40, bead: t > a.morePeople + .5 ? bead.pos(t) : null, beadV: bv,
          ring, broken: sp(a.broke - .05, a.broke + .45), dim0: sp(a.stopped, a.stopped + .9), progLit: sp(a.food - .05, a.food + .5) * (1 - sp(a.broke, a.broke + 1)) });
        if (win > 0) clipWin(ctx, t, T, 'C1', lerp(L1.x, C1C.x, win), lerp(L1.y, C1C.y, win), C1F.w * win, C1F.h * win, { mat: 22 * win });
        // the SINGULARITY tag at the top of the vertical (before it travels)
        const tagIn = sp(a.sing - .25, a.sing + .45);
        if (tagIn > 0 && t < a.same + .2) { const top = P.mlPts({ k: 4, vert: 1 }).at(-1); P.tag(ctx, t, top[0], top[1] - 6 - (1 - expoOut(tagIn)) * 60, TAGP.s, { u: span(tagIn, .3, 1), a: 1 }); }
      }
      // ---- 2.07 the tag slides along its thread to the machine loop; the machine loop (cool clone)
      const tg = sineIO(sp(a.same - .05, a.ai2 - .1));
      if (t >= a.same - .05 && t < T1) {
        const top = P.mlPts({ k: 4, vert: 1 }).at(-1), A0 = [top[0], top[1] - 6], A1 = [TAGP.x, TAGP.y];
        const pt = (s) => [lerp(A0[0], A1[0], s), lerp(A0[1], A1[1], s) - Math.sin(Math.PI * s) * 110];
        if (tg < 1) { const seg = []; for (let i = 0; i <= 24; i++) seg.push(pt(lerp(Math.max(0, tg - .22), Math.min(1, tg + .08), i / 24))); ctx.save(); ctx.strokeStyle = P.graphite(.5); ctx.lineWidth = 2.2; P.stroke(ctx, seg); ctx.restore(); }
        const [tx, ty] = pt(tg), tA = 1 - span(t, a.C3s + 2, a.C3e - 2);
        if (inV(tx - 300, ty - 100, tx + 300, ty + 200)) P.tag(ctx, t, tx, ty, TAGP.s, { swing: -.12 * Math.sin(Math.PI * tg), a: tA });
      }
      if (t >= a.same - .2 && inV(L2.x - L2.r - 150, L2.y - L2.r - 120, L2.x + L2.r + 600, L2.y + L2.r + 150)) {
        const grow = clamp((t - a.machines + .2) * .45, 0, 1.5);
        P.loop(ctx, t, L2.x, L2.y, L2.r, { cool: true, u: sp(a.same - .1, a.same + 1.1), icons: [sp(a.same + .4, a.same + .9), sp(a.same + .6, a.same + 1.1), sp(a.same + .8, a.same + 1.3)],
          arrows: 3 * sp(a.same + .3, a.same + 1.8), lab: 40, bead: t >= a.ai2 ? b2(t) : null, beadV: t >= a.ai2 ? .55 + 1.1 * sp(a.slow - .4, a.slow + .4) * (1 - span(t, a.friday + .8, a.friday + 2.6)) : 0,
          ring: .35 * sp(a.slow - .1, a.slow + .6) * (1 - span(t, a.friday + 1, a.friday + 3)), grow: [grow, Math.max(0, grow - .33), Math.max(0, grow - .66)] });
        // 3.08 the pencil starts a family tree for the machines, and lifts off again: nothing to draw
        const pu = sp(a.tree3 + .1, a.tree3 + 1.2), pl = sp(a.tree3 + 1.3, a.slow + .2), pA = keepA(a.c04 + 1);
        if (pu > 0 && pA > 0) {
          ctx.save(); ctx.globalAlpha *= pA;
          const nx = 3460, ny = 200, r = 18;
          ctx.strokeStyle = P.graphite(.8); ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(nx, ny, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(pu * 2)); ctx.stroke();
          const lu = span(pu, .5, 1); if (lu > 0) P.stroke(ctx, [[nx, ny + r], [nx + 3, ny + r + 70 * lu]]);
          const tip = pu < .5 ? [nx + Math.cos(-Math.PI / 2 + Math.PI * 4 * pu) * r, ny + Math.sin(-Math.PI / 2 + Math.PI * 4 * pu) * r] : [nx + 3, ny + r + 70 * lu];
          if (pl < 1) P.pencil(ctx, tip[0] + pl * 260, tip[1] - pl * 380, expoOut(pl), { a: 1 - smooth(span(pl, .55, 1)) });
          ctx.restore();
        }
      }
      // ---- 3.06 the kids-per-woman row; 3.07 two of them rise into the knee
      if (t > a.plan && t < a.friday + 1.2) {
        const rowA = keepA(a.friday - 1);
        if (inV(1000, 1780, 1900, 2160)) {
          ctx.save(); ctx.globalAlpha *= rowA;
          label(ctx, 'KIDS PER WOMAN · WORLD', KIDS[0][0] - 50, 1868, 40, sp(a.average - .3, a.average + .5), { col: PAL.ink1 });
          label(ctx, 'UN WPP 2024 · OUR WORLD IN DATA', KIDS[0][0] - 50, 2080, 24, sp(a.five, a.five + .8), { col: PAL.ink2 });
          // the counter ≈ 5 → ≈ 2 (the digit rolls)
          const cu = sp(a.five - .15, a.five + .4), roll = expoOut(sp(a.two - .05, a.two + .45));
          if (cu > 0) {
            label(ctx, '≈', 1056, 1996, 96, cu, { col: PAL.ink0, align: 'right', weight: 300, spacing: 0 });
            ctx.save(); ctx.beginPath(); ctx.rect(1070, 1880, 110, 150); ctx.clip();
            label(ctx, '5', 1080, 2010 - roll * 150, 150, cu, { serif: true, col: PAL.ink0 });
            if (roll > 0) label(ctx, '2', 1080, 2010 + (1 - roll) * 150, 150, 1, { serif: true, col: PAL.gold2 });
            ctx.restore();
          }
          ctx.restore();
        }
        KIDS.forEach(([x, y], i) => {
          const up = sp(a.average - .6 + i * .09, a.average + .1 + i * .09); if (up <= 0) return;
          const dot = i >= 2 ? sp(a.two - .1 + (i - 2) * .08, a.two + .4 + (i - 2) * .08) : 0;
          if (i < 2) {   // the two solid ones fly up into the knee (they are the bend)
            const f = sp(a.bent3 - .15 + i * .14, a.bent3 + 1.2 + i * .14); if (f >= 1) return;
            const e = sineIO(f), px = lerp(x, KNEE.x - 18 + i * 22, e) + Math.sin(Math.PI * e) * (i ? 90 : -90), py = lerp(y, KNEE.y + 6, e);
            if (inV(px - 80, py - 120, px + 80, py + 20)) P.kid(ctx, px, py, 92 * (1 - .75 * smooth(span(f, .6, 1))), { up });
          } else if (rowA > 0 && inV(x - 60, y - 110, x + 60, y + 10)) P.kid(ctx, x, y, 92, { up, dot, a: rowA });
        });
        // the knee catches the light when they arrive
        const kp = bump(t, a.bent3 + 1.0, 1.2);
        if (kp > 0) E.halo(ctx, KNEE.x, KNEE.y + 4, 90, .55 * kp, PAL.gold1, PAL.gold0);
      }
      // ---- c04 the task bar on the sheet (it doubles in jumps), its labels; c05 its jumps fly up into stairs
      if (t > a.biggest && t < a.climbing + 2) {
        const L0 = U * expoOut(sp(a.biggest + .35, a.alone + .4));
        const jumps = [a.doubles, a.doubles + .8, a.doubles + 1.6];
        let Lb = L0; jumps.forEach((tj, k) => { Lb += U * 2 ** k * expoOut(span(t, tj, tj + .2)); });
        Lb += 8 * U * sineIO(sp(a.some - .1, a.some + .6));
        const segs = [[0, 1], [1, 2], [2, 4], [4, 8], [8, 16]].map(([p0, p1]) => [p0 * U, p1 * U]);
        const flyT = (k) => a.c05 + .25 + k * .26;
        const lu = 1 - sp(a.c05 + .9, a.c05 + 1.6);   // the labels sink out as the stairs start
        if (inV(P.BAR.x - 100, P.BAR.y - 120, P.BAR.x + 3700, P.BAR.y + 200)) {
          segs.forEach(([s0, s1], k) => { if (t >= flyT(k)) return; const e = Math.min(Lb, s1); if (e > s0) lightLine(ctx, [[P.BAR.x + s0, P.BAR.y], [P.BAR.x + e, P.BAR.y]], 1, { w: 12, spill: 0 }); });
          if (lu > 0) {
            ctx.fillStyle = rgba(PAL.cool0, lu); ctx.fillRect(P.BAR.x - 3, P.BAR.y - 16, 6, 32);
            label(ctx, 'LONGEST TASK DONE ALONE', P.BAR.x, P.BAR.y - 48, 44, Math.min(sp(a.biggest + .6, a.biggest + 1.4), lu), { col: PAL.ink1 });
            [2 * U, 4 * U, 8 * U].forEach((x, k) => { const u = Math.min(sp(jumps[k] + .05, jumps[k] + .5), lu); if (u > 0) { ctx.fillStyle = rgba(PAL.cool1, .9 * u); ctx.fillRect(P.BAR.x + x - 2, P.BAR.y + 16, 4, 20); label(ctx, '×2', P.BAR.x + x, P.BAR.y + 84, 46, u, { align: 'center', col: PAL.cool1, spacing: .02 }); } });
            label(ctx, 'SOURCE: METR · AS OF MAY 2026', P.BAR.x, P.BAR.y + 150, 26, Math.min(sp(a.doubles + .3, a.doubles + 1.1), lu), { col: PAL.ink2 });
            // ≥ 16 h with its error bar (95 %: 8.5 h … 55 h, off to the right)
            const hu = Math.min(sp(a.some + .2, a.some + .6), lu);
            if (hu > 0) {
              ctx.save(); ctx.globalAlpha *= hu; const ey = P.BAR.y - 34, x0 = P.BAR.x + 8.5 * U;
              ctx.strokeStyle = rgba(PAL.cool1, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, ey - 12); ctx.lineTo(x0, ey + 12); ctx.stroke();
              const g = ctx.createLinearGradient(x0, 0, x0 + 1500, 0); g.addColorStop(0, rgba(PAL.cool1, .7)); g.addColorStop(1, rgba(PAL.cool1, 0)); ctx.strokeStyle = g;
              ctx.beginPath(); ctx.moveTo(x0, ey); ctx.lineTo(x0 + 1500, ey); ctx.stroke(); ctx.restore();
              const gw = label(ctx, '≥', P.BAR.x + 16 * U - 60, P.BAR.y - 74, 52, hu, { col: PAL.cool0, align: 'right', weight: 300, spacing: 0 }); void gw;
              label(ctx, '16 h', P.BAR.x + 16 * U - 44, P.BAR.y - 70, 76, hu, { serif: true, col: PAL.cool0 });
            }
          }
        }
        // the jumps fly up and stand as the risers of the stairs (each riser = one jump: 100, 100, 200, 400, 800)
        segs.forEach(([s0, s1], k) => {
          const f = sp(flyT(k), flyT(k) + 1.0); if (f <= 0 || f >= 1) return;
          const e = sineIO(f), len = s1 - s0, rx = P.SC.x + P.SC.tw * (k + 1), cum = [0, 1, 2, 4, 8][k] * U;
          const cx = lerp(P.BAR.x + (s0 + s1) / 2, rx, e) + Math.sin(Math.PI * e) * 160, cy = lerp(P.BAR.y, P.SC.y - cum - len / 2, e), ang = lerp(0, -Math.PI / 2, smooth(span(e, .1, .8)));
          lightLine(ctx, [[cx - Math.cos(ang) * len / 2, cy - Math.sin(ang) * len / 2], [cx + Math.cos(ang) * len / 2, cy + Math.sin(ang) * len / 2]], 1, { w: 8, spill: .4 });
        });
      }
      // ---- c05 the cool stairs (risers landed, treads drawn by the light head), straight up in pencil, the narrow step; the gold stairs
      const sA = 1 - span(t, a.C3s + 1.5, a.C3e - 1.5);
      if (t > a.c05 + .5 && sA > 0) {
        ctx.save(); ctx.globalAlpha *= sA;
        const narrow = lerp(1, .42, expoOut(sp(a.sped - .05, a.sped + .7)));
        const pts = P.stairPts(narrow), landed = (k) => t >= a.c05 + .25 + k * .26 + 1.0;
        // risers that have landed (until the head redraws them)
        const head = sp(a.c05 + 1.55, a.straight5 - .2), nSteps = 5 + sp(a.climbing - .1, a.climbing + .9);
        const totalU = (k) => (2 * k) / (pts.length - 1);
        const u = head * totalU(5) + (nSteps - 5) * (totalU(6) - totalU(5));
        for (let k = 0; k < 5; k++) if (landed(k) && u < totalU(k + 1)) { const x = pts[2 * k + 1][0]; lightLine(ctx, [[x, pts[2 * k + 1][1]], [x, pts[2 * k + 2][1]]], 1, { w: 6, spill: 0 }); }
        if (u > 0) lightLine(ctx, pts, u, { w: 6, spill: u < totalU(6) ? .8 : 0 });
        // straight up: a ruler-straight pencil line beside them
        const pv = sp(a.straight5 - .15, a.straight5 + .55);
        if (pv > 0) { ctx.strokeStyle = P.graphite(.75); ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(PENCIL_X, 980); ctx.lineTo(PENCIL_X, lerp(980, -1700, expoOut(pv))); ctx.stroke(); }
        ctx.restore();
      }
      if (t > a.old && sA > 0) {
        const gu = sp(a.old + .5, a.stood + .25), e = 1 - Math.pow(1 - gu, 1.7);
        if (gu > 0) ink(ctx, P.goldStairPts, e, { w: 5.5, head: gu < 1, a: sA });
      }
      // ---- 3.08 the slip FRI ? pins at the top of the light line (it stays: plateSlip)
      if (t >= a.friday - .4) {
        const d = sp(a.friday - .4, a.friday + .5), dy = (1 - expoOut(d)) * -420;
        if (inV(SP.x - 160, SP.y - 500, SP.x + 160, SP.y + 260)) {
          const ex = .07 * (1 - d) * Math.sin(t * 7) * (d > 0 ? 1 : 0) + .03 * bump(t, a.withDate - .1, .7) * Math.sin(t * 24);
          F.slip(ctx, t, SP.x, SP.y + dy, SP.w, { ...SP.face, swing: ex !== 0 ? .012 * Math.sin(t * 1.1) + ex : undefined });
        }
      }
    });

    // ---- you at the knee (the plate pose; you look down at your family tree, at the loop, up at the stairs)
    onSheet(ctx, c, () => {
      if (!inV(KNEE.x - 120, KNEE.y - 160, KNEE.x + 120, KNEE.y + 20)) return;
      const look = LP.you.o.look - .45 * (sp(a.tree1 - .3, a.tree1 + .8) - sp(a.drove, a.drove + 1)) - .45 * (sp(a.tree2 - 1.3, a.tree2) - sp(a.tree2 + 1.5, a.survived + 1))
        + .3 * (sp(a.bent3 + .8, a.bent3 + 1.6) - sp(a.choices + .6, a.choices + 1.6)) + .25 * (sp(a.climbing - .5, a.climbing + .8) - sp(a.sped, a.sped + 1));
      S.youAtKnee(ctx, t, { look: clamp(look, -.2, 1) });
    });

    // ---- lifted layers ----------------------------------------------------------------------------------------------------------
    // 3.02–3.05 the three windows grow from the tree's children and lift off; they lay down again into the kids-per-woman row
    if (t > a.tree2 - .3 && t < a.average + 1) {
      const lift = WLIFT * smooth(sp(a.tree2 - .1, a.tree2 + .9)) * (1 - smooth(sp(a.world - .2, a.world + .6)));
      lifted(ctx, c, lift, () => {
        const lit = [sp(a.survived - .6, a.survived) * (1 - sp(a.school - .6, a.school)), sp(a.school - .6, a.school) * (1 - sp(a.plan - .3, a.plan + .3)), sp(a.plan - .3, a.plan + .3)];
        const pr = [sp(a.survived - .1, a.survived + 1.0), sp(a.school - .9, a.school + 1.4), sp(a.plan + .2, a.plan + 1.1)];
        [0, 1, 2].forEach((i) => {
          const g = sp(a.tree2 - .05 + i * .1, a.tree2 + .85 + i * .1) * (1 - sp(a.world - .1 + i * .06, a.world + .7 + i * .06));
          if (g <= 0) return;
          const node = P.TREE.g1[[0, 2, 4][i]], e = expoOut(g);
          const wx = lerp(node[0], WINX[i], e), wy = lerp(node[1], WINY, e), ws = lerp(1, WINS, e);
          ctx.save(); ctx.translate(wx, wy); ctx.scale(ws, ws); ctx.translate(-wx, -wy); P.windowCard(ctx, t, i, wx, wy, g, .25 + .75 * lit[i], pr[i]); ctx.restore();
        });
      }, { shadow: 1 });
    }
    // c04 the card on its thread slides down the light line, flips over: its back is the stopwatch; the desk rises under it
    if (t > a.bent3 && t < a.few + 3) {
      const tr = sineIO(sp(a.choices + 1.15, a.tree3 + .15));          // 3.07 → 3.08 right on a thread to the light line
      const dn = sineIO(sp(a.c04 - .1, a.indep + .55));                 // 4.01 down the light line to its foot
      const px = lerp(lerp(CARD.x, CARD2.x, tr), WATCH.x, dn), py = lerp(lerp(CARD.y, CARD2.y, tr) - Math.sin(Math.PI * tr) * 120, WATCH.y - 150, dn);
      const fl = sp(a.indep + .1, a.indep + .75), wl = smooth(sp(a.indep + .6, a.stopwatch - .2)), deskL = smooth(sp(a.indep + .5, a.stopwatch + .9));
      const fold = sp(a.C2e + 1.0, a.C2e + 2.0);
      if (fl < .5) {   // the question card travelling (it dropped in on its pin in 2.01, drawn further below until 3.07)
        const thr = tr > 0 && tr < 1, flip = fl > 0 ? 1 - fl : sp(a.choices + .75, a.choices + 1.25);
        onSheet(ctx, c, () => {
          if (thr) P.thread(ctx, [CARD.x, CARD.y], [CARD2.x, CARD2.y], Math.min(1, tr + .25), { sag: -120, a: .45 });
          F.qcard(ctx, t, px, py, CARD.w, { lines: ['WHAT BENT', 'THE FIRST LINE?'], answer: 'MORE CHOICES', au: sp(a.choices - .1, a.choices + .7), flip, back: ['CAN WE STEER', 'THIS ONE?'], swing: -.05 * Math.sin(Math.PI * dn) });
        });
      }
      if (fl >= .5 && fold < 1) {
        // the desk diorama (lifted), the stopwatch hanging over it
        lifted(ctx, c, .75 * deskL, () => {
          P.desk(ctx, t, { work: t, warmLines: sp(a.real - .2, a.prog + .8) + 0, cool: sp(a.biggest - .2, a.biggest + .6), coolLines: sp(a.biggest + .3, a.alone + .9), trials: sp(a.half - .35, a.half + 1.0), a: deskL > 0 ? 1 : 0, fold });
          // C2 plays in the cool screen
          const [bx, by, bw, bh] = P.DESK.scr2, on = t > a.C2s - .66 && t < a.C2e + 1.02 && fold < .05;
          // … and grows out of it into a bigger frame (so the camera need not dive as deep)
          if (on) {
            const g = sineIO(sp(a.C2s - .65, a.C2s + .3)) * (1 - sineIO(sp(a.C2e + .02, a.C2e + 1.0))), k2 = 1 + 1.15 * g, cx2 = bx + bw / 2, cy2 = by + bh / 2;
            ctx.save(); ctx.globalAlpha *= sp(a.C2s - .66, a.C2s - .45) * (1 - sp(a.C2e + .72, a.C2e + 1.0)); if (g < .02) ctx.shadowColor = 'transparent'; clipWin(ctx, t, T, 'C2', cx2, cy2, bw * k2, bh * k2, { mat: 12 * g, dark: PAL.desk1 });
            const fl2 = bump(t, a.C2s - .2, .4); if (fl2 > 0) { ctx.fillStyle = rgba(PAL.cool0, .25 * fl2); ctx.fillRect(cx2 - bw * k2 / 2, cy2 - bh * k2 / 2, bw * k2, bh * k2); } ctx.restore();
          }
        }, { depth: LIFT });
        lifted(ctx, c, .75 * wl + .02, () => {
          if (fold > 0) { ctx.translate(0, WATCH.y + 400); ctx.scale(1, 1 - expoIn(fold) * .98); ctx.translate(0, -(WATCH.y + 400)); }
          ctx.save(); ctx.shadowColor = 'transparent'; ctx.strokeStyle = P.graphite(.6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(WATCH.x, WATCH.y - 900); ctx.lineTo(WATCH.x, WATCH.y - WATCH.r * 1.42); ctx.stroke(); ctx.restore();
          const s = (1 - .07 * bump(t, a.stopwatch - .04, .28)) * Math.max(.02, Math.abs(Math.cos((1 - fl) * Math.PI)));
          ctx.save(); ctx.translate(WATCH.x, WATCH.y); ctx.scale(s, 1 - .07 * bump(t, a.stopwatch - .04, .28)); ctx.translate(-WATCH.x, -WATCH.y);
          F.stopwatch(ctx, t, WATCH.x, WATCH.y, WATCH.r, { run: Math.max(0, t - a.stopwatch) * 4, wedge: .72 * smooth(sp(a.skilled - .05, a.skilled + 1.5)) });
          ctx.restore();
        }, { depth: LIFT });
      }
    }
    // 2.01 the question card drops in on its pin beside the knee (until it travels in 3.07)
    if (t <= a.bent3 && inV(CARD.x - 300, CARD.y - 600, CARD.x + 300, CARD.y + 320)) {
      onSheet(ctx, c, () => F.qcard(ctx, t, CARD.x, CARD.y, CARD.w, { lines: ['WHAT BENT', 'THE FIRST LINE?'], u: sp(a.bentQ + .3, a.bentQ + 1.0), drop: sp(a.bentQ - .28, a.bentQ + .75), dropH: 1850 }));   // from above the frame
    }
    // 4.06 ★ ONE WORKING DAY: the hourglass lifts off at the bar's end (8 h); the cup at dawn, the coat at dusk; then it lays down again
    if (t > a.expert - .4 && t < a.steady + 1.5) {
      const grow = expoOut(sp(a.expert - .25, a.expert + .65)), fold = sp(a.c05 - .05, a.c05 + .8);
      const lft = VLIFT * smooth(sp(a.expert - .25, a.expert + .8));
      lifted(ctx, c, lft, () => {
        if (fold > 0) { ctx.translate(0, P.BAR.y); ctx.scale(1, 1 - expoIn(fold) * .985); ctx.translate(0, -P.BAR.y); }
        const cu = expoOut(sp(a.coffee - .25, a.coffee + .45)), dusk = sp(a.quit - .2, a.quit + .6), coat = expoOut(sp(a.quit - .3, a.quit + .3));
        if (cu > 0) { P.windowSmall(ctx, t, HG.x - 215, 1600 + (1 - cu) * 200, 150 * cu, 176 * cu, dusk); P.cup(ctx, t, HG.x - 205, P.BAR.y - 8, cu, { steam: 1 - dusk }); }
        if (coat > 0) { ctx.save(); ctx.translate(HG.x + 210, 1580); ctx.scale(coat, coat); ctx.translate(-HG.x - 210, -1580); P.coatHook(ctx, t, HG.x + 190, 1580, 1, sp(a.quit + .2, a.quit + 1.0)); ctx.restore(); }
        if (grow > 0) {
          ctx.save(); ctx.translate(HG.x, P.BAR.y); ctx.scale(grow, grow); ctx.translate(-HG.x, -P.BAR.y);
          F.hourglass(ctx, t, HG.x, HG.y, HG.h, { sand: sp(a.wday - .2, a.quit + .4), label: false });
          ctx.restore();
          ctx.save(); ctx.shadowColor = 'transparent';
          label(ctx, 'ONE WORKING DAY', HG.x, HG.y - HG.h * .58 - 46, 46, sp(a.wday + .1, a.wday + .8), { align: 'center', col: PAL.ink0 });
          label(ctx, '> 8 HOURS', HG.x, HG.y - HG.h * .58 - 4, 28, sp(a.wday + .5, a.wday + 1.2), { align: 'center', col: PAL.gold2 });
          ctx.restore();
        }
      });
    }
    // 5.03 ★ the ghost: the 1960 curve on tracing paper lifts off and slides over the light line; it settles; it leaves under the clip
    if (t > a.oldShape - .5 && t < T1) {
      const m = sineIO(sp(a.oldShape - .15, a.withDate + .35)), lift = .42 * smooth(sp(a.oldShape - .45, a.oldShape + .2)) - .3 * smooth(sp(a.forecasts - .1, a.forecasts + .8));
      const gA = (1 - span(t, a.C3s + 1.5, a.C3e - 1.5)) * smooth(sp(a.oldShape - .45, a.oldShape + .1));
      if (gA > 0) lifted(ctx, c, Math.max(.02, lift), () => { ctx.shadowColor = rgba(PAL.desk0, .25); P.tracing(ctx, t, m, { a: gA }); });
    }
    // 5.03 → C3: a window opens in the slip's face and grows into the clip frame (over everything); it closes back into the ? after the clip
    const m3 = sineIO(sp(a.C3s - .68, a.C3s + .9)) * (1 - sineIO(sp(a.C3e - .7, a.C3e + .72)));   // closed before the plate takes over
    if (m3 > 0) onSheet(ctx, c, () => { const cy = lerp(SP.y + 11 + 224 * .62, -1000, m3); clipWin(ctx, t, T, 'C3', SP.x, cy, C3F.w * m3, C3F.h * m3, { mat: 18 * m3 }); });
    // lower thirds of the clips (screen space)
    for (const id of ['C1', 'C2', 'C3']) F.lowerThird(ctx, t, T, id);
  };
  draw.dbg = { cam, K, a }; CACHE.set(T, draw);
  return draw;
}

// ===================================================================================================================== clip window
// The clip in a frame cut into the paper (centre cx, cy; picture w × h; cream mat). The real frames via kit.clipFrame (loaded by
// prepareClips through the Film.prepare shim above); until a frame is loaded the window stays a dark warm gradient (no placeholder text).
const LASTFR = {};
function clipWin(ctx, t, T, id, cx, cy, w, h, o = {}) {
  if (w < 1 || h < 1) return;
  const sl = T.clip(id), x = cx - w / 2, y = cy - h / 2, mat = o.mat ?? w * .035;
  ctx.save();
  if (mat > 0) { ctx.shadowColor = rgba(PAL.desk0, .4); ctx.shadowBlur = 18; ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 8; ctx.fillStyle = PAL.card; ctx.fillRect(x - mat, y - mat, w + mat * 2, h + mat * 2); ctx.shadowColor = 'transparent'; }
  ctx.fillStyle = o.dark ?? '#0d0b10'; ctx.fillRect(x, y, w, h);
  const k = Math.floor(clamp(t - sl.start, 0, sl.end - sl.start) * 30) + 1, fr = clipFrame(id, k) || clipFrame(id, k - 1) || clipFrame(id, k + 1) || LASTFR[id];
  if (fr) LASTFR[id] = fr;   // after end + .7 s the kit drops the frames: the closing window keeps the last one
  if (fr) { const s = Math.max(w / fr.width, h / fr.height); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.drawImage(fr, cx - fr.width * s / 2, cy - fr.height * s / 2, fr.width * s, fr.height * s); }
  ctx.restore();
}
