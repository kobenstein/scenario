// Film 16 · B3 · world B: the explainer night (c09 9.03 end → c10 → the start of 10.06). One stage on the focus card:
//   the page of light (the room's sheet, flown into) · the money quote, the open problem, the critic, the polish (c09)
//   the second document rising out of a beam · both documents open into character (compass) vs chain of command · the beam
//   tilts with each sentence and levels on "Neither has won" (c10) · everything sinks into the beam · the beam sheds 1,000 points
//   and becomes the pen · the points reach for the pen · one hand takes it and lifts it (10.06; the ending, f16_b3_end, shares
//   this coordinate system and this camera from there on).
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f16_kit.mjs';
import { sheet, sheetSweep, sky, SHEET, SHEET_C, lineY, inkLine, label, inOut, hand, paperStamp } from './f16_b3_common.mjs';
import { NIB_PLATE } from './f16_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, aim, F0, prng, rad, lin, halo, glowFill } = E;

export const SB = 5;                                   // plate px per world px for the pages
export const PG1 = [1340, 520], PG2 = [2060, 520];     // page centres (world B)
export const BEAM_Y = 826, FULC = [1700, 826];
const PW = (SHEET.x1 - SHEET.x0) / SB, PH = (SHEET.y1 - SHEET.y0) / SB;   // 500 × 592
const pgRect = (c) => [c[0] - PW / 2, c[1] - PH / 2, PW, PH];
const toB = (c, px, py) => [c[0] + (px - SHEET_C[0]) / SB, c[1] + (py - SHEET_C[1]) / SB];
export const PEN_L = 640;
// the 1,000 points (about 1,000 Americans, Collective Constitutional AI 2023): field positions, seeded
const DOTS = (() => {
  const r = prng(2023), d = [];
  for (let i = 0; i < 1000; i++) {
    let x, y; do { x = r() * 2 - 1; y = r() * 2 - 1; } while (x * x + y * y > 1);
    const px = 1700 + x * 700, py = 905 + y * 165 + (Math.abs(y * 165) < 20 ? (y < 0 ? -22 : 22) : 0);
    d.push([px, py, Math.abs(px - 1700) / 700, r() * 6.28, .8 + r() * .7]);
  }
  return d;
})();
const COOLDOT = mixHex(P.blue2, P.cream, .45);
const QUOTE = { x: 190, y: 380, size: 66, w: 760 }, RULE_X = 150, RULE_TOP = 290, RULE_BOT = 860;
const CARD = { x: 196, y: 676, w: 430, h: 150 };
const CHAIN = { x: 1870, w: 380, ys: [[300, 410], [470, 580], [640, 750]] };
const COMP = { c: [1340, 528], r: 226, ring: 34 };

export function docs(a) {
  const self = {};
  // ------------------------------------------------------------------------------------------------ times
  const tsA = a.bigword - .5;
  const tHead = a.bigword - .15, tStamp = a.compdoc, tStampOut = a.text + .55;
  const tQuote = a.text - .9, tQuoteOut = a.lists - .5;
  const tCoin = a.money - .35, tCoinStop = a.money + 1.25;
  const tCloth = a.others + .45, tPush = a.polish + .15, tGlint = a.rep - .1, tClothOut = a.rep + .35;
  const tBeam = a.could + .1, tPage2 = a.openai, tMorph1 = a.character - .25, tMorph2 = a.chain - .25;
  const tSink = a.once - .65, tShed = a.ordinary - .35, tPen = a.gotpen - .35;
  const tReach = a.votedA - .25, tHand = a.begin + .05, tGrab = a.begin + .85, tRelease = a.begin + .7;
  const tRise = a.begin + 1.0, tApex = a.begin + 3.4, APEX = [1700, 150];
  self.tsC = a.begin + 2.75; self.tApex = tApex; self.APEX = APEX;                             // the world below the pen changes here (close shot)
  // the pen's grip G and angle θ over time (shared with the ending)
  const G0 = [FULC[0] - PEN_L / 2 + .27 * PEN_L, BEAM_Y];
  const reachAvg = (t) => sineIO(span(t, tReach, tReach + 1.4)) * (1 - sineIO(span(t, tRelease, tRelease + 1.0)));
  self.pen = (t) => {
    const up = sineIO(span(t, tRise, tApex));
    const g = [lerp(G0[0], APEX[0], up), lerp(G0[1] - 14 * reachAvg(t), APEX[1], up)];
    return { g, ang: lerp(0, NIB_PLATE.ang, sineIO(span(t, tRise, tRise + 1.6))), swell: expoOut(span(t, tPen, tPen + .8)), held: smooth(span(t, tGrab - .1, tGrab + .15)) };
  };
  self.hand = (t) => sineIO(span(t, tHand, tGrab));      // the hand's approach 0 → 1
  self.drawPen = (ctx, t, st) => drawPenHand(ctx, t, st, self.hand(t));

  // ------------------------------------------------------------------------------------------------ camera (world B; the ending continues it)
  self.setSwitch = (PSW, sAtoPlate, ts) => {
    const sw = toB(PG1, ...PSW), mag = sAtoPlate * SB;
    self.keys = [
      [ts, aim(F0, sw[0], sw[1], mag)],
      [tQuote + .05, aim(F0, 930, 512, 1.14)],                   // pull back: the page of light on the right, room for the quote
      [a.lists, aim(F0, 905, 508, 1.17)],                        // breathing push (slow, never at rest)
      [a.others + 1.5, aim(F0, 905, 600, 1.08)],
      [a.spec + .35, aim(F0, 1700, 545, 1.2)],                   // truck right: the pair on the beam (starts under "polish")
      [a.easier - .2, aim(F0, 1700, 540, 1.23)],
      [a.nobodyPl + .6, aim(F0, 1700, 546, 1.28)],
      [a.neither + .4, aim(F0, 1700, 545, 1.2)],
      [a.gotpen + .7, aim(F0, 1700, 780, 1.2)],                   // tilt down: the pen across the field of points
      [a.votedA + .6, aim(F0, 1700, 790, 1.25)],
      [tRise - .1, aim(F0, 1700, 770, 1.27)],
      [tApex - .2, aim(F0, APEX[0] - 40, APEX[1] - 25, 1.75)],   // follow the pen up, close
    ];
  };
  self.driftAmt = (t) => smooth(span(t, tsA, tsA + 1.5));

  // ------------------------------------------------------------------------------------------------ drawing
  self.draw = (ctx, t, c) => {
    card(ctx, c, 40000, () => sky(ctx, t, 0));
    card(ctx, c, F0, () => stage(ctx, t));
  };

  const tilt = (t) => (2 * sineIO(span(t, a.easier - .1, a.easier + 1.1)) - 4 * sineIO(span(t, a.copes - .1, a.copes + 1.3)) + 2 * sineIO(span(t, a.neither - .05, a.neither + 1.05))) * Math.PI / 180;
  const sinkU = (t) => sineIO(span(t, tSink, tSink + 2.3));   // calm (no lurch): sine, 2.3 s

  function stage(ctx, t) {
    const sk = sinkU(t);
    // the two sides ride the beam (rotation about the fulcrum); above the beam they sink into it at the end
    const side = (fn) => {
      ctx.save();
      if (sk > 0) { ctx.beginPath(); ctx.rect(-W, -4 * H, 4 * W, BEAM_Y - 3 + 4 * H); ctx.clip(); }
      ctx.translate(FULC[0], FULC[1]); ctx.rotate(tilt(t)); ctx.translate(-FULC[0], -FULC[1] - 0);
      ctx.translate(0, sk * 760);
      fn(); ctx.restore();
    };
    side(() => { page1(ctx, t); });
    if (t > tPage2) side(() => page2(ctx, t));
    leftColumn(ctx, t);
    coinCloth(ctx, t);
    beam(ctx, t);
    captions(ctx, t);
    field(ctx, t);
    const st = self.pen(t);
    if (st.swell > 0) self.drawPen(ctx, t, st);
  }

  // ---------------------------------------------------------------- page 1: Claude's constitution (the room's sheet)
  function pageGlow(ctx, rect, a = 1) {
    const p = new Path2D(); p.rect(...rect);
    glowFill(ctx, p, 140, .4 * a, P.blue0); glowFill(ctx, p, 36, .45 * a, P.halo1);
  }
  function page1(ctx, t) {
    const m = sineIO(span(t, tMorph1, tMorph1 + 1.25));
    const R0 = pgRect(PG1), R1 = [COMP.c[0] - COMP.r, COMP.c[1] - COMP.r, 2 * COMP.r, 2 * COMP.r];
    const rr = [lerp(R0[0], R1[0], m), lerp(R0[1], R1[1], m), lerp(R0[2], R1[2], m), lerp(R0[3], R1[3], m)], rad0 = lerp(0, COMP.r, m * m);
    const shape = new Path2D(); shape.roundRect(rr[0], rr[1], rr[2], rr[3], rad0);
    if (t > tsA + .02) { const g = new Path2D(); g.roundRect(...rr, rad0); glowFill(ctx, g, 140, .4, P.blue0); glowFill(ctx, g, 36, .45, P.halo1); }
    ctx.save(); ctx.clip(shape);
    ctx.save(); ctx.translate(PG1[0] - SHEET_C[0] / SB, PG1[1] - SHEET_C[1] / SB); ctx.scale(1 / SB, 1 / SB);
    const nx = self.nibX ? self.nibX(t) : NIB_PLATE.x;
    sheet(ctx, t, { nibX: nx, fill: .3 * smooth(span(t, tsA + .15, tsA + 2.2)), heading: { text: 'Constitution', u: span(t, tHead, tHead + .9), a: 1 - smooth(span(t, tMorph1, tMorph1 + .6)), size: 330, x: -150, y: -250 } });
    paperStamp(ctx, t, 'COMPANY DOCUMENT', 920, 120, 120, tStamp, tStampOut);
    sheetSweep(ctx, t, 3 * smooth(span(t, tsA + .3, tsA + 2.5)));   // the lamp's gliding reflection keeps the page alive in the holds
    ctx.restore();
    // the shine left by the cloth, the glint on "reputation"
    shine(ctx, t, R0);
    ctx.restore();
    if (m > .45) compass(ctx, t, m);
  }
  function compass(ctx, t, m) {
    const k = smooth(span(m, .45, 1)), [cx, cy] = COMP.c, ir = (COMP.r - COMP.ring) * k;
    if (ir > 1) {   // the face opens inside the ring: night, ticks, the needle of light
      ctx.save();
      ctx.fillStyle = rad(ctx, cx, cy - ir * .2, ir * 1.2, [[0, mixHex(P.ind1, P.blue1, .35)], [1, P.night1]]); ctx.beginPath(); ctx.arc(cx, cy, ir, 0, 6.29); ctx.fill();
      ctx.strokeStyle = rgba(P.halo1, .7); ctx.lineWidth = 3;
      for (let i = 0; i < 16; i++) { const q = i / 16 * 6.283, l = i % 4 === 0 ? 26 : 12; ctx.beginPath(); ctx.moveTo(cx + Math.cos(q) * (ir - 6), cy + Math.sin(q) * (ir - 6)); ctx.lineTo(cx + Math.cos(q) * (ir - 6 - l * k), cy + Math.sin(q) * (ir - 6 - l * k)); ctx.stroke(); }
      const turn = quartIO(span(t, a.nobodyPl - .25, a.nobodyPl + 1.05));
      const ang = -Math.PI / 2 - 1.55 * turn + .07 * Math.sin(t * .9) * (1 - turn) + .03 * Math.sin(t * 1.3) * turn;   // north → the unmapped west
      const nl = (ir - 30) * smooth(span(m, .7, 1));
      if (nl > 2) {
        const nd = new Path2D(), px = Math.cos(ang), py = Math.sin(ang), qx = -py, qy = px;
        nd.moveTo(cx + px * nl, cy + py * nl); nd.lineTo(cx + qx * 16, cy + qy * 16); nd.lineTo(cx - px * nl * .62, cy - py * nl * .62); nd.lineTo(cx - qx * 16, cy - qy * 16); nd.closePath();
        E.lightShape(ctx, nd, t, { lit: 1, dust: 0 });
        ctx.fillStyle = mixHex(P.ind2, P.night1, .4); ctx.beginPath(); ctx.moveTo(cx - qx * 16, cy - qy * 16); ctx.lineTo(cx - px * nl * .62, cy - py * nl * .62); ctx.lineTo(cx + qx * 16, cy + qy * 16); ctx.closePath(); ctx.fill();
        ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(cx, cy, 9, 0, 6.29); ctx.fill();
      }
      ctx.restore();
    }
    // the unmapped edge the needle turns to (dotted, dark), left of the compass
    const ue = smooth(span(t, a.nobodyPl - .5, a.nobodyPl + .6));
    if (ue > 0) {
      const pts = E.catmull([[1150, 640, 2], [1060, 690, 2], [1010, 640, 2], [960, 700, 2], [905, 660, 2], [860, 720, 2]], 10);
      ctx.save(); ctx.setLineDash([3, 13]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo2, .55); ctx.lineWidth = 3; ctx.beginPath();
      const n = Math.max(2, Math.floor(pts.length * ue)); pts.slice(0, n).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
    }
  }
  function shine(ctx, t, R) {
    // the cloth's wiped path leaves a soft sheen; on "reputation" a glint crosses the page
    const sh = smooth(span(t, tCloth + .3, tPush)) * (1 - smooth(span(t, tMorph1 - .4, tMorph1 + .3)));
    const gl = span(t, tGlint, tGlint + .75);
    if (sh <= 0 && (gl <= 0 || gl >= 1)) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    if (sh > 0) { ctx.fillStyle = rad(ctx, PG1[0] - 20, PG1[1] - 30, 260, [[0, rgba(P.core0, .22 * sh)], [1, rgba(P.core0, 0)]]); ctx.fillRect(...R); }
    if (gl > 0 && gl < 1) {
      const x = lerp(R[0] - 300, R[0] + R[2] + 300, sineIO(gl));
      ctx.fillStyle = lin(ctx, x - 90, 0, x + 90, 0, [[0, rgba(P.core0, 0)], [.5, rgba(P.core0, .26 * Math.sin(Math.PI * gl))], [1, rgba(P.core0, 0)]]);
      ctx.beginPath(); ctx.moveTo(x - 60, R[1] - 20); ctx.lineTo(x + 140, R[1] - 20); ctx.lineTo(x - 40, R[1] + R[3] + 20); ctx.lineTo(x - 240, R[1] + R[3] + 20); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  // ---------------------------------------------------------------- page 2: the OpenAI Model Spec (rises out of the beam)
  function page2(ctx, t) {
    const up = quartIO(span(t, tPage2, tPage2 + 1.5)), m = sineIO(span(t, tMorph2, tMorph2 + 1.25));
    const R0 = pgRect(PG2);
    ctx.save(); ctx.beginPath(); ctx.rect(R0[0] - 200, -4 * H, PW + 400, BEAM_Y - 3 + 4 * H); ctx.clip();   // rises from behind the beam
    ctx.translate(0, (1 - up) * (PH + 30));
    // three slices of the page move apart into the boxes of the chain (system → developer → user)
    const slices = [0, 1, 2].map((i) => {
      const y0 = R0[1] + i * PH / 3, y1 = y0 + PH / 3, [b0, b1] = CHAIN.ys[i];
      return [lerp(R0[0], CHAIN.x, m), lerp(y0, b0, m), lerp(PW, CHAIN.w, m), lerp(y1, b1, m) - lerp(y0, b0, m), 16 * m];
    });
    const all = new Path2D(); for (const s of slices) all.roundRect(...s);
    glowFill(ctx, all, 140, .4, P.blue0); glowFill(ctx, all, 36, .45, P.halo1);
    ctx.save(); ctx.clip(all);
    // each slice carries its own part of the page (the page splits, it does not jump)
    slices.forEach((s, i) => {
      ctx.save(); const cl = new Path2D(); cl.roundRect(...s); ctx.clip(cl);
      const y0 = R0[1] + i * PH / 3, dy = s[1] - y0, dx = s[0] - R0[0];
      ctx.translate(dx, dy); ctx.translate(PG2[0] - SHEET_C[0] / SB, PG2[1] - SHEET_C[1] / SB); ctx.scale(1 / SB, 1 / SB);
      sheet(ctx, t, { noLine: true, fill: .3, heading: { text: 'Model Spec', u: 1, a: 1 - smooth(span(m, .1, .45)), size: 330, x: -150, y: -250 } });
      sheetSweep(ctx, t + 2.1, 3);
      ctx.restore();
    });
    ctx.restore();
    if (m > .5) {
      const k = smooth(span(m, .5, 1));
      // the links between the boxes (two rings each); the hot one is the line you can point to
      const hot = smooth(span(t, a.broken - .15, a.broken + .35));
      for (let i = 0; i < 2; i++) {
        const yA = slices[i][1] + slices[i][3], yB = slices[i + 1][1], g = yB - yA, cx = CHAIN.x + CHAIN.w / 2;
        if (g < 6) continue;
        const h = i === 1 ? hot : 0;
        ctx.save(); ctx.lineWidth = 7; ctx.strokeStyle = h > 0 ? mixHex(P.halo1, P.core0, h) : rgba(P.halo1, .9);
        ctx.beginPath(); ctx.ellipse(cx - 6, yA + g * .34, 13, g * .36, 0, 0, 6.29); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx + 6, yA + g * .66, 13, g * .36, 0, 0, 6.29); ctx.stroke(); ctx.restore();
        if (h > 0) { halo(ctx, cx, yA + g / 2, 120 * h, .8 * h, P.halo0, P.core0); }
      }
      // instructions flowing down: small pulses of light from SYSTEM to USER
      const fl = smooth(span(t, a.outranks - .3, a.outranks + .4));
      if (fl > 0) for (let j = 0; j < 3; j++) {
        const q = ((t - a.outranks) * .55 + j / 3) % 1; if (q < 0) continue;
        const y = lerp(CHAIN.ys[0][1] - 20, CHAIN.ys[2][0] + 20, q), cx = CHAIN.x + CHAIN.w / 2;
        if (y > CHAIN.ys[0][1] - 4 && y < CHAIN.ys[2][0] + 4) halo(ctx, cx, y, 26, .9 * fl * Math.sin(Math.PI * q), P.halo0, P.core0);
      }
      // box labels in ink
      const L = [['SYSTEM', a.system - .15], ['DEVELOPER', a.system + .35], ['USER', a.user - .1]];
      L.forEach(([s, t0], i) => { const u = span(t, t0, t0 + .7); if (u > 0) inkLine(ctx, s, CHAIN.x + CHAIN.w / 2, slices[i][1] + slices[i][3] / 2 + 14, 38, u * k, { serif: false, align: 'center', spacing: .14, weight: 600 }); });
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- the left column (c09): quote, open problem, critic, rule card
  function leftColumn(ctx, t) {
    if (t > a.could + 1) return;
    // the thread: from the start of the written line on the page, left through the dark, up as the column's rule
    const p0 = toB(PG1, NIB_PLATE.line0, lineY(NIB_PLATE.line0));
    const path = E.catmull([[p0[0], p0[1], 2], [p0[0] - 120, p0[1] + 30, 2], [700, 560, 2], [RULE_X + 40, RULE_BOT + 30, 2], [RULE_X, RULE_BOT - 30, 2], [RULE_X, RULE_TOP, 2]], 14).map((p) => [p[0], p[1]]);
    const tT = tQuote - .55, home = smooth(span(t, a.others + .1, a.others + 1.3));
    const uh = smooth(span(t, tT, tT + 1.1)), ut = smooth(span(t, tT + .7, tT + 1.35)) * .78;
    if (uh > 0 && home < 1) {
      if (home <= 0) K.trailSpan(ctx, path, ut, uh, { w: 2.2, spark: uh < 1 });
      else K.trailSpan(ctx, path, lerp(ut, 0, 0), lerp(uh, 0, home) < ut ? ut : lerp(uh, 0, home), { w: 2.2, spark: false });
    }
    // the money quote (exact words), the gold phrase warms on its word
    if (t > tQuote - .1 && t < tQuoteOut + 1.4)
      K.quote(ctx, t, { text: 'central to Anthropic’s commercial success', attr: 'CLAUDE’S CONSTITUTION', x: QUOTE.x, y: QUOTE.y, size: QUOTE.size, w: QUOTE.w, t0: tQuote, t1: tQuoteOut, gold: [['commercial success', a.comm - .05]] });
    // the open problem, built with the words
    const tOPout = a.fixedRule - .95;
    label(ctx, 'OPEN PROBLEM', QUOTE.x + 2, 300, 30, inOut(t, a.openP - .15, tOPout), { spacing: .2 });
    if (t > a.commerc - .2 && t < tOPout + 1) {
      K.maskLine(ctx, [['commercially helpful', 0]], QUOTE.x, 384, 64, inOut(t, a.commerc - .1, tOPout + .05));
      K.maskLine(ctx, [['vs. good', 0]], QUOTE.x, 466, 64, inOut(t, a.versus - .05, tOPout + .1));
    }
    // the critic (name plate) and the blank rule card he asks for
    const tZout = a.others - .25;
    label(ctx, 'ZVI MOWSHOWITZ', QUOTE.x + 2, 600, 34, inOut(t, a.mow - .3, tZout), { col: P.cream, spacing: .1 });
    label(ctx, 'COMMENTATOR', QUOTE.x + 4, 636, 22, inOut(t, a.mow - .1, tZout + .05), { spacing: .16 });
    const cu = smooth(span(t, a.fixedRule - .15, a.fixedRule + .55)), cout = expoIn(span(t, tZout, tZout + .5));
    if (cu > 0 && cout < 1) {
      const { x, y, w, h } = CARD, ring = K.roundRectPts(x, y, w, h, 14);
      K.trailSpan(ctx, ring, cout, cu, { w: 1.8, spark: cu < 1 });
      const tu = inOut(t, a.fixedRule + .2, tZout - .05);
      label(ctx, 'HOW CHANGES ARE MADE', x + 26, y + 46, 24, tu, { col: P.cream, spacing: .14 });
      const du = smooth(span(t, a.fixedRule + .45, a.fixedRule + 1.1)) * (1 - cout);
      if (du > 0) { ctx.save(); ctx.setLineDash([2, 12]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo2, .6); ctx.lineWidth = 3;
        for (const yy of [y + 92, y + 124]) { ctx.beginPath(); ctx.moveTo(x + 26, yy); ctx.lineTo(x + 26 + (w - 70) * du, yy); ctx.stroke(); } ctx.restore(); }
    }
  }

  // ---------------------------------------------------------------- the coin (money) and the cloth (polish)
  const COIN_R = 40, COIN_STOP = [1160, 754];
  function coinCloth(ctx, t) {
    if (t < tCoin || t > tMorph1) return;
    // the coin rolls in from the left along the page's bottom margin and stops in the margin; the cloth later pushes it off the edge
    const rq = expoOut(span(t, tCoin, tCoinStop)), x0 = -120;
    let x = lerp(x0, COIN_STOP[0], rq), y = COIN_STOP[1], rot = (x - x0) / COIN_R;
    const push = span(t, tPush, tPush + .55);
    if (push > 0) { const e = expoIn(push); x = COIN_STOP[0] - 70 * sineIO(push); y = COIN_STOP[1] + 420 * e; rot -= 70 / COIN_R * sineIO(push); }
    if (y < 1300) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); E.icon(ctx, 'coin', 0, 0, COIN_R * 2.1, t, { lit: 1, dust: 0, glow: .6 }); ctx.restore(); }
    // the cloth: a soft fold of indigo cloth with a warm rim; comes in from the right, wipes two loops, sweeps the margin, leaves up-right
    const ci = span(t, tCloth, tClothOut + .9); if (ci <= 0 || ci >= 1) return;
    let cx, cy;
    if (t < tCloth + .5) { const e = sineIO(span(t, tCloth, tCloth + .5)); cx = lerp(1880, 1430, e); cy = lerp(420, 470, e); }
    else if (t < tPush - .35) { const q = (t - tCloth - .5) / Math.max(.1, tPush - .35 - tCloth - .5), ang = q * 6.283 * 2 - 1.2; cx = 1350 + Math.cos(ang) * 120 + 40 * (1 - q); cy = 520 + Math.sin(ang) * 95 + 80 * q; }
    else if (t < tPush + .25) { const e = sineIO(span(t, tPush - .35, tPush + .25)); cx = lerp(1350 + Math.cos(6.283 * 2 - 1.2) * 120, COIN_STOP[0] + 40, e); cy = lerp(520 + Math.sin(-1.2) * 95 + 80, COIN_STOP[1] - 8, e); }
    else { const e = sineIO(span(t, tPush + .25, tClothOut + .9)); cx = lerp(COIN_STOP[0] + 40, 1900, e); cy = lerp(COIN_STOP[1] - 8, 260, e); }
    cloth(ctx, t, cx, cy);
  }
  function cloth(ctx, t, x, y) {
    // a pale, soft polishing cloth (it reads as cloth: light fabric, two folds, a corner that trails behind)
    const w = Math.sin(t * 5) * .06, k = 1.35;
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.2 + w); ctx.scale(k, k);
    const p = new Path2D(); p.moveTo(-70, -18); p.bezierCurveTo(-40, -50, 30, -46, 66, -22); p.bezierCurveTo(84, 4, 60, 40, 20, 44);
    p.bezierCurveTo(-8, 48, -26, 62, -44, 78); p.bezierCurveTo(-46, 56, -64, 40, -76, 12); p.closePath();
    glowFill(ctx, p, 30, .35, P.blue2);
    ctx.fillStyle = lin(ctx, -70, -40, 60, 60, [[0, mixHex(P.blue2, P.cream, .55)], [.6, mixHex(P.blue2, P.cream, .2)], [1, mixHex(P.blue1, P.ind2, .35)]]); ctx.fill(p);
    ctx.strokeStyle = rgba(mixHex(P.blue1, P.night1, .4), .45); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-42, -12); ctx.quadraticCurveTo(0, 6, 44, -14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-34, 20); ctx.quadraticCurveTo(4, 32, 34, 18); ctx.stroke();
    ctx.restore();
  }

  // ---------------------------------------------------------------- the beam (balance), the fulcrum, captions
  function beam(ctx, t) {
    const u = smooth(span(t, tBeam, tBeam + 1.5)); if (u <= 0) return;
    const shed = span(t, tShed, tShed + 1.1), pe = self.pen(t);
    if (pe.swell >= 1) return;
    const half = lerp(660, PEN_L / 2, quartIO(shed)), ang = tilt(t);
    const c = Math.cos(ang), s = Math.sin(ang), L = [FULC[0] - c * half, FULC[1] - s * half], R = [FULC[0] + c * half, FULC[1] + s * half];
    // drawn from page 1's foot to the right (a thread), then it is the beam
    const pts = [L, R], a0 = pe.swell;
    K.trailSpan(ctx, pts, 0, u, { w: 3.2 * (1 - a0) + .01, spark: u < 1 });
    // the fulcrum: a small wedge of light under the middle (rises from below the beam)
    const fu = K.rise(span(t, tBeam + .9, tBeam + 1.7)) * (1 - expoIn(span(t, tSink, tSink + .6)));
    if (fu > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(FULC[0] - 60, FULC[1] + 3, 120, 90); ctx.clip(); ctx.translate(0, (1 - fu) * 60);
      const wd = new Path2D(); wd.moveTo(FULC[0], FULC[1] + 5); wd.lineTo(FULC[0] + 26, FULC[1] + 46); wd.lineTo(FULC[0] - 26, FULC[1] + 46); wd.closePath();
      E.lightShape(ctx, wd, t, { lit: 1, dust: 0, glow: .5 }); ctx.restore();
    }
  }
  function captions(ctx, t) {
    const tOut = tSink - .1, ang = tilt(t);
    const at = (x, fn) => { ctx.save(); ctx.translate(FULC[0], FULC[1]); ctx.rotate(ang); ctx.translate(-FULC[0], -FULC[1]); fn(); ctx.restore(); };
    at(0, () => {
      label(ctx, 'CLAUDE’S CONSTITUTION', PG1[0], 884, 30, inOut(t, tBeam + .4, tOut), { col: P.cream, align: 'center', spacing: .1 });
      label(ctx, 'ANTHROPIC · JANUARY 2026', PG1[0], 920, 21, inOut(t, tBeam + .55, tOut + .05), { align: 'center', spacing: .14 });
      label(ctx, 'OPENAI MODEL SPEC', PG2[0], 884, 30, inOut(t, a.spec - .35, tOut), { col: P.cream, align: 'center', spacing: .1 });
      label(ctx, 'MODEL-SPEC.OPENAI.COM · LATEST UPDATE AUGUST 2026', PG2[0], 920, 21, inOut(t, a.spec - .2, tOut + .05), { align: 'center', spacing: .1 });
    });
    // the two ideas over the two shapes (they ride the beam too)
    const sk = sinkU(t);
    ctx.save(); ctx.beginPath(); ctx.rect(-W, -4 * H, 4 * W, BEAM_Y - 3 + 4 * H); ctx.clip();
    at(0, () => {
      ctx.translate(0, sk * 760);
      label(ctx, 'CHARACTER', COMP.c[0], 200, 36, inOut(t, a.character - .1, null), { col: P.cream, align: 'center', spacing: .16 });
      label(ctx, 'CHAIN OF COMMAND', CHAIN.x + CHAIN.w / 2, 200, 36, inOut(t, a.chain - .05, null), { col: P.cream, align: 'center', spacing: .16 });
      if (t > a.easier - .3) K.maskLine(ctx, [['easier to check', 1]], CHAIN.x + CHAIN.w / 2, 256, 46, inOut(t, a.easier - .1, null), { align: 'center' });
      if (t > a.nobodyPl - .4) K.maskLine(ctx, [['copes with the new', 1]], COMP.c[0], 256, 46, inOut(t, a.nobodyPl - .15, null), { align: 'center' });
    });
    ctx.restore();
  }

  // ---------------------------------------------------------------- the 1,000 points and the year
  function field(ctx, t) {
    if (t < tShed || t > self.tsC + .1) return;
    const reach = (d) => sineIO(span(t, tReach + d * .7, tReach + 1.0 + d * .7)) * (1 - sineIO(span(t, tRelease + d * .3, tRelease + 1.0 + d * .3)));
    ctx.save();
    for (const [x, y, d, ph, s] of DOTS) {   // the ends of the beam shed first, the middle last
      const te = tShed + (1 - d) * .9; const q = expoOut(span(t, te, te + .9)); if (q <= 0) continue;
      const r = reach(d), yy = lerp(BEAM_Y, y, q), ty = lerp(yy, BEAM_Y + (y > BEAM_Y ? 26 : -26), .58 * r);
      const warm = r;
      ctx.globalAlpha = .55 + .35 * Math.sin(t * s * 1.6 + ph) * .5 + .3 * warm;
      ctx.fillStyle = warm > .05 ? mixHex(COOLDOT, P.core1, warm) : COOLDOT;
      const sz = 3.6 + 1.6 * warm; ctx.fillRect(x - sz / 2, ty - sz / 2, sz, sz);
    }
    ctx.restore();
    // the year and the people (one number), the source
    const lOut = a.begin - .35;   // the year leaves before the hand comes in from above
    if (t > a.y2023 - .3) K.maskLine(ctx, [['2023', 0]], 1700, 588, 130, inOut(t, a.y2023 - .15, lOut), { align: 'center' });
    label(ctx, 'ABOUT 1,000 AMERICANS', 1700, 652, 38, inOut(t, a.thousand - .15, lOut + .05), { col: P.cream, align: 'center', spacing: .16 });
    label(ctx, 'COLLECTIVE CONSTITUTIONAL AI · ANTHROPIC & COLLECTIVE INTELLIGENCE PROJECT, 2023', 1700, 1150, 24, inOut(t, a.intel + .05, tRelease + .35), { align: 'center', spacing: .08 });
  }
  return self;
}

// ---------------------------------------------------------------- the pen of light (lying, then held by one hand)
// st = { g: grip point, ang: angle nib → cap, swell 0..1 (it grows out of the beam), held }; hu = the hand's approach 0..1
export function drawPenHand(ctx, t, st, hu, o = {}) {
  const L = o.L ?? PEN_L, c = Math.cos(st.ang), s = Math.sin(st.ang), nib = [st.g[0] - c * .27 * L, st.g[1] - s * .27 * L];
  ctx.save(); ctx.translate(...nib); ctx.rotate(st.ang); ctx.scale(1, Math.max(.02, st.swell)); ctx.rotate(-st.ang);
  K.pen(ctx, 0, 0, st.ang, L, t, { glow: .9 });
  ctx.restore();
  if (hu > 0) {
    // the hand comes from the upper right along its forearm and closes on the grip
    const wd = st.ang - 1.25, Lp = o.palm ?? 150, off = (1 - hu) * 900;
    const wrist = [st.g[0] + Math.cos(wd) * (Lp * .62 + off), st.g[1] + Math.sin(wd) * (Lp * .62 + off)];
    hand(ctx, E.handMatrix(wrist[0], wrist[1], wd + Math.PI, Lp, 1), { pose: 'hold' });
  }
  return nib;
}
