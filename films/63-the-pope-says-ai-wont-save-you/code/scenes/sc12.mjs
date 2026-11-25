// c12 · B3 · 'None of this arrives' → end (incl. the 15 s end screen). Plan: docs/shots.md 9.01–9.19, A.01–A.03, E.01. One entry.
// Starts on the last frame of c11 (the workshop door, drawn by sc11's own scene so the inner seam is exact).
//
// | ID        | anchor (phrase)            | motif                                                                          | type | carrier → next        |
// |-----------|----------------------------|--------------------------------------------------------------------------------|------|-----------------------|
// | 9.01      | None of this arrives       | the door's light floods and shrinks into one gold arrow that does not move; three levers rise, unlabelled | EXPL | the arrow |
// | 9.02      | The future of these        | 30 OCT 2026: “… not pre-determined … depends on the choices we make.”            | EXPL | lever 1               |
// | 9.03–05   | The labs set the pace      | LABS pull, the arrow moves · GOVERNMENTS half, slips back (or fail to) · VOTERS: your yellow hand, a link to lever 2 | EXPL/MIX | the arrow |
// | 9.06 ★    | Now look at both sides     | ANCHOR: the arrow becomes the beam, the big scale unfolds below it, level       | MIX  | the left pan          |
// | 9.07–08c  | On the left …              | WHAT A MACHINE CAN TAKE OFF YOUR HANDS: the three tiles land and are lifted away | MIX/SCENE | the right pan  |
// | 9.09–12   | On the right …             | WHAT CANNOT BE HANDED OVER: two chairs · a hand on a hand · a Tuesday morning: they stay | MIX/SCENE | a card |
// | 9.13–14   | The Pope has a sentence    | §128 rises over the right pan, lit as spoken                                    | EXPL | the card              |
// | 9.15–17   | Put plainly                | OUR WORDS, NOT A QUOTE · AI CAN SAVE YOUR BODY · TIME · MONEY (weights) · WHAT YOU DO WITH THEM, your hands hold the right pan | EXPL/MIX | the pivot light |
// | 9.18–19   | At the start, you named    | iris: the kitchen of H.04, your open hands, the dashed tiles leave by the window; the hands close round a light | SCENE | the light |
// | A.01–03   | This channel exists        | ANCHOR: through the light: the wall rebuilt by many hands round the scale; your sleeve lays a stone: SUBSCRIBE | SCENE | the scale |
// | E.01      | (end screen, 15 s)         | the wall sinks, the scale rests high and level, both pans full; the lower half stays calm for the end cards; no text | WELT | — |
import * as F from '../lib/f63_kit.mjs';
import * as X from '../lib/f63_b3_extra.mjs';
import { anchors11, scene11 } from './sc11.mjs';
import { anchors10, scene10 } from './sc10.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER } = F;
export const PRINT = F.PRINT63;

export function anchors12(T, R) {
  const G = (p, after = R.a - .5) => T.G(p, 0, after), GE = (p, after = R.a - .5) => T.GE(p, 0, after);
  const a = { start: R.a };
  a.none = G('None of this arrives'); a.itself = G('by itself', a.none);
  a.future = G('The future of these machines'); a.choices = G('the choices we make', a.future);
  a.labs = G('The labs set'); a.pace = G('the pace', a.labs); a.gov = G('Governments write'); a.fail = G('or fail to', a.gov); a.answer = G('And governments answer'); a.toYou = G('to you', a.answer);
  a.look = G('Now look at both sides'); a.left = G('On the left, everything'); a.takeOff = G('take off your hands', a.left);
  a.ill = G('The illness', a.left); a.bills = G('The bills', a.ill); a.work = G('The work that wears', a.bills); a.workE = GE('wears you out', a.work);
  a.right = G('On the right, what'); a.handed = G('cannot be handed over', a.right);
  a.sit = G('Who you sit with'); a.answerFor = G('Who you answer for'); a.tues = G('What you do on a Tuesday');
  a.sentence = G('The Pope has a sentence'); a.saves = G('What saves humanity'); a.liberates = GE('relationship that liberates', a.saves);
  a.plainly = G('Put plainly'); a.aiCan = G('Artificial intelligence can save'); a.save = G('save', a.aiCan); a.body = G('your body', a.aiCan); a.time = G('your time', a.aiCan); a.money = G('your money', a.aiCan);
  a.whatDo = G('What you do with them'); a.job = G('the one job', a.whatDo); a.cannot = G('cannot take', a.whatDo);
  a.atStart = G('At the start, you named'); a.handM = G('hand a machine', a.atStart); a.keep = G('Now name what you would keep'); a.keepW = G('keep', a.keep);
  a.channel = G('This channel exists so that'); a.everybody = G('goes well for everybody', a.channel); a.build = G('build it', a.channel);
  a.want = G('Want that too'); a.sub = G('Then subscribe'); a.subW = G('subscribe', a.sub);
  a.endT = T.duration - 15; a.end = T.duration;
  return a;
}
export default async (T, R) => {
  const R10 = { a: T.G('In October the Pope'), b: T.G('The night the letter came out') }, R11 = { a: R10.b, b: R.a };
  const a11 = anchors11(T, R11), prev = scene11(a11, T, scene10(anchors10(T, R10), T));
  return [{ t: R.a, draw: scene12(anchors12(T, R), T, prev, a11), print: PRINT }];
};

// ------------------------------------------------------------------------------------------------ layout
const ARROW = { x0: 560, x1: 1360, y: 470 }, LEV = [620, 960, 1300], LBASE = 760, LLEN = 190;
const PIV = [960, 460], SS = 420;   // the big scale (anchor): pivot, half beam
const COVER = { x: -80, y: -80, w: W + 160, h: H + 160 };
const QFUT = '… the future of artificial intelligence is not pre-determined. … its future depends on the choices we make.';
const Q128 = '… what saves humanity is not enhanced self-sufficiency, but a relationship that liberates, a communion that transforms.';
const W_ = (s) => s.split(/\s+/).filter(Boolean);
const panL = [PIV[0] - SS, PIV[1] + SS * .62], panR = [PIV[0] + SS, PIV[1] + SS * .62];

export function scene12(a, T, prev, a11) {
  const COLD_ = X.COLD;
  // ---------------------------------------------------------------- 9.01–9.05 · the arrow, the levers
  const D = X.SHOP.door, fl0 = a.none + .02, sh1 = a.none + 2.6;
  // the workshop door at the end of c11 (sc11 drawShop: z = 1 + .02 · span(t, tech + 2.1, end + 1)) in screen space
  const doorScreen = (t) => { const z = a11 ? 1 + .02 * span(t, a11.tech + 2.1, a11.end + 1) : 1; return { x: (D.x - W / 2) * z + W / 2, y: (D.y - H / 2) * z + H / 2, w: D.w * z, h: D.h * z }; };
  const arrowR = { x: ARROW.x0, y: ARROW.y - 4, w: ARROW.x1 - ARROW.x0, h: 8 };
  const pullL = (t) => [expoOut(span(t, a.labs - .05, a.labs + .55)) * .55,
    expoOut(span(t, a.gov + .1, a.gov + .7)) * .5 - sineIO(span(t, a.fail - .05, a.fail + .6)) * .38,
    expoOut(span(t, a.answer + .35, a.answer + 1.0)) * .55];
  const adv = (t) => { const p = pullL(t); return 90 * p[0] / .55 + 70 * p[1] / .5 + 90 * p[2] / .55; };
  const levU = (t) => span(t, a.itself - .3, a.itself + .5) * (1 - span(t, a.look - .6, a.look + .1));
  const toBeam = (t) => sineIO(span(t, a.look - .45, a.look + .35));
  const arrowAt = (t) => {   // the arrow's shaft (x0, x1, y) and its head size; it trembles, it advances with the levers, it becomes the beam
    const b = toBeam(t), tr = 1.2 * Math.sin(t * 23) * (1 - span(t, a.labs - .2, a.labs + .2)) * span(t, a.itself - .2, a.itself + .2);
    const x0 = ARROW.x0 + adv(t) + tr, x1 = ARROW.x1 + adv(t) + tr;
    return { x0: lerp(x0, PIV[0] - SS, b), x1: lerp(x1, PIV[0] + SS, b), y: lerp(ARROW.y, PIV[1], b), head: 1 - b };
  };
  const drawArrow = (ctx, t) => {
    const A = arrowAt(t);
    F.goldSpan(ctx, [[A.x0, A.y], [A.x1, A.y]], 0, 1, { w: lerp(8, SS * .04 / 2.1, 1 - A.head), spark: false });
    const hg = sineIO(span(t, sh1 - .2, sh1 + .45));
    if (A.head > 0 && hg > 0) { const s = 42 * A.head * hg; ctx.save(); ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.moveTo(A.x1 + s * 1.1, A.y); ctx.lineTo(A.x1 - s * .3, A.y - s * .8); ctx.lineTo(A.x1 - s * .3, A.y + s * .8); ctx.closePath(); ctx.fill(); ctx.restore(); F.halo(ctx, A.x1 + 10, A.y, 120 * A.head, .35 * A.head, P.halo0, P.core0); }
  };
  const drawLevers = (ctx, t) => {
    const u = levU(t); if (u <= 0) return;
    const p = pullL(t), sink = expoIn(span(t, a.look - .6, a.look + .1)) * 500;
    ctx.save(); ctx.translate(0, sink);
    const knobs = LEV.map((x, i) => X.lever(ctx, t, x, LBASE, LLEN, p[i], span(t, a.itself - .3 + i * .1, a.itself + .4 + i * .1)));
    // the mechanism: a thin line from each knob to the arrow's tail (the arrow moves only when a lever moves)
    const A = arrowAt(t);
    knobs.forEach((k, i) => { if (k) { ctx.save(); ctx.strokeStyle = rgba(GOLD.line, .35 * span(t, a.itself, a.itself + .6)); ctx.lineWidth = 1.5; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(k[0], k[1]); ctx.lineTo(A.x0 + 20 + i * 40, A.y + 8); ctx.stroke(); ctx.restore(); } });
    // hands: an indigo hand on lever 1 and 2, your yellow hand on lever 3
    const hands = [[a.labs - .35, false], [a.gov - .3, false], [a.answer + .05, true]];
    hands.forEach(([th, you], i) => { const hu = expoOut(span(t, th, th + .4)), hOff = (i === 1 ? sineIO(span(t, a.fail + .1, a.fail + .6)) : 0); if (hu <= 0 || !knobs[i]) return; X.sideHand(ctx, knobs[i][0] + 40 + (1 - hu) * 300 + hOff * 120, knobs[i][1] - 4 - hOff * 60, 38, Math.PI, { you }); });
    const labs = [['LABS', 'SET THE PACE', a.labs], ['GOVERNMENTS', 'WRITE THE RULES — OR FAIL TO', a.gov], ['VOTERS', 'YOU', a.answer]];
    labs.forEach(([l1, l2, tw], i) => { X.serif(ctx, l1, LEV[i], LBASE + 96, 44, span(t, tw - .1, tw + .4), { col: i === 2 ? mixHex(CREAM, P.coat, .7) : CREAM }); X.caps(ctx, l2, LEV[i], LBASE + 132, span(t, tw + .3, tw + .8), { size: 22 }); });
    // governments answer to you: a link from lever 3 back to lever 2
    const lk = span(t, a.toYou - .3, a.toYou + .4);
    if (lk > 0) { const pts = []; for (let i = 0; i <= 24; i++) { const q = i / 24; pts.push([lerp(LEV[2], LEV[1], q), LBASE + 44 + Math.sin(Math.PI * q) * 40]); } F.goldSpan(ctx, pts, 0, smooth(lk), { w: 2.4, spark: lk < 1 }); }
    ctx.restore();
  };
  const futCard = (ctx, t) => {
    const u = span(t, a.future - .2, a.future + .6), out = span(t, a.look - .7, a.look - .1); if (u <= 0 || out >= 1) return;
    const ts = X.spokenTimes(T, W_(QFUT).map((w) => ({ w })), 'depends on the choices', 'we make', a.future);
    X.qcard(ctx, t, { x: 300, y: 64, w: 1320, size: 38, u, out, words: W_(QFUT).map((w, i) => ({ w, g: ts[i] != null ? span(t, ts[i] - .05, ts[i] + .3) : 0 })), head: 'POPE LEO XIV · 30 OCTOBER 2026', credit: 'Address to the Pontifical Academy for Life', rot: .003 });
  };
  const drawLeverScene = (ctx, t, o = {}) => {
    F.night(ctx, t, { glow: [W / 2, 520, 1000, .6] });
    drawLevers(ctx, t); if (!o.noArrow) drawArrow(ctx, t); futCard(ctx, t);
    X.caps(ctx, 'THE FUTURE OF THESE MACHINES', ARROW.x0 + adv(t), ARROW.y - 34, span(t, a.future + .2, a.future + .8) * (1 - span(t, a.look - .8, a.look - .4)), { size: 22, align: 'left', col: GOLD.text });
  };
  // ---------------------------------------------------------------- 9.06 ★ · THE SCALE (the anchor, ~5 s): the arrow becomes the beam, the scale unfolds, level
  const rev = (t) => sineIO(span(t, a.look - .05, a.look + 1.1));   // the scale unfolds downward from its beam (mask)
  const midGlow = (t) => [W / 2, 500, 1100, .72 + .2 * X.bump(t, a.look + .3, 1.6)];
  // ---------------------------------------------------------------- 9.07–9.12 · the two columns (an explainer of their own)
  // carrier: the beam turns upright into the divider, the two pans open into the two column heads
  const col0 = a.takeOff - .2, col1 = a.takeOff + .9, colU = (t) => sineIO(span(t, col0, col1));
  const LCOL = { x: 110, y: 118, w: 760, h: 760 }, RCOL = { x: 1050, y: 118, w: 760, h: 760 }, HDR = 92;
  const SLOTY = [326, 532, 738], TW = 236, TH = 154;
  const tileT = [[a.ill, 'ill', 'The illness'], [a.bills, 'bills', 'The bills'], [a.work, 'work', 'The work that wears you out']];
  const smallT = [[a.sit, 'chairs', 'Who you sit with'], [a.answerFor, 'hands', 'Who you answer for'], [a.tues, 'tuesday', 'A Tuesday morning']];
  const liftT = [a.workE - .05, a.workE + .25, a.workE + .55];   // the machine lifts them away, one by one, after the last one is named
  const panRect = (pc) => ({ x: pc[0] - SS * .36, y: pc[1] - 14, w: SS * .72, h: 34 });
  // ---------------------------------------------------------------- 9.13–9.14 · §128 (its own motif): the divider lies down as the ground, the three lights become people
  const q0 = a.sentence - .1, q1 = a.sentence + 1.4, qU = (t) => sineIO(span(t, q0, q1));
  const GY = 860, YOU = 960, OTH = [600, 1330, 1600];
  const qLines = (() => { const ws = W_(Q128).map((w) => ({ w })); return X.layout(ws, 64, 1560); })();
  const q128Times = X.spokenTimes(T, W_(Q128).map((w) => ({ w })), 'What saves humanity', 'that liberates', a.saves - .2);
  // ---------------------------------------------------------------- 9.15–9.17 · the core sentence, full frame, on the voice
  const k0 = a.plainly - .25, k1 = a.plainly + .85, kU = (t) => sineIO(span(t, k0, k1));
  const KL = 560, TILT = 760, tiltU = (t) => sineIO(span(t, a.whatDo - .85, a.whatDo + .65));
  const DOT = [W / 2, 712];   // the small amber light under the last line (the kitchen opens out of it)
  const lineGeo = (t) => {   // the gold line through 9.07–9.17: beam → divider → ground → baseline
    const c = colU(t), q = qU(t), k = kU(t);
    let cx = lerp(PIV[0], 960, c), cy = lerp(PIV[1], 498, c), L = lerp(SS, 372, c), ang = lerp(0, Math.PI / 2, c);
    cx = lerp(cx, 960, q); cy = lerp(cy, GY, q); L = lerp(L, 860, q); ang = lerp(ang, Math.PI, q);
    cy = lerp(cy, KL, k) - tiltU(t) * TILT; L = lerp(L, 640, k);
    return { cx, cy, L, ang, w: lerp(SS * .04 / 2.1, 3, Math.max(c, q)) };
  };
  const drawLine = (ctx, t) => { const g = lineGeo(t), dx = Math.cos(g.ang) * g.L, dy = Math.sin(g.ang) * g.L; F.goldSpan(ctx, [[g.cx - dx, g.cy - dy], [g.cx + dx, g.cy + dy]], 0, 1, { w: g.w, spark: false }); };
  const colBody = (ctx, t, C, side) => {   // a column: the head (from the pan), then the body grows down from it
    const c = colU(t), pr = panRect(side < 0 ? panL : panR), hd = X.lrect(pr, { x: C.x, y: C.y, w: C.w, h: HDR }, c);
    const lit = side < 0 ? 1 : span(t, a.right - .15, a.right + .4);
    const bu = sineIO(span(c, .45, 1));
    if (bu > 0) { ctx.save(); ctx.fillStyle = side < 0 ? rgba(COLD_.b, .28) : rgba(mixHex(X.AMBER.deep, P.ind1, .55), .22 + .18 * lit); ctx.strokeStyle = side < 0 ? rgba(COLD_.hi, .3) : rgba(X.AMBER.glow, .18 + .3 * lit); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(C.x, C.y, C.w, HDR + (C.h - HDR) * bu, 14); ctx.fill(); ctx.stroke(); ctx.restore(); }
    const fill = c < 1 ? mixHex(GOLD.body, side < 0 ? COLD_.b : mixHex(P.ind1, X.AMBER.deep, .35 + .45 * lit), span(c, .2, .9)) : (side < 0 ? COLD_.b : mixHex(P.ind1, X.AMBER.deep, .35 + .45 * lit));
    ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(hd.x, hd.y, hd.w, hd.h, lerp(16, 14, c)); ctx.fill();
    if (side > 0 && lit > 0) F.halo(ctx, C.x + C.w / 2, C.y + HDR / 2, 420, .35 * lit, X.AMBER.glow, X.AMBER.core);
    return hd;
  };
  const drawColumns = (ctx, t) => {
    const c = colU(t); if (c <= 0) return;
    const q = qU(t), sink = q * 1150;
    ctx.save(); ctx.translate(0, sink);
    const hl = colBody(ctx, t, LCOL, -1), hr = colBody(ctx, t, RCOL, 1);
    // the head labels travel with the pans up into the heads
    const lab = (s, h, u, from) => { if (u <= 0) return; const p = X.lpt(from, [h.x + h.w / 2, h.y + h.h / 2 + 10], c); X.caps(ctx, s, p[0], p[1], u, { size: 26, col: CREAM }); };
    lab('WHAT A MACHINE CAN TAKE OFF YOUR HANDS', hl, 1, [panL[0], panL[1] + SS * .2 + 34]);
    lab('WHAT CANNOT BE HANDED OVER', hr, span(t, a.right - .05, a.right + .5), [panR[0], panR[1] + SS * .2 + 34]);
    // the machine on the left head: a small gold trolley that runs to each slot and lifts the tile away
    const tx = LCOL.x + 50 + TW / 2 + 10;
    tileT.forEach(([tt, kind, name], i) => {
      const y = SLOTY[i], land = span(t, tt - .3, tt + .1), lu = sineIO(span(t, liftT[i], liftT[i] + .75));
      if (land <= 0) return;
      // what stays: the dashed outline of what was taken
      if (lu > .2) { ctx.save(); ctx.strokeStyle = rgba(COLD_.hi, .35 * span(lu, .2, .6)); ctx.setLineDash([9, 8]); ctx.lineDashOffset = -t * 10; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(tx - TW / 2, y - TH / 2, TW, TH, 8); ctx.stroke(); ctx.restore(); }
      const cab = span(t, liftT[i] - .45, liftT[i] + .05);
      const ty = lerp(y, LCOL.y + HDR / 2, lu), s = lerp(1, .25, lu);
      if (cab > 0 && lu < 1) F.goldSpan(ctx, [[tx, LCOL.y + HDR], [tx, ty - TH * s / 2]], 0, smooth(cab), { w: 1.8, spark: cab < 1 });
      if (lu < 1) { ctx.save(); ctx.translate(tx, ty); ctx.scale(s, s); ctx.translate(-tx, -ty); F.tile(ctx, t, kind, tx, lerp(y - 160, ty, expoOut(land)), TW, TH, { u: 1, lt: t - tt }); ctx.restore(); }
      X.serif(ctx, name, tx + TW / 2 + 32, y + 12, 32, span(t, tt - .1, tt + .45), { align: 'left', col: mixHex(CREAM, P.blue1, .5 * lu) });
    });
    // the right column: three small scenes land and stay
    const rx = RCOL.x + 50 + TW / 2 + 10;
    smallT.forEach(([tt, kind, name], i) => {
      const y = SLOTY[i], g = span(t, tt - .2, tt + .25), sh = q;   // in 9.13 they shrink into three lights
      if (g <= 0) return;
      const dst = [OTH[i], GY - 70 - sink], p = X.lpt([rx, y], dst, sineIO(span(sh, 0, .9))), s = lerp(1, .04, sineIO(sh));
      if (s > .05) { ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(s, s); ctx.translate(-p[0], -p[1]); X.smallTile(ctx, t, kind, p[0], p[1], TW, TH, { u: g }); ctx.restore(); }
      X.serif(ctx, name, rx + TW / 2 + 32, y + 12, 32, span(t, tt - .05, tt + .5) * (1 - q), { align: 'left', col: mixHex(CREAM, X.AMBER.glow, .35) });
    });
    ctx.restore();
  };
  // the three lights (from the right column) and the people of §128
  const lightAt = (i, t) => [OTH[i], GY - 70];
  const drawQuoteMotif = (ctx, t) => {
    const q = qU(t); if (q <= 0) return;
    const k = kU(t), out = k;
    // people: you rise out of the ground line first; the others rise out of the three lights on "relationship"
    const youU = span(t, a.saves - .35, a.saves + .5) * (1 - out), othU = (i) => span(t, a.saves + 4.25 + i * .15, a.saves + 5.0 + i * .15) * (1 - out);
    const ring = span(t, a.saves + 1.75, a.saves + 2.6) * (1 - span(t, a.saves + 4.1, a.saves + 4.7)) * (1 - out), lib = span(t, a.liberates - .4, a.liberates + .6) * (1 - out);
    // the lights hover on the ground until they become people
    for (let i = 0; i < 3; i++) { const lu = Math.min(span(q, .6, 1), 1 - othU(i) * .6) * (1 - out); if (lu > 0) { const p = lightAt(i, t); F.halo(ctx, p[0], p[1] + 4 * Math.sin(t * 1.7 + i), 70 + 10 * Math.sin(t * 2 + i), .7 * lu, X.AMBER.glow, X.AMBER.core); } }
    // warmth spreads along the ground on "liberates"
    if (lib > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.lin(ctx, 0, GY - 240, 0, GY + 4, [[0, rgba(X.AMBER.glow, 0)], [1, rgba(X.AMBER.glow, .16 * lib)]]); const half = 760 * expoOut(lib); ctx.fillRect(960 - half, GY - 240, half * 2, 244); ctx.restore(); }
    const fig = (x, u, you, dir) => { if (u <= 0) return; const e = expoOut(u); ctx.save(); ctx.beginPath(); ctx.rect(x - 160, GY - 400, 320, 400); ctx.clip(); ctx.translate(0, (1 - e) * 230);
      F.halo(ctx, x, GY - 100, you ? 150 : 120, (you ? .45 : .35) * e, X.AMBER.glow, X.AMBER.core);
      const reach = span(t, a.saves + 4.6, a.saves + 5.4) * (1 - out);
      if (you) F.du(ctx, x, GY, 210, { dir: 1, light: 1, look: .1 + .04 * Math.sin(t * .7), armR: [lerp(.2, 1.2, reach), lerp(.1, 1.3, reach)], armL: [lerp(-.2, -1.2, reach), lerp(-.1, -1.3, reach)] });
      else F.person(ctx, x, GY, 190, { dir, light: 1, look: .05, armR: [lerp(.2, 1.25, reach), lerp(.1, 1.35, reach)], rim: mixHex(X.AMBER.glow, P.blue0, .3) });
      ctx.restore(); };
    fig(YOU, youU, true, 1); OTH.forEach((x, i) => fig(x, othU(i), false, x < YOU ? 1 : -1));
    // self-sufficiency: a closed cold ring round you; on "but" it opens
    if (ring > 0) { const op = span(t, a.saves + 4.1, a.saves + 4.7); ctx.save(); ctx.strokeStyle = rgba(COLD_.hi, .55 * ring); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(YOU, GY - 110, 150 + 60 * op, -Math.PI / 2 + op * 1.2, -Math.PI / 2 + Math.PI * 2 * smooth(ring) - op * 1.2); ctx.stroke(); ctx.restore(); }
    // the bonds: arcs from hand to hand on "relationship"
    const bd = span(t, a.saves + 4.7, a.saves + 5.5) * (1 - out);
    if (bd > 0) { const xs = [OTH[0], YOU, OTH[1], OTH[2]]; for (let i = 0; i < 3; i++) { const x0 = xs[i] + 40, x1 = xs[i + 1] - 40, y = GY - 120, pts = []; for (let j = 0; j <= 16; j++) { const f = j / 16; pts.push([lerp(x0, x1, f), y - Math.sin(Math.PI * f) * 34]); } F.goldSpan(ctx, pts, 0, smooth(span(bd, i * .15, .7 + i * .15)), { w: 2.2, spark: false }); } }
    // the quote: composed, full width, it writes as the voice reaches it; then it rises away for 9.15
    const qu = span(t, a.sentence + .7, a.sentence + 1.7), ou = sineIO(span(t, k0 - .35, k0 + .35));
    const head = 'POPE LEO XIV · MAGNIFICA HUMANITAS', y0 = 268 - ou * 40;
    X.caps(ctx, head, 960, y0 - 70, qu * (1 - ou), { size: 24, col: X.AMBER.glow });
    F.maskLine(ctx, [['§128', 0]], 960, y0 - 112, 30, rise(qu) * (1 - ou), { serif: true, col: GOLD.text, glow: false, align: 'center' });
    let wi = 0;
    qLines.forEach((ln, li) => {
      const lw = ln.reduce((s, wd) => s + wd.mw, 0) + (ln.length - 1) * 64 * .26; let xx = 960 - lw / 2; const yy = y0 + li * 84;
      for (const wd of ln) { const tt = q128Times[wi], g = tt != null ? span(t, tt - .05, tt + .3) : 0, u = rise(span(qu, li * .15, .6 + li * .15)) * (1 - ou);
        if (u > 0) F.maskLine(ctx, [[wd.w, 0]], xx, yy, 64, u, { serif: true, col: mixHex(mixHex(CREAM, P.blue1, .35 * (1 - g)), GOLD.text, g * .9), glow: false });
        xx += wd.mw + 64 * .26; wi++; }
    });
    X.caps(ctx, 'IN THE LETTER: A RELATIONSHIP WITH GOD AND WITH OTHERS (§126, §128)', 960, y0 + qLines.length * 84 + 4, span(qu, .5, 1) * (1 - ou), { size: 22 });
  };
  const drawKinetic = (ctx, t) => {
    const k = kU(t); if (k <= 0) return;
    const tl = tiltU(t);
    // OUR WORDS, NOT A QUOTE (stays at the top while the type moves)
    const ow = span(t, a.plainly - .1, a.plainly + .4) * (1 - span(t, a.atStart - .7, a.atStart - .3));
    if (ow > 0) { ctx.save(); ctx.globalAlpha *= clamp(ow * 3); ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 2; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t * 14; ctx.beginPath(); ctx.roundRect(W / 2 - 240, 52, 480, 58, 8); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); X.caps(ctx, 'OUR WORDS, NOT A QUOTE', W / 2, 90, ow, { size: 26, col: CREAM }); }
    ctx.save(); ctx.translate(0, -tl * TILT);
    X.caps(ctx, 'ARTIFICIAL INTELLIGENCE CAN', 960, 220, span(t, a.aiCan - .1, a.aiCan + .5), { size: 36, col: CREAM });
    const su = span(t, a.save - .1, a.save + .45);
    if (su > 0) F.goldText(ctx, [['SAVE', 1]], 960, 440, 190, rise(su), { serif: true, glow: true, align: 'center' });
    // the three weights drop onto the line on their words (labels 34 px)
    [['BODY', a.body, 690], ['TIME', a.time, 960], ['MONEY', a.money, 1230]].forEach(([l, tt, x]) => F.weight(ctx, x, KL - 2, 190, l, span(t, tt - .15, tt + .4), { size: 34 }));
    const parts = [['YOUR BODY', a.body], [' · YOUR TIME', a.time], [' · YOUR MONEY', a.money]], tot = parts.reduce((s, [p]) => s + F.measure(p, 56, true), 0); let xx = 960 - tot / 2;
    for (const [p, tt] of parts) { const u = span(t, tt - .1, tt + .4); if (u > 0) F.maskLine(ctx, [[p, 0]], xx, 660, 56, rise(u), { serif: true, col: CREAM, glow: false }); xx += F.measure(p, 56, true); }
    // below, revealed by the tilt
    const wu = span(t, a.whatDo - .15, a.whatDo + .45);
    if (wu > 0) F.goldSpan(ctx, [[960 - 640, KL + TILT], [960 + 640, KL + TILT]], .5 - .5 * smooth(wu), .5 + .5 * smooth(wu), { w: 3, spark: false });
    if (wu > 0) F.maskLine(ctx, [['WHAT YOU DO WITH THEM', 0]], 960, 520 + TILT, 112, rise(wu), { serif: true, col: X.AMBER.glow, glow: true, align: 'center' });
    const ju = span(t, a.job - .15, a.job + .45), cu = span(t, a.cannot - .1, a.cannot + .35);
    if (ju > 0) F.maskLine(ctx, [['IS THE ONE JOB IT ', 0], ['CANNOT', cu], [' TAKE', 0]], 960, 610 + TILT, 46, rise(ju), { serif: false, weight: 700, col: CREAM, glow: false, align: 'center' });
    ctx.restore();
    const du = span(t, a.cannot + .3, a.cannot + 1.0);
    if (du > 0) F.halo(ctx, DOT[0], DOT[1] + 6 * Math.sin(t * 1.3), 40 + 8 * Math.sin(t * 2.1), .9 * du, X.AMBER.glow, X.AMBER.core);
  };
  const midZ = (t) => 1 + .015 * span(t, a.look, col1) + .02 * span(t, col1, q0) - .02 * span(t, q0, q1) + .015 * span(t, q1, k0) - .015 * span(t, k0, k1) + .015 * span(t, k1, a.atStart + .5);
  const drawMid = (ctx, t) => {   // 9.06–9.17 on one night: the scale (anchor) → two columns → §128 → the core sentence
    F.night(ctx, t, { glow: midGlow(t) });
    F.look(ctx, W / 2, H / 2, midZ(t), () => {
      const c = colU(t);
      // the scale (fades as its beam and pans become the divider and the heads)
      const sf = 1 - span(c, 0, .4), r = rev(t);
      if (sf > 0 && r > 0) { ctx.save(); ctx.globalAlpha *= sf; ctx.beginPath(); ctx.rect(-W, -H, W * 3, PIV[1] - 30 + H + r * 900); ctx.clip(); F.scale(ctx, t, PIV[0], PIV[1], SS, { u: 1, tilt: .006 * Math.sin(t * .9) }); ctx.restore(); }
      if (t < a.look + .4) drawArrow(ctx, t);
      if (c <= 0) {
        const lL = span(t, a.left - .1, a.left + .5); if (lL > 0) F.halo(ctx, panL[0], panL[1] - 30, 260, .55 * lL, P.halo0, P.core0);
        X.caps(ctx, 'WHAT A MACHINE CAN TAKE OFF YOUR HANDS', panL[0], panL[1] + SS * .2 + 34, span(t, a.left, a.left + .6), { size: 26, col: CREAM });
      }
      drawColumns(ctx, t);
      if (c > 0 && !(sf > 0 && t < col0)) drawLine(ctx, t);
      drawQuoteMotif(ctx, t);
      drawKinetic(ctx, t);
    });
  };
  // ---------------------------------------------------------------- 9.18–9.19 · the kitchen, your hands, what you keep
  const ki0 = a.atStart - .45, ki1 = a.atStart + .5;
  const KYOU = { x: 520, y: 868, h: 440 }, HANDS = [KYOU.x + KYOU.h * .36, KYOU.y - KYOU.h * .66];
  const SMALL = [[700, 560], [850, 515], [1000, 560]];
  const closeU = (t) => sineIO(span(t, a.keepW - .3, a.keepW + .6));
  const kitCam = (t) => X.camKeys(t, [[ki1, 960, 540, 1], [a.keep, 900, 540, 1.04], [a.channel - .4, 740, 470, 1.3]], .5);
  const glowPt = (t) => { const c = closeU(t); return [HANDS[0] - 30 * c, HANDS[1] + 10 - 20 * c]; };
  const drawKitchen = (ctx, t) => {
    const [cx, cy, z] = kitCam(t);
    F.look(ctx, cx, cy, z, () => {
      const c = closeU(t);
      F.kitchen(ctx, t, { lamp: 1, you: (cc) => {
        const br = 1 + .006 * Math.sin(t * 2.1); cc.save(); cc.translate(KYOU.x, KYOU.y); cc.scale(1, br); cc.translate(-KYOU.x, -KYOU.y);
        F.du(cc, KYOU.x, KYOU.y, KYOU.h, { dir: 1, look: lerp(.25, -.05, c) + .05 * Math.sin(t * .6), light: 1, back: .25, armR: [lerp(1.32, 1.05, c) + .03 * Math.sin(t * 1.1), lerp(1.55, 2.25, c)], armL: [lerp(1.18, 1.0, c), lerp(1.45, 2.2, c) + .03 * Math.sin(t * 1.3)] });
        cc.restore();
      } });
      // the three things you once named (dashed outlines) float out through the window
      for (let i = 0; i < 3; i++) {
        const gu = span(t, ki1 - .3 + i * .12, ki1 + .3 + i * .12), lv = sineIO(span(t, a.keep - .3 + i * .15, a.keep + 1.3 + i * .15)); if (gu <= 0 || lv >= 1) continue;
        const wn = F.KITCHEN.win, x = lerp(SMALL[i][0], wn.x + wn.w * (.3 + .2 * i), lv) + lv * lv * 600, y = lerp(SMALL[i][1], wn.y + wn.h * .4, lv) - Math.sin(Math.PI * lv) * 60;
        F.tile(ctx, t, ['ill', 'bills', 'work'][i], x, y, 210 * (1 - .5 * lv), 136 * (1 - .5 * lv), { u: gu, from: HANDS, outline: true });
      }
      // the light in your hands: open, then held
      const hl = span(t, ki1 - .2, ki1 + .4), g = glowPt(t);
      if (hl > 0) F.halo(ctx, g[0], g[1], 70 + 10 * Math.sin(t * 2) + 30 * closeU(t), (.6 + .35 * closeU(t)) * hl, X.AMBER.glow, X.AMBER.core);
    });
    X.caps(ctx, 'WHAT YOU WOULD KEEP', 1660, 830, span(t, a.keepW, a.keepW + .6) * (1 - span(t, a.channel - .6, a.channel - .2)), { size: 26, col: CREAM });
  };
  // ---------------------------------------------------------------- A.01–A.03 · the wall round the scale, your stone, SUBSCRIBE
  const wa0 = a.channel - .45, wa1 = a.channel + .6;
  const WB = 880, WH = 420, WX0 = 60, WX1 = 1860;
  const SP = [960, WB - 1.05 * 300], S2 = 300;   // the scale in front of the wall (standing on the ground)
  const STONE = { x: 1470, y: WB - WH + 4, w: 150, h: WH / 6 - 4 };
  const wallCam = (t) => X.camKeys(t, [[wa1 - .3, SP[0], SP[1] + 30, 1.35], [a.everybody + .5, 960, 560, 1.0], [a.want - .3, 1100, 520, 1.05], [a.sub + .6, 1300, 470, 1.25], [a.endT - 1.6, 1260, 480, 1.22]], .6);
  const endK = (t) => sineIO(span(t, a.endT - 1.6, a.endT + .9));   // into the end screen
  const drawWallScene = (ctx, t) => {
    const ek = endK(t);
    F.night(ctx, t, { glow: [W / 2, lerp(520, 330, ek), 1100, .7] });
    let [cx, cy, z] = wallCam(t);
    // end screen: camera eases to the identity; the wall sinks, the scale rises and settles high
    cx = lerp(cx, W / 2, ek); cy = lerp(cy, H / 2, ek); z = lerp(z, 1, ek);
    F.look(ctx, cx, cy, z, () => {
      ctx.save(); ctx.translate(0, ek * 680);
      F.land(ctx, WB);
      const wu = span(t, a.channel + .2, a.everybody + 1.4);
      F.wall(ctx, t, WX0, WX1, WB, WH, { u: wu });
      // the wall sits back in the night: a cool veil keeps the scale the brightest thing
      ctx.save(); ctx.fillStyle = F.lin(ctx, 0, WB - WH, 0, WB, [[0, rgba(P.night0, .38)], [1, rgba(P.night0, .55)]]); ctx.fillRect(WX0 - 10, WB - WH - 10, WX1 - WX0 + 20, WH + 12); ctx.restore();
      // many hands: builders on the wall's top line placing stones
      const top = WB - WH * wu, bu = span(t, a.channel + .3, a.channel + 1.2) * (1 - ek);
      if (bu > 0) for (let k = 0; k < 7; k++) { const x = 180 + k * 250 + (k === 5 ? 60 : 0), ph = k * 1.3; if (Math.abs(x - SP[0]) < 160) continue; ctx.save(); ctx.beginPath(); ctx.rect(x - 80, top - 200, 160, 200); ctx.clip(); F.person(ctx, x, top + (1 - expoOut(bu)) * 160, 120, { dir: k % 2 ? -1 : 1, armR: [1.6 + .5 * Math.sin(t * 1.4 + ph), 2.0 + .3 * Math.sin(t * 1.4 + ph)], armL: [1.2, 1.6], lean: .2, light: 1, rim: mixHex(P.halo2, P.blue0, .4) }); ctx.restore(); }
      // your stone: your sleeve brings it in from the right, lays it in the gap; it lights; SUBSCRIBE
      const su = span(t, a.want - .15, a.want + .75), lit = span(t, a.subW - .1, a.subW + .4);
      if (su > 0) {
        const e = expoOut(su), sx = lerp(STONE.x + 420, STONE.x, e), sy = lerp(STONE.y + 260, STONE.y, e) - Math.sin(Math.PI * e) * 60;
        ctx.save(); ctx.fillStyle = mixHex(mixHex(P.shade0, P.blue1, .4), GOLD.body, lit); ctx.beginPath(); ctx.roundRect(sx + 2, sy + 2, STONE.w - 4, STONE.h - 4, 4); ctx.fill(); ctx.restore();
        if (lit > 0) { F.halo(ctx, sx + STONE.w / 2, sy + STONE.h / 2, 160, .7 * lit, P.halo0, P.core0); F.maskLine(ctx, [['SUBSCRIBE', 0]], sx + STONE.w / 2, sy + STONE.h * .68, 22, rise(span(lit, .3, 1)) * (1 - ek), { serif: false, weight: 800, col: '#3b2410', glow: false, align: 'center' }); }
        const arm = expoOut(span(t, a.want - .35, a.want + .5)) * (1 - expoIn(span(t, a.want + .9, a.sub + .6)));
        if (arm > 0) X.sideHand(ctx, sx + STONE.w + 70 + (1 - arm) * 500, sy + STONE.h * .5 + (1 - arm) * 300, 42, Math.PI + .15, { you: true });
      }
      ctx.restore();
      // the scale in front of the wall; at the end screen it rises and rests high, level, both pans full
      const sp = [SP[0], lerp(SP[1], 300, ek)], s = lerp(S2, 250, ek);
      const lw = [['BODY'], ['TIME'], ['MONEY']];
      F.scale(ctx, t, sp[0], sp[1], s, { u: 1, tilt: 0,
        left: (c, px, py, ss) => { const ws = ss * .2; lw.forEach(([l], i) => F.weight(c, px + (i - 1) * ws * 1.12, py - 2, ws, '', 1, { size: 22 })); },
        right: (c, px, py, ss) => { ['chairs', 'hands', 'tuesday'].forEach((k, i) => X.smallTile(c, t, k, px + (i - 1) * ss * .24, py - ss * .08, ss * .22, ss * .15, { u: 1 })); } });
      if (ek <= 0) {
        // (the pillar's foot stands on the ground: draw a soft pool of light)
        F.halo(ctx, sp[0], WB, 300, .25, P.halo0, P.core0);
      }
    });
  };
  const glowScreen = (t) => { const [cx, cy, z] = kitCam(t), g = glowPt(t); return F.lookPt(cx, cy, z, g[0], g[1]); };

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t < fl0) { prev(ctx, t); return; }
    if (t < sh1) {   // the door of light lies down and stretches into the gold arrow; the workshop falls away behind it
      const e = sineIO(span(t, fl0, sh1)), wf = sineIO(span(t, fl0, fl0 + 1.7));
      drawLeverScene(ctx, t, { noArrow: true });
      if (wf < 1) { ctx.save(); ctx.globalAlpha *= 1 - wf; ctx.translate(W / 2, H / 2 + wf * 220); ctx.scale(1 - .06 * wf, 1 - .06 * wf); ctx.translate(-W / 2, -H / 2); prev(ctx, t); ctx.restore(); }
      const d0 = doorScreen(t), c = X.lpt(X.rc(d0), X.rc(arrowR), e), Lr = lerp(d0.h, arrowR.w, e), Sr = lerp(d0.w, arrowR.h, Math.pow(e, .55)), ang = lerp(Math.PI / 2, 0, sineIO(span(e, 0, .8)));
      F.halo(ctx, c[0], c[1], lerp(380, 160, e), lerp(.45, .3, e) * sineIO(span(t, fl0, fl0 + .5)), X.AMBER.glow, X.AMBER.core);
      const aw = span(t, sh1 - .35, sh1);
      if (aw > 0) { ctx.save(); ctx.globalAlpha *= aw; drawArrow(ctx, t); ctx.restore(); }
      ctx.save(); ctx.globalAlpha *= (1 - aw) * sineIO(span(t, fl0, fl0 + .6)); ctx.translate(c[0], c[1]); ctx.rotate(ang);   // the two who left are absorbed by the light   // the door's long side lies down (vertical → horizontal) and thins into the shaft
      ctx.fillStyle = F.lin(ctx, -Lr / 2, 0, Lr / 2, 0, [[0, mixHex(mixHex(X.AMBER.core, X.AMBER.glow, .3), GOLD.hot, e)], [1, mixHex(mixHex(X.AMBER.glow, X.AMBER.body, .5), GOLD.body, e)]]);
      ctx.beginPath(); ctx.roundRect(-Lr / 2, -Sr / 2, Lr, Sr, lerp(0, 4, e)); ctx.fill(); ctx.restore();
      return;
    }
    if (t < a.look - .1) { drawLeverScene(ctx, t); return; }
    if (t < a.look + .35) { drawLeverScene(ctx, t); drawMid(ctx, t); return; }   // the levers sink under the unfolding scale
    if (t < ki0) { drawMid(ctx, t); return; }
    if (t < ki1) {   // iris out of the small amber light under the last line: the kitchen opens round its lamp
      drawMid(ctx, t); const z = midZ(t), d = F.lookPt(W / 2, H / 2, z, DOT[0], DOT[1]), e = quartIO(span(t, ki0, ki1)), c = X.lpt(d, F.KITCHEN.lamp, e);
      X.irisDot(ctx, c[0], c[1], lerp(30, 2300, e), (cc) => drawKitchen(cc, t), { rim: rgba(X.AMBER.glow, .75 * (1 - e)) });
      return;
    }
    if (t < wa0) { drawKitchen(ctx, t); return; }
    if (t < wa1) {   // through the light in your hands: the wall and the scale
      // the light held in your hands opens: an amber iris out of the glow, the wall and the scale inside it
      const e = quartIO(span(t, wa0, wa1)), g = glowScreen(t);
      drawKitchen(ctx, t);
      X.irisDot(ctx, g[0], g[1], lerp(8, 2300, e), (c) => { drawWallScene(c, t); F.halo(c, g[0], g[1], lerp(90, 1100, e), 1.1 * (1 - e), X.AMBER.glow, X.AMBER.core); }, { rim: rgba(X.AMBER.core, .8 * (1 - e)), rimW: 4 });
      return;
    }
    drawWallScene(ctx, t);
  };
}
