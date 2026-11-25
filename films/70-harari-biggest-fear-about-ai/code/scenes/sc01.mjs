// c01 · HOOK (lead, the quality reference) · "Yuval Noah Harari's" → 'His word for it' (plateDementia).
// A motion-design sequence, not a world ride: every sentence gets its own picture that shows exactly what it says; the pictures hand over
// through carrier objects (the link in your hand → your card · the reader's cable → the light line → the knot → the desk · the line drops
// into the hill → the cow · her ear tag → the quote card → folds back into the line · the person at the desk → the machine screen → the
// clip frame → folds into the rule of plateDementia). Leitbild only in H.01–H.02 (anchor 1 of 4). No planned hard cut.
//
// | ID    | anchor (phrase)                      | zeigt wörtlich                                                       | kind   | carrier out                    |
// |-------|--------------------------------------|----------------------------------------------------------------------|--------|--------------------------------|
// | H.01  | Yuval Noah Harari's                  | thumbnail A title; the chain over the night, you hold one end        | ANCHOR | the link in your hand          |
// | H.02  | It starts with something             | push into your hand: the link flattens into your card; TODAY         | SCENE  | the card                       |
// | H.03  | You held your card                   | the reader rises out of the counter, your sleeve brings the card     | SCENE  | the reader                     |
// | H.04  | A beep                               | one gold ring pulses out, a gold check draws (hard accent)           | SCENE  | the ring                       |
// | H.05  | The bread was yours                  | the loaf slides along the counter into your hand                     | SCENE  | the reader's cable             |
// | H.06  | What happened in between             | pull back: a light line from the reader into a knot of boxes, ? on each | EXPL | the line runs on               |
// | H.07  | Somebody, somewhere                  | at the far end a person at a desk, the lamp lights: SOMEBODY UNDERSTOOD IT | EXPL | the line drops               |
// | H.08  | A cow lives like that                | the line drops into a hill ridge, a cow rises out of it, grazing     | SCENE  | the line of trade above her    |
// | H.09  | Bought and sold …                    | buyers on a line of light above her pass gold coins hand to hand; she grazes | MIX | her ear tag                |
// | H.10★ | Harari's warning                     | the ear tag grows into quote card Q2, words light as spoken          | EXPL   | the card folds into the line   |
// | H.11  | So on the day only machines …        | back at the knot: the person walks out, a machine screen rises; WHO DO YOU TRUST? | EXPL | the machine screen    |
// | H.12  | Hear it from him                     | the machine screen grows into the clip frame                          | MIX    | the frame                      |
// | H.13  | slot C1                              | C1 (lower third: Harari · in conversation with Mustafa Suleyman)     | CLIP   | the frame folds into the rule  |
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f70_kit.mjs';
import * as S from '../lib/f70_world.mjs';
import * as X from '../lib/f70_explain.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, LAMP, SOURCES: SRC } = F;
const PR = F.PRINT70;
const TAU = Math.PI * 2;

export default async (T, R) => {
  const G = (p, n = 0, after) => T.G(p, n, after);
  const A = {
    start: G('It starts with something'), today: G('you did today'), held: G('You held your card'), beep: G('A beep'), bread: G('The bread was yours'),
    between: G('What happened in between'), some: G('Somebody, somewhere'), cow: G('A cow lives like that'), bought: G('Bought and sold'),
    warn: G("Harari's warning"), day: G('So on the day only machines'), who: G('who do you trust'), hear: G('Hear it from him'),
  };
  const C1 = T.clip('C1'), Q2 = T.clip('Q2'), T0 = R.b, tP = T0 - S.SEAM_HALF;
  const foldU = (t) => sineIO(span(t, C1.end - .05, Math.min(C1.end + .7, T0 - .03)));

  // ---------------------------------------------------------------- stage L: the Leitbild (anchor 1/4), push into your hand
  const home = (() => { const c = createCanvas(W, H); return S.chainWorld(c.getContext('2d'), 0, S.homeCam(), {}); })();
  const HAND = home.hand, CARD0 = { x: 800, y: 470, w: 300 };       // where the card lands on the board (screen = board at V0)
  const pushU = (t) => sineIO(span(t, A.start - .15, A.start + 1.55));
  function camL(t) {
    const pre = .07 * sineIO(span(t, 0, A.start)), k = pushU(t), z = (1 + pre) * Math.pow(7.2, k);
    return E.cam(z, HAND[0], HAND[1], lerp(HAND[0], CARD0.x, k), lerp(HAND[1], CARD0.y, k));
  }
  const MORPH = [A.start + .85, A.start + 1.75], MASK = [A.start + .95, A.start + 2.05];
  function leitbild(ctx, t) {
    const w = S.chainWorld(ctx, t, camL(t), { sway: 7 });
    F.title(ctx, t, 1, { sub: SRC.titleSub, out: span(t, A.start - .25, A.start + .8) });
    return w;
  }

  // ---------------------------------------------------------------- stage B: THE TRUST BOARD (board units = screen px at V0)
  const RD = { x: 1180, y: 706, w: 230 };                             // the card reader on the counter
  const K = { x: 2350, y: 260 }, DK = { x: 3150, y: 470, h: 240 };    // the knot, the desk
  const RIDGE = (x) => 1560 + ((x - 2900) / 900) ** 2 * 120, COW = { x: 2900, h: 280 };
  const TRADE = { y: 1200, x0: 2150, x1: 3650, h: 150 };
  const V0 = { x: W / 2, y: H / 2, s: 1 };
  const VB = [[0, V0], [A.between - .1, { x: 975, y: 535, s: 1.0 }], [A.between + 2.1, { x: 2250, y: 420, s: .78 }], [A.some + 1.4, { x: 2560, y: 410, s: .82 }],
    [A.cow - .1, { x: 2700, y: 520, s: .82 }], [A.cow + 1.5, { x: 2900, y: 1380, s: 1 }], [A.bought + 1.2, { x: 2900, y: 1330, s: .92 }],
    [A.day + .1, { x: 2905, y: 1325, s: .92 }], [A.day + 2.3, { x: 2600, y: 380, s: .82 }], [C1.start + .4, { x: 2610, y: 382, s: .83 }],
    [C1.end - .4, V0]];
  const view = (t) => X.viewPath(t, VB);
  const lab = (t, a, b) => span(t, a, a + .6) * (1 - span(t, b - .4, b + .1));
  const MRECT = (() => { const w = DK.h * .7, dy = DK.y - DK.h * .42, mx = DK.x + DK.h * 1.05 * .08; return { x: mx - w / 2, y: dy - w * .66, w, h: w * .66 }; })();

  function bakery(ctx, t) {
    const lampOn = span(t, A.held - .3, A.held + .6);
    X.counterTop(ctx, t, -600, 2600, RD.y + 14, { u: span(t, A.start + 1.3, A.start + 2.6), lamp: lampOn, lampX: 980 });
    const rise = expoOut(span(t, A.held - .25, A.held + .55));
    if (rise > 0) { ctx.save(); ctx.beginPath(); ctx.rect(RD.x - 300, -2000, 600, RD.y + 2000); ctx.clip();
      F.terminal(ctx, t, RD.x, RD.y + (1 - rise) * 360, RD.w, { wake: span(t, A.held + .2, A.held + .7), ring: span(t, A.beep - .02, A.beep + .75), check: span(t, A.beep, A.beep + .4) });
      ctx.restore(); }
    X.label(ctx, SRC.today, 640, 840, lab(t, A.today - .1, A.between + .4), { size: 34, spacing: .3, gold: .3 });
    // the loaf slides in from the right along the counter, into your hand
    const bu = expoOut(span(t, A.bread - .1, A.bread + 1.1));
    if (bu > 0) F.bread(ctx, t, lerp(2300, 700, bu), RD.y, 300, { rot: (1 - bu) * -.02 });
  }
  // your sleeve + the card (screen = board coordinates)
  function hand(ctx, t) {
    const inU = expoOut(span(t, A.start + 1.55, A.held + .15)), go = sineIO(span(t, A.held + .1, A.beep - .08)), back = sineIO(span(t, A.bread - .05, A.bread + .9));
    const tap = Math.sin(Math.PI * span(t, A.beep - .1, A.beep + .25)) * 10;
    const cx = lerp(lerp(CARD0.x, RD.x + 30, go), 640, back), cy = lerp(lerp(CARD0.y, RD.y - 250 + tap, go), RD.y - 150, back);
    const rot = lerp(lerp(-.08, -.22, go), -.02, back) + .015 * Math.sin(t * 1.4);
    const cw = lerp(lerp(CARD0.w, 250, go), 200, back);
    if (inU > 0) F.sleeve(ctx, t, lerp(-260, cx - cw * .52, inU), cy + 26 + (1 - inU) * 40, { ang: rot + .05 + .02 * Math.sin(t * 1.1), len: 900, open: back });
    return { cx, cy, rot, cw };
  }
  function knotStage(ctx, t) {
    const cab = [RD.x + RD.w * .2, RD.y - RD.w * 1.45 * .1];
    const k = X.knot(ctx, t, K.x, K.y, { u: span(t, A.between + .5, A.between + 2.0), q: span(t, A.between + 1.0, A.between + 2.2), pulse: span(t, A.between + 2.2, A.between + 3) * (1 - span(t, A.day + 1, A.day + 2) * .6) });
    X.lightLine(ctx, [cab, [1330, 560], [1620, 300], [1900, k.entry[1]], k.entry], span(t, A.between - .05, A.between + 1.4), { w: 3 });
    X.lightLine(ctx, [k.exit, [DK.x - 200, DK.y - 130]], span(t, A.some - .3, A.some + .5), { w: 3 });
    const da = span(t, A.between + 1.4, A.between + 2.2);
    X.deskPerson(ctx, t, DK.x, DK.y, DK.h, { a: da, lamp: span(t, A.some, A.some + .7), machine: span(t, A.day + 1.5, A.day + 3.1) });
    X.label(ctx, SRC.understood, DK.x, DK.y + 90, lab(t, A.some + .4, A.cow), { size: 26, gold: .3 });
  }
  function cowStage(ctx, t) {
    // the line drops from the desk floor into the hill ridge, the ridge runs both ways
    X.lightLine(ctx, [[DK.x + 140, DK.y], [DK.x + 230, 1000], [3300, RIDGE(3300)]], span(t, A.cow - .35, A.cow + .45), { w: 3 });
    const ru = span(t, A.cow + .3, A.cow + 1.3), ridge = (a, b) => { const p = []; for (let i = 0; i <= 40; i++) { const x = lerp(a, b, i / 40); p.push([x, RIDGE(x)]); } return p; };
    if (ru > 0) {
      ctx.fillStyle = mixHex(P.night0, P.ind1, .22); ctx.beginPath(); const L = ridge(lerp(3300, 1700, expoOut(ru)), lerp(3300, 4300, expoOut(ru)));
      ctx.moveTo(L[0][0], 2600); L.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(L[L.length - 1][0], 2600); ctx.fill();
      X.lightLine(ctx, ridge(3300, 1700), ru, { w: 2.5, a: .6 }); X.lightLine(ctx, ridge(3300, 4300), ru, { w: 2.5, a: .6 });
    }
    const cu = expoOut(span(t, A.cow + .5, A.cow + 1.5));
    let tag = null;
    if (cu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(COW.x - 600, RIDGE(COW.x) - 900, 1200, 900 + 2); ctx.clip();
      const c = F.cow(ctx, t, COW.x, RIDGE(COW.x) + (1 - cu) * COW.h * 1.1, COW.h, { dir: -1, graze: .55 + .45 * Math.sin(t * .5) ** 2, tag: span(t, A.warn - .5, A.warn) });
      tag = c.tag; ctx.restore(); }
    // the line of trade above her: buyers on a thin line of light, coins hop from hand to hand, the hands change
    const tu = span(t, A.bought - .15, A.bought + .7);
    if (tu > 0) {
      X.lightLine(ctx, [[COW.x, TRADE.y], [TRADE.x0, TRADE.y]], tu, { w: 2, a: .55 }); X.lightLine(ctx, [[COW.x, TRADE.y], [TRADE.x1, TRADE.y]], tu, { w: 2, a: .55 });
      const pu = expoOut(span(t, A.bought + .3, A.bought + 1.2)), sh = (t - A.bought) * 55, n = 5, gap = (TRADE.x1 - TRADE.x0) / n, xs = [];
      for (let i = 0; i < n; i++) {
        const x = TRADE.x0 + ((i * gap + sh) % (TRADE.x1 - TRADE.x0)), edge = Math.min(1, (x - TRADE.x0) / 160, (TRADE.x1 - x) / 160);
        xs.push([x, edge]);
        ctx.save(); ctx.globalAlpha *= clamp(edge); ctx.beginPath(); ctx.rect(x - 200, TRADE.y - 400, 400, 400); ctx.clip();
        E.person(ctx, x, TRADE.y + (1 - pu) * TRADE.h * 1.1, TRADE.h, { dir: i % 2 ? -1 : 1, light: .6, look: .2 * Math.sin(t * .7 + i), armR: [1.3, 1.6], armL: [-.3, -.2], rim: LAMP.body });
        ctx.restore();
      }
      const cu2 = span(t, A.bought + 1.0, A.bought + 1.4);
      if (cu2 > 0) { xs.sort((a, b) => a[0] - b[0]); for (let i = 0; i + 1 < xs.length; i++) {
        const [xa, ea] = xs[i], [xb, eb] = xs[i + 1], f = ((t - A.bought) * .8 + i * .37) % 1, k = sineIO(f), hy = TRADE.y - TRADE.h * .5;
        F.coin(ctx, t, lerp(xa + 30, xb - 30, k), hy - Math.sin(Math.PI * k) * 70, 16, { flip: f * 2, a: cu2 * clamp(Math.min(ea, eb)) });
      } }
    }
    return tag;
  }

  // ---------------------------------------------------------------- the take
  function hook(ctx, t) {
    const inBoard = t >= MASK[0];
    let w = null;
    if (t < MASK[1]) w = leitbild(ctx, t);
    const v = view(t);
    if (inBoard) {
      const r = sineIO(span(t, MASK[0], MASK[1])) ** .8 * 1500 + 1;
      ctx.save(); if (t < MASK[1]) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(CARD0.x, CARD0.y, r, 0, TAU); ctx.clip(); }
      X.board(ctx, t, v, { lx: v.x, ly: v.y - 20 });
      const hideObj = t > C1.start + .3;
      let tag = null;
      if (!hideObj) X.inView(ctx, v, () => { bakery(ctx, t); if (t > A.between - .2) knotStage(ctx, t); if (t > A.cow - .5) tag = cowStage(ctx, t); });
      if (!hideObj && t < A.between + 2.5) X.inView(ctx, v, () => { const hc = hand(ctx, t); F.payCard(ctx, t, hc.cx, hc.cy, hc.cw, { rot: hc.rot, morph: span(t, MORPH[0], MORPH[1]) }); });
      // Q2 grows out of the ear tag, then folds back into the line of trade
      const gu = expoOut(span(t, A.warn - .15, A.warn + .85)), fold = sineIO(span(t, A.day - .2, A.day + .45));
      if (tag && gu > 0 && fold < 1) {
        const [tx, ty] = X.toScreen(v, tag[0], tag[1]), [lx, ly] = X.toScreen(v, COW.x, TRADE.y), C = { x: 960, y: 262 };
        const cx = lerp(lerp(tx, C.x, gu), lx, fold), cy = lerp(lerp(ty, C.y, gu), ly, fold), s = lerp(.04, 1, gu);
        ctx.save(); ctx.translate(cx, cy); ctx.scale(s * lerp(1, .6, fold), s * Math.max(.015, 1 - fold)); ctx.translate(-C.x, -C.y);
        F.quoteCard(ctx, t, T, { text: SRC.q2.text, credit: SRC.q2.credit, spoken: SRC.q2.spoken, after: Q2 ? Q2.start - 1 : -1, size: 76, w: 1180, y: C.y - 105, u: 1, rot: -.008 });
        ctx.restore();
      }
      X.big(ctx, SRC.whoTrust, W / 2, 176, 84, lab(t, A.who - .1, A.hear + .5), { gold: .3 });
      ctx.restore();
      if (t < MASK[1] && w) {   // the link in your hand, flattening into your card (screen space, above the mask)
        const m = span(t, MORPH[0], MORPH[1]), [fx, fy, fa, fL] = w.first, k = sineIO(span(t, MORPH[0] - .1, MORPH[1]));
        if (t < MASK[1]) F.payCard(ctx, t, lerp(fx, CARD0.x, k), lerp(fy, CARD0.y, k), lerp(fL, CARD0.w, k), { rot: lerp(fa, -.08, k), morph: m });
      }
    }
    // the machine screen → the clip frame → folds into the rule of plateDementia
    if (t >= A.hear - .1) {
      const [x0, y0] = X.toScreen(v, MRECT.x, MRECT.y), from = { x: x0, y: y0, w: MRECT.w * v.s, h: MRECT.h * v.s };
      if (foldU(t) > 0) clipFold(ctx, t);
      else F.clipPlate(ctx, t, T, 'C1', { from, morph: span(t, A.hear - .05, C1.start + .2), dark: (1 - span(t, C1.start - .2, C1.start + .2)) * .35 });
    }
  }
  const draw = (ctx, t) => hook(ctx, t);
  // the clip frame folds into the rule of COLLECTIVE DEMENTIA; runs across the plate entry (tP), so the fold is never a cut
  function clipFold(ctx, t) {
    const rule = { x: W / 2 - S.DEMENTIA.rule.w / 2, y: S.DEMENTIA.rule.y - 1.5, w: S.DEMENTIA.rule.w, h: 3 }, f = foldU(t);
    if (f < 1) F.clipPlate(ctx, t, T, 'C1', { from: rule, morph: 1 - f, dark: .35 * span(f, .4, 1) });
  }
  const marks = [0, A.start, A.held, A.beep, A.bread, A.between, A.some, A.cow, A.bought, A.warn, A.day, A.hear, C1.start, C1.end];
  return [...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => { S.plateDementia(ctx, t, T); clipFold(ctx, t); }, print: PR }];
};
