// Drawing primitives for section 09 ("How we get there"): chalk board, robot arm, jars, maps, hands, protein ribbons.
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, prng, canvas, addGlow, text } from '../engine.mjs';
import { P, shade, mixHex } from './world.mjs';

const cache = new Map();
export const once = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };

export function bg(ctx, stops) { const g = ctx.createLinearGradient(0, 0, 0, H); stops.forEach(([o, c]) => g.addColorStop(o, c)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
// camera: look at world point (x, y) with zoom z
export function look(ctx, x, y, z = 1) { ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-x, -y); }
// floating dust motes in a light
export function motes(ctx, t, { seed = 1, n = 60, hex = C.cream, a = .25, x0 = 0, x1 = W, y0 = 0, y1 = H, speed = 10 } = {}) {
  const r = prng(seed), w = x1 - x0, h = y1 - y0;
  for (let i = 0; i < n; i++) {
    const x = x0 + (((r() * w + t * speed * (r() - .3)) % w) + w) % w, y = y0 + (((r() * h - t * speed * .5 * (.3 + r())) % h) + h) % h;
    const s = 1 + r() * 2.2, tw = .5 + .5 * Math.sin(t * (1 + r() * 2) + i);
    ctx.fillStyle = rgba(hex, a * tw); ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
  }
}
// soft radial light pool (normal blending)
export function pool(ctx, x, y, rx, ry, hex, a) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, rgba(hex, a)); g.addColorStop(1, rgba(hex, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, 7); ctx.fill(); ctx.restore();
}
// a light beam (trapezoid) from a window/lamp, additive
export function beam(ctx, x0, y0, w0, x1, y1, w1, hex, a) {
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, rgba(hex, a)); g.addColorStop(1, rgba(hex, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0 - w0 / 2, y0); ctx.lineTo(x0 + w0 / 2, y0); ctx.lineTo(x1 + w1 / 2, y1); ctx.lineTo(x1 - w1 / 2, y1); ctx.fill(); ctx.restore();
}

// ---------- chalk ----------
// wobbly chalk circle, drawn up to fraction u (returns the pen point)
export function chalkCircle(ctx, cx, cy, r, u, { seed = 1, hex = C.cream, a = .9, w = 5 } = {}) {
  if (u <= 0) return null;
  const rr = prng(seed), wob = [rr() * 6, rr() * 6, rr() * 6], n = 90, start = -1.9 + rr() * .4, end = start + 6.283 * 1.04;
  let pen = null;
  for (let pass = 0; pass < 3; pass++) {
    ctx.save(); ctx.strokeStyle = rgba(hex, a * [.9, .35, .25][pass]); ctx.lineWidth = w * [1, .6, 1.6][pass]; ctx.lineCap = 'round';
    ctx.setLineDash(pass === 2 ? [2, 7] : pass === 1 ? [14, 5] : []);
    ctx.beginPath();
    for (let i = 0; i <= n * u; i++) {
      const q = mix(start, end, i / n), R = r * (1 + .025 * Math.sin(q * 3 + wob[0]) + .015 * Math.sin(q * 5 + wob[1])) + pass * 1.5;
      const x = cx + Math.cos(q) * R, y = cy + Math.sin(q) * R; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); pen = [x, y];
    }
    ctx.stroke(); ctx.restore();
  }
  return pen;
}
// chalk polyline (array of points) up to fraction u
export function chalkLine(ctx, pts, u = 1, { hex = C.cream, a = .85, w = 4 } = {}) {
  if (u <= 0) return; const n = Math.max(2, Math.ceil(pts.length * u));
  for (let pass = 0; pass < 2; pass++) {
    ctx.save(); ctx.strokeStyle = rgba(hex, a * (pass ? .3 : .9)); ctx.lineWidth = w * (pass ? 1.8 : 1); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (pass) ctx.setLineDash([3, 6]);
    ctx.beginPath(); for (let i = 0; i < n; i++) i ? ctx.lineTo(pts[i][0] + pass, pts[i][1] + pass) : ctx.moveTo(pts[i][0], pts[i][1]); ctx.stroke(); ctx.restore();
  }
}
// small chalk piece at the pen point
export function chalkStick(ctx, x, y, a = 1) {
  if (!x) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(-.7);
  ctx.fillStyle = '#efe9d8'; ctx.fillRect(-6, -2, 12, 44); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(2, -2, 4, 44); ctx.restore();
  addGlow(ctx, x, y, 22, .25, C.cream, '#ffffff');
}

// ---------- the three-field board ----------
export const BOARD = { x0: 220, x1: 1700, y0: 180, y1: 880 };
export const CIRC = [{ x: 466.7, y: 520 }, { x: 960, y: 520 }, { x: 1453.3, y: 520 }], CR = 165;
// wall + board (frame morph u: 0 = window frame at centre, 1 = board)
export function boardRoom(ctx, t, { morph = 1, glass = 0 } = {}) {
  bg(ctx, [[0, '#0d1030'], [1, '#191a3e']]);
  // lamp above, warm pool on board
  pool(ctx, 960, 300, 1100, 620, '#ffcf91', .10);
  const wx0 = 540, wx1 = 1380, wy0 = 60, wy1 = 1020;
  const x0 = mix(wx0, BOARD.x0, eio(morph)), x1 = mix(wx1, BOARD.x1, eio(morph)), y0 = mix(wy0, BOARD.y0, eio(morph)), y1 = mix(wy1, BOARD.y1, eio(morph));
  // slate
  const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#1d2a3a'); g.addColorStop(1, '#141d2b');
  ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  // old chalk smudges
  const r = prng(44); ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
  for (let i = 0; i < 26; i++) pool(ctx, mix(x0, x1, r()), mix(y0, y1, r()), 120 + r() * 220, 40 + r() * 60, '#c9d3dc', .05 * morph);
  // warm glass of the window it grew out of
  if (glass > 0) { const wg = ctx.createLinearGradient(0, y0, 0, y1); wg.addColorStop(0, rgba('#ffcf8a', glass)); wg.addColorStop(1, rgba('#e98a52', glass)); ctx.fillStyle = wg; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); }
  ctx.restore();
  // frame
  ctx.strokeStyle = '#3a2a1e'; ctx.lineWidth = 22; ctx.strokeRect(x0 - 11, y0 - 11, x1 - x0 + 22, y1 - y0 + 22);
  ctx.strokeStyle = 'rgba(255,207,145,.18)'; ctx.lineWidth = 2; ctx.strokeRect(x0 - 22, y0 - 22, x1 - x0 + 44, y1 - y0 + 44);
  // dividers: the window's vertical bar splits into two, the horizontal bar fades
  const dA = mix(960, x0 + (x1 - x0) / 3, eio(morph)), dB = mix(960, x0 + (x1 - x0) * 2 / 3, eio(morph));
  ctx.fillStyle = morph < 1 ? '#3a2a1e' : rgba(C.cream, .5);
  const dw = mix(18, 3, eio(morph));
  ctx.fillRect(dA - dw / 2, y0, dw, y1 - y0); ctx.fillRect(dB - dw / 2, y0, dw, y1 - y0);
  if (morph < 1) { ctx.globalAlpha = 1 - sm(morph); ctx.fillRect(x0, (y0 + y1) / 2 - 9, x1 - x0, 18); ctx.globalAlpha = 1; }
  // chalk tray
  ctx.fillStyle = '#2e2218'; ctx.fillRect(x0 - 20, y1 + 10, x1 - x0 + 40, 16);
  ctx.fillStyle = '#efe9d8'; ctx.fillRect(x0 + 120, y1 + 4, 40, 8); ctx.fillRect(x1 - 300, y1 + 4, 26, 8);
}
// chalk icons (centred at cx, cy, size s), u = draw fraction
export function chalkIcon(ctx, kind, cx, cy, s, u, t = 0) {
  if (u <= 0) return; ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
  const L = (pts) => chalkLine(ctx, pts, u, { w: 4 / s });
  if (kind === 'flask') { L([[-20, -60], [-20, -15], [-55, 50], [55, 50], [20, -15], [20, -60]]); L([[-30, -60], [30, -60]]); L([[-40, 25], [40, 25]]); }
  if (kind === 'scale') { L([[0, -60], [0, 50]]); L([[-50, 50], [50, 50]]); L([[-70, -40], [70, -40]]); L([[-70, -40], [-90, 0], [-50, 0], [-70, -40]]); L([[70, -40], [50, 0], [90, 0], [70, -40]]); }
  if (kind === 'door') { L([[-35, 60], [-35, -60], [35, -60], [35, 60]]); L([[-35, -60], [-5, -48], [-5, 70], [-35, 60]]); }
  ctx.restore();
}

// ---------- robot arm (two-link IK) ----------
export function ik(bx, by, px, py, l1, l2, up = 1) {
  let dx = px - bx, dy = py - by, d = Math.hypot(dx, dy); d = clamp(d, 20, l1 + l2 - 1);
  const base = Math.atan2(dy, dx), a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const a1 = base - up * a, ex = bx + Math.cos(a1) * l1, ey = by + Math.sin(a1) * l1;
  return { ex, ey, a1, a2: Math.atan2(py - ey, px - ex), tx: ex + Math.cos(Math.atan2(py - ey, px - ex)) * l2, ty: ey + Math.sin(Math.atan2(py - ey, px - ex)) * l2 };
}
export function robotArm(ctx, bx, by, px, py, { l1 = 330, l2 = 300, w = 46, col = '#1c2260', rim = P.cyanSoft, grip = 0, up = 1, light = 1 } = {}) {
  const k = ik(bx, by, px, py, l1, l2, up);
  // base
  ctx.fillStyle = shade(col, -.04); ctx.beginPath(); ctx.roundRect(bx - 90, by - 10, 180, 70, 14); ctx.fill();
  const seg = (x0, y0, x1, y1, ww) => {
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = ww; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.strokeStyle = rgba(rim, .35 * light); ctx.lineWidth = 3; const nx = -(y1 - y0), ny = x1 - x0, nl = Math.hypot(nx, ny) || 1;
    ctx.beginPath(); ctx.moveTo(x0 + nx / nl * ww * .42, y0 + ny / nl * ww * .42); ctx.lineTo(x1 + nx / nl * ww * .42, y1 + ny / nl * ww * .42); ctx.stroke(); ctx.restore();
  };
  seg(bx, by, k.ex, k.ey, w); seg(k.ex, k.ey, k.tx, k.ty, w * .78);
  for (const [x, y, r] of [[bx, by, w * .7], [k.ex, k.ey, w * .6]]) { ctx.fillStyle = shade(col, .06); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.fillStyle = rgba(rim, .8 * light); ctx.beginPath(); ctx.arc(x, y, r * .28, 0, 7); ctx.fill(); }
  addGlow(ctx, k.ex, k.ey, 30, .4 * light, P.cyan, '#e8fbff');
  // gripper (two fingers, pointing down)
  const g = 16 + 14 * (1 - grip);
  ctx.fillStyle = shade(col, .03); ctx.fillRect(k.tx - 30, k.ty - 8, 60, 22);
  ctx.fillRect(k.tx - g - 7, k.ty + 10, 9, 38); ctx.fillRect(k.tx + g - 2, k.ty + 10, 9, 38);
  return k;
}
// crucible (small ceramic cup), heat 0..1
export function crucible(ctx, x, y, heat = 0, s = 1, fill = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const col = mixHex('#c9c2b4', '#ff8a3d', heat);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-24, -28); ctx.lineTo(24, -28); ctx.lineTo(18, 10); ctx.lineTo(-18, 10); ctx.fill();
  ctx.fillStyle = shade(col, -.15); ctx.beginPath(); ctx.ellipse(0, -28, 24, 6, 0, 0, 7); ctx.fill();
  if (fill > 0) { ctx.fillStyle = mixHex('#8fe6ff', '#ffe0a0', heat); ctx.beginPath(); ctx.ellipse(0, -27, 20 * fill, 4.5 * fill, 0, 0, 7); ctx.fill(); }
  ctx.restore();
  if (heat > .05) addGlow(ctx, x, y - 10 * s, 70 * s * heat + 20, .7 * heat, '#ff7a2e', '#fff0c8');
}
// glass jar with a crystal inside
export function jar(ctx, x, y, s, hex, glowA = .5, seed = 1) {
  const r = prng(seed);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(200,230,255,.08)'; ctx.strokeStyle = 'rgba(216,247,255,.45)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(-26, -70, 52, 70, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#2a2f62'; ctx.fillRect(-22, -80, 44, 12);
  // crystal: a faceted polygon
  ctx.fillStyle = hex; ctx.beginPath(); const n = 5 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) { const q = i / n * 6.283 + r() * .3, R = 13 + r() * 9; const px = Math.cos(q) * R, py = -26 + Math.sin(q) * R * 1.2; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(-4, -40); ctx.lineTo(6, -30); ctx.lineTo(-2, -20); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(-20, -64, 5, 54);
  ctx.restore();
  addGlow(ctx, x, y - 26 * s, 60 * s, glowA, hex, '#ffffff');
}

// ---------- idea card (amber, little bulb) ----------
export function ideaCard(ctx, x, y, s = 1, rot = 0, a = 1, glowA = .4) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const g = ctx.createLinearGradient(0, -24, 0, 24); g.addColorStop(0, '#ffd08a'); g.addColorStop(1, '#f39a3e');
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-36, -24, 72, 48, 6); ctx.fill();
  ctx.fillStyle = '#7a3b17'; ctx.beginPath(); ctx.arc(0, -4, 10, 0, 7); ctx.fill(); ctx.fillRect(-5, 6, 10, 7);
  ctx.fillStyle = '#fff3dd'; ctx.beginPath(); ctx.arc(-3, -7, 3, 0, 7); ctx.fill();
  ctx.restore();
  addGlow(ctx, x, y, 60 * s, glowA * a, P.amber, '#fff3dd');
}

// ---------- maps ----------
// simplified, stylised outlines (normalised 0..1)
export const GB = [[.45, 0], [.58, .02], [.62, .08], [.55, .15], [.62, .2], [.66, .28], [.6, .33], [.64, .4], [.7, .48], [.74, .56], [.82, .66], [.95, .7], [.93, .76], [.86, .8], [.92, .86], [.8, .9], [.6, .9], [.45, .92], [.3, .97], [.2, .99], [.32, .9], [.45, .85], [.35, .82], [.3, .76], [.36, .7], [.32, .64], [.42, .62], [.44, .55], [.4, .46], [.36, .42], [.42, .38], [.3, .35], [.34, .28], [.28, .22], [.34, .15], [.3, .08], [.4, .04]];
export const NI = [[.1, .42], [.2, .38], [.24, .45], [.18, .5], [.08, .48]];
export const WORLD = [
  [[.05, .18], [.15, .12], [.28, .1], [.35, .15], [.3, .25], [.27, .32], [.24, .4], [.2, .45], [.22, .5], [.17, .47], [.12, .38], [.08, .3], [.04, .25]],
  [[.33, .06], [.4, .05], [.42, .12], [.36, .18]],
  [[.25, .52], [.32, .55], [.37, .62], [.34, .72], [.3, .82], [.28, .88], [.26, .8], [.24, .65], [.22, .57]],
  [[.46, .18], [.53, .14], [.58, .18], [.56, .26], [.52, .3], [.47, .3], [.45, .25]],
  [[.45, .34], [.53, .32], [.6, .38], [.64, .46], [.6, .55], [.57, .66], [.53, .72], [.5, .62], [.47, .5], [.43, .44]],
  [[.56, .14], [.7, .08], [.85, .1], [.95, .16], [.9, .25], [.85, .32], [.8, .4], [.75, .45], [.7, .42], [.66, .38], [.6, .34], [.57, .26]],
  [[.66, .38], [.71, .4], [.69, .5], [.66, .45]],
  [[.8, .65], [.88, .62], [.93, .67], [.9, .76], [.82, .75], [.79, .7]],
];
export function smoothPath(ctx, pts, ox, oy, w, h) {
  const p = pts.map(([x, y]) => [ox + x * w, oy + y * h]), n = p.length;
  ctx.moveTo((p[n - 1][0] + p[0][0]) / 2, (p[n - 1][1] + p[0][1]) / 2);
  for (let i = 0; i < n; i++) { const a = p[i], b = p[(i + 1) % n]; ctx.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
  ctx.closePath();
}
// dot-matrix land (pre-rendered mask → list of dots)
export function landDots(shapes, w, h, step) {
  return once('dots' + w + 'x' + h + step + shapes.length, () => {
    const [c, x] = canvas(w, h); x.fillStyle = '#fff'; for (const s of shapes) { x.beginPath(); smoothPath(x, s, 0, 0, w, h); x.fill(); }
    const d = x.getImageData(0, 0, w, h).data, out = [];
    for (let y = step / 2; y < h; y += step) for (let xx = step / 2; xx < w; xx += step) if (d[(Math.floor(y) * w + Math.floor(xx)) * 4 + 3] > 128) out.push([xx, y]);
    return out;
  });
}

// ---------- hands & sleeves ----------
// an arm reaching from (sx, sy) to the hand at (hx, hy); sleeve colour, cuff colour; grip 0..1 curls fingers
export function reach(ctx, sx, sy, hx, hy, { sleeve = '#1b2050', cuff = '#e8e4d8', skin = '#c98f6a', w = 70, grip = 1, rimHex = P.amber, rimA = .25 } = {}) {
  const ang = Math.atan2(hy - sy, hx - sx), len = Math.hypot(hx - sx, hy - sy);
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(ang);
  ctx.fillStyle = sleeve; ctx.beginPath(); ctx.moveTo(0, -w / 2); ctx.lineTo(len - 70, -w * .42); ctx.lineTo(len - 70, w * .42); ctx.lineTo(0, w / 2); ctx.fill();
  ctx.fillStyle = rgba(rimHex, rimA); ctx.fillRect(0, -w / 2, len - 70, 4);
  ctx.fillStyle = cuff; ctx.fillRect(len - 78, -w * .4, 12, w * .8);
  // hand: palm + curled fingers
  ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(len - 40, 0, 34, w * .34, 0, 0, 7); ctx.fill();
  ctx.fillStyle = shade(skin, -.08);
  for (let i = 0; i < 4; i++) { const fy = -w * .26 + i * w * .17; ctx.beginPath(); ctx.ellipse(len - 8 + (1 - grip) * 18, fy, 15 - grip * 4, 8, 0, 0, 7); ctx.fill(); }
  ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(len - 30, -w * .36, 20, 9, -.6, 0, 7); ctx.fill();
  ctx.restore();
}

// ---------- protein ribbon (folded helix-like curve) ----------
export function protein(ctx, x, y, s, t, { seed = 1, hex = P.cyanSoft, a = 1, wings = 0 } = {}) {
  const r = prng(seed), k = [1 + r() * 2, 2 + r() * 2, r() * 6, r() * 6];
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const pts = [];
  for (let i = 0; i <= 80; i++) {
    const u = i / 80, q = u * 6.283 * 1.5;
    let px = Math.sin(q * k[0] + k[2] + t * .4) * 40 + (u - .5) * 60, py = Math.cos(q * k[1] + k[3] + t * .3) * 30 + Math.sin(u * 20) * 8;
    if (wings) py += Math.sin(t * 9 + u * 6) * 22 * wings * Math.abs(u - .5) * 2;
    pts.push([px, py]);
  }
  for (const [ww, al, c] of [[14, .18, hex], [7, .9, hex], [2, .9, '#ffffff']]) {
    ctx.strokeStyle = rgba(c, al); ctx.lineWidth = ww; ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.stroke();
  }
  ctx.restore();
  addGlow(ctx, x, y, 70 * s, .35 * a, hex, '#ffffff');
}

// ---------- line icons on a disc (disease symbols etc.) ----------
export function iconDisc(ctx, kind, x, y, R, lit, t) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = mixHex('#111433', '#2a2f6a', lit); ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill();
  ctx.strokeStyle = rgba(mixHex('#3b3f74', '#ffd29a', lit), .9); ctx.lineWidth = 3; ctx.stroke();
  const col = mixHex('#40446f', '#ffe6c2', lit); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const s = R / 100; ctx.scale(s, s);
  if (kind === 'heart') { const b = 1 + .06 * Math.sin(t * 5) * lit; ctx.scale(b, b); ctx.beginPath(); ctx.moveTo(0, 40); ctx.bezierCurveTo(-60, 0, -50, -50, 0, -22); ctx.bezierCurveTo(50, -50, 60, 0, 0, 40); ctx.stroke(); }
  if (kind === 'kidney') { ctx.beginPath(); ctx.moveTo(10, -45); ctx.bezierCurveTo(-60, -60, -60, 60, 10, 45); ctx.bezierCurveTo(30, 40, 20, 15, 5, 10); ctx.bezierCurveTo(-5, 5, -5, -5, 5, -10); ctx.bezierCurveTo(20, -15, 30, -40, 10, -45); ctx.stroke(); }
  if (kind === 'mosquito') {
    const f = Math.sin(t * 30) * .3;
    ctx.beginPath(); ctx.ellipse(0, 10, 9, 30, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -28, 9, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -36); ctx.lineTo(0, -62); ctx.stroke();
    ctx.lineWidth = 3; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 30, -6, 30, 11, sx * (-.4 + f), 0, 7); ctx.stroke(); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(sx * 6, i * 10); ctx.lineTo(sx * 40, i * 18 + 20); ctx.lineTo(sx * 46, i * 22 + 44); ctx.stroke(); } }
  }
  ctx.restore();
  if (lit > 0) addGlow(ctx, x, y, R * 1.8, .35 * lit, P.amber, '#fff3dd');
}
