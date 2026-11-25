// Film 71 · c09 (B2): ENDING 4/12 GATEKEEPER. One continuous take, no cut (docs/shots.md 4.01 – 4.17):
//   the booth of c08 opens: the guard (a slim column of cool light, the ring as its head) rises out of it before the gate, a workshop and
//   your house draw on behind: GATEKEEPER, its one task (a line from its eye to the workshop door) → NO SECOND SUPERINTELLIGENCE on the
//   workshop → fly into your house window: SCENARIO, the kitchen, the helper sets the table; two bars: you, the helper almost as far → its
//   bar locks short of the end → out again: a cap line runs across the whole picture: PROGRESS CAPPED → the guard folds into a law sheet:
//   BAN ARTIFICIAL SUPERINTELLIGENCE ACT · PERMANENTLY · SEP 23, 2026 → "AI authoritarianism" · R Street → LITTLE CHANCE IN CONGRESS · AP,
//   the sheet tips back → it becomes the HUGGING FACE box of ending 12, the eye flies out of the HUD pocket, the escaped lights blink, ? →
//   ★ the eye opens and rings them: SPOTTED BY AI GUARDS → the chip flies out of its pocket, the camera tilts down to the row: two tracks
//   leave the chip (door 9, door 4), a hand rests on the lever and flips it ("People do"). c10 continues on the same row (rowAt + camKeys910).
// The row lives one yard period away (O = 2700, 2100: the rails repeat), in its own standard coordinates (vL = v − O), so c10 / c11 / the
// plate plateRow(1) use the standard row view.
import * as F from '../lib/f71_kit.mjs';
import * as S from '../lib/f71_world.mjs';
import * as B from '../lib/b2_extra.mjs';
import { anchors08, boothWorld, booth89, camKeys89, GND, BOOTH, GATE, RING5 } from './sc08.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, GOLD, CREAM, CREAM2, COOL, LAMP, PAPER, TXT, DATA } = F;
const TAU = Math.PI * 2;

export const O = { x: 2700, y: 2100 };
export function anchors09(T, a) {
  const G = (p, n = 0, af = a - .1) => T.G(p, n, af);
  const A = {
    a, gk: G("That's the Gatekeeper"), gkW: G('Gatekeeper:'), task: G('with one task'), make: G('Make sure nobody builds another'), another: G('builds another'),
    free: G('You wake up free'), helper: G('A helper robot is in'), almost: G('almost as smart'), never: G('It will never get smarter'),
    capped: G('Progress is capped, for good'), today: G('Today, the guard would be'), law: G('a law.'), sept: G('In September, American lawmakers'),
    ban: G('ban superintelligence'), perm: G('permanently'), think: G('One think tank calls that'), auth: G('authoritarian'),
    little: G('The bill has little chance'), small: G('But a small guard already'), spotted: G("What spotted July's breakout"),
    hf: G("Hugging Face's own AI guards"), chip: G('And that chip tracking from'), serve: G('It would serve a gatekeeper'), tool: G("The tool doesn't decide"),
  };
  A.people = G('People do', 0, A.tool); A.three = G('Three endings left');
  return A;
}
// ---------------------------------------------------------------- the row at the end of c09 / the start of c10 (shared)
// row-local coords (standard row): the chip, its two tracks (door 9, door 4), the lever + the hand. p: { chip [x, y, s] | null, tracks u, lev (0 → 1 flipped), hand 0..1, fold 0..1 }
export const CHIP = [960, 842], LEVB = [960, 905];
const TR9 = F.bez([CHIP[0] - 24, CHIP[1] - 18], [CHIP[0] - 140, CHIP[1] - 30], [F.rowX(9) + 60, S.LEVER_Y + 60], [F.rowX(9), S.LEVER_Y + 26]);
const TR4 = F.bez([CHIP[0] + 24, CHIP[1] - 18], [CHIP[0] + 140, CHIP[1] - 30], [F.rowX(4) - 60, S.LEVER_Y + 60], [F.rowX(4), S.LEVER_Y + 26]);
export const rowLit = (T, t) => {   // the row's state across the c09 | c10 seam: n 4 → 3 (the counter rolls on 'Three endings left')
  const k = F.counterTimes(T), u = sineIO(span(t, k.at[3] - .25, k.at[3] + .45));
  const st = (m, n) => (m === n ? 1 : m > n ? .22 : .6), sc = (m, n) => (m === n ? 1.06 : 1), bm = (m, n) => (m === n ? .8 : .3);
  return { lit: (m) => lerp(st(m, 4), st(m, 3), u), scale: (m) => lerp(sc(m, 4), sc(m, 3), u), beam: (m) => lerp(bm(m, 4), bm(m, 3), u), n: u < .5 ? 4 : 3 };
};
export function rowExtras(ctx, t, vL, p) {
  F.inView(ctx, vL, () => {
    const f = sineIO(clamp(p.fold ?? 0)), tu = clamp(p.tracks ?? 0) * (1 - f), lv = sineIO(clamp(p.lev ?? 0));
    if (tu > 0) {
      F.track(ctx, TR9, tu, { a: lerp(.95, .45, lv), gap: 16 });
      F.track(ctx, TR4, tu, { a: lerp(.45, .95, lv), gap: 16, col: mixHex(CREAM, LAMP.core, lv) });
      const ba = span(tu, .3, 1); if (ba > 0) { const ang = lerp(-.55, .55, lv); ctx.save(); ctx.globalAlpha *= ba; ctx.strokeStyle = CREAM; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(CHIP[0], CHIP[1] - 34); ctx.lineTo(CHIP[0] + Math.sin(ang) * 46, CHIP[1] - 34 - Math.cos(ang) * 30); ctx.stroke(); ctx.restore(); }
    }
    const lu = clamp(p.levU ?? 0), lf = 1 - f;   // the fold pulls the lever down into its base (motion, no fade)
    if (lu > 0 && lf > 0) {
      ctx.save(); ctx.globalAlpha *= lu; F.lightLine(ctx, [[CHIP[0], CHIP[1] + 24], [LEVB[0], LEVB[1] - 6]], lf, { w: 2, a: .4, glow: false });
      const ang = lerp(-.55, .55, lv), [kx, ky] = F.lever(ctx, t, LEVB[0], LEVB[1], ang, 62 * lf, { knob: Math.sin(Math.PI * span(p.lev ?? 0, .2, 1)) });
      const hu = clamp(p.hand ?? 0);
      if (hu > 0) { const e = sineIO(hu); F.hand(ctx, lerp(kx + 230, kx + 64, e), lerp(ky + 190, ky + 58, e), -2.45, 80, { pose: 'hold', a: clamp(hu * 3) }); }
      ctx.restore();
    }
    if (p.chip) { const [x, y, s] = p.chip; F.chip(ctx, t, x, y, s, { ping: 1 }); }
  });
}
export const camKeys910 = (A) => [[A.serve + .4, { x: 960, y: 640, s: 1.0 }], [A.people - .1, { x: 960, y: 636, s: 1.03 }], [A.three + .5, { x: 975, y: 600, s: 1.04 }], [A.three + 1.3, { x: 1250, y: 585, s: 1.45 }]];

export default function (T, R) {
  const A8 = anchors08(T, T.G('The Benevolent Dictator')), A = anchors09(T, R.a);
  const K = F.counterTimes(T);
  // ---------------------------------------------------------------- places (global yard coords)
  const SEN = { x: BOOTH.x, h: 300 }, WS = { x: 3420 }, HOUSE = { x: 3790 }, HW = { x: HOUSE.x + B.HWIN4.x, y: GND + B.HWIN4.y, w: B.HWIN4.w, h: B.HWIN4.h };
  const HWC = [HW.x + HW.w / 2, HW.y + HW.h / 2], SF = 42, CAPY = 300;
  const SHEET = { x: 2800, y: 400, w: 440, h: 560 }, BOX = { x: 2600, y: 330, w: 400, h: 250 }, EYE = [BOX.x + BOX.w - 48, BOX.y + 46];
  const IN1 = A.free + .45, OUT0 = A.capped - .6;
  const L2G = (vL) => ({ x: vL.x + O.x, y: vL.y + O.y, s: vL.s });
  const CAM = [...camKeys89(A8), [A.task + .5, { x: 3100, y: 468, s: 1.13 }], [A.make + .75, { x: 3400, y: 470, s: 1.45 }], [A.make + 1.25, { x: 3450, y: 485, s: 1.6 }],
    [A.free - .6, { x: 3738, y: 546, s: 3.8 }], [IN1, { x: HWC[0], y: HWC[1], s: SF }]];
  const CAM2 = [[OUT0, { x: HWC[0], y: HWC[1], s: SF }], [OUT0 + .95, { x: 3740, y: 540, s: 4 }], [A.capped + 1.85, { x: 3260, y: 420, s: .8 }],
    [A.today - .15, { x: 3245, y: 418, s: .82 }], [A.today + 1.3, { x: 2930, y: 405, s: 1.18 }], [A.ban, { x: 2950, y: 402, s: 1.2 }],
    [A.little + .3, { x: 2965, y: 400, s: 1.22 }], [A.small + .9, { x: 2830, y: 440, s: 1.32 }], [A.hf - .1, { x: 2840, y: 438, s: 1.36 }],
    [A.hf + .5, { x: 2860, y: 432, s: 1.6 }], [A.chip - .05, { x: 2866, y: 432, s: 1.62 }], [A.chip + 1.15, { x: (2866 + O.x + 960) / 2, y: (432 + O.y + 652) / 2, s: .62 }], [A.chip + 2.45, { x: O.x + 960, y: O.y + 652, s: .98 }],
    ...camKeys910(A).map(([tt, v]) => [tt, L2G(v)])];
  const vAt = (t) => (t < IN1 ? F.viewPath(t, CAM) : F.viewPath(t, CAM2));
  const RC = [[A.free - 1, { x: 960, y: 560, s: .96 }], [IN1, { x: 960, y: 555, s: 1.0 }], [A.helper + .6, { x: 880, y: 600, s: 1.1 }],
    [A.almost + .1, { x: 990, y: 560, s: 1.0 }], [A.never + .35, { x: 640, y: 520, s: 1.3 }], [OUT0, { x: 650, y: 515, s: 1.33 }]];
  const rcAt = (t) => F.viewPath(t, RC);
  const kitO = (t) => ({ plates: [span(t, A.helper + .25, A.helper + 1.0), span(t, A.helper + .9, A.helper + 1.65)], arm: Math.max(Math.sin(Math.PI * span(t, A.helper + .1, A.helper + 1.1)), Math.sin(Math.PI * span(t, A.helper + .75, A.helper + 1.75))) });
  const padlock = (ctx, x, y, s, a) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = CREAM; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.arc(x, y - 10 * s, 9 * s, Math.PI, 0); ctx.stroke(); ctx.fillStyle = CREAM; ctx.beginPath(); ctx.roundRect(x - 13 * s, y - 10 * s, 26 * s, 22 * s, 4 * s); ctx.fill(); ctx.fillStyle = P.night1; ctx.fillRect(x - 2 * s, y - 3 * s, 4 * s, 9 * s); ctx.restore(); };
  function bars(ctx, t) {   // room coords: you 100 %, the helper 88 % (locks on "never")
    const u = span(t, A.almost - .1, A.almost + .7); if (u <= 0) return;
    const out = span(t, OUT0 - .1, OUT0 + .2);
    for (const [x0, full, col] of [[1270, 1, DATA.human], [410, .88, DATA.machine]]) {
      ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (1 - out);
      ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.roundRect(x0, 432, 300, 18, 9); ctx.fill(); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.stroke();
      const f = full * expoOut(span(t, A.almost, full < 1 ? A.never + .3 : A.almost + .9)) * (full < 1 ? 1 : 1);
      ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x0, 432, 300 * Math.min(f, full), 18, 9); ctx.fill();
      ctx.restore();
    }
    const lk = span(t, A.never + .25, A.never + .7) * (1 - out);
    if (lk > 0) { ctx.save(); ctx.fillStyle = rgba(CREAM, .9 * lk); ctx.fillRect(410 + 264 - 2, 420, 4, 42); ctx.restore(); padlock(ctx, 410 + 264, 404 - 14 * (1 - expoOut(lk)), 1.2, lk); }
  }
  const drawRoom = (ctx, t, rc) => { B.roomKitchen4(ctx, t, rc, kitO(t)); F.inView(ctx, rc, () => bars(ctx, t)); };
  // the sentinel: rises out of the booth (its ring becomes the head), the booth sinks; folds into the law sheet (4.07)
  const senH = (t) => lerp(86, SEN.h, sineIO(span(t, A.gk + .05, A.gk + 1.2)));
  const foldU = (t) => span(t, A.law - .35, A.law + .55);
  // the eye (from the HUD pocket), the chip (from its pocket)
  function drawYard(ctx, t) {
    const v = vAt(t), vL = { x: v.x - O.x, y: v.y - O.y, s: v.s };
    const rowOn = t > A.chip + .3;
    const pm = sineIO(span(t, A.gk, A.gk + 2)), pd = sineIO(span(t, A.chip, A.chip + 2.45));
    F.yard(ctx, t, v, { lx: lerp(lerp(2400, 3000, pm), O.x + F.rowX(4), pd), ly: lerp(lerp(470, 450, pm), O.y + 560, pd), pool: .8, rails: 1 });
    // the booth world (left from c08): building, booth sinking, gate; the sentinel; workshop; your house; the cap line
    const bp = booth89(A8, t), sink = sineIO(span(t, A.gk + .2, A.gk + 1.2));
    F.inView(ctx, v, () => {
      // the workshop + your house behind the gate
      B.workshop(ctx, t, WS.x, GND, { u: span(t, A.gk + .4, A.gk + 1.9) });
      const hu = span(t, A.gk + 1.0, A.gk + 1.8);
      if (hu > 0) {
        B.yourHouse(ctx, t, HOUSE.x, GND, { u: hu });
        const e = expoOut(hu), wr = { x: HOUSE.x + B.HWIN4.x * e, y: GND + B.HWIN4.y * e, w: HW.w * e, h: HW.h * e };
        ctx.save(); ctx.beginPath(); ctx.rect(wr.x, wr.y, wr.w, wr.h); ctx.clip();
        const [x0, y0] = F.toScreen(v, wr.x, wr.y); ctx.setTransform(1, 0, 0, 1, 0, 0);
        B.roomAt(ctx, t, { x0, y0, w: wr.w * v.s, h: wr.h * v.s }, S.ZEND * v.s * e / SF, rcAt(t), drawRoom);
        ctx.restore();
      }
      // the sign on the workshop (4.02)
      F.signCard(ctx, t, WS.x, GND - 214, { main: ['NO SECOND', 'SUPERINTELLIGENCE'], size: 26, w: 330, u: span(t, A.make - .05, A.make + .55) * (1 - span(t, A.today - .3, A.today + .2)) });
    });
    boothWorld(ctx, t, v, { ...bp, booth: bp.booth * (1 - sink), ring: t > A.gk + .05 ? 0 : bp.ring });
    // the sentinel (rises out of the booth; flips into the law sheet)
    const fo = foldU(t), fx = fo < .45 ? 1 - sineIO(fo / .45) : 0;
    if (t > A.gk + .05 && fo < .45) F.inView(ctx, v, () => {
      ctx.save(); ctx.translate(SEN.x, 0); ctx.scale(fx, 1); ctx.translate(-SEN.x, 0);
      const hd = B.sentinel(ctx, t, SEN.x, GND, senH(t), { w: 26 }); ctx.restore();
      // its one task: a line from its eye to the workshop door
      const lu = span(t, A.task - .1, A.task + .8) * (1 - span(t, A.free - 1.2, A.free - .7)) * fx;
      if (lu > 0 && hd) F.lightLine(ctx, [[hd[0] + 20, hd[1]], [WS.x - 60, GND - 70]], lu, { w: 2.5, col: rgba(COOL.line, .75), dash: [10, 8], glow: false });
    });
    // the cap line across the whole picture (4.06)
    const cu = span(t, A.capped - .1, A.capped + 1.2) * (1 - span(t, A.today + .2, A.today + .9));
    if (cu > 0) F.inView(ctx, v, () => {
      const e = expoOut(cu); F.lightLine(ctx, [[lerp(3250, 1200, e), CAPY], [lerp(3250, 5400, e), CAPY]], 1, { w: 4, a: .9, glow: true });
      F.label(ctx, 'PROGRESS CAPPED', 3250, CAPY - 30, span(cu, .3, 1), { size: 34 });
    });
    // the law sheet (4.07 – 4.10), the HUGGING FACE box (4.11 – 4.13)
    const su = fo > .45 ? sineIO(span(fo, .45, 1)) : 0, tip = span(t, A.little + .25, A.little + 1.4), toBox = span(t, A.small - .1, A.small + .7);
    if (su > 0 && toBox < 1) F.inView(ctx, v, () => {
      const bc = [BOX.x + BOX.w / 2, BOX.y + BOX.h / 2], k = 1 - sineIO(toBox); ctx.save(); ctx.translate(bc[0], bc[1]); ctx.scale(k, k); ctx.translate(-bc[0], -bc[1]); ctx.translate(SHEET.x, 0); ctx.scale(su, 1); ctx.translate(-SHEET.x, 0);
      B.lawSheet(ctx, t, SHEET.x, SHEET.y, SHEET.w, SHEET.h, { u: 1, tip, size: 34, title: [['BAN ARTIFICIAL', span(t, A.ban - .1, A.ban + .4)], ['SUPERINTELLIGENCE ACT', span(t, A.ban + .3, A.ban + .8)]], sub: ['PERMANENTLY', span(t, A.perm - .05, A.perm + .4)] });
      ctx.restore();
    });
    let bf = null;
    const bu = span(t, A.small - .2, A.small + .8), down = sineIO(span(t, A.chip + .1, A.chip + 2.45));
    if (bu > 0) F.inView(ctx, v, () => {
      bf = F.boxField(ctx, t, BOX.x, BOX.y, BOX.w, BOX.h, { u: bu, n: 46, seed: 9, title: 'HUGGING FACE' });
      const bl = span(t, A.spotted, A.spotted + .4), sp = span(t, A.hf, A.hf + .7);
      if (bf) bf.pts.forEach(([x, y], j) => {
        if (j % 3) return;
        if (bl > 0 && sp < 1) { const q = .5 + .5 * Math.sin(t * 9 + j); ctx.fillStyle = rgba(COOL.core, .8 * bl * q * (1 - sp)); ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill(); }
        const a = clamp(sp * 3 - (j % 9) * .2); if (a > 0) { ctx.strokeStyle = rgba(COOL.core, .8 * a); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.stroke(); }
      });
      // ★ the ring pulse from the eye over the box
      const pu = span(t, A.hf + .1, A.hf + 1.3); if (pu > 0 && pu < 1) { ctx.strokeStyle = rgba(COOL.core, .7 * (1 - pu)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(EYE[0], EYE[1], 30 + 420 * expoOut(pu), 0, TAU); ctx.stroke(); }
    });
    // type on the yard
    F.inView(ctx, v, () => {
      F.big(ctx, F.END[4].name, SEN.x, 300, 60, span(t, A.gkW - .1, A.gkW + .5) * (1 - span(t, A.make - .3, A.make + .1)), { gold: 0 });
      const cardU = span(t, A.think + .1, A.think + .7) * (1 - span(t, A.small - .5, A.small));
      F.signCard(ctx, t, 3320, 250, { main: ['“AI authoritarianism”'], sub: 'R Street Institute', size: 32, w: 430, u: cardU, rot: .03 });
      F.label(ctx, TXT.e4.ap, 3360, 470, span(t, A.little + .05, A.little + .6) * (1 - span(t, A.small - .5, A.small)), { size: 26 });
      F.label(ctx, TXT.e4.guards, BOX.x + BOX.w / 2, BOX.y - 64, span(t, A.hf + .35, A.hf + .95) * (1 - span(t, A.chip + .4, A.chip + .9)), { size: 32 });
    });
    const tg = span(t, A.sept + .05, A.sept + .6), tOut = span(t, A.think - .3, A.think + .2);
    if (tg > 0 && tOut < 1) {
      const [tx, ty] = F.toScreen(v, 3320, 190);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.switchTag(ctx, t, tx, ty, F.END[4].tag, tg, { out: tOut }); ctx.restore();
      B.tagToHud(ctx, t, T, 4, [tx, ty]);
    }
    // the row (4.14 on): the camera tilts down to it
    const eyeOut = span(t, A.small + .1, A.small + 1.1);
    if (rowOn) {
      const rl = rowLit(T, t);
      S.rowScene(ctx, t, T, { n: 4, v: vL, yard: false, lit: rl.lit, scale: rl.scale, beam: rl.beam, tags: (m) => (m >= 4 ? 1 : 0), hud: 0 });
      const cf = sineIO(span(t, A.chip, A.chip + 2.45));
      const tracks = span(t, A.serve + .05, A.serve + 1.1), levU = span(t, A.tool - .3, A.tool + .3), hand = span(t, A.tool + .1, A.tool + .9), lev = span(t, A.people + .15, A.people + .55);
      rowExtras(ctx, t, vL, { tracks, levU, hand, lev, chip: cf >= 1 ? [CHIP[0], CHIP[1], 56] : null });
    }
    // the eye: out of its HUD pocket to the box corner (4.11), ? beside it, ★ it opens (4.13)
    if (eyeOut > 0) {
      const [px, py] = F.hudPocket('eye'), [ex, ey] = F.toScreen(v, EYE[0], EYE[1]), e = sineIO(eyeOut);
      const x = lerp(px - 9, ex, e), y = lerp(py, ey, e) - 120 * Math.sin(Math.PI * e), r = lerp(9, 22 * v.s, e) * (1 + .5 * expoOut(span(t, A.hf - .05, A.hf + .6)));
      const op = .55 + .45 * span(t, A.hf - .05, A.hf + .4);
      F.guardEye(ctx, t, x, y, r, { open: op });
      const q = lerp(1, 0, span(t, A.hf, A.hf + .5));
      F.qmark(ctx, x + r * 2.2 + 6, y + r * .9, lerp(26, 54, e) * (1 + .2 * span(t, A.spotted, A.spotted + .5)), q, { col: CREAM });
    }
    // the chip: out of its HUD pocket down to the row
    const cf = span(t, A.chip, A.chip + 2.45);
    if (cf > 0 && cf < 1) {
      const [px, py] = F.hudPocket('chip'), e = sineIO(cf), [cx, cy] = F.toScreen(vL, CHIP[0], CHIP[1]);
      F.chip(ctx, t, lerp(px, cx, e), lerp(py, cy, e) - 160 * Math.sin(Math.PI * e), lerp(26, 56 * vL.s, e), { ping: 1 });
    }
    F.counterHud(ctx, t, T, { parked: t >= A.small && t < A.hf + .1 ? 'eye' : t >= A.chip ? 'chip' : undefined });
  }
  function draw(ctx, t) {
    if (t >= IN1 && t < OUT0) { drawRoom(ctx, t, rcAt(t)); F.counterHud(ctx, t, T); }
    else drawYard(ctx, t);
    F.scenarioTag(ctx, span(t, A.free - .3, A.free + .3) * (1 - span(t, OUT0 - .3, OUT0 + .3)));
  }
  return [{ t: R.a, draw, print: F.PRINT71 }];
}
