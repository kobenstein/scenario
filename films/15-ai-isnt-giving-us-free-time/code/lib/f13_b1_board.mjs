// Film 13 · B1 · c04 (from the porthole iris ≈ 102.4 to 144.20): where the hour went. Explainer pictures on the night, built from the
// film's own elements (gold sand, the gold thread, the hourglass, the ring). Shared by scenes/sc04.mjs and (iris) lib/f13_b1_water.mjs;
// c05 continues from the ∞ and the small glass (lib/f13_b1_vessel.mjs). Owner direction 28.10.: separate clean pictures, joined by a
// carrier; the hourglass is an anchor (4.06★), no journey. The stage camera only breathes, except the one pull back of 4.06★.
//
// | ID    | anchor                   | picture (one idea)                                                                 | moves (≤ 2)           | → carrier              |
// |-------|--------------------------|------------------------------------------------------------------------------------|-----------------------|------------------------|
// | 4.02  | made · easier            | (out of the porthole: its ring is a wave that washes the kitchen away) the drum,    | drum · bar            | the bar                |
// |       |                          | gold sand tumbling; a gold bar `LAUNDRY` runs out of it; on "easier" it shrinks     |                       |                        |
// | 4.03  | often · clothes · cleaner| the bar grows back in three pieces, one per word: ↻ · shirt · sparkle               | bar · icons           | the pieces             |
// | 4.04  | Cowan · rose · machine   | the pieces lift into a staircase; the drum climbs onto the first step, an iron, a   | steps · icons         | the steps              |
// |       |                          | vacuum and a dryer are drawn on the others · `RUTH SCHWARTZ COWAN` + source         |                       |                        |
// | 4.05  | cooking … grew           | the steps stand up as four columns COOK CLEAN SHOP KIDS; on "shrink" the sand of    | sand arcs over        | the columns            |
// |       |                          | the first two arcs over and on "grew" piles onto the others · source                |                       |                        |
// | 4.06★ | disappear · moved        | pull back: the columns are the sand in the lower bulb of a giant hourglass, drawn   | pull back · thread    | the glass              |
// |       |                          | by the thread; sand still falls on them · `MOVED`                                   |                       |                        |
// | 4.07  | letter · days · second   | the glass steps left and small; its thread runs out as a line of days; a letter     | letter · email        | the line               |
// |       |                          | walks it in 3 days (`3 days`), an email of light shoots it in a blink (`1 second`)  |                       |                        |
// | 4.08  | less · far more          | emails shoot along the line one after another and stack into a tower               | emails · tower        | the envelopes          |
// | 4.09  | Microsoft · two minutes  | the tower falls into an hour dial; a hand sweeps it, a ping every 2 minutes ·       | hand · pings          | the dial               |
// |       |                          | `every 2 min` · `MICROSOFT WORK TREND INDEX 2025`                                   |                       |                        |
// | 4.10  | infinite workday         | the dial twists into ∞; a grain runs round it · `THE INFINITE WORKDAY`              | twist · grain         | the ∞ (→ c05)          |
import * as B from './f13_b1_kit.mjs';
const { E, K } = B;
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, prng, rad, lin } = E;

// the washer icon the thread draws in the kitchen (screen coords; water.mjs draws it, the iris starts from its porthole)
export const WASH = { x: 430, y: 380, w: 230, h: 270 };
WASH.px = WASH.x; WASH.py = WASH.y + WASH.h * .1; WASH.r = 62;
const LW = 3;
const DRUM = { x: 470, y: 470, r: 150 };
const BAR = { x: 700, y: 452, h: 36 };
const SEG = [380, 170, 170, 190];                         // the bar after "easier" + the three pieces that grow back
const STEP = 92;                                          // staircase rise
const COL = { base: 772, w: 132, xs: [600, 880, 1160, 1440], h0: [330, 300, 170, 150], h1: [170, 150, 320, 340], names: ['COOK', 'CLEAN', 'SHOP', 'KIDS'] };
// the giant hourglass of 4.06★ (world coords at k 1 = screen): its lower bulb holds the columns
const GG = { x: 1020, h: 3400 }; GG.base = COL.base + GG.h * .05 + 4; GG.neck = [GG.x, GG.base - GG.h * .5];
// stage camera: v = world point at screen centre (960, 540), k = zoom
const VIEW0 = { vx: 960, vy: 540, k: 1 };
const VIEW_G = { vx: GG.x, vy: GG.base - GG.h * .5 + 40 / .3, k: .3 };
const NECK_S = [300, 520];                                // the small glass's neck on screen from 4.07
const VIEW_S = { vx: GG.x - (NECK_S[0] - 960) / .17, vy: GG.neck[1] - (NECK_S[1] - 540) / .17, k: .17 };
const LINE = { x1: 1560, y: 520 };
const DIAL = { x: 1430, y: 470, r: 200 };
const INF = { x: 1010, y: 470, a: 470 };

const circlePts = (x, y, r, n = 64, a0 = 0) => Array.from({ length: n + 1 }, (_, i) => { const th = a0 + i / n * Math.PI * 2; return [x + Math.cos(th) * r, y + Math.sin(th) * r]; });
const sc = (pts, x, y, s) => pts.map(([px, py]) => [x + px * s, y + py * s]);
// icons (unit ≈ 1 = 1 px at s 1, centred on 0,0, about 80 px tall)
export const ICON = {
  loop: [...Array.from({ length: 34 }, (_, i) => { const th = -Math.PI * .35 + i / 33 * Math.PI * 1.7; return [Math.cos(th) * 30, Math.sin(th) * 30]; }), [14, -40], [Math.cos(Math.PI * 1.35) * 30, Math.sin(Math.PI * 1.35) * 30], [Math.cos(Math.PI * 1.35) * 30 + 16, Math.sin(Math.PI * 1.35) * 30 + 12]],
  shirt: [[-14, -34], [0, -24], [14, -34], [34, -26], [44, -6], [30, 0], [26, -10], [26, 36], [-26, 36], [-26, -10], [-30, 0], [-44, -6], [-34, -26], [-14, -34]],
  spark: [[0, -40], [8, -8], [40, 0], [8, 8], [0, 40], [-8, 8], [-40, 0], [-8, -8], [0, -40]],
  iron: [[-40, 20], [34, 20], [40, 8], [24, -12], [-16, -12], [-40, 20], [-40, 20], [-8, -12], [-8, -28], [22, -28], [22, -12]],
  vacuum: [[-36, 30], [14, 30], [20, 16], [-30, 16], [-36, 30], [-36, 30], [8, 16], [34, -44], [48, -44]],
  dryer: [[-30, -36], [30, -36], [30, 36], [-30, 36], [-30, -36], [-30, -22], [30, -22], ...Array.from({ length: 25 }, (_, i) => { const th = i / 24 * Math.PI * 2; return [Math.cos(th) * 18, 8 + Math.sin(th) * 18]; })],
};
// the ∞ (lemniscate of Bernoulli) and the circle with the same parameter (for the twist)
// the drum: gold ring line + tumbling sand (the kitchen's washer icon draws the same, so the iris starts on identical pixels)
export const drumSpin0 = (t) => 2.2 * B.rampInt(t, 0, 1);
export function drumIcon(ctx, x, y, r, t, load, spin = drumSpin0(t)) {
  if (load <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r - 4, 0, 6.29); ctx.clip(); B.drumSand(ctx, x, y, r * .9, spin, load); ctx.restore();
  K.trailSpan(ctx, circlePts(x, y, r, 72, Math.PI / 2), 0, load, { w: LW * clamp(r / 90, .7, 1.4), spark: false });
}
const lem = (th, a) => { const s = Math.sin(th), c = Math.cos(th), d = 1 + s * s; return [a * c / d, a * s * c / d]; };

export function makeBoard(T) {
  const S = (w, n) => T.S('s05', w, n), S6 = (w, n) => T.S('s06', w, n);
  const a = {
    else: S('else'), washing: S('washing'), made: S('made'), laundry: S('laundry'), easier: S('easier'), often: S('often'), clothes: S('clothes'),
    cleaner: S('cleaner'), historian: S('historian'), ruth: S('Ruth'), standards: S('standards'), rose: S('rose'), every: S('every new'), newm: S('new machine'),
    machine: S('machine', 1), later: S('Later'), cooking: S('cooking'), cleaning: S('cleaning'), shrink: S('shrink'), shopping: S('shopping'),
    childcare: S('childcare'), grew: S('grew'), work: S('The work'), disappear: S('disappear'), moved: S('moved'),
    then: S6('Then'), email: S6('email'), letter: S6('letter'), days: S6('days'), now: S6('Now'), second: S6('second'), less: S6('less'),
    wrote: S6('wrote'), more: S6('far more'), ms: S6("Microsoft's"), interrupted: S6('interrupted'), minutes: S6('minutes'), name: S6('name'),
    infinite: S6('infinite'), workday: S6('workday'), s07: T.seg('s07').start,
  };
  // the iris (4.01 → 4.02): the porthole's ring runs outwards as a wave; inside it the board
  const tI0 = a.made - .35, tI1 = a.easier - .15;
  const iris = (t) => lerp(WASH.r, 1750, sineIO(span(t, tI0, tI1)) ** 1.4);
  const drumAt = (t) => { const u = sineIO(span(t, tI0, tI1 + .2)); const sh = sineIO(span(t, a.historian - .3, a.ruth + .5)); const st = stepPos(0, 1);
    const x = lerp(WASH.px, DRUM.x, u), y = lerp(WASH.py, DRUM.y, u), r = lerp(WASH.r, DRUM.r, u);
    return [lerp(x, st[0] + SEG[0] * .5, sh), lerp(y, st[1] - 48, sh), lerp(r, 40, sh)]; };
  // the bar pieces: x0 and width for piece i (0 = what is left after "easier"); staircase lift
  const bar0 = (t) => lerp(0, 900, sineIO(span(t, a.laundry - .3, a.laundry + .7))) - (900 - SEG[0]) * sineIO(span(t, a.easier - .1, a.easier + .65));
  const grow = [null, [a.often - .25, a.often + .45], [a.clothes - .25, a.clothes + .45], [a.cleaner - .25, a.cleaner + .45]];
  const segW = (i, t) => (i === 0 ? bar0(t) : SEG[i] * expoOut(span(t, grow[i][0], grow[i][1])));
  const segX = (i) => BAR.x + SEG.slice(0, i).reduce((s, v) => s + v, 0);
  function stepPos(i, lift) { return [segX(i) - 120 * lift, BAR.y - STEP * i * lift + 150 * lift]; }
  const liftT = (i) => sineIO(span(_t, a.rose - .5 + i * .12, a.rose + .5 + i * .12));
  let _t = 0;
  // 4.05: steps → columns
  const colU = (i, t) => sineIO(span(t, a.later - .2 + i * .1, a.later + 1.0 + i * .1));
  const colH = (i, t) => i < 2 ? lerp(COL.h0[i], COL.h1[i], sineIO(span(t, a.shrink - .25 + i * .15, a.shrink + .55 + i * .15)))
                               : lerp(COL.h0[i], COL.h1[i], sineIO(span(t, a.shopping + .1 + (i - 2) * .5, a.grew + .2 + (i - 2) * .3)));
  // stage camera (keys in log zoom)
  const tPB0 = a.disappear - .9, tPB1 = a.moved + .5, tS0 = a.then - .3, tS1 = a.email + .5;
  function view(t) {
    const u = sineIO(span(t, tPB0, tPB1)), w = sineIO(span(t, tS0, tS1));
    const KA = 1.22, k0 = Math.exp(lerp(Math.log(VIEW0.k * (1 + (KA - 1) * sineIO(span(t, a.easier, tPB0)))), Math.log(VIEW_G.k), u));
    const k = Math.exp(lerp(Math.log(k0), Math.log(VIEW_S.k), w));
    // the centre follows so that the frame converges like a zoom about the glass's neck
    const P0 = [VIEW0.vx, VIEW0.vy], P1 = [VIEW_G.vx, VIEW_G.vy], P2 = [VIEW_S.vx, VIEW_S.vy];
    const g = (KA / k0 - 1) / (KA / VIEW_G.k - 1);     // 0..1 by zoom (no sideways lurch)
    const vx0 = lerp(P0[0], P1[0], clamp(g)), vy0 = lerp(P0[1], P1[1], clamp(g));
    const h = (k0 / k - 1) / (k0 / VIEW_S.k - 1 || 1);
    let v = { vx: lerp(vx0, P2[0], clamp(w > 0 ? h : 0)), vy: lerp(vy0, P2[1], clamp(w > 0 ? h : 0)), k };
    // later stages (c05/c06 add them): each a zoom about the fixed point between the two views (linear in 1/k), or a pan
    for (const st of STAGES) {
      const u = sineIO(span(t, st.t0, st.t1)); if (u <= 0) break;
      const kp = v.k, kk = Math.exp(lerp(Math.log(kp), Math.log(st.V.k), u)), g = Math.abs(kp - st.V.k) < 1e-9 ? u : (kp / kk - 1) / (kp / st.V.k - 1);
      v = { vx: lerp(v.vx, st.V.vx, g), vy: lerp(v.vy, st.V.vy, g), k: kk };
    }
    return v;
  }
  const STAGES = [], hooks = {};
  const addView = (t0, t1, V) => { STAGES.push({ t0, t1, V }); STAGES.sort((p, q) => p.t0 - q.t0); };
  const viewAt = (wx, wy, sx, sy, k) => ({ vx: wx - (sx - 960) / k, vy: wy - (sy - 540) / k, k });
  const apply = (ctx, v, t) => { const z = 1 + .01 * Math.sin(t * .33); ctx.translate(960 + 5 * E.drift(t, 1, 4), 540 + 4 * E.drift(t, 1, 8)); ctx.scale(v.k * z, v.k * z); ctx.translate(-v.vx, -v.vy); };
  const toS = (v, x, y, t) => { const z = 1 + .01 * Math.sin(t * .33); return [960 + 5 * E.drift(t, 1, 4) + (x - v.vx) * v.k * z, 540 + 4 * E.drift(t, 1, 8) + (y - v.vy) * v.k * z]; };
  const toW = (v, x, y, t) => { const z = 1 + .01 * Math.sin(t * .33); return [v.vx + (x - 960 - 5 * E.drift(t, 1, 4)) / (v.k * z), v.vy + (y - 540 - 4 * E.drift(t, 1, 8)) / (v.k * z)]; };
  const sdrift = (ctx, t) => ctx.translate(4 * E.drift(t, 1, 14), 3 * E.drift(t, 1, 18));

  // ---------------------------------------------------------------- world layer (4.02–4.06, and the glass after)
  function world(ctx, t, v) {
    _t = t;
    // the drum: gold ring line + tumbling sand; it climbs onto step 1 at Cowan, is wound back at "Later"
    const [dx, dy, dr] = drumAt(t), back = 1 - sineIO(span(t, a.later - .4, a.later + .3));
    const spin = drumSpin0(t) + 1.6 * B.rampInt(t, a.often - .2, a.often + .4) + 1.6 * B.rampInt(t, a.clothes - .2, a.clothes + .4) + 1.6 * B.rampInt(t, a.cleaner - .2, a.cleaner + .4) - 5 * B.rampInt(t, a.historian - .5, a.historian + .5);
    drumIcon(ctx, dx, dy, dr, t, back, spin);
    // the bar pieces (4.02–4.04), then the columns (4.05–4.06)
    for (let i = 0; i < 4; i++) {
      const w = segW(i, t); if (w < 1) continue;
      const lift = liftT(i), [sx0, sy0] = stepPos(i, lift);
      const cu = colU(i, t);
      const ch = colH(i, t), cx = COL.xs[i] - COL.w / 2, cy = COL.base - ch;
      const cm = hooks.col ? hooks.col(i, t) : null; if (cm && cm.a <= 0) continue;
      const x = lerp(sx0, cx, cu), y = lerp(sy0, cy, cu) + (cm ? cm.dy : 0), ww = lerp(w - 6, COL.w, cu), hh = lerp(BAR.h + (i ? 10 * lift : 0), ch, cu);
      B.goldBar(ctx, x, y, ww, hh, t, { cheap: cu > 0 && cu < 1, seed: 3 + i, a: cm ? cm.a : 1 });
      // a sheen that runs along (life in the holds)
      const sh = ((t * .33 + i * .19) % 1.6) - .3;
      if (sh > 0 && sh < 1) { ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, ww, hh, 8); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const gx = cu < .5 ? x + ww * sh : x + ww / 2, gy = cu < .5 ? y + hh / 2 : y + hh * (1 - sh);
        ctx.fillStyle = rad(ctx, gx, gy, 90, [[0, rgba(P.core0, .35)], [1, rgba(P.core0, 0)]]); ctx.fillRect(gx - 90, gy - 90, 180, 180); ctx.restore(); }
    }
    // the sand cut off on "easier" falls away
    const fu = span(t, a.easier - .05, a.easier + 1.6);
    if (fu > 0 && fu < 1) { const r = prng(77); ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 70; k++) { const gx = BAR.x + SEG[0] + r() * (900 - SEG[0]), d = clamp((fu - r() * .35) / .65); if (d <= 0) { r(); continue; }
        const y = BAR.y + BAR.h * r() + 900 * d * d, al = (1 - d) * .9; ctx.fillStyle = rgba(r() > .5 ? P.core1 : P.halo0, al); ctx.fillRect(gx, y, 3, 3); }
      ctx.restore(); }
    // icons under the new pieces (4.03) and on the steps (4.04)
    const icon = (pts, i, t0, s = 1, dy = 0) => { const u = sineIO(span(t, t0, t0 + .55)) * (1 - sineIO(span(t, a.standards - .3, a.standards + .35))); if (u <= 0) return;
      const lift = liftT(i), [sx0, sy0] = stepPos(i, lift), x = sx0 + SEG[i] / 2, y = sy0 + 110 + dy;
      K.trailSpan(ctx, sc(pts, x, y, s), 0, u, { w: LW, spark: u < 1 }); };
    icon(ICON.loop, 1, a.often - .15, .9);
    icon(ICON.shirt, 2, a.clothes - .15, .9);
    icon(ICON.spark, 3, a.cleaner - .15, .9);
    // on the steps the 4.03 icons are wound back and the machines drawn
    // (the 4.03 icons sit under the bar; once the steps lift they are replaced: wound back on "rose")
    // machines on steps 2–4 (one per word)
    const mach = (pts, i, t0) => { const u = sineIO(span(t, t0 - .1, t0 + .45)) * (1 - sineIO(span(t, a.later - .5, a.later + .1))); if (u <= 0) return; const [sx0, sy0] = stepPos(i, 1); K.trailSpan(ctx, sc(pts, sx0 + SEG[i] / 2, sy0 - 52, .95), 0, u, { w: LW, spark: u < 1 }); };
    mach(ICON.iron, 1, a.every); mach(ICON.vacuum, 2, a.newm); mach(ICON.dryer, 3, a.machine);
    // 4.05: the sand of COOK and CLEAN arcs over onto SHOP and KIDS
    const au = span(t, a.shrink - .2, a.grew + .3);
    if (au > 0 && au < 1) { const r = prng(91); ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 90; k++) { const from = k % 2, to = 2 + (k % 2 ? 0 : 1), d = clamp((au - r() * .5) / .5); const rr = r(); if (d <= 0 || d >= 1) continue;
        const x0 = COL.xs[from] + (rr - .5) * 100, y0 = COL.base - COL.h1[from] - 10, x1 = COL.xs[to] + (r() - .5) * 100, y1 = COL.base - lerp(COL.h0[to], COL.h1[to], d) - 6;
        const e = sineIO(d), x = lerp(x0, x1, e), y = lerp(y0, y1, e) - 260 * Math.sin(Math.PI * d);
        ctx.fillStyle = rgba(rr > .5 ? P.core1 : P.halo0, .9 * Math.sin(Math.PI * d) ** .3); ctx.fillRect(x - 2, y - 2, 4, 4); }
      ctx.restore(); }
    // from "Later": a thin stream of sand falls from above the frame between CLEAN and SHOP (the giant glass's own stream)
    const sf = smooth(span(t, a.later + .2, a.later + 1.2)) * (1 - smooth(span(t, a.moved - .2, a.moved + .3)));
    if (sf > 0) {
      const y0 = GG.neck[1], y1 = COL.base - 2, yh = lerp(y0, y1, smooth(span(t, a.later + .2, a.later + 1.4)));
      K.trailSpan(ctx, [[GG.x, y0], [GG.x, yh]], 0, 1, { w: 2.4, a: sf, spark: false });
      const r = prng(21); ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 40; i++) { const q = (r() + t * (.35 + .1 * r())) % 1, y = lerp(y0, y1, q); if (y > yh) continue; ctx.fillStyle = rgba(P.core1, .8 * sf); ctx.fillRect(GG.x - 2 + (r() - .5) * 8, y, 3.5, 3.5); }
      ctx.restore();
      if (yh >= y1 - 1) halo(ctx, GG.x, y1, 70, .7 * sf);
    }
    // 4.06★: the giant glass, drawn by the thread up both walls, then the sand falling on the columns
    const gu = sineIO(span(t, a.disappear - .8, a.moved + .1));
    if (gu > 0) {
      const ga = smooth(span(gu, .55, 1));
      const ho = hooks.glass ? hooks.glass(t, v) : {}, leak = ho.leak; delete ho.leak;
      if (ga > 0) K.hourglass(ctx, GG.x, GG.base, GG.h, t, { top: .5, bot: 0, flow: smooth(span(t, a.moved - .2, a.moved + .5)), glow: .6, a: ga, ...ho });
      if (leak) {   // sand leaking out through the crack (c05): a stream between tail u0 and head u, grains running down it
        const u0 = leak.u0 ?? 0, hd = K.trailSpan(ctx, leak.pts, u0, leak.u, { w: 3 / v.k, spark: false });
        if (hd) halo(ctx, hd[0], hd[1], 30 / v.k, .6 * (1 - u0));
        const r = prng(12); ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 26; i++) { const q = lerp(u0, leak.u, (r() + t * (.5 + .3 * r())) % 1), n = leak.pts.length - 1, f = q * n, j = Math.min(n - 1, Math.floor(f)), p = leak.pts[j], p2 = leak.pts[j + 1];
          ctx.fillStyle = rgba(P.core1, .8); const gs = 3.2 / v.k; ctx.fillRect(lerp(p[0], p2[0], f - j) + (r() - .5) * 10 / v.k, lerp(p[1], p2[1], f - j) + (r() - .5) * 10 / v.k, gs, gs); }
        ctx.restore();
      }
      const wall = (sgn) => Array.from({ length: 49 }, (_, i) => { const y = -.07 - .86 * i / 48, d = Math.abs(y + .5) / .43, x = .035 + .255 * Math.sin(Math.min(1, d * 1.3) * Math.PI / 2) * (1 - .25 * Math.max(0, d - .86) / .14); return [GG.x + sgn * x * GG.h, GG.base + y * GG.h]; });
      const uu = clamp(gu / .8);
      for (const sgn of [-1, 1]) K.trailSpan(ctx, wall(sgn), Math.max(0, uu - .45) * (1 - ga), uu, { w: LW / .3, a: 1 - .6 * ga, spark: uu < 1 });
    }
  }

  // ---------------------------------------------------------------- screen layer (text; 4.07–4.10)
  function screen(ctx, t, v) {
    // text of 4.02–4.06
    B.line(ctx, 'LAUNDRY', BAR.x, BAR.y - 34, B.inOut(t, a.laundry - .2, a.historian - .6), { size: 56 });
    B.caption(ctx, t, 150, 210, { label: 'RUTH SCHWARTZ COWAN', src: 'MORE WORK FOR MOTHER · 1983', a: a.ruth - .3, b: a.later - .6 });
    B.line(ctx, 'GERSHUNY & HARMS · 2016', 150, 210, B.inOut(t, a.later + .2, a.disappear - .8), { size: 30, col: rgba(P.halo2, .85) });
    const cu = colU(3, t);
    if (cu > .6) for (let i = 0; i < 4; i++) { const tt = [a.cooking, a.cleaning, a.shopping, a.childcare][i]; const [x, y] = toS(v, COL.xs[i], COL.base + 76, t); B.line(ctx, COL.names[i], x, y, B.inOut(t, tt - .2, a.disappear - .9, i * 0), { size: 56, align: 'center' }); }
    B.line(ctx, 'MOVED', 1440, 560, B.inOut(t, a.moved - .15, a.then - .4), { size: 56 });
    // ---- 4.07: the glass's thread runs out as a line of days
    const nk = toS(v, GG.neck[0], GG.neck[1], t);
    const lu = sineIO(span(t, a.email - .3, a.letter - .1)), lb = sineIO(span(t, a.ms - .3, a.ms + .9));
    if (lu > 0 && lb < 1) {
      { // time flows along the line: grains run from the glass to the end
        const r = prng(33), xA = nk[0] + 60, xB = lerp(xA, LINE.x1, lu), xL = lerp(xA, LINE.x1, lb); ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 36; i++) { const q = (r() + t * (.22 + .1 * r())) % 1, x = lerp(xA, LINE.x1, q); if (x > xB || x < xL) { r(); continue; } const s2 = 2 + 2 * r(); ctx.fillStyle = rgba(P.core1, .85); ctx.fillRect(x, LINE.y - 6 + 12 * r() - s2 / 2, s2, s2); }
        ctx.restore();
        for (const k of [0, .5]) { const q = ((t * .4 + k) % 1), hx = lerp(xA, LINE.x1, q); if (hx < xB && hx > xL) halo(ctx, hx, LINE.y, 110, .5); }
      }
      const pts = [[nk[0], nk[1]], [nk[0] + 60, LINE.y], [LINE.x1, LINE.y]];
      K.trailSpan(ctx, pts, lb, lu, { w: LW, spark: lu < 1 });
      // three day ticks, lit as the letter passes
      for (let d = 1; d <= 3; d++) { const x = lerp(nk[0] + 60, LINE.x1, d / 3), on = smooth(span(t, letterT(d / 3) - .05, letterT(d / 3) + .3));
        const tu = smooth(span(t, a.letter - .3 + d * .1, a.letter + .2 + d * .1)) * (1 - lb); if (tu <= 0) continue;
        ctx.save(); ctx.strokeStyle = rgba(mixHex(P.halo2, P.core0, on), .6 + .4 * on); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, LINE.y - 16 * tu); ctx.lineTo(x, LINE.y + 16 * tu); ctx.stroke(); ctx.restore();
        if (on > 0 && on < 1) halo(ctx, x, LINE.y, 50, .6 * Math.sin(on * Math.PI)); }
    }
    // the letter (paper: warm, dim) walks the line; the email (cool light) shoots it
    const x0 = nk[0] + 60;
    const lp = letterP(t);
    if (lp != null) { const [gx, gy, gr] = toDial(NE, t, lerp(x0, LINE.x1 - 60, lp), LINE.y - 66); if (gr != null) envelopeS(ctx, gx, gy, 144 * gr, 90 * gr, t, 0, 1); }
    // emails: the first on "second", then more and more (4.08)
    for (let i = 0; i < NE; i++) {
      const ts = emailT[i]; if (t < ts) break;
      const u = expoOut(span(t, ts, ts + .28)), tw = towerY(i + 1);
      const fx = lerp(x0, LINE.x1 - 60 + jit[i][0], u), fy = lerp(LINE.y - 66, tw, smooth(span(t, ts + .12, ts + .4)));
      const [gx, gy, gr] = toDial(i, t, fx, fy);
      if (gr != null) envelopeS(ctx, gx, gy, 144 * gr, 90 * gr, t, 1, 1, jit[i][1] * (1 - dialU(i, t)));
      if (u < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(B.SCREEN, .5 * (1 - u)); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(lerp(x0, fx, .3), fy); ctx.lineTo(fx - 50, fy); ctx.stroke(); ctx.restore(); }
    }
    B.line(ctx, '3 days', 960, 330, B.inOut(t, a.days - .25, a.now + .1), { size: 120, serif: true, align: 'center' });
    B.line(ctx, '1 second', 960, 330, B.inOut(t, a.second - .1, a.less - .6), { size: 120, serif: true, align: 'center' });
    // ---- 4.09: the dial
    const du = sineIO(span(t, a.ms - .3, a.ms + .8)), tw = twist(t);
    if (du > 0 && t < a.s07) {
      const ring = Array.from({ length: 121 }, (_, i) => { const th = -Math.PI / 2 + i / 120 * Math.PI * 2; const c = [DIAL.x + Math.cos(th) * DIAL.r, DIAL.y + Math.sin(th) * DIAL.r];
        const l = lem(th + Math.PI / 2 - Math.PI, INF.a); const lp2 = [INF.x + l[0], INF.y + l[1]]; return [lerp(c[0], lp2[0], tw), lerp(c[1], lp2[1], tw)]; });
      const inf = tw > 0;
      // the dial ring (cool: the machine's count) – a thread of light
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(B.ICE, .25); ctx.lineWidth = 14; ctx.filter = 'blur(8px)'; ctx.beginPath(); ring.slice(0, Math.max(2, Math.round(du * 120) + 1)).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.strokeStyle = rgba(B.ICE, .95); ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath(); ring.slice(0, Math.max(2, Math.round(du * 120) + 1)).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
      // 30 ticks (every 2 minutes) and the sweeping hand; a ping where it passes a tick
      const tk = (1 - tw) * du;
      if (tk > 0) {
        const hand = B.rampInt(t, a.ms, a.ms + 1.2) * .45;          // revolutions
        for (let i = 0; i < 30; i++) {
          const th = -Math.PI / 2 + i / 30 * Math.PI * 2, c = Math.cos(th), s = Math.sin(th);
          const pass = (hand - i / 30), ph = pass - Math.floor(pass), lit = pass > 0 ? Math.exp(-ph * 9) : 0;
          ctx.save(); ctx.globalAlpha = tk; ctx.strokeStyle = rgba(mixHex(B.COOL, P.cream, lit), .55 + .45 * lit); ctx.lineWidth = 3 + 2 * lit; ctx.beginPath(); ctx.moveTo(DIAL.x + c * (DIAL.r - 22), DIAL.y + s * (DIAL.r - 22)); ctx.lineTo(DIAL.x + c * (DIAL.r - 8), DIAL.y + s * (DIAL.r - 8)); ctx.stroke(); ctx.restore();
          if (lit > .05) halo(ctx, DIAL.x + c * (DIAL.r + 18), DIAL.y + s * (DIAL.r + 18), 46, .7 * lit * tk, B.SCREEN, P.cream);
        }
        const th = -Math.PI / 2 + hand * Math.PI * 2;
        ctx.save(); ctx.globalAlpha = tk; ctx.strokeStyle = rgba(P.cream, .9); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(DIAL.x, DIAL.y); ctx.lineTo(DIAL.x + Math.cos(th) * (DIAL.r - 40), DIAL.y + Math.sin(th) * (DIAL.r - 40)); ctx.stroke(); ctx.restore();
      }
      // on the ∞: a grain of sand runs round it, and on and on
      if (inf) grainOn(ctx, ring, t, tw);
    }
    B.caption(ctx, t, 560, 500, { num: 'every 2 min', src: 'MICROSOFT WORK TREND INDEX 2025', a: a.interrupted - .3, b: a.name - .5, numSize: 110 });
    B.line(ctx, 'THE INFINITE WORKDAY', INF.x, 790, B.inOut(t, a.infinite - .2, a.s07 + .1), { size: 56, align: 'center' });
  }
  // the letter's way (0..1) and when it passes x share s
  const tL0 = a.letter + .1, tL1 = a.days + .25;
  const letterP = (t) => (t < a.letter - .2 ? null : sineIO(span(t, tL0, tL1)));
  const letterT = (s) => { let lo = tL0, hi = tL1; for (let i = 0; i < 20; i++) { const m = (lo + hi) / 2; if (sineIO(span(m, tL0, tL1)) < s) lo = m; else hi = m; } return lo; };
  // emails: one on "second", two on "write less?", then a flood on "far more"
  const emailT = (() => { const o = [a.second - .3, a.less - .5, a.less - .15]; const n = 26, t0 = a.wrote - .1, t1 = a.more + .5; for (let i = 0; i < n; i++) o.push(t0 + (t1 - t0) * Math.pow(i / n, .7)); return o; })();
  const NE = emailT.length;
  const jit = (() => { const r = prng(404); return Array.from({ length: NE }, () => [(r() - .5) * 26, (r() - .5) * .14]); })();
  const towerY = (n) => LINE.y - 66 - 13.5 * n;
  // 4.09: the tower falls into the dial: envelope i flies to tick i and shrinks into it (gr → 0)
  const dialU = (i, t) => sineIO(span(t, a.ms - .2 + (NE - i) * .035, a.ms + .6 + (NE - i) * .035));   // from the top of the tower down
  function toDial(i, t, fx, fy) {
    const u = dialU(i, t); if (u >= 1) return [0, 0, null];
    const th = -Math.PI / 2 + (i % 30) / 30 * Math.PI * 2, x = DIAL.x + Math.cos(th) * (DIAL.r + 18), y = DIAL.y + Math.sin(th) * (DIAL.r + 18);
    return [lerp(fx, x, u), lerp(fy, y, u) - 120 * Math.sin(u * Math.PI), 1 - u * .9];
  }
  const twist = (t) => sineIO(span(t, a.name - .1, a.infinite + .3));
  // a light envelope (cheap): body, edge, flap; cool = email of light, warm paper = the letter
  function envelopeS(ctx, x, y, w, h, t, cool, a = 1, rot = 0) {
    if (w < 4) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a;
    ctx.fillStyle = cool ? lin(ctx, -w / 2, 0, w / 2, 0, [[0, mixHex(P.ind2, B.SCREEN, .45)], [1, mixHex(P.ind2, B.SCREEN, .7)]]) : lin(ctx, -w / 2, 0, w / 2, 0, [[0, mixHex(P.night1, P.halo1, .35)], [1, mixHex(P.ind2, P.halo0, .45)]]);
    ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 4); ctx.fill();
    ctx.strokeStyle = cool ? rgba(P.cream, .9) : rgba(P.core1, .9); ctx.lineWidth = 2.2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-w / 2 + 3, -h / 2 + 3); ctx.lineTo(0, h * .1); ctx.lineTo(w / 2 - 3, -h / 2 + 3); ctx.stroke();
    ctx.restore();
    if (cool) halo(ctx, x, y, w * .9, .25 * a, B.SCREEN, P.cream);
  }

  // the ∞ after 4.10 (c05 morphs these points; same parameter as the dial ring) and its drawing (ICE thread / gold thread + grain)
  function ringPts(t) { return Array.from({ length: 121 }, (_, i) => { const th = -Math.PI / 2 + i / 120 * Math.PI * 2, l = lem(th + Math.PI / 2 - Math.PI, INF.a); return [INF.x + l[0], INF.y + l[1]]; }); }
  // a grain of sand runs round the ∞ (and on round the vessel and the cycle): a short gold trail with a glow at its head
  function grainOn(ctx, pts, t, al = 1) {
    if (al <= 0) return;
    const f = ((((t - a.infinite) * .32 + .5) % 1) + 1) % 1, f0 = f - .08;
    if (f0 >= 0) K.trailSpan(ctx, pts, f0, f, { w: 2.6, a: al, spark: false }); else { K.trailSpan(ctx, pts, 0, f, { w: 2.6, a: al, spark: false }); K.trailSpan(ctx, pts, 1 + f0, 1, { w: 2.6, a: al, spark: false }); }
    const fi = f * 120, j = Math.min(119, Math.floor(fi)), p = [lerp(pts[j][0], pts[j + 1][0], fi - j), lerp(pts[j][1], pts[j + 1][1], fi - j)];
    halo(ctx, p[0], p[1], 60, .85 * al);
  }
  function drawRing(ctx, pts, t, o = {}) {
    const ice = o.ice ?? 1, gold = o.gold ?? 0, u0 = o.u0 ?? 0, sub = pts.slice(Math.floor(u0 * 120));
    if (ice > 0 && sub.length > 1) {
      ctx.save(); ctx.globalAlpha = ice; ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(B.ICE, .25); ctx.lineWidth = 14; ctx.filter = 'blur(8px)'; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.globalAlpha = ice; ctx.strokeStyle = rgba(B.ICE, .95); ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
    }
    if (gold > 0) K.trailSpan(ctx, pts, u0, 1, { w: LW, a: gold, spark: false });
    if (o.grain !== false) grainOn(ctx, pts, t, o.grainA ?? 1);
  }
  function draw(ctx, t) {
    B.sky(ctx, null, t);
    const v = view(t);
    if (hooks.under) hooks.under(ctx, t, v);
    ctx.save(); apply(ctx, v, t); world(ctx, t, v); ctx.restore();
    ctx.save(); screen(ctx, t, v); ctx.restore();
  }
  const applyView = (ctx, t) => apply(ctx, view(t), t);
  return { draw, a, tI0, tI1, iris, drumAt, view, toS, toW, applyView, NECK_S, INF, twist, lem, GG, hooks, addView, viewAt, ringPts, drawRing };
}
