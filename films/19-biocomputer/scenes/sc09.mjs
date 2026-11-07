// c09 · How big: fly < box < bee · ⅓ of a mouse in 120 dishes · 86 billion · no evidence · T.G('First, how big') → T.G('Still, some researchers')
// Builder B3. Plan: docs/shots.md 9.01–9.03 · kit: lib/f19_kit.mjs · B3 set: lib/f19_b3_world.mjs · seam in: plateNet (lib/f19_seams.mjs).
// ONE entry, one camera. 2D part: a zoom camera over a flat STAGE (stage px; screen = centre + z · (p − c)), the dish field's night.
// From plateNet the camera pulls back out of the dish: the net shrinks into THE BOX's window; the box stands on the size ladder
// (FLY < BOX < BEE). The box sinks into its tread, its dish stays and clones into 120 dishes (Melbourne); a mouse rises, a third of it
// lit; the dishes spread apart (separate, flat, not wired); a pull back reveals you, your head's net: 86 BILLION. Push into one dish
// (the original): the dish field. A cool signal in, the net answers, a gold reaction out, the ring between them stays empty
// (NO EVIDENCE on the ladder). 3D part: the camera tilts up out of the dish into the aisle (C_AISLE = the c10 seam).
//
// | ID   | anchor (word)                              | picture (one idea)                                         | 1–2 moves            |
// |------|--------------------------------------------|------------------------------------------------------------|----------------------|
// | 9.01 | two hundred thousand · fruit fly · honeybee | pull back: the net into the box window; FLY < BOX < BEE    | pull back · creatures |
// | 9.02 | Melbourne's · a third · hundred and twenty · eighty-six billion | the dish clones into 120; ⅓ MOUSE; 120 DISHES; you: 86 BILLION | clone · mouse / you |
// | 9.03 | Reacting · no evidence · structure          | signal in, reaction out, the ring between stays empty      | signal · tilt up      |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import * as B from '../lib/f19_b3_world.mjs';
import { plateNet, NET_PLATE, SEAM_HALF } from '../lib/f19_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, drift } = E;
const { view, proj, COOL, bump, NET } = F;
const TAU = Math.PI * 2;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0, n = 0) => T.G(p, n, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.T0 = R.a; a.end = R.b;
  a.two = G('two hundred thousand', a.T0); a.fly = G('fruit fly', a.T0); a.bee = G('honeybee', a.T0);
  a.put = G("Put all of Melbourne's", a.T0); a.third = G('a third', a.put); a.mouse = G('mouse brain', a.put);
  a.spread = G('But spread across', a.put); a.hundred = G('hundred and twenty', a.spread); a.flat = G('flat', a.spread); a.wired = G('not wired', a.spread);
  a.your = G('Your own brain', a.spread); a.b86 = G('eighty-six billion', a.your);
  a.react = G('Reacting to signals', a.your); a.feel = G('feeling something', a.react);
  a.noev = G('no evidence', a.react); a.most = G('Most leading theories', a.react); a.struct = G('structure', a.most);
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT19 }];
};

// ===================================================================================================== the stage (z = 1 layout, px)
const BOX = { x: 960, y: 720, w: 380 };
const BH = BOX.w * .62, WIN = { x: BOX.x - BOX.w * .12, y: BOX.y - BH * .56, r: BH * .3 }, WMR = WIN.r * .92;   // window, dish map radius
const TREAD = { fly: { x: 520, y: 790, h: 150 }, box: { y: BOX.y }, bee: { x: 1400, y: 650, h: 270 } };
const STAIR_L = [[BOX.x, BOX.y], [700, BOX.y], [700, TREAD.fly.y], [370, TREAD.fly.y]];
const STAIR_R = [[BOX.x, BOX.y], [1220, BOX.y], [1220, TREAD.bee.y], [1580, TREAD.bee.y]];
// Melbourne: 12 × 10 dishes; the box's own dish becomes cell HERO (the one the camera later pushes into)
const GRID = { cx: 630, cy: 560, n: 12, m: 10, p0: 36, p1: 52, r: 14 };
const HERO = 5 + 4 * GRID.n;
const MOUSE = { x: 1360, y: 800, h: 720 };
const YOUS = { x: 2380, y: 1640, h: 1720 };                   // you, out of frame right at z 1 (the pull back reveals you)
const CAM_A = { cx: 975, cy: 590, z: 1.18 };                      // the ladder
const CAM_Y = { cx: 1390, cy: 735, z: .5 };                    // with you
// an ease from a velocity profile: trapezoid (ramps r) times a weight w0 → w1 across the move (w0 < w1: slower at the start, where
// the macro net is big and bright). Tabulated once.
function easeTrap(r = .28, w0 = 1, w1 = 1) {
  const N = 400, tab = new Float32Array(N + 1); let acc = 0;
  for (let i = 1; i <= N; i++) { const u = (i - .5) / N, tr = Math.min(1, u / r, (1 - u) / r), w = lerp(w0, w1, u); acc += tr * tr * (3 - 2 * tr) * w; tab[i] = acc; }
  for (let i = 0; i <= N; i++) tab[i] /= acc;
  return (u) => { const x = clamp(u) * N, i = Math.min(N - 1, Math.floor(x)); return lerp(tab[i], tab[i + 1], x - i); };
}
const EASE_BACK = easeTrap(.3, .45, 1.5), EASE_PUSH = easeTrap(.3, .8, 1.2);
const cellPos = (i, pitch) => { const c = i % GRID.n, r = Math.floor(i / GRID.n); return [GRID.cx + (c - (GRID.n - 1) / 2) * pitch, GRID.cy + (r - (GRID.m - 1) / 2) * pitch]; };

function scene(a, T) {
  const T0 = a.T0, tIn = T0 + SEAM_HALF;
  const [sx, sy] = NET.somas[NET.centre];
  const CAM_0 = { cx: WIN.x + sx * WMR, cy: WIN.y - sy * WMR, z: NET_PLATE.r / WMR };   // = plateNet exactly
  const tBack = a.two + 1.3;                                    // the pull back lands (slow: the macro net is big and bright)
  const tHero = a.put + 1.1;                                    // the dish is in its grid cell (clone done ~ +1.2 s later)
  const tPull0 = a.your - .3, tPull1 = a.b86 + .2;              // reveal you
  const tPush0 = a.react - .75, tPush1 = a.react + 3.55;        // push into the hero dish
  const tTilt0 = a.struct - .9, tTilt1 = a.end;                 // the tilt up out of the dish into the aisle
  const [hgx, hgy] = cellPos(HERO, GRID.p1);
  const CAM_D = { cx: hgx, cy: hgy, z: B.FIELD.r / GRID.r };
  // zoom camera keys [t, cam]; z in log, sine
  const K = [[tIn, CAM_0], [tBack, CAM_A, EASE_BACK], [tPull0, CAM_A], [tPull1, CAM_Y], [tPush0, CAM_Y], [tPush1, CAM_D, EASE_PUSH]];
  function zcam(t) {
    if (t <= K[0][0]) return { ...K[0][1] };
    if (t >= K[K.length - 1][0]) return { ...K[K.length - 1][1] };
    let i = 0; while (t > K[i + 1][0]) i++;
    const A = K[i][1], Bk = K[i + 1][1], u = (K[i + 1][2] || sineIO)((t - K[i][0]) / (K[i + 1][0] - K[i][0]));
    const z = Math.exp(lerp(Math.log(A.z), Math.log(Bk.z), u));
    // the centre moves so that the point under the screen centre glides evenly at any zoom (lerp in 1/z-weighted space)
    const w = (1 / z - 1 / A.z) / (1 / Bk.z - 1 / A.z || 1e-9), ww = Math.abs(1 / Bk.z - 1 / A.z) < 1e-6 ? u : clamp(w);
    return { cx: lerp(A.cx, Bk.cx, ww), cy: lerp(A.cy, Bk.cy, ww), z };
  }
  // the breath on the zoom camera: none at the plate (tIn) and at the push's landing / the switch to 3D
  const dAmt = (t) => B.driftAmt(t, [tIn, tPush1], 1, 1.2) * (t > tPush1 ? 0 : 1);
  const camNow = (t) => { const c = zcam(t), k = dAmt(t); return { cx: c.cx + drift(t, 4 * k / c.z, 3), cy: c.cy + drift(t, 3 * k / c.z, 5), z: c.z * (1 + .004 * k * drift(t, 1, 7)) }; };

  return (ctx, t) => {
    if (t < T0 + SEAM_HALF) plateNet(ctx, t);
    else if (t < tTilt0) flat(ctx, t, camNow(t));
    else world(ctx, t);
    // c08 draws the ladder UNDER plateNet (hidden at the seam); here it grows back in from its foot once the plate has gone
    F.ladder(ctx, t, T, { hide: 1 - smooth(span(t, T0 + SEAM_HALF + .1, T0 + SEAM_HALF + 1.1)) });
  };

  // ------------------------------------------------------------------------------------------------------------------- 2D stage
  function flat(ctx, t, c) {
    const S = (x, y) => [W / 2 + c.z * (x - c.cx), H / 2 + c.z * (y - c.cy)], z = c.z;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    B.night(ctx);
    // ---- net options: from the plate (macro, dimmed round the centre soma) to the box window's (all alive)
    const nu = smooth(span(t, tBack - 2.1, tBack - .2));             // the net stays dimmed while it zooms (calm), wakes as the box lands
    const netO = { lit: 1, dim: NET_PLATE.dim * (1 - nu), focus: NET.centre, ambient: lerp(NET_PLATE.ambient, 1, nu), w: lerp(.45, .8, nu),
      fire: (i) => (i === NET.centre ? NET_PLATE.fire(t) * (1 - nu) : 0), nSparks: 7 };
    const dishO = { glow: .7, chip: .5, electrodes: lerp(.2, .35, nu), rim: lerp(.5, .65, nu) };
    // ---- the size ladder: treads (stairs) drawn out of the box's tread, creatures rise from their treads
    const stU = expoOut(span(t, a.two - .1, a.two + 1.1)) * (1 - sineIO(span(t, a.put + .3, a.put + 1.3)));
    const boxDown = expoIn(span(t, a.put + .1, a.put + .9));     // the box sinks into its tread, its dish stays
    if (stU > 0) {
      ctx.save(); ctx.translate(W / 2 - z * c.cx, H / 2 - z * c.cy); ctx.scale(z, z);
      for (const pts of [STAIR_L, STAIR_R]) F.trailSpan(ctx, pts, 0, stU, { w: 2.4, spark: stU < .98 });
      ctx.restore();
    }
    creatureOn(ctx, t, S, z, 'fly', TREAD.fly, a.fly - .25, a.put - .1);
    creatureOn(ctx, t, S, z, 'bee', TREAD.bee, a.bee - .25, a.put + .05);
    const cl = span(t, a.put + .5, tHero);                        // the box's dish travels into its grid cell, shrinking
    // ---- the box (clipped above its tread while it sinks)
    if (boxDown < 1) {
      const [bx, by] = S(BOX.x, BOX.y), bw = BOX.w * z, wr = WIN.r * z, [wx, wy] = S(WIN.x, WIN.y);
      const cover = wr > Math.hypot(Math.max(wx, W - wx), Math.max(wy, H - wy));
      if (!cover) {
        ctx.save(); ctx.beginPath(); ctx.rect(-10, -10, W + 20, by + 1); ctx.clip();
        B.boxBody(ctx, t, bx, by + boxDown * BH * z * 1.05, bw, { pump: .6, glow: smooth(span(t, tBack - 1.6, tBack)), hole: cl <= 0 });
        ctx.restore();
      }
    }
    // ---- the dish(es)
    const pitch = lerp(GRID.p0, GRID.p1, sineIO(span(t, a.spread + .35, a.hundred + .5)));
    const [hx, hy] = cl <= 0 ? [WIN.x, WIN.y] : (() => { const [gx, gy] = cellPos(HERO, pitch), e = sineIO(cl); return [lerp(WIN.x, gx, e), lerp(WIN.y, gy, e)]; })();
    const hr = lerp(WMR, GRID.r, sineIO(cl));
    // the clones: split off the hero dish (staggered by distance from its cell), each glides into its own cell
    if (t > tHero - .2) {
      const [ox, oy] = cellPos(HERO, pitch);
      for (let i = 0; i < GRID.n * GRID.m; i++) {
        if (i === HERO) continue;
        const [gx, gy] = cellPos(i, pitch), d = Math.hypot(gx - ox, gy - oy) / (GRID.p0 * 8);
        const u = expoOut(span(t, tHero - .2 + d * .55, tHero + .7 + d * .55)); if (u <= 0) continue;
        const [x, y] = S(lerp(ox, gx, u), lerp(oy, gy, u));
        B.miniDish(ctx, t, x, y, GRID.r * z, { ph: i, a: 1 });
      }
    }
    const [mx, my] = S(hx, hy), mr = hr * z;
    if (cl <= 0 && boxDown < 1) {                                 // in the box: clipped to its window (the window stays where it is)
      const [wx, wy] = S(WIN.x, WIN.y);
      ctx.save(); ctx.beginPath(); ctx.arc(wx, wy, WIN.r * z, 0, TAU); ctx.clip();
      ctx.fillStyle = P.night0; ctx.fillRect(wx - WIN.r * z, wy - WIN.r * z, 2 * WIN.r * z, 2 * WIN.r * z);
      F.dish(ctx, t, F.fieldMap(mx, my, mr), { ...dishO, net: netO });
      ctx.restore();
      const lit = smooth(span(t, tBack - 1.6, tBack));
      if (WIN.r * z < 1400) B.boxWindowRim(ctx, wx, wy + boxDown * BH * z * 1.05, WIN.r * z, BOX.w * z, lit * (1 - boxDown));
    } else {
      // free: the dish itself (it is the HERO cell of the grid), the field's look as it grows in the push
      const pu = smooth(span(t, tPush0 + .4, tPush1 - .3));
      F.dish(ctx, t, F.fieldMap(mx, my, mr), { glow: lerp(.7, B.DISH_FIELD.glow, pu), chip: .5, electrodes: lerp(.35, B.DISH_FIELD.electrodes, pu), rim: lerp(.65, B.DISH_FIELD.rim, pu),
        net: { ...netO, w: lerp(.8, B.NET_STD.w, pu), ambient: 1, lit: 1 } });
    }
    // ---- labels of the ladder
    const lu = (t0, t1) => F.rise(span(t, t0 - .15, t0 + .6)) * (1 - expoIn(span(t, t1, t1 + .45)));
    const txt = (s, x, y, size, u, o = {}) => { if (u <= 0) return; const [X, Y] = S(x, y); F.maskLine(ctx, [[s, o.warm ?? 0]], X, Y, size * Math.min(1, z), u, { align: 'center', ...o }); };
    txt('~200,000', BOX.x, BOX.y - BH - 46, 64, lu(a.two, a.put - .2));
    txt('FLY', TREAD.fly.x, TREAD.fly.y + 44, 24, lu(a.fly + .1, a.put - .3), { serif: false, col: P.halo2, glow: false });
    txt('BOX', BOX.x, BOX.y + 44, 24, lu(a.fly + .3, a.put - .2), { serif: false, col: P.halo2, glow: false });
    txt('BEE', TREAD.bee.x, TREAD.bee.y + 44, 24, lu(a.bee + .1, a.put - .1), { serif: false, col: P.halo2, glow: false });
    txt('<', 715, 662, 76, lu(a.fly + .45, a.put - .25), { col: P.halo1 });
    txt('<', 1210, 600, 76, lu(a.bee + .35, a.put - .15), { col: P.halo1 });
    // ---- the mouse (a third of it lit), on its own floor line drawn out of the grid's
    mouse(ctx, t, S, z);
    txt('120 DISHES', GRID.cx, GRID.cy + GRID.m * GRID.p1 / 2 + 70, 30, lu(a.hundred, a.react - .6), { serif: false, col: P.cream, glow: false, weight: 600 });
    // ---- you (revealed by the pull back), your head's net, 86 BILLION
    you(ctx, t, S, z);
    // ---- 9.03 in the field: signal in, reaction out, the empty ring
    if (t > tPush1 - .6) reaction(ctx, t, S, z, [mx, my, mr]);
    ctx.restore();
  }
  // a creature that rises out of its tread (clipped above the tread line) and sinks back into it
  function creatureOn(ctx, t, S, z, kind, tr, t0, t1) {
    const up = expoOut(span(t, t0, t0 + .9)), dn = expoIn(span(t, t1, t1 + .7)); if (up <= 0 || dn >= 1) return;
    const [x, y] = S(tr.x, tr.y), h = tr.h * z, off = (1 - up + dn) * h * 1.05;
    ctx.save(); ctx.beginPath(); ctx.rect(-10, -10, W + 20, y + 10 - 10 + 1); ctx.clip();
    const bob = 3 * Math.sin(t * 1.4 + tr.x) * z;
    halo(ctx, x, y - h * .45 + off, h * 1.1, .22 * up * (1 - dn), P.halo1, P.core1);
    F.creature(ctx, kind, x, y + off + bob, h, { fill: smooth(span(t, t0 + .4, t0 + 1.4)), lit: 1 });
    ctx.restore();
  }
  function mouse(ctx, t, S, z) {
    const line = expoOut(span(t, a.third - .9, a.third + .2)) * (1 - sineIO(span(t, a.react - .6, a.react + .2)));
    const up = expoOut(span(t, a.third - .55, a.third + .55)), dn = expoIn(span(t, a.react - .7, a.react + .1));
    const [x0, y0] = S(GRID.cx + 150, MOUSE.y), [x1] = S(MOUSE.x + 520, MOUSE.y);
    if (line > 0) F.trailSpan(ctx, [[x0, y0], [x1, y0]], 0, line, { w: 2, spark: line < .98, a: .8 });
    if (up <= 0 || dn >= 1) return;
    const [x, y] = S(MOUSE.x, MOUSE.y), h = MOUSE.h * z, off = (1 - up + dn) * h * .7;
    ctx.save(); ctx.beginPath(); ctx.rect(-10, -10, W + 20, y + 1); ctx.clip();
    const fill = .21 * sineIO(span(t, a.third, a.mouse + .3));
    halo(ctx, x - h * .05, y - h * .1 + off, h * .55, .16 * fill / .21, P.halo1, P.core1);
    F.creature(ctx, 'mouse', x, y + off + 2 * Math.sin(t * 1.1) * z, h, { fill, lit: .9 });
    // "not wired like a brain": the mouse's own net (wired), a piece of the same NET clipped to its head
    const nw = smooth(span(t, a.wired - .2, a.wired + 1.2)) * (1 - dn);
    if (nw > 0) { const hx = x - .26 * h, hy = y + off - .33 * h, hr = .15 * h; ctx.save(); ctx.beginPath(); ctx.arc(hx, hy, hr, 0, TAU); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
      F.net(ctx, t + 2.3, F.fieldMap(hx, hy, hr * 1.9), { lit: nw, ambient: 1, w: .9, grow: lerp(.35, 1, nw), nSparks: 5 }); ctx.restore(); }
    ctx.restore();
    const lu = F.rise(span(t, a.mouse - .15, a.mouse + .6)) * (1 - expoIn(span(t, a.react - .6, a.react - .15)));
    if (lu > 0) { const [lx, ly] = S(MOUSE.x, MOUSE.y + 70); F.maskLine(ctx, [['⅓ MOUSE', 0]], lx, ly, 30 * Math.min(1, z), lu, { serif: false, align: 'center', col: P.cream, glow: false, weight: 600 }); }
  }
  function you(ctx, t, S, z) {
    if (t < tPull0 - .2 || t > tPush1) return;
    const [x, y] = S(YOUS.x, YOUS.y), h = YOUS.h * z;
    if (x - h * .3 > W) return;
    const look = lerp(-.25, -.45, sineIO(span(t, a.b86 - .5, a.b86 + 1))) + .04 * Math.sin(t * .7), br = .02 * Math.sin(t * 1.6);
    ctx.save(); ctx.translate(x, y); ctx.scale(1, 1 + .006 * Math.sin(t * 1.6));
    E.du(ctx, 0, 0, h, { dir: -1, view: 'side', look, light: -1, armR: [.12 + br, .08], armL: [-.08 - br, -.04] });
    ctx.restore();
    // the net in your head (the same NET), it lights up on "Your own brain?"
    const on = .35 + .65 * smooth(span(t, a.your, a.b86 + .3));
    const hx = x - (.03 - .012 * look) * h, hy = y - .875 * h, r = .07 * h;
    halo(ctx, hx, hy, r * 2.6, .32 * on, P.halo1, P.core1);
    ctx.save(); ctx.beginPath(); ctx.arc(hx, hy, r, 0, TAU); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .8;
    F.net(ctx, t, F.fieldMap(hx, hy, r * 2.3), { lit: on, ambient: 1, w: 1, nSparks: 11 });
    ctx.restore();
    const lu = F.rise(span(t, a.b86 - .15, a.b86 + .65)) * (1 - expoIn(span(t, tPush0 - .45, tPush0 + .05)));
    if (lu > 0) { const s = 76, tx = hx - r * 2.2 - F.measure('86 BILLION', s); F.maskLine(ctx, [['86 BILLION', 1]], tx, hy + s * .32, s, lu, {}); }
  }
  // 9.03: a cool signal comes in from the left to the rim (the electrodes flash), the net answers in a wave, a gold reaction leaves
  // on the right. In the middle an empty dashed ring (where a feeling would be) draws and stays empty.
  function reaction(ctx, t, S, z, [cx, cy, r]) {
    const out = 1 - expoIn(span(t, tTilt0 - .9, tTilt0 - .25));
    if (out <= 0) return;
    for (const [k, t0] of [[0, tPush1 + .05], [1, a.noev + 1.6]]) {
      const inU = span(t, t0, t0 + .6), wave = t - (t0 + .6), outU = span(t, t0 + 1.25, t0 + 1.95), amp = k ? .7 : 1;
      if (inU > 0 && inU < 1) {                                 // the cool pulse travels in
        const x0 = cx - r * 1.75, x1 = cx - r * 1.04, x = lerp(x0, x1, expoIn(inU) * .2 + inU * .8);
        F.trailSpan(ctx, [[x0, cy], [x1, cy]], Math.max(0, inU - .35), inU, { w: 3, spark: true, a: amp * out });
        halo(ctx, x, cy, 40, .5 * amp * out, COOL.edge, COOL.core);
      }
      if (wave > -.1 && wave < 1.6) {                            // the net's wave from the left rim
        const m = F.fieldMap(cx, cy, r);
        F.net(ctx, t, m, { lit: 0, ambient: 0 });
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const rr = (.15 + wave * 1.4) * r; ctx.strokeStyle = rgba(P.halo0, .45 * amp * out * (1 - clamp(wave / 1.4))); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(cx - r, cy, rr, -1.2, 1.2); ctx.stroke(); ctx.restore();
        NET.somas.forEach((s, i) => { const d = Math.hypot(s[0] + 1, s[1]); const k2 = (wave - d * .55) / .12; if (k2 > -3 && k2 < 3) { const q = m(s[0], s[1]); halo(ctx, q[0], q[1], r * .09, .7 * amp * out * Math.exp(-k2 * k2), P.halo0, P.core0); } });
      }
      if (outU > 0 && outU < 1) {                               // the gold reaction leaves on the right
        const x0 = cx + r * 1.04, x1 = cx + r * 1.75, x = lerp(x0, x1, expoOut(outU));
        F.trailSpan(ctx, [[x0, cy], [x1, cy]], Math.max(0, outU - .35), outU, { w: 3, spark: true, a: amp * out });
        halo(ctx, x, cy, 40, .55 * amp * out, P.halo0, P.core0);
      }
    }
    // the empty ring in the middle: a dashed cream circle drawn on "feeling", it breathes, nothing ever lights inside it
    const ru = span(t, tPush1 - .5, tPush1 + .7) * out; if (ru <= 0) return;
    const R0 = r * .3 * (1 + .015 * Math.sin(t * 1.3));
    ctx.save(); ctx.globalAlpha = out;
    ctx.fillStyle = rgba(P.night0, .55 * smooth(ru)); ctx.beginPath(); ctx.arc(cx, cy, R0, 0, TAU); ctx.fill();
    ctx.setLineDash([10, 12]); ctx.lineDashOffset = -t * 6; ctx.strokeStyle = rgba(P.cream, .6); ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.arc(cx, cy, R0, -Math.PI / 2, -Math.PI / 2 + TAU * expoOut(ru)); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
  }

  // ------------------------------------------------------------------------------------------------------------------- 3D: the tilt up
  function world(ctx, t) {
    const u = span(t, tTilt0, tTilt1);
    const c = F.camDrift(B.seamGlide(B.camSplit(B.C_TOP, B.C_AISLE, u, [.25, 1], [0, .85]), t, a.end), t, B.driftAmt(t, [tTilt0], .35, 1.2)), v = view(c);
    const dark = 1 - smooth(span(t, tTilt0 + .5, tTilt1 - .4));
    const k = smooth(span(t, tTilt0, tTilt1 - .3));
    const dishO = { glow: lerp(B.DISH_FIELD.glow, B.DISH_AISLE.glow, k), chip: lerp(.5, 1, k), electrodes: lerp(.25, .6, k), rim: lerp(.7, 1, k) };
    F.hall(ctx, v, t, { pool: 1 - dark });
    const out = F.rack(ctx, v, t, { open: F.OPEN, slide: 1, glow: 1 - dark, net: B.NET_STD, dishO, seam: 1 });
    monitorDark(ctx, t, v);
    B.youAisle(ctx, t, v, { look: -.15 });
    if (dark > 0) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = dark; B.night(ctx); ctx.restore();
      const m = out.dish && out.dish.map; if (m) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.dish(ctx, t, m, { ...dishO, net: B.NET_STD }); ctx.restore(); }
    }
  }
  function monitorDark(ctx, t, v) { F.monitor(ctx, v, t, B.MON.X, B.MON.Y, B.MON.Z, B.MON.w); }
}
