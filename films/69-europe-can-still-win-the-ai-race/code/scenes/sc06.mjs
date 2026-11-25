// c06 · PART 3 THE ENERGY (builder B2) · 'None of it runs' (plateEnergy) → 'This channel exists' (planned W: the machine's gold light
// match-cuts to your warm window, c07 M.01). One take on THE PLAN SHEET; every sentence its own picture, handed on by carriers:
// the disc → push into piece 3 (the data centre inside it) → the disc flies up into the HUD · the power cable lifts into the EU price bar ·
// the bars sink into their ground line, it unspools into the coast lines · the data centre splits onto the two lights · 2 blocks clone into
// 7 slots · one slot opens as a lit window (the bid team) · its upload bar stretches into the budget bar · the bar breaks into the 100 cells ·
// the gold cells fly into piece 3 (HUD → disc) · the disc flies back up · the machine rises out of its ground line, every chip tied to it ★.
//
// | ID   | anchor (phrase)                  | zeigt wörtlich                                                        | kind | carrier out                    |
// |------|----------------------------------|-----------------------------------------------------------------------|------|--------------------------------|
// | 5.01 | None of it runs                  | push into piece 3: an AI data centre, thick cables arrive, it lights   | MIX  | the cables                     |
// | 5.02 | And for heavy industry           | EU price bar rises out of the cable, US bar half: MORE THAN 2× US      | EXPL | the bars sink, the line → coast|
// | 5.03 | But not everywhere               | coast lines only: Sweden's north (dam) and France (reactors) glow      | EXPL | the two glows                  |
// | 5.04 | So the idea: build               | the data centre splits into two blocks, they slide onto the glows      | EXPL | the two blocks                 |
// | 5.05 | Europe wants up to seven         | 7 slots (5 dashed); one opens as a lit window, an upload bar · 3 DEC    | MIX  | the upload bar                 |
// | 5.06 | But much of the public money     | the bar: €10 BN public, half EU; €1 BN EU now (gold), €4 BN dashed: EU BUDGET 2028–2034 | EXPL | the bar → 100 cells |
// | 5.07 | And even if all of them          | the 100 cells again: 5 gold, a sixth fills to .6: ≈ 5.6% IN 2031        | EXPL | the gold cells                 |
// | 5.08 | So this part is halfway          | HUD → disc, the cells fly into piece 3: HALFWAY · THE MOST COMPUTERS struck | EXPL | the disc flies up          |
// | 5.09★| It doesn't have to               | NEEDED, NOT BIGGEST · the machine rises, every chip in the world tied to it | EXPL | the machine's gold light (W) |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f69_kit.mjs';
import * as S from '../lib/f69_world.mjs';
import * as X from '../lib/f69_explain.mjs';
import * as B from '../lib/b2_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, prng } = E;
const { GOLD, COOL, CREAM, CREAM2, LAMP, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT69;

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .5);
  const A = {
    a: R.a, dc: G('AI data centres'), heavy: G('And for heavy industry'), eu: G('in the European Union'), twice: G('more than twice'), am: G('as in America'),
    notEv: G('But not everywhere'), sweden: G("Sweden's north"), france: G('France has its reactors'), idea: G('So the idea'), build: G('build the biggest'),
    where: G('where the power is'), seven: G('Europe wants up to seven'), deadline: G('The deadline for bids'), dec: G('December third'),
    money: G('But much of the public money'), budget: G("Europe's next budget"), even: G('And even if all of them'), tank: G('one Brussels think tank'),
    five: G("Europe's five percent"), barely: G('barely moves'), half: G('So this part is halfway'), settled: G('One thing is settled'), most: G('the most computers'),
    doesnt: G("It doesn't have to"), needed: G('It has to be needed'), machine: G('And it already builds'), chips: G('most advanced chips'), dep: G('depend on'), end: R.b,
  };
  const D = S.PLATE_DISC, t0 = R.a + S.SEAM_HALF, P3 = F.pieceCentre(2, D.x, D.y, D.r);
  const lab = (t, a, b) => span(t, a, a + .7) * (1 - span(t, b - .45, b + .1));

  // ---------------------------------------------------------------- the camera over the sheet: the plate's creep, then the push into piece 3
  const creep = (t) => { const d = Math.max(0, t - (R.a - S.SEAM_HALF)); return d <= 1 ? 1 + .04 * d : 1.04 + .12 * (1 - Math.exp(-(d - 1) / 3)); };
  // 5.01 is not a zoom: piece 3 LIFTS out of the disc and grows into the stage (the data centre lives in it) while the disc flies up
  // into the HUD; on 'heavy industry' the piece flies back into its HUD slot and leaves the data centre on the sheet.
  const tp = A.dc - .1, pu = (t) => sineIO(span(t, t0, tp));
  const view = (t) => { const late = Math.max(0, t - t0); return { x: 960 + 8 * Math.sin(late * .21) * span(late, 0, 4), y: 540 + 5 * Math.sin(late * .17 + 1) * span(late, 0, 4), s: creep(t) }; };
  const discParts = (t) => F.kitParts(T, t).parts;
  const liftParts = (t) => discParts(t).map((p, i) => (i === 2 && t >= t0 && t < A.heavy + 1.5 ? { ...p, fade: 0 } : p));
  const kitBig = (ctx, t, v) => X.inView(ctx, v, () => F.kitDisc(ctx, t, D.x, D.y, D.r, liftParts(t), { glow: .8, stars: 0, loose: { x: D.x + D.r * 1.32, y: D.y + D.r * 1.06, rot: .35 } }));
  const PC1 = { x: 960, y: 560, r: 980 }, HP = F.pieceCentre(2, F.HUD.x, F.HUD.y, F.HUD.r);
  const pcLift = (t) => { const v = view(Math.min(t, tp)), u = pu(t), [px, py] = X.toScreen(v, P3[0], P3[1]), r0 = D.r * v.s;
    return { x: lerp(px, PC1.x, u), y: lerp(py, PC1.y, u), r: Math.exp(lerp(Math.log(r0), Math.log(PC1.r), u)) }; };
  const pcAt = (t) => { const p = pcLift(t), k = sineIO(span(t, A.heavy, A.heavy + 1.5)); if (k <= 0) return p;
    return { x: lerp(p.x, HP[0], k), y: lerp(p.y, HP[1], k), r: Math.exp(lerp(Math.log(p.r), Math.log(F.HUD.r), k)) }; };
  const dcScreen = (t) => { const p = pcLift(t), k = p.r / PC1.r; return { x: p.x, y: p.y - 75 * k, w: 440 * k }; };
  const LAY2 = { x: 400, y: 700, w: 330 }, LAY3 = { x: 300, y: 700, w: 230 };
  const MAP = { x: 1120, y: 482, k: 18 };
  const NORTH = B.geo(MAP, 19.3, 66.3), FRA = B.geo(MAP, 2.6, 47.0);
  const SLOTS = [NORTH, FRA, B.geo(MAP, 9.5, 51.2), B.geo(MAP, -3.8, 40.3), B.geo(MAP, 12.4, 43.2), B.geo(MAP, 25.2, 62.4), B.geo(MAP, 19.5, 52.1)];
  const SW = 46;   // block width on the map
  function dcAt(t, v) {   // where the (main) data centre is at t
    const s1 = dcScreen(t), k2 = sineIO(span(t, A.heavy, A.heavy + 1.7)), k3 = sineIO(span(t, A.notEv, A.notEv + 1.4)), k4 = sineIO(span(t, A.build - .1, A.build + 1.5));
    let x = lerp(s1.x, LAY2.x, k2), y = lerp(s1.y, LAY2.y, k2), w = lerp(s1.w, LAY2.w, k2);
    x = lerp(x, LAY3.x, k3); w = lerp(w, LAY3.w, k3);
    if (k4 > 0) { const p = B.arcPt([x, y], [NORTH[0], NORTH[1] + 8], 220, k4); x = p[0]; y = p[1]; w = lerp(w, SW, k4); }
    return { x, y, w };
  }

  // ---------------------------------------------------------------- the budget bar (5.06)
  const bs = SRC.budgetSrc.split(' · '), TOTAL = bs[0].split(':')[0], HALVES = bs[0].split(': ')[1].split(', '), MORE = bs[2].split(' EU MONEY')[0], BUDGET = SRC.clock[0];
  const BAR = { x: 360, y: 520, w: 1200, h: 64 };
  // window of the bid team (5.05) and its upload bar (the carrier into the budget bar)
  const WIN = { x: 1300, y: 330, w: 500, h: 310 }, SLOT_WIN = 2;
  const upFill = (t) => .12 + .78 * sineIO(span(t, A.deadline + .6, A.money - .1));
  const upBar = () => ({ x: WIN.x + WIN.w * .5 - 70, y: WIN.y + WIN.h * .46, w: 140, h: 10 });

  // ---------------------------------------------------------------- the 100 cells (5.07)
  const CELL = 40, PITCH = CELL * 1.22, GRID = { x: 960 - (10 * PITCH - CELL * .22) / 2, y: 236 }, KEEP = [63, 64, 65, 66, 67], SIXTH = 68;
  const cellPos = (i) => [GRID.x + (i % 10) * PITCH, GRID.y + Math.floor(i / 10) * PITCH];
  const DISC8 = { x: 700, y: 470, r: 210 }, P3b = F.pieceCentre(2, DISC8.x, DISC8.y, DISC8.r);

  // ---------------------------------------------------------------- the chips (5.09 ★)
  const MCH = { x: 960, y: 770, L: 600 }, STAGE = [MCH.x, MCH.y - MCH.L * .3 * .3];
  const CHIPS = (() => { const r = prng(69), out = [];
    for (let i = 0; i < 11; i++) { const q = Math.PI * (1.06 + i / 10 * .88), d = .92 + r() * .12; out.push([STAGE[0] + Math.cos(q) * 560 * d, STAGE[1] + Math.sin(q) * 300 * d, r()]); }
    for (let i = 0; i < 15; i++) { const q = Math.PI * (1.0 + i / 14 * 1.0), d = .93 + r() * .1; out.push([STAGE[0] + Math.cos(q) * 880 * d, STAGE[1] + Math.sin(q) * 430 * d - 10, r()]); }
    return out.filter(([x, y]) => y < 845 && y > 300 && x > 70 && x < 1850); })();

  function draw(ctx, t) {
    const v = view(t);
    X.sheet(ctx, t, v, { lx: 960, ly: lerp(D.y, 520, pu(t)) });

    // ---- the disc: big (plate → push), then it flies up into the HUD; HUD → disc again for the verdict; back up
    const kOut = 1 - span(t, t0 + .15, t0 + 1.9), kIn8 = span(t, A.half - 1.3, A.half + .3), kOut9 = 1 - span(t, A.doesnt, A.doesnt + 1.6);
    if (t < t0 + .15) kitBig(ctx, t, v);
    else if (t < A.half - 1.3) { const [cx, cy] = X.toScreen(v, D.x, D.y); B.hudDisc(ctx, t, T, kOut, { x: cx, y: cy, r: D.r * v.s }, { parts: liftParts(t) }); }
    if (t >= t0 && t < A.heavy + 1.5) { const p = pcAt(t); F.loosePiece(ctx, t, 2, p.x, p.y, p.r, { kind: 'blank', lit: 1 }); }
    else if (t < A.doesnt) B.hudDisc(ctx, t, T, kIn8, DISC8);
    else B.hudDisc(ctx, t, T, kOut9, DISC8);

    // ---- 5.01 the data centre in piece 3, its cables; 5.02–5.04 it moves on as a screen object
    const dc = dcAt(t, v);
    const dropK = expoIn(span(t, A.money - .1, A.money + 1.0)), dropY = dropK * 900;   // 5.06: the map layer falls away downwards
    ctx.save(); ctx.translate(0, dropY);
    const gl = span(t, A.dc - 1.0, A.dc + .2) * (1 - span(t, A.heavy + .2, A.heavy + 1.2));
    if (gl > 0) X.lightLine(ctx, [[dc.x - dc.w * .62, dc.y], [dc.x + dc.w * .62, dc.y]], gl, { a: .55, w: 2.5 });
    // cables: left (from the frame edge) stays until the data centre leaves for the map; right becomes the price bar's cable
    const lit = span(t, A.dc + .9, A.dc + 1.7), h = dc.w * .34;
    const cu = span(t, A.dc + .1, A.dc + 1.2) * (1 - span(t, A.build - .1, A.build + .9));
    if (cu > 0 && t < A.build + 1) B.cable(ctx, t, [[-30, dc.y - h * .9], [dc.x - dc.w * .5 - dc.w * .45, dc.y - h * .75], [dc.x - dc.w * .5, dc.y - h * .45]], cu, { w: Math.max(4, dc.w * .022), speed: 220 });
    const k2 = sineIO(span(t, A.heavy, A.heavy + 1.7)), EUB = { x: 1000, w: 150 }, USB = { x: 1250, w: 150 }, BY = LAY2.y;
    const ru = span(t, A.dc + .3, A.dc + 1.4) * (1 - span(t, A.notEv - .1, A.notEv + .8));
    if (ru > 0) {
      const p0 = B.lerpPt([1950, dc.y - h * 1.1], [EUB.x + EUB.w / 2, BY], k2), p1 = B.lerpPt([dc.x + dc.w * 1.1, dc.y - h * .8], [dc.x + dc.w * .5 + 60, BY - h * .25], k2);
      B.cable(ctx, t, [p0, p1, [dc.x + dc.w * .5, dc.y - h * .45]], ru, { w: Math.max(4, dc.w * .022), speed: 220 });
    }
    if (t < A.build + 1.6) dataCentre(ctx, t, dc, { lit, rise: span(t, A.dc - .9, A.dc + .3) });
    X.label(ctx, 'AI DATA CENTRES', 960, 200, lab(t, A.dc - .1, A.heavy), { size: 36, spacing: .14 });
    X.label(ctx, 'ENORMOUS AMOUNTS OF ELECTRICITY', 960, 256, lab(t, A.dc + .9, A.heavy), { size: 30, gold: .6, col: GOLD.text });
    // 5.02 the price bars rise out of the ground line (EU out of the cable's foot)
    const sink = expoIn(span(t, A.notEv - .1, A.notEv + .7));
    const euU = sineIO(span(t, A.eu - .2, A.eu + 1.2)) * (1 - sink), usU = sineIO(span(t, A.twice - .2, A.twice + 1.0)) * (1 - sink);
    const gl2 = span(t, A.heavy + .9, A.heavy + 1.9) * (1 - span(t, A.notEv + .2, A.notEv + 1.4));
    if (gl2 > 0) X.lightLine(ctx, [[EUB.x - 60, BY], [USB.x + USB.w + 60, BY]], gl2, { a: .5, w: 2.5 });
    if (euU > 0) priceBar(ctx, t, EUB.x, BY, EUB.w, 360 * euU, true);
    if (usU > 0) priceBar(ctx, t, USB.x, BY, USB.w, 164 * usU, false);
    const bl = lab(t, A.eu, A.notEv);
    X.label(ctx, 'EU', EUB.x + EUB.w / 2, BY + 46, bl * (euU > .05 ? 1 : 0), { size: 30, gold: .3 });
    X.label(ctx, 'US', USB.x + USB.w / 2, BY + 46, lab(t, A.twice, A.notEv), { size: 30, col: CREAM2 });
    X.big(ctx, SRC.power2x, 1200, 250, 64, lab(t, A.twice + .2, A.notEv), { gold: .25 });
    X.label(ctx, 'HEAVY INDUSTRY', 1200, 160, lab(t, A.heavy + .2, A.notEv), { size: 28, col: CREAM2 });
    F.source(ctx, t, A.eu, A.notEv + .3, SRC.power2xSrc);

    // ---- 5.03 the light map: the bars' ground line unspools into the coast lines; the north and France glow
    const cMap = span(t, A.notEv + .1, A.notEv + 1.9);
    if (cMap > 0) B.coast(ctx, MAP, cMap, { a: .5 });
    const gN = sineIO(span(t, A.sweden, A.sweden + .9)), gF = sineIO(span(t, A.france, A.france + .9));
    const br = (q) => .85 + .15 * Math.sin(t * 1.4 + q);
    if (gN > 0) { halo(ctx, NORTH[0], NORTH[1], 110 * gN, .55 * gN * br(0), GOLD.halo, GOLD.core); B.damGlyph(ctx, t, NORTH[0] + 4, NORTH[1] + 6, 14, gN); }
    if (gF > 0) { halo(ctx, FRA[0], FRA[1], 110 * gF, .55 * gF * br(2), GOLD.halo, GOLD.core); B.reactorGlyph(ctx, t, FRA[0] - 2, FRA[1] + 8, 14, gF); }
    const lN = lab(t, A.sweden + .2, A.seven), lF = lab(t, A.france + .2, A.seven);
    if (lN > 0) { X.lightLine(ctx, [[NORTH[0] - 22, NORTH[1] - 8], [NORTH[0] - 110, NORTH[1] - 40]], lN, { a: .6, w: 1.5 }); X.label(ctx, SRC.north, NORTH[0] - 120, NORTH[1] - 34, lN, { size: 26, align: 'right' }); }
    if (lF > 0) { X.lightLine(ctx, [[FRA[0] - 22, FRA[1] + 6], [FRA[0] - 110, FRA[1] + 46]], lF, { a: .6, w: 1.5 }); X.label(ctx, SRC.france, FRA[0] - 120, FRA[1] + 56, lF, { size: 26, align: 'right' }); }
    F.source(ctx, t, A.sweden + .2, A.france + .1, SRC.northSrc, { y: 880 + dropY });
    F.source(ctx, t, A.france + .2, A.idea + 1.2, SRC.franceSrc, { y: 880 + dropY });

    // ---- 5.04 the data centre splits: it flies onto the north, a clone onto France
    const k4 = sineIO(span(t, A.build - .1, A.build + 1.5));
    if (k4 > 0 && t < A.money + 1.2) {
      const base = dcAt(Math.min(t, A.build - .1), v), p = B.arcPt([base.x, base.y], [FRA[0], FRA[1] + 8], 140, k4);
      dataCentre(ctx, t, { x: p[0], y: p[1], w: lerp(base.w, SW, k4) }, { lit: 1 });
      if (t >= A.build + 1.6) dataCentre(ctx, t, { x: NORTH[0], y: NORTH[1] + 8, w: SW }, { lit: 1 });
    }
    X.label(ctx, 'WHERE THE POWER IS', 470, 440, lab(t, A.where - .1, A.seven), { size: 34, gold: .5 });
    // ---- 5.05 seven slots (five dashed ones clone out of the two blocks); one opens as a lit window: the bid team uploads at night
    const sev = span(t, A.seven + .1, A.seven + 1.4), winU = sineIO(span(t, A.deadline - .1, A.deadline + 1.3));
    for (let i = 2; i < 7; i++) {
      const q = clamp(sev * 1.6 - (i - 2) * .12); if (q <= 0) continue;
      const src = i % 2 ? FRA : NORTH, p = B.lerpPt(src, SLOTS[i], sineIO(q));
      if (i === SLOT_WIN && winU > 0) continue;
      dataCentre(ctx, t, { x: p[0], y: p[1] + 8, w: SW }, { dashed: true, u: q });
    }
    X.big(ctx, SRC.giga, 470, 380, 50, lab(t, A.seven + .2, A.money), { gold: .5 });
    F.source(ctx, t, A.seven + .5, A.money + .4, SRC.gigaSrc, { y: 880 + dropY });
    if (winU > 0) bidWindow(ctx, t, winU);
    X.dateTag(ctx, SRC.gigaDate, WIN.x + WIN.w / 2, WIN.y + WIN.h + 50, span(t, A.dec - .1, A.dec + .7) * (1 - span(t, A.money - .2, A.money + .2)));
    ctx.restore();

    // ---- 5.06 the upload bar stretches into the budget bar
    const kb = sineIO(span(t, A.money - .05, A.money + 1.5)), kc = span(t, A.even + .2, A.even + 2.0);
    if (kb > 0 && kc <= 0) {
      const ub = upBar(); const bx = lerp(ub.x, BAR.x, kb), by = lerp(ub.y + dropY * (1 - kb), BAR.y, kb), bw = lerp(ub.w, BAR.w, kb), bh = lerp(ub.h, BAR.h, kb);
      budgetBar(ctx, t, bx, by, bw, bh, kb, span(t, A.money + 1.3, A.money + 2.2), span(t, A.budget - .3, A.budget + .9));
    }
    X.label(ctx, TOTAL, 960, 420, lab(t, A.money + 1.0, A.even + .3), { size: 32 });
    X.label(ctx, HALVES[0], BAR.x + BAR.w / 4, BAR.y + BAR.h + 52, lab(t, A.money + 1.3, A.even + .3), { size: 24, col: CREAM2 });
    X.label(ctx, HALVES[1], BAR.x + BAR.w * .75, BAR.y + BAR.h + 52, lab(t, A.money + 1.4, A.even + .3), { size: 24, col: CREAM2 });
    X.big(ctx, SRC.budget, 960, 260, 56, lab(t, A.money + 1.6, A.even + .3), { gold: .9 });
    const bud = lab(t, A.budget - .1, A.even + .3);
    X.dateTag(ctx, BUDGET, BAR.x + BAR.w * .3, BAR.y - 44, bud);
    X.label(ctx, MORE, BAR.x + BAR.w * .3, BAR.y + BAR.h / 2 + 9, bud, { size: 24 });
    F.source(ctx, t, A.money + 1.2, A.even + .5, SRC.budgetSrc);

    // ---- 5.07 the bar breaks into the 100 cells (THE WORLD'S AI COMPUTING POWER): 5 gold, a sixth fills to .6
    const drop8 = span(t, A.half - 1.3, A.half - .3), fly8 = sineIO(span(t, A.half - 1.0, A.half + .2));
    if (kc > 0 && kc < 1) for (let i = 0; i < 100; i++) {
      const q = (i * 37) % 100 / 100, u = sineIO(clamp(kc * 1.5 - q * .5)), [gx, gy] = cellPos(i);
      const sx = BAR.x + (i + .5) * BAR.w / 100, x = lerp(sx, gx + CELL / 2, u), y = lerp(BAR.y + BAR.h / 2, gy + CELL / 2, u), w = lerp(BAR.w / 100 - 1, CELL, u), hh = lerp(BAR.h, CELL, u);
      const c0 = i < 10 ? GOLD.body : i >= 50 && i < 60 ? mixHex(CREAM, P.night1, .25) : mixHex(P.night0, CREAM, .22);
      ctx.fillStyle = rgba(mixHex(c0, COOL.body, u), .9); ctx.beginPath(); ctx.roundRect(x - w / 2, y - hh / 2, w, hh, Math.min(w, hh) * .18 * u); ctx.fill();
    }
    if (kc >= 1 && fly8 < 1) {
      X.cells(ctx, t, GRID.x, GRID.y, CELL, 10, 10, { keep: KEEP, on: 1, dim: span(t, A.five - .1, A.five + .7), drop: drop8, hideKeep: fly8 > 0, pulse: 0 });
      if (fly8 <= 0) sixth(ctx, t, ...cellPos(SIXTH), span(t, A.five - .1, A.five + .7), span(t, A.barely - .1, A.barely + 1.3));
    }
    if (fly8 > 0 && fly8 < 1) {   // the 5.6 gold cells fly into piece 3 of the disc (they become its light)
      const kk = [...KEEP, SIXTH];
      kk.forEach((i, j) => { const [gx, gy] = cellPos(i), x = lerp(gx + CELL / 2, P3b[0], fly8), y = lerp(gy + CELL / 2, P3b[1], fly8), s = lerp(CELL, 12, fly8) * (j === 5 ? .6 : 1);
        ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.roundRect(x - s / 2, y - s / 2, s, s, s * .2); ctx.fill(); });
      halo(ctx, lerp(GRID.x + PITCH * 5.5, P3b[0], fly8), lerp(GRID.y + PITCH * 6.5, P3b[1], fly8), 160, .4 * (1 - fly8 * .5), GOLD.halo, GOLD.core);
    }
    X.label(ctx, SRC.computeTitle, 960, 186, lab(t, A.even + 1.4, A.half - .9), { size: 28 });
    X.big(ctx, SRC.five2031, 960, 836, 84, lab(t, A.barely - .2, A.half - .9), { gold: 1 });
    F.source(ctx, t, A.tank, A.half - .6, SRC.five2031Src, { y: 880 });

    // ---- 5.08 HALFWAY · THE MOST COMPUTERS, struck through
    const vu = span(t, A.half + .3, A.half + 1.3) * (1 - span(t, A.doesnt - .1, A.doesnt + .4));
    if (vu > 0) F.verdict(ctx, t, DISC8.x, DISC8.y + DISC8.r + 90, F.KIT.parts[2].verdict, vu, { size: 32 });
    const mc = lab(t, A.settled + .2, A.doesnt + .3);
    X.big(ctx, SRC.firstRace, 1400, 480, 66, mc, { gold: 0 });
    const st = span(t, A.most + .2, A.most + .8) * (1 - span(t, A.doesnt - .2, A.doesnt + .2));
    if (st > 0) X.lightLine(ctx, [[1400 - 290, 462], [1400 + 290, 448]], st, { w: 5, col: rgba(CREAM, .95) });

    // ---- 5.09 ★ NEEDED, NOT BIGGEST · the machine rises out of its ground line; every chip in the world tied to it
    X.big(ctx, SRC.needed, 960, 236, 80, lab(t, A.needed - .1, A.end + 2), { gold: .85 });
    F.source(ctx, t, A.needed + .6, A.end + 2, SRC.neededSrc);
    const g9 = span(t, A.machine - .5, A.machine + .6);
    if (g9 > 0) { X.lightLine(ctx, [[MCH.x, MCH.y], [MCH.x - 760, MCH.y]], g9, { a: .5, w: 2.5 }); X.lightLine(ctx, [[MCH.x, MCH.y], [MCH.x + 760, MCH.y]], g9, { a: .5, w: 2.5 }); }
    const mr = span(t, A.machine - .1, A.machine + 1.3);
    if (mr > 0) {
      const hero = span(t, A.dep - .3, A.dep + 1.2), chipsU = span(t, A.chips - .5, A.chips + 1.4);
      if (hero > 0) halo(ctx, STAGE[0], STAGE[1], 520 * hero, .5 * hero * (.9 + .1 * Math.sin(t * 1.3)), GOLD.halo, GOLD.core);
      // the chip lines (behind the machine)
      CHIPS.forEach(([cx, cy, q], i) => {
        const u = sineIO(clamp(chipsU * 1.7 - q * .7)); if (u <= 0) return;
        const p = B.arcPt(STAGE, [cx, cy], 60 + q * 80, u);
        X.lightLine(ctx, [STAGE, p], 1, { col: rgba(GOLD.line, .3 + .35 * hero), w: 1.6 + hero, blur: 6 });
        if (hero > 0) { const d = ((t * .45 + q) % 1), bp = B.lerpPt(p, STAGE, d); halo(ctx, bp[0], bp[1], 14, .6 * hero * (1 - d * .4), GOLD.halo, GOLD.core); }
      });
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, MCH.y + 2); ctx.clip();
      F.chipMachine(ctx, t, MCH.x, MCH.y + (1 - expoOut(mr)) * MCH.L * .55, MCH.L, { glow: 1, beam: span(t, A.machine + 1.0, A.machine + 1.8) });
      ctx.restore();
      CHIPS.forEach(([cx, cy, q], i) => {
        const u = sineIO(clamp(chipsU * 1.7 - q * .7)); if (u <= 0) return;
        const p = B.arcPt(STAGE, [cx, cy], 60 + q * 80, u);
        B.chip(ctx, t, p[0], p[1], lerp(8, 30 + q * 8, u), { rot: (q - .5) * .4 * (1 - u) + (q - .5) * .08, seed: i });
      });
    }
    // the W into c07: the machine's light blooms warm into your lamp's glow (same place, c07 opens on it)
    { const e = span(t, R.b - 1.3, R.b) ** 1.6; if (e > 0) halo(ctx, 960, lerp(STAGE[1], 640, e), lerp(120, 620, e), .9 * e, LAMP.body, LAMP.core); }
  }
  function dataCentre(ctx, t, d, o) { B.dataCentre(ctx, t, d.x, d.y, d.w, o); }
  function priceBar(ctx, t, x, y, w, h, eu) {
    if (h <= 0) return;
    if (eu) halo(ctx, x + w / 2, y - h, w * 1.6, .32, GOLD.halo, GOLD.core);
    ctx.fillStyle = eu ? E.lin(ctx, x, y - h, x, y, [[0, mixHex(CREAM, GOLD.hot, .35)], [1, mixHex(LAMP.body, GOLD.mid, .4)]]) : rgba(mixHex(COOL.body, P.night1, .45), .9);
    ctx.beginPath(); ctx.roundRect(x, y - h, w, h, [6, 6, 0, 0]); ctx.fill();
    ctx.strokeStyle = rgba(eu ? GOLD.line : COOL.line, .7); ctx.lineWidth = 2; ctx.stroke();
  }
  function budgetBar(ctx, t, x, y, w, h, u, goldU, dashU) {
    ctx.save();
    ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = rgba(CREAM, .45 * u + .3); ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
    // the upload bar's fill (cool) = the first part; it turns into the committed segments (EU gold, national cream)
    const seg = w / 10;
    ctx.fillStyle = mixHex(COOL.body, GOLD.body, goldU); ctx.fillRect(x, y, w * lerp(upFill(t), .1, sineIO(u)), h);
    if (goldU > 0) { halo(ctx, x + seg / 2, y + h / 2, seg * 1.6 * goldU, .45 * goldU, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(mixHex(CREAM, P.night1, .25), .85 * goldU); ctx.fillRect(x + w / 2, y, seg, h); }
    // the 4 billion that depend on the next budget: a dashed box (cream = on paper)
    if (dashU > 0) { ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 10; ctx.strokeStyle = rgba(CREAM, .9 * dashU); ctx.lineWidth = 2.5; ctx.strokeRect(x + seg + 6, y + 6, (w / 2 - seg - 12) * expoOut(dashU), h - 12); ctx.setLineDash([]); }
    ctx.strokeStyle = rgba(CREAM, .55 * u); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + w / 2, y - 10 * u); ctx.lineTo(x + w / 2, y + h + 10 * u); ctx.stroke();
    ctx.restore();
  }
  function sixth(ctx, t, x, y, a, f) {   // the sixth cell: an outline that fills 60 % with gold (5 % → ≈ 5.6 %)
    if (a <= 0) return;
    ctx.save(); ctx.strokeStyle = rgba(GOLD.line, .6 * a); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x + 1, y + 1, CELL - 2, CELL - 2, CELL * .18); ctx.stroke();
    if (f > 0) { const hh = CELL * .6 * sineIO(f); ctx.beginPath(); ctx.roundRect(x, y, CELL, CELL, CELL * .18); ctx.clip(); ctx.fillStyle = GOLD.hot; ctx.fillRect(x, y + CELL - hh, CELL, hh); }
    ctx.restore();
  }
  function bidWindow(ctx, t, u) {   // a lit window at night: two people at a cool screen, an upload bar fills (the bids)
    const from = SLOTS[SLOT_WIN], k = u;
    const x = lerp(from[0] - SW / 2, WIN.x, k), y = lerp(from[1] + 8 - SW * .34, WIN.y, k), w = lerp(SW, WIN.w, k), h = lerp(SW * .34, WIN.h, k);
    ctx.save();
    halo(ctx, x + w / 2, y + h / 2, w * .9, .25 * k, LAMP.deep, LAMP.core);
    ctx.fillStyle = mixHex(P.night1, LAMP.deep, .45); ctx.fillRect(x, y, w, h);
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (k > .5) {
      const a = span(k, .5, 1), sx = WIN.x + WIN.w / 2 - (WIN.x - x), fy = y + h * .82;
      ctx.globalAlpha *= a;
      ctx.fillStyle = mixHex(P.night0, P.blue1, .3); ctx.fillRect(x, fy, w, 8);
      halo(ctx, x + w * .5, y + h * .45, w * .5, .35, COOL.halo, COOL.core);
      ctx.fillStyle = mixHex(P.night0, P.blue2, .5); ctx.fillRect(x + w * .5 - 90, y + h * .3, 180, 100);
      ctx.fillStyle = COOL.deep; ctx.fillRect(x + w * .5 - 84, y + h * .3 + 6, 168, 88);
      const ub = upBar(); ctx.fillStyle = rgba(CREAM, .35); ctx.fillRect(ub.x, ub.y, ub.w, ub.h);
      ctx.fillStyle = COOL.body; ctx.fillRect(ub.x, ub.y, ub.w * upFill(t), ub.h);
      E.person(ctx, x + w * .27, fy, 150, { dir: 1, light: .5, look: .2 + .1 * Math.sin(t * .7), armR: [.9, 1.6] });
      E.person(ctx, x + w * .76, fy, 140, { dir: -1, light: .5, look: .1, armR: [.5, 1.2], long: true });
    }
    ctx.restore();
    ctx.strokeStyle = rgba(LAMP.body, .6); ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  const marks = [A.dc, A.heavy, A.notEv, A.idea, A.seven, A.money, A.even, A.half, A.doesnt];
  return [{ t: R.a, draw: (ctx, t) => S.plateEnergy(ctx, t, T), print: PR }, { t: t0, draw, print: PR }, ...marks.map((t) => ({ t, draw, print: PR }))];
};
