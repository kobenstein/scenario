// c03 · "Why now" (01b from "So is this just a show?" to "we still get a say") · 125.12–192.20 · Editorial-Nacht (B1, 2026-10-24)
// Kit: lib/f10_editorial.mjs + lib/f10_c01_draw.mjs + lib/f10_c01_world.mjs (sky) + lib/f10_c03_world.mjs (valley map, house, signpost).
// ONE continuous take over the valley of c01: the valley card (Z 3600) below, an explainer canvas in the sky (Z 6000) above the
// ridges. The camera cranes between the map (scenes, factories, streams) and the sky (explainers). Explainers ≈ 84 % of the time.
//
// | ID    | time          | anchor                   | picture (one idea)                                                                  | camera                        | → carrier                         |
// |-------|---------------|--------------------------|-------------------------------------------------------------------------------------|-------------------------------|-----------------------------------|
// | 3.01  | 125.12–129.12 | show @126.56             | the gap of c02 is the gap between two curtains; out of the window: the valley at    | 'o' out of the window → C1    | the robot walks toward us         |
// |       |               | coming @128.28           | night, the robot at the fork in a spotlight (a show?); on "coming" it walks         |                               |                                   |
// | 3.02E | 129.12–141.00 | cheap @131.24 · six      | crane up into the sky: a price tag of light; a balance: the robot (~$6,000,         | crane up, breathing hold      | the balance levels                |
// |       |               | @136.64 · car @139.84    | UNITREE R1) sinks; a car of light lands on the other pan, the beam levels           |                               |                                   |
// | 3.03E | 141.00–150.96 | Factories @142.48        | down to the map: factory and warehouse gates light; the robot splits into 10 dots,  | crane down, slow push         | the dots                          |
// |       |               | ninety @146.44           | 9 run to the factories, 1 to the home · ~90 % IN COMPANIES · FORECAST              |                               |                                   |
// | 3.04E | 150.96–161.84 | half @154.40 · strategy  | up again: a 10×10 field of new factory robots, 59 ignite · 59 % · IFR 2026;          | crane up                      | truck right                       |
// |       |               | @160.56                  | the seal of a national strategy stamps them (BEIJING)                               |                               |                                   |
// | 3.05E | 161.84–172.72 | Workers @163.36          | workers of light stand on a line and become a bar: 74 MILLION · TODAY; the dotted   | truck right, hold             | truck right                       |
// |       |               | sixty-two @169.84        | forecast bar 62 MILLION · 2040 (JAPAN · WORKING AGE)                                |                               |                                   |
// | 3.06E | 172.72–180.16 | deadlines @175.32        | a robot marker slips along a timeline 2025 → 2026 → 2027 (missed deadlines); out of  | truck right, hold             | crane down                        |
// |       |               | billion @176.64          | it the dotted curve to ~1 BILLION · FORECAST; "not a law": other paths fan out      |                               |                                   |
// | 3.07E | 180.16–185.84 | price…workers · same     | down to the map: four streams of light (PRICE, MONEY, COUNTRIES, WORKERS) flow to   | crane down + pan back left    | the streams meet at the fork      |
// |       |               | @184.72                  | the fork and push the same way, down the road                                       |                               |                                   |
// | 3.08  | 185.84–192.20 | Which @188.08 · say      | at the fork: you, the signpost; its lantern lights (the hero); on "say" the board    | descend (7×), flight 'i' into | lightFlood = 1 at 192.20 → c04    |
// |       |               | @189.68                  | turns to the home, you walk; the camera flies into the home's window                 | the home window               | (the kitchen window of the home)  |
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as D from '../lib/f10_c01_draw.mjs';
import * as V from '../lib/f10_c01_world.mjs';
import * as W3 from '../lib/f10_c03_world.mjs';
const { W, H, P, rgba, mixHex, lin, rad, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, card, cam3, aim, camAt, camDrift, cardM, F0 } = E;
const { VZ, EZ, MAP, PATHS } = W3;

export const PRINT = { editorial: true };
const COOL = D.COOL;
const SY = 1100 * F0 / EZ;                       // sky cameras sit 1100 up: the explainer card shifts down by SY (design → screen)
const skyCam = (u, push = 0) => cam3({ x: (u - 960) * EZ / F0, y: -1100, z: push });
const WC = [MAP.win.x + MAP.win.w / 2, MAP.win.y + MAP.win.h / 2];
const ROAD = PATHS.road.slice().reverse();      // from the fork toward the viewer
const DU = { x: 992, y: 563, h: 28 };
const bump = (t, a, b, c) => smooth(span(t, a, b)) * (1 - smooth(span(t, b, c)));

export default async (T, R) => {
  E.prepareEditorial();
  const B = (w, n) => T.S('01b', w, n);
  const a = {
    start: R.a, show: B('show'), coming: B('coming'), why: B('Why now'), cheap: B('cheap'), small: B('A small'), unitree: B('Unitree'), six: B('six'),
    about: B('About as'), car: B('car'), who: B('Who pays'), factories: B('Factories'), warehouses: B('warehouses'), morgan: B('Morgan'), ninety: B('ninety'),
    companies: B('companies'), notIn: B('not in homes'), homes: B('homes'), pushing: B('Whos pushing'), countries: B('Countries'), more: B('More than'),
    half: B('half'), china: B('installed in China'), beijing: B('Beijing'), national: B('national'), strategy: B('strategy'), missing: B('And whos missing'),
    workers: B('Workers'), japan: B('Japan'), s74: B('seventyfour'), fall: B('fall to'), s62: B('sixtytwo'), by: B('By twenty'), many: B('Many robot'),
    missed: B('missed'), deadlines: B('deadlines'), billion: B('And a billion'), forecast: B('forecast'), notLaw: B('not a law'), nature: B('nature'),
    still: B('Still'), price: B('price'), money: B('money'), countries2: B('countries and'), workers2: B('missing workers'), push: B('push the'), same: B('same way'),
    probably: B('Probably'), certainly: B('certainly'), which: B('Which means'), say: B('get a say'), end: R.b,
  };
  a.china = B('China', 0) > a.half ? B('China', 0) : a.china; a.forty = B('forty', 0); a.workers2 += .4; a.say = B('say'); a.billionW = a.billion + .32;
  return [{ t: R.a, draw: take(a), print: PRINT }];
};

function take(a) {
  const K = [
    [a.start, aim(VZ, ...WC, 107)],
    [a.start + .32, aim(VZ, ...WC, 103)],
    [a.start + 3.2, aim(VZ, 1120, 540, 3.6, 960, 600), 'o'],
    [a.why + .15, aim(VZ, 1112, 542, 3.75, 960, 600)],
    [a.cheap + .35, skyCam(960, 0)],
    [a.who - .1, skyCam(966, 150)],
    [a.factories + .05, aim(VZ, 980, 540, 2.2, 960, 640)],
    [a.pushing - .05, aim(VZ, 986, 541, 2.32, 960, 640)],
    [a.countries - .05, skyCam(1480, 0)],
    [a.missing, skyCam(1486, 140)],
    [a.workers + .35, skyCam(2000, 0)],
    [a.many - .1, skyCam(2006, 130)],
    [a.many + 1.3, skyCam(2520, 0)],
    [a.nature + .3, skyCam(2526, 130)],
    [a.price + .25, aim(VZ, 1010, 560, 1.6, 960, 600)],
    [a.probably, aim(VZ, 1012, 560, 1.72, 960, 600)],
    [a.which - .3, aim(VZ, 1010, 548, 7, 900, 640)],
    [a.say + .2, aim(VZ, 1012, 547, 7.35, 900, 640)],
    [a.end - 1.0, aim(VZ, WC[0], WC[1] + 2, 13, 960, 560)],
    [a.end, aim(VZ, ...WC, 60), 'i'],
  ];
  return (ctx, t) => {
    const c0 = camAt(t, K, VZ), dz = VZ - c0.z, c = camDrift(c0, t, .5 * smooth(span(dz, 140, 900)));
    card(ctx, c, 40000, () => V.sky(ctx, t, 0));
    card(ctx, c, 9000, () => W3.ridges3(ctx));
    if (t > a.cheap - .6 && t < a.nature + 1.4) card(ctx, c, EZ, () => skyCanvas(ctx, t, a));
    const S = state(t, a);
    card(ctx, c, VZ, (k) => valley(ctx, t, k, a, S));
    overlays(ctx, t, c, a, S);
    W3.gapLine(ctx, t, 1 - smooth(span(t, a.start + .1, a.start + .7)));
    E.lightFlood(ctx, sineIO(span(t, a.end - .75, a.end - .02)));
  };
}

// ===================================================================================================== state of the valley
function state(t, a) {
  const S = {};
  S.open = .45 * smooth(span(t, a.start + .12, a.start + 1.5)) + .55 * smooth(span(t, a.say + .5, a.end - .25));
  S.glow = .85 * smooth(span(t, a.start + .1, a.start + 1.0)) + .15 * smooth(span(t, a.say, a.end));
  S.gap0 = .028;
  // the robot: stands at the fork (a show?), walks toward us from "coming"; the streams push it on
  const x = Math.max(0, t - (a.coming + .05)), walk = .05 * (x - .5 * (1 - Math.exp(-2 * x)));
  S.rf = clamp(.045 + walk, 0, 1);
  S.walking = x > 0;
  // factory / warehouse gates; the ten dots (9 → factories, 1 → home)
  const g = (t0) => .55 * smooth(span(t, t0, t0 + .5));
  S.gate = [g(a.factories), g(a.factories + .16), g(a.warehouses)];
  S.dots = [];
  if (t > a.morgan && t < a.pushing + 1.2) {
    const fadeOut = 1 - smooth(span(t, a.pushing + .3, a.pushing + 1.1));
    for (let i = 0; i < 10; i++) {
      const t0 = a.morgan - .1 + i * .09, u = sineIO(span(t, t0, t0 + 1.3));
      const ang = i / 10 * 6.283 + .4, cl = [MAP.fork[0] - 20 + 9 * Math.cos(ang), MAP.fork[1] + 8 + 5 * Math.sin(ang)];
      const q0 = W3.along(ROAD, lerp(.62, .03, u));
      let p = [lerp(q0[0], cl[0], smooth(span(u, .85, 1))), lerp(q0[1] - 3, cl[1], smooth(span(u, .85, 1)))];
      let arr = 0;
      if (i < 9) {
        const s0 = a.ninety + (i % 3) * .1 + Math.floor(i / 3) * .2, f = sineIO(span(t, s0, s0 + 1.5)), path = PATHS.fac[i % 3];
        if (f > 0) { const q = W3.along(path, f), ofs = (Math.floor(i / 3) - 1) * 6; p = [lerp(p[0], q[0] + ofs, smooth(span(f, 0, .25))), lerp(p[1], q[1] - 3, smooth(span(f, 0, .25)))]; }
        arr = span(f, .96, 1);
      } else {
        const f = sineIO(span(t, a.homes - .5, a.homes + .7));
        if (f > 0) { const q = W3.along(PATHS.home, f); p = [lerp(p[0], q[0], smooth(span(f, 0, .25))), lerp(p[1], q[1] - 3, smooth(span(f, 0, .25)))]; }
        arr = span(f, .96, 1);
      }
      S.dots.push({ p, a: smooth(span(t, t0, t0 + .3)) * fadeOut, arr, home: i === 9 });
    }
    // a gate brightens when its dots arrive
    for (let j = 0; j < 3; j++) { const s0 = a.ninety + j * .1 + .4 + 1.5; S.gate[j] += .45 * smooth(span(t, s0 - .2, s0 + .3)); }
  }
  // the streams (3.07)
  const words = [a.price, a.money, a.countries2, a.workers2];
  S.streams = words.map((w) => expoOut(span(t, w - .12, w + 1.1)) * (t < a.price - .4 ? 0 : 1));
  S.streamA = 1 - .7 * smooth(span(t, a.probably, a.certainly + .4));
  S.pushU = smooth(span(t, a.push - .1, a.same + .9));
  // the signpost: dark until "Which", then the lantern lights (anticipation flicker); the board turns on "say"
  const fl = bump(t, a.which - .42, a.which - .34, a.which - .22) * .35;
  S.lamp = .1 + .9 * smooth(span(t, a.which - .1, a.which + .55)) + fl;
  S.turn = sineIO(span(t, a.say - .05, a.say + .85));
  S.duWalk = Math.max(0, t - (a.say + .35));
  return S;
}

// ===================================================================================================== the valley card
function valley(ctx, t, k, a, S) {
  W3.land(ctx, t, k, { gate: S.gate.map((g) => clamp(g)), open: S.open, glow: S.glow, gap0: S.gap0 });
  // the streams flow to the fork and on down the road
  if (S.streams.some((u) => u > 0)) {
    PATHS.streams.forEach((pts, i) => {
      const u = S.streams[i]; if (u <= 0) return;
      E.trail(ctx, pts.map((p) => [p[0], p[1], 2.4]), u, { w: 2.4, a: S.streamA, spark: u < 1 });
      if (S.pushU > 0 && S.pushU < 1) for (let j = 0; j < 3; j++) {   // pulses of light running down each stream to the fork
        const f = ((t - a.push) * .55 + j / 3 + i * .09) % 1, q = W3.along(pts, f);
        halo(ctx, q[0], q[1], 16, .55 * S.streamA * Math.sin(Math.PI * S.pushU), P.halo1, P.core0);
      }
    });
    if (S.pushU > 0) E.trail(ctx, ROAD.map((p, j) => [p[0], p[1], lerp(3, 7, j / ROAD.length)]), .9 * S.pushU, { w: 4, a: S.streamA, spark: S.pushU < 1 });
  }
  // the spotlight on the robot ("just a show?")
  const [rx, ry] = W3.along(ROAD, S.rf), rh = .3 * (ry - 452), spot = bump(t, a.show - .45, a.show + .15, a.coming + .4);
  if (spot > 0) spotlight(ctx, rx, ry, rh, spot);
  // the signpost and you
  const board = W3.signpost(ctx, t, { turn: S.turn, lamp: S.lamp });
  const dp = S.duWalk > 0 ? W3.along(PATHS.home, Math.min(.2, S.duWalk * .06)) : [DU.x, DU.y];
  const lookUp = smooth(span(t, a.which - .2, a.which + .6)) * (1 - .6 * smooth(span(t, a.say + .2, a.say + .6)));
  E.du(ctx, dp[0], dp[1], DU.h * (1 + .002 * (dp[1] - DU.y)), S.duWalk > 0 ? { pose: 'walk', walk: S.duWalk * 7, dir: 1, light: 1 } : { pose: 'stand', look: lookUp, dir: 1, light: 1, armR: lookUp > .5 ? undefined : undefined });
  // the dots (3.03)
  for (const d of S.dots) {
    if (d.a <= 0) continue;
    halo(ctx, d.p[0], d.p[1], 16, .5 * d.a, P.blue2, COOL);
    ctx.fillStyle = rgba(mixHex(COOL, P.core0, d.arr), d.a); ctx.beginPath(); ctx.arc(d.p[0], d.p[1], 2.6, 0, 6.29); ctx.fill();
  }
  // the robot
  if (S.rf < .995 && t < a.who) {
    const f2 = Math.min(1, S.rf + .01), q = W3.along(ROAD, f2), dir = S.walking ? (q[0] - rx >= 0 ? 1 : -1) : -1;
    const wave = bump(t, a.show - .3, a.show + .2, a.show + 1.2);
    E.robot(ctx, rx, ry, rh, { dir, light: 1, walk: S.walking ? S.rf * 260 : undefined, rim: mixHex(P.blue2, P.halo0, .3 + .5 * spot), body: mixHex(P.ind0, P.ind2, .5),
      armR: S.walking ? undefined : [lerp(.1, 2.5, wave), lerp(.05, 2.9, wave)] });
  }
}
// a cool stage light from above: a soft cone and a pool on the ground
function spotlight(ctx, x, y, h, a) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const top = y - h * 4.2, p = new Path2D(); p.moveTo(x - h * .12, top); p.lineTo(x + h * .12, top); p.lineTo(x + h * .62, y + 2); p.lineTo(x - h * .62, y + 2); p.closePath();
  ctx.fillStyle = lin(ctx, 0, top, 0, y, [[0, rgba(P.cream, 0)], [.5, rgba(mixHex(P.cream, P.blue2, .4), .1 * a)], [1, rgba(P.cream, .22 * a)]]); ctx.fill(p);
  ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.scale(1, .22); ctx.fillStyle = rad(ctx, 0, 0, h * .8, [[0, rgba(P.cream, .5 * a)], [1, rgba(P.cream, 0)]]); ctx.beginPath(); ctx.arc(0, 0, h * .8, 0, 6.29); ctx.fill(); ctx.restore();
}

// ===================================================================================================== screen-space overlays
function overlays(ctx, t, c, a, S) {
  // 3.03: labels under the gates, the number block
  const lab = 1 - smooth(span(t, a.pushing - .2, a.pushing + .5));
  if (t > a.factories - .2 && lab > 0) {
    const L = (s, i, t0) => { const q = E.project(c, VZ, MAP.facs[i][0], MAP.facs[i][1] + 4); if (q) D.wipeText(ctx, s, q[0], q[1] + 42, span(t, t0, t0 + .6), { size: 24, spacing: .16, glow: false, col: P.halo2, align: 'center', a: lab }); };
    L('FACTORIES', 0, a.factories + .05); L('FACTORIES', 1, a.factories + .2); L('WAREHOUSES', 2, a.warehouses + .05);
  }
  if (t > a.ninety - .5 && t < a.pushing + 1) D.numBlock(ctx, t, { x: 130, y: 240, num: '~90 %', label: ['IN COMPANIES'], src: 'FORECAST · MORGAN STANLEY', t0: a.ninety - .2, t1: a.pushing - .1, size: 150 });
  // 3.07: the names of the streams
  if (t > a.price - .3 && t < a.certainly + 1) {
    const names = ['PRICE', 'MONEY', 'COUNTRIES', 'WORKERS'], at = [.3, .26, .3, .26], words = [a.price, a.money, a.countries2, a.workers2];
    PATHS.streams.forEach((pts, i) => {
      const p = W3.along(pts, at[i]), q = E.project(c, VZ, p[0], p[1]); if (!q) return;
      const x = clamp(q[0], 150, W - 150), y = clamp(q[1] - 30, 120, H - 160);
      D.wipeText(ctx, names[i], x, y, span(t, words[i] + .05, words[i] + .7), { size: 34, spacing: .16, col: P.cream, align: 'center', out: span(t, a.probably - .2, a.probably + .4) });
    });
  }
}

// ===================================================================================================== the sky canvas (card EZ)
function skyCanvas(ctx, t, a) {
  if (t < a.who + 1.2) balance(ctx, t, a);
  if (t > a.countries - .4 && t < a.workers + 1.2) tally(ctx, t, a);
  if (t > a.workers - .5 && t < a.many + 1.4) japan(ctx, t, a);
  if (t > a.many - .2) forecast(ctx, t, a);
}
const Y = (sy) => sy - SY;   // screen y (sky camera) → design y on the explainer card

// ---------------------------------------------------------------- 3.02: the balance (price)
function balance(ctx, t, a) {
  const cx = 960, py = Y(350), base = Y(700), half = 390, drop = 236;
  const ex = sineIO(span(t, a.who - .1, a.who + .8)), A = 1 - ex; if (A <= 0) return;
  ctx.save(); ctx.translate(0, 70 * ex);
  // the post and the beam draw as trails of light
  const uPost = expoOut(span(t, a.small - .1, a.small + .7)), uBeam = expoOut(span(t, a.small + .3, a.small + 1.2));
  E.trail(ctx, [[cx - 110, base, 2.4], [cx + 110, base, 2.4]], uPost, { w: 2.4, a: .8 * A, spark: false });
  E.trail(ctx, [[cx, base, 3.4], [cx, py, 3.4]], uPost, { w: 3.4, a: A });
  // tilt: the robot makes the left side sink; the car levels it (a damped swing)
  const tl = a.car - .05, sink = .15 * sineIO(span(t, a.small + 1.0, a.small + 2.4)) + .05 * sineIO(span(t, a.six, a.six + 1.0));
  let ang = sink; if (t > tl) { const d = t - tl; ang = .2 * Math.exp(-3.2 * d) * Math.cos(7.5 * d); }
  ang += .006 * Math.sin(t * 1.7);
  const L = [cx - half * Math.cos(ang), py + half * Math.sin(ang)], Rr = [cx + half * Math.cos(ang), py - half * Math.sin(ang)];
  if (uBeam > 0) {
    E.trail(ctx, [[cx, py, 3.2], [L[0], L[1], 3.2]], uBeam, { w: 3.2, a: A, spark: false });
    E.trail(ctx, [[cx, py, 3.2], [Rr[0], Rr[1], 3.2]], uBeam, { w: 3.2, a: A, spark: false });
    halo(ctx, cx, py, 40, .6 * A);
  }
  // pans on strings
  const panK = smooth(span(t, a.small + .9, a.small + 1.6)), pans = [];
  for (const [e, s] of [[L, -1], [Rr, 1]]) {
    if (panK <= 0) break;
    const pyy = e[1] + drop * panK, pw = 130;
    ctx.save(); ctx.strokeStyle = rgba(P.halo0, .55 * A * panK); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(e[0] - pw, pyy); ctx.moveTo(e[0], e[1]); ctx.lineTo(e[0] + pw, pyy); ctx.stroke(); ctx.restore();
    const p = new Path2D(); p.moveTo(e[0] - pw - 10, pyy); p.quadraticCurveTo(e[0], pyy + 46, e[0] + pw + 10, pyy); p.quadraticCurveTo(e[0], pyy + 22, e[0] - pw - 10, pyy); p.closePath();
    E.lightShape(ctx, p, t, { lit: s < 0 ? 1 : (t > tl ? 1 : .2), a: A * panK, dust: 0, glow: .6, seed: 40 + s });
    pans.push([e[0], pyy]);
  }
  // the price tag: swings in on a thread on "cheap", then hangs from the left end of the beam
  const tagIn = expoOut(span(t, a.cheap - .25, a.cheap + .6));
  if (tagIn > 0) {
    const mv = sineIO(span(t, a.small + 1.1, a.small + 2.0)), sw = .35 * Math.exp(-1.6 * Math.max(0, t - a.cheap)) * Math.sin(5 * (t - a.cheap)) + .03 * Math.sin(t * 1.3);
    const top0 = [cx + 250, Y(-40)], len0 = lerp(80, 300, tagIn), hang = [L[0] - 26, L[1] + 8];
    const top = [lerp(top0[0], hang[0], mv), lerp(top0[1], hang[1], mv)], len = lerp(len0, 70, mv), ang2 = sw * (1 - mv) + .06 * mv * Math.sin(t * 1.4);
    const tp = [top[0] + Math.sin(ang2) * len, top[1] + Math.cos(ang2) * len], s = lerp(170, 92, mv);
    ctx.save(); ctx.strokeStyle = rgba(P.halo0, .6 * A); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(tp[0], tp[1]); ctx.stroke(); ctx.restore();
    const ta = -Math.PI / 2 - ang2, ctr = [tp[0] - Math.cos(ta) * .28 * s, tp[1] - Math.sin(ta) * .28 * s];
    W3.tag(ctx, t, ctr[0], ctr[1], s, ta, { a: A * smooth(tagIn) });
    ctx.save(); ctx.translate(ctr[0] - Math.cos(ta) * .1 * s, ctr[1] - Math.sin(ta) * .1 * s); ctx.rotate(ta + Math.PI / 2);
    ctx.globalAlpha = A * smooth(tagIn) * .9; ctx.fillStyle = mixHex(P.shade0, P.halo1, .2); ctx.font = `${Math.round(s * .42)}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', 0, 0); ctx.restore();
  }
  // the robot on the left pan, the car on the right pan
  if (pans[0]) {
    const u = span(t, a.small + 1.2, a.small + 2.3);
    if (u > 0) E.icon(ctx, 'robot', pans[0][0], pans[0][1] - 88, 176, t, { lit: 0, u: 1, a: A * smooth(u) });
    D.wipeText(ctx, 'UNITREE R1', pans[0][0], pans[0][1] + 92, span(t, a.unitree, a.unitree + .7), { size: 34, spacing: .16, col: P.cream, align: 'center', a: A });
    if (t > a.six - .2) {
      const k = span(t, a.six - .15, a.six + .9);
      const v = Math.round(lerp(0, 6000, expoOut(k)) / 100) * 100;
      halo(ctx, L[0] - 30, L[1] - 110, 260, .16 * A * k, P.blue0, P.blue0);
      E.glowText(ctx, '~$' + v.toLocaleString('en-US'), L[0] - 30, L[1] - 70, { serif: true, size: 120, align: 'center', a: A * smooth(span(k, 0, .3)) });
    }
  }
  if (pans[1]) {
    const land = span(t, a.about + .5, tl), ep = expoIn(land);
    if (land > 0) {
      const x = lerp(pans[1][0] + 520, pans[1][0], sineIO(land)), y = lerp(pans[1][1] - 380, pans[1][1] - 38, ep);
      W3.car(ctx, t, x, y, 236, { a: A * smooth(span(land, 0, .3)), lit: 1 });
      if (t > tl) halo(ctx, pans[1][0], pans[1][1], 160, .5 * A * Math.exp(-3 * (t - tl)));
    }
    D.wipeText(ctx, '≈ A CHEAP USED CAR', pans[1][0], pans[1][1] + 92, span(t, a.car + .05, a.car + .75), { size: 34, spacing: .16, col: P.cream, align: 'center', a: A });
  }
  ctx.restore();
}

// ---------------------------------------------------------------- 3.04: 59 of 100 new factory robots (a field of light) + the seal
function tally(ctx, t, a) {
  const ox = 1480 - 960, A = 1 - smooth(span(t, a.missing + .15, a.missing + 1.0)); if (A <= 0) return;
  const gx = ox + 760, gy = Y(200), pitch = 40, cs = 30, lit = 59;
  const lt = (i) => a.more + .05 + i * .011;
  const stamp = a.strategy, hit = t > stamp ? Math.exp(-4 * (t - stamp)) : 0;
  let litHalo = 0;
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), q = i % 10, x = gx + q * pitch, y = gy + r * pitch;
    const ap = smooth(span(t, a.countries + (r + q) * .03, a.countries + (r + q) * .03 + .35)); if (ap <= 0) continue;
    const L = i < lit ? smooth(span(t, lt(i), lt(i) + .18)) : 0; litHalo += L;
    const s = cs * (.4 + .6 * expoOut(ap)) * (1 + .08 * hit * (i < lit));
    ctx.fillStyle = L > .5 ? lin(ctx, 0, y - s / 2, 0, y + s / 2, [[0, mixHex(P.core0, P.core1, .3)], [1, P.halo0]]) : rgba(mixHex(P.ind2, P.blue1, .55), .9);
    ctx.globalAlpha = A * ap * (L > .5 ? 1 : .8);
    ctx.beginPath(); ctx.roundRect(x + (cs - s) / 2, y + (cs - s) / 2, s, s, s * .28); ctx.fill();
    if (L > 0 && L < 1) { ctx.globalAlpha = A * L * (1 - L) * 2; halo(ctx, x + cs / 2, y + cs / 2, 40, .7); }
  }
  ctx.globalAlpha = 1;
  if (litHalo > 1) { halo(ctx, gx + 5 * pitch, gy + 2.8 * pitch, 330, .22 * A * litHalo / lit + .25 * hit, P.halo1, P.halo0); }
  D.numBlock(ctx, t, { x: ox + 150, y: Y(350), num: '59 %', label: ['OF NEW FACTORY ROBOTS'], t0: a.half - .2, t1: a.missing + .15, size: 150, labelSize: 32 });
  D.wipeText(ctx, 'INSTALLED IN CHINA', ox + 154, Y(350) + 63 + 40 + 44, span(t, a.china - .25, a.china + .5), { size: 40, spacing: .12, col: P.cream, a: A });
  D.wipeText(ctx, 'IFR 2026', ox + 154, Y(350) + 63 + 40 + 44 + 46, span(t, a.china + .2, a.china + .9), { size: 26, spacing: .16, glow: false, col: rgba(P.halo2, .78), a: A });
  // the seal: a ring of light drawn on "Beijing", a star on "national", it stamps on "strategy"
  const sx = ox + 1440, sy = Y(390), sr = 112 * (1 + .25 * (1 - expoOut(span(t, stamp - .35, stamp))) * (t > stamp - .35 ? 1 : 0));
  const ring = expoOut(span(t, a.beijing, a.beijing + 1.0));
  if (ring > 0) {
    const pts = []; for (let i = 0; i <= 64; i++) { const an = -Math.PI / 2 + i / 64 * 6.283; pts.push([sx + sr * Math.cos(an), sy + sr * Math.sin(an), 3]); }
    E.trail(ctx, pts, ring, { w: 3, a: A });
    const pts2 = pts.map(([x, y]) => [sx + (x - sx) * .84, sy + (y - sy) * .84, 1.4]); E.trail(ctx, pts2, ring, { w: 1.4, a: .6 * A, spark: false });
  }
  const st = expoOut(span(t, a.national - .05, a.national + .5));
  if (st > 0) {
    const p = new Path2D(), R0 = 52 * st, R1 = 21 * st; for (let i = 0; i < 10; i++) { const an = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R1 : R0; i ? p.lineTo(sx + rr * Math.cos(an), sy + rr * Math.sin(an)) : p.moveTo(sx + rr * Math.cos(an), sy + rr * Math.sin(an)); } p.closePath();
    E.lightShape(ctx, p, t, { lit: 1, a: A, dust: 0, seed: 47 });
  }
  if (hit > 0) halo(ctx, sx, sy, 260, .5 * hit * A, P.halo1, P.core0);
  D.wipeText(ctx, 'BEIJING', sx, sy + 170, span(t, a.beijing + .15, a.beijing + .8), { size: 34, spacing: .18, col: P.cream, align: 'center', a: A });
  D.wipeText(ctx, 'NATIONAL STRATEGY', sx, sy + 214, span(t, a.strategy - .1, a.strategy + .6), { size: 26, spacing: .16, glow: false, col: P.halo2, align: 'center', a: A });
}

// ---------------------------------------------------------------- 3.05: Japan, working age 74 → 62 million
function japan(ctx, t, a) {
  const ox = 2000 - 960, A = smooth(span(t, a.workers - .4, a.workers + .1)) * (1 - smooth(span(t, a.many - .05, a.many + .5))); if (A <= 0) return;
  const by = Y(690), x1 = ox + 900, x2 = ox + 1300, bw = 210, hMax = 380, h62 = hMax * 62 / 74;
  E.trail(ctx, [[ox + 700, by, 2.4], [ox + 1500, by, 2.4]], expoOut(span(t, a.workers - .25, a.workers + .55)), { w: 2.4, a: .85 * A });
  // the workers: small figures of light on the line, they become the first bar
  const merge = smooth(span(t, a.s74 - .1, a.s74 + .55));
  for (let i = 0; i < 5; i++) {
    const t0 = a.workers + i * .07, u = expoOut(span(t, t0, t0 + .5)); if (u <= 0 || merge >= 1) continue;
    const x = x1 + (i - 2) * 46, s = 96 * (.6 + .4 * u);
    E.icon(ctx, 'person', x, by - s / 2 - 2, s, t, { lit: 1, a: A * u * (1 - merge), dust: 0, glow: .6, seed: 80 + i });
  }
  const u1 = expoOut(span(t, a.s74 - .15, a.s74 + .9));
  if (u1 > 0) W3.bar(ctx, t, x1, by, bw, hMax * u1, { lit: 1, seed: 13, a: A });
  if (u1 > 0) {
    const tx = x1, ty = by - hMax * u1 - 34;
    D.wipeText(ctx, '74', tx - 8, ty, span(t, a.s74 + .1, a.s74 + .8), { serif: true, size: 110, align: 'right', a: A });
    D.wipeText(ctx, 'MILLION', tx + 2, ty, span(t, a.s74 + .25, a.s74 + .95), { size: 30, spacing: .14, glow: false, col: P.halo2, a: A });
    D.wipeText(ctx, 'TODAY', x1, by + 52, span(t, a.s74 + .3, a.s74 + 1.0), { size: 30, spacing: .16, glow: false, col: P.halo2, align: 'center', a: A });
  }
  const u2 = expoOut(span(t, a.fall - .1, a.s62 + .6));
  if (u2 > 0) {
    W3.bar(ctx, t, x2, by, bw, h62 * u2, { dot: true, a: A });
    // the fall: a dotted line from the top of today to the top of 2040
    ctx.save(); ctx.globalAlpha = A * smooth(span(t, a.s62, a.s62 + .6)); ctx.setLineDash([2, 12]); ctx.lineCap = 'round'; ctx.strokeStyle = P.halo0; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x1 + bw / 2 + 16, by - hMax); ctx.lineTo(x2 - bw / 2 - 16, by - h62); ctx.stroke(); ctx.restore();
    const ty = by - h62 * u2 - 34;
    D.wipeText(ctx, '62', x2 - 8, ty, span(t, a.s62 + .05, a.s62 + .75), { serif: true, size: 110, align: 'right', a: A });
    D.wipeText(ctx, 'MILLION', x2 + 2, ty, span(t, a.s62 + .2, a.s62 + .9), { size: 30, spacing: .14, glow: false, col: P.halo2, a: A });
  }
  D.wipeText(ctx, '2040', x2, by + 52, span(t, a.forty - .1, a.forty + .55), { size: 30, spacing: .16, col: P.cream, align: 'center', a: A });
  D.wipeText(ctx, 'FORECAST', x2, by + 90, span(t, a.forty + .1, a.forty + .75), { size: 24, spacing: .18, glow: false, col: rgba(P.halo2, .78), align: 'center', a: A });
  D.wipeText(ctx, 'JAPAN', ox + 160, Y(380), span(t, a.japan - .1, a.japan + .55), { serif: true, size: 110, a: A });
  D.wipeText(ctx, 'WORKING-AGE PEOPLE', ox + 164, Y(380) + 56, span(t, a.japan + .15, a.japan + .8), { size: 30, spacing: .14, glow: false, col: P.halo2, a: A });
  D.wipeText(ctx, 'OECD · IPSS PROJECTION', ox + 164, Y(380) + 100, span(t, a.japan + .4, a.japan + 1.05), { size: 24, spacing: .16, glow: false, col: rgba(P.halo2, .78), a: A });
}

// ---------------------------------------------------------------- 3.06: missed deadlines → the billion is a forecast
function forecast(ctx, t, a) {
  const ox = 2520 - 960, A = smooth(span(t, a.many + .45, a.many + 1.0)) * (1 - smooth(span(t, a.nature + .35, a.nature + 1.1))); if (A <= 0) return;
  const ay = Y(700), xs = [420, 620, 820].map((x) => ox + x), xEnd = ox + 1600;
  E.trail(ctx, [[ox + 300, ay, 2.4], [ox + 1660, ay, 2.4]], expoOut(span(t, a.many + .4, a.many + 1.3)), { w: 2.4, a: .85 * A, spark: false });
  ['2025', '2026', '2027'].forEach((s, i) => {
    D.wipeText(ctx, s, xs[i], ay + 50, span(t, a.many + .6 + i * .12, a.many + 1.2 + i * .12), { size: 30, spacing: .1, glow: false, col: P.halo2, align: 'center', a: A });
    const d = new Path2D(); d.arc(xs[i], ay, 7, 0, 6.29); E.lightShape(ctx, d, t, { lit: 0, a: .7 * A * smooth(span(t, a.many + .1 + i * .12, a.many + .5 + i * .12)), dust: 0, glow: .5 });
  });
  // the marker (a robot of light) slips: 2025 → 2026 → 2027; ghosts stay behind
  const s1 = quartIO(span(t, a.missed - .05, a.missed + .5)), s2 = quartIO(span(t, a.deadlines - .05, a.deadlines + .5));
  const mx = lerp(lerp(xs[0], xs[1], s1), xs[2], s2), into = sineIO(span(t, a.billion - .1, a.billion + .45));
  const mA = A * smooth(span(t, a.many + .8, a.many + 1.3)) * (1 - into);
  for (const [k, x] of [[s1, xs[0]], [s2, xs[1]]]) if (k > 0) {
    const r = new Path2D(); r.arc(x, ay - 64, 34, 0, 6.29); E.lightShape(ctx, r.stroke({ width: 2.2 }), t, { lit: 0, a: .55 * A * k * (1 - into * .6), dust: 0, glow: .4 });
    D.wipeText(ctx, 'MISSED', x, ay - 118, k, { size: 22, spacing: .18, glow: false, col: rgba(P.halo2, .8), align: 'center', a: A * (1 - into) });
  }
  if (mA > 0) {
    const ms = 150 * (1 - .7 * into), sway = .05 * Math.sin((t - a.missed) * 9) * Math.exp(-3 * Math.abs(t - a.missed - .5)) + .05 * Math.sin((t - a.deadlines) * 9) * Math.exp(-3 * Math.abs(t - a.deadlines - .5));
    ctx.save(); ctx.translate(mx, ay - 4); ctx.rotate(sway); halo(ctx, 0, -ms * .5, ms * 1.2, .35 * mA, P.blue0, P.blue2); E.icon(ctx, 'robot', 0, -ms / 2, ms, t, { lit: 0, a: mA, dust: 0, glow: .9 }); ctx.restore();
    D.wipeText(ctx, 'PROMISED', mx, ay - 178 + 40 * into, span(t, a.many + 1.0, a.many + 1.5), { size: 24, spacing: .18, glow: false, col: P.halo2, align: 'center', a: mA });
  }
  // the forecast: a dotted curve out of 2027 up to a billion (2050); "not a law of nature": other paths fan out, faint
  const cu = sineIO(span(t, a.billion, a.billion + 1.3));
  const path = (yEnd, bend) => E.catmull([[xs[2], ay, 3], [lerp(xs[2], xEnd, .45), lerp(ay, yEnd, bend), 3], [lerp(xs[2], xEnd, .8), lerp(ay, yEnd, .7), 3], [xEnd, yEnd, 3]], 14);
  const dotted = (pts, u, al, col) => {
    const n = Math.max(1, Math.floor(u * (pts.length - 1)));
    ctx.save(); ctx.globalAlpha = al; ctx.setLineDash([2, 13]); ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath();
    for (let i = 0; i <= n; i++) (i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1])); ctx.stroke(); ctx.restore();
    return pts[n];
  };
  if (cu > 0) {
    const head = dotted(path(Y(270), .12), cu, A, P.halo0);
    halo(ctx, head[0], head[1], 70, .7 * A);
    D.wipeText(ctx, '2050', xEnd, ay + 50, span(t, a.billion + .3, a.billion + .9), { size: 30, spacing: .1, glow: false, col: P.halo2, align: 'center', a: A });
    const tick = new Path2D(); tick.arc(xEnd, ay, 7, 0, 6.29); E.lightShape(ctx, tick, t, { lit: 0, a: .7 * A * smooth(span(t, a.billion + .3, a.billion + .7)), dust: 0, glow: .5 });
  }
  D.wipeText(ctx, '~1 BILLION', xEnd - 70, Y(220), span(t, a.billionW - .05, a.billionW + .7), { serif: true, size: 100, align: 'right', a: A });
  D.wipeText(ctx, 'FORECAST · MORGAN STANLEY', xEnd - 74, Y(220) + 48, span(t, a.forecast - .05, a.forecast + .65), { size: 26, spacing: .16, glow: false, col: rgba(P.halo2, .85), align: 'right', a: A });
  const alt = sineIO(span(t, a.notLaw - .05, a.nature + .5));
  if (alt > 0) { dotted(path(Y(450), .25), alt, .8 * A, COOL); dotted(path(Y(600), .45), alt * .96, .65 * A, COOL); }
}
