// c05 · Rung 3: people (your lamp back on) · <1 % → 26 % ★ · led = goal / work / check · shared · the movies · on which rung? how fast?
// built by B1. The B1 group engine (one camera, one world, the veil, the HUD moments, the lamp) lives in scenes/sc02.mjs.
//
// | ID    | anchor (phrase)                 | picture (one idea)                                                                    | carrier → next     |
// |-------|---------------------------------|---------------------------------------------------------------------------------------|--------------------|
// | 5.01  | Until this year                 | your lamp comes back ON on "people" (flicker first); rung 3 glows cream (engine)       | the core → ring    |
// | 5.02★ | In February                     | the camera rises to the core; the share ring grows out of it: FEB <1 % … "About a      | three steps        |
// |       |                                 | quarter": 26 % · source: RESEARCH "LED BY" THE MODEL …                                  |                    |
// | 5.03  | works the way you use           | three steps: YOU SET A ROUGH GOAL → IT DOES MOST OF THE WORK → YOU CHECK THE RESULT    | the quote          |
// | 5.04  | But nowhere                     | paper card: "…not operating fully autonomously for any measured subset of AI R&D work." | the ? lamp         |
// | 5.05  | And knowing which question      | a cream ? lights: RESEARCH TASTE · HUMAN, FOR NOW                                      | the ? → rung 3     |
// | 5.06  | So, rung three                  | the ? flies into the big HUD's rung 3: SHARED; its gold edge creeps on "growing fast"  | a poster           |
// | 5.07  | The movies promised             | a cinema poster ONE NIGHT, IN SECRET; it folds away, the veil lifts: the ladder, the  | a headline         |
// |       |                                 | rungs pulse one at a time (engine)                                                     |                    |
// | 5.08  | So the next time a headline     | a headline card A.I. IS BUILDING A.I.; a ? hops up the HUD: ON WHICH RUNG?             | the climbing mach. |
// | 5.09  | And then a second one           | pull back: the climbing machine on the ladder: HOW FAST? (engine)                       | the wide foundry   |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f31_kit.mjs';
import { group, slideY, hudM, hudRung, HUDBIG, mapPt, HUDFOOT } from './sc02.mjs';
import { sinkClip } from './sc03.mjs';
const { W, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { rise, FORGE, PAPER } = F;
const TAU = Math.PI * 2;
export default (T, R) => group(T, R);

const RING = { x: 960, y: 440, r: 200 };
const STEPS = [
  { x: 190, l1: 'YOU SET', l2: 'A ROUGH GOAL', human: true, at: 'rough' },
  { x: 760, l1: 'IT DOES MOST', l2: 'OF THE WORK', human: false, at: 'most2' },
  { x: 1330, l1: 'YOU CHECK', l2: 'THE RESULT', human: true, at: 'check' },
];
const SW = 400, SH = 230, SY = 380;
const POSTER = { x: 760, y: 110, w: 400, h: 640 };

function personGlyph(ctx, x, y, s, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y - s * .55, s * .42, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y + s * .5, s * .72, s * .5, 0, Math.PI, 0); ctx.fill(); }

export function layer(ctx, t, a, T, X) {
  if (t < a.feb || t > a.second2 + 3) return;
  // ------------------------------------------------ 5.02: the share ring grows out of the core
  const ru = span(t, a.feb + .9, a.feb + 1.5), ro = span(t, a.led - .5, a.led + 1.0);
  if (ru > 0 && ro < 1) {
    const mv = sineIO(span(t, a.feb + .9, a.feb + 3.0)), m = X.mach ?? [RING.x, RING.y, RING.r * 2];
    const x = lerp(m[0], RING.x, mv), y = lerp(m[1], RING.y, mv), r = lerp(m[2] * .5, RING.r, mv);
    ctx.save(); F.float(ctx, t, .6 * mv); sinkClip(ctx); ctx.translate(0, slideY(1, ro, 0, 900));
    F.shareRing(ctx, t, x, y, r, { u: ru, v0: .005, v: .26, p: span(t, a.quarter - .3, a.quarter + 1.3), label: 'RESEARCH LED BY THE MODEL', sub: "ANTHROPIC'S OWN ESTIMATE", note0: 'FEB: <1 %' });
    ctx.restore();
    F.source(ctx, t, a.less, a.led + .4, F.SOURCES.led);
  }
  // ------------------------------------------------ 5.03: led = goal / work / check
  const su = span(t, a.led + .1, a.led + 1.0), so = span(t, a.nowhere - .6, a.nowhere + .9);
  if (su > 0 && so < 1) {
    ctx.save(); F.float(ctx, t, .8); sinkClip(ctx); ctx.translate(0, slideY(su, so, 40, 900));
    F.goldText(ctx, [['“LED” =', .7]], 960, 250, 64, rise(su), { serif: true, align: 'center' });
    STEPS.forEach((s, i) => {
      const u = rise(span(t, a[s.at] - .15, a[s.at] + .7)); if (u <= 0) return;
      const yy = SY + (1 - expoOut(u)) * 40, col = s.human ? P.cream : FORGE.body;
      ctx.save(); ctx.globalAlpha *= clamp(u * 3);
      ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.beginPath(); ctx.roundRect(s.x, yy, SW, SH, 14); ctx.fill();
      ctx.strokeStyle = rgba(col, .85); ctx.lineWidth = 2.5; ctx.stroke();
      if (!s.human) halo(ctx, s.x + SW / 2, yy + SH / 2, SW * .7, .12, FORGE.halo, FORGE.hot);
      if (s.human) personGlyph(ctx, s.x + SW / 2, yy + 64, 30, P.cream);
      else { halo(ctx, s.x + SW / 2, yy + 64, 50, .6, FORGE.halo, FORGE.hot); ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.beginPath(); ctx.arc(s.x + SW / 2, yy + 64, 24, 0, TAU); ctx.fill(); ctx.fillStyle = FORGE.core; ctx.beginPath(); ctx.arc(s.x + SW / 2, yy + 64, 9, 0, TAU); ctx.fill(); }
      E.glowText(ctx, s.l1, s.x + SW / 2, yy + 150, { size: 28, weight: 600, spacing: .08, col, glow: false, align: 'center' });
      E.glowText(ctx, s.l2, s.x + SW / 2, yy + 190, { size: 28, weight: 600, spacing: .08, col, glow: false, align: 'center' });
      ctx.restore();
      if (i > 0) { const au = span(u, .1, .8), x0 = STEPS[i - 1].x + SW + 14, x1 = s.x - 14, ay = SY + SH / 2;
        F.goldSpan(ctx, [[x0, ay], [lerp(x0, x1, au), ay]], 0, 1, { w: 1.6, spark: false });
        if (au > .9) { ctx.fillStyle = FORGE.line; ctx.beginPath(); ctx.moveTo(x1 + 2, ay); ctx.lineTo(x1 - 12, ay - 8); ctx.lineTo(x1 - 12, ay + 8); ctx.closePath(); ctx.fill(); } }
    });
    ctx.restore();
  }
  // ------------------------------------------------ 5.04: the lab's own fine print
  const qu = span(t, a.nowhere + .1, a.nowhere + 1.1), qo = span(t, a.knowing - .5, a.knowing + .9);
  if (qu > 0 && qo < 1) {
    ctx.save(); F.float(ctx, t, .8); sinkClip(ctx); ctx.translate(0, slideY(1, qo, 0, 900));
    F.quoteCard(ctx, t, T, { u: qu, text: '“…not operating fully autonomously for any measured subset of AI R&D work.”', x: 360, y: 290, w: 1200, size: 56, head: 'THE LAB\'S OWN FINE PRINT', credit: 'ANTHROPIC, SEPT 2026' });
    ctx.restore();
  }
  // ------------------------------------------------ 5.05 / 5.06: the cream ? (research taste) → rung 3 of the big HUD
  const wu = span(t, a.knowing + .2, a.knowing + 1.2), fly = sineIO(span(t, a.r3 - .3, a.r3 + 1.5));
  if (wu > 0 && fly < 1) {
    const [tx, ty] = mapPt(hudM(HUDBIG), HUDFOOT[0] + 14, hudRung(2)[2]);
    const x = lerp(960, tx, fly), y = lerp(500, ty, fly), k = expoOut(wu) * lerp(1, .12, fly);
    ctx.save(); F.float(ctx, t, .8 * (1 - fly));
    halo(ctx, x, y - 90 * k, 260 * k, .35 * (1 - fly * .5), P.halo2, P.cream);
    E.glowText(ctx, '?', x, y, { size: 300 * k, serif: true, col: P.cream, glow: true, align: 'center' });
    ctx.restore();
    const lo = span(t, a.r3 - .6, a.r3 + .2);
    if (lo < 1) {
      ctx.save(); F.float(ctx, t, .8); sinkClip(ctx); ctx.translate(0, slideY(1, lo, 0, 400));
      const tu = span(t, a.knowing + 1.2, a.knowing + 2.0), hu = span(t, a.fornow - .1, a.fornow + .6);
      if (tu > 0) F.goldText(ctx, [['RESEARCH TASTE', 0]], 960, 660, 44, rise(tu), { serif: false, weight: 600, spacing: .12, align: 'center' });
      if (hu > 0) F.goldText(ctx, [['HUMAN, FOR NOW', 0]], 960, 720, 28, rise(hu), { serif: false, weight: 600, spacing: .16, align: 'center', col: P.halo2 });
      ctx.restore();
    }
  }
  // ------------------------------------------------ 5.07: the movie poster folds away; the ladder behind it
  const pu = span(t, a.movies + .1, a.movies + 1.2), pf = sineIO(span(t, a.happening - .15, a.happening + .85));
  if (pu > 0 && pf < 1) {
    const { x, y, w, h } = POSTER;
    ctx.save(); F.float(ctx, t, .8); ctx.translate(0, (1 - expoOut(pu)) * 50);
    ctx.translate(0, y); ctx.scale(1, Math.max(.002, 1 - pf)); ctx.translate(0, -y);   // folds up to its top edge
    F.paperCard(ctx, t, x, y, w, h, { u: pu, style: 'night' });
    ctx.save(); ctx.globalAlpha *= clamp(pu * 3);
    ctx.beginPath(); ctx.roundRect(x + 24, y + 24, w - 48, h * .55, 8); ctx.save(); ctx.clip();
    ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(x, y, w, h);
    F.machine(ctx, t, x + w / 2, y + 24 + h * .3, 92, { build: 1, glow: 1.1 });
    for (let i = 0; i < 9; i++) { const bx = x + 40 + i * 42; ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(bx, y + 24 + h * .55 - 40 - (i % 3) * 18, 34, 120); }
    ctx.restore(); ctx.restore();
    F.goldText(ctx, [['ONE NIGHT,', 1]], x + w / 2, y + h * .55 + 110, 58, rise(span(pu, .3, 1)), { serif: true, align: 'center' });
    F.goldText(ctx, [['IN SECRET', 1]], x + w / 2, y + h * .55 + 180, 58, rise(span(pu, .4, 1)), { serif: true, align: 'center' });
    ctx.restore();
  }
  // ------------------------------------------------ 5.08: the headline · ON WHICH RUNG?
  const hu = span(t, a.headline + .1, a.headline + 1.1), ho = span(t, a.second2 - .5, a.second2 + 1.0);
  if (hu > 0 && ho < 1) {
    ctx.save(); F.float(ctx, t, .8); sinkClip(ctx); ctx.translate(0, slideY(hu, ho, 40, 900));
    F.paperCard(ctx, t, 600, 380, 820, 220, { u: hu, head: 'THE HEADLINE', lines: [['A.I. IS BUILDING A.I.', 78, 0, true]], rot: -.01 });
    ctx.restore();
  }
  const wq = span(t, a.building + .3, a.building + .7) * (1 - span(t, a.second2 + .3, a.second2 + .8));
  if (wq > 0) {   // a ? hops up the HUD's rungs, rung by rung (left of the small ladder)
    const q = 4 * sineIO(span(t, a.building + .4, a.which + .2)), k = Math.min(3, Math.floor(q)), f = q - k;
    const y0 = hudRung(k)[2], y1 = hudRung(Math.min(4, k + 1))[2], yy = lerp(y0, y1, sineIO(f)) - Math.sin(Math.PI * f) * 16, xx = hudRung(0)[0] - 26;
    ctx.save(); ctx.globalAlpha *= clamp(wq * 3);
    halo(ctx, xx, yy - 8, 26, .4, P.halo2, P.cream);
    E.glowText(ctx, '?', xx, yy + 4, { size: 30 * (.5 + .5 * expoOut(wq)), serif: true, col: P.cream, glow: false, align: 'center' });
    ctx.restore();
    const tu = span(t, a.which - .1, a.which + .6) * (1 - span(t, a.second2 + .3, a.second2 + .9));
    if (tu > 0) F.goldText(ctx, [['ON WHICH RUNG?', 0]], 520, 200, 38, rise(tu), { serif: false, weight: 600, spacing: .1 });
  }
}
