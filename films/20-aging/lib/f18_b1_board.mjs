// Film 18 · builder B1 · c02 + c03 + c04 as ONE plan sequence on THE BOARD (44.49 → 230.62). The three scene files (sc02–sc04) all
// return this one draw function, so the chunk seams c02|c03 and c03|c04 are the same function of t (identical frames by construction).
// Plan: docs/shots.md 2.01–4.07 · world: docs/MOTION.md · kit: lib/f18_kit.mjs · seams in/out: lib/f18_seams.mjs (plateTag in, plateHook out).
//
// THE SET (c01's set, extended): you at (−500, Z 3000) on the near edge of the loop; the workshop (X −2300) and the shop (X 1900) on the
// same edge; the town round the loop (seed 1808, as c01). B1 adds: the sky plane (Z 16000, explainer graphics designed in screen space for
// a reference camera and carried by the world camera with true parallax), the shelf and the record fields on the right road (c03), the
// first door behind the record (far-right corner, c03), the fields of thinking along the left road and round the far side (c04), the
// CHEGG and CANVA fields outside the loop among the town, left and right (c04), the column of value on your field (c04 → plateHook).
//
// Camera: framings (world point → screen point at s px/unit, focal f), interpolated per key (target and screen point linear, s and f in
// log), eased sine-S unless noted; every key sits on a word. camDrift on top, the film's cameraFloat on top of that.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f18_kit.mjs';
import { plateTag, TAG_PLATE, plateHook, HOOK_PLATE, SEAM_HALF } from './f18_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, cam3, camDrift, F0 } = E;
const { BOARD, LOOP, gp, wp, stand, loopPt, loopU, COOL, bump } = F;

// ===================================================================================================================== the set
export const Z0 = 3000;
export const YOU = { X: -500, h: 200 };
export const WORK = { X: -2300, w: 820, h: 420 };
export const SHOP = { X: 1900, w: 700, h: 400 };
export const COIN_R = 52;
export const SHELF = { X: 3500, Z: 4300, w: 900, h: 1100 };          // c03: the shelf of encyclopedias (right road, outside)
export const REC = { X: 1800, Z: 6600, r: 380 };                    // c03: the record of light (further along the right road, inside)
export const DOOR1 = { X: 2800, Z: 9200, h: 1000 };                 // c03: the first door, behind the record field (outside the far-right corner)
export const CHEGG = { X: -3800, Z: 3700 };                          // c04: the CHEGG field (outside the loop, left, among the town)
export const CANVA = { X: 3900, Z: 3700 };                            // c04: the CANVA field (outside the loop, right, among the town)
export const TA4 = { w: 300, hb: 300 };                              // c04: your tag (its eyelet ring r = .045 w ≈ the plate's 22 px at s 1.02)
export const HOOK = { eye: -(TA4.hb + TA4.w * 1.32), r: TA4.w * .045, s: HOOK_PLATE.r / (TA4.w * .045) };
export const ZSKY = 16000;                                   // the explainer plane in the sky (just in front of the zero line)
const TOWN = (() => { const r = E.prng(1808), out = [];      // c01's town (same seed, same houses)
  for (let i = 0; i < 14; i++) { const side = i % 3, w = 300 + r() * 260, h = 240 + r() * 200;
    const X = side === 0 ? -LOOP.half - 500 - r() * 900 : side === 1 ? LOOP.half + 500 + r() * 900 : -2200 + r() * 4400;
    const Z = side === 2 ? LOOP.cz + LOOP.half + 500 + r() * 700 : LOOP.cz - LOOP.half + 900 + r() * (2 * LOOP.half - 600);
    out.push({ X, Z, w, h, n: 1 + Math.floor(r() * 2.5), seed: 10 + i }); }
  return out.sort((p, q) => q.Z - p.Z); })();

// ===================================================================================================================== camera
// a framing: world point (X, Y from the ground, up = −, Z) seen at screen (sx, sy) with s px per world unit, focal f
export const fr = (X, Y, Z, s, sx = W / 2, sy = H / 2, f = F0) => ({ X, Y, Z, s, sx, sy, f });
export const camOf = (q) => { const dz = q.f / q.s; return cam3({ x: q.X - (q.sx - W / 2) / q.s, y: q.Y + BOARD.GY - (q.sy - H / 2) / q.s, z: q.Z - dz, f: q.f }); };
const EASE = { s: sineIO, q: quartIO, o: expoOut, i: expoIn, l: (x) => clamp(x), si: (x) => 1 - Math.cos(clamp(x) * Math.PI / 2), so: (x) => Math.sin(clamp(x) * Math.PI / 2) };
export function frAt(t, K) {
  if (t <= K[0][0]) return K[0][1];
  if (t >= K[K.length - 1][0]) return K[K.length - 1][1];
  let i = 0; while (t > K[i + 1][0]) i++;
  const a = K[i][1], b = K[i + 1][1], u = EASE[K[i + 1][2] || 's']((t - K[i][0]) / (K[i + 1][0] - K[i][0]));
  const g = (p, q) => Math.exp(lerp(Math.log(p), Math.log(q), u));
  return { X: lerp(a.X, b.X, u), Y: lerp(a.Y, b.Y, u), Z: lerp(a.Z, b.Z, u), sx: lerp(a.sx, b.sx, u), sy: lerp(a.sy, b.sy, u), s: g(a.s, b.s), f: g(a.f, b.f) };
}
// a plane at depth Z whose drawing is designed in screen space as seen from camera ref: draw it for the live camera c (true parallax)
export function planeM(c, ref, Z) {
  const kr = ref.f / (Z - ref.z), dz = Z - c.z; if (dz < 30) return null;
  const kc = c.f / dz, k = kc / kr;
  return { k, e: W / 2 + (ref.x - c.x) * kc - W / 2 * k, f: H / 2 + (ref.y - c.y) * kc - H / 2 * k };
}
const mapPt = (m, u, v) => [m.e + u * m.k, m.f + v * m.k];
function onPlane(ctx, m, fn) { if (!m) return; ctx.save(); ctx.setTransform(m.k, 0, 0, m.k, m.e, m.f); fn(m.k); ctx.restore(); }
const zeroY = (c) => { const p = wp(c, 0, BOARD.GY, BOARD.cz + BOARD.half); return p ? p[1] : H / 2; };

// small type helpers (screen space)
const lab = (ctx, s, x, y, size, u, o = {}) => { if (u <= 0) return; const xx = o.right ? x - F.measure(s, size, !!o.serif, 600) : x; F.maskLine(ctx, [[s, o.warm ?? 0]], xx, y, size, u, { serif: !!o.serif, align: o.center ? 'center' : undefined, col: o.col ?? P.cream, glow: o.glow ?? !!o.serif, weight: 600 }); };
const inOut = (t, a, b, d = .7, d2 = .55) => F.rise(span(t, a, a + d)) * (b == null ? 1 : 1 - smooth(span(t, b, b + d2)));

// ===================================================================================================================== the take
export function b1Take(T) {
  if (T.__b1) return T.__b1;
  E.prepareEditorial();
  const G = (p, after = 0, n = 0) => T.G(p, n, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  // c02
  a.T0 = G('At the end of'); a.twenty = G('twenty dollars', a.T0); a.novels = G('eight novels', a.T0); a.later = G('Two years later', a.T0); a.seven = G('seven cents', a.T0);
  a.keeps = G('And it keeps', a.T0); a.thirteen = G('thirteen times', a.T0); a.year1 = G('year after year', a.T0); a.year2 = G('year', a.year1 + .5); a.year2E = GE('year after year', a.T0);
  a.most = G('Most people', a.T0); a.job = G('takes my job', a.most); a.pay = G('paycheck', a.most); a.buys = G('buys anything', a.most); a.coll = G('collapses', a.most);
  a.former = G('A former Google'); a.mo = G('Mo Gawdat', a.former); a.dollar = G('for a dollar', a.former); a.two = G('for two', a.former); a.disappear = G('disappear', a.former);
  a.pressure = G('And you can already'); a.april = G('Between April', a.pressure); a.moreP = G('more profit', a.april); a.nine = G('two thousand nine', a.april); a.nineE = GE('two thousand nine', a.april);
  a.smallest = G('smallest slice', a.april); a.y1947 = G('nineteen forty-seven', a.april); a.y1947E = GE('nineteen forty-seven', a.april);
  a.bigger = G('Bigger profits', a.april); a.smaller = G('Smaller slice', a.april); a.same = G('Same three months', a.smaller); a.sameE = GE('Same three months', a.smaller);
  // c03
  a.c03 = G("But that's not the real ending");
  a.real = G('real ending', a.c03); a.price = G('the price', a.c03); a.capOnly = G('Capitalism can only', a.c03); a.scarce = G('scarce', a.c03); a.air = G('air', a.scarce); a.plenty = G('plenty', a.air);
  a.imagine = G('Now imagine', a.c03); a.plentiful = G('plentiful as air', a.imagine); a.cheaper = G('cheaper', a.plentiful); a.cheaper2 = G('cheaper', a.cheaper + .3); a.nothing = G('nothing left', a.plentiful);
  a.system = G('A system built'); a.runs = G('runs out', a.system); a.where = G('So where does'); a.money = G('money go', a.where); a.still = G('still gets paid', a.where); a.leave = G('leave you', a.where);
  a.watched = G("We've watched"); a.hitZero = G('hit zero', a.watched); a.sameQ = G('same question', a.watched);
  a.y1990 = G('In nineteen ninety'); a.brit = G('Britannica', a.y1990); a.sets = G('hundred and twenty thousand', a.y1990); a.fact = G('price of a fact', a.y1990);
  a.y2012 = G('In twenty twelve', a.y1990); a.y244 = G('two hundred and forty-four', a.y2012); a.presses = G('presses stopped', a.y2012);
  a.wiki = G('Wikipedia runs'); a.m190 = G('hundred and ninety million', a.wiki); a.free = G('free to you', a.wiki);
  a.music = G('Music', a.wiki); a.song = G('song hit zero', a.music); a.half = G('more than half', a.music); a.subs = G('subscription', a.music);
  a.didnt = G("The price didn't die"); a.moved = G('moved', a.didnt); a.off = G('off the song', a.didnt); a.door = G('onto the door', a.didnt); a.doorE = GE('onto the door', a.didnt);
  // c04
  a.c04 = G('Now the same thing is reaching'); a.reach = G('reaching thinking', a.c04); a.first = G('First words', a.c04);
  a.draft = G('draft', a.first); a.summary = G('summary', a.first); a.bug = G('bug fix', a.first); a.cents = G('cents', a.first);
  a.advice = G('Then advice', a.c04); a.second = G('second opinion', a.advice); a.scan = G('scan', a.advice); a.lease = G('lease', a.advice);
  a.everything = G('Then everything built', a.c04); a.drug = G('drug', a.everything); a.bridge = G('bridge', a.everything); a.lesson = G('lesson', a.everything);
  a.chegg = G('Chegg', a.c04); a.n99 = G('ninety-nine percent', a.chegg); a.halfStaff = G('half its staff', a.chegg); a.named = G('named A.I.', a.chegg);
  a.canva = G('Canva made'); a.slow = G('growth slowdown', a.canva); a.isnt = G("isn't taking those jobs", a.canva); a.either = G('either way', a.canva);
  a.people = G('The people who built'); a.fail = G("didn't fail", a.people); a.left = G('price left', a.people);
  a.c05 = G('And the value');
  T.__b1 = take(a);
  return T.__b1;
}

function take(a) {
  const T0 = a.T0, Tout = a.c05;
  // ---------------------------------------------------------------------------------------------------- framings and camera keys
  const A = fr(YOU.X, 0, Z0, 1.1, 520, 1000);                             // c02 2.01–2.02: you big lower left, the sky over you is the graph
  const REF_A = camOf(A);
  const K = [
    [T0 + SEAM_HALF, fr(YOU.X, -260, Z0, 1.55, 560, 820)],                // hidden under the tag face: a little closer and higher
    [a.twenty - .3, A],                                                   // pull back out of the face: the tag hangs in the sky over you
    [a.most, fr(YOU.X + 30, -4, Z0, 1.13, 528, 1002)],                    // breathing push while the price falls
    [a.job + .3, fr(-1300, 0, Z0, .52, 960, 905)],                        // 2.03 down to the loop: the workshop, the road, you
    [a.pay + .25, fr(-1260, 0, Z0, .53, 960, 905)],
    [a.buys + .55, fr(250, 0, Z0, .52, 960, 905)],                        // along the road to the shop
    [a.coll + 1.5, fr(0, 0, Z0, .193, 960, 1029, 850)],                  // rise to the whole ring (c01's widest): its light runs out
    [a.disappear + 1.0, fr(YOU.X - 40, 0, Z0, .74, 470, 1012)],           // 2.04 a long slow descent to you under the quote
    [a.april + .3, fr(YOU.X, 0, Z0, .8, 960, 1030)],                      // 2.05 you in the middle under the two coins
    [a.sameE + 1.2, fr(YOU.X + 10, 0, Z0, .83, 960, 1034)],
    // c03
    [a.c03 + .9, fr(YOU.X + 10, 0, Z0, .83, 960, 1036)],                  // the coins have sunk back into the loop: hold
    [a.price + 1.3, fr(YOU.X, -560, Z0, .6, 960, 560)],                    // 3.01 up: your tag lowers out of the dark and swings into the centre
    [a.scarce + .2, fr(150, -420, Z0, .4, 960, 640)],                      // 3.02 pull back: tags over the board
    [a.air + .4, fr(YOU.X + 60, -260, Z0, .58, 860, 820)],                  // back to you: a small tag finds nothing to hang on
    [a.plentiful - .2, fr(YOU.X + 40, -250, Z0, .6, 860, 830)],
    [a.nothing + 1.3, fr(0, 0, Z0, .2, 960, 1012, 850)],                    // ★ 3.03 rise to the widest picture: the sky fills with air
    [a.system + .4, fr(30, 0, Z0, .203, 962, 1010, 850)],                   // hold the widest picture a moment
    [a.runs + .3, fr(-500, 0, Z0, .42, 960, 900)],                         // 3.04 down to the near edge: the coin rolls on and slows
    [a.money + .4, fr(-80, 0, Z0, .5, 960, 930)],                          // following it until it stops
    [a.leave - .2, fr(-30, 0, Z0, .64, 960, 990)],                         // 3.05 you and the stopped coin
    [a.hitZero - .9, fr(-20, 0, Z0, .65, 962, 992)],
    [a.sameQ + .9, fr(SHELF.X + 250, -560, SHELF.Z, .36, 900, 700)],         // 3.06 travel right along the road to an older field: the shelf
    [a.y2012, fr(SHELF.X + 230, -560, SHELF.Z, .375, 900, 700)],             // breathing push
    [a.music - .3, fr(SHELF.X + 215, -560, SHELF.Z, .385, 900, 700)],
    [a.song - .3, fr(REC.X + 150, -620, REC.Z, .42, 860, 620)],             // along the road to the record
    [a.moved - .2, fr(REC.X + 140, -620, REC.Z, .43, 860, 620)],
    [a.door + .6, fr(REC.X + 250, -700, REC.Z + 500, .38, 900, 610)],       // 3.10 back a little: the first door rises behind the record
    [a.c04 - .7, fr(REC.X + 250, -700, REC.Z + 520, .385, 900, 610)],
    // c04
    [a.c04 + 1.4, fr(300, -200, Z0 + 1300, .3, 960, 840), 'si'],         // 4.01 pull back over the loop on the way home (no rush through the fields)
    [a.first + .5, fr(-560, -140, Z0, .54, 960, 880), 'so'],                //      and down to your field: you, your tag, the small fields, the two bigger ones
    [a.scan - .3, fr(-500, -140, Z0, .6, 960, 884)],                       // 4.02 one slow push while the three tags sink
    [a.lease + .9, fr(-330, -140, Z0, .62, 960, 886)],                     // 4.03 drifting on toward the two bigger fields
    [a.lesson + .7, fr(-250, 0, Z0, .25, 960, 1010, 900)],                   // ★ 4.04 pull back: the big fields round the far side
    [a.chegg + 1.7, fr(CHEGG.X, -300, CHEGG.Z - 300, .55, 760, 800)],         // 4.05 out to the left, into the town: the CHEGG field
    [a.named + .4, fr(CHEGG.X + 30, -300, CHEGG.Z - 300, .62, 780, 806)],     //      slow push while the numbers come
    [a.canva + .3, fr(50, -300, CHEGG.Z, .25, 960, 820), 'si'],             // 4.06 pull back across the town …
    [a.canva + 2.3, fr(CANVA.X, -300, CANVA.Z - 300, .55, 1160, 800), 'so'],  //      … and in to the CANVA field on the right
    [a.either + .3, fr(CANVA.X - 30, -300, CANVA.Z - 300, .63, 1140, 806)],
    [a.fail + .25, fr(50, -330, Z0 + 700, .18, 960, 770)],                  // 4.07 both fields and you
    [a.left + .45, fr(YOU.X, HOOK.eye + 260, Z0 - 10, .78, 960, 560, 3200)], // the tags leave: up toward your empty hook
    [Tout - SEAM_HALF, fr(YOU.X, HOOK.eye, Z0 - 10, HOOK.s, HOOK_PLATE.x, HOOK_PLATE.y, 46000)],   // into the hook: the horizon drops away (long lens)
  ];
  const TAGS = tagsPlan(a);
  const REF_Q = camOf(fr(YOU.X - 40, 0, Z0, .78, 470, 1015)), REF_D = camOf(fr(YOU.X, 0, Z0, .8, 960, 1030));
  const GAWDAT = 'The very base of capitalism, which is labor arbitrage – to hire you for a dollar and then sell what you make for two – is going to disappear.';
  const FP = { L: [560, 440], R: [1360, 440], r0: 60 };              // firstPicture's coin centres (x ± 400, y 440) and its smallest radius (.4 r)
  const coinT = { up: [a.pressure, a.april - .15], split: [a.april - .15, a.april + 1.1], back: [a.sameE + 1.15, a.c03 + .75] };
  const uL = (t) => span(t, a.moreP - .5, a.nineE + .2) * (1 - span(t, a.sameE + .1, a.sameE + 1.15));
  const uR = (t) => span(t, a.smallest - .5, a.y1947E + .3) * (1 - span(t, a.sameE + .1, a.sameE + 1.15));


  // ======================================================================================================== the world (far → near)
  function world(ctx, t, c) {
    F.sky(ctx, c, t, { air: airAt(t) });
    { const ai = airAt(t); if (ai > 0) E.stars(ctx, 1820, 1300, t, [0, 0, W, Math.max(200, zeroY(c) - 30)], .7 * ai * ai); }
    { const p = wp(c, 7600, BOARD.GY - 1300, 26000); if (p) F.coolDisc(ctx, p[0], p[1], 520 * p[2], .8); }
    F.board(ctx, c, t, roadState(t));
    { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, W, 0, W * .25, 0, [[0, rgba(COOL.edge, .08)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    const L = [];                                                          // drawables, painted far → near
    for (const hs of TOWN) L.push([hs.Z, () => stand(ctx, c, hs.X, hs.Z, () => F.house(ctx, t, hs.w, hs.h, { win: hs.n, lit: .45 * townLit(t), seed: hs.seed }))]);
    L.push([Z0 + 120, () => stand(ctx, c, WORK.X, Z0 + 120, () => workshop(ctx, t))]);
    L.push([Z0 + 121, () => stand(ctx, c, SHOP.X, Z0 + 120, () => shop(ctx, t))]);
    L.push([LOOP.cz - LOOP.half, () => coinWorld(ctx, t, c)]);
    L.push([Z0, () => stand(ctx, c, 0, Z0, () => { youPool(ctx, t); you(ctx, t); thought(ctx, t); })]);
    props03(L, ctx, t, c);
    props04(L, ctx, t, c);
    L.sort((p, q) => q[0] - p[0]); for (const [, fn] of L) fn();
  }
  const airAt = (t) => .12 * smooth(span(t, a.plenty - .3, a.plenty + 1)) + .88 * sineIO(span(t, a.plentiful - .2, a.nothing + 2.4));
  function townLit(t) { return 1 - .5 * smooth(span(t, a.coll, a.coll + 1.6)); }
  // the road: c01 left the whole ring lit (.47 over a base of .4); 2.03 "collapses" drains it round the loop
  function roadState(t) {
    const base = lerp(.4, .2, smooth(span(t, a.coll - .2, a.coll + 1.8)));
    const u0 = loopU(SHOP.X - 120), dr = sineIO(span(t, a.coll - .1, a.coll + 1.7));
    const lit = dr < 1 ? [[u0 + dr, u0 + 1 - 1e-4, .47 * (1 - .3 * dr)]] : [];
    return { road: base, lit, ticks: .35, zero: 1 };
  }

  // ---- the coin: 2.03 rolls out of the workshop toward you and stops short on "paycheck"; rises into the sky in 2.05 (sky02 draws it)
  const uWork = loopU(WORK.X + 260), uYou = loopU(YOU.X + 40);
  const roll = [a.job - 1.2, a.pay];                                   // rolling at speed, stops dead on "paycheck"
  const uStop = lerp(uWork, uYou, .62);
  const roll3 = [a.system + .25, a.money], uEnd3 = loopU(450);            // 3.04: it rolls on along the near edge, slower and slower, stops on "money go"
  const SPIN_REST = (() => { const w = ((uStop * 60) % Math.PI + Math.PI) % Math.PI; return w > Math.PI / 2 ? w - Math.PI : w; })();   // the resting road coin's turn (|cos| only)
  const coinU = (t) => t < roll[1] ? lerp(uWork, uStop, span(t, roll[0], roll[1]) ** 1.0) : t < roll3[0] ? uStop : lerp(uStop, uEnd3, 1 - (1 - span(t, ...roll3)) ** 2.2);
  const COIN_UP = a.pressure;                                           // the stopped coin lifts off the road (2.05)
  function coinWorld(ctx, t, c) {
    if (t < roll[0] - .35 || (t >= COIN_UP && t < coinT.back[1])) return;
    const show = smooth(span(t, roll[0] - .35, roll[0] + .05));         // it rolls out of the workshop door (the door is behind it)
    const u = coinU(t), [x, z] = loopPt(u);
    const t1 = t < roll3[0] ? roll[1] : roll3[1];
    const spin = (t < roll[1] || (t > roll3[0] && t < roll3[1])) ? u * 60 : u * 60 + .5 * Math.sin((t - t1) * 11) * Math.exp(-(t - t1) * 3.5);
    const dim = 1 - .45 * smooth(span(t, roll[1] + .2, roll[1] + 1.2)) + .35 * bump(t, roll3[0] - .3, roll3[1] - roll3[0] + .3);
    stand(ctx, c, x, z, () => {
      ctx.save(); ctx.globalAlpha = show;
      F.coin(ctx, t, 0, -COIN_R, COIN_R, { spin, glow: dim });
      E.halo(ctx, 0, -COIN_R, COIN_R * 4, .5 * dim, P.halo0, P.core1);
      ctx.restore();
    });
  }
  // world coin position in screen space (for the coin that rises into the sky)
  const coinScreen = (c) => { const [x, z] = loopPt(uStop); const p = wp(c, x, BOARD.GY - COIN_R, z); return p ? [p[0], p[1], COIN_R * p[2]] : [960, 900, 30]; };

  // ---- you
  function youPool(ctx, t) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(YOU.X, 4); ctx.scale(1, .12);
    ctx.fillStyle = E.rad(ctx, 0, 0, 520, [[0, rgba(P.halo1, .28)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 520, 0, 6.29); ctx.fill(); ctx.restore();
  }
  function you(ctx, t) {
    const br = Math.sin(t * 1.6) * .03, S = (x0, x1) => smooth(span(t, x0, x1));
    // look: up at the tag in the sky (2.01/2.02), follows it down; turn to the workshop (2.03), back to us; up at the quote, up at the coins
    let look = lerp(.95, .55, S(a.later, a.seven + .6)) - .3 * S(a.most - .3, a.most + .6) + .45 * S(a.mo - .6, a.mo + .6)
      - .2 * S(a.disappear, a.disappear + 1) + .35 * S(a.pressure, a.pressure + 1.2) - .3 * S(a.nineE, a.nineE + 1.5) + .45 * S(a.smaller - .2, a.smaller + .6);
    // c03: down to the coin, up to your tag on "the price", follow the small tag, up into the air on "plentiful", down; up again on "leave you"
    look += -.6 * S(a.c03, a.c03 + 1) + .7 * S(a.price - .2, a.price + .8) - .3 * S(a.air, a.plenty + .8) + .4 * S(a.plentiful - .3, a.plentiful + .6)
      - .7 * S(a.system, a.system + 1.2) + .75 * S(a.leave - .3, a.leave + .7) - .55 * S(a.watched + 2, a.watched + 3.5);
    // dir: right (toward the sky graph) in 2.01, left toward the workshop in 2.03, right again; on "leave you" you turn round to us
    const turnL = S(a.most - .2, a.most + .5) * (1 - S(a.buys - .2, a.buys + .4)) + S(a.leave - .4, a.leave) * (1 - S(a.c04 + .5, a.c04 + 1));
    const dir = turnL > .5 ? -1 : 1;
    // hands: open toward the coin that should reach you; they drop when it stops. c03: the right hand up for the thought
    const wait = S(a.job + .3, a.job + .9) * (1 - S(a.pay + .2, a.pay + 1));
    const up = S(...HANDUP) * (1 - S(a.nothing + 1.4, a.nothing + 2.6));
    const armR = [lerp(.16 + .9 * wait + br, 2.5 + br * .5, up), lerp(.1 + 1.3 * wait, 2.75, up)], armL = [-.18 - .5 * wait - br, -.08 - .9 * wait];
    const breathe = 1 + .03 * bump(t, a.plenty - .1, 1.6) + .008 * Math.sin(t * 1.6);
    ctx.save(); ctx.translate(YOU.X, 0); ctx.scale(1, breathe);
    const h = E.du(ctx, 0, 0, YOU.h, { dir, look: clamp(look), light: dir, armR, armL });
    ctx.restore();
    you.hands = { R: [h.R[0] + YOU.X, h.R[1] * breathe], L: [h.L[0] + YOU.X, h.L[1] * breathe] };
  }

  // ---- the workshop (c01's), its window goes dark on "takes my job" (a flicker first)
  function workshop(ctx, t) {
    const { w, h } = WORK, x0 = -w / 2;
    const fl = t > a.job - .35 && t < a.job ? .5 + .5 * Math.sin((t - a.job) * 70) : 1;
    const glow = (.55 * fl) * (1 - .82 * smooth(span(t, a.job, a.job + .35)));
    const body = new Path2D(); body.moveTo(x0, 0); body.lineTo(x0, -h);
    for (let k = 0; k < 3; k++) { const xa = x0 + k * w / 3; body.lineTo(xa + w / 3 * .78, -h - 150); body.lineTo(xa + w / 3, -h - 150); body.lineTo(xa + w / 3, -h); }
    body.lineTo(x0 + w, 0); body.closePath();
    ctx.fillStyle = E.lin(ctx, x0, 0, x0 + w, 0, [[0, P.night1], [.6, mixHex(P.night1, P.ind2, .5)], [1, P.ind1]]); ctx.fill(body);
    ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 8; ctx.stroke(body);
    for (let k = 0; k < 3; k++) { const xa = x0 + k * w / 3; ctx.fillStyle = rgba(P.halo1, .55 * glow); ctx.fillRect(xa + w / 3 * .8, -h - 140, w / 3 * .17, 130); }
    const win = new Path2D(); win.rect(x0 + 70, -h + 90, w * .52, h * .48);
    E.glowFill(ctx, win, 60, .45 * glow, P.halo0);
    ctx.fillStyle = E.lin(ctx, 0, -h + 90, 0, -h + 90 + h * .48, [[0, mixHex(P.night1, mixHex(P.halo0, P.core1, .4), glow / .55)], [1, mixHex(P.night1, P.halo1, glow / .55)]]); ctx.globalAlpha = .55 + .45 * glow; ctx.fill(win); ctx.globalAlpha = 1;
    ctx.strokeStyle = P.night1; ctx.lineWidth = 9; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x0 + 70 + k * w * .13, -h + 90); ctx.lineTo(x0 + 70 + k * w * .13, -h + 90 + h * .48); ctx.stroke(); }
    ctx.fillStyle = mixHex(P.night0, P.halo1, .3 * bump(t, roll[0] - .5, 1)); ctx.fillRect(x0 + w - 220, -230, 130, 230);
  }
  // ---- the shop (c01's), its window dims on "buys anything"
  function shop(ctx, t) {
    const { w, h } = SHOP, x0 = -w / 2;
    const body = new Path2D(); body.rect(x0, -h, w, h);
    ctx.fillStyle = E.lin(ctx, x0, 0, x0 + w, 0, [[0, P.ind1], [.5, mixHex(P.night1, P.ind2, .5)], [1, P.night1]]); ctx.fill(body);
    ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 8; ctx.stroke(body);
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.beginPath(); ctx.moveTo(x0 - 30, -h + 10); ctx.lineTo(x0 + w + 30, -h + 10); ctx.lineTo(x0 + w + 30, -h + 60);
    for (let k = 8; k >= 0; k--) { const xx = x0 - 30 + k * (w + 60) / 8; ctx.lineTo(xx + (w + 60) / 16, -h + 92); ctx.lineTo(xx, -h + 60); }
    ctx.closePath(); ctx.fill();
    const win = new Path2D(); win.rect(x0 + 60, -h + 130, w * .55, h * .5);
    const g = .55 * (1 - .8 * smooth(span(t, a.buys + .1, a.buys + .9)));
    E.glowFill(ctx, win, 60, .5 * g, P.halo0);
    ctx.fillStyle = E.lin(ctx, 0, -h + 130, 0, -h + 130 + h * .5, [[0, mixHex(P.night1, mixHex(P.halo0, P.core1, .5), g / .55)], [1, mixHex(P.night1, P.halo1, g / .55)]]); ctx.globalAlpha = Math.min(1, .5 + .5 * g); ctx.fill(win); ctx.globalAlpha = 1;
    for (let k = 0; k < 4; k++) { ctx.fillStyle = rgba(P.shade0, .8); ctx.fillRect(x0 + 90 + k * 80, -h + 130 + h * .5 - 46, 46, 46); }
    ctx.fillStyle = P.night0; ctx.fillRect(x0 + w - 170, -230, 110, 230);
  }

  // ======================================================================================================== c02 · the sky as explainer
  function sky02(ctx, t, c) {
    if (t >= a.c03 + 2) return;
    const m = planeM(c, REF_A, ZSKY), zy = zeroY(REF_A);
    // ---- 2.01–2.02: your tag rides the falling price line to the zero line ----------------------------------------------------
    const tg = TAGS.at(t, zy);
    // the trace (the price line) behind the tag, sinking into the zero line on "Most people"
    const sink = smooth(span(t, a.most - .2, a.most + 1.1));
    if (tg.trace.length > 1 && sink < 1) {
      onPlane(ctx, m, () => {
        ctx.save(); ctx.beginPath(); ctx.rect(-2000, -2000, 6000, zy + 2000 - 1); ctx.clip();
        const pts = tg.trace.map(([x, y]) => [x, lerp(y, zy + 40, expoIn(clamp(sink * 1.15 - .15 * (x - 600) / 1000)))]);
        F.trailSpan(ctx, pts, 0, 1, { w: 2.6, spark: false, a: 1 - .3 * sink });
        ctx.restore();
      });
      if (sink > 0) { const p = mapPt(m, 960, zy); const g = bump(t, a.most + .2, 1.6); if (g > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, 0, p[1] - 30, 0, p[1] + 6, [[0, rgba(P.halo1, 0)], [1, rgba(P.halo1, .28 * g)]]); ctx.fillRect(0, p[1] - 30, W, 36); ctx.restore(); } }
    }
    // the tag itself (screen space; during the pull back it zooms out of the plate's face about a fixed point)
    const P1 = mapPt(m, tg.x, tg.y), w1 = tg.w * m.k;
    let x = P1[0], y = P1[1], w = w1, cool = tg.cool, emit = tg.emitV, sway = .012 * Math.sin(t * 1.3) + tg.swing;
    const pull = span(t, T0 + SEAM_HALF, a.twenty - .3);
    if (pull < 1) {
      const e = sineIO(pull), r = TAG_PLATE.w / w1, wE = Math.exp(lerp(Math.log(TAG_PLATE.w), Math.log(w1), e));
      const Fx = (TAG_PLATE.x - r * P1[0]) / (1 - r), Fy = (TAG_PLATE.y - r * P1[1]) / (1 - r);
      x = Fx + (P1[0] - Fx) * wE / w1; y = Fy + (P1[1] - Fy) * wE / w1; w = wE;
      cool = lerp(TAG_PLATE.cool, tg.cool, e); emit = lerp(.35, tg.emitV, e); sway = .012 * Math.sin(t * 1.3) + tg.swing * e;
    }
    const melt = smooth(span(t, a.most + .25, a.most + 1.7));
    if (melt < 1) F.tag(ctx, t, x, y, w, { text: tg.text, u: tg.u, size: tg.size, sink: tg.sink, cool, swing: sway, emit: (ts) => Math.max(emit, .7 * bump(ts, a.most + .2, 1.7)), seed: 18, thread: 4000, glow: tg.glow, melt, threadA: 1 - melt });
    else if (t < a.most + 4.5) F.evap(ctx, t, [[x - w * .4, y + w * 1.32], [x + w * .4, y + w * 1.32]], (ts) => .7 * bump(ts, a.most + .2, 1.7), { seed: 18, size: w * .009, rise: w * 1.32 * .9, cool });
    quote02(ctx, t, c);
    first02(ctx, t, c);
    // ---- type of 2.01 / 2.02 (on the plane) --------------------------------------------------------------------------------
    onPlane(ctx, m, () => {
      const out01 = a.keeps - .1, out02 = a.most + .1;
      lab(ctx, 'GPT-3.5-LEVEL A.I.', 1830, 112, 34, inOut(t, a.novels - .15, out01), { right: true });
      lab(ctx, 'PRICE PER 1M TOKENS (≈ 8 NOVELS)', 1830, 156, 28, inOut(t, a.novels + .05, out01), { right: true, col: P.halo0 });
      lab(ctx, 'STANFORD AI INDEX 2025', 1830, 192, 22, inOut(t, a.novels + .25, out01), { right: true, col: P.halo2 });
      lab(ctx, 'NOV 2022', TAGS.start[0], TAGS.start[1] + TAGS.start[2] * 1.32 + 52, 28, inOut(t, a.later - .3, out01), { center: true, col: P.halo0 });
      lab(ctx, 'OCT 2024', TAGS.land[0], zy + 52, 28, inOut(t, a.seven - .1, out01), { center: true, col: P.halo0 });
      { const u = inOut(t, a.thirteen - .1, out02, .8), wN = F.measure('13×', 132, true);   // "≈" is not in Instrument Serif: set it in Inter
        lab(ctx, '13×', 1030, 432, 132, u, { serif: true, center: true, warm: smooth(span(t, a.thirteen, a.thirteen + .6)) });
        lab(ctx, '≈', 1030 - wN / 2 - 18, 418, 64, u, { right: true }); }
      lab(ctx, 'CHEAPER A YEAR', 1000, 486, 34, inOut(t, a.thirteen + .1, out02), { center: true });
      lab(ctx, 'EPOCH AI · 3-YEAR AVERAGE', 1000, 524, 22, inOut(t, a.thirteen + .3, out02), { center: true, col: P.halo2 });
    });
  }

  // ---- 2.04: Gawdat's words in the sky over the dark loop (word for word, the voice paraphrases him); two phrases warm on their words
  function quote02(ctx, t, c) {
    if (t < a.mo - .5 || t > a.pressure + 1.5) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, E.drift(t, 4, 3), E.drift(t, 3, 7)); {
      F.quote(ctx, t, { x: 790, y: 190, w: 1010, size: 60, text: GAWDAT, t0: a.mo - .15, t1: a.pressure - .35, stagger: .16,
        attr: 'MO GAWDAT · FORMER GOOGLE X · BUSINESS INSIDER, 2025', attrSize: 24, gold: [['for a dollar', a.dollar], ['for two', a.two]] });
    } ctx.restore();
  }
  // ---- 2.05–2.06: the stopped coin rises into the sky and splits into THE FIRST PICTURE (two coins, two measures); back down at the end
  function first02(ctx, t, c) {
    if (t < coinT.up[0] || t >= coinT.back[1]) return;
    const m = planeM(c, REF_D, 14000), cs = coinScreen(c);
    const mid = mapPt(m, 960, 440), pL = mapPt(m, ...FP.L), pR = mapPt(m, ...FP.R), r0 = FP.r0 * m.k;
    // a coin whose gold drains away in a sweep (g 1 → 0) into an empty dial (firstPicture's coin at u → 0); a short blend from the plain coin
    const gold = (x, y, r, g, plain = 0, k = 0) => {          // k: the plain coin turns into the road coin's look (its rest spin, its dimmer glow)
      if (plain < 1) F.coin(ctx, t, x, y, r, { pie: g });
      if (plain > 0) { ctx.save(); ctx.globalAlpha = plain; F.coin(ctx, t, x, y, r, { glow: plain < 1 ? 0 : lerp(1, .55, k), spin: k * SPIN_REST }); ctx.restore(); }
      if (g > 0) E.halo(ctx, x, y, r * lerp(3.2, 4, k), lerp(.4, .5 * .55, k) * g, P.halo0, P.core1); };
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (t < coinT.split[0]) {                                            // rising: an arc up from the road to the middle of the sky
      const e = sineIO(span(t, ...coinT.up)), x = lerp(cs[0], mid[0], e), y = lerp(cs[1], mid[1], e) - Math.sin(Math.PI * e) * 60, r = lerp(cs[2], r0, e);
      F.coin(ctx, t, x, y, r, { spin: (1 - e) * 9.4 }); E.halo(ctx, x, y, r * lerp(4, 3.2, e), lerp(.5, .4, e), P.halo0, P.core1);
    } else if (t < coinT.back[0]) {                                     // split into two, the gold drains into two empty dials, then firstPicture
      const e = quartIO(span(t, ...coinT.split)), g = 1 - sineIO(span(t, coinT.split[0] + .35, coinT.split[1] + .5)), pl = 1 - smooth(span(t, coinT.split[0], coinT.split[0] + .3));
      for (const [p, u] of [[pL, uL(t)], [pR, uR(t)]]) {
        if (u > 0) continue;
        const x = lerp(mid[0], p[0], e), y = lerp(mid[1], p[1], e) - Math.sin(Math.PI * e) * 26, br = 1 + .02 * Math.sin(t * 1.7 + p[0]);
        gold(x, y, r0 * br, g, pl);
      }
    } else {                                                            // back: the two dials close into one coin and sink into the loop
      const e = sineIO(span(t, ...coinT.back)), j = smooth(span(e, 0, .45)), g = smooth(span(e, .1, .5));
      const x = lerp(lerp(pL[0], pR[0], .5 * j), cs[0], smooth(span(e, .35, 1))), y = lerp(pL[1], cs[1], smooth(span(e, .35, 1)));
      const xr = lerp(lerp(pR[0], pL[0], .5 * j), cs[0], smooth(span(e, .35, 1)));
      const r = lerp(r0, cs[2], smooth(span(e, .35, 1)));
      const pl = smooth(span(e, .55, .85)), k = smooth(span(e, .8, 1));
      if (j < 1) gold(xr, y, r, g, pl);
      gold(x, y, r, g, pl, k);
    }
    ctx.restore();
    onPlane(ctx, m, () => F.firstPicture(ctx, t, { uL: uL(t), uR: uR(t), hiL: smooth(span(t, a.bigger - .1, a.bigger + .6)) * (1 - span(t, a.sameE + .1, a.sameE + .8)),
      hiR: .5 * bump(t, a.smaller - .1, 1.2), date: span(t, a.same - .15, a.same + .8) * (1 - span(t, a.sameE + .9, a.sameE + 1.5)) }));
  }

  // ======================================================================================================== c03 · the board
  // the tags over the board (3.02 lower · glow on "scarce" · 3.03 slide away to the zero line and evaporate: the stars are the prices
  // that left; their empty threads stay, tremble on "still gets paid" and are drawn up into the dark on "leave you")
  const ZERO_Z = BOARD.cz + BOARD.half - 120;
  const SPOTS = (() => {
    const out = [];
    TOWN.forEach((hs, i) => { if (i % 2 === 0 || hs.Z > 8500) out.push({ X: hs.X, Z: hs.Z + 20, w: 420 + (hs.seed % 4) * 70, hb: hs.h + 260 + (hs.seed % 3) * 120 }); });
    // order of the wave: round the loop from your side (angle about the loop centre, starting near-left)
    out.forEach((q) => { q.k = ((Math.atan2(q.Z - LOOP.cz, q.X - LOOP.cx) + Math.PI * 1.25) % (Math.PI * 2)) / (Math.PI * 2); });
    out.sort((p, q) => p.k - q.k);
    out.forEach((q, i) => { q.i = i; q.down = a.capOnly + .1 + i * .07; q.slide = a.cheaper - .25 + i * (2.3 / out.length); });
    return out;
  })();
  const TA3 = { X: YOU.X, Z: Z0 - 10, w: 600, hb: 480, down: a.price - .6, slide: a.cheaper + 1.9 };   // your tag, cool, empty face
  const SLIDE_D = 1.9;
  // a tag that slides from its place back and down to the zero line (world interpolation; the perspective does the rest)
  function slideTag(ctx, c, t, q, o = {}) {
    const lo = sineIO(span(t, q.down, q.down + 1.4)), sl = span(t, q.slide, q.slide + SLIDE_D), e = sl * sl * (3 - 2 * sl);
    const melt = smooth(span(sl, .82, 1)) ** .7;
    if (lo <= 0) return;
    const X = q.X, Z = lerp(q.Z, ZERO_Z, e), hb = lerp(q.hb, 0, Math.pow(e, .8)), eyeY = -hb - q.w * 1.32 - (1 - lo) * 5200;
    if (melt >= 1) { emptyThread(ctx, c, t, X, Z, eyeY, q.w, q.i ?? 0); return; }
    const glow = 1 + .5 * bump(t, a.scarce - .1 + (q.i ?? 0) * .03, 1.3);
    stand(ctx, c, X, Z, () => F.tag(ctx, t, 0, eyeY, q.w, { cool: o.cool ?? lerp(.15, .55, e), glow, melt, swing: .03 * (1 - lo) * Math.sin(t * 3) + .006 * Math.sin(t * 1.2 + X) + (o.swing ?? 0),
      emit: (ts) => .8 * bump(ts, q.slide + SLIDE_D * .8, .9), seed: 7 + (q.i ?? 0), thread: 9000 }));
    if (sl > .6) stand(ctx, c, X, Z, () => F.evap(ctx, t, [[-q.w * .5, -hb - q.w * .3], [q.w * .5, -hb - q.w * .3]], (ts) => bump(ts, q.slide + SLIDE_D * .78, 1.1), { hz: 70, life: 2.6, rise: 3400, size: 46, seed: 90 + (q.i ?? 0) }));
  }
  function emptyThread(ctx, c, t, X, Z, eyeY, w, i) {
    const up = expoIn(span(t, a.leave + .1 + i * .02, a.leave + 1.6 + i * .02)) * 9000;
    if (up >= 8999) return;
    const tr = 1 + 5 * bump(t, a.still - .1, 1.3), sw = .02 * tr * Math.sin(t * 2.3 + i);
    stand(ctx, c, X, Z, () => {
      const y = eyeY - up, x = Math.sin(sw) * 900;
      ctx.strokeStyle = rgba(P.halo1, .45); ctx.lineWidth = Math.max(1.2, w * .006); ctx.beginPath(); ctx.moveTo(0, y - 9000); ctx.lineTo(x * .05, y); ctx.stroke();
      ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = w * .014; ctx.beginPath(); ctx.arc(x * .05, y + w * .045, w * .045, 0, 6.29); ctx.stroke();
    });
  }
  // the small tag on "air": it comes down out of the sky with no thread at all, finds nothing to hang on and slips away (dust)
  function airTag(ctx, t) {
    const d = span(t, a.air - 1.1, a.plenty + 1.0); if (d <= 0 || d >= 1) return;
    const e = sineIO(d), x = YOU.X + 160 + Math.sin(d * 7) * 70 + e * 420, y = lerp(-2600, -420, sineIO(span(d, 0, .55))) - smooth(span(d, .55, 1)) * 260;
    const melt = smooth(span(t, a.plenty - .1, a.plenty + .9));
    F.tag(ctx, t, x, y, 150, { cool: .3, melt, swing: .5 * Math.sin(d * 7 + 1) * (1 - .5 * e), thread: 0, threadA: 0, emit: (ts) => .7 * bump(ts, a.plenty - .1, 1), seed: 31 });
  }
  // the thought above your hand (as in 1.07): it multiplies into thousands of points that rise and fill the sky like air (3.03 ★)
  const HANDUP = [a.imagine - .1, a.imagine + .7];
  // the points of air: each leaves the thought and drifts out and up to its own place in the sky of the widest view (3.03)
  const AIR = (() => { const r = E.prng(1201), out = []; for (let i = 0; i < 1400; i++) { const sx = r() - .5, k = .25 + .75 * r();
    out.push({ t0: r() ** 1.3, tx: sx * 10400 * k, ty: -1700 - r() * 3500 - Math.abs(sx) * 600, sz: 6 + r() * r() * 14, ph: r() * 6.3, dur: 3.2 + r() * 2.6 }); } return out; })();
  function thought(ctx, t) {
    const g = smooth(span(t, HANDUP[1] - .2, HANDUP[1] + .5)) * (1 - smooth(span(t, a.nothing + 1.5, a.nothing + 2.6)));
    if (!you.hands) return;
    const [hx, hy] = you.hands.R, x = hx + 6, y = hy - 34, br = 1 + .08 * Math.sin(t * 2.2);
    // the points: each leaves the thought at its own moment and drifts out and up into the sky, where it stays as a point of air
    const T1 = a.plentiful - .2, T2 = a.nothing + 1.2;
    if (t > T1 && t < a.c04) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const p of AIR) {
        const ts = lerp(T1, T2, p.t0), q = span(t, ts, ts + p.dur); if (q <= 0) continue;
        const e = 1 - (1 - q) ** 2.4, px = x + p.tx * e + Math.sin(t * .7 + p.ph) * 40 * e, py = y + p.ty * e;
        const al = (.55 + .45 * Math.sin(t * 2 + p.ph)) * Math.min(1, q * 6) * (1 - .6 * smooth(span(t, a.watched, a.watched + 3)));
        ctx.fillStyle = rgba(mixHex(P.core1, P.cream, p.t0), al); ctx.fillRect(px - p.sz / 2, py - p.sz / 2, p.sz, p.sz);
      }
      ctx.restore();
    }
    if (g <= 0) return;
    E.halo(ctx, x, y, 110 * g * br, .85, P.halo0, P.core0);
    ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(x, y, 12 * g * br, 0, 6.29); ctx.fill();
  }
  // the shelf of encyclopedias: three boards of volumes, gold spines of light that go dark one by one on "presses stopped"
  const SPINES = (() => { const r = E.prng(1768), out = []; for (let row = 0; row < 3; row++) { let x = -SHELF.w / 2 + 70; while (x < SHELF.w / 2 - 90) { const w = 46 + r() * 18; out.push({ row, x, w, h: 230 + r() * 50, ph: r() }); x += w + 6; } } return out; })();
  function shelf(ctx, t) {
    const { w, h } = SHELF, x0 = -w / 2;
    const body = new Path2D(); body.rect(x0, -h, w, h);
    ctx.fillStyle = E.lin(ctx, x0, 0, -x0, 0, [[0, P.night1], [.6, mixHex(P.night1, P.ind2, .5)], [1, P.ind1]]); ctx.fill(body);
    ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 10; ctx.stroke(body);
    SPINES.forEach((sp, i) => {
      const yb = -60 - sp.row * 340, dark = smooth(span(t, a.presses - .1 + i * .035, a.presses + .25 + i * .035));
      const on = smooth(span(t, a.watched + .6 + (i % 13) * .05, a.watched + 1.6 + (i % 13) * .05));
      const L = (.08 + .92 * on) * (1 - .88 * dark) * (.85 + .15 * Math.sin(t * .8 + sp.ph * 6));
      const r = new Path2D(); r.rect(sp.x, yb - sp.h, sp.w, sp.h);
      if (L > .2) E.glowFill(ctx, r, 18, .25 * L, P.halo0);
      ctx.fillStyle = E.lin(ctx, 0, yb - sp.h, 0, yb, [[0, mixHex(P.night1, P.core1, L)], [1, mixHex(P.night1, P.halo1, L)]]); ctx.fill(r);
      ctx.fillStyle = rgba(P.shade0, .7 * L + .1); ctx.fillRect(sp.x, yb - sp.h * .78, sp.w, 10); ctx.fillRect(sp.x, yb - sp.h * .3, sp.w, 10);
    });
    for (let row = 0; row < 3; row++) { ctx.fillStyle = mixHex(P.ind2, P.blue1, .5); ctx.fillRect(x0 + 30, -50 - row * 340, w - 60, 14); }
    // 3.08: pages lift off the dark shelf and rise as points of light (free to you)
    F.evap(ctx, t, [[x0 + 80, -h + 40], [-x0 - 80, -h + 40]], (ts) => .9 * smooth(span(ts, a.wiki - .2, a.wiki + .8)) * (1 - smooth(span(ts, a.free + 1.5, a.free + 3))), { hz: 150, life: 3.6, rise: 2600, size: 16, seed: 61 });
  }
  // the record of light: a gold disc on a low stand, grooves turning
  function record(ctx, t) {
    const r = REC.r, cy = -r - 80, spin = t * .9;
    ctx.fillStyle = P.night1; ctx.fillRect(-120, -90, 240, 90); ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 6; ctx.strokeRect(-120, -90, 240, 90);
    const disc = new Path2D(); disc.arc(0, cy, r, 0, 6.29);
    const L = (.1 + .9 * smooth(span(t, a.free + .3, a.music + .6)) * (1 - .8 * smooth(span(t, a.c04, a.c04 + 2.5)))) * (1 - .55 * smooth(span(t, a.song, a.song + 1.2)) + .3 * smooth(span(t, a.subs - .2, a.subs + .8)));
    E.glowFill(ctx, disc, r * .5, .35 * L, P.blue0); E.glowFill(ctx, disc, r * .12, .5 * L, P.halo0);
    ctx.fillStyle = E.rad(ctx, -r * .2, cy - r * .25, r * 1.3, [[0, mixHex(P.night1, P.core0, L)], [.4, mixHex(P.night1, P.core1, L)], [.8, mixHex(P.night1, P.halo0, L)], [1, mixHex(P.night1, P.halo1, L)]]); ctx.fill(disc);
    ctx.strokeStyle = rgba(P.shade0, .45); for (let k = 0; k < 9; k++) { ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, cy, r * (.36 + k * .07), spin + k, spin + k + 5.2); ctx.stroke(); }
    ctx.fillStyle = mixHex(P.shade0, P.night1, .3); ctx.beginPath(); ctx.arc(0, cy, r * .26, 0, 6.29); ctx.fill();
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(0, cy, r * .04, 0, 6.29); ctx.fill();
  }
  const SHELF_TAG = { X: SHELF.X, Z: SHELF.Z - 20, w: 640, hb: SHELF.h + 150, down: a.watched + .4, slide: a.fact - .1, i: 40 };
  const REC_TAG = { w: 560, hb: REC.r * 2 + 80 + 330, down: a.music - .8 };
  const doorRise = (t) => span(t, a.off - .4, a.off + 1.1);
  const DOOR_HOOK = () => { const d = DOOR1, fh = d.h * 1.22; return -fh - d.h * .05; };
  function props03(L, ctx, t, c) {
    if (t > a.c03 - .5 && t < a.c04 - 1) {
      for (const q of SPOTS) if (t >= q.down) L.push([lerp(q.Z, ZERO_Z, smooth(span(t, q.slide, q.slide + SLIDE_D))) + 1, () => slideTag(ctx, c, t, q)]);
      if (t >= TA3.down) L.push([lerp(TA3.Z, ZERO_Z, smooth(span(t, TA3.slide, TA3.slide + SLIDE_D))) + 1, () => slideTag(ctx, c, t, TA3, { cool: .72, swing: .07 * bump(t, a.price, 1.8) })]);
      L.push([Z0 - 20, () => stand(ctx, c, 0, Z0 - 20, () => airTag(ctx, t))]);
    }
    if (t > a.c03) {
      const sk = smooth(span(t, a.c04 + 1.2, a.c04 + 3.6));               // c04: the dark shelf sinks back into the board (off screen, it has said its line)
      if (sk < 1) L.push([SHELF.Z, () => stand(ctx, c, SHELF.X, SHELF.Z, () => { ctx.save(); ctx.beginPath(); ctx.rect(-3000, -6000, 6000, 6000); ctx.clip(); ctx.translate(0, sk * SHELF.h * 1.05); shelf(ctx, t); ctx.restore(); })]);
      if (t >= SHELF_TAG.down) L.push([lerp(SHELF_TAG.Z, ZERO_Z, smooth(span(t, SHELF_TAG.slide, SHELF_TAG.slide + SLIDE_D))) + 1, () => slideTag(ctx, c, t, SHELF_TAG, { cool: .1 })]);
      L.push([REC.Z, () => stand(ctx, c, REC.X, REC.Z, () => record(ctx, t))]);
      L.push([REC.Z - 10, () => recTag(ctx, c, t)]);
      const dr = doorRise(t);
      if (dr > 0) L.push([DOOR1.Z, () => stand(ctx, c, DOOR1.X, DOOR1.Z, () => {
        const k = expoOut(dr), settle = 14 * Math.sin(Math.PI * span(dr, .75, 1)), fh = DOOR1.h * 1.22;
        ctx.save(); ctx.beginPath(); ctx.rect(-3000, -6000, 6000, 6000); ctx.clip();
        ctx.translate(0, (1 - k) * fh * 1.05 + settle); F.door(ctx, t, 0, 0, DOOR1.h, { lit: .25 + .75 * smooth(span(dr, .5, 1)), open: .35 });
        ctx.restore();
        if (t < a.off + 3.6) F.evap(ctx, t, [[-DOOR1.h * .8, 0], [DOOR1.h * .8, 0]], (ts) => .8 * bump(ts, a.off - .2, 1.6), { seed: 71, size: 9, rise: 260, life: 1.8 });
      })]);
    }
  }
  // the record's tag: lowers on "Music", sinks on "song hit zero", lifts off on "moved", travels along the road and hangs itself on the door
  function recTag(ctx, c, t) {
    if (t < REC_TAG.down) return;
    const lo = sineIO(span(t, REC_TAG.down, REC_TAG.down + 1.4)), sk = sineIO(span(t, a.song - .1, a.song + 1.3));
    const mv = span(t, a.moved - .1, a.door + .35), e = sineIO(mv), hang = smooth(span(t, a.door + .2, a.door + .9));
    const w = REC_TAG.w * lerp(1, .82, sk), eye0 = -(REC_TAG.hb - 180 * sk) - w * 1.32 - (1 - lo) * 5200;
    const hookY = DOOR_HOOK() * expoOut(doorRise(t)) + 0, eye1 = hookY + 70;
    const X = lerp(REC.X, DOOR1.X, e), Z = lerp(REC.Z - 10, DOOR1.Z - 15, e), eye = lerp(eye0, eye1, e) - Math.sin(Math.PI * e) * 520;
    if (mv > 0) emptyRecThread(ctx, c, t, eye0);
    stand(ctx, c, X, Z, () => F.tag(ctx, t, 0, eye, w, { cool: lerp(.05, .45, sk) * (1 - .8 * hang), glow: 1 + .3 * hang, swing: .03 * (1 - lo) * Math.sin(t * 3) + .08 * bump(t, a.door + .1, 1.6) + .005 * Math.sin(t * 1.3),
      thread: mv > 0 ? (mv < 1 ? 0 : 70) : 9000, threadA: mv > 0 && mv < 1 ? 0 : 1, seed: 52 }));
  }
  function emptyRecThread(ctx, c, t, eye0) {
    const up = expoIn(span(t, a.off, a.off + 1.6)) * 8000; if (up >= 7999) return;
    stand(ctx, c, REC.X, REC.Z - 10, () => { const y = eye0 - up; ctx.strokeStyle = rgba(P.halo1, .45); ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(0, y - 9000); ctx.lineTo(0, y); ctx.stroke();
      ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 7.8; ctx.beginPath(); ctx.arc(0, y + 25, 25, 0, 6.29); ctx.stroke(); });
  }

  // ======================================================================================================== c03 · type in the sky
  const REF_G = camOf(fr(SHELF.X + 230, -560, SHELF.Z, .375, 900, 700)), REF_H = camOf(fr(REC.X + 140, -620, REC.Z, .43, 860, 620));
  function sky03(ctx, t, c) {
    if (t < a.watched || t > a.c04 + 2) return;
    onPlane(ctx, planeM(c, REF_G, 9000), () => {
      const o1 = a.fact + .9, o2 = a.wiki - .4;
      lab(ctx, 'BRITANNICA · 1990', 1180, 200, 34, inOut(t, a.brit - .1, o1));
      const cu = expoOut(span(t, a.sets - .3, a.sets + 1.3)), n = Math.max(1000, Math.round(120000 * cu / 1000) * 1000);
      lab(ctx, n.toLocaleString('en-US'), 1172, 340, 140, inOut(t, a.sets - .35, o1, .8), { serif: true });
      lab(ctx, 'SETS', 1182, 392, 34, inOut(t, a.sets + .2, o1), { col: P.halo0 });
      lab(ctx, '1768 – 2012', 1172, 330, 120, inOut(t, a.y244 - .2, o2, .8), { serif: true, warm: smooth(span(t, a.y244, a.y244 + .7)) });
      lab(ctx, '244 YEARS IN PRINT', 1182, 386, 30, inOut(t, a.y244 + .1, o2), { col: P.halo0 });
      const o3 = a.music - .45;
      lab(ctx, 'WIKIPEDIA', 1180, 200, 34, inOut(t, a.wiki - .1, o3));
      lab(ctx, '≈ $190M A YEAR', 1180, 250, 34, inOut(t, a.m190 - .2, o3), { col: P.halo0 });
      lab(ctx, 'FREE TO YOU', 1172, 360, 112, inOut(t, a.free - .15, o3, .8), { serif: true, warm: smooth(span(t, a.free, a.free + .7)) });
      lab(ctx, 'WIKIMEDIA 2025', 1182, 404, 22, inOut(t, a.free + .2, o3), { col: P.halo2 });
    });
    // 3.09: U.S. music revenue, a line of light: $14.6B (1999) → $7.0B (2014), then the dotted climb (subscription)
    onPlane(ctx, planeM(c, REF_H, 9000), () => {
      const zy = zeroY(REF_H), vy = (v) => zy - 30 - v * 21, out = a.moved - .2;
      const x0 = 1080, x1 = 1520, x2 = 1800, P0 = [x0, vy(14.6)], P1 = [x1, vy(7.0)], P2 = [x2, vy(11)];
      const u1 = sineIO(span(t, a.half - 1.2, a.half + .4)), u2 = sineIO(span(t, a.subs - .3, a.subs + 1.2)), go = 1 - expoIn(span(t, out, out + .6));
      if (span(t, a.song + .2, a.song + .6) > 0 && go > 0) {
        const pts = []; for (let k = 0; k <= 24; k++) { const q = k / 24; pts.push([lerp(x0, x1, q), lerp(P0[1], P1[1], q) - Math.sin(Math.PI * q) * 14 + (q < .3 ? -q * 30 : 0)]); }
        F.trailSpan(ctx, pts, 0, Math.max(.001, u1), { w: 3, a: go });
        ctx.save(); ctx.globalAlpha = go; E.halo(ctx, P0[0], P0[1], 30, .6 * smooth(span(t, a.song + .2, a.song + .6)));
        ctx.restore();
        if (u2 > 0) { ctx.save(); ctx.setLineDash([10, 12]); ctx.strokeStyle = rgba(P.halo0, .85 * go); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(...P1); ctx.lineTo(lerp(P1[0], P2[0], u2), lerp(P1[1], P2[1], u2)); ctx.stroke(); ctx.restore(); }
      }
      lab(ctx, 'U.S. MUSIC', x0 - 10, 150, 34, inOut(t, a.song + .1, out));
      lab(ctx, '$14.6B · 1999', P0[0] + 26, P0[1] + 10, 30, inOut(t, a.song + .3, out), { col: P.halo0 });
      lab(ctx, '$7.0B · 2014', P1[0], P1[1] + 52, 30, inOut(t, a.half - .1, out), { center: true, col: P.halo0, warm: 0 });
      lab(ctx, 'SUBSCRIPTION', P2[0], P2[1] - 26, 26, inOut(t, a.subs + .2, out), { right: true, col: P.cream });
      lab(ctx, 'RIAA', x0 - 10, 186, 22, inOut(t, a.song + .4, out), { col: P.halo2 });
    });
  }

  // ======================================================================================================== c04 · thinking is next
  // the fields of thinking along the left side of the loop (inside), small near you, bigger further along, big round the far side
  const FIELDS = [
    { kind: 'page', X: -1500, Z: 3380, cw: 200, tw: 250, hb: 400, key: a.draft },
    { kind: 'short', X: -1150, Z: 3380, cw: 200, tw: 250, hb: 400, key: a.summary },
    { kind: 'code', X: -800, Z: 3380, cw: 220, tw: 250, hb: 400, key: a.bug },
    { kind: 'scan', X: 180, Z: 3420, cw: 300, tw: 330, hb: 470, key: a.scan },
    { kind: 'lease', X: 700, Z: 3420, cw: 300, tw: 330, hb: 470, key: a.lease },
    { kind: 'capsule', X: -1500, Z: 9300, cw: 820, tw: 1000, hb: 1050, key: a.drug },
    { kind: 'bridge', X: 300, Z: 9500, cw: 1300, tw: 1100, hb: 1150, key: a.bridge },
    { kind: 'board', X: 2000, Z: 9300, cw: 900, tw: 1000, hb: 1100, key: a.lesson },
  ];
  FIELDS.forEach((f, i) => { f.down = i < 5 ? a.reach - .6 + i * .18 : a.everything - .6 + (i - 5) * .2; f.i = i; });
  const fieldsOn = (t) => t > a.c04 - 1 && t < Tout;
  // a light card on its field (what the thinking makes)
  function fieldCard(ctx, t, f) {
    const w = f.cw, by = -40 - .2 * w, br = 4 * Math.sin(t * 1.3 + f.i);
    ctx.save(); ctx.translate(0, br);
    const p = new Path2D(), k = f.kind;
    let h = w * 1.25;
    if (k === 'short') h = w * .8;
    if (k === 'code') h = w * .62;
    if (k === 'scan') h = w * 1.1;
    if (k === 'capsule') { p.roundRect(-w / 2, by - w * .42, w, w * .42, w * .21); }
    else if (k === 'bridge') { p.moveTo(-w / 2, by); p.lineTo(-w / 2, by - w * .22); p.quadraticCurveTo(0, by - w * .62, w / 2, by - w * .22); p.lineTo(w / 2, by); p.lineTo(w * .36, by); p.quadraticCurveTo(0, by - w * .36, -w * .36, by); p.closePath(); }
    else if (k === 'board') { p.roundRect(-w / 2, by - w * .62, w, w * .62, w * .02); }
    else p.roundRect(-w / 2, by - h, w, h, w * .05);
    const lit = 1 - .25 * smooth(span(t, f.key, f.key + 1));
    if (k === 'scan' || k === 'board') {
      E.glowFill(ctx, p, w * .2, .35 * lit, P.blue0);
      ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.fill(p); ctx.strokeStyle = rgba(P.halo1, .8 * lit); ctx.lineWidth = w * .02; ctx.stroke(p);
      if (k === 'scan') { E.halo(ctx, w * .08, by - h * .55, w * .3, .7 * lit, P.halo0, P.core0); ctx.fillStyle = mixHex(P.night1, P.core0, lit); ctx.beginPath(); ctx.arc(w * .08, by - h * .55, w * .1, 0, 6.29); ctx.fill(); }
      else { ctx.strokeStyle = rgba(P.cream, .75 * lit); ctx.lineWidth = w * .012; for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.moveTo(-w * .38, by - w * (.46 - j * .12)); ctx.lineTo(w * (.1 + .1 * j), by - w * (.46 - j * .12)); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(w * .2, by - w * .2); ctx.lineTo(w * .36, by - w * .2); ctx.lineTo(w * .28, by - w * .34); ctx.closePath(); ctx.stroke(); }
    } else {
      E.glowFill(ctx, p, w * .25, .45 * lit, P.halo0);
      ctx.fillStyle = E.rad(ctx, 0, by - h * .6, w, [[0, mixHex(P.night1, P.core0, lit)], [.6, mixHex(P.night1, P.core1, lit)], [1, mixHex(P.night1, P.halo0, lit)]]); ctx.fill(p);
      ctx.strokeStyle = mixHex(P.shade0, P.night1, .3); ctx.lineWidth = w * .035; ctx.lineCap = 'round';
      if (k === 'page' || k === 'short' || k === 'lease') { const n = k === 'short' ? 2 : 4; for (let j = 0; j < n; j++) { ctx.beginPath(); ctx.moveTo(-w * .32, by - h + h * (.2 + j * .15)); ctx.lineTo(w * (j === n - 1 ? .05 : .32), by - h + h * (.2 + j * .15)); ctx.stroke(); }
        if (k === 'lease') { ctx.beginPath(); for (let j = 0; j <= 10; j++) { const xx = -w * .3 + j * w * .05, yy = by - h * .14 + Math.sin(j * 1.4) * h * .025; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); } }
      if (k === 'code') { ctx.font = `600 ${h * .55}px Inter`; ctx.textAlign = 'center'; ctx.fillStyle = mixHex(P.shade0, P.night1, .3); ctx.fillText('{ }', 0, by - h * .3); }
      if (k === 'capsule') { ctx.beginPath(); ctx.moveTo(0, by - w * .42); ctx.lineTo(0, by); ctx.stroke(); }
    }
    ctx.restore();
  }
  // the tag over a field: lowers on "reaching thinking" (a row of lanterns down the road), sinks on its word, prints ¢ on "cents"; leaves on "price left"
  function fieldTag(ctx, t, f) {
    const lo = sineIO(span(t, f.down, f.down + 1.5)); if (lo <= 0) return;
    const sk = sineIO(span(t, f.key - .1, f.key + 1.1)), cents = f.i < 3 ? smooth(span(t, a.cents - .1, a.cents + .5)) : 0;
    const lv = leaveAt(t, f.i), w = f.tw * lerp(1, .6, sk), hb = lerp(f.hb, f.cw * .25 + 120, sk);
    const eye = -hb - w * 1.32 - (1 - lo) * 5000 - lv.up;
    F.tag(ctx, t, lv.dx, eye, w, { cool: lerp(.08, .7, sk), glow: lerp(1, .6, sk), text: '¢', u: cents, size: .5, swing: .03 * (1 - lo) * Math.sin(t * 3) + .006 * Math.sin(t * 1.2 + f.i) + lv.sw, thread: 9000, threadA: lv.th, seed: 120 + f.i });
  }
  // "The price left": the tags lift off their threads, drift away along the road and up into the dark; the threads stay (empty rings)
  const leaveAt = (t, i) => { const q = span(t, a.left - .2 + (i % 5) * .04, a.left + 1.5 + (i % 5) * .04), e = q * q;
    return { up: e * 9000, dx: e * (1400 + (i % 3) * 500), sw: .12 * Math.sin(q * 5 + i) * q, th: q > 0 ? 0 : 1, q }; };
  function ringOnly(ctx, t, eye, w, q) {   // the empty thread and its ring left behind by a tag that lifted off
    if (q <= 0) return;
    ctx.strokeStyle = rgba(P.halo1, .55); ctx.lineWidth = Math.max(1.2, w * .006); ctx.beginPath(); ctx.moveTo(0, eye - 9000); ctx.lineTo(0, eye - w * .045); ctx.stroke();
    ctx.strokeStyle = rgba(P.halo0, .9); ctx.lineWidth = w * .014; ctx.beginPath(); ctx.arc(0, eye, w * .045, 0, 6.29); ctx.stroke();
  }
  // the CHEGG and CANVA fields: a sign card (type only, no logo), desks of light (CHEGG), a few people who stay lit
  const DESKS = Array.from({ length: 20 }, (_, i) => ({ x: -460 + (i % 10) * 102, z: i < 10 ? -300 : -120, off: [1, 3, 4, 6, 8, 11, 13, 16, 18].includes(i) }));
  function sign(ctx, t, word, lit, t0) {
    const up = span(t, t0 - .35, t0 + .5); if (up <= 0) return;
    const w = 820, h = 250, y0 = -170;
    ctx.save(); ctx.scale(1, expoOut(up)); 
    ctx.fillStyle = P.night1; ctx.fillRect(-w * .3, y0, 24, -y0); ctx.fillRect(w * .3 - 24, y0, 24, -y0);
    const p = new Path2D(); p.roundRect(-w / 2, y0 - h, w, h, 18);
    E.glowFill(ctx, p, 80, .3 * lit, P.blue0);
    ctx.fillStyle = E.lin(ctx, -w / 2, 0, w / 2, 0, [[0, P.night1], [1, mixHex(P.night1, P.ind2, .7)]]); ctx.fill(p);
    ctx.strokeStyle = rgba(P.halo1, .55 + .3 * lit); ctx.lineWidth = 8; ctx.stroke(p);
    E.glowText(ctx, word, 0, y0 - h / 2 + 52, { size: 150, align: 'center', weight: 600, col: mixHex(P.halo2, P.cream, lit), a: .95 });
    ctx.restore();
    if (t < t0 + 2) F.evap(ctx, t, [[-w * .5, 0], [w * .5, 0]], (ts) => (ts > t0 - .35 && ts < t0 + .5 ? .6 : 0), { seed: 77, size: 8, rise: 200, life: 1.4 });
  }
  function desks(ctx, t) {
    for (const d of DESKS) {
      const off = d.off ? smooth(span(t, a.halfStaff + .05 + (d.x + 460) / 4000, a.halfStaff + .45 + (d.x + 460) / 4000)) : 0, L = 1 - .9 * off;
      ctx.save(); ctx.translate(d.x, d.z * .25);
      if (L > .1) E.halo(ctx, 0, -95, 70, .5 * L, P.halo0, P.core1);
      ctx.fillStyle = mixHex(P.ind2, P.halo1, .35 * L); ctx.fillRect(-42, -70, 84, 12); ctx.fillRect(-36, -60, 8, 60); ctx.fillRect(28, -60, 8, 60);
      ctx.fillStyle = mixHex(P.night1, P.core1, L); ctx.beginPath(); ctx.arc(0, -98, 9, 0, 6.29); ctx.fill();
      ctx.restore();
    }
  }
  function people(ctx, t, xs) {
    const warm = smooth(span(t, a.fail - .25, a.fail + .6));
    xs.forEach((x, i) => {
      if (warm > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, 2); ctx.scale(1, .14); ctx.fillStyle = E.rad(ctx, 0, 0, 260, [[0, rgba(P.halo1, .45 * warm)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 260, 0, 6.29); ctx.fill(); ctx.restore(); }
      E.person(ctx, x, 0, 190, { dir: i % 2 ? -1 : 1, light: 1, look: .2 + .5 * warm * (i % 2), rim: mixHex(P.blue0, P.core1, warm), armR: [.2 + .05 * Math.sin(t + i), .1], armL: [-.2, -.1] });
    });
  }
  const CH_TAG = { tw: 560, hb: 820, down: a.chegg - .8 }, CA_TAG = { tw: 560, hb: 820, down: a.canva - .8 };
  function placeTag(ctx, t, q, sink, i) {
    const lo = sineIO(span(t, q.down, q.down + 1.5)); if (lo <= 0) return;
    const lv = leaveAt(t, i), w = q.tw * lerp(1, .8, sink), eye = -lerp(q.hb, 420, sink) - w * 1.32 - (1 - lo) * 5000;
    ringOnly(ctx, t, eye, w, lv.q);
    F.tag(ctx, t, lv.dx, eye - lv.up, w, { cool: lerp(.08, .55, sink), swing: .03 * (1 - lo) * Math.sin(t * 3) + .006 * Math.sin(t * 1.3 + i) + lv.sw, thread: 9000, threadA: lv.th, seed: 140 + i });
  }
  function props04(L, ctx, t, c) {
    if (!fieldsOn(t)) return;
    for (const f of FIELDS) L.push([f.Z, () => stand(ctx, c, f.X, f.Z, () => { const up = span(t, f.down - .3, f.down + 1.1);   // the card rises out of the board as its tag comes down
      if (up > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-6000, -9000, 12000, 9000); ctx.clip(); ctx.translate(0, (1 - expoOut(up)) * (f.cw * 1.45 + 60)); fieldCard(ctx, t, f); ctx.restore();
      }
      if (up > 0 && t < f.down + 2.6) F.evap(ctx, t, [[-f.cw * .6, 0], [f.cw * .6, 0]], (ts) => ts < f.down - .3 ? 0 : .7 * (1 - span(ts, f.down - .3, f.down + 1.1)), { seed: 90 + f.i, size: Math.max(4, f.cw * .012), rise: f.cw * .5, life: 1.4 }); const lv = leaveAt(t, f.i); const sk = sineIO(span(t, f.key - .1, f.key + 1.1)), w = f.tw * lerp(1, .6, sk), hb = lerp(f.hb, f.cw * .25 + 120, sk);
      ringOnly(ctx, t, -hb - w * 1.32, w, lv.q); fieldTag(ctx, t, f); })]);
    L.push([CHEGG.Z, () => stand(ctx, c, CHEGG.X, CHEGG.Z, () => { sign(ctx, t, 'CHEGG', 1 - .6 * smooth(span(t, a.n99, a.n99 + 1.2)), a.chegg); placeTag(ctx, t, CH_TAG, smooth(span(t, a.n99 - .2, a.n99 + 1.2)), 10); })]);
    L.push([CHEGG.Z - 380, () => stand(ctx, c, CHEGG.X + 150, CHEGG.Z - 380, () => { if (t > a.chegg) { desks(ctx, t); people(ctx, t, [-330, 40, 330]); } })]);
    L.push([CANVA.Z, () => stand(ctx, c, CANVA.X, CANVA.Z, () => { sign(ctx, t, 'CANVA', 1, a.canva); placeTag(ctx, t, CA_TAG, smooth(span(t, a.either - .2, a.either + 1.2)), 11); })]);
    L.push([CANVA.Z - 380, () => stand(ctx, c, CANVA.X, CANVA.Z - 380, () => { if (t > a.canva) people(ctx, t, [-380, -60, 300]); })]);
    // your tag (c04): lowers over you on "reaching thinking"; cool; leaves on "price left" and leaves the empty hook (→ plateHook)
    if (t > a.reach - 1) L.push([Z0 - 10, () => stand(ctx, c, YOU.X, Z0 - 10, () => {
      const lo = sineIO(span(t, a.reach - .7, a.reach + .9)), lv = leaveAt(t, 7);
      if (lv.q <= 0) F.tag(ctx, t, 0, HOOK.eye - (1 - lo) * 4200, TA4.w, { cool: .62, swing: .03 * (1 - lo) * Math.sin(t * 3) + .005 * Math.sin(t * 1.4) + .04 * bump(t, a.cents - .2, 1.4), thread: 9000, seed: 18 });
      else F.tag(ctx, t, lv.dx * .6, HOOK.eye - lv.up, TA4.w, { cool: .62, swing: lv.sw, thread: 0, threadA: 0, seed: 18 });
    })]);
  }
  // the column of value and the empty hook, in screen space from the world (it converges onto plateHook: same drawing, same numbers)
  function hookAndColumn(ctx, t, c) {
    const q = span(t, a.left - .1, a.left + 1.2); if (q <= 0) return;
    const e = wp(c, YOU.X, BOARD.GY + HOOK.eye, Z0 - 10), g = wp(c, YOU.X, BOARD.GY, Z0 - 10); if (!e || !g) return;
    const s = e[2], top = lerp(g[1], e[1] + 140 / HOOK.s * s, expoOut(q)), cw = 300 / HOOK.s * s * (.4 + .6 * expoOut(q));
    const k = smooth(span(t, Tout - SEAM_HALF - 1.1, Tout - SEAM_HALF));    // the plate's night slowly takes over the background
    if (k > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = k; plateNight(ctx, t); ctx.restore(); }
    drawColumn(ctx, t, e[0], e[1], g[1], top, cw, HOOK.r * s, clamp(q * 1.6), k);
  }
  // plateHook's drawing (lib/f18_seams.mjs), parametric: the world's numbers blend into the plate's (k → 1 at T0 − .5)
  function drawColumn(ctx, t, ex, ey, gy, top, cw0, rr, al, k) {
    const T = HOOK_PLATE, x = lerp(ex, T.x, k), base = lerp(Math.min(gy, H + 400), H + 10, k), colTop = lerp(top, T.colTop, k), ry = lerp(ey, T.y, k), r = lerp(rr, T.r, k);
    const cw = lerp(cw0, T.colW, k) * (1 + .02 * Math.sin(t * 1.4)), sx = x + 3 * Math.sin(t * 1.1) * k, gsc = lerp(cw0 / T.colW, 1, k);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = al;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.rad(ctx, x, lerp(base + 190 * gsc, H + 200, k), 900 * gsc, [[0, rgba(P.halo1, .35)], [.5, rgba(P.blue0, .2)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(0, 0, W, H);
    ctx.restore();
    ctx.fillStyle = E.lin(ctx, x - cw / 2, 0, x + cw / 2, 0, [[0, rgba(P.halo1, 0)], [.2, rgba(P.halo0, .7)], [.5, P.core1], [.8, rgba(P.halo0, .7)], [1, rgba(P.halo1, 0)]]);
    ctx.beginPath(); ctx.moveTo(x - cw / 2, base); ctx.lineTo(x - cw * .42, colTop + 40 * gsc); ctx.quadraticCurveTo(x, colTop - 30 * gsc, x + cw * .42, colTop + 40 * gsc); ctx.lineTo(x + cw / 2, base); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, 0, colTop, 0, Math.max(colTop + 1, base), [[0, rgba(P.core0, .5)], [1, rgba(P.core0, 0)]]); ctx.fillRect(x - cw * .12, colTop, cw * .24, Math.max(0, base - colTop)); ctx.restore();
    F.evap(ctx, t, [[x - cw * .35, colTop + 30 * gsc], [x + cw * .35, colTop + 30 * gsc]], () => .4, { seed: 5, size: 3, rise: 260 });
    ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, -10); ctx.lineTo(sx, ry - r); ctx.stroke();
    ctx.strokeStyle = rgba(P.halo0, .95); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(sx, ry, r, 0, 6.29); ctx.stroke();
    E.halo(ctx, sx, ry, 70, .35, P.halo0, P.core1);
    ctx.restore();
  }
  function plateNight(ctx, t) {
    ctx.fillStyle = E.lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind0, P.blue1, .2)]]); ctx.fillRect(0, 0, W, H);
    E.stars(ctx, 1818, 90, t, [0, 0, W, H], .55);
  }

  // ======================================================================================================== c04 · type in the sky
  const REF_I = camOf(fr(CHEGG.X + 5, -300, CHEGG.Z - 300, .557, 761, 801)), REF_J = camOf(fr(CANVA.X - 5, -300, CANVA.Z - 300, .557, 1159, 801));
  function sky04(ctx, t, c) {
    if (t < a.chegg - 1 || t > Tout) return;
    onPlane(ctx, planeM(c, REF_I, 12000), () => {
      const out = a.canva + .2, go = 1 - expoIn(span(t, out, out + .6));
      // CHEGG's value as a line of light: flat, then off the cliff (−99 %)
      const pts = [[1000, 190], [1120, 172], [1220, 182], [1300, 168], [1360, 200], [1420, 300], [1490, 410], [1580, 468], [1700, 484], [1780, 488]];
      const u = smooth(span(t, a.chegg + .9, a.n99 + .7));
      if (u > 0 && go > 0) { F.trailSpan(ctx, pts, 0, u * .55 + .45 * smooth(span(t, a.n99 - .5, a.n99 + .7)), { w: 3, a: go }); }
      lab(ctx, 'CHEGG · VALUE', 1000, 140, 28, inOut(t, a.chegg + .8, out), { col: P.halo0 });
      lab(ctx, '2021', 1000, 236, 24, inOut(t, a.chegg + 2.8, out), { col: P.halo2 });
      lab(ctx, '−99 %', 1000, 380, 130, inOut(t, a.n99 - .1, out, .8), { serif: true, warm: smooth(span(t, a.n99, a.n99 + .6)) });
      lab(ctx, 'SINCE 2021', 1010, 428, 32, inOut(t, a.n99 + .2, out), { col: P.halo0 });
      lab(ctx, '−45 % STAFF · OCT 2025', 1010, 490, 34, inOut(t, a.halfStaff - .1, out));
      lab(ctx, 'A.I. NAMED AS A REASON', 1010, 532, 28, inOut(t, a.named - .1, out), { col: P.halo0 });
      lab(ctx, 'CNBC', 1010, 566, 22, inOut(t, a.named + .2, out), { col: P.halo2 });
    });
    onPlane(ctx, planeM(c, REF_J, 12000), () => {
      const out = a.people - .1, go = 1 - expoIn(span(t, out, out + .6));
      const pts = []; for (let k = 0; k <= 40; k++) { const q = k / 40, x = lerp(200, 960, q); pts.push([x, 440 - 250 * Math.pow(q, 1.25) + (q > .78 ? (q - .78) * 250 * 1.1 : 0)]); }
      const u = smooth(span(t, a.canva + .6, a.slow + .5));
      if (u > 0 && go > 0) F.trailSpan(ctx, pts, 0, u, { w: 3, a: go });
      lab(ctx, 'CANVA · GROWTH', 200, 490, 28, inOut(t, a.canva + .6, out), { col: P.halo0 });
      lab(ctx, 'FIRST GROWTH SLOWDOWN', 200, 110, 34, inOut(t, a.slow - .15, out));
      lab(ctx, 'IN 10 YEARS · JOB CUTS · NOV 2026', 200, 150, 26, inOut(t, a.slow + .1, out), { col: P.halo0 });
      lab(ctx, 'CANVA: NOT REPLACED BY A.I.', 200, 206, 26, inOut(t, a.isnt - .1, out), { col: P.halo2 });
    });
  }

  // ======================================================================================================== the frame
  return (ctx, t) => {
    const q = frAt(t, K), c = camDrift(camOf(q), t, .8);
    world(ctx, t, c);
    sky02(ctx, t, c);
    sky03(ctx, t, c);
    sky04(ctx, t, c);
    hookAndColumn(ctx, t, c);
    if (t >= T0 && t < T0 + SEAM_HALF) plateTag(ctx, t);
    if (t >= Tout - SEAM_HALF) plateHook(ctx, t);
  };
}

// ======================================================================================================================== c02 tag plan
// Your tag after the pull back: hangs over you (design space of REF_A), prints $20, rides down and right to 7¢ (its eyelet draws the
// falling price line), then steps on toward the zero line, a step smaller each year (≈ 13× cheaper a year), almost touching it.
function tagsPlan(a) {
  const start = [600, 70, 270];          // eyelet x, y, width after the pull back
  const fmt = (p) => (p >= 1 ? `$${Math.round(p)}` : `${Math.max(7, Math.round(p * 100))}¢`);
  let cache = null;
  const plan = {
    start, land: [1440, 0],
    at(t, zy) {
      if (!cache || cache.zy !== zy) {
        const wL = 205, landY = zy - 34 - wL * 1.32, curve = [];
        for (let k = 0; k <= 60; k++) { const q = k / 60; curve.push([lerp(start[0], plan.land[0], q), start[1] + (landY - start[1]) * (1 - Math.exp(-3.4 * q)) / (1 - Math.exp(-3.4))]); }
        const steps = [[205, 0], [158, 1], [122, 2], [96, 3]].map(([w, i]) => [plan.land[0] + i * 95, zy - 34 + i * 9.5 - w * 1.32, w]);
        cache = { zy, curve, steps, landY };
      }
      const { curve, steps } = cache;
      const slide = sineIO(span(t, a.later - .05, a.seven + .05));
      let x, y, w, trace = [];
      if (t < a.thirteen - .3) {
        const n = slide * 60, i = Math.floor(n), f = n - i;
        trace = curve.slice(0, i + 1); if (i < 60) trace.push([lerp(curve[i][0], curve[i + 1][0], f), lerp(curve[i][1], curve[i + 1][1], f)]);
        [x, y] = trace[trace.length - 1]; w = lerp(start[2], 205, slide);
      } else {
        // the steps: on "thirteen times", "year", "after year": hop right, then drop (a staircase toward the zero line)
        const keys = [a.thirteen, a.year1, a.year2];
        trace = curve.slice(); x = steps[0][0]; y = steps[0][1]; w = steps[0][2];
        keys.forEach((k, i) => {
          const h = expoOut(span(t, k - .05, k + .35)), d = expoOut(span(t, k + .12, k + .55));
          if (h <= 0) return;
          const [x0, y0] = [steps[i][0], steps[i][1]], [x1, y1, w1] = steps[i + 1];
          const hx = lerp(x0, x1, h), dy = lerp(y0, y1, d);
          trace.push([hx, y0]); if (d > 0) trace.push([hx, dy]);
          x = hx; y = dy; w = lerp(steps[i][2], w1, d);
        });
      }
      // number: $20 prints on "twenty dollars", counts down while riding, lands at 7¢, sinks off the face on the first step
      const q = slide, price = 20 * Math.pow(.07 / 20, q);
      const text = t < a.later - .05 ? '$20' : fmt(price);
      const cool = .5 - .44 * smooth(span(t, a.twenty - .1, a.twenty + .7)) + .55 * smooth(span(t, a.seven - .2, a.year2E + .4));
      const swing = .05 * bump(t, a.twenty - .1, 1.5) * (1 - span(t, a.twenty + .6, a.twenty + 1.5)) + .03 * bump(t, a.seven - .05, 1.2);
      return { x, y, w, trace, text, u: span(t, a.twenty - .1, a.twenty + .65), size: .45, sink: smooth(span(t, a.thirteen - .1, a.thirteen + .7)),
        cool, swing, emitV: .12 * (1 - span(t, a.twenty, a.twenty + 1)), emit: 0, glow: 1 };
    },
  };
  return plan;
}
