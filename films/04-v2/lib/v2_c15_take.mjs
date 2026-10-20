// c15 · the one take: camera path and composition (see the plan table in scenes/sc15.mjs)
import { W, H, clamp, mix } from '../engine.mjs';
import { drawHill, VIEWS, hillOutline, toScreen as hillS } from './maslow4.mjs';
import { LC, toS, hillCam, camPath, span, qio, eoX, smt, sio, skyDeep, drawRidges, glowAt, rgba, HZ } from './v2_c15_kit.mjs';
import { drawLand, drawCrowd, drawFrieze } from './v2_c15_land.mjs';

export function anchors(T, HI, HO) {
  const S = (p, n) => T.S('07a', p, n), E = (p, n) => T.E('07a', p, n);
  return {
    hb: HI.b, ha: HO.a, end: HO.a - 1 / 30,
    think: S('Think'), every: S('everyone'), lived: S('lived'), livedE: E('lived'),
    most: S('Most of'), up: S('up here'), hereE: E('up here'),
    not: S('Not because'), shallow: S('shallow'), shallowE: E('shallow'),
    because: S('Because survival'), days: S('days'), daysE: E('days'),
    harvest: S('harvest'), harvestE: E('harvest'), rent: S('rent'), rentE: E('rent'), shift: S('next shift'), shiftE: E('next shift'),
    there: S('There was'), wonder: S('wonder'), wonderE: E('wonder'),
    asking: S('Asking'), few: S('the few'), fewE: E('the few'),
    first: S('For the first'), belong: S('belong'), every2: S('everyone', 1), every2E: E('everyone', 1),
    lagos0: S('To a cook'), cook: S('cook'), lagos: S('Lagos'), lagosE: E('Lagos'),
    peru0: S('To a farmer'), farmer: S('farmer'), peru: S('Peru'), peruE: E('Peru'),
    you0: S('To you'), youE: E('To you'),
  };
}

// ---------------------------------------------------------------- the camera
let PATH = null, PA = null;
function path(A) {
  if (PA === A) return PATH;
  const H4 = VIEWS.H4.cam, s0 = 1 - 1 / H4.z;
  PATH = camPath([
    { t: A.hb, x: H4.x, y: H4.y, s: s0 },
    { t: A.hb + .25, x: H4.x + 6, y: H4.y, s: s0 - .004 },
    { t: A.livedE - .15, x: 1560, y: 300, s: .30 },
    { t: A.hereE, x: 1500, y: 430, s: .36 },
    { t: A.shallowE, x: 1330, y: 380, s: .52 },
    { t: A.daysE, x: 1900, y: 380, s: .35 },
    { t: A.harvest + .2, x: 2000, y: 470, s: .7 },
  ]);
  PA = A; return PATH;
}
export const camAt = (t, A) => path(A)(t);

// ---------------------------------------------------------------- composition
function hillPoly(C) { const hc = hillCam(C); return hillOutline().map(([x, y]) => hillS(hc, x, y)); }
export function take(ctx, t, A) {
  const C = camAt(t, A);
  // Phase A: the hill draws the whole frame (its sky, ridges, water, town); everything of ours goes over it, masked by the hill
  const st = { ...VIEWS.H4.st, labels: 1 - smt(span(t, A.hb + .1, A.hb + .75)) };
  drawHill(ctx, t, hillCam(C), st);
  const hp = hillPoly(C), [, wy] = hillS(hillCam(C), 0, HZ);
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, W, Math.min(H, wy)); ctx.clip();
  ctx.beginPath(); ctx.rect(-10, -10, W + 20, H + 20); hp.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip('evenodd');
  const wave = (x) => clamp((t - A.think - .15 - (x - 950) * .0011) / 1.1);
  drawFrieze(ctx, t, C, { u: wave, a: .78 });
  for (const k of ['far3', 'far2', 'mid14']) drawLand(ctx, t, C, k, { night: 1 });
  ctx.restore();
  for (const k of ['near8', 'near6']) { drawLand(ctx, t, C, k, { night: 1 }); drawCrowd(ctx, t, C, k, { a: .85 }); }
}
