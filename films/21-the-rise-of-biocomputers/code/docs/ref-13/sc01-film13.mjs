// c01 · Hook I (s00 + s01) · 0–33.44 · Editorial-Nacht · built so far: 1.01–1.06 (the 20-s style test, 0–21.9). 1.07–1.11 hold the
// last frame of 1.06 alive until they are built (after Jakob's OK on the style test).
// Plan: docs/shots.md (source tools/shots13.py). Kit: lib/f10_editorial.mjs (2.5D cards, light hand, du) + lib/f13_kit.mjs (hourglass,
// quote lines, text → sand).
//
// | ID    | time        | anchor                    | picture (one idea)                                                    | 1–2 moves                  | camera                       | → carrier · position · direction                    |
// |-------|-------------|---------------------------|-----------------------------------------------------------------------|----------------------------|------------------------------|-----------------------------------------------------|
// | 1.01★ | 0–4.80      | Superintelligence · free  | the hand of light offers the hourglass from the upper right; you on   | hand lowers · push         | slow push                    | plan sequence                                       |
// |       |             |                           | the ledge look up. On "free" the sand starts to run (accent).         |                            |                              |                                                     |
// | 1.02  | 4.80–6.96   | given @5.92               | the hand sets the hourglass down on the ledge in front of you;        | hand sets down + opens     | hold, drift                  | the thread of light rises from the hourglass · up   |
// |       |             |                           | contact on "given", a breath of light dust, your coat rim answers     |                            |                              |                                                     |
// | 1.03  | 6.96–12.68  | Gates · purpose           | EXPL quote card in the night sky: the thread becomes the vertical rule | the thread · tilt up       | tilt up 3 s (follows thread) | plan sequence                                       |
// |       |             |                           | of the quote; source, then the lines rise from their baselines        | then the lines             |                              |                                                     |
// | 1.04  | 12.68–17.80 | three-day @15.32          | the quote stands (read); "three days a week" turns gold               | the three words            | hold, drift                  | the gold words → sand · down                        |
// | 1.05  | 17.80–19.40 | More @17.80               | the other lines sink, the rule retracts, the gold words crumble into  | sand falls · tilt down     | tilt down (follows sand)     | plan sequence                                       |
// |       |             |                           | sand and fall into the hourglass, which fills (more of your life)     |                            |                              |                                                     |
// | 1.06  | 19.40–21.90 | deal @19.84               | pull back: you, the full hourglass, the open hand above (the offer)   | pull back · hand offers    | pull back 2.6 s              | (next: push into the lower bulb, not built yet)     |
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cam3, camAt, camDrift, F0 } = E;
const rise = (x) => 1 - (1 - clamp(x)) ** 3;                                     // calm rise for text lines (cubic out)

export const PRINT = K.PRINT13;

export default async (T, R) => {
  E.prepareEditorial();
  const A = (w, n) => T.S('s00', w, n), AE = (w, n) => T.E('s00', w, n);
  const a = {
    sup: A('Superintelligence'), free: A('free'), your: A('Your hours'), given: A('given'), back: AE('given back'), gates: A('Bill Gates'),
    purpose: A('The purpose'), ifM: A('If the machines'), three: A('three-day'), probably: A('Probably'), more: A('More of your'),
    life: A('life back'), deal: A("That's the deal"), dealW: A('deal'), end: T.E('s00'), but: T.S('s01', 'But'),
  };
  return [{ t: 0, draw: hook(a), print: PRINT }];
};

// ===================================================================================================== 1.01–1.06 · the promise
const LEDGE = [-600, 912, 2600, 870];                  // x0, y0, x1, y1 (design coords on the focus card)
const ly = (x) => K.ledgeY(...LEDGE, x);
const DU = { x: 640, h: 178 };
const HG = { x: 1020, h: 330 };                       // the hourglass on the ledge (final)
const TILT = -330, QDY = TILT + 250;                  // how far the camera tilts up for the quote; the quote block follows
const QX = 360, QS = 62, QL = 84, QY0 = -40 + QDY;         // the quote block: left edge, type size, line pitch, first baseline
const RULE_X = 300;
const LINES = [
  [["\u201cThe purpose of life is not just to do jobs.", 0]],
  [["So if you eventually get a society where you only", 0]],
  null,                                                // line 3 carries the gold words (set per frame)
  [["that’s probably okay.”", 0]],
];
const L3 = ['have to work ', 'three days a week', ' or something,'];
const ATTR = '— Bill Gates, “What Now?” with Trevor Noah, 2023';

function hook(a) {
  // the hand of light: from the upper right, pointing down toward you (as in the Film 11 thumbnail); the hourglass hangs just under
  // its fingertips at the start and glides down to the ledge in front of you ("given back"). The hand stays the giver, up right.
  const ANG = 2.42, HL = 300, HO = { pose: 'open', spread: .2, curl: .12 };
  const hmAt = (wx, wy, ang = ANG, sc = 1) => E.handMatrix(wx, wy, ang, HL * sc, -1);
  const W0 = [1790, 70], W1 = [1735, 150], WQ = [1930, -60], WD = [1700, 128];
  const tip0 = E.applyM(hmAt(...W0), ...E.handTip(HO, 1));
  const baseFinal = [HG.x, ly(HG.x) - 1];
  const base0 = [tip0[0] - 30, tip0[1] + 34 + HG.h];
  const ctrl = [lerp(base0[0], baseFinal[0], .25) - 60, lerp(base0[1], baseFinal[1], .62) - 40];   // the glide is an arc, not a slide
  // the thread: from the hourglass top up and over to the quote rule, then up the rule
  const top = [baseFinal[0], baseFinal[1] - HG.h];
  const thread = E.catmull([[top[0], top[1], 3], [top[0] - 8, top[1] - 90, 3], [940, 410 + QDY * .5, 3], [700, 372 + QDY, 3], [440, 360 + QDY, 3], [RULE_X + 6, 344 + QDY, 3], [RULE_X, 300 + QDY, 3], [RULE_X, 100 + QDY, 3], [RULE_X, -112 + QDY, 3]], 10);
  const segLen = thread.slice(1).map((p, i) => Math.hypot(p[0] - thread[i][0], p[1] - thread[i][1])), total = segLen.reduce((s, v) => s + v, 0);
  const iRule = thread.findIndex((p, i) => i > 4 && Math.abs(p[0] - RULE_X) < 1.5);
  const uRule = segLen.slice(0, iRule).reduce((s, v) => s + v, 0) / total;
  const t3 = { x: QX + K.measure(L3[0], QS), y: QY0 + 2 * QL };
  const grains = K.textGrains(L3[1], QS, true, 2);
  const gW = K.measure(L3[1], QS);
  // timing (all from words)
  const tThreadA = a.back - .25, tThreadB = a.gates + 1.6, tTail = tThreadB + .05;
  const tAttr = tThreadB, tL = [a.purpose - .35, a.purpose + 2.05, a.ifM + .25, a.ifM + 1.45];
  const tSink = a.more - .05, tFall = a.more + .1, fallDur = 1.75;
  const KEYS = [
    [0, cam3({ z: -70, x: 50, y: 24 })],
    [a.your, cam3({ z: 110, x: 16, y: 8 })],
    [tThreadA, cam3({ z: 140, x: 10, y: 4 })],
    [tThreadA + 3.0, cam3({ z: 110, x: 0, y: TILT - 6 })],
    [tFall, cam3({ z: 120, x: 0, y: TILT })],
    [tFall + 2.9, cam3({ z: -300, x: 70, y: 36 })],
    [a.but + 1, cam3({ z: -330, x: 74, y: 30 })],
  ];
  const quadAt = (p0, p1, p2, u) => [lerp(lerp(p0[0], p1[0], u), lerp(p1[0], p2[0], u), u), lerp(lerp(p0[1], p1[1], u), lerp(p1[1], p2[1], u), u)];
  return (ctx, t) => {
    const c = camDrift(camAt(t, KEYS), t, .8);
    // --- state from the words ---
    const glide = sineIO(span(t, .25, a.given));                                     // the hourglass glides down to the ledge
    const hb = quadAt(base0, ctrl, baseFinal, glide);
    const contact = t >= a.given ? expoOut(span(t, a.given, a.given + .5)) : 0;
    const give = sineIO(span(t, 0, a.given)), away = sineIO(span(t, a.given + .3, tThreadA + 3.0)), offer = sineIO(span(t, a.deal - .4, a.dealW + 1.0));
    const dim = 1 - .5 * away * (1 - offer);
    const wx = lerp(lerp(lerp(W0[0], W1[0], give), WQ[0], away), WD[0], offer), wy = lerp(lerp(lerp(W0[1], W1[1], give), WQ[1], away), WD[1], offer);
    const flow = expoOut(span(t, a.free - .02, a.free + .45));
    const fill = smooth(span(t, tFall + .55, tFall + fallDur + .2));
    const topLv = .86 - .09 * span(t, a.free, a.but) + .12 * fill, botLv = .1 + .1 * span(t, a.free, a.but);
    const look = lerp(.2, .95, sineIO(span(t, a.sup, a.sup + 1.3))) * (1 - .5 * sineIO(span(t, a.given - .3, a.given + .7))) + .4 * offer;
    const rim = smooth(span(t, a.given + .08, a.given + .6)) * (1 - .6 * smooth(span(t, a.given + .9, a.given + 2.2)));

    // --- sky (far) ---
    card(ctx, c, 40000, () => {
      E.nightSky(ctx, [[0, P.night0], [.5, P.night1], [1, P.ind0]], -900, H);
      ctx.fillStyle = E.rad(ctx, 1420, 300, 1400, [[0, rgba(P.ind1, .95)], [.45, rgba(P.ind1, .5)], [.8, rgba(P.ind0, .2)], [1, rgba(P.ind0, 0)]]);   // deep indigo lift behind the hand (Film-11 thumbnails) ctx.fillRect(-W, -2 * H, 3 * W, 4 * H);
      E.stars(ctx, 13, 190, t, [-300, -700, W + 600, H + 500], .85);
    });
    // --- soft editorial sweeps (depth) ---
    card(ctx, c, 6000, () => {
      ctx.beginPath(); ctx.moveTo(-600, 360); ctx.bezierCurveTo(200, 330, 560, 640, 640, 1500); ctx.lineTo(-600, 1500); ctx.closePath();
      ctx.fillStyle = E.lin(ctx, 480, 600, 40, 1000, [[0, rgba(P.ind1, 0)], [.35, rgba(P.ind1, .62)], [1, rgba(P.ind0, 1)]]); ctx.fill();
    });
    // --- the focus plane: ledge, you, the hourglass, the hand, the quote ---
    card(ctx, c, F0, () => {
      // the hand (behind everything on this plane: it is the far giver)
      const br = 1 + .015 * Math.sin(t * 1.2), hm = hmAt(wx, wy, ANG + .05 * away - .04 * offer, br);
      E.lightHand(ctx, hm, t, { ...HO, spread: .2 + .3 * offer, curl: .12 * (1 - offer), lum: .76 * dim, dust: 6000 });
      K.ledge(ctx, ...LEDGE);
      // light pool on the ledge round the hourglass (grows as it lands)
      const pool = smooth(span(glide, .55, 1)) * (.6 + .4 * contact);
      if (pool > 0) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(baseFinal[0], baseFinal[1] + 6); ctx.scale(1, .14);
        ctx.fillStyle = E.rad(ctx, 0, 0, 380, [[0, rgba(P.halo1, .4 * pool)], [.5, rgba(P.halo1, .12 * pool)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 380, 0, 6.29); ctx.fill(); ctx.restore();
      }
      E.castShadow(ctx, DU.x, ly(DU.x) + 2, 26, 160 + 120 * pool, Math.PI - .3, .5);
      if (contact > 0) E.castShadow(ctx, baseFinal[0] - 60, baseFinal[1] + 2, 50, 150 * contact, Math.PI - .22, .28);
      // you
      E.du(ctx, DU.x, ly(DU.x) + 1, DU.h, { dir: 1, look: clamp(look), light: 1, armR: [.22 + .5 * offer, .12 + .45 * offer], armL: [-.2, -.1], rim: mixHex(mixHex(P.coat, P.core1, .75), P.core0, rim) });
      // the hourglass
      const g = K.hourglass(ctx, hb[0], hb[1], HG.h, t, { top: topLv, bot: botLv, flow, light: 1, glow: 1 + .15 * flow });
      if (contact > 0 && contact < 1) { E.halo(ctx, hb[0], hb[1] - 4, 200 * contact, .55 * (1 - contact), P.halo1, P.core1); E.dust(ctx, 91, 260, hb[0], hb[1] - 10, 130 * contact + 20, 14, t, .9 * (1 - contact)); }
      // the thread: rises from the hourglass top (head grows), then the tail retracts into the rule
      const uHead = smooth(span(t, tThreadA, tThreadB)), uTail = uRule * smooth(span(t, tTail, tTail + 1.1));
      const ruleOut = expoIn(span(t, tSink + .1, tSink + .75));                      // 1.05: the rule sinks back down
      if (uHead > 0 && ruleOut < 1) {
        if (ruleOut <= 0) K.trailSpan(ctx, thread, uTail, uHead, { w: 2.4 });
        else K.trailSpan(ctx, thread, uRule, uRule + (1 - uRule) * (1 - ruleOut), { w: 2.4, spark: false });
      }
      // the quote: source first, then the lines, each risen from its baseline; out (1.05): sink below the baseline, staggered
      const sink = (i) => 1 - expoIn(span(t, tSink + i * .08, tSink + .55 + i * .08));
      const gold = smooth(span(t, a.three - .05, a.three + .55));
      if (t > tAttr - .1 && t < tFall + 1.2) {
        for (let i = 0; i < 4; i++) {
          const u = rise(span(t, tL[i], tL[i] + 1.0)) * sink(i);
          if (u <= 0) continue;
          if (i === 2) {
            if (t < tFall) K.maskLine(ctx, [[L3[0], 0], [L3[1], gold], [L3[2], 0]], QX, QY0 + i * QL, QS, u);
            else { K.maskLine(ctx, [[L3[0], 0]], QX, QY0 + i * QL, QS, u); K.maskLine(ctx, [[L3[2], 0]], t3.x + gW, QY0 + i * QL, QS, u); }
          } else K.maskLine(ctx, LINES[i], QX, QY0 + i * QL, QS, u);
        }
        const ua = rise(span(t, tAttr, tAttr + 1.0)) * sink(4);
        if (ua > 0) K.maskLine(ctx, [[ATTR, 0]], QX + 2, QY0 + 3 * QL + 74, 30, ua, { serif: false, col: P.halo2, glow: false });
      }
      // 1.05: the gold words crumble into sand and fall into the hourglass
      if (t >= tFall && t < tFall + fallDur + .3) K.sandGrains(ctx, grains, t3.x, t3.y, span(t, tFall, tFall + fallDur), { yLand: g.top[1] + 8, xLand: g.top[0], funnel: .92, width: gW, stagger: .3 });
      if (fill > 0 && fill < 1) E.halo(ctx, g.top[0], g.top[1] + 30, 120, .35 * Math.sin(fill * Math.PI), P.halo1, P.core1);
    });
  };
}
