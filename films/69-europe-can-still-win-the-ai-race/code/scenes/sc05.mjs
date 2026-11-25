// c05 · B1 · PART 2 ONE SET OF RULES · 'Because a company that wants' → 'None of it runs' (plateEnergy, B2). The plan disc opens on piece 2,
// the home block sets off right and runs into a row of 27 file stacks (27 COMPANY LAWS) · ★ the 27 stacks fly up and fold into one
// sheet ("EU INC"), valid in all 27 (a gold line runs along their footprints) · the sheet moves on and stops at the hemicycle (PARLIAMENT:
// NO POSITION YET) · the seats flatten into a negotiating table, workers behind it; a dashed path tries to get around them (WORKERS'
// RIGHTS) · A FAIR WORRY · the table line runs on as a timeline 2026 → 2028 (NOT BEFORE 2028) · the sheet flies into piece 2 of the
// growing disc, which turns paper (ON PAPER); the world sinks, the disc lands on plateEnergy. One draw function + the plate entry.
//
// | ID    | anchor (phrase)                  | zeigt wörtlich                                                     | kind  | carrier out              |
// |-------|----------------------------------|--------------------------------------------------------------------|-------|--------------------------|
// | 4.01  | Because a company that wants     | piece 2 opens big; the block runs into 27 file stacks: 27 COMPANY LAWS | EXPL | the stacks             |
// | 4.02★ | The plan has a fix               | the 27 stacks fold into one sheet: "EU INC" · 48 HOURS · UNDER €100 | EXPL | the sheet                |
// | 4.03  | But it's held up                 | the sheet stops at a hemicycle: PARLIAMENT: NO POSITION YET        | EXPL  | the front row            |
// | 4.04  | Unions fear                      | workers at a table with the sheet; a path around them: WORKERS' RIGHTS | SCENE | the table line        |
// | 4.05  | A fair worry                     | the table line runs on as a timeline 2026 → 2028: NOT BEFORE 2028  | EXPL  | the sheet                |
// | 4.06  | So that one set of rules         | the sheet flies into piece 2: ON PAPER → plateEnergy               | EXPL  | plateEnergy              |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f69_kit.mjs';
import * as S from '../lib/f69_world.mjs';
import * as X from '../lib/f69_explain.mjs';
import { initSeams, lab, hud, block, cover, fileStack, hemicycle, table } from './sc02.mjs';
import { GB } from './sc03.mjs';
import { HX, HB, viewH, worldC4, homeLine } from './sc04.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, SOURCES: SRC } = F;
const PR = F.PRINT69, TAU = Math.PI * 2;
const blendV = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), k)) });
const quad = (a, c, b, u) => [(1 - u) ** 2 * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1]];

export default async (T, R) => {
  initSeams(T);
  const G = (p, n = 0) => T.G(p, n, R.a - .01);
  const A = {
    a: R.a, grow: G('grow across Europe'), runs: G('runs into'), n27: G('twenty-seven different'), laws: G('company laws'),
    fix: G('a fix'), newk: G('a new kind of company'), valid: G('valid in all'), all27: G('all twenty-seven countries'), online: G('Set up online'),
    days: G('two days'), under: G('under a hundred'), held: G("But it's held up"), parl: G('European Parliament'), unions: G('Unions fear'),
    around: G('get around'), rights: G("workers' rights"), fair: G('A fair worry'), even: G("And even if it's solved"), first: G('the first such company'),
    before: G('before twenty twenty-eight'), rules: G('So that one set of rules'), paper: G('still on paper'), end: R.b,
  };
  const tP = A.end - S.SEAM_HALF;
  // ---------------------------------------------------------------- the row of 27 stacks, the sheet, the hemicycle, the table, the timeline
  const N = 27, SX = (i) => 2190 + i * 80, SW = 54, SN = (i) => 14 + ((i * 7 + 3) % 9), SHT = { x: 3230, y: 440, w: 300 };
  const HC = { x: 5000, y: GB - 10, R: 400 }, TBL = { x: 4900, y: GB - 162, w: 640 }, WK = [4990, 5100, 5210], YR = [[5500, '2026'], [6000, '2027'], [6500, '2028']];
  const BX1 = 2060;
  const VK = [
    [A.a + .1, { x: HX + 540, y: 540, s: 1 }], [A.grow + .2, { x: 2420, y: 545, s: .95 }], [A.runs + .4, { x: 2700, y: 560, s: .82 }],
    [A.laws + .6, { x: 3200, y: 590, s: .64 }], [A.fix, { x: 3210, y: 585, s: .66 }], [A.newk + .8, { x: 3230, y: 560, s: .74 }],
    [A.held, { x: 3260, y: 560, s: .76 }], [A.parl + .6, { x: 4450, y: 560, s: .74 }], [A.unions + .2, { x: 4520, y: 560, s: .76 }],
    [A.unions + 1.4, { x: 5000, y: 560, s: .86 }], [A.fair + .6, { x: 5060, y: 560, s: .88 }], [A.first, { x: 5700, y: 560, s: .82 }],
    [A.before + 1.0, { x: 5790, y: 552, s: .85 }], [tP - .9, { x: 5760, y: 540, s: .965 }], [tP, { x: 5760, y: 540, s: 1 }],
  ];
  const view = (t) => blendV(viewH(t), X.viewPath(t, VK), sineIO(span(t, A.a + .1, A.a + 1.3)));
  const PLATE = { x: S.PLATE_DISC.x, y: S.PLATE_DISC.y, r: S.PLATE_DISC.r };

  function draw(ctx, t) {
    const v = view(t), endK = span(t, tP - 1.2, tP - .05);
    X.sheet(ctx, t, v, { lx: lerp(t < A.held ? lerp(HX + 200, 3000, span(t, A.a, A.a + 2)) : 5300, v.x, endK), ly: lerp(520, v.y - 70, endK) });
    // --- timings
    const go = span(t, A.grow - .1, A.runs), bump = Math.sin(Math.PI * span(t, A.runs, A.runs + .5)), antic = Math.sin(Math.PI * span(t, A.grow - .45, A.grow - .05));
    const bx = lerp(HX, BX1, expoIn(go)) - 26 * antic - 34 * bump, lean = -.035 * antic + .05 * bump;
    const fold = span(t, A.fix + .05, A.newk + .7), cu = span(t, A.fix + .5, A.newk + .6);
    const fan = span(t, A.valid - .05, A.all27 + .6) * (1 - span(t, A.held - .4, A.held + .2)), gl = span(t, A.all27 - .1, A.all27 + .9), heldD = span(t, A.held + .1, A.held + .8);
    const mv = expoOut(span(t, A.held + .05, A.held + 1.0)), jolt = Math.sin(Math.PI * span(t, A.held + .85, A.held + 1.35));
    const hemi = span(t, A.held + .3, A.parl + .6) * (1 - span(t, A.unions - .05, A.unions + .75));
    const tb = span(t, A.unions + .2, A.unions + 1.0), wk = (j) => span(t, A.unions + .5 + j * .18, A.unions + 1.2 + j * .18);
    const ar = span(t, A.around - .1, A.rights + .3) * (1 - span(t, A.fair - .1, A.fair + .5)), warm = span(t, A.fair, A.fair + .8);
    const tl = span(t, A.even + .1, A.first + .3), fc = span(t, A.first, A.first + .6), dot = span(t, A.before - .5, A.before + .75);
    const sink = expoIn(span(t, A.rules + .4, tP - .55)), grd = 1 - span(t, tP - 1.5, tP - .4);
    const fly = span(t, A.rules + .05, A.rules + 1.25);
    // where the sheet is (sheet coords): on its fold place → by the hemicycle → on the table
    const onTable = sineIO(span(t, A.unions + .3, A.unions + 1.1));
    const shx = lerp(lerp(SHT.x, 4350, mv) - 40 * jolt, 4690, onTable), shy = lerp(SHT.y, TBL.y - 104, onTable), shw = lerp(SHT.w, 150, onTable), shr = lerp(-.02, -.08, onTable);
    let sheetScreen = null;
    X.inView(ctx, v, () => {
      // the ground (retracts into the disc's centre at the end)
      if (grd > 0) { const c = v.x, L = 6000 * sineIO(grd); X.lightLine(ctx, [[c - L, GB], [c + L, GB]], 1, { a: .42, w: 3 }); }
      ctx.save(); ctx.beginPath(); ctx.rect(-5000, -5000, 20000, GB + 5000 + 1); ctx.clip(); ctx.translate(0, sink * 520);
      worldC4(ctx, t); homeLine(ctx, 1 - span(t, A.grow, A.grow + 1.1));
      // the home block: sets off right, runs into the first stack, bounces back
      block(ctx, t, bx, GB, HB.w, HB.h, { cols: 3, lit: .85, lean, pivot: 1 });
      ctx.restore();
    });
    X.inView(ctx, v, () => {
      ctx.save(); ctx.beginPath(); ctx.rect(-5000, -5000, 20000, GB + 5000 + 1); ctx.clip(); ctx.translate(0, sink * 520);
      // the 27 footprints (gold dots) and the gold line "valid in all 27" (dashed cream once it is held up)
      for (let i = 0; i < N; i++) { const u = clamp(fan * 1.5 - i / N * .5) ; const lit = Math.max(u, gl); if (fold <= 0 || lit <= 0) continue;
        ctx.fillStyle = rgba(mixHex(GOLD.hot, CREAM, heldD * .6), (.35 + .65 * lit) * (1 - .5 * heldD)); ctx.beginPath(); ctx.arc(SX(i), GB, 9, 0, TAU); ctx.fill(); }
      if (gl > 0) { X.lightLine(ctx, [[BX1 + HB.w / 2, GB], [SX(N - 1) + 40, GB]], gl, { col: rgba(GOLD.line, 1 - heldD), w: 5, glowCol: GOLD.halo, blur: 14 });
        if (heldD > 0) X.lightLine(ctx, [[BX1 + HB.w / 2, GB], [SX(N - 1) + 40, GB]], 1, { col: rgba(CREAM, .55 * heldD), w: 3, dash: [14, 12], glow: false }); }
      if (fan > 0) for (let i = 0; i < N; i++) { const u = clamp(fan * 1.5 - i / N * .5); if (u <= 0) continue;
        X.lightLine(ctx, [[SHT.x, SHT.y + SHT.w * .66], [SX(i), GB - 6]], u, { col: rgba(GOLD.line, .55), w: 2, glow: false }); }
      // the 27 stacks: rise (the first one before the block hits it), then fly up into the one sheet (centre-out)
      for (let i = 0; i < N; i++) {
        const ru = i === 0 ? span(t, A.runs - .5, A.runs - .05) : span(t, A.n27 - .15 + i * .034, A.n27 + .4 + i * .034);
        const q = Math.abs(i - 13) / 13, k = sineIO(clamp(fold * 1.7 - q * .7)); if (ru <= 0 || k >= 1) continue;
        const x0 = SX(i) + (i === 0 ? 10 * Math.sin(Math.PI * span(t, A.runs, A.runs + .4)) : 0);
        if (k <= 0) { fileStack(ctx, t, x0, GB, SW, SN(i), { u: ru, seed: i + 3 }); continue; }
        const x = lerp(x0, SHT.x, k), y = lerp(GB, SHT.y + 60, k) - Math.sin(Math.PI * k) * 260, sc = lerp(1, .35, k);
        ctx.save(); ctx.translate(x, y); ctx.rotate((i < 13 ? 1 : -1) * k * .7); ctx.scale(sc, sc); fileStack(ctx, t, 0, 0, SW, SN(i), { seed: i + 3 }); ctx.restore();
      }
      // the hemicycle; the table with the workers behind it; the path around them; the timeline
      if (hemi > 0) hemicycle(ctx, t, HC.x, HC.y, HC.R, { u: hemi });
      if (tb > 0) {
        for (let j = 0; j < 3; j++) { const u = wk(j); if (u <= 0) continue; ctx.save(); ctx.beginPath(); ctx.rect(WK[j] - 200, GB - 600, 400, 600); ctx.clip(); ctx.translate(0, (1 - expoOut(u)) * 330);
          E.person(ctx, WK[j], GB, 300 - j * 14, { dir: -1, light: .5 + .4 * warm, look: .1 + .05 * Math.sin(t * .7 + j) }); ctx.restore(); }
        if (warm > 0) halo(ctx, WK[1], GB - 200, 380, .3 * warm, GOLD.halo, GOLD.core);
        ctx.save(); ctx.beginPath(); ctx.rect(TBL.x - 600, TBL.y - 60, 1200, GB - TBL.y + 60); ctx.clip(); ctx.translate(0, (1 - expoOut(tb)) * 180); table(ctx, t, TBL.x, TBL.y, TBL.w); ctx.restore();
      }
      if (ar > 0) { const pts = Array.from({ length: 33 }, (_, i) => quad([4740, TBL.y - 190], [5120, GB - 760], [5420, GB - 40], i / 32));
        X.lightLine(ctx, pts, ar, { col: rgba(COOL.body, .85), w: 4, dash: [16, 12], glowCol: COOL.halo, blur: 10 }); }
      if (tl > 0) {
        X.lightLine(ctx, [[TBL.x + TBL.w / 2, TBL.y], [6800, TBL.y]], tl, { a: .7, w: 3 });
        for (const [k, [yx]] of YR.entries()) { const u = clamp(tl * 1.4 - k * .2), on = span(dot, k * .45, k * .45 + .12); if (u <= 0) continue;
          ctx.fillStyle = rgba(mixHex(CREAM, GOLD.hot, on), .9); ctx.fillRect(yx - 2, TBL.y - 18 * u, 4, 36 * u); }
        if (fc > 0) { const w = 110, h = 140, x0 = YR[2][0] - w / 2, y0 = TBL.y - h;
          X.lightLine(ctx, [[x0, TBL.y], [x0, y0], [x0 + w, y0], [x0 + w, TBL.y]], fc, { a: .7, w: 2.5, dash: [10, 8], glow: false }); }
        if (dot > 0 && dot < 1.01) { const x = lerp(TBL.x + TBL.w / 2, YR[2][0], sineIO(dot)); halo(ctx, x, TBL.y, 90, .5, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(x, TBL.y, 11, 0, TAU); ctx.fill(); }
      }
      // the sheet ("EU INC"): grows where the stacks meet, moves on, stops, lies on the table
      if (cu > 0 && fly <= 0) { const k = expoOut(cu); cover(ctx, t, shx, shy, shw, { sx: k, sy: k, rot: shr, lines: [[SRC.euInc, 70 * shw / SHT.w, true]], wu: span(t, A.newk, A.newk + .8) }); }
      ctx.restore();
      if (fly > 0) sheetScreen = X.toScreen(v, shx, shy + sink * 520);
    });
    // --- texts (screen space)
    X.big(ctx, SRC.laws27, W / 2, 200, 70, lab(t, A.laws - .05, A.fix + .1), { gold: .2 });
    const fx = X.toScreen(v, SHT.x + SHT.w / 2 + 50, SHT.y)[0];
    X.label(ctx, SRC.euIncFacts[0], fx, 420, lab(t, A.online, A.held - .1), { size: 30, spacing: .1, align: 'left' });
    X.label(ctx, SRC.euIncFacts[1], fx, 470, lab(t, A.under, A.held - .1), { size: 30, spacing: .1, align: 'left', gold: .8, col: GOLD.text });
    const vS = X.toScreen(v, SHT.x, GB + 50);
    X.label(ctx, 'VALID IN ALL 27', vS[0], vS[1], lab(t, A.valid + .1, A.held - .2), { size: 26, spacing: .14, gold: .6, col: GOLD.text });
    if (t > A.newk && t < A.held + .4) F.source(ctx, t, A.newk + .3, A.held - .1, SRC.euIncSrc);
    X.big(ctx, SRC.heldUp, W / 2, 200, 62, lab(t, A.parl - .2, A.unions + .1), { gold: .2 });
    if (t > A.parl - .3 && t < A.unions + .5) F.source(ctx, t, A.parl, A.unions, SRC.heldUpSrc);
    const wS = X.toScreen(v, WK[1], GB - 400);
    X.label(ctx, "WORKERS' RIGHTS", wS[0], wS[1], lab(t, A.rights - .15, A.even + .2), { size: 28, spacing: .12 });
    X.label(ctx, 'A FAIR WORRY', W / 2, 200, lab(t, A.fair + .05, A.even + .3), { size: 34, spacing: .14, gold: .5, col: GOLD.text });
    for (const [k, [yx, s]] of YR.entries()) { const p = X.toScreen(v, yx, TBL.y + 52); X.label(ctx, s, p[0], p[1], lab(t, A.even + .4 + k * .25, A.rules + .5), { size: 26, gold: k === 2 ? .8 : 0, col: k === 2 ? GOLD.text : CREAM }); }
    X.big(ctx, SRC.y2028, W / 2, 200, 70, lab(t, A.before - .05, A.rules + .3), { gold: .5 });
    if (t > A.before - .3 && t < A.rules + .7) F.source(ctx, t, A.before, A.rules + .3, SRC.y2028Src);
    // --- the disc: 4.01 piece 2 big for a moment · 4.06 grows onto the plate; the sheet flies into piece 2
    const b1 = span(t, A.a + .05, A.a + .9) * (1 - span(t, A.runs - .4, A.runs + .4)), b2 = sineIO(span(t, A.rules + .05, A.rules + 1.9));
    const lit1 = b1 > 0 ? F.kitParts(T, t).parts.map((p, i) => (i === 1 ? { ...p, lit: 1 } : p)) : null;
    const D = b2 > 0 ? { big: b2, bx: PLATE.x, by: PLATE.y, br: PLATE.r * v.s, glow: lerp(.35, .8, b2), lit2: span(t, tP - 1.0, tP - .2), loose: { x: PLATE.x + PLATE.r * 1.32 * v.s, y: PLATE.y + PLATE.r * 1.06 * v.s, rot: .35 },
      lab: [0, span(t, A.rules + 1.0, A.rules + 1.6) * (1 - span(t, tP - 1.0, tP - .55)), 0, 0, 0], txt: 0 }
      : { big: b1, bx: 1450, by: 400, br: 160, lab: [0, span(b1, .5, 1), 0, 0, 0], ...(lit1 ? { parts: lit1 } : {}) };
    const dc = hud(ctx, t, T, D);
    if (fly > 0 && fly < 1 && sheetScreen && dc) {
      const [px, py] = F.pieceCentre(1, dc.cx, dc.cy, dc.r), k = sineIO(fly), w = lerp(150 * v.s, dc.r * .35, k) * (1 - span(fly, .8, 1));
      if (w > 1) cover(ctx, t, lerp(sheetScreen[0], px, k), lerp(sheetScreen[1], py, k) - Math.sin(Math.PI * k) * 120, w, { rot: lerp(-.08, .5, k), lines: [] });
    }
  }
  return [{ t: R.a, draw, print: PR }, { t: tP, draw: (ctx, t) => S.plateEnergy(ctx, t, T), print: PR }];
};
