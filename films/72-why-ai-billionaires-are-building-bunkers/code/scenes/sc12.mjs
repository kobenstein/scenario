// c12 · B3 · 'So a world nobody wants' (p1112) → 'So go back to that door' (p1213). The open argument: Harris (C2b), the bill, the promise.
// One continuous take: the concrete of the bunker turns to paper and rises as one sheet → the sheet splits into two blank cards (OPEN) →
// card 1 opens into a frame and grows into the clip plate (C2b) → shrinks back, becomes the bill → ★ the bill flies down as a letter to
// you at the kitchen table, a wage bar fills to 75 % and stays open upwards, half a year of weeks lights up → card 2: the promise, a house
// and a data centre, the power bill slides over → both cards side by side: NOT PASSED · VOLUNTARY → a large blank sheet grows from behind
// them, they shrink into its corner → three figures rise under it (p1213).
//
// | ID   | anchor (phrase)               | zeigt wörtlich                                   | picture                                                                 | layer | carrier out |
// |------|-------------------------------|--------------------------------------------------|-------------------------------------------------------------------------|-------|-------------|
// | 5.33 | So a world nobody wants       | that world can't be poured in concrete           | the bunker's concrete turns into paper, its outline rises as one sheet  | EXPL  | the paper   |
// | 5.34 | And how to build it           | an open argument                                 | the sheet splits into two blank cards: OPEN · AN OPEN ARGUMENT          | EXPL  | card 1      |
// | 5.35 | Tristan Harris has            | Harris has the shortest answer                   | card 1 opens into a frame and grows into the clip plate                 | MIX   | the plate   |
// | 5.36 | slot:C2b                      | (clip)                                           | C2b, the marked placeholder (F.clipPlate); shrinks back into card 1     | CLIP  | card 1      |
// | 5.37 | One has already been written  | one law is written                               | card 1 becomes the bill: S. 5518 · MAKE AI WORK FOR AMERICANS ACT       | EXPL  | the bill    |
// | 5.38 | If A.I. shakes up ★           | at least 3/4 of the wage for half a year         | the bill flies down as a letter to you at the kitchen table; the wage bar fills to 75 % and stays open upwards; 26 of 52 weeks light up (KB3 source) | MIX | card 2 |
// | 5.39 | Others bet on the companies   | others bet on the companies                      | the kitchen sinks; card 2 grows back: A PROMISE                         | EXPL  | card 2      |
// | 5.40 | Microsoft has promised        | data centres pay their own way                   | a house and a data centre rise; a paper power bill slides from the house to the data centre (+ source) | MIX | the cards |
// | 5.41 | Neither is done               | neither is done                                  | both cards side by side; card 1 collects AT LEAST 75% · 26 WEEKS        | EXPL  | card 1      |
// | 5.42 | The bill hasn't passed        | the bill hasn't passed                           | card 1: NOT PASSED (badge) + committee source                           | EXPL  | card 2      |
// | 5.43 | The promise isn't a law       | the promise isn't a law                          | card 2: VOLUNTARY (badge)                                               | EXPL  | the sheet   |
// | 5.44 | That world isn't built        | that world isn't built yet                       | a large blank sheet grows from behind the cards, they shrink into its corner | EXPL | the sheet |
// | 5.45 | Whether it will be            | lawmakers, companies, voters decide              | three figures rise under the sheet: LAWMAKERS · COMPANIES · VOTERS (p1213) | EXPL | the sheet |
import { E, F, S, X, LY, LOCAL, lab, view, seamKeys, keyed, above, card, card1, card2, tableScene, secBunker, bunkerOutline, morphPts, rectPts,
  stage1112, P1112, p1112, stage1213, P1213, p1213 } from '../lib/b3_common.mjs';
const { P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, halo } = E;
const { GOLD, CREAM, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT72;
const SHEET0 = { x: 960, y: 330, w: 1142, h: 380 }, CW = 520;            // = stage1213's sheet0 with its cards at cw 520
const C1 = [689, 330, CW, -.02], C2 = [1231, 336, CW, .02];             // the two cards side by side (stage1213 at sheetU 0)
const P1 = [370, 200, CW, -.02], LET = [800, 546, 56, -.1];             // card 1 parked / as the letter in your hands
const PK2 = [1560, 190, 300, .03], C1B = [600, 200, CW, -.02], C2B = [1240, 210, CW, .02];
const KX = 760, KK = 1.5;                                                // the kitchen table
const BAR = { x: 1180, w: 60, h: 300 }, STRIP = { x0: 560, n: 52, cw: 13.2, y: LY + 36 };
const HOUSE = { x: 640, w: 220 }, DC = { x: 1250, w: 520 };

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .01), C2b = T.clip('C2b');
  const A = {
    so: R.a, poured: G('poured'), concrete: G('in concrete'), how: G('And how to build'), open: G('open argument'), harris: G('Tristan Harris'), answer: G('shortest answer'),
    cs: C2b.start, ce: C2b.end, one: G('One has already'), written: G('been written'), shakes: G('shakes up'), bill: G('a bill in'), pay: G('pay people'), least: G('at least three'),
    half: G('half a year'), others: G('Others bet'), ms: G('Microsoft has'), data: G('data centers'), own: G('pay their own'), neigh: G('the neighbors'), neither: G('Neither is done'),
    passed: G("hasn't passed"), law: G("isn't a law"), that: G("That world isn't"), whether: G('Whether it will'), lm: G('by lawmakers'), co: G('by companies'), vo: G('by voters'), end: R.b,
  };
  const tP = A.end - S.SEAM_HALF;
  const tM0 = A.concrete + .12, tM1 = A.how + .5, tSp0 = A.how + .3, tSp1 = A.how + 1.2;   // morph, split
  const tSheet0 = A.that - .1, tS = A.that + .4;                                        // the big sheet: emerges, then stage1213
  // ---------------------------------------------------------------- view + pool
  const VD = [...seamKeys(T, 'So a world nobody wants', P1112.V), [A.poured + .3, { x: 1110, y: 600, s: .95 }], [tSp1, { x: 960, y: 470, s: 1.0 }], [A.answer, { x: 960, y: 472, s: 1.025 }],
    [A.ce + .4, { x: 960, y: 478, s: 1.035 }], [A.shakes + 1.3, { x: 940, y: 490, s: 1.04 }], [A.least + .6, { x: 920, y: 482, s: 1.12 }], [A.others - .2, { x: 915, y: 484, s: 1.15 }], [A.ms, { x: 960, y: 480, s: 1.0 }],
    [A.neither - .2, { x: 960, y: 478, s: 1.02 }], [A.neither + 1.0, { x: 960, y: 520, s: 1.0 }], [A.that - .2, { x: 960, y: 526, s: 1.025 }], [tS + 1.2, { x: 960, y: 542, s: 1.0 }],
    [A.co, { x: 960, y: 544, s: .975 }], [tP, P1213.V]];
  const vw = (t) => view(t, VD);
  const PK = [[A.so, P1112.pool], [tSp1, [960, 420, .85]], [A.shakes + 1.2, [760, 500, .9]], [A.others + .6, [960, 430, .85]], [tS + 1, P1213.pool], [tP, P1213.pool]];
  const pool = (t) => { let i = 0; while (i < PK.length - 2 && t > PK[i + 1][0]) i++; const [t0, a] = PK[i], [t1, b] = PK[i + 1], u = sineIO(span(t, t0, t1)); return a.map((x, j) => lerp(x, b[j], u)); };

  // ---------------------------------------------------------------- 5.33 the concrete turns to paper and rises as one sheet
  const paper = (t) => span(t, A.poured - .25, A.concrete + .08);
  const morph = (t) => quartIO(span(t, tM0, tM1));
  const outU = (t) => span(t, A.harris + .3, A.harris + 1.1);   // the one outside sinks into the line as the plate grows
  function sheetMorph(ctx, t, s) {
    const m = morph(t); if (m >= 1) return;
    const a = bunkerOutline(P1112.hx, LY, { depth: P1112.depth, room: P1112.room }), b = rectPts(SHEET0.x - SHEET0.w / 2, SHEET0.y - SHEET0.h / 2, SHEET0.x + SHEET0.w / 2, SHEET0.y + SHEET0.h / 2);
    const pts = morphPts(a, b, m);
    ctx.save(); ctx.fillStyle = PAPER.body; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
    halo(ctx, lerp(P1112.hx + 200, SHEET0.x, m), lerp(LY + 180, SHEET0.y, m), 420, .12, PAPER.lit, PAPER.lit); ctx.restore();
    X.drawPath(ctx, [...pts, pts[0]], 1, { col: rgba(PAPER.edge, .9), w: 2 / s });
  }
  // ---------------------------------------------------------------- the two cards
  const K1 = [[tSp1, C1], [A.shakes - .1, C1], [A.shakes + 1.1, P1], [A.bill, P1], [A.bill + 1.1, LET], [A.others, LET], [A.others + 1.0, C1B], [A.neither - .1, C1B], [A.neither + .9, C1]];
  const K2 = [[tSp1, C2], [A.one + 1.6, C2], [A.one + 3.0, PK2], [A.others - .1, PK2], [A.others + .9, C2B], [A.neither - .1, C2B], [A.neither + .9, C2]];
  const at = (K, t) => [0, 1, 2, 3].map((j) => keyed(t, K.map(([tt, c]) => [tt, c[j]])));
  const half = (i) => [SHEET0.x + (i ? 1 : -1) * SHEET0.w / 4, SHEET0.y, SHEET0.w / 2, 0];
  function cardState(t, i) {
    const sp = span(t, tSp0, tSp1); if (sp <= 0) return null;
    const c = sp < 1 ? (() => { const h = half(i), g = i ? C2 : C1, e = quartIO(sp); return [lerp(h[0], g[0], e), lerp(h[1], g[1], e), lerp(h[2], g[2], e), lerp(0, g[3], e), lerp(SHEET0.h, g[2] * .6, e)]; })() : (() => { const q = at(i ? K2 : K1, t); return [...q, q[2] * .6]; })();
    return c;
  }
  const open1 = (t) => span(t, A.harris - .05, A.harris + .75) * (1 - span(t, A.ce + .7, A.ce + 1.3));
  const blank = (t, i) => span(t, A.open - .35, A.open + .25) * (i ? 1 - span(t, A.one + 1.4, A.one + 1.9) : 1 - span(t, A.one - .2, A.one - .1));
  const bill1 = (t) => t < A.others - .5 ? span(t, A.written - .55, A.written + .3) * (1 - span(t, A.bill, A.bill + .45)) : span(t, A.others + .3, A.others + 1.1);
  function cards(ctx, t, s) {
    const c1 = cardState(t, 0), c2 = cardState(t, 1); if (!c1) return null;
    card2(ctx, t, c2[0], c2[1], c2[2], c2[4], { rot: c2[3], blank: blank(t, 1), prom: span(t, A.others + .65, A.others + 1.45), ms: span(t, A.ms + .05, A.ms + .8), vol: span(t, A.law - .25, A.law + .3) });
    card1(ctx, t, c1[0], c1[1], c1[2], c1[4], { rot: c1[3], open: open1(t), blank: blank(t, 0), bill: bill1(t), l1: span(t, A.neither + .4, A.neither + 1.0), l2: span(t, A.neither + .7, A.neither + 1.3),
      pass: span(t, A.passed - .05, A.passed + .45), lit: F.bump(t, A.passed + .1, 1.4) });
    X.label(ctx, SRC.openArgument, SHEET0.x, SHEET0.y + 250, lab(t, A.open - .1, A.harris + .4), { size: 30, spacing: .14, gold: .5 });
    return c1;
  }
  // ---------------------------------------------------------------- 5.35–5.36 the clip plate grows out of card 1 (screen space)
  const plateM = (t) => sineIO(span(t, A.harris + .9, A.cs)) * (1 - sineIO(span(t, A.ce, A.ce + .75)));
  function plate(ctx, t, v, c1) {
    const m = plateM(t); if (m <= 0 || !c1) return;
    const [sx, sy] = X.toScreen(v, c1[0] - c1[2] / 2, c1[1] - c1[4] / 2);
    F.clipPlate(ctx, t, T, 'C2b', { from: { x: sx, y: sy, w: c1[2] * v.s, h: c1[4] * v.s }, morph: m });
  }
  // ---------------------------------------------------------------- 5.38 ★ the kitchen table, the wage bar, the weeks
  const kitU = (t) => span(t, A.shakes - .1, A.shakes + 1.1) * (1 - span(t, A.others - .15, A.others + .8));
  const barRise = (t) => span(t, A.pay - .3, A.pay + .5) * (1 - span(t, A.others - .1, A.others + .7));
  const fillU = (t) => expoOut(span(t, A.least, A.least + 1.3));
  const stripU = (t) => span(t, A.half - .35, A.half + .15) * (1 - span(t, A.others - .2, A.others + .5)), weekU = (t) => span(t, A.half, A.half + .7);
  function kitchen(ctx, t, s) {
    const ku = kitU(t); if (ku > 0) tableScene(ctx, t, KX, LY, { u: ku, k: KK, s, seats: [0], lamp: 1 });
    const br = barRise(t);
    if (br > 0) above(ctx, () => { ctx.save(); ctx.translate(0, (1 - expoOut(br)) * (BAR.h + 20));
      const x0 = BAR.x - BAR.w / 2, y100 = LY - BAR.h, f = fillU(t) * .75;
      ctx.save(); ctx.setLineDash([9 / s, 8 / s]); ctx.strokeStyle = rgba(CREAM, .55); ctx.lineWidth = 2 / s; ctx.beginPath(); ctx.moveTo(x0, LY); ctx.lineTo(x0, y100); ctx.moveTo(x0 + BAR.w, LY); ctx.lineTo(x0 + BAR.w, y100); ctx.stroke(); ctx.restore();
      X.label(ctx, '100%', BAR.x, y100 - 16, br, { size: 22, spacing: .1, col: mixHex(CREAM, P.night1, .35) });
      if (f > 0) { const yf = LY - BAR.h * f;
        ctx.fillStyle = GOLD.body; ctx.fillRect(x0, yf, BAR.w, LY - yf); halo(ctx, BAR.x, yf, 90, .35 * f / .75, GOLD.halo, GOLD.core);
        // open upwards: a chevron rising above the fill ("at least")
        const cu = span(t, A.least + .9, A.least + 1.5), bob = Math.sin(t * 2.4) * 4;
        if (cu > 0) X.drawPath(ctx, [[BAR.x - 16, yf - 18 + bob], [BAR.x, yf - 34 + bob], [BAR.x + 16, yf - 18 + bob]], cu, { col: GOLD.line, w: 3 / s }); }
      ctx.restore(); });
    X.label(ctx, SRC.billCard[0], BAR.x + 62, LY - BAR.h * .75 + 11, span(t, A.least + .1, A.least + .8) * (1 - span(t, A.others - .3, A.others + .2)), { size: 32, align: 'left', gold: .6, spacing: .1 });
    // the weeks of one year under the line, half of them light up
    const su = stripU(t); if (su > 0) { for (let i = 0; i < STRIP.n; i++) { const a = span(su * STRIP.n, i, i + 3); if (a <= 0) continue; const x = STRIP.x0 + i * STRIP.cw;
      ctx.strokeStyle = rgba(CREAM, .5 * a); ctx.lineWidth = 1.2 / s; ctx.strokeRect(x, STRIP.y, STRIP.cw - 3, 20);
      const g = span(weekU(t) * 26, i, i + 1.5) * (i < 26 ? 1 : 0) * a; if (g > 0) { ctx.fillStyle = rgba(GOLD.body, g); ctx.fillRect(x + 1, STRIP.y + 1, STRIP.cw - 5, 18); } }
      X.label(ctx, SRC.billCard[1], STRIP.x0 + STRIP.n * STRIP.cw + 22, STRIP.y + 20, span(t, A.half + .2, A.half + .8) * (1 - span(t, A.others - .3, A.others + .2)), { size: 28, align: 'left', gold: .5, spacing: .1 }); }
  }
  // ---------------------------------------------------------------- 5.40 the house, the data centre, the power bill
  const houseU = (t) => span(t, A.ms + .7, A.ms + 1.9) * (1 - span(t, A.neither - .25, A.neither + .6));
  const dcU = (t) => span(t, A.data - .45, A.data + .6) * (1 - span(t, A.neither - .15, A.neither + .7));
  const slipU = (t) => sineIO(span(t, A.own - .05, A.own + 1.15));
  function town(ctx, t, s) {
    const hu = houseU(t), du = dcU(t); if (hu <= 0 && du <= 0) return;
    above(ctx, () => {
      if (hu > 0) { ctx.save(); ctx.translate(0, (1 - expoOut(hu)) * HOUSE.w * 1.1); F.house(ctx, t, HOUSE.x, LY, HOUSE.w, { lit: .75 + .25 * F.bump(t, A.neigh + .3, 1.6) }); ctx.restore(); }
      if (du > 0) { ctx.save(); ctx.translate(0, (1 - expoOut(du)) * DC.w * .3); F.dataCentre(ctx, t, DC.x, LY, DC.w);
        // the paper power bill: from the house's door to the data centre's wall, on an arc
        const q = slipU(t); if (q > 0 && hu > 0) { const a = [HOUSE.x + 40, LY - 70], b = [DC.x - DC.w / 2 + 70, LY - DC.w * .22 - 26], mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - 140;
          const px = (1 - q) ** 2 * a[0] + 2 * q * (1 - q) * mx + q * q * b[0], py = (1 - q) ** 2 * a[1] + 2 * q * (1 - q) * my + q * q * b[1];
          ctx.save(); ctx.translate(px, py); ctx.rotate(Math.sin(q * Math.PI) * .35 - .05); ctx.fillStyle = PAPER.lit; ctx.fillRect(-22, -15, 44, 30); ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 1.5 / s; ctx.strokeRect(-22, -15, 44, 30);
          ctx.fillStyle = rgba(PAPER.ink, .5); ctx.fillRect(-14, -6, 28, 3); ctx.fillRect(-14, 2, 18, 3); ctx.restore(); }
        ctx.restore(); }
    });
  }
  // ---------------------------------------------------------------- 5.44 the big sheet emerges from behind the cards
  function sheetBehind(ctx, t) {
    const u = sineIO(span(t, tSheet0, tS)); if (u <= 0) return;
    card(ctx, SHEET0.x, SHEET0.y, lerp(1000, SHEET0.w, u), lerp(280, SHEET0.h, u), { u: 1, rot: -.004 });
  }

  function draw(ctx, t) {
    const v = vw(t), pl = pool(t);
    if (t < tM0) {   // the plate's bunker: the label goes, the concrete turns to paper
      stage1112(ctx, t, v, { pool: pl, cut: 1, door: 1, light: .9, outside: 1, label: 1 - span(t, A.so + .4, A.so + 1.0), paper: paper(t), hatchSink: span(t, A.poured - .1, A.concrete + .1) });
      return;
    }
    if (t >= tS) {
      const su = span(t, tS, tS + 1.5), e = sineIO(su), fu = (g) => span(t, g - .25, g + .75);
      stage1213(ctx, t, v, { pool: pl, sheet0: SHEET0, sheetU: su, cw: lerp(CW, 230, e), figs: [fu(A.lm), fu(A.co), fu(A.vo)] });
      F.source(ctx, t, A.passed + .3, A.that + .4, SRC.notPassedSrc);
      return;
    }
    const cu = 1 - span(t, tM0, tM0 + 1.2);
    X.ground(ctx, t, v, { lx: pl[0], ly: pl[1], pool: pl[2], cut: cu > 0 ? { ...P1112.cut, u: cu } : null });
    let c1 = null;
    X.inView(ctx, v, (s) => {
      const ou = outU(t); if (ou < 1) above(ctx, () => F.lanternPerson(ctx, t, P1112.out, LY + sineIO(ou) * 110, 96, { dir: 1, ph: 2.1 }));
      kitchen(ctx, t, s); town(ctx, t, s); sheetBehind(ctx, t);
      sheetMorph(ctx, t, s);
      c1 = cards(ctx, t, s);
    });
    plate(ctx, t, v, c1);
    F.source(ctx, t, A.least, A.others - .1, SRC.billSrc);
    F.source(ctx, t, A.ms + .8, A.neither, SRC.microsoft);
    F.source(ctx, t, A.passed + .3, A.that + .4, SRC.notPassedSrc);
  }
  const marks = [R.a + S.SEAM_HALF, A.how, A.harris, A.one, A.shakes, A.others, A.ms, A.neither, A.passed, A.that, A.whether];
  return [{ t: R.a, draw: (ctx, t) => p1112(ctx, t, T), print: PR }, ...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => p1213(ctx, t, T), print: PR }];
};
