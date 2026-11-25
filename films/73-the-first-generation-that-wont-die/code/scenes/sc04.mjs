// c04 · B1 · 'Then the copy is' → 'And still' · THE COPY: THE FLY IN THE SCREEN
// One continuous take: out of latePlate the computer beyond your end tick lights (COPY), the camera dives into its screen (the brain map of
// H.14 again), Eon wires the map into a virtual body, three paths fork (★ WALK · GROOM · FEED), the headline and the critics slide over the
// screen as paper strips, the fly opens like a drawing (no memories, walking = separate software), the camera backs out and the screen grows
// into the C3 plate; the plate shrinks back into the screen → screenPlate (c05). No cut inside.
//
// | ID   | anchor (phrase)               | zeigt wörtlich                                                                   | layer | carrier out      |
// |------|-------------------------------|----------------------------------------------------------------------------------|-------|------------------|
// | 2.01 | Then the copy is              | the computer beyond your end tick lights: COPY; you turn to it                   | MIX   | the screen       |
// | 2.02 | Back to that fly              | dive into the screen: the fly's brain map of H.14 draws itself again (cool)       | EXPL  | the map          |
// | 2.03 | This March, a San Francisco   | cool wires run from the map into a wireframe fly body: EON SYSTEMS · SAN FRANCISCO · 7 MARCH 2026 + source | EXPL | the wires |
// | 2.04 | And the model began to choose | pulses run through the map; three paths fork from it                             | EXPL  | the paths        |
// | 2.05★| Walk                          | the virtual fly walks: WALK                                                      | MIX   | the fly          |
// | 2.06 | Groom                         | it rubs its front legs over its head: GROOM                                      | MIX   | the fly          |
// | 2.07 | Feed                          | it reaches down to a drop: FEED                                                  | MIX   | the screen       |
// | 2.08 | The startup's headline        | a paper strip slides over the screen: “WE’VE UPLOADED A FRUIT FLY” + source      | EXPL  | the strip        |
// | 2.09 | Critics said no               | two answer strips slide in from the other side: “NO, A FRUIT FLY HAS NOT BEEN UPLOADED” · “NO, WE HAVEN’T UPLOADED A FLY YET” | EXPL | the 2nd strip |
// | 2.10 | Even a foundation             | the second strip gets its source: CARBONCOPIES FOUNDATION · LESSWRONG            | EXPL  | the fly          |
// | 2.11 | Their point                   | the fly opens like a drawing: an empty memory slot (THE REAL FLY’S MEMORIES: NONE), its legs slide into a separate box (WALKING: SEPARATE SOFTWARE) | EXPL | the screen |
// | 2.12 | The company's own chief       | the fly closes, the camera backs out of the screen; the screen grows into the clip plate | MIX | the plate     |
// | 2.13 | slot C3                       | C3 Andregg (ORIGINAL FOOTAGE); the plate shrinks back into the screen            | CLIP  | the screen       |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f73_kit.mjs';
import * as S from '../lib/f73_world.mjs';
import * as X from '../lib/f73_stage.mjs';
import * as B from '../lib/b1_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, AGE, PAPER, SOURCES: SRC } = F;
const { LY, X0, XEND, XAGE, LATE, SCR, lab } = B;
const PR = F.PRINT73;
const big = (c, txt, x, y, sz, u, o) => { if (u > 0) X.big(c, txt, x, y, sz, u, o); };
const label = (c, txt, x, y, u, o) => { if (u > 0) X.label(c, txt, x, y, u, o); };
const TAU = Math.PI * 2;

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .01);
  const A = {
    copy: R.a, back: G('Back to that fly'), march: G('This March'), plugged: G('plugged that'), vbody: G('into a virtual body'), choose: G('And the model began'),
    walk: G('Walk'), groom: G('Groom'), feed: G('Feed'), headline: G("The startup's headline"), critics: G('Critics said no'), even: G('Even a foundation'),
    point: G('Their point'), memories: G("the real fly's memories"), separate: G('separate software'), ceo: G("The company's own chief"), frank: G('is frank'), end: R.b,
  };
  const C3 = T.clip('C3') || { start: A.frank + 1.5, end: R.b - .6 };
  const tl = R.a, cx = SCR.cx, cy = SCR.cy;
  const VIN = { x: cx, y: cy, s: 7.4 };
  // inside the screen (sheet units round the screen centre)
  const MAP = { x: cx - 78, y: cy - 6, s: 28 }, FLY = { x: cx + 18, y: cy + 6, size: 40 };
  const NODES = [[cx + 84, cy - 34], [cx + 84, cy + 2], [cx + 84, cy + 38]];
  const ACT = [A.walk, A.groom, A.feed];

  // ---------------------------------------------------------------- view
  const VD = [
    [R.a, LATE.view], [A.back - .4, { x: 1930, y: 700, s: 1.42 }], [A.back + .3, { x: cx, y: cy, s: 2.6 }], [A.back + 1.3, VIN],
    [A.choose, { ...VIN, s: 7.5 }], [A.walk - .1, { x: cx + 6, y: cy, s: 7.9 }], [A.feed + .8, { x: cx + 4, y: cy, s: 7.7 }], [A.point, { ...VIN, s: 7.4 }],
    [A.memories, { x: cx, y: cy - 4, s: 6.2 }], [A.separate + 1.0, { x: cx + 4, y: cy - 2, s: 6.0 }], [A.ceo + .9, { x: cx - 60, y: cy + 10, s: 2.2 }],
    [C3.start - .6, { x: cx - 40, y: cy + 4, s: 1.75 }], [C3.start + .6, { x: cx - 38, y: cy + 4, s: 1.72 }], [C3.end - .9, { x: SCR.cx, y: SCR.cy, s: SCR.s }], [R.b, { x: SCR.cx, y: SCR.cy, s: SCR.s }],
  ];
  const view = (t) => { const v = X.viewPath(t, VD); return B.withBreath(t, v, t > C3.end - .9 ? .25 : Math.max(.25, lerp(1, .25, span(v.s, 2, 5.6)) * lerp(1, .3, span(t, A.back - .5, A.back + 1.0)))); };   // calmer breath on the bright screen

  // ---------------------------------------------------------------- states
  const mapU = (t) => span(t, A.back - .1, A.back + 1.6);
  const mapSlide = (t) => sineIO(span(t, A.march - .2, A.march + 1.2));
  const wires = (t) => span(t, A.plugged - .1, A.vbody + .6);
  const flyOn = (t) => span(t, A.vbody - .2, A.vbody + .7);
  const paths = (t) => span(t, A.choose + .2, A.choose + 1.3);
  const actK = (i, t) => span(t, ACT[i] - .12, ACT[i] + .35);
  const inOut = (t) => span(t, A.ceo - .2, A.ceo + .6);                      // the inside picture clears as the camera backs out
  const opened = (t) => sineIO(span(t, A.point + .2, A.memories + .4)) * (1 - sineIO(span(t, A.ceo - .4, A.ceo + .6)));
  const legsOut = (t) => sineIO(span(t, A.separate - .6, A.separate + .5)) * (1 - sineIO(span(t, A.ceo - .4, A.ceo + .6)));
  const stripIn = (t, a) => sineIO(span(t, a - .15, a + .7));
  const stripsOut = (t) => sineIO(span(t, A.point - .3, A.point + .6));
  const plateM = (t) => sineIO(span(t, C3.start - 1.3, C3.start + .2)) * (1 - sineIO(span(t, C3.end - .45, R.b - .04)));

  // the fly in the screen: its spot and what it does
  function flyNow(t) {
    if (t > C3.start) return B.flyWalk(t);
    const w = actK(0, t), g = actK(1, t) * (1 - span(t, A.feed - .2, A.feed + .1)), f = actK(2, t);
    const walkOn = t > A.walk - .15;
    return { x: FLY.x + (walkOn ? 6 * Math.sin((t - A.walk) * .9) : 0), y: FLY.y, rot: Math.PI / 2 + (walkOn ? .12 * Math.sin((t - A.walk) * 1.3) : 0),
      walk: walkOn && t < A.groom - .1 ? (t - A.walk) * 11 : (walkOn ? 1.2 : undefined), groom: g, feed: f, w };
  }
  const pathPts = (i) => { const [ax, ay] = [MAP.x + MAP.s * .9, MAP.y], [bx, by] = NODES[i], c = [lerp(ax, bx, .5), lerp(ay, by, .5) + [-34, 0, 34][i]];
    return Array.from({ length: 21 }, (_, k) => { const q = k / 20; return [(1 - q) ** 2 * ax + 2 * q * (1 - q) * c[0] + q * q * bx, (1 - q) ** 2 * ay + 2 * q * (1 - q) * c[1] + q * q * by]; }); };

  function inside(ctx, t, s) {
    const io = inOut(t); if (io >= 1 && t < C3.start) return;
    if (t > C3.start) return;
    ctx.save(); ctx.globalAlpha *= 1 - io;
    const ms = mapSlide(t), mx = lerp(cx, MAP.x, ms), my = lerp(cy - 4, MAP.y, ms), msz = lerp(46, MAP.s, ms);
    F.flyBrain(ctx, t, mx, my, msz, { u: mapU(t), s, col: 'cool', fire: span(t, A.choose, A.choose + .6) * (1 - span(t, A.headline, A.headline + 1)) });
    // wires: the map's right edge → the thorax of the virtual body
    const wu = wires(t);
    if (wu > 0) for (let i = 0; i < 4; i++) { const a = [mx + msz * .85, my + (i - 1.5) * 5], b = [FLY.x - 6, FLY.y + (i - 1.5) * 3], c = [lerp(a[0], b[0], .5), a[1] + (i - 1.5) * 14];
      const pts = Array.from({ length: 17 }, (_, k) => { const q = k / 16; return [(1 - q) ** 2 * a[0] + 2 * q * (1 - q) * c[0] + q * q * b[0], (1 - q) ** 2 * a[1] + 2 * q * (1 - q) * c[1] + q * q * b[1]]; });
      X.drawPath(ctx, pts, span(wu, i * .12, .6 + i * .12), { col: rgba(COOL.line, .8), w: 1.6 / s, dash: [4 / s, 3 / s], glow: 6 / s, glowCol: COOL.halo }); }
    // the three paths fork from the map (2.04) and each node lights on its word
    const pu = paths(t);
    if (pu > 0) for (let i = 0; i < 3; i++) {
      const pts = pathPts(i), k = span(pu, i * .15, .7 + i * .15), lit = actK(i, t);
      X.drawPath(ctx, pts, k, { col: rgba(mixHex(COOL.line, COOL.core, lit), .55 + .4 * lit), w: (1.6 + 1.2 * lit) / s, glow: (4 + 8 * lit) / s, glowCol: COOL.halo });
      const ph = ((t - A.choose) * .8 + i * .33) % 1; if (k >= 1) { const p = pts[Math.floor(ph * 20)]; halo(ctx, p[0], p[1], 6, .6, COOL.halo, COOL.core); }
      if (k > .95) { halo(ctx, NODES[i][0], NODES[i][1], 10 + 14 * lit, .4 + .6 * lit, COOL.halo, COOL.core); }
    }
    ctx.restore();
  }
  function flyDraw(ctx, t, s) {   // the virtual fly; in 2.11 its body stays and its legs slide into a separate box
    const io = inOut(t), fo = flyOn(t); if (fo <= 0) return;
    const f = flyNow(t), lo = legsOut(t), op = opened(t), a = fo * (t > C3.start ? 1 : 1);
    if (f.feed > 0) F.drop(ctx, f.x + 21, f.y, 3.2, span(t, A.feed - .5, A.feed - .1), s);
    const BOX = { x: cx + 80, y: cy + 16, w: 58, h: 46 };
    const fsz = t > C3.start ? 44 : FLY.size;
    if (lo <= 0) { F.fly(ctx, t, f.x, f.y, fsz, { style: 'virtual', s, rot: f.rot, walk: f.walk, groom: f.groom, feed: f.feed, a }); }
    else {
      // body: clip inside the three body ellipses; legs: clip outside them, slid into the box
      const body = (c) => { c.save(); c.translate(f.x, f.y); c.rotate(f.rot); c.scale(FLY.size, FLY.size); c.beginPath();
        for (const [ex, ey, rx, ry] of [[0, -.3, .13, .11], [0, -.08, .16, .18], [0, .24, .14, .24]]) { c.moveTo(ex + rx, ey); c.ellipse(ex, ey, rx, ry, 0, 0, TAU); } c.restore(); };
      ctx.save(); body(ctx); ctx.clip(); F.fly(ctx, t, f.x, f.y, FLY.size, { style: 'virtual', s, rot: f.rot, wings: 1, a }); ctx.restore(); ctx.beginPath();
      const lx = lerp(f.x, BOX.x + BOX.w / 2, lo), ly = lerp(f.y, BOX.y + BOX.h / 2, lo);
      ctx.save(); ctx.beginPath(); ctx.rect(-1e5, -1e5, 2e5, 2e5); body(ctx); ctx.clip('evenodd');
      ctx.translate(lx - f.x, ly - f.y); F.fly(ctx, t, f.x, f.y, FLY.size, { style: 'virtual', s, rot: f.rot, wings: 0, walk: t * 8, a }); ctx.restore(); ctx.beginPath();
      X.drawPath(ctx, [[BOX.x, BOX.y], [BOX.x + BOX.w, BOX.y], [BOX.x + BOX.w, BOX.y + BOX.h], [BOX.x, BOX.y + BOX.h], [BOX.x, BOX.y]], lo, { col: rgba(COOL.line, .8), w: 1.4 / s, dash: [4 / s, 3 / s] });
    }
    // the empty memory slot (2.11), drawn like a drawing next to the map
    if (op > 0) { const mx0 = MAP.x - 26, my0 = MAP.y + 30;
      X.drawPath(ctx, [[mx0, my0], [mx0 + 52, my0], [mx0 + 52, my0 + 34], [mx0, my0 + 34], [mx0, my0]], op, { col: rgba(CREAM, .85), w: 1.4 / s, dash: [4 / s, 3 / s] }); }
    if (io > 0) return;
  }

  // ---------------------------------------------------------------- the take
  const outside = (c, t, s) => {   // your line, the marks, you (seen when the camera is outside the screen)
    X.lifeline(c, t, X0, XEND, LY, s, { age: XAGE, ageU: 1, end: 1, glow: 1 });
    B.marks(c, t, LATE.marks, LY, 1, s);
    F.du(c, LATE.you, LY - 2, 92, { pose: 'look', dir: 1 });
  };
  function take(ctx, t) {
    const v = view(t);
    if (t < A.back + 1.0) {
      B.latePlate(ctx, t, v, tl, { on: span(t, R.a + .2, R.a + 1.0), light: 1 - span(t, R.a + .4, R.a + 1.6), youDir: t < R.a + .5 ? -1 : 1, pool: [lerp(1500, cx, span(t, R.a, A.back)), lerp(640, cy, span(t, R.a, A.back)), 1],
        screen: (c, s) => { inside(c, t, s); },
        top: (c) => { const [x, y] = X.toScreen(v, LATE.comp, LY); label(c, SRC.copy, x, y + 58, lab(t, R.a + .4, A.back + .2), { size: 30, col: COOL.text }); },
      });
      return;
    }
    B.screenPlate(ctx, t, v, {
      under: (c, s) => outside(c, t, s), on: 1, fly: 0,
      inScreen: (c, s) => inside(c, t, s),
      mid: (c, s) => { if (t < C3.start || t > C3.end - 1) flyDraw(c, t, s); },
      top: (c) => words(c, t, v),
    });
    const m = plateM(t);
    if (m > 0) {   // the screen's inner rect grows into the plate and back
      const sc = { x: LATE.comp - LATE.compW * .45, w: LATE.compW * .9, y: LY - 4 - LATE.compW * .16 - LATE.compW * .64 + LATE.compW * .05, h: LATE.compW * .64 - LATE.compW * .1 };
      const [ax, ay] = X.toScreen(v, sc.x, sc.y), [bx, by] = X.toScreen(v, sc.x + sc.w, sc.y + sc.h);
      const fa = span(m, 0, .42);   // the plate thickens out of / thins into the lit screen, no pop
      B.faded(ctx, fa, (c) => F.clipPlate(c, t, T, 'C3', { from: { x: ax, y: ay, w: bx - ax, h: by - ay }, morph: m }));
    }
  }
  function strip(ctx, t, txt, y, k, dir, src) {   // a paper strip that slides across the screen (screen px)
    if (k <= 0) return; const w = 1240, h = src ? 132 : 112, x = W / 2 - w / 2 + dir * (1 - k) * 1500;
    F.paperCard(ctx, t, x, y, w, h, { u: 1, rot: dir * .004, lines: [[txt, 46, 0, true]], src: src || undefined });
  }
  function words(ctx, t, v) {
    // 2.03: Eon
    label(ctx, SRC.eon, W / 2, 140, lab(t, A.march + .2, A.choose + .2), { size: 30, col: COOL.text, spacing: .1 });
    if (t > A.march && t < A.choose + .2) F.source(ctx, t, A.march + .3, A.choose + .1, SRC.eonSrc);
    // 2.05–2.07: the three words at the ends of the paths
    SRC.acts.forEach((w, i) => { const [x, y] = X.toScreen(v, NODES[i][0], NODES[i][1]), lit = actK(i, t), u = span(t, A.choose + .6 + i * .15, A.choose + 1.3 + i * .15) * (1 - inOut(t)) * (1 - span(t, A.headline - .2, A.headline + .3));
      if (u > 0) { ctx.save(); ctx.globalAlpha *= .45 + .55 * lit; label(ctx, w, x + 40, y + 12, u, { size: 34 + 6 * lit, align: 'left', col: mixHex(COOL.text, COOL.core, lit), spacing: .14 }); ctx.restore(); } });
    // 2.08–2.10: the headline strip and the two answers
    const so = stripsOut(t);
    ctx.save(); ctx.translate(-so * 1900, 0);
    strip(ctx, t, SRC.headline, 190, stripIn(t, A.headline), -1);
    ctx.restore(); ctx.save(); ctx.translate(so * 1900, 0);
    strip(ctx, t, SRC.critics2[0], 360, stripIn(t, A.critics), 1);
    strip(ctx, t, SRC.critics2[1], 510, stripIn(t, A.critics + .35), 1, t > A.even ? SRC.critics2Src : null);
    ctx.restore();
    if (t > A.headline && t < A.critics) F.source(ctx, t, A.headline + .4, A.critics - .1, SRC.headlineSrc);
    if (t > A.even && t < A.point + .4) F.source(ctx, t, A.even + .2, A.point + .3, SRC.critics2Src);
    // 2.11: the two points
    const [mx, my] = X.toScreen(v, MAP.x, MAP.y + 26);
    label(ctx, SRC.point[0], clamp(mx, 300, W - 300), my + 4 * v.s - 14, lab(t, A.memories - .3, A.ceo), { size: 28, spacing: .1 });
    const [bx, by] = X.toScreen(v, cx + 109, cy + 16);
    label(ctx, SRC.point[1], clamp(bx, 300, W - 330), by - 30, lab(t, A.separate - .2, A.ceo + .1), { size: 28, col: COOL.text, spacing: .1 });
  }
  const draw = (ctx, t) => take(ctx, t);
  return [{ t: R.a, draw, print: PR }];
};
