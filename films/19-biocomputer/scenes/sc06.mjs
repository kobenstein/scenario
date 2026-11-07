// c06 · Twenty watts · data centres +50 % · Melbourne, Singapore, up to 1,000 · 30 W per box, untested · can cells compete?
// T.G('It comes down to a number') → T.G('Picture it as a match') · builder B2. Plan: docs/shots.md 6.01–6.05 · world: docs/MOTION.md ·
// kit: lib/f19_kit.mjs · seam in: plateRack (lib/f19_seams.mjs) · shared B2 set: lib/f19_b2_world.mjs.
// ONE entry, ONE world, ONE continuous camera: plateRack → push past the rack to you (the net in your head: 20 W) → pull out to the
// cold servers behind you: their cool light stands as a column and jumps by half (+50 %) → pull back high over the aisle: two pins
// (MELBOURNE, SINGAPORE), the racks down the aisle light up gold (UP TO 1,000) → the drawer slides out, the camera tilts down into its
// dish: the dish field. Life-support tubes run from the dish into a power bar: 30 W; your head rises beside it with 20 W; the cells'
// share is a gold sliver, the pumps take the rest; NOT YET TESTED → the explainer withdraws, the camera tilts back up into the aisle
// (CAN CELLS COMPETE?) and holds on the alive rack with its drawer open (= c07's first frame).
//
// | ID   | anchor (word)                              | picture (one idea)                                          | 1–2 moves            | layer        |
// |------|--------------------------------------------|-------------------------------------------------------------|----------------------|--------------|
// | 6.01 | inside your head · twenty watts · learned  | push past the rack to you; the net in your hood glows       | push · head net      | SCENE        |
// | 6.02 | vastly more · about half                   | the cold servers' light stands as a column, jumps by half   | column · +50 %       | SCENE (expl) |
// | 6.03 | original · Melbourne · Singapore · thousand | pull back high: two pins; the racks light up gold          | pins · racks light   | SCENE        |
// | 6.04 | thirty watts · whole brain · sip · tested  | tilt into the dish: tubes → 30 W bar, head 20 W, sliver     | bars · sliver        | SCENE>EXPL   |
// | 6.05 | compete                                    | tilt back up into the aisle; the alive rack, drawer open    | camera · ladder      | EXPL>SCENE   |
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import { plateRack, RACK_PLATE_CAM, RACK_PLATE, SEAM_HALF } from '../lib/f19_seams.mjs';
import { DISH, YOU, fieldNight, topCam, fieldOf, tiltCam, aisle, you } from '../lib/f19_b2_world.mjs';
import { AISLE_CAM, AISLE_HOLD, aisleHold, holdCam } from '../lib/f19_b2_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, halo } = E;
const { cam, camAt, camDrift, view, proj, bill, quad, COOL, bump, NET } = F;

export const PRINT = F.PRINT19;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after);
  const a = {};
  a.T0 = R.a; a.head = G('inside your head', a.T0); a.watts = G('twenty watts', a.T0); a.learned = G('ever learned', a.T0);
  a.dc = G('The data centers behind', a.T0); a.vastly = G('vastly more', a.dc); a.lastYear = G('Last year, their', a.dc); a.jumped = G('jumped by', a.dc); a.half = G('about half', a.dc);
  a.betting = G('So some companies are betting', a.dc); a.original = G('original', a.betting);
  a.melb = G('Melbourne', a.betting); a.sing = G('Singapore', a.melb); a.plan = G('The plan in Singapore', a.melb); a.thousand = G('a thousand', a.plan); a.drug = G('drug research', a.plan);
  a.save = G('But does it actually save', a.plan); a.each = G('Each box, with', a.save); a.life = G('life support', a.each); a.thirty = G('thirty watts', a.each);
  a.more = G("That's more than your whole", a.each); a.brain = G('whole brain', a.each); a.sip = G('The cells themselves sip', a.each); a.nothing = G('almost nothing', a.sip);
  a.life2 = G("it's the life support", a.sip); a.nobody = G('And nobody has tested', a.sip); a.tested = G('tested yet', a.nobody); a.lessPow = G('less power', a.nobody);
  a.compete = G('So can a dish of cells', a.nobody); a.end = R.b;
  return [{ t: R.a, draw: scene(a, T), print: PRINT }];
};

// ===================================================================================================== cameras (world units ≈ mm)
const C_YOU0 = cam({ tx: 2120, ty: 1380, tz: -1500, d: 1900, p: -.03, ox: 260 });          // you, close: your head right of centre
const C_YOU1 = cam({ tx: 2150, ty: 1400, tz: -1500, d: 1760, p: -.03, ox: 270 });          // breathing push
const C_DC0 = cam({ tx: 1650, ty: 2330, tz: -600, d: 4600, p: -.02 });                   // the cold servers' column, you small below it
const C_DC1 = cam({ tx: 1640, ty: 2350, tz: -600, d: 4450, p: -.02 });
const C_WIDE0 = cam({ tx: 500, ty: 1000, tz: 2200, d: 9800, p: -.24, oy: 60 });           // high over the aisle and its rows
const C_WIDE1 = cam({ tx: 460, ty: 1000, tz: 2100, d: 9100, p: -.245, oy: 60 });
const FIELD6 = [610, 560, 300];                                                           // the dish on the field (centre, r)
const TOP6 = topCam(...FIELD6);
// the explainer geometry (screen): the power bars stand on a baseline right of the dish
const BASE = 862, BAR = { A: 1290, B: 1590, w: 92, perW: 15 };                            // 15 px per watt: 30 W → 450 px
const NOTE = { x: 1440, y: 268 };
const MEL = { X: -2880, Z: 5200 };                                                        // the far rack MELBOURNE lands on

function scene(a, T) {
  const T0 = a.T0, tStart = T0 + SEAM_HALF;
  const tD0 = a.save - .15, tD1 = a.each + .75;               // the tilt down into the dish (wide → top)
  const tU0 = a.compete + .05, tU1 = a.compete + 3.45;        // the tilt back up into the aisle (top → aisle)
  const K = [
    [tStart, RACK_PLATE_CAM],
    [a.head + 1.85, C_YOU0], [a.learned + .4, C_YOU1],
    [a.vastly + .25, C_DC0], [a.betting + .2, C_DC1],
    [a.original + 2.3, C_WIDE0], [tD0, C_WIDE1],
  ];
  // the camera: keys → tilt down → field → tilt up → the aisle hold (shared with c07)
  function camera(t) {
    if (t < tD0) { const c = camAt(t, K), hold = 1 - smooth(span(t, tStart, tStart + 1.2)); return { c: camDrift(c, t, .35 * (1 - hold)), mode: 'world' }; }
    if (t < tD1) { const u = span(t, tD0, tD1); return { c: camDrift(tiltCam(u, C_WIDE1, TOP6), t, .35 * (1 - smooth(span(u, .3, .9)))), mode: 'world', desc: u }; }
    if (t < tU0) { const dr = .6 * smooth(span(t, tD1, tD1 + 1.5)) * (1 - smooth(span(t, tU0 - 1.2, tU0))); return { c: camDrift(TOP6, t, dr), mode: 'field' }; }
    if (t < tU1) { const u = span(t, tU0, tU1); return { c: camDrift(tiltCam(1 - u, AISLE_CAM, TOP6), t, AISLE_HOLD.drift * smooth(span(u, .1, .7))), mode: 'world', desc: 1 - u }; }
    return { c: camDrift(holdCam(t, T), t, AISLE_HOLD.drift), mode: 'world' };
  }
  const slideAt = (t) => sineIO(span(t, a.save - .05, a.save + 2.3));       // the drawer slides out (heavy, slow) as the camera comes

  return (ctx, t) => {
    if (t < tStart) { plateRack(ctx, t); F.ladder(ctx, t, T, { hide: 1 }); return; }
    const C = camera(t);
    if (t >= tU1) aisleHold(ctx, t, view(C.c), {});
    else if (C.mode === 'world') world(ctx, t, C);
    else field(ctx, t, C.c);
    // the ladder: rung 4's question ended under the plate; it comes back only with its answer (20 WATTS), so nothing pops at T0 + .5
    F.ladder(ctx, t, T, { hide: t < a.watts - .45 ? 1 : 0 });
  };

  // ---------------------------------------------------------------------------------------------------------------------- 3D: the aisle
  function world(ctx, t, C) {
    const v = view(C.c);
    const desc = C.desc ?? 0, up = t >= tU0;                    // desc: 0 aisle … 1 straight above the dish
    const slide = up ? 1 : slideAt(t);
    const dishO = { glow: lerp(.9, .55, desc), chip: lerp(1, .5, desc), electrodes: lerp(.6, .25, desc), rim: lerp(1, .7, desc) };
    const netO = { lit: 1, ambient: 1, w: 1.25 };
    const rows = smooth(span(t, tStart, tStart + 2.2));
    const glow = up ? lerp(AISLE_HOLD.glow, 0, desc) : lerp(RACK_PLATE.glow, .9, smooth(span(t, a.save, a.save + 2))) * (1 - desc);
    const pool = up ? AISLE_HOLD.pool : lerp(.25, .9, smooth(span(t, a.save, a.save + 2)));
    const out = aisle(ctx, v, t, { pool: pool * (1 - desc), rows, litAt: litAt(t), slide, glow, net: netO, dishO: { ...dishO, a: desc > 0 ? 0 : 1 }, seam: 1 });
    column(ctx, t, v);
    pins(ctx, t, v);
    you(ctx, t, v, youPose(t));
    // the swing: the aisle sinks into night round the dish, the dish stays (drawn on top) — exactly the field's dish at desc 1
    if (desc > 0) {
      const dark = smooth(span(desc, .02, .38));
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (dark > 0) { ctx.globalAlpha = dark; fieldNight(ctx); ctx.globalAlpha = 1; }
      const m = out.dish && out.dish.map; if (m) F.dish(ctx, t, m, { ...dishO, net: netO });
      ctx.restore();
    }
  }
  // you: a hand comes up toward your head on "inside your head"; the net glows on "twenty watts", fills on "everything you've learned";
  // you look up at the column ("vastly more"), then at the rack
  function youPose(t) {
    const hand = sineIO(span(t, a.head - .3, a.head + .9)) * (1 - sineIO(span(t, a.watts + 1.6, a.watts + 2.8)));
    const look = lerp(.15, .55, sineIO(span(t, a.vastly - .6, a.vastly + .8))) * (1 - .6 * sineIO(span(t, a.betting, a.betting + 1.6)));
    const net = .45 + .55 * smooth(span(t, a.head - .2, a.head + .8)) + .5 * bump(t, a.watts - .1, 1.6) - .45 * smooth(span(t, a.dc - .2, a.dc + 1.4));
    const fireW = (i) => { const k = (t - a.watts - .05 - Math.hypot(NET.somas[i][0], NET.somas[i][1]) * .6) / .1; return k > -3 && k < 3 ? Math.exp(-k * k) : 0; };
    return { look, net, fire: t > a.watts - .3 && t < a.watts + 1.4 ? fireW : null, armR: hand > 0 ? [lerp(.16, 1.75, hand), lerp(.1, 3.55, hand)] : undefined };
  }
  // ---- 6.02: the cold servers' cool light stands as a column on their tops; it jumps by about half; +50 %
  function column(ctx, t, v) {
    const g0 = expoOut(span(t, a.vastly - .3, a.vastly + .9)), jump = expoOut(span(t, a.half - .25, a.half + .5));
    const sink = expoIn(span(t, a.betting + .1, a.betting + 1.0));
    const hgt = (860 * g0 + 430 * jump) * (1 - sink);
    if (hgt <= 2) return;
    const x0 = 1440 - F.RACK.hw + 30, x1 = 1440 + F.RACK.hw - 30, y0 = F.RACK.h + 4, Z = 40;
    const q = quad(ctx, v, [[x0, y0, Z], [x1, y0, Z], [x1, y0 + hgt, Z], [x0, y0 + hgt, Z]]);
    if (!q) return;
    ctx.save();
    const top = q[3][1], bot = q[0][1];
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, top, 0, bot, [[0, rgba(COOL.core, .95)], [.06, rgba(COOL.mid, .75)], [.5, rgba(COOL.edge, .42)], [1, rgba(COOL.deep, .3)]]); ctx.fill();
    const cx = (q[0][0] + q[1][0]) / 2, cw = q[1][0] - q[0][0];
    ctx.fillStyle = lin(ctx, q[0][0], 0, q[1][0], 0, [[0, rgba(COOL.edge, 0)], [.5, rgba(COOL.core, .22)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(q[0][0], top, cw, bot - top);
    halo(ctx, cx, top, cw * 1.4, .45, COOL.edge, COOL.core);
    halo(ctx, cx, (top + bot) / 2, (bot - top) * .8, .12, COOL.edge, COOL.mid);
    ctx.restore();
    // the old level (before the jump) stays as a thin tick, the new top glows; +50 % rises beside it
    const old = proj(v, x1 + 30, y0 + 860 * g0 * (1 - sink), Z), oldL = proj(v, x0 - 30, y0 + 860 * g0 * (1 - sink), Z);
    if (jump > 0 && old && oldL) { ctx.strokeStyle = rgba(COOL.core, .7 * (1 - sink)); ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(oldL[0], oldL[1]); ctx.lineTo(old[0] + 40, old[1]); ctx.stroke(); ctx.setLineDash([]); }
    const lab = proj(v, x0 - 60, y0 + hgt, Z);
    if (lab) {
      const u1 = F.rise(span(t, a.half - .1, a.half + .7)) * (1 - expoIn(span(t, a.betting - .1, a.betting + .5)));
      const u0 = F.rise(span(t, a.vastly, a.vastly + .8)) * (1 - expoIn(span(t, a.betting - .1, a.betting + .5)));
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      const x = lab[0] - 20 - F.measure('+50 %', 96);
      if (u1 > 0) F.maskLine(ctx, [['+50 %', 0]], x, lab[1] + 74, 96, u1, { col: COOL.core, glow: false });
      if (u0 > 0) F.maskLine(ctx, [['A.I. DATA CENTRES', 0]], lab[0] - 20 - F.measure('A.I. DATA CENTRES', 26, false, 600), lab[1] + 122, 26, u0, { serif: false, weight: 600, col: COOL.mid, glow: false });
      ctx.restore();
    }
  }
  // ---- 6.03: the racks light up ("up to a thousand"): the first one far back on the left with MELBOURNE, then from the alive rack
  // outward, by distance (the plan); they dim back on "But does it actually save power?"
  function litAt(t) {
    const back = 1 - smooth(span(t, a.save - .1, a.save + 1.3));
    return (X, Z) => {
      if (X === MEL.X && Z === MEL.Z) return smooth(span(t, a.melb + .35, a.melb + .9)) * back;
      const d = Math.hypot(X, Z * .8) / 9000;
      return .85 * smooth(span(t, a.thousand - .2 + d * 1.9, a.thousand + .5 + d * 1.9)) * back;
    };
  }
  // pins drop from above the frame onto their racks; their labels rise; UP TO 1,000 under SINGAPORE
  function pins(ctx, t, v) {
    const away = expoIn(span(t, a.save - .1, a.save + .6));
    if (t < a.melb - 1 || away >= 1) return;
    [[MEL.X, MEL.Z, a.melb, 'MELBOURNE', -1], [0, 0, a.sing, 'SINGAPORE', 1]].forEach(([X, Z, tk, name, side]) => {
      const fu = span(t, tk - .62, tk + .12), fall = fu * fu, settle = t > tk + .12 ? Math.exp(-(t - tk - .12) * 5) * Math.sin((t - tk - .12) * 14) * .6 : 0;
      if (fu <= 0) return;
      const Y = F.RACK.h + (1 - fall) * 3800 + 2;
      const p = bill(ctx, v, X, Y, Z, (s) => {
        const k = 1 - away, sq = 1 - .18 * settle;
        ctx.scale(1.7 * k / sq * (1 + .12 * settle), 1.7 * k * sq);
        const pin = new Path2D(); pin.moveTo(0, 0); pin.bezierCurveTo(-60, -110, -120, -170, -120, -250); pin.arc(0, -250, 120, Math.PI, 0); pin.bezierCurveTo(120, -170, 60, -110, 0, 0); pin.closePath();
        E.glowFill(ctx, pin, 30, .5, P.halo0);
        ctx.fillStyle = E.rad(ctx, -30, -280, 200, [[0, P.core0], [.55, P.core1], [1, P.halo0]]); ctx.fill(pin);
        ctx.fillStyle = mixHex(P.shade0, P.night1, .3); ctx.beginPath(); ctx.arc(0, -250, 46, 0, 6.2832); ctx.fill();
      });
      if (!p) return;
      const head = proj(v, X, Y + 500, Z); if (!head) return;
      const lu = F.rise(span(t, tk + .05, tk + .75)) * (1 - expoIn(span(t, a.save - .2, a.save + .4)));
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      const x = side > 0 ? head[0] + 50 : head[0] - 50 - F.measure(name, 34, false, 600);
      F.maskLine(ctx, [[name, 0]], x, head[1] + 10, 34, lu, { serif: false, weight: 600, col: P.cream, glow: false });
      if (side > 0) {
        const tu = F.rise(span(t, a.thousand - .1, a.thousand + .7)) * (1 - expoIn(span(t, a.save - .2, a.save + .4)));
        F.maskLine(ctx, [['up to ', 0], ['1,000', 1]], head[0] + 50, head[1] + 88, 64, tu, {});
      }
      ctx.restore();
    });
  }

  // ---------------------------------------------------------------------------------------------------------------------- 2D: the dish field
  function field(ctx, t, c) {
    const FM = fieldOf(c);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    fieldNight(ctx);
    const sipF = bump(t, a.sip, a.nothing + .9 - a.sip);
    F.dish(ctx, t, FM, { glow: .55, chip: .5, electrodes: .25, rim: .7, net: { lit: 1, ambient: 1, w: 1.25, fire: sipF > 0 ? (i) => .5 * sipF * (.6 + .4 * Math.sin(i * 1.7 + t * 3)) : null } });
    power(ctx, t, FM);
    ctx.restore();
  }
  // tubes from the dish into bar A (the box: 30 W, a gold sliver of cells, the rest life support); your head rises with bar B (20 W)
  function power(ctx, t, FM) {
    const out = sineIO(span(t, a.compete - 1.05, a.compete - .05));          // everything withdraws before the tilt up (calm, staggered)
    const tubeU = smooth(span(t, a.life - .25, a.life + 1.05)) * (1 - sineIO(span(t, a.compete - .85, a.compete + .05)));
    const tubes = [0, 1].map((k) => {
      const s = FM(Math.cos(-.16 + k * .32) * 1.0, Math.sin(-.16 + k * .32) * 1.0), e = [BAR.A - 18 + k * 36, BASE + 6];
      const c1 = [s[0] + 180, s[1] - 10 + k * 20], c2 = [e[0] - 40 + k * 10, e[1] - 220];
      const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24, m = 1 - u; pts.push([m * m * m * s[0] + 3 * m * m * u * c1[0] + 3 * m * u * u * c2[0] + u * u * u * e[0], m * m * m * s[1] + 3 * m * m * u * c1[1] + 3 * m * u * u * c2[1] + u * u * u * e[1]]); }
      return pts;
    });
    if (tubeU > 0) {
      const costs = smooth(span(t, a.life2 - .2, a.life2 + .5));
      for (const pts of tubes) {
        F.trailSpan(ctx, pts, 0, tubeU, { w: 6, spark: tubeU < 1, a: 1 });
        ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.lineCap = 'round'; ctx.strokeStyle = rgba(COOL.edge, .85); ctx.lineWidth = 7;
        ctx.beginPath(); const n = Math.max(1, Math.round(tubeU * 24)); pts.slice(0, n + 1).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
      }
      // pump pulses travel to the bar (faster and brighter when "it's the life support that costs")
      if (tubeU >= 1) for (let k = 0; k < 4; k++) {
        const u = ((t * (.42 + .25 * costs) + k / 4) % 1), pts = tubes[k % 2], p = F.along(pts, u);
        halo(ctx, p[0], p[1], 22 + 10 * costs, .55 + .35 * costs, COOL.edge, COOL.core);
      }
    }
    // bar A: rises on "thirty watts"
    const gA = expoOut(span(t, a.thirty - .15, a.thirty + .85)) * (1 - out);
    const hA = 30 * BAR.perW * gA, sliver = 18 * gA;
    if (hA > 1) {
      const x = BAR.A - BAR.w / 2, costs = smooth(span(t, a.life2 - .2, a.life2 + .5)), sip = bump(t, a.sip - .1, a.nothing + 1 - a.sip);
      ctx.save();
      ctx.fillStyle = lin(ctx, 0, BASE - hA, 0, BASE, [[0, mixHex(COOL.core, COOL.mid, .3)], [.5, COOL.mid], [1, COOL.edge]]);
      ctx.globalAlpha = .82 + .18 * costs; ctx.beginPath(); ctx.roundRect(x, BASE - hA, BAR.w, hA - sliver, [8, 8, 0, 0]); ctx.fill(); ctx.globalAlpha = 1;
      halo(ctx, BAR.A, BASE - hA * .55, hA * .75, .14 + .18 * costs, COOL.edge, COOL.mid);
      ctx.fillStyle = E.rad(ctx, BAR.A, BASE - sliver / 2, BAR.w, [[0, P.core0], [.6, P.core1], [1, P.halo0]]); ctx.fillRect(x, BASE - sliver, BAR.w, sliver);
      halo(ctx, BAR.A, BASE - sliver / 2, 60 + 70 * sip, .35 + .5 * sip, P.halo0, P.core0);
      ctx.restore();
      const lu = F.rise(span(t, a.thirty, a.thirty + .8)) * (1 - out);
      F.maskLine(ctx, [['30 W', 0]], BAR.A, BASE - hA - 28, 76, lu, { align: 'center', col: COOL.core, glow: false });
      // the sliver's word, small, on "sip almost nothing"; the pumps' word on "life support that costs"
      const su = F.rise(span(t, a.sip, a.sip + .7)) * (1 - out), cu = F.rise(span(t, a.life2, a.life2 + .7)) * (1 - out);
      if (su > 0) F.maskLine(ctx, [['CELLS', 0]], BAR.A - BAR.w / 2 - 18 - F.measure('CELLS', 25, false, 600), BASE - 2, 25, su, { serif: false, weight: 600, col: P.halo0, glow: false });
      if (cu > 0) F.maskLine(ctx, [['LIFE SUPPORT', 0]], BAR.A + BAR.w / 2 + 18, BASE - hA * .62, 25, cu, { serif: false, weight: 600, col: COOL.mid, glow: false });
    }
    // your head rises from below the frame (its net gold), then its bar: 20 W, a dashed level across to bar A ("more than")
    const hu = expoOut(span(t, a.more - .2, a.more + .8)), hd = sineIO(span(t, a.compete - .8, a.compete + .1));
    if (hu > 0 && hd < 1) {
      const hh = 170, hx = BAR.B, hy = BASE + 190 + (1 - hu) * 300 + hd * 300 + 4 * Math.sin(t * .9);
      halo(ctx, hx, hy - hh * .62, hh * .7, .28 * hu, P.halo1, P.core1);
      F.creature(ctx, 'head', hx, hy, hh, { fill: 0 });
      ctx.save(); ctx.beginPath(); ctx.arc(hx + .01 * hh, hy - .66 * hh, .27 * hh, 0, 6.2832); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
      F.net(ctx, t + 3.1, F.fieldMap(hx + .01 * hh, hy - .66 * hh, .27 * hh * 2.1), { lit: hu, ambient: 1, w: .9 }); ctx.restore();
    }
    const gB = expoOut(span(t, a.brain - .2, a.brain + .8)) * (1 - out), hB = 20 * BAR.perW * gB;
    if (hB > 1) {
      const x = BAR.B - BAR.w / 2;
      ctx.save(); ctx.fillStyle = E.rad(ctx, BAR.B, BASE - hB * .3, hB, [[0, P.core0], [.45, P.core1], [1, P.halo0]]);
      ctx.beginPath(); ctx.roundRect(x, BASE - hB, BAR.w, hB, [8, 8, 0, 0]); ctx.fill(); ctx.restore();
      halo(ctx, BAR.B, BASE - hB * .5, hB * .8, .22, P.halo0, P.core1);
      F.maskLine(ctx, [['20 W', 0]], BAR.B, BASE - hB - 28, 76, F.rise(span(t, a.brain, a.brain + .8)) * (1 - out), { align: 'center' });
      const lv = smooth(span(t, a.brain + .5, a.brain + 1.3)) * (1 - out);
      if (lv > 0) { ctx.strokeStyle = rgba(P.halo1, .55); ctx.lineWidth = 2; ctx.setLineDash([7, 9]); ctx.beginPath(); ctx.moveTo(x - 8, BASE - hB); ctx.lineTo(x - 8 - (BAR.B - BAR.A - BAR.w) * lv, BASE - hB); ctx.stroke(); ctx.setLineDash([]); }
    }
    // the baseline (drawn with the first bar), NOT YET TESTED over the bars
    const bl = smooth(span(t, a.thirty - .3, a.thirty + .5)) * (1 - out);
    if (bl > 0) { ctx.strokeStyle = rgba(P.halo2, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(BAR.A - 110, BASE + 1); ctx.lineTo(BAR.A - 110 + (BAR.B - BAR.A + 220) * bl, BASE + 1); ctx.stroke(); }
    const nu = F.rise(span(t, a.tested - .2, a.tested + .6)) * (1 - sineIO(span(t, a.compete - 1.5, a.compete - .7)));
    if (nu > 0) {
      F.maskLine(ctx, [['NOT YET TESTED', 0]], NOTE.x, NOTE.y, 38, nu, { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
      F.rule(ctx, NOTE.x - 150, NOTE.y + 22, NOTE.x + 150, NOTE.y + 22, smooth(span(t, a.tested + .2, a.tested + 1)) * (1 - sineIO(span(t, a.compete - 1.5, a.compete - .7))), { w: 2 });
    }
  }
}
