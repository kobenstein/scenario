// Film 78 · c08 (B2) · 'Six months after that famous Friday' (380.71) → 'He wants more than a machine that obeys' (446.48) · ONE take,
// one space (the Leitbild ground, GY 860): the tower right, the new small building SAFE SUPERINTELLIGENCE left of it, the record further left.
//   7.01 ★ A2 = thumbnail C: the man walks away from the tower of light toward us, long shadow; MAY 14, 2024 · HE LEFT OPENAI
//   7.02  his post grows out of him as a card (no logo): "I have made the decision to leave OpenAI."
//   7.03  the tower door behind him closes slowly and softly, its light stays on (lib/b2_seams.mjs leitA2)
//   7.04  the card turns over: "a project that is very personally meaningful to me" (lit as spoken); he walks on past the camera
//   7.05  the camera trucks left: a small building rises; the card flies into its sign SAFE SUPERINTELLIGENCE · JUNE 2024
//   7.06  the facade lifts: a ring taller than the people beside it, a gold frame SAFE draws round it
//   7.07  ONE GOAL · ONE PRODUCT on the beats        7.08 the facade closes; empty slots run away from it to a far post NOTHING ELSE
//   7.09  the slots fly together into a value bar $32 BILLION · VALUATION, APR 2025
//   7.10  an offer card META · OFFER TO BUY slides in; on "He said no" it slides back out
//   7.11  a chip comes down out of the sky: NVIDIA · INVESTED · JULY 2026; it sends computers onto the roof
//   7.12  push into the shop window: NOTHING TO BUY      7.13 PRODUCT — · MODEL — · PAPER — on the beats, AS OF NOV 2026
//   7.14  the lab door RESEARCH, light under it          7.15 its window frosts, a cream ?
//   7.16  pull back: the bar stands on his life line (markers 1–4)   7.17 the recipe card rises out of marker 3, its DATA gauge drains
//   7.18  push toward the light under the lab door (doorSeam → c09)
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f78_kit.mjs';
import * as S from '../lib/f78_world.mjs';
import * as B from '../lib/b2_kit.mjs';
import { leitA2, doorSeam, drawSSI, SSI, SSI_DOOR, REC_VIEW } from '../lib/b2_seams.mjs';
import { createCanvas } from '@napi-rs/canvas';
const { W, H, P, clamp, lerp, span, sineIO, expoOut, expoIn, rgba, halo, mixHex } = E;
const { mv, land, rise, GOLD, CREAM, CREAM2, COOL, INK } = F;
const TAU = Math.PI * 2;

export default (T, R) => {
  const G = (p, n = 0, a = -1) => T.G(p, n, a);
  const A2 = leitA2(T), DS = doorSeam(T);
  const T0 = A2.T1, tBy = A2.tOwn, tDoor = A2.tDoor, tLeaving = A2.tLeaving, tWeeks = A2.tWeeks;
  const tProj = G('a project that is very personally', 0, tLeaving), tSSI = G('Safe Superintelligence', 0, tWeeks);
  const tMachine = G('A machine smarter than any of us'), tSafe = G('built to be safe', 0, tMachine);
  const tGoal = G('One goal', 0, tMachine), tProduct = G('One product', 0, tGoal), tUntil = G('And until it exists', 0, tGoal), tNothing = G('nothing else', 0, tUntil);
  const tInv = G('Investors valued it'), tBil = G('thirty-two billion dollars', 0, tInv);
  const tMeta = G('Meta offered to buy it'), tNo = G('He said no', 0, tMeta);
  const tNv = G('And Nvidia invested'), tChip = G('the chipmaker', 0, tNv);
  const tYet = G('And yet, there is still nothing'), tBuy = G('nothing you can buy', 0, tYet);
  const tNoP = G('No product', 0, tYet), tNoM = G('No model', 0, tNoP), tNoPaper = G('Not even a research paper', 0, tNoP);
  const tRes = G('What it does, he says'), tIsRes = G('is research', 0, tRes), tExact = G('What exactly, it has not shown');
  const tMoney = G('So all that money'), tRecord = G('on his record', 0, tMoney), tBet = G('And on his bet'), tOld = G('the old recipe is running out', 0, tBet);
  const tSo = DS.tSo;

  // ---------------------------------------------------------------------------------------------- the world (Leitbild design space)
  const x0 = SSI.x - SSI.w / 2, top = S.GY - SSI.h;
  const SHOP = { x: x0 + SSI.w * .08, y: S.GY - SSI.h * .46, w: SSI.w * .5, h: SSI.h * .4 }, SHOPC = { x: SHOP.x + SHOP.w / 2, y: SHOP.y + SHOP.h / 2 };
  const SIGN = { x: SSI.x - SSI.w * .34, y: top - SSI.h * .2, w: SSI.w * .68, h: SSI.h * .16 };
  const ROW = { x1: x0 - 40, x0: -1500, y: S.GY - 46, n: 9 }, FAR = { x: -1580 };
  const BAR = { x: -1280, w: 150, h: 520 }, LL = { x0: -1700, x1: -150 };
  const M3 = lerp(LL.x0, LL.x1, .66), RC = { w: 600, x: M3 - 300, y: 120 };
  const CHIP = { x: -420, y: 250, s: 150 };
  const ROOF = { x0: x0 + 60, x1: x0 + SSI.w - 60, y: top };

  // ---------------------------------------------------------------------------------------------- the camera: A2's keys, then mine, then the door push
  const K = [...A2.K,
    [tSSI + .3, { x: 300, y: 600, s: 1.08 }], [tMachine + 1.6, { x: 250, y: 650, s: 1.38 }], [tProduct + .6, { x: 250, y: 656, s: 1.44 }],
    [tNothing + .5, { x: -660, y: 640, s: .74 }], [tBil + .4, { x: -930, y: 610, s: .86 }], [tNo + .4, { x: -980, y: 612, s: .84 }],
    [tChip + .8, { x: -420, y: 560, s: .86 }], [tBuy + .3, { x: SHOPC.x, y: SHOPC.y, s: 4.1 }], [tNoPaper + 1.2, { x: SHOPC.x, y: SHOPC.y + 2, s: 4.3 }],
    [tIsRes + .2, { x: SSI_DOOR.x, y: 772, s: 2.9 }], [tExact + 1.6, { x: SSI_DOOR.x, y: 765, s: 3.1 }],
    [tRecord + .4, { x: -900, y: 620, s: .82 }], [tSo, REC_VIEW],
  ];
  const camW = (t) => S.drift2(S.camPath2(t, K), t, .7, 31);
  const cam = (t) => (t >= tSo ? DS.cam(t) : camW(t));

  // ---------------------------------------------------------------------------------------------- cards (screen space)
  const POST = { text: 'I have made the decision to leave OpenAI.', head: 'HIS POST', credit: 'Ilya Sutskever · May 14, 2024' };
  const QUOTE = { text: 'a project that is very personally meaningful to me', head: 'HE WROTE', credit: 'Ilya Sutskever · May 14, 2024' };
  const CARD = { x: 830, y: 120, w: 1000, size: 48 };
  const qTimes = B.litTimes(T, QUOTE.text.split(/\s+/).length, [[0, 'a project that is very personally', 'meaningful to me', tLeaving]]);
  const pTimes = POST.text.split(/\s+/).map(() => null);
  const dummy = createCanvas(8, 8).getContext('2d');
  const hP = B.qcard(dummy, 0, { ...CARD, ...POST, u: 1 }).h, hQ = B.qcard(dummy, 0, { ...CARD, ...QUOTE, u: 1 }).h;
  const flip = (t) => span(t, tLeaving + .05, tLeaving + .65);          // the post card turns over into the quote card
  const drawCard = (ctx, t, Rr) => {
    const f = flip(t), back = f >= .5, sy = Math.abs(Math.cos(Math.PI * f)), hh = back ? hQ : hP;
    ctx.save(); ctx.translate(Rr.x + Rr.w / 2, Rr.y + Rr.h / 2); ctx.scale(Rr.w / CARD.w, (Rr.h / hh) * Math.max(.02, sy)); ctx.translate(-CARD.x - CARD.w / 2, -CARD.y - hh / 2);
    B.qcard(ctx, t, back ? { ...CARD, ...QUOTE, u: 1, times: qTimes, inkAll: true } : { ...CARD, ...POST, u: 1, times: pTimes, inkAll: true });
    ctx.restore();
  };

  // ---------------------------------------------------------------------------------------------- pieces
  const slotRect = (ctx, cx, cy, w, h, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = rgba(CREAM2, .8); ctx.lineWidth = 2.5; ctx.setLineDash([9, 7]); ctx.strokeRect(cx - w / 2, cy - h / 2, w, h); ctx.restore(); };
  const ROWS = Array.from({ length: ROW.n }, (_, i) => ({ x: lerp(ROW.x1, ROW.x0, (i + .5) / ROW.n), i }));
  const slotW = (ROW.x1 - ROW.x0) / ROW.n * .78, slotH = 70;
  const inside = (t) => (ctx, room) => {
    // the room: a lighter back wall so the people read; the ring (taller than them), the frame SAFE, ONE GOAL · ONE PRODUCT
    ctx.fillStyle = E.lin(ctx, 0, room.y, 0, room.y + room.h, [[0, mixHex(P.ind2, P.blue1, .35)], [1, mixHex(P.ind1, P.blue1, .5)]]); ctx.fillRect(room.x, room.y, room.w, room.h);
    const rx = SSI.x, ry = S.GY - 180, rr = 120 * (1 + .015 * Math.sin(t * .8));
    halo(ctx, rx, ry, 380, .35, COOL.halo, COOL.core);
    F.ring(ctx, t, rx, ry, rr, { think: .6 });
    const ppl = [[SSI.x - 300, 1, 112], [SSI.x - 205, 1, 104], [SSI.x + 215, -1, 110], [SSI.x + 305, -1, 100]];
    ppl.forEach(([px, d, h], i) => { halo(ctx, px, S.GY - h * .6, h * .9, .22, GOLD.halo, GOLD.hot); E.person(ctx, px, S.GY, h, { dir: d, look: .55, light: .6, rim: GOLD.line, breath: true, armR: i === 1 ? [.25, .2] : undefined }); });
    // the people's size marks: a cream tick at their height, the ring's at its top (taller)
    const fu = span(t, tSafe - .1, tSafe + 1.3);
    B.safeFrame(ctx, t, { x: rx - rr - 22, y: ry - rr - 22, w: (rr + 22) * 2, h: (rr + 22) * 2 }, fu, { label: 'SAFE', size: 30, w: 3.5 });
    const g1 = rise(span(t, tGoal - .05, tGoal + .45)), g2 = rise(span(t, tProduct - .05, tProduct + .45));
    if (g1 > 0) F.goldText(ctx, [['ONE GOAL', 1]], room.x + 140, room.y + 62, 32, g1, { serif: false, weight: 800, spacing: .08, align: 'center' });
    if (g2 > 0) F.goldText(ctx, [['ONE PRODUCT', 1]], room.x + room.w - 150, room.y + 62, 32, g2, { serif: false, weight: 800, spacing: .08, align: 'center' });
  };
  // the computers the chip sends (7.11): small boxes on arcs from the chip onto the roof, where they sink in
  const BOX = Array.from({ length: 7 }, (_, i) => ({ t0: tChip - .2 + i * .28, x: lerp(ROOF.x0 + 40, ROOF.x1 - 40, (i * 3 % 7) / 6) }));

  const draw = (ctx, t) => {
    const c = cam(t);
    if (t >= tSo + 2.6) { DS.draw(ctx, t, { cam: c }); ctx.setTransform(1, 0, 0, 1, 0, 0); return; }   // only the door is in view: the boundary picture
    S.stage(ctx, t, c, { dawn: .12 });
    // the Leitbild (tower, door, the man walking toward us and past us) + date tag MAY 14, 2024 · HE LEFT OPENAI
    A2.draw(ctx, t, { cam: c });
    S.view(ctx, c);

    // ---------------------------------------------------------------- the building (7.05 …)
    const rs = mv(t, tWeeks + .2, 2.0);
    if (rs > 0) {
      const cut = mv(t, tMachine - .35, 1.9) * (1 - mv(t, tUntil - .1, 1.8));
      drawSSI(ctx, t, { rise: rs, lit: .4 + .6 * span(t, tWeeks + 1, tSSI), sign: span(t, tSSI - .12, tSSI + .55), cut, inside: inside(t),
        plate: span(t, tRes + .15, tRes + .95), frost: span(t, tExact + .15, tExact + 1.3), glow: .7 + .3 * span(t, tRes - .5, tRes + .5) });
    }
    // ---------------------------------------------------------------- 7.08 the row of empty slots, the far post NOTHING ELSE; 7.09 they fly into the bar
    const rowU = span(t, tUntil + .35, tNothing + .1);
    const POSTu = land(t, tNothing - .15, .7) * (1 - mv(t, tInv + .6, 1.2));
    for (const Q of ROWS) {
      const k = clamp(rowU * (ROW.n + 1) - Q.i); if (k <= 0) continue;
      const f0 = tInv + .05 + (Math.abs(Q.x - BAR.x) / 1400) * .9, fp = span(t, f0, f0 + .7);
      if (fp >= 1) continue;
      const e = expoIn(fp), x = lerp(Q.x, BAR.x, e), y = lerp(ROW.y + (1 - expoOut(k)) * 30, S.GY - 40, e) - Math.sin(Math.PI * fp) * 90, sc = lerp(1, .45, e);
      slotRect(ctx, x, y, slotW * sc, slotH * sc, clamp(k * 2));
    }
    if (POSTu > 0) {
      const ph = 190 * POSTu;
      F.goldSpan(ctx, [[FAR.x, S.GY], [FAR.x, S.GY - ph]], 0, 1, { w: 3, spark: false });
      halo(ctx, FAR.x, S.GY - ph, 60, .4 * POSTu, GOLD.halo, GOLD.core);
      F.goldText(ctx, [["NOTHING ELSE", .35]], FAR.x, S.GY - ph - 34, 42, rise(span(t, tNothing - .05, tNothing + .5)) * POSTu, { serif: false, weight: 800, spacing: .08, align: 'center', col: CREAM });
    }
    // ---------------------------------------------------------------- 7.16 the life line under the bar (his record, markers 1–4)
    const llU = mv(t, tMoney - .1, 1.6);
    if (llU > 0) {
      F.lifeLine(ctx, t, LL.x0, LL.x1, S.GY, { u: llU, years: [], markers: S.RECORD_MARKERS().map((M, i) => ({ ...M, box: undefined, drop: span(t, tMoney + .3 + i * .18, tMoney + 1 + i * .18) })), r: 28 });
      if (llU > .6) F.goldText(ctx, [['HIS RECORD', .3]], LL.x0 + 10, S.GY - 26, 30, rise(span(t, tRecord - .2, tRecord + .5)), { serif: false, weight: 700, spacing: .12, col: CREAM });
    }
    // ---------------------------------------------------------------- 7.09 the value bar $32 BILLION
    const bu = mv(t, tInv + .45, tBil + .35 - (tInv + .45));
    if (t > tInv) {
      const by = S.GY;
      B.valueBar(ctx, t, BAR.x, by, BAR.w, BAR.h, bu, { frame: clamp((t - tInv) * 3) });
      const lu = rise(span(t, tBil - .1, tBil + .6));
      if (lu > 0) {
        F.goldText(ctx, [['$32 BILLION', 1]], BAR.x - BAR.w / 2 - 34, by - BAR.h + 64, 76, lu, { serif: true, align: 'right' });
        F.goldText(ctx, [['VALUATION · APR 2025', 0]], BAR.x - BAR.w / 2 - 36, by - BAR.h + 112, 28, rise(span(t, tBil + .2, tBil + .9)), { serif: false, weight: 700, spacing: .1, align: 'right', col: CREAM });
      }
    }
    // ---------------------------------------------------------------- 7.10 the offer card META · OFFER TO BUY (slides in, slides back out)
    const mIn = land(t, tMeta - .1, .9), mOut = expoIn(span(t, tNo + .05, tNo + .75));
    if (mIn > 0 && mOut < 1) {
      const cx = lerp(-2350, -1700, mIn) - 900 * mOut;
      ctx.save(); ctx.translate(cx, 20); ctx.scale(1.35, 1.35); F.dataCard(ctx, t, 0, 0, 400, { u: 1, big: 'META', small: 'OFFER TO BUY', bigSize: 84 }); ctx.restore();
      F.goldSpan(ctx, [[cx + 540, 210], [lerp(cx + 540, BAR.x - BAR.w / 2 - 10, 1), S.GY - BAR.h - 20]], 0, span(t, tMeta + .5, tMeta + 1.1) * (1 - mOut), { w: 1.5, spark: false, a: .5 });
    }
    // ---------------------------------------------------------------- 7.11 the chip NVIDIA · INVESTED · JULY 2026; computers onto the roof
    const chU = land(t, tNv - .15, 1.1);
    if (chU > 0) {
      const dock = sineIO(span(t, tYet - .2, tYet + 1.8)), cs = lerp(CHIP.s, 64, dock);
      const cy = lerp(CHIP.y - (1 - chU) * 420, ROOF.y - 40, dock), cxp = lerp(CHIP.x, SSI.x + SSI.w * .3, dock);
      if (dock < 1) F.goldSpan(ctx, [[cxp, -600], [cxp, cy - cs * .62]], 0, chU, { w: 1.2, col: COOL, spark: false, a: .35 * (1 - dock) });
      B.chip(ctx, t, cxp, cy, cs, clamp(chU * 1.6));
      const lu = rise(span(t, tNv + .15, tNv + .8)) * (1 - span(t, tYet - .3, tYet + .3));
      if (lu > 0) {
        F.goldText(ctx, [['NVIDIA', 0]], CHIP.x, cy + CHIP.s * .62 + 58, 40, lu, { serif: false, weight: 800, spacing: .1, align: 'center', col: COOL.text });
        F.goldText(ctx, [['INVESTED · JULY 2026', 0]], CHIP.x, cy + CHIP.s * .62 + 100, 28, lu, { serif: false, weight: 700, spacing: .1, align: 'center', col: CREAM });
      }
      for (const Bx of BOX) {
        const p = span(t, Bx.t0, Bx.t0 + 1.1); if (p <= 0 || p >= 1) continue;
        const e = sineIO(p), x = lerp(CHIP.x + CHIP.s * .5, Bx.x, e), y = lerp(cy, ROOF.y + 8, e * e) - Math.sin(Math.PI * e) * 160;
        ctx.save(); ctx.beginPath(); ctx.rect(x - 60, -2000, 120, ROOF.y + 2000); ctx.clip();
        ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.strokeStyle = rgba(COOL.body, .9); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(x - 22, y - 16, 44, 32, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = rgba(COOL.core, .75); for (let k = 0; k < 3; k++) ctx.fillRect(x - 14, y - 8 + k * 7, 28 - k * 8, 2.5);
        ctx.restore();
        if (p > .9) halo(ctx, x, ROOF.y, 40, .5 * (1 - (p - .9) * 10), COOL.halo, COOL.core);
      }
    }
    // ---------------------------------------------------------------- 7.12 / 7.13 in the shop window: NOTHING TO BUY · PRODUCT — · MODEL — · PAPER —
    const nb = rise(span(t, tBuy - .1, tBuy + .6));
    if (nb > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(SHOP.x, SHOP.y, SHOP.w, SHOP.h); ctx.clip();
      halo(ctx, SHOPC.x, SHOPC.y, SHOP.w * .55, .12 * nb, GOLD.halo, GOLD.hot);
      const up = sineIO(span(t, tNoP - .5, tNoP + .2));
      F.goldText(ctx, [['NOTHING TO BUY', 0]], SHOPC.x, lerp(SHOPC.y + 8, SHOP.y + 30, up), lerp(22, 15, up), nb, { serif: false, weight: 800, spacing: .1, align: 'center', col: CREAM });
      [[tNoP, 'PRODUCT'], [tNoM, 'MODEL'], [tNoPaper, 'PAPER']].forEach(([tt, lab], i) => {
        const k = land(t, tt - .08, .5); if (k <= 0) return;
        const sx = SHOPC.x + (i - 1) * 118, sy = SHOP.y + 82 + (1 - k) * 14;
        slotRect(ctx, sx, sy, 92, 50, clamp(k * 3));
        F.goldText(ctx, [['—', 0]], sx, sy + 9, 26, k, { serif: true, align: 'center', col: CREAM });
        F.goldText(ctx, [[lab, 0]], sx, sy + 48, 13, k, { serif: false, weight: 800, spacing: .1, align: 'center', col: CREAM });
      });
      ctx.restore();
    }
    // ---------------------------------------------------------------- 7.17 the recipe card out of marker 3, its DATA gauge drains
    const rcU = land(t, tBet - .1, .9);
    if (rcU > 0) {
      const [mx] = [M3];
      F.goldSpan(ctx, [[mx, S.GY - 30], [mx, RC.y + RC.w * .56]], 0, rcU, { w: 1.5, spark: false, a: .6 });
      F.recipeCard(ctx, t, RC.x, RC.y + (1 - rcU) * 200, RC.w, { u: rcU, net: 1, data: lerp(1, .12, mv(t, tOld + .1, 2.0)) });
    }

    // ---------------------------------------------------------------- screen space: cards, date tags
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // 7.02 / 7.04 his post, turned into the quote; 7.05 it flies into the sign
    const cg = expoOut(span(t, tBy - .15, tBy + .65));
    if (cg > 0) {
      const m = A2.man(Math.min(t, tBy - .15)), [ox, oy] = S.toScreen(c, m.x, m.y - m.h * .62);
      const from = { x: ox - 30, y: oy - 14, w: 60, h: 28 }, full = { x: CARD.x, y: CARD.y, w: CARD.w, h: flip(t) >= .5 ? hQ : hP };
      const toSign = sineIO(span(t, tSSI - .75, tSSI + .05));
      if (toSign < 1) {
        let Rr = B.lerpR(from, full, cg);
        if (toSign > 0) { const sg = S.rectToScreen(c, SIGN); Rr = B.lerpR(full, sg, toSign); }
        drawCard(ctx, t, Rr);
        if (toSign > .4) { ctx.fillStyle = rgba(GOLD.hot, .9 * span(toSign, .4, 1)); ctx.fillRect(Rr.x, Rr.y, Rr.w, Rr.h); }
      }
    }
    const jt = rise(span(t, tSSI + .4, tSSI + 1.1)) * (1 - span(t, tMachine + 1.2, tMachine + 1.7));
    if (jt > 0) F.dateTag(ctx, 110, 150, 'JUNE 2024', jt, { size: 26 });
    const ao = rise(span(t, tNoPaper + .3, tNoPaper + 1)) * (1 - span(t, tRes + .2, tRes + .7));
    if (ao > 0) F.dateTag(ctx, 110, 150, F.SOURCES.asOf, ao, { size: 26 });
  };

  return [{ t: R.a, draw, print: F.PRINT78 }];
};
