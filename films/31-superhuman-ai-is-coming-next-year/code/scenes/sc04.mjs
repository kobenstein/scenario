// c04 · Rung 2: two benches, as well as a skilled human · Altman's intern goal · not verified · rung 2 TAKEN ★ · describe it clearly
// built by B1. The B1 group engine (one camera, one world, the veil, the HUD moments) lives in scenes/sc02.mjs.
//
// | ID    | anchor (phrase)                 | picture (one idea)                                                                   | carrier → next   |
// |-------|---------------------------------|--------------------------------------------------------------------------------------|------------------|
// | 4.01  | By Anthropic's own verdict      | the builder of 3.05 rolls to its bench; a person at the other: the same experiment;  | the gold bar     |
// |       |                                 | two result bars grow equal on "as well as a skilled human" · source: the quote        |                  |
// | 4.02  | Or better                       | the builder's bar ends a little longer                                               | a calendar       |
// | 4.03  | A year ago                      | the benches sink; a calendar OCT 2025; a tag on a gold thread: GOAL: AI RESEARCH      | the page turns   |
// |       |                                 | INTERN · BY SEPT 2026 · SAM ALTMAN, OPENAI                                             |                  |
// | 4.04  | September came                  | the page turns to SEPT 2026: REPORTED AS REACHED (OPENAI) · stamp NOT EXTERNALLY       | the HUD          |
// |       |                                 | VERIFIED · "SIGNIFICANT HUMAN STEERING"                                               |                  |
// | 4.05★ | So the second rung              | the HUD big: rung 2 EXPERIMENTS · TAKEN (ON THE LABS' WORD), stamp (engine)           | the note         |
// | 4.06  | But listen to the condition     | a paper note WELL-SPECIFIED passes from a person to the builder: DESCRIBE IT CLEARLY  | the ladder       |
// | 4.07  | So who decides which experiments| the veil lifts: the camera looks up to rung 3, a ? hangs there (engine, sc02.mjs)     | your lamp        |
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f31_kit.mjs';
import { group, bot, slideY } from './sc02.mjs';
import { BENCHB, sinkClip } from './sc03.mjs';
const { P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin } = E;
const { rise, FORGE, PAPER } = F;
const TAU = Math.PI * 2;
export default (T, R) => group(T, R);

const BAR = { x: 800, y1: 300, y2: 376, w: 660, th: 32 };
const CAL = { x: 430, y: 230, w: 520, h: 540, band: 110 };

function flask(ctx, t, x, y, s, col, fill) {   // a small lab flask (cream outline), liquid in col, a bubble or two
  ctx.save(); ctx.translate(x, y);
  const p = new Path2D(); p.moveTo(-s * .18, -s); p.lineTo(-s * .18, -s * .45); p.lineTo(-s * .55, 0); p.lineTo(s * .55, 0); p.lineTo(s * .18, -s * .45); p.lineTo(s * .18, -s); p.closePath();
  ctx.save(); ctx.clip(p); ctx.fillStyle = rgba(col, .85); ctx.fillRect(-s, -s * .32 * fill, s * 2, s); ctx.restore();
  ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 2.5; ctx.stroke(p);
  for (let k = 0; k < 2; k++) { const q = (t * .7 + k * .5) % 1; ctx.fillStyle = rgba(P.cream, .6 * (1 - q)); ctx.beginPath(); ctx.arc(Math.sin(k * 3 + t) * s * .1, -s * .1 - q * s * .9, s * .05, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function table(ctx, x0, x1, y) {
  ctx.fillStyle = mixHex(P.night1, P.ind2, .65); ctx.fillRect(x0, y, x1 - x0, 12); ctx.fillRect(x0 + 16, y + 12, 10, 130); ctx.fillRect(x1 - 26, y + 12, 10, 130);
  ctx.fillStyle = rgba(P.cream, .3); ctx.fillRect(x0, y, x1 - x0, 2);
}
function calPage(ctx, t, title, u) {   // one calendar page (paper, a gold-brown band with the month)
  const { x, y, w, h, band } = CAL;
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(x + 6, y + 10, w, h, 8); ctx.fill();
  ctx.fillStyle = lin(ctx, x, y, x + w, y + h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = FORGE.deep; ctx.beginPath(); ctx.roundRect(x, y, w, band, [8, 8, 0, 0]); ctx.fill();
  E.glowText(ctx, title, x + w / 2, y + band * .68, { size: 54, serif: true, col: PAPER.lit, glow: false, align: 'center', a: u });
  for (const rx of [x + 90, x + w - 90]) { ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(rx, y + 16, 9, 0, TAU); ctx.fill(); }
}
function calGrid(ctx) {
  const { x, y, w, h, band } = CAL, gx = x + 40, gy = y + band + 40, cw = (w - 80) / 7, ch = (h - band - 80) / 5;
  ctx.fillStyle = rgba(PAPER.shade, .7);
  for (let j = 0; j < 5; j++) for (let i = 0; i < 7; i++) ctx.fillRect(gx + i * cw + 6, gy + j * ch + 6, cw - 12, ch - 12);
}

export function layer(ctx, t, a, T, X) {
  if (t < a.verdict - 1 || t > a.who + 2) return;
  // ------------------------------------------------ 4.01 / 4.02: two benches, the same experiment
  const bu = span(t, a.verdict + .3, a.verdict + 1.4), bo = span(t, a.yago - .6, a.yago + 1.0);
  if (bu > 0 && bo < 1) {
    ctx.save(); F.float(ctx, t, .8); sinkClip(ctx); ctx.translate(0, slideY(bu, bo, 50, 900));
    const tu = span(t, a.describe - .1, a.describe + .8);
    if (tu > 0) F.goldText(ctx, [['A WELL-SPECIFIED EXPERIMENT', 0]], 960, 200, 34, rise(tu), { serif: false, weight: 600, spacing: .1, align: 'center' });
    // the result bars: equal on "as well as a skilled human", the machine's a little longer on "Or better"
    const g = sineIO(span(t, a.skilled - .3, a.skilled + 1.3)), gb = sineIO(span(t, a.better - .05, a.better + .9)), lu = span(t, a.describe + .3, a.describe + 1.1);
    if (lu > 0) {
      F.goldText(ctx, [['A SKILLED HUMAN', 0]], BAR.x - 26, BAR.y1 + 10, 28, rise(lu), { serif: false, weight: 600, spacing: .1, align: 'right' });
      F.goldText(ctx, [['ITS MODEL', 1]], BAR.x - 26, BAR.y2 + 10, 28, rise(lu), { serif: false, weight: 600, spacing: .1, align: 'right' });
      ctx.fillStyle = rgba(P.cream, .1); ctx.fillRect(BAR.x, BAR.y1 - BAR.th / 2, BAR.w * lu, BAR.th); ctx.fillRect(BAR.x, BAR.y2 - BAR.th / 2, BAR.w * lu, BAR.th);
      ctx.fillStyle = mixHex(P.halo2, P.cream, .6); ctx.fillRect(BAR.x, BAR.y1 - BAR.th / 2, BAR.w * .78 * g, BAR.th);
      const mw = BAR.w * (.78 * g + .1 * gb);
      ctx.fillStyle = lin(ctx, BAR.x, 0, BAR.x + BAR.w, 0, [[0, FORGE.hot], [1, FORGE.body]]); ctx.fillRect(BAR.x, BAR.y2 - BAR.th / 2, mw, BAR.th);
      if (mw > 0) halo(ctx, BAR.x + mw, BAR.y2, 30, .5 * (g < 1 || (gb > 0 && gb < 1) ? 1 : .4), FORGE.halo, FORGE.core);
    }
    // the benches: a person (cream light) and the builder (gold), each at a flask
    table(ctx, 470, 830, 700); table(ctx, 1090, 1450, 700);
    halo(ctx, 600, 690, 170, .22, P.halo2, P.cream);
    E.person(ctx, 590, 842, 270, { light: .9, dir: 1, pose: 'reach' });
    flask(ctx, t, 740, 700, 70, P.cream, .3 + .5 * g); flask(ctx, t, 1190, 700, 70, FORGE.body, .3 + .5 * g + .1 * gb);
    if (t >= a.verdict + 1.7) bot(ctx, t, BENCHB.x, BENCHB.y + Math.sin(t * 1.3) * 3, BENCHB.s, { arm: Math.atan2(650 - BENCHB.y, 1205 - BENCHB.x), armL: 2.6, eye: .8 + .4 * g, spark: .6 });
    ctx.restore();
    F.source(ctx, t, a.describe + .2, a.yago - .2, F.SOURCES.experiment);
  }
  // ------------------------------------------------ 4.03 / 4.04: the calendar, the goal tag, the page turns
  const cu = span(t, a.yago + .5, a.yago + 1.6), co = span(t, a.second - 1.0, a.second + .5);
  if (cu > 0 && co < 1) {
    ctx.save(); F.float(ctx, t, .8); sinkClip(ctx); ctx.translate(0, slideY(cu, co, 60, 900));
    ctx.globalAlpha *= clamp(cu * 3);
    const fp = sineIO(span(t, a.sept - .15, a.sept + .75));
    // the new page (SEPT 2026) lies under the old one
    if (fp > 0) {
      calPage(ctx, t, 'SEPT 2026', 1);
      const ru = span(t, a.says - .1, a.says + .8);
      F.maskLine(ctx, [['REPORTED', 0]], CAL.x + CAL.w / 2, CAL.y + 250, 56, rise(ru), { serif: true, align: 'center', col: PAPER.ink, glow: false });
      F.maskLine(ctx, [['AS REACHED', 0]], CAL.x + CAL.w / 2, CAL.y + 320, 56, rise(span(ru, .15, 1)), { serif: true, align: 'center', col: PAPER.ink, glow: false });
      F.maskLine(ctx, [['(OPENAI)', 0]], CAL.x + CAL.w / 2, CAL.y + 372, 24, rise(span(ru, .3, 1)), { serif: false, weight: 600, align: 'center', col: PAPER.faint, glow: false });
      F.stamp(ctx, t, 'NOT EXTERNALLY VERIFIED', CAL.x + CAL.w / 2, CAL.y + 460, { t0: a.outsider + .35, size: 25, rot: -.07, ink: '#8c3a24' });
    }
    if (fp < 1) {   // the old page (OCT 2025) lifts away over the top edge
      ctx.save(); ctx.translate(0, CAL.y); ctx.scale(1, Math.max(.001, 1 - fp)); ctx.translate(0, -CAL.y);
      calPage(ctx, t, 'OCT 2025', 1); calGrid(ctx);
      if (fp > 0) { ctx.fillStyle = rgba(P.night0, .25 * fp); ctx.fillRect(CAL.x, CAL.y, CAL.w, CAL.h); }
      ctx.restore();
    }
    // the goal: a tag on a gold thread from the calendar's ring
    const gu = span(t, a.goal - .1, a.goal + 1.0);
    if (gu > 0) {
      const tx = 1260, ty = 250, rx = CAL.x + CAL.w - 90, ry = CAL.y + 16;
      F.goldSpan(ctx, [[rx, ry], [lerp(rx, tx, .5), ry - 60], [tx, ty]], 0, clamp(gu * 1.6), { w: 1.6, spark: gu < .6 });
      F.priceTag(ctx, t, tx, ty, ['GOAL: AI RESEARCH INTERN', 'BY SEPT 2026', 'SAM ALTMAN, OPENAI'], span(gu, .35, 1), { len: 70, size: 24 });
    }
    const su = span(t, a.steering - .1, a.steering + .8);
    if (su > 0) F.goldText(ctx, [['"SIGNIFICANT HUMAN STEERING"', 0]], 1260, 690, 28, rise(su), { serif: false, weight: 600, spacing: .08, align: 'center' });
    ctx.restore();
    F.source(ctx, t, a.says, a.second - .5, F.SOURCES.intern);
  }
  // ------------------------------------------------ 4.06: the condition: a note passes from a person to the builder
  const nu = span(t, a.cond + .5, a.cond + 1.5), no = span(t, a.who - .6, a.who + .9);
  if (nu > 0 && no < 1) {
    ctx.save(); F.float(ctx, t, .8); sinkClip(ctx); ctx.translate(0, slideY(nu, no, 50, 900));
    halo(ctx, 640, 690, 170, .22, P.halo2, P.cream);
    E.person(ctx, 640, 842, 270, { light: .9, dir: 1, pose: 'point' });
    bot(ctx, t, 1290, 620 + Math.sin(t * 1.3) * 3, 40, { eye: .9 });
    const mp = sineIO(span(t, a.clearly - .4, a.clearly + 1.1)), nx = lerp(735, 1180, mp), ny = lerp(640, 610, mp) - Math.sin(Math.PI * mp) * 170;
    ctx.save(); ctx.translate(nx, ny); ctx.rotate(-.06 + .12 * mp + .03 * Math.sin(t * 1.4));
    F.paperCard(ctx, t, -140, -40, 280, 80, { u: span(nu, .3, 1), lines: [['WELL-SPECIFIED', 26, 0, false]] });
    ctx.restore();
    const du = span(t, a.clearly - .05, a.clearly + .8);
    if (du > 0) F.goldText(ctx, [['DESCRIBE IT CLEARLY', .4]], 960, 300, 38, rise(du), { serif: false, weight: 600, spacing: .1, align: 'center' });
    ctx.restore();
  }
}
