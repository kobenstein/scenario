// Film 4 v2 · c10 people: a leak-free port of figure() → art.person() v3 (same rig, same look: near-profile face that blinks,
// tapered limbs, hands, shoes, folds, form light, rim), drawn straight onto the frame with vector paths. The shared person() renders
// into scratch canvases and drawImage()s them, which @napi-rs/canvas copies and keeps on every call (~330 KB per figure per frame).
//   person(ctx, x, y, s, pose, o) → { hand(i), feetY, head }   x,y = hip joint on screen, s = 1 → ~185 px standing (as figure())
//     o: { t, seed, dress, light: {x, y, col, a}, rim, rimSide, rimW, flip, prop(ctx, frontArm, backArm, dress), part: 'all'|'body'|'front',
//          shadow (contact shadow, default true for standing), fog: {col, a} (mix every colour toward col: depth), turn, smile, gaze }
//   kid(ctx, x, y, s, pose, o)   a child (same conventions as figureKid: s = the adult scale; age 'child' | 'toddler')
//   sitFront(ctx, x, y, s, o)    a person seen from the front, back-lit, sitting on a wall edge with the legs dangling (the harbour wall)
//   U = metres per figure unit for a 1.75 m adult
import { rgba, clamp, mix } from '../engine.mjs';
import { mixHex, shade } from './artbase.mjs';
import { life, blink, walk, POSES, FIGDEF } from './figure.mjs';
export { life, blink, walk, POSES };

const TAU = Math.PI * 2;
export const U = 1.75 / 188;
export const SKINS = ['#e9c3a0', '#d9b08e', '#b98762', '#8d5f40', '#6a4430', '#f0d2b4'];

// ---------------------------------------------------------------- pose resolution (copied from lib/figure.mjs: resolve)
export function resolve(pose, o) {
  const P = Object.assign({}, FIGDEF, pose);
  P.sh = [...P.sh]; P.el = [...P.el]; P.hip = [...P.hip]; P.kn = [...P.kn];
  if (o.t != null) {
    const ph = (o.seed || 0) * 1.37, Lf = life(o.t, o.seed || 0), b = Lf.b, w = Lf.w, sitting = P.hip[0] > 1 || (P.thigh != null), walking = !!P._walk;
    P._b = b; P._life = Lf; P.lean += w * .014 + b * .004; P.head += b * .015;
    if (!sitting && !walking) { P.hip[0] += w * .05; P.hip[1] -= w * .05; P.kn[w > 0 ? 1 : 0] += Math.abs(w) * .1; }
    if (!(pose.lock && pose.lock[0])) P.sh[0] += .025 * Math.sin(o.t * .9 + ph);
    if (!(pose.lock && pose.lock[1])) P.sh[1] += .02 * Math.sin(o.t * .8 + ph + 1);
    P._wx = walking ? 0 : w * (sitting ? 1 : 2);
  }
  P.sh[0] = Math.max(-0.05, P.sh[0]); P.sh[1] = Math.max(-0.05, P.sh[1]);
  return P;
}
// arm i reaches a screen point → { sh, el } (copied from lib/figure.mjs: reachArm, same rig)
export function reachArm(x, y, s, pose, i, flip, o, target, elbow = 1) {
  const P = resolve(pose, o), f = flip ? -1 : 1, px = x + (P._wx || 0) * s * f, py = y + ((P.dy || 0) + (P._b || 0) * -.35) * s;
  let ux = (target[0] - px) / (s * f), uy = (target[1] - py) / s; const c = Math.cos(-P.lean), sn = Math.sin(-P.lean); [ux, uy] = [ux * c - uy * sn, ux * sn + uy * c];
  const sx = i ? -3 : 3, sy = -64 + (P._b || 0) * -.9 + 7, dx = ux - sx, dy = uy - sy, A = 29, Bf = 30, d = clamp(Math.hypot(dx, dy), Math.abs(A - Bf) + .5, A + Bf - .05);
  const inner = Math.acos(clamp((A * A + Bf * Bf - d * d) / (2 * A * Bf), -1, 1)), alpha = Math.acos(clamp((A * A + d * d - Bf * Bf) / (2 * A * d), -1, 1)), base = Math.atan2(dx, dy);
  const r = elbow > 0 ? { sh: base - alpha, el: Math.PI - inner } : { sh: base + alpha, el: inner - Math.PI };
  if (r.sh < -.35) { r.el += r.sh + .35; r.sh = -.35; }
  return r;
}

// ---------------------------------------------------------------- geometry (copied from lib/art.mjs person v3, drawn in place)
let OV = null;   // the form-light gradient laid over each body part right after its fill (null: none)
const fillOV = (g) => { g.fill(); if (OV) { const f = g.fillStyle; g.fillStyle = OV; g.fill(); g.fillStyle = f; } };
const PDEF = { lean: 0, head: 0, sh: [0.15, -0.1], el: [0.3, 0.25], hip: [0.05, -0.05], kn: [0, 0], hair: 'short', coat: 0, skirt: false, bulk: 1, hood: false, scarf: false };
function rig(P) {
  const shY = -64 - (P._b || 0) * .9, TF = P.thigh, HX = P.hipX;
  return {
    shY,
    arm: (i) => { const a = P.sh[i], e = P.el[i], sx = i ? -3 : 3, sy = shY + 7, ex = sx + Math.sin(a) * 29, ey = sy + Math.cos(a) * 29; return { sx, sy, ex, ey, hx: ex + Math.sin(a + e) * 26, hy: ey + Math.cos(a + e) * 26, ang: a + e }; },
    leg: (i) => { const a = P.hip[i], k = P.kn[i], sx = HX ? HX[i] : (i ? -4 : 4), tf = TF == null ? 1 : Array.isArray(TF) ? TF[i] : TF, kx = sx + Math.sin(a) * 45 * tf, ky = Math.cos(a) * 45 * tf; return { sx, kx, ky, fx: kx + Math.sin(a - k) * 43, fy: ky + Math.cos(a - k) * 43, tf }; },
  };
}
function seg(g, x1, y1, r1, x2, y2, r2, bA = 0, bB = 0, q = .4) {
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
  if (d < .05) { g.beginPath(); g.arc(x1, y1, Math.max(r1, r2), 0, 7); fillOV(g); return; }
  const a = Math.atan2(dy, dx), nx = -dy / d, ny = dx / d, mx = x1 + dx * q, my = y1 + dy * q, rm = r1 + (r2 - r1) * q;
  g.beginPath(); g.moveTo(x1 + nx * r1, y1 + ny * r1);
  g.quadraticCurveTo(mx + nx * (rm + 2 * bA), my + ny * (rm + 2 * bA), x2 + nx * r2, y2 + ny * r2);
  g.arc(x2, y2, r2, a + Math.PI / 2, a - Math.PI / 2, true);
  g.quadraticCurveTo(mx - nx * (rm + 2 * bB), my - ny * (rm + 2 * bB), x1 - nx * r1, y1 - ny * r1);
  g.arc(x1, y1, r1, a - Math.PI / 2, a + Math.PI / 2, true);
  g.closePath(); fillOV(g);
}
function folds(g, list, col, w) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); for (const [a, b, c, d, e, f] of list) { g.moveTo(a, b); g.quadraticCurveTo(c, d, e, f); } g.stroke(); }
function crease(g, px, py, jx, jy, qx, qy, r, col, w) {
  const ax = px - jx, ay = py - jy, bx = qx - jx, by = qy - jy, la = Math.hypot(ax, ay) || 1, lb = Math.hypot(bx, by) || 1;
  const cs = (ax * bx + ay * by) / (la * lb); if (cs < -.94) return;
  let mx = ax / la + bx / lb, my = ay / la + by / lb; const ml = Math.hypot(mx, my) || 1; mx /= ml; my /= ml;
  const k = Math.min(1, (cs + .94) * 1.6), ox = jx + mx * r * .55, oy = jy + my * r * .55, tx = -my, ty = mx;
  folds(g, [[ox - tx * r * .55, oy - ty * r * .55, ox + mx * r * .25, oy + my * r * .25, ox + tx * r * .5, oy + ty * r * .5],
    [ox + mx * r * .5 - tx * r * .35, oy + my * r * .5 - ty * r * .35, ox + mx * r * .75, oy + my * r * .75, ox + mx * r * .45 + tx * r * .4, oy + my * r * .45 + ty * r * .4]], rgba(col, .55 * k), w);
}
function hand(g, x, y, ang, kind, skin, lod, sil) {
  g.save(); g.translate(x, y); g.rotate(-ang); g.fillStyle = skin; g.beginPath();
  if (lod === 0) { g.ellipse(0, 5, 4.4, 6, 0, 0, 7); fillOV(g); g.restore(); return; }
  if (kind === 'fist') {
    g.moveTo(-3, -1); g.bezierCurveTo(-3.9, 2.5, -4.4, 6.4, -3.5, 8.7); g.bezierCurveTo(-2.6, 10.9, .9, 11.1, 2.3, 9.4);
    g.bezierCurveTo(3.4, 8.2, 4.6, 7.2, 4.6, 5.4); g.bezierCurveTo(4.6, 3.4, 3.7, 1.6, 3, -1);
  } else if (kind === 'open') {
    g.moveTo(-2.8, -1); g.bezierCurveTo(-3.3, 3, -3.3, 8.2, -2.7, 11.6); g.bezierCurveTo(-2.2, 13.6, .9, 13.8, 1.5, 11.9);
    g.bezierCurveTo(2.0, 9.8, 2.3, 8.4, 2.7, 7.3); g.bezierCurveTo(3.5, 7.9, 4.9, 7.5, 4.9, 5.9); g.bezierCurveTo(4.9, 4.1, 3.7, 2.2, 2.9, -1);
  } else {
    g.moveTo(-2.8, -1); g.bezierCurveTo(-3.4, 2.5, -3.7, 6, -3.3, 8.6); g.bezierCurveTo(-3.0, 11.0, -1.4, 12.6, .4, 12.3);
    g.bezierCurveTo(1.8, 12.0, 2.4, 10.6, 1.9, 9.2); g.bezierCurveTo(2.6, 9.4, 4.4, 8.8, 4.6, 7.4); g.bezierCurveTo(4.8, 5.6, 3.9, 3.2, 3.2, 1.2); g.lineTo(2.9, -1);
  }
  g.closePath(); fillOV(g);
  if (lod >= 2 && !sil) {
    const ln = shade(skin, -.3);
    if (kind === 'fist') folds(g, [[-3.4, 6.6, -.6, 7.4, 2.2, 6.9], [-3.1, 8.6, -.8, 9.4, 1.6, 8.9], [3.2, 2.6, 3.4, 4.6, 3.0, 6.4]], rgba(ln, .5), .45);
    else if (kind === 'open') folds(g, [[-1.6, 8.2, -1.5, 10.5, -1.1, 12.4], [-.2, 8.0, -.1, 10.3, .3, 12.2], [2.6, 3.0, 3.2, 5.0, 2.8, 6.8]], rgba(ln, .45), .4);
    else folds(g, [[-2.3, 7.4, -1.9, 9.6, -.9, 11.4], [-1.0, 7.3, -.5, 9.4, .5, 11.0], [2.4, 2.6, 3.1, 4.8, 2.9, 6.6]], rgba(ln, .45), .42);
  }
  g.restore();
}
function shoe(g, x, y, pitch, col, lod, front, sil) {
  g.save(); g.translate(x, y); g.fillStyle = col; g.beginPath();
  if (front) {
    g.moveTo(-4.6, -2.4); g.bezierCurveTo(-5.6, .8, -6.2, 4.6, -4.4, 6.4); g.bezierCurveTo(-2.2, 7.9, 3.4, 8.0, 5.4, 6.5); g.bezierCurveTo(6.8, 5.2, 6.0, 1.2, 4.6, -2.4); g.closePath(); fillOV(g);
    if (lod && !sil) { g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(-4.8, 6.0, 10.4, 1.4); }
    g.restore(); return;
  }
  g.rotate(-pitch);
  g.moveTo(-5.8, 1.6); g.bezierCurveTo(-6.3, -1.4, -4.7, -3.8, -2.2, -3.6); g.lineTo(3.0, -3.4);
  g.bezierCurveTo(7.2, -2.6, 11.4, -1.2, 14.2, .9); g.bezierCurveTo(16.0, 2.2, 15.7, 4.5, 13.5, 4.6); g.lineTo(-4.9, 4.6); g.quadraticCurveTo(-6.0, 4.3, -5.8, 1.6);
  g.closePath(); fillOV(g);
  if (lod && !sil) {
    g.fillStyle = 'rgba(0,0,0,.5)'; g.beginPath(); g.moveTo(-5.4, 3.4); g.lineTo(14.6, 3.4); g.quadraticCurveTo(15.4, 4.6, 13.5, 4.8); g.lineTo(-4.9, 4.8); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.ellipse(9.6, -.6, 3.6, 1.1, .18, 0, 7); g.fill();
  }
  g.restore();
}
function headPath(g, fem) {
  const n = fem ? .55 : 0;
  g.beginPath(); g.moveTo(-4.2, -7.5);
  g.bezierCurveTo(-8.6, -10, -9.3, -19, -7.3, -23.6);
  g.bezierCurveTo(-5.1, -28.3, 1.4, -30, 6.2, -28.4);
  g.bezierCurveTo(10, -26.9, 11.7, -23.2, 11.5, -19.9);
  g.quadraticCurveTo(12, -18.9, 11.2, -17.7);
  g.quadraticCurveTo(12.3 - n * .4, -15.3, 14.1 - n, -12.6 - n * .2);
  g.quadraticCurveTo(14.7 - n, -11.6, 13.3 - n * .6, -11.2);
  g.lineTo(12.2, -11.0);
  g.quadraticCurveTo(12.9 + n * .2, -10.2, 12.6 + n * .2, -9.3);
  g.quadraticCurveTo(12.0, -8.9, 12.3 + n * .2, -8.4);
  g.quadraticCurveTo(12.6 + n * .3, -7.6, 11.8, -6.9);
  g.quadraticCurveTo(10.9, -6.5, 11.4 - n * .3, -5.1);
  g.quadraticCurveTo(11.4 - n * .5, -3.7, 9.8 - n * .6, -3.3);
  g.quadraticCurveTo(6.8, -2.7 + n * .4, 4.4, -4.1);
  g.quadraticCurveTo(1.0, -5.6, -4.2, -7.5);
  g.closePath();
}
const HAIR = {
  short: (g) => { g.moveTo(10.2, -24.6); g.bezierCurveTo(10.8, -28.9, 4.4, -31.7, -1.6, -31.0); g.bezierCurveTo(-7.7, -30.2, -10.9, -24.6, -10.1, -17.6);
    g.bezierCurveTo(-9.7, -13.2, -7.9, -10.4, -5.4, -9.2); g.lineTo(-3.3, -10.6); g.bezierCurveTo(-2.4, -13, -1.9, -16.6, -1.2, -18.4); g.quadraticCurveTo(1.6, -18.8, 2.9, -15.4);
    g.lineTo(4.0, -15.7); g.bezierCurveTo(4.2, -19.4, 5.7, -22.2, 7.7, -23.4); g.quadraticCurveTo(8.9, -24.0, 10.2, -24.6); },
  long: (g) => { g.moveTo(10.7, -24.0); g.bezierCurveTo(11.4, -29.8, 3.6, -32.6, -2.6, -31.5); g.bezierCurveTo(-9.8, -30.3, -12.6, -22.6, -12.1, -14.0);
    g.bezierCurveTo(-11.8, -4, -12.8, 6, -10.8, 14.6); g.quadraticCurveTo(-6.4, 17.8, -1.8, 14.9); g.bezierCurveTo(-3.6, 6.0, -1.6, -2.0, 1.4, -7.4);
    g.bezierCurveTo(2.8, -10.2, 3.2, -14.0, 3.9, -17.0); g.bezierCurveTo(4.9, -20.5, 7.4, -22.9, 10.7, -24.0); },
  grey: (g) => { g.moveTo(8.6, -26.4); g.bezierCurveTo(7.4, -30.0, 1.6, -31.2, -3.4, -30.2); g.bezierCurveTo(-8.4, -29.0, -10.6, -23.8, -10.0, -17.4);
    g.bezierCurveTo(-9.6, -13.0, -7.8, -10.4, -5.4, -9.2); g.lineTo(-3.3, -10.6); g.bezierCurveTo(-2.4, -13, -1.9, -16.6, -1.2, -18.4); g.quadraticCurveTo(1.6, -18.8, 2.9, -15.4);
    g.lineTo(3.8, -15.8); g.bezierCurveTo(4.0, -20.0, 5.0, -24.2, 8.6, -26.4); },
  bald: (g) => { g.moveTo(-7.6, -24.0); g.bezierCurveTo(-10.4, -20.4, -10.2, -13.2, -5.4, -9.2); g.lineTo(-3.3, -10.6); g.bezierCurveTo(-2.4, -13, -1.9, -16.6, -1.2, -18.6); g.quadraticCurveTo(-3.6, -21.6, -7.6, -24.0); },
};
const STRANDS = {
  short: [[9.6, -25.4, 4, -30.4, -3.4, -29.6], [8.2, -24.6, 1, -28.6, -6.8, -26.2], [6.4, -23.4, -2, -26.4, -8.8, -21.6], [3.2, -21.4, -3.6, -22.8, -8.6, -15.2], [-.4, -19.2, -5.4, -19.4, -6.8, -11.6]],
  long: [[10.2, -24.6, 3, -31, -6.4, -28.4], [8.6, -23.6, -1, -28.4, -9.4, -21.2], [5.6, -22.4, -6, -22, -10.4, -10], [3.4, -19.6, -6.6, -12, -8.4, 8], [2.2, -14.6, -3.4, -2, -5.2, 12.8], [-1.6, -24.8, -11, -14, -9.6, 4.2]],
  grey: [[8.2, -26.6, 2, -30.4, -5.6, -28.2], [5.4, -25.4, -2, -27.6, -8.6, -21.4], [1.8, -22.4, -4.6, -21.6, -8.0, -13.6]],
  bald: [[-7.4, -21.4, -9.2, -16, -6.0, -11.2]],
};
function hairFill(g, P, D) {
  g.fillStyle = D.hair; g.beginPath();
  if (P.hair === 'curly') { g.arc(0, -21.5, 9.6, Math.PI * .6, Math.PI * 1.95); HAIR.bald(g); }
  else (HAIR[P.hair] || HAIR.short)(g);
  g.closePath(); fillOV(g);
  if (P.hair === 'curly') for (let i = 0; i < 9; i++) { const a = Math.PI * (.62 + i * .16), r0 = 9.4 + Math.sin(i * 2.3) * .8; g.beginPath(); g.arc(Math.cos(a) * r0 - .4, -21.6 + Math.sin(a) * r0, 3.4 + (i % 3) * .5, 0, 7); g.fill(); }
  if (P.hair === 'bun') { g.beginPath(); g.ellipse(-9.2, -26.4, 5.2, 4.6, -.4, 0, 7); g.fill(); }
}
function capHood(g, P, D) {
  if (P.hair === 'cap') {
    g.fillStyle = D.hairBack || shade(D.hair, -.12); g.beginPath(); HAIR.bald(g); g.closePath(); g.fill();
    g.fillStyle = D.hair; g.beginPath(); g.moveTo(-9.8, -20.6); g.bezierCurveTo(-10.2, -28.6, -3.6, -33.0, 2.4, -32.4); g.bezierCurveTo(8.0, -31.8, 11.2, -27.6, 11.4, -22.6); g.closePath(); fillOV(g);
    g.beginPath(); g.moveTo(8.6, -23.6); g.quadraticCurveTo(13.6, -24.4, 17.4, -21.6); g.lineTo(16.8, -20.6); g.quadraticCurveTo(13.0, -22.2, 8.8, -21.4); g.closePath(); g.fill();
  }
  if (P.hood) { g.fillStyle = D.hoodC || D.coat; g.beginPath(); g.moveTo(10.6, -30.6); g.quadraticCurveTo(-7, -37.4, -13.4, -18.4); g.quadraticCurveTo(-15.4, 0, -6.4, 6.4); g.lineTo(4.4, 6.4); g.quadraticCurveTo(-3.4, -4.2, -2.4, -14.6); g.quadraticCurveTo(-.2, -27.4, 12.4, -24.6); g.closePath(); fillOV(g); }
}
function drawHead(g, P, D, lod, s, sil) {
  const fem = P.hair === 'long' || P.hair === 'bun' || !!P.skirt, skin = D.skin, eyeC = '#1d1416', lidC = shade(skin, -.42), turn = clamp(P.turn || 0, -1, 1);
  const hk = .94; g.scale(hk, hk);
  g.fillStyle = skin; headPath(g, fem); fillOV(g);
  if (sil) { if (P.hair !== 'cap') hairFill(g, P, D); capHood(g, P, D); return; }
  if (lod >= 1) {
    const earX = .5 - turn * 1.6, earUnder = P.hair === 'long' || P.hood;
    if (!earUnder) { g.fillStyle = shade(skin, -.07); g.beginPath(); g.ellipse(earX, -14.4, 2.4, 3.9, .16, 0, 7); g.fill();
      if (lod >= 2) { g.strokeStyle = rgba(shade(skin, -.38), .7); g.lineWidth = .45; g.beginPath(); g.arc(earX + .3, -14.6, 1.5, -2.2, 1.6); g.stroke(); } }
    const op = clamp(1 - (P.eye || 0)) * (1 - .28 * clamp(P.gaze || 0)), ex = 9.0 + turn * .9, ey = -16.4, gz = clamp(P.gaze || 0, -1, 1);
    if (lod >= 2) {
      g.fillStyle = rgba(shade(skin, -.16), .55); g.beginPath(); g.ellipse(ex - .4, ey - 1.3, 2.6, 1.5, 0, 0, 7); g.fill();
      if (op > .08) {
        g.save(); g.beginPath(); g.moveTo(ex - 1.7, ey); g.quadraticCurveTo(ex - .2, ey - 2.3 * op - .05, ex + 1.3, ey + .05); g.quadraticCurveTo(ex - .1, ey + 1.15 * op, ex - 1.7, ey); g.closePath();
        g.fillStyle = mixHex(skin, '#f4ece2', .55); g.fill(); g.clip();
        g.fillStyle = eyeC; g.beginPath(); g.arc(ex + .45 + gz * .1, ey - .2 + gz * .42, 1.0, 0, 7); g.fill();
        if (s >= 2.4) { g.fillStyle = 'rgba(255,248,236,.75)'; g.beginPath(); g.arc(ex + .62, ey - .35 + gz * .3, .2, 0, 7); g.fill(); }
        g.restore();
      }
      g.strokeStyle = lidC; g.lineCap = 'round'; g.lineWidth = .55; g.beginPath(); g.moveTo(ex - 1.95, ey - .05); g.quadraticCurveTo(ex - .2, ey - 2.35 * op - .1 + (1 - op) * 1.2, ex + 1.35, ey + .1); g.stroke();
      if (s >= 1.8 && op > .3) { g.strokeStyle = rgba(lidC, .45); g.lineWidth = .35; g.beginPath(); g.moveTo(ex - 1.4, ey - 1.5 - .6 * op); g.quadraticCurveTo(ex - .1, ey - 2.3 - .7 * op, ex + .9, ey - 1.3 - .5 * op); g.stroke(); }
    } else {
      g.fillStyle = eyeC; g.beginPath(); g.ellipse(ex + .3, ey, 1.1, .22 + .62 * op, 0, 0, 7); g.fill();
    }
    g.strokeStyle = P.hair === 'grey' ? shade(D.hair, -.12) : shade(D.hair, .06); g.lineCap = 'round'; g.lineWidth = lod >= 2 ? .9 : 1.1;
    g.beginPath(); g.moveTo(ex - 2.6, ey - 2.4 + gz * .2); g.quadraticCurveTo(ex - .2, ey - 3.6 + gz * .25, ex + 2.0, ey - 2.9 + gz * .2); g.stroke();
    if (lod >= 2) {
      const sm2 = clamp(P.smile || 0);
      g.strokeStyle = rgba(shade(skin, -.4), .8); g.lineWidth = .5; g.beginPath(); g.arc(12.3 - (fem ? .4 : 0), -11.9, .55, -.4, 2.6); g.stroke();
      g.save(); headPath(g, fem); g.clip();
      g.fillStyle = rgba('#9a3c34', fem ? .2 : .12); g.beginPath(); g.ellipse(12.2, -8.3, 1.1, 1.4, 0, 0, 7); g.fill();
      g.fillStyle = rgba('#c8604c', .1); g.beginPath(); g.ellipse(7.6 + turn * .6, -12.0, 3.2, 2.2, 0, 0, 7); g.fill();
      g.restore();
      g.strokeStyle = rgba(shade(skin, -.48), .85); g.lineWidth = .5; g.beginPath(); g.moveTo(12.2, -8.55); g.quadraticCurveTo(11.2, -8.4, 10.3 + turn * .3, -8.55 - .7 * sm2); g.stroke();
      g.strokeStyle = rgba(shade(skin, -.22), .45); g.lineWidth = .7; g.beginPath(); g.moveTo(.8 - turn, -9.8); g.quadraticCurveTo(4.6, -4.8, 9.3, -3.7); g.stroke();
      if (P.hair === 'grey') { g.strokeStyle = rgba(shade(skin, -.3), .4); g.lineWidth = .4; g.beginPath(); g.moveTo(11.8, -11.4); g.quadraticCurveTo(10.8, -10.2, 11.0, -8.9); g.moveTo(7.6, -16.0); g.lineTo(6.4, -15.6); g.stroke(); }
    }
    if (P.hair !== 'cap') {
      hairFill(g, P, D);
      const st = STRANDS[P.hair] || (P.hair === 'bun' || P.hair === 'curly' ? STRANDS.short : null);
      if (st) {
        folds(g, st, rgba(mixHex(D.hair, '#ffe8c8', .3), lod >= 2 ? .38 : .25), lod >= 2 ? .45 : .6);
        if (lod >= 2) folds(g, st.map(([a, b, c, d, e, f]) => [a - .9, b + .8, c - .6, d + 1.1, e - .4, f + .9]), rgba(shade(D.hair, -.25), .5), .4);
      }
    }
  } else if (P.hair !== 'cap') hairFill(g, P, D);
  capHood(g, P, D);
}
// the whole figure in figure units (g already translated to the hip and scaled); sil: one flat colour, no details (the rim pass)
function body(g, P, R, D, lod, s, part, prop, sil) {
  const B = P.bulk, sY = R.shY, w = B, hem = P.coat ? 22 + 16 * P.coat : 6, ink = '#05060c', FW = lod >= 2 ? .55 : .8, legC = D.pants, armC = D.coat;
  const det = !sil && lod >= 1;
  const legDraw = (i, col) => {
    const l = R.leg(i), fr = l.tf < .6, sk = P.skirt;
    g.fillStyle = col;
    seg(g, l.sx, 0, 9.6 * B, l.kx, l.ky, 6.5, .9, 1.3, .35);
    seg(g, l.kx, l.ky, 6.3, l.fx, l.fy, sk ? 3.8 : 4.9, sk ? 1.2 : .9, .25, .3);
    if (!sil && lod >= 2) crease(g, l.sx, 0, l.kx, l.ky, l.fx, l.fy, 6.4, ink, FW);
    shoe(g, l.fx, l.fy, P.ft ? P.ft[i] : 0, sil ? col : D.shoes, lod, fr, sil);
  };
  const armDraw = (i, col) => {
    const m = R.arm(i);
    g.fillStyle = col;
    seg(g, m.sx, m.sy, 8.1 * B, m.ex, m.ey, 5.7, .7, .6, .45);
    seg(g, m.ex, m.ey, 5.6, m.hx, m.hy, 4.6, .8, .45, .3);
    if (det) {
      if (lod >= 2) crease(g, m.sx, m.sy, m.ex, m.ey, m.hx, m.hy, 5.6, ink, FW);
      const dx = Math.sin(m.ang), dy = Math.cos(m.ang); g.strokeStyle = rgba(ink, .35); g.lineWidth = FW; g.beginPath(); g.moveTo(m.hx - dx * 1.6 - dy * 4.4, m.hy - dy * 1.6 + dx * 4.4); g.lineTo(m.hx - dx * 1.6 + dy * 4.4, m.hy - dy * 1.6 - dx * 4.4); g.stroke();
    }
    hand(g, m.hx - Math.sin(m.ang) * .6, m.hy - Math.cos(m.ang) * .6, m.ang, P.hands ? P.hands[i] : 'relaxed', sil ? col : D.skin, lod, sil);
  };
  const C2 = (c) => (sil ? D.rim : c);
  if (part !== 'front') { legDraw(1, C2(shade(legC, -.03))); legDraw(0, C2(legC)); }
  g.save(); g.rotate(P.lean);
  if (part !== 'front') {
    armDraw(1, C2(shade(armC, -.06)));
    g.fillStyle = C2(armC); g.beginPath();
    g.moveTo(-15 * w, 4); g.bezierCurveTo(-17 * w, -14, -13 * w, -30, -14 * w, -46); g.bezierCurveTo(-15.2 * w, sY + 9, -10.5 * w, sY + 1.2, -4.6, sY - 4.6); g.quadraticCurveTo(0, sY - 6, 5.6, sY - 4.2);
    g.bezierCurveTo(14 * w, sY - 3, 20 * w, sY + 6, 19 * w, -44); g.bezierCurveTo(18 * w, -30, 13 * w, -14, 15 * w, 4);
    if (P.skirt) { g.lineTo(21 * w, hem + 34); g.quadraticCurveTo(0, hem + 38, -20 * w, hem + 34); }
    else if (P.coat) { g.lineTo(17 * w + P.coat * 3, hem); g.quadraticCurveTo(0, hem + 3, -17 * w - P.coat * 3, hem); }
    else g.quadraticCurveTo(0, 12, -15 * w, 4);
    g.closePath(); fillOV(g);
    if (P.skirt && D.skirt && !sil) { g.fillStyle = D.skirt; g.beginPath(); g.moveTo(-15 * w, 0); g.lineTo(15 * w, 0); g.lineTo(21 * w, hem + 34); g.quadraticCurveTo(0, hem + 38, -20 * w, hem + 34); g.closePath(); fillOV(g); }
    if (!sil) {
      g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(10 * w, sY + 4, 1.6, (P.coat ? hem : 2) - sY - 4);
      if (P.coat) g.fillRect(4, -18, 9, 1.4);
      if (lod >= 1) folds(g, [[-12 * w, -20, -4, -16, 6 * w, -19], [9 * w, -34, 13 * w, -28, 16 * w, -30], [-10 * w, -8, -2, -5, 8 * w, -8]], rgba(ink, lod >= 2 ? .3 : .2), FW);
      if (lod >= 2) folds(g, [[1.5, sY + 9, 2.4, -30, 1.2, P.coat ? hem - 2 : 2], [-13 * w, -40, -11 * w, -34, -12 * w, -26]], rgba(ink, .22), FW * .9);
    }
    // the neck runs into the shoulders
    g.save(); g.translate(1, sY - 2); g.rotate(P.head);
    { const ch = Math.cos(-P.head), sn = Math.sin(-P.head), L = (bx, by) => [bx * ch - by * sn, bx * sn + by * ch], [b0x, b0y] = L(-4.4, -.9), [b1x, b1y] = L(5.0, -1.0);
      g.fillStyle = C2(D.skin); g.beginPath(); g.moveTo(b0x, b0y); g.quadraticCurveTo(-3.6, -3.4, -4.0, -7.6); g.lineTo(4.4, -4.0); g.quadraticCurveTo(5.2, -2.2, b1x, b1y); g.closePath(); fillOV(g);
      if (det) { g.fillStyle = rgba(shade(D.skin, -.3), .55); g.beginPath(); g.moveTo(-4.0, -7.4); g.lineTo(4.4, -4.0); g.quadraticCurveTo(1.6, -1.4, -3.6, -3.2); g.closePath(); g.fill(); } }
    g.restore();
    if (det) {
      g.fillStyle = shade(armC, -.05); g.beginPath();
      if (P.coat) { g.moveTo(-6.0, sY - .8); g.quadraticCurveTo(-6.2, sY - 4.6, -4.4, sY - 7.4); g.quadraticCurveTo(1.0, sY - 8.6, 5.6, sY - 6.4); g.quadraticCurveTo(7.6, sY - 1.8, 10.2, sY + 6.6); g.lineTo(6.4, sY + 1.4); g.quadraticCurveTo(0, sY - 2.8, -6.0, sY - .8); }
      else { g.moveTo(-5.6, sY - 3.0); g.quadraticCurveTo(0, sY - 7.6, 6.6, sY - 4.6); g.lineTo(6.9, sY - 2.6); g.quadraticCurveTo(0, sY - 5.2, -5.4, sY - .9); }
      g.closePath(); g.fill();
      if (lod >= 2) folds(g, P.coat ? [[-4.6, sY - 7.2, 1.0, sY - 8.4, 5.4, sY - 6.2], [6.0, sY - 5.6, 7.8, sY - 1.4, 10.0, sY + 6.0]] : [[-5.4, sY - 3.2, 0, sY - 7.4, 6.4, sY - 4.6]], rgba('#ffffff', .14), .5);
    }
    if (P.scarf) {
      const sc = C2(D.scarf || '#e8a3a0'); g.fillStyle = sc;
      g.beginPath(); g.ellipse(1.4, sY - 1.6, 11.6, 5.6, .08, 0, 7); fillOV(g); g.beginPath(); g.ellipse(2.2, sY + 2.2, 10.6, 4.6, .14, 0, 7); fillOV(g);
      g.beginPath(); g.moveTo(9.0, sY + 1.6); g.quadraticCurveTo(15.8, sY + 11, 15.4, sY + 24); g.lineTo(9.8, sY + 24.4); g.quadraticCurveTo(10.6, sY + 12, 5.6, sY + 3.4); g.closePath(); fillOV(g);
      if (det) folds(g, [[-9.4, sY - .4, 1, sY + 1.6, 11.6, sY - .4], [9.6, sY + 6, 12.6, sY + 14, 12.4, sY + 23]], rgba(shade(sc, -.35), .7), FW);
    }
    g.save(); g.translate(1, sY - 2); g.rotate(P.head);
    drawHead(g, P, sil ? { ...D, skin: D.rim, hair: D.rim, hairBack: D.rim, coat: D.rim, hoodC: D.rim } : D, lod, s, sil);
    g.restore();
  }
  if (part !== 'body') {
    armDraw(0, C2(armC));
    if (prop && !sil) { const o0 = OV; OV = null; prop(g, R.arm(0), R.arm(1), D); OV = o0; }
  }
  g.restore();
}
const fogC = (c, F) => (F && F.a > 0 && typeof c === 'string' && c[0] === '#' ? mixHex(c, F.col, F.a) : c);
export function person(ctx, x, y, s, pose = {}, o = {}) {
  const P = Object.assign({}, PDEF, resolve(pose, o)), flip = o.flip ? -1 : 1, part = o.part || 'all';
  if (P._life) { const Lf = P._life; P.turn = (pose.turn ?? o.turn ?? 0) + Lf.turn * .7; P.head += Lf.nod * .07 + Lf.turn * .02; if (pose.eye == null) P.eye = blink(o.t, o.seed || 0); }
  if (o.smile != null) P.smile = o.smile; if (o.gaze != null) P.gaze = o.gaze;
  const F = o.fog || null;
  const D0 = Object.assign({ coat: '#2c3450', pants: '#15142a', shoes: '#0b0a18', skin: SKINS[(o.seed || 0) % SKINS.length], hair: '#1c1420', shirt: null }, o.dress || {});
  const D = {}; for (const k in D0) D[k] = fogC(D0[k], F);
  const lod = s < .45 ? 0 : s < 1.1 ? 1 : 2, R = rig(P);
  const px = x + (P._wx || 0) * s * flip, py = y + ((P.dy || 0) + (P._b || 0) * -.35) * s;
  const sitting = P.hip[0] > .9 || P.thigh != null;
  if (o.shadow !== false && !sitting && part !== 'front') {
    const fy = py + 90 * s, g = ctx.createRadialGradient(px, fy, 0, px, fy, 40 * s);
    g.addColorStop(0, 'rgba(4,4,14,.5)'); g.addColorStop(1, 'rgba(4,4,14,0)');
    ctx.save(); ctx.translate(px, fy); ctx.scale(1, .2); ctx.translate(-px, -fy); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, fy, 40 * s, 0, 7); ctx.fill(); ctx.restore();
  }
  // rim: the same silhouette in the rim colour, offset toward the light, under the body
  if (o.rim) {
    const off = o.rimW ?? Math.max(1.2, 1.6 * s), side = o.rimSide ?? 1;
    ctx.save(); ctx.translate(px + side * off, py - off * .4); ctx.scale(s * flip, s); OV = null;
    body(ctx, P, R, { ...D, rim: o.rim }, lod, s, part, null, true); ctx.restore();
  }
  ctx.save(); ctx.translate(px, py); ctx.scale(s * flip, s);
  OV = null;
  if (o.light) {
    const { x: lx, y: ly, col = '#fff1d6', a = .55 } = o.light, dx = lx - px, dy = ly - py, Ln = Math.hypot(dx, dy) || 1, ux = dx / Ln * flip, uy = dy / Ln, ka = F ? 1 - F.a : 1;
    const gr = ctx.createLinearGradient(-ux * 30, -60 - uy * 30, ux * 30, -60 + uy * 30);
    gr.addColorStop(0, `rgba(5,6,20,${.38 * ka})`); gr.addColorStop(.5, 'rgba(5,6,20,0)'); gr.addColorStop(.62, rgba(col, 0)); gr.addColorStop(1, rgba(col, a * ka));
    OV = gr;
  }
  body(ctx, P, R, D, lod, s, part, o.prop, false);
  OV = null;
  ctx.restore();
  const toScr = (hx, hy) => { const cs = Math.cos(P.lean), sn = Math.sin(P.lean); return [px + (hx * cs - hy * sn) * s * flip, py + (hx * sn + hy * cs) * s]; };
  return { hand: (i) => { const m = R.arm(i); return toScr(m.hx + Math.sin(m.ang) * 4, m.hy + Math.cos(m.ang) * 4); }, feetY: py + 88 * s, head: toScr(1 + 3, R.shY - 18), P };
}
// screen point of a joint without drawing: 'shoulder' (front shoulder joint), 'shoulderTop' (where a hand rests on it), 'head'
export function jointAt(x, y, s, pose, o, which = 'shoulder') {
  const P = Object.assign({}, PDEF, resolve(pose, o)), flip = o.flip ? -1 : 1, R = rig(P);
  const px = x + (P._wx || 0) * s * flip, py = y + ((P.dy || 0) + (P._b || 0) * -.35) * s, cs = Math.cos(P.lean), sn = Math.sin(P.lean);
  const L = which === 'head' ? [4, R.shY - 18] : which === 'shoulderTop' ? [-1, R.shY + 1] : [3, R.shY + 7];
  return [px + (L[0] * cs - L[1] * sn) * s * flip, py + (L[0] * sn + L[1] * cs) * s];
}
// a long soft shadow on the ground away from a light (copied from lib/art.mjs castShadow)
export function castShadow(ctx, x, footY, s, lx, ly, { a = .45, len = 2.4, col = '#05060f', sy = 12 } = {}) {
  const ang = Math.atan2(footY - ly, x - lx); ctx.save(); ctx.translate(x, footY); ctx.rotate(ang);
  const g = ctx.createLinearGradient(0, 0, 180 * s * len, 0); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(90 * s * len, 0, 90 * s * len, sy * s, 0, 0, 7); ctx.fill(); ctx.restore();
}

// ---------------------------------------------------------------- children (a port of figureKid's shapes, drawn in place)
const KIDP = {
  child: { legU: 25, legL: 24, thigh: 6.9, knee: 5.3, ankle: 4.2, foot: [7.2, 3.9], T: 37, shw: 11.6, armU: 17, armL: 15.5, armR: [5.8, 4.6], hand: 3.8, head: [10.8, 11.9], neck: 3.1 },
  toddler: { legU: 15.5, legL: 14, thigh: 7, knee: 5.9, ankle: 4.9, foot: [6.8, 4], T: 27, shw: 11.2, armU: 12, armL: 11, armR: [5.5, 4.9], hand: 3.9, head: [10.6, 11.2], neck: 2.1 },
};
export const KIDPOSES = {
  stand: {}, sit: { hip: [1.45, 1.5], kn: [1.45, 1.5], sh: [0.5, 0.42], el: [0.8, 0.9], lean: .05 },
  // on an adult's shoulders: thighs forward over the shoulders, shins hanging down in front of the chest, hands on the adult's head
  ride: { hip: [1.5, 1.45], kn: [1.75, 1.7], sh: [.95, .7], el: [.95, 1.1], lean: .02 },
  wave: { sh: [2.6, 0.2], el: [0.25, 0.3], head: -.1 },
};
function capsuleF(g, x1, y1, r1, x2, y2, r2) {
  const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(Math.max(-1, Math.min(1, (r1 - r2) / (d || 1))));
  g.beginPath(); g.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); g.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); g.closePath(); fillOV(g);
}
function kidBody(g, P, A, D, o, sil, s) {
  const sY = -A.T + (P._b || 0) * -.5, C2 = (c) => (sil ? D.rim : c);
  const leg = (i) => { const a = P.hip[i], k = P.kn[i], sx = i ? -A.shw * .32 : A.shw * .32, kx = sx + Math.sin(a) * A.legU, ky = Math.cos(a) * A.legU, fx = kx + Math.sin(a - k) * A.legL, fy = ky + Math.cos(a - k) * A.legL;
    g.fillStyle = C2(i ? shade(D.pants, -.05) : D.pants); capsuleF(g, sx, 0, A.thigh, kx, ky, A.knee); capsuleF(g, kx, ky, A.knee, fx, fy, A.ankle);
    g.fillStyle = C2(D.shoes); g.beginPath(); g.ellipse(fx + A.foot[0] * .55, fy + A.foot[1] * .6, A.foot[0], A.foot[1], 0, 0, TAU); fillOV(g); return [fx, fy]; };
  const arm = (i) => { const a = P.sh[i], e = P.el[i], sx = i ? -A.shw * .25 : A.shw * .25, sy = sY + A.armR[0] * .9, ex = sx + Math.sin(a) * A.armU, ey = sy + Math.cos(a) * A.armU, hx = ex + Math.sin(a + e) * A.armL, hy = ey + Math.cos(a + e) * A.armL;
    g.fillStyle = C2(i ? shade(D.top, -.07) : D.top); capsuleF(g, sx, sy, A.armR[0], ex, ey, A.armR[1]); capsuleF(g, ex, ey, A.armR[1], hx, hy, A.armR[1] * .85);
    g.fillStyle = C2(D.skin); g.beginPath(); g.ellipse(hx + Math.sin(a + e) * A.hand * .7, hy + Math.cos(a + e) * A.hand * .7, A.hand, A.hand * 1.12, -(a + e), 0, TAU); fillOV(g); return { sx, sy, ex, ey, hx, hy, ang: a + e }; };
  leg(1); leg(0);
  g.save(); g.rotate(P.lean);
  const backArm = arm(1), w = A.shw;
  g.fillStyle = C2(D.top); g.beginPath();
  g.moveTo(-w * .95, 3); g.bezierCurveTo(-w * 1.15, -A.T * .35, -w * 1.05, sY + 8, -w * .55, sY - 1); g.quadraticCurveTo(0, sY - 4, w * .6, sY - 1);
  g.bezierCurveTo(w * 1.12, sY + 8, w * 1.3, -A.T * .35, w * 1.02, 3); g.quadraticCurveTo(0, 8, -w * .95, 3); g.closePath(); fillOV(g);
  if (!sil) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(-w * .9, -2, w * 1.9, 3); }
  g.save(); g.translate(1, sY - 1); g.rotate(P.head); g.fillStyle = C2(D.skin); capsuleF(g, 0, 2, A.neck + 1, 1, -A.neck, A.neck);
  const hy = -A.neck - A.head[1] * .92; g.beginPath(); g.ellipse(2, hy, A.head[0], A.head[1], .1, 0, TAU); fillOV(g);
  g.fillStyle = C2(D.hair); const hs = o.hair || (o.age === 'toddler' ? 'curly' : 'short');
  if (hs === 'curly') { for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(-7 + i * 2.6, hy - A.head[1] * .62 + Math.sin(i * 2.1) * 1.2 + (i < 2 ? 4 : 0), 3.7, 0, TAU); g.fill(); } }
  else { g.beginPath(); g.ellipse(0, hy - 2.5, A.head[0] * 1.02, A.head[1] * .82, .12, Math.PI * .72, Math.PI * 2.05); g.closePath(); fillOV(g);
    if (hs === 'pigtails') { g.beginPath(); g.ellipse(-A.head[0] * .95, hy + 2, 3.2, 5.2, .3, 0, TAU); g.fill(); }
    if (hs === 'bob') { g.beginPath(); g.moveTo(-A.head[0] * .9, hy - 4); g.quadraticCurveTo(-A.head[0] * 1.2, hy + 6, -A.head[0] * .5, hy + A.head[1] * .75); g.lineTo(-A.head[0] * .2, hy + 2); g.closePath(); g.fill(); } }
  if (!sil) { const o0 = OV; OV = null; kidFace(g, A, hy, D, s * A.head[1] * 2, P, hs); OV = o0; }
  g.restore();
  const frontArm = arm(0);
  g.restore();
  return { frontArm, backArm, sY };
}
function kidFace(g, A, hy, D, px, P, hs) {
  if (px < 14) return;
  const rx = A.head[0], ry = A.head[1], cx = 2, skin = D.skin, big = px >= 34, op = clamp(1 - (P.eye || 0)), tn = clamp(P.turn || 0, -1, 1);
  g.fillStyle = skin; g.beginPath(); g.ellipse(cx + rx * .93, hy + ry * .2, rx * .17, rx * .15, .3, 0, TAU); g.fill();
  g.fillStyle = shade(skin, -.05); g.beginPath(); g.ellipse(cx - rx * .12 - tn * 1.2, hy + ry * .14, rx * .17, ry * .25, .1, 0, TAU); g.fill();
  g.fillStyle = 'rgba(200,96,76,.16)'; g.beginPath(); g.ellipse(cx + rx * .5, hy + ry * .4, rx * .22, ry * .14, 0, 0, TAU); g.fill();
  const ex = cx + rx * .56 + tn * .8, ey = hy + ry * .05;
  if (big) {
    g.save(); g.beginPath(); g.moveTo(ex - 1.5, ey); g.quadraticCurveTo(ex - .1, ey - 2.4 * op, ex + 1.2, ey + .1); g.quadraticCurveTo(ex, ey + 1.2 * op, ex - 1.5, ey); g.closePath();
    if (op > .1) { g.fillStyle = mixHex(skin, '#f4ece2', .55); g.fill(); g.clip(); g.fillStyle = '#1d1416'; g.beginPath(); g.arc(ex + .4, ey - .1, 1.0, 0, TAU); g.fill(); }
    g.restore();
    g.strokeStyle = shade(skin, -.42); g.lineCap = 'round'; g.lineWidth = .55; g.beginPath(); g.moveTo(ex - 1.7, ey); g.quadraticCurveTo(ex - .1, ey - 2.45 * op - .1 + (1 - op) * 1.2, ex + 1.3, ey + .1); g.stroke();
  } else { g.fillStyle = '#1d1416'; g.beginPath(); g.ellipse(ex + .3, ey, 1.1, .25 + .65 * op, 0, 0, TAU); g.fill(); }
  g.strokeStyle = rgba(shade(skin, -.45), .85); g.lineWidth = big ? .55 : .75; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx + rx * .86, hy + ry * .5); g.quadraticCurveTo(cx + rx * .74, hy + ry * .53, cx + rx * .64, hy + ry * .48); g.stroke();
}
export function kid(ctx, x, y, s, pose = {}, o = {}) {
  const A = KIDP[o.age || 'child'] || KIDP.child, P = resolve(pose, o), flip = o.flip ? -1 : 1, F = o.fog || null;
  if (P._life) { P.head += P._life.turn * .12 + P._life.nod * .06; P.eye = pose.eye ?? blink(o.t, o.seed || 0); P.turn = P._life.turn * .7; }
  const D0 = Object.assign({ top: o.accent || '#d9824a', pants: '#2a2f52', shoes: '#16141f', skin: SKINS[(o.seed || 0) % SKINS.length], hair: '#21161a' }, o.dress || {});
  if (o.accent) D0.top = o.accent;
  const D = {}; for (const k in D0) D[k] = fogC(D0[k], F);
  const py = y + ((P.dy || 0) + (P._b || 0) * -.25) * s, px = x;
  if (o.rim) { const off = Math.max(1.1, 1.4 * s), side = o.rimSide ?? 1; ctx.save(); ctx.translate(px + side * off, py - off * .4); ctx.scale(s * flip, s); OV = null; kidBody(ctx, P, A, { ...D, rim: o.rim }, o, true, s); ctx.restore(); }
  ctx.save(); ctx.translate(px, py); ctx.scale(s * flip, s); OV = null;
  if (o.light) { const { x: lx, y: ly, col = '#ffd9a0', a = .5 } = o.light, dx = lx - px, dy = ly - py, L = Math.hypot(dx, dy) || 1, ux = dx / L * flip, uy = dy / L;
    const gr = ctx.createLinearGradient(-ux * 22, -30 - uy * 22, ux * 22, -30 + uy * 22); gr.addColorStop(0, 'rgba(5,6,20,.36)'); gr.addColorStop(.5, 'rgba(5,6,20,0)'); gr.addColorStop(.62, rgba(col, 0)); gr.addColorStop(1, rgba(col, a)); OV = gr; }
  const r = kidBody(ctx, P, A, D, o, false, s); OV = null; ctx.restore();
  const toScr = (hx, hy) => { const cs = Math.cos(P.lean), sn = Math.sin(P.lean); return [px + (hx * cs - hy * sn) * s * flip, py + (hx * sn + hy * cs) * s]; };
  return { hand: (i) => { const m = i ? r.backArm : r.frontArm; return toScr(m.hx, m.hy); }, feetY: y + (A.legU + A.legL) * s, head: toScr(2, r.sY - A.neck - A.head[1]) };
}

// ---------------------------------------------------------------- seen from the front, back-lit, sitting on a wall edge, legs dangling
// x, y = the middle of the seat (wall edge) on screen; s as person(). Faces stay in shadow (back light): a dark figure with a warm rim
// on the head, shoulders and arms, hair strands lit, a little bounce light from the water on the shins.
//   o: { t, seed, dress, rim (col), rimA, sun: [x, y] (screen point of the back light), turn (-1..1 head toward the friend), reach (0..1
//        the near hand goes to the bag), lift (0..1 a hand brings a cherry up), swing [a, b] (leg swing phases), hair, bulk, fem }
export function sitFront(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, sd = o.seed ?? 1, Lf = life(t, sd), D = Object.assign({ coat: '#2a2f48', pants: '#191a2c', skin: '#3a2c2c', hair: '#120d10', shoes: '#0c0b14' }, o.dress || {});
  const rim = o.rim || '#ffcf8a', ra = o.rimA ?? .9, B = o.bulk ?? 1, fem = !!o.fem, b = Lf.b, turn = clamp((o.turn ?? 0) + Lf.turn * .35, -1, 1);
  const sun = o.sun || [x, y - 400 * s], sdx = sun[0] - x, sdy = sun[1] - (y - 60 * s), sl = Math.hypot(sdx, sdy) || 1, lx = sdx / sl, ly = sdy / sl;
  const swing = o.swing || [0, 0], sw0 = Math.sin(t * 1.9 + sd * 2 + swing[0]) * .18, sw1 = Math.sin(t * 1.7 + sd * 3.1 + swing[1]) * .18;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const sh = -60 - b * .9, hw = 19 * B;
  // legs: thighs come toward us over the edge (foreshortened), shins hang down the wall face and swing a little
  const legs = [[-8 * B, sw0], [8 * B, sw1]];
  for (const [lx0, swv] of legs) {
    const kx = lx0 * 1.15, ky = 10, fx = kx + Math.sin(swv) * 6, fy = ky + 40 * Math.cos(swv * .5);
    ctx.fillStyle = D.pants; ctx.beginPath(); ctx.ellipse(lx0 * 1.05, 5, 9.5 * B, 8, 0, 0, TAU); ctx.fill();
    capsuleFill(ctx, kx, ky, 7.4, fx, fy, 5.2, D.pants);
    ctx.fillStyle = D.shoes; ctx.beginPath(); ctx.ellipse(fx, fy + 5, 6.2, 5.2, 0, 0, TAU); ctx.fill();
    // bounce light from the water on the shins
    ctx.strokeStyle = rgba(rim, .22 * ra); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(fx - 4.4, fy - 2); ctx.lineTo(kx - 6, ky + 6); ctx.stroke();
  }
  // torso (front, slightly hunched, round shoulders)
  ctx.save(); ctx.rotate((Lf.w * .02) + (o.lean ?? 0));
  const torso = () => { ctx.beginPath(); ctx.moveTo(-hw * .82, 2); ctx.bezierCurveTo(-hw * .95, -20, -hw * 1.02, sh + 12, -hw * .78, sh + 2); ctx.quadraticCurveTo(-hw * .5, sh - 4, -5, sh - 5);
    ctx.lineTo(5, sh - 5); ctx.quadraticCurveTo(hw * .5, sh - 4, hw * .78, sh + 2); ctx.bezierCurveTo(hw * 1.02, sh + 12, hw * .95, -20, hw * .82, 2); ctx.quadraticCurveTo(0, 8, -hw * .82, 2); ctx.closePath(); };
  // rim first (offset toward the sun), then the body
  const off = 1.6 / Math.max(.3, s) + .8;
  ctx.save(); ctx.translate(lx * off, ly * off); ctx.fillStyle = rgba(rim, ra); torso(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(1 + turn * 2, sh - 20, 10.2, 12.2, 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.fillStyle = D.coat; torso(); ctx.fill();
  const tg = ctx.createLinearGradient(-lx * hw, sh - ly * 30, lx * hw, sh + ly * 30); tg.addColorStop(0, 'rgba(4,5,14,.35)'); tg.addColorStop(.7, 'rgba(4,5,14,0)'); tg.addColorStop(1, rgba(rim, .18 * ra));
  ctx.fillStyle = tg; torso(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(0, sh); ctx.lineTo(0, -4); ctx.moveTo(-hw * .55, -24); ctx.quadraticCurveTo(-2, -20, hw * .5, -25); ctx.stroke();
  // arms: upper arms down the sides, forearms forward onto the lap (hands meet the bag / bring a cherry up)
  const reach = clamp(o.reach ?? 0), lift = clamp(o.lift ?? 0);
  const arm = (side, k) => {
    const sx = side * hw * .82, sy = sh + 6, ex = side * hw * .98, ey = sh + 30, hxx = mix(side * 6, side * (o.bagSide === side ? 22 : 10), k), hyy = mix(-2, -8, k);
    const hx2 = mix(hxx, side * 4, lift * (side === (o.liftSide ?? 1) ? 1 : 0)), hy2 = mix(hyy, sh - 6, lift * (side === (o.liftSide ?? 1) ? 1 : 0));
    capsuleFill(ctx, sx, sy, 7 * B, ex, ey, 5.4, D.coat);
    capsuleFill(ctx, ex, ey, 5.2, hx2, hy2, 4.2, D.coat);
    ctx.fillStyle = D.skin; ctx.beginPath(); ctx.ellipse(hx2, hy2 + 2.6, 3.6, 4.2, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(rim, .75 * ra); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(sx + side * 6.4, sy + 2); ctx.quadraticCurveTo(ex + side * 5.6, ey - 12, ex + side * 5, ey); ctx.stroke();
    return [hx2, hy2];
  };
  const hL = arm(-1, reach * (o.bagSide === -1 ? 1 : 0)), hR = arm(1, reach * (o.bagSide === 1 ? 1 : 0));
  // neck + head (front, hair), the face in shadow with a faint warm edge
  ctx.fillStyle = D.skin; ctx.beginPath(); ctx.ellipse(0, sh - 6, 4.6, 5, 0, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(turn * 2, sh - 20); ctx.rotate(turn * .1 + Lf.nod * .04);
  ctx.fillStyle = D.skin; ctx.beginPath(); ctx.ellipse(0, 0, 9.6, 11.6, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = D.hair; ctx.beginPath();
  if (fem) { ctx.moveTo(-10.6, 6); ctx.bezierCurveTo(-12.6, -6, -10, -13.6, 0, -13.4); ctx.bezierCurveTo(10, -13.6, 12.6, -6, 10.6, 6); ctx.bezierCurveTo(11.6, 12, 10.6, 18, 8.6, 21); ctx.lineTo(6.4, 8); ctx.quadraticCurveTo(5, -4, -1 - turn * 3, -6); ctx.quadraticCurveTo(-6, -4, -6.4, 8); ctx.lineTo(-8.6, 21); ctx.bezierCurveTo(-10.6, 18, -11.6, 12, -10.6, 6); }
  else { ctx.moveTo(-9.8, 1); ctx.bezierCurveTo(-11, -9, -7, -13.8, 0, -13.6); ctx.bezierCurveTo(7, -13.8, 11, -9, 9.8, 1); ctx.quadraticCurveTo(9, -5, 3 - turn * 2, -7.6); ctx.quadraticCurveTo(-4, -8, -9.8, 1); }
  ctx.closePath(); ctx.fill();
  // lit hair edge + ear rims toward the sun
  ctx.strokeStyle = rgba(rim, .85 * ra); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(0, -.5, 12.6, -Math.PI / 2 + Math.atan2(lx, -ly) - .9, -Math.PI / 2 + Math.atan2(lx, -ly) + .9); ctx.stroke();
  ctx.strokeStyle = rgba(rim, .35 * ra); ctx.lineWidth = .7; ctx.beginPath(); for (let k = -3; k <= 3; k++) { ctx.moveTo(k * 2.4, -12.6); ctx.quadraticCurveTo(k * 3.4, -9, k * 3.8 + turn, -4); } ctx.stroke();
  ctx.fillStyle = rgba(rim, .5 * ra); for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 9.8, 1.4, 1.4, 3.2, 0, 0, TAU); ctx.fill(); }
  // the face only as a darker oval with a faint warm cheek edge (back-lit: no features read at this light)
  ctx.fillStyle = 'rgba(8,6,12,.28)'; ctx.beginPath(); ctx.ellipse(turn * 2.4, 2.6, 6.4, 7.6, 0, 0, TAU); ctx.fill();
  ctx.restore();
  ctx.restore();
  ctx.restore();
  const toScr = (p) => [x + p[0] * s, y + p[1] * s];
  return { hands: [toScr(hL), toScr(hR)], head: toScr([0, sh - 20]) };
}
function capsuleFill(g, x1, y1, r1, x2, y2, r2, col) { g.fillStyle = col; const o0 = OV; OV = null; capsuleF(g, x1, y1, r1, x2, y2, r2); OV = o0; }
