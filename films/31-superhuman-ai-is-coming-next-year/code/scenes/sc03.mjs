// c03 · At Google too · the fine print · rung 1 TAKEN ★ · typing code isn't science: the loop · built by B1.
// The B1 group engine (one camera, one world, the veil, the HUD moments) lives in scenes/sc02.mjs; this file is c03's explainer layer.
//
// | ID    | anchor (phrase)                  | picture (one idea)                                                                  | carrier → next     |
// |-------|----------------------------------|-------------------------------------------------------------------------------------|--------------------|
// | 3.01  | At Google too                    | veil; paper card GOOGLE DEEPMIND, OCT 2026 · >75 % OF PRODUCTION CODE WRITTEN BY A.I. | the card turns     |
// | 3.02  | But so far                       | the card turns to the fine print (verbatim); a magnifier ring glides over "no clear  | the HUD            |
// |       |                                  | end-to-end acceleration"; under it ≈88 % OF CHANGES STILL NEED HUMAN STEERING         |                    |
// | 3.03★ | So the first step up the ladder  | the HUD grows big (1.8 s): rung 1 CODE · TAKEN, the stamp on "taken"; back (1.8 s)   | the loop           |
// |       |                                  | (drawn by the engine, sc02.mjs hud())                                                |                    |
// | 3.04  | But typing code isn't science    | three circles in a loop GUESS → TEST → RESULT; SCIENCE = FINDING OUT WHAT WORKS      | a builder rolls in |
// | 3.05  | Can a machine do that too        | a small builder rolls up to the loop; a ? swings above it                            | it rolls to bench  |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f31_kit.mjs';
import { group, bot, slideY } from './sc02.mjs';
const { P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo } = E;
const { rise, FORGE, PAPER } = F;
const TAU = Math.PI * 2;
export default (T, R) => group(T, R);

const CARD = { x: 590, y: 220, w: 740, h: 400 }, QS = 56;
const Q1 = '“There is currently no clear', Q1A = '“There is currently ', Q2 = 'end-to-end acceleration in', Q2A = 'end-to-end acceleration';
// clip the explainers above the subtitle band, so what sinks out goes behind the line at y 880
export const sinkClip = (ctx) => { ctx.beginPath(); ctx.rect(0, 0, 1920, 880); ctx.clip(); };
const LOOP = { x: 960, y: 500, R: 190, r: 70 };
// the builder that rolls in at 3.05 and on to its bench in c04 (sc04 takes over at its bench)
export const BENCHB = { x: 1300, y: 610, s: 36 };
export const builderPath = (t, a) => {
  const ru = sineIO(span(t, a.canm - .3, a.canm + 1.5)), bu = sineIO(span(t, a.verdict - .1, a.verdict + 1.7));
  const x = lerp(lerp(2080, 1330, ru), BENCHB.x, bu), y = lerp(LOOP.y + 140, BENCHB.y, bu), s = lerp(30, BENCHB.s, bu);
  return { x, y, s, roll: -(x - 2080) / 30 };
};

export function layer(ctx, t, a, T, X) {
  if (t < a.google - 1 || t > a.verdict + 2) return;
  // ------------------------------------------------ 3.01 / 3.02: the card and its fine print
  const cu = span(t, a.google - .1, a.google + 1.0), co = span(t, a.whole - .5, a.whole + 1.0);
  if (cu > 0 && co < 1) {
    const fp = span(t, a.sofar + .1, a.sofar + .9), sx = Math.abs(Math.cos(Math.PI * fp)), back = fp >= .5;
    ctx.save(); F.float(ctx, t, .8); sinkClip(ctx); ctx.translate(0, slideY(cu, co, 40, 760));
    ctx.translate(CARD.x + CARD.w / 2, 0); ctx.scale(Math.max(.02, sx), 1); ctx.translate(-(CARD.x + CARD.w / 2), 0);
    if (!back) F.paperCard(ctx, t, CARD.x, CARD.y, CARD.w, CARD.h, { u: cu, head: F.SOURCES.deepmind, headSize: 20,
      lines: [['>75 %', 130, 1, true], ['OF PRODUCTION CODE', 34, 0, false], ['WRITTEN BY A.I.', 34, 0, false]] });
    else {
      F.paperCard(ctx, t, CARD.x, CARD.y, CARD.w, CARD.h, { u: 1, head: 'THE FINE PRINT · GOOGLE DEEPMIND', headSize: 20,
        lines: [[Q1, QS], [Q2, QS], ['machine learning research', QS], ['and development …”', QS]] });
      // the magnifier glides along "no clear … end-to-end acceleration" while it is spoken; a gold underline follows it
      const mg = sineIO(span(t, a.noclear - .2, a.noclear + 1.6)), lx = CARD.x + 34, b1 = CARD.y + 62 + QS * 1.18, b2 = b1 + QS * 1.18;
      const u1 = [lx + F.measure(Q1A, QS, true), lx + F.measure(Q1, QS, true)], u2 = [lx, lx + F.measure(Q2A, QS, true)];
      const px = mg < .5 ? lerp(u1[0], u1[1], mg * 2) : lerp(u2[0], u2[1], mg * 2 - 1), py = mg < .5 ? b1 : b2;
      F.goldSpan(ctx, [[u1[0], b1 + 12], [u1[1], b1 + 12]], 0, clamp(mg * 2), { w: 2.2, spark: false });
      if (mg > .5) F.goldSpan(ctx, [[u2[0], b2 + 12], [u2[1], b2 + 12]], 0, clamp(mg * 2 - 1), { w: 2.2, spark: false });
      const ma = span(t, a.noclear - .4, a.noclear) * (1 - span(t, a.whole - .4, a.whole));
      if (ma > 0) { ctx.save(); ctx.globalAlpha *= ma; const r = 58 * (.8 + .2 * expoOut(ma)), cy = py - 18;
        ctx.fillStyle = rgba(FORGE.hot, .14); ctx.beginPath(); ctx.arc(px, cy, r, 0, TAU); ctx.fill();
        ctx.strokeStyle = PAPER.ink; ctx.lineWidth = 7; ctx.stroke(); ctx.lineCap = 'round'; ctx.lineWidth = 12;
        ctx.beginPath(); ctx.moveTo(px + r * .72, cy + r * .72); ctx.lineTo(px + r * 1.35, cy + r * 1.35); ctx.stroke(); ctx.restore(); }
    }
    ctx.restore();
    const su = span(t, a.noclear + 1.4, a.noclear + 2.2);
    if (su > 0) { ctx.save(); F.float(ctx, t, .8); sinkClip(ctx); ctx.translate(0, slideY(1, co, 0, 760));
      F.goldText(ctx, [['≈88 % OF CHANGES STILL NEED HUMAN STEERING', 0]], 960, CARD.y + CARD.h + 90, 26, rise(su), { serif: false, weight: 600, spacing: .1, align: 'center' }); ctx.restore(); }
    F.source(ctx, t, a.most, a.whole + .3, F.SOURCES.deepmind);
  }
  // ------------------------------------------------ 3.04: the loop of science
  const lu = span(t, a.typing + 1.6, a.typing + 3.0), lo = span(t, a.verdict - .5, a.verdict + 1.0);
  if (lu > 0 && lo < 1) {
    ctx.save(); F.float(ctx, t, .8); sinkClip(ctx); ctx.translate(0, slideY(lu, lo, 40, 900));
    const names = ['GUESS', 'TEST', 'RESULT'], ang = (i) => -Math.PI / 2 + i * TAU / 3;
    const pt = (an, rr = LOOP.R) => [LOOP.x + Math.cos(an) * rr, LOOP.y + Math.sin(an) * rr];
    for (let i = 0; i < 3; i++) {   // the arrows (arcs between the circles), drawn in order
      const au = span(lu, .25 + i * .2, .55 + i * .2); if (au <= 0) continue;
      const a0 = ang(i) + .42, a1 = ang(i + 1) - .42, ae = lerp(a0, a1, expoOut(au));
      ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(LOOP.x, LOOP.y, LOOP.R, a0, ae); ctx.stroke();
      const [hx, hy] = pt(ae), d = ae + Math.PI / 2; ctx.fillStyle = rgba(P.cream, .7); ctx.beginPath();
      ctx.moveTo(hx + Math.cos(d) * 14, hy + Math.sin(d) * 14); ctx.lineTo(hx + Math.cos(d + 2.5) * 12, hy + Math.sin(d + 2.5) * 12); ctx.lineTo(hx + Math.cos(d - 2.5) * 12, hy + Math.sin(d - 2.5) * 12); ctx.closePath(); ctx.fill();
    }
    // a cream pulse runs round the loop (finding out, again and again)
    const pa = span(lu, .8, 1); if (pa > 0) { const q = ((t - a.typing) * .45) % 1, [qx, qy] = pt(-Math.PI / 2 + q * TAU); halo(ctx, qx, qy, 26, .5 * pa, P.halo2, P.cream); }
    for (let i = 0; i < 3; i++) {
      const nu = rise(span(lu, i * .2, .5 + i * .2)); if (nu <= 0) continue;
      const [x, y] = pt(ang(i)), r = LOOP.r * (.6 + .4 * expoOut(nu));
      ctx.save(); ctx.globalAlpha *= clamp(nu * 3);
      ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 2.5; ctx.stroke();
      E.glowText(ctx, names[i], x, y + 9, { size: 24, weight: 600, spacing: .1, col: P.cream, glow: false, align: 'center' });
      ctx.restore();
    }
    const tu = span(t, a.science - .1, a.science + .8);
    if (tu > 0) F.goldText(ctx, [['SCIENCE = FINDING OUT WHAT WORKS', 0]], 960, 210, 34, rise(tu), { serif: false, weight: 600, spacing: .1, align: 'center' });
    ctx.restore();
  }
  // ------------------------------------------------ 3.05: a builder rolls up to the loop; a ? swings above it (on to its bench in c04)
  if (t > a.canm - .3 && t < a.verdict + 1.7) {
    const b = builderPath(t, a), ou = sineIO(span(t, a.verdict + .2, a.verdict + .9));
    ctx.save(); F.float(ctx, t, .8);
    bot(ctx, t, b.x, b.y, b.s, { roll: b.roll, eye: .8 });
    const qu = span(t, a.canm + .6, a.canm + 1.3) * (1 - ou);
    if (qu > 0) { ctx.save(); ctx.translate(b.x, b.y - b.s - 30); ctx.rotate(.18 * Math.sin(t * 2.2) + (1 - expoOut(qu)) * .5);
      F.goldText(ctx, [['?', 1]], 0, -10, 84, rise(qu), { serif: true, align: 'center' }); ctx.restore(); }
    ctx.restore();
  }
}
