// c01 · Hook · the engine (two price tags, the circle) · what you are paid for: thinking · 0 → T.G('At the end of') · built by the lead
// (quality reference). Plan: docs/shots.md 1.01–1.07 (source tools/shots18.py) · world/rules: docs/MOTION.md · kit: lib/f18_kit.mjs.
// ONE entry, ONE world (the board at night), one continuous camera: hook close under the giant tag → pull back to the near edge of
// the loop (workshop · you · shop) → rise to the whole ring (the engine) → back down to you → tilt up and fly INTO your tag. The chunk
// ends in plateTag (lib/f18_seams.mjs) for the last .5 s: the flight into the tag lands exactly on it (the tag face fills the frame).
//
// | ID    | anchor (word)                    | picture (one idea)                                                   | 1–2 moves               | camera                 |
// |-------|----------------------------------|----------------------------------------------------------------------|-------------------------|------------------------|
// | 1.01  | capitalism · lifetime · way      | the giant price tag of light over tiny you; dust leaves its edge      | swing · dust            | slow push              |
// | 1.02  | pays you · make · sells          | the near edge of the loop: coin → you → the cube you make → the shop | coin, then cube         | pull back + up         |
// | 1.03  | Your work · What you make · gap  | $1 over you, a bigger $2 over the shop; the gap bracket = PROFIT      | print · lower · bracket | breathing hold         |
// | 1.04★ | whole engine                     | the coin runs the whole loop, the ring lights: the engine             | the coin                | rise to the ring       |
// | 1.05  | A.I. · one of those prices       | a cold disc rises at the zero line; your tag's edge cools             | the disc · customer     | back down to you       |
// | 1.06  | email · contract · mistake · customer | four small light cards rise from your hands, one per word        | one card per word       | push in on you         |
// | 1.07  | thinking · cheap · Fast          | the cards fold into a thought; the tag cools, $1 sinks; a drop falls  | fold · cool             | tilt up, fly into tag  |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f18_kit.mjs';
import { plateTag, TAG_PLATE, SEAM_HALF } from '../lib/f18_seams.mjs';
import { Path2D } from '@napi-rs/canvas';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cam3, camAt, camDrift, F0 } = E;
const { BOARD, LOOP, gp, wp, stand, loopPt, loopU, COOL, bump } = F;

export const PRINT = F.PRINT18;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0, n = 0) => T.G(p, n, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.cap = G('capitalism'); a.hund = G('hundred years'); a.life = G('lifetime'); a.way = G('the way you think'); a.wayE = GE('the way you think');
  a.one = G('Capitalism, in one sentence'); a.pays = G('pays you', a.one); a.make = G('make something', a.one); a.sells = G('sells it', a.one);
  a.more = G('more than', a.sells); a.paidE = GE('paid you', a.more);
  a.work = G('Your work'); a.wmake = G('What you make'); a.gap = G('gap', a.wmake); a.profit = G('profit', a.gap); a.engine = G('whole engine'); a.engineE = GE('whole engine');
  a.now = G('Now watch'); a.ai = G('A.I.', a.now); a.prices = G('one of those prices', a.now);
  a.think = G('Think about what you'); a.email = G('email', a.think); a.contract = G('contract', a.think); a.mistake = G('mistake', a.think); a.customer = G('customer', a.think);
  a.most = G('Most of it is thinking'); a.thinking = G('thinking', a.most); a.and = G('And thinking', a.most); a.cheap = G('cheap', a.and); a.fast = G('Fast', a.cheap);
  a.end = R.b;
  return [{ t: 0, draw: scene(a), print: PRINT }];
};

// ===================================================================================================== the set (world units, BOARD.GY = 430)
const Z0 = 3000;                                              // the near edge of the loop: everything of c01 stands on this depth
const YOU = { X: -500, h: 200 };
const SHOP = { X: 1900, w: 700, h: 400 };
const WORK = { X: -2300, w: 820, h: 420 };                    // the workshop (the employer)
const CUST = { X0: 1380, X1: 60, h: 212 };                    // the customer walks from the shop to you (1.05)
const TA = { X: YOU.X, w: 760 };                              // tag A over you ($1)
const TB = { X: SHOP.X, w: 760 * 1.4 };                       // tag B over the shop ($2): bigger tag = higher price
const TAG_BOT = -480;                                         // both tags end at the same height above the ground (y up = −, from the ground)
const eyeY = (w) => TAG_BOT - w * 1.32;                       // eyelet height for a tag of width w
const ROADZ = LOOP.cz - LOOP.half;                            // the near edge of the road (2900)
const COIN_R = 52;
// the town: small houses just outside the loop's sides and far edge (seeded, far → near)
const TOWN = (() => { const r = E.prng(1808), out = [];
  for (let i = 0; i < 14; i++) { const side = i % 3, w = 300 + r() * 260, h = 240 + r() * 200;
    const X = side === 0 ? -LOOP.half - 500 - r() * 900 : side === 1 ? LOOP.half + 500 + r() * 900 : -2200 + r() * 4400;
    const Z = side === 2 ? LOOP.cz + LOOP.half + 500 + r() * 700 : LOOP.cz - LOOP.half + 900 + r() * (2 * LOOP.half - 600);
    out.push({ X, Z, w, h, n: 1 + Math.floor(r() * 2.5), seed: 10 + i }); }
  return out.sort((p, q) => q.Z - p.Z); })();
// camera that shows world point (X, Y, Z) at screen (sx, sy) with s px per world unit
// (Y measured from the ground, up = −, like everything drawn with stand())
const camFor = (X, Y, Z, s, sx = W / 2, sy = H / 2, f = F0) => { const dz = f / s; return cam3({ x: X - (sx - W / 2) / s, y: Y + BOARD.GY - (sy - H / 2) / s, z: Z - dz, f }); };

function scene(a) {
  const T0 = a.end, tPlate = T0 - SEAM_HALF;
  const eA = eyeY(TA.w), eB = eyeY(TB.w);
  // the camera: one plan sequence; moves 2.5–4 s sine-S on word keys, long breathing holds between (drift only)
  const PLATE_S = TAG_PLATE.w / TA.w;
  const K = [
    [0, camFor(TA.X, eA, Z0, .56, 1240, 92)],                                  // hook: the giant tag, you tiny below, the plain to the left
    [a.wayE + .4, camFor(TA.X, eA, Z0, .6, 1228, 84)],                          // slow push through the hook
    [a.pays + .5, camFor(-150, -885, Z0, .36, 960, 540)],                     // pull back + up: workshop · you · shop on the near edge
    [a.wmake - .3, camFor(-110, -890, Z0, .362, 960, 540)],                     // breathing hold while the coin and the cube travel
    [a.gap + .3, camFor(700, -900, Z0, .37, 960, 560)],                         // follow tag B: both tags and the gap between them (1.03)
    [a.engine - .45, camFor(720, -905, Z0, .378, 960, 560)],                    // breathing hold on the gap
    [a.engineE + 1.6, cam3({ x: 0, y: -2100, z: -1400, f: 850 })],            // ★ rise to the whole ring (the engine)
    [a.now + .9, cam3({ x: 30, y: -2130, z: -1330, f: 850 })],                 // hold while the coin runs
    [a.think + .15, camFor(YOU.X + 80, 0, Z0, .54, 960, 985)],                  // back down to you, your whole tag above you
    [a.email - .2, camFor(YOU.X + 70, 0, Z0, .57, 960, 995)],                // push in on you (1.06)
    [a.and - .1, camFor(YOU.X + 65, 0, Z0, .585, 960, 1000)],                  // hold while the cards rise and fold
    [a.cheap - .45, camFor(YOU.X + 60, 0, Z0, .6, 960, 1004)],                 // breathing hold; the push starts on "cheap"
    [tPlate, camFor(TA.X, eA, Z0, PLATE_S, TAG_PLATE.x, TAG_PLATE.y)],          // up the thread and into the tag: its face fills the frame (plateTag)
  ];
  // the coin: workshop door → road → you (pays you); then the whole loop from the shop (engine)
  const uWork = loopU(WORK.X + 260), uYou = loopU(YOU.X + 40), uShop = loopU(SHOP.X - 120);
  const coinPay = [a.pays - .35, a.pays + 1.35];
  const runT = [a.engine - .1, a.engine + 3.9];
  const cubeRide = [a.sells - .25, a.sells + 1.55];
  const rand = E.prng(1801);
  const DUSTS = Array.from({ length: 4 }, () => [rand(), rand()]);

  return (ctx, t) => {
    const dAmt = .9 * (1 - smooth(span(t, tPlate - 1.2, tPlate)));
    const c = camDrift(camAt(t, K, Z0), t, dAmt);
    world(ctx, t, c);
    if (t >= tPlate) plateTag(ctx, t);
  };

  // ---------------------------------------------------------------------------------------------------------------------- the world
  function world(ctx, t, c) {
    // the coin on the loop (u) and how far the road behind it has lit
    let coinU = null, coinA = 0, litTo = 0;
    if (t >= coinPay[0] && t < coinPay[1]) { coinU = lerp(uWork, uYou, sineIO(span(t, coinPay[0], coinPay[1]))); coinA = smooth(span(t, coinPay[0], coinPay[0] + .3)) * (1 - smooth(span(t, coinPay[1] - .3, coinPay[1]))); }
    const run = span(t, runT[0], runT[1]), runU = uShop + quartIO(run) * (1 - uShop + uWork + .0001);
    if (t >= runT[0] - .3 && t < runT[1] + .8) { coinU = run >= 1 ? uWork : runU; coinA = smooth(span(t, runT[0] - .3, runT[0])) * (1 - smooth(span(t, runT[1] + .3, runT[1] + .8))); }
    // the road: faint before the engine; the run lights it behind the coin; afterwards it keeps a calm glow
    const base = .32 + .08 * smooth(span(t, a.one, a.pays));
    const lit = [];
    if (t >= coinPay[0]) lit.push([uWork, lerp(uWork, uYou, sineIO(span(t, coinPay[0], coinPay[1]))), .45 * (1 - .6 * smooth(span(t, runT[0], runT[1])))]);
    if (t >= runT[0]) { const fadeL = .85 * (1 - .45 * smooth(span(t, a.think, a.think + 3))); lit.push([uShop, run >= 1 ? uShop + 1 : Math.min(runU, uShop + .9999), fadeL]); }
    const cool = .28 * smooth(span(t, a.prices - .2, a.prices + .9)) + .32 * smooth(span(t, a.cheap - .1, a.cheap + .7));

    F.sky(ctx, c, t, { air: 0 });
    // the machine: a cold disc rises behind the zero line on the right (drawn before the board: the board's far edge hides its rise)
    const dr = smooth(span(t, a.ai - .2, a.ai + 2.2));
    if (dr > 0) { const p = wp(c, 7600, BOARD.GY + 1300 - 2600 * dr, 26000); if (p) F.coolDisc(ctx, p[0], p[1], 520 * p[2], .95 * smooth(span(t, a.ai - .2, a.ai + .6))); }
    F.board(ctx, c, t, { road: base, lit, ticks: .35, zero: 1 });
    // the cold light reaching the board from the right (a faint wash once the disc is up)
    if (dr > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, W, 0, W * .25, 0, [[0, rgba(COOL.edge, .1 * dr)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(0, 0, W, H); ctx.restore(); }

    // the town round the loop (dim, far): small houses on the side and far edges, drawn far → near
    for (const hs of TOWN) { if (hs.Z < Z0 + 200) continue; stand(ctx, c, hs.X, hs.Z, () => F.house(ctx, t, hs.w, hs.h, { win: hs.n, lit: .45, seed: hs.seed })); }
    // back to front along the near edge: the workshop, the shop, the coin, the road things, you, the customer, the tags
    stand(ctx, c, WORK.X, Z0 + 120, () => workshop(ctx, t));
    stand(ctx, c, SHOP.X, Z0 + 120, () => shop(ctx, t));
    if (coinU != null && coinA > 0) { const [x, z] = loopPt(coinU); stand(ctx, c, x, z, () => { F.coin(ctx, t, 0, -COIN_R, COIN_R, { spin: coinU * 60, a: coinA }); E.halo(ctx, 0, -COIN_R, COIN_R * 4, .5 * coinA, P.halo0, P.core1); }); }
    stand(ctx, c, 0, Z0, () => {
      tagLight(ctx, t, cool);
      cube(ctx, t);
      you(ctx, t);
      customer(ctx, t);
      cards(ctx, t);
    });
    stand(ctx, c, 0, Z0 - 10, () => tags(ctx, t, cool));
  }

  // the tag's light on the ground round you (a soft pool) and on the plain
  function tagLight(ctx, t, cool) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(TA.X, 4); ctx.scale(1, .11);
    ctx.fillStyle = E.rad(ctx, 0, 0, 900, [[0, rgba(mixHex(P.halo1, COOL.mid, cool), .4)], [.45, rgba(P.halo1, .1)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 900, 0, 6.29); ctx.fill(); ctx.restore();
    E.castShadow(ctx, YOU.X + 8, 0, 34, 150, Math.PI * .62, .45);
  }

  // ---- the two tags ($1 over you, $2 over the shop) and the gap bracket
  function tags(ctx, t, cool) {
    const sw = .05 * Math.sin(Math.PI * span(t, a.cap - .25, a.cap + 1.6)) * (1 - span(t, a.cap + .6, a.cap + 1.6)) + .006 * Math.sin(t * 1.3 + .5);
    // the hook: a thin stream of dust leaves the tag's lower edge on "the way you think"
    const emitHook = (ts) => .55 * bump(ts, a.way - .1, 2.2);
    // 1.07: the number sinks off the face on "cheap", the "Fast." notch (a hard 3-frame drop, then a settle)
    const sink = smooth(span(t, a.cheap - .15, a.cheap + .9));
    const notch = 26 * expoOut(span(t, a.fast - .02, a.fast + .1)) * (1 - .35 * smooth(span(t, a.fast + .1, a.fast + .9)));
    const nearPlate = smooth(span(t, a.fast + .4, a.end - SEAM_HALF));      // converge to the plate's tag (no notch, its sway)
    const swA = lerp(sw, .012 * Math.sin(t * 1.3), nearPlate), yA = eA + notch * (1 - nearPlate);
    const coolA = lerp(cool, TAG_PLATE.cool, nearPlate);
    const emitA = (ts) => Math.max(emitHook(ts), .35 * smooth(span(ts, a.and - 1.2, a.and - .2)));   // steady by the plate (same stream as plateTag)
    F.tag(ctx, t, TA.X, yA, TA.w, { text: '$1', u: span(t, a.work - .1, a.work + .7), sink, cool: coolA, swing: swA, emit: emitA, seed: 18, thread: 4000,
      melt: .025 * smooth(span(t, a.way, a.wayE + .6)) * (1 - nearPlate) });
    // the drop of light that runs off the edge on "Fast."
    const dq = span(t, a.fast, a.fast + .9);
    if (dq > 0 && dq < 1) { const by = yA + TA.w * 1.32 + 6, y = by + expoIn(dq) * 900; E.halo(ctx, TA.X + 40, y, 30, .9 * (1 - dq * .5), mixHex(P.halo0, COOL.mid, .5), COOL.core); ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.ellipse(TA.X + 40, y, 7, 10 + 16 * dq, 0, 0, 6.29); ctx.fill(); }
    // tag B lowers on its thread over the shop on "What you make" (from the dark above the frame)
    const lb = sineIO(span(t, a.wmake - .5, a.wmake + 1.1));
    if (lb > 0) {
      const yB = lerp(eB - 2200, eB, lb) + 6 * Math.sin(t * .9);
      F.tag(ctx, t, TB.X, yB, TB.w, { text: '$2', u: span(t, a.wmake + .65, a.wmake + 1.35), swing: .004 * Math.sin(t * 1.1 + 2) + .03 * (1 - lb) * Math.sin(t * 3), thread: 4000, glow: .9 });
    }
    // the gap: a dotted rule from tag A's apex level across to tag B, a bracket up to B's apex, PROFIT inside (1.03)
    const gu = smooth(span(t, a.gap - .25, a.gap + .75)), gout = 1 - expoIn(span(t, a.engine + .2, a.engine + .8));
    if (gu > 0 && gout > 0) {
      const yA0 = eA - TA.w * 1.32 * .1, yB0 = eB - TB.w * 1.32 * .1, x0 = TA.X + TA.w / 2 + 40, xb = TB.X - TB.w / 2 - 70;
      ctx.save(); ctx.globalAlpha = gout;
      ctx.setLineDash([18, 16]); ctx.strokeStyle = rgba(P.halo1, .7); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0, yA0); ctx.lineTo(lerp(x0, xb, gu), yA0); ctx.stroke(); ctx.setLineDash([]);
      const bu = smooth(span(t, a.gap + .15, a.gap + .85));
      if (bu > 0) F.rule(ctx, xb, yA0, xb, lerp(yA0, yB0, bu), 1, { w: 6, spark: bu < 1 });
      if (bu > 0) { ctx.strokeStyle = rgba(P.halo0, .9 * bu); ctx.lineWidth = 5; for (const yy of [yA0, yB0]) { if (yy === yB0 && bu < .98) continue; ctx.beginPath(); ctx.moveTo(xb, yy); ctx.lineTo(xb + 40, yy); ctx.stroke(); } }
      const pu = F.rise(span(t, a.profit - .2, a.profit + .6));
      if (pu > 0) F.maskLine(ctx, [['PROFIT', smooth(span(t, a.profit, a.profit + .6))]], xb - 40, (yA0 + yB0) / 2 + 48, 132, pu, { serif: false, weight: 600, align: 'right', col: P.cream });
      ctx.restore();
    }
  }

  // ---- you: tiny, under your tag; you look up at it in the hook, take the coin, make the thing, then the four tasks
  function you(ctx, t) {
    const look = .55 + .35 * sineIO(span(t, a.life - .3, a.life + .7)) - .55 * sineIO(span(t, a.one + .2, a.one + 1.4)) + .25 * sineIO(span(t, a.wmake, a.wmake + 1)) - .25 * sineIO(span(t, a.engine, a.engine + 1))
      + .35 * sineIO(span(t, a.thinking - .2, a.thinking + .6)) + .3 * sineIO(span(t, a.cheap - .3, a.cheap + .5));
    // arms: catch the coin (pays you) → hold the growing cube (make) → give it away (sells) → down; tasks: hands in front; thought: right arm up
    const hold = smooth(span(t, a.pays + .6, a.pays + 1.2)) * (1 - smooth(span(t, cubeRide[0] - .05, cubeRide[0] + .5)));
    const task = smooth(span(t, a.email - .6, a.email - .1)) * (1 - smooth(span(t, a.thinking - .3, a.thinking + .2)));
    const up = smooth(span(t, a.thinking - .4, a.thinking + .4));
    const br = Math.sin(t * 1.6) * .03;
    const armR = [lerp(lerp(lerp(.16, .75, hold), .6, task), 2.55, up) + br, lerp(lerp(lerp(.1, 2.2, hold), 1.6, task), 2.7, up)];
    const armL = [lerp(lerp(-.18, -.7, hold), -.5, task) - br, lerp(lerp(-.08, -2.1, hold), -1.4, task)];
    ctx.save(); ctx.translate(YOU.X, 0); ctx.scale(1, 1 + .008 * Math.sin(t * 1.6));
    const hands = E.du(ctx, 0, 0, YOU.h, { dir: 1, look: clamp(look), light: 1, armR, armL });
    ctx.restore();
    you.hands = { R: [hands.R[0] + YOU.X, hands.R[1]], L: [hands.L[0] + YOU.X, hands.L[1]] };
  }

  // ---- the cube you make (it grows between your hands on "make something", then rides the road to the shop)
  function cube(ctx, t) {
    const g = smooth(span(t, a.make - .2, a.make + .6));
    if (g <= 0) return;
    const q = span(t, cubeRide[0], cubeRide[1]); if (q >= 1) return;
    const e = sineIO(q), x0 = YOU.X + 70, y0 = -118, x1 = SHOP.X - 120, y1 = -150;
    const x = lerp(x0, x1, e), y = lerp(y0, y1, e) - Math.sin(Math.PI * e) * 160, r = 34 * g * (1 - .3 * smooth(span(q, .8, 1)));
    E.halo(ctx, x, y, r * 4, .7, P.halo0, P.core1);
    const p = new Path2D(); p.moveTo(x, y - r); p.lineTo(x + r * .87, y - r * .5); p.lineTo(x + r * .87, y + r * .5); p.lineTo(x, y + r); p.lineTo(x - r * .87, y + r * .5); p.lineTo(x - r * .87, y - r * .5); p.closePath();
    ctx.fillStyle = P.core0; ctx.fill(p);
    ctx.fillStyle = P.halo0; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + r * .87, y - r * .5); ctx.lineTo(x + r * .87, y + r * .5); ctx.lineTo(x, y + r); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.halo1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - r * .87, y - r * .5); ctx.lineTo(x - r * .87, y + r * .5); ctx.lineTo(x, y + r); ctx.closePath(); ctx.fill();
  }

  // ---- the customer: walks from the shop toward you while the disc rises (1.05), stands to your right (1.06)
  function customer(ctx, t) {
    const w = span(t, a.ai - .4, a.think + .4); if (t < a.ai - 2) return;
    const x = lerp(CUST.X0, CUST.X1, sineIO(w)), walking = w > 0 && w < 1;
    const show = smooth(span(t, a.ai - 1.6, a.ai - .4));       // steps out of the shop door (the door is behind him)
    const lean = .06 * bump(t, a.customer - .3, 1.2);
    ctx.save(); ctx.globalAlpha = show;
    E.person(ctx, x, 0, CUST.h, { dir: -1, light: -1, walk: walking ? t * 5.2 : undefined, lean, armR: walking ? undefined : [.35 + .4 * bump(t, a.customer, 1.4), .6], armL: walking ? undefined : [-.2, -.3], rim: mixHex(P.blue0, P.halo1, .4) });
    ctx.restore();
  }

  // ---- the four tasks: small cards of light rise from your hands on their words, settle in an arc, fold into one thought
  function cards(ctx, t) {
    if (!you.hands) return;
    const keys = [a.email, a.contract, a.mistake, a.customer];
    const slots = [[YOU.X - 330, -230], [YOU.X - 200, -380], [YOU.X + 30, -410], [YOU.X + 300, -330]];
    const thought = [YOU.X + 50, -330], fold = span(t, a.thinking - .35, a.thinking + .75), cs = 108;
    keys.forEach((k, i) => {
      const u = span(t, k - .45, k + .35); if (u <= 0 || fold >= 1) return;
      const h0 = i < 2 ? you.hands.L : you.hands.R, e = expoOut(u), ef = sineIO(fold);
      let x = lerp(h0[0], slots[i][0], e), y = lerp(h0[1], slots[i][1], e) - Math.sin(Math.PI * u) * 40;
      x = lerp(x, thought[0], ef); y = lerp(y, thought[1], ef);
      const s = cs * lerp(.2, 1, e) * lerp(1, .15, ef), bob = 4 * Math.sin(t * 1.3 + i * 1.7) * (1 - ef);
      taskCard(ctx, t, i, x, y + bob, s, 1 - smooth(span(fold, .7, 1)));
    });
    // the thought (a warm point of light) appears where the cards meet; its thread runs up to your tag
    const th = smooth(span(fold, .55, 1));
    if (th > 0) {
      const br = 1 + .08 * Math.sin(t * 2.2);
      E.halo(ctx, thought[0], thought[1], 120 * th * br, .9, P.halo0, P.core0);
      ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(thought[0], thought[1], 14 * th * br, 0, 6.29); ctx.fill();
      const tu = smooth(span(t, a.thinking + .35, a.thinking + 1.25)), tb = TAG_BOT + 4;
      if (tu > 0) F.trailSpan(ctx, [[thought[0], thought[1] - 16], [thought[0] - 30, (thought[1] + tb) / 2], [TA.X + 60, tb]], 0, tu, { w: 3.2, spark: tu < 1 });
    }
  }
  function taskCard(ctx, t, i, x, y, s, al) {
    if (al <= 0 || s < 2) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, y);
    const w = s, h = s * (i === 3 ? .72 : i === 0 ? .7 : 1.25), p = new Path2D();
    if (i === 3) { p.roundRect(-w / 2, -h / 2, w, h, h * .35); p.moveTo(-w * .18, h / 2 - 1); p.lineTo(-w * .32, h / 2 + h * .32); p.lineTo(-w * .02, h / 2 - 1); }
    else p.roundRect(-w / 2, -h / 2, w, h, w * .06);
    E.glowFill(ctx, p, w * .3, .45, P.halo0);
    ctx.fillStyle = E.rad(ctx, 0, -h * .1, w, [[0, P.core0], [.6, P.core1], [1, P.halo0]]); ctx.fill(p);
    ctx.strokeStyle = mixHex(P.shade0, P.night1, .3); ctx.lineWidth = w * .04; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (i === 0) { ctx.beginPath(); ctx.moveTo(-w * .42, -h * .4); ctx.lineTo(0, h * .1); ctx.lineTo(w * .42, -h * .4); ctx.stroke(); }                 // envelope
    if (i === 1) { for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-w * .32, -h * .32 + k * h * .13); ctx.lineTo(w * (k === 3 ? .1 : .32), -h * .32 + k * h * .13); ctx.stroke(); }
      ctx.beginPath(); for (let k = 0; k <= 12; k++) { const xx = -w * .3 + k * w * .05, yy = h * .3 + Math.sin(k * 1.4) * h * .03; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }  // contract + signature
    if (i === 2) { for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-w * .32, -h * .3 + k * h * .18); ctx.lineTo(w * .32, -h * .3 + k * h * .18); ctx.stroke(); }
      const ru = smooth(span(t, a.mistake + .05, a.mistake + .6)); ctx.strokeStyle = P.halo1; ctx.lineWidth = w * .05; ctx.beginPath(); ctx.ellipse(w * .08, -h * .3 + 2 * h * .18, w * .2, h * .09, 0, -1.2, -1.2 + 6.3 * ru); ctx.stroke(); }  // the ringed mistake
    if (i === 3) { for (let k = 0; k < 2; k++) { ctx.beginPath(); ctx.moveTo(-w * .3, -h * .14 + k * h * .3); ctx.lineTo(w * (k ? .1 : .3), -h * .14 + k * h * .3); ctx.stroke(); } }     // the speech bubble
    ctx.restore();
  }

  // ---- the workshop (the employer): saw-tooth roof, a big warm window, a door the coin comes out of
  function workshop(ctx, t) {
    const { w, h } = WORK, x0 = -w / 2, glow = .55 + .15 * bump(t, coinPay[0] - .3, 1.2);
    const body = new Path2D(); body.moveTo(x0, 0); body.lineTo(x0, -h);
    for (let k = 0; k < 3; k++) { const xa = x0 + k * w / 3; body.lineTo(xa + w / 3 * .78, -h - 150); body.lineTo(xa + w / 3, -h - 150); body.lineTo(xa + w / 3, -h); }
    body.lineTo(x0 + w, 0); body.closePath();
    ctx.fillStyle = E.lin(ctx, x0, 0, x0 + w, 0, [[0, P.night1], [.6, mixHex(P.night1, P.ind2, .5)], [1, P.ind1]]); ctx.fill(body);
    ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 8; ctx.stroke(body);
    for (let k = 0; k < 3; k++) { const xa = x0 + k * w / 3; ctx.fillStyle = rgba(P.halo1, .55 * glow); ctx.fillRect(xa + w / 3 * .8, -h - 140, w / 3 * .17, 130); }   // north lights in the roof teeth
    const win = new Path2D(); win.rect(x0 + 70, -h + 90, w * .52, h * .48);
    E.glowFill(ctx, win, 60, .45 * glow, P.halo0);
    ctx.fillStyle = E.lin(ctx, 0, -h + 90, 0, -h + 90 + h * .48, [[0, mixHex(P.halo0, P.core1, .4)], [1, P.halo1]]); ctx.globalAlpha = .55 + .45 * glow; ctx.fill(win); ctx.globalAlpha = 1;
    ctx.strokeStyle = P.night1; ctx.lineWidth = 9; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x0 + 70 + k * w * .13, -h + 90); ctx.lineTo(x0 + 70 + k * w * .13, -h + 90 + h * .48); ctx.stroke(); }
    ctx.fillStyle = mixHex(P.night0, P.halo1, .25 * bump(t, coinPay[0] - .4, 1)); ctx.fillRect(x0 + w - 220, -230, 130, 230);    // the door (warms as the coin comes out)
  }

  // ---- the shop: a low front with an awning and a lit display window (the cube goes in, the coin comes out)
  function shop(ctx, t) {
    const { w, h } = SHOP, x0 = -w / 2, inn = bump(t, cubeRide[1] - .2, 1.2), out = bump(t, runT[0] - .5, 1.2);
    const body = new Path2D(); body.rect(x0, -h, w, h);
    ctx.fillStyle = E.lin(ctx, x0, 0, x0 + w, 0, [[0, P.ind1], [.5, mixHex(P.night1, P.ind2, .5)], [1, P.night1]]); ctx.fill(body);
    ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 8; ctx.stroke(body);
    // the awning: flat teeth
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.beginPath(); ctx.moveTo(x0 - 30, -h + 10); ctx.lineTo(x0 + w + 30, -h + 10); ctx.lineTo(x0 + w + 30, -h + 60);
    for (let k = 8; k >= 0; k--) { const xx = x0 - 30 + k * (w + 60) / 8; ctx.lineTo(xx + (w + 60) / 16, -h + 92); ctx.lineTo(xx, -h + 60); }
    ctx.closePath(); ctx.fill();
    const win = new Path2D(); win.rect(x0 + 60, -h + 130, w * .55, h * .5);
    const g = .55 + .35 * inn + .25 * out;
    E.glowFill(ctx, win, 60, .5 * g, P.halo0);
    ctx.fillStyle = E.lin(ctx, 0, -h + 130, 0, -h + 130 + h * .5, [[0, mixHex(P.halo0, P.core1, .5)], [1, P.halo1]]); ctx.globalAlpha = Math.min(1, .5 + .5 * g); ctx.fill(win); ctx.globalAlpha = 1;
    // goods on the shelf: small cubes (the things people make)
    for (let k = 0; k < 4; k++) { ctx.fillStyle = rgba(P.shade0, .8); ctx.fillRect(x0 + 90 + k * 80, -h + 130 + h * .5 - 46, 46, 46); }
    ctx.fillStyle = mixHex(P.night0, P.halo1, .2 * out); ctx.fillRect(x0 + w - 170, -230, 110, 230);
  }
}
