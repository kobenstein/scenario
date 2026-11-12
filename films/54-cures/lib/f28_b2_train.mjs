// Film 28 · B2 · No. 4 THE ELEPHANTS AND THE TRAIN (c10), out of the light door of 5.11 → down into the night grass → plateGrass.
// The train world IS the grass world of the seam (lib/f28_seams.mjs grassWorld, copied here line by line so it can take hooks): the
// track on its 6000 card is the embankment of plateGrass. Everything of the train story lives on that card and on two extra cards at
// x ≥ 2160 (design px), i.e. outside the plate's view, so the picture the camera comes home to is exactly plateGrass.
//   4.01 out of the headlight: the locomotive in the night forest, you in the cab, the cone ahead · 4.02 the camera runs ahead along
//   the cone, past its tip, into the dark: the cow and calf on the track · 4.03 a tower's cool eye opens, heat: they glow like lanterns
//   (REAL) · 4.04 wide: 12 towers along ≈ 7 km, cool view cones; the bead sends two letters: DRIVER, RANGERS · 4.05 one beat of the
//   unopened pile (No. 8), the letter opens warm, the hand pulls the brake, the train stops short · 4.06 a serif 0 over the stretch ·
//   4.07 the elephants cross; the camera rises and pulls back over the treetops · 4.08 two slabs (≈ 600 · ≈ 58,000) · 4.09 down into
//   the grass: the shadow moves through the blades → plateGrass at 'The snake' − 0.5.
// Camera: an aimPath on the 6000 card. While it rides with the train its keys are relative to the nose (X(t)); later world-fixed.
// The near grass cards (3200 / 2200 / 1500) are passed on the way home ABOVE the blade tips (checked: tools in the B2 scratchpad), so
// they rise in from below; card 3200 only joins once the camera is safely beyond it (no pop).
import * as E from './f10_editorial.mjs';
import * as F from './f28_kit.mjs';
import * as S from './f28_seams.mjs';
import * as B from './f28_b2_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, prng, F0 } = E;
const TAU = Math.PI * 2;

export const ZT = 6000;
const ZFAR = 8000, ZBUSH = 5300;
export const railY = (x) => 560 - 12 * (x + 3000) / 8000;
const L = 180, HB = L * .3, CONE = 360;
export const LSTOP = 2800, V0 = 26;
const XE = 3080, XC = 3036;                                             // cow, calf (on the track, ahead)
const TOWERS = Array.from({ length: 12 }, (_, k) => { const x = 2240 + 95 * k, far = k % 2 === 0; return { x, y: railY(x) + (far ? -9 : 15), h: far ? 74 : 88, far, k }; });
const SPOT = 8;                                                          // the tower that sees the elephants first
const HUT = { x: 3420, y: railY(3420) - 12, s: 44 };
const X0 = 2160;                                                         // nothing of the train story left of this (the plate's view ends at 1920)
// forest behind the track (6000 card) and the far tree line (8000 card)
const TREES = (() => { const r = prng(4404), a = []; for (let x = X0 + 20; x < 4600; x += 34 + r() * 60) a.push({ x, top: 372 + r() * 96, w: 26 + r() * 30, ph: r() * 6.3, tone: r() }); return a; })();
const FARLINE = (() => { const r = prng(4405), a = []; for (let x = X0 + 10; x < 7000; x += 40 + r() * 50) a.push([x, 440 + r() * 40]); return a; })();
const BUSH = (() => { const r = prng(4406), a = []; for (let x = X0 + 30; x < 5200; x += 60 + r() * 90) a.push({ x, y: 600 + r() * 40, r: 30 + r() * 50, ph: r() * 6.3, trunk: false }); return a; })();
// the grass of the seam (copied from lib/f28_seams.mjs: same seed, same order) + more of it right of the plate's view
const BLADES = (() => { const r = prng(3303), b = []; for (let L = 0; L < 3; L++) for (let k = 0; k < 120; k++) b.push([L, -100 + r() * 2120, 260 + r() * 340 + L * 120, r() * 6.3, .6 + r() * .8]); return b; })();
const BLADES2 = (() => { const r = prng(3304), b = []; for (let L = 0; L < 3; L++) for (let k = 0; k < 230; k++) b.push([L, X0 + 10 + r() * 3990, 260 + r() * 340 + L * 120, r() * 6.3, .6 + r() * .8]); return b; })();
const GZ = [3200, 2200, 1500], GBASE = [760, 900, 1080];

// ---------------------------------------------------------------- the letter of No. 8 (an alert): cool and shut, or opened and warm
// (the same drawing as scenes/sc06.mjs letter(), copied: the callback must look identical)
function letter(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s < 1) return;
  const warm = clamp(o.warm ?? 0), open = clamp(o.open ?? 0), dim = clamp(o.dim ?? 0), w = s, h = s * .64;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.tilt ?? 0);
  if (warm > 0) halo(ctx, 0, -h * .2 * open, s * (1.3 + 1.2 * warm), .55 * warm, P.halo0, P.core0);
  else if ((o.glow ?? 1) > 0) halo(ctx, 0, 0, s * 1.1, .22 * (1 - dim) * (o.glow ?? 1), F.COOL.halo, F.COOL.body);
  if (open > 0) { const sh = h * .9 * expoOut(open); ctx.fillStyle = lin(ctx, 0, -h / 2 - sh, 0, 0, [[0, P.core0], [1, mixHex(P.core1, P.halo0, .4)]]); ctx.fillRect(-w * .4, -h / 2 - sh + h * .1, w * .8, sh + h * .3);
    ctx.fillStyle = rgba(P.shade0, .5); for (let k = 0; k < 3; k++) ctx.fillRect(-w * .3, -h / 2 - sh + h * (.28 + k * .16), w * (.6 - .15 * (k === 2)), Math.max(1, h * .045)); }
  const c0 = mixHex(mixHex(F.COOL.body, P.cream, .5), P.halo2, warm), c1 = mixHex(F.COOL.body, P.halo0, warm), c2 = mixHex(mixHex(F.COOL.deep, F.COOL.body, .5), P.shade0, warm);
  const dk = (c) => mixHex(c, P.night1, .62 * dim);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, dk(c0)], [.5, dk(c1)], [1, dk(c2)]]);
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, s * .04); ctx.fill();
  ctx.strokeStyle = rgba(dk(mixHex(F.COOL.deep, P.shade0, warm)), .8); ctx.lineWidth = Math.max(1, s * .03);
  const fy = lerp(h * .1, -h * 1.0, expoOut(open));
  ctx.beginPath(); ctx.moveTo(-w / 2 + s * .03, -h / 2 + s * .03); ctx.lineTo(0, fy); ctx.lineTo(w / 2 - s * .03, -h / 2 + s * .03); ctx.stroke();
  if (open > 0) { ctx.fillStyle = rgba(dk(c2), .9 * span(open, .2, .6)); ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, fy); ctx.lineTo(w / 2, -h / 2); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = rgba(P.cream, .45 * (1 - dim)); ctx.fillRect(-w * .38, h * .18, w * .2, h * .05);
  ctx.restore();
}

export function makeTrain(T, a, tp) {
  const tP2 = a.snake - S.SEAM_HALF, tB0 = tP2 - 1.8;
  // ---------------------------------------------------------------- the train: runs at V0, brakes on 'the train brakes', stops at LSTOP
  const tb = a.brakes - .05, DB = 2.6, DBX = V0 * DB / 2;
  const Lx = (t) => (t <= tb ? LSTOP - DBX - V0 * (tb - t) : LSTOP - DBX * (1 - Math.min(1, (t - tb) / DB)) ** 2);
  const tStop = tb + DB;
  const lampAt = (t) => { const x = Lx(t); return [x - L * .012, railY(x) - HB * .44]; };
  const cabAt = (t) => { const x = Lx(t); return [x - L * .14, railY(x) - HB * .75]; };
  // ---------------------------------------------------------------- camera (6000 card): u relative to X(t) (the nose while riding, LSTOP once world-fixed)
  const wT = (t) => 1 - E.smooth(span(t, a.bytime - .3, a.find + .3));
  const X = (t) => LSTOP + wT(t) * (Lx(t) - LSTOP);
  const plateView = (t) => { const k = 1 + S.CREEP * (t - tP2), c = E.aim(F0, 960 + S.TRUCK * (t - tP2), 540, k), m = E.cardM(c, ZT); return { u: (W / 2 - m.e) / m.k, v: (H / 2 - m.f) / m.k, s: m.k }; };
  const A = (t, u, v, s, e) => [t, u - LSTOP, v, s, e];                  // a world-fixed key
  const lp = lampAt(tp), pe = plateView(tP2);
  const KT = [
    [tp, -L * .012, lp[1], 40],                                          // in the headlight (the door)
    [tp + 2.4, 70, 512, 2.9, 'o'],                                       // out of it: the locomotive, the cone ahead
    [a.corridor + .6, -10, 518, 3.8],
    [a.bytime - .3, -28, 522, 4.8],                                      // you at the controls
    A(a.find + .3, 2760, 512, 2.7),                                      // ahead along the cone to its tip
    A(a.toolate + .7, 3030, 512, 3.4),                                   // past it, into the dark: the elephants
    A(a.unless + .5, 3040, 506, 3.2),
    A(a.cameras + .7, 2800, 440, 1.65),                                  // wide: the towers along the line
    A(a.driver + .2, 2920, 446, 1.7),
    A(a.rangers + .6, 2950, 452, 1.75),
    A(a.thistime + 1.1, 2760, 508, 3.0),                                 // the letter at the cab
    A(a.brakes + 1.4, 2930, 505, 2.6),                                   // the train stops short
    A(a.stretch + .6, 2950, 470, 2.35),
    A(a.live + .3, 2990, 475, 2.3),
    A(a.giants + .9, 3080, 500, 2.5),                                    // the elephants cross
    A(a.across + .2, 2900, 402, 2.2),                                    // up over the trees …
    A(a.smaller + .8, 2200, 398, 1.6),
    A(a.hundred + .8, 1500, 440, 1.25),
    A(tP2, pe.u, pe.v, pe.s),                                            // … and down into the grass (= the plate camera at tP2)
  ];
  const view = (t) => {
    const p = B.aimPath(t, KT), q0 = { u: p.u + X(t), v: p.v, s: p.s };
    const q = B.driftView(q0, t, 3.0 * span(t, tp + .8, tp + 2.6) * (1 - span(t, tB0 - 1.2, tB0)), 5);
    if (t < tB0) return q;
    // the last stretch hands over to the plate's own creep: the path arrives at the plate camera of tP2 while its weight fades into the
    // moving plate camera, so the camera never stops (velocity at tP2 = the plate's creep)
    const pl = plateView(t), w = E.smooth(span(t, tB0, tP2));
    return { u: lerp(q.u, pl.u, w), v: lerp(q.v, pl.v, w), s: Math.exp(lerp(Math.log(q.s), Math.log(pl.s), w)) };
  };
  const cam = (t) => B.camOf(ZT, view(t));
  const tE3 = a.thistime + 1.1;                                          // card 3200 joins (camera beyond it)

  // ---------------------------------------------------------------- beats
  const heatOn = (t) => E.smooth(span(t, a.unless + .7, a.unless + 1.5));
  const eyeOn = (k, t) => (k === SPOT ? E.smooth(span(t, a.unless + .1, a.unless + .5)) : E.smooth(span(t, a.cameras + .1 + .07 * Math.abs(k - SPOT), a.cameras + .5 + .07 * Math.abs(k - SPOT))));
  const coneOn = (k, t) => (k === SPOT ? E.smooth(span(t, a.unless + .3, a.unless + .9)) : E.smooth(span(t, a.heat - .1 + .05 * Math.abs(k - SPOT), a.heat + .5 + .05 * Math.abs(k - SPOT)))) * (1 - .45 * E.smooth(span(t, a.stretch, a.stretch + 1.5)));
  const beadU = (t) => expoOut(span(t, a.spots - .1, a.spots + .5));
  const sp = TOWERS[SPOT], beadP = [sp.x + sp.h * .12, sp.y - sp.h - 12];
  const hutWin = [HUT.x + HUT.s * .18, HUT.y - HUT.s * .3];
  // elephants: on the track (facing the train), then they turn and cross toward us
  const cross = (t, d = 0) => span(t, a.giants - .2 + d, a.giants + 5 + d);
  function elephants(ctx, t) {
    const h0 = heatOn(t);
    for (const [x0, h, d, ph] of [[XC, 21, .5, 1], [XE, 34, 0, 0]]) {
      const u = cross(t, d), turn = sineIO(span(t, a.giants - .4 + d, a.giants + .5 + d)), e = sineIO(u);
      const x = x0 + 80 * e, y = railY(x0) + 1 + 46 * e, hh = h * (1 + .3 * e);
      if (h0 < 1) halo(ctx, x, y - hh * .9, hh * 2.6, .32 * (1 - h0), P.blue0, mixHex(P.blue0, P.halo2, .45));   // a faint cool rim so they read in the dark
      const hv = h0 * (1 - .35 * E.smooth(span(t, a.across, a.across + 2)));   // in the dark: a pale moonlit grey-blue, so the shapes read before the heat view
      F.elephant(ctx, t, x, y, hh, { dir: -Math.cos(Math.PI * turn), heat: hv, col: mixHex(mixHex(P.ind1, P.blue1, .55), mixHex(P.halo0, P.coat, .5), hv), walk: u > 0 && u < 1 ? t * 2.6 + ph : ph, a: 1 });
    }
  }
  // the two letters: to the driver (cab) and to the rangers (hut)
  const LET = [{ t0: a.driver - .2, t1: a.driver + .75, to: (t) => { const c = cabAt(t); return [c[0] + 4, c[1] - 24]; } }, { t0: a.rangers - .2, t1: a.rangers + .7, to: () => [hutWin[0], hutWin[1] - 30] }];
  const openA = (t) => span(t, a.thistime + 1.15, a.thistime + 1.9), openB = (t) => span(t, a.thistime + 1.4, a.thistime + 2.1);
  function letters(ctx, t) {
    LET.forEach((Lt, i) => {
      if (t < Lt.t0) return;
      const u = span(t, Lt.t0, Lt.t1), e = sineIO(u), to = Lt.to(t), x = lerp(beadP[0], to[0], e), y = lerp(beadP[1], to[1], e) - 70 * Math.sin(Math.PI * e);
      const op = i ? openB(t) : openA(t), gone = E.smooth(span(t, a.brakes + .4 + i * .3, a.brakes + 1.6 + i * .3));
      if (gone >= 1) return;
      const s = 17 * (1 - .6 * gone) * (.5 + .5 * expoOut(span(t, Lt.t0, Lt.t0 + .3)));
      // 4.05: one beat of the unopened pile of No. 8 beside the driver's letter
      if (!i) { const pu = Math.sin(Math.PI * span(t, a.thistime - .1, a.thistime + 1.2)); if (pu > 0) for (let k = 0; k < 3; k++) letter(ctx, t, x - 14 - k * 9, y + 6 - k * 7, 15, { dim: 1, glow: 0, a: pu * .9, tilt: -.12 + k * .1 }); }
      letter(ctx, t, x, y + 6 * gone, s, { open: op, warm: op, a: 1 - gone, tilt: .06 * Math.sin(t * 1.3 + i) * (1 - op) });
    });
  }
  // you at the controls (seen through the cab window): a hand on the brake lever
  const pull = (t) => sineIO(span(t, a.brakes - .3, a.brakes + .4));
  function cabWin(t) {
    return (ctx, x0, y0, w, h) => {
      const pu = pull(t);
      ctx.strokeStyle = mixHex(P.night0, P.ind1, .5); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x0 + w * .78, y0 + h); ctx.lineTo(x0 + w * (.72 + .12 * pu), y0 + h * .55); ctx.stroke();   // the lever
      E.du(ctx, x0 + w * .38, y0 + h * 1.95, h * 1.9, { view: 'side', dir: 1, look: .25, lean: .06 - .1 * pu, armR: [lerp(1.35, .75, pu), lerp(1.55, 1.25, pu)], armL: [.3, .5], light: 1, back: .25, hood: false });
    };
  }
  // ---------------------------------------------------------------- the world (the seam's grass world + the train story at x ≥ X0)
  function forest(ctx, t) {
    for (const tr of TREES) {
      const base = 534, col = mixHex(P.night0, P.ind0, .4 + .3 * tr.tone), sway = 2 * Math.sin(t * .4 + tr.ph);
      ctx.fillStyle = col; ctx.fillRect(tr.x - 2, tr.top + 30, 4, base - tr.top - 30);
      ctx.beginPath(); ctx.ellipse(tr.x + sway, tr.top + tr.w * .9, tr.w * .55, tr.w * 1.05, 0, 0, TAU); ctx.ellipse(tr.x - tr.w * .3 + sway * .7, tr.top + tr.w * 1.5, tr.w * .45, tr.w * .7, 0, 0, TAU); ctx.ellipse(tr.x + tr.w * .32 + sway * .7, tr.top + tr.w * 1.45, tr.w * .45, tr.w * .72, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(P.blue0, .22 + .12 * tr.tone); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(tr.x + sway, tr.top + tr.w * .9, tr.w * .55, tr.w * 1.05, 0, Math.PI * 1.1, Math.PI * 1.75); ctx.stroke();
    }
    ctx.fillStyle = mixHex(P.night0, P.ind0, .3); ctx.fillRect(X0 + 20, 528, 4600 - X0, 10);
  }
  function track(ctx, t) {
    // the hill and the rail beyond the seam's own (x > 4000)
    F.hills(ctx, [[3990, 520], [4000, 520], [5200, 506], [6400, 498], [8000, 512], [9500, 520]], { top: mixHex(P.night1, P.ind1, .5), bottom: P.night0, rimA: .3, depth: 400 });
    ctx.strokeStyle = rgba(mixHex(P.blue1, P.halo2, .4), .6); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(3990, railY(3990)); ctx.lineTo(9500, railY(9500)); ctx.stroke();
    // sleepers and the second rail (only right of the plate's view)
    for (let x = X0 + 4; x < 4600; x += 9) { const fa = span(x, X0, X0 + 240); ctx.fillStyle = rgba(mixHex(P.night0, P.blue0, .35), .8 * fa); ctx.fillRect(x, railY(x) + 1, 4, 6); }
    ctx.strokeStyle = rgba(mixHex(P.blue1, P.halo2, .4), .3); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0, railY(X0) + 6); ctx.lineTo(4600, railY(4600) + 6); ctx.stroke();
  }
  function towers(ctx, t, front) {
    for (const tw of TOWERS) { if (tw.far === front) continue;
      const dir = tw.k === SPOT ? 1 : (tw.k % 4 < 2 ? 1 : -1);
      B.tower(ctx, t, tw.x, tw.y, tw.h, { eye: eyeOn(tw.k, t), heat: coneOn(tw.k, t), cool: true, coneLen: tw.h * 1.5, dir }); }
  }
  function cone(ctx, t, lamp) {
    const [x, y] = lamp, ry = railY(x + CONE * .5), fl = .92 + .08 * Math.sin(t * 7.3) * Math.sin(t * 2.1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, x, 0, x + CONE, 0, [[0, rgba(P.halo1, .4 * fl)], [.55, rgba(P.halo1, .14 * fl)], [1, rgba(P.halo1, 0)]]);
    ctx.beginPath(); ctx.moveTo(x, y - 3); ctx.lineTo(x + CONE, y - 40); ctx.lineTo(x + CONE, ry + 6); ctx.lineTo(x, y + 3); ctx.closePath(); ctx.fill();
    ctx.restore();
    F.pool(ctx, x + CONE * .4, ry + 2, CONE * .45, 7, .9 * fl);
  }
  function story(ctx, t) {
    forest(ctx, t); track(ctx, t);
    towers(ctx, t, false);
    B.hut(ctx, t, HUT.x, HUT.y, HUT.s, { win: .7 + .3 * E.smooth(span(t, a.thistime + 1.4, a.thistime + 2.2)) });
    elephants(ctx, t);
    const brake = t > tb && t < tStop + .2 ? Math.sin(Math.PI * span(t, tb, tStop + .2)) : 0;
    const lo = B.loco(ctx, t, Lx(t), railY(Lx(t)), L, { lamp: 1, cars: 2, brake, cabWin: cabWin(t) });
    cone(ctx, t, lo.lamp);
    towers(ctx, t, true);
    const bu = beadU(t); if (bu > 0) F.agent(ctx, t, beadP[0], beadP[1], 6 * bu, { think: span(t, a.spots, a.spots + .6) * (1 - span(t, a.thistime, a.thistime + 1)) });
    letters(ctx, t);
  }
  function far(ctx) {
    const q = E.catmull(FARLINE, 6); ctx.fillStyle = mixHex(P.ind0, P.blue0, .22); ctx.beginPath(); ctx.moveTo(q[0][0], 600); q.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.lineTo(q[q.length - 1][0], 600); ctx.closePath(); ctx.fill();
  }
  function bushes(ctx, t) {
    for (const b of BUSH) {
      const sw = 3 * Math.sin(t * .5 + b.ph);
      if (b.trunk) { ctx.fillStyle = P.night0; ctx.fillRect(b.x - 7, 120, 14, b.y); ctx.beginPath(); ctx.ellipse(b.x + sw, 150, 60, 110, 0, 0, TAU); ctx.fill(); }
      ctx.fillStyle = mixHex(P.night0, P.ind0, .32); ctx.beginPath(); ctx.ellipse(b.x + sw, b.y, b.r, b.r * .6, 0, 0, TAU); ctx.ellipse(b.x + b.r * .6 + sw * .6, b.y + b.r * .25, b.r * .7, b.r * .45, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(P.blue0, .2); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(b.x + sw, b.y, b.r, b.r * .6, 0, Math.PI * 1.15, Math.PI * 1.7); ctx.stroke();
    }
    ctx.fillStyle = mixHex(P.night0, P.ind0, .32); ctx.fillRect(X0 + 30, 640, 5200 - X0, 900);
  }
  // st: mid(ctx) (screen-space things that sink into the grass, drawn between the 2200 and the 1500 grass card)
  function world(ctx, t, st = {}) {
    const c = cam(t);
    // ---- grassWorld (lib/f28_seams.mjs), unchanged, with the hooks marked ★
    F.sky(ctx, c, t, { glow: [960, 300, 900], hor: 520 });
    E.card(ctx, c, ZFAR, () => far(ctx));                                                                          // ★
    E.card(ctx, c, 6000, () => { F.hills(ctx, [[-2000, 520], [0, 500], [960, 512], [2000, 498], [4000, 520]], { top: mixHex(P.night1, P.ind1, .5), bottom: P.night0, rimA: .3, depth: 400 });
      ctx.strokeStyle = rgba(mixHex(P.blue1, P.halo2, .4), .6); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-3000, 560); ctx.lineTo(5000, 548); ctx.stroke();
      story(ctx, t); });                                                                                          // ★
    E.card(ctx, c, ZBUSH, () => bushes(ctx, t));                                                                   // ★
    const shadowX = 600 + 140 * Math.sin(t * .4), shadowA = 1;
    for (let L = 0; L < 3; L++) {
      if (L === 0 && t < tE3) continue;                                                                           // ★ card 3200 joins behind the camera
      E.card(ctx, c, GZ[L], () => {
        const base = GBASE[L], col = [mixHex(P.ind0, P.blue0, .2), mixHex(P.night1, P.ind1, .5), P.night0][L];
        ctx.fillStyle = col; ctx.fillRect(-2000, base, 6000, 800);
        ctx.fillRect(4000, base, 3000, 800);                                                                      // ★
        for (const BL of [BLADES, BLADES2]) for (const [l, x, hh, ph, f] of BL) { if (l !== L) continue; const near = Math.exp(-((x - shadowX) ** 2) / 9000) * shadowA * (L === 1 ? 1 : .3), bend = 18 * Math.sin(t * f + ph) + 60 * near * Math.sign(x - shadowX) + 40 * Math.sin(ph * 3.1);
          const h2 = hh * (.45 + .3 * Math.sin(ph * 5.3) ** 2), bw = (16 - L * 4) * (.7 + .3 * f);
          ctx.fillStyle = mixHex(col, mixHex(P.blue0, P.blue1, .3), .3 + .22 * (2 - L) / 2 + .1 * Math.sin(ph * 7));
          ctx.beginPath(); ctx.moveTo(x - bw / 2, base + 4); ctx.quadraticCurveTo(x + bend * .2 - bw * .3, base - h2 * .55, x + bend, base - h2); ctx.quadraticCurveTo(x + bend * .2 + bw * .3, base - h2 * .5, x + bw / 2, base + 4); ctx.fill(); }
        if (L === 1 && shadowA > 0) { ctx.fillStyle = rgba(P.night0, .55 * shadowA); ctx.beginPath(); ctx.ellipse(shadowX, base - 60, 160, 30, 0, 0, TAU); ctx.fill(); }
      });
      if (L === 1 && st.mid) st.mid(ctx, c);                                                                      // ★
    }
    return c;
  }
  // ---------------------------------------------------------------- screen-space things anchored to the 6000 card
  function overlays(ctx, c, t) {
    const PT = (x, y) => E.project(c, ZT, x, y);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // 4.04 the stretch: 12 TOWERS · ≈ 7 KM (a bracket over the towers)
    const bu = span(t, a.cameras + .5, a.cameras + 1.4) * (1 - span(t, a.spots - .3, a.spots + .3));
    if (bu > 0) { const p0 = PT(TOWERS[0].x, 410), p1 = PT(TOWERS[11].x, 410); F.bracket(ctx, p0[0], p1[0], p0[1], bu, '12 TOWERS · ≈ 7 KM', { col: 'cool', size: 32 }); }
    // DRIVER · RANGERS
    const du1 = span(t, a.driver + .4, a.driver + 1.1) * (1 - span(t, a.thistime - .2, a.thistime + .3));
    if (du1 > 0) { const cp = cabAt(t), p = PT(cp[0] - 6, cp[1] - 4); F.label(ctx, p[0], p[1], 'DRIVER', null, du1, { dx: -60, dy: -90, col: 'cool' }); }
    const du2 = span(t, a.rangers + .4, a.rangers + 1.1) * (1 - span(t, a.thistime - .1, a.thistime + .4));
    if (du2 > 0) { const p = PT(HUT.x, HUT.y - HUT.s); F.label(ctx, p[0], p[1], 'RANGERS', null, du2, { dx: 50, dy: -80, col: 'cool' }); }
    // 4.06 a serif 0 over the watched stretch
    const zu = span(t, a.stretch + .3, a.killed + .3), zo = expoIn(span(t, a.giants - .2, a.giants + .5));
    if (zu > 0 && zo < 1) {
      const p = PT(2950, 330), y = Math.max(300, Math.min(400, p[1])), x = Math.max(560, Math.min(1360, p[0]));
      ctx.globalAlpha = F.rise(zu) * (1 - zo);
      F.maskLine(ctx, [['0', 1]], x, y + 40 * zo, 210, F.rise(span(t, a.stretch + .3, a.stretch + 1.1)), { align: 'center' });
      F.maskLine(ctx, [['ELEPHANTS KILLED ON THIS STRETCH', 0]], x, y + 66, 34, F.rise(span(t, a.killed - .4, a.killed + .4)), { serif: false, weight: 600, align: 'center', glow: false });
      F.maskLine(ctx, [['SINCE NOV 2023 · OFFICIALS', 0]], x, y + 112, 24, F.rise(span(t, a.live - .5, a.live + .2)), { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
  // 4.08 the two slabs (screen space; they sink into the grass on 'It hides in the grass')
  function slabs(ctx, c, t) {
    const u0 = span(t, a.across + .1, a.across + .9), sink = sineIO(span(t, a.hides - .2, a.hides + 1.3));
    if (u0 <= 0 || sink >= 1) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(0, 220 * sink); ctx.globalAlpha = 1 - sink;
    F.maskLine(ctx, [['PEOPLE KILLED A YEAR · INDIA', 0]], 330, 206, 28, F.rise(u0), { serif: false, weight: 600, col: P.halo2, glow: false });
    const u1 = span(t, a.across + .3, a.across + 1.1), u2 = span(t, a.smaller - .1, a.hundred + .5);
    F.slab(ctx, t, 330, 300, 1180 * 600 / 58000, 40, { col: 'warm', u: u1 });
    F.slab(ctx, t, 330, 410, 1180, 40, { col: 'warm', u: u2 });
    B.approx(ctx, '600', 330 + Math.max(2, 1180 * 600 / 58000 * expoOut(u1)) + 36, 314, 44, F.rise(span(u1, .5, 1)), {});
    B.approx(ctx, '58,000', 330 + 1180 * expoOut(u2) + 36, 424, 44, F.rise(span(u2, .6, 1)), {});
    F.maskLine(ctx, [['ELEPHANTS', 0]], 330, 262, 24, F.rise(span(t, a.across + .3, a.across + 1)), { serif: false, weight: 600, col: P.cream, glow: false });
    F.maskLine(ctx, [['SNAKES', 0]], 330, 372, 24, F.rise(span(t, a.smaller, a.smaller + .7)), { serif: false, weight: 600, col: P.cream, glow: false });
    ctx.restore();
  }
  function draw(ctx, t) { const c = world(ctx, t, { mid: (cx, cc) => slabs(cx, cc, t) }); overlays(ctx, c, t); return c; }
  return { draw, world, overlays, cam, view, Lx, tP2, tE3, KT };
}
