// Film 13 · c12 (s20, 495.96–534.00) · builder B3 · "A study across four countries … It's when they came."
// Owner direction (binding over shots.md): self-contained editorial graphics and one plain scene, joined by carriers; no flight through a sand world.
//   seam   the coin carried up out of c11's scale stands at COIN12 on the night (bgNight, sy = SY12): same call on both sides
//   12.01  explainer: a base line draws out under the coin; the coin drops, rolls, sinks into the line and rises again as a warm bar
//          (BOUGHT TIME), a cool bar beside it (BOUGHT THINGS); on "happier" the warm one grows. Source: Whillans et al., PNAS 2017
//   12.02  explainer: the bars sink; a hundred coins rise out of the line (10 × 10); "$40"; two of them turn gold: "2 IN 100 · CHOSE TIME"
//   12.03  carrier = the grid: the coins square off into a week of hours (7 days × 14 h) on a wall; the camera pulls back:
//          you stand under it. A cool spark (the machine) empties one hour: gold outline, warm inside (the first saved hour)
//   12.04  "don't fill it": three tasks slide at it · "Notice it" you look up · "Guard it" your arm, a warm ring, the tasks go home ·
//          "Let it stay empty" calm
//   12.05  the rules as empty time in the same week: WEEKEND (Sat + Sun drain), RIGHT TO DISCONNECT (the evenings drain);
//          "isn't what they say" the words sink; "when they came" the camera stands back, the floor line under you gets years
//          → c13 continues on this very line (lib/f13_b3_plan.mjs, END12)
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
import * as B from '../lib/f13_b3_kit.mjs';
import * as PL from '../lib/f13_b3_plan.mjs';
import { SY12 } from './sc11.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo } = E;
const rise = (x) => 1 - (1 - clamp(x)) ** 3;

export default async (T, R) => {
  E.prepareEditorial();
  const A = (w, n) => T.S('s20', w, n);
  const a = {
    T0: R.a, study: A('study'), four: A('four'), found: A('found'), spent: A('spent'), buy: A('buy'), time: A('time'), happier: A('happier'),
    yet: A('Yet'), asked: A('asked'), forty: A('forty'), two: A('two'), hundred: A('hundred'), chose: A('chose'), strangely: A('strangely'), hours: A('hours'),
    so: A('So here'), step: A('step'), first: A('first hour'), saves: A('saves'), fill: A("don't fill"), away: A('away'), notice: A('Notice'), guard: A('Guard'),
    let: A('Let it'), moment: A('moment'), but: A('But'), rules: A('rules'), common: A('common'), isnt: A('isn'), say: A('say'), when: A('when', 1), came: A('came'), end: R.b,
  };
  return [{ t: R.a, draw: chunk(a), print: K.PRINT13 }];
};

// ---- the opening explainer (world = screen while the camera is at home) ----
const LX = 400, RX = 1520, BX_T = 760, BX_M = 1160, BW = 170;
function bar(ctx, t, x, h, lit, seed) {
  if (h <= 1) return;
  const p = new Path2D(); p.roundRect(x - BW / 2, PL.BASE_Y - h, BW, h, [12, 12, 0, 0]);
  E.lightShape(ctx, p, t, { lit, seed, dust: lit > .5 ? 1 : 0, glow: .6, cy: -.4 });
}

function chunk(a) {
  const tCam0 = a.so - .1, tCam1 = a.step + 1.4, tCamB0 = a.isnt + .1, tCamB1 = a.end - .35;
  return (ctx, t) => {
    B.bgNight(ctx, t, { dawn: .15, stars: .6, sy: SY12 });
    B.setView(t); B.applyView(ctx);
    // ---- camera: home → the room → the boundary ----
    let cam = PL.camMix(PL.CAM0, PL.CAMR, sineIO(span(t, tCam0, tCam1)));
    cam = PL.camMix(cam, PL.CAMB, sineIO(span(t, tCamB0, tCamB1)));

    // ===== 12.01 · the coin, the base line, two bars =====
    const lineU = sineIO(span(t, a.study - .15, a.four + .2)), lineOut = sineIO(span(t, a.so, a.step + .4));
    if (lineU > 0 && lineOut < 1) {
      { const vc = B.viewCam(cam); ctx.save(); ctx.setTransform(vc.s, 0, 0, vc.s, vc.tx, vc.ty); }
      K.trailSpan(ctx, [[LX, PL.BASE_Y, 2.5], [RX, PL.BASE_Y, 2.5]], .5 - .5 * lineU + .5 * lineOut, .5 + .5 * lineU - .5 * lineOut, { w: 2.5, spark: false });
      ctx.restore();
    }
    // the coin: hangs, drops on the line (heavy, small bounce), rolls left, sinks through the line and is the warm bar's light
    const drop = span(t, a.found + .6, a.spent + .25), roll = sineIO(span(t, a.spent + .2, a.buy + .2)), sink = sineIO(span(t, a.buy + .15, a.time + .1));
    if (sink < 1) {
      const r = B.COIN12.r, yLine = PL.BASE_Y - r;
      const fall = drop <= 0 ? 0 : drop < .55 ? (drop / .55) ** 2 : 1 - .06 * Math.sin((drop - .55) / .45 * Math.PI) * (1 - (drop - .55) / .45);
      const x = lerp(B.COIN12.x, BX_T, roll), y = lerp(B.COIN12.y, yLine, fall) + 2 * r * sink;
      const bob = 5 * Math.sin((t - a.T0) * 1.6) * (1 - smooth(span(t, a.found - .3, a.found + .55)));
      ctx.save(); if (sink > 0) { ctx.beginPath(); ctx.rect(0, 0, W, PL.BASE_Y); ctx.clip(); }
      B.carriedCoin(ctx, t, x, y + bob, r, 0);
      ctx.restore();
    }
    const out1 = expoIn(span(t, a.yet, a.yet + .8));
    const hT = (200 * expoOut(span(t, a.time - .1, a.time + .6)) + 245 * expoOut(span(t, a.happier - .2, a.happier + .7))) * (1 - out1);
    const hM = 280 * expoOut(span(t, a.happier - .45, a.happier + .5)) * (1 - out1);
    if (hT > 1 || hM > 1) {
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, PL.BASE_Y); ctx.clip();
      bar(ctx, t, BX_T, hT, 1, 13); bar(ctx, t, BX_M, hM, 0, 14); ctx.restore();
    }
    const lab = (t0) => rise(span(t, t0, t0 + .8)) * (1 - expoIn(span(t, a.yet - .1, a.yet + .5)));
    // one label per picture (phone-readable): "4 COUNTRIES" until the bars come, then TIME / THINGS under them, HAPPIER over the warm one
    B.label(ctx, '4 COUNTRIES', 960, 250, lab(a.four - .1) * (1 - smooth(span(t, a.time - .5, a.time + .2))));
    B.label(ctx, 'TIME', BX_T, PL.BASE_Y + 80, lab(a.time - .05), { col: P.halo0 });
    B.label(ctx, 'THINGS', BX_M, PL.BASE_Y + 80, lab(a.happier - .3), { col: P.halo2, glow: false });
    B.label(ctx, 'HAPPIER', BX_T, PL.BASE_Y - 445 - 40, lab(a.happier + .3));

    // ===== 12.02 → 12.05 · the hundred coins, the week, you =====
    const coinUp = clamp(span(t, a.asked - .2, a.asked + 1.9) * 1.6);
    if (coinUp > 0) {
      const empty = new Float32Array(PL.N_CELLS);
      empty[PL.HOUR] = sineIO(span(t, a.saves + .05, a.saves + .85));
      PL.WEEKEND.forEach((i) => { const r = Math.floor(i / 7); empty[i] = Math.max(empty[i], sineIO(span(t, a.rules - .35 + r * .05, a.rules + .2 + r * .05))); });
      PL.EVENING.forEach((i) => { const c = i % 7, r = Math.floor(i / 7) - 11; empty[i] = Math.max(empty[i], sineIO(span(t, a.common - .25 + c * .09 + r * .03, a.common + .3 + c * .09 + r * .03))); });
      const want = sineIO(span(t, a.fill - .05, a.away + .1)), back = expoOut(span(t, a.guard + .15, a.guard + 1.0));
      const chips = PL.CHIPS.map((i, j) => ({ i, u: want * (1 - back) * (1 + .04 * Math.sin((t - a.fill) * 5 + j)) * clamp(span(t, a.fill - .05 + j * .08, a.fill + .1 + j * .08) * 3) }));
      PL.planner(ctx, t, {
        cam, coinUp, cellU: span(t, a.so - .15, a.step + .9),
        gold: [sineIO(span(t, a.two - .05, a.two + .4)), sineIO(span(t, a.two + .15, a.two + .6))],
        empty, chips, guard: span(t, a.guard + .05, a.guard + 1.1),
        glow: Math.sin(Math.PI * span(t, a.notice - .1, a.notice + .9)),
        duLook: sineIO(span(t, a.notice - .2, a.notice + .5)), duArm: sineIO(span(t, a.guard - .2, a.guard + .45)) * (1 - sineIO(span(t, a.let + .3, a.moment + .7))),
        floorU: span(t, a.step - .1, a.step + 1.4), ticksU: span(t, a.when - .25, a.end - .9),
      });
      // labels of the grid (screen space)
      const g1 = (t0) => rise(span(t, t0, t0 + .8)) * (1 - smooth(span(t, a.hours - .1, a.so + .3)));
      B.label(ctx, '$40', 620, 530, g1(a.forty - .15) * (1 - smooth(span(t, a.two - .6, a.two))), { align: 'right', serif: true, size: 130 });
      B.label(ctx, '2 IN 100', 1300, 520, g1(a.two - .25), { align: 'left', serif: true, size: 120 });
      // the first hour: the machine's cool spark comes in from the right, empties the hour, and goes
      const sp0 = span(t, a.first - .2, a.saves + .05), sp1 = span(t, a.saves + .1, a.saves + 1.2);
      if (sp0 > 0 && sp1 < 1) {
        const [hx, hy] = PL.toS(cam, ...PL.cellXY(PL.HOUR)), u = sineIO(sp0), v = expoIn(sp1);
        const ax = W + 60, ay = 180, cx1 = (ax + hx) / 2 + 80, cy1 = Math.min(ay, hy) - 120;
        let x = (1 - u) ** 2 * ax + 2 * (1 - u) * u * cx1 + u * u * hx, y = (1 - u) ** 2 * ay + 2 * (1 - u) * u * cy1 + u * u * hy;
        x = lerp(x, W + 80, v); y = lerp(y, -60, v * v);
        halo(ctx, x, y, 130, .5, P.blue0, P.blue0); halo(ctx, x, y, 34, .95, B.COOL, P.cream);
        ctx.save(); ctx.strokeStyle = rgba(P.cream, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 22 + 3 * Math.sin(t * 6), 0, 6.29); ctx.stroke(); ctx.restore();
      }
      // the rules, named in the week (and they sink again: "it isn't what they say")
      const say = 1 - expoIn(span(t, a.isnt - .1, a.say + .2));
      const lt = PL.toS(cam, 960, PL.PL.y0 - 40);   // one label slot above the week: WEEKEND, then RIGHT TO DISCONNECT
      B.label(ctx, 'WEEKEND', lt[0], lt[1], rise(span(t, a.rules + .05, a.rules + .8)) * (1 - smooth(span(t, a.common - .2, a.common + .3))), { col: P.halo0 });
      B.label(ctx, 'RIGHT TO DISCONNECT', lt[0], lt[1], rise(span(t, a.common + .25, a.common + 1.0)) * say, { col: P.halo0 });
    }
  };
}
