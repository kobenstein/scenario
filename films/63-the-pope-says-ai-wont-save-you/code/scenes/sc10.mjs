// c10 · B3 · 'In October the Pope' → 'The night the letter came out'. Plan: docs/shots.md 7.01–7.23 + C5. One entry, one draw function,
// motifs scheduled on VO phrases, every boundary a carrier (no fades, no cuts). Starts ON S.plateStays (seam B2 → B3).
//
// | ID        | anchor (phrase)          | motif                                                                   | type | carrier → next                 |
// |-----------|--------------------------|-------------------------------------------------------------------------|------|--------------------------------|
// | 7.01      | In October the Pope      | plateStays: the mini scale slides left, a paper card grows OUT OF THE EMPTY RIGHT PAN: 30 OCT 2026, one "?" | EXPL | the card |
// | 7.02      | Not only what            | the exact question; “What can AI do?” steps back, “What purpose should it serve?” gold; PURPOSE drops into the right pan | EXPL | the card |
// | 7.03      | Machines, he says        | the card turns over: TOOL | PERSON (wrench, a person), “machines are tools, not persons” | EXPL | the card (it is a screen) |
// | 7.04      | Say one turns down       | pull back: the card was the terminal at a bank counter; LOAN APPLICATION → DECLINED · OUR EXAMPLE | SCENE | the screen |
// | 7.05      | Give it legal personhood | the screen grows into a smooth blank slab; you talk, nothing comes back; it covers RESPONSIBILITY · quote | MIX | the slab |
// | 7.06–09   | Some decisions           | the slab floods the frame and shrinks into a panel: three switches, AUTO struck, a hand on each: LIFE · FREEDOM · THE USE OF FORCE | EXPL | switch 3's light |
// | 7.10      | That is why he wants     | iris out of the light: GENEVA pin on the lake · the exact appeal · THE LAST DECISION | EXPL | the card |
// | 7.11      | One claim of his         | the card turns over, heavy: HARD TO HEAR (a stone)                      | EXPL | the stone |
// | 7.12–13   | Humanity flourishes      | push into the stone, pull back: a concrete wall, a crack, a plant grows through it · §118 twice | MIX | the bud's warm light |
// | 7.14 ★    | But erase it completely  | iris out of the bud: a hospital room, a hand on a shoulder; a sweep erases the pain AND the warm light; the lamp goes out · §120 · LOVE | MIX | the last glow |
// | 7.15–16   | You can test that        | the fridge door's light opens: you, a photo under a magnet; push in: the calendar of small sacrifices | SCENE | the photo |
// | 7.17–18   | What can no machine      | the photo turns over and floods: WHAT CAN NO MACHINE REACH? → one gold line | EXPL | the line |
// | C5        | clip C5                  | the plate grows out of the line and returns into it                    | CLIP | the line |
// | 7.19–22   | Freedom.                 | FREEDOM · AN INNER LIFE · LOVE rise on the line, WORSHIP stands apart; you look at it from a distance · YOUR CALL | EXPL/MIX | the words |
// | 7.23      | Is any of it right?      | the words sink into the line, IS ANY OF IT RIGHT?                       | EXPL | the gold ? (→ c11) |
import * as F from '../lib/f63_kit.mjs';
import * as S from '../lib/f63_seams.mjs';
import * as X from '../lib/f63_b3_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER } = F;
export const PRINT = F.PRINT63;

export function anchors10(T, R) {
  const G = (p, after = R.a - .5) => T.G(p, 0, after), GE = (p, after = R.a - .5) => T.GE(p, 0, after);
  const a = { start: R.a };
  a.q = G('In October the Pope'); a.one = G('one question', a.q); a.notOnly = G('Not only what', a.q); a.canDo = G('can do', a.notOnly); a.purpose = G('what purpose', a.notOnly); a.serve = G('should serve', a.notOnly);
  a.mach = G('Machines, he says', a.q); a.tools = G('tools, not persons', a.mach); a.persons = G('persons', a.tools);
  a.say = G('Say one turns'); a.turns = G('turns down', a.say); a.loan = G('your loan', a.say);
  a.give = G('Give it legal'); a.legal = G('legal personhood', a.give); a.warns = G('he warns', a.give); a.arguing = G('arguing with', a.give); a.faceless = G('faceless entity', a.give);
  a.some = G('Some decisions'); a.handed = G('handed over', a.some); a.life = G('Life', a.handed); a.free = G('Freedom', a.life); a.force = G('The use of force', a.free); a.forceW = G('force', a.force);
  a.why = G('That is why he wants'); a.weapons = G('weapons that choose', a.why); a.banned = G('banned', a.why);
  a.claim = G('One claim of his'); a.hard = G('hard to hear', a.claim);
  a.hum = G('Humanity flourishes'); a.despite = G('despite limitations', a.hum); a.through = G('often through them', a.hum);
  a.easing = G('Easing suffering'); a.right = G('is right', a.easing);
  a.erase = G('But erase it'); a.completely = G('completely', a.erase); a.love = G('love goes out', a.erase); a.goesOut = GE('goes out with it', a.erase);
  a.test = G('You can test'); a.yourself = G('yourself', a.test);
  a.think = G('Think of who'); a.cost = G('what it has cost', a.think);
  a.reach = G('What can no machine'); a.reachW = F.wordTimes(T, 'What can no machine reach', null, a.reach - .1);
  a.needs = G('He needs one sentence'); a.sentence = G('one sentence', a.needs);
  const c5 = T.clip('C5'); a.c5 = c5 ? c5.start : a.sentence + 1.5; a.c5e = c5 ? c5.end : a.c5 + 11;
  a.freedom = G('Freedom', a.c5e - .5); a.inner = G('An inner life', a.freedom); a.calling = G('A calling to love', a.inner); a.love2 = G('love and', a.calling); a.worship = G('worship', a.calling);
  a.whether = G('Whether that last'); a.yourCall = G('your call', a.whether);
  a.any = G('Is any of it'); a.anyW = F.wordTimes(T, 'Is any of it right', null, a.any - .1);
  a.night = G('The night the letter came out'); a.end = R.b;
  return a;
}
export default async (T, R) => [{ t: R.a, draw: scene(anchors10(T, R), T), print: PRINT }];

// ------------------------------------------------------------------------------------------------ layout
const CARD1 = { x: 820, y: 170, w: 960, h: 520 }, CARD2 = { x: 240, y: 140, w: 1440, h: 680 };
const SLAB2 = { x: 1040, y: 110, w: 540, h: 770 }, SLAB3 = { x: 860, y: 90, w: 740, h: 790 }, COVER = { x: -80, y: -80, w: W + 160, h: H + 160 };
const GCARD = { x: 360, y: 500, w: 1200 }, LINE_Y = 560, PINB = [606, 398];
export const Q_ANY = { x: W / 2, y: 430, size: 96 };
const QW = (s) => s.split(/\s+/).filter(Boolean);
const QDEC = 'The decisive question, then, is not simply “What can AI do?” but rather, “What purpose should it serve?”';
const QFACE = 'Such an approach risks obscuring human responsibility and leaving those who suffer harm to confront a faceless entity.';
const QGEN = 'I encourage the States meeting in Geneva in November to take concrete steps toward banning lethal autonomous weapons.';
const CREDIT30 = 'Pope Leo XIV · Address to the Pontifical Academy for Life, 30 October 2026';
// the final question of c10 (c11 starts on it): words rise on the voice, ? gold
export function drawAny(ctx, t, a, o = {}) {
  if (t >= a.night) {   // c11: the words sink behind their line, the gold ? is carried on by c11 (it becomes the post's avatar)
    const tot = F.measure('IS ANY OF IT RIGHT?', Q_ANY.size, true), u = 1 - span(t, a.night, a.night + .5);
    if (u > 0) F.maskLine(ctx, [['IS ANY OF IT RIGHT', 0]], Q_ANY.x - tot / 2, Q_ANY.y, Q_ANY.size, rise(u), { serif: true, col: CREAM, glow: false });
    return;
  }
  const ts = a.anyW ?? [a.any, a.any + .2, a.any + .4, a.any + .55, a.any + .75];
  ctx.save(); if (o.u != null) F.question(ctx, t, 'IS ANY OF IT RIGHT?', Q_ANY.x, Q_ANY.y, Q_ANY.size, { u: o.u }); else F.question(ctx, t, 'IS ANY OF IT RIGHT?', Q_ANY.x, Q_ANY.y, Q_ANY.size, { ts }); ctx.restore();
}
export const qMarkPos = () => { const tot = F.measure('IS ANY OF IT RIGHT?', Q_ANY.size, true), base = F.measure('IS ANY OF IT RIGHT', Q_ANY.size, true); return [Q_ANY.x - tot / 2 + base + F.measure('?', Q_ANY.size, true) / 2, Q_ANY.y - Q_ANY.size * .35]; };

export function scene10(a, T) { return scene(a, T); }
function scene(a, T) {
  const t0s = S.seamT(T, 'stays');
  // ---------------------------------------------------------------- 7.01–7.02 · the scale, the card out of the right pan, PURPOSE
  const scaleK = (t) => sineIO(span(t, a.start + .5, a.start + 2.0));
  const purposeLand = a.serve + .75;
  const decWords = (t) => QW(QDEC).map((w, i) => {
    const first = i >= 7 && i <= 10, second = i >= 13;
    const g = first ? span(t, a.canDo - .3, a.canDo + .3) * (1 - span(t, a.purpose - .1, a.purpose + .4)) * .7 : second ? span(t, a.purpose - .1, a.purpose + .4) : 0;
    return { w, g, d: first ? span(t, a.purpose - .1, a.purpose + .5) : 0 };
  });
  const card1 = (ctx, t, o = {}) => {
    const wu = span(t, a.notOnly - .15, a.notOnly + .7);
    const box = X.qcard(ctx, t, { x: CARD1.x, y: CARD1.y, w: CARD1.w, h: CARD1.h, size: 50, u: o.u ?? 1, wu, words: decWords(t), head: 'POPE LEO XIV · ADDRESS TO THE PONTIFICAL ACADEMY FOR LIFE', credit: '30 October 2026 · Vatican', rot: -.004 });
    // phase A: one question (a big gold ?) until the wording rises
    const qa = (o.u ?? 1) >= 1 ? span(t, a.start + 1.5, a.start + 2.2) * (1 - span(t, a.notOnly - .35, a.notOnly + .1)) : 0;
    if (qa > 0) {
      ctx.save(); ctx.translate(CARD1.x + CARD1.w / 2, CARD1.y + 330); ctx.rotate(-.004);
      F.goldText(ctx, [['?', 1]], 0, 0, 230, rise(qa), { serif: true, glow: true, align: 'center' });
      ctx.restore();
      X.caps(ctx, 'THE WHOLE MATTER IN ONE QUESTION', CARD1.x + CARD1.w / 2, CARD1.y + 420, span(t, a.one - .1, a.one + .5) * (1 - span(t, a.notOnly - .35, a.notOnly + .05)), { size: 24, col: PAPER.faint });
    }
    return box;
  };
  const drawM1 = (ctx, t) => {
    const k = scaleK(t), z = lerp(1 + S.CREEP * (t - t0s), 1.012 + .0015 * (t - t0s), k), cy = lerp(H / 2 - 20, H / 2, k);
    F.night(ctx, t, { glow: [lerp(W / 2, 700, k), 520, 900, S.breathe(t, .7)] });
    let panR = null;
    F.look(ctx, W / 2, cy, z, () => {
      const sx = lerp(S.STAYS.x, 480, k), sy = lerp(S.STAYS.y, 470, k), ss = lerp(S.STAYS.s, 250, k), out = expoIn(span(t, a.mach - .55, a.mach + .45));
      const land = span(t, a.serve + .1, purposeLand), tilt = lerp(1, .32, sineIO(span(t, purposeLand - .05, purposeLand + .9))) - .05 * X.bump(t, purposeLand - .05, .35);
      ctx.save(); ctx.translate(0, out * 760);
      const pans = S.staysScale(ctx, t, sx, sy, ss, { tilt, right: (c, px, py, s2) => { if (land >= 1) F.weight(c, px, py - 2, s2 * .24, 'PURPOSE', 1, { size: 22 }); } });
      ctx.restore();
      panR = pans?.R ? [pans.R[0], pans.R[1] + out * 760] : null;
      // the card grows out of the empty right pan, a gold thread runs with it
      const cu = span(t, a.start + .85, a.start + 1.9);
      if (cu > 0 && panR && t < a.mach - .4) {
        const from = { x: panR[0] - ss * .36, y: panR[1] - 10, w: ss * .72, h: 10 }, r = X.lrect(from, CARD1, sineIO(cu));
        if (cu < 1) { ctx.fillStyle = F.lin(ctx, 0, r.y, 0, r.y + r.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 6); ctx.fill(); }
        else card1(ctx, t);
        const th = sineIO(span(t, a.start + 1.6, a.start + 2.3));
        if (th < 1) F.goldSpan(ctx, [[panR[0], panR[1] - 4], [r.x + r.w * .3, r.y + r.h]], th, 1, { w: 2, spark: cu < 1 });
      }
      // PURPOSE: rises out of the gold words, drops on an arc into the right pan
      if (t > a.serve && land < 1 && panR) {
        const p0 = [CARD1.x + CARD1.w * .55, CARD1.y + CARD1.h - 150], e = expoIn(clamp(land * 1.05)), ws = 250 * .24;
        const x = lerp(p0[0], panR[0], e), y = lerp(p0[1], panR[1] - 2, e) - Math.sin(Math.PI * e) * 120;
        F.weight(ctx, x, y, ws, 'PURPOSE', 1, { size: 22 });
      }
    });
    return panR;
  };
  // ---------------------------------------------------------------- 7.03 · TOOL | PERSON (the card's back)
  const m2Content = (ctx, t) => {
    const u = span(t, a.mach + .2, a.mach + .8);
    F.maskLine(ctx, [['“… machines are tools, not persons.”', 0]], W / 2, 270, 60, rise(span(t, a.mach + .25, a.mach + .9)), { serif: true, col: CREAM, glow: false, align: 'center' });
    X.caps(ctx, CREDIT30.toUpperCase(), W / 2, 322, span(t, a.mach + .5, a.mach + 1.1), { size: 22 });
    F.goldSpan(ctx, [[W / 2, 400], [W / 2, 770]], 0, smooth(span(t, a.persons - .25, a.persons + .35)), { w: 2.2, spark: false });
    X.wrench(ctx, 600, 560, 330, -.55 + .02 * Math.sin(t * .7), span(t, a.tools - .15, a.tools + .45), { glow: .35 * span(t, a.tools, a.tools + .5) });
    X.caps(ctx, 'A TOOL', 600, 770, span(t, a.tools + .05, a.tools + .6), { size: 30, col: GOLD.text });
    const pu = expoOut(span(t, a.persons - .2, a.persons + .45));
    if (pu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(1100, 380, 400, 352); ctx.clip(); F.person(ctx, 1320, 730 + (1 - pu) * 330, 300, { dir: -1, look: .1 + .05 * Math.sin(t * .6), light: -1, back: .4, rim: mixHex(P.halo2, P.blue0, .3) }); ctx.restore(); }
    X.caps(ctx, 'A PERSON', 1320, 770, span(t, a.persons + .05, a.persons + .6), { size: 30, col: CREAM });
    return u;
  };
  const m2Card = (ctx, t, r) => {   // the night card (back) in rect r, its content mapped from CARD2
    ctx.save(); ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(r.x + 8, r.y + 12, r.w, r.h, 14); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 14); ctx.fill(); ctx.strokeStyle = rgba(GOLD.line, .55); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    X.mapRect(ctx, CARD2, r, (c) => m2Content(c, t));
  };
  const flipU = (t) => span(t, a.mach - .45, a.mach + .8), growU = (t) => sineIO(span(t, a.mach + .05, a.mach + .85));
  const drawM2 = (ctx, t) => {   // full frame (also the content of the terminal screen in the pull-back)
    F.night(ctx, t, { glow: [W / 2, 520, 1000, .7] });
    const r = X.lrect(CARD1, CARD2, growU(t));
    m2Card(ctx, t, r);
  };
  // ---------------------------------------------------------------- 7.04–7.05 · the bank counter, DECLINED, the faceless slab
  const pull0 = a.say - 1.1, pull1 = a.say + .7, scr0 = a.say + .7, scr1 = a.say + 1.2;
  const kb0 = Math.max(X.BANK.screen.w / W, X.BANK.screen.h / H);
  const screen = (ctx, Sr, t) => {
    const k = sineIO(span(t, scr0, scr1));
    ctx.save(); ctx.translate(0, -k * Sr.h);
    ctx.save(); ctx.translate(Sr.x + Sr.w / 2, Sr.y + Sr.h / 2); ctx.scale(kb0, kb0); ctx.translate(-W / 2, -H / 2); drawM2(ctx, Math.min(t, pull1)); ctx.restore();
    ctx.translate(0, Sr.h); X.loanScreen(ctx, Sr, t, span(t, a.turns - .05, a.turns + .4));
    ctx.restore();
  };
  const slabR = (t) => {
    const s0 = X.BANK.screen, fT = { x: s0.x - 16, y: s0.y + s0.h / 2, w: s0.w + 32, h: 0 }, f0 = X.lrect(fT, { x: s0.x - 16, y: s0.y - 16, w: s0.w + 32, h: s0.h + 32 }, sineIO(span(t, a.legal - .25, a.legal + .25)));
    const s1 = sineIO(span(t, a.legal - .2, a.legal + .8)), s2 = sineIO(span(t, a.faceless - .25, a.faceless + .45));
    return X.lrect(X.lrect(f0, SLAB2, s1), SLAB3, s2);
  };
  const speaking = (t) => span(t, a.arguing - .35, a.arguing + .1) * (1 - span(t, a.some - .9, a.some - .5));
  const drawBank = (ctx, t, o = {}) => {
    const z = 1 + .03 * sineIO(span(t, pull1, a.give + 1)), sp = speaking(t);
    F.look(ctx, W / 2 + 40 * z - 40, H / 2, z, () => {
      X.bank(ctx, t, { screen: (c, Sr) => screen(c, Sr, t), look: lerp(.3, .55, sp), armR: [lerp(.9, 1.75, sp) + .04 * Math.sin(t * 3) * sp, lerp(1.4, 2.0, sp)] });
      // RESPONSIBILITY rests on the counter between you and the machine (the slab will cover it)
      const wu = span(t, a.warns - .2, a.warns + .35);
      if (wu > 0) F.weight(ctx, 932, X.BANK.counterY, 72, 'RESPONSIBILITY', wu, { size: 22 });
      if (t > a.legal - .25 && !o.noSlab) {
        X.slab(ctx, t, slabR(t));
        X.speech(ctx, t, 700, 650, slabR(t).x - 10, a.arguing - .1, a.some - .6);
        X.caps(ctx, 'LEGAL PERSONHOOD', slabR(t).x + slabR(t).w / 2, slabR(t).y + slabR(t).h * .5, span(t, a.legal + .3, a.legal + .9) * (1 - span(t, a.some - .8, a.some - .4)), { size: 26, col: rgba(X.COLD.hi, 1) });
      }
    });
    // OUR EXAMPLE (screen space, a dashed tag) and the quote card
    const eu = span(t, a.say + .2, a.say + .8) * (1 - span(t, a.arguing - .9, a.arguing - .4));
    if (eu > 0) { ctx.save(); ctx.globalAlpha *= clamp(eu * 3); ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 2; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t * 14; ctx.beginPath(); ctx.roundRect(110, 92, 250, 54, 8); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); X.caps(ctx, 'OUR EXAMPLE', 235, 128, eu, { size: 24, col: CREAM }); }
    const qu = span(t, a.arguing - .7, a.arguing + .2), qo = span(t, a.some - .9, a.some - .45);
    if (qu > 0 && qo < 1) {
      const ws = QW(QFACE).map((w, i) => ({ w, g: (i >= 14 ? span(t, a.faceless - .1, a.faceless + .4) : 0) + (i >= 3 && i <= 5 ? span(t, a.faceless + .3, a.faceless + .8) * .8 : 0) }));
      X.qcard(ctx, t, { x: 100, y: 150, w: 700, size: 34, u: qu, out: qo, words: ws, head: 'POPE LEO XIV · 30 OCTOBER 2026', credit: 'Address to the Pontifical Academy for Life', rot: .004 });
    }
  };
  // ---------------------------------------------------------------- 7.06–7.09 · three switches
  const pan0 = a.some + .05, pan1 = a.some + 1.0;
  const slabSw = (() => { const zb = 1 + .03 * sineIO(span(pan0, pull1, a.give + 1)), cx = W / 2 + 40 * zb - 40, p0 = F.lookPt(cx, H / 2, zb, SLAB3.x, SLAB3.y), p1 = F.lookPt(cx, H / 2, zb, SLAB3.x + SLAB3.w, SLAB3.y + SLAB3.h); return { x: p0[0], y: p0[1] + 20, w: p1[0] - p0[0], h: p1[1] - p0[1] }; })();   // the slab's screen rect, in the switch scene's frame
  const swT = [a.life, a.free, a.forceW];
  const drawSwitches = (ctx, t, o = {}) => {
    F.night(ctx, t, { glow: [W / 2, 560, 1000, .6], n: 140 });
    // the bank falls away behind the slab while the slab itself shrinks and turns into the switch panel (no flood)
    const bf = sineIO(span(t, pan0, pan0 + .9));
    if (bf < 1) { ctx.save(); ctx.globalAlpha *= 1 - bf; ctx.translate(0, bf * 160); drawBank(ctx, t, { noSlab: true }); ctx.restore(); }
    const r = X.lrect(slabSw, X.PANEL, sineIO(span(t, pan0, pan1))), z = 1 + .012 * span(t, pan1, a.why + 1);
    F.look(ctx, W / 2, H / 2 + 20, z, () => {
      const on = swT.map((w) => span(t, w - .08, w + .22));
      X.panel(ctx, t, r, on, { u: span(t, pan1 - .2, pan1 + .3), strike: span(t, a.handed - .2, a.handed + .5), snap: swT.map((w) => w + .14), t });
      const sk = 1 - sineIO(span(t, pan0 + .1, pan1 + .35));   // the slab's cold face is still on it as it shrinks, then the panel shows through
      if (sk > 0) { ctx.save(); ctx.globalAlpha *= sk; X.slab(ctx, t, r, 1, { shadow: false }); ctx.restore(); }
      const lab = ['LIFE', 'FREEDOM', 'THE USE OF FORCE'];
      for (let i = 0; i < 3; i++) {
        const x = X.switchX(i), sy = X.PANEL.y + X.PANEL.h * .56, e = expoOut(on[i]), ang = lerp(.55, -.55, e);
        const kx = x + Math.sin(ang) * 124, ky = sy - Math.cos(ang) * 124;
        // a hand comes down over each switch (stagger on "handed over"), then pushes it to HUMAN on its word
        const hu = expoOut(span(t, a.handed - .35 + i * .14, a.handed + .35 + i * .14));
        if (hu > 0) X.sideHand(ctx, kx + 6, ky - 40 - (1 - hu) * 420 - 8 * (1 - e), 64, Math.PI / 2 + .25, {});
        X.serif(ctx, lab[i], x, X.PANEL.y + X.PANEL.h + 74, 50, span(t, swT[i] - .1, swT[i] + .4), { col: mixHex(CREAM, GOLD.text, e) });
      }
      F.maskLine(ctx, [['“… certain decisions must never be delegated.”', 0]], W / 2, 208, 52, rise(span(t, a.some + .3, a.some + 1)), { serif: true, col: CREAM, glow: false, align: 'center' });
      X.caps(ctx, CREDIT30.toUpperCase(), W / 2, 254, span(t, a.some + .6, a.some + 1.2), { size: 22 });
    });
  };
  // ---------------------------------------------------------------- 7.10 · Geneva
  const genWords = (t) => QW(QGEN).map((w, i) => ({ w, g: i >= 15 ? span(t, a.banned - .15, a.banned + .35) : (i >= 3 && i <= 6 ? span(t, a.why + .6, a.why + 1.1) * .6 : 0) }));
  const gcard = (ctx, t, u = 1) => X.qcard(ctx, t, { x: GCARD.x, y: GCARD.y, w: GCARD.w, size: 42, u, words: genWords(t), head: 'POPE LEO XIV · 30 OCTOBER 2026', credit: 'Address to the Pontifical Academy for Life', rot: -.003 });
  const GH = 66 + 3 * 42 * 1.24 + 86;   // the card height (3 lines)
  const drawGeneva = (ctx, t, o = {}) => {
    F.night(ctx, t, { glow: [800, 340, 900, .6], n: 140 });
    const away = sineIO(span(t, a.claim - .75, a.claim + .7)) * 700;
    ctx.save(); ctx.translate(0, -away);
    X.lake(ctx, t, span(t, a.why - .2, a.why + .6));
    X.pin(ctx, PINB[0], PINB[1], span(t, a.why - .25, a.why + .35));
    X.serif(ctx, 'GENEVA', PINB[0] - 40, PINB[1] - 70, 56, span(t, a.why + .2, a.why + .8), { align: 'right' });
    X.caps(ctx, 'STATES MEET HERE IN NOVEMBER 2026', PINB[0] - 40, PINB[1] - 22, span(t, a.why + .4, a.why + 1.0), { size: 22, align: 'right' });
    ctx.restore();
    if (!o.noCard) gcard(ctx, t, span(t, a.why + .1, a.why + .9));
    const wu = span(t, a.banned + .1, a.banned + .55);
    if (wu > 0) { ctx.save(); ctx.translate(0, -away * 1.2); F.weight(ctx, 1450, GCARD.y + 4, 96, 'THE LAST DECISION', wu, { size: 22 }); ctx.restore(); }
  };
  // ---------------------------------------------------------------- 7.11–7.13 · HARD TO HEAR → the concrete wall, the crack, the plant
  const hf0 = a.claim - .45, hf1 = a.claim + .85;   // the heavy flip
  const gRect = { x: GCARD.x, y: GCARD.y, w: GCARD.w, h: GH };
  const SL = X.SLAB, SLC = X.rc(SL);
  const zFill = Math.max(W / SL.w, H / SL.h) * 1.01;
  const push0 = a.claim + 1.05, push1 = a.hum - .25, pb0 = a.hum - .1, pb1 = a.hum + 1.9;
  const hardText = (ctx, t, u) => { if (u > 0) X.serif(ctx, 'HARD TO HEAR', SLC[0], SLC[1] + 34, 104, u, { col: CREAM }); };
  const stoneFace = (ctx, t, r) => {
    ctx.fillStyle = F.lin(ctx, r.x, r.y, r.x + r.w, r.y + r.h, [[0, mixHex(P.ind2, P.blue2, .4)], [1, mixHex(P.night1, P.ind2, .5)]]); ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.fillStyle = rgba(P.halo2, .07); ctx.fillRect(r.x, r.y, r.w, 3);
  };
  const wallCam = (t) => {
    const pp = sineIO(span(t, push0, push1)), pb = sineIO(span(t, pb0, pb1)), pl = sineIO(span(t, a.easing - .9, a.erase - .2));
    const tip = [X.PLANT.x, X.PLANT.y]; const z0 = lerp(1, zFill, pp), z1 = lerp(z0, .62, pb), z = lerp(z1, .95, pl);
    return [lerp(SLC[0], lerp(SLC[0], tip[0] + 40, .5), pb) * (1 - pl) + pl * (tip[0] + 30), lerp(SLC[1], lerp(SLC[1], tip[1] - 40, .5), pb) * (1 - pl) + pl * (tip[1] - 120), z];
  };
  const plantS = 300, plantU = (t) => span(t, a.through - .45, a.through + 1.8);
  const drawWall = (ctx, t) => {
    const [cx, cy, z] = wallCam(t), full = t >= push1;
    F.night(ctx, t, { glow: [W / 2, 520, 1000, .55], n: 120 });
    F.look(ctx, cx + F.drift(t, 3, 5), cy + F.drift(t, 2, 9), z, () => {
      if (full) { X.concrete(ctx, t, { crack: span(t, a.despite - .35, a.through + .25) }); const sf = 1 - sineIO(span(t, push1, push1 + .8)); if (sf > 0) { ctx.save(); ctx.globalAlpha *= sf; stoneFace(ctx, t, SL); ctx.restore(); } }
      else { const sq = X.bump(t, hf1 - .02, .3); ctx.save(); ctx.translate(SLC[0], SL.y + SL.h); ctx.scale(1 + .02 * sq, 1 - .035 * sq); ctx.translate(-SLC[0], -(SL.y + SL.h)); stoneFace(ctx, t, SL); ctx.restore();
        // dust from the landing
        const du = span(t, hf1, hf1 + 1.2); if (du > 0 && du < 1) for (let i = 0; i < 14; i++) { const q = (i * 37 % 14) / 14, x = SL.x + q * SL.w, y = SL.y + SL.h + 6 + expoOut(du) * (30 + 40 * ((i * 7) % 5) / 5); ctx.fillStyle = rgba(P.halo2, .5 * (1 - du) * Math.min(1, du * 6)); ctx.beginPath(); ctx.arc(x + (q - .5) * 60 * du, y, 2.2, 0, 6.29); ctx.fill(); } }
      hardText(ctx, t, span(t, hf1 + .02, hf1 + .9) * (1 - span(t, a.hum - .5, a.hum - .05)));
      if (plantU(t) > 0) X.plant(ctx, t, X.PLANT.x, X.PLANT.y, plantS, plantU(t));
    });
    // the quotes (§118), screen space, on a dark band
    const b = span(t, a.hum + .4, a.hum + 1.2) * (1 - span(t, a.erase - .6, a.erase - .1));
    if (b > 0) { ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = F.lin(ctx, 0, 700, 0, 900, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, .75 * b)]]); ctx.fillRect(0, 700, W, 380); ctx.restore(); }
    const q1 = X.inout(t, a.hum + .5, a.hum + 1.2, a.easing - .45, a.easing - .05), q2 = X.inout(t, a.easing + .05, a.easing + .7, a.erase - .55, a.erase - .15);
    if (q1 > 0) F.maskLine(ctx, [['“… humanity flourishes not despite limitations, but often through them.”', 0]], W / 2, 806, 48, q1, { serif: true, col: CREAM, glow: false, align: 'center' });
    if (q2 > 0) F.maskLine(ctx, [['“… it is right to strive to alleviate the suffering that marks human life …”', 0]], W / 2, 806, 48, q2, { serif: true, col: CREAM, glow: false, align: 'center' });
    X.caps(ctx, 'MAGNIFICA HUMANITAS · §118', W / 2, 856, Math.max(q1, q2), { size: 24 });
  };
  const budScreen = (t) => { const [cx, cy, z] = wallCam(t), tip = X.plantTip(t, X.PLANT.x, X.PLANT.y, plantS, plantU(t)); return F.lookPt(cx, cy, z, tip[0], tip[1]); };
  // ---------------------------------------------------------------- 7.14 ★ · the hospital room: the sweep erases the pain and the warm light
  const hi0 = a.erase - .7, hi1 = a.erase + .55;
  const sw0 = a.completely - .2, sw1 = a.love + .05, lampOff0 = a.goesOut - .55, lampOff1 = a.goesOut - .1;
  const hospCam = (t) => [lerp(960, 900, sineIO(span(t, hi0, a.test))), lerp(540, 560, sineIO(span(t, hi0, a.test))), lerp(1, 1.08, sineIO(span(t, hi0, a.test)))];
  const lampCold = (t) => { if (t < lampOff0) return 1; if (t > lampOff1) return 0; const u = span(t, lampOff0, lampOff1); return (1 - u) * (Math.sin(u * 40) > -.2 ? 1 : .25); };
  const drawHospital = (ctx, t) => {
    const [cx, cy, z] = hospCam(t), sx = lerp(-80, W + 80, sineIO(span(t, sw0, sw1)));
    const room = (c, cold) => F.look(c, cx, cy, z, () => {
      X.hospital(c, t, { warm: cold ? 0 : 1, pain: cold ? 0 : 1, lamp: cold ? lampCold(t) * .55 : 1 });
      // LOVE on the bedside table: warm gold; on the erased side only its hollow outline
      if (!cold) F.weight(c, 500, 548, 64, 'LOVE', span(t, a.erase - .2, a.erase + .3), { size: 22 });
      else { c.save(); c.strokeStyle = rgba(X.COLD.hi, .45); c.lineWidth = 2; const w = 64 * .9, h = 64 * .5; c.beginPath(); c.moveTo(500 - w / 2, 548); c.lineTo(500 + w / 2, 548); c.lineTo(500 + w * .38, 548 - h); c.lineTo(500 - w * .38, 548 - h); c.closePath(); c.stroke(); c.restore(); }
    });
    room(ctx, false);
    if (sx > -60) {   // the erased side (cold, no pain, no warmth) left of the sweep
      ctx.save(); const [x0] = [Math.max(0, sx)]; ctx.beginPath(); ctx.rect(-10, -10, x0 + 10, H + 20); ctx.clip(); room(ctx, true); ctx.restore();
      if (sx < W + 60) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.lin(ctx, sx - 160, 0, sx + 8, 0, [[0, rgba(X.COLD.hi, 0)], [1, rgba(X.COLD.hi, .22)]]); ctx.fillRect(sx - 160, 0, 168, H); ctx.restore(); ctx.fillStyle = rgba(GOLD.core, .95); ctx.fillRect(sx - 1.5, 0, 3, H); F.halo(ctx, sx, H * .5, 140, .5, P.halo0, P.core0); }
    }
    // §120 (top), the key words light as spoken
    const qu = span(t, a.erase + .15, a.erase + .8);
    const lov = span(t, a.love - .1, a.love + .35);
    F.maskLine(ctx, [['“To eliminate suffering entirely would mean, in the end,', 0]], W / 2, 112, 44, rise(qu), { serif: true, col: CREAM, glow: false, align: 'center' });
    F.maskLine(ctx, [['extinguishing ', 0], ['love', lov], [' and desire as well.”', 0]], W / 2, 166, 44, rise(span(qu, .15, 1)), { serif: true, col: CREAM, glow: false, align: 'center' });
    X.caps(ctx, 'MAGNIFICA HUMANITAS · §120', W / 2, 210, span(qu, .4, 1), { size: 22 });
  };
  const lampScreen = (t) => { const [cx, cy, z] = hospCam(t); return F.lookPt(cx, cy, z, X.ROOM.lamp[0], X.ROOM.lamp[1] + 8); };
  // ---------------------------------------------------------------- 7.15–7.16 · the fridge, the photo, the calendar
  const fo0 = a.test - .3, fo1 = a.test + .6;
  const PH = X.FRIDGE.photo;
  const fridgeCam = (t) => X.camKeys(t, [[fo1, 960, 540, 1], [a.yourself + .6, 980, 520, 1.06], [a.think - .3, 1000, 520, 1.08], [a.think + 1.1, 1222, 430, 2.35], [a.reach, 1222, 430, 2.45]], .6);
  const phFlip0 = a.reach - .5, phFlip1 = a.reach + .1, flood1 = a.reach + .55;
  const drawFridge = (ctx, t) => {
    const [cx, cy, z] = fridgeCam(t);
    F.look(ctx, cx, cy, z, () => X.fridge(ctx, t, { open: 1, photo: t < phFlip0 ? 1 : 0, cal: span(t, a.think + .35, a.think + .95), marks: span(t, a.cost - .25, a.cost + 1.6) }));
    X.caps(ctx, 'WHAT IT HAS COST YOU', W / 2, 870, span(t, a.cost + .1, a.cost + .7) * (1 - span(t, phFlip0 - .3, phFlip0)), { size: 24, col: CREAM });
  };
  const photoScreen = (t) => { const [cx, cy, z] = fridgeCam(t), p0 = F.lookPt(cx, cy, z, PH.x, PH.y); return { x: p0[0], y: p0[1], w: PH.w * z, h: PH.h * z }; };
  // ---------------------------------------------------------------- 7.17–7.23 · the question, the line, C5, the four words, IS ANY OF IT RIGHT?
  const qOut0 = a.needs - .15, qOut1 = a.needs + .45, ln0 = a.needs + .25, ln1 = a.sentence + .95;
  const L0 = 160, L1 = 1760;
  const WORDS = [['FREEDOM', 380, a.freedom], ['AN INNER LIFE', 870, a.inner], ['LOVE', 1275, a.love2], ['WORSHIP', 1620, a.worship]];
  const lineCam = (t) => X.camKeys(t, [[a.whether - .4, 960, 540, 1], [a.whether + 1.4, 1000, 590, 1.1], [a.any - .45, 1010, 590, 1.11], [a.any + .5, 960, 540, 1], [a.night + .6, 990, 560, 1.045]], .8);
  const youX = (t) => lerp(-160, 1110, sineIO(span(t, a.whether - 1.5, a.whether + 1.1))) + lerp(0, 1100, sineIO(span(t, a.night + .2, a.night + 2.6)));
  const drawLine = (ctx, t) => {
    F.night(ctx, t, { glow: [W / 2, LINE_Y, 1000, .65] });
    const [cx, cy, z] = lineCam(t);
    F.look(ctx, cx, cy, z, () => {
      const apart = sineIO(span(t, a.worship - .1, a.worship + .6)), sink = span(t, a.any - .5, a.any + .15);
      const ret = sineIO(span(t, a.any - .2, a.any + .6));   // the line retracts to the ? (c11 picks it up there)
      const lu = smooth(span(t, ln0, ln1)), xl = lerp(L0, W / 2, ret), xr = lerp(L1, W / 2, ret);
      if (lu > 0 && ret < 1) {
        if (apart <= 0) F.goldSpan(ctx, [[xl, LINE_Y], [lerp(xl, xr, lu), LINE_Y]], 0, 1, { w: 3, spark: lu < 1 });
        else { const gx = 1430 + 30 * apart; F.goldSpan(ctx, [[xl, LINE_Y], [Math.min(xr, 1430), LINE_Y]], 0, 1, { w: 3, spark: false }); if (xr > gx + 40 * apart) F.goldSpan(ctx, [[gx + 40 * apart, LINE_Y + 0], [xr + 30 * apart, LINE_Y]], 0, 1, { w: 3, spark: false }); }
      }
      if (t > a.c5e - .2) WORDS.forEach(([w, x, tw], i) => {
        const dim = i < 3 ? .45 * span(t, a.whether - .2, a.whether + .8) * (1 - sink) : 0, xx = x + (i === 3 ? 30 * apart : 0);
        const u = Math.min(rise(span(t, tw - .12, tw + .45)), 1 - sineIO(sink));
        if (u > 0) F.maskLine(ctx, [[w, 1 - dim]], xx, LINE_Y - 22, i === 3 ? 84 : 80, u, { serif: true, col: mixHex(CREAM, P.blue1, dim), glow: i === 3, align: 'center' });
      });
      X.caps(ctx, 'YOUR CALL', 1650, LINE_Y + 56, span(t, a.yourCall - .1, a.yourCall + .5) * (1 - span(t, a.any - .5, a.any - .1)), { size: 26, col: CREAM });
      // you: walk in under the line, stop, look up at WORSHIP; later look up at the question
      const yx = youX(t);
      if (t > a.whether - 1.6 && t < a.night + 2.9) {
        ctx.save(); ctx.translate(0, expoIn(span(t, a.night + 1.9, a.night + 2.9)) * 260);
        const walking = t < a.whether + 1.0 || (t > a.night + .2 && t < a.night + 2.6);
        ctx.save(); ctx.translate(0, (1 - sineIO(span(t, a.whether - 1.6, a.whether - .5))) * 240); F.land(ctx, 880); ctx.restore();
        F.du(ctx, yx, 880, 200, walking ? { walk: yx / 30, view: 'side', dir: 1, light: -1 } : { dir: 1, look: lerp(.55, .9, span(t, a.any - .3, a.any + .4)) + .04 * Math.sin(t * .7), light: 1, back: .4 });
        ctx.restore();
      }
    });
    F.source(ctx, t, a.freedom - .2, a.whether - .3, 'POPE LEO XIV, 25 MAY 2026: “A FREEDOM, AN INTERIORITY AND A VOCATION TO LOVE AND WORSHIP”');
    if (t > a.any - .35) drawAny(ctx, t, a);
  };

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t < a.start + .5) { S.plateStays(ctx, t, T); return; }
    if (t < a.mach - .45) { drawM1(ctx, t); return; }
    if (t < pull0) {   // the card turns over (TOOL | PERSON on its back), the scale sinks away
      F.night(ctx, t, { glow: [lerp(700, W / 2, growU(t)), 520, lerp(900, 1000, growU(t)), lerp(S.breathe(t, .7), .7, growU(t))] });
      F.look(ctx, W / 2, H / 2, lerp(1.012 + .0015 * (t - t0s), 1, growU(t)), () => {
        const out = expoIn(span(t, a.mach - .55, a.mach + .45)), tilt = .32;
        ctx.save(); ctx.translate(0, out * 760); S.staysScale(ctx, t, 480, 470, 250, { tilt, right: (c, px, py, s2) => F.weight(c, px, py - 2, s2 * .24, 'PURPOSE', 1, { size: 22 }) }); ctx.restore();
        const r = X.lrect(CARD1, CARD2, growU(t)), c0 = X.rc(CARD1), c1 = X.rc(r);
        X.flip(ctx, lerp(c0[0], c1[0], .5), lerp(c0[1], c1[1], .5), flipU(t), (c) => card1(c, t), (c) => m2Card(c, t, r), { lift: 24, ease: sineIO });
      });
      return;
    }
    if (t < pull1) { X.pullOut(ctx, span(t, pull0, pull1), X.BANK.screen, (c) => drawBank(c, t), (c) => drawM2(c, t)); return; }
    if (t < a.some + .05) { drawBank(ctx, t); return; }
    if (t < a.why - .3) { drawSwitches(ctx, t); return; }
    if (t < a.why + .75) {   // iris out of switch 3's light into Geneva (the light becomes the pin head)
      drawSwitches(ctx, t);
      const e = quartIO(span(t, a.why - .3, a.why + .75)), L = X.ledPt(2), c = X.lpt(L, [PINB[0], PINB[1] - 70], e);
      X.irisDot(ctx, c[0], c[1], lerp(8, 2400, e), (cc) => drawGeneva(cc, t), { rim: rgba(P.core1, .7 * (1 - e)) });
      return;
    }
    if (t < hf0) { drawGeneva(ctx, t); return; }
    if (t < hf1 + .02) {   // the heavy turn: the appeal turns over and lands as a stone: HARD TO HEAR
      drawGeneva(ctx, t, { noCard: true });
      { const bg = sineIO(span(t, hf0 + .3, hf1)); if (bg > 0) { ctx.save(); ctx.globalAlpha *= bg; F.night(ctx, t, { glow: [W / 2, 520, 1000, .55], n: 120 }); ctx.restore(); } }   // the night of the next motif
      const u = span(t, hf0, hf1), m = sineIO(u), r = X.lrect(gRect, SL, m), ant = -.025 * X.bump(t, hf0 - .2, .35);
      ctx.save(); ctx.translate(X.rc(r)[0], X.rc(r)[1]); ctx.rotate(ant); ctx.translate(-X.rc(r)[0], -X.rc(r)[1]);
      X.flip(ctx, X.rc(r)[0], X.rc(r)[1], u, (c) => X.mapRect(c, gRect, r, (cc) => gcard(cc, t)), (c) => { stoneFace(c, t, r); }, { ease: (q) => q < .5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2, lift: 46 });
      ctx.restore();
      return;
    }
    if (t < hi0) { drawWall(ctx, t); return; }
    if (t < hi1) { drawWall(ctx, t); const b = budScreen(t), e = quartIO(span(t, hi0, hi1)); X.irisDot(ctx, b[0], b[1], lerp(6, 2300, e), (c) => drawHospital(c, t), { rim: rgba(X.AMBER.glow, .8 * (1 - e)) }); return; }
    if (t < fo0) { drawHospital(ctx, t); return; }
    if (t < fo1) {   // the dark room; the fridge door's light opens as a slit where the lamp died
      drawHospital(ctx, t);
      const e = quartIO(span(t, fo0, fo1)), L = lampScreen(t), c = X.lpt(L, [W / 2, H / 2], e), w = lerp(4, W + 200, Math.pow(e, 1.6)), h = lerp(70, H + 200, e);
      X.irisRect(ctx, { x: c[0] - w / 2, y: c[1] - h / 2, w, h }, lerp(2, 0, e), (cc) => drawFridge(cc, t), { rim: rgba(X.AMBER.glow, .9 * (1 - e)), rimW: 3 });
      return;
    }
    if (t < phFlip0) { drawFridge(ctx, t); return; }
    if (t < flood1) {   // the photo comes off the magnet, turns over, its dark back floods the frame
      drawFridge(ctx, t);
      const p0 = photoScreen(phFlip0), fu = span(t, phFlip0, phFlip1), gu = sineIO(span(t, phFlip1 - .2, flood1));
      const r = X.lrect(p0, COVER, gu), c = X.rc(r);
      X.flip(ctx, c[0], c[1], fu, (cc) => X.photo(cc, t, p0.x, p0.y, p0.w, p0.h, -.05, { magnet: false }), (cc) => { cc.save(); cc.beginPath(); cc.roundRect(r.x, r.y, r.w, r.h, lerp(6, 0, gu)); cc.clip(); F.night(cc, t, { glow: [W / 2, LINE_Y, 1000, .65] }); cc.restore(); cc.strokeStyle = rgba(P.halo2, .3 * (1 - gu)); cc.lineWidth = 2; cc.beginPath(); cc.roundRect(r.x, r.y, r.w, r.h, lerp(6, 0, gu)); cc.stroke(); }, { lift: 20 });
      if (gu > .6) F.question(ctx, t, 'WHAT CAN NO MACHINE REACH?', W / 2, 580, 96, { ts: a.reachW ?? [a.reach, a.reach + .2, a.reach + .4, a.reach + .6, a.reach + .8] });
      return;
    }
    if (t < ln0) {
      F.night(ctx, t, { glow: [W / 2, LINE_Y, 1000, .65] });
      ctx.save(); ctx.translate(0, 0); F.question(ctx, t, 'WHAT CAN NO MACHINE REACH?', W / 2, 580, 96, t < qOut0 ? { ts: a.reachW ?? [a.reach, a.reach + .2, a.reach + .4, a.reach + .6, a.reach + .8] } : { u: 1 - span(t, qOut0, qOut1) }); ctx.restore();
      return;
    }
    // the line, then C5 out of the line and back into it, then the words
    if (t < a.c5 - .45 || t > a.c5e + .25) {
      if (t < qOut1) { F.night(ctx, t, { glow: [W / 2, LINE_Y, 1000, .65] }); F.question(ctx, t, 'WHAT CAN NO MACHINE REACH?', W / 2, 580, 96, { u: 1 - span(t, qOut0, qOut1) }); F.goldSpan(ctx, [[L0, LINE_Y], [lerp(L0, L1, smooth(span(t, ln0, ln1))), LINE_Y]], 0, 1, { w: 3 }); return; }
      drawLine(ctx, t); return;
    }
    F.night(ctx, t, { glow: [W / 2, LINE_Y, 1000, .65] });
    const m = sineIO(span(t, a.c5 - .45, a.c5 + .45)) * (1 - sineIO(span(t, a.c5e - .45, a.c5e + .25)));
    F.goldSpan(ctx, [[L0, LINE_Y], [L1, LINE_Y]], 0, 1, { w: 3, spark: false });
    F.clipPlate(ctx, t, T, 'C5', { from: { x: L0, y: LINE_Y - 3, w: L1 - L0, h: 6 }, morph: m });
  };
}
