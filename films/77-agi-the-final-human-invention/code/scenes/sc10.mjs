// c10 · B3 · line 4 CONTROL · "That's the fourth line" → "Rules work from the outside". Plan: docs/shots.md 5.01–5.11 · bible: docs/MOTION.md.
// One entry; one world (the card above, the board below it, the ring to the right, the road to your phone further right), a camera that
// follows the carrier (F.lookPath keyed on phrases). It starts EXACTLY on S.plateTuring (world = the plate's creep space at R.a).
// The world function also carries 5.12–5.13 (pull back, into the package): sc11 draws it until its portal is through (one function, so the
// inner seam c10 → c11 is the same frame by construction).
//
// | ID   | anchor (phrase)           | motif                                                                                          | type | carrier → next |
// |------|---------------------------|------------------------------------------------------------------------------------------------|------|----------------|
// | 5.01 | That's the fourth line    | "control" lifts off the Turing card (a paper gap stays), falls (the camera tilts after it) and flaps into row 4: CONTROL (cream) | EXPL | row 4 |
// | 5.02 | In Good's sentence        | the ring sends a cool arrow to you · the condition strip (Good 1965, exact) · THE MACHINE TELLS US HOW | EXPL | the arrow |
// | 5.03 | But that only works       | a gate DOCILE? stands before the arrow, it stops there: ONLY IF; "docile" underlined in the strip | EXPL | the gate |
// | 5.04 | Making sure of that       | you turn, take the stylus of light lying at row 4, raise it: OUR JOB                           | MIX  | the stylus     |
// | 5.05 | And people have started   | one becomes many: indigo figures rise round you, a light in each hand (pull back)             | SCENE| the floor line |
// | 5.06 | Follow a new A.I. model   | the ring folds into a package; the floor becomes a road to your phone; two gates draw themselves | MIX | gate 1 |
// | 5.07 | In the United States      | gate 1: the package stops, the lid opens, two testers look in · CAISI (U.S. NIST) · TESTED BEFORE LAUNCH | MIX | the gate |
// | 5.08 | Five of the biggest       | four more packages queue: 5, numbered as they light · TESTING AGREEMENTS WITH 5 DEVELOPERS · SINCE 5 MAY 2026 | EXPL | the gate |
// | 5.09 | Voluntarily               | where the barrier would be: only a dashed outline · VOLUNTARY                                   | MIX  | the road       |
// | 5.10 | In Europe, since August   | the package rolls on to gate 2: a gold barrier swings down, testers, a fine slip · EU AI OFFICE · SINCE 2 AUG 2026 · FINES UP TO €15 MILLION OR 3% OF GLOBAL TURNOVER | MIX | the barrier |
// | 5.11 | As a last resort          | the package is lifted off the road on a cream hook · RECALL AS A LAST RESORT                     | MIX  | the gates      |
// | 5.12 | Rules work from (c11)     | pull back: the package set down between the gates; both act on its shell only · RULES WORK FROM THE OUTSIDE | EXPL | the package |
// | 5.13 | And the machine itself    | (sc11) the camera goes into the package window: portal → the ring inside                       | EXPL | the ring       |
import * as F from '../lib/f77_kit.mjs';
import * as S from '../lib/f77_seams.mjs';
import * as X from '../lib/b3_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, rise, GOLD, CREAM, COOL } = F;

export const PRINT = F.PRINT77;
export default async (T, R) => [{ t: R.a, draw: build10(T).draw, print: PRINT }];

// ------------------------------------------------------------------------------------------------ layout (world px; at R.a world = plate space)
const BRD = { x: 660, y: 1180, w: 600, rowH: 80, head: 100 };
const ROW4 = { x: BRD.x + 20, y: BRD.y + BRD.head + 3 * BRD.rowH, w: BRD.w - 40, h: BRD.rowH };
const FLOOR = 1650;
const RING = [2060, 1330], RR = 120;
const YOU = { x: 1370, h: 210 };
const STY0 = [1150, 1558];                       // the stylus lies in row 4 (right part), tip to the left
const G1 = 2760, G2 = 3560, GH = 300, GW = 260, PHONE = [4330, 1560];
const PS = 110;                                  // package height
const MANY = [[1500, 186, -1], [1610, 198, -1], [1720, 176, -1], [1840, 192, -1], [1960, 170, -1], [2080, 184, -1], [2200, 174, -1], [520, 180, 1], [420, 168, 1], [2320, 166, -1]];

export function build10(T) {
  const G = (p, after) => T.G(p, 0, after), GE = (p, after) => T.GE(p, 0, after);
  const a = {};
  a.t0 = T.G("That's the fourth line"); a.ctrl = G('control', a.t0);
  a.good = G("In Good's sentence", a.t0); a.tells = G('tells us how', a.good);
  a.but = G('But that only works', a.t0); a.docile = G('docile to begin', a.but);
  a.job = G('Making sure of that', a.t0); a.our = G('our job', a.job);
  a.people = G('And people have started', a.t0);
  a.follow = G('Follow a new', a.t0); a.phone = G('your phone', a.follow);
  a.us = G('In the United States', a.t0); a.test1 = G('test it before', a.us); a.launch = G('launch', a.us);
  a.five = G('Five of the biggest', a.t0); a.agreed = G('agreed to that', a.five);
  a.vol = G('Voluntarily', a.five);
  a.eu = G('In Europe', a.t0); a.reg = G('regulators can test', a.eu); a.fine = G('fine its maker', a.eu);
  a.last = G('As a last resort', a.t0); a.off = G('off the market', a.last);
  a.rules = G('Rules work from', a.t0); a.outside = G('the outside', a.rules);
  a.itself = G('And the machine itself', a.t0);
  return scene(a, T);
}

function scene(a, T) {
  const wb = X.turingWord('control');
  // ---------------------------------------------------------------- times
  const tLift = a.t0 + .03, tFly0 = a.t0 + .42, tFly1 = a.ctrl + .02;      // the word: lifts, falls, lands in row 4
  const tRingIn = a.follow - .15, tRingOut = a.follow + .55;              // the ring folds into the package
  const tPortal = a.itself - .12;                                         // sc11 takes over with the portal from here
  // the package's x along the road (lead package)
  const pkgX = (t) => {
    if (t < tRingOut) return RING[0];
    if (t < a.us + .2) return lerp(RING[0], G1, sineIO(span(t, a.follow + .7, a.us + .2)));
    if (t < a.eu + .25) return G1;
    if (t < a.reg) return lerp(G1, G2, sineIO(span(t, a.eu + .25, a.reg - .05)));
    if (t < a.rules + .1) return G2;
    return lerp(G2, (G1 + G2) / 2, sineIO(span(t, a.rules + .1, a.rules + 1.4)));
  };
  const pkgLift = (t) => sineIO(span(t, a.last + .45, a.off + .1)) * 230 * (1 - sineIO(span(t, a.rules + .1, a.rules + 1.4)));
  const lidOf = (t) => smooth(span(t, a.test1 - .1, a.test1 + .5)) * (1 - smooth(span(t, a.eu - .2, a.eu + .3))) + smooth(span(t, a.reg + .1, a.reg + .6)) * (1 - smooth(span(t, a.last, a.last + .4)));
  // ---------------------------------------------------------------- camera keys (on phrases; the camera trails its carrier)
  const K = [
    [a.t0, 960, 520, 1], [tFly0 - .05, 960, 545, S.creepZ(tFly0 - .05, a.t0)], [tFly1 + .1, 990, 1360, .97], [a.good - .1, 1010, 1380, .97],
    [a.good + 1.0, 1560, 1390, .9], [a.but - .05, 1600, 1395, .9], [a.but + .9, 1640, 1410, .96],
    [a.job - .05, 1560, 1420, .98], [a.job + .9, 1300, 1450, 1.12], [a.people - .05, 1290, 1455, 1.13],
    [a.people + 1.3, 1430, 1390, .7], [a.follow + .1, 1520, 1400, .66], [a.follow + 1.4, 3150, 1470, .6], [a.phone + .6, 3170, 1470, .6],
    [a.us + .9, 2720, 1490, .9], [a.launch + .3, 2700, 1490, .93], [a.five + .8, 2420, 1480, .78], [a.vol - .1, 2460, 1480, .8], [a.vol + .9, 2560, 1490, .86],
    [a.eu + 1.2, 3330, 1480, .78], [a.reg + .6, 3600, 1470, .92], [a.fine + .9, 3660, 1460, .9],
    [a.last + .4, 3600, 1440, .86], [a.off + .6, 3570, 1400, .82], [a.rules + .2, 3500, 1420, .78], [a.rules + 1.6, 3160, 1480, .56], [a.itself - .4, 3160, 1530, .78], [tPortal + .25, 3160, 1565, 1.0], [tPortal + 2.2, 3160, 1575, 1.3],
  ];
  const cam = (t) => (t < tFly0 - .05 ? { cx: 960, cy: lerp(520, 545, sineIO(span(t, a.t0, tFly0 - .05)) * .6 + span(t, a.t0, tFly0 - .05) * .4), z: S.creepZ(t, a.t0) } : F.lookPath(t, K)), c0 = F.lookPath(a.t0, K);
  const glowAt = (t) => { const g0 = [W / 2, 500, 950, S.breathe(t, .55)], g1 = [960, 560, 1000, S.breathe(t, .5)], k = smooth(span(t, tFly0, tFly1 + .5)); return g0.map((v, i) => lerp(v, g1[i], k)); };

  // ---------------------------------------------------------------- 5.01 the card, the word, the board
  const wordP = (t) => {   // world position (baseline left) + size + gold of the flying word, or null
    if (t < tLift) return null;
    const lu = sineIO(span(t, tLift, tFly0)), fu = span(t, tFly0, tFly1);
    const p0 = [wb.x, wb.y], p1 = [wb.x + 40, wb.y + 64], p2 = [ROW4.x + 27, ROW4.y + ROW4.h / 2 + 12];
    if (fu <= 0) return { x: lerp(p0[0], p1[0], lu), y: lerp(p0[1], p1[1], lu), size: wb.size * (1 + .08 * lu), g: 1 };
    const e = quartIO(fu), c = [lerp(p1[0], p2[0], .2) - 120, lerp(p1[1], p2[1], .45)];   // an arc: out to the left, then down into the row
    const x = (1 - e) ** 2 * p1[0] + 2 * (1 - e) * e * c[0] + e * e * p2[0], y = (1 - e) ** 2 * p1[1] + 2 * (1 - e) * e * c[1] + e * e * p2[1];
    return { x, y, size: lerp(wb.size * 1.08, 34, e), g: 1 - smooth(span(fu, .55, 1)) };
  };
  const drawCard = (ctx, t) => {
    if (t > tFly1 + 2) return;
    S.turingCard(ctx, t);
    X.turingPatch(ctx, wb, smooth(span(t, tLift, tLift + .25)));
  };
  const drawWord = (ctx, t) => {
    const p = wordP(t); if (!p || t > tFly1 + .12) return;
    const k = 1 - span(t, tFly1 - .04, tFly1 + .12);   // it lands: the flap tiles take over in the row
    F.glowText(ctx, 'control', p.x, p.y, { size: p.size, serif: true, col: mixHex(CREAM, GOLD.body, p.g), glow: true, a: k });
  };
  const row4Text = (t) => (t < tFly1 - .02 ? null : 'CONTROL');
  const drawBoard = (ctx, t) => {
    if (t > a.follow + 2.5) return;
    const bu = smooth(span(t, a.t0 + .15, tFly0 + .4)), flip = span(t, tFly1 - .02, tFly1 + .55);
    const rows = [...['ENERGY', 'MATERIALS', 'DISCOVERY'].map((s) => ({ text: s, status: 'BEGUN', gold: 1 })),
      row4Text(t) ? { text: 'CONTROL', from: '', flip, dashed: true, lit: .7 * (1 - span(t, tFly1 + .3, tFly1 + 1.4)) + .25 * Math.sin(Math.PI * span(t, a.job + .1, a.job + 1.1)) } : { dashed: true }];
    ctx.save(); ctx.globalAlpha *= bu * (1 - .55 * smooth(span(t, a.follow + .3, a.follow + 1.6)));
    F.board(ctx, t, BRD.x, BRD.y, { w: BRD.w, rowH: BRD.rowH, head: BRD.head, title: 'THE FOUR LINES', cells: 14, rows });
    ctx.restore();
  };
  // ---------------------------------------------------------------- 5.02–5.05 the ring, you, the stylus, the many
  const ringU = (t) => expoOut(span(t, a.good - .25, a.good + .6));
  const ringMorph = (t) => sineIO(span(t, tRingIn, tRingOut));
  const drawRing = (ctx, t) => {
    if (t < a.good - .3 || t > tRingOut + .02) return;
    const m = ringMorph(t), pw = pkWin(t);
    const x = lerp(RING[0], pw.x, m), y = lerp(RING[1], pw.y, m), r = lerp(RR, pw.r, m);
    X.ringS(ctx, t, x, y, r, { u: ringU(t), lit: .75 + .25 * Math.sin(Math.PI * span(t, a.tells - .1, a.tells + .8)), think: .5 });
  };
  const pkWin = (t) => ({ x: pkgX(t), y: FLOOR - PS + PS * .18 + PS * .3, r: PS * .6 * .36 });
  const youX = (t) => { if (t < a.job - .1) return [YOU.x, 1, null]; const p = span(t, a.job - .1, a.job + .5); return p < 1 ? [YOU.x - 95 * sineIO(p), -1, Math.PI * 2 * (1 + 2 * p)] : [YOU.x - 95, -1, null]; };
  const youGo = (t) => (t > a.follow + 1.6 ? null : youX(t));
  let youHand = null;
  const drawYou = (ctx, t) => {
    const w = youGo(t); if (!w || t < a.good - .4) return;
    const grab = span(t, a.job + .35, a.job + .85), raise = sineIO(span(t, a.our - .05, a.our + .55));
    const reach = Math.sin(Math.PI * Math.min(1, grab * 1.0)) * (1 - raise);
    const armR = w[1] < 0 ? [lerp(lerp(.2, 1.05, reach), 2.55, raise), lerp(lerp(.1, 1.15, reach), 2.75, raise)] : [.25, .12];
    const sink = sineIO(span(t, a.follow + .2, a.follow + 1.4));
    ctx.save(); ctx.beginPath(); ctx.rect(w[0] - 300, FLOOR - 400, 600, 402); ctx.clip(); ctx.translate(0, sink * YOU.h * 1.1);
    const hd = F.du(ctx, w[0], FLOOR, YOU.h, { dir: w[1], look: t < a.job ? lerp(.35, .85, smooth(span(t, a.good + .3, a.good + 1.2))) : lerp(.2, .7, raise), walk: w[2] ?? undefined, armR, armL: [-.15, -.1], lean: w[1] < 0 ? -.06 * reach : -.02, light: .9 });
    ctx.restore();
    youHand = hd?.R ? [hd.R[0], hd.R[1] + sink * YOU.h * 1.1] : null;
  };
  const drawStylus = (ctx, t) => {
    if (t < a.t0 + .2 || t > a.follow + 1.6) return;
    const su = smooth(span(t, tFly1 + .3, tFly1 + 1.1));   // it is there from the start of the row (it lights in when row 4 is named)
    const take = sineIO(span(t, a.job + .5, a.job + .8));
    let x = STY0[0], y = STY0[1], ang = Math.PI;
    if (take > 0 && youHand) { x = lerp(STY0[0], youHand[0] - 8, take); y = lerp(STY0[1], youHand[1] - 6, take); ang = lerp(Math.PI, -Math.PI / 2 - .25, take); }
    const sink = sineIO(span(t, a.follow + .2, a.follow + 1.4));
    F.stylus(ctx, t, x, y + sink * 220, ang, 120, { w: 4.2, a: su * (1 - sink) });
  };
  const drawMany = (ctx, t) => {
    if (t < a.people - .2 || t > a.follow + 1.8) return;
    const sink = span(t, a.follow + .2, a.follow + 1.4);
    ctx.save(); ctx.beginPath(); ctx.rect(0, FLOOR - 600, 5000, 602); ctx.clip();
    MANY.forEach(([x, h, dir], i) => {
      const d = Math.abs(x - YOU.x) / 700, u = expoOut(span(t, a.people + .05 + d * .55, a.people + .6 + d * .55)), sk = sineIO(span(sink, d * .25, d * .25 + .7));
      if (u <= 0 || sk >= 1) return;
      ctx.save(); ctx.translate(0, (1 - u) * h * 1.1 + sk * h * 1.1);
      X.lightPerson(ctx, t, x, FLOOR, h, { dir, look: .5 + .2 * Math.sin(t * .8 + i), armR: [2.3 + .1 * Math.sin(t + i), 2.7], light: span(u, .5, 1) });
      ctx.restore();
    });
    ctx.restore();
  };
  // the arrow ring → you, and the DOCILE? gate before you
  const GATE0 = [1620, FLOOR];
  const drawArrowGate = (ctx, t) => {
    if (t < a.good + .2 || t > a.people + .8) return;
    const out = smooth(span(t, a.job - .1, a.job + .5));
    const au = span(t, a.tells - .3, a.tells + .5), headY = FLOOR - YOU.h * .9;
    const gu = smooth(span(t, a.but + .05, a.but + .7)), stop = smooth(span(t, a.but + .3, a.docile + .2));
    // the arrow runs to you; once the gate stands, it stops at the gate (ONLY IF)
    const tip = [lerp(YOU.x + 40, GATE0[0] + 26, stop), lerp(headY, FLOOR - 140, stop)];
    if (out < 1) X.coolArrow(ctx, [RING[0] - RR * .8, RING[1] + 30], tip, au, { a: 1 - out, arc: 80 });
    if (gu > 0) {
      ctx.save(); ctx.globalAlpha *= 1 - out;
      X.gate(ctx, t, GATE0[0], FLOOR, 250, 130, { u: gu, lit: .35 * Math.sin(Math.PI * span(t, a.docile - .1, a.docile + 1)) });
      ctx.restore();
    }
  };
  // ---------------------------------------------------------------- 5.06–5.12 the road, the package(s), the gates, the phone
  const roadU = (t) => smooth(span(t, a.follow + .1, a.follow + 1.3));
  const drawRoad = (ctx, t) => {
    const u = roadU(t); if (u <= 0) return;
    F.trailCream(ctx, [[RING[0] - 260, FLOOR], [PHONE[0] - 40, FLOOR]], 0, u, { w: 2.4, a: .85 });
    F.lineIcon(ctx, 'phone', PHONE[0], PHONE[1], 64, { u: span(t, a.phone - .3, a.phone + .4), w: 3, gold: true });
    // the road ahead of the recalled package dims (it does not go on to your phone)
    const dim = smooth(span(t, a.off - .2, a.off + .6)) * (1 - smooth(span(t, a.rules + .3, a.rules + 1.3)));
    if (dim > 0) { ctx.save(); ctx.strokeStyle = rgba(P.night0, .75 * dim); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(G2 + GW / 2 + 20, FLOOR); ctx.lineTo(PHONE[0] - 40, FLOOR); ctx.stroke(); ctx.restore(); }
  };
  const drawGates = (ctx, t) => {
    if (t < a.follow + .3) return;
    const u1 = span(t, a.follow + .5, a.follow + 1.5), u2 = span(t, a.follow + .7, a.follow + 1.7);
    const ghost = Math.sin(Math.PI * span(t, a.vol - .1, a.vol + 1.6)) * (.75 + .25 * Math.sin(t * 9));
    const bar = span(t, a.eu + .9, a.eu + 1.6);
    // tables + testers (gate 1 on "test it", gate 2 on "regulators can test")
    const tst = (gx, t0, t1) => { const k = expoOut(span(t, t0, t0 + .6)) * (1 - smooth(span(t, t1, t1 + .6))); if (k <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(gx - 400, FLOOR - 400, 800, 402); ctx.clip();
      for (const [dx, dir] of [[-118, 1], [118, -1]]) { ctx.save(); ctx.translate(0, (1 - k) * 220); F.person(ctx, gx + dx, FLOOR, 180, { dir, lean: .14 * k, look: -.35, armR: [1.2, 1.5], armL: [.6, .9], light: .7 }); ctx.restore(); }
      ctx.restore(); };
    tst(G1, a.test1 - .25, a.eu + .1);
    tst(G2, a.reg - .15, a.last + .2);
    X.gate(ctx, t, G1, FLOOR, GH, GW, { u: u1, ghost, lit: .4 * Math.sin(Math.PI * span(t, a.us + .4, a.us + 1.6)) });
    X.gate(ctx, t, G2, FLOOR, GH, GW, { u: u2, barrier: bar, lit: .4 * Math.sin(Math.PI * span(t, a.eu + .5, a.eu + 1.8)) });
    // 5.12: from outside: both gates point at the package's shell (cream ticks that stop at its walls)
    const ou = smooth(span(t, a.rules + .9, a.outside + .5)) * (1 - smooth(span(t, a.itself - .7, a.itself - .15)));
    if (ou > 0) { const px = pkgX(t), w2 = PS * .65 + 14, y = FLOOR - PS * .5;
      F.trailCream(ctx, [[G1 + GW / 2 + 6, y], [px - w2, y]], 0, ou, { w: 3 }); F.trailCream(ctx, [[G2 - GW / 2 - 6, y], [px + w2 + PS * .26, y]], 0, ou, { w: 3 });
      for (const [xx, s] of [[px - w2, 1], [px + w2 + PS * .26, -1]]) if (ou > .9) { ctx.save(); ctx.fillStyle = CREAM; ctx.globalAlpha *= span(ou, .9, 1); ctx.beginPath(); ctx.moveTo(xx, y); ctx.lineTo(xx - s * 16, y - 9); ctx.lineTo(xx - s * 16, y + 9); ctx.closePath(); ctx.fill(); ctx.restore(); } }
  };
  // the queue: four more packages slide in behind the first at gate 1 (5.08); they stay in the queue
  const QX = [G1 - 170, G1 - 330, G1 - 490, G1 - 650];
  const drawQueue = (ctx, t) => {
    if (t < a.five - .3) return;
    QX.forEach((qx, i) => {
      const u = sineIO(span(t, a.five - .2 + i * .14, a.five + .9 + i * .14)), x = lerp(qx - 1000, qx, u); if (u <= 0) return;
      const lit = Math.sin(Math.PI * span(t, a.agreed - .3 + i * .1, a.agreed + .6 + i * .1));
      X.pkg(ctx, t, x, FLOOR, PS * .92, { lit, a: 1 - .45 * smooth(span(t, a.rules + .2, a.rules + 1.2)) });
    });
  };
  const drawPkg = (ctx, t) => {
    if (t < tRingIn) return;
    const m = ringMorph(t), x = pkgX(t), y = FLOOR - pkgLift(t), pw = pkWin(t);
    ctx.save();
    if (m < 1) { ctx.translate(pw.x, pw.y); ctx.scale(lerp(.15, 1, m), lerp(.15, 1, m)); ctx.translate(-pw.x, -pw.y); ctx.globalAlpha *= span(m, 0, .35); }
    const lit = Math.sin(Math.PI * span(t, a.agreed - .3, a.agreed + .6)) + .5 * Math.sin(Math.PI * span(t, a.itself - .5, a.itself + .2));
    X.pkg(ctx, t, x, y, PS, { lid: lidOf(t), glow: 1, lit, ring: m < 1 ? 0 : 1 });
    ctx.restore();
    // the recall hook: a cream line from above, a hook round the package's top
    const hk = smooth(span(t, a.last + .05, a.last + .5)) * (1 - smooth(span(t, a.rules + .5, a.rules + 1.2)));
    if (hk > 0) { const top = y - PS - PS * .2; F.trailCream(ctx, [[x + 900, top - 760], [x + 160, top - 140], [x, top - 20]], 0, hk, { w: 3 }); if (hk > .95) F.trailCream(ctx, [[x, top - 20], [x, top], [x - 24, top + 12], [x - PS * .62, top + PS * .2]], 0, span(hk, .95, 1), { w: 3 }); }
  };
  const pkgScreenWin = (t) => {   // the package front window in screen space (sc11's portal opens it)
    const c = cam(t), x = pkgX(t), y = FLOOR - pkgLift(t), w = PS * 1.3, win = { x: x - w / 2 + w * .2, y: y - PS + PS * .18, w: w * .6, h: PS * .6 };
    const [sx, sy] = F.lookPt(c.cx, c.cy, c.z, win.x, win.y); return { x: sx, y: sy, w: win.w * c.z, h: win.h * c.z };
  };

  // ======================================================================================================================== draw
  const draw = (ctx, t) => {
    const c = cam(t);
    F.night(ctx, t, { glow: glowAt(t), ox: -(c.cx - c0.cx) * .05, oy: -(c.cy - c0.cy) * .05 });
    F.look(ctx, c.cx, c.cy, c.z, () => {
      drawCard(ctx, t);
      // the floor line under the board, you and the many (it becomes the road)
      { const u = smooth(span(t, tFly1 - .2, tFly1 + .8)) * (1 - smooth(span(t, a.follow + 1.4, a.follow + 2.2))); if (u > 0) F.outline(ctx, [[[1250, FLOOR], [500, FLOOR]], [[1250, FLOOR], [RING[0] - 240, FLOOR]]], u, { w: 1.6, a: .55 }); }
      drawBoard(ctx, t);
      drawRoad(ctx, t);
      drawMany(ctx, t);
      drawArrowGate(ctx, t);
      drawYou(ctx, t);
      drawStylus(ctx, t);
      drawRing(ctx, t);
      drawGates(ctx, t);
      drawQueue(ctx, t);
      drawPkg(ctx, t);
      drawWord(ctx, t);
    });
    // ---------------- screen-space type (≥ 22 px, rises behind its mask, sinks before the camera could cut it)
    const sp = (x, y) => F.lookPt(c.cx, c.cy, c.z, x, y);
    const io = (i0, o0, d = .45) => span(t, i0, i0 + .6) * (1 - span(t, o0, o0 + d));
    // 5.02/5.03 the condition, exact (I. J. Good, 1965, p. 33): "tell us how" warms when spoken, "docile" gets a cream underline
    { const u = io(a.good - .05, a.job + .1, .5); if (u > 0) {
      const s = 34, y = 168, parts = [['provided that the machine is ', 0], ['docile', 0], [' enough to ', 0], ['tell us how', clamp((t - a.tells) / .35)], [' to keep it under control.', 0]];
      const tot = parts.reduce((q, [x]) => q + F.measure(x, s, true), 0); let x = W / 2 - tot / 2;
      for (const [txt, g] of parts) { F.maskLine(ctx, [[txt, 0]], x, y, s, rise(u), { col: mixHex(CREAM, GOLD.body, g), glow: false }); if (txt === 'docile') { const k = smooth(span(t, a.docile - .1, a.docile + .4)) * u; if (k > 0) { ctx.save(); ctx.strokeStyle = CREAM; ctx.lineWidth = 2; ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.moveTo(x, y + 9); ctx.lineTo(x + F.measure(txt, s, true) * k, y + 9); ctx.stroke(); ctx.restore(); } } x += F.measure(txt, s, true); }
      F.capsLabel(ctx, 'I. J. GOOD, 1965', W / 2, y + 44, span(u, .3, 1), { size: 22 }); } }
    { const u = io(a.tells - .1, a.but + .1); if (u > 0) { const [x, y] = sp(1690, 1160); F.capsLabel(ctx, 'THE MACHINE TELLS US HOW', x, y, u, { size: 26, col: COOL.text }); } }
    { const u = io(a.but + .2, a.job - .05); if (u > 0) { const [x, y] = sp(GATE0[0], FLOOR - 300); X.creamWord(ctx, t, x, y, 'DOCILE?', u, { size: 32 }); } }
    { const u = io(a.docile - .15, a.job - .05); if (u > 0) { const [x, y] = sp(GATE0[0], FLOOR + 70); F.capsLabel(ctx, 'ONLY IF', x, y, u, { size: 26, col: CREAM }); } }
    { const u = io(a.our - .1, a.people + .3); if (u > 0) { const [x, y] = sp(YOU.x - 30, FLOOR - YOU.h - 170); F.verdict(ctx, t, x, Math.max(120, y), 'OUR JOB', u, { size: 34 }); } }
    { const u = io(a.people + .35, a.follow + .2); if (u > 0) F.capsLabel(ctx, 'PEOPLE HAVE STARTED', W / 2, 860, u, { size: 26, col: CREAM }); }
    // 5.06 the model and your phone
    { const u = io(a.follow + .7, a.us - .1); if (u > 0) { const [x, y] = sp(pkgX(t), FLOOR - PS - 60); F.capsLabel(ctx, 'A NEW A.I. MODEL', x, y, u, { size: 24, col: COOL.text }); } }
    { const u = io(a.phone - .1, a.us - .1); if (u > 0) { const [x, y] = sp(PHONE[0], PHONE[1] - 90); F.capsLabel(ctx, 'YOUR PHONE', x, y, u, { size: 24, col: GOLD.text }); } }
    // 5.07–5.09 gate 1
    { const o = a.eu + .1, [x, gy] = sp(G1, FLOOR - GH), y0 = Math.max(150, gy - 120);
      { const u = io(a.us + .2, o); if (u > 0) F.verdict(ctx, t, x, y0, 'CAISI (U.S. NIST)', u, { size: 34 }); }
      { const u = io(a.launch - .2, a.five - .3, .4); if (u > 0) F.capsLabel(ctx, 'TESTED BEFORE LAUNCH', x, y0 + 56, u, { size: 26, col: CREAM }); }
      { const u = io(a.five + .2, o); if (u > 0) F.capsLabel(ctx, 'TESTING AGREEMENTS WITH 5 DEVELOPERS', x, y0 + 56, u, { size: 26, col: CREAM }); }
      { const u = io(a.five + .5, o); if (u > 0) F.capsLabel(ctx, 'SINCE 5 MAY 2026', x, y0 + 94, u, { size: 22 }); }
      { const u = io(a.vol - .05, o); if (u > 0) { const [gx, gy] = sp(G1, FLOOR + 80); X.creamWord(ctx, t, gx, Math.min(840, gy), 'VOLUNTARY', u, { size: 34 }); } } }
    // queue numbers 1–5 as they light (5.08)
    { const u = io(a.agreed - .35, a.vol + .4); if (u > 0) [G1, ...QX].forEach((qx, i) => { const k = span(t, a.agreed - .35 + i * .1, a.agreed + .05 + i * .1); const [x, y] = sp(qx, FLOOR + 40); F.capsLabel(ctx, String(5 - i), x, y, Math.min(u, k), { size: 24, col: GOLD.text }); }); }
    // 5.10 gate 2 + the fine slip
    { const o = a.rules - .1, [x, gy] = sp(G2, FLOOR - GH), y0 = Math.max(150, gy - 120);
      { const u = io(a.eu + .5, o); if (u > 0) F.verdict(ctx, t, x, y0, 'EU AI OFFICE', u, { size: 34 }); }
      { const u = io(a.eu + .8, a.last + .2); if (u > 0) F.capsLabel(ctx, 'SINCE 2 AUG 2026', x, y0 + 56, u, { size: 24, col: CREAM }); }
      const su = io(a.fine - .1, a.last + .3, .5);
      if (su > 0) { const [sx, sy] = sp(G2 + GW / 2 + 40, FLOOR - 330), bx = Math.min(sx, W - 470);
        F.paperCard(ctx, t, bx, sy - 40, 420, 230, { u: su, rot: .02, head: 'FINES UP TO', headSize: 22, lines: [['€15 million', 56, .9, true], ['OR 3% OF GLOBAL TURNOVER', 22, 0, false]] }); }
      { const u = io(a.last + .5, o); if (u > 0) X.creamWord(ctx, t, x, y0 + 56, 'RECALL AS A LAST RESORT', u, { size: 28 }); } }
    // 5.12 (c11)
    { const u = io(a.rules + .25, a.itself - .2, .4); if (u > 0) F.verdict(ctx, t, W / 2, 230, 'RULES WORK FROM THE OUTSIDE', u, { size: 34 }); }
  };
  return { draw, a, cam, pkgScreenWin, tPortal };
}
