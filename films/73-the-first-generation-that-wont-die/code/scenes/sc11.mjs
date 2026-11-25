// c11 · B3 · "It doesn't have to go" → 'Part of that comes down' (plateFork, B3 inner seam). The good version: the night warms to dawn.
// One continuous take on THE LIFELINE (internal sheet = plateHouses' coordinates). The neighbour's window lights; the houses sink and 64 of
// 100 people stand up out of the line (64% YES, a shorter life without decline); the line: NOT FOREVER, HEALTHY; its grey end measured
// (WORLD 9.6 · USA 12.4); ★ the grey years fill gold, the decline shrinks to a sliver; a gate with $ in front of the gold years; the lines
// sink into an axis: the genome's falling curve, its bar travels down the curve ($95 MILLION → A FEW HUNDRED $), the costs curve rises
// from the same point; the fork stays open → plateFork.
//
// | ID   | anchor (phrase)               | zeigt wörtlich                                                     | layer | carrier out        |
// |------|-------------------------------|--------------------------------------------------------------------|-------|--------------------|
// | 6.01 | It doesn't have to go         | dawn rises; the neighbour's window lights too                      | MIX   | the windows        |
// | 6.02 | Start with what people        | the houses sink; 64 of 100 people stand in the morning light: 64% YES · A SHORTER LIFE WITHOUT DECLINE | MIX | the people |
// | 6.03 | Not forever                   | the people sink into the line; its open end gets a far end tick: NOT FOREVER | EXPL | the line   |
// | 6.04 | Healthy                       | a gold sweep along the line: HEALTHY                               | EXPL  | the line           |
// | 6.05 | Around the world              | the grey end measured, the line clones: WORLD 9.6 · USA 12.4       | EXPL  | the grey ends      |
// | 6.06★| Win those years back          | the grey years fill gold, the decline shrinks to a sliver          | EXPL  | the gold years     |
// | 6.07 | But healthy years only count  | a gate with $ rises in front of the gold years; you reach          | MIX   | the gate           |
// | 6.08 | Some medical technology       | the lines sink into an axis; a falling curve draws itself          | EXPL  | the curve          |
// | 6.09 | Reading a human genome        | a tall bar at its start: $95 MILLION · 2001                        | EXPL  | the bar            |
// | 6.10 | Today, a few hundred          | the bar slides down the curve to a sliver: A FEW HUNDRED $ · TODAY | EXPL  | the bar            |
// | 6.11 | Yet so far, in America        | from the same point a curve rises: US HEALTH COSTS                 | EXPL  | the two curves     |
// | 6.12 | Which pattern wins            | both run on, dashed: the fork stays open                           | EXPL  | plateFork          |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f73_kit.mjs';
import * as S from '../lib/f73_world.mjs';
import * as X from '../lib/f73_stage.mjs';
import * as B from '../lib/b3_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo, prng } = E;
const { GOLD, COOL, CREAM, AGE, SOURCES: SRC } = F;
const PR = F.PRINT73, PH = B.PH, PF = B.PF;
const YR = 45;                                   // sheet units per year of poor health (9.6 / 12.4 from F.SOURCES.poor)
const POOR = SRC.poor.map((s) => Number((s.match(/[\d.]+/) || [10])[0]));
const L0 = 260, L1 = 1560, LW = 560, LU = 760;   // the two lifelines (world above, USA = the ground line)

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .5);
  const A = {
    go: R.a, start: G('Start with what people'), notF: G('Not forever'), healthy: G('Healthy'), world: G('Around the world'), ten: G('close to ten years'),
    win: G('Win those years back'), decline: G('the long decline'), but: G('But healthy years only count'), afford: G('if people can afford them'),
    some: G('Some medical technology'), cheap: G('gets cheap fast'), genome: G('Reading a human genome'), n95: G('ninety-five'), today: G('Today, a few'),
    yet: G('Yet so far'), up: G('pushed health costs up'), which: G('Which pattern wins'), end: R.b,
  };
  const tA = R.a + S.SEAM_HALF, tP = R.b - S.SEAM_HALF;
  const VK = [
    [R.a - S.SEAM_HALF, { x: 960, y: 560, s: 1 }], [tA, { x: 960, y: 560, s: 1.04 }], [A.start + .4, { x: 960, y: 580, s: 1.07 }],
    [A.notF + .3, { x: 960, y: 590, s: 1.03 }], [A.world + 1, { x: 960, y: 590, s: 1.0 }], [A.win + 2.4, { x: 1080, y: 640, s: 1.09 }],
    [A.but + 1, { x: 980, y: 610, s: 1.02 }], [A.some + 1, { x: 940, y: 545, s: .985 }], [tP, { x: 960, y: 540, s: 1 }],
  ];
  const view = (t) => { if (t < tA) return B.viewHouses(t, T); return B.viewOf(t, VK, false); };
  const PK = [[R.a, [960, 640]], [A.start, [960, 620]], [A.world, [1050, 640]], [A.but, [1000, 620]], [A.some + .5, [900, 560]], [tP, [900, 560]]];
  const pool = (t) => { let i = 0; while (i < PK.length - 2 && t > PK[i + 1][0]) i++; const [t0, a] = PK[i], [t1, b] = PK[i + 1], u = sineIO(span(t, t0, t1)); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; };
  const dawn = (t) => .72 * B.ease(t, R.a + .4, R.a + 2.8) + .28 * B.ease(t, A.win, A.decline + .5);

  // the crowd (6.02): 100 places in 4 rows, 64 people stand up out of the line, 36 stay dim dots
  const r = prng(7312), ORDER = Array.from({ length: 100 }, (_, i) => i).sort(() => r() - .5), YES = new Set(ORDER.slice(0, Math.round(Number((SRC.natgeo64.match(/\d+/) || [64])[0]))));
  const SLOT = Array.from({ length: 100 }, (_, i) => { const row = Math.floor(i / 25), c = i % 25, k = 1 - row * .13; return { x: 960 + (c - 12) * 50 * k + (row % 2) * 12, y: LU - row * 30, k, row, d: ((c * 7 + row * 3) % 25) / 25 }; });

  function draw(ctx, t) {
    const v = view(t), pl = pool(t), dw = dawn(t);
    // 6.01 → 6.02: the houses (drawn through drawHouses so the plate continues)
    const hs = B.ease(t, A.start - .3, A.start + 1.0, quartIO);
    B.drawHouses(ctx, t, v, {
      dawn: dw, lx: pl[0], ly: pl[1], line: false, h1: 1 - hs, h2: 1 - hs, lit1: 1, lit2: span(t, R.a + .9, R.a + 1.7), du: t < A.start - .3 ? 1 : 0, duX: PH.du,
      mid: (c, s) => stage(c, t, s, v),
    });
    // ground pool follows the eye (drawHouses drew the ground with its own pool; add a soft one where the eye is now)
    screenText(ctx, t);
  }
  function stage(c, t, s, v) {
    // ---------------- the ground line → the open line (6.03) → two lines (6.05) → into the axis (6.08)
    const sinkAx = B.ease(t, A.some - .3, A.some + 1.2, quartIO);
    const toL = B.ease(t, A.notF - .3, A.notF + .8, quartIO);
    const x0 = lerp(PH.x0, L0, toL), x1 = lerp(PH.x1, L1, toL), open = toL > 0 ? 1 - span(t, A.notF + .2, A.notF + .9) : 0;
    const endT = span(t, A.notF + .4, A.notF + .9);
    const ageU = span(t, A.world + .2, A.world + 1.4), fill = B.ease(t, A.win + .3, A.decline + .2, quartIO);
    const yrs = (i) => POOR[i] * lerp(1, .1, fill);
    const clone = B.ease(t, A.world + 1.2, A.world + 2.6, quartIO);
    const yW = lerp(lerp(LU, LW, clone), PF.base, sinkAx), yU = lerp(LU, PF.base, sinkAx);
    const xs0 = lerp(x0, PF.x0 - 60, sinkAx), xs1 = lerp(x1, PF.x1 + PF.open + 40, sinkAx);
    const la = 1 - span(sinkAx, .5, 1);   // the gold lines hand over to the cream axis
    const sweep = F.bump(t, A.healthy - .05, 1.4);
    if (la > 0) {
      if (clone > 0) X.lifeline(c, t, xs0, xs1, yW, s, { a: la, age: x1 - yrs(0) * YR, ageU, end: endT, spark: false });
      X.lifeline(c, t, xs0, xs1, yU, s, { a: la, age: x1 - yrs(clone > 0 ? 1 : 0) * YR, ageU, end: endT, open, openTo: PH.x1 + 300, spark: false });
      if (sweep > 0) { const sx = lerp(x0, x1, span(t, A.healthy - .05, A.healthy + 1.2)); halo(c, sx, yU, 120 / s, .5 * sweep, GOLD.halo, GOLD.core); }
    }
    if (sinkAx > 0) X.drawPath(c, [[PF.x0 - 60, PF.base], [PF.x1 + PF.open + 40, PF.base]], 1, { col: rgba(CREAM, .3 * sinkAx), w: 1.6 / s });
    // ★ the gold fill: a warm light travels from where old age began to the end
    if (fill > 0 && fill < 1) for (const [i, y] of [[0, yW], [1, yU]]) { const xa = x1 - POOR[i] * YR, hx = lerp(xa, x1 - POOR[i] * YR * .1, fill); halo(c, hx, y, 170 / s, .7 * Math.sin(Math.PI * fill), GOLD.halo, GOLD.core); }
    const bloom = F.bump(t, A.win + .6, A.decline + .6 - A.win); if (bloom > 0) for (const [i, y] of [[0, yW], [1, yU]]) F.goldSpan(c, [[x1 - POOR[i] * YR, y], [x1 - yrs(i) * YR, y]], 0, 1, { w: 9 / s, a: .55 * bloom, spark: false });
    // the measures: brackets + words over the grey ends
    const mu = B.lab(t, A.world + 1.6, A.win + .4);
    if (mu > 0) for (const [i, y] of [[0, yW], [1, yU]]) {
      const xa = x1 - POOR[i] * YR, mi = span(t, A.world + 1.4 + i * .5, A.world + 2.2 + i * .5) * (1 - span(t, A.win, A.win + .5)), by = y - 26;
      if (mi > 0) { X.drawPath(c, [[xa, by], [x1, by]], mi, { col: rgba(AGE.text, .9), w: 1.6 / s }); for (const xx of [xa, x1]) X.drawPath(c, [[xx, by - 8], [xx, by + 8]], mi, { col: rgba(AGE.text, .9), w: 1.6 / s }); }
      X.label(c, SRC.poor[i], (xa + x1) / 2, by - 22, B.lab(t, A.world + 1.6 + i * .5, A.win + .4), { size: 28, col: AGE.text });
    }
    // 6.02 the crowd
    crowd(c, t, s);
    // 6.07 the gate with $ in front of the gold years, you reach for them
    const gu = span(t, A.but + .2, A.but + 1.2) * (1 - span(t, A.some - .4, A.some + .5));
    const GX = x1 - POOR[1] * YR - 50;
    if (gu > 0) B.gate(c, t, GX, LU + 2, 300, 120, s, { u: gu, sym: '$', symU: span(t, A.afford - .1, A.afford + .5), symY: 120, symSize: 56 });
    // you: at the plate between the houses; you walk on to the gate and reach (6.07), then go with the lines
    const wk = span(t, A.notF + .1, A.notF + 1.7), duX = lerp(PH.du, 800, sineIO(wk)), dsink = B.ease(t, A.some - .4, A.some + .6, quartIO);
    if (t > A.start - .3) { c.save(); c.beginPath(); c.rect(-2000, -2000, 6000, LU - 1 + 2000); c.clip(); c.translate(0, dsink * 120);
      F.du(c, duX, LU - 2 / s, 92, wk > 0 && wk < 1 ? { walk: t * 6.2, dir: -1 } : { pose: t > A.afford - .2 ? 'reach' : 'stand', dir: wk >= 1 ? 1 : 1 }); c.restore(); }
    // 6.08 → 6.12: the falling curve, the bar, the rising curve, the fork
    const dn = span(t, A.some + .4, A.cheap + 1.0), up = span(t, A.yet + .6, A.up + .6), op = span(t, A.which + .2, A.which + 1.6);
    if (dn > 0) B.drawFork(c, t, s, { axis: 0, down: dn, up, open: op });
    const bu = span(t, A.genome + .2, A.n95 + .3), bg = B.ease(t, A.today - .1, A.today + 1.3, quartIO), bo = span(t, A.which - .2, A.which + .6);
    if (bu > 0 && bo < 1) {
      const bx = PF.x0 + (PF.x1 - PF.x0) * bg, hh = PF.base - B.downY(bg);
      c.save(); c.beginPath(); c.rect(-2000, -2000, 6000, PF.base + 2000); c.clip(); c.translate(0, expoIn(bo) * (hh + 20));
      X.bar(c, bx, PF.base, 40, hh, bu, { col: 'cream' }); c.restore();
      X.label(c, SRC.genome[0], PF.x0, PF.y0 - 30, B.lab(t, A.n95 - .2, A.today + .2), { size: 34, gold: .2 });
      X.label(c, B.LOCAL.y2001, PF.x0, PF.base + 44, B.lab(t, A.genome + .5, A.which + .1), { size: 26 });
      X.label(c, SRC.genome[1], PF.x1, PF.base - 52, B.lab(t, A.today + 1.0, A.which + .1), { size: 30, gold: .2 });
      X.label(c, B.LOCAL.today, PF.x1, PF.base + 44, B.lab(t, A.today + .9, A.which + .1), { size: 26 });
    }
    X.label(c, B.LOCAL.costs, PF.x1 + 20, PF.up - 30, B.lab(t, A.up - .1, A.which + .3), { size: 30, align: 'left' });
    const aru = span(t, A.up + .3, A.up + .9) * (1 - span(t, A.which, A.which + .6)); if (up > .9 && aru > 0) X.arrow(c, B.curve(B.upY, .9, 1, 6), aru, { col: rgba(CREAM, .9), w: 3.2 / s, glow: 0, head: 18 });
  }
  function crowd(c, t, s) {
    const cu = span(t, A.start + .2, A.start + 1.6), out = B.ease(t, A.notF - .3, A.notF + .7, quartIO); if (cu <= 0 || out >= 1) return;
    c.save(); c.beginPath(); c.rect(-2000, -2000, 6000, LU - 1 + 2000); c.clip();
    for (let row = 3; row >= 0; row--) for (let i = row * 25; i < row * 25 + 25; i++) {
      const p = SLOT[i], k = expoOut(span(cu, p.d * .55 + row * .06, p.d * .55 + row * .06 + .35)); if (k <= 0) continue;
      const sink = out * 120;
      if (YES.has(i)) { const h = 70 * p.k; c.save(); c.translate(0, (1 - k) * (h + 6) + sink); F.person(c, p.x, p.y - 2 / s, h, { pose: 'stand', dir: i % 2 ? 1 : -1, light: 1 }); c.restore(); }
      else { c.fillStyle = rgba(CREAM, .22 * k); c.beginPath(); c.arc(p.x, p.y - 8 * p.k + sink, 6 * p.k, 0, Math.PI * 2); c.fill(); }
    }
    c.restore();
  }
  function screenText(ctx, t) {
    X.big(ctx, SRC.natgeo64, W / 2, 250, 72, B.lab(t, A.start + .9, A.notF + .1), { gold: .9 });
    X.label(ctx, SRC.shorter, W / 2, 318, B.lab(t, A.start + 1.1, A.notF + .1), { size: 28 });
    if (t > A.start && t < A.notF + 1) F.source(ctx, t, A.start + 1.2, A.notF + .2, SRC.natgeo);
    X.big(ctx, B.LOCAL.notForever, W / 2, 300, 70, B.lab(t, A.notF + .05, A.healthy + .05, .6, .35), { gold: .1 });
    X.big(ctx, SRC.healthy, W / 2, 300, 70, B.lab(t, A.healthy + .05, A.world + .3, .6), { gold: 1 });
    X.label(ctx, SRC.poorTitle, W / 2, 250, B.lab(t, A.world + .4, A.win + .6), { size: 32, spacing: .14 });
    if (t > A.world && t < A.win + 1.2) F.source(ctx, t, A.world + .8, A.win + .8, SRC.poorSrc);
    if (t > A.genome && t < A.which + .8) F.source(ctx, t, A.genome + .6, A.yet + .2, SRC.genomeSrc);
    if (t > A.yet && t < A.which + 1.2) F.source(ctx, t, A.yet + .8, A.which + 1.0, SRC.costsUp);
  }
  const marks = [R.a, A.start, A.world, A.but, A.some];
  return [{ t: R.a, draw: (ctx, t) => B.plateHouses(ctx, t, T), print: PR }, ...marks.map((t) => ({ t: Math.max(t, tA), draw, print: PR })), { t: tP, draw: (ctx, t) => B.plateFork(ctx, t, T), print: PR }];
};
