// Film 13 · B1 · c05 "The honest test" (214.84 'Maybe' → 257.90 "You'll hear that"), one take on one explainer stage.
// docs/shots.md 5.01–5.08. The stage is c04's last frame (the NOW timeline, identity camera) and ends EXACTLY on the lead's plateBrick
// (lib/bubble_seams.mjs): the cold CHIP bar alone on the time axis. Stage px = screen px at camera s 1, centre (960, 540).
//   5.01  the past leaves the axis: 2000 sinks, the 1840s point lifts onto the RAILS bar, which runs out of the frame (generations).
//         A broad money stream flows in from the left into the chip (the NOW ring folds into a chip icon): ≈ 60 % · MCKINSEY 2025.
//   5.02  the CHIP bar grows out of the icon and stops at 3–6 YEARS, then cools (out of date). The axis line is drawn solid with it.
//   5.03  a data center (cutaway hall) rises from the rails bar, all its servers light (this isn't dark fibre); the camera goes to it;
//         its gauge fills: VACANCY 1 % · NORTH AMERICA · JLL, YEAR-END 2025.
//   5.04  push into the oldest rack: its lights still blink, a technician walks up and nods, a coin rises from the rack (earn money).
//   5.05  pull back: the hall is a building that lasts (warm rim); pylons and lines rise; one lateral glide along the rails bar to
//         solar fields and battery containers: RECORD YEAR OF NEW POWER PLANTS · PLANNED · USA 2026 · EIA.
//   5.06  an open model file glows on the bar; its maker's tag tears off and falls (fail); the file keeps glowing.
//   5.07  two people: an electrician with a cable coil, an engineer with a plan (she lifts it on "build").
//   5.08★ the pull-back: everything that lasts stands on the long RAILS bar, the cold chip bar below it. "fewer": the bar narrows.
//         "most of the money": the broad stream pours into the short chip bar. Then the verdict clears the stage: the things sink into
//         the bar, the bar runs out to the right, the stream's tail pours in, the chip icon is absorbed: plateBrick remains.
// All times are phrase anchors (a.*, lib/b1_take.mjs).
import { Path2D, createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './base_kit.mjs';
import * as B from './bubble_kit.mjs';
import * as S from './bubble_seams.mjs';
import * as U from './b1_kit.mjs';
import { stageCam } from './b1_c04.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, lin, rad, halo, prng, dust } = E;
const { COL } = B;
const { rise } = U;

// ------------------------------------------------------------------------------------------------ layout (stage px)
const BR = S.BRICK;                                                  // chip bar 760–1160 × 520–600, axis y 640 (the plate)
const RB = { x0: 760, y0: 360, y1: 420, y1n: 386 };                  // the RAILS bar (what lasts); its top is the ground for the things
const CHIP = { x: 722, y: 560 };                                     // the chip icon at the chip bar's left end
const SY = 560;                                                      // the money stream's centre line
const DCX0 = 815, DCX1 = 1005, DCH = 76;                             // the data center (cutaway hall) on the rails bar
const RACKS = (() => { const r = prng(5051), out = []; for (let i = 0; i < 7; i++) { const x = 832 + i * 23.5, old = i === 0; const lights = []; for (let j = 0; j < 9; j++) for (let k = 0; k < 2; k++) if (r() > (old ? .55 : .12)) lights.push([k, j, r() * 6.3, .4 + r() * 1.5]); out.push({ x, h: old ? 40 : 50, old, lights }); } return out; })();
const OLD = RACKS[0];
const PYL = [1085, 1235], PYH = 124;                                 // pylons
const SOL = [1318, 1360, 1402, 1444];                                // solar panel feet (drawn 1.6×)
const BAT = [1494, 1542];                                            // battery containers (1.6×)
const FILE = { x: 1650, w: 56, h: 72 };                              // the open model file
const PPL = [{ x: 1800, h: 76, seed: 4 }, { x: 1878, h: 74, seed: 7 }];
// the warm glow above the rails bar: a cached sprite (vertical falloff, soft ends), built once (no canvas per frame)
const GLOW = (() => { const w = 64, h = 128, c = createCanvas(w, h), x = c.getContext('2d'), im = x.createImageData(w, h); for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const v = (j / (h - 1)) ** 2.2, u = Math.min(1, i / (w - 8)), e = u * u * (3 - 2 * u), q = (j * w + i) * 4; im.data[q] = 234; im.data[q + 1] = 210; im.data[q + 2] = 149; im.data[q + 3] = Math.round(255 * v * e); } x.putImageData(im, 0, 0); return c; })();
const NOTES = (() => { const r = prng(5077), out = []; for (let i = 0; i < 16; i++) out.push({ o: i * 131 + r() * 60, dy: (r() - .5) * .62, rot: (r() - .5) * .5, w: 34 + r() * 14 }); return out; })();

export function build(a, c04) {
  const NOW = c04.NOW, PA = c04.PA, PB = c04.PB, tPt = c04.tPt;
  const T1 = a.T1, tPlate = T1 - S.SEAM_HALF;
  // ---------- camera ----------
  const z = (t) => S.plateZoom(t, T1), tLand = a.too + .6, sL = z(tLand);
  const KC = [
    ...c04.KT2,                                             // living hold (5.01–5.02): c04's slow push on the NOW timeline, continued
    [a.dcNA - .1, 3.0, 912, 318],                           // to the data center
    [a.older - .1, 3.14, 906, 316],                         // breathing hold: almost full
    [a.earn + .35, 7.0, 860, 336],                          // into the old rack
    [a.plenty - .1, 7.12, 861, 337],
    [a.powerLines + .2, 2.6, 1010, 300],                    // pull back: the hall + the pylons
    [a.planned - .35, 2.6, 1420, 300],                      // glide to the plants
    [a.openM - .1, 2.62, 1432, 300],
    [a.fail - .5, 2.6, 1650, 300],                          // to the open model
    [a.people + .1, 2.62, 1660, 300],
    [a.build + .1, 2.75, 1840, 296],                        // to the people
    [a.soYes - .15, 2.78, 1850, 296],
    [tLand, sL, 960, 520 + 20 / sL],                        // ★ the pull-back; from here the plate's own push (5 %/s about the bar)
  ];
  const cam = (t) => (t >= tLand ? { s: z(t), x: 960, y: 520 + 20 / z(t) } : stageCam(KC, t));
  const proj = (c, x, y) => [(x - c.x) * c.s + W / 2, (y - c.y) * c.s + H / 2];

  // ---------- timings ----------
  const tSink2000 = a.c05 + .15, tLift0 = a.railsW - .45, tLift1 = a.railsW + .65;     // the 1840s point lifts onto the rails bar
  const tBar0 = a.railsW - .05, tBar1 = a.railsW + 1.7;                                // the rails bar runs out of the frame
  const tRing0 = a.dataC - .2, tRing1 = a.dataC + .9;                                  // the NOW ring folds into the chip icon
  const tS0 = a.mostM + .1, tS1 = a.something + .05, tSt0 = a.chips + .2, tSt1 = a.years36 - 1.6;   // stream 1: head in, tail in
  const tC0 = a.years36 - 1.35, tC1 = a.years36 + .1;                                 // the chip bar grows (stops on "three")
  const tDC0 = a.andYet + .05, tDC1 = a.andYet + 1.1, tLit0 = a.darkF - .3, tLit1 = a.darkF + .6;
  const tG0 = a.dcNA + .3, tG1 = a.almostFull + .15;
  const tOutDC = a.older + .05;
  const tWalk0 = a.older - .4, tWalk1 = a.earn - .3;
  const tPyl0 = a.powerLines - .5, tPyl1 = a.powerLines + .3, tWire1 = a.powerLines + 1.0;
  const tSol0 = a.record - .55, tSol1 = a.record + .3;
  const tFile0 = a.openM - .25, tFile1 = a.openM + .45, tFail = a.fail;
  const tPpl0 = a.people - .3, tPpl1 = a.people + .45;
  const tSweep = a.too - .1, tFew0 = a.fewer - .1, tFew1 = a.fewer + .9;
  const tS2a = a.notOnes - .2, tS2b = a.mostMoney + .35, tS2c = a.mostMoney + .6, tS2d = tPlate - .1;   // stream 2
  const tClr = a.mostMoney + .8;                                                       // the verdict clears the stage
  const tRoll0 = tClr + .3, tRoll1 = tPlate - .05;
  const chipLabel = 'CHIPS · 3–6 YEARS', CL1 = 'CHIPS · ', LBL = { size: 30 };
  const clW = K.measure(chipLabel, 30, false), clX0 = 960 - clW / 2, clX1 = clX0 + K.measure(CL1, 30, false);

  function draw(ctx, t) {
    if (t >= tPlate) { S.plateBrick(ctx, t, T1); return; }
    const c = cam(t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // the night (the plate's own gradient, screen space)
    ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, P.ind0]]); ctx.fillRect(0, 0, W, H);
    ctx.setTransform(c.s, 0, 0, c.s, W / 2 - c.x * c.s, H / 2 - c.y * c.s);
    axis(ctx, t);
    stream(ctx, t);
    chipBar(ctx, t);
    timeline(ctx, t);
    railsBar(ctx, t, c);
    chipIcon(ctx, t);
    chipText(ctx, t);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    screenText(ctx, t, c);
    ctx.restore();
  }

  // ============================================================================================== the axis, the timeline of c04
  function axis(ctx, t) {
    // solid faint axis (the plate's line); left of NOW it shows as c04's gold past line retracts; right of NOW it is drawn solid
    // over c04's dashed line while the chip bar grows
    const xs = lerp(NOW[0], 1620, sineIO(span(t, tC0 - .1, tC1 + .2)));
    ctx.strokeStyle = rgba(COL.paper1, .35); ctx.lineWidth = 2;
    const xl = Math.min(NOW[0], lerp(PA[0], NOW[0], sineIO(span(t, tLift0, tLift1))));   // where c04's gold line has gone
    ctx.beginPath(); if (xl > 300) { ctx.moveTo(300, BR.axisY); ctx.lineTo(xl, BR.axisY); } if (xs > NOW[0] + 1) { ctx.moveTo(NOW[0], BR.axisY); ctx.lineTo(xs, BR.axisY); } ctx.stroke();
    if (xs < 1620) {
      ctx.save(); ctx.setLineDash([10, 14]); ctx.strokeStyle = rgba(COL.paper1, .3); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(Math.max(xs, NOW[0] + 20), BR.axisY); ctx.lineTo(1620, BR.axisY); ctx.stroke(); ctx.restore();
    }
  }
  function timeline(ctx, t) {
    // c04's past line (gold) retracts into NOW as the 1840s point lifts away; the 2000 point sinks; NOW pulses until it folds
    const ret = sineIO(span(t, tLift0, tLift1));
    if (ret < 1) {
      const xl = lerp(PA[0], NOW[0], ret);
      B.inkLine(ctx, [[NOW[0], NOW[1]], [xl, NOW[1]]], 1, { col: P.halo1, w: 3, glow: .5 });
    }
    c04.timelinePoint(ctx, PB, '2000', 1 - smooth(span(t, tSink2000, tSink2000 + .8)), t);
    // 1840s: the label sinks in place, the point lifts on an arc to the rails bar's left end and becomes its cap
    const lk = 1 - smooth(span(t, tLift0 - .25, tLift0 + .3));
    if (lk > 0) K.maskLine(ctx, [['1840s', 0]], PA[0], PA[1] + 70, 44, lk, { serif: false, col: P.cream, glow: false, align: 'center' });
    const u = sineIO(span(t, tLift0, tLift1)), cap = smooth(span(t, tLift1 - .1, tLift1 + .5));
    if (cap < 1) {
      const p = arcPt(PA, [RB.x0, (RB.y0 + RB.y1) / 2], u, -150);
      halo(ctx, p[0], p[1], 46, .4 * (1 - cap) + .25 * Math.sin(Math.PI * u), P.halo1, P.core0);
      ctx.fillStyle = mixHex(P.halo1, P.core0, .3); ctx.beginPath(); ctx.arc(p[0], p[1], 10 * (1 - cap), 0, 6.29); ctx.fill();
    }
    // the NOW ring (until it folds into the chip icon) and its label
    const fold = span(t, tRing0, tRing1);
    if (fold <= 0) {
      const pr = 16 + 2.5 * Math.sin((t - tPt) * 3.2);
      ctx.strokeStyle = rgba(P.halo1, .95); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(NOW[0], NOW[1], pr, 0, 6.29); ctx.stroke();
      halo(ctx, NOW[0], NOW[1], 50, .15, P.halo1, P.core0);
    }
    c04.ping(ctx, t, a.railsW - .4);   // the question rings stop before the ≈ 60 % text rises
    const nl = 1 - smooth(span(t, tRing0 - .45, tRing0 + .05));
    if (nl > 0) K.maskLine(ctx, [['NOW', 0]], NOW[0], NOW[1] + 70, 44, nl, { serif: false, col: P.cream, glow: false, align: 'center' });
  }
  const arcPt = (p0, p1, u, bow) => { const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2 + bow; const v = 1 - u; return [v * v * p0[0] + 2 * v * u * mx + u * u * p1[0], v * v * p0[1] + 2 * v * u * my + u * u * p1[1]]; };

  // ============================================================================================== the chip: icon, bar, label
  function chipIcon(ctx, t) {
    // the NOW ring lifts and folds into a chip (rounded square, pins); money makes it glow warm, then it goes cold ("doesn't");
    // in the verdict it is absorbed into the bar's left end
    const f = span(t, tRing0, tRing1); if (f <= 0) return;
    const u = sineIO(f), ab = sineIO(span(t, tClr + .15, tClr + 1.0)); if (ab >= 1) return;
    const p = arcPt(NOW, [CHIP.x, CHIP.y], u, -20), sz = lerp(33, 46, u) * (1 - ab), r = lerp(16.5, 7, u) * (1 - ab), x = lerp(p[0], BR.x0 + 4, ab);
    const warm = smooth(span(t, tS1 - .3, tS1 + .2)) * (1 - smooth(span(t, a.doesnt - .1, a.doesnt + .7)));
    const cold = smooth(span(t, a.doesnt - .1, a.doesnt + .7));
    const col = mixHex(mixHex(P.halo1, COL.cool, u), mixHex(COL.cool2, COL.loss, .3), cold);
    ctx.save();
    ctx.fillStyle = mixHex(P.night0, COL.coolDeep, .35 + .3 * warm); ctx.beginPath(); ctx.roundRect(x - sz / 2, p[1] - sz / 2, sz, sz, r); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 3 * (1 - ab * .5); ctx.stroke();
    const pins = smooth(span(f, .55, 1)) * (1 - ab);
    if (pins > 0) {
      ctx.lineWidth = 2.5; ctx.beginPath();
      for (let i = 0; i < 4; i++) { const o = (i - 1.5) * sz * .2, L = 7 * pins; ctx.moveTo(x + o, p[1] - sz / 2); ctx.lineTo(x + o, p[1] - sz / 2 - L); ctx.moveTo(x + o, p[1] + sz / 2); ctx.lineTo(x + o, p[1] + sz / 2 + L); ctx.moveTo(x - sz / 2, p[1] + o); ctx.lineTo(x - sz / 2 - L, p[1] + o); ctx.moveTo(x + sz / 2, p[1] + o); ctx.lineTo(x + sz / 2 + L, p[1] + o); }
      ctx.stroke();
      ctx.fillStyle = rgba(col, .55); ctx.fillRect(x - sz * .2, p[1] - sz * .2, sz * .4, sz * .4);
    }
    ctx.restore();
    if (warm > 0) halo(ctx, x, p[1], 70, .5 * warm, P.halo1, P.core0);
  }
  function chipBar(ctx, t) {
    // the plate's bar (identical code at the end): cool glow, cold gradient, a lit top edge. While it grows it burns bright cool.
    const g = expoOut(span(t, tC0, tC1)); if (g <= 0) return;
    const { x0, x1, y0, y1 } = BR, br = .95 + .05 * Math.sin(t * 1.7), xe = lerp(x0, x1, g), cool = smooth(span(t, a.years36 + .2, a.years36 + 1.3));
    ctx.fillStyle = rad(ctx, (x0 + x1) / 2, y0, 700, [[0, rgba(COL.cool2, .14 * br * smooth(span(t, tC0, tC1 + .5)))], [1, rgba(COL.cool2, 0)]]); ctx.fillRect(-1200, -800, 4400, 2800);
    const top = mixHex(COL.cool, mixHex(COL.cool2, COL.loss, .35), cool), bot = mixHex(COL.cool2, COL.loss, cool);
    ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, top], [1, bot]]); ctx.beginPath(); ctx.roundRect(x0, y0, Math.max(1, xe - x0), y1 - y0, Math.min(6, (xe - x0) / 2)); ctx.fill();
    if (xe - x0 > 12) { ctx.strokeStyle = rgba(COL.cool, .55 * br); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 6, y0 + 1); ctx.lineTo(xe - 6, y0 + 1); ctx.stroke(); }
    if (cool < 1) halo(ctx, xe, (y0 + y1) / 2, 90, .5 * (1 - cool) * (1 - g * .5), COL.cool, '#f4f7ff');
  }
  function chipText(ctx, t) {
    // 'CHIPS · ' on "Chips", '3–6 YEARS' on "three to six years" (the plate's label, built in two parts at their final positions);
    // it sinks while the camera is close on the rails bar and comes back in the pull-back
    const out = 1 - smooth(span(t, a.andYet - .3, a.andYet + .2)), back = rise(span(t, a.too - .15, a.too + .55));
    const k1 = t < a.soYes ? rise(span(t, a.chips - .05, a.chips + .6)) * out : back, k2 = t < a.soYes ? rise(span(t, a.years36 - .05, a.years36 + .6)) * out : back;
    const o = { serif: false, col: P.halo2, glow: false };
    if (k1 >= 1 && k2 >= 1) { E.glowText(ctx, chipLabel, 960, BR.y0 - 34, { size: 30, font: 'Inter', weight: 600, col: P.halo2, glow: false, align: 'center' }); return; }
    if (k1 > 0) K.maskLine(ctx, [[CL1, 0]], clX0, BR.y0 - 34, 30, k1, o);
    if (k2 > 0) K.maskLine(ctx, [['3–6 YEARS', 0]], clX1, BR.y0 - 34, 30, k2, o);
  }

  // ============================================================================================== the money stream
  function streamSpan(t) {
    // [tail, head] in stage x. Stream 1 (5.01): the head flows in from off left to the chip, the tail follows (all poured in).
    // Stream 2 (5.08): again, broad, into the short chip bar; its tail is in before the plate.
    const end = CHIP.x - 22;
    if (t < tSt1 + .1) return [lerp(-900, end, sineIO(span(t, tSt0, tSt1))), lerp(-900, end, sineIO(span(t, tS0, tS1)))];
    const end2 = lerp(end, BR.x0, smooth(span(t, tClr + .15, tClr + 1.0)));
    return [lerp(-1100, end2, sineIO(span(t, tS2c, tS2d))), lerp(-1100, end2, sineIO(span(t, tS2a, tS2b)))];
  }
  function stream(ctx, t) {
    const [x0, x1] = streamSpan(t); if (x1 - x0 < 1) return;
    const hw = (x) => 40 + 22 * clamp((CHIP.x - x) / 900);      // half width: broad far left, the bar's height at the chip
    const p = new Path2D(), n = 24;
    for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); i ? p.lineTo(x, SY - hw(x)) : p.moveTo(x, SY - hw(x)); }
    for (let i = n; i >= 0; i--) { const x = lerp(x0, x1, i / n); p.lineTo(x, SY + hw(x)); }
    p.closePath();
    ctx.save();
    ctx.fillStyle = lin(ctx, 0, SY - 62, 0, SY + 62, [[0, mixHex(P.halo1, COL.paper0, .3)], [.5, P.halo2], [1, mixHex(P.shade0, P.night1, .3)]]); ctx.globalAlpha = .82; ctx.fill(p);
    ctx.globalAlpha = 1; ctx.clip(p);
    // banknotes drifting along inside it (the money, from the film's own paper)
    for (const nt of NOTES) {
      const x = -1200 + ((nt.o + (t - a.c05) * 120) % 2100);
      if (x < x0 - 60 || x > x1 + 60) continue;
      B.banknote(ctx, x, SY + nt.dy * hw(x) * 1.6, nt.w, nt.rot + .08 * Math.sin(t * .8 + nt.o), { simple: true, lum: .75 });
    }
    ctx.restore();
    ctx.strokeStyle = rgba(P.core1, .55); ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); i ? ctx.lineTo(x, SY - hw(x)) : ctx.moveTo(x, SY - hw(x)); } ctx.stroke();
  }

  // ============================================================================================== the rails bar and what lasts
  function railsX1(t) { return t < tBar1 ? lerp(RB.x0, 3300, sineIO(span(t, tBar0, tBar1))) : 6200; }
  function railsBar(ctx, t, c) {
    const x1 = railsX1(t); if (x1 <= RB.x0 + .5) return;
    const roll = span(t, tRoll0, tRoll1) ** 1.6, x0 = lerp(RB.x0, 2100, roll);   // accelerates out to the right, leaves the frame just before the plate
    const y0 = RB.y0, y1 = lerp(RB.y1, RB.y1n, sineIO(span(t, tFew0, tFew1)));
    // the warm glow above the bar (the things stand in it), then the things, then the bar body over their feet
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .2;
    const gh = 130, gw = Math.min(64, (x1 - x0) / 2);
    ctx.drawImage(GLOW, 0, 0, 64, 128, x0, y0 - gh, gw, gh);
    if (x1 - x0 > 2 * gw) ctx.drawImage(GLOW, 63, 0, 1, 128, x0 + gw, y0 - gh, x1 - x0 - 2 * gw, gh);
    ctx.translate(x1, 0); ctx.scale(-1, 1); ctx.drawImage(GLOW, 0, 0, 64, 128, 0, y0 - gh, gw, gh);
    ctx.restore();
    things(ctx, t, c);
    const bar = new Path2D(); bar.roundRect(x0, y0, x1 - x0, y1 - y0, Math.min(8, (y1 - y0) / 2));
    const gl = 64 / Math.max(1, c.s / 1.1);   // the lit depth of the bar body: full at the wide view, a thin lit ledge when close
    ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + gl, [[0, P.halo0], [.1, P.halo1], [.5, mixHex(P.halo1, P.shade0, .6)], [1, mixHex(P.night1, P.shade1, .3)]]); ctx.fill(bar);
    ctx.fillStyle = rgba(P.core0, .8); ctx.fillRect(x0 + 4, y0, x1 - x0 - 8, 2);
    // on "too": a light runs along the top edge (the rails will stay)
    const sw = span(t, tSweep, tSweep + 1.6);
    if (sw > 0 && sw < 1) { const sx = lerp(x0 - 100, 2300, sineIO(sw)); halo(ctx, sx, y0 + 4, 160, .55 * Math.sin(Math.PI * sw), P.halo0, P.core0); }
  }
  // a thing rises out of the bar top (k 0 → 1) and sinks back into it (the verdict)
  function standing(ctx, x0, x1, h, k, fn) {
    if (k <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, RB.y0 - h - 400, x1 - x0, h + 400); ctx.clip();
    ctx.translate(0, (1 - k) * (h + 6)); fn(); ctx.restore();
  }
  const sinkK = (t, i) => 1 - (span(t, tClr + i * .08, tClr + .75 + i * .08)) ** 2;
  function things(ctx, t, c) {
    const kDC = rise(span(t, tDC0, tDC1)) * sinkK(t, 4);
    standing(ctx, DCX0 - 20, DCX1 + 20, DCH + 70, kDC, () => dataCenter(ctx, t));
    const kP = rise(span(t, tPyl0, tPyl1)) * sinkK(t, 3);
    standing(ctx, PYL[0] - 140, PYL[1] + 120, PYH + 20, kP, () => pylons(ctx, t, kP));
    const kS = rise(span(t, tSol0, tSol1)) * sinkK(t, 2);
    standing(ctx, SOL[0] - 40, BAT[1] + 40, 80, kS, () => plants(ctx, t));
    const kF = rise(span(t, tFile0, tFile1)) * sinkK(t, 1);
    standing(ctx, FILE.x - 60, FILE.x + 60, FILE.h + 40, kF, () => modelFile(ctx, t));
    tag(ctx, t, kF);
    const kH = rise(span(t, tPpl0, tPpl1)) * sinkK(t, 0);
    standing(ctx, PPL[0].x - 60, PPL[1].x + 60, 110, kH, () => people(ctx, t));
  }

  // ---------- the data center: a cutaway hall, racks of servers inside ----------
  function dataCenter(ctx, t) {
    const y = RB.y0, top = y - DCH, warm = smooth(span(t, a.buildings - .2, a.buildings + .8));
    const lit = (i) => smooth(span(t, tLit0 + i * .1, tLit0 + .35 + i * .1));
    // the hall: back wall, floor, roof slab with units, side walls (a section: we look into it)
    ctx.fillStyle = lin(ctx, 0, top, 0, y, [[0, mixHex(P.night0, P.ind0, .5)], [1, P.night0]]); ctx.fillRect(DCX0, top, DCX1 - DCX0, DCH);
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .2); ctx.fillRect(DCX0 - 6, top - 7, DCX1 - DCX0 + 12, 7);
    for (const ux of [.18, .45, .74]) ctx.fillRect(DCX0 + ux * (DCX1 - DCX0) - 12, top - 17, 24, 11);
    ctx.fillStyle = P.ind2; ctx.fillRect(DCX0 - 6, top - 1, 6, DCH + 1); ctx.fillRect(DCX1, top - 1, 6, DCH + 1);
    // racks
    for (let i = 0; i < RACKS.length; i++) {
      const r = RACKS[i], rx = r.x, ry = y - r.h, rw = 15;
      ctx.fillStyle = r.old ? mixHex(P.ind1, P.shade1, .25) : mixHex(P.ind1, P.night0, .2); ctx.fillRect(rx, ry, rw, r.h);
      ctx.fillStyle = rgba(P.blue0, .5); ctx.fillRect(rx, ry, rw, .8);
      const L = lit(i);
      for (const [k, j, ph, f] of r.lights) {
        const am = r.old ? .55 : .3, b = L * (1 - am + am * (.5 + .5 * Math.sin(t * f * (r.old ? 2.2 : 1.1) + ph))) * (r.old ? .8 : 1);   // r3 calm: only the old rack blinks hard
        if (b < .02) continue;
        ctx.fillStyle = mixHex(COL.coolDeep, COL.cool, Math.min(1, b)); ctx.globalAlpha = .35 + .65 * Math.min(1, b);
        ctx.fillRect(rx + 2.5 + k * 6, ry + 4 + j * (r.h - 8) / 9, 3.6, 1.7);
      }
      ctx.globalAlpha = 1;
    }
    // the cool light of the servers on the floor and the walls (lit, not dark fibre)
    const Lall = lit(3);
    if (Lall > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, (DCX0 + DCX1) / 2, y - 20, 120, [[0, rgba(COL.cool2, .18 * Lall)], [1, rgba(COL.cool2, 0)]]); ctx.fillRect(DCX0, top, DCX1 - DCX0, DCH); ctx.restore(); }
    // a building that lasts: on "Buildings" its roof and walls take a warm rim
    ctx.fillStyle = rgba(P.halo1, .25 + .55 * warm); ctx.fillRect(DCX0 - 6, top - 7, DCX1 - DCX0 + 12, 1.6);
    if (warm > 0) { ctx.fillStyle = rgba(P.halo1, .5 * warm); ctx.fillRect(DCX0 - 6, top, 1.4, DCH); ctx.fillRect(DCX1 + 4.6, top, 1.4, DCH); }
    // the gauge on the roof: occupancy fills to 99 % ("almost full")
    const gk = rise(span(t, tG0 - .3, tG0 + .2)) * (1 - smooth(span(t, tOutDC, tOutDC + .4)));
    if (gk > 0) {
      const gx0 = DCX0 + 8, gx1 = DCX1 - 8, gy = top - 34, f = .99 * sineIO(span(t, tG0, tG1));
      ctx.save(); ctx.globalAlpha = gk;
      ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.beginPath(); ctx.roundRect(gx0, gy, gx1 - gx0, 8, 4); ctx.fill();
      ctx.strokeStyle = rgba(COL.cool2, .6); ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = lin(ctx, gx0, 0, gx1, 0, [[0, COL.coolDeep], [1, COL.cool]]); ctx.beginPath(); ctx.roundRect(gx0 + 1.5, gy + 1.5, Math.max(1, (gx1 - gx0 - 3) * f), 5, 2.5); ctx.fill();
      ctx.restore();
      if (f > .9) halo(ctx, gx0 + (gx1 - gx0) * f, gy + 4, 22, .5 * smooth(span(f, .9, .99)) * gk, COL.cool, '#f4f7ff');
    }
    // the technician (5.04): walks up to the old rack, stops, looks, nods on "earn money"
    const wk = smooth(span(t, tWalk0 - .6, tWalk0)) * (1 - smooth(span(t, a.powerLines, a.powerLines + .6)));
    if (wk > 0 || t < tWalk0) {
      const u = sineIO(span(t, tWalk0, tWalk1)), x = lerp(948, 868, u), walking = u > 0 && u < 1;
      const nod = Math.sin(Math.PI * span(t, a.earn - .1, a.earn + .7)) * .1;
      E.lightPool(ctx, x - 14, x + 14, y, 10, 6, .25);
      E.person(ctx, x, y, 38, { dir: -1, walk: walking ? (948 - x) / 6 : undefined, look: .3 * smooth(span(t, tWalk1 - .2, tWalk1 + .4)), lean: nod, rim: COL.cool });
      ctx.save(); ctx.strokeStyle = rgba(COL.cool2, .8); ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(x - 1.6, y - 30); ctx.lineTo(x - 1, y - 24); ctx.lineTo(x + .2, y - 30); ctx.stroke(); ctx.fillStyle = COL.cool; ctx.fillRect(x - 2, y - 24, 2, 2.4); ctx.restore();
    }
    // the coin: rises out of the old rack's top on "earn money" (it still pays)
    const ck = rise(span(t, a.earn - .05, a.earn + .6)) * (1 - smooth(span(t, a.powerLines - .4, a.powerLines + .2)));
    if (ck > 0) {
      const cx = OLD.x + 7.5, cyT = y - OLD.h;
      ctx.save(); ctx.beginPath(); ctx.rect(cx - 20, cyT - 40, 40, 40); ctx.clip();
      B.coin(ctx, cx, cyT - 6 * ck, 4.2, { lit: .2 }); ctx.restore();
      halo(ctx, cx, cyT - 6 * ck, 11, .22 * ck, P.halo1, P.core0);
    }
  }

  // ---------- pylons and power lines ----------
  function pylons(ctx, t, k) {
    const y = RB.y0, wireU = sineIO(span(t, tPyl1 - .2, tWire1));
    const sway = .6 * Math.sin(t * .9);
    ctx.save(); ctx.lineJoin = 'round';
    const arms = [];
    for (const px of PYL) {
      const h = PYH, bw = 17, tw = 4;
      ctx.strokeStyle = mixHex(P.ind2, P.blue1, .25); ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(px - bw, y); ctx.lineTo(px - tw, y - h); ctx.lineTo(px + tw, y - h); ctx.lineTo(px + bw, y); ctx.stroke();
      ctx.lineWidth = 1; ctx.beginPath();   // lattice
      for (let i = 0; i < 7; i++) { const v0 = i / 7, v1 = (i + 1) / 7, w0 = lerp(bw, tw, v0), w1 = lerp(bw, tw, v1); ctx.moveTo(px - w0, y - h * v0); ctx.lineTo(px + w1, y - h * v1); ctx.moveTo(px + w0, y - h * v0); ctx.lineTo(px - w1, y - h * v1); }
      ctx.stroke();
      ctx.lineWidth = 2.4; ctx.beginPath();
      for (const [v, aw] of [[.82, 32], [.64, 24]]) { const wv = lerp(bw, tw, v); ctx.moveTo(px - aw, y - h * v); ctx.lineTo(px + aw, y - h * v); ctx.moveTo(px - aw, y - h * v); ctx.lineTo(px - wv, y - h * v + 9); ctx.moveTo(px + aw, y - h * v); ctx.lineTo(px + wv, y - h * v + 9); arms.push([px - aw, y - h * v], [px + aw, y - h * v]); }
      ctx.stroke();
      ctx.strokeStyle = rgba(P.halo1, .45); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px + tw, y - h); ctx.lineTo(px + bw, y); ctx.stroke();
    }
    ctx.restore();
    // the lines: from the hall's roof over both pylons on to the plants (drawn from left to right, warm)
    if (wireU <= 0) return;
    const tips = [[0, 1], [2, 3]];   // arm index pairs per level (left, right) for pylon 0 (0..3) and pylon 1 (4..7)
    ctx.save(); ctx.strokeStyle = rgba(P.halo1, .75); ctx.lineWidth = 1.1;
    for (let lv = 0; lv < 2; lv++) {
      const A0 = arms[lv * 2], A1 = arms[lv * 2 + 1], B0 = arms[4 + lv * 2], B1 = arms[4 + lv * 2 + 1];
      const segs = [[[DCX1 - 10, RB.y0 - DCH - 8], A0], [A1, B0], [B1, [1330, RB.y0 - 30 + lv * 6]]];
      const tot = segs.length;
      segs.forEach(([p, q], i) => {
        const u = clamp(wireU * tot - i); if (u <= 0) return;
        const pts = []; for (let j = 0; j <= 16; j++) { const f = j / 16 * u, sag = 14 * 4 * f * (1 - f) + sway * Math.sin(Math.PI * f); pts.push([lerp(p[0], q[0], f), lerp(p[1], q[1], f) + sag]); }
        ctx.beginPath(); pts.forEach((pt, j) => (j ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1]))); ctx.stroke();
      });
    }
    ctx.restore();
    void k; void tips;
  }

  // ---------- solar fields and battery containers ----------
  function plants(ctx, t) {
    const y = RB.y0;
    for (const sx0 of SOL) {
      ctx.save(); ctx.translate(sx0, y); ctx.scale(1.6, 1.6); ctx.translate(-sx0, -y); const sx = sx0;
      ctx.fillStyle = P.ind2; ctx.fillRect(sx - 1, y - 12, 2, 12);
      const p = new Path2D(); p.moveTo(sx - 13, y - 9); p.lineTo(sx + 11, y - 21); p.lineTo(sx + 13, y - 17); p.lineTo(sx - 11, y - 5); p.closePath();
      ctx.fillStyle = lin(ctx, 0, y - 21, 0, y - 5, [[0, mixHex(COL.cool2, P.blue1, .4)], [1, COL.coolDeep]]); ctx.fill(p);
      ctx.strokeStyle = rgba(COL.cool, .35); ctx.lineWidth = .5; ctx.beginPath();
      for (const f of [.33, .66]) { ctx.moveTo(lerp(sx - 13, sx + 11, f), lerp(y - 9, y - 21, f)); ctx.lineTo(lerp(sx - 11, sx + 13, f), lerp(y - 5, y - 17, f)); }
      ctx.stroke();
      ctx.strokeStyle = rgba(P.halo1, .5); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(sx - 13, y - 9); ctx.lineTo(sx + 11, y - 21); ctx.stroke();
      ctx.restore();
    }
    BAT.forEach((bx, i) => {
      ctx.save(); ctx.translate(bx, y); ctx.scale(1.6, 1.6); ctx.translate(-bx, -y);
      ctx.fillStyle = lin(ctx, 0, y - 16, 0, y, [[0, mixHex(P.ind2, P.blue1, .2)], [1, P.ind1]]); ctx.fillRect(bx - 13, y - 16, 26, 16);
      ctx.fillStyle = rgba(P.night0, .45); for (let j = 0; j < 5; j++) ctx.fillRect(bx - 11 + j * 5, y - 13, 1.4, 10);
      ctx.fillStyle = rgba(P.halo1, .6); ctx.fillRect(bx - 13, y - 16, 26, .9);
      const b = .5 + .5 * Math.sin(t * 1.3 + i * 2); ctx.fillStyle = mixHex(COL.coolDeep, COL.cool, b); ctx.fillRect(bx + 8, y - 12, 2.2, 2.2);
      ctx.restore();
    });
  }

  // ---------- the open model file and its maker's tag ----------
  function filePath() { const { x, w, h } = FILE, y = RB.y0, p = new Path2D(); p.moveTo(x - w / 2, y); p.lineTo(x - w / 2, y - h); p.lineTo(x + w / 2 - 12, y - h); p.lineTo(x + w / 2, y - h + 12); p.lineTo(x + w / 2, y); p.closePath(); return p; }
  function modelFile(ctx, t) {
    const { x, w, h } = FILE, y = RB.y0, br = .92 + .08 * Math.sin(t * 1.4);
    halo(ctx, x, y - h / 2, 110, .32 * br, COL.cool2, '#f4f7ff');
    ctx.fillStyle = lin(ctx, 0, y - h, 0, y, [[0, '#f4f7ff'], [.5, COL.cool], [1, COL.cool2]]); ctx.fill(filePath());
    ctx.fillStyle = rgba(COL.coolDeep, .7); const fold = new Path2D(); fold.moveTo(x + w / 2 - 12, y - h); fold.lineTo(x + w / 2 - 12, y - h + 12); fold.lineTo(x + w / 2, y - h + 12); fold.closePath(); ctx.fill(fold);
    ctx.fillStyle = rgba(COL.coolDeep, .55); for (let i = 0; i < 6; i++) ctx.fillRect(x - w / 2 + 7, y - h + 18 + i * 6.5, (w - 14) * (i % 3 === 2 ? .6 : 1), 2);   // rows of numbers (weights)
  }
  function tag(ctx, t, k) {
    // the maker's tag hangs on a string from the file's corner; on "fail" the string snaps and it falls, tumbling, out of the frame
    if (k <= 0) return;
    const { x, w, h } = FILE, ax = x - w / 2 + 6, ay = RB.y0 - h + 6, f = t - tFail;
    let tx = ax - 16, ty = ay + 14 + .8 * Math.sin(t * 1.1), rot = -.25 + .04 * Math.sin(t * 1.3);
    if (f > 0) { tx -= 22 * f; ty += 210 * f * f + 8 * f; rot += 2.6 * f; }
    if (ty > RB.y0 + 900) return;
    ctx.save();
    if (f <= 0) { ctx.strokeStyle = rgba(P.halo2, .7); ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(tx + 6, ty - 4); ctx.stroke(); }
    else if (f < .25) { ctx.strokeStyle = rgba(P.halo2, .7 * (1 - f / .25)); ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax - 4, ay + 6 + 20 * f); ctx.stroke(); }
    ctx.translate(tx, ty); ctx.rotate(rot); ctx.translate(0, (1 - k) * 30);
    ctx.fillStyle = lin(ctx, 0, -7, 0, 7, [[0, COL.paper1], [1, COL.paper2]]); ctx.beginPath(); ctx.moveTo(-14, -7); ctx.lineTo(9, -7); ctx.lineTo(15, 0); ctx.lineTo(9, 7); ctx.lineTo(-14, 7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(COL.ink, .75); ctx.beginPath(); ctx.arc(-7, 0, 3.2, 0, 6.29); ctx.fill(); ctx.fillRect(-2, -2, 9, 1.4); ctx.fillRect(-2, 1, 6, 1.4);
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(10, 0, 1.4, 0, 6.29); ctx.fill();
    ctx.restore();
  }

  // ---------- the people who know how to build it ----------
  function people(ctx, t) {
    const y = RB.y0, lift = sineIO(span(t, a.build - .3, a.build + .6));
    // the electrician: a coil of cable over his forearm, the end in his hand
    const A = PPL[0];
    const hA = B.worker(ctx, A.x, y, A.h, t, { dir: 1, seed: A.seed, armR: [.55, 1.35], armL: [.35, 1.2], rim: mixHex(P.blue0, P.halo1, .4) });
    if (hA && hA.R) { ctx.save(); ctx.strokeStyle = rgba(P.halo1, .7); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(hA.R[0] + 2, hA.R[1] + 5, 6, 7.5, .2, 0, 6.29); ctx.stroke(); ctx.beginPath(); ctx.ellipse(hA.R[0] + 3, hA.R[1] + 5, 4.5, 6, .2, 0, 6.29); ctx.stroke(); ctx.beginPath(); ctx.moveTo(hA.R[0] + 6, hA.R[1] + 11); ctx.quadraticCurveTo(hA.R[0] + 14, y - 4, hA.R[0] + 24, y - 1); ctx.stroke(); ctx.restore(); }
    // the engineer: a plan in both hands; on "build" she lifts it to show it
    const Bq = PPL[1];
    const hB = B.worker(ctx, Bq.x, y, Bq.h, t, { dir: -1, seed: Bq.seed, look: .25, armR: [lerp(.7, 1.15, lift), lerp(1.5, 1.9, lift)], armL: [lerp(.6, 1.05, lift), lerp(1.45, 1.85, lift)], rim: mixHex(P.blue0, P.halo1, .4) });
    if (hB && hB.R && hB.L) {
      const cx = (hB.R[0] + hB.L[0]) / 2 - 4, cy = Math.min(hB.R[1], hB.L[1]) - 5, pw = 22, ph = 15;
      const p = new Path2D(); p.rect(cx - pw / 2, cy - ph / 2, pw, ph);
      B.paperFill(ctx, p, { lum: .8, seed: 5093, fibre: 0 });
      ctx.strokeStyle = rgba(COL.ink, .6); ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(cx - 8, cy + 3); ctx.lineTo(cx - 2, cy - 3); ctx.lineTo(cx + 5, cy + 1); ctx.lineTo(cx + 8, cy - 4); ctx.stroke();
    }
  }

  // ============================================================================================== screen-space text (fixed sizes)
  function screenText(ctx, t, c) {
    const lab = { serif: false, col: P.cream, glow: false }, src = { serif: false, col: P.halo2, glow: false };
    // 5.01: RAILS at the bar's left end (sinks while the camera is close; back on "rails will stay")
    const rk = t < a.soYes ? rise(span(t, a.railsW + .3, a.railsW + 1.0)) * (1 - smooth(span(t, a.andYet - .3, a.andYet + .2))) : rise(span(t, a.soYes + .8, a.soYes + 1.5)) * (1 - smooth(span(t, tClr, tClr + .4)));
    if (rk > 0) { const p = proj(c, RB.x0 - 26, RB.y0 + 42); K.maskLine(ctx, [['RAILS', 0]], p[0] - K.measure('RAILS', 34, false), p[1], 34, rk, lab); }
    // 5.01: ≈ 60 % of the money (with stream 1)
    const mk = rise(span(t, a.mostM + .4, a.mostM + 1.1)) * (1 - smooth(span(t, tSt1 - .5, tSt1 + .1)));
    if (mk > 0) {
      const x = 140, y = 800, aw = U.approx(ctx, x, y, 120, mk);
      K.maskLine(ctx, [['60 %', 0]], x + aw + 6, y, 120, mk, { col: P.cream });
      K.maskLine(ctx, [['OF THE MONEY FOR DATA CENTERS', 0]], x + 4, y + 48, 34, rise(span(t, a.mostM + .7, a.mostM + 1.4)) * (mk > .99 ? 1 : mk), lab);
      K.maskLine(ctx, [['MCKINSEY, 2025', 0]], x + 4, y + 86, 24, rise(span(t, a.mostM + 1.1, a.mostM + 1.8)) * (mk > .99 ? 1 : mk), src);
    }
    // 5.03: VACANCY 1 % (right of the hall)
    const vk = rise(span(t, tG0 - .1, tG0 + .5)) * (1 - smooth(span(t, tOutDC, tOutDC + .4)));
    if (vk > 0) {
      const p = proj(c, DCX1, RB.y0 - DCH), x = p[0] + 70, y = p[1] + 20;
      K.maskLine(ctx, [['VACANCY', 0]], x, y, 34, vk, lab);
      K.maskLine(ctx, [['1 %', 0]], x - 4, y + 140, 140, rise(span(t, a.almostFull - .2, a.almostFull + .4)) * (1 - smooth(span(t, tOutDC, tOutDC + .4))), { col: P.cream });
      K.maskLine(ctx, [['NORTH AMERICA · JLL, YEAR-END 2025', 0]], x, y + 190, 24, rise(span(t, a.almostFull + .1, a.almostFull + .7)) * (1 - smooth(span(t, tOutDC, tOutDC + .4))), src);
    }
    // 5.05: the record year of planned power plants (above the plants)
    const pk = rise(span(t, a.record, a.record + .7)) * (1 - smooth(span(t, a.openM + .1, a.openM + .5)));
    if (pk > 0) {
      const p = proj(c, (SOL[0] + BAT[1]) / 2, RB.y0 - 96);
      K.maskLine(ctx, [['RECORD YEAR OF NEW POWER PLANTS', 0]], p[0], p[1], 34, pk, { ...lab, align: 'center' });
      K.maskLine(ctx, [['PLANNED · USA 2026 · EIA', 0]], p[0], p[1] + 40, 26, rise(span(t, a.planned - .1, a.planned + .5)) * (1 - smooth(span(t, a.openM + .1, a.openM + .5))), { ...src, align: 'center' });
    }
    // 5.06: OPEN MODEL WEIGHTS (above the file)
    const ok = rise(span(t, tFile1 - .1, tFile1 + .6)) * (1 - smooth(span(t, a.people - .1, a.people + .3)));
    if (ok > 0) { const p = proj(c, FILE.x, RB.y0 - FILE.h - 34); K.maskLine(ctx, [['OPEN MODEL WEIGHTS', 0]], p[0], p[1], 34, ok, { ...lab, align: 'center' }); }
  }

  draw.tLand = tLand; draw.cam = cam;
  return draw;
}
