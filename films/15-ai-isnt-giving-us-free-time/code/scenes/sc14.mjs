// Film 13 · c14 (s23 + s24 + end screen, 582.52–625.48) · builder B3 · "The hour arrives … Only we can decide to keep it." + end screen
// Owner direction (binding): the finale is scenic and the warmest; ONE tableau, not a journey; the hourglass is the anchor of "keep it".
//   seam   END of c13: the line (the time line, now the horizon), you, the hourglass on its slab — same pixels on both sides
//   14.01  "The hour arrives": the sun rises from behind the line; the night turns to a golden evening (light spreads from the sun)
//   14.02  on the line, each picture rises from it when it is named (the film's explainer language, now as a landscape):
//          "a garden" beds rise, seedlings grow, a gardener · "a long dinner" a table with people, a thread of lanterns lights up
//          "a child by the river" water opens in the ground, a child crouches at it, rings · "a walk through the woods" trees rise,
//          you walk into them
//   14.03  "That's what the time is for" → "for all of us": the camera stands back; more homes along the line light their windows
//   14.04  "The machine can give you the hour": push to the hourglass; the hand of light hovers over it (hook echo), then withdraws ·
//          "Only we can decide to keep it": you are back beside it, your hand on the glass; the last grain falls, the slab glows
//   END    609.6–625.48: pull back to the wide golden evening, then a very slow drift; sun low in the middle (subscribe above it),
//          free zones left (90–780 × 250–700) and right (1140–1830) are open sky; glitter on the river, lanterns, fireflies
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
import * as B from '../lib/f13_b3_kit.mjs';
import * as PL from '../lib/f13_b3_plan.mjs';
import { SY12 } from './sc11.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, prng, rad, lin } = E;

export default async (T, R) => {
  E.prepareEditorial();
  const A = (w, n) => T.S('s23', w, n), Z = (w, n) => T.S('s24', w, n);
  const a = {
    T0: R.a, hour: A('hour'), arrives: A('arrives'), garden: A('garden'), battle: A('Battle'), long: A('long'), dinner: A('dinner'), love: A('love'),
    child: A('child'), river: A('river'), walk: A('walk'), woods: A('woods'), nowhere: A('nowhere'), thats: A("That's what"), timefor: A('for', 0),
    make: A('We make'), all: A('for all'), ifyou: A('If you'), subscribe: A('subscribe'),
    machine: Z('machine'), givehour: Z('hour'), only: Z('Only'), decide: Z('decide'), keep: Z('keep'), endVO: Z('it'), end: R.b,
  };
  return [{ t: R.a, draw: chunk(a), print: K.PRINT13 }];
};

// ---- world = the screen of c13's last frame ----
const C = PL.CAMB, LY = PL.FLOOR_Y * C.s + C.ty;
const XL = PL.toS(C, PL.xYear(PL.TL.y0), 0)[0], XR = PL.toS(C, PL.xYear(PL.TL.y1), 0)[0];
const DUH = PL.DU_H * C.s, DU0 = 1395, DU_W = 1760, DU_K = 1680;
const SLAB = { x: 1585, w: 150, h: 13 }, HGH = 200, HGB = [SLAB.x, LY - SLAB.h];
const SUN = { x: 960, r: 150 };
const HO = { pose: 'open', spread: .2, curl: .12 }, ANG = 2.42, HL = 230;   // a little smaller than in c13: the camera is closer here
const hmAt = (wx, wy) => E.handMatrix(wx, wy, ANG, HL, -1);
const TIP = (() => { const p = E.handTip(HO, 1); return E.applyM(hmAt(0, 0), p[0], p[1]); })();
// cameras (screen = world · s + t)
const V0 = { s: 1, tx: 0, ty: 0 };
const VEND = { s: .6, tx: 960 - 960 * .6, ty: 860 - LY * .6 };
const camC = (cx, s, ly) => ({ s, tx: 960 - cx * s, ty: ly - LY * s });   // world x cx at the centre, the line at screen y ly
const VH = camC(1625, 1.7, 870);
const FR0 = camC(1250, 1.42, 830), FR1 = camC(1262, 1.5, 836), STAGE = 900;   // the vignette framing; the stage centre (world x)
function onStage(ctx, dx, sink, fn) {   // a vignette moved onto the stage; it sinks into the line when the next one comes
  if (sink >= 1) return;
  ctx.save(); ctx.beginPath(); ctx.rect(-3000, -3000, 8000, LY + 3000.5); ctx.clip(); ctx.translate(dx, 430 * expoIn(sink)); fn(); ctx.restore();
}
const mixV = PL.camMix;

// ---- the pieces (world coordinates; each rises from the line: g 0..1) ----
const LEAF = (() => { const p = new Path2D(); p.moveTo(0, 0); p.quadraticCurveTo(.5, -.42, 1, 0); p.quadraticCurveTo(.5, .3, 0, 0); p.closePath(); return p; })();
const silo = (w) => mixHex(P.night1, P.ind1, .5 + .2 * w);                                // silhouettes: dark indigo
const rimC = (w) => mixHex(P.blue0, P.halo0, w);                                          // their rim light warms with the sun

function rising(ctx, g, fn, h = 400) {   // draw fn shifted down by (1 − g)·h, clipped above the line
  if (g <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(-3000, -2000, 8000, LY + 2000 + .5); ctx.clip(); ctx.translate(0, (1 - expoOut(g)) * h); fn(); ctx.restore();
}
const BEDS = [[180, 130], [330, 130], [480, 120]];
const PLANTS = (() => { const r = prng(141), o = []; BEDS.forEach(([x, w], i) => { for (let j = 0; j < 5; j++) o.push([x - w / 2 + 14 + j * (w - 28) / 4, 70 + 55 * r(), r(), i * 5 + j]); }); return o; })();
function garden(ctx, t, g, grow, w) {
  rising(ctx, g, () => {
    for (const [x, bw] of BEDS) { ctx.fillStyle = silo(w); ctx.beginPath(); ctx.ellipse(x, LY, bw / 2, 22, 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = rgba(rimC(w), .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, LY, bw / 2, 22, 0, Math.PI * 1.05, Math.PI * 1.5); ctx.stroke(); }
    for (const [x, hh, r, k] of PLANTS) {
      const u = expoOut(clamp((grow - k * .03) / .5)); if (u <= 0) continue;
      const top = LY - 18 - hh * u, sway = 2.5 * Math.sin(t * 1.3 + k);
      ctx.strokeStyle = mixHex(silo(w), P.halo1, .45 * w); ctx.lineWidth = 4.5; ctx.beginPath(); ctx.moveTo(x, LY - 16); ctx.quadraticCurveTo(x, top + hh * .4 * u, x + sway, top); ctx.stroke();
      for (const [dx, dir, sz] of [[0, 1, 34], [0, -1, 28], [-.3, 1, 24], [-.3, -1, 20]]) {
        const ly = top + hh * u * (.15 + (dx ? .45 : 0)) + (dir < 0 ? 8 : 0), s = sz * u * (.8 + .4 * r);
        ctx.save(); ctx.translate(x + sway * (1 - dx), ly); ctx.rotate(dir > 0 ? -.5 : Math.PI + .5); ctx.scale(s, s);
        ctx.fillStyle = mixHex(mixHex(P.ind2, P.blue1, .3), P.halo0, .6 * w); ctx.fill(LEAF); ctx.restore();
      }
    }
    E.person(ctx, 590, LY, 170, { pose: 'sit', dir: -1, light: 1, rim: rimC(w) });
  }, 260);
}
const PEOPLE = [[700, 1, 168], [775, 1, 182], [855, -1, 160], [935, 1, 176], [1010, -1, 170], [1060, -1, 150]];
const POLES = [[640, LY - 236], [1100, LY - 236]];
const LANTERN = (() => { const o = []; for (let i = 1; i <= 9; i++) { const u = i / 10, x = lerp(POLES[0][0], POLES[1][0], u), y = POLES[0][1] + 64 * Math.sin(Math.PI * u); o.push([x, y, u]); } return o; })();
const STRING = (() => { const o = []; for (let i = 0; i <= 40; i++) { const u = i / 40; o.push([lerp(POLES[0][0], POLES[1][0], u), POLES[0][1] + 64 * Math.sin(Math.PI * u), 1.6]); } return o; })();
function dinner(ctx, t, g, str, love, w) {
  rising(ctx, g, () => {
    // poles, table, people (behind the table), cups
    for (const [x, y] of POLES) { ctx.fillStyle = silo(w); ctx.fillRect(x - 3, y, 6, LY - y); }
    PEOPLE.forEach(([x, d, h], i) => {
      const lean = .05 * love * Math.sin(i * 1.7 + 1) + .03 * Math.sin(t * .8 + i);
      E.person(ctx, x, LY, h, { dir: d, light: x < SUN.x ? 1 : -1, back: .55 * w, rim: rimC(w), lean, armR: [lerp(.5, 1.1, love * (i % 2)), lerp(1.4, 2.0, love * (i % 2))], armL: [-.2, -.1], cup: i % 2 ? 'R' : undefined });
    });
    ctx.fillStyle = silo(w); ctx.fillRect(650, LY - 82, 450, 10); ctx.fillRect(668, LY - 74, 8, 74); ctx.fillRect(1074, LY - 74, 8, 74);
    ctx.fillStyle = rgba(P.cream, .55 + .3 * w); ctx.fillRect(650, LY - 84, 450, 3);
    for (let i = 0; i < 7; i++) { const x = 690 + i * 58; ctx.fillStyle = mixHex(silo(w), P.halo0, .5 * w); ctx.fillRect(x - 5, LY - 96, 10, 12); }
  }, 300);
  // the thread of lanterns: draws from the left pole, each lantern lights as the head passes
  if (str > 0 && g > .5) {
    K.trailSpan(ctx, STRING, 0, str, { w: 1.6, spark: str < 1, a: .8 });
    for (const [x, y, u] of LANTERN) {
      const k = smooth(clamp((str - u) / .08)); if (k <= 0) continue;
      const fl = .85 + .15 * Math.sin(t * 7 + x);
      halo(ctx, x, y + 14, 46 * k, .55 * k * fl, P.halo1, P.core1);
      ctx.fillStyle = mixHex(P.halo0, P.core0, .5 * k); ctx.beginPath(); ctx.roundRect(x - 7, y + 4, 14, 20, 5); ctx.fill();
    }
    if (str >= 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(875, LY - 60); ctx.scale(1, .35); ctx.fillStyle = rad(ctx, 0, 0, 360, [[0, rgba(P.halo1, .2)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 360, 0, 6.29); ctx.fill(); ctx.restore(); }
  }
}
const RIVER = (() => { const p = new Path2D(); p.moveTo(1180, LY + 1); p.bezierCurveTo(1200, LY + 20, 1170, LY + 50, 1140, LY + 105); p.lineTo(1380, LY + 105); p.bezierCurveTo(1320, LY + 55, 1270, LY + 25, 1262, LY + 1); p.closePath(); return p; })();
function river(ctx, t, g, ring, w, sunY) {
  if (g <= 0) return;
  ctx.save(); B.clipDisc(ctx, 1220, LY, 260 * expoOut(g)); ctx.clip(RIVER);
  ctx.fillStyle = lin(ctx, 0, LY, 0, LY + 105, [[0, mixHex(P.blue1, P.halo1, .45 * w)], [.4, mixHex(P.ind1, P.blue1, .5)], [1, P.ind0]]); ctx.fillRect(1100, LY, 340, 110);
  // glitter: the sun on the water (short strokes that flicker)
  const r = prng(171); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 46; i++) { const yy = LY + 6 + r() * 92, xx = 1220 + (r() - .5) * (40 + yy - LY) * .9 + 6 * Math.sin(t * .7 + i), fl = .5 + .5 * Math.sin(t * (2 + r() * 3) + i * 2.1); ctx.fillStyle = rgba(P.core1, .55 * w * fl); ctx.fillRect(xx, yy, 6 + 10 * r(), 1.6); }
  if (ring > 0) for (let k = 0; k < 3; k++) { const u = clamp(ring * 1.4 - k * .25); if (u <= 0 || u >= 1) continue; ctx.strokeStyle = rgba(P.core1, .6 * (1 - u)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(1200, LY + 28, 10 + 50 * u, 3 + 12 * u, 0, 0, 6.29); ctx.stroke(); }
  ctx.restore();
  rising(ctx, smooth(span(g, .3, 1)), () => E.person(ctx, 1150, LY, 118, { dir: 1, light: -1, rim: rimC(w), back: .45 * w, lean: .2 + .04 * Math.sin(t * .9), armR: [.95 + .1 * Math.sin(t * 1.1), .5], armL: [-.2, -.1] }), 160);
}
const TREES = (() => { const r = prng(181), o = []; for (let x = 1690; x < 2700; x += 58 + 40 * r()) o.push([x, 210 + 120 * r(), 60 + 40 * r(), r()]); return o; })();
function tree(ctx, x, h, cw, r, w, t) {
  const sway = 2 * Math.sin(t * .6 + x * .01);
  ctx.fillStyle = silo(w * .8); ctx.fillRect(x - 5, LY - h * .45, 10, h * .45);
  const p = new Path2D(); p.moveTo(x + sway, LY - h); p.bezierCurveTo(x + sway + cw * .2, LY - h * .9, x + cw * .55, LY - h * .5, x + cw * .5, LY - h * .32);
  p.quadraticCurveTo(x, LY - h * .22, x - cw * .5, LY - h * .32); p.bezierCurveTo(x - cw * .55, LY - h * .5, x + sway - cw * .2, LY - h * .9, x + sway, LY - h); p.closePath();
  const base = mixHex(P.night1, P.ind1, .45 + .3 * r);
  ctx.fillStyle = lin(ctx, x - cw / 2, 0, x + cw / 2, 0, [[0, mixHex(base, P.halo1, .3 * w)], [.45, base], [1, mixHex(base, P.night0, .3)]]); ctx.fill(p);
}
function woods(ctx, t, g, w, front) {
  rising(ctx, 1, () => {
    TREES.forEach(([x, h, cw, r], i) => { if ((i % 3 === 1) !== front) return; const gi = clamp((g - (x - 1690) / 2400) * 1.6); if (gi <= 0) return; ctx.save(); ctx.translate(0, (1 - expoOut(gi)) * (h + 20)); tree(ctx, x, h, cw, r, w, t); ctx.restore(); });
  }, 0);
}
const HOMES = [[-560, 0], [-330, 1], [-110, 2], [2380, 3], [2560, 4], [-760, 5]];
function homes(ctx, t, g, lit, w) {
  for (const [x, i] of HOMES) {
    const d = Math.abs(x - 960), gi = clamp((g - (d - 1000) / 900) * 2), li = clamp((lit - (d - 1000) / 1100) * 2.5);
    rising(ctx, gi, () => {
      ctx.fillStyle = silo(w); ctx.beginPath(); ctx.moveTo(x - 60, LY); ctx.lineTo(x - 60, LY - 70); ctx.lineTo(x, LY - 116); ctx.lineTo(x + 60, LY - 70); ctx.lineTo(x + 60, LY); ctx.closePath(); ctx.fill();
      ctx.fillStyle = mixHex(P.night0, P.halo0, li); ctx.fillRect(x - 30, LY - 56, 22, 22); ctx.fillRect(x + 10, LY - 56, 22, 22);
      for (let j = 0; j < 4; j++) { ctx.fillStyle = silo(w); ctx.beginPath(); ctx.ellipse(x + 90 + j * 18, LY, 9, 14 + 6 * (j % 2), 0, Math.PI, 0); ctx.fill(); }
      if (i % 2 === 0) E.person(ctx, x + 80, LY, 120, { dir: -1, light: 1, rim: rimC(w), back: .3 });
    }, 160);
    if (li > 0) halo(ctx, x, LY - 45, 80 * li, .4 * li, P.halo1, P.halo0);
  }
}

function chunk(a) {
  const tSun0 = a.T0 + .35, tSun1 = a.garden + 1.6;
  const tPB0 = a.thats + .2, tPB1 = a.all - 1.0, tPH0 = a.subscribe + .7, tPH1 = a.givehour + .3, tPE0 = a.endVO + .35, tPE1 = tPE0 + 4.6;
  const flies = (() => { const r = prng(191), o = []; for (let i = 0; i < 60; i++) o.push([lerp(-500, 2500, r()), LY - 20 - 140 * r(), r() * 6.28, .5 + r()]); return o; })();
  return (ctx, t) => {
    // ---- camera: ONE medium framing for the four vignettes (they change in place on the line, left of you and the glass),
    //      reached by one push during "The hour arrives", then a single very slow push until the pull-back ----
    let v = mixV(V0, FR0, sineIO(span(t, a.T0 + .3, a.garden + .4)));
    v = mixV(v, FR1, sineIO(span(t, a.garden + .4, tPB0 + .3)));
    v = mixV(v, VEND, sineIO(span(t, tPB0, tPB1)));                                              // "That's what the time is for": the wide tableau
    v = mixV(v, VH, sineIO(span(t, tPH0, tPH1)));                                                // the hand, the hour, your hand on the glass
    v = mixV(v, { s: VEND.s * .965, tx: 960 - 960 * VEND.s * .965, ty: 860 - LY * VEND.s * .965 + 8 }, sineIO(span(t, tPE0, tPE1)));
    v = mixV(v, { s: VEND.s * .93, tx: 960 - 960 * VEND.s * .93, ty: 860 - LY * VEND.s * .93 + 16 }, span(t, tPE1 - 2.5, a.end + 1.5));   // the end screen keeps drifting (no hold)
    B.setView(t); v = B.viewCam(v);   // the slow view of c12–c13 hands over and dies out by 588.6
    const S = (x, y) => [x * v.s + v.tx, y * v.s + v.ty];

    // ---- sky: night → golden evening (the warm light grows out of the sun) ----
    const sunU = 1 - (1 - span(t, tSun0, tSun1 + 2.5)) ** 3, w = smooth(span(t, tSun0 + .3, a.dinner));
    const sunY = lerp(LY + SUN.r + 40, LY - 230, sunU) - 14 * smooth(span(t, tSun1 - 1, a.thats + 1)) + 44 * smooth(span(t, a.endVO, a.end + 10));   // keeps climbing a little, then sinks in the end screen
    const cl = clamp((v.s - 1) / .5);   // how close the camera is: close vignettes get a deeper sky (the sun stays the brightest thing)
    B.bgNight(ctx, t, { dawn: .4 - .28 * cl, stars: .6 * (1 - .7 * w), sy: SY12 });
    const [, fy] = S(0, LY), sv = v.s <= 1 ? v.s : v.s ** .4;   // the sun is far away: in the close vignettes it grows and travels less than the land
    const sx = 960 + (SUN.x * v.s + v.tx - 960) * sv / v.s, sy = fy - (LY - sunY) * sv;
    if (w > 0) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      const vs = Math.min(v.s, 1), wc = w * (1 - .45 * cl);   // close vignettes: the warm band hugs the horizon (luma)
      ctx.fillStyle = lin(ctx, 0, fy - 520 * vs, 0, fy, [[0, rgba(P.halo1, 0)], [.45, rgba(P.halo1, .15 * wc)], [.8, rgba(P.halo0, .42 * wc)], [1, rgba(P.core1, .64 * wc)]]); ctx.fillRect(0, 0, W, fy);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rad(ctx, sx, Math.min(sy, fy), 1300 * vs * (.4 + .6 * w), [[0, rgba(P.halo0, .32 * wc)], [.25, rgba(P.halo1, .1 * wc)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(0, 0, W, fy + 200);
      ctx.restore();
    }
    // ---- the world ----
    ctx.save(); ctx.setTransform(v.s, 0, 0, v.s, v.tx, v.ty);
    // the sun (behind the line)
    if (sunU > 0) {
      const sr = SUN.r * sv;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(0, 0, W, fy); ctx.clip();
      halo(ctx, sx, sy, sr * 3 * (.35 + .65 * sunU), .55 * smooth(clamp(sunU * 2.5)), P.halo1, P.halo0);   // its light grows as it clears the line
      ctx.fillStyle = rad(ctx, sx, sy - 30 * sv, sr * 1.05, [[0, P.core0], [.55, P.core1], [.85, P.halo0], [1, P.halo1]]); ctx.beginPath(); ctx.arc(sx, sy, sr, 0, 6.29); ctx.fill();
      ctx.restore();
    }
    // the ground band and the line (c13's last frame: the planner's floor at CAMB)
    ctx.restore();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = lin(ctx, 0, fy, 0, H, [[0, rgba(P.night0, .55 + .25 * cl)], [1, rgba(P.night0, .85 + .1 * cl)]]); ctx.fillRect(0, fy, W, H - fy + 40);
    if (w > 0) { ctx.fillStyle = lin(ctx, 0, fy, 0, fy + 260 * v.s, [[0, rgba(P.halo1, .15 * w)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(0, fy, W, 262 * Math.min(v.s, 1.3)); }
    ctx.restore();
    ctx.save(); ctx.setTransform(v.s, 0, 0, v.s, v.tx, v.ty);
    { const e = smooth(span(t, a.T0 + .6, a.garden + .6)), lw = 2.5 * B.VIEW.k / Math.max(.6, v.s);   // the line runs on beyond both ends as the camera stands back
      K.trailSpan(ctx, [[lerp(XL, -1400, e), LY, lw], [lerp(XR, 3000, e), LY, lw]], 0, 1, { w: lw, spark: false }); }
    // ---- the tableau ----
    homes(ctx, t, span(t, a.make - .3, a.all + .3), span(t, a.all - .1, a.all + 1.6), w);
    // the vignettes, one at a time on the same stretch of line (STAGE): each rises on its word as the one before sinks into the line
    const ring = span(t, a.river, a.river + 2.2) + (t > a.river + 2.2 ? (t - a.river - 2.2) % 4 / 2.8 : 0);
    if (t < tPB0 + 1) {
      onStage(ctx, STAGE - 380, span(t, a.long - .55, a.long + .25), () => garden(ctx, t, span(t, a.garden - .25, a.garden + .9), span(t, a.garden + .2, a.battle + .6), w));
      onStage(ctx, STAGE + 40 - 870, span(t, a.child - .5, a.child + .25), () => dinner(ctx, t, span(t, a.long - .1, a.dinner + .7), sineIO(span(t, a.dinner, a.love + .2)), sineIO(span(t, a.love - .3, a.love + .8)), w));
      ctx.save(); ctx.translate(STAGE + 30, LY); ctx.scale(1.35, 1.35); ctx.translate(-1265, -LY);   // the river is small: on the stage it is shown a little larger
      river(ctx, t, Math.min(span(t, a.child - .1, a.river + .3), 1 - span(t, tPB0, tPB0 + .8)), ring, w, sunY); ctx.restore();
    }
    // "That's what the time is for": as the camera stands back, the whole tableau rises at its own places
    const tab = (k) => span(t, tPB0 + .2 + k * .3, tPB0 + 1.5 + k * .3);
    if (tab(0) > 0) garden(ctx, t, tab(0), 1, w);
    if (tab(1) > 0) dinner(ctx, t, tab(1), tab(1), 1, w);
    if (tab(2) > 0) river(ctx, t, tab(2), ring, w, sunY);
    woods(ctx, t, span(t, a.walk - .3, a.woods + 1.4), w, false);
    // the slab, its pool, its halo (as at the end of c13), brighter on "keep it"
    const keep = Math.sin(Math.PI * span(t, a.keep - .1, a.keep + 1.4)), kept = smooth(span(t, a.keep, a.keep + 1.2));
    const sp = new Path2D(); sp.roundRect(SLAB.x - SLAB.w / 2, LY - SLAB.h, SLAB.w, SLAB.h, SLAB.h * .25);
    E.lightShape(ctx, sp, t, { lit: 1, dust: 0, glow: .7, seed: 81 });
    halo(ctx, SLAB.x, LY - SLAB.h / 2, 110 + 60 * keep, .35 + .3 * keep + .1 * kept, P.halo1, P.halo0);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(SLAB.x, LY + 2); ctx.scale(1, .12);
    ctx.fillStyle = rad(ctx, 0, 0, 420, [[0, rgba(P.halo1, .45 + .2 * kept)], [.5, rgba(P.halo1, .12 + .06 * kept)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 420, 0, 6.29); ctx.fill(); ctx.restore();
    // the hourglass (before you: when you walk past it you pass in front of the glass)
    const top = lerp(.42, 0, smooth(span(t, a.T0, a.keep))), bot = lerp(.52, .8, smooth(span(t, a.T0, a.keep))), flow = 1 - smooth(span(t, a.keep - .2, a.keep + .5));
    K.hourglass(ctx, HGB[0], HGB[1], HGH, t, { top, bot, flow, light: 1, glow: 1 + .15 * flow + .25 * keep });
    if (keep > 0) E.dust(ctx, 93, 240, HGB[0], HGB[1] - HGH * .5, 90 + 60 * keep, HGH * .5, t, .7 * keep);
    // ---- you: into the woods, back to the glass, a hand on it ----
    let duX = DU0, walkPh = null, dir = 1;
    const wk1 = span(t, a.walk - .2, a.nowhere + 1.2), wk2 = span(t, a.ifyou - .2, a.machine - .6);
    if (wk1 > 0) { duX = lerp(DU0, DU_W, sineIO(wk1)); if (wk1 < 1) walkPh = (duX - DU0) / 26; }
    if (wk2 > 0) { duX = lerp(DU_W, DU_K, sineIO(wk2)); dir = -1; if (wk2 < 1) walkPh = (DU_W - duX) / 26; }
    const look0 = .4 * (1 - sineIO(span(t, a.T0 + .3, a.arrives + .4))) + .35 * sineIO(span(t, a.arrives - .2, a.garden));
    const reach = sineIO(span(t, a.decide - .2, a.keep + .1));
    const duO = walkPh != null ? { walk: walkPh, dir, view: 'side' } : { dir };
    if (reach > 0) Object.assign(duO, { armR: [lerp(.15, 1.45, reach), lerp(.1, 1.62, reach)] });
    E.du(ctx, duX, LY, DUH, { look: .25 + .75 * clamp(look0 + .3 * reach), lean: -.03 * clamp(look0), light: 1, back: .25 + .2 * w, armR: [.15, .1], armL: [-.15, -.08], ...duO });
    woods(ctx, t, span(t, a.walk - .3, a.woods + 1.4), w, true);
    // ---- the hourglass: the sand runs out by "keep it"; the hand of light hovers over it, then withdraws ----
    const hIn = sineIO(span(t, a.machine - .5, a.givehour + .2)), hOut = sineIO(span(t, a.only, a.keep + .3));
    if (hIn > 0 && hOut < 1) {
      const k = 1 - (1 - hIn) ** 2, P0 = [3600, -400], hov = [HGB[0] - 85 - TIP[0], HGB[1] - HGH + 20 - TIP[1]];
      const wx = lerp(P0[0], hov[0], k) + 380 * hOut, wy = lerp(P0[1] - 500, hov[1], k) - 6 * Math.sin(t * 1.4) * hIn - 560 * hOut * hOut;
      E.lightHand(ctx, hmAt(wx, wy), t, { ...HO, spread: .2 + .2 * hIn, lum: .58 * (1 - .4 * hOut), dust: 3000 });
    }
    // ---- fireflies over the land (end screen; they blink, they do not fade) ----
    const ff = span(t, a.make, a.all + 1);
    if (ff > 0) for (const [x0, y0, ph, sp2] of flies) { const x = x0 + 30 * Math.sin(t * .3 * sp2 + ph), y = y0 + 14 * Math.sin(t * .5 * sp2 + ph * 2), bl = Math.max(0, Math.sin(t * 1.3 * sp2 + ph)); if (bl < .3 || (x0 + 600) / 3100 > ff) continue; halo(ctx, x, y, 10, .8 * bl, P.halo0, P.core1); }
    ctx.restore();
  };
}
