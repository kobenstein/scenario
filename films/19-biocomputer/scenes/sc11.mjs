// c11 · The answer: order and noise · leaner learning · drug tests · three rules · the drawer closes + end screen
// T.G('At the start, the question') → film end. Builder B3. Plan: docs/shots.md 11.01–11.09 · kit: lib/f19_kit.mjs · B3 set:
// lib/f19_b3_world.mjs (same places as c01). ONE entry, ONE 3D camera: the dish field IS the open dish seen from straight above
// (FC(cx, cy, r) = a top-down camera that puts the dish at (cx, cy) with radius r), so every field move is a real camera move and the
// final tilt up into the aisle is one continuous key. Explainers are placed in dish units round the dish (they ride the camera).
//
// | ID    | anchor (word)                          | picture (one idea)                                                  | 1–2 moves          |
// |-------|----------------------------------------|---------------------------------------------------------------------|--------------------|
// | 11.01 | the question · Order · noise · back     | the hook's question returns; ORDER (gold sweep) … AND NOISE (static); the net answers outward | question · answer |
// | 11.02 | very little power · practice · leaner   | two gauges stay low (bolt, loop); sparks reach a cool code block, it slims | gauges · block |
// | 11.03 | Epilepsy · Pong game · animal · diseases | an over-firing net calms under a drop; a Pong rally; three mice, two step back | drop · rally / mice |
// | 11.04 | good rules · Three would be             | pull back: three empty cards rise under the dish (ladder: 3 RULES)  | cards rise         |
// | 11.05 | One · say yes                           | card 1: the donor tube + a tick: CONSENT                           | card 1             |
// | 11.06 | Two · signs of experience · Every time  | card 2: a net grows, a check-light sweeps it again and again: CHECK, EVERY TIME | card 2 |
// | 11.07 | Three · in public · anyone can check    | card 3: a window opens, light pours out: IN PUBLIC; the cards sink | card 3             |
// | 11.08★| seventy years · inside the machine · up to us | tilt up into the aisle: you walk to the rack, the drawer slides shut, its seam glows, you look up | drawer · you |
// | 11.09 | (end screen)                             | the aisle at night, slow pull back, the alive rack centred; free areas for the end cards | seams breathe |
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import * as B from '../lib/f19_b3_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo } = E;
const { cam, camAt, view, proj, bill, COOL, bump, NET } = F;
const TAU = Math.PI * 2;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0, n = 0) => T.G(p, n, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.T0 = R.a; a.end = R.b;
  a.q = G('the question was', a.T0); a.ans = G('The answer', a.T0); a.order = G('Order', a.ans); a.noise = G('noise', a.order);
  a.back = G('teaching us back', a.T0);
  a.learn = G('First, about learning', a.T0); a.power = G('little power', a.learn); a.practice = G('little practice', a.learn);
  a.even = G('Even if a dish', a.learn); a.lesson = G('that lesson', a.even); a.leaner = G('leaner', a.even);
  a.good = G('And the good is', a.leaner); a.epi = G('Epilepsy', a.good); a.tested = G('tested on human', a.epi); a.pong = G('Pong game', a.epi);
  a.animal = G('animal experiments', a.pong); a.dis = G('brain diseases', a.pong);
  a.harder = G('The harder lesson', a.dis); a.rules = G('write good rules', a.harder); a.three = G('Three would be', a.harder);
  a.r1 = G('One.', a.three); a.donors = G('Donors know', a.r1); a.yes = G('say yes', a.r1);
  a.r2 = G('Two.', a.yes); a.grow = G('grow bigger', a.r2); a.signs = G('signs of experience', a.r2); a.every = G('Every time', a.r2); a.over = G('ongoing oversight', a.r2);
  a.r3 = G('Three.', a.over); a.pub = G('Results in public', a.r3); a.anyone = G('anyone can check', a.r3);
  a.seventy = G('For seventy years', a.anyone); a.imitate = G('imitate brain cells', a.seventy); a.now = G('Now living ones', a.seventy);
  a.inside = G('inside the machine', a.now); a.what = G('What they learn', a.now); a.upto = G('up to us', a.what); a.vo = GE('up to us', a.what);
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT19 }];
};

// ===================================================================================================== cameras
const FC = (cx, cy, r) => cam({ tx: B.DISH.X, ty: B.DISH.Y, tz: B.DISH.Z, d: 1500 * B.DISH.R / r, p: -Math.PI / 2, f: 1500, ox: cx - W / 2, oy: cy - H / 2 });
const F0 = FC(960, 540, 470), F1 = FC(960, 600, 380), F2 = FC(600, 560, 300), F3 = FC(960, 560, 400), F4 = FC(960, 240, 150), F4b = FC(960, 262, 166);
const C_W1 = cam({ tx: -200, ty: 1230, tz: -400, d: 3300, p: -.12 });       // the aisle: you left, the open drawer right of centre
const C_W2 = cam({ tx: -190, ty: 1160, tz: -150, d: 3150, p: -.05 });       // a slow lean in while the drawer shuts
const C_END = cam({ tx: -40, ty: 2000, tz: 0, d: 7800, p: -.1 });          // end screen: the alive rack in the centre, you small before it,
                                                                              // your head below the subscribe centre (y > 600), the long rack row under the card areas
const C_END2 = cam({ tx: -40, ty: 2080, tz: 0, d: 8400, p: -.1 });         // …still pulling back, very slowly
const NEIGH_END = [...F.NEIGH, -2880, -3600, -4320, -5040, 2880, 3600, 4320, 5040];   // the long row for the wide end shot
const YOU_IN = { X: -2700, Z: -700 };                                         // you walk in from the left (you left the aisle during C3)
const YOU_SIDE = { X: -450, Z: -330 }, YOU_END = YOU_SIDE;                  // you walk up to the rack, beside the open drawer
const CARD = { w: 420, h: 450, y: 450, xs: [480, 960, 1440] };

function scene(a, T) {
  const T0 = a.T0, END = a.end;
  const tTilt0 = a.anyone + .9, tTilt1 = a.seventy + 1.9;
  const K = [
    [T0, F0], [a.q + 1.2, F1],
    [a.learn - .2, F1], [a.learn + 1.9, F2],
    [a.good - .2, F2], [a.good + 2.0, F3],
    [a.harder - .1, F3], [a.harder + 2.4, F4], [tTilt0, F4b],
  ];
  const KA = [[tTilt1, C_W1], [a.inside - .8, C_W2], [a.vo + .3, C_W2], [a.vo + 8, C_END], [END, C_END2]];
  const camNow = (t) => {
    if (t < tTilt0) return camAt(t, K);
    if (t < tTilt1) return B.camSplit(F4b, C_W1, span(t, tTilt0, tTilt1), [.2, 1], [0, .8]);
    return camAt(t, KA);
  };
  const dAmt = (t) => B.driftAmt(t, [T0], .35, 1.2) * (1 - .8 * smooth(span(t, a.vo + 6, a.vo + 9)));
  const DROP = [-.12, .18], tLand = a.tested + .2;
  const slide = (t) => 1 - quartIO(span(t, a.inside - .35, a.inside + 2.3));

  return (ctx, t) => {
    const c = F.camDrift(camNow(t), t, dAmt(t)), v = view(c);
    const dark = 1 - smooth(span(t, tTilt0 + .6, tTilt1 - .5));
    let m;
    if (t < tTilt0) {                                            // the dish field (camera straight down)
      B.night(ctx);
      m = F.planeMap(v, B.DISH.X, B.DISH.Y, B.DISH.Z, B.DISH.R);
      const bg = smooth(span(t, T0 + .3, T0 + 2.5));                 // a soft cool-blue light round the dish (lifts the night a little)
      if (bg > 0 && m.c) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, m.c[0], m.c[1], m.r * 2.6, [[0, rgba(P.blue0, .2 * bg)], [.45, rgba(P.blue0, .08 * bg)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(0, 0, W, H); ctx.restore(); }
      F.dish(ctx, t, m, { ...B.DISH_FIELD, ePulse: ePulse(t), net: netO(t, m) });
      field(ctx, t, m);
    } else {
      const k = smooth(span(t, tTilt0, tTilt1 - .3)), endS = smooth(span(t, a.vo, a.vo + 4));
      const dishO = { glow: lerp(B.DISH_FIELD.glow, B.DISH_AISLE.glow, k), chip: lerp(.5, 1, k), electrodes: lerp(.25, .6, k), rim: lerp(.7, 1, k) };
      F.hall(ctx, v, t, { pool: (1 - dark) * slide(t) + .45 * (1 - slide(t)), neigh: [] });
      neighbours(ctx, t, v, 1 - endS);
      const sl = slide(t), seamGlow = .6 * smooth(span(t, a.inside + 1.6, a.inside + 3.2)) + .2 * Math.sin(t * .6) * endS;
      const out = F.rack(ctx, v, t, { open: F.OPEN, slide: sl, glow: sl > 0 ? (1 - dark) : seamGlow, net: B.NET_STD, dishO, seam: 1 });
      F.monitor(ctx, v, t, B.MON.X, B.MON.Y, B.MON.Z, B.MON.w);
      you(ctx, t, v);
      if (dark > 0) {
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = dark; B.night(ctx); ctx.restore();
        const mm = out.dish && out.dish.map; if (mm) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.dish(ctx, t, mm, { ...dishO, net: B.NET_STD }); ctx.restore(); }
        if (mm) cards(ctx, t, mm);                                 // the cards sink while the camera tilts up
      }
    }
    F.ladder(ctx, t, T);
  };

  // the neighbour racks (as F.hall draws them) with their cool LEDs fading to rest for the end screen (nothing blinks in the free areas)
  function neighbours(ctx, t, v, leds) {
    for (const x of NEIGH_END) {
      F.rack(ctx, v, t, { x, alive: 0, leds, seed: Math.round(x) });
      const k = Math.abs(x) < 1000 ? .38 : Math.abs(x) < 1800 ? .62 : .8;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.quad(ctx, v, [[x - F.RACK.hw - 2, 0, -8], [x + F.RACK.hw + 2, 0, -8], [x + F.RACK.hw + 2, F.RACK.h + 2, -8], [x - F.RACK.hw - 2, F.RACK.h + 2, -8]], rgba(P.night0, k)); ctx.restore();
    }
  }

  // ---- the net through the field: alive; the wave back at you; over-firing (epilepsy) calmed by the drop
  function netO(t, m) {
    const backW = t - (a.back + .1);
    const over = smooth(span(t, a.epi - .3, a.epi + .4)) * (1 - smooth(span(t, tLand + .1, tLand + 1.3)));
    const fire = (i) => {
      let f = 0;
      if (backW > 0 && backW < 2) { const d = Math.hypot(...NET.somas[i]); const k = (backW - d * .9) / .12; f = Math.max(f, Math.exp(-k * k)); }
      if (over > 0) f = Math.max(f, over * (.5 + .5 * Math.sin(t * 23 + i * 1.7)) * (.6 + .4 * Math.sin(t * 7.3 + i)));
      if (t > tLand - .1) { const d = Math.hypot(NET.somas[i][0] - DROP[0], NET.somas[i][1] - DROP[1]); const k = (t - tLand - d * .7) / .11; if (k > -3 && k < 3) f = Math.max(f, Math.exp(-k * k)); }
      return f;
    };
    return { ...B.NET_STD, fire, nSparks: over > .3 ? 11 : 7 };
  }
  // electrodes: ORDER = a tidy column sweep, NOISE = random static (both under the net)
  function ePulse(t) {
    const ord = bump(t, a.order - .15, 1.9), noi = bump(t, a.noise - .1, 1.9);
    if (ord <= 0 && noi <= 0) return null;
    const col = Math.floor((t - a.order) * 9) % 8, fr = Math.floor(t * 15);
    return (i, j) => Math.max(ord * (i === col ? 1 : 0), noi * (((i * 73 + j * 151 + fr * 97) % 11) < 3 ? .9 : 0));
  }

  // ---------------------------------------------------------------------------------------------------------------- field overlays
  function field(ctx, t, m) {
    const [cx, cy] = m.c, r = m.r;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // 11.01 the hook's question returns; the answer in two halves; the net answers outward (a gold wave past the rim)
    F.questionLine(ctx, t, a.q, a.back - .4, { y: 128, size: 58 });
    const ou = F.rise(span(t, a.order - .15, a.order + .55)) * (1 - expoIn(span(t, a.learn - .3, a.learn + .2)));
    if (ou > 0) F.maskLine(ctx, [['Order …', 1]], cx - r * 1.12 - F.measure('Order …', 84), cy + 28, 84, ou, {});
    const nu = F.rise(span(t, a.noise - .15, a.noise + .55)) * (1 - expoIn(span(t, a.learn - .2, a.learn + .3)));
    if (nu > 0) F.maskLine(ctx, [['and noise.', 0]], cx + r * 1.12, cy + 28, 84, nu, { col: COOL.mid, glow: false });
    const bw = span(t, a.back + .1, a.back + 2.2);
    if (bw > 0 && bw < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const d of [0, .12]) { const q = clamp((bw - d) / (1 - d)); if (q <= 0) continue; ctx.strokeStyle = rgba(P.halo0, .5 * (1 - q)); ctx.lineWidth = 3 - d * 8; ctx.beginPath(); ctx.arc(cx, cy, r * (.2 + 2.2 * expoOut(q)), 0, TAU); ctx.stroke(); } ctx.restore(); }
    // 11.02 gauges (power: a bolt · practice: a loop), the code block that slims
    gauges(ctx, t, cx, cy, r);
    codeBlock(ctx, t, cx, cy, r);
    // 11.03 the drop, the Pong rally, the mice
    drop(ctx, t, m);
    pong(ctx, t, m);
    mice(ctx, t, cx, cy, r);
    cards(ctx, t, m);
    ctx.restore();
  }
  function gauges(ctx, t, cx, cy, r) {
    const base = cy + r * .95;
    [[a.power, 'bolt', 0], [a.practice, 'loop', 1]].forEach(([tw, kind, i]) => {
      const up = expoOut(span(t, tw - .45, tw + .45)), dn = expoIn(span(t, a.even + .1 + i * .15, a.even + .8 + i * .15));
      if (up <= 0 || dn >= 1) return;
      const x = cx + r * 1.75 + i * 230, hh = 300 * up * (1 - dn), lv = .1 * smooth(span(t, tw + .2, tw + .9)) * (1 - dn);
      ctx.save(); ctx.beginPath(); ctx.rect(x - 80, base - 400, 160, 401); ctx.clip();
      ctx.strokeStyle = rgba(COOL.mid, .6); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(x - 32, base - hh, 64, hh, 14); ctx.stroke();
      if (lv > 0) { const fh = 300 * lv; ctx.fillStyle = E.lin(ctx, 0, base - fh, 0, base, [[0, P.core0], [1, P.halo0]]); ctx.beginPath(); ctx.roundRect(x - 26, base - fh - 4, 52, fh, 10); ctx.fill(); halo(ctx, x, base - fh, 60, .35, P.halo0, P.core1); }
      ctx.restore();
      // the icon under the gauge, rising from the baseline
      const iu = expoOut(span(t, tw - .2, tw + .6)) * (1 - dn);
      if (iu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - 60, base + 6, 120, 80); ctx.clip(); ctx.translate(x, base + 48 + (1 - iu) * 70); icon(ctx, kind); ctx.restore(); }
    });
  }
  function icon(ctx, kind) {
    ctx.fillStyle = P.cream; ctx.strokeStyle = P.cream; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (kind === 'bolt') { ctx.beginPath(); ctx.moveTo(6, -26); ctx.lineTo(-14, 4); ctx.lineTo(0, 4); ctx.lineTo(-6, 26); ctx.lineTo(16, -6); ctx.lineTo(2, -6); ctx.closePath(); ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(0, 0, 20, -.4, Math.PI * 1.6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(19, -16); ctx.lineTo(20, -6); ctx.lineTo(10, -6); ctx.stroke(); }
  }
  function codeBlock(ctx, t, cx, cy, r) {
    const up = expoOut(span(t, a.lesson - .7, a.lesson + .2)), dn = expoIn(span(t, a.good - .1, a.good + .55));
    if (up <= 0 || dn >= 1) return;
    const base = cy + r * .95, x0 = cx + r * 1.55, slim = sineIO(span(t, a.leaner - .25, a.leaner + 1.1));
    // the lesson: gold sparks run from the dish rim to the block
    const su = span(t, a.lesson - .1, a.leaner - .05);
    if (su > 0 && su < 1) { const p0 = [cx + r * 1.03, cy - r * .1], p1 = [x0 - 12, base - 170]; F.trailSpan(ctx, [p0, [lerp(p0[0], p1[0], .5), p0[1] - 90], p1], Math.max(0, su * 1.4 - .4), Math.min(1, su * 1.4), { w: 2.5, spark: true }); }
    ctx.save(); ctx.beginPath(); ctx.rect(x0 - 20, base - 420, 700, 421); ctx.clip();
    const n = 6, lh = 44, wFull = 420, w = lerp(wFull, wFull * .5, slim), off = (1 - up + dn) * (n * lh + 40);
    for (let i = 0; i < n; i++) {
      const y = base - (i + 1) * lh + off, ww = w * (.62 + .38 * ((i * 37) % 5) / 4);
      ctx.fillStyle = rgba(COOL.deep, .75); ctx.beginPath(); ctx.roundRect(x0, y + 6, ww, lh - 12, 8); ctx.fill();
      ctx.strokeStyle = rgba(COOL.mid, .7); ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = rgba(COOL.core, .55); ctx.fillRect(x0 + 16, y + lh / 2 - 2, Math.max(0, ww * .5 - 20), 4);
    }
    if (slim > 0) halo(ctx, x0 + w * .5, base - n * lh * .5 + off, 260, .18 * bump(t, a.leaner - .2, 1.6), COOL.edge, COOL.core);
    ctx.restore();
  }
  function drop(ctx, t, m) {
    const fall = span(t, a.tested - .45, tLand); if (fall <= 0) return;
    const [x, yL] = m(DROP[0], DROP[1]);
    if (fall < 1) {
      const y = lerp(-60, yL, expoIn(fall)), rr = 14;
      halo(ctx, x, y, rr * 6, .6, P.halo1, P.core0);
      ctx.fillStyle = mixHex(P.core0, COOL.core, .3); ctx.beginPath(); ctx.ellipse(x, y, rr * (1 - .2 * fall), rr * (1 + .5 * fall), 0, 0, TAU); ctx.fill();
      return;
    }
    const q = span(t, tLand, tLand + 1.2); if (q >= 1) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const d of [0, .16]) { const qq = clamp((q - d) / (1 - d)); if (qq <= 0) continue; ctx.strokeStyle = rgba(P.halo0, .55 * (1 - qq)); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, yL, (.05 + .6 * expoOut(qq)) * m.r, 0, TAU); ctx.stroke(); }
    ctx.restore();
  }
  // Pong on the dish (cool court), the rally gets longer: a gold tick per return along the top wall
  function pong(ctx, t, m) {
    const on = span(t, a.pong - .9, a.pong - .1), off = span(t, a.animal - .6, a.animal - .05);
    if (on <= 0 || off >= 1) return;
    const k = 1 - off, P2 = (u, w) => m(u, w);
    ctx.save(); ctx.globalAlpha = 1;
    for (const w of [.62, -.62]) { const p0 = P2(-.78, w), p1 = P2(.78, w); F.trailSpan(ctx, [p0, p1], off, expoOut(on), { w: 2.5, spark: on < .98 }); }
    const per = 1.1, tt = Math.max(0, t - (a.pong - .2)), ph = (tt / per) % 1, hits = Math.floor(tt / per);
    const bu = lerp(-.68, .7, 1 - Math.abs(1 - 2 * ph)), bw = .45 * Math.sin(tt * 2.1);
    const paddleW = lerp(.45 * Math.sin((tt - .2) * 2.1), bw, .85);
    const [px, py] = P2(-.74, paddleW), s = m.r / 100;
    ctx.globalAlpha = smooth(on) * k;
    ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.roundRect(px - 5 * s, py - 16 * s, 10 * s, 32 * s, 5 * s); ctx.fill(); halo(ctx, px, py, 40 * s, .3, COOL.edge, COOL.core);
    if (on >= 1) { const [bx, by] = P2(bu, bw); halo(ctx, bx, by, 30 * s, .5, COOL.edge, COOL.core); ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.arc(bx, by, 5 * s, 0, TAU); ctx.fill(); }
    for (let i = 0; i < Math.min(hits, 6); i++) { const [tx, ty] = P2(-.6 + i * .1, .74); const g = expoOut(clamp((tt - (i + 1) * per) * 3)); halo(ctx, tx, ty, 18 * s, .4 * g, P.halo0, P.core0); ctx.fillStyle = rgba(P.core1, g); ctx.fillRect(tx - 2 * s, ty - 6 * s * g, 4 * s, 12 * s * g); }
    ctx.restore();
  }
  // three mice rise from a floor line beside the dish on "animal", two step back on "experiments", the last on "brain diseases"
  function mice(ctx, t, cx, cy, r) {
    const base = cy + r * .78, x0 = cx + r * 1.2, line = expoOut(span(t, a.animal - .8, a.animal + .1)) * (1 - sineIO(span(t, a.dis + .9, a.dis + 1.8)));
    if (line > 0) F.trailSpan(ctx, [[x0, base], [x0 + 470, base]], 0, line, { w: 2, spark: line < .98, a: .8 });
    [[0, a.animal + .55], [1, a.animal + .75], [2, a.dis + .5]].forEach(([i, tOut]) => {
      const up = expoOut(span(t, a.animal - .5 + i * .14, a.animal + .35 + i * .14)), dn = expoIn(span(t, tOut, tOut + .7));
      if (up <= 0 || dn >= 1) return;
      const x = x0 + 90 + i * 150, h = 170, off = (1 - up + dn) * h * .7;
      ctx.save(); ctx.beginPath(); ctx.rect(x - 200, base - 300, 400, 301); ctx.clip();
      F.creature(ctx, 'mouse', x + dn * 30, base + off + 1.5 * Math.sin(t * 1.3 + i), h, { fill: 0, lit: .9 });
      ctx.restore();
    });
  }
  // ---- the three rule cards (screen space, under the small dish): rise empty, fill one by one, sink before the tilt
  function cards(ctx, t, m) {
    const tFill = [a.r1, a.r2, a.r3];
    for (let i = 0; i < 3; i++) {
      const up = expoOut(span(t, a.rules - .25 + i * .25, a.rules + .75 + i * .25)), dn = expoIn(span(t, tTilt0 - .3 + i * .15, tTilt0 + .45 + i * .15));
      if (up <= 0 || dn >= 1) continue;
      const x = CARD.xs[i], y = CARD.y + (1 - up) * 700 + dn * 720 + 3 * Math.sin(t * .8 + i * 2), w = CARD.w, h = CARD.h;
      const lit = smooth(span(t, tFill[i] - .2, tFill[i] + .5)), act = lit * (1 - .45 * smooth(span(t, (tFill[i + 1] ?? tTilt0) - .3, (tFill[i + 1] ?? tTilt0) + .4)));
      ctx.save(); ctx.translate(x, y);
      if (lit > 0) halo(ctx, 0, h * .45, w * .9, .16 * act, P.halo1, P.core1);
      const card = new Path2D(); card.roundRect(-w / 2, 0, w, h, 18);
      ctx.fillStyle = E.lin(ctx, 0, 0, 0, h, [[0, mixHex(P.ind1, P.blue1, .3)], [1, mixHex(P.night1, P.ind1, .5)]]); ctx.fill(card);
      ctx.strokeStyle = rgba(mixHex(P.blue1, P.halo1, lit), .45 + .45 * act); ctx.lineWidth = 2.5; ctx.stroke(card);
      ctx.save(); ctx.clip(card);
      if (i === 0) rule1(ctx, t, w, h); else if (i === 1) rule2(ctx, t, w, h); else rule3(ctx, t, w, h);
      ctx.restore();
      ctx.restore();
    }
  }
  function title(ctx, s, h, u, size = 32) { if (u > 0) F.maskLine(ctx, [[s, 0]], 0, h - 40, size, u, { serif: false, align: 'center', col: P.cream, glow: false, weight: 600 }); };
  function rule1(ctx, t, w, h) {
    const vu = expoOut(span(t, a.donors - .4, a.donors + .5)); if (vu <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, 0, w, h - 90); ctx.clip();
    F.vial(ctx, t, -40, h - 110 + (1 - vu) * 250, 200, { fill: .62, label: 'DONOR' });
    ctx.restore();
    const tk = span(t, a.yes - .15, a.yes + .45);
    if (tk > 0) { F.trailSpan(ctx, [[40, 170], [78, 210], [140, 120]], 0, sineIO(tk), { w: 7, spark: tk < 1 }); halo(ctx, 90, 170, 90, .3 * smooth(tk), P.halo0, P.core1); }
    title(ctx, 'CONSENT', h, F.rise(span(t, a.yes - .1, a.yes + .6)));
  }
  function rule2(ctx, t, w, h) {
    const gu = span(t, a.r2 - .1, a.grow + 1.6); if (gu <= 0) return;
    const cx = 0, cy = 160, rr = 115, m = F.fieldMap(cx, cy, rr);
    F.dish(ctx, t, m, { glow: .5, chip: .4, electrodes: .2, rim: .6, net: { grow: lerp(.15, 1, sineIO(gu)), lit: 1, ambient: 1, w: .9, nSparks: 5 } });
    // the check-light: a cool-cream sweep that keeps going round (ongoing oversight), its lamp on the rim
    const su = smooth(span(t, a.signs - .3, a.signs + .4));
    if (su > 0) {
      const ang = (t - a.signs) * 2.4 - Math.PI / 2;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 10; k++) { const aa = ang - k * .07; ctx.fillStyle = rgba(COOL.core, .12 * su * (1 - k / 10)); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, rr * 1.02, aa - .07, aa); ctx.closePath(); ctx.fill(); }
      ctx.restore();
      const lx = cx + Math.cos(ang) * rr * 1.07, ly = cy + Math.sin(ang) * rr * 1.07;
      halo(ctx, lx, ly, 40, .6 * su, COOL.edge, COOL.core); ctx.fillStyle = rgba(COOL.core, su); ctx.beginPath(); ctx.arc(lx, ly, 6, 0, TAU); ctx.fill();
    }
    title(ctx, 'CHECK, EVERY TIME', h, F.rise(span(t, a.every - .1, a.every + .6)), 31);
  }
  function rule3(ctx, t, w, h) {
    const wu = span(t, a.pub - .3, a.pub + .9); if (wu <= 0 && t < a.r3) return;
    const fx = 0, fy = 165, fw = 170, fh = 190, op = sineIO(wu);
    // the window frame rises with the card's light, its two shutters swing open (they foreshorten), light pours out
    const lu = smooth(span(t, a.r3 - .2, a.r3 + .5));
    ctx.fillStyle = rgba(P.night0, .9); ctx.fillRect(fx - fw / 2, fy - fh / 2, fw, fh);
    if (op > 0) {
      ctx.fillStyle = E.rad(ctx, fx, fy, fw * .9, [[0, rgba(P.core0, .9 * op)], [.5, rgba(P.halo0, .5 * op)], [1, rgba(P.halo1, .05 * op)]]); ctx.fillRect(fx - fw / 2, fy - fh / 2, fw, fh);
      halo(ctx, fx, fy, fw * 1.6, .35 * op, P.halo0, P.core0);
      const ru = bump(t, a.anyone - .2, 2.2) + .4 * op;          // rays reach out on "anyone can check"
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo0, .35 * Math.min(1, ru)); ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (let k = 0; k < 8; k++) { const aa = k / 8 * TAU + .2, r0 = fw * .72, r1 = r0 + 40 * Math.min(1, ru) * (1 + .1 * Math.sin(t * 2 + k)); ctx.beginPath(); ctx.moveTo(fx + Math.cos(aa) * r0, fy + Math.sin(aa) * r0); ctx.lineTo(fx + Math.cos(aa) * r1, fy + Math.sin(aa) * r1); ctx.stroke(); }
      ctx.restore();
    }
    for (const sd of [-1, 1]) {                                   // shutters hinged at the outer edges
      const sw = fw / 2 * (1 - op * .82), x0 = fx + sd * fw / 2;
      ctx.fillStyle = mixHex(P.ind1, P.blue1, .4 + .3 * lu); ctx.fillRect(sd < 0 ? x0 : x0 - sw, fy - fh / 2, sw, fh);
      ctx.strokeStyle = rgba(P.halo1, .6 * lu); ctx.lineWidth = 2; ctx.strokeRect(sd < 0 ? x0 : x0 - sw, fy - fh / 2, sw, fh);
    }
    ctx.strokeStyle = rgba(P.halo1, .7 * lu); ctx.lineWidth = 4; ctx.strokeRect(fx - fw / 2, fy - fh / 2, fw, fh);
    title(ctx, 'IN PUBLIC', h, F.rise(span(t, a.pub + .5, a.pub + 1.2)));
  }

  // ---- you: in the aisle (as in c01), you walk up to the rack while the voice says "seventy years", you watch the drawer shut,
  // you look up on "up to us"; in the end screen you stand at the rack's foot, looking up at it (seen from behind)
  function you(ctx, t, v) {
    const w = span(t, a.seventy + .6, a.now + .5) * .7 + .3 * sineIO(span(t, a.seventy + .6, a.now + .5)), w2 = sineIO(span(t, a.inside + 2.3, a.upto - .3));
    const X = lerp(lerp(YOU_IN.X, YOU_SIDE.X, w), YOU_END.X, w2), Z = lerp(lerp(YOU_IN.Z, YOU_SIDE.Z, w), YOU_END.Z, w2);
    const walking = (w > 0 && w < 1) || (w2 > 0 && w2 < 1);
    const look = lerp(-.1, .25, smooth(span(t, a.now, a.inside + 1))) + .75 * sineIO(span(t, a.upto - .4, a.upto + 1.4));
    B.youAisle(ctx, t, v, { x: X, z: Z, look, walk: walking ? (t - a.seventy - .6) * 3.8 + (Math.PI - (a.now - a.seventy - .1) * 3.8) % (2 * Math.PI) : undefined, on: .5 + .3 * smooth(span(t, a.upto - .3, a.upto + 1)) });
  }
}
