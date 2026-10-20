// c17 · the ancient fire (17.01): the light plate becomes the fire's own light, flames, logs in a stone ring, sparks, smoke, and four
// people wrapped in blankets around it (two near, seen from behind against the fire; two across the fire, lit from the front).
//   fireBack(ctx, t, C, o)   ground light pool, shadows, the far people, ring, logs, flames, sparks, smoke   (before the halo)
//   fireHalo(ctx, t, C, o)   the fire's light: at t = H.b exactly the c16>c17 light plate (same gradient, same stipple), then it
//                            condenses with the distance of the camera into the fire's bloom (no dissolve: one light, shrinking)
//   fireFront(ctx, t, C, o)  the near people (in front of the fire light)
//   FIRE (world position), fireScreen(C) (the heart on screen)
import { W, H, rgba, clamp, mix, prng, drift } from '../engine.mjs';
import { hatch as engHatch } from '../engine.mjs';
import { smooth01, sio, u01, hash, mixHex, shadeHex, groundAffine } from './v2_c17_kit.mjs';

const TAU = Math.PI * 2;
export const FIRE = { x: 0, z: 0, heart: .35 };
export const fireScreen = (C) => C.P(FIRE.x, FIRE.heart, FIRE.z);

// ---------------------------------------------------------------- the light (copy of handoff4 lightPlate, tone 'fire', scalable)
const LC = ['#fff1d6', '#ffb35c', '#c4512e'], LRGB = LC.map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
const DOTS = (() => { const r = prng(901), d = []; for (let i = 0; i < 2600; i++) d.push([r(), r(), r()]); return d; })();
const lcol = (q) => { q = clamp(q); const [a, b, f] = q < .42 ? [LRGB[0], LRGB[1], q / .42] : [LRGB[1], LRGB[2], (q - .42) / .58]; return a.map((v, i) => Math.round(v + (b[i] - v) * f)); };
// sc = colour scale (1 = the plate), (cx, cy) = centre on screen, prof = { ro, re, a } opacity profile in px (opaque inside ro, gone at re)
export function lightHalo(ctx, t, cx, cy, sc, prof) {
  const br = 1 + .03 * Math.sin(t * 1.7) + .015 * Math.sin(t * 4.3), Rc = 1150 * br * sc, { ro, re, a } = prof;
  if (re < 2 || a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, re), N = 28, stops = [];
  for (let i = 0; i <= N; i++) stops.push(i / N);
  for (const q of [.42 * Rc / re, Rc / re]) if (q > 0 && q < 1) stops.push(q);   // the plate's own colour breaks, exactly
  stops.sort((p, q) => p - q);
  for (const q of stops) { const r = re * q, al = a * (1 - smooth01(ro, re, r)), [R, G, B] = lcol(r / Rc); g.addColorStop(q, `rgba(${R},${G},${B},${clamp(al)})`); }
  ctx.fillStyle = g;
  if (re > 1300) ctx.fillRect(0, 0, W, H); else { ctx.beginPath(); ctx.arc(cx, cy, re, 0, TAU); ctx.fill(); }
  // the plate's stipple in the falloff, scaled about the centre and thinned with the area (constant density)
  const pcx = W / 2 + 18 * drift(t, 1, 3), pcy = H / 2 + 12 * drift(t, 1, 7), r = prng(31 + Math.floor(t * 12)), keep = sc * sc;
  const B = [[], [], [], [], [], []];
  for (let i = 0; i < DOTS.length; i++) {
    const [u, v, k] = DOTS[i], x = u * W, y = v * H, d = Math.hypot(x - pcx, y - pcy) / 1100; if (d < .35) continue;
    if (k > (d - .35) * 1.4) continue;
    const s = .8 + r() * 1.1, ox = (r() - .5) * 2, oy = (r() - .5) * 2;
    if (keep < 1 && hash(i * .37 + 1.3) > keep) continue;
    const X = cx + (x - pcx) * sc + ox, Y = cy + (y - pcy) * sc + oy, rr = Math.hypot(X - cx, Y - cy), al = a * (1 - smooth01(ro, re, rr));
    if (al <= .02) continue;
    B[Math.min(5, Math.floor(al * 6))].push(X, Y, s);
  }
  for (let b = 0; b < 6; b++) { const L = B[b]; if (!L.length) continue; ctx.fillStyle = rgba(LC[2], .32 * (b + .5) / 6 * (b === 5 ? 6 / 5.5 : 1)); for (let i = 0; i < L.length; i += 3) ctx.fillRect(L[i], L[i + 1], L[i + 2], L[i + 2]); }
  ctx.restore();
}

// ---------------------------------------------------------------- people (wrapped in blankets / hides), drawn in metres around a seat point
// view 'back': seen from behind against the fire (dark, a warm rim where the fire is); 'front': facing us across the fire (lit, a face)
export const PEOPLE = [
  { x: -1.18, z: -1.02, view: 'back', face: 1, cloth: '#3a2a26', seed: 1, hood: true, tilt: .05 },
  { x: 1.3, z: -.86, view: 'back', face: -1, cloth: '#2a2a36', seed: 2, hood: false, hair: '#1a1210', tilt: -.04 },
  { x: -1.0, z: 1.18, view: 'front', face: 1, cloth: '#6a4632', seed: 3, hood: true, stick: true, skin: '#c98b5e' },
  { x: .92, z: 1.32, view: 'front', face: -1, cloth: '#4a5060', seed: 4, hood: false, hair: '#2a1a14', skin: '#a8714a' },
];
const life = (t, sd) => ({ b: Math.sin(t * TAU / (4.1 + sd * .37) + sd * 2.1), turn: Math.sin(t * .31 + sd * 1.7) * .6 + Math.sin(t * .17 + sd) * .4 });

function wrappedPath(ctx, P, X, Y, k, f, b, sh) {   // the silhouette: blanket from the ground over the knees and shoulders to the hood
  const m = (x, y) => [X + x * k * f, Y - y * k];
  const lift = b * .008, top = 1.0 + lift * 1.3 + (P.hood ? 0 : -.04);
  ctx.beginPath();
  const pts = [
    [-.38, 0], [-.43, .1, -.42, .26, -.36, .42], [-.31, .55, -.29, .6 + lift, -.24, .64 + lift],
    [-.19, .69 + lift, -.16, .72 + lift, -.13 + sh * .02, .76 + lift],
    P.hood ? [-.15 + sh * .03, .86 + lift, -.08 + sh * .03, top, .01 + sh * .04, top] : [-.13 + sh * .03, .86 + lift, -.06 + sh * .03, top + .02, .02 + sh * .04, top + .01],
    P.hood ? [.1 + sh * .04, top, .15 + sh * .03, .88 + lift, .13 + sh * .02, .76 + lift] : [.1 + sh * .04, top, .13 + sh * .03, .87 + lift, .11 + sh * .02, .77 + lift],
    [.17, .72 + lift, .21, .69 + lift, .26, .64 + lift], [.32, .6 + lift, .36, .52, .4, .38], [.44, .24, .45, .1, .4, 0],
    [.2, -.03, -.2, -.03, -.38, 0],
  ];
  let [x0, y0] = m(...pts[0]); ctx.moveTo(x0, y0);
  for (let i = 1; i < pts.length; i++) { const p = pts[i]; const [a, bb] = m(p[0], p[1]), [c, d] = m(p[2], p[3]), [e, g] = m(p[4], p[5]); ctx.bezierCurveTo(a, bb, c, d, e, g); }
  ctx.closePath();
}
// one wrapped person; (X, Y) = screen point of the seat on the ground, k = px per metre, L = fire heart on screen
export function wrapped(ctx, t, P, X, Y, k, L) {
  const f = P.face, lf = life(t, P.seed), b = lf.b, sh = lf.turn * .5;
  const lx = L[0] - X, ly = L[1] - (Y - .5 * k), ln = Math.hypot(lx, ly) || 1, ux = lx / ln, uy = ly / ln;
  ctx.save();
  if (P.view === 'back') {
    // rim: the silhouette shifted toward the fire, warm, under the dark body
    const rw = Math.max(1.5, k * .022);
    ctx.save(); ctx.translate(ux * rw, uy * rw); wrappedPath(ctx, P, X, Y, k, f, b, sh); ctx.fillStyle = '#ffb066'; ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(ux * rw * .45, uy * rw * .45); wrappedPath(ctx, P, X, Y, k, f, b, sh); ctx.fillStyle = '#ffdcae'; ctx.globalAlpha = .55; ctx.fill(); ctx.restore();
    wrappedPath(ctx, P, X, Y, k, f, b, sh); ctx.fillStyle = shadeHex(P.cloth, -.62); ctx.fill();
    ctx.save(); ctx.clip();
    // warm bounce on the fire side, engraved hatch on the far side, blanket folds
    const g = ctx.createLinearGradient(X + ux * .45 * k, Y - .5 * k + uy * .45 * k, X - ux * .3 * k, Y - .5 * k - uy * .3 * k);
    g.addColorStop(0, rgba('#c86a32', .55)); g.addColorStop(.35, rgba('#7a3a20', .18)); g.addColorStop(1, rgba('#000000', 0)); ctx.fillStyle = g; ctx.fillRect(X - .6 * k, Y - 1.2 * k, 1.2 * k, 1.3 * k);
    ctx.strokeStyle = rgba('#000000', .45); ctx.lineWidth = Math.max(.8, k * .006); ctx.lineCap = 'round'; ctx.beginPath();
    for (const [x0, y0, x1, y1, x2, y2] of [[-.2, .66, -.28, .4, -.3, .08], [-.05, .72, -.1, .4, -.12, .05], [.1, .72, .14, .45, .1, .06], [.22, .62, .3, .35, .32, .08]]) { ctx.moveTo(X + x0 * k * f, Y - y0 * k); ctx.quadraticCurveTo(X + x1 * k * f, Y - y1 * k, X + x2 * k * f, Y - y2 * k); }
    ctx.stroke();
    if (k > 60) engHatch(ctx, null, f > 0 ? -1.0 : 1.0, Math.max(3, k * .018), .22, { box: [X - .5 * k, Y - 1.05 * k, k, 1.1 * k], col: '#000000', w: Math.max(.6, k * .003), fade: [X - ux * .4 * k, 0, X + ux * .3 * k, 0] });
    if (!P.hood && P.hair) {   // the back of the head: hair, lit at the edge
      ctx.fillStyle = P.hair; ctx.beginPath(); ctx.ellipse(X + (.02 + sh * .04) * k * f, Y - (.89 + b * .01) * k, .095 * k, .11 * k, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  } else {
    // across the fire: lit from the front (the fire is between us), shadow toward the edges, a face under the hood
    wrappedPath(ctx, P, X, Y, k, f, b, sh); ctx.fillStyle = P.cloth; ctx.fill();
    ctx.save(); ctx.clip();
    const g = ctx.createLinearGradient(X, Y - 1.0 * k, X, Y); g.addColorStop(0, rgba('#1a0f12', .5)); g.addColorStop(.45, rgba('#ff9a4a', .12)); g.addColorStop(1, rgba('#ffb35c', .28)); ctx.fillStyle = g; ctx.fillRect(X - .6 * k, Y - 1.2 * k, 1.2 * k, 1.3 * k);
    const gs = ctx.createLinearGradient(X - .45 * k, 0, X + .45 * k, 0); gs.addColorStop(0, rgba('#05040a', .55)); gs.addColorStop(.3, rgba('#05040a', 0)); gs.addColorStop(.7, rgba('#05040a', 0)); gs.addColorStop(1, rgba('#05040a', .55)); ctx.fillStyle = gs; ctx.fillRect(X - .6 * k, Y - 1.2 * k, 1.2 * k, 1.3 * k);
    // blanket edges meeting at the chest, knees under the blanket, folds
    ctx.strokeStyle = rgba('#1a0c08', .55); ctx.lineWidth = Math.max(.8, k * .007); ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(X - .1 * k * f, Y - .7 * k); ctx.quadraticCurveTo(X + .02 * k * f, Y - .45 * k, X + .05 * k * f, Y - .05 * k);
    ctx.moveTo(X - .3 * k * f, Y - .42 * k); ctx.quadraticCurveTo(X - .12 * k * f, Y - .5 * k, X + .02 * k * f, Y - .44 * k);
    ctx.moveTo(X + .32 * k * f, Y - .4 * k); ctx.quadraticCurveTo(X + .18 * k * f, Y - .48 * k, X + .06 * k * f, Y - .42 * k);
    ctx.moveTo(X - .26 * k * f, Y - .62 * k); ctx.quadraticCurveTo(X - .3 * k * f, Y - .3 * k, X - .28 * k * f, Y - .05 * k);
    ctx.stroke();
    if (k > 60) engHatch(ctx, null, -.9, Math.max(3, k * .02), .2, { box: [X - .5 * k, Y - 1.05 * k, k, 1.1 * k], col: '#000000', w: Math.max(.6, k * .003) });
    ctx.restore();
    // the face (inside the hood opening or under the hair): warm light from below, the shadow of the brow, eyes catching the fire
    const fx = X + (.0 + sh * .035) * k * f, fy = Y - (.86 + b * .01) * k, fr = .085 * k;
    if (P.hair) { ctx.fillStyle = P.hair; ctx.beginPath(); ctx.ellipse(fx - .005 * k * f, fy - .03 * k, fr * 1.12, fr * 1.25, 0, 0, TAU); ctx.fill(); }
    const gf = ctx.createLinearGradient(fx, fy - fr, fx, fy + fr); gf.addColorStop(0, shadeHex(P.skin, -.45)); gf.addColorStop(.55, P.skin); gf.addColorStop(1, mixHex(P.skin, '#ffc68a', .35));
    ctx.fillStyle = gf; ctx.beginPath(); ctx.ellipse(fx, fy + .01 * k, fr * .82, fr * 1.02, 0, 0, TAU); ctx.fill();
    if (P.hood) { ctx.strokeStyle = shadeHex(P.cloth, -.35); ctx.lineWidth = Math.max(1, k * .02); ctx.beginPath(); ctx.ellipse(fx, fy + .005 * k, fr * .92, fr * 1.12, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); }
    if (fr > 6) {
      const ex = fr * .34, ey = fy - fr * .05, turn = sh * .3, blink = ((t + P.seed * 1.3) % 4.3) < .12 ? .2 : 1;
      ctx.fillStyle = rgba('#1a0c08', .55); ctx.beginPath(); ctx.ellipse(fx + turn * fr, fy - fr * .28, fr * .62, fr * .14, 0, 0, TAU); ctx.fill();   // brow shadow
      for (const s of [-1, 1]) { ctx.fillStyle = '#1a0d0a'; ctx.beginPath(); ctx.ellipse(fx + s * ex + turn * fr, ey, fr * .11, fr * .07 * blink, 0, 0, TAU); ctx.fill(); if (blink > .5) { ctx.fillStyle = rgba('#ffd9a0', .9); ctx.fillRect(fx + s * ex + turn * fr - .6, ey - .4, 1.2, 1.2); } }
      ctx.strokeStyle = rgba('#3a1a10', .6); ctx.lineWidth = Math.max(.7, fr * .06); ctx.beginPath(); ctx.moveTo(fx + turn * fr, fy - fr * .05); ctx.lineTo(fx + turn * fr + fr * .05, fy + fr * .28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(fx + turn * fr - fr * .18, fy + fr * .5); ctx.lineTo(fx + turn * fr + fr * .18, fy + fr * .5); ctx.stroke();
    }
  }
  ctx.restore();
}
// the stick held by the far-left person: from the hands at the chest into the embers; it pokes now and then (sparks answer)
export const POKES = [2.9, 6.4, 9.1, 12.8];   // seconds after H.b … (repeats every 14 s)
export const pokeAt = (t, t0) => { const u = ((t - t0) % 14 + 14) % 14; let v = 0; for (const p of POKES) { const q = (u - p) / .55; if (q > 0 && q < 1) v = Math.sin(Math.PI * q) ** 2; } return v; };

// ---------------------------------------------------------------- flames
const TONGUES = (() => { const r = prng(511), a = []; for (let i = 0; i < 9; i++) a.push({ x: (i / 8 - .5) * .46 + (r() - .5) * .05, h: .42 + r() * .36 - Math.abs(i / 8 - .5) * .35, w: .13 + r() * .08, p: r() * 10, q: r() * 10 }); return a; })();
const noise1 = (x) => Math.sin(x) * .5 + Math.sin(x * 2.31 + 1.3) * .3 + Math.sin(x * 5.17 + 2.1) * .2;
function tongue(ctx, bx, by, k, T, t, sc, wsc) {
  const fl = 1 + .16 * noise1(t * 3.1 + T.p) + .08 * Math.sin(t * 7.3 + T.q), h = T.h * fl * sc, w = T.w * wsc;
  const sway = (.06 * noise1(t * 1.7 + T.q) + .035) * h / .5, x0 = bx + T.x * k, tx = x0 + sway * k, ty = by - h * k;
  ctx.beginPath(); ctx.moveTo(x0 - w / 2 * k, by);
  ctx.bezierCurveTo(x0 - w * .62 * k, by - h * .32 * k, tx - w * .26 * k + sway * .3 * k, by - h * .7 * k, tx, ty);
  ctx.bezierCurveTo(tx + w * .2 * k + sway * .2 * k, by - h * .68 * k, x0 + w * .6 * k, by - h * .3 * k, x0 + w / 2 * k, by);
  ctx.quadraticCurveTo(x0, by + w * .25 * k, x0 - w / 2 * k, by); ctx.closePath();
  return [tx, ty, h];
}
export function flames(ctx, t, bx, by, k, o = {}) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  // embers bed
  const eg = ctx.createRadialGradient(bx, by, 0, bx, by, .36 * k); eg.addColorStop(0, rgba('#ffcf8a', .85)); eg.addColorStop(.4, rgba('#ff7a2e', .55)); eg.addColorStop(1, rgba('#7a2010', 0));
  ctx.fillStyle = eg; ctx.save(); ctx.translate(bx, by); ctx.scale(1, .32); ctx.beginPath(); ctx.arc(0, 0, .36 * k, 0, TAU); ctx.fill(); ctx.restore();
  for (const [layer, sc, wsc, c0, c1, a] of [[0, 1.0, 1.0, '#ff8a3a', '#c4412a', .5], [1, .74, .78, '#ffc070', '#ff7a30', .62], [2, .44, .55, '#fff6e2', '#ffd9a0', .8]]) {
    for (const T of TONGUES) {
      const [tx, ty, h] = tongue(ctx, bx, by, k, T, t + layer * .13, sc, wsc);
      const g = ctx.createLinearGradient(0, by, 0, ty); g.addColorStop(0, rgba(c0, a)); g.addColorStop(.6, rgba(c1, a * .8)); g.addColorStop(1, rgba(c1, 0));
      ctx.fillStyle = g; ctx.fill();
      if (layer === 0) {   // a lick that tears off the tip now and then and rises
        const per = 1.3 + (T.p % 1) * .9, u = ((t + T.q) % per) / per;
        if (u < .3) { const q = u / .3, rx = tx + (q * .05) * k, ry = ty - q * h * .5 * k, rr = (1 - q) * T.w * .22 * k; if (rr > .5) { const lg = ctx.createRadialGradient(rx, ry, 0, rx, ry, rr * 2); lg.addColorStop(0, rgba('#ffb35c', .5 * (1 - q))); lg.addColorStop(1, rgba('#c4412a', 0)); ctx.fillStyle = lg; ctx.beginPath(); ctx.ellipse(rx, ry, rr, rr * 1.8, 0, 0, TAU); ctx.fill(); } }
      }
    }
  }
  // white-hot heart
  const hg = ctx.createRadialGradient(bx, by - .12 * k, 0, bx, by - .12 * k, .2 * k); hg.addColorStop(0, rgba('#fffaf0', .85)); hg.addColorStop(1, rgba('#ffd9a0', 0));
  ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(bx, by - .12 * k, .2 * k, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- logs, stones
const STONES = (() => { const r = prng(77), s = []; for (let i = 0; i < 13; i++) { const a = i / 13 * TAU + (r() - .5) * .25; s.push({ a, r: .52 + (r() - .5) * .06, w: .11 + r() * .06, h: .07 + r() * .05, sh: r() }); } return s; })();
const LOGS = [[-.36, -.1, .2, .3, .055], [.34, -.14, -.12, .32, .05], [-.3, .25, .25, -.05, .05], [.05, -.32, .02, .3, .045]];
function stone(ctx, C, S, lit) {
  const X = FIRE.x + Math.cos(S.a) * S.r, Z = FIRE.z + Math.sin(S.a) * S.r, p = C.P(X, S.h * .5, Z); if (!p) return;
  const [x, y, k] = p, w = S.w * k, h = S.h * k;
  ctx.fillStyle = mixHex('#2a2228', '#3a3040', S.sh); ctx.beginPath(); ctx.ellipse(x, y, w * .6, h * .62, (S.sh - .5) * .3, 0, TAU); ctx.fill();
  // lit on the side facing the fire (inner face), hatched outside
  const toF = Math.sign(FIRE.z - Z) || 1, g = ctx.createLinearGradient(x, y + h * .6 * toF, x, y - h * .6 * toF);
  g.addColorStop(0, rgba('#ffb35c', .65 * lit)); g.addColorStop(.6, rgba('#c4512e', .15 * lit)); g.addColorStop(1, rgba('#000000', .3));
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, w * .6, h * .62, (S.sh - .5) * .3, 0, TAU); ctx.fill();
}
function logs(ctx, t, C) {
  for (const [x0, z0, x1, z1, rad] of LOGS) {
    const a = C.P(FIRE.x + x0, .05, FIRE.z + z0), b = C.P(FIRE.x + x1, .16, FIRE.z + z1); if (!a || !b) continue;
    const kk = (a[2] + b[2]) / 2, wv = rad * kk, ang = Math.atan2(b[1] - a[1], b[0] - a[0]), L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    ctx.save(); ctx.translate(a[0], a[1]); ctx.rotate(ang);
    ctx.fillStyle = '#1a120e'; ctx.beginPath(); ctx.roundRect(0, -wv, L, wv * 2, wv); ctx.fill();
    const g = ctx.createLinearGradient(0, -wv, 0, wv); g.addColorStop(0, rgba('#ff8a3a', .55)); g.addColorStop(.45, rgba('#7a2a12', .3)); g.addColorStop(1, rgba('#000000', 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(0, -wv, L, wv * 2, wv); ctx.fill();
    ctx.strokeStyle = rgba('#ffb35c', .55 + .25 * Math.sin(t * 2.3 + x0 * 9)); ctx.lineWidth = Math.max(.6, wv * .16); ctx.beginPath();
    for (let i = 1; i < 6; i++) { const xx = L * i / 6; ctx.moveTo(xx, -wv * .7); ctx.lineTo(xx + wv * .4, -wv * .1); }
    ctx.stroke(); ctx.restore();
  }
}

// ---------------------------------------------------------------- sparks and smoke (world space, deterministic per index)
const SPARK = (n) => { const r = prng(9001 + n * 7); return { life: 1.1 + r() * 1.6, vy: 1.3 + r() * 1.3, vx: (r() - .5) * .7, vz: (r() - .5) * .5, x: (r() - .5) * .35, z: (r() - .5) * .3, w: r() * 10, hot: r() }; };
function sparkPos(S, a, t0) { const y = .35 + S.vy * a - .22 * a * a, x = S.x + S.vx * a + .18 * a * a + .12 * Math.sin(a * 3.1 + S.w) * a, z = S.z + S.vz * a + .08 * Math.sin(a * 2.3 + S.w * 1.7) * a; return [x, y, z]; }
export function sparks(ctx, t, C, tb) {
  const dt = .045, n1 = Math.floor(t / dt), pk = [];
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let n = n1 - 70; n <= n1; n++) {
    const S = SPARK(n), born = n * dt, a = t - born; if (a < 0 || a > S.life) continue;
    if (hash(n * .113) > .55 + .45 * pokeBoost(born, tb)) continue;   // fewer sparks normally, a burst when the stick pokes
    const [x, y, z] = sparkPos(S, a), [x2, y2, z2] = sparkPos(S, Math.max(0, a - .05));
    const p = C.P(FIRE.x + x, y, FIRE.z + z), q = C.P(FIRE.x + x2, y2, FIRE.z + z2); if (!p || !q) continue;
    const u = a / S.life, heat = 1 - u, col = heat > .6 ? '#fff1d6' : heat > .3 ? '#ffb35c' : '#e0602a', al = Math.min(1, heat * 1.6) * (.6 + .4 * S.hot);
    const lw = clamp(p[2] * .012, .8, 4) * (.6 + .4 * heat);
    ctx.strokeStyle = rgba(col, al); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
  }
  ctx.restore();
}
const pokeBoost = (t, tb) => pokeAt(t, tb);
export function smoke(ctx, t, C) {
  ctx.save();
  for (let j = 0; j < 9; j++) {
    const u = ((t * .16 + j / 9) % 1), y = .9 + u * 4.2, x = FIRE.x + .5 * u * u + .25 * Math.sin(u * 4 + j), z = FIRE.z + .2 * Math.sin(u * 3 + j * 2), p = C.P(x, y, z); if (!p) continue;
    const rr = (.25 + u * 1.1) * p[2], al = Math.sin(Math.PI * u) * .085, g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], rr);
    const col = mixHex('#8a5a40', '#3a3a5a', clamp(u * 1.6));
    g.addColorStop(0, rgba(col, al)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], rr, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the fire scene parts
export function fireBack(ctx, t, C, o) {
  const base = C.P(FIRE.x, 0, FIRE.z), L = fireScreen(C); if (!base || !L) return;
  // the light pool on the ground and the people's shadows (ground affine at the fire)
  const A = groundAffine(C, FIRE.x, FIRE.z);
  if (A) {
    ctx.save(); ctx.setTransform(...A); ctx.globalCompositeOperation = 'lighter';
    const br = 1 + .05 * Math.sin(t * 1.7) + .03 * Math.sin(t * 4.3);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 5.5 * br); g.addColorStop(0, rgba('#ffb35c', .5)); g.addColorStop(.12, rgba('#ff9a4a', .32)); g.addColorStop(.4, rgba('#c4512e', .12)); g.addColorStop(1, rgba('#c4512e', 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 5.5 * br, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    for (const P of PEOPLE) {   // shadows thrown away from the fire
      const ang = Math.atan2(P.z, P.x), d = Math.hypot(P.x, P.z);
      ctx.save(); ctx.rotate(ang); ctx.translate(d + .1, 0);
      const sg = ctx.createLinearGradient(0, 0, 3.2, 0); sg.addColorStop(0, rgba('#06040a', .6)); sg.addColorStop(1, rgba('#06040a', 0));
      ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(0, -.34); ctx.lineTo(3.2, -.75); ctx.lineTo(3.2, .75); ctx.lineTo(0, .34); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    ctx.restore();
  }
  // across the fire: the far people (sorted far → near)
  for (const P of PEOPLE.filter((p) => p.z > 0).sort((a, b) => b.z - a.z)) drawPerson(ctx, t, C, P, L, o);
  // the ring (back half), logs, flames, front half of the ring
  const back = STONES.filter((s) => Math.sin(s.a) > 0), front = STONES.filter((s) => Math.sin(s.a) <= 0);
  for (const s of back) stone(ctx, C, s, 1);
  logs(ctx, t, C);
  flames(ctx, t, base[0], base[1] - .04 * base[2], base[2]);
  for (const s of front) stone(ctx, C, s, .55);
  smoke(ctx, t, C);
  sparks(ctx, t, C, o.tb);
}
function drawPerson(ctx, t, C, P, L, o) {
  const p = C.P(P.x, 0, P.z); if (!p) return;
  const [x, y, k] = p; if (x < -k * .6 || x > W + k * .6 || y - k * 1.1 > H) return;
  if (P.stick) {   // the stick: from the chest toward the embers, poking
    const v = pokeAt(t, o.tb), hs = C.P(P.x + .18, .52, P.z - .12), tip = C.P(FIRE.x - .16 + .12 * v, .08 + .03 * v, FIRE.z + .08 - .05 * v);
    if (hs && tip) { ctx.strokeStyle = '#2a1a12'; ctx.lineWidth = Math.max(1, k * .028); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hs[0], hs[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
      ctx.strokeStyle = rgba('#ffb35c', .5); ctx.lineWidth = Math.max(.6, k * .01); ctx.beginPath(); ctx.moveTo(mix(hs[0], tip[0], .55), mix(hs[1], tip[1], .55) - 1); ctx.lineTo(tip[0], tip[1] - 1); ctx.stroke(); }
  }
  wrapped(ctx, t, P, x, y, k, L);
  if (P.stick) {   // the forearm out of the blanket, holding the stick
    const sh = C.P(P.x + .08, .6, P.z - .05), hs = C.P(P.x + .2, .5, P.z - .14);
    if (sh && hs) { ctx.strokeStyle = shadeHex(P.cloth, .05); ctx.lineWidth = Math.max(1.5, k * .075); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sh[0], sh[1]); ctx.lineTo(hs[0], hs[1]); ctx.stroke();
      ctx.fillStyle = P.skin; ctx.beginPath(); ctx.ellipse(hs[0], hs[1], k * .035, k * .03, 0, 0, TAU); ctx.fill(); }
  }
}
export function fireFront(ctx, t, C, o) {
  const L = fireScreen(C); if (!L) return;
  for (const P of PEOPLE.filter((p) => p.z <= 0).sort((a, b) => b.z - a.z)) drawPerson(ctx, t, C, P, L, o);
}
// the halo: plate at H.b → the fire's bloom (driven by the camera's distance to the fire heart)
export function fireHalo(ctx, t, C, o) {
  const L = fireScreen(C); if (!L) return;
  const d = Math.hypot(C.x - FIRE.x, C.y - FIRE.heart, C.z - FIRE.z), sc = Math.min(1, .45 / d), v = clamp(Math.log(1 / sc) / Math.log(1 / .087));
  const e = sio(u01(t, o.hb, o.hb + 1.5)), cx = L[0] + 18 * drift(t, 1, 3) * (1 - e), cy = L[1] + 12 * drift(t, 1, 7) * (1 - e);
  const br = 1 + .03 * Math.sin(t * 1.7) + .015 * Math.sin(t * 4.3), Rc = 1150 * br * sc;
  const m = 1.12 - 1.42 * (v * v * (3 - 2 * v)), ro = Rc * m, re = Rc * (1.3 + 1.15 * v), a = 1 - .55 * (v * v * (3 - 2 * v));
  const R = Math.max(re, ro + 1); if (cx + R < 0 || cx - R > W || cy + R < 0 || cy - R > H) return;
  lightHalo(ctx, t, cx, cy, sc, { ro, re: R, a });
}
