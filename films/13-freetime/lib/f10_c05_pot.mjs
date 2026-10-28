// Film 10 · B2 · the pottery shed (c05 ★ 5.11, 283.66–292.42) and its rings, which c06 picks up at 292.42.
// One bulb over the wheel is the hero. Grandmother's hands turn a cup of wet clay; on "own hands" they lift, the wheel runs out alone.
// In the silence the camera rises over the wheel: the wheel and the cup are a solid of revolution (stacked ellipses), so tilting the
// view from the side (τ ≈ .2) to straight down (τ = π/2) turns the throwing grooves into concentric rings without a single blend.
// potRings(ctx, t, view) is exported so sc06 starts from exactly the same picture.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import { env } from './f10_c04_b2.mjs';
const { W, H, P, F0, clamp, lerp, span, smooth, sineIO, expoOut, rgba, mixHex, lin, rad } = E;

export const POT = { BULB: [960, 250], WH: [960, 760], FLR: 930, GX: 742, GH: 440 };
// the clay cup: radius by height z (0 = on the wheel head), in design px
const CUP = { h: 132, r: (z) => { const u = z / 132; return 56 + 10 * u - 9 * Math.sin(Math.PI * u) * (1 - u) + (u < .08 ? 8 * (1 - u / .08) : 0); }, rim: 66, inner: 57 };
const HEAD = { r: 172, th: 22 };   // wheel head radius, thickness

let A = null;
export function initPot(T) {
  if (A) return A;
  const s = (sec, ph, n) => T.S(sec, ph, n);
  A = { quieter: s('02b', 'quieter question'), what: s('02b', 'What do we lose'), lose: s('02b', 'lose'), stop: s('02b', 'stop doing'), own: s('02b', 'own hands'),
    hands: s('02b', 'own hands') + .24, end: T.seg('02b').end, c06: T.seg('02c').start };
  A.lift = A.own + .25;           // the hands lift off the clay
  A.crane0 = A.end + .15;         // silence: the camera rises
  A.crane1 = A.c06 - .1;
  return A;
}

// spin phase: steady while the hands work, then it runs out (exponential decay)
const W0 = 5.2, LAM = .62;
export function spin(t) { if (t < A.lift) return W0 * t; const d = t - A.lift; return W0 * A.lift + W0 / LAM * (1 - Math.exp(-LAM * d)); }

// view for the rings: tilt τ (0 side … π/2 straight down), scale s, centre of the wheel head on screen (design coords)
export function potView(t) {
  const k = sineIO(span(t, A.crane0, A.crane1));
  return { tilt: lerp(.2, Math.PI / 2, k), k };
}
// camera of the shed (out of the bulb, a breathing hold, the crane)
export function potCam(t, t0) {
  const K = [
    [t0, E.aim(F0, POT.BULB[0], POT.BULB[1], 60)],
    [t0 + 1.9, E.aim(F0, 905, 560, 1.32), 'o'],
    [A.lift, E.aim(F0, 915, 590, 1.42), 's'],
    [A.crane0, E.aim(F0, 925, 620, 1.48), 's'],
    [A.crane1, E.aim(F0, POT.WH[0], POT.WH[1], 2.7), 's'],
  ];
  return E.camDrift(E.camAt(t, K), t, .5 * (1 - sineIO(span(t, A.crane0, A.crane1))));
}
// stars in screen space (infinitely far: they do not scale with the camera); shared with c06 so the seam is exact
export function farStars(ctx, t, a = 1) { E.stars(ctx, 91, 230, t, [0, 0, W, H], .8 * a); }

// ---- the wheel + cup as rings in 3D ----
// e(z, r) → ellipse on screen for radius r at height z above the wheel head (z up), view v
const ell = (v, z, r) => ({ cx: POT.WH[0], cy: POT.WH[1] - z * Math.cos(v.tilt), rx: r, ry: Math.max(.6, r * Math.sin(v.tilt)) });
function fillEll(ctx, e, style) { ctx.fillStyle = style; ctx.beginPath(); ctx.ellipse(e.cx, e.cy, e.rx, e.ry, 0, 0, 6.29); ctx.fill(); }
function strokeEll(ctx, e, w, col, a0 = 0, a1 = 6.29) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.ellipse(e.cx, e.cy, e.rx, e.ry, 0, a0, a1); ctx.stroke(); }

export function potRings(ctx, t, v, o = {}) {
  const ph = spin(t), top = v.k ?? 0, wet = o.wet ?? 1;
  // light from the bulb (above): side walls warm in the middle, dark at the edges
  const sideFill = (e, a = 1) => lin(ctx, e.cx - e.rx, 0, e.cx + e.rx, 0, [[0, rgba(mixHex(P.shade0, P.night0, .6), a)], [.35, rgba(P.halo1, a)], [.55, rgba(mixHex(P.halo0, P.core1, .3), a)], [.8, rgba(P.halo1, a)], [1, rgba(mixHex(P.shade0, P.night0, .5), a)]]);
  // wheel head: a thick disc
  for (let i = 0; i <= 6; i++) { const e = ell(v, -HEAD.th + HEAD.th * i / 6, HEAD.r); fillEll(ctx, e, i < 6 ? mixHex(P.night1, P.ind0, .4) : mixHex(P.ind0, P.blue0, .2)); }
  const hd = ell(v, 0, HEAD.r);
  // the top of the head is wet clay slip, lit by the bulb
  ctx.save(); ctx.fillStyle = rad(ctx, hd.cx, hd.cy, HEAD.r, [[0, mixHex(P.halo1, P.shade0, .25)], [.5, mixHex(P.shade0, P.night1, .35)], [1, mixHex(P.night1, P.ind0, .3)]]);
  ctx.beginPath(); ctx.ellipse(hd.cx, hd.cy, hd.rx, hd.ry, 0, 0, 6.29); ctx.fill(); ctx.restore();
  // throwing rings on the head + a rotating streak (shows the spin)
  for (const [r, a] of [[160, .5], [140, .32], [118, .4], [96, .28], [80, .22]]) strokeEll(ctx, ell(v, .5, r), 2.2 + 1.5 * top, rgba(P.halo0, a * (.7 + .5 * top)));
  for (let j = 0; j < 3; j++) {
    const q = ph + j * 2.094, r = 128 + j * 12, e = ell(v, .5, r);
    strokeEll(ctx, e, 3, rgba(P.core1, .35 * wet), q, q + .5);
  }
  strokeEll(ctx, hd, 3, rgba(P.halo0, .8), 0, Math.PI);   // the near rim catches the light
  // the cup: stacked slices from the bottom up (union = the solid), lit side walls
  const N = 40;
  for (let i = 0; i <= N; i++) { const z = CUP.h * i / N, e = ell(v, z, CUP.r(z)); fillEll(ctx, e, sideFill(e)); }
  // grooves on the outer wall (front half when seen from the side; they rotate with the wheel)
  for (let i = 1; i < 7; i++) {
    const z = CUP.h * (i / 7.3), e = ell(v, z, CUP.r(z) + .6), wob = .6 * Math.sin(ph * .5 + i);
    strokeEll(ctx, e, 1.6, rgba(P.shade0, .55), .15 + wob * .02, Math.PI - .15);
    strokeEll(ctx, ell(v, z + 2, CUP.r(z) + .6), 1.2, rgba(P.core1, .35 * wet), .3, Math.PI - .3);
  }
  // the opening: rim, dark inside, the throwing spiral at the bottom (seen when the camera is above)
  const rim = ell(v, CUP.h, CUP.rim), inn = ell(v, CUP.h, CUP.inner);
  fillEll(ctx, rim, mixHex(P.halo0, P.core1, .35));
  ctx.save(); ctx.beginPath(); ctx.ellipse(inn.cx, inn.cy, inn.rx, inn.ry, 0, 0, 6.29); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, inn.cy - inn.ry, 0, inn.cy + inn.ry, [[0, mixHex(P.shade0, P.night0, .5)], [1, mixHex(P.halo1, P.shade0, .4)]]); ctx.fillRect(inn.cx - 99, inn.cy - 99, 198, 198);
  // the floor of the cup, seen through the opening (z = 10): spiral grooves
  for (const r of [12, 22, 32, 42, 50]) strokeEll(ctx, ell(v, 12, r), 1.6, rgba(P.halo0, .25 + .45 * top));
  ctx.restore();
  strokeEll(ctx, rim, 2.4, rgba(P.core0, .85));
}

// ---- the shed: wall, shelf, bulb, cone, grandmother ----
export function potStage(ctx, t, t0) {
  const c = potCam(t, t0), v = potView(t), out = v.k;   // out: crane progress (things beside the wheel leave the frame)
  farStars(ctx, t);
  // back wall
  E.card(ctx, c, 2600, () => {
    ctx.save(); ctx.translate(0, -4200 * v.k * v.k);
    ctx.fillStyle = lin(ctx, 0, -600, 0, POT.FLR + 200, [[0, P.night0], [.65, P.night1], [1, P.ind0]]); ctx.fillRect(-1600, -1400, 5200, 3600);
    ctx.fillStyle = rad(ctx, 960, 420, 900, [[0, rgba(P.blue0, .5)], [.6, rgba(P.blue0, .14)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(-1600, -1400, 5200, 3600);
    // the shelf with cups that she made (silhouettes, warm rim)
    ctx.fillStyle = P.night0; ctx.fillRect(140, 470, 520, 12);
    [[210, 46, 52], [290, 40, 58], [372, 50, 46], [450, 42, 56], [560, 48, 50]].forEach(([x, w, h]) => {
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.moveTo(x - w / 2, 470 - h); ctx.lineTo(x + w / 2, 470 - h); ctx.lineTo(x + w / 2 - 5, 470); ctx.lineTo(x - w / 2 + 5, 470); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba(P.halo1, .55); ctx.fillRect(x + w / 2 - 6, 470 - h, 3, h);
    });
    ctx.fillStyle = P.night0; ctx.fillRect(1380, 120, 360, 520); ctx.fillStyle = rgba(P.blue1, .35); ctx.fillRect(1392, 132, 336, 496);   // a small night window
    ctx.strokeStyle = P.night0; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(1560, 120); ctx.lineTo(1560, 640); ctx.moveTo(1380, 380); ctx.lineTo(1740, 380); ctx.stroke();
    ctx.restore();
  });
  E.card(ctx, c, F0, () => {
    const dy = 900 * out * out, dx = -520 * out;
    // floor
    ctx.fillStyle = lin(ctx, 0, POT.FLR, 0, POT.FLR + 400, [[0, P.ind1], [.25, P.ind0], [1, P.night0]]); ctx.fillRect(-1600, POT.FLR + dy, 5200, 1400);
    E.lightPool(ctx, 760, 1160, POT.FLR + dy, 300, 160, .5);
    // the light cone from the bulb
    ctx.save(); ctx.filter = 'blur(14px)';
    const ca = 1 - out; ctx.fillStyle = lin(ctx, 0, POT.BULB[1], 0, POT.FLR, [[0, rgba(P.halo0, .42 * ca)], [.55, rgba(P.halo1, .18 * ca)], [1, rgba(P.shade0, .06 * ca)]]);
    ctx.beginPath(); ctx.moveTo(POT.BULB[0] - 30, POT.BULB[1] + 20 - dy * .3); ctx.lineTo(POT.BULB[0] + 30, POT.BULB[1] + 20 - dy * .3); ctx.lineTo(POT.BULB[0] + 460, POT.FLR); ctx.lineTo(POT.BULB[0] - 460, POT.FLR); ctx.closePath(); ctx.fill(); ctx.restore();
    // the wheel stand + tray (slides out below as the camera rises)
    ctx.save(); ctx.translate(0, dy);
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.moveTo(POT.WH[0] - 70, POT.WH[1] + 20); ctx.lineTo(POT.WH[0] + 70, POT.WH[1] + 20); ctx.lineTo(POT.WH[0] + 130, POT.FLR); ctx.lineTo(POT.WH[0] - 130, POT.FLR); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.beginPath(); ctx.ellipse(POT.WH[0], POT.WH[1] + 34, 230, 30, 0, 0, Math.PI); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(POT.WH[0], POT.WH[1] + 34, 230, 30, 0, 0, Math.PI); ctx.stroke();
    ctx.restore();
    // grandmother (indigo, a bun), standing at the wheel, leaning in; her hands on the clay, then they lift away
    const lift = smooth(span(t, A.lift - .1, A.lift + .7)), work = Math.sin(t * 2.3) * .03 * (1 - lift);
    const gx = POT.GX + dx, gy = POT.FLR + dy;
    if (out < .98) {
      const o = { dir: 1, light: 1, long: true, lean: lerp(.16, .06, lift), look: lerp(.55, .75, lift), rim: mixHex(P.blue0, P.halo1, .6),
        armR: [lerp(1.02, .55, lift) + work, lerp(1.62, .9, lift)], armL: [lerp(1.12, .62, lift) - work, lerp(1.7, 1.0, lift)] };
      E.person(ctx, gx, gy, POT.GH, o);
      const hy = gy - .885 * POT.GH; ctx.save(); ctx.translate(gx, hy); ctx.translate(0, POT.GH * .885); ctx.rotate(o.lean); ctx.translate(0, -POT.GH * .885);
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(-.07 * POT.GH, -.03 * POT.GH, .045 * POT.GH, 0, 6.29); ctx.fill();
      ctx.fillStyle = rgba(P.blue1, .5); ctx.beginPath(); ctx.arc(-.06 * POT.GH, -.05 * POT.GH, .018 * POT.GH, 0, 6.29); ctx.fill(); ctx.restore();
    }
    // the wheel + cup (rings)
    potRings(ctx, t, v, { wet: 1 - lift * .5 });
    // the bulb: cord, glass, the hero light; it leaves through the top as the camera rises over the wheel
    const by = POT.BULB[1] - 260 * out;
    ctx.strokeStyle = P.night0; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(POT.BULB[0], -900); ctx.lineTo(POT.BULB[0], by - 34); ctx.stroke();
    ctx.fillStyle = P.night0; ctx.fillRect(POT.BULB[0] - 12, by - 40, 24, 22);
    E.lightForm(ctx, 'disc', POT.BULB[0] - 26, by - 22, 52, 60, t, { dust: 900, seed: 52, breath: .015 });
    E.halo(ctx, POT.BULB[0], by + 6, 300, .28, P.halo1, P.halo2);
  });
  return c;
}
