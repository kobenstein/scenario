// Film 71 · c10 (B2): ENDING 3/12 LIBERTARIAN UTOPIA. One continuous take, no cut (docs/shots.md 3.01 – 3.09):
//   (c09 ended on the row, the hand on the flipped lever) the counter rolls to 3; the hand leaves, the lever and the tracks fold away, the
//   chip folds into door 4's tag; three empty tag places light over doors 3, 2, 1 (the gold one among them) → door 3 opens, the camera flies
//   in: SCENARIO, the bedroom, you stretch; on the bedside table a notice: RENT RECEIVED → its arrow turns toward you: + PAID TO YOU → the
//   window: your plot, a machine hall on it, a LEASE sign drops in → the camera pushes into the window: the plot picture is one parcel of a
//   land register on the yard (pull back): LIBERTARIAN UTOPIA; people left, machines right, a handshake over it: PROPERTY PROTECTED → two
//   machines push tiny coins to each other · switch tag 2026 · COUNTED THROUGH NOV 1 → the coins drop against a ruler: ¢ → the ruler
//   becomes a fence: your plot, you and the hall inside, a second figure walks up outside → a faint protective shimmer lays over everything →
//   the gate in the fence glows in door 2's colour and the camera flies through it into c11's street (street11 from sc11, same frames).
import * as F from '../lib/f71_kit.mjs';
import * as S from '../lib/f71_world.mjs';
import * as B from '../lib/b2_extra.mjs';
import { anchors09, rowLit, rowExtras, camKeys910, CHIP } from './sc09.mjs';
import { street11 } from './sc11.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, GOLD, CREAM, COOL, PAPER, LAMP, TXT } = F;
const TAU = Math.PI * 2;

export function anchors10(T, a) {
  const G = (p, n = 0, af = a - .1) => T.G(p, n, af);
  return {
    a, wake: G('You wake up, and the rent'), rent: G('the rent has arrived'), paidS: G("The rent you're paid"), paid: G('paid.'),
    land: G('You own some land'), lease: G('machines lease it'), pension: G("that's your pension"), lib: G('This is Libertarian Utopia'), libW: G('Libertarian Utopia:'),
    humans: G('humans and machines'), mach: G('machines live in peace'), peace: G('live in peace'), property: G('because property is protected'),
    pay: G('Machines have started paying'), pennies: G('Mostly pennies'), fine: G('A fine morning'), own: G('if you own something'),
    sowhat: G('So what if a machine'), looked: G('looked after everyone'), everyone: G('everyone?'),
  };
}

export default function (T, R) {
  const A9 = anchors09(T, T.G("That's the Gatekeeper")), A = anchors10(T, R.a), st = street11(T);
  // ---------------------------------------------------------------- 3.01 · the row (row-local coords, continues c09)
  const D3C = [F.rowX(3), F.ROW.y - F.ROW.h * 1.06 / 2];
  const FLY0 = A.wake - .05, FLY1 = A.wake + 1.4;   // final pass: longer fly (was +1.0)
  const CAMROW = [...camKeys910(A9), [FLY0, { x: 1340, y: 576, s: 1.9 }], [FLY1, { x: D3C[0], y: D3C[1], s: 26 }]];
  const vRow = (t) => F.viewPath(t, CAMROW);
  // ---------------------------------------------------------------- 3.02 – 3.04 · the bedroom (room coords of B.roomBed3)
  const SW = A.lib - .1;
  const RC = [[FLY0, { x: 960, y: 540, s: 1 }], [FLY1, { x: 955, y: 548, s: 1.0 }], [A.rent + .3, { x: 900, y: 610, s: 1.22 }], [A.paidS + .3, { x: 905, y: 612, s: 1.4 }],
    [A.paid + .6, { x: 912, y: 608, s: 1.45 }], [A.land + .7, { x: 1330, y: 440, s: 1.38 }], [A.lease + .6, { x: 1310, y: 470, s: 1.6 }], [A.pension - .25, { x: 1330, y: 480, s: 2.1 }],
    [SW, { x: 1380, y: 497, s: 4.5 }]];
  const rcAt = (t) => F.viewPath(t, RC);
  const plotO = (t) => ({ lease: span(t, A.lease - .1, A.lease + .4) });
  const bedOpts = (t) => {
    const e = sineIO(Math.sin(Math.PI * span(t, A.wake + .3, A.wake + 1.9)));
    return { notice: span(t, A.rent + .05, A.rent + .55), arrow: span(t, A.paidS + .15, A.paidS + .8), paid: span(t, A.paid - .05, A.paid + .45), look: .2 + .25 * e,
      you: { armR: [lerp(.2, 2.9, e), lerp(.1, 3.05, e)], armL: [lerp(-.2, -2.9, e), lerp(-.1, -3.05, e)] }, plot: plotO(t) };
  };
  const drawBed = (ctx, t, v) => B.roomBed3(ctx, t, v, bedOpts(t));
  // ---------------------------------------------------------------- 3.05 – 3.09 · the register, the coins, the fence, the shimmer (yard coords)
  const K = .27, ROWY = [360, 510, 660], TW = 600 * K, TH = 460 * K, TX = 960 - TW / 2, SHEET = { x: 360, y: 330, w: 1200, h: 480 };
  const OWN = 560, MAC = 1360, M0 = [MAC + 34, ROWY[0] + 55], M1 = [MAC + 34, ROWY[1] + 55], MC = [1540, (M0[1] + M1[1]) / 2];
  const GATE = { x: 2250, y: 770, w: 70, h: 120 }, GC = [GATE.x, GATE.y - GATE.h / 2], SF = 29, GATE_COL = F.END[2].col;
  const FLYG0 = A.everyone + .25, FLYG1 = R.b - .1;
  const rcSW = rcAt(SW), vR0 = { x: TX + (rcSW.x - 1080) * K, y: ROWY[0] + (rcSW.y - 170) * K, s: rcSW.s / K };
  const CAMR = [[SW, vR0], [SW + 1.1, { x: 960, y: 445, s: 5 }], [A.libW + 1.3, { x: 960, y: 490, s: 1.0 }], [A.peace + .3, { x: 960, y: 500, s: .98 }],
    [A.property + .6, { x: 965, y: 495, s: 1.0 }], [A.pay - .1, { x: 1000, y: 490, s: 1.03 }], [A.pay + .9, { x: 1330, y: 555, s: 1.4 }],
    [A.pennies + .25, { x: 1500, y: 570, s: 1.38 }], [A.fine + .1, { x: 1540, y: 560, s: 1.3 }], [A.fine + 1.3, { x: 2140, y: 590, s: 1.05 }],
    [A.sowhat + .2, { x: 2120, y: 585, s: 1.0 }], [A.looked + .1, { x: 1530, y: 470, s: .64 }], [A.everyone - .2, { x: 1600, y: 540, s: .72 }],
    [A.everyone + .31, { x: GC[0], y: GC[1], s: 1.2 }], // final pass: centre the gate before the zoom (no swing-out lurch)
    [FLYG1, { x: GC[0], y: GC[1], s: SF }]];
  const vReg = (t) => F.viewPath(t, CAMR);
  const tile = (ctx, t, i, y) => {
    ctx.save(); ctx.beginPath(); ctx.rect(TX, y, TW, TH); ctx.clip(); ctx.translate(TX, y); ctx.scale(K, K); ctx.translate(-1080, -170);
    B.plotView(ctx, t, B.BED3_WIN, i ? { hall: i === 1 ? .4 : .68 } : plotO(t)); ctx.restore();
    ctx.strokeStyle = rgba(CREAM, .4); ctx.lineWidth = 1.5; ctx.strokeRect(TX, y, TW, TH);
  };
  const rising = (ctx, gy, u, d, fn) => { if (u <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(-5000, -5000, 10000, 5000 + gy); ctx.clip(); ctx.translate(0, (1 - expoOut(u)) * d); fn(); ctx.restore(); };
  const coinPos = (t, j) => {   // the coins go back and forth between the two machines, then drop against the ruler
    const DROP = A.pennies - .15, tt = Math.min(t, DROP), ph = Math.max(0, (tt - (A.pay + .25 + j * .16)) * .9), k = Math.floor(ph), f = sineIO(ph - k);
    const [a, b] = k % 2 ? [M1, M0] : [M0, M1], q = 1 - f, arc = [q * q * a[0] + 2 * q * f * MC[0] + f * f * b[0], q * q * a[1] + 2 * q * f * MC[1] + f * f * b[1]];
    const ru = rul(t), e = sineIO(span(t, DROP + j * .04, DROP + .5 + j * .04)), slot = [ru.x0 + 14 + j * 15, ru.y - 7];
    return { p: [lerp(arc[0], slot[0], e), lerp(arc[1], slot[1], e) - 40 * Math.sin(Math.PI * e)], on: ph > 0 || e > 0 };
  };
  const rul = (t) => {
    const g = expoOut(span(t, A.pennies - .3, A.pennies + .2)), f = sineIO(span(t, A.fine - .05, A.fine + 1.0));
    return { g, f, x0: lerp(1600, 1800, f), x1: lerp(1600 + 300 * g, 2700, f), y: lerp(660, 770, f) };
  };
  function ruler(ctx, t) {
    const r = rul(t); if (r.g <= 0) return;
    const hh = lerp(18, 8, r.f), gap = 35 * span(r.f, .5, 1);
    ctx.fillStyle = mixHex(PAPER.body, mixHex(CREAM, GOLD.shade, .3), r.f);
    const seg = (a, b) => { if (b > a) ctx.fillRect(a, r.y - hh / 2, b - a, hh); };
    seg(r.x0, Math.min(r.x1, GATE.x - gap)); seg(Math.max(r.x0, GATE.x + gap), r.x1);
    const L = r.x1 - r.x0, pu = span(t, A.fine + .25, A.fine + 1.1);
    for (let k = 0; k <= 60; k++) {   // ruler ticks; every fifth grows into a fence post, the small ones shrink away
      const x = r.x0 + L * k / 60; if (x > r.x1 + .1 || (r.f > .5 && Math.abs(x - GATE.x) < gap + 1)) continue;
      const big = k % 5 === 0, th = big ? lerp(10, 95, span(pu, k / 60 * .5, k / 60 * .5 + .5)) : 6 * (1 - r.f);
      if (th <= .2) continue;
      ctx.fillStyle = big && r.f > 0 ? mixHex(PAPER.ink, mixHex(CREAM, GOLD.shade, .3), r.f) : PAPER.ink; ctx.fillRect(x - (big ? lerp(1.2, 4, r.f) : .8), r.y - hh / 2 - th, big ? lerp(2.4, 8, r.f) : 1.6, th);
    }
    const tr = span(t, A.fine + .8, A.fine + 1.4);   // the top rail
    if (tr > 0) { ctx.fillStyle = mixHex(CREAM, GOLD.shade, .3); const y = r.y - 62, xe = lerp(r.x0, r.x1, tr); if (xe > r.x0) { ctx.fillRect(r.x0, y, Math.min(xe, GATE.x - gap) - r.x0, 7); if (xe > GATE.x + gap) ctx.fillRect(GATE.x + gap, y, xe - GATE.x - gap, 7); } }
  }
  function hall(ctx, t, x, y, w, h) {
    ctx.fillStyle = mixHex(P.ind2, COOL.deep, .45); ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.beginPath(); ctx.moveTo(x - w / 2, y - h); ctx.quadraticCurveTo(x, y - h * 1.5, x + w / 2, y - h); ctx.fill();
    for (let k = 0; k < 4; k++) { ctx.fillStyle = rgba(COOL.body, .6 + .2 * Math.sin(t * 1.5 + k)); ctx.fillRect(x - w / 2 + 18 + k * (w - 36) / 4, y - h * .62, (w - 36) / 4 - 12, h * .22); }
    F.agentGlyph(ctx, t, x, y - h * .2, h * .09, { ping: .5, col: COOL.core });
  }
  function shimmer(ctx, t, u) {
    if (u <= 0) return;
    const cx = 1530, cy = 830, rx = 1380, ry = 940, a0 = -Math.PI / 2, da = (Math.PI / 2) * sineIO(u);
    ctx.save(); ctx.lineCap = 'round';
    for (const [lw, col] of [[46, rgba(COOL.halo, .05)], [3, rgba(COOL.line, .3)]]) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, a0 - da, a0 + da); ctx.stroke(); }
    ctx.strokeStyle = rgba(COOL.line, .1); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy, rx * .94, ry * .93, 0, a0 - da, a0 + da); ctx.stroke();
    for (let j = 0; j < 46; j++) {
      const ang = a0 + (j / 45 * 2 - 1) * Math.PI / 2; if (Math.abs(ang - a0) > da) continue;
      const q = .5 + .5 * Math.sin(t * 2.3 + j * 1.7); ctx.fillStyle = rgba(COOL.core, .45 * q); ctx.beginPath(); ctx.arc(cx + rx * Math.cos(ang), cy + ry * Math.sin(ang), 3.2, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function drawReg(ctx, t, v) {
    F.yard(ctx, t, v, { lx: lerp(960, 2200, sineIO(span(t, A.fine, A.sowhat))), ly: 560, pool: .8, rails: 1 });
    F.inView(ctx, v, () => {
      // the register card grows out of the parcel picture
      const g = sineIO(span(t, SW + .15, SW + 1.1));
      if (g > 0) {
        const x = lerp(TX, SHEET.x, g), y = lerp(ROWY[0], SHEET.y, g), w = lerp(TW, SHEET.w, g), h = lerp(TH, SHEET.h, g);
        ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(x + 8, y + 10, w, h, 14); ctx.fill();
        ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.beginPath(); ctx.roundRect(x, y, w, h, 14); ctx.fill(); ctx.strokeStyle = rgba(CREAM, .45); ctx.lineWidth = 2; ctx.stroke();
        const lu = span(t, SW + .8, SW + 1.6);
        for (const xx of [760, 1160]) F.lightLine(ctx, [[xx, SHEET.y + 18], [xx, SHEET.y + SHEET.h - 18]], lu, { w: 1.5, a: .3, glow: false });
        for (const yy of [495, 645]) F.lightLine(ctx, [[SHEET.x + 24, yy], [SHEET.x + SHEET.w - 24, yy]], lu, { w: 1.5, a: .3, glow: false });
      }
      for (const i of [2, 1]) { const y = lerp(ROWY[0], ROWY[i], sineIO(span(t, SW + .5 + .15 * i, SW + 1.3 + .15 * i))); if (y > ROWY[0] + .5) tile(ctx, t, i, y); }
      tile(ctx, t, 0, ROWY[0]);
      // people left, machines right
      for (let i = 0; i < 3; i++) {
        const fy = ROWY[i] + 122, ou = span(t, A.humans - .1 + .15 * i, A.humans + .5 + .15 * i);
        if (ou > 0) halo(ctx, OWN, fy - 50, 80, .3 * clamp(ou * 2), LAMP.body, LAMP.core);
        rising(ctx, fy + 2, ou, 120, () => (i ? B.other(ctx, t, OWN, fy, 110, {}) : B.you(ctx, t, OWN, fy, 110, {})));
        const mu = span(t, A.mach - .1 + .15 * i, A.mach + .5 + .15 * i), pg = i < 2 ? .5 + .5 * span(t, A.pay - .1, A.pay + .3) : .4;
        rising(ctx, ROWY[i] + 112, mu, 110, () => B.payMachine(ctx, t, MAC, ROWY[i] + 55, 24, { ping: pg }));
      }
      // the handshake over it (3.05)
      const hu = sineIO(span(t, A.peace - .15, A.peace + .55)), bob = 5 * Math.sin(Math.PI * 2 * span(t, A.peace + .55, A.peace + 1.35));
      if (hu > 0) {
        F.hand(ctx, lerp(OWN - 420, 884, hu), 246 + bob, 0, 80, { pose: 'hold', rim: LAMP.body });
        F.hand(ctx, lerp(MAC + 420, 1036, hu), 246 + bob, Math.PI, 80, { pose: 'hold', flip: -1, rim: COOL.line });
      }
      F.big(ctx, F.END[3].name, 960, 120, 64, span(t, A.libW - .1, A.libW + .5) * (1 - span(t, A.pay + .2, A.pay + .7)), { gold: 0 });
      F.label(ctx, 'PROPERTY PROTECTED', 960, 304, span(t, A.property + .2, A.property + .8) * (1 - span(t, A.pay + .2, A.pay + .7)), { size: 28 });
      // the fence world: the plot strip, the hall and you rise with the fence posts; the gate (door 2's colour)
      const pu = span(t, A.fine + .3, A.fine + 1.1);
      if (pu > 0) { ctx.fillStyle = mixHex(P.night1, '#8a9358', .4); const top = lerp(770, 690, sineIO(pu)); ctx.fillRect(1800, top, 900, 770 - top); }
      rising(ctx, 772, span(t, A.fine + .35, A.fine + 1.2), 200, () => hall(ctx, t, 2480, 768, 300, 160));
      rising(ctx, 772, span(t, A.fine + .5, A.fine + 1.2), 150, () => B.you(ctx, t, 2040, 768, 130, { look: .25 + .1 * span(t, A.own, A.own + .6) }));
      const gu = span(t, A.fine + .6, A.fine + 1.3);
      if (gu > 0) rising(ctx, GATE.y + 1, gu, 140, () => {
        const gl = .18 + .82 * span(t, A.everyone - .5, A.everyone + .3), op = span(t, FLYG0 - .25, FLYG0 + .45);
        F.door(ctx, t, GATE.x, GATE.y, GATE.w, GATE.h, { col: GATE_COL, lit: gl, beam: .5 * gl, seed: 2, open: op, inner: op > 0 ? B.doorInner(v, t, st.vAt(t), st.frame, undefined, SF) : undefined });
      });
      ruler(ctx, t);
      // the coins (3.06 – 3.07)
      for (let j = 0; j < 6; j++) { const c = coinPos(t, j); if (c.on) B.coin(ctx, c.p[0], c.p[1], 6); }
      F.big(ctx, '¢', 1760, 615, 76, span(t, A.pennies - .05, A.pennies + .35) * (1 - span(t, A.fine, A.fine + .4)), { gold: 0 });
      // the second figure walks up outside the fence (3.08)
      const wu = span(t, A.own - .8, A.own + .3);
      if (wu > 0) { const x = lerp(1420, 1690, sineIO(wu)); halo(ctx, x, 720, 110, .28 * clamp(wu * 2), LAMP.body, LAMP.core); B.other(ctx, t, x, 786, 140, { pose: wu < 1 ? 'walk' : 'stand', walk: wu < 1 ? (x - 1420) / 90 * TAU / 2 : undefined, dir: 1 }); }
      shimmer(ctx, t, span(t, A.sowhat + .3, A.looked + .4));
    });
    const tu = span(t, A.pay + .3, A.pay + .85), tOut = span(t, A.fine - .3, A.fine + .2);
    if (tu > 0 && tOut < 1) { const [tx, ty] = F.toScreen(v, 1340, 250); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.switchTag(ctx, t, tx, ty, F.END[3].tag, tu, { out: tOut }); ctx.restore(); B.tagToHud(ctx, t, T, 3, [tx, ty], A.pay + .3); }
    F.source(ctx, t, A.pay + .6, A.fine + .6, TXT.e3.src.replace(/^\(W\)\s*/, ''));
  }
  // ---------------------------------------------------------------- the row at the start (seam with c09)
  function drawRow(ctx, t) {
    const v = vRow(t), far = v.s > 13, rl = rowLit(T, t);
    F.yard(ctx, t, v, { lx: lerp(F.rowX(4), F.rowX(3), sineIO(span(t, R.a, R.a + 1.2))), ly: 560, pool: .8, rails: 1 });
    const open3 = span(t, A.wake - .6, A.wake + .1);
    S.rowScene(ctx, t, T, { n: 4, v, yard: false, lit: rl.lit, scale: rl.scale, beam: rl.beam, tags: (m) => (m >= 4 ? 1 : 0), hud: 0,
      a: far ? (m) => (m === 3 ? 1 : 0) : undefined,
      open: (m) => (m === 3 && open3 > 0 ? open3 : undefined),
      inner: (m) => (m === 3 && open3 > 0 ? B.doorInner(v, t, rcAt(t), drawBed, undefined, 26) : undefined) });
    rowExtras(ctx, t, v, { tracks: 1, levU: 1, hand: 1 - span(t, R.a + .05, R.a + .6), lev: 1, fold: span(t, R.a + .35, R.a + 1.05), chip: null });
    F.inView(ctx, v, () => {
      // the chip folds into door 4's tag
      const cu = span(t, R.a + .2, R.a + 1.0);
      if (cu < 1) { const e = sineIO(cu), ty = F.ROW.y - F.ROW.h * rl.scale(4) - 26, s = 56 * (1 - e); if (s > .5) F.chip(ctx, t, lerp(CHIP[0], F.rowX(4), e), lerp(CHIP[1], ty, e) - 120 * Math.sin(Math.PI * e), s, { ping: 1 }); }
      // three empty tag places (doors 3, 2, 1)
      for (const m of [3, 2, 1]) {
        const u = span(t, R.a + .35 + .18 * (3 - m), R.a + .85 + .18 * (3 - m)); if (u <= 0) continue;
        const k = lerp(.6, 1, expoOut(u)), y = F.ROW.y - F.ROW.h * rl.scale(m) - 26;
        ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(F.rowX(m), y); ctx.scale(k, k); ctx.strokeStyle = m === 1 ? rgba(GOLD.line, .9) : rgba(CREAM, .7); ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.roundRect(-17, -10, 34, 20, 4); ctx.stroke(); ctx.restore();
      }
    });
    F.counterHud(ctx, t, T, { parked: 'chip' });
  }
  const scen = (t) => span(t, A.wake - .15, A.wake + .45) * (1 - span(t, SW - .6, SW));
  function draw(ctx, t) {
    if (t < FLY1) { drawRow(ctx, t); F.scenarioTag(ctx, scen(t)); }
    else if (t < SW) { drawBed(ctx, t, rcAt(t)); F.counterHud(ctx, t, T); F.scenarioTag(ctx, scen(t)); }
    else if (t < FLYG1) { drawReg(ctx, t, vReg(t)); F.counterHud(ctx, t, T); F.scenarioTag(ctx, st.tagU(t)); }
    else { const v = st.vAt(t); st.frame(ctx, t, v); st.overlay(ctx, t, v); }
  }
  return [{ t: R.a, draw, print: F.PRINT71 }];
}
