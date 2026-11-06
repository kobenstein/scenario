// Film 10 · style prototype "Editorial-Nacht": three key frames + the 20-s style reference (K1 → K2 → K3), all from code.
//   node tools/editorial_proto.mjs stills <outdir>                       K1.jpg K2.jpg K3.jpg (1920×1080)
//   FILM=./tools/editorial_proto.mjs node --expose-gc render.mjs --out x.mp4 --from 0 --to 20    (render.mjs uses build())
// One continuous world, no blends: K1 → K2 and K2 → K3 are flights INTO the light form (fingertip spark, hall window);
// both sides of each cut draw the same full-light frame.
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import {
  W, H, P, rgba, mixHex, lin, rad, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, drift, prng,
  cam, plane, toScreen, nightSky, stars, halo, glowFill, dust, lightHand, handMatrix, applyM, HAND_TIP, trail, catmull,
  du, robot, finish, prepareEditorial,
} from '../lib/f10_editorial.mjs';

// ======================= K1 · Hook: a hand of light guides a small robot; you stand before it =======================
const K1 = (() => {
  const tip = [1192, 568], ang = Math.atan2(380, -560), Lh = 365;
  const [ox, oy] = applyM(handMatrix(0, 0, ang, Lh, -1), ...HAND_TIP);   // flip -1 puts the index finger on the upper side
  const wx = tip[0] - ox, wy = tip[1] - oy;
  return { tip, ang, Lh, wrist: [wx, wy], spark: [1186, 574], ledgeY: 896, place(rh) { this.spark = rh; this.tip = [rh[0] + 9, rh[1] - 7]; const [qx, qy] = applyM(handMatrix(0, 0, this.ang, this.Lh, -1), ...HAND_TIP); this.wrist = [this.tip[0] - qx, this.tip[1] - qy]; } };
})();
function drawK1(ctx, t, C, s) {
  plane(ctx, C, 0, () => {
    nightSky(ctx, [[0, P.night0], [.45, P.night1], [1, P.ind0]]);
    ctx.fillStyle = rad(ctx, 1420, 420, 1250, [[0, rgba(P.blue0, 1)], [.38, rgba(P.blue0, .55)], [.75, rgba(P.ind1, .25)], [1, rgba(P.ind0, 0)]]);
    ctx.fillRect(-W, -H, 3 * W, 3 * H);
    stars(ctx, 3, 150, t, [0, 0, W, H * .9], .85);
  });
  plane(ctx, C, .3, () => {           // big soft editorial sweeps
    ctx.beginPath(); ctx.moveTo(-300, 420); ctx.bezierCurveTo(250, 380, 640, 700, 760, 1250); ctx.lineTo(-300, 1250); ctx.closePath();
    ctx.fillStyle = lin(ctx, 520, 640, 80, 1000, [[0, rgba(P.ind1, .0)], [.35, rgba(P.ind1, .7)], [1, rgba(P.ind0, 1)]]); ctx.fill();
    ctx.beginPath(); ctx.moveTo(380, -200); ctx.bezierCurveTo(900, 120, 700, 560, 1000, 1250); ctx.lineTo(1400, 1250); ctx.bezierCurveTo(1000, 560, 1200, 120, 760, -200); ctx.closePath();
    ctx.fillStyle = lin(ctx, 640, 0, 1150, 300, [[0, rgba(P.blue0, 0)], [.5, rgba(P.blue0, .35)], [1, rgba(P.blue0, 0)]]); ctx.fill();
  });
  plane(ctx, C, 1, () => {
    const br = 1 + .035 * Math.sin(t * 1.25), m = handMatrix(K1.wrist[0] + drift(t, 3), K1.wrist[1] + drift(t, 2, 1), K1.ang, K1.Lh, -1);
    halo(ctx, 1500, 330, 1100 * br, .14, P.blue0, P.halo1);
    lightHand(ctx, m, t, { a: 1 });
    // ledge
    const ly = K1.ledgeY;
    ctx.beginPath(); ctx.moveTo(760, ly + 6); ctx.lineTo(2100, ly - 8); ctx.lineTo(2100, 1300); ctx.lineTo(735, 1300); ctx.closePath();
    ctx.fillStyle = lin(ctx, 0, ly, 0, H, [[0, P.ind1], [.08, P.night1], [1, P.night0]]); ctx.fill();
    ctx.fillStyle = lin(ctx, 760, 0, 1900, 0, [[0, rgba(P.blue0, .9)], [.45, rgba(P.halo1, .85)], [1, rgba(P.blue0, .7)]]);
    ctx.beginPath(); ctx.moveTo(760, ly + 6); ctx.lineTo(2100, ly - 8); ctx.lineTo(2100, ly - 2); ctx.lineTo(758, ly + 12); ctx.closePath(); ctx.fill();
    // robot, its right hand rising to the fingertip
    const a = smooth(s.arm);
    K1.rh = robot(ctx, 1066, ly + 2, 300, { light: 1, rim: mixHex(P.halo0, P.blue0, .25), body: P.ind0, armR: [lerp(.15, 2.42, a), lerp(.08, 2.5, a)], armL: [-.08, -.03] }).R;
    // you
    du(ctx, 848, ly + 4, 210, { dir: 1, look: s.look, light: 1, armR: [.24, .12], armL: [-.22, -.1] });
    // the contact spark
    if (s.spark > 0) {
      const [x, y] = K1.spark;
      halo(ctx, x, y, 260 * s.spark, .9 * s.spark);
      halo(ctx, x, y, 60 * s.spark, 1 * s.spark, P.core1, P.core0);
    }
  });
}

// ======================= K2 · the valley at night as a map of light =======================
const HOR = 440, F = 1000, CAMH = 330;
const proj = (X, Z) => [W / 2 + X * F / Z, HOR + CAMH * F / Z];
const K2 = (() => {
  const r = prng(2024), towns = [], pts = [];
  const mainSx = [[930, 760], [1090, 1080], [960, 1550], [1110, 2300], [1000, 3500], [1070, 6200]];
  for (const [sx, Z] of mainSx) towns.push({ X: (sx - W / 2) * Z / F, Z, main: true, n: 120 + r() * 80 });
  for (let i = 0; i < 130; i++) {
    const Z = 650 * Math.pow(11, r()), sx = -100 + r() * (W + 200);
    towns.push({ X: (sx - W / 2) * Z / F, Z, main: false, n: 20 + r() * r() * 160 });
  }
  for (const tw of towns) {
    const sig = 40 + Math.sqrt(tw.n) * 11;
    for (let i = 0; i < tw.n; i++) { let u = 0, v = 0; for (let k = 0; k < 3; k++) { u += r() - .5; v += r() - .5; } pts.push({ X: tw.X + u * sig * 1.8, Z: Math.max(420, tw.Z + v * sig * 1.3), town: tw }); }
  }
  const near = (a, k, f = () => true) => towns.filter((b) => b !== a && f(b)).map((b) => [Math.hypot(a.X - b.X, (a.Z - b.Z) * 1.4), b]).sort((p, q) => p[0] - q[0]).slice(0, k).map((p) => p[1]);
  for (const a of towns) for (const b of near(a, 2)) {
    const d = Math.hypot(a.X - b.X, a.Z - b.Z), n = Math.min(70, Math.floor(d / 40));
    for (let i = 1; i < n; i++) { const f = i / n, w = Math.sin(f * Math.PI) * 40 * (r() - .5); pts.push({ X: lerp(a.X, b.X, f) + w, Z: lerp(a.Z, b.Z, f), road: [a, b] }); }
  }
  for (const p of pts) { const [x, y] = proj(p.X, p.Z); p.x = x; p.y = y; p.s = clamp(2.4 * 800 / p.Z, .8, 2.6); p.tw = r() * 6.3; }
  const mains = towns.filter((t) => t.main), branches = [];
  mains.forEach((m) => { for (const b of near(m, 3, (b) => !b.main && Math.abs(b.Z - m.Z) < m.Z * .5)) branches.push({ from: m, to: b }); });
  return { towns, pts, mains, branches, hall: mains[mains.length - 1] };
})();
const K2FIG = { x: 372, y: 694, h: 156 };
function k2Trail(h) {
  const m0 = proj(K2.mains[0].X, K2.mains[0].Z);
  const nodes = [[h[0], h[1], 5], [lerp(h[0], m0[0], .45), lerp(h[1], m0[1], .25), 5]];
  for (const m of K2.mains) { const [x, y] = proj(m.X, m.Z); nodes.push([x, y, clamp(4.6 * 760 / m.Z, 1.1, 5)]); }
  return catmull(nodes, 16);
}
function drawK2(ctx, t, C, s) {
  plane(ctx, C, 0, () => {
    nightSky(ctx, [[0, P.night0], [.6, P.night1], [1, P.ind1]], 0, HOR + 40);
    ctx.fillStyle = rad(ctx, 1020, HOR + 60, 1200, [[0, rgba(P.blue0, .95)], [.45, rgba(P.blue0, .35)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-W, -H, 3 * W, H + HOR + 40);
    stars(ctx, 5, 190, t, [0, 0, W, HOR - 20], .9);
  });
  plane(ctx, C, .15, () => {            // one big soft sweep in the sky (the thumbnails' wing)
    ctx.beginPath(); ctx.moveTo(-200, 120); ctx.bezierCurveTo(500, -40, 1100, 160, 2200, 40); ctx.lineTo(2200, -300); ctx.lineTo(-200, -300); ctx.closePath();
    ctx.fillStyle = lin(ctx, 0, -100, 0, 140, [[0, rgba(P.night0, .9)], [1, rgba(P.night0, 0)]]); ctx.fill();
  });
  plane(ctx, C, .25, () => {            // far ridges, two layers, lit rims
    ctx.beginPath(); ctx.moveTo(-300, HOR + 30); ctx.bezierCurveTo(300, 330, 640, 330, 900, 380); ctx.bezierCurveTo(1100, 418, 1300, 318, 1560, 336); ctx.bezierCurveTo(1760, 350, 1960, 390, 2300, 360); ctx.lineTo(2300, HOR + 60); ctx.lineTo(-300, HOR + 60); ctx.closePath();
    ctx.fillStyle = lin(ctx, 0, 320, 0, HOR + 40, [[0, P.ind1], [1, P.ind0]]); ctx.fill(); ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-300, HOR + 20); ctx.bezierCurveTo(200, 400, 500, 392, 760, 414); ctx.bezierCurveTo(980, 432, 1300, 404, 1520, 420); ctx.bezierCurveTo(1800, 436, 2000, 410, 2300, 420); ctx.lineTo(2300, HOR + 60); ctx.lineTo(-300, HOR + 60); ctx.closePath();
    ctx.fillStyle = P.ind2; ctx.fill(); ctx.strokeStyle = rgba(P.blue1, .8); ctx.lineWidth = 1.5; ctx.stroke();
  });
  plane(ctx, C, .7, () => {             // valley floor + the points
    ctx.fillStyle = lin(ctx, 0, HOR + 10, 0, H, [[0, P.ind2], [.35, P.ind0], [1, P.night1]]); ctx.fillRect(-W, HOR + 12, 3 * W, H * 2);
    const u = s.u, n = K2.mains.length;
    K2.mains.forEach((m, i) => { m.lit = smooth(span(u, (i + .35) / (n + .3), (i + 1.1) / (n + .3))); });
    for (const tw of K2.towns) if (!tw.main) tw.lit = 0;
    for (const b of K2.branches) { b.p = smooth(span(b.from.lit, .3, 1)); b.to.lit = smooth(span(b.p, .75, 1)); }
    const lit = (tw) => tw.lit ?? 0;
    // the warm light form: one big glow pool over the lit valley, then haze per town
    const pool = clamp(u * 1.4);
    if (pool > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 1010, 640, 620, [[0, rgba(P.halo0, .55 * pool)], [.45, rgba(P.halo1, .2 * pool)], [1, rgba(P.halo1, 0)]]);
      ctx.setTransform(ctx.getTransform().scale(1, .55)); ctx.translate(0, 640 / .55 - 640); ctx.beginPath(); ctx.arc(1010, 640, 620, 0, 6.29); ctx.fill(); ctx.restore(); }
    for (const tw of K2.towns) { const l = lit(tw); if (l > .02) { const [x, y] = proj(tw.X, tw.Z); halo(ctx, x, y, (90 + tw.n * 1.5) * 800 / tw.Z, .6 * l, P.halo1, P.halo0); } }
    const cool = mixHex(P.blue2, P.cream, .35), zm = ctx.getTransform().a, zs = Math.pow(zm, .75);
    ctx.save();
    for (const p of K2.pts) {
      const l = p.town ? lit(p.town) : Math.min(lit(p.road[0]), lit(p.road[1]));
      ctx.fillStyle = l > .5 ? P.core1 : cool; ctx.globalAlpha = l > .5 ? 1 : (.72 + .2 * Math.sin(t * .8 + p.tw)) * (1 - l * .7);
      const sz = p.s * (l > .5 ? 1.35 : 1.1) / zs; ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
    }
    ctx.restore();
    for (const b of K2.branches) if (b.p > 0) { const [x0, y0] = proj(b.from.X, b.from.Z), [x1, y1] = proj(b.to.X, b.to.Z), w = clamp(1.8 * 760 / b.to.Z, .6, 2); trail(ctx, catmull([[x0, y0, w], [lerp(x0, x1, .5), lerp(y0, y1, .5) + 4, w], [x1, y1, w]], 8), b.p, { a: .7, spark: false }); }
    const [hx, hy] = proj(K2.hall.X, K2.hall.Z), hl = .3 + .7 * lit(K2.hall);
    halo(ctx, hx, hy, 40, .7 * hl); ctx.fillStyle = rgba(P.core0, hl); ctx.fillRect(hx - 4, hy - 3, 8, 5);
  });
  plane(ctx, C, .9, () => {             // right valley side
    ctx.beginPath(); ctx.moveTo(2300, 600); ctx.quadraticCurveTo(1800, 600, 1600, 800); ctx.bezierCurveTo(1480, 920, 1440, 1020, 1420, 1300); ctx.lineTo(2300, 1300); ctx.closePath();
    ctx.fillStyle = lin(ctx, 1500, 640, 1800, 1000, [[0, P.ind2], [1, P.night0]]); ctx.fill(); ctx.strokeStyle = rgba(P.blue1, .8); ctx.lineWidth = 2.5; ctx.stroke();
  });
  let hand = null;
  plane(ctx, C, 1, () => {              // your hill, you, the trail from your hand
    ctx.beginPath(); ctx.moveTo(-300, 660); ctx.quadraticCurveTo(160, 650, 372, 694); ctx.bezierCurveTo(600, 744, 820, 930, 1020, 1300); ctx.lineTo(-300, 1300); ctx.closePath();
    ctx.fillStyle = lin(ctx, 0, 660, 0, H, [[0, P.night1], [1, P.night0]]); ctx.fill(); ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = 3; ctx.stroke();
    const raise = s.raise ?? 1;
    hand = du(ctx, K2FIG.x, K2FIG.y, K2FIG.h, { dir: 1, light: 1, look: .2, armR: [lerp(.1, 1.75, raise), lerp(.05, 1.95, raise)], armL: [-.1, -.04] }).R;
    halo(ctx, hand[0], hand[1], 90, .8 * raise);
    if (s.glow > 0) halo(ctx, hand[0] + 14, hand[1] - 4, 150, s.glow, P.halo0, P.core0);
    trail(ctx, k2Trail(hand), s.u, { w: 4.4 });
  });
  return hand;
}

// ======================= K3 · the hall window; you, the trainer; a robot copies the move =======================
const WIN = { x: 1110, y: 70, w: 520, h: 790 };
function drawK3(ctx, t, C, s) {
  const fy = WIN.y + WIN.h;
  plane(ctx, C, 0, () => {
    nightSky(ctx, [[0, P.night0], [.7, P.night1], [1, P.ind0]], 0, fy);
    ctx.fillStyle = rad(ctx, WIN.x + WIN.w / 2, fy - 300, 1300, [[0, rgba(P.blue0, 1)], [.4, rgba(P.blue0, .5)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(-W, -H, 3 * W, 3 * H);
  });
  plane(ctx, C, .4, () => {
    ctx.beginPath(); ctx.moveTo(-200, -100); ctx.bezierCurveTo(500, 120, 640, 520, 520, 1100); ctx.lineTo(-200, 1100); ctx.closePath();
    ctx.fillStyle = lin(ctx, 560, 0, -100, 0, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, .75)]]); ctx.fill();
  });
  let hands = {};
  plane(ctx, C, 1, () => {
    // floor
    ctx.fillStyle = lin(ctx, 0, fy, 0, H, [[0, P.ind1], [.15, P.ind0], [1, P.night0]]); ctx.fillRect(-W, fy, 3 * W, H * 2);
    // the window
    const cx = WIN.x + WIN.w / 2, cy = WIN.y + WIN.h * .45, br = 1 + .03 * Math.sin(t * 1.1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(160px)'; ctx.fillStyle = rgba(P.blue0, 1); ctx.fillRect(WIN.x - 60, WIN.y - 60, WIN.w + 120, WIN.h + 60); ctx.filter = 'blur(420px)'; ctx.fillStyle = rgba(P.blue0, .6); ctx.fillRect(WIN.x - 200, WIN.y - 100, WIN.w + 400, WIN.h + 100);
    ctx.filter = 'blur(28px)'; ctx.fillStyle = rgba(P.halo1, .5); ctx.fillRect(WIN.x - 10, WIN.y - 10, WIN.w + 20, WIN.h + 10); ctx.restore();
    halo(ctx, cx, cy, 1150 * br, .1, P.halo1, P.halo2);
    ctx.fillStyle = rad(ctx, cx, cy + 160, WIN.h * .5, [[0, P.core0], [.15, P.core0], [.32, P.core1], [.55, P.halo0], [.85, P.halo0], [1, P.halo1]]); ctx.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
    
    ctx.save(); ctx.filter = 'blur(2px)'; ctx.strokeStyle = rgba(P.shade0, .3); ctx.lineWidth = 6;
    for (const f of [1 / 3, 2 / 3]) { ctx.beginPath(); ctx.moveTo(WIN.x + WIN.w * f, WIN.y); ctx.lineTo(WIN.x + WIN.w * f, fy); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(WIN.x, WIN.y + WIN.h * .28); ctx.lineTo(WIN.x + WIN.w, WIN.y + WIN.h * .28); ctx.stroke(); ctx.restore();
    // light falling out onto the floor
    ctx.beginPath(); ctx.moveTo(WIN.x, fy); ctx.lineTo(WIN.x + WIN.w, fy); ctx.lineTo(WIN.x + WIN.w + 360, H + 40); ctx.lineTo(WIN.x - 520, H + 40); ctx.closePath();
    ctx.save(); ctx.filter = 'blur(6px)'; ctx.fillStyle = lin(ctx, 0, fy, 0, H, [[0, rgba(P.halo2, .75)], [.45, rgba(P.halo1, .38)], [1, rgba(P.shade0, .12)]]); ctx.fill(); ctx.restore();
    dust(ctx, 77, 7000, cx, cy + 40, WIN.w * .62, WIN.h * .5, t, .9, P.halo1);
    // long shadows thrown by the window light toward the viewer
    ctx.save(); ctx.filter = 'blur(3px)'; ctx.fillStyle = rgba(P.night0, .75);
    ctx.beginPath(); ctx.moveTo(1385 - 30, fy + 44); ctx.lineTo(1385 + 30, fy + 44); ctx.lineTo(1385 + 150, H + 60); ctx.lineTo(1385 + 10, H + 60); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(640 - 26, fy + 84); ctx.lineTo(640 + 26, fy + 84); ctx.lineTo(640 - 160, H + 60); ctx.lineTo(640 - 260, H + 60); ctx.closePath(); ctx.fillStyle = rgba(P.night0, .5); ctx.fill(); ctx.restore();
    // the robot in the light, copying
    const rl = smooth(s.rob ?? 0);
    hands.rob = robot(ctx, 1385, fy + 44, 372, { dir: -1, light: -1, rim: P.halo0, body: P.night1, cup: 'R', armR: [lerp(.2, 1.35, rl), lerp(.1, 2.55, rl)], armL: [-.08, -.03] }).R;
    // you, the trainer, with headset
    const lf = smooth(s.lift ?? 0);
    hands.du = du(ctx, 640, fy + 84, 250, { dir: 1, light: 1, back: .2, headset: true, cup: 'R', look: .1, armR: [lerp(.18, 1.35, lf), lerp(.1, 2.55, lf)], armL: [-.1, -.04] }).R;
    // the move, copied as a trace of light; earlier repetitions stay as faint echoes
    const a = [hands.du[0] + 6, hands.du[1] - 14], b = [hands.rob[0] - 6, hands.rob[1] - 14];
    const arc = (lift, w) => catmull([[a[0], a[1], w], [lerp(a[0], b[0], .3), Math.min(a[1], b[1]) - lift * .8, w], [lerp(a[0], b[0], .7), Math.min(a[1], b[1]) - lift * .8, w], [b[0], b[1], w]], 16);
    const ne = Math.floor(s.echo ?? 0);
    for (let i = 0; i < ne; i++) trail(ctx, arc(150 + (i + 1) * 22 * (i % 2 ? 1 : -.6), 1.1), 1, { a: .16 + .08 * ((i * 7) % 3) / 2, spark: false });
    if ((s.copy ?? 0) > 0) trail(ctx, arc(150, 3.2), s.copy, { w: 3.2 });
  });
  return hands;
}

// ======================= timeline (the 20-s style reference) =======================
export const CUT1 = 6.2, CUT2 = 13.6, DUR = 22.4;
const K2_HAND0 = [K2FIG.x + 60, K2FIG.y - 120];   // where your raised hand ends (measured in stills mode, see below)
function frameState(t) {
  if (t < CUT1) {
    const hold = sineIO(span(t, 0, 4.4)), push = span(t, 4.4, CUT1);
    const z = (1 + .06 * hold) * Math.pow(70 / 1.06, expoIn(push) * .98 + push * .02);
    const sp = K1.spark, k = quartIO(push);
    return { scene: 1, C: cam(z, sp[0] + drift(t, 4), sp[1] + drift(t, 3, 2), lerp(sp[0], W / 2, k), lerp(sp[1], H / 2, k)),
      s: { look: smooth(span(t, .9, 2.1)), arm: span(t, 1.2, 2.75) ** .8, spark: expoOut(span(t, 2.6, 3.1)) * (1 + .08 * Math.sin(t * 3)) }, flood: smooth(span(z, 4, 40)) };
  }
  if (t < CUT2) {
    const out = span(t, CUT1, 9.6), push = span(t, 12.0, CUT2);
    const hp = K2.handXY || K2_HAND0, hl = K2.hallXY;
    let C, z;
    if (push <= 0) {
      z = Math.pow(66, Math.pow(1 - out, 2.4)) * (1 + .03 * sineIO(span(t, 9.6, 12)));
      const k = quartIO(out);
      C = cam(z, hp[0], hp[1], lerp(W / 2, hp[0], k) + drift(t, 3), lerp(H / 2, hp[1], k) + drift(t, 2, 1));
    } else {
      z = 1.03 * Math.pow(66 / 1.03, expoIn(push) * .98 + push * .02);
      const k = quartIO(push);
      C = cam(z, hl[0], hl[1], lerp(hl[0], W / 2, k), lerp(hl[1], H / 2, k));
      C.d = .7;
    }
    return { scene: 2, C, s: { u: sineIO(span(t, 7.0, 11.7)), raise: 1, glow: push <= 0 ? clamp((z - 1) / 6) : 0 }, flood: smooth(span(z, 4, 40)) };
  }
  const out = span(t, CUT2, 15.4), z = Math.pow(66, Math.pow(1 - out, 2.4)) * (1 + .035 * sineIO(span(t, 15.6, DUR)));
  const wc = [WIN.x + WIN.w / 2, WIN.y + WIN.h * .45], k = quartIO(out);
  const again = (t0) => span(t, t0, t0 + .9);
  let copy = span(t, 16.4, 17.5), echo = 0;
  for (const t0 of [18.45, 19.75]) if (t >= t0) { echo++; copy = again(t0); }
  if (t >= 20.7) { echo = 2 + Math.floor(expoOut(span(t, 20.7, 22)) * 10); copy = 1; }
  return { scene: 3, C: cam(z, wc[0], wc[1], lerp(W / 2, wc[0], k) + drift(t, 3), lerp(H / 2, wc[1], k) + drift(t, 2, 1)),
    s: { lift: span(t, 15.0, 15.9), rob: span(t, 16.9, 17.9), copy: quartIO(copy), echo }, flood: smooth(span(z, 4, 40)) };
}
function drawFrame(ctx, t, st) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (st.scene === 1) drawK1(ctx, t, st.C, st.s);
  else if (st.scene === 2) {
    // the hall push happens on the valley plane (d .7): convert the camera so that plane is the one we fly into
    const C = st.C.d ? { ...st.C } : st.C;
    if (st.C.d) { const zz = st.C.z; C.z = Math.pow(zz, 1 / st.C.d); }
    drawK2(ctx, t, C, st.s);
  } else drawK3(ctx, t, st.C, st.s);
  if (st.flood > 0) {   // inside the light form: the frame becomes the light (identical on both sides of the cut)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = rad(ctx, W / 2, H / 2, W * .9, [[0, rgba(P.core0, st.flood)], [.6, rgba(P.core1, st.flood)], [1, rgba(P.halo2, st.flood)]]); ctx.fillRect(0, 0, W, H);
  }
  finish(ctx, t, { grain: 30, floor: 7, vig: .5 * (1 - st.flood) });
}

// measure the screen positions the camera needs (your raised hand in K2, the hall window)
function measure() {
  const c = createCanvas(W, H), x = c.getContext('2d');
  K2.handXY = drawK2(x, 0, cam(), { u: 0, raise: 1 });
  K2.hallXY = proj(K2.hall.X, K2.hall.Z);
  drawK1(x, 0, cam(), { look: 1, arm: 1, spark: 0 }); K1.place(K1.rh);
}

export async function build() {
  prepareEditorial(); measure();
  const c = createCanvas(W, H), ctx = c.getContext('2d');
  return { duration: DUR, frame(t) { drawFrame(ctx, t, frameState(t)); return c; } };
}

// ---------- stills ----------
if (process.argv[2] === 'stills') {
  prepareEditorial(); measure();
  const out = process.argv[3] || '.'; fs.mkdirSync(out, { recursive: true });
  const c = createCanvas(W, H), ctx = c.getContext('2d');
  const shots = {
    K1: () => { drawK1(ctx, 3.4, cam(), { look: 1, arm: 1, spark: 1 }); },
    K2: () => { drawK2(ctx, 11.8, cam(), { u: 1, raise: 1 }); },
    K3: () => { drawK3(ctx, 17.8, cam(), { lift: 1, rob: 1, copy: 1, echo: 5 }); },
  };
  for (const [k, fn] of Object.entries(shots)) {
    if (process.argv[4] && !process.argv[4].split(',').includes(k)) continue;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; fn(); finish(ctx, 5, { grain: 30, floor: 7, vig: .5 });
    fs.writeFileSync(path.join(out, k + '.jpg'), await c.encode('jpeg', 92)); console.log(k);
  }
  if (process.argv[5]) for (const t of process.argv[5].split(',').map(Number)) { drawFrame(ctx, t, frameState(t)); fs.writeFileSync(path.join(out, `t${t.toFixed(2)}.jpg`), await c.encode('jpeg', 80)); }
}
