// Chunk k10 shared helpers (not a scene: T0/T1 lie before the film, so render.js never draws it).
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light } = L;
const TL = require('./s_timeline');

// grainFill with the speckle limited to the path's bounding box (cheap)
const BB = { b: null, p(x, y) { const b = this.b; if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; },
  moveTo(x, y) { this.p(x, y); }, lineTo(x, y) { this.p(x, y); }, quadraticCurveTo(a, b, x, y) { this.p(a, b); this.p(x, y); },
  bezierCurveTo(a, b, c, d, x, y) { this.p(a, b); this.p(c, d); this.p(x, y); }, rect(x, y, w, h) { this.p(x, y); this.p(x + w, y + h); },
  arc(x, y, r) { this.p(x - r, y - r); this.p(x + r, y + r); }, ellipse(x, y, rx, ry) { const r = Math.max(rx, ry); this.p(x - r, y - r); this.p(x + r, y + r); },
  arcTo(a, b, x, y) { this.p(a, b); this.p(x, y); }, closePath() {}, beginPath() {}, save() {}, restore() {}, translate() {}, rotate() {}, scale() {} };
const PAT = new WeakMap();
function pat(ctx) { let p = PAT.get(ctx); if (!p) { p = ctx.createPattern(L.tex().dark, 'repeat'); PAT.set(ctx, p); } return p; }
function gf(ctx, pathFn, fill, grain = 0.45) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    BB.b = [1e9, 1e9, -1e9, -1e9]; pathFn(BB); const b = BB.b;
    ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = pat(ctx);
    const m = ctx.getTransform().invertSelf(); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [px, py] of [[0, 0], [W, 0], [0, H], [W, H]]) { const x = m.a * px + m.c * py + m.e, y = m.b * px + m.d * py + m.f; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    x0 = Math.max(x0, b[0] - 2); y0 = Math.max(y0, b[1] - 2); x1 = Math.min(x1, b[2] + 2); y1 = Math.min(y1, b[3] + 2);
    if (x1 > x0 && y1 > y0) ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
  ctx.restore();
}
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn, S = 1) {
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}
function rr(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0); c.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  c.arc(x1, y1, r1, n, n - Math.PI, true); c.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0); c.arc(x0, y0, r0, n + Math.PI, n, true); c.closePath();
}
// camera: push z0->z1 over [a,b] around (cx,cy), drift; returns layer(par, fn)
function camera(ctx, t, a, b, o = {}) {
  const k = o.k ? o.k(t) : sm((t - a) / (b - a)), z = lerp(o.z0 ?? 1, o.z1 ?? 1.07, k);
  const dx = drift(t, 1, o.seed ?? 3) * (o.amp ?? 6), dy = drift(t, 1, (o.seed ?? 3) + 5) * (o.amp ?? 6) * 0.66;
  const cx = o.cx ? (typeof o.cx === 'function' ? o.cx(t) : o.cx) : W / 2, cy = o.cy ? (typeof o.cy === 'function' ? o.cy(t) : o.cy) : H / 2;
  return (par, fn) => { const zz = 1 + (z - 1) * (0.6 + 0.4 * par); ctx.save(); ctx.translate(cx, cy); ctx.scale(zz, zz); ctx.translate(-cx + dx * par, -cy + dy * par); fn(); ctx.restore(); };
}
function glowStroke(ctx, path, col, w, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const [mw, ma] of [[5, 0.10], [2.4, 0.28], [1, 1]]) { ctx.strokeStyle = rgba(col, Math.min(1, a * ma)); ctx.lineWidth = w * mw; ctx.beginPath(); path(ctx); ctx.stroke(); }
  ctx.restore();
}
// the AI ring (same look as s_rings.js): ellipse rx, ry, rotation rot, a = strength, think = inner ripples
function ring(ctx, t, x, y, rx, ry, rot = 0, a = 1, think = 1) {
  const p = 0.5 + 0.5 * Math.sin(t * 4.2);
  light(ctx, x, y, Math.max(rx, ry) * 2.6, C.cyan, (0.16 + 0.08 * p) * a);
  glowStroke(ctx, c => c.ellipse(x, y, rx, ry, rot, 0, 7), C.cyan, (Math.max(rx, ry) / 30) * (1 + 0.15 * p), (0.7 + 0.2 * p) * a);
  glowStroke(ctx, c => c.ellipse(x, y, rx * 0.96, ry * 0.96, rot, 0, 7), C.cyanW, Math.max(1, Math.max(rx, ry) / 90), (0.6 + 0.3 * p) * a);
  for (let k = 0; k < 3; k++) { const ph = (t * 0.6 + k / 3) % 1;
    glowStroke(ctx, c => c.ellipse(x, y, rx * (0.25 + 0.7 * ph), ry * (0.25 + 0.7 * ph), rot, 0, 7), C.cyan, Math.max(0.8, Math.max(rx, ry) / 140), 0.4 * think * a * Math.sin(ph * Math.PI)); }
  for (let i = 0; i < 10; i++) { const an = t * (1.2 + i * 0.09) + i * 0.63, ex = Math.cos(an) * rx, ey = Math.sin(an) * ry;
    light(ctx, x + ex * Math.cos(rot) - ey * Math.sin(rot), y + ex * Math.sin(rot) + ey * Math.cos(rot), Math.max(4, Math.max(rx, ry) / 14), C.cyanW, 0.55 * a * (0.5 + 0.5 * Math.sin(t * 5 + i))); }
}
// the question lantern (same look as s_k6_key.js)
function lantern(ctx, x, y, r, t, a, seed, glyph = '?') {
  if (a <= 0) return;
  const sw = Math.sin(t * 0.9 + seed) * 0.05;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(sw);
  light(ctx, 0, 0, r * 4.2, C.amber, 0.35 * a);
  const body = c => { c.moveTo(-r * 0.62, -r * 1.05); c.bezierCurveTo(-r * 1.15, -r * 0.7, -r * 1.15, r * 0.7, -r * 0.62, r * 1.05); c.lineTo(r * 0.62, r * 1.05); c.bezierCurveTo(r * 1.15, r * 0.7, r * 1.15, -r * 0.7, r * 0.62, -r * 1.05); c.closePath(); };
  gf(ctx, body, rad(ctx, -r * 0.2, -r * 0.1, r * 0.1, r * 1.3, [[0, '#fff1d0'], [0.45, '#ffc070'], [1, '#c9702e']]), 0.32);
  ctx.strokeStyle = 'rgba(122,59,23,0.35)'; ctx.lineWidth = Math.max(1, r * 0.03);
  for (const k of [-0.55, 0, 0.55]) { ctx.beginPath(); ctx.moveTo(k * r * 0.95, -r * 1.02); ctx.quadraticCurveTo(k * r * 1.6, 0, k * r * 0.95, r * 1.02); ctx.stroke(); }
  ctx.fillStyle = '#5a2a12'; ctx.fillRect(-r * 0.66, -r * 1.12, r * 1.32, r * 0.12); ctx.fillRect(-r * 0.66, r * 1.0, r * 1.32, r * 0.12);
  if (glyph) { ctx.fillStyle = 'rgba(122,59,23,0.55)'; ctx.font = `${Math.round(r * 1.1)}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(glyph, 0, r * 0.05); }
  light(ctx, 0, r * 1.15, r * 0.6, '#ffe2b0', 0.6 * a);
  ctx.restore();
}
// floating dust motes
const DUST = (() => { const r = rng(105), a = []; for (let i = 0; i < 60; i++) a.push([r(), r(), r() * 6.28, 0.5 + r()]); return a; })();
function dust(ctx, t, x, y, w, h, col = C.cream, a = 0.5) {
  for (const [u, v, ph, s] of DUST) {
    const px = x + ((u * w + t * 9 * s + Math.sin(t * 0.7 + ph) * 20) % w), py = y + ((v * h - t * 5 * s + h * 10) % h);
    ctx.fillStyle = rgba(col, a * (0.4 + 0.6 * Math.sin(t * 1.1 + ph * 3) ** 2)); ctx.beginPath(); ctx.arc(px, py, 1.4 * s, 0, 7); ctx.fill();
  }
}
// a progressively drawn checkmark
function check(ctx, x, y, s, k, col, w = 6) {
  if (k <= 0) return;
  const pts = [[-0.5, 0.05], [-0.15, 0.4], [0.6, -0.5]], seg1 = 0.4;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  ctx.moveTo(x + pts[0][0] * s, y + pts[0][1] * s);
  if (k < seg1) { const u = k / seg1; ctx.lineTo(x + lerp(pts[0][0], pts[1][0], u) * s, y + lerp(pts[0][1], pts[1][1], u) * s); }
  else { const u = Math.min(1, (k - seg1) / (1 - seg1)); ctx.lineTo(x + pts[1][0] * s, y + pts[1][1] * s); ctx.lineTo(x + lerp(pts[1][0], pts[2][0], u) * s, y + lerp(pts[1][1], pts[2][1], u) * s); }
  ctx.stroke(); ctx.restore();
}
// warm dawn sky with soft cloud streaks; sun at (sx, sy)
function dawnSky(ctx, t, y0, y1, sx, sy, o = {}) {
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, o.stops || [[0, '#231f52'], [0.35, '#4f3d7e'], [0.62, '#a9607e'], [0.82, '#f0956e'], [1, '#ffcf8e']]);
  ctx.fillRect(-400, y0 - 1200, W + 800, y1 - y0 + 2400);
  light(ctx, sx, sy, o.sunR ?? 900, '#ff9a5a', o.glow ?? 0.32);
  light(ctx, sx, sy, (o.sunR ?? 900) * 0.35, '#ffd9a0', (o.glow ?? 0.32) * 1.1);
  const r = rng(o.seed ?? 31);
  for (let i = 0; i < (o.clouds ?? 7); i++) {
    const w = 300 + r() * 500, cy = y0 + (y1 - y0) * (0.25 + r() * 0.55), x = ((r() * 2400 + t * (5 + r() * 6)) % 2600) - 340, h = 10 + r() * 16;
    const near = clamp(1 - Math.abs(x - sx) / 1400);
    ctx.save(); ctx.translate(x, cy);
    gf(ctx, c => { c.moveTo(-w / 2, 0); c.bezierCurveTo(-w * 0.3, -h, -w * 0.1, -h * 1.6, w * 0.1, -h); c.bezierCurveTo(w * 0.3, -h * 1.4, w * 0.42, -h * 0.4, w / 2, 0); c.closePath(); },
      lin(ctx, 0, -h * 1.6, 0, 0, [[0, rgba('#4a3a78', 0.5)], [1, rgba('#ffb08a', 0.25 + 0.4 * near)]]), 0.3);
    ctx.restore();
  }
}
// small serif caption / label helpers
function caption(ctx, t, t0, t1, text, x, y, o = {}) {
  const a = ramp(t, t0, t0 + 0.45) * (1 - ramp(t, t1 - 0.4, t1)); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a * (o.alpha ?? 1); ctx.shadowColor = 'rgba(4,4,16,0.7)'; ctx.shadowBlur = 14; ctx.textBaseline = o.base || 'top'; ctx.textAlign = o.align || 'left';
  ctx.fillStyle = o.color || C.cream; ctx.font = o.font || '24px "Inter Medium"'; ctx.letterSpacing = o.ls ?? '5px';
  ctx.fillText(text, x, y + (1 - L.out((t - t0) / 0.7)) * 10); ctx.restore();
}

module.exports = { T0: -100, T1: -100, draw() {}, gf, pat, cached, rr, cap, camera, glowStroke, ring, lantern, dust, check, dawnSky, caption, figure: TL.figure, ik: TL.ik, capsule: TL.capsule };
