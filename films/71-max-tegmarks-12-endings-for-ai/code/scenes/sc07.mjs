// Film 71 · c07 (B2): ENDING 6/12 REVERSION. One continuous take, no cut (docs/shots.md 6.01 – 6.09):
//   out of plateRow(6): the key in the HUD dims, cables run from every door to one plug → a hand pulls the plug, the lit doors go out one by
//   one from the plug side, door 6 stays → it opens, the camera flies into its slit: SCENARIO, the wooden room (you stretch in the light, the
//   table: bread and a cup, no screen) → REVERSION, the fields outside worked by hand, the tools by the door → the casements open, the
//   camera pushes through the window: the hundred plots fold into a waffle of the world's countries, the night yard floods in under them:
//   58 % · PHONES BANNED IN SCHOOLS · switch tag MAR 2026 · UNESCO → a clone runs back to 24 % (JUNE 2023) → both waffles fold into one phone
//   in a locker; a monitor beside it keeps computing: SCREENS, NOT AI → the school rises behind them, behind the school a throne grows, its
//   crown lights on "rules" (calm hold over the seam; c08 continues the same picture: throneWorld + camKeys78 are shared).
// Anchors are phrases only (T.G / T.GE, `after` = R.a for repeated phrases).
import * as F from '../lib/f71_kit.mjs';
import * as S from '../lib/f71_world.mjs';
import * as B from '../lib/b2_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, GOLD, CREAM, CREAM2, COOL, PAPER, TXT, DATA } = F;
const TAU = Math.PI * 2;

export function anchors07(T, a) {
  const G = (p, n = 0, af = a - .1) => T.G(p, n, af), GE = (p, n = 0, af = a - .1) => T.GE(p, n, af);
  const A = {
    a, key: GE('trusted with the key'), pull: G('Pull the plug'), plug: G('plug.'), wake: G('You wake up with'), light: G('with the light'),
    screen: G('No screen on the breakfast'), table: G('breakfast table'), rev: G("That's Reversion"), back: G('turn technology back'),
    simply: G('live simply'), amish: G('like the Amish'), march: G('As of March'), half: G('more than half'), ban: G('ban phones in school'),
    less: G('Less than three years earlier'), quarter: G('it was a quarter'), targets: G('That targets screens'), notAI: G('not AI.'),
    others: G('And others want more machine'), one: G('one that rules'),
  };
  A.rules = G('rules', 0, A.one);
  A.dict = G('The Benevolent Dictator');
  return A;
}

// ---------------------------------------------------------------- the throne world (6.08 – 6.09, shared with c08 over the seam)
// yard coords (screen px at the view {960, 540, 1}); ground line y 650. p: { lock, mon, ground, school, throne, disc, sink, shrink, lift }
export const GROUND = 650, LOCK = { x: 800, s: .75 }, MON = { x: 1130, s: .7 }, THR = { x: 960, h: 520 };
export const PHONE = { x: 800 - 15 * .75, y: GROUND - 210 * .75 + 210 * .75 * .55 - 56 * .75, w: 30 * .75, h: 56 * .75 };
export const CROWN = [THR.x, GROUND - THR.h * .78];
export function throneWorld(ctx, t, v, p) {
  F.inView(ctx, v, () => {
    const sink = sineIO(clamp(p.sink ?? 0));
    // the throne (behind the school): grows out of the ground line; c08 shrinks it into the rising light
    const sh = sineIO(clamp(p.shrink ?? 0));
    if ((p.throne ?? 0) > 0 && sh < 1) {
      ctx.save(); ctx.translate(CROWN[0], CROWN[1]); ctx.scale(1 - sh, 1 - sh); ctx.translate(-CROWN[0], -CROWN[1]);
      B.throne(ctx, t, THR.x, GROUND, THR.h, { grow: p.throne, disc: p.disc ?? 0 }); ctx.restore();
    }
    // the ground: everything below sinks under it (c08)
    ctx.save(); ctx.beginPath(); ctx.rect(-2000, -2000, 6000, 2000 + GROUND); ctx.clip(); ctx.translate(0, sink * 330);
    if ((p.school ?? 0) > 0) B.school(ctx, t, 960, GROUND, { rise: p.school });
    const mu = clamp(p.mon ?? 0);
    if (mu > 0) { ctx.save(); ctx.translate(0, (1 - expoOut(mu)) * 200); B.aiMonitor(ctx, t, MON.x, GROUND, MON.s, { on: span(mu, .5, 1) }); ctx.restore(); }
    const lu = clamp(p.lock ?? 0);
    if (lu > 0) { const cx = PHONE.x + PHONE.w / 2, cy = PHONE.y + PHONE.h / 2, k = expoOut(lu); ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy); B.locker(ctx, t, LOCK.x, GROUND, LOCK.s, { door: .35 }); ctx.restore(); }
    ctx.restore();
    const g = clamp(p.ground ?? 0) * (1 - sink);
    if (g > 0) { const e = expoOut(g); F.lightLine(ctx, [[lerp(LOCK.x, 330, e), GROUND], [lerp(LOCK.x, 1590, e), GROUND]], 1, { w: 2.5, a: .5, glow: false }); }
    // the crown: the machine disc lights on "rules" (c08 lifts it into the calm light)
    const d = clamp(p.disc ?? 0); if (d > 0) {
      const lf = sineIO(clamp(p.lift ?? 0)), x = CROWN[0], y = lerp(CROWN[1], p.liftY ?? 40, lf) - 4 * Math.sin(t * .9) * (1 - lf);
      B.machineDisc(ctx, t, x, y, lerp(26, p.liftR ?? 46, lf) * expoOut(d), { glow: .6 + .4 * d });
    }
  });
}
export const phoneRect = (ctx) => { ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.beginPath(); ctx.roundRect(PHONE.x, PHONE.y, PHONE.w, PHONE.h, 4); ctx.fill(); ctx.strokeStyle = rgba(CREAM2, .7); ctx.lineWidth = 1.2; ctx.stroke(); };
// the camera over the seam c07 | c08 (both chunks use exactly these keys around the boundary)
export const camKeys78 = (A) => [[A.others + 1.6, { x: 960, y: 472, s: 1.1 }], [A.rules + .6, { x: 960, y: 464, s: 1.13 }], [A.dict + .4, { x: 958, y: 452, s: 1.2 }], [A.dict + 2.3, { x: 960, y: 400, s: 1.06 }]];

export default function (T, R) {
  const A = anchors07(T, R.a);
  const PL0 = R.a + S.SEAM_HALF;   // the plate ends here (plateRow(6) exactly before)
  // ---------------------------------------------------------------- 6.01 – 6.02 · the row, the cables, the plug
  const D6 = { x: F.rowX(6), w: F.ROW.w * 1.06, h: F.ROW.h * 1.06 }, D6C = [D6.x, F.ROW.y - D6.h / 2];
  const FLY0 = A.plug + .35, FLY1 = A.wake + .65;   // final pass: a longer fly (was plug+.5 → wake+.25: LURCH)
  const BUS = 800, SOCK = 1838, PLUG = 1792;
  const baseV = (t) => { const u = sineIO(span(t, PL0, A.pull + .1)); return { x: lerp(960, 1410, u), y: lerp(560, 640, u), s: B.seamCreep(t, R.a) * lerp(1, 1.37, u) }; };
  const FLYK = [[FLY0, baseV(FLY0)], [FLY0 + 1.0, { x: 1060, y: 574, s: 3.0 }], [FLY1, { x: D6C[0], y: D6C[1], s: 26 }]];
  const vAt = (t) => (t <= FLY0 ? baseV(t) : F.viewPath(t, FLYK));
  const SPEED = 1700;   // the dark runs from the socket to the left (yard units / s)
  const outU = (m, t) => (m === 6 ? 0 : span(t, A.plug + .08 + (SOCK - F.rowX(m)) / SPEED, A.plug + .3 + (SOCK - F.rowX(m)) / SPEED));
  const keyA = (t) => clamp(1 - .7 * span(t, PL0, A.key + .4) + .7 * span(t, A.others, A.others + 1.1), .3, 1);
  function hudKey(ctx, t) {
    const a = F.hudOn(T, t) * keyA(t); if (a <= 0) return;
    const [px, py] = F.hudPocket('key'); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.keyGlyph(ctx, t, px, py, 30, { a }); ctx.restore();
  }
  // the room behind door 6 (room coords of B.roomWood)
  const PUSH = A.march - .3, RC_PUSH = { x: 1260, y: 385, s: 4.0 };
  const RC = [[FLY0, { x: 1000, y: 540, s: 1 }], [A.wake + .5, { x: 1010, y: 532, s: 1.02 }], [A.screen - .25, { x: 1050, y: 522, s: 1.05 }],
    [A.screen + .75, { x: 610, y: 618, s: 1.3 }], [A.rev - .15, { x: 640, y: 612, s: 1.33 }], [A.rev + 2.2, { x: 1255, y: 470, s: 1.22 }],
    [PUSH, RC_PUSH]];
  const rcAt = (t) => F.viewPath(t, RC);
  const youRoom = (t) => {
    const u = Math.sin(Math.PI * span(t, A.wake + .05, A.wake + 1.7)), e = sineIO(u);
    return { x: 960, armR: [lerp(.2, 2.9, e), lerp(.1, 3.05, e)], armL: [lerp(-.2, -2.9, e), lerp(-.1, -3.05, e)], look: .15 + .35 * e, dir: 1 };
  };
  const roomOpts = (t) => ({ you: youRoom(t), casement: sineIO(span(t, A.amish - 1.5, A.amish + .2)) });

  function cables(ctx, t) {
    const u = span(t, PL0, PL0 + 1.6); if (u <= 0) return;
    const pull = expoOut(span(t, A.plug - .04, A.plug + .2)), back = sineIO(span(t, A.plug + .55, A.plug + 1.5));
    const px = PLUG + 78 * pull + 420 * back, py = BUS - 60 * back;
    const x0 = F.rowX(12), xb = lerp(x0, 1752, expoOut(u));
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = mixHex(P.ind2, CREAM2, .35); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(x0, BUS); ctx.lineTo(xb, BUS); ctx.stroke();
    for (const e of F.ENDINGS) { const x = F.rowX(e.n); if (x > xb) continue; const du = clamp((xb - x) / 120); ctx.beginPath(); ctx.moveTo(x, BUS); ctx.lineTo(x, lerp(BUS, S.LEVER_Y + 18, du)); ctx.stroke(); }
    ctx.strokeStyle = rgba(CREAM, .45 * (1 - .6 * span(t, A.plug, A.plug + 1))); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, BUS - 2); ctx.lineTo(xb, BUS - 2); ctx.stroke();
    // the socket post
    const su = span(u, .5, 1);
    if (su > 0) { ctx.globalAlpha *= clamp(su * 2); ctx.fillStyle = mixHex(P.night1, P.blue1, .5); ctx.beginPath(); ctx.roundRect(SOCK - 4, BUS - 46, 34, 92, 6); ctx.fill(); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = P.night0; ctx.fillRect(SOCK + 4, BUS - 12, 5, 8); ctx.fillRect(SOCK + 4, BUS + 4, 5, 8); ctx.globalAlpha = 1; }
    // the plug + its cable (from the end of the bus)
    if (u >= 1) {
      ctx.strokeStyle = mixHex(P.ind2, CREAM2, .35); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(1752, BUS);
      ctx.quadraticCurveTo((1752 + px) / 2, BUS + 18 * pull + 30 * back, px - 20, py); ctx.stroke();
      ctx.fillStyle = mixHex(CREAM, P.ind2, .25); ctx.beginPath(); ctx.roundRect(px - 22, py - 16, 40, 32, 7); ctx.fill();
      ctx.fillStyle = CREAM2; ctx.fillRect(px + 18, py - 10, 14, 4); ctx.fillRect(px + 18, py + 6, 14, 4);
    }
    // power: small lights running from the socket toward the doors until the plug is out
    const on = 1 - span(t, A.plug, A.plug + .12);
    if (u >= 1 && on > 0) for (let k = 0; k < 9; k++) { const x = 1752 - (((t * 260 + k * 190) % 1520)); ctx.fillStyle = rgba(CREAM, .85 * on); ctx.beginPath(); ctx.arc(x, BUS - 2, 4, 0, TAU); ctx.fill(); }
    const sp = Math.sin(Math.PI * span(t, A.plug - .02, A.plug + .2)); if (sp > 0) halo(ctx, SOCK, BUS, 60, .6 * sp, F.LAMP.body, F.LAMP.core);
    ctx.restore();
    return [px, py];
  }
  function handAt(ctx, t, pp) {
    const hin = sineIO(span(t, A.pull - .75, A.pull - .05)), hout = span(t, A.plug + 1.5, A.plug + 1.6);
    if (hin <= 0 || hout >= 1 || !pp) return;
    const [px, py] = pp, gx = px + 50, gy = py + 4;
    const x = lerp(2150, gx, hin), y = lerp(740, gy, hin);
    F.hand(ctx, x, y, Math.PI + .08, 74, { pose: t > A.pull - .15 ? 'hold' : 'open', a: clamp(hin * 3) });
  }
  function drawRow(ctx, t) {
    const v = vAt(t), far = v.s > 13;
    const open6 = span(t, FLY0 - .2, FLY0 + .45);
    S.rowScene(ctx, t, T, { n: 6, v, parked: 'key',
      a: far ? (m) => (m === 6 ? 1 : 0) : undefined,
      lit: (m) => { const base = m === 6 ? 1 : m > 6 ? .22 : .6; return lerp(base, .07, outU(m, t)); },
      beam: (m) => (m === 6 ? .8 : .3 * (1 - outU(m, t))),
      open: (m) => (m === 6 && open6 > 0 ? open6 : undefined),
      inner: (m) => (m === 6 && open6 > 0 ? B.doorInner(v, t, rcAt(t), B.roomWood, roomOpts(t), 26) : undefined),
    });
    let pp = null; F.inView(ctx, v, () => {
      for (const e of F.ENDINGS) { const o = outU(e.n, t); if (o <= 0 || far) continue; const x = F.rowX(e.n); ctx.fillStyle = rgba(P.night0, .6 * o); ctx.fillRect(x - F.ROW.w / 2, F.ROW.y - F.ROW.h, F.ROW.w, F.ROW.h); }
      pp = cables(ctx, t); handAt(ctx, t, pp);
    });
    hudKey(ctx, t);
    F.scenarioTag(ctx, span(t, A.wake - .15, A.wake + .45));
  }
  function drawRoom(ctx, t) {
    const rc = rcAt(t);
    B.roomWood(ctx, t, rc, roomOpts(t));
    F.inView(ctx, rc, () => { F.big(ctx, F.END[6].name, 1255, 150, 64, span(t, A.rev + .25, A.rev + .85), { gold: 0 }); });
    F.counterHud(ctx, t, T, { parked: 'key' }); hudKey(ctx, t);
    F.scenarioTag(ctx, span(t, A.wake - .15, A.wake + .45) * (1 - span(t, PUSH - .5, PUSH)));
  }

  // ---------------------------------------------------------------- 6.05 – 6.09 · the waffles on the yard, the phone, the throne
  const PLOTS = B.fieldPlots(B.rectOn(RC_PUSH, B.WOOD_WIN), 0);
  const WY0 = 318, WXA = 600, DIM = mixHex(P.night1, CREAM, .16);
  const CAMY = [[PUSH, { x: 960, y: 540, s: 1 }], [A.less - .2, { x: 960, y: 532, s: 1.03 }], [A.less + 1.3, { x: 961, y: 536, s: 1.0 }],
    [A.targets, { x: 930, y: 548, s: 1.06 }], [A.targets + 1.3, { x: 965, y: 560, s: 1.42 }], [A.others - .3, { x: 962, y: 552, s: 1.36 }], ...camKeys78(A)];
  const vyAt = (t) => F.viewPath(t, CAMY);
  const pairU = (t) => sineIO(span(t, A.less - .05, A.less + 1.25));
  const xA = (t) => lerp(WXA, 1040, pairU(t)), xB = (t) => lerp(WXA, 520, pairU(t));
  const nA = (t) => 58 * expoOut(span(t, A.half + .05, A.half + 1.0));
  const nB = (t) => 58 - 34 * sineIO(span(t, A.quarter - 1.0, A.quarter + .25));
  const M0 = PUSH + .1;
  const morphU = (k) => { const r = Math.floor(k / 10), c = k % 10, d = .05 * r + .02 * Math.abs(c - 4.5); return (t) => sineIO(span(t, M0 + d, M0 + d + .8)); };
  const MU = Array.from({ length: 100 }, (_, k) => morphU(k));
  const COLLAPSE = (k, side) => { const r = Math.floor(k / 10), c = k % 10, d = .012 * (side ? 99 - k : k) * .5 + .0 * r * c; return (t) => sineIO(span(t, A.targets - .15 + d, A.targets + .55 + d)); };
  const CA = Array.from({ length: 100 }, (_, k) => COLLAPSE(k, 1)), CB = Array.from({ length: 100 }, (_, k) => COLLAPSE(k, 0));
  const rectQ = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const mixQ = (a, b, u) => a.map((p, i) => [lerp(p[0], b[i][0], u), lerp(p[1], b[i][1], u)]);
  const toS = (v, q) => q.map(([x, y]) => F.toScreen(v, x, y));
  // one waffle cell k at t (screen quad + colour), side A (the 2026 waffle) or B (its clone)
  function cellsDraw(ctx, t, v, side) {
    const x0 = side ? xA(t) : xB(t), n = side ? nA(t) : nB(t);
    if (!side && pairU(t) <= 0) return;
    for (let k = 0; k < 100; k++) {
      const cu = (side ? CA : CB)[k](t); if (cu >= 1) continue;
      const [cx, cy] = B.cellXY(x0, WY0, k);
      let q = toS(v, rectQ(cx, cy, B.CELL, B.CELL)), col = mixHex(DIM, DATA.human, clamp(n - k));
      if (side) { const mu = MU[k](t); if (mu < 1) { q = mixQ(PLOTS[k], q, mu); col = mixHex(B.plotCol(k), col, mu); } }
      if (cu > 0) { q = mixQ(q, toS(v, rectQ(PHONE.x, PHONE.y, PHONE.w, PHONE.h)), cu); col = mixHex(col, mixHex(P.night1, P.ind2, .6), cu); }
      ctx.fillStyle = col; B.poly(ctx, q); ctx.fill();
    }
  }
  const twParams = (t) => ({
    lock: span(t, A.targets + .45, A.targets + 1.05), mon: span(t, A.notAI - .35, A.notAI + .45), ground: span(t, A.targets + .55, A.targets + 1.5),
    school: span(t, A.others - .55, A.others + .7), throne: span(t, A.others + .3, A.rules - .05), disc: span(t, A.rules - .12, A.rules + .45),
  });
  function waffleLayer(ctx, t, v) {
    cellsDraw(ctx, t, v, 0); cellsDraw(ctx, t, v, 1);
    if (t > A.targets + .3 && t < A.targets + 1.2) F.inView(ctx, v, () => phoneRect(ctx));
  }
  function drawYard(ctx, t) {
    const v = vyAt(t), R0 = 1320, r = R0 * sineIO(span(t, PUSH + .1, PUSH + 2.7)), cxy = [960, 520];
    if (r < R0) {   // the field world outside the flood circle
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(cxy[0], cxy[1], Math.max(.1, r), 0, TAU); ctx.clip('evenodd');
      B.roomWood(ctx, t, RC_PUSH, { ...roomOpts(t), plots: false, workers: false });
      waffleLayer(ctx, t, v);
      F.inView(ctx, RC_PUSH, () => { ctx.save(); const R = B.WOOD_WIN; ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip(); B.fieldWorkers(ctx, t, R, 1); ctx.restore(); });
      ctx.restore();
    }
    if (r > 0) {
      ctx.save(); if (r < R0) { ctx.beginPath(); ctx.arc(cxy[0], cxy[1], r, 0, TAU); ctx.clip(); }
      F.yard(ctx, t, v, { lx: 960, ly: 470, pool: .8, rails: 1 });
      throneWorld(ctx, t, v, twParams(t));
      waffleLayer(ctx, t, v);
      ctx.restore();
    }
    // type and tags (yard, ride the camera)
    F.inView(ctx, v, () => {
      const sink = (u0) => 1 - span(t, A.targets - .25, A.targets + .25) * u0;
      const pu = pairU(t), cxA = xA(t) + 181, cxB = xB(t) + 181;
      F.label(ctx, TXT.e6.bans, lerp(781, 961, pu), WY0 - 36, span(t, A.ban - .1, A.ban + .5) * sink(1), { size: 28 });
      F.big(ctx, TXT.e6.share, cxA, WY0 + 363 + 70, 46, span(t, A.half + .35, A.half + .95) * sink(1), { gold: .15 });
      F.big(ctx, TXT.e6.before, cxB, WY0 + 363 + 70, 46, span(t, A.quarter - .05, A.quarter + .55) * sink(1), { gold: 0, col: CREAM2 });
      F.big(ctx, TXT.e6.screens, 960, 790, 56, span(t, A.notAI - .45, A.notAI + .2) * (1 - span(t, A.others + .5, A.others + 1.0)), { gold: .2 });
    });
    const tg = span(t, A.march + .05, A.march + .6), tOut = span(t, A.less - .45, A.less + .05);
    if (tg > 0 && tOut < 1) {
      const [tx, ty] = F.toScreen(v, 1335, 455);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.switchTag(ctx, t, tx, ty, F.END[6].tag, tg, { out: tOut }); ctx.restore();
      B.tagToHud(ctx, t, T, 6, [tx, ty]);
    }
    F.source(ctx, t, A.march + .5, A.targets, TXT.e6.src);
    F.counterHud(ctx, t, T, { parked: 'key' }); hudKey(ctx, t);
  }

  const draw = (ctx, t) => (t < FLY1 ? drawRow(ctx, t) : t < PUSH ? drawRoom(ctx, t) : drawYard(ctx, t));
  return [
    { t: R.a, draw: (ctx, t) => S.plateRow(ctx, t, T, 6), print: F.PRINT71 },
    { t: PL0, draw, print: F.PRINT71 },
  ];
}
