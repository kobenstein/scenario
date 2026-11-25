// c03 · B1 · 'Is that bet paying off' → 'Then the copy is' · THE LAB, THE GENE, THE MICE, A GUESS
// One continuous take: out of betPlate the lab grows out of the line (bench, lamp, a researcher, the AI ring drops into a screen);
// the camera dives into the screen (the cell, the gene row), comes back out to the bench (the mice, the bars, the caveat tags),
// the bench becomes a pharmacy shelf, the shelf sinks into the lifeline (A GUESS · REAL), you and the repair light → latePlate (c04).
// ★ = 1.21: the scan runs along the gene row and ONE gene lights gold: SRSF1.
//
// | ID   | anchor (phrase)              | zeigt wörtlich                                                                    | layer | carrier out      |
// |------|------------------------------|-----------------------------------------------------------------------------------|-------|------------------|
// | 1.18 | Is that bet paying off       | a lab at night grows out of the line: one lamp, a researcher at a bench, the AI ring drops into the screen | SCENE | the screen |
// | 1.19 | There are early signs        | small gold signals blink on the screen, one by one                                | MIX   | a signal         |
// | 1.20 | models are learning          | dive into the screen: a living cell; a cool dashed outline shows its reaction first, then the drop lands and the cell takes that shape: PREDICTED BEFORE THE EXPERIMENT + source | EXPL | the nucleus |
// | 1.21★| And in a study published     | the nucleus unrolls into a row of genes; a cool scan runs, one lights gold: ONE GENE: SRSF1 + source | EXPL | the gold gene |
// | 1.22 | They boosted it              | out to the bench: two old mice; the gold gene flies into one (a gold spot)        | MIX   | the mice         |
// | 1.23 | The mice lived               | two bars grow from the mice: 778 DAYS · 886 DAYS, +14%                            | EXPL  | the bars         |
// | 1.24 | A small study                | the bars fall into 9 vs 10 dots + source; tag A SMALL STUDY                       | EXPL  | the tag          |
// | 1.25 | Female mice only             | 2nd tag FEMALE MICE ONLY (same stack)                                              | EXPL  | the tag          |
// | 1.26 | Not yet repeated             | 3rd tag NOT YET REPEATED (same stack)                                              | EXPL  | the stack        |
// | 1.27 | And no drug against aging    | the bench becomes a pharmacy shelf; one empty slot: APPROVED AGAINST AGING ITSELF: NONE | MIX | the shelf line |
// | 1.28 | So the date is a guess       | the shelf sinks into the lifeline; the 2032 tag wobbles, dashed: A GUESS          | EXPL  | the line         |
// | 1.29 | The work is real             | the cell, the gene, the mouse drop onto the line as gold marks: REAL              | EXPL  | the gold marks   |
// | 1.30 | But what if the repairs      | you rise on your line near its end; the repair light creeps from the marks, too slow; your end tick lands first, you look back → latePlate | MIX | the computer |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f73_kit.mjs';
import * as S from '../lib/f73_world.mjs';
import * as X from '../lib/f73_stage.mjs';
import * as B from '../lib/b1_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, AGE, SOURCES: SRC } = F;
const { LY, X0, XEND, X32, XNOW, BET, LATE, lab } = B;
const PR = F.PRINT73;
const big = (c, txt, x, y, sz, u, o) => { if (u > 0) X.big(c, txt, x, y, sz, u, o); };
const label = (c, txt, x, y, u, o) => { if (u > 0) X.label(c, txt, x, y, u, o); };
const quad = (a, c, b, u) => [(1 - u) ** 2 * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1]];

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .01);
  const A = {
    bet: R.a, early: G('There are early signs'), models: G('models are learning'), predict: G('to predict'), drug: G('to a drug'), before: G('before anyone'),
    study: G('And in a study published'), ml: G('machine learning'), single: G('a single gene'), boosted: G('They boosted it'), lived: G('The mice lived'),
    small: G('A small study'), female: G('Female mice only'), notyet: G('Not yet repeated'), nodrug: G('And no drug against aging'), guess: G('So the date is a guess'),
    real: G('The work is real'), what: G('But what if the repairs'), late: G('come too late'), end: R.b,
  };
  const tl = R.b;
  // the lab (sheet units): bench on the line, the computer on the bench, the lamp, the researcher
  const BX = [1230, 1790], BTOP = LY - 64, CX = 1620, CW = 260;
  const CY = BTOP - 4 - CW * .16 - CW * .64 / 2;            // the screen's centre (F.computer geometry)
  const MICE = [1385, 1515], MS = 74, GENE = { x0: CX - 108, w: 216, n: 24, pick: 15, y: CY + 2 };
  const geneX = GENE.x0 + (GENE.pick + .5) * GENE.w / GENE.n;
  const VIN = { x: CX, y: CY, s: 7.4 };

  // ---------------------------------------------------------------- view
  const VD = [
    [R.a, BET.view], [A.early - .2, { x: 1540, y: 690, s: 1.22 }], [A.models - .3, { x: 1600, y: 676, s: 1.5 }], [A.models + 1.6, VIN],
    [A.study + 1.2, { ...VIN, s: 7.6 }], [A.single - .2, { x: geneX - 20, y: CY, s: 8.4 }], [A.boosted + .1, { x: geneX - 30, y: CY, s: 8.6 }],
    [A.boosted + 1.9, { x: 1470, y: 702, s: 1.55 }], [A.small, { x: 1500, y: 690, s: 1.5 }], [A.nodrug + .3, { x: 1500, y: 700, s: 1.42 }],
    [A.guess + .2, { x: 1400, y: 712, s: 1.1 }], [A.real + .2, { x: 1250, y: 716, s: 1.0 }], [A.what + .3, { x: 1380, y: 700, s: .98 }], [tl, LATE.view],
  ];
  const view = (t) => B.withBreath(t, X.viewPath(t, VD), 1 - span(X.viewPath(t, VD).s, 2.2, 6.5) * .85);
  const PK = [[R.a, [1300, 600, .9]], [A.early, [1600, 640, 1]], [A.boosted + 2, [1450, 700, 1]], [A.guess, [1250, 720, 1]], [tl, [1500, 640, 1]]];
  const pool = (t) => { let i = 0; while (i < PK.length - 2 && t > PK[i + 1][0]) i++; const [a0, a] = PK[i], [a1, b] = PK[i + 1], u = sineIO(span(t, a0, a1)); return a.map((x, j) => lerp(x, b[j], u)); };

  // ---------------------------------------------------------------- states
  const labU = (t) => span(t, R.a + .2, R.a + 1.6);                                         // the lab grows out of the line
  const benchOut = (t) => span(t, A.guess - .1, A.guess + 1.2);                              // the shelf / bench sinks into the line
  const compOut = (t) => span(t, A.nodrug - .4, A.nodrug + .7);                              // screen + lamp + researcher sink at the shelf
  const ring = (t) => {   // the AI ring drops from the bet into the screen and becomes its picture
    const d = quartIO(span(t, R.a + .3, R.a + 1.9)), [x0, y0, r0] = BET.ring;
    return { x: lerp(x0, CX, d), y: lerp(y0, CY, d), r: lerp(r0, 30, d), u: 1 - span(t, A.models + .5, A.models + 1.3) };
  };
  const SIG = [[-60, -30], [52, -40], [-30, 34], [72, 24], [8, -48]];
  const cellU = (t) => span(t, A.models + .6, A.models + 1.7);
  const cellOut = (t) => span(t, A.study + .1, A.study + 1.2);
  const scan = (t) => (t < A.single ? .66 * span(t, A.ml - .2, A.single) : .66 + .34 * span(t, A.single, A.single + .9));
  const rowU = (t) => span(t, A.study + .5, A.study + 1.6);
  const rowOut = (t) => span(t, A.boosted + .2, A.boosted + 1.2);
  const miceU = (t) => span(t, A.boosted + .5, A.boosted + 1.4) * (1 - span(t, A.nodrug - .2, A.nodrug + .6));
  const flyG = (t) => span(t, A.boosted + .5, A.boosted + 1.5);                              // the gold gene flies into the treated mouse
  const barU = (t) => span(t, A.lived, A.lived + 1.1) * (1 - span(t, A.small - .2, A.small + .4));
  const dotU = (t) => span(t, A.small + .1, A.small + .9) * (1 - span(t, A.nodrug - .3, A.nodrug + .4));
  const tagU = (i, t) => span(t, [A.small, A.female, A.notyet][i] + .05, [A.small, A.female, A.notyet][i] + .6) * (1 - span(t, A.nodrug - .2, A.nodrug + .3));
  const shelfU = (t) => span(t, A.nodrug + .1, A.nodrug + 1.3) * (1 - span(t, A.guess - .2, A.guess + .7));
  const endLift = (t) => span(t, A.models + 1.6, A.models + 2.0) * (1 - expoIn(span(t, A.late - .35, A.late + .25)));   // hidden while inside the screen; lands on "too late"
  const lightX = (t) => B.lightX(t, tl) - (B.lightX(A.what + .4, tl) - LATE.marks[2]) * (1 - sineIO(span(t, A.what + .4, tl)));

  // ---------------------------------------------------------------- the lab objects (sheet units), drawn under the plate's ring
  function lab3(ctx, t, s) {
    const lu = labU(t), co = compOut(t), bo = benchOut(t);
    B.sink(ctx, LY, bo, 80, () => {
      const top = B.bench(ctx, BX[0], BX[1], LY, lu, s);
      // the shelf on the bench (1.27)
      const su = shelfU(t); let slot = null;
      if (su > 0) slot = B.shelf(ctx, t, BX[0] + 40, BX[1] - 40, BTOP, su, 5, s);
      if (slot) { const g = .5 + .5 * Math.sin(t * 2.2); halo(ctx, slot[0], slot[1], 70, .18 * su * g, CREAM, CREAM); }
    });
    if (co < 1) B.sink(ctx, BTOP, co, 260, () => {
      F.computer(ctx, t, CX, BTOP - 4, CW, { s, u: span(t, R.a + .5, R.a + 1.7), on: span(t, R.a + 1.2, R.a + 2.0) });
    });
    // the lamp and the researcher sink when the camera comes back out to the mice
    const la = span(t, A.boosted - .4, A.boosted + .5);
    if (la < 1) B.sink(ctx, BTOP, la, 200, () => B.lamp(ctx, t, BX[0] + 50, BTOP, span(t, R.a + .9, R.a + 2.0), s));
    // the researcher (stands at the bench, looks at the screen); sinks when the camera comes back out to the mice
    const ru = span(t, R.a + .6, R.a + 1.8) * (1 - span(t, A.boosted - .4, A.boosted + .4));
    if (ru > 0) B.sink(ctx, LY, 1 - ru, 160, () => F.person(ctx, 1430, LY - 2, 150, { pose: 'look', dir: 1, look: .3 }));
  }
  function inScreen(ctx, t, s) {   // 1.19–1.21: signals, the cell, the gene row (in the screen; the camera dives in)
    const r = ring(t);
    SIG.forEach(([dx, dy], i) => { const k = span(t, A.early + .1 + i * .22, A.early + .4 + i * .22) * (i === 3 ? 1 - cellU(t) : 1 - span(t, A.models + .3, A.models + .9));
      if (k > 0) { const bl = .7 + .3 * Math.sin(t * 7 + i * 2); halo(ctx, CX + dx, CY + dy, 14, .9 * k * bl, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.core, k); ctx.beginPath(); ctx.arc(CX + dx, CY + dy, 2.4 * k, 0, Math.PI * 2); ctx.fill(); } });
    // the cell grows out of signal 3 (1.20)
    const cu = cellU(t), co = cellOut(t);
    if (cu > 0 && co < 1) {
      const [sx, sy] = [CX + SIG[3][0], CY + SIG[3][1]], g = sineIO(cu), x = lerp(sx, CX, g), y = lerp(sy, CY, g);
      const dg = span(t, A.drug - .1, A.drug + 1.0), re = span(t, A.drug + 1.0, A.drug + 1.8);
      F.cell(ctx, t, x, y, 24, { u: cu * (1 - co), s, predict: span(t, A.predict - .1, A.predict + 1.3) * (1 - re), drug: dg * (1 - re), react: re });
    }
    // the nucleus unrolls into the gene row (★ 1.21)
    const ru = rowU(t), ro = rowOut(t);
    if (co > 0 && ru < 1) { const k = sineIO(span(co, .2, 1)), nx = lerp(CX - 3.6, CX, k), w = lerp(13.4, GENE.w, k), h = lerp(13.4, 3, k);
      ctx.fillStyle = rgba(GOLD.body, .55 * (1 - ru)); ctx.beginPath(); ctx.ellipse(nx, lerp(CY - 1.2, GENE.y, k), w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill(); }
    if (ru > 0 && ro < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - ro;
      F.geneRow(ctx, t, GENE.x0, GENE.y, GENE.w, GENE.n, { u: ru, s, scan: scan(t), pick: GENE.pick });
      const pk = span(t, A.single - .05, A.single + .5); if (pk > 0) halo(ctx, geneX, GENE.y, 40, .5 * F.bump(t, A.single - .05, 2.2) + .2 * pk, GOLD.halo, GOLD.core);
      ctx.restore();
    }
  }
  function bench3(ctx, t, s) {   // 1.22–1.26 on the bench: mice, the gold gene, bars, dots
    const mu = miceU(t), [m0, m1] = MICE;
    // the gold gene flies from the row (in the screen) into the treated mouse
    const fg = flyG(t); if (fg > 0 && fg < 1) { const p = quad([geneX, GENE.y], [1560, BTOP - 220], [m1, BTOP - 18], sineIO(fg)); halo(ctx, p[0], p[1], 34 / Math.sqrt(s), .9, GOLD.halo, GOLD.core); }
    if (mu > 0) B.sink(ctx, BTOP, 1 - mu, 60, () => {
      F.mouse(ctx, t, m0, BTOP, MS, { s, old: 1 });
      F.mouse(ctx, t, m1, BTOP, MS, { s, old: 1, glow: span(t, A.boosted + 1.4, A.boosted + 1.8) });
    });
    const bu = barU(t), hS = 230 / 886;
    if (bu > 0) { X.bar(ctx, m0 - 46, BTOP, 16, 778 * hS, bu, { col: 'age' }); X.bar(ctx, m1 - 46, BTOP, 16, 886 * hS, span(t, A.lived + .25, A.lived + 1.4) * (1 - span(t, A.small - .2, A.small + .4)), { col: 'gold' }); }
    const du = dotU(t);
    if (du > 0) { F.dots(ctx, t, m0 - 40, BTOP - 120, { n: 9, cols: 5, gap: 16, r: 5, u: du, col: 'age' }); F.dots(ctx, t, m1 - 40, BTOP - 120, { n: 10, cols: 5, gap: 16, r: 5, u: du, on: 10 }); }
  }

  // ---------------------------------------------------------------- the take
  function take(ctx, t) {
    const v = view(t);
    if (t < A.guess + .3) {
      const r = ring(t);
      B.betPlate(ctx, t, v, {
        pool: pool(t), title: 1 - span(t, R.a, R.a + .8), titleU: 1, bet: 1 - span(t, R.a + .1, R.a + .7),
        run: lerp(BET.run, XNOW + 3, sineIO(span(t, R.a + .2, R.a + 1.4))), runA: 1 - span(t, R.a + 1.0, R.a + 1.4),
        ring: [r.x, r.y, r.r], ringU: r.u, think: 1.2, beam: 1 - span(t, R.a, R.a + .9), youU: 1 - span(t, R.a + .2, R.a + 1.2), lift: endLift(t),
        under: (c, s) => lab3(c, t, s),
        mid: (c, s) => { inScreen(c, t, s); bench3(c, t, s); },
        top: (c) => words(c, t, v),
      });
      return;
    }
    // 1.28 → 1.30: the lifeline again (latePlate), the shelf sinking into it, the guess tag, the marks, you and the repair light
    B.latePlate(ctx, t, v, tl, {
      pool: pool(t), marks: span(t, A.real - .1, A.real + 1.0), light: span(t, A.what + .3, A.what + .9), lightX: lightX(t),
      you: span(t, A.what + .1, A.what + 1.3), youDir: t < A.late + .4 ? 1 : -1, pose: 'look', end: 1, lift: endLift(t),
      under: (c, s) => lab3(c, t, s),
      top: (c) => words(c, t, v),
    });
  }
  function words(ctx, t, v) {
    label(ctx, SRC.cell, W / 2, 150, lab(t, A.before - .4, A.study + .3), { size: 34, spacing: .1 });
    if (t > A.before - .3 && t < A.study + .3) F.source(ctx, t, A.before - .2, A.study + .2, SRC.cellSrc);
    const [gx, gy] = X.toScreen(v, geneX, GENE.y);
    label(ctx, SRC.gene, clamp(gx, 360, W - 360), gy - 150, lab(t, A.single + .05, A.boosted + .4), { size: 40, gold: .7, spacing: .1 });
    if (t > A.single && t < A.boosted + .4) F.source(ctx, t, A.single + .1, A.boosted + .3, SRC.geneSrc);
    // the bars' direct labels + the difference
    const hS = 230 / 886, bl = (x, val, d, k) => { const [sx, sy] = X.toScreen(v, x - 46, BTOP - val * hS); label(ctx, d, sx, sy - 22, k, { size: 26, gold: x === MICE[1] ? .7 : 0, col: x === MICE[1] ? CREAM : AGE.text }); };
    const bk = lab(t, A.lived + .5, A.small + .3); bl(MICE[0], 778, SRC.mice[0], bk); bl(MICE[1], 886, SRC.mice[1], lab(t, A.lived + .8, A.small + .3));
    const [px0, py] = X.toScreen(v, MICE[0] - 90, BTOP - 120);
    big(ctx, SRC.mice14, px0 - 40, py, 92, lab(t, A.lived + 1.1, A.small + .3), { gold: 1, align: 'right' });
    if (t > A.small && t < A.nodrug) F.source(ctx, t, A.small + .1, A.nodrug - .1, SRC.miceSrc);
    SRC.caveats.forEach((c, i) => B.pill(ctx, c, 1500, 300 + i * 62, tagU(i, t), { size: 24 }));
    const [sx, sy] = X.toScreen(v, (BX[0] + BX[1]) / 2, BTOP - 150);
    label(ctx, SRC.noDrug, sx, Math.max(170, sy - 40), lab(t, A.nodrug + .5, A.guess + .2), { size: 32, spacing: .1 });
    // 1.28: the 2032 tag on the line, dashed and wobbling: A GUESS
    const gu = lab(t, A.guess - .1, A.real + .15), [tx, ty] = X.toScreen(v, X32, LY);
    if (gu > 0) { X.drawPath(ctx, [[tx, ty - 6], [tx, ty - 40]], 1, { col: rgba(GOLD.line, .6), w: 1.4, a: gu });
      B.pill(ctx, SRC.y2032, tx, ty - 58, gu, { gold: true, hollow: 1, rot: .09 * Math.sin(t * 5.2) * (.4 + .6 * F.bump(t, A.guess, 1.6)), size: 24 });
      label(ctx, SRC.guess, tx, ty - 112, gu, { size: 30, spacing: .12 }); }
    const [mx, my] = X.toScreen(v, LATE.marks[1], LY);
    label(ctx, SRC.real, mx, my - 84, lab(t, A.real + .2, A.what + .4), { size: 32, gold: .9, spacing: .14 });
  }
  const draw = (ctx, t) => take(ctx, t);
  return [{ t: R.a, draw, print: PR }];
};
