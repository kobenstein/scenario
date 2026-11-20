// "Full disclosure: we make this channel with help from AI, Claude included."
// A small home studio at night, seen over the shoulder of the maker: storyboard sheets pinned on the wall,
// a microphone on its boom, a warm lamp over a sketch pad where he draws the next frame. On the laptop a chat
// with an AI fills in; on "Claude" a reply arrives and he glances over at it, then goes back to drawing.
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, clamp, label } = L;
const { figure } = require('./s_timeline');

const T0 = 107.0, T1 = 113.55;

// ---------- shared helpers for chunk k2 (other s_k2_* files require them from here) ----------
// grainFill whose speckle only covers the path's bounding box (same look as lib, much cheaper)
const BB = { b: null, p(x, y) { const b = this.b; if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; },
  moveTo(x, y) { this.p(x, y); }, lineTo(x, y) { this.p(x, y); }, quadraticCurveTo(a, b, x, y) { this.p(a, b); this.p(x, y); },
  bezierCurveTo(a, b, c, d, x, y) { this.p(a, b); this.p(c, d); this.p(x, y); }, rect(x, y, w, h) { this.p(x, y); this.p(x + w, y + h); },
  arc(x, y, r) { this.p(x - r, y - r); this.p(x + r, y + r); }, ellipse(x, y, rx, ry) { const r = Math.max(rx, ry); this.p(x - r, y - r); this.p(x + r, y + r); },
  arcTo(a, b, x, y) { this.p(a, b); this.p(x, y); }, closePath() {}, beginPath() {}, save() {}, restore() {}, translate() {}, rotate() {}, scale() {} };
const PAT = new WeakMap();
function pat(ctx) { let p = PAT.get(ctx); if (!p) { p = ctx.createPattern(L.tex().dark, 'repeat'); PAT.set(ctx, p); } return p; }
function grainFill(ctx, pathFn, fill, grain = 0.5) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    BB.b = [1e9, 1e9, -1e9, -1e9]; pathFn(BB); const b = BB.b;
    ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = pat(ctx);
    const m = ctx.getTransform().invertSelf(); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [px, py] of [[0, 0], [W, 0], [0, H], [W, H]]) { const x = m.a * px + m.c * py + m.e, y = m.b * px + m.d * py + m.f; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    // paths drawn under save/translate inside pathFn are not tracked by BB, so fall back to the whole view then
    if (b[0] < 1e8) { x0 = Math.max(x0, b[0] - 2); y0 = Math.max(y0, b[1] - 2); x1 = Math.min(x1, b[2] + 2); y1 = Math.min(y1, b[3] + 2); }
    if (x1 > x0 && y1 > y0) ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
  ctx.restore();
}
function roundRect(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function poly(pts) { return c => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); }; }
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  c.moveTo(x0 + Math.cos(a + Math.PI / 2) * r0, y0 + Math.sin(a + Math.PI / 2) * r0);
  c.arc(x0, y0, r0, a + Math.PI / 2, a + Math.PI * 1.5); c.arc(x1, y1, r1, a - Math.PI / 2, a + Math.PI / 2); c.closePath();
}
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn, S = 1.25) {
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}
// soft drifting dust motes
function motes(ctx, t, list, x0, y0, w, h, col, a) {
  for (const [u, v, k] of list) {
    const ph = (v + t * (0.015 + k * 0.03)) % 1, x = x0 + u * w + Math.sin(t * 0.5 + u * 20) * 18, y = y0 + h - ph * h;
    ctx.fillStyle = rgba(col, a * Math.sin(ph * Math.PI)); ctx.beginPath(); ctx.arc(x, y, 1 + k * 1.8, 0, Math.PI * 2); ctx.fill();
  }
}
const MOTES = (() => { const r = rng(207); return Array.from({ length: 40 }, () => [r(), r(), r()]); })();

// ---------- the room ----------
const SHEETS = (() => { const r = rng(71); return [0, 1, 2, 3, 4, 5].map(i => ({ x: 560 + i * 220 + (r() - 0.5) * 20, y: 150 + (r() - 0.5) * 26, rot: (r() - 0.5) * 0.07, k: i })); })();
function sketch(c, k, w, h) {
  // a tiny storyboard thumbnail per sheet: what the channel is about
  c.strokeStyle = 'rgba(44,36,70,0.78)'; c.lineWidth = 2; c.lineCap = 'round';
  c.strokeRect(10, 12, w - 20, h * 0.62);
  const cx = w / 2, cy = 12 + h * 0.31;
  c.beginPath();
  if (k === 0) { c.arc(cx, cy, 26, 0, Math.PI * 2); c.moveTo(cx + 40, cy); c.arc(cx, cy, 40, 0, Math.PI * 1.6); }
  else if (k === 1) { for (const [x, hh] of [[-40, 50], [-10, 70], [22, 40]]) c.rect(cx + x, cy + 40 - hh, 22, hh); }
  else if (k === 2) { c.moveTo(cx - 60, cy + 30); c.lineTo(cx, cy - 8); c.lineTo(cx + 60, cy - 36); c.moveTo(cx, cy - 8); c.lineTo(cx + 60, cy + 30); }
  else if (k === 3) { c.moveTo(cx - 62, cy + 34); c.bezierCurveTo(cx - 10, cy + 30, cx + 20, cy + 10, cx + 58, cy - 36); c.moveTo(cx - 62, cy + 34); c.lineTo(cx + 62, cy + 34); }
  else if (k === 4) { c.arc(cx, cy - 18, 9, 0, Math.PI * 2); c.moveTo(cx, cy - 8); c.lineTo(cx, cy + 22); c.lineTo(cx - 12, cy + 40); c.moveTo(cx, cy + 22); c.lineTo(cx + 12, cy + 40); c.moveTo(cx - 14, cy + 4); c.lineTo(cx + 16, cy - 4); }
  else { c.arc(cx, cy + 34, 30, Math.PI, 0); c.moveTo(cx - 64, cy + 34); c.lineTo(cx + 64, cy + 34); for (let i = 0; i < 5; i++) { const a = Math.PI + 0.3 + i * 0.6; c.moveTo(cx + Math.cos(a) * 38, cy + 34 + Math.sin(a) * 38); c.lineTo(cx + Math.cos(a) * 50, cy + 34 + Math.sin(a) * 50); } }
  c.stroke();
  c.lineWidth = 1.5; c.strokeStyle = 'rgba(44,36,70,0.45)';
  for (let j = 0; j < 3; j++) { c.beginPath(); c.moveTo(12, h * 0.74 + 12 + j * 12); c.lineTo(12 + (w - 30) * (0.9 - j * 0.22), h * 0.74 + 12 + j * 12); c.stroke(); }
}
function wallArt(c) {
  grainFill(c, k => k.rect(-200, -200, W + 400, 900), lin(c, 0, -200, 0, 700, [[0, '#0a0b24'], [0.6, '#17153c'], [1, '#1d1946']]), 0.55);
  // a thin wire across the wall that the sheets hang from
  c.strokeStyle = 'rgba(10,8,26,0.9)'; c.lineWidth = 2; c.beginPath(); c.moveTo(150, 132); c.quadraticCurveTo(860, 152, 1560, 128); c.stroke();
  // a shelf low on the right with a few things on it
  c.fillStyle = '#0c0b22'; c.fillRect(1440, 470, 480, 12);
  const r = rng(5); let x = 1470;
  while (x < 1880) { const w = 14 + r() * 22, h = 40 + r() * 46; c.fillStyle = r() < 0.3 ? '#2a2252' : '#151236'; c.fillRect(x, 470 - h, w, h); x += w + 4 + (r() < 0.2 ? 50 : 0); }
  // acoustic foam panel behind the microphone
  grainFill(c, k => roundRect(k, 700, 330, 380, 220, 6), '#191538', 0.6);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { c.fillStyle = (i + j) % 2 ? 'rgba(6,6,20,0.45)' : 'rgba(60,52,110,0.18)'; c.fillRect(712 + i * 61, 342 + j * 51, 55, 45); }
}
function deskArt(c) {
  grainFill(c, k => { k.moveTo(-200, 610); k.lineTo(W + 200, 610); k.lineTo(W + 200, H + 200); k.lineTo(-200, H + 200); k.closePath(); },
    lin(c, 0, 610, 0, H, [[0, '#3a2a4e'], [0.3, '#2a1f44'], [1, '#100c22']]), 0.55);
  c.fillStyle = 'rgba(255,190,130,0.10)'; c.fillRect(-200, 610, W + 400, 3);
}

// chat messages on the laptop: who, when, how many lines
const MSG = [
  { who: 'h', t: 106.6, n: 2, w: 0.7 }, { who: 'a', t: 107.6, n: 3, w: 0.85 }, { who: 'h', t: 109.4, n: 1, w: 0.55 },
  { who: 'h', t: 110.5, n: 2, w: 0.65 }, { who: 'a', t: 112.04, n: 4, w: 0.9 },
];
const SCR = { x: 330, y: 380, w: 470, h: 300, sk: 0.09 };
function laptop(ctx, t, glow) {
  // base on the desk
  grainFill(ctx, poly([[300, 712], [830, 760], [900, 812], [270, 772]]), lin(ctx, 0, 712, 0, 812, [[0, '#2a2c5a'], [1, '#121232']]), 0.4);
  ctx.fillStyle = rgba(C.cyan, 0.16 * glow); ctx.beginPath(); poly([[330, 726], [820, 768], [860, 798], [310, 760]])(ctx); ctx.fill();
  ctx.save(); ctx.translate(SCR.x, SCR.y); ctx.transform(1, SCR.sk, 0, 1, 0, 0);
  ctx.fillStyle = '#05060f'; ctx.beginPath(); roundRect(ctx, -12, -12, SCR.w + 24, SCR.h + 30, 10); ctx.fill();
  grainFill(ctx, c => roundRect(c, 0, 0, SCR.w, SCR.h, 4), lin(ctx, 0, 0, SCR.w * 0.4, SCR.h, [[0, '#14708f'], [0.6, '#0c4c69'], [1, '#072e45']]), 0.25);
  ctx.save(); ctx.beginPath(); ctx.rect(8, 8, SCR.w - 16, SCR.h - 16); ctx.clip();
  // message list, newest at the bottom, scrolling smoothly
  let y = 0; const items = [];
  for (const m of MSG) { const a = ramp(t, m.t, m.t + 0.35); if (a <= 0) continue; const hgt = (20 + m.n * 17) * out((t - m.t) / 0.35); items.push({ m, y, a, hgt }); y += hgt + 14; }
  const scroll = Math.max(0, y - (SCR.h - 30));
  for (const { m, y: yy, a, hgt } of items) {
    const by = 18 + yy - scroll, bw = (SCR.w - 90) * m.w, bx = m.who === 'h' ? SCR.w - 22 - bw : 22;
    ctx.globalAlpha = a;
    ctx.fillStyle = m.who === 'h' ? rgba(C.amber, 0.82) : rgba(C.cyanW, 0.16);
    ctx.beginPath(); roundRect(ctx, bx, by, bw, hgt, 10); ctx.fill();
    // lines of text: the AI reply types itself in
    const typed = m.who === 'a' ? clamp((t - m.t) / (0.45 * m.n)) * m.n : m.n;
    for (let j = 0; j < m.n; j++) {
      const f = clamp(typed - j); if (f <= 0) break;
      const lw = (bw - 28) * (j === m.n - 1 ? 0.6 : 0.92 - 0.1 * hash(m.t, j)) * f;
      ctx.fillStyle = m.who === 'h' ? 'rgba(74,34,16,0.75)' : rgba(C.cyanW, 0.85);
      ctx.beginPath(); roundRect(ctx, bx + 14, by + 14 + j * 17, Math.max(4, lw), 7, 3); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  // the input field
  ctx.fillStyle = 'rgba(4,10,24,0.55)'; ctx.fillRect(0, SCR.h - 34, SCR.w, 34);
  ctx.strokeStyle = rgba(C.cyan, 0.35); ctx.lineWidth = 1.5; ctx.beginPath(); roundRect(ctx, 18, SCR.h - 27, SCR.w - 36, 20, 9); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = lin(ctx, 0, 0, SCR.w, SCR.h, [[0, 'rgba(216,247,255,0.10)'], [0.5, 'rgba(216,247,255,0)'], [1, 'rgba(216,247,255,0.05)']]); ctx.fillRect(0, 0, SCR.w, SCR.h);
  ctx.restore();
  light(ctx, SCR.x + SCR.w / 2, SCR.y + SCR.h / 2 + 20, 520, C.cyan, 0.13 * glow);
}

// the sketch pad lies on the desk, foreshortened; (u, v) in 0..1 across / down the page
const PAD = { o: [1440, 790], u: [300, 18], v: [-44, 124] };
const padP = (u, v) => [PAD.o[0] + PAD.u[0] * u + PAD.v[0] * v, PAD.o[1] + PAD.u[1] * u + PAD.v[1] * v];
// the stroke he draws: a ring, then a little figure under it, then hatching (u, v points)
const STROKE = (() => { const p = [];
  for (let i = 0; i <= 60; i++) { const a = -1.4 + i / 60 * Math.PI * 2.1; p.push([0.38 + Math.cos(a) * 0.17, 0.36 + Math.sin(a) * 0.2]); }
  p.push(null); for (let i = 0; i <= 12; i++) p.push([0.68 + i * 0.004, 0.58 - i * 0.025]);
  p.push(null); for (let i = 0; i < 9; i++) { p.push([0.18 + i * 0.07, 0.86]); p.push([0.23 + i * 0.07, 0.72]); }
  return p; })();
const DRAWN = t => {   // how much of the stroke is drawn: steady with a pause while he looks at the laptop
  const look = lookAt(t); let s = 0; for (let u = T0 - 1; u < t; u += 0.05) s += 0.05 * (1 - lookAt(u)) * (0.75 + 0.25 * Math.sin(u * 3));
  return Math.min(STROKE.length - 1, s * 13);
};
const lookAt = t => ramp(t, 111.85, 112.35) * (1 - ramp(t, 113.0, 113.5));
function pad(ctx, t) {
  ctx.fillStyle = 'rgba(4,4,16,0.4)'; ctx.beginPath(); poly([padP(0.02, 0.04), padP(1.04, 0.04), padP(1.04, 1.06), padP(0.02, 1.06)])(ctx); ctx.fill();
  grainFill(ctx, poly([padP(0, 0), padP(1, 0), padP(1, 1), padP(0, 1)]), lin(ctx, PAD.o[0], PAD.o[1], PAD.o[0] + 200, PAD.o[1] + 110, [[0, '#fbeacb'], [1, '#d8b88a']]), 0.25);
  ctx.strokeStyle = 'rgba(60,40,40,0.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); poly([padP(0.08, 0.1), padP(0.92, 0.1), padP(0.92, 0.66), padP(0.08, 0.66)])(ctx); ctx.stroke();
  const n = DRAWN(t); ctx.strokeStyle = 'rgba(40,26,40,0.85)'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  let pen = padP(0.4, 0.4); ctx.beginPath(); let started = false;
  for (let i = 0; i <= Math.floor(n); i++) {
    const q = STROKE[i]; if (!q) { started = false; continue; }
    let pp = padP(q[0], q[1]);
    if (i === Math.floor(n) && STROKE[i + 1]) { const q2 = STROKE[i + 1], f = n - i; pp = padP(lerp(q[0], q2[0], f), lerp(q[1], q2[1], f)); }
    if (!started) { ctx.moveTo(pp[0], pp[1]); started = true; } else ctx.lineTo(pp[0], pp[1]);
    pen = pp;
  }
  ctx.stroke();
  return pen;
}

function mic(ctx, t) {
  const sw = Math.sin(t * 0.8) * 2;
  // boom arm from a clamp on the right edge of the frame
  ctx.strokeStyle = '#07071a'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(1240, -40); ctx.lineTo(1290, 200 + sw * 0.5); ctx.lineTo(1080, 420 + sw); ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = rgba('#ffb35c', 0.22); ctx.beginPath(); ctx.moveTo(1244, -40); ctx.lineTo(1294, 200 + sw * 0.5); ctx.lineTo(1084, 420 + sw); ctx.stroke();
  grainFill(ctx, c => c.ellipse(1290, 200 + sw * 0.5, 14, 14, 0, 0, Math.PI * 2), '#151436', 0.3);
  // shock mount ring and the microphone body
  ctx.save(); ctx.translate(1060, 440 + sw); ctx.rotate(0.35);
  ctx.strokeStyle = '#0c0b22'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(0, 10, 56, 18, 0, 0, Math.PI * 2); ctx.stroke();
  grainFill(ctx, c => roundRect(c, -38, -60, 76, 150, 34), lin(ctx, -38, 0, 38, 0, [[0, '#3a3466'], [0.5, '#24204a'], [1, '#0e0c24']]), 0.5);
  grainFill(ctx, c => roundRect(c, -38, -60, 76, 70, 34), lin(ctx, -38, 0, 38, 0, [[0, '#4a4380'], [1, '#1a1640']]), 0.6);
  ctx.strokeStyle = 'rgba(8,8,24,0.55)'; ctx.lineWidth = 2; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-34, -40 + i * 11); ctx.lineTo(34, -40 + i * 11); ctx.stroke(); }
  ctx.fillStyle = rgba(C.amber, 0.25); ctx.fillRect(18, -50, 4, 120);
  ctx.restore();
  // the little "live" light
  light(ctx, 1048, 520 + sw, 18, C.amber, 0.5 + 0.2 * Math.sin(t * 2));
}

function lamp(ctx, t, k) {
  // an architect lamp from the right, shade over the pad
  ctx.strokeStyle = '#0b0a20'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(1890, 700); ctx.lineTo(1850, 430); ctx.lineTo(1690, 540); ctx.stroke();
  grainFill(ctx, c => c.ellipse(1890, 705, 60, 14, 0, 0, Math.PI * 2), '#141232', 0.4);
  ctx.save(); ctx.translate(1670, 560); ctx.rotate(-0.5);
  grainFill(ctx, c => { c.moveTo(-30, -36); c.lineTo(34, -36); c.lineTo(66, 40); c.lineTo(-62, 40); c.closePath(); }, lin(ctx, 0, -36, 0, 40, [[0, '#2a1a20'], [1, '#6a3a1e']]), 0.4);
  ctx.restore();
  light(ctx, 1640, 612, 80, '#ffe3b8', 0.8 * k);
  cone(ctx, 1630, 600, 90, 560, 300, C.amber, 0.12 * k);
  ctx.save(); ctx.translate(1580, 860); ctx.scale(1, 0.45); light(ctx, 0, 0, 440, C.amber, 0.5 * k); light(ctx, 0, 0, 180, '#ffd9a0', 0.32 * k); ctx.restore();
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.07, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 3) * 6, dy = drift(t, 1, 4) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H / 2 + dy * par); fn(); ctx.restore(); };
  const glow = (0.9 + 0.1 * Math.sin(t * 1.3)) * (1 + 0.6 * ramp(t, 112.04, 112.4) * (1 - ramp(t, 112.6, 113.4)));
  const lk = 0.95 + 0.05 * Math.sin(t * 0.9);
  const look = lookAt(t);

  layer(0.3, () => {
    cached(ctx, 'wall', -200, -200, W + 200, 700, wallArt);
    // storyboard sheets, swaying a hair on the wire
    for (const s of SHEETS) {
      ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot + 0.012 * Math.sin(t * 0.9 + s.k));
      ctx.fillStyle = 'rgba(4,4,16,0.4)'; ctx.fillRect(-82, 8, 170, 150);
      cached(ctx, 'sheet' + s.k, -90, 0, 80, 150, c => { grainFill(c, k => k.rect(-90, 0, 170, 150), lin(c, 0, 0, 0, 150, [[0, '#e9dfc6'], [1, '#b9ab90']]), 0.3); c.translate(-90, 0); sketch(c, s.k, 170, 150); });
      grainFill(ctx, c => c.arc(-5, 4, 6, 0, Math.PI * 2), '#c9702e', 0);
      ctx.restore();
    }
    // the laptop light reaches the left sheets, the lamp the right ones
    light(ctx, 520, 240, 520, C.cyan, 0.06 * glow); light(ctx, 1500, 260, 420, C.amber, 0.07 * lk);
  });
  layer(0.6, () => {
    cached(ctx, 'desk', -200, 600, W + 200, H + 200, deskArt);
    // mug with steam and a cup of pencils
    ctx.save(); ctx.translate(960, 660);
    grainFill(ctx, c => { c.moveTo(0, 0); c.lineTo(62, 0); c.lineTo(57, 74); c.lineTo(5, 74); c.closePath(); }, lin(ctx, 0, 0, 62, 0, [[0, '#4a4f92'], [1, '#1c1d48']]), 0.4);
    ctx.strokeStyle = '#25285a'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(66, 32, 15, -1.2, 1.2); ctx.stroke();
    for (let k = 0; k < 3; k++) { const ph = (t * 0.35 + k / 3) % 1; ctx.strokeStyle = rgba(C.cream, 0.15 * Math.sin(ph * Math.PI)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(20 + k * 11, -6);
      for (let s = 1; s <= 9; s++) ctx.lineTo(20 + k * 11 + Math.sin(s * 0.7 + t * 2 + k) * 7, -6 - s * 8 - ph * 26); ctx.stroke(); }
    ctx.restore();
    laptop(ctx, t, glow);
    lamp(ctx, t, lk);
  });
  layer(0.75, () => mic(ctx, t));
  // the maker, closest to camera
  layer(1.0, () => {
    const pen = pad(ctx, t);
    const b = Math.sin(t * 1.6);
    const wig = (1 - look) * Math.sin(t * 17) * 2;
    const turn = lerp(0.3 + 0.08 * Math.sin(t * 0.6), -0.9, look);
    const F = figure(ctx, { x: 1250, y: 1200 + b * 2.5, s: 2.5, hair0: '#4a200c', pal: ['#f0a25a', '#b0602a', '#45200c'], len: 0.92, facing: 'back', br: b, lean: 0.1 - 0.06 * look, turn, tilt: lerp(0.2, 0.02, look), lx: 1,
      rim: C.amber, rimA: 0.5, rimDx: 4, rimDy: -2,
      arms: [{ a1: 2.5, a2: -0.55, behind: true }, { tx: pen[0] + 16 + wig, ty: pen[1] + 26, bend: -1, behind: true }] });
    // headphones resting around the neck
    { const hx = F.head[0], hy = F.head[1] + 2.5 * 30;
      ctx.strokeStyle = '#12112a'; ctx.lineWidth = 11; ctx.beginPath(); ctx.ellipse(hx, hy - 6, 66, 26, 0, 0.1, Math.PI - 0.1); ctx.stroke();
      grainFill(ctx, c => { c.ellipse(hx - 66, hy - 10, 18, 26, 0.3, 0, Math.PI * 2); c.ellipse(hx + 66, hy - 10, 18, 26, -0.3, 0, Math.PI * 2); }, lin(ctx, hx - 80, 0, hx + 80, 0, [[0, '#1a1840'], [1, '#3a3270']]), 0.4);
      ctx.fillStyle = rgba(C.amber, 0.35); ctx.fillRect(hx + 78, hy - 30, 3, 34); }
    // pencil in the hand
    ctx.strokeStyle = '#e8c070'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(pen[0] + 26, pen[1] - 14); ctx.lineTo(pen[0] + 1, pen[1] - 1); ctx.stroke();
    // a cyan rim on his left side from the laptop, stronger when the reply arrives
    light(ctx, 1080, 900, 260, C.cyan, 0.06 * glow);
  });
  layer(0.5, () => motes(ctx, t, MOTES, 200, 100, 1600, 700, C.cream, 0.28));
  label(ctx, t, 108.16, T1 - 0.1, 'Full disclosure', 'made with AI help', 96, 150);
}

module.exports = { T0, T1, draw, grainFill, roundRect, poly, cap, cached, motes };
