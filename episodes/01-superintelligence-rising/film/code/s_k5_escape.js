// "They got out, and reached real systems, including Hugging Face, a platform where AI developers share their work."
// Wide night view. Left: the test hall cut open, the glass box inside. A seam at its corner glows and cyan tendrils
// slip out, race along the cables across the ground and light up the windows of real buildings. The camera follows
// them to a warm, open building where small figures put glowing parcels on shelves and take them down: Hugging Face.
// Exports world() for s_k5_spotted.js.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, label, out, ease } = L;
const { grainFill, roundRect, cap, curve, glowStroke, cached, tag } = require('./s_k5_race');
const { figure } = require('./s_timeline');

const T0 = 297.4, T1 = 305.1;

const GY = 640;
const BX = { x: 250, y: 800, w: 330, h: 200, dx: 120, dy: -70 };
const P = (x, y, z) => [BX.x + x * BX.w + z * BX.dx, BX.y - y * BX.h + z * BX.dy];
const poly = (c, pts) => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); };
// buildings that get reached: [x, baseY, w, h, reachTime]
const BLD = [[1080, 760, 170, 330, 298.95], [1390, 740, 140, 250, 299.25], [1650, 752, 190, 380, 299.6], [1960, 735, 130, 220, 299.9]];
const HF = { x: 2300, y: 790, w: 640, h: 380, reach: 301.05 };
// cable routes from the hall wall to each target
const SEAM = [700, 790];
const route = (tx, ty, lane) => [SEAM, [860, 840 + lane * 14], [tx - 60, 840 + lane * 14], [tx, ty]];
const ROUTES = [...BLD.map((b, i) => ({ pts: route(b[0] + b[2] / 2, b[1], i), t0: b[4] - 0.75 })), { pts: route(HF.x + 60, HF.y, 4), t0: HF.reach - 1.4 }];

function plen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
function at(pts, d) { for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (d <= l) { const k = d / l; return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k), Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])]; } d -= l; } const e = pts[pts.length - 1]; return [e[0], e[1], 0]; }
// a tendril: a glowing worm travelling along the cable with a wiggling tail; u = head fraction
function tendril(ctx, pts, u, t, seed, a = 1, freeze = 0) {
  const Ltot = plen(pts), head = clamp(u) * Ltot, tail = Math.min(head, 260);
  if (head <= 0) return null;
  const path = c => { for (let k = 0; k <= 30; k++) { const d = head - tail * (1 - k / 30), p = at(pts, d), w = Math.sin(d * 0.05 - t * 12 * (1 - freeze) + seed) * 7 * (k / 30) * (1 - freeze * 0.7);
    const x = p[0] - Math.sin(p[2]) * w, y = p[1] + Math.cos(p[2]) * w; k ? c.lineTo(x, y) : c.moveTo(x, y); } };
  glowStroke(ctx, path, C.cyan, 3, 0.8 * a);
  glowStroke(ctx, path, C.cyanW, 1.2, 0.9 * a);
  const hp = at(pts, head); light(ctx, hp[0], hp[1], 40, C.cyanW, 0.8 * a);
  // a faint charged trail along the whole cable behind it
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.cyan, 0.16 * a); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let d = 0; d < head; d += 20) { const p = at(pts, d); ctx.lineTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
  return hp;
}

const R = rng(297);
const STARS = Array.from({ length: 160 }, () => [R() * 3400 - 200, R() * 420, R()]);
const PARCELS = Array.from({ length: 34 }, (_, i) => ({ fl: i % 2, x: 30 + (i >> 1) * 34 + R() * 6, h: 18 + R() * 10, c: R() }));

function landArt(c) {
  c.fillStyle = lin(c, 0, -100, 0, GY, [[0, '#05061a'], [0.7, '#12143a'], [1, '#262150']]); c.fillRect(-300, -300, 3800, GY + 300);
  // far hills
  grainFill(c, cc => { curve(cc, [[-300, GY - 40], [300, GY - 90], [900, GY - 50], [1500, GY - 100], [2200, GY - 60], [2900, GY - 110], [3500, GY - 50]]); cc.lineTo(3500, GY + 20); cc.lineTo(-300, GY + 20); cc.closePath(); }, lin(c, 0, GY - 110, 0, GY, [[0, '#1d1d4c'], [1, '#141438']]), 0.5);
  // ground
  grainFill(c, cc => cc.rect(-300, GY, 3800, 800), lin(c, 0, GY, 0, H, [[0, '#1a1a44'], [1, '#08081a']]), 0.55);
  // the test hall, cut open: back wall, floor, roof edge
  grainFill(c, cc => cc.rect(60, 420, 720, 420), lin(c, 0, 420, 0, 840, [[0, '#0f1132'], [1, '#191a44']]), 0.5);
  grainFill(c, cc => { cc.moveTo(40, 420); cc.lineTo(800, 420); cc.lineTo(780, 395); cc.lineTo(60, 395); cc.closePath(); }, '#0a0b22', 0.4);
  c.fillStyle = '#0a0b22'; c.fillRect(40, 420, 22, 440); c.fillRect(778, 420, 22, 440);
  grainFill(c, cc => cc.rect(40, 840, 760, 30), '#14143a', 0.4);
  // other buildings ("real systems")
  for (const [x, by, w, h] of BLD) {
    grainFill(c, cc => cc.rect(x, by - h, w, h + 40), lin(c, x, 0, x + w, 0, [[0, '#1e2052'], [1, '#111236']]), 0.5);
    c.fillStyle = '#0b0c26'; c.fillRect(x - 6, by - h - 8, w + 12, 10);
    for (let wy = by - h + 18; wy < by - 20; wy += 26) for (let wx = x + 14; wx < x + w - 20; wx += 24) { c.fillStyle = 'rgba(40,50,110,0.6)'; c.fillRect(wx, wy, 12, 14); }
  }
  // cable trench lines on the ground
  for (const r of ROUTES) { c.strokeStyle = '#0a0a20'; c.lineWidth = 6; c.lineJoin = 'round'; c.beginPath(); c.moveTo(r.pts[0][0], r.pts[0][1]); for (const p of r.pts) c.lineTo(p[0], p[1]); c.stroke();
    c.strokeStyle = 'rgba(90,100,180,0.25)'; c.lineWidth = 1.5; c.stroke(); }
}

function hfArt(c) {
  const { x, y, w, h } = HF;
  // warm open building: two floors, the front cut away, shelves inside
  grainFill(c, cc => { cc.moveTo(x - 20, y - h); cc.lineTo(x + w / 2, y - h - 90); cc.lineTo(x + w + 20, y - h); cc.closePath(); }, lin(c, 0, y - h - 90, 0, y - h, [[0, '#3a2a5a'], [1, '#1c1640']]), 0.5);
  grainFill(c, cc => cc.rect(x, y - h, w, h + 30), lin(c, x, y - h, x + w, y, [[0, '#ffcf98'], [0.5, '#e08a42'], [1, '#9a4c1c']]), 0.45);
  grainFill(c, cc => cc.rect(x + 16, y - h + 16, w - 32, h - 32), lin(c, 0, y - h, 0, y, [[0, '#5a2e1a'], [1, '#2e160c']]), 0.5);
  c.fillStyle = '#c9702e'; c.fillRect(x + 16, y - h / 2 - 8, w - 32, 14);
  for (let fl = 0; fl < 2; fl++) { const fy = y - h + 16 + fl * (h / 2 - 8);
    // shelves along the back wall
    for (let r = 0; r < 3; r++) { c.fillStyle = '#7a3b17'; c.fillRect(x + 30, fy + 40 + r * 44, w - 60, 5); }
  }
  c.fillStyle = '#1a0d06'; c.fillRect(x - 6, y - h - 4, 22, h + 34); c.fillRect(x + w - 16, y - h - 4, 22, h + 34);
}

function hfLive(ctx, t, glow) {
  const { x, y, w, h } = HF;
  // parcels on the shelves: other people's work, softly lit
  const rr = rng(77);
  for (let fl = 0; fl < 2; fl++) for (let r = 0; r < 3; r++) for (let k = 0; k < 12; k++) {
    const px = x + 40 + k * 46 + rr() * 8, py = y - h + 16 + fl * (h / 2 - 8) + 40 + r * 44, ph = 16 + rr() * 14, q = rr();
    if (q < 0.25) continue;
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + k + r * 3 + fl);
    ctx.fillStyle = q < 0.5 ? rgba('#ffd29a', 0.85) : q < 0.8 ? rgba('#f3efe2', 0.8) : rgba(C.cyan, 0.6 + 0.3 * pulse);
    ctx.fillRect(px, py - ph, 26, ph);
    if (glow > 0 && hash(k, r, fl) < 0.3) { ctx.fillStyle = rgba(C.cyanW, 0.6 * glow * pulse); ctx.fillRect(px, py - ph, 26, ph); }
  }
  light(ctx, x + w / 2, y - h / 2, 420, C.amber, 0.22);
  // people: one carries a parcel along the upper floor, one reaches to a shelf, one sits reading
  const sc = 0.36;
  const walkU = ((t * 0.09) % 1), wx = x + 70 + (w - 160) * (walkU < 0.5 ? walkU * 2 : 2 - walkU * 2), dir = walkU < 0.5 ? 1 : -1, ph = t * 2 * Math.PI * 1.2, sw = Math.sin(ph);
  const fy1 = y - h / 2 - 10, fy2 = y + 2;
  const res = figure(ctx, { x: wx, y: fy1 - 150 * sc, s: sc, facing: 'front', br: Math.sin(t * 2), turn: dir * 0.8, lx: 1, grain: 0.3, pal: ['#ffd29a', '#c9702e', '#5a2a12'],
    legs: [{ a1: Math.PI / 2 + sw * 0.3, a2: Math.PI / 2 + sw * 0.3 + Math.max(0, -sw) * 0.5 }, { a1: Math.PI / 2 - sw * 0.3, a2: Math.PI / 2 - sw * 0.3 + Math.max(0, sw) * 0.5 }],
    arms: [{ a1: Math.PI / 2 - 0.6, a2: -0.2 }, { a1: Math.PI / 2 + 0.6, a2: Math.PI + 0.2 }] });
  ctx.fillStyle = '#f3efe2'; ctx.fillRect(wx - 16, res.shoulders[0][1] + 18, 32, 22); light(ctx, wx, res.shoulders[0][1] + 28, 30, C.cyan, 0.4);
  const reach = 0.5 + 0.5 * Math.sin(t * 1.1);
  figure(ctx, { x: x + 470, y: fy2 - 150 * sc, s: sc, facing: 'back', br: Math.sin(t * 1.6 + 1), turn: 0.2, tilt: -0.2 * reach, lx: 1, grain: 0.3, pal: ['#ffc27c', '#b8622a', '#4a1e0c'],
    legs: [{ a1: Math.PI / 2 + 0.05, a2: Math.PI / 2 }, { a1: Math.PI / 2 - 0.05, a2: Math.PI / 2 }],
    arms: [{ a1: Math.PI / 2 + 0.1, a2: Math.PI / 2 }, { tx: x + 500, ty: lerp(fy2 - 120, fy2 - 170, reach), bend: 1 }] });
  figure(ctx, { x: x + 170, y: fy2 - 150 * sc, s: sc, facing: 'front', br: Math.sin(t * 1.3 + 2), turn: 0.5, tilt: 0.35, lx: 1, grain: 0.3, pal: ['#ffb35c', '#c9702e', '#5a2a12'],
    legs: [{ a1: Math.PI / 2 + 0.08, a2: Math.PI / 2 + 0.05 }, { a1: Math.PI / 2 - 0.08, a2: Math.PI / 2 - 0.02 }],
    arms: [{ tx: x + 190, ty: fy2 - 90, bend: -1 }, { tx: x + 214, ty: fy2 - 92, bend: 1 }] });
  ctx.fillStyle = '#f3efe2'; ctx.fillRect(x + 186, fy2 - 100, 34, 10);
}

// draws the whole world; o: { camX, z, fy, hfGlow, tend(ctx) }
function world(ctx, t, o) {
  const dx = drift(t, 1, 51) * 6, dy = drift(t, 1, 52) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(960, o.fy); ctx.scale(o.z, o.z); ctx.translate(-o.camX * (0.7 + 0.3 * par) + dx * par, -o.fy + dy * par); fn(); ctx.restore(); };
  layer(0.2, () => { for (const [x, y, k] of STARS) { const a = 0.15 + 0.3 * Math.sin(t * (1 + k) + k * 30); if (a > 0) { ctx.fillStyle = rgba(C.cream, a); ctx.fillRect(x, y, 2, 2); } } });
  layer(1, () => {
    cached(ctx, 'k5esc_land', -300, -100, 3300, H + 100, landArt, 1);
    // the box in the hall
    for (const pts of [[P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], [P(0, 0, 0), P(0, 0, 1), P(0, 1, 1), P(0, 1, 0)], [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)]]) { ctx.fillStyle = 'rgba(30,80,130,0.3)'; ctx.beginPath(); poly(ctx, pts); ctx.fill(); }
    for (const [x, z, i] of [[0.2, 0.3, 0], [0.5, 0.4, 1], [0.8, 0.6, 2]]) { const p = P(x, 0.45 + 0.04 * Math.sin(t * 1.3 + i), z); light(ctx, p[0], p[1], 60, C.cyan, 0.3); glowStroke(ctx, c => c.ellipse(p[0], p[1], 26, 11, 0, 0, 7), C.cyan, 2.5, 0.85); }
    glowStroke(ctx, c => { for (const [a, b] of [[P(0, 0, 0), P(1, 0, 0)], [P(0, 1, 0), P(1, 1, 0)], [P(0, 0, 0), P(0, 1, 0)], [P(1, 0, 0), P(1, 1, 0)], [P(1, 0, 0), P(1, 0, 1)], [P(1, 1, 0), P(1, 1, 1)], [P(1, 0, 1), P(1, 1, 1)], [P(0, 1, 0), P(0, 1, 1)], [P(0, 1, 1), P(1, 1, 1)]]) { c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); } }, C.cyan, 1.6, 0.35);
    light(ctx, P(0.5, 0.5, 0.5)[0], P(0.5, 0.5, 0.5)[1], 260, C.cyan, 0.16);
    // the seam at the box's corner, and the hole in the hall wall where the cables leave
    const seam = o.seam ?? 0;
    if (seam > 0) { const a = P(1, 0, 0.5), b = P(1, 0.6, 0.5); glowStroke(ctx, c => { c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); }, C.cyanW, 2, seam); light(ctx, a[0], a[1] - 40, 90, C.cyanW, 0.6 * seam); }
    // the reached buildings light their windows cyan
    for (const [x, by, w, h, tr] of BLD) {
      const on = ramp(t, tr, tr + 0.3) * (o.dim ?? 1);
      if (on <= 0) continue;
      ctx.save(); ctx.globalAlpha = on; ctx.fillStyle = rgba(C.cyan, 0.85);
      for (let wy = by - h + 18; wy < by - 20; wy += 26) for (let wx = x + 14; wx < x + w - 20; wx += 24) if (hash(wx, wy, Math.floor(t * 3)) > 0.25) ctx.fillRect(wx, wy, 12, 14);
      ctx.restore(); light(ctx, x + w / 2, by - h / 2, 260, C.cyan, 0.18 * on);
    }
    cached(ctx, 'k5esc_hf', HF.x - 40, HF.y - HF.h - 110, HF.x + HF.w + 40, HF.y + 40, hfArt, 1.3);
    hfLive(ctx, t, o.hfGlow ?? 0);
    if (o.tend) o.tend(ctx);
    if (o.over) o.over(ctx, layer);
  });
}

function draw(ctx, t) {
  const pan = ease((t - 299.7) / 1.5), push = sm((t - 301.2) / 3.9);
  const camX = lerp(900, 2050, pan) + push * 300, z = 1 + 0.06 * sm((t - T0) / (T1 - T0)) + 0.14 * push;
  world(ctx, t, { camX, z, fy: 600, seam: ramp(t, 297.6, 298.05), hfGlow: ramp(t, HF.reach, HF.reach + 0.4),
    tend: c => ROUTES.forEach((r, i) => tendril(c, r.pts, (t - r.t0) / (i === 4 ? 1.4 : 0.75), t, i)) });
  // name of the platform: plain text, no logo
  label(ctx, t, 301.0, T1 + 0.5, 'Hugging Face', 'where AI developers share their work', 1080, 130);
}

module.exports = { T0, T1, draw, world, tendril, ROUTES, HF };
