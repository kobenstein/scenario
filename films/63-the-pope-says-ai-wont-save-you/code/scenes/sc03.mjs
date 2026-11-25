// c03 · B1 · 'That promise is not a slogan' → 'For the Pope, the catch' · shots 2.01–2.18. One entry, one draw function, motifs on the voice,
// carriers between them (never a fade, never a cut). ★ = the leitbild anchor THE SCALE (2.14).
//
// | ID      | anchor (phrase)            | motif                                                                                      | type  | carrier → next        |
// |---------|----------------------------|--------------------------------------------------------------------------------------------|-------|-----------------------|
// | 2.01    | That promise is not        | the A PROMISE card hangs as a banner over the block and tears away; the block stands solid  | MIX   | the block's foot      |
// | 2.02    | Hundreds of billions       | the block shrinks onto a stacked bar that grows under it (it rides up): OPENAI $122B · ANTHROPIC $65B · ANTHROPIC IPO $81.3B · MORE THAN $250 BILLION | EXPL | the Anthropic segment |
// | 2.03    | The head of one lab        | the Anthropic segment flies out and becomes the essay: MACHINES OF LOVING GRACE · DARIO AMODEI | EXPL | the essay        |
// | 2.04–05 | Most people … the risks    | the quote card (words light as spoken); arrow UPSIDE climbs, arrow RISKS plunges            | EXPL  | the arrows' origin    |
// | 2.06    | He calls these machines    | the origin bursts into a country of lit minds; on "datacenter" they fold into one block      | EXPL  | the lit block         |
// | 2.07    | The best minds             | sun and moon race over the block, its lights never go out; a stream of light runs to you    | MIX   | the stream            |
// | 2.08    | Take that at its strongest | the stream straightens into a slider THE PROMISE, pushed to its stop: AT ITS STRONGEST      | EXPL  | the track             |
// | 2.09–11 | Your illness / bills / hours | three tiles grow out of the track: the ill sit up · the bills shrink · the planner empties | SCENE/MIX/EXPL | the tiles |
// | 2.12    | It would be the best news  | a newspaper spins in, the tiles become its photos: BEST NEWS IN HISTORY                    | MIX   | the photos            |
// | 2.13    | It is still a promise      | the photos lift off as dashed outlines, the paper drops: STILL A PROMISE                    | EXPL  | the outlines          |
// | 2.14–17 | Put all of that … Your time | ★ THE SCALE rises; the outlines drop as weights into the left pan: BODY · MONEY · TIME     | EXPL  | the beam              |
// | 2.18    | Where is the catch?        | the question card comes down on a hook under the beam and swings                           | EXPL  | the empty right pan → c04 |
import * as F from '../lib/f63_kit.mjs';
import * as S from '../lib/f63_seams.mjs';
import * as B from '../lib/f63_b1_kit.mjs';
import { anchorsPromise, drawPromiseStage, BLK, blockY } from './sc02.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER } = F;
export const PRINT = F.PRINT63;

// ---------------------------------------------------------------- THE SCALE (shared with c04, which dives into the empty right pan)
export const SC = { x: W / 2, y: 300, s: 480 };
export function anchorsScale(T) {
  const put = T.G('Put all of that'), catchQ = T.G('Where is the catch');
  return { put, scaleW: T.G('a scale', 0, put), body: T.G('Your body', 0, put), money: T.G('Your money', 0, put), time: T.G('Your time', 0, put), catchQ, still: T.G('It is still a promise'),
    qts: F.wordTimes(T, 'where is the catch', null, catchQ - .1) };
}
const landT = (A) => [A.put + .95, A.put + 1.2, A.put + 1.45];   // the three weights land in the left pan
export function scaleTilt(t, A) {
  let tilt = 0; for (const l of landT(A)) tilt += (1 - (1 - span(t, l, l + .35)) ** 3) / 3;   // each weight tips the beam fast but not in one frame
  return tilt + .12 * landT(A).reduce((m, l) => m + B.swing(t, l, 1.3, 3.2), 0);
}
export const WS = 118;   // weight size
export function drawScale(ctx, t, A, o = {}) {
  const u = span(t, A.put - .25, A.put + 1.0);
  const L = landT(A), g = lerp(.35, 1, sineIO(span(u, .4, 1))), gy = SC.y + SC.s * 1.05;   // it grows from small: the pans never pop in at full size
  if (g < 1) { ctx.save(); ctx.translate(SC.x, gy); ctx.scale(g, g); ctx.translate(-SC.x, -gy); }
  const pans = F.scale(ctx, t, SC.x, SC.y, SC.s, { u, tilt: scaleTilt(t, A), labels: ['WHAT IT GIVES YOU', 'WHAT STAYS YOURS'], labelU: span(t, A.scaleW - .1, A.scaleW + .5) * (o.labelK ?? 1),
    left: (c, px, py) => {
      const lab = [['BODY', A.body], ['MONEY', A.money], ['TIME', A.time]];
      for (let i = 0; i < 3; i++) {
        if (t < L[i]) continue;
        const wx = px + (i - 1) * WS * 1.02, wy = py - 2;
        F.weight(c, wx, wy, WS, '', 1);
        const lu = span(t, lab[i][1] - .08, lab[i][1] + .35);
        if (lu > 0) F.maskLine(c, [[lab[i][0], 0]], wx, wy - WS * .5 * .3 + 8, 22, rise(lu), { serif: false, weight: 700, col: '#3b2410', glow: false, align: 'center' });
      }
    }, right: o.right });
  if (g < 1) ctx.restore();
  return pans;
}
// the question card on its hook under the pivot (comes down on 'Where', swings, settles)
export function drawCatch(ctx, t, A, o = {}) {
  const u = span(t, A.catchQ - .45, A.catchQ + .15); if (u <= 0) return;
  const y = lerp(-260, 455, expoOut(u)) + (o.dy ?? 0), sw = .05 * B.swing(t, A.catchQ + .05, .7, 1.6) + .004 * Math.sin(t * .9);
  ctx.save(); ctx.translate(SC.x, SC.y); ctx.rotate(sw); ctx.translate(-SC.x, -SC.y);
  ctx.strokeStyle = rgba(GOLD.line, .9); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(SC.x, SC.y + 8); ctx.lineTo(SC.x, y - 75); ctx.stroke();
  ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(SC.x, SC.y + 22, 12, -.4, Math.PI + .9); ctx.stroke();
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(SC.x - 330 + 8, y - 75 + 12, 660, 150, 16); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.beginPath(); ctx.roundRect(SC.x - 330, y - 75, 660, 150, 16); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.line, .75); ctx.lineWidth = 2.5; ctx.stroke();
  F.question(ctx, t, 'WHERE IS THE CATCH?', SC.x, y + 24, 66, { ts: A.qts });
  ctx.restore();
}
export function drawScaleStage(ctx, t, A, o = {}) {
  F.night(ctx, t, { glow: [W / 2, 420, 1000, S.breathe(t, .8)] });
  drawScale(ctx, t, A, o);
  if (o.catch !== false) drawCatch(ctx, t, A);
}

export default async (T, R) => {
  const G = (p, after = R.a - .3) => T.G(p, 0, after);
  const a = { start: R.a, end: R.b, ...anchorsPromise(T), ...anchorsScale(T) };
  a.slogan = G('a slogan'); a.hund = G('Hundreds of billions'); a.billions = G('billions', a.hund); a.dollars = G('dollars', a.hund); a.riding = G('riding on it');
  a.head = G('The head of one lab'); a.essay = G('in an essay'); a.most = G('Most people'); a.upside = G('the upside'); a.risks = G('the risks'); a.risksE = T.GE('risks could be', 0, a.most);
  a.calls = G('He calls these machines'); a.country = G('a country of geniuses'); a.dc = G('datacenter'); a.best = G('The best minds'); a.forYou = G('for you day'); a.day = G('day and night');
  a.take = G('Take that at its'); a.strong = G('strongest'); a.ill = G('Your illness'); a.cure = G('a cure'); a.bills = G('Your bills'); a.shrink = G('shrink', a.bills); a.hours = G('Your hours'); a.back = G('come back');
  a.news = G('It would be the best'); a.bestN = G('best news'); a.history = G('in history');
  return [{ t: R.a, draw: scene(a, T), print: PRINT }];
};

// ---------------------------------------------------------------- layout
const BAR = { x: 860, w: 200, base: 860, k: 1.75 };           // stacked bar: px per $1B
const SEG = [{ v: 122, name: 'OPENAI', amt: '$122B', date: '31 MAR 2026', col: GOLD.body }, { v: 65, name: 'ANTHROPIC', amt: '$65B', date: '28 MAY 2026', col: PAPER.lit }, { v: 81.3, name: 'ANTHROPIC IPO', amt: '$81.3B', date: '19 NOV 2026', col: PAPER.shade }];
const ESS = { x: 1200, y: 420, s: 700 };
const ESS2 = { x: 300, y: 268, s: 380 };
const ORG = [690, 640], UP = [1560, 470], DN = [1560, 800];
const DC = { x: 960, foot: 900, w: 300, h: 560 };
const YOU = { x: 1520, y: 900, h: 130 };
const TR = { x0: 460, x1: 1460, y: 540 };
const TL = [[520, 470], [960, 470], [1400, 470]], TW = 400, TH = 256;
const NEWS = { x: 960, y: 470, w: 1100, h: 690 };

function scene(a, T) {
  const tear0 = a.slogan - .1, tear1 = a.slogan + 1.0;
  const sh0 = a.hund - .35, sh1 = a.hund + .55;                       // the block shrinks onto the bar
  const segT = [[a.hund, a.hund + .7], [a.billions - .05, a.billions + .6], [a.dollars - .05, a.dollars + .6]];
  const barH = (t, i) => SEG[i].v * BAR.k * expoOut(span(t, segT[i][0], segT[i][1]));
  const barTop = (t) => BAR.base - [0, 1, 2].reduce((s, i) => s + barH(t, i), 0) - 4;
  const barOut0 = a.head - .35, barOut1 = a.head + 1.1;   // the bar slides off left (sine: no lurch)
  const fly0 = a.head - .05, fly1 = a.head + .95;                    // the Anthropic segment flies and becomes the essay
  const essMove0 = a.most - .35, essMove1 = a.most + .5;
  const qOut0 = a.calls - .3, qOut1 = a.calls + .5;
  const burst0 = a.calls + .1, burst1 = a.country + .6;               // the country of minds spreads from the arrows' origin
  const fold0 = a.dc - .2, fold1 = a.dc + .95;                        // … and folds into the datacenter block
  const dnOut0 = a.take - .3, dnOut1 = a.take + .6;                   // block, sun, you leave; the stream straightens into the track
  const knob0 = a.strong - .2, knob1 = a.strong + .2;
  const tIn = [a.ill - .3, a.bills - .3, a.hours - .3];
  const news0 = a.news - .3, news1 = a.news + .8;
  const lift0 = a.still - .3, lift1 = a.still + .6;
  const dropT = [a.put + .45, a.put + .7, a.put + .95];

  // ---------------------------------------------------------------- 2.01–2.02 · the banner, the block, the bar
  const blockState = (t) => {   // [x, foot, w, h]
    const u = sineIO(span(t, sh0, sh1));
    const foot = t < sh0 ? blockY(t, a) : lerp(blockY(t, a), barTop(t), u);
    return [lerp(BLK.x, BAR.x, u), foot, lerp(BLK.w, 130, u), lerp(BLK.h, 250, u)];
  };
  const drawBar = (ctx, t) => {
    const bo = sineIO(span(t, barOut0, barOut1));
    ctx.save(); ctx.translate(-bo * 1750, 0);
    const lu = sineIO(span(t, sh0, sh1)); F.land(ctx, lerp(1200, BAR.base, lu));
    let y = BAR.base;
    for (let i = 0; i < 3; i++) {
      const h = barH(t, i); if (h <= .5) continue;
      if (i === 1 && t > fly0) { y -= h; continue; }   // the Anthropic segment has left (it is the essay now)
      ctx.fillStyle = lin(ctx, BAR.x - BAR.w / 2, 0, BAR.x + BAR.w / 2, 0, [[0, mixHex(SEG[i].col, P.night1, .25)], [.5, SEG[i].col], [1, mixHex(SEG[i].col, P.night1, .35)]]);
      ctx.beginPath(); ctx.roundRect(BAR.x - BAR.w / 2, y - h + 1, BAR.w, h - 2, i === 2 ? [4, 4, 0, 0] : 0); ctx.fill();   // 2 px surface gap between segments
      const lu2 = span(t, segT[i][0] + .2, segT[i][0] + .7), my = y - h / 2;
      F.maskLine(ctx, [[`${SEG[i].name} · ${SEG[i].amt}`, 0]], BAR.x + BAR.w / 2 + 36, my + 6, 30, rise(lu2), { serif: false, weight: 600, col: CREAM, glow: false });
      F.capsLabel(ctx, SEG[i].date, BAR.x + BAR.w / 2 + 36, my + 40, lu2, { size: 22, align: 'left' });
      ctx.fillStyle = rgba(CREAM, .5 * lu2); ctx.fillRect(BAR.x + BAR.w / 2 + 6, my, 22 * lu2, 1.5);
      y -= h;
    }
    // the total: a bracket on the left, MORE THAN $250 BILLION
    const tu = span(t, a.riding - .35, a.riding + .3);
    if (tu > 0) {
      const top = barTop(segT[2][1] + 1), x = BAR.x - BAR.w / 2 - 30;
      F.goldSpan(ctx, [[x + 12, BAR.base], [x, BAR.base], [x, top], [x + 12, top]], 0, smooth(tu), { w: 2, spark: false });
      F.maskLine(ctx, [['More than $250 billion', 1]], x - 30, (BAR.base + top) / 2 + 10, 66, rise(tu), { serif: true, col: GOLD.text, glow: true, align: 'right' });
      F.capsLabel(ctx, 'RAISED BY TWO LABS IN 2026', x - 30, (BAR.base + top) / 2 + 60, span(tu, .3, 1), { size: 24, align: 'right' });
    }
    ctx.restore();
    return bo;
  };
  const drawBlock = (ctx, t) => {
    const bo = sineIO(span(t, barOut0, barOut1)); if (bo >= 1) return;
    const [x, foot, w, h] = blockState(t), sq = F.bump(t, a.slogan + .55, .35);
    ctx.save(); ctx.translate(-bo * 1750, 0); ctx.translate(x, foot); ctx.scale(1 + .015 * sq, 1 - .03 * sq); ctx.translate(-x, -foot);
    F.block(ctx, t, x, foot, w, h, { lit: 1, seed: 3, rays: lerp(.9, .4, sineIO(span(t, sh0, sh1))) });
    ctx.restore();
  };
  // the Anthropic segment → the essay
  const segRect = () => { const y1 = BAR.base - SEG[0].v * BAR.k, h = SEG[1].v * BAR.k; return { x: BAR.x - BAR.w / 2, y: y1 - h, w: BAR.w, h }; };
  const essState = (t) => { const m = sineIO(span(t, essMove0, essMove1)), out = expoIn(span(t, a.calls - .2, a.calls + .6)); return { x: lerp(ESS.x, ESS2.x, m) - out * 700, y: lerp(ESS.y, ESS2.y, m), s: lerp(ESS.s, ESS2.s, m) }; };
  const drawEssay = (ctx, t) => {
    if (t < fly0 || t > a.calls + .6) return;
    const f = sineIO(span(t, fly0, fly1));
    const lu = span(t, a.head + .5, a.head + 1.1) * (1 - span(t, essMove0, essMove0 + .4));
    if (lu > 0) {
      F.maskLine(ctx, [['Dario Amodei', 0]], ESS.x, ESS.y + ESS.s * .31 + 76, 56, rise(lu), { serif: true, col: CREAM, glow: false, align: 'center' });
      F.capsLabel(ctx, 'CHIEF EXECUTIVE, ANTHROPIC · ESSAY, OCTOBER 2024', ESS.x, ESS.y + ESS.s * .31 + 124, span(lu, .2, 1), { size: 24 });
    }
    if (f < 1) {   // the paper segment flies on an arc and grows into the closed essay
      const r0 = segRect(), e = essState(t), pw = e.s / 2, h = e.s * .62, bo = sineIO(span(t, barOut0, barOut1)) * 1300;
      const x = lerp(r0.x - bo * 0, e.x, f), y = lerp(r0.y, e.y - h / 2, f) - Math.sin(Math.PI * f) * 120, w = lerp(r0.w, pw, f), hh = lerp(r0.h, h, f);
      ctx.save(); ctx.translate(x + w / 2, y + hh / 2); ctx.rotate(.25 * Math.sin(Math.PI * f)); ctx.translate(-w / 2, -hh / 2);
      ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(8, 12, w, hh);
      ctx.fillStyle = lin(ctx, 0, 0, w, 0, [[0, mixHex(SEG[1].col, mixHex(P.ind1, P.night1, .3), f)], [1, mixHex(SEG[1].col, mixHex(P.ind2, P.blue1, .3), f)]]); ctx.fillRect(0, 0, w, hh);
      ctx.restore();
      if (f > .8) { ctx.save(); ctx.globalAlpha *= span(f, .8, 1); F.essay(ctx, t, e.x, e.y, e.s, { open: 0 }); ctx.restore(); }   // the cover's title prints in
      return;
    }
    const e = essState(t);
    F.essay(ctx, t, e.x, e.y, e.s, { open: span(t, a.essay - .2, a.essay + .6) });
  };
  // ---------------------------------------------------------------- 2.04–2.05 · the quote and the two arrows
  const QA = '“I think that most people are underestimating just how radical the upside of AI could be, just as I think most people are underestimating how bad the risks could be.”';
  const drawQuote = (ctx, t) => {
    const u = span(t, a.most - .4, a.most + .35), o = expoIn(span(t, qOut0, qOut1)); if (u <= 0 || o >= 1) return;
    ctx.save(); ctx.translate(0, -o * 600);
    B.qcard(ctx, t, T, { text: QA, x: 580, y: 96, w: 1240, size: 40, u, spoken: ['Most people', 'risks could be'], after: a.most - .1, credit: 'Dario Amodei · Machines of Loving Grace · October 2024' });
    ctx.restore();
  };
  const arrowRetract = (t) => sineIO(span(t, a.calls - .15, a.calls + .35));
  const upPts = (() => { const p = []; for (let i = 0; i <= 30; i++) { const q = i / 30; p.push([lerp(ORG[0], UP[0], q), lerp(ORG[1], UP[1], q) - Math.sin(q * Math.PI * .5) * 40 * (1 - q) - 30 * q * q]); } return p; })();
  const dnPts = (() => { const p = []; for (let i = 0; i <= 30; i++) { const q = i / 30; p.push([lerp(ORG[0], DN[0], q), lerp(ORG[1], DN[1], q * q)]); } return p; })();
  const head = (ctx, p, q, col, u) => { const ang = Math.atan2(p[1] - q[1], p[0] - q[0]); ctx.save(); ctx.globalAlpha *= u; ctx.fillStyle = col; ctx.translate(p[0], p[1]); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-20, -11); ctx.lineTo(-20, 11); ctx.closePath(); ctx.fill(); ctx.restore(); };
  const drawArrows = (ctx, t) => {
    const r = arrowRetract(t); if (t < a.upside - .5 || r >= 1) return;
    const uu = sineIO(span(t, a.upside - .45, a.upside + .55)) * (1 - r), du = sineIO(span(t, a.risks - .45, a.risks + .55)) * (1 - r);
    ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(ORG[0], ORG[1], 9 * (1 - r * .3), 0, B.TAU); ctx.fill();
    F.capsLabel(ctx, 'TODAY', ORG[0] - 20, ORG[1] + 8, span(t, a.upside - .4, a.upside) * (1 - r), { size: 22, align: 'right' });
    if (uu > 0) { const e = F.goldSpan(ctx, upPts, 0, uu, { w: 4, spark: uu < 1 }); if (uu > .9 && e) head(ctx, upPts[30], upPts[28], GOLD.line, span(uu, .9, 1)); F.maskLine(ctx, [['UPSIDE', 1]], UP[0] + 30, UP[1] + 14, 40, rise(span(uu, .7, 1)), { serif: false, weight: 700, col: GOLD.text, glow: true }); }
    if (du > 0) { F.trailCream(ctx, dnPts, 0, du, { w: 4 }); if (du > .9) head(ctx, dnPts[30], dnPts[28], CREAM, span(du, .9, 1)); F.maskLine(ctx, [['RISKS', 0]], DN[0] + 30, DN[1] + 14, 40, rise(span(du, .7, 1)), { serif: false, weight: 700, col: CREAM, glow: false }); }
  };
  // ---------------------------------------------------------------- 2.06–2.07 · the country of minds, the datacenter, sun and moon
  const CP = B.countryPts(), NC = CP.length, GC = 10, GR = Math.ceil(NC / GC);
  const dcRise = (t) => (1 - sineIO(span(t, fold0 + .1, fold1))) * DC.h;
  const dcGrid = (i, t) => { const c = i % GC, r = Math.floor(i / GC); return [DC.x - DC.w / 2 + DC.w * (.1 + .8 * (c + .5) / GC), DC.foot - DC.h * (.06 + .88 * (r + .5) / GR) + dcRise(t)]; };
  const dotPos = (t, i) => {
    const [u, v, ph, ord] = CP[i], cx = 960 + u * 1050, cy = 500 + v * 720;
    const b = expoOut(span(t, burst0 + ord * .5, burst0 + ord * .5 + .9)), f = sineIO(span(t, fold0 + ord * .45, fold0 + ord * .45 + .5)), g = dcGrid(i, t);
    const x0 = lerp(ORG[0], cx, b), y0 = lerp(ORG[1], cy, b);
    return [lerp(x0, g[0], f), lerp(y0, g[1], f) - Math.sin(Math.PI * f) * 60, b, f, ph];
  };
  const dcU = (t) => span(t, fold0 + .1, fold1);   // the block grows up as the minds land in it
  const downOut = (t) => expoIn(span(t, dnOut0, dnOut1));
  const drawCountry = (ctx, t) => {
    if (t < burst0 || t > dnOut1) return;
    const dn = downOut(t);
    ctx.save(); ctx.translate(0, dn * 700);
    // the sky: sun and moon race over the block (2.07)
    const race = span(t, a.best - .3, a.take + .2);
    if (race > 0 && race < 1) {
      const ang = Math.PI + race * B.TAU * 2.2, R = 700;
      for (const [k, isSun] of [[0, true], [Math.PI, false]]) {
        const th = ang + k, x = DC.x + Math.cos(th) * R, y = DC.foot + Math.sin(th) * R * .82;
        if (y > DC.foot - 40) continue;
        if (isSun) { F.halo(ctx, x, y, 150, .7, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(x, y, 34, 0, B.TAU); ctx.fill(); }
        else { ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(x, y, 30, 0, B.TAU); ctx.fill(); ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.beginPath(); ctx.arc(x + 12, y - 8, 27, 0, B.TAU); ctx.fill(); }
      }
      const day = Math.max(0, Math.sin(-(ang))) * span(race, 0, .1) * (1 - span(race, .9, 1));
      if (day > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.blue0, .22 * day); ctx.fillRect(-W, -H, W * 3, DC.foot + H); ctx.restore(); }
    }
    const du = dcU(t);
    if (du > 0) {
      F.land(ctx, DC.foot);
      ctx.save(); ctx.beginPath(); ctx.rect(-W, -H, W * 3, DC.foot + H); ctx.clip();
      F.block(ctx, t, DC.x, DC.foot + dcRise(t), DC.w, DC.h, { lit: .8 * sineIO(du), seed: 5, rays: .5 });
      ctx.restore();
    }
    // the minds (dots): spread, then fold into the block's face and stay lit there (day and night)
    for (let i = 0; i < NC; i++) {
      const [x, y, b, f, ph] = dotPos(t, i); if (b <= 0) continue;
      const tw = .75 + .25 * Math.sin(t * 2.3 + ph);
      ctx.fillStyle = rgba(f >= 1 ? GOLD.core : GOLD.hot, tw); ctx.beginPath(); ctx.arc(x, y, lerp(4.2, 3, f), 0, B.TAU); ctx.fill();
      if (i % 9 === 0 && f < 1) F.halo(ctx, x, y, 18, .35 * tw, GOLD.halo, GOLD.core);
    }
    // you, small, on the ground; the stream of light from the chip down to you
    const yu = span(t, a.best - .2, a.best + .7);
    if (yu > 0) F.du(ctx, YOU.x + (1 - sineIO(yu)) * 500, YOU.y, YOU.h, yu < 1 ? { walk: (t - a.best) * 9, view: 'side', dir: -1, light: -1 } : { look: .4, dir: -1, light: -1, back: .3, armR: [.6, .9] });
    ctx.restore();
    const lab = span(t, a.country - .2, a.country + .5) * (1 - span(t, a.best - .4, a.best));
    if (lab > 0) { F.maskLine(ctx, [['“A country of geniuses in a datacenter”', 0]], W / 2, 150, 60, rise(lab), { serif: true, col: CREAM, glow: false, align: 'center' }); F.capsLabel(ctx, 'DARIO AMODEI', W / 2, 200, lab, { size: 24 }); }
    const l2 = span(t, a.day - .2, a.day + .4) * (1 - span(t, dnOut0, dnOut0 + .4));
    if (l2 > 0) { F.maskLine(ctx, [['Day and night', 1]], W / 2, 150, 66, rise(l2), { serif: true, col: GOLD.text, glow: true, align: 'center' }); F.capsLabel(ctx, 'THE BEST MINDS, WORKING FOR YOU', W / 2, 200, l2, { size: 24 }); }
  };
  // the stream (from the chip to you) → the slider track
  const chip = [DC.x, DC.foot - DC.h * .67];
  const streamPts = (t) => {
    const s = sineIO(span(t, dnOut0, dnOut1)), dn = downOut(t) * 700, pts = [];
    for (let i = 0; i <= 32; i++) {
      const q = i / 32, ax = lerp(chip[0], YOU.x - 20, q), ay = lerp(chip[1], YOU.y - YOU.h * .55, q) - Math.sin(Math.PI * q) * 160;
      pts.push([lerp(ax, lerp(TR.x0, TR.x1, q), s), lerp(ay + dn * (1 - s), TR.y, s)]);
    }
    return pts;
  };
  const tileU = (t, i) => span(t, tIn[i], tIn[i] + .6);
  const drawStream = (ctx, t) => {
    if (t < a.forYou - .3) return;
    const su = smooth(span(t, a.forYou - .3, a.forYou + .5)), pts = streamPts(t);
    // when the tiles grow, the track pulls in toward their three origins
    const g = [0, 1, 2].map((i) => tileU(t, i)), all = Math.min(...g);
    if (all >= 1) return;
    if (t < tIn[0]) { F.goldSpan(ctx, pts, 0, su, { w: 3, spark: su < 1 }); }
    else for (let i = 0; i < 3; i++) { const c = (TL[i][0] - TR.x0) / (TR.x1 - TR.x0), half = .17 * (1 - sineIO(g[i])); if (half > .002) F.goldSpan(ctx, pts, c - half, c + half, { w: 3, spark: false }); }
    // the slider: label, stop, knob
    const sl = span(t, a.take - .1, a.take + .5) * (1 - span(t, tIn[0], tIn[0] + .4));
    if (sl > 0) {
      F.capsLabel(ctx, 'THE PROMISE', TR.x0, TR.y - 40, sl, { size: 28, col: CREAM, align: 'left' });
      ctx.fillStyle = rgba(GOLD.line, sl); ctx.fillRect(TR.x1 + 6, TR.y - 30, 5, 60);
      const kx = lerp(TR.x0 + 30, TR.x1 - 18, expoOut(span(t, knob0, knob1))), hit = F.bump(t, knob1 - .05, .3);
      F.halo(ctx, kx, TR.y, 60 + 40 * hit, .8 * sl, GOLD.halo, GOLD.core);
      ctx.fillStyle = rgba(GOLD.hot, sl); ctx.beginPath(); ctx.arc(kx, TR.y, 22 * (1 + .12 * hit), 0, B.TAU); ctx.fill();
      F.maskLine(ctx, [['At its strongest', 1]], TR.x1, TR.y - 60, 70, rise(span(t, a.strong - .05, a.strong + .4)) * sl, { serif: true, col: GOLD.text, glow: true, align: 'right' });
    }
  };
  // ---------------------------------------------------------------- 2.09–2.13 · the harvest, the newspaper, the outlines
  const newsSpin = (t) => 1 - (1 - span(t, news0 - .2, news1 + .25)) ** 3;   // a soft landing, half a turn (no lurch)
  const photoRect = (i) => { const [px, py, pw, ph] = B.NEWS_PHOTO(i, NEWS.w, NEWS.h); return [NEWS.x + px, NEWS.y + py, pw, ph]; };
  const tileRect = (t, i) => {   // big → photo on the newspaper → small outline over the scale
    const toP = sineIO(span(t, a.news + .15 + i * .08, a.news + .85 + i * .08)), out = sineIO(span(t, lift0 + i * .08, lift1 + i * .08));
    const pr = photoRect(i), OUT = [[560, 470], [960, 470], [1360, 470]];
    let x = lerp(TL[i][0], pr[0], toP), y = lerp(TL[i][1], pr[1], toP), w = lerp(TW, pr[2], toP), h = lerp(TH, pr[3], toP);
    x = lerp(x, OUT[i][0], out); y = lerp(y, OUT[i][1], out) - Math.sin(Math.PI * out) * 80; w = lerp(w, 300, out); h = lerp(h, 190, out);
    return [x, y, w, h, toP, out];
  };
  const drawTile = (ctx, t, i, x, y, w, h, o = {}) => {
    const lt = t - tIn[i];
    if (i < 2) F.tile(ctx, t, ['ill', 'bills'][i], x, y, w, h, { u: o.u ?? 1, from: o.from, lt, heal: sineIO(span(t, a.cure - .1, a.cure + .7)), shrink: span(t, a.shrink - .1, a.shrink + .6), outline: o.outline });
    else {   // the planner tile (own scene inside the kit's tile frame look)
      const u = clamp(o.u ?? 1); if (u <= 0) return;
      const k = expoOut(u), fx = o.from ? lerp(o.from[0], x, k) : x, fy = o.from ? lerp(o.from[1], y, k) : y, s = o.from ? lerp(.06, 1, k) : 1;
      ctx.save(); ctx.translate(fx, fy); ctx.scale(s, s);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.rad(ctx, 0, 0, Math.max(w, h) * .8, [[0, rgba(P.halo1, .16)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(-w, -h, w * 2, h * 2); ctx.restore();
      const rr = Math.min(w, h) * .06;
      ctx.save(); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, rr); ctx.clip();
      if (!o.outline) { const fl = B.planner(ctx, t, -w / 2, -h / 2, w, h, { free: span(t, a.back - .25, a.back + .7) }); flying = fl.map((b) => ({ ...b, x: b.x * s + fx, y: b.y * s + fy })); }
      else { ctx.fillStyle = mixHex(P.night0, P.ind0, .5); ctx.fillRect(-w / 2, -h / 2, w, h); }
      ctx.restore();
      ctx.strokeStyle = o.outline ? rgba(CREAM, .9) : mixHex(P.cream, P.halo0, .3); ctx.lineWidth = Math.max(2, w * .012); if (o.outline) ctx.setLineDash([w * .04, w * .03]);
      ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, rr); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
    }
  };
  let flying = [];
  const drawHarvest = (ctx, t) => {
    if (t < tIn[0] || t > a.put + 1.6) return;
    const spin = newsSpin(t), nOut = sineIO(span(t, lift0, lift1 + .7));   // the paper sinks away under the outlines (no lurch)
    if (t > news0 && nOut < 1) {   // the newspaper spins in behind the tiles, its photos are the tiles
      const rot = -(1 - spin) * B.TAU * .35 - .02, sc = lerp(.08, 1, spin);
      ctx.save(); ctx.translate(NEWS.x, NEWS.y + nOut * 1000); ctx.scale(1 - .3 * nOut, 1 - .3 * nOut); ctx.translate(-NEWS.x, -NEWS.y);
      B.newspaper(ctx, t, NEWS.x, NEWS.y, NEWS.w, NEWS.h, { rot, s: sc, head: false });
      if (spin > .97) {
        const hu = rise(span(t, a.bestN - .15, a.bestN + .35));
        F.maskLine(ctx, [['BEST NEWS IN HISTORY', 0]], NEWS.x, NEWS.y - NEWS.h / 2 + 200, 92, hu, { serif: true, col: PAPER.ink, glow: false, align: 'center' });
        const tw = F.measure('BEST NEWS IN HISTORY', 92, true), hx = NEWS.x + tw / 2 - F.measure('HISTORY', 92, true);
        F.goldSpan(ctx, [[hx, NEWS.y - NEWS.h / 2 + 216], [NEWS.x + tw / 2, NEWS.y - NEWS.h / 2 + 216]], 0, smooth(span(t, a.history, a.history + .5)), { w: 3, spark: false });
      }
      ctx.restore();
    }
    // the three tiles
    for (let i = 0; i < 3; i++) {
      const gu = tileU(t, i); if (gu <= 0) continue;
      const [x, y, w, h, toP, out] = tileRect(t, i), drop = dropOf(t, i);
      if (drop.landed) continue;
      const focus = i === activeTile(t) && toP === 0 ? 1.06 : 1;
      const from = gu < 1 ? [TL[i][0], TR.y] : null;
      if (out <= 0) { drawTile(ctx, t, i, x, y, w * focus, h * focus, { u: gu, from }); continue; }
      // lifting off the paper: the picture drains top-down into a dashed outline
      ctx.save(); ctx.translate(drop.dx, drop.dy); ctx.translate(x, y); ctx.scale(drop.s, drop.s); ctx.translate(-x, -y);
      const wipe = span(out, .1, .8);
      ctx.save(); ctx.beginPath(); ctx.rect(x - w, y - h / 2 + h * wipe, w * 2, h * 2); ctx.clip(); drawTile(ctx, t, i, x, y, w, h); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(x - w, y - h, w * 2, h / 2 + h * wipe); ctx.clip(); drawTile(ctx, t, i, x, y, w, h, { outline: true }); ctx.restore();
      ctx.restore();
    }
    // free hours fly to you (2.11)
    for (const b of flying) if (b.f > 0 && b.f < 1 && t < a.news) { const q = sineIO(b.f), x = lerp(b.x, 1400, q), y = lerp(b.y, 860, q) - Math.sin(Math.PI * q) * 80; F.halo(ctx, x, y, 22, .8 * (1 - q * .5), GOLD.halo, GOLD.core); }
    flying = [];
    const yu = span(t, a.hours - .2, a.hours + .4) * (1 - span(t, news0, news0 + .4));
    if (yu > 0) F.du(ctx, 1400, 880 + (1 - expoOut(yu)) * 200, 120, { look: .8, light: 1, back: .3, armR: [1.4, 2.0], armL: [-1.4, -2.0] });
    // captions under the tiles, and STILL A PROMISE
    const cap = [['A CURE', a.cure], ['BILLS SHRINK', a.shrink], ['YOUR HOURS BACK', a.back]];
    for (let i = 0; i < 3; i++) F.capsLabel(ctx, cap[i][0], TL[i][0], TL[i][1] + TH / 2 + 52, span(t, cap[i][1] - .1, cap[i][1] + .4) * (1 - span(t, news0 - .2, news0 + .2)), { size: 26, col: CREAM });
    const sp = span(t, a.still + .1, a.still + .6) * (1 - span(t, a.put - .2, a.put + .3));
    if (sp > 0) F.maskLine(ctx, [['Still a promise', 0]], W / 2, 720, 80, rise(sp), { serif: true, col: CREAM, glow: false, align: 'center' });
  };
  const activeTile = (t) => (t > a.hours - .2 ? 2 : t > a.bills - .2 ? 1 : 0);
  // the outlines drop into the left pan (they become the weights)
  const dropOf = (t, i) => {
    const f = span(t, dropT[i], landT(a)[i]); if (f <= 0) return { dx: 0, dy: 0, s: 1, landed: false };
    if (f >= 1) return { landed: true };
    const [x, y, w] = tileRect(t, i), pans = scalePans(t), wx = pans.L[0] + (i - 1) * WS * 1.02, wy = pans.L[1] - WS * .25;
    const q = expoIn(f) * .6 + sineIO(f) * .4;
    return { dx: lerp(0, wx - x, q), dy: lerp(0, wy - y, q) - Math.sin(Math.PI * q) * 140, s: lerp(1, WS * .9 / w, q), landed: false };
  };
  const scalePans = (t) => { const tilt = scaleTilt(t, a) * .16 + .006 * Math.sin(t * .8), hw = SC.s * expoOut(span(span(t, a.put - .25, a.put + 1.0), .5, 1)); return { L: [SC.x - hw * Math.cos(tilt), SC.y + hw * Math.sin(tilt) + SC.s * .62] }; };

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t < tear0 + .02) { drawPromiseStage(ctx, t, a, { card: { cloth: sineIO(span(t, a.start, a.start + .7)) } }); return; }
    F.night(ctx, t, { glow: [W / 2, lerp(470, 420, span(t, a.put - .5, a.put + .5)), lerp(900, 1000, span(t, a.put - .5, a.put + .5)), S.breathe(t, .8) + .5 * (1 - span(t, a.hund, a.hund + 1.5))] });
    if (t < a.head + 1.15) { drawBar(ctx, t); drawBlock(ctx, t); }
    if (t < tear1 + .1) B.promiseCard(ctx, t, { flip: 1, cloth: 1, tear: span(t, tear0, tear1) });
    drawEssay(ctx, t);
    drawQuote(ctx, t);
    drawArrows(ctx, t);
    drawCountry(ctx, t);
    drawStream(ctx, t);
    if (t > a.put - .3) drawScale(ctx, t, a);
    drawHarvest(ctx, t);
    drawCatch(ctx, t, a);
    F.source(ctx, t, a.hund + .4, a.head - .2, 'OPENAI 31 MAR 2026 (BLOOMBERG) · ANTHROPIC 28 MAY 2026 · ANTHROPIC IPO 19 NOV 2026 (AL JAZEERA)');
    F.source(ctx, t, a.head + .3, a.calls, 'DARIO AMODEI, “MACHINES OF LOVING GRACE”, 11 OCTOBER 2024');
  };
}
const lin = F.lin;
