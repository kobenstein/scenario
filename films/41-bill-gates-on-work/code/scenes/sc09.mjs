// Film 41 · c09 · B3 · 'Ask who decides' → 'Now look past those twenty' (docs/shots.md 8.01–8.10)
//   8.01 the ghost tower of c08 lights up floor by floor, the list steps out: WHO DECIDES / RIGHT NOW?
//   8.02 ★ THE PRICE LINE (the machine's price) draws in from the left above the roof: MOSTLY, NOBODY. THE PRICE DOES.
//   8.03 it sinks across the tower's face; a window turns cyan (its chair empty) in the very frame the line passes under it (computed
//        from the line, never by hand): CHEAPER? THE MACHINE GETS IT. · 8.04 the leftovers glow: WHATEVER IS LEFT OVER
//   8.05 one leftover (yours) lifts and opens into your window: THAT INCLUDES YOURS
//   8.06 your window steps left; two cost bars (no numbers: a comparison) PERSON just under MACHINE: THE BEST DEAL · SO FAR (the
//        machine bar sinks toward it) · 8.07 the machine bar thins into the price line, the list rises beside it: NO PRICE CAN ANSWER
//   8.08 WHAT DOES IT COST? (underlined by the price line) loses its weight to an outline; WHY SHOULD A PERSON DO THIS? in gold
//   8.09 the list's glowing empty line flies out to you at your desk (rising into frame): WHAT WOULD YOU PUT ON IT?
//   8.10 the line splits into two fields WORK · REASON; REASON glows: WHAT THE LIST IS STILL MISSING
//   → the desk sinks while the timeline grows to the centre (c10 continues the same timeline move: bigT, exported).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f41_kit.mjs';
import { towerPush, pushAbout, tower, TW, winXY, YOU_W, SIDE, sideList, chairGlyph, outlineHeavy, lab, lineOf } from './sc08.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, lin } = E;
const { GOLD, CREAM, CREAM2, MACH, AMBER, SOURCES: SRC } = F;
const TAU = Math.PI * 2;
const bumpT = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
// the timeline grows to the centre across the c09 → c10 boundary (both files draw it with this)
export const bigT = (T) => { const t0 = T.G('Now look past those twenty'); return (t) => sineIO(span(t, t0 - .7, t0 + .9)) * (1 - sineIO(span(t, t0 + 2.2, t0 + 3.3))); };

// the price line: its final profile leaves this many floors to people in each column (seeded by meaning: some kinds of work stay)
const LEFT = [2, 3, 3, 5, 6, 7, 5, 4, 4, 2];
const Y0 = 172, XL = 100, XR = 1160;
const colX = (c) => TW.cx + (c - 4.5) * TW.px;
const yFinal = (c) => TW.base - 26 - 60 * LEFT[c];          // between the last leftover floor and the first taken one
const winBottom = (i) => winXY(i)[1] + TW.s / 2;

export default (T, R) => {
  const G = (p, after = R.a - .01) => T.G(p, 0, after);
  const k = {};
  k.ask = R.a; k.who = G('who decides', k.ask); k.decides = G('decides', k.who); k.right = G('right now', k.ask); k.now = G('now', k.right);
  k.mostly = G('Mostly, nobody'); k.nobody = G('nobody', k.mostly); k.price = G('The price does', k.mostly); k.priceW = G('price', k.price); k.does = G('does', k.priceW);
  k.if = G('If a machine can do'); k.less = G('less', k.if); k.gets = G('the machine gets', k.if); k.getsW = G('gets', k.gets);
  k.human = G('A human job is whatever'); k.whatever = G('whatever', k.human); k.left = G('left over', k.human); k.over = G('over', k.left);
  k.chances = G('Chances are'); k.that = G('that includes', k.chances); k.includes = G('includes', k.that); k.yours = G('yours', k.includes);
  k.noRule = G('No rule ever said'); k.ruleW = G('rule', k.noRule); k.said = G('said', k.noRule); k.person = G('a person has to', k.noRule); k.has = G('has to', k.person);
  k.aPerson = G('A person has simply'); k.best = G('best deal', k.aPerson); k.deal = G('deal', k.best); k.soFar = G('So far', k.best); k.far = G('far', k.soFar);
  k.hr = G('Human Reserved asks'); k.noPrice = G('no price', k.hr); k.priceW2 = G('price', k.noPrice); k.can = G('can answer', k.noPrice); k.answer = G('answer', k.can);
  k.not = G('Not: what does'); k.what = G('what does it cost', k.not); k.doesW = G('does', k.what); k.it = G('it', k.doesW); k.cost = G('cost', k.what);
  k.but = G('But: why', k.cost); k.whyW = G('why should', k.but); k.should = G('should', k.whyW); k.a = G('a person do', k.should); k.personW = G('person', k.a); k.doW = G('do this', k.personW); k.this = G('this', k.doW);
  k.try = G('Try a line yourself'); k.lineW = G('line', k.try); k.which = G('Which work would', k.try); k.would = G('would', k.which); k.you = G('you put', k.which); k.put = G('put', k.you); k.on = G('on it', k.put); k.itW = G('it', k.on);
  k.harder = G('And, harder'); k.whats = G("what's your reason", k.harder); k.your = G('your', k.whats); k.reason = G('reason', k.your);
  k.thatR = G('That reason is exactly', k.harder); k.whatL = G('what the list', k.thatR); k.list = G('list is still', k.whatL); k.isW = G('is still', k.list); k.still = G('still missing', k.list); k.missing = G('missing', k.still);
  const END = R.b, big = bigT(T);

  // ------------------------------------------------------------------ 8.01–8.04 the tower and the price line
  const lightU = (i) => Math.floor(i / 10) * .07 + Math.abs((i % 10) - 4.5) * .015;   // floor by floor from the ground, centre-out
  const sinkS = (t) => sineIO(span(t, k.if - .1, k.getsW + .5));
  const s0 = k.if - .1, s1 = k.getsW + .5;
  // the frame the line passes under each window (inverse of the sink ease): computed from the line, exact
  const tPass = Array.from({ length: 100 }, (_, i) => {
    const c = i % 10, need = (winBottom(i) - Y0) / (yFinal(c) - Y0); if (need >= 1) return Infinity;
    return s0 + (Math.acos(1 - 2 * clamp(need)) / Math.PI) * (s1 - s0);
  });
  const lineDraw = (t) => sineIO(span(t, k.priceW - .35, k.priceW + .75));
  function priceProfile(t) {
    const s = sinkS(t), pts = [[XL, lerp(Y0, 640, s)]];
    for (let c = 0; c < 10; c++) pts.push([colX(c), lerp(Y0, yFinal(c), s)]);
    pts.push([XR, lerp(Y0, 600, s)]);
    const out = []; for (let j = 0; j < pts.length - 1; j++) for (let q = 0; q < 8; q++) out.push([lerp(pts[j][0], pts[j + 1][0], q / 8), lerp(pts[j][1], pts[j + 1][1], q / 8)]);   // straight between the columns: no overshoot (a window turns exactly when the drawn line passes it)
    out.push(pts[pts.length - 1]); return out;
  }
  const towerOut = (t) => expoIn(span(t, k.includes - .2, k.yours + .3));
  const lit = (t) => span(t, k.ask, k.ask + 1.4);
  function towerScene(ctx, t) {
    if (t > k.yours + .4) return;
    const out = towerOut(t);
    ctx.save(); ctx.translate(0, 700 * out); ctx.globalAlpha *= 1 - out;
    const glowL = bumpT(t, k.whatever - .1, 1.6) * .6 + span(t, k.whatever, k.over) * .3;
    tower(ctx, t, { rise: 1, ghost: 0, haloG: 1 - lit(t), ground: 1,
      win: (i) => {
        const on = sineIO(span(t, k.ask + lightU(i), k.ask + lightU(i) + .45)), tp = tPass[i];
        const cold = t >= tp ? expoOut(span(t, tp, tp + .25)) : 0;
        const o = { dim: .72 * (1 - on), cold, flash: t >= tp ? 1 - span(t, tp, tp + .4) : 0 };
        if (tp === Infinity) { o.lift = glowL * (i === YOU_W ? 0 : 1); o.dim = Math.max(o.dim, 0); }
        else o.dim = Math.max(o.dim, .35 * span(t, k.human, k.left));
        if (i === YOU_W) { o.glyph = 'you'; o.ga = span(t, k.chances - .2, k.chances + .4); o.lift = .9 * o.ga; if (t > k.chances + .3) o.a = 0; }
        return o;
      },
      after: (i, x, y, a) => { const tp = tPass[i]; if (t >= tp) chairGlyph(ctx, x, y + 2, TW.s * .55, mixHex(MACH.deep, P.night1, .2), a * expoOut(span(t, tp + .05, tp + .35))); },
    });
    // the price line (cyan: the machine's price) with its label riding the left end
    const d = lineDraw(t);
    if (d > 0) {
      const pts = priceProfile(t), fade = 1 - span(t, k.chances, k.chances + .5);
      ctx.save(); ctx.globalAlpha *= fade;
      ctx.strokeStyle = rgba(MACH.halo, .25); ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const n = Math.max(2, Math.round(pts.length * d)); ctx.beginPath(); pts.slice(0, n).forEach((p, j) => (j ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke();
      ctx.strokeStyle = MACH.hot; ctx.lineWidth = 3.5; ctx.stroke();
      const hd = pts[n - 1]; if (d < 1) halo(ctx, hd[0], hd[1], 40, .7, MACH.halo, MACH.core);
      ctx.restore();
      lab(ctx, 'MACHINE PRICE', XL, pts[0][1] - 18, span(t, k.priceW, k.priceW + .5), { col: MACH.hot, size: 24, out: span(t, k.chances - .2, k.chances + .2) });
    }
    ctx.restore();
  }
  // 8.01 the list from c08 steps out (it comes back in 8.07)
  function oldList(ctx, t) {
    const out = expoIn(span(t, k.ask + .3, k.ask + 1)); if (out >= 1) return;
    ctx.save(); ctx.translate(0, 700 * out);
    sideList(ctx, t, SIDE, { u: 1, glow: .6, juryW: 4, wobA: .25, open: .4, a: 1 - out });
    ctx.restore();
  }

  // ------------------------------------------------------------------ 8.05–8.06 your window, the two cost bars
  const WIN1 = { x: 560, y: 180, w: 640, h: 480 }, WIN2 = { x: 120, y: 250, w: 540, h: 405 };
  const openU = (t) => quartIO(span(t, k.that - .2, k.yours + .2));
  const stepL = (t) => quartIO(span(t, k.noRule - .25, k.noRule + .75));
  const winOut = (t) => expoIn(span(t, k.hr - .35, k.hr + .35));
  function yourWin(ctx, t) {
    if (t < k.chances - .3 || t > k.hr + .5) return;
    const [wx, wy] = winXY(YOU_W), lift = expoOut(span(t, k.chances + .3, k.chances + .8)), o = openU(t), s = stepL(t), out = winOut(t);
    const c0 = { x: wx - 17, y: wy - 17 - 40 * lift, w: 34 * (1 + .6 * lift), h: 34 * (1 + .6 * lift) };
    const b = { x: lerp(lerp(c0.x, WIN1.x, o), WIN2.x, s), y: lerp(lerp(c0.y, WIN1.y, o), WIN2.y, s), w: lerp(lerp(c0.w, WIN1.w, o), WIN2.w, s), h: lerp(lerp(c0.h, WIN1.h, o), WIN2.h, s) };
    const push = 1 + .03 * span(t, k.yours, k.noRule);
    ctx.save(); ctx.translate(0, 700 * out);
    if (o <= .02) F.tile(ctx, t, b.x + b.w / 2, b.y + b.h / 2, b.w, { glyph: 'you', ga: 1, lift: .9 });
    else F.yourWindow(ctx, t, { x: b.x + b.w / 2 - b.w * push / 2, y: b.y + b.h / 2 - b.h * push / 2, w: b.w * push, h: b.h * push }, { u: o, look: .3 * span(t, k.aPerson, k.best) });
    ctx.restore();
  }
  const BX = 760, BY = [470, 570], BL = [640, 600];
  const barsOut = (t) => expoIn(span(t, k.hr - .3, k.hr + .35));
  const toLine = (t) => quartIO(span(t, k.hr - .1, k.hr + .9));
  const machLen = (t) => lerp(BL[0], BL[1] + 22, sineIO(span(t, k.soFar - .1, k.far + .6)));
  function bars(ctx, t) {
    if (t < k.aPerson - .3 || t > k.whyW + 2) return;
    const out = barsOut(t), m = expoOut(span(t, k.aPerson - .1, k.aPerson + .7)), p = expoOut(span(t, k.aPerson + .35, k.aPerson + 1.05)), tl = toLine(t);
    // the machine bar (cyan): grows, sinks toward the person bar on "so far", then thins into the price line under the question (8.07/8.08)
    if (m > 0) {
      const len = machLen(t) * m, x0 = lerp(BX, 100, tl), x1 = lerp(BX + len, 1120, tl), y = lerp(BY[0], 450, tl), h = lerp(30, 4, tl);
      const dim = span(t, k.but - .1, k.but + .6), lo = expoIn(span(t, k.try - .3, k.try + .3)); if (lo >= 1) return;
      ctx.save(); ctx.translate(0, 300 * lo); ctx.globalAlpha *= 1 - lo;
      ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, mixHex(MACH.hot, P.night1, .45 * dim)], [1, mixHex(MACH.body, P.night1, .45 * dim)]]); ctx.beginPath(); ctx.roundRect(x0, y - h / 2, x1 - x0, h, [2, 6, 6, 2].map((v) => v * (1 - tl) + 2 * tl)); ctx.fill();
      if (tl < 1) { halo(ctx, x1, y, 60, .3 * (1 - tl), MACH.halo, MACH.core); lab(ctx, 'MACHINE', BX, BY[0] - 28, m, { col: MACH.hot, out: tl * 3 }); }
      ctx.restore();
    }
    ctx.save(); ctx.translate(0, 520 * out); ctx.globalAlpha *= 1 - out;
    if (p > 0) { const len = BL[1] * p, y = BY[1]; ctx.fillStyle = lin(ctx, BX, 0, BX + len, 0, [[0, AMBER.hot], [1, AMBER.body]]); ctx.beginPath(); ctx.roundRect(BX, y - 15, len, 30, [2, 6, 6, 2]); ctx.fill(); lab(ctx, 'PERSON', BX, y - 28, p, { col: AMBER.hot }); }
    lab(ctx, 'COST OF THE WORK', BX, 400, span(t, k.aPerson - .2, k.aPerson + .3), { size: 22 });
    F.verdict(ctx, t, BX, 680, 'THE BEST DEAL', span(t, k.deal - .3, k.deal + .4), { size: 40, align: 'left' });
    F.heavy(ctx, 'SO FAR', BX + 450, 680, 40, span(t, k.soFar - .1, k.soFar + .35), { gold: 1 });
    ctx.restore();
  }

  // ------------------------------------------------------------------ 8.07–8.10 the list returns; your line
  const LR = { x: 1320, y: 200, w: 380, h: 640 };
  const listU = (t) => sineIO(span(t, k.hr + .1, k.hr + 1));
  const listOut = (t) => expoIn(span(t, k.try - .2, k.try + .55));
  const fly = (t) => quartIO(span(t, k.try - .1, k.lineW + .7));
  const DL = { x0: 1000, x1: 1600, y: 560 };
  function listR(ctx, t) {
    if (t < k.hr || t > k.try + .7) return;
    const out = listOut(t);
    ctx.save(); ctx.translate(0, 700 * out); ctx.globalAlpha *= 1 - out;
    sideList(ctx, t, LR, { u: listU(t), glow: .6 + .4 * span(t, k.whyW, k.whyW + .5), juryW: 4, wobA: .25, open: .4 + .6 * span(t, k.whyW, k.this) });
    ctx.restore();
  }
  const deskIn = (t) => expoOut(span(t, k.try, k.lineW + 1));
  const deskOut = (t) => expoIn(span(t, END - .85, END - .05));
  const split = (t) => quartIO(span(t, k.harder + .1, k.harder + .9));
  function yourLine(ctx, t) {
    if (t < k.try - .15) return;
    // the line: from list line 5 (glowing) out to the air in front of you
    const L = lineOf(LR, 5), f = fly(t), out = deskOut(t);
    const x0 = lerp(L.x0, DL.x0, f), x1 = lerp(L.x1, DL.x1, f), y = lerp(L.y + 320 * listOut(Math.min(t, k.try - .1)), DL.y, f) - 120 * Math.sin(Math.PI * f) + 500 * out;
    const sp = split(t), mid = lerp(x0, x1, .45), gap = 50 * sp, rg = span(t, k.reason - .15, k.reason + .4);
    halo(ctx, (x0 + x1) / 2, y, 300, .18 + .1 * Math.sin(t * 2), GOLD.halo, GOLD.core);
    F.goldSpan(ctx, [[x0, y], [mid - gap / 2, y]], 0, 1, { w: 4, spark: false });
    F.goldSpan(ctx, [[mid + gap / 2, y], [x1, y]], 0, 1, { w: lerp(4, 7, rg), spark: false });
    if (rg > 0) halo(ctx, (mid + x1) / 2, y, 200, .4 * rg + .15 * Math.sin(t * 2.4) * rg, GOLD.halo, GOLD.core);
    lab(ctx, 'WORK', x0, y - 22, sp, { size: 28, col: CREAM, out: out * 3 });
    lab(ctx, 'REASON', mid + gap / 2, y - 22, span(sp, .3, 1), { size: 28, col: CREAM, gold: rg, out: out * 3 });
  }
  function deskScene(ctx, t) {
    const u = deskIn(t), out = deskOut(t); if (u <= 0 || out >= 1) return;
    ctx.save(); ctx.translate(0, 520 * (1 - u) + 520 * out);
    halo(ctx, 700, 700, 600, .18, AMBER.body, AMBER.core);
    ctx.strokeStyle = rgba(CREAM, .2); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(140, 860); ctx.lineTo(1780, 860); ctx.stroke();
    F.desk(ctx, t, 700, 860, 250, { look: .25 + .5 * span(t, k.lineW + .3, k.lineW + 1.3) - .2 * span(t, k.harder, k.reason) });
    ctx.restore();
  }

  // ------------------------------------------------------------------ the words
  function words(ctx, t) {
    const X = 1190;
    F.say(ctx, t, [['WHO', k.who], ['DECIDES', k.decides]], X, 300, { size: 60, out: k.mostly - .8 });
    F.say(ctx, t, [['RIGHT', k.right], ['NOW?', k.now]], X, 372, { size: 60, gold: [1], out: k.mostly - .75 });
    F.say(ctx, t, [['MOSTLY,', k.mostly], ['NOBODY.', k.nobody]], X, 300, { size: 60, out: k.if - .2 });
    F.say(ctx, t, [['THE', k.priceW - .1], ['PRICE', k.priceW], ['DOES.', k.does]], X, 372, { size: 60, gold: [1], out: k.human - .7 });
    F.say(ctx, t, [['CHEAPER?', k.less]], X, 480, { size: 52, col: MACH.hot, out: k.human - .65 });
    F.say(ctx, t, [['THE', k.gets], ['MACHINE', k.gets + .05], ['GETS', k.getsW], ['IT.', k.getsW + .3]], X, 548, { size: 52, out: k.human - .6 });
    F.say(ctx, t, [['WHATEVER', k.whatever], ['IS', k.whatever + .4], ['LEFT', k.left], ['OVER', k.over]], X, 300, { size: 56, gold: [2, 3], out: k.that - .5 });
    F.say(ctx, t, [['THAT', k.that], ['INCLUDES', k.includes], ['YOURS', k.yours]], W / 2 - 80, 770, { size: 60, align: 'center', gold: [2], out: k.noRule - .5 });
    F.say(ctx, t, [['NO', k.noRule], ['RULE', k.ruleW], ['SAYS', k.said], ['A', k.person + .05], ['PERSON', k.person + .1], ['MUST', k.has]], BX, 300, { size: 52, gold: [1], out: k.aPerson - .7 });
    F.say(ctx, t, [['NO', k.noPrice], ['PRICE', k.priceW2], ['CAN', k.can], ['ANSWER', k.answer]], 100, 300, { size: 56, out: k.what - .7 });
    // 8.08 the cost question loses its weight (to an outline); the why question takes the gold
    const q = span(t, k.but - .15, k.but + .5), cq = F.say(ctx, t, [['WHAT', k.what], ['DOES', k.doesW], ['IT', k.it], ['COST?', k.cost]], 100, 420, { size: 68, a: 1 - q, out: k.try - .3 });
    if (q > 0 && t < k.try) cq.xs.forEach((x, i) => outlineHeavy(ctx, ['WHAT', 'DOES', 'IT', 'COST?'][i], x, 420 + 75 * expoIn(span(t, k.try - .3 + i * .04, k.try + .08 + i * .04)), 68, q * (1 - span(t, k.try - .3 + i * .04, k.try + .08 + i * .04))));
    F.say(ctx, t, [['WHY', k.whyW], ['SHOULD', k.should], ['A', k.a], ['PERSON', k.personW], ['DO', k.doW], ['THIS?', k.this]], 100, 600, { size: 68, gold: [0, 1, 2, 3, 4, 5], out: k.try - .25 });
    // 8.09 / 8.10 at your line
    F.say(ctx, t, [['WHAT', k.which], ['WOULD', k.would], ['YOU', k.you], ['PUT', k.put], ['ON', k.on], ['IT?', k.itW]], DL.x0, 420, { size: 48, out: k.whats - .75 });
    F.say(ctx, t, [['WHAT’S', k.whats], ['YOUR', k.your], ['REASON?', k.reason]], DL.x0, 420, { size: 48, gold: [2], out: k.whatL - .75 });
    F.say(ctx, t, [['WHAT', k.whatL], ['THE', k.whatL + .19], ['LIST', k.list], ['IS', k.isW], ['STILL', k.still], ['MISSING', k.missing]], DL.x0, 420, { size: 48, gold: [5], out: END - .85 });
  }

  const tp = towerPush(T);
  const draw = (ctx, t) => {
    F.stage(ctx, t);
    ctx.save(); pushAbout(ctx, tp(t));
    towerScene(ctx, t);
    oldList(ctx, t);
    deskScene(ctx, t);
    yourWin(ctx, t);
    bars(ctx, t);
    listR(ctx, t);
    yourLine(ctx, t);
    words(ctx, t);
    ctx.restore();
    F.timeline(ctx, t, T, { big: big(t) });
  };
  return [{ t: R.a, draw, print: F.PRINT41 }];
};
