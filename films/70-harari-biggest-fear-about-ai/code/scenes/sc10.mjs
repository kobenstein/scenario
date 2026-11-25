// c10 · THE BIG ANSWER (B3) · 'Go back to the cow' → end (incl. the 15 s end screen for the YouTube end cards).
// One take on THE TRUST BOARD from the C3 fold to the W at 9.20, then the Leitbild (anchor 4/4) into S.endScreen.
// The fold of C3 belongs to this take: sc09 hands its background over to makeC10() under the full-size clip plate, so the inner chunk
// boundary at 'Go back to the cow' runs through ONE draw function (seam.mjs proves it).
//
// | ID   | anchor (phrase)            | zeigt wörtlich (what you see)                                                              | kind   | carrier out          |
// |------|----------------------------|--------------------------------------------------------------------------------------------|--------|----------------------|
// | 9.01 | Go back to the cow         | the clip frame folds into the hill line; the cow rises on it, alone, grazing                | SCENE  | the market lines     |
// | 9.02 | Her trouble was never      | market lines run over her, she does not look up: HER TROUBLE: NEVER THE MARKET              | MIX    | the empty place      |
// | 9.03 | She has nobody to ask      | a dashed empty place beside her, a ? over her: NOBODY TO ASK · NO RIGHT TO AN ANSWER         | MIX    | you walk in          |
// | 9.04 | You have both              | you walk in from the right into the empty place, two gold rings in your hands: SOMEONE TO ASK · A RIGHT TO AN ANSWER | MIX | the rings |
// | 9.05 | In some places             | the rings fly up and shrink into two lit dots on a long dark row (EU: RIGHT TO AN EXPLANATION · AI MUST IDENTIFY ITSELF) | EXPL | the row |
// | 9.06 | The rest still has         | the other dots turn into dashed outlines: STILL TO BE BUILT                                 | EXPL   | an arrow             |
// | 9.07 | So Harari is right         | a gold arrow runs along the row: RIGHT ABOUT THE DIRECTION                                  | EXPL   | your life            |
// | 9.08 | More of your life          | home, money, work rise out of you and drift into a cool haze: NO HUMAN CAN FULLY EXPLAIN     | EXPL   | the view rises       |
// | 9.09 | But understanding never    | UNDERSTANDING, its letters fall out of the line                                            | EXPL   | the line             |
// | 9.10 | Trust did                  | TRUST rises gold in the same place                                                         | EXPL   | the HUD chain        |
// | 9.11★| And trust can be tested    | the HUD chain flies in big over TRUST; its three open joints close, every crack fills with gold | EXPL | the chain flies home |
// | 9.12 | Tomorrow you will hold     | the bakery counter again: your sleeve brings your card to the reader                        | SCENE  | the reader           |
// | 9.13 | A beep                     | the ring pulse and the gold check                                                          | SCENE  | the loaf             |
// | 9.14 | The bread is yours         | the loaf slides to you                                                                     | SCENE  | the cable            |
// | 9.15 | And you still won't        | the light line from the reader into the knot of ? boxes, calm                              | EXPL   | the knot             |
// | 9.16 | That was never the danger  | the knot dims to a quiet grey: NEVER THE DANGER                                            | EXPL   | the type             |
// | 9.17 | You were never supposed    | type line 1: YOU WERE NEVER SUPPOSED TO UNDERSTAND EVERYTHING                               | EXPL   | line 2               |
// | 9.18 | You were supposed to know  | line 2: YOU WERE SUPPOSED TO KNOW WHO DOES (WHO gold); the lamp at the desk lights          | EXPL   | WHO                  |
// | 9.19 | Soon, that who may         | WHO flips into WHAT; the person walks out, the machine screen rises; push into its iris     | EXPL   | the iris = the sphere|
// | 9.20 | Make sure it still         | W · ANCHOR 4/4: the chain over the night warms, the sphere answers with one warm light      | ANCHOR | the end picture      |
// | 9.21 | This channel exists        | A.01 subscribe 2: SUPERINTELLIGENCE THAT GOES WELL FOR EVERYBODY                            | ANCHOR | the end picture      |
// | 9.22 | Want that too              | you look up along the chain; SUBSCRIBE rises                                               | ANCHOR | the end picture      |
// | 9.23 | Then subscribe             | its gold underline draws; the picture settles into the end screen                          | ANCHOR | the end screen       |
// | E.01 | end screen                 | S.endScreen (15 s, the two tiles + subscribe space)                                        | ANCHOR |                      |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f70_kit.mjs';
import * as S from '../lib/f70_world.mjs';
import * as X from '../lib/f70_explain.mjs';
import * as B from '../lib/b3_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, LAMP, SOURCES: SRC } = F;
const PR = F.PRINT70;
const TAU = Math.PI * 2;
const { lab } = B;

// the board take of c10 (also used by sc09 under the C3 plate): returns draw(ctx, t)
export function makeC10(T) {
  const a0 = T.G('Go back to the cow');
  const g = (p, after = a0 - .01) => T.G(p, 0, after);
  const A = {
    back: a0, trouble: g('Her trouble was never'), nobody: g('She has nobody'), nobodyW: g('nobody to ask'), noRight: g('no right to'),
    both: g('You have both'), some: g('In some places'), rest: g('The rest still'), so: g('So Harari is right'), more: g('More of your life'),
    but: g('But understanding never'), neverHeld: g('never held'), trustDid: g('Trust did'), tested: g('And trust can be tested'), testedW: g('be tested'),
    tomorrow: g('Tomorrow you will'), card: g('card to a reader'), beep: g('A beep'), bread: g('The bread is yours'), still: g("And you still won't"),
    danger: g('That was never the danger'), never: g('You were never supposed'), know: g('You were supposed to know'), who: g('who does'),
    soon: g('Soon, that who'), whatW: g('a what'), make: g('Make sure it still'),
  };
  const C3 = T.clip('C3');
  const foldU = (t) => sineIO(span(t, C3.end - .05, C3.end + .8));

  // ---------------------------------------------------------------- geography (board units)
  const RY = 720, RIDGE = (x) => RY + ((x - 960) / 1000) ** 2 * 70, COW = { x: 760, h: 250 }, YOUX = 1180;
  const ROW = { y: 210, x0: 300, n: 24, dx: 57 }, LITK = [4, 9];
  const DY = -1100, RD = { x: 1180, y: 706 + DY, w: 230 }, K = { x: 2350, y: 260 + DY }, DK = { x: 3150, y: 470 + DY, h: 240 }, CARD0 = { x: 800, y: 470 + DY, w: 300 };
  // the iris of the machine screen at the desk (deskPerson → aiScreen geometry), the match point of the W at 9.20
  const IRIS = (() => { const dw = DK.h * 1.05, dy = DK.y - DK.h * .42, w = DK.h * .7, hs = w * .66; return { x: DK.x + dw * .08, y: dy - hs * .5, r: hs * .26 }; })();
  const SPH = S.SPHERE, sEnd = SPH.r / IRIS.r;
  const V0 = { x: W / 2, y: H / 2, s: 1 };
  const VB = [[a0, V0], [A.trouble - .2, V0], [A.nobody, { x: 960, y: 548, s: 1.02 }], [A.some - .3, { x: 962, y: 552, s: 1.04 }],
    [A.some + 1.5, { x: 960, y: 430, s: 1.0 }], [A.more - .3, { x: 962, y: 432, s: 1.01 }], [A.more + 2.4, { x: 1040, y: 440, s: 1.0 }],
    [A.but - .5, { x: 1045, y: 440, s: 1.0 }], [A.but + 1.4, { x: 960, y: -560, s: 1 }], [A.tomorrow, { x: 960, y: -560, s: 1 }],
    [A.still - .1, { x: 975, y: -565, s: 1 }], [A.still + 2.1, { x: 2250, y: -680, s: .78 }], [A.danger + .5, { x: 2300, y: -690, s: .79 }],
    [A.never + 1.0, { x: 2560, y: -640, s: .84 }], [A.whatW - .5, { x: 2600, y: -650, s: .86 }],
    [A.make, { x: IRIS.x - (SPH.x - W / 2) / sEnd, y: IRIS.y - (SPH.y - H / 2) / sEnd, s: sEnd }]];
  const view = (t) => (t < a0 ? V0 : X.viewPath(t, VB));

  // ---------------------------------------------------------------- the cow, the empty place, you, the rings, the row
  const MKT = [0, 1, 2].map((j) => { const r = E.prng(31 + j), pts = []; let y = 250 + j * 70; for (let x = 140; x <= 1780; x += 64) { pts.push([x, y]); y += (r() - .5) * 60 - (j - 1) * 2; } return pts; });
  const walkX = (t) => lerp(1880, YOUX, sineIO(span(t, A.both - 1.0, A.both + .45)));
  const ringFly = (t) => sineIO(span(t, A.some + .1, A.some + 1.5));
  const ROWX = (k) => ROW.x0 + k * ROW.dx;
  function cowStage(ctx, t) {
    const ru = span(t, C3.end + .45, C3.end + 1.3);
    if (ru > 0) {
      const L = (a, b) => { const p = []; for (let i = 0; i <= 40; i++) { const x = lerp(a, b, i / 40); p.push([x, RIDGE(x)]); } return p; };
      const e = expoOut(ru), l = L(lerp(960, -300, e), lerp(960, 2200, e));
      ctx.fillStyle = mixHex(P.night0, P.ind1, .22); ctx.beginPath(); ctx.moveTo(l[0][0], 2400); l.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(l[40][0], 2400); ctx.fill();
      X.lightLine(ctx, L(960, -300), ru, { w: 2.5, a: .6 }); X.lightLine(ctx, L(960, 2200), ru, { w: 2.5, a: .6 });
    }
    // market lines over her (cool, systems), run on and off to the right; she grazes on
    for (let j = 0; j < 3; j++) B.lineSpan(ctx, MKT[j], span(t, A.nobody - .5 + j * .1, A.nobody + .6 + j * .1), span(t, A.trouble - .1 + j * .15, A.trouble + 1.6 + j * .15), { w: 2, col: rgba(COOL.line, .75), glowCol: COOL.halo });
    X.label(ctx, 'THE MARKET', 300, 200, lab(t, A.trouble + .5, A.nobody), { size: 26, spacing: .14, col: COOL.text });
    const cu = expoOut(span(t, C3.end + .7, C3.end + 1.6)); let head = null;
    if (cu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(COW.x - 600, RIDGE(COW.x) - 900, 1200, 902); ctx.clip();
      const c = F.cow(ctx, t, COW.x, RIDGE(COW.x) + (1 - cu) * COW.h * 1.1, COW.h, { dir: 1, graze: .55 + .45 * Math.sin(t * .5) ** 2 }); head = c.head; ctx.restore(); }
    // the empty place beside her, a ? that gets no reply
    const arrive = span(t, A.both - .3, A.both + .4);
    B.absent(ctx, YOUX, RIDGE(YOUX), 210, span(t, A.nobodyW - .1, A.nobodyW + .5) * (1 - arrive), t);
    if (head && lab(t, A.nobody + .5, A.both + .2) > 0) X.big(ctx, '?', COW.x + 40, RIDGE(COW.x) - COW.h * 1.45, 84, lab(t, A.nobody + .5, A.both + .2), { gold: 0 });
    // you walk in from the right with the two rings; they stay lit at your side, then fly up into the row
    const wu = span(t, A.both - 1.0, A.both + .45);
    if (wu > 0) {
      const x = walkX(t), walking = wu < 1, h = 200;
      const hs = E.du(ctx, x, RIDGE(x), h, { dir: -1, look: .2 + .1 * Math.sin(t * .6), walk: walking ? t * 8.5 : undefined, armR: walking ? undefined : [.5, .75], armL: walking ? undefined : [-.4, -.3] });
      const fl = ringFly(t), side = sineIO(span(t, A.both + .2, A.both + .9));
      for (let i = 0; i < 2; i++) {
        const hand = (i ? hs.L : hs.R) ?? [x, RIDGE(x) - h * .5];
        const sx = lerp(hand[0] + (i ? 12 : -12), YOUX + 150, side), sy = lerp(hand[1] + 6, RIDGE(YOUX) - 250 + i * 95, side);
        const tx = ROWX(LITK[i]), ty = ROW.y, k = fl, px = lerp(sx, tx, k), py = lerp(sy, ty, k) - Math.sin(Math.PI * k) * 80;
        if (k < 1) F.chainLink(ctx, t, px, py, lerp(lerp(60, 92, side), 18, k), (1 - side) * .6, { lit: .5 + .4 * side * (1 - k) });
        X.label(ctx, ['SOMEONE TO ASK', 'A RIGHT TO AN ANSWER'][i], YOUX + 214, RIDGE(YOUX) - 242 + i * 95, lab(t, A.both + .4 + i * .12, A.some + .6), { size: 26, spacing: .1, align: 'left', gold: .4 });
      }
    }
  }
  function rowStage(ctx, t) {
    const ru = span(t, A.some - .1, A.some + 1.0); if (ru <= 0) return;
    const go = span(t, A.so + .1, A.so + 1.3);
    if (go > 0) { const e = F.goldSpan(ctx, [[ROWX(0) - 40, ROW.y], [ROWX(ROW.n - 1) + 90, ROW.y]], 0, expoOut(go), { w: 3, spark: go < 1 }); if (go >= 1) B.arrowHead(ctx, ROWX(ROW.n - 1) + 92, ROW.y, 0, 16, GOLD.body); }
    else X.lightLine(ctx, [[ROWX(0) - 40, ROW.y], [ROWX(ROW.n - 1) + 40, ROW.y]], ru, { w: 1.5, a: .3, glow: false });
    for (let k = 0; k < ROW.n; k++) {
      const u = span(t, A.some + k * .035, A.some + .4 + k * .035); if (u <= 0) continue;
      const x = ROWX(k), li = LITK.indexOf(k);
      if (li >= 0) { const on = span(t, A.some + 1.35, A.some + 1.6); if (on <= 0) continue; halo(ctx, x, ROW.y, 46, .55 * on, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(x, ROW.y, 10, 0, TAU); ctx.fill(); continue; }
      const d = span(t, A.rest + .1 + k * .03, A.rest + .5 + k * .03), s = expoOut(u);
      ctx.fillStyle = rgba(mixHex(P.night1, P.ind2, .6), 1 - d); ctx.beginPath(); ctx.arc(x, ROW.y, 9 * s, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(CREAM, .25 + .4 * d); ctx.lineWidth = 2; if (d > 0) ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(x, ROW.y, (9 + 4 * d) * s, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    }
    const [l1, l2] = SRC.answer.split(' · ');
    X.label(ctx, l1, ROWX(LITK[0]) - 12, ROW.y - 40, lab(t, A.some + 1.5, A.more - .2), { size: 22, spacing: .06, align: 'left', gold: .3 });
    X.label(ctx, l2, ROWX(LITK[1]) - 12, ROW.y + 54, lab(t, A.some + 1.6, A.more - .2), { size: 22, spacing: .06, align: 'left', gold: .3 });
    X.label(ctx, 'STILL TO BE BUILT', 1440, ROW.y - 40, lab(t, A.rest + .3, A.more - .2), { size: 26, spacing: .14 });
  }
  function lifeStage(ctx, t) {
    const hz = span(t, A.more + .2, A.more + 2.2); if (hz <= 0) return;
    ctx.fillStyle = E.rad(ctx, 1760, 470, 420, [[0, rgba(COOL.halo, .32 * hz)], [.6, rgba(COOL.deep, .2 * hz)], [1, rgba(COOL.deep, 0)]]); ctx.fillRect(1200, 0, 1100, 1000);
    ['house', 'coin', 'tool'].forEach((nm, i) => {
      const u = span(t, A.more + .25 + i * .2, A.more + .9 + i * .2); if (u <= 0) return;
      const d = sineIO(span(t, A.more + 1.0 + i * .25, A.more + 3.8 + i * .25)), rise = expoOut(u);
      const x = lerp(YOUX + (i - 1) * 70, 1640 + i * 50, d), y = lerp(RIDGE(YOUX) - 120, 470 + (i - 1) * 90, rise * .5 + d * .5) - 60 * Math.sin(Math.PI * d);
      E.icon(ctx, nm, x, y, 64, t, { lit: 1 - d, a: clamp(u * 2) * (1 - .55 * d), dust: 0, glow: .6 });
    });
  }

  // ---------------------------------------------------------------- type: UNDERSTANDING falls apart, TRUST stays
  function wordLetters(ctx, t, word, cx, y, size, u, drop0, gold) {
    const ws = [...word].map((c) => F.measure(c, size, true)), tot = ws.reduce((a, b) => a + b, 0) + size * .02 * (ws.length - 1);
    let x = cx - tot / 2;
    [...word].forEach((c, i) => {
      const d = drop0 == null ? 0 : expoIn(span(t, drop0 + i * .07, drop0 + .55 + i * .07));
      if (d < 1 && u > 0) F.goldText(ctx, [[c, gold]], x, y, size, F.rise(u) * (1 - d), { serif: true, glow: true });
      x += ws[i] + size * .02;
    });
  }
  // ---------------------------------------------------------------- the chain: HUD → big (9.11) → HUD
  const bigK = (t) => sineIO(span(t, A.trustDid + .85, A.trustDid + 2.45)) * (1 - sineIO(span(t, A.tomorrow + .1, A.tomorrow + 1.7)));
  const BIGROW = B.rowLayout(W / 2, 400, 210, 232, .58);
  function chainBig(ctx, t) {
    const k = bigK(t);
    const lay = B.mixLayout(B.hudLayout(t), BIGROW, k), sw = Math.sin(t * .9) * .03 * k;
    lay.face.forEach((f) => { f.ang += sw * .3; });
    const acc = Math.sin(Math.PI * span(t, A.testedW - .05, A.testedW + .75));
    if (acc > 0) halo(ctx, W / 2, 400, 720, .45 * acc, GOLD.halo, GOLD.core);
    B.drawLayout(ctx, t, T, lay, { joint: (i) => { const c = span(t, A.tested + .25 + i * .2, A.tested + .75 + i * .2); return { mould: k > .05 ? 1 - c : 0, lit: c * (1 - span(t, A.tomorrow, A.tomorrow + 1)) }; },
      lit: (i) => .35 * acc });
  }

  // ---------------------------------------------------------------- the bakery again, the knot, the desk
  function bakery(ctx, t) {
    const cu = span(t, A.tomorrow + .3, A.tomorrow + 1.5); if (cu <= 0) return;
    X.counterTop(ctx, t, -600, 2600, RD.y + 14, { u: cu, lamp: span(t, A.tomorrow + .8, A.tomorrow + 1.6), lampX: 980 });
    const rise = expoOut(span(t, A.card - .5, A.card + .3));
    if (rise > 0) { ctx.save(); ctx.beginPath(); ctx.rect(RD.x - 300, -4000, 600, RD.y + 4000); ctx.clip();
      F.terminal(ctx, t, RD.x, RD.y + (1 - rise) * 360, RD.w, { wake: span(t, A.card - .1, A.card + .4), ring: span(t, A.beep - .02, A.beep + .75), check: span(t, A.beep, A.beep + .4) });
      ctx.restore(); }
    const bu = expoOut(span(t, A.bread - .1, A.bread + 1.1));
    if (bu > 0) F.bread(ctx, t, lerp(2300, 700, bu), RD.y, 300, { rot: (1 - bu) * -.02 });
    // your sleeve brings the card (in from the left edge, your arm), taps, takes the bread
    const inU = expoOut(span(t, A.tomorrow + .5, A.card - .2)), go = sineIO(span(t, A.card - .1, A.beep - .08)), back = sineIO(span(t, A.bread - .05, A.bread + .9));
    if (inU <= 0) return;
    const tap = Math.sin(Math.PI * span(t, A.beep - .1, A.beep + .25)) * 10;
    const cx = lerp(lerp(CARD0.x, RD.x + 30, go), 640, back), cy = lerp(lerp(CARD0.y + 60, RD.y - 250 + tap, go), RD.y - 150, back);
    const rot = lerp(lerp(-.08, -.22, go), -.02, back) + .015 * Math.sin(t * 1.4), cw = lerp(lerp(260, 250, go), 200, back);
    F.sleeve(ctx, t, lerp(-260, cx - cw * .52, inU), cy + 26 + (1 - inU) * 40, { ang: rot + .05 + .02 * Math.sin(t * 1.1), len: 900, open: back });
    F.payCard(ctx, t, lerp(-200, cx, inU), cy, cw, { rot });
  }
  function knotStage(ctx, t) {
    const ku = span(t, A.still + .4, A.still + 1.9); if (ku <= 0 && t < A.still) return;
    const dim = span(t, A.danger, A.danger + 1.0), cab = [RD.x + RD.w * .2, RD.y - RD.w * 1.45 * .1];
    const k = X.knot(ctx, t, K.x, K.y, { u: ku, q: span(t, A.still + .9, A.still + 2.1) * (1 - .8 * dim), pulse: .5 * (1 - dim), a: 1 - .55 * dim });
    X.lightLine(ctx, [cab, [1330, 560 + DY], [1620, 300 + DY], [1900, k.entry[1]], k.entry], span(t, A.still - .05, A.still + 1.3), { w: 3, a: .85 - .35 * dim });
    X.lightLine(ctx, [k.exit, [DK.x - 200, DK.y - 130]], span(t, A.still + 1.0, A.still + 1.8), { w: 3, a: .85 - .35 * dim });
    X.deskPerson(ctx, t, DK.x, DK.y, DK.h, { a: span(t, A.still + 1.3, A.still + 2.1), lamp: .25 + .75 * span(t, A.who - .1, A.who + .6), machine: span(t, A.soon + .5, A.soon + 2.0) });
  }
  // type lines 1 and 2 (screen space); WHO flips into WHAT
  function typeLines(ctx, t) {
    const s1 = 50, u1 = lab(t, A.never + .1);
    if (u1 > 0) X.big(ctx, 'YOU WERE NEVER SUPPOSED TO UNDERSTAND EVERYTHING', W / 2, 150, s1, u1, { gold: .1 });
    const u2 = span(t, A.know - .1, A.know + .5); if (u2 <= 0) return;
    const sz = 58, f = span(t, A.whatW - .1, A.whatW + .35), sp = sz * .26;
    const head = 'YOU WERE SUPPOSED TO KNOW', wh = F.measure(head, sz, true), wW = F.measure('WHO', sz, true), wA = F.measure('WHAT', sz, true), wD = F.measure('DOES', sz, true);
    const ww = lerp(wW, wA, sineIO(f)), tot = wh + sp + ww + sp + wD, x0 = W / 2 - tot / 2, y = 232;
    F.goldText(ctx, [[head, .1]], x0, y, sz, F.rise(u2), { serif: true, glow: true });
    const wu = F.rise(span(t, A.who - .15, A.who + .35)), sy = Math.abs(Math.cos(Math.PI * f)), word = f < .5 ? 'WHO' : 'WHAT';
    if (wu <= 0) return;
    ctx.save(); ctx.translate(0, y - sz * .36); ctx.scale(1, Math.max(.02, sy)); ctx.translate(0, -(y - sz * .36));
    F.goldText(ctx, [[word, f < .5 ? 1 : 0]], x0 + wh + sp, y, sz, wu, { serif: true, glow: true, col: f < .5 ? undefined : COOL.text });
    ctx.restore();
    F.goldText(ctx, [['DOES', .1]], x0 + wh + sp + ww + sp, y, sz, wu, { serif: true, glow: true });
  }

  // ---------------------------------------------------------------- the take
  return function take(ctx, t) {
    const v = view(t), f = foldU(t);
    const pool = t < A.but ? [v.x, v.y - 20] : [v.x, v.y - 20];
    X.board(ctx, t, v, { lx: pool[0], ly: pool[1] });
    const vis = (x0, x1, y0, y1) => { const [a, b] = X.toScreen(v, x0, y0), [c, d] = X.toScreen(v, x1, y1); return c > -200 && a < W + 200 && d > -200 && b < H + 200; };
    X.inView(ctx, v, () => {
      if (t > C3.end - .2 && vis(-400, 2300, -100, 1200)) { cowStage(ctx, t); rowStage(ctx, t); lifeStage(ctx, t); }
      if (t > A.tomorrow && vis(-700, 3600, -1400, 0)) { bakery(ctx, t); knotStage(ctx, t); }
    });
    // statements (screen space)
    const BIG = (txt, a, b, o = {}) => { const u = lab(t, a, b); if (u > 0) X.big(ctx, txt, W / 2, o.y ?? 160, o.size ?? 60, u, { gold: o.gold ?? .35 }); };
    BIG('HER TROUBLE: NEVER THE MARKET', A.trouble + .2, A.nobody - .1, { size: 56, y: 130 });
    BIG('NOBODY TO ASK', A.nobodyW - .1, A.both - .1, { y: 130 });
    BIG('NO RIGHT TO AN ANSWER', A.noRight - .1, A.both - .1, { y: 196, size: 44, gold: .1 });
    BIG('RIGHT ABOUT THE DIRECTION', A.so + .2, A.more - .1, { y: 130 });
    BIG('NO HUMAN CAN FULLY EXPLAIN', A.more + .6, A.but - .1, { y: 130 });
    if (t > A.but && t < A.tomorrow + 1) {
      const uu = lab(t, A.but + .5, A.trustDid + .2);
      if (uu > 0) wordLetters(ctx, t, 'UNDERSTANDING', W / 2, 580, 128, uu, A.neverHeld + .15, .2);
      const k = bigK(t), tu = lab(t, A.trustDid - .1, A.tomorrow + .4);
      if (tu > 0) X.big(ctx, 'TRUST', W / 2, lerp(580, 690, sineIO(span(t, A.trustDid + .85, A.trustDid + 2.45))), lerp(150, 84, sineIO(span(t, A.trustDid + .85, A.trustDid + 2.45))), tu, { gold: 1 });
    }
    BIG('NEVER THE DANGER', A.danger - .1, A.never + .25, { y: 160, size: 64 });
    if (t > A.never - .2) typeLines(ctx, t);
    // the chain: big at 9.11, else the HUD (hidden while the clip plate is up: F.chainState; faded out before the W)
    if (bigK(t) > 0) chainBig(ctx, t); else F.chainHud(ctx, t, T, { a: 1 - span(t, A.make - 1.4, A.make - .6) });
    // the C3 plate folds into the hill line (from sc09; identical plate while it is full size)
    if (f < 1) { const rule = { x: 160, y: RY - 1.5, w: 1600, h: 3 }; F.clipPlate(ctx, t, T, 'C3', { from: rule, morph: 1 - f, dark: f > 0 ? .35 * span(f, .4, 1) : (1 - span(t, C3.start - .2, C3.start + .2)) * .35 }); }
  };
}

export default async (T, R) => {
  const take = makeC10(T);
  const g = (p) => T.G(p, 0, R.a);
  const make = g('Make sure it still'), answer = T.G('answer you', 0, make), superI = g('superintelligence goes'), want = g('Want that too'), sub = g('Then subscribe');
  const tEnd = T.duration - 15;
  // ANCHOR 4/4: the W lands on a rhyme — the iris of the machine screen sits where the sphere is, at the sphere's size
  function anchor(ctx, t) {
    const q = span(t, make, tEnd), z = 1 + .05 * sineIO(span(t, make, 597)) - .05 * sineIO(span(t, 597, tEnd));
    const fy = lerp(520, 470, sineIO(q));
    const warm = sineIO(span(t, make + .2, answer + .4)), ans = expoOut(span(t, answer - .1, answer + 1.0));
    const s = F.chainState(T, t).links.map((l) => ({ ...l, lit: .4 * sineIO(span(t, make + .5, tEnd - 2)) }));
    const look = .55 + .3 * sineIO(span(t, want - .2, want + .8)) * (1 - sineIO(span(t, sub + 1.2, tEnd - .6)));
    S.chainWorld(ctx, t, E.cam(z, 960, 520, 960, fy), { warm, answer: ans, links: s, four: .35 * sineIO(span(t, make + 1.5, tEnd - 2)), sway: lerp(6, 4, sineIO(q)), you: { o: { look } } });
    const s1 = lab(t, superI - .25, tEnd - 3.2), s2 = lab(t, superI + .9, tEnd - 3.2);
    if (s1 > 0) X.big(ctx, 'SUPERINTELLIGENCE THAT GOES WELL', 700, 214, 50, s1, { gold: .3 });
    if (s2 > 0) X.big(ctx, 'FOR EVERYBODY', 700, 278, 50, s2, { gold: .3 });
    const su = span(t, want - .1, sub + .45) * (1 - span(t, tEnd - 3.4, tEnd - 2.4));
    if (su > 0) F.verdict(ctx, t, 700, 364, 'SUBSCRIBE', su, { size: 34 });
  }
  return [{ t: R.a, draw: take, print: PR }, { t: make, draw: anchor, print: PR }, { t: tEnd, draw: (ctx, t) => S.endScreen(ctx, t, T), print: PR }];
};
