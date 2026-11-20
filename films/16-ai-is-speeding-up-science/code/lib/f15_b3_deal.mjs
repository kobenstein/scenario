// Film 15 · B3 · c12 (380.30 – 433.36) · THE DEAL. One explainer night, one gold line through the whole chunk:
// the shot from plateShot clones into a row of copies on a line ($40), the licence slip lights six producers, the price is clamped,
// the line becomes an honest timeline (more than a year), the HIV pieces sink and the same line becomes the path of an AI medicine:
// test gates, the approval gate, a contract pinned BEFORE it, three hands sign, the medicine passes, grows, and the long queue of
// countries behind it bends into a circle round it. Hand-off to c13: the circle sinks and becomes the pool of your street lamp.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f15_kit.mjs';
import { SHOT } from './f15_seams.mjs';
import { card, project, bracket, gate, contract, inkHand } from './f15_b3_base.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, drift, halo, lin, rad, dust, F0 } = E;

export const LY = 600;                         // the gold line
export const OX = 1060;                        // the first shot (and later the approval gate) stands here
const LEN = 320, FOOT = .5344;                 // vertical syringe: plunger end = centre + FOOT * len
export const MED = { x: 1700, y: 470, w: 300 }; // the first approved medicine (hero of 12.06)
const CXk = (k) => OX + 150 * k;               // copy k = 1..6 in the row
const X27 = (k) => 2330 + 66 * (k - 1);        // the copies arrive in 2027
const GATES = [{ x: 160, w: 104, h: 176 }, { x: 440, w: 104, h: 176 }, { x: OX, w: 176, h: 300 }];
const CARD = { x: 650, y: 268, w: 300, h: 252, post: 800 };
const NQ = 40; export const R0 = 300;                        // the queue of countries, the circle radius
const cub = (p0, p1, p2, p3, u) => { const v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]; };

export function makeDeal(a) {
  const t0 = a.T0 + .5;
  // ---------------------------------------------------------------- timing derived once
  const slipX = (t) => lerp(OX + 70, 2010, sineIO(span(t, a.licensed + .2, a.producers + .35)));
  const tPass = []; for (let k = 1; k <= 6; k++) { let tt = a.licensed; while (tt < a.producers + 2 && slipX(tt) < CXk(k)) tt += 1 / 120; tPass[k] = tt; }
  const capX = (t) => {   // the AI capsule along the line
    if (t < a.medicines + .6) return lerp(-560, 20, sineIO(span(t, a.deal + .9, a.medicines + .6)));
    if (t < a.picture - .1) return lerp(20, 560, sineIO(span(t, a.artif + .7, a.license - .2)));
    return lerp(560, MED.x, sineIO(span(t, a.picture - .1, a.medicine + 1.5)));
  };
  const capPass = GATES.map((g) => { let tt = a.deal; while (tt < a.medicine + 2 && capX(tt) < g.x) tt += 1 / 120; return tt; });
  // signature: a gold flourish under the first shot, later carried to the bottom of the contract
  const SIG = E.catmull([[-92, 6, 2.6], [-70, -18, 2.6], [-58, 10, 2.6], [-40, -10, 2.6], [-20, 12, 2.6], [-4, -16, 2.6], [10, 8, 2.6], [30, -8, 2.6], [52, 10, 2.6], [70, -4, 2.6], [96, 2, 2.6]], 8);
  const sigOff = (t) => {   // where the signature sits (its centre): under DEC 2025, then carried to the contract's foot
    const u = sineIO(span(t, a.same - .1, a.medicines - .2));
    const p0 = [OX, 724], p3 = [CARD.x + CARD.w / 2, CARD.y + CARD.h - 22];
    return cub(p0, [OX - 60, 560], [p3[0] + 220, p3[1] - 260], p3, u);
  };
  // the queue → circle
  const Q = Array.from({ length: NQ }, (_, i) => {
    const qx = MED.x - 230 - 46 * i, qy = LY - 9 - 3 * Math.sin(i * .9);
    const th = Math.PI + 2 * Math.PI * (i / NQ) * .985, tx = MED.x + Math.cos(th) * R0, ty = MED.y + Math.sin(th) * R0 * .98;
    const d = Math.hypot(tx - qx, ty - qy), s0 = a.back - .25 + (NQ - 1 - i) * .022, dur = .85 + .55 * d / 2000;
    return { qx, qy, tx, ty, s0, dur, born: a.poorer - .25 + .028 * i, warm0: i < 5 ? 1 : 0, ctrl: [(qx + tx) / 2, Math.min(qy, ty) - 160 - 2.5 * i] };
  });
  const circ = []; for (let k = 0; k <= 120; k++) { const th = Math.PI + 2 * Math.PI * k / 120; circ.push([MED.x + Math.cos(th) * R0, MED.y + Math.sin(th) * R0 * .98, 1.6]); }
  const LINE = []; for (let x = -900; x <= 3300; x += 20) LINE.push([x, LY, 2.2]);
  const lineU = (x) => (x + 900) / 4200;

  // ---------------------------------------------------------------- camera (frame centre u, v on the focus card, scale s)
  const K = [
    [t0, 960, 540, 1],
    [a.copies + 1.5, 1236, 530, 1.0],
    [a.year + .2, 1246, 534, 1.02],
    [a.advance + .6, 1258, 542, 1.055],
    [a.cheap - .25, 1262, 544, 1.06],
    [a.year2 + .35, 1720, 560, .92, 'q'],
    [a.worked - .1, 1712, 564, .935],
    [a.agreed + .4, 1340, 600, 1.0],
    [a.same - .1, 1320, 598, 1.01],
    [a.medicines + .4, 760, 470, 1.0, 'q'],
    [a.approval, 785, 452, 1.08],
    [a.drug - .5, 790, 446, 1.1],
    [a.governments + .1, 812, 432, 1.52],
    [a.lose + .6, 806, 434, 1.6],
    [a.early + .3, 900, 456, 1.12],
    [a.picture, 905, 458, 1.1],
    [a.medicine + 1.4, 1500, 470, 1.0, 'q'],
    [a.back - .5, 1490, 476, .96],
    [a.line + 1.2, 1500, 474, .95],
    [a.everyone + .6, 1510, 470, .97],
  ];

  // ---------------------------------------------------------------- the pieces
  function background(ctx, c, t) {
    card(ctx, c, 40000, () => {
      ctx.fillStyle = P.night0; ctx.fillRect(-3000, -3000, 12000, 9000);
      ctx.fillStyle = rad(ctx, 1000, 560, 1300, [[0, P.ind1], [.5, P.ind0], [1, P.night0]]); ctx.fillRect(-3000, -3000, 12000, 9000);
      E.stars(ctx, 1512, 140, t, [-900, -700, 4200, 1500], .55 * smooth(span(t, t0 + 2, t0 + 14)));
    });
  }
  const sigTrail = (t) => { const [ox, oy] = sigOff(t); return SIG.map(([x, y, w]) => [ox + x, oy + y, w]); };

  function lifts(ctx, c, t) {
    // warm lifts under the heroes (light, not bodies): the row, the gate, the medicine
    card(ctx, c, 6000, () => {
      const k1 = smooth(span(t, t0, t0 + 3.5)) * (1 - smooth(span(t, a.same, a.medicines))), k2 = smooth(span(t, a.picture, a.medicine + 1));
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rad(ctx, 1400, 450, 1100, [[0, rgba(P.blue0, .22 * k1)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(0, -800, 3000, 2400);
      ctx.fillStyle = rad(ctx, 2100, 470, 1100, [[0, rgba(P.blue0, .26 * k2)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(800, -800, 3000, 2400);
      ctx.restore();
    });
  }
  function draw(ctx, t, c) {
    background(ctx, c, t);
    lifts(ctx, c, t);
    card(ctx, c, F0, () => focus(ctx, t));
  }

  function focus(ctx, t, hero = true) {
    // ---------- 12.01 the shot arrives, turns upright and lands on the line; the plate's trail runs into it
    const uRot = sineIO(span(t, a.cheaper - .35, a.copies + .45));
    const yPlate = SHOT.y + 4 * drift(t, 1, 3);
    const len = Math.exp(lerp(Math.log(SHOT.len), Math.log(LEN), uRot));
    const sx = lerp(SHOT.x, OX, uRot), sy = lerp(yPlate, LY - FOOT * LEN, uRot) - 26 * Math.sin(Math.PI * uRot);
    const rot = lerp(.004 * drift(t * .6, 1, 7), -Math.PI / 2, uRot);
    const plunger = [sx - Math.cos(rot) * len * .52, sy - Math.sin(rot) * len * .52];
    // HIV pieces sink (12.04): the shot sinks into the line where the approval gate then rises
    const sinkO = expoIn(span(t, a.deal - .1, a.deal + .55));
    const sinkC = expoIn(span(t, a.same - .25, a.same + .45));
    // the plate trail (exact copy of plateShot until it starts to retract)
    const uTail = sineIO(span(t, t0, a.cheaper - .15));
    if (uTail < 1) {
      const x0 = SHOT.x - SHOT.len * .52, y = yPlate;
      const P0 = [0, y + 26], P1 = [x0 * .45, y + 30], P2 = [x0 * .8, y + 4], P3 = uRot > 0 ? plunger : [x0, y];
      ctx.save(); ctx.lineCap = 'round';
      ctx.strokeStyle = lin(ctx, 0, 0, x0, 0, [[0, rgba(P.halo1, 0)], [.6, rgba(P.halo1, .45)], [1, rgba(P.core1, .95)]]); ctx.lineWidth = 2.4;
      ctx.beginPath();
      if (uTail <= 0 && uRot <= 0) { ctx.moveTo(P0[0], P0[1]); ctx.bezierCurveTo(P1[0], P1[1], P2[0], P2[1], P3[0], P3[1]); }
      else { for (let k = 0; k <= 40; k++) { const p = cub(P0, P1, P2, P3, lerp(uTail, 1, k / 40)); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } }
      ctx.stroke(); ctx.restore();
    }
    const dA = 1 - smooth(span(t, t0 + .3, a.copies + 1.5));
    if (dA > 0) dust(ctx, 380, 300, (SHOT.x - SHOT.len * .52) * .55, yPlate + 20, (SHOT.x - SHOT.len * .52) * .45, 50, t, .5 * dA, P.halo0);

    // ---------- the line: grows from the foot of the shot to both sides, later on to the left (path) and right (2027)
    let xa = OX, xb = OX;
    const uL = sineIO(span(t, a.copies - .15, a.copies + 1.15));
    xa = lerp(OX, 470, uL); xb = lerp(OX, 2060, uL);
    xb = lerp(xb, 3060, sineIO(span(t, a.cheap - .1, a.arrive + .7)));
    xa = lerp(xa, -900, sineIO(span(t, a.deal - .2, a.medicines + .2)));
    xb = lerp(xb, 3300, sineIO(span(t, a.picture, a.medicine + 1)));
    if (xb > xa + 1) F.trailSpan(ctx, LINE, lineU(xa), lineU(xb), { w: 2.1, spark: t < a.copies + 1.15 });
    // the honest gap (12.03): the stretch between the first shots and the copies turns cool
    const uGap = sineIO(span(t, a.year2 - .35, a.year2 + .6)) * (1 - sineIO(span(t, a.picture + .3, a.medicine + .8)));
    if (uGap > 0) {
      const gm = 1700, g0 = lerp(gm, OX + 60, uGap), g1 = lerp(gm, X27(1) - 50, uGap);
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(F.COOL, .95); ctx.lineWidth = 3.4; ctx.setLineDash([2, 11]);
      ctx.fillStyle = P.night1; ctx.fillRect(g0, LY - 4, g1 - g0, 8);
      ctx.beginPath(); ctx.moveTo(g0, LY); ctx.lineTo(g1, LY); ctx.stroke(); ctx.restore();
    }

    // ---------- 12.02 the producers: a low facade under the row, six windows light as the licence passes
    const uFac = expoOut(span(t, a.maker - .35, a.maker + .55)), sinkF = expoIn(span(t, a.perfect - .45, a.perfect + .35));
    if (uFac > 0 && sinkF < 1) {
      const top = LY + 3, hF = 190;
      ctx.save(); ctx.beginPath(); ctx.rect(980, top, 1080, hF * uFac); ctx.clip(); ctx.translate(0, sinkF * hF);
      ctx.fillStyle = lin(ctx, 0, top, 0, top + hF, [[0, mixHex(P.ind2, P.blue1, .25)], [.25, P.ind2], [1, P.night1]]); ctx.fillRect(990, top, 1060, hF);
      ctx.fillStyle = rgba(P.blue0, .8); ctx.fillRect(990, top, 2, hF); ctx.fillRect(2048, top, 2, hF);
      // the maker's door (lit from the start: it makes the first shots)
      const dr = new Path2D(); dr.roundRect(OX - 34, top + 46, 68, hF - 46, [30, 30, 0, 0]);
      ctx.fillStyle = lin(ctx, 0, top + 46, 0, top + hF, [[0, P.core1], [.5, P.halo0], [1, P.halo1]]); ctx.fill(dr);
      for (let k = 1; k <= 6; k++) {
        const L = expoOut(span(t, tPass[k] + .04, tPass[k] + .55)), x = CXk(k) - 44, y = top + 52, w = 88, h = 74;
        ctx.fillStyle = P.night0; ctx.fillRect(x, y, w, h);
        if (L > 0) { ctx.fillStyle = rad(ctx, x + w / 2, y + h * .7, w * .9, [[0, rgba(P.core0, L)], [.4, rgba(P.core1, .95 * L)], [1, rgba(P.halo1, .8 * L)]]); ctx.fillRect(x, y, w, h); }
        ctx.strokeStyle = rgba(L > .3 ? P.halo0 : P.blue0, .8); ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = rgba(P.night1, .9); ctx.fillRect(x + w / 2 - 1.5, y, 3, h);
      }
      ctx.restore();
      if (sinkF < 1) for (let k = 1; k <= 6; k++) { const L = expoOut(span(t, tPass[k] + .04, tPass[k] + .55)) * (1 - sinkF); if (L > 0) halo(ctx, CXk(k), LY + 92 + sinkF * 190, 120, .22 * L, P.halo1, P.core1); }
      halo(ctx, OX, LY + 120 + sinkF * 190, 140 * uFac, .28 * (1 - sinkF), P.halo1, P.core1);
    }

    // ---------- the copies (behind the first shot) — cool until the licence reaches their producer
    for (let k = 6; k >= 1; k--) {
      const s0 = a.copies - .08 + .06 * (k - 1), dx = expoOut(span(t, s0, s0 + .5 + .1 * k));
      if (dx <= 0) continue;
      const mv = sineIO(span(t, a.cheap + .1 + .07 * (6 - k), a.cheap + .1 + .07 * (6 - k) + 1.55));
      const x = lerp(lerp(OX, CXk(k), dx), X27(k), mv), fill = .05 + .75 * expoOut(span(t, tPass[k] + .1, tPass[k] + .9));
      const sk = sinkC;
      ctx.save(); if (sk > 0) { ctx.beginPath(); ctx.rect(-2000, -2000, 8000, 2000 + LY - 1); ctx.clip(); ctx.translate(0, sk * (LEN * 1.1)); }
      F.syringe(ctx, x, LY - FOOT * LEN - 2 * Math.sin(t * 1.1 + k), LEN, t, { rot: -Math.PI / 2 + .006 * Math.sin(t * .7 + k * 1.3), fill, glow: .55 + .45 * fill });
      ctx.restore();
    }
    // ---------- the first shot
    {
      ctx.save(); if (sinkO > 0) { ctx.beginPath(); ctx.rect(-2000, -2000, 8000, 2000 + LY - 1); ctx.clip(); ctx.translate(0, sinkO * LEN * 1.1); }
      F.syringe(ctx, sx, sy - (uRot >= 1 ? 2 * Math.sin(t * 1.1) : 0), len, t, { fill: .8, rot });
      ctx.restore();
      if (uRot > .6 && sinkO < 1) halo(ctx, sx, LY - 4, 90, .35 * smooth(span(uRot, .6, 1)) * (1 - sinkO), P.halo1, P.core1);
    }

    // ---------- $40 · per person, per year · from 2027 (rises from the line, left of the row); the clamp on "locked"
    const uN = span(t, a.forty - .12, a.forty + 1.0), sinkN = span(t, a.perfect - .35, a.perfect + .45);
    if (uN > 0 && sinkN < 1) {
      const RX = 930, ns = 150, nw = F.measure('$40', ns), lw = F.measure('PER PERSON, PER YEAR', 34, false), sw = F.measure('FROM 2027 · REUTERS 2025', 24, false);
      const k = 1 - sinkN;
      F.maskLine(ctx, [['$40', smooth(span(t, a.locked, a.locked + .5)) * .6]], RX - nw, LY - 6, ns, Math.min(span(uN, 0, .55), k));
      F.maskLine(ctx, [['PER PERSON, PER YEAR', 0]], RX - lw, LY + 56, 34, Math.min(span(uN, .25, .8), k), { serif: false, col: P.cream, glow: false, weight: 600 });
      F.maskLine(ctx, [['FROM 2027 · REUTERS 2025', 0]], RX - sw, LY + 100, 24, Math.min(span(uN, .45, 1), k), { serif: false, col: P.halo2, glow: false, weight: 600 });
      const uB = expoOut(span(t, a.locked - .38, a.locked + .02)) * (1 - expoIn(span(t, a.perfect - .45, a.perfect + .1)));
      if (uB > 0) {
        const xl = RX - nw - 24 - 60 * (1 - uB), xr = RX + 20 + 60 * (1 - uB), y0 = LY - 128, y1 = LY - 14 + (1 - uB) * 0;
        const arm = 26 * uB, ym = (y0 + y1) / 2, hh = (y1 - y0) / 2 * (.4 + .6 * uB);
        bracket(ctx, xl, ym - hh, ym + hh, -1, arm, t); bracket(ctx, xr, ym - hh, ym + hh, 1, arm, t);
        const flash = Math.sin(Math.PI * span(t, a.locked - .02, a.locked + .4));
        if (flash > 0) halo(ctx, RX - nw / 2, ym, 220, .35 * flash, P.halo1, P.core0);
      }
    }
    // ---------- the licence slip: unfolds at the maker's foot, rides the roof line, lights each producer
    const uS = span(t, a.licensed - .35, a.licensed + .25), sinkS = expoIn(span(t, a.perfect - .45, a.perfect + .2));
    if (uS > 0 && sinkS < 1) {
      ctx.save(); ctx.beginPath(); ctx.rect(-2000, LY + 2, 8000, 400); ctx.clip();
      F.paperLabel(ctx, 'LICENSE', slipX(t), LY + 26 + sinkS * 60, { size: 22, u: uS, lit: .4 });
      ctx.restore();
    }

    // ---------- 12.03 the timeline labels; the signature of the maker
    const sinkT = span(t, a.same - .3, a.same + .5);
    const uY27 = span(t, a.arrive + .45, a.arrive + 1.2) * (1 - sinkT), uGapL = span(t, a.year2 - .05, a.year2 + .85) * (1 - sinkT), uDec = span(t, a.shots - .3, a.shots + .5) * (1 - sinkT);
    if (uY27 > 0) F.maskLine(ctx, [['2027', 0]], X27(3.5), LY + 64, 44, uY27, { align: 'center' });
    if (uGapL > 0) F.maskLine(ctx, [['MORE THAN A YEAR', 0]], 1700, LY - 34, 36, uGapL, { serif: false, align: 'center', col: P.cream, glow: false, weight: 600 });
    if (uDec > 0) F.maskLine(ctx, [['DEC 2025', 0]], OX, LY + 64, 44, uDec, { align: 'center' });
    const uSig = sineIO(span(t, a.agreed - .55, a.agreed + .35));
    const uAg = span(t, a.agreed - .15, a.agreed + .75) * (1 - span(t, a.same - .3, a.same + .4));
    if (uAg > 0) F.maskLine(ctx, [['THE MAKER AGREED', 0]], OX, 806, 32, uAg, { serif: false, align: 'center', col: P.halo2, glow: false, weight: 600 });

    // ---------- 12.04 the path of an AI medicine: gates rise from the line, the capsule, the machine's ring, the contract
    const gGrow = [sineIO(span(t, a.deal + .25, a.deal + 1.05)), sineIO(span(t, a.deal + .45, a.deal + 1.25)), sineIO(span(t, a.deal + .05, a.deal + 1.0))];
    GATES.forEach((g, i) => {
      if (gGrow[i] <= 0) return;
      const lit = expoOut(span(t, capPass[i] + .04, capPass[i] + .5));
      gate(ctx, g.x, LY - 1, g.w, g.h, t, { grow: gGrow[i], lit, th: i === 2 ? 9 : 7 });
      if (i === 2 && lit > 0) halo(ctx, g.x, LY - g.h * .45, g.h * .9, .3 * lit * (1 - .5 * span(t, a.medicine, a.medicine + 2)), P.halo1, P.core1);
    });
    const uAp = span(t, a.before - .1, a.before + .8);
    if (uAp > 0) F.maskLine(ctx, [['APPROVAL', 0]], OX, LY - GATES[2].h - 34, 32, uAp, { serif: false, align: 'center', col: P.cream, glow: false, weight: 600 });

    // contract (unfolds from the carried signature), pinned on a post before the approval gate
    const uC = span(t, a.medicines - .25, a.medicines + .55);
    const lic = span(t, a.license - .1, a.license + .55), pri = span(t, a.price - .1, a.price + .45);
    const sig = [0, 1, 2].map((i) => sineIO(span(t, a.sign - .25 + .3 * i, a.sign + .35 + .3 * i)));
    const agreeHi = smooth(span(t, a.agree - .3, a.early + .3)) * (1 - .4 * span(t, a.medicine, a.medicine + 2)) + .6 * Math.sin(Math.PI * span(t, a.signed - .4, a.signed + .9));
    if (uC > 0) {
      const pin = expoOut(span(t, a.agreed2 - .2, a.agreed2 + .3));
      // the post: a fine gold stem from the line to the card
      ctx.save(); ctx.strokeStyle = rgba(P.halo0, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(CARD.post, LY - 1); ctx.lineTo(CARD.post, lerp(LY - 1, CARD.y + CARD.h, expoOut(uC))); ctx.stroke(); ctx.restore();
      contract(ctx, CARD.x, CARD.y, CARD.w, CARD.h, t, {
        u: uC, glow: 1 + .5 * agreeHi,
        scribble: [{ y: 104, u: span(uC, .5, 1), w: .9 }, { y: 120, u: span(uC, .6, 1), w: .7 }, { y: 162, u: span(uC, .6, 1), w: .85 }],
        lines: [{ s: 'LICENSE', y: 72, u: lic, size: 30 }, { s: 'PRICE', y: 152, u: pri, size: 30 }],
      });
      if (uC >= 1) {
        // three signature slots, signed on "sign"
        for (let i = 0; i < 3; i++) {
          const x0 = CARD.x + 26 + i * 88, y0 = CARD.y + CARD.h - 42;
          ctx.strokeStyle = rgba(P.shade0, .7); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0 + 12); ctx.lineTo(x0 + 72, y0 + 12); ctx.stroke();
          if (sig[i] > 0) {
            const pts = SIG.map(([x, y]) => [x0 + 36 + x * .34, y0 + y * .5]);
            F.inkLine(ctx, pts, sig[i], { amp: 1.2, lw: 2.2, col: mixHex(F.INK, P.shade0, .2 * agreeHi) });
          }
        }
        if (agreeHi > 0) halo(ctx, CARD.x + CARD.w / 2, CARD.y + CARD.h - 40, 200, .22 * agreeHi, P.halo1, P.core1);
      }
      if (pin > 0) { E.halo(ctx, CARD.post, CARD.y + 14, 40, .6 * pin, P.halo1, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(CARD.post, CARD.y + 14, 6 * pin, 0, 6.29); ctx.fill(); }
    }
    // the signature: written under the first shot, then carried along an arc to the foot of the contract (the paper unfolds from it)
    if (uSig > 0 && uC < .35) {
      const tr = sigTrail(t), fade = span(uC, 0, .35);
      F.trailSpan(ctx, tr, 0, uSig, { w: 2.4 * (1 - fade), spark: uSig < 1 || (t > a.same && t < a.medicines) });
    }

    // the three hands (indigo, from three sides): they arrive on their word, sign on "sign", withdraw on "lose"
    for (let i = 0; i < 3; i++) {
      const at = [a.drug, a.governments, a.funders2][i], inU = sineIO(span(t, at - .7, at + .15)), outU = sineIO(span(t, a.nobody - .1, a.lose + .5 + .12 * i));
      const k = inU * (1 - outU); if (k <= 0) continue;
      const x0 = CARD.x + 26 + i * 88 + 36, y0 = CARD.y + CARD.h - 42, sg = sig[i];
      const head = sg > 0 && sg < 1 ? SIG[Math.min(SIG.length - 1, Math.floor(sg * (SIG.length - 1)))] : SIG[sg >= 1 ? SIG.length - 1 : 0];
      const tip = [x0 + head[0] * .34, y0 + head[1] * .5];
      const from = [[-420, 260], [10, 460], [440, 280]][i], ang = [-.55, -Math.PI / 2 - .1, Math.PI + .55][i], flip = [1, 1, -1][i];
      const L = 58, off = E.handTip({ pose: 'point' }, 0);
      // place the wrist so that the index tip sits on the pen point
      const ca = Math.cos(ang), sa = Math.sin(ang), wx = tip[0] - (ca * off[0] * L - sa * off[1] * L * flip), wy = tip[1] - (sa * off[0] * L + ca * off[1] * L * flip);
      const px = lerp(wx + from[0], wx, k), py = lerp(wy + from[1], wy, k);
      inkHand(ctx, px, py, ang, L, { pose: 'point', flip, ext: 9, rimDir: [[.5, -1], [0, -1], [-.5, -1]][i] });
    }

    // the capsule (a medicine found with artificial intelligence), the machine's ring locks on it
    const cx = capX(t);
    if (cx > -700 && hero) {
      const grow = sineIO(span(cx, OX + 80, MED.x)), w = Math.exp(lerp(Math.log(108), Math.log(MED.w), grow));
      const y = lerp(LY - 108 * .21 - 4, MED.y, sineIO(span(cx, OX + 60, MED.x))) - 2 * Math.sin(t * 1.3) * grow;
      const lit = [1, lerp(.2, 1, smooth(span(cx, OX - 10, OX + 120)))];
      F.pill(ctx, cx, y, w, t, { lit, rot: lerp(0, -.08, grow) + .01 * Math.sin(t * .8) * grow, dust: grow > .5 ? 900 : 0 });
      if (grow > 0) halo(ctx, cx, y, w * 1.6, .3 * grow, P.halo1, P.core1);
      const uR = span(t, a.discovered - .45, a.artif + .1), rOut = expoIn(span(t, a.artif + .7, a.artif + 1.3));
      if (uR > 0 && rOut < 1) {
        const lock = expoOut(span(t, a.artif - .05, a.artif + .45));
        const yy = lerp(y - 520, y, sineIO(span(uR, 0, .85))) - rOut * 700, rr = lerp(150, 58, sineIO(uR));
        F.reticle(ctx, cx, yy, rr, t, { lock, rot: .3 });
      }
    }

    // ---------- 12.06 the queue of countries → the circle round the medicine
    if (!hero) return;
    const ringLine = sineIO(span(t, a.everyone - .2, a.pay + .3));
    if (ringLine > 0) F.trailSpan(ctx, circ, 0, ringLine, { w: 1.5, spark: ringLine < 1, a: .8 });
    for (let i = 0; i < NQ; i++) {
      const q = Q[i], b = expoOut(span(t, q.born, q.born + .45)); if (b <= 0) continue;
      const u = span(t, q.s0, q.s0 + q.dur), e = quartIO(u);
      const p = u <= 0 ? [q.qx, q.qy] : (() => { const v = 1 - e; return [v * v * q.qx + 2 * v * e * q.ctrl[0] + e * e * q.tx, v * v * q.qy + 2 * v * e * q.ctrl[1] + e * e * q.ty]; })();
      const warm = Math.max(q.warm0, smooth(span(u, .7, 1)));
      const r = 7.5 * b * (1 + .06 * Math.sin(t * 2 + i));
      if (warm > .05) halo(ctx, p[0], p[1], 46 * b, .45 * warm * b, P.halo1, P.core1);
      ctx.fillStyle = mixHex(F.COOL, P.core1, warm); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 6.29); ctx.fill();
    }
  }

  return { draw, background, lifts, K, focus };
}
