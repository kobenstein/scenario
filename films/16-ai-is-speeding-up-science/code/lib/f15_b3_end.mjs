// Film 15 · B3 · c14 + end screen (477.56 – 524.94) · THE BOX, COMPARTMENT BY COMPARTMENT, CARRIED. Anchor 4.
// The street of c13 lies in compartment 6 (POORER COUNTRIES): log pull-back out of it, the box from above, held over your head on
// the ledge of the hook. The four empty compartments get their verdict strips: TOOLS full of light, MEDICINES filled to half,
// LONGER LIFE dark with a dashed cool rim and a breathing ember (not yet, not failed), HEPATITIS C full of light under a lid that
// slides almost shut. Pull back to the thumbnail echo (you, box overhead), lower the box, walk down the slope onto the plain with
// the far windows; close over the box in your arms; wide; the tally on the horizon (the last stroke sinks on "stopped",
// INFECTIONS glows); end screen: the box stands on a stone edge, you beside it, first light, slow pull-back. Free areas kept clear.
import { createCanvas, Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f15_kit.mjs';
import { BASE, card, look, frameAt } from './f15_b3_base.mjs';
import { du } from './f15_b3_figure.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, lin, rad, F0 } = E;

// ---------------------------------------------------------------- the ledge world (design coords as in the hook, sc01)
const LIP = 1150, DU = { x: 600, h: 255 }, ARMS = { armR: [2.92, 3.08], armL: [-2.92, -3.08] };
const BW = 104;
// the walking line: the hook ledge, then over the lip a long slope down to the plain
const G = (x) => x <= LIP ? lerp(926, 940, clamp((LIP - x) / (LIP + 700))) : x < 2350 ? 926 + 280 * E.smooth(span(x, LIP, 2350)) : 1206 + .004 * (x - 2350);
const TAU = 2 * Math.PI, CARRY = { armR: [.62, 1.72], armL: [.68 - TAU, 1.78 - TAU] }, SET = { armR: [.8, 1.3], armL: [.86 - TAU, 1.36 - TAU] }, REST = { armR: [.18, .1], armL: [-.12 - TAU, -.06 - TAU] };
const LABELS = ['INFECTIONS', 'CANCER', 'ALZHEIMER’S', 'MENTAL ILLNESS', 'LIFESPAN ×2', 'POORER COUNTRIES'];
const VERDICT = { 6: 'TOOLS', 7: 'MEDICINES', 8: 'LONGER LIFE', 9: 'HEPATITIS C' };

// cell geometry of F.box10 (same formula), for any beta, without drawing
function cellAt(i, beta, bx, by, w) {
  const cb = Math.cos(beta * Math.PI / 2), sb = Math.sin(beta * Math.PI / 2);
  const d = .44 * w, hb = .2 * w, wall = .028 * w, cw = (w - 6 * wall) / 5, cd = (d - 3 * wall) / 2;
  const r = i < 5 ? 0 : 1, k = i % 5, X0 = -w / 2 + wall + k * (cw + wall), Z1 = d - wall - r * (cd + wall), Z0 = Z1 - cd;
  const y1 = by - hb * cb - Z1 * sb, y0 = by - hb * cb - Z0 * sb;
  return { x: bx + X0, y: y1, w: cw, h: y0 - y1, cx: bx + X0 + cw / 2, cy: (y0 + y1) / 2 };
}
const boxCentre = (beta, bx, by, w) => { const cb = Math.cos(beta * Math.PI / 2), sb = Math.sin(beta * Math.PI / 2); return [bx, by - .2 * w * cb - .22 * w * sb]; };
const lerpA = (A, B, k) => [lerp(A[0], B[0], k), lerp(A[1], B[1], k)];

// a zoom profile that starts from rest, peaks early (while the frame is still the soft street) and rolls out long over the
// high-contrast box (no lurch): speed ∝ smooth ramp · (1 - u)², integrated and normalised
const OUT_TAIL = (() => { const n = 600, v = [], acc = [0]; for (let k = 0; k < n; k++) { const u = (k + .5) / n; v.push(smooth(clamp(u / .4)) * (1 - u) ** 1.5); } for (let k = 0; k < n; k++) acc.push(acc[k] + v[k]); return acc.map((x) => x / acc[n]); })();
const outTail = (u) => { const x = clamp(u) * 600, i = Math.min(599, Math.floor(x)); return lerp(OUT_TAIL[i], OUT_TAIL[i + 1], x - i); };

export function makeEnd(a, portal) {
  const scratch = createCanvas(8, 8).getContext('2d');
  const hands0 = du(scratch, DU.x, G(DU.x) + 1, DU.h, { dir: 1, ...ARMS });
  const BOX = { x: (hands0.R[0] + hands0.L[0]) / 2, y: Math.min(hands0.R[1], hands0.L[1]) + 3 };
  const C5 = cellAt(5, 1, BOX.x, BOX.y, BW), C9 = cellAt(9, 1, BOX.x, BOX.y, BW), BC = boxCentre(1, BOX.x, BOX.y, BW);
  const s0 = W / (C5.w - 1);                             // the street frame fills the clear opening of compartment 6 exactly
  const SV = 15.5, SVY = 515;                              // the verdict framing: the whole box from above
  const tS = a.there + .6;                               // 13.05 → 14.01: the pull-back out of the street starts in the VO pause
  const tV = a.tools - .05;                                 // the pull-back out of the street lands (≈ 479.86, before "In the tools")
  const tP0 = a.notyet + .45, tP1 = a.already + .75;       // 14.02: truck/push onto HEPATITIS C
  const tB0 = a.reached + .35, tB1 = a.bring + .55;      // 14.02→14.03: pull back to the thumbnail echo
  const WIDE = { u: 900, v: 560, s: .95 };
  const betaAt = (t) => {
    let b = lerp(1, .35, sineIO(span(t, tB0 + 1.25, tB1 - .05)));
    b = lerp(b, .55, sineIO(span(t, a.T3 - .6, a.T3 + .6)) * (1 - sineIO(span(t, a.carry - .4, a.carry + .8))));
    return b;
  };

  // ---------------------------------------------------------------- you: the walk (velocity profile → position, phase)
  const tW0 = a.carrying + .45, tW1 = a.stopped + .55;  // feet start / stop
  const X_END = 3000;
  const vel = (t) => smooth(span(t, tW0, tW0 + 1.4)) * (1 - smooth(span(t, tW1 - 1.6, tW1)));
  const XS = [], DT = 1 / 120; { let x = DU.x, acc = 0; const n = Math.ceil((tW1 - tW0 + 1) / DT); const raw = []; for (let k = 0; k <= n; k++) { raw.push(acc); acc += vel(tW0 + k * DT) * DT; } for (const r of raw) XS.push(DU.x + (X_END - DU.x) * r / acc); }
  const youX = (t) => t <= tW0 ? DU.x : XS[Math.min(XS.length - 1, Math.round((t - tW0) / DT))];
  const youSt = (t) => clamp(Math.abs(youX(t + .03) - youX(t - .03)) / .06 / 120);
  // the gait phase from the distance walked along the ground
  const youPh = (t) => (youX(t) - DU.x) * .0315 * 1.06;

  // the stone edge where the box is set down (end screen)
  const STONE = { x0: X_END + 52, x1: X_END + 330 };
  const stoneTop = G(X_END + 100) - 152;

  // ---------------------------------------------------------------- camera
  // P4 keys (from the wide echo on): offsets from you: [t, du, dv, s] → u = youX + du, v = G(youX) + dv
  const K4 = [
    [tB1, WIDE.u - DU.x, WIDE.v - G(DU.x), WIDE.s],
    [a.carrying + .2, WIDE.u - DU.x + 10, WIDE.v - G(DU.x) - 6, WIDE.s * .985],
    [a.part + .6, 330, -330, .78],
    [a.compartment + .2, 96, -196, 3.6, 'q'],
    [a.first + .5, 100, -200, 4.0],
    [a.carry + .9, 470, -360, .62, 'q'],
    [a.subscribe + .4, 520, -400, .56],
    [a.stopped + .6, 130, -540, .6],
    [a.vEnd + 1.5, 150, -552, .6],
    [a.END, 420, -720, .44],
  ];
  const cam = (t) => {
    if (t < tV) {   // P1: log zoom out of compartment 6, the opening stays under the eye
      const e = outTail(span(t, tS, tV)), s = Math.exp(lerp(Math.log(s0), Math.log(SV), e));
      const sx = lerp(W / 2, W / 2 + (C5.cx - BC[0]) * SV, e), sy = lerp(H / 2, SVY + (C5.cy - BC[1]) * SV, e);
      return E.camDrift(E.aim(F0, C5.cx, C5.cy, s, sx, sy, Math.max(F0, 80 * s)), t, 1.6 / s * smooth(span(t, tS + .2, tV)));
    }
    if (t < tB0) {  // P2: the verdict, then 14.02 the push onto HEPATITIS C
      const br = sineIO(span(t, tV, tP0)), p = sineIO(span(t, tP0, tP1));
      const sA = SV * lerp(1, 1.06, br), uA = BC[0], vA = BC[1] + (H / 2 - SVY) / SV;
      const s = Math.exp(lerp(Math.log(sA), Math.log(27), p)) * lerp(1, 1.04, span(t, tP1, tB0));
      const u = lerp(uA, C9.cx, p), v = lerp(vA, C9.cy + 1.5, p);
      return E.camDrift(look(u, v, s), t, 1.6 / s);
    }
    if (t < tB1) {  // P3: pull back to the thumbnail echo; HEPATITIS C stays under the eye while the box tilts
      const e = sineIO(span(t, tB0, tB1)), beta = betaAt(t), c9 = cellAt(9, beta, BOX.x, BOX.y, BW);
      const sB = 27 * 1.04, s = Math.exp(lerp(Math.log(sB), Math.log(WIDE.s), e));
      const sx = lerp(W / 2, W / 2 + (c9.cx - WIDE.u) * WIDE.s, e), sy = lerp(H / 2 + (C9.cy + 1.5 - C9.cy) * 0, H / 2 + (c9.cy - WIDE.v) * WIDE.s, e);
      // the push ended on (C9.cx, C9.cy + 1.5) at the frame centre: keep that point there at the start
      const fy = lerp(C9.cy + 1.5, c9.cy, e);
      return E.camDrift(E.aim(F0, c9.cx, fy, s, sx, sy, Math.max(F0, 80 * s)), t, 1.6 / Math.max(1, s));
    }
    const [du0, dv, s] = frameAt(t, K4), x = youX(t);
    return E.camDrift(look(x + du0, G(x) + dv, s), t, 1.6 / Math.max(1, s));
  };

  // ---------------------------------------------------------------- far world (horizon on card 9000 sits at screen y ≈ 700 in the end screen)
  const ZF = 9000;
  const camE = look(X_END + 110, G(X_END) - 610, .54), mE = E.cardM(camE, ZF), vH = (712 - mE.f) / mE.k;
  const camW = look(DU.x + 300, 560, .95), mW = E.cardM(camW, ZF);
  const uL = Math.min((-400 - mW.e) / mW.k, (-400 - mE.e) / mE.k), uR = (2400 - mE.e) / mE.k;
  const uWin = (1112 - mE.e) / mE.k;                     // the farthest window: just right of centre in the end screen
  const TALLY = Array.from({ length: 10 }, (_, k) => (900 + 15 * k + (k >= 5 ? 16 : 0) - mE.e) / mE.k);
  const WINS = []; { const r = E.prng(1414); let x = uL + 200; while (x < uR) { WINS.push([x, r()]); x += 140 + r() * 380; } }

  function sky(ctx, c, t) {
    const dawn = smooth(span(t, a.carrying, a.END)) ;
    card(ctx, c, 40000, () => {
      E.nightSky(ctx, [[0, P.night0], [.55, P.night1], [1, P.ind0]], -1400, H + 900);
      ctx.fillStyle = rad(ctx, 1450, 380, 1500, [[0, rgba(P.ind1, .95)], [.5, rgba(P.ind1, .45)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(-3 * W, -3 * H, 7 * W, 7 * H);
      ctx.save(); ctx.translate(-8 * (t - a.T2), 0); E.stars(ctx, 15, 520, t, [-2500, -1800, W + 3500, H + 1200], 1); E.stars(ctx, 16, 90, t * 1.3, [-2500, -1800, W + 3500, H + 400], 1); ctx.restore();
    });
    card(ctx, c, 20000, () => {   // long thin clouds drift right, lit from below by the first light
      const cm = E.cardM(camE, 20000);
      for (const [y, w, h, ph, sp] of [[180, 1500, 38, 0, 34], [300, 2200, 52, 900, 26], [430, 1300, 30, 2100, 40], [90, 1800, 28, 3000, 22]]) {
        const vy = (y - cm.f) / cm.k, u = (((ph + sp * (t - 470)) % 4200) + 4200) % 4200 - 1500, ux = (u - cm.e) / cm.k;
        ctx.save(); ctx.translate(ux, vy); ctx.scale(1, h / w);
        ctx.fillStyle = rad(ctx, 0, 0, w / 2 / cm.k, [[0, rgba(mixHex(P.blue1, P.shade0, .25 + .3 * dawn), .32)], [.6, rgba(P.blue1, .14)], [1, rgba(P.blue1, 0)]]);
        ctx.beginPath(); ctx.arc(0, 0, w / 2 / cm.k, 0, 6.29); ctx.fill(); ctx.restore();
      }
    });
    card(ctx, c, 7000, () => {
      ctx.beginPath(); ctx.moveTo(-900, 300); ctx.bezierCurveTo(100, 260, 520, 600, 600, 1700); ctx.lineTo(-900, 1700); ctx.closePath();
      ctx.fillStyle = lin(ctx, 420, 600, -100, 1100, [[0, rgba(P.ind1, 0)], [.35, rgba(P.ind1, .55)], [1, rgba(P.ind0, .95)]]); ctx.fill();
    });
    const off = 2600 * smooth(span(betaAt(t), .5, .95));
    card(ctx, c, 15000, () => {   // a far range of low hills behind the plain (depth), cool rim
      ctx.translate(0, off * 1.2);
      const m = E.cardM(camE, 15000), vR = (712 - m.f) / m.k, u0 = (-600 - m.e) / m.k, u1 = (2600 - m.e) / m.k;
      const hp = new Path2D(); hp.moveTo(u0 - 3000, vR + 10);
      for (let k = 0; k <= 60; k++) { const u = lerp(u0 - 3000, u1 + 3000, k / 60); hp.lineTo(u, vR - 70 - 60 * Math.sin(k * .55) * Math.sin(k * .21 + 1) - 30 * Math.sin(k * 1.3)); }
      hp.lineTo(u1 + 3000, vR + 4000); hp.lineTo(u0 - 3000, vR + 4000); hp.closePath();
      ctx.fillStyle = lin(ctx, 0, vR - 200, 0, vR + 40, [[0, mixHex(P.ind1, P.blue1, .12)], [1, mixHex(P.ind1, P.night1, .3)]]); ctx.fill(hp);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, (1112 - m.e) / m.k, vR, 2600, [[0, rgba(P.shade0, .04 + .1 * dawn)], [1, rgba(P.shade0, 0)]]); ctx.fill(hp); ctx.restore();
    });
    card(ctx, c, ZF, () => {
      ctx.translate(0, off);
      // first light: a warm band low over the far plain, swelling from "Carrying" to the end
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, 0, vH - 900, 0, vH + 4, [[0, rgba(P.shade0, 0)], [.6, rgba(P.shade0, .05 + .1 * dawn)], [1, rgba(P.shade0, .14 + .3 * dawn)]]); ctx.fillRect(uL - 2000, vH - 900, uR - uL + 4000, 905);
      ctx.fillStyle = rad(ctx, uWin, vH, 1100, [[0, rgba(P.halo1, .1 + .22 * dawn)], [.35, rgba(P.shade0, .08 + .14 * dawn)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(uWin - 1100, vH - 1100, 2200, 1104);
      ctx.restore();
      ctx.fillStyle = lin(ctx, 0, vH, 0, vH + 600, [[0, mixHex(P.ind1, P.blue1, .25)], [.05, P.ind1], [1, P.night0]]); ctx.fillRect(uL - 2000, vH, uR - uL + 4000, 3000);
      ctx.fillStyle = rgba(mixHex(P.blue0, P.halo1, .5 * dawn), .8); ctx.fillRect(uL - 2000, vH - 1, uR - uL + 4000, 2.5);
      // far houses with a lit window each (dim), the farthest one is the warmest
      for (const [x, r] of WINS) {
        const hw = 30 + 40 * r, hh = 14 + 26 * r;
        ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(x - hw / 2, vH - hh, hw, hh + 1);
        if (r > .35) { ctx.fillStyle = rgba(P.halo1, .45 + .15 * Math.sin(t * .6 + x)); ctx.fillRect(x - 3, vH - hh * .6, 6, 7); }
      }
      { const hw = 54, hh = 34; ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(uWin - hw / 2, vH - hh, hw, hh + 1);
        const L = .75 + .2 * dawn + .05 * Math.sin(t * 1.1);
        halo(ctx, uWin, vH - hh * .55, 70, .35 * L, P.halo1, P.core1);
        ctx.fillStyle = mixHex(P.halo0, P.core1, .6); ctx.fillRect(uWin - 5, vH - hh * .7, 10, 11); }
      // 14.06 the tally (ten strokes of light grow out of the horizon on "We won't hear"; the last one sinks on "stopped")
      TALLY.forEach((x, k) => {
        const g = expoOut(span(t, a.we + .1 + .09 * k, a.we + .7 + .09 * k)); if (g <= 0) return;
        const sink = k === 9 ? sineIO(span(t, a.stopped - .12, a.stopped + .5)) : 0;
        const hgt = 30 * g * (1 - sink);
        if (hgt <= .3) return;
        ctx.fillStyle = mixHex(P.halo0, P.cream, .4); ctx.fillRect(x - 1.6, vH - 3 - hgt, 3.2, hgt);
        halo(ctx, x, vH - 3 - hgt / 2, 16, .25 * g * (1 - sink), P.halo1, P.core1);
      });
    });
  }

  // ---------------------------------------------------------------- the ground (ledge → slope → plain), the stone
  function ground(ctx, t, light) {
    const rimY = (x) => G(x) - 24;
    const p = new Path2D(); p.moveTo(-1500, rimY(-1500));
    for (let x = -1500; x <= 9000; x += 25) p.lineTo(x, rimY(x));
    const q = new Path2D(p); q.lineTo(9000, 4200); q.lineTo(-1500, 4200); q.closePath();
    ctx.fillStyle = lin(ctx, 0, 880, 0, 1700, [[0, P.ind1], [.06, P.night1], [1, P.night0]]); ctx.fill(q);
    ctx.save(); ctx.strokeStyle = lin(ctx, light.x - 900, 0, light.x + 900, 0, [[0, rgba(P.blue0, .7)], [.42, rgba(P.halo1, .55 * light.k + .2)], [.58, rgba(P.halo1, .55 * light.k + .2)], [1, rgba(P.blue0, .7)]]);
    ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.stroke(p); ctx.restore();
    // the stone edge for the end screen (a waist-high stone at the end of the walk)
    const sp = new Path2D(); const y0 = G(STONE.x1), yT = stoneTop;
    sp.moveTo(STONE.x0, G(STONE.x0) - 20); sp.bezierCurveTo(STONE.x0 + 4, yT + 30, STONE.x0 + 10, yT + 2, STONE.x0 + 40, yT); sp.lineTo(STONE.x1 - 30, yT + 6);
    sp.bezierCurveTo(STONE.x1 - 4, yT + 10, STONE.x1, yT + 60, STONE.x1 + 10, y0 - 20); sp.closePath();
    ctx.fillStyle = lin(ctx, 0, yT, 0, y0, [[0, mixHex(P.ind2, P.blue1, .25)], [.15, P.ind2], [1, P.night1]]); ctx.fill(sp);
    ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(STONE.x0 + 6, yT + 18); ctx.bezierCurveTo(STONE.x0 + 10, yT + 2, STONE.x0 + 30, yT, STONE.x0 + 40, yT); ctx.lineTo(STONE.x1 - 30, yT + 6); ctx.stroke();
  }

  // ---------------------------------------------------------------- the box state
  function boxState(t) {
    const lit = new Array(10).fill(0);
    const inf = .22 + .06 * Math.sin(t * 1.3);
    const stop = expoOut(span(t, a.stopped + .08, a.stopped + .7));
    lit[0] = lerp(inf, .9 + .1 * Math.sin((t - a.stopped) * 1.6), stop);
    lit[6] = expoOut(span(t, a.tools - .12, a.tools + .55)) * (1 + .04 * Math.sin(t * 1.7));
    const flick = (() => { const u = span(t, a.first - .25, a.first + .45); if (u <= 0 || u >= 1) return 0; return Math.max(0, Math.sin(u * Math.PI * 3.2)) * (1 - u) * .85; })();
    return { lit, flick,
      half: sineIO(span(t, a.medicines2 - .1, a.halfway + .25)),
      dash: span(t, a.notyet - .25, a.notyet + .9), ember: smooth(span(t, a.longer + .2, a.notyet + .3)),
      hep: expoOut(span(t, a.cures - .1, a.cures + .55)), lid: sineIO(span(t, a.already - .05, a.reached + .05)),
      lab: { 6: span(t, a.tools - .3, a.tools + .45), 7: span(t, a.medicines2 - .25, a.medicines2 + .55), 8: span(t, a.longer - .2, a.life ?? a.longer + .7), 9: span(t, a.cures - .25, a.cures + .55) },
    };
  }

  function drawBox(ctx, t, bx, by, beta, S) {
    const labels = LABELS.map((s) => ({ s, u: 1 }));
    for (const i of [6, 7, 8, 9]) labels[i] = { s: VERDICT[i], u: S.lab[i], size: 17.3 * .125 };
    const g = F.box10(ctx, bx, by, BW, t, {
      beta, lid: .56, lit: S.lit, labels,
      inside: (i, c) => {
        if (i === 5 && portal) {   // compartment 6: the street of c13, living
          const m = ctx.getTransform(), sw = m.a * (c.w - 1);
          if (sw < 3) return;
          const sx = m.a * c.cx + m.e, sy = m.d * c.cy + m.f, q = sw / W;
          const keep = { ...BASE }; BASE.q = q; BASE.x = sx - q * W / 2; BASE.y = sy - q * H / 2;
          ctx.save(); portal(ctx, t); ctx.restore();
          Object.assign(BASE, keep);
          return;
        }
        if (i === 7 && S.half > 0) {   // MEDICINES: light filled to half, a bright meniscus
          const lv = c.y + c.h * (1 - .5 * S.half), wob = .25 * Math.sin(t * 2.1);
          ctx.fillStyle = lin(ctx, 0, lv, 0, c.y + c.h, [[0, rgba(P.core0, .95)], [.15, rgba(P.core1, .9)], [1, rgba(P.halo0, .75)]]);
          ctx.beginPath(); ctx.moveTo(c.x, lv + wob); ctx.quadraticCurveTo(c.cx, lv - wob - .3, c.x + c.w, lv + wob); ctx.lineTo(c.x + c.w, c.y + c.h); ctx.lineTo(c.x, c.y + c.h); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = rgba(P.core0, .95); ctx.lineWidth = .45; ctx.beginPath(); ctx.moveTo(c.x, lv + wob); ctx.quadraticCurveTo(c.cx, lv - wob - .3, c.x + c.w, lv + wob); ctx.stroke();
        }
        if (i === 8) {   // LONGER LIFE: dark, a small cool ember breathing at the bottom (not yet — not failed); "first?" flickers it
          const em = S.ember * (.6 + .4 * Math.sin(t * 1.4)) + S.flick;
          if (em > 0) { const ex = c.cx, ey = c.y + c.h * .72;
            ctx.fillStyle = rad(ctx, ex, ey, c.w * .5, [[0, rgba(F.COOL_HI, .55 * em)], [.35, rgba(F.COOL, .22 * em)], [1, rgba(F.COOL, 0)]]); ctx.fillRect(c.x, c.y, c.w, c.h);
            ctx.fillStyle = rgba(mixHex(F.COOL_HI, P.core0, .4 * S.flick), Math.min(1, .5 + .5 * em)); ctx.beginPath(); ctx.arc(ex, ey, c.w * .035 * (1 + S.flick), 0, 6.29); ctx.fill(); }
          if (S.flick > 0) { ctx.fillStyle = rgba(P.core1, .55 * S.flick); ctx.fillRect(c.x, c.y, c.w, c.h); }
        }
        if (i === 9 && S.hep > 0) {   // HEPATITIS C: full of light; then a lid slides almost shut: light only in the slit
          ctx.fillStyle = rad(ctx, c.cx, c.y + c.h * .65, Math.max(c.w, c.h) * .8, [[0, rgba(P.core0, S.hep)], [.3, rgba(P.core1, .9 * S.hep)], [.7, rgba(P.halo0, .6 * S.hep)], [1, rgba(P.shade0, .35 * S.hep)]]);
          ctx.fillRect(c.x, c.y, c.w, c.h);
          if (S.lid > 0) {
            const lx = c.x + c.w - c.w * .9 * S.lid;   // the lid comes in from the right edge, leaves a slit of 10 %
            ctx.fillStyle = lin(ctx, lx, 0, c.x + c.w, 0, [[0, mixHex(P.ind2, P.blue1, .45)], [.25, P.ind2], [1, P.night1]]); ctx.fillRect(lx, c.y - 1, c.x + c.w - lx + 1, c.h + 2);
            ctx.fillStyle = rgba(P.core0, .9); ctx.fillRect(lx - .35, c.y, .7, c.h);   // the light catches the lid's edge
          }
        }
      },
    });
    // light that spills out (bodies never fade: only light swells)
    const c7 = g.cells[7], c8 = g.cells[8], c9 = g.cells[9];
    if (S.half > 0) halo(ctx, c7.cx, c7.y + c7.h * .8, c7.w * 1.1, .22 * S.half, P.halo1, P.core1);
    if (S.hep > 0) { const slit = c9.x + c9.w * .05 + (c9.w * .45) * (1 - S.lid); halo(ctx, slit, c9.cy, c9.w * lerp(1.3, .7, S.lid), .3 * S.hep, P.halo1, P.core1); }
    if (S.dash > 0) {   // the dashed cool rim of LONGER LIFE draws itself round the opening
      const per = 2 * (c8.w + c8.h), L = per * S.dash;
      ctx.save(); ctx.strokeStyle = rgba(F.COOL_HI, .9); ctx.lineWidth = Math.max(.35, BW * .0045); ctx.lineCap = 'round';
      ctx.setLineDash([BW * .016, BW * .014]); ctx.lineDashOffset = -t * BW * .006;
      const pts = [[c8.x, c8.y + c8.h], [c8.x, c8.y], [c8.x + c8.w, c8.y], [c8.x + c8.w, c8.y + c8.h], [c8.x, c8.y + c8.h]];
      ctx.beginPath(); ctx.moveTo(...pts[0]); let left = L;
      for (let k = 1; k < pts.length && left > 0; k++) { const [x0, y0] = pts[k - 1], [x1, y1] = pts[k], seg = Math.hypot(x1 - x0, y1 - y0), f = Math.min(1, left / seg); ctx.lineTo(lerp(x0, x1, f), lerp(y0, y1, f)); left -= seg; }
      ctx.stroke(); ctx.restore();
    }
    return g;
  }

  // ---------------------------------------------------------------- the frame
  function draw(ctx, t, c) {
    sky(ctx, c, t);
    card(ctx, c, F0, () => {
      const beta = betaAt(t), S = boxState(t);
      const x = youX(t), st = youSt(t), gy = G(x) + 1;
      // arms: overhead → carry (on "Carrying") → set the box on the stone → rest
      const lower = sineIO(span(t, a.carrying - .2, a.carrying + .9)), turn = sineIO(span(t, a.carrying - .05, a.carrying + .8));
      const setU = sineIO(span(t, tW1 + .2, tW1 + 1.5)), rel = sineIO(span(t, tW1 + 1.6, tW1 + 2.6));
      let armR = lerpA(ARMS.armR, CARRY.armR, lower), armL = lerpA(ARMS.armL, CARRY.armL, lower);
      armR = lerpA(lerpA(armR, SET.armR, setU), REST.armR, rel); armL = lerpA(lerpA(armL, SET.armL, setU), REST.armL, rel);
      const lookUp = .45 * (1 - lower) + .25 * sineIO(span(t, a.vEnd - .5, a.vEnd + 2.5));
      const hands = du(scratch, x, gy, DU.h, { dir: 1, walk: youPh(t), stride: st, turn, armR, armL });
      // where the box is: over your head (from the hook), in your hands, on the stone
      let bx = BOX.x, by = BOX.y;
      if (lower > 0) { const hx = (hands.R[0] + hands.L[0]) / 2, hy = Math.min(hands.R[1], hands.L[1]) + 3; bx = lower < 1 ? lerp(BOX.x, hx, lower) : hx; by = lower < 1 ? lerp(BOX.y, hy, lower) : hy; if (lower >= 1 && x === DU.x) { bx = hx; by = hy; } }
      if (setU > 0) { const tx = X_END + 170, ty = stoneTop + 1; bx = lerp(bx, tx, setU); by = lerp(by, ty, setU) - 14 * Math.sin(Math.PI * setU); }
      if (rel > 0) { bx = X_END + 170; by = stoneTop + 1; }
      // the warm light of the box on the ground round you
      const anyLit = .5 + .5 * S.hep;
      ground(ctx, t, { x: bx, k: anyLit * (1 - smooth(span(beta, .6, 1))) });
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(bx, G(bx) + 4); ctx.scale(1, .12);
      ctx.fillStyle = rad(ctx, 0, 0, 420, [[0, rgba(P.halo1, .26 * anyLit)], [.5, rgba(P.halo1, .07)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 420, 0, 6.29); ctx.fill(); ctx.restore();
      // you (foreshortened under the box while it is seen from above, as in the hook)
      const fs = Math.cos(span(beta, .35, 1) * Math.PI / 2), hy = BOX.y - .2 * BW;
      E.castShadow(ctx, x, gy + 1, 26, 170, Math.PI - .35, .5 * fs);
      const held = smooth(span(lower, .6, 1)) * (1 - smooth(span(rel, 0, .4)));
      const front = lower > .8 && rel < .5;   // carried at the chest: the box sits in front of the body, your near arm holds it
      if (front) drawBox(ctx, t, bx, by, beta, S);
      if (fs > .004) {
        ctx.save(); if (fs < .999) { ctx.translate(0, hy); ctx.scale(1, fs); ctx.translate(0, -hy); }
        du(ctx, x, gy, DU.h, { dir: 1, walk: youPh(t), stride: st, turn, armR, armL, look: clamp(lookUp), light: 1, rim: mixHex(P.coat, P.core1, .6) });
        ctx.restore();
      }
      if (!front) drawBox(ctx, t, bx, by, beta, S);
      // the box is the hero light of the wide shots: its compartments throw a warm glow round it
      const glowK = (1 - smooth(span(beta, .6, .9))) * (.5 + .3 * S.lit[0]);
      if (glowK > 0) {
        halo(ctx, bx, by - 30, 230, .42 * glowK, P.halo1, P.core1);
        E.dust(ctx, 1515, 160, bx, by - 70, 120, 90, t, .5 * glowK, P.halo2);   // motes in the box's light (alive in every hold)
      }
    });
  }

  return { draw, cam, tS, tV, BOX, C5, s0 };
}
