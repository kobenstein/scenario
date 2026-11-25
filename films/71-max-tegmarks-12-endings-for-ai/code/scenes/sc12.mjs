// Film 71 · c12 (B3): ENDING 1/12 EGALITARIAN UTOPIA. One continuous take (docs/shots.md 1.01 – 1.16):
//   A  the seam plate plateRow(1) → the ranked row re-forms into the Leitbild arc (ANCHOR 3/4), EGALITARIAN UTOPIA, the survey's covered top
//      line flips open, the gold door opens a crack
//   B  three at one table in the gold door's beam: HUMAN · CYBORG · UPLOADED MIND, GUARANTEED INCOME (three equal stacks)
//   C  the camera flies through the gold door into the morning from the start (the hook kitchen): no bill, the sun, the windows across light
//   D  the lit windows become Malta's dots (a night flood from the windows): MALTA × OPENAI, MAY 16, 2026 (the tag lands on the HUD), AI COURSE →
//      CHATGPT PLUS, FREE FOR 1 YEAR, the island shrinks to THE SMALLEST VERSION beside the full idea (GUARANTEED INCOME, empty)
//   E  the full idea becomes Tegmark's table of twelve (a hook on every row), PROPERTY ABOLISHED, the quote; the table folds into row 1 → the gold
//      door from above, THE DESTINATION, the unfinished roads (Tegmark's dashed), THE ROAD: OPEN → pull back: the twelve from above (planScene) =
//      the frame c13 starts with.
// Anchors are phrases only (T.G). Overlays are designed in screen px at a reference view and drawn on the yard (inRef), so they ride the camera.
import * as F from '../lib/f71_kit.mjs';
import * as S from '../lib/f71_world.mjs';
import * as B from '../lib/b3_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, GOLD, CREAM, CREAM2, COOL, PAPER, LAMP, DATA, TXT } = F;
const TAU = Math.PI * 2;
const ref = (ctx, vd) => ctx.transform(1 / vd.s, 0, 0, 1 / vd.s, vd.x - W / 2 / vd.s, vd.y - H / 2 / vd.s);
const inRef = (ctx, v, vd, fn, a = 1) => { if (a <= .002) return; F.inView(ctx, v, () => { ref(ctx, vd); ctx.globalAlpha *= a; fn(); }); };
const bump = (t, a, d) => Math.sin(Math.PI * span(t, a, a + d));

// the shared c12 | c13 boundary: the twelve from above (c13 imports these so the frame at the boundary is the same)
export const VP = { x: 960, y: 500, s: .95 };
// the camera through the c12 → c13 seam: both chunks evaluate the SAME keys around it, so position and velocity match (no stop on the seam)
export const seamCam = (T, b) => [[T.G('open argument', 0, b - 12) + .2, { x: 1550, y: 472, s: 1.1 }], [b, VP], [b + 1.6, { x: 960, y: 497, s: .94 }]];
export const planLev = (t, T) => {   // the levers on the twelve branches: all lean one way, then (c13 S.03) point both ways
  const both = T.G("This year's switches point both ways");
  return (n) => { const k = sineIO(span(t, both + .85 + (12 - n) * .04, both + 1.55 + (12 - n) * .04)), tr = .07 * Math.sin(t * (5 + n * .7) + n) * span(t, both + 1.2, both + 1.8) * (n % 3 === 0 ? 1 : .25);
    return lerp(.45, n % 2 ? .5 : -.5, k) + tr; };
};

export default function (T, R) {
  const G = (p, n = 0, after = R.a - 1) => T.G(p, n, after);
  const A = {
    eu: G('Egalitarian Utopia'), hum: G('Humans, cyborgs'), cyb: G('cyborgs'), upl: G('uploaded minds'), peace: G('live in peace'), inc: G('guaranteed income'),
    morn: G("It's the morning from the start"), wake: G('You wake up, and your first'), bill: G('not a bill'), money: G('Money is no longer'), anyone: G('For anyone'),
    may: G('In May, Malta made a deal'), malta: G('Malta made'), every: G('Every citizen'), course: G('AI course'), chat: G('paid version of ChatGPT'),
    free: G('Free, for a year'), year: G('for a year'), noInc: G('No income'), smallest: G('smallest form'), intel: G('intelligence for everyone'),
    catch: G('It has a catch too'), prop: G('private property'), himself: G('He says it himself'), every2: G('every ending has'), object: G('something to object to'),
    rank: G('We rank it first'), prosp: G('prosperity that reaches'), notRoad: G('Not for the road'), his: G('his version takes'), which: G('Which road leads there'), open: G('open argument'),
  };
  const PLATE = R.a + S.SEAM_HALF, K = F.counterTimes(T), sign1 = K.sign[1];
  const SLOT = Object.fromEntries(F.THUMB_ORDER.map((r, i) => [r, i]));
  const GS = S.slotDoor(S.GOLD_SLOT), GDC = [GS.x, GS.y - GS.h / 2];

  // ================================================================ A + B + C: the row → the arc → the table → into the gold door
  const ZE = S.ZEND * 1.05;
  const VA = [[PLATE, { x: W / 2, y: H / 2, s: 1 }], [A.hum - .2, { x: 945, y: 548, s: 1.04 }], [A.hum + 1.6, { x: 892, y: 640, s: 1.6 }], [A.morn - .6, { x: 892, y: 634, s: 1.7 }], [A.morn + 1.25, { x: GDC[0], y: GDC[1], s: ZE }]];
  const arcView = (t) => F.viewPath(t, VA);
  const morph = (r, t) => { const i = SLOT[r]; return sineIO(span(t, PLATE + .25 + Math.abs(i - 5) * .035, PLATE + 1.85 + Math.abs(i - 5) * .035)); };
  const gOpen = (t) => sineIO(span(t, A.morn - .6, A.morn + .3));
  const RC = [[A.morn + 1.25, { x: 960, y: 560, s: 1 }], [A.wake + .5, { x: 950, y: 556, s: 1.03 }], [A.bill - .35, { x: 560, y: 470, s: 1.5 }], [A.money - .2, { x: 575, y: 468, s: 1.53 }],
    [A.money + 1.4, { x: 1360, y: 430, s: 1.3 }], [A.anyone - .1, { x: 1345, y: 432, s: 1.38 }], [A.anyone + .9, { x: 1330, y: 440, s: 1.55 }], [A.may + 1, { x: 1332, y: 441, s: 1.6 }]];
  const roomOpts = (t) => ({ anyone: span(t, A.anyone, A.anyone + .95), fed: 0 });
  // the room camera never rests on arrival: a decaying push on top of RC carries the fly-in's momentum into the kitchen
  const rcv = (t) => { const v = F.viewPath(t, RC), q = Math.max(0, t - (A.morn + 1.25)); return { ...v, s: v.s * (1 + .035 * (1 - Math.exp(-q * .8))) }; };
  const inner = (v, t) => (c, box) => { const [x0, y0] = F.toScreen(v, box.x0, box.y0); c.setTransform(1, 0, 0, 1, 0, 0); S.roomThroughDoor(c, t, { x0, y0, w: box.w * v.s, h: box.h * v.s }, v.s, rcv(t), roomOpts(t)); };
  const TBL = { cx: 892, y: 722 };
  function drawArc(ctx, t) {
    // A: before the morph starts the plate itself (identical to c11's last frame)
    if (t < PLATE) { S.plateRow(ctx, t, T, 1); nameLayer(ctx, t); return; }
    const v0 = S.plateView(t, T, 1), v = arcView(t);
    const mAll = sineIO(span(t, PLATE + .25, PLATE + 2.05));
    if (mAll < 1) {
      F.yard(ctx, t, v0, { lx: F.rowX(1), ly: 560, pool: .8, rails: 1 - mAll });
      ctx.save(); ctx.globalAlpha = mAll; S.plain(ctx, t, v, { stars: 1 }); ctx.restore();
    } else S.plain(ctx, t, v, { stars: 1 });
    const lv = 1 - span(t, PLATE, PLATE + .45);
    // the door of rank r: the row door (screen px of the plate view) → its thumbnail slot (Leitbild coords of view v)
    const doors = (i) => {
      const r = F.THUMB_ORDER[i], m = morph(r, t), sl = S.slotDoor(i), gold = i === S.GOLD_SLOT;
      const sc = r === 1 ? 1.06 : 1, [rx, ry] = F.toScreen(v0, F.rowX(r), F.ROW.y), [qx, qy] = F.fromScreen(v, rx, ry);
      const rw = F.ROW.w * sc * v0.s / v.s, rh = F.ROW.h * sc * v0.s / v.s;
      const x = lerp(qx, sl.x, m), y = lerp(qy, sl.y, m) - (i % 2 ? 1 : -1) * 46 * Math.sin(Math.PI * m) * (gold ? 0 : 1);
      const lit = lerp(r === 1 ? 1 : .22, sl.lit, m), col = mixHex(F.END[r].col, sl.col, m);
      const o = gOpen(t);
      return { x, y, w: lerp(rw, sl.w, m), h: lerp(rh, sl.h, m), col, lit, seed: r, beamA: (gold ? 1.55 : .9) * m, beam: (1 - m) * (r === 1 ? .8 : .3), halo: lerp(1, gold ? 1.3 : .8, m), frame: lerp(Math.max(1.5, F.ROW.w * .045), 0, m),
        open: gold && o > 0 ? o : undefined, inner: gold && o > 0 ? inner(v, t) : undefined };
    };
    if (v.s >= ZE * .999) { S.rooms(ctx, t, rcv(t), roomOpts(t)); return; }
    B.arcDoors(ctx, t, v, { doors, beams: 1 });
    // levers and mini tags of the row fold away before the doors fly (they ride the plate view)
    if (lv > 0) F.inView(ctx, v0, () => { for (const e of F.ENDINGS) { S.rowLever(ctx, t, F.rowX(e.n), .45, lv); F.miniTag(ctx, F.rowX(e.n), F.ROW.y - F.ROW.h * (e.n === 1 ? 1.06 : 1) - 26, lv, e.n); } });
    // you leave the row to the left (you come back in the kitchen)
    const yu = span(t, PLATE, PLATE + 1.3);
    if (yu < 1) F.inView(ctx, v0, () => { const y = S.ROW_YOU; F.du(ctx, lerp(y.x, y.x - 150, sineIO(yu)), y.y, y.h, { hood: false, view: yu > 0 ? 'side' : undefined, walk: yu > 0 ? t * 7 : undefined, dir: yu > 0 ? -1 : 1, look: .2, light: 1 }); });
    // B: the table in the beam of the gold door
    const tu = span(t, A.hum - .35, A.hum + .35);
    if (tu > 0) F.inView(ctx, v, () => {
      halo(ctx, TBL.cx, TBL.y - 30, 190, .3 * span(t, A.peace, A.peace + 1.2), LAMP.body, LAMP.core);
      const xs = B.tableFigures(ctx, t, TBL.cx, TBL.y, [span(t, A.hum, A.hum + .6), span(t, A.cyb, A.cyb + .6), span(t, A.upl, A.upl + .6)]);
      ctx.save(); ctx.translate(TBL.cx, TBL.y); ctx.scale(expoOut(tu), 1); ctx.translate(-TBL.cx, -TBL.y); B.table(ctx, TBL.cx - 165, TBL.cx + 165, TBL.y, clamp(tu * 2)); ctx.restore();
      xs.forEach((x, k) => B.coinStack(ctx, x, TBL.y + 1, 18, 4, span(t, A.inc + k * .1, A.inc + .7 + k * .1)));
    });
    // labels (screen px, they ride the camera)
    const la = 1 - span(t, A.morn - .5, A.morn - .1);
    if (tu > 0 && la > 0) {
      [[TBL.cx - 112, A.hum, 'HUMAN'], [TBL.cx, A.cyb, TXT.e1.cyborg], [TBL.cx + 112, A.upl, TXT.e1.upload]].forEach(([x, t0, s]) => { const [X, Y] = F.toScreen(v, x, TBL.y + 32); F.label(ctx, s, X, Y + 16, span(t, t0 + .1, t0 + .7) * la, { size: 24 }); });
      const [X, Y] = F.toScreen(v, TBL.cx, TBL.y + 60); F.label(ctx, 'GUARANTEED INCOME', X, Y + 26, span(t, A.inc + .2, A.inc + .8) * la, { size: 28, gold: .6, spacing: .14 });
    }
    nameLayer(ctx, t);
  }
  // A: the name (it grows in over the seam plate, which stays untouched until R.a), and the survey's covered top line flips open
  function nameLayer(ctx, t) {
    const nu = span(t, A.eu + .05, A.eu + .75) * (1 - span(t, A.hum - .3, A.hum + .2));
    F.big(ctx, F.END[1].name, W / 2, 236, 82, nu, { gold: 1 });
    surveyLine(ctx, t, W / 2, 300, span(t, A.eu + .3, A.eu + .9) * (1 - span(t, A.hum - .3, A.hum + .2)), span(t, A.eu + .9, A.eu + 1.5));
  }
  function surveyLine(ctx, t, x, y, u, flip) {
    if (u <= 0) return;
    const txt = "TEGMARK'S READER SURVEY · MOST CHOSEN", w = F.measure(txt, 22, false, 600) * 1.1 + 60, k = expoOut(u);
    ctx.save(); ctx.globalAlpha *= clamp(u * 2); ctx.translate(x, y + (1 - k) * 16);
    ctx.fillStyle = rgba(P.night0, .6); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(-w / 2, -22, w, 44, 22); ctx.fill(); ctx.stroke();
    F.glowText(ctx, txt, 0, 8, { size: 22, weight: 600, align: 'center', col: CREAM, glow: false, spacing: .06 });
    // the cover: a plate hinged at the top that flips up (it is the "covered top line" of c11's survey)
    const f = sineIO(clamp(flip)), ch = 44 * Math.cos(f * Math.PI / 2);
    if (ch > .5) { ctx.fillStyle = mixHex(P.night1, P.ind2, .8); ctx.beginPath(); ctx.roundRect(-w / 2, -22, w, ch, Math.min(22, ch / 2)); ctx.fill(); ctx.strokeStyle = rgba(CREAM2, .6); ctx.stroke(); }
    ctx.restore();
  }

  // ================================================================ D + E: the yard (Malta → the table → from above)
  const VM = { x: 1686, y: 520, s: 1 };
  const yardCam = [[A.may - .1, VM], [A.noInc, { x: 1694, y: 516, s: 1.025 }], [A.rank - .1, { x: 1690, y: 515, s: 1.03 }], [A.rank + 1.5, { x: 1686, y: 320, s: 1.55 }],
    [A.notRoad - .3, { x: 1680, y: 322, s: 1.6 }], [A.notRoad + 1.3, { x: 1560, y: 470, s: 1.12 }], ...seamCam(T, R.b)];
  const yv = (t) => F.viewPath(t, yardCam);
  const IS = { x: 900, y: 420 };   // the island centre (screen px at VM)
  const win0 = B.kitchenWindows(RC[RC.length - 1][1]);   // the windows at the end of the kitchen push
  const DOTS = B.MALTA.dots, ND = DOTS.length;
  // which citizen dot each lit window becomes: spread over the island (every ~9th dot)
  const winDot = win0.map((_, k) => Math.floor((k + .5) * ND / win0.length));
  const nearestWin = DOTS.map(([x, y]) => { let b = 0, bd = 1e9; winDot.forEach((j, k) => { const d = (DOTS[j][0] - x) ** 2 + (DOTS[j][1] - y) ** 2; if (d < bd) { bd = d; b = k; } }); return b; });
  const flood = (t) => sineIO(span(t, A.may - .15, A.may + 1.9));
  const shrink = (t) => sineIO(span(t, A.noInc - .1, A.noInc + 1.5));
  const badge = (t) => { const s = shrink(t), into = sineIO(span(t, A.catch + .05, A.catch + 1.2)); return { x: lerp(lerp(IS.x, 560, s), CARD.x + 40, into), y: lerp(lerp(IS.y, 400, s), CARD.y + CARD.head + 18, into), k: lerp(lerp(1, .42, s), .05, into) }; };
  const ROWS = [...F.ENDINGS].reverse();   // row 1 on top
  const CARD = { x: 580, y: 236, w: 760, head: 58, rh: 36 };
  const IBOX = { x: 1020, y: 230, w: 560, h: 340 };
  function maltaGroup(ctx, t, o) {
    const b = badge(t);
    ctx.save(); ctx.translate(b.x, b.y); ctx.scale(b.k, b.k);
    B.maltaShape(ctx, o.shape);
    const dotU = span(t, A.malta - .1, A.malta + 1.2), ring = (j) => span(t, A.course + (DOTS[j][0] + 470) / 940 * 1.6, A.course + .4 + (DOTS[j][0] + 470) / 940 * 1.6);
    const pulse = bump(t, A.intel - .1, 1.3);
    DOTS.forEach(([x, y, q, ph], j) => {
      const isWin = winDot.includes(j);
      if (!isWin) {   // the clones grow out of the nearest window dot
        const g = clamp(dotU * 1.5 - q * .5); if (g <= 0) return;
        const [sx, sy] = DOTS[winDot[nearestWin[j]]], e = expoOut(g), px = lerp(sx, x, e), py = lerp(sy, y, e);
        dotAt(ctx, t, px, py, 1, ring(j), pulse, ph); return;
      }
      if (o.winHere) dotAt(ctx, t, x, y, 1, ring(j), pulse, ph);
    });
    ctx.restore();
  }
  function dotAt(ctx, t, x, y, a, rg, pulse, ph) {
    ctx.fillStyle = rgba(DATA.human, .9 * a); ctx.beginPath(); ctx.arc(x, y, 4.6, 0, TAU); ctx.fill();
    if (rg > 0) { ctx.strokeStyle = rgba(DATA.machine, .9 * rg * a); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 8.5 + 1.2 * Math.sin(t * 2 + ph), 0, TAU); ctx.stroke(); }
    if (pulse > 0) { ctx.strokeStyle = rgba(LAMP.core, .55 * pulse * a); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 6 + 10 * pulse, 0, TAU); ctx.stroke(); }
  }
  function maltaOverlay(ctx, t) {   // screen px at VM: the flying window dots, the labels, the bar, the income box
    const fl = flood(t), b = badge(t);
    // the window dots fly from the kitchen windows to their places on the island
    if (t < A.malta + .6) {
      const win = B.kitchenWindows(rcv(Math.min(t, A.may)));
      const fu = sineIO(span(t, A.may + .05, A.may + 1.25));
      win.forEach((w, k) => {
        const [dx, dy] = DOTS[winDot[k]], tx = b.x + dx * b.k, ty = b.y + dy * b.k, e = sineIO(clamp(fu * 1.25 - k * .01));
        const x = lerp(w.x, tx, e), y = lerp(w.y, ty, e) - 60 * Math.sin(Math.PI * e), rw = lerp(w.w / 2, 4.6, e), rh = lerp(w.h / 2, 4.6, e);
        ctx.fillStyle = mixHex(LAMP.core, DATA.human, e); ctx.beginPath(); ctx.roundRect(x - rw, y - rh, rw * 2, rh * 2, Math.min(rw, rh) * e + 1); ctx.fill();
        if (e < 1) halo(ctx, x, y, 30, .35 * (1 - e), LAMP.body, LAMP.core);
      });
    }
    // right column: MALTA × OPENAI and its switch tag (the tag flies to door 1 in the HUD)
    const out1 = span(t, A.noInc - .2, A.noInc + .4);
    F.big(ctx, 'MALTA × OPENAI', 1360, 520, 56, span(t, A.malta + .2, A.malta + .9) * (1 - out1), { align: 'left', gold: .15 });
    const tg = span(t, sign1 + 1.3, sign1 + 1.85), fly = sineIO(span(t, sign1 + 3.6, sign1 + 4.5));
    if (tg > 0 && fly < 1) { const [hx, hy] = [F.hudDoorX(1), F.HUD.y + 44 - F.HUD.gh * 1.25 - 7]; ctx.save(); ctx.translate(lerp(1590, hx, fly), lerp(420, hy, fly) - 80 * Math.sin(Math.PI * fly)); ctx.scale(1 - fly * .95, 1 - fly * .95); F.switchTag(ctx, t, 0, 0, F.END[1].tag, tg); ctx.restore(); }
    // bottom: AI COURSE → CHATGPT PLUS, the twelve months
    F.label(ctx, 'AI COURSE → CHATGPT PLUS', IS.x, 766, span(t, A.course - .1, A.course + .5) * (1 - out1), { size: 28 });
    const bu = span(t, A.free - .25, A.free + .3) * (1 - out1);
    if (bu > 0) {
      const x0 = 612, sw = 40, g = 8;
      for (let m = 0; m < 12; m++) {
        const fill = span(t, A.free + .15 + m * .1, A.free + .35 + m * .1), x = x0 + m * (sw + g), a = clamp(bu * 2.5 - m * .08);
        if (a <= 0) continue;
        ctx.fillStyle = rgba(CREAM, .16 * a); ctx.beginPath(); ctx.roundRect(x, 800, sw, 22, 4); ctx.fill();
        if (fill > 0) { ctx.fillStyle = rgba(DATA.machine, a); ctx.beginPath(); ctx.roundRect(x, 800, sw * expoOut(fill), 22, 4); ctx.fill(); }
      }
      F.label(ctx, 'FREE FOR 1 YEAR', x0 + 12 * (sw + g) + 16, 820, span(t, A.year, A.year + .6) * (1 - out1), { align: 'left', size: 26 });
    }
    F.source(ctx, t, A.malta, A.noInc, TXT.e1.src);
    // 1.10: the smallest version beside the full idea (GUARANTEED INCOME, empty)
    const lab = span(t, A.catch - .3, A.catch + .1);
    F.label(ctx, TXT.e1.smallest, 560, 548, span(t, A.smallest - .1, A.smallest + .5) * (1 - lab), { size: 28, gold: .2 });
    F.label(ctx, TXT.e1.users, 560, 590, span(t, A.intel + .5, A.intel + 1.1) * (1 - lab), { size: 22, weight: 600, col: CREAM2 });
    const ib = span(t, A.noInc - .05, A.noInc + .7);
    if (ib > 0 && t < A.catch + 1.2) {
      const m = sineIO(span(t, A.catch + .05, A.catch + 1.2)), cu = 1 - span(t, A.catch, A.catch + .5);
      const r = { x: lerp(IBOX.x, CARD.x, m), y: lerp(IBOX.y, CARD.y, m), w: lerp(IBOX.w, CARD.w, m), h: lerp(IBOX.h, cardH(t), m) };
      ctx.save(); ctx.globalAlpha *= clamp(ib * 3);
      if (m > 0) { ctx.save(); ctx.globalAlpha *= m; ctx.fillStyle = lin(ctx, 0, r.y, 0, r.y + r.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 8); ctx.fill(); ctx.restore(); }
      const per = 2 * (r.w + r.h); ctx.setLineDash(m > .5 ? [] : [12, 9]); ctx.strokeStyle = rgba(m > .5 ? PAPER.edge : CREAM, .7); ctx.lineWidth = 2; ctx.lineDashOffset = -t * 8;
      ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w * (m > 0 ? 1 : expoOut(ib)), r.h, 8); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      if (cu > 0) {
        F.label(ctx, 'GUARANTEED INCOME', IBOX.x + IBOX.w / 2, IBOX.y - 20, span(t, A.noInc + .2, A.noInc + .8) * cu, { size: 24 });
        [IBOX.x + 140, IBOX.x + 280, IBOX.x + 420].forEach((x, k) => { ctx.save(); ctx.translate(lerp(x, r.x + 40, 1 - cu), lerp(IBOX.y + 230, r.y + 30, 1 - cu)); ctx.scale(cu, cu); B.coinStack(ctx, 0, 0, 70, 4, span(t, A.noInc + .3 + k * .08, A.noInc + 1 + k * .08), { dash: true }); ctx.restore(); });
        F.label(ctx, 'NOT IN MALTA', IBOX.x + IBOX.w / 2, IBOX.y + IBOX.h - 34, span(t, A.noInc + .6, A.noInc + 1.2) * cu, { size: 22, weight: 600, col: CREAM2 });
      }
    }
  }
  // Tegmark's table of twelve (screen px at VM). Row 1 grows at 1.12; the table folds into row 1 at 1.14.
  const grow1 = (t) => sineIO(span(t, A.prop - .1, A.prop + .7));
  const cardH = (t) => CARD.head + CARD.rh * 12 + 40 * grow1(t) + 16;
  const fold = (t) => sineIO(span(t, A.rank - .2, A.rank + .6));
  function tegTable(ctx, t) {
    if (t < A.catch + 1.15 || t > A.rank + .6) return null;
    const f = fold(t), g1 = grow1(t), hh = lerp(cardH(t), CARD.rh + 40 * g1 + 10, f);
    const r1y = CARD.y + lerp(CARD.head, 6, f);
    ctx.save();
    ctx.fillStyle = rgba(P.night0, .45 * (1 - f)); ctx.beginPath(); ctx.roundRect(CARD.x + 6, CARD.y + 8, CARD.w, hh, 8); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, CARD.y, 0, CARD.y + hh, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(CARD.x, CARD.y, CARD.w, hh, 8); ctx.fill();
    ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.rect(CARD.x, CARD.y, CARD.w, hh); ctx.clip();
    ctx.globalAlpha *= 1 - f; F.glowText(ctx, "TEGMARK'S TWELVE · LIFE 3.0", CARD.x + 30, CARD.y + 38, { size: 22, weight: 700, col: PAPER.faint, glow: false, spacing: .12 }); ctx.globalAlpha = 1;
    ROWS.forEach((e, i) => {
      const ru = span(t, A.catch + 1.15 + i * .06, A.catch + 1.65 + i * .06); if (ru <= 0) return;
      const yy = i === 0 ? r1y : CARD.y + CARD.head + i * CARD.rh + 40 * g1 - f * (i * CARD.rh + 40 * g1);
      const a = clamp(ru * 2) * (i === 0 ? 1 - span(f, .55, 1) : 1 - span(f, 0, .7));
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha *= a;
      if (i) { ctx.fillStyle = rgba(PAPER.edge, .35); ctx.fillRect(CARD.x + 24, yy, CARD.w - 48, 1.5); }
      F.glowText(ctx, e.name, CARD.x + 64, yy + 25, { size: 22, weight: 700, col: i === 0 ? GOLD.deep : PAPER.ink, glow: false, spacing: .06 });
      ctx.fillStyle = i === 0 ? GOLD.mid : rgba(PAPER.ink, .3); ctx.beginPath(); ctx.arc(CARD.x + 40, yy + 18, 6, 0, TAU); ctx.fill();
      const hk = span(t, A.every2 + i * .12, A.every2 + .35 + i * .12) * (1 - span(t, A.rank - .4, A.rank)) + (i === 0 ? span(t, A.prop + .4, A.prop + .9) * (1 - span(t, A.rank - .4, A.rank)) : 0);
      hook(ctx, CARD.x + CARD.w - 50, yy + 18, clamp(hk));
      if (i === 0 && g1 > 0) F.glowText(ctx, TXT.e1.property, CARD.x + 64, yy + 25 + 38 * g1, { size: 24, weight: 700, col: PAPER.ink, glow: false, spacing: .08, a: span(t, A.prop + .5, A.prop + 1) * (1 - f) });
      ctx.restore();
    });
    ctx.restore(); ctx.restore();
    return { x: CARD.x, y: CARD.y, w: CARD.w, h: hh };
  }
  function hook(ctx, x, y, lit) {   // the catch: a small hook in ink; lit = a lamp glow (something to object to)
    if (lit > 0) halo(ctx, x, y, 34, .55 * lit, LAMP.body, LAMP.core);
    ctx.strokeStyle = mixHex(PAPER.ink, GOLD.deep, lit * .6); ctx.lineWidth = 2.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y - 12); ctx.lineTo(x, y + 4); ctx.arc(x - 6, y + 4, 6, 0, Math.PI * .95); ctx.lineTo(x - 13, y - 1); ctx.stroke();
  }
  // the gold door from above: the folded table row 1 becomes its slab
  const G1 = [F.rowX(1), B.PLAN.y];
  function goldFromAbove(ctx, t) {   // yard coords
    if (t <= A.rank + .6) return;
    const r = { x: VM.x - W / 2 + CARD.x, y: VM.y - H / 2 + CARD.y, w: CARD.w, h: CARD.rh + 40 * grow1(t) + 10 }, m = sineIO(span(t, A.rank + .6, A.rank + 1.6));
    if (m < 1) {   // the strip flies up and narrows into the slab
      const x = lerp(r.x + r.w / 2, G1[0], m), y = lerp(r.y + r.h / 2, G1[1], m), w = lerp(r.w, F.ROW.w, m), h = lerp(r.h, 16, m);
      ctx.fillStyle = mixHex(PAPER.lit, GOLD.hot, m); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, lerp(8, 2, m)); ctx.fill();
      if (m > .2) halo(ctx, x, y, w * 1.2, .3 * m, GOLD.halo, GOLD.core);
    }
  }
  const ROADS = [[[1000, 700], [1220, 660], [1500, 480], 0.72], [[1200, 760], [1400, 660], [1600, 480], .6], [[1500, 780], [1600, 660], [1660, 480], .78], [[2200, 720], [1960, 620], [1740, 480], .55]];
  const TEG = 1;   // Tegmark's road (dashed)
  function roads(ctx, t) {   // yard coords
    const back = span(t, A.open + .3, A.open + 1.3);
    ROADS.forEach(([a, b, c, len], k) => {
      const u = span(t, A.notRoad + .1 + k * .15, A.notRoad + 1.2 + k * .15) * len * (1 - back); if (u <= 0) return;
      const pts = F.bez(a, b, c, [G1[0] + (k - 1.5) * 10, G1[1] + 34], 26);
      if (k === TEG) F.lightLine(ctx, pts, u, { w: 3.5, dash: [14, 10], a: .9, glow: false });
      else F.track(ctx, pts, u, { gap: 14, a: .8, lw: 2.4 });
      const gp = bump(t, A.open - .1, 1.4); if (gp > 0) { const [ex, ey] = B.ptOn(pts, u); halo(ctx, ex, ey, 40, .5 * gp, LAMP.body, LAMP.core); }
    });
  }
  function drawYard(ctx, t) {
    const v = yv(t), fl = flood(t);
    const cx = win0.reduce((s, w) => s + w.x, 0) / win0.length, cy = win0.reduce((s, w) => s + w.y, 0) / win0.length;
    const rad = fl * 1500;
    if (fl < 1) S.rooms(ctx, t, rcv(t), roomOpts(t));
    ctx.save();
    if (fl < 1) { ctx.beginPath(); ctx.arc(cx, cy, rad, 0, TAU); ctx.clip(); }
    F.yard(ctx, t, v, { lx: lerp(1686, 1500, span(t, A.rank, A.notRoad + 1)), ly: 470, pool: .8, rails: 1 });
    // the twelve from above (planScene): the other slabs light up as the table folds; the fan draws on from you at the end
    const pa = span(t, A.rank + .5, A.rank + 1.6), fan = span(t, A.open + .5, A.open + 2.2);
    if (pa > 0) B.planScene(ctx, t, v, { slabs: (n) => ({ lit: n === 1 ? 1 : lerp(.25, .6, fan), a: n === 1 ? span(t, A.rank + 1.5, A.rank + 1.6) : pa }), fan, lev: planLev(t, T), you: fan });
    F.inView(ctx, v, () => { goldFromAbove(ctx, t); roads(ctx, t);
      const gr = span(t, A.rank + 1.2, A.rank + 2.2) * (1 - span(t, A.notRoad - .2, A.notRoad + .5));   // the goal mark
      if (gr > 0) { ctx.strokeStyle = rgba(GOLD.line, .8 * gr); ctx.lineWidth = 3; for (const rr of [60, 92]) { ctx.beginPath(); ctx.arc(G1[0], G1[1], rr * expoOut(gr) + 2 * Math.sin(t * 1.3 + rr), 0, TAU); ctx.stroke(); } }
    });
    // Malta, the badge and the table live on the yard at VM
    const mo = 1 - span(t, A.catch + .9, A.catch + 1.25);
    inRef(ctx, v, VM, () => maltaGroup(ctx, t, { shape: span(t, A.malta - .3, A.malta + .9), winHere: t >= A.malta + .6 }), mo);
    inRef(ctx, v, VM, () => { tegTable(ctx, t); }, 1);
    inRef(ctx, v, VM, () => {
      F.goldText(ctx, [[TXT.e1.objection.split(' · ')[0], .15]], W / 2, 176, 44, F.rise(span(t, A.himself + .2, A.himself + .9) * (1 - span(t, A.rank - .5, A.rank + .1))), { serif: true, align: 'center', glow: true });
      F.label(ctx, 'TEGMARK · LIFE 3.0', W / 2, 214, span(t, A.himself + .5, A.himself + 1.1) * (1 - span(t, A.rank - .5, A.rank + .1)), { size: 22, weight: 600, col: CREAM2 });
    });
    ctx.restore();
    // the flood edge: a soft lamp ring that carries the change of world
    if (fl > 0 && fl < 1) { ctx.save(); ctx.strokeStyle = rgba(LAMP.core, .5 * Math.sin(Math.PI * fl)); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, rad, 0, TAU); ctx.stroke(); ctx.restore(); }
    inRef(ctx, v, VM, () => maltaOverlay(ctx, t), 1);
    // 1.14 – 1.16 labels (screen px)
    const [gx, gy] = F.toScreen(v, G1[0], G1[1]);
    F.label(ctx, TXT.e1.dest, gx, gy + 190, span(t, A.prosp - .2, A.prosp + .5) * (1 - span(t, A.notRoad - .2, A.notRoad + .3)), { size: 28, gold: .5 });
    { const [a, b, c] = ROADS[TEG], [lx, ly] = F.toScreen(v, ...B.ptOn(F.bez(a, b, c, [G1[0] - 5, G1[1] + 34], 26), .3)); F.label(ctx, "TEGMARK'S VERSION", lx - 150, ly + 8, span(t, A.his, A.his + .6) * (1 - span(t, A.open + .3, A.open + .8)), { size: 24 }); }
    F.big(ctx, TXT.e1.road, W / 2, 170, 72, span(t, A.which + .15, A.which + .85) * (1 - span(t, A.open + 1.0, A.open + 1.6)), { gold: .5 });
    F.scenarioTag(ctx, (1 - span(t, A.may - .3, A.may + .2)));
    F.counterHud(ctx, t, T, { parked: t > K.off - .4 ? 'key' : undefined });
    if (t > K.off - .4) keyPocket(ctx, t);
  }
  return [
    { t: R.a, draw: (ctx, t) => { if (t < A.may - .15) { drawArc(ctx, t); if (t >= PLATE) { F.scenarioTag(ctx, span(t, A.morn + .2, A.morn + .8)); F.counterHud(ctx, t, T); } } else drawYard(ctx, t); }, print: F.PRINT71 },
  ];
}
// the key stays in its pocket after the counter leaves (c13 S.14 takes it out)
export function keyPocket(ctx, t) { const [px, py] = F.hudPocket('key'); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.keyGlyph(ctx, t, px, py, 30, { a: 1 }); ctx.restore(); }
