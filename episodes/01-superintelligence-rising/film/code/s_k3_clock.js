// "This moment is shorter than it feels. Squeeze the whole human story, all 300,000 years, into one day.
//  Writing shows up in the last twenty-four minutes. And the years between now and 2030? That's about the last second."
// A single spark in a starry sky; the camera pulls back and a clock hand sweeps one whole day around a huge 24-hour
// dial, leaving tiny campfires, handprints and wanderers along the way. Then the camera pushes into the last
// 24 minutes (they glow amber with clay tablets and script) and dives on, through minutes and seconds, into the
// very last second, which lights up cyan.
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, rng, lin, rad, rgba, light, clamp, stamp } = L;

const T0 = 144.66, T1 = 162.3;

// ---------- shared helpers for chunk k3 (the other s_k3_* files require them from here) ----------
// grainFill whose speckle only covers the path's bounding box (same look as lib, much cheaper)
const BB = { b: null, p(x, y) { const b = this.b; if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; },
  moveTo(x, y) { this.p(x, y); }, lineTo(x, y) { this.p(x, y); }, quadraticCurveTo(a, b, x, y) { this.p(a, b); this.p(x, y); },
  bezierCurveTo(a, b, c, d, x, y) { this.p(a, b); this.p(c, d); this.p(x, y); }, rect(x, y, w, h) { this.p(x, y); this.p(x + w, y + h); },
  arc(x, y, r) { this.p(x - r, y - r); this.p(x + r, y + r); }, ellipse(x, y, rx, ry) { const r = Math.max(rx, ry); this.p(x - r, y - r); this.p(x + r, y + r); },
  arcTo(a, b, x, y) { this.p(a, b); this.p(x, y); }, closePath() {}, beginPath() {} };
const PAT = new WeakMap();
function pat(ctx) { let p = PAT.get(ctx); if (!p) { p = ctx.createPattern(L.tex().dark, 'repeat'); PAT.set(ctx, p); } return p; }
function grainFill(ctx, pathFn, fill, grain = 0.5) {
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
function roundRect(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// tapered capsule from (x0,y0) radius r0 to (x1,y1) radius r1
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0); c.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  c.arc(x1, y1, r1, n, n - Math.PI, true); c.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0); c.arc(x0, y0, r0, n + Math.PI, n, true); c.closePath();
}
function glowStroke(ctx, path, col, w, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [mw, ma] of [[5, 0.10], [2.4, 0.28], [1, 1]]) { ctx.strokeStyle = rgba(col, a * ma); ctx.lineWidth = w * mw; ctx.beginPath(); path(ctx); ctx.stroke(); }
  ctx.restore();
}
// starfield shared by the clock and the decision scene
const STARS = (() => { const r = rng(303), a = []; for (let i = 0; i < 420; i++) a.push({ x: r() * 3200 - 640, y: r() * 1900 - 420, s: 0.6 + Math.pow(r(), 3) * 2.4, ph: r() * 7, f: 0.5 + r() * 2, warm: r() < 0.15 }); return a; })();
function stars(ctx, t, ox, oy, k, alpha = 1) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const st of STARS) {
    const x = W / 2 + (st.x - W / 2) * k + ox * (0.4 + st.s * 0.3), y = H / 2 + (st.y - H / 2) * k + oy * (0.4 + st.s * 0.3);
    if (x < -10 || x > W + 10 || y < -10 || y > H + 10) continue;
    const tw = 0.55 + 0.45 * Math.sin(t * st.f + st.ph);
    ctx.fillStyle = rgba(st.warm ? '#ffe2b8' : '#dfe6ff', alpha * (0.25 + 0.6 * tw) * Math.min(1, st.s / 1.6));
    ctx.beginPath(); ctx.arc(x, y, st.s * (0.8 + 0.2 * tw), 0, 7); ctx.fill();
  }
  ctx.restore();
}
function sky(ctx, top = '#05061a', mid = '#0d1138', bot = '#1b1748') {
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, top], [0.6, mid], [1, bot]]); ctx.fillRect(0, 0, W, H);
}

// ---------- the dial (world units, centre at 0,0) ----------
const R = 400, TAU = Math.PI * 2;
const ang = a => -Math.PI / 2 + TAU * a;              // a = fraction of the day, 0 at the top, clockwise
const pt = (a, r) => [Math.cos(ang(a)) * r, Math.sin(ang(a)) * r];
const DAY = 86400;
const SLIVER = 1 - 24 / 1440, LASTS = 1 - 1 / DAY;

// camera: world anchor A appears at screen point Q, scale s
function proj(cam, p) { return [cam.Q[0] + cam.s * (p[0] - cam.A[0]), cam.Q[1] + cam.s * (p[1] - cam.A[1])]; }
const TOP = pt(1, R), MIDSL = pt(1 - 12 / 1440, R * 0.86), SEC = pt(1 - 0.5 / DAY, R);
const lerp2 = (p, q, k) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
const lz = (a, b, k) => Math.exp(lerp(Math.log(a), Math.log(b), k));
const CAM_Q1 = [1080, 120];
function camBase(t) {
  // P0: close on the spark; P1: pull back to the whole day
  if (t < 153.7) {
    const k = ease((t - 147.5) / 2.7);
    const s = t < 147.5 ? lz(42, 30, (t - T0) / (147.5 - T0)) : lz(30, 1, k);
    const hold = ramp(t, 151.1, 153.7);
    return { A: TOP, Q: lerp2([960, 560], CAM_Q1, k), s: s * (1 + 0.03 * hold) };
  }
  // P2: push into the last 24 minutes
  if (t < 157.1) {
    const c0 = camBase(153.6999), q0 = proj(c0, MIDSL), k = ease((t - 153.7) / 1.7);
    return { A: MIDSL, Q: lerp2(q0, [1000, 560], k), s: lz(c0.s, 7, k) * (1 + 0.08 * ramp(t, 155.4, 157.1)) };
  }
  // P3: dive into the last second
  const c0 = camBase(157.0999), q0 = proj(c0, SEC), k = sm((t - 157.1) / 3.75);
  const k2 = Math.pow(k, 0.85);
  return { A: SEC, Q: lerp2(q0, [960, 470], sm(k * 1.3)), s: lz(c0.s, 26000, k2) * (1 + 0.07 * ramp(t, 160.85, 162.3)) };
}
const CAMS = new Map();
function cam(t) {
  const c = camBase(t), dx = drift(t, 0.8, 3) * 7, dy = drift(t, 0.8, 5) * 5;
  return { A: c.A, Q: [c.Q[0] + dx, c.Q[1] + dy], s: c.s };
}

// visible range of day fractions
function visRange(cm) {
  const c = proj(cm, [0, 0]), rpx = cm.s * R;
  if (rpx < 1600) return [0, 1, true];
  // fraction at the screen point nearest to the rim
  const ax = (W / 2 - c[0]), ay = (H / 2 - c[1]); let af = (((Math.atan2(ay, ax) + Math.PI / 2) / TAU) % 1 + 1) % 1; if (af < 0.25) af += 1;   // views here are all near midnight
  const d = 1500 / (TAU * rpx);
  return [af - d, af + d, false];
}
// polyline along an arc in screen space; coordinates clamped so huge zooms stay numerically sane
const CL = v => clamp(v, -6000, 8000);
function arcPoly(c, cm, r, a0, a1, n, move = true) {
  for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n), p = proj(cm, pt(a, r)); if (i === 0 && move) c.moveTo(CL(p[0]), CL(p[1])); else c.lineTo(CL(p[0]), CL(p[1])); }
}
function sectorPath(c, cm, r0, r1, a0, a1, full) {
  const n = full ? 120 : 40;
  arcPoly(c, cm, r1, a0, a1, n); arcPoly(c, cm, r0, a1, a0, n, false); c.closePath();
}

// ---------- history along the dial ----------
const MARKS = (() => { const r = rng(77), a = [];
  for (let i = 0; i < 70; i++) { const f = 0.015 + (i / 70) * 0.965 + (r() - 0.5) * 0.01; a.push({ a: Math.min(f, SLIVER - 0.004), r: R * (0.66 + r() * 0.22), type: Math.floor(r() * 3), rot: (r() - 0.5) * 0.5, sz: 0.8 + r() * 0.5, ph: r() * 6 }); }
  return a; })();
const WRITING = (() => { const r = rng(91), a = [];
  const RR = [0.90, 0.74, 0.83, 0.66, 0.92, 0.77, 0.86];
  for (let i = 0; i < 7; i++) a.push({ a: SLIVER + (i + 0.55) / 7.3 * (1 - SLIVER), r: R * RR[i] + (r() - 0.5) * 6, type: i % 3 === 1 ? 1 : 0, rot: (r() - 0.5) * 0.4, seed: Math.floor(r() * 1000) });
  return a; })();
// glyphs drawn around (0,0) at about 10 units tall
function glyph(ctx, g, t) {
  if (g.type === 0) { // campfire: two logs and a flickering flame
    ctx.strokeStyle = '#7a3b17'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-6, 5); ctx.lineTo(6, 2); ctx.moveTo(-6, 2); ctx.lineTo(6, 5); ctx.stroke();
    const f = 1 + 0.15 * Math.sin(t * 9 + g.ph);
    ctx.fillStyle = '#ffb35c'; ctx.beginPath(); ctx.moveTo(-4, 3); ctx.quadraticCurveTo(-4, -4, 0, -10 * f); ctx.quadraticCurveTo(4, -4, 4, 3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff1cf'; ctx.beginPath(); ctx.moveTo(-1.6, 3); ctx.quadraticCurveTo(-1.5, -2, 0, -5 * f); ctx.quadraticCurveTo(1.5, -2, 1.6, 3); ctx.closePath(); ctx.fill();
  } else if (g.type === 1) { // handprint, as on cave walls
    ctx.fillStyle = '#e08a42';
    ctx.beginPath(); ctx.ellipse(0, 2, 4.2, 4.6, 0, 0, 7); ctx.fill();
    for (let k = 0; k < 4; k++) { const x = -3.3 + k * 2.2; ctx.beginPath(); ctx.ellipse(x, -4.2 - (k === 1 || k === 2 ? 1.2 : 0), 0.95, 3.0, (k - 1.5) * 0.12, 0, 7); ctx.fill(); }
    ctx.beginPath(); ctx.ellipse(4.6, 0.6, 0.95, 2.6, 0.9, 0, 7); ctx.fill();
  } else { // a wanderer with a staff
    ctx.fillStyle = '#d27a34';
    ctx.beginPath(); ctx.arc(0, -8, 2.2, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-2.4, -5.5); ctx.lineTo(2.4, -5.5); ctx.lineTo(3.2, 2); ctx.lineTo(-3.2, 2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#d27a34'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-1.4, 2); ctx.lineTo(-2.4, 7); ctx.moveTo(1.4, 2); ctx.lineTo(2.6, 7); ctx.stroke();
    ctx.strokeStyle = '#7a3b17'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(4.5, -9); ctx.lineTo(4.5, 7); ctx.stroke();
  }
}
// writing: a clay tablet with wedge marks, or a little scroll of script
function wglyph(ctx, g) {
  const r = rng(g.seed);
  if (g.type === 0) {
    ctx.fillStyle = '#c98a52'; ctx.beginPath(); roundRect(ctx, -6, -8, 12, 16, 2.5); ctx.fill();
    ctx.fillStyle = '#7a3b17';
    for (let row = 0; row < 4; row++) for (let k = 0; k < 4; k++) if (r() < 0.8) { const x = -4.2 + k * 2.7, y = -5.6 + row * 3.6;
      ctx.beginPath(); ctx.moveTo(x, y - 1); ctx.lineTo(x + 1.6, y); ctx.lineTo(x, y + 1); ctx.closePath(); ctx.fill(); }
  } else {
    ctx.fillStyle = '#f0dcb4'; ctx.fillRect(-7, -6, 14, 12);
    ctx.fillStyle = '#c98a52'; ctx.beginPath(); ctx.ellipse(-7, 0, 1.6, 6.5, 0, 0, 7); ctx.ellipse(7, 0, 1.6, 6.5, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#7a3b17'; for (let row = 0; row < 4; row++) { let x = -5; while (x < 4.5) { const w = 0.8 + r() * 2.4; ctx.fillRect(x, -4 + row * 2.6, Math.min(w, 5 - x), 0.9); x += w + 0.8; } }
  }
}

// years before 2026 (1 s of the day = 3.47 years)
const EVENTS = [{ y: 576, k: 'book', lab: '1450' }, { y: 250, k: 'gear', lab: '1776' }, { y: 147, k: 'bulb', lab: '1879' }, { y: 80, k: 'screen', lab: '1946' }, { y: 19, k: 'phone', lab: '2007' }];
function icon(ctx, k, t) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (k === 'book') {
    ctx.fillStyle = '#f0dcb4'; ctx.beginPath(); ctx.moveTo(0, -6); ctx.quadraticCurveTo(-6, -9, -12, -7); ctx.lineTo(-12, 7); ctx.quadraticCurveTo(-6, 5, 0, 8); ctx.quadraticCurveTo(6, 5, 12, 7); ctx.lineTo(12, -7); ctx.quadraticCurveTo(6, -9, 0, -6); ctx.fill();
    ctx.strokeStyle = '#7a3b17'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, 8); for (let i = 0; i < 4; i++) { ctx.moveTo(-10, -3 + i * 2.6); ctx.lineTo(-2.5, -2.4 + i * 2.6); ctx.moveTo(2.5, -2.4 + i * 2.6); ctx.lineTo(10, -3 + i * 2.6); } ctx.stroke();
  } else if (k === 'gear') {
    ctx.save(); ctx.rotate(t * 0.8); ctx.fillStyle = '#e08a42'; ctx.beginPath();
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = i % 2 ? 7 : 10; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    ctx.closePath(); ctx.fill(); ctx.fillStyle = '#3b1a0c'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, TAU); ctx.fill(); ctx.restore();
  } else if (k === 'bulb') {
    ctx.fillStyle = '#ffe2a8'; ctx.beginPath(); ctx.arc(0, -3, 7, 0, TAU); ctx.fill();
    ctx.fillStyle = '#c98a52'; ctx.fillRect(-3.5, 3, 7, 5); ctx.strokeStyle = '#ffb35c'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(-2, -2); ctx.lineTo(0, -5); ctx.lineTo(2, -2); ctx.stroke();
  } else if (k === 'screen') {
    ctx.fillStyle = '#c98a52'; ctx.fillRect(-11, -9, 22, 15); ctx.fillStyle = '#0e5878'; ctx.fillRect(-9, -7, 18, 11);
    ctx.fillStyle = C.cyan; ctx.fillRect(-7, -5, 6, 1.4); ctx.fillRect(-7, -2, 10, 1.4); ctx.fillStyle = '#c98a52'; ctx.fillRect(-3, 6, 6, 3);
  } else if (k === 'phone') {
    ctx.fillStyle = '#c98a52'; ctx.beginPath(); roundRect(ctx, -5.5, -10, 11, 20, 2); ctx.fill(); ctx.fillStyle = '#0e5878'; ctx.fillRect(-4, -7.5, 8, 14);
  }
}
const HAND_T0 = 148.0, HAND_T1 = 152.86;
const sweep = t => ease((t - HAND_T0) / (HAND_T1 - HAND_T0));

function fmtTime(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, p = v => String(v).padStart(2, '0');
  return `${p(h)}:${p(m)}`;
}

function draw(ctx, t) {
  const cm = cam(t), s = cm.s;
  const cen = proj(cm, [0, 0]);
  const [va0, va1, full] = visRange(cm);
  const sw = sweep(t);
  const dive = ramp(t, 157.1, 160.6);
  // sky and stars (stars slip away slowly as the camera dives)
  sky(ctx);
  light(ctx, cen[0], cen[1], 900, '#3b2f6e', 0.22);
  const sk = Math.pow(s, 0.06), so = drift(t, 0.5, 9) * 10;
  stars(ctx, t, so, (cen[1] - 540) * 0.02, sk / 1.25);

  // ---- dial face ----
  const faceA = 0.25 + 0.75 * ramp(t, 147.6, 150.4);
  ctx.save(); ctx.globalAlpha = faceA;
  grainFill(ctx, c => { if (full) c.arc(cen[0], cen[1], s * R, 0, TAU); else { arcPoly(c, cm, R, va0, va1, 60); c.lineTo(CL(cen[0]), CL(cen[1])); c.closePath(); } },
    rad(ctx, CL(cen[0]), CL(cen[1]), 0, Math.min(s * R, 9000), [[0, '#2a2560'], [0.7, '#1b1848'], [1, '#141238']]), 0.45);
  ctx.restore();
  // swept part of the day glows faintly warm, like a pie filling up
  if (sw > 0 && full) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, cen[0], cen[1], s * R * 0.3, s * R, [[0, rgba(C.amber, 0)], [1, rgba(C.amber, 0.07 * (1 - dive))]]);
    ctx.beginPath(); if (sw > 0.9995) ctx.arc(cen[0], cen[1], s * R, 0, 7); else { ctx.moveTo(cen[0], cen[1]); ctx.arc(cen[0], cen[1], s * R, ang(0), ang(sw)); ctx.closePath(); } ctx.fill(); ctx.restore();
  }
  // inner rings for structure
  if (full) {
    ctx.strokeStyle = rgba(C.lav, 0.12 * faceA); ctx.lineWidth = 1.5;
    for (const k of [0.58, 0.9]) { ctx.beginPath(); ctx.arc(cen[0], cen[1], s * R * k, 0, TAU); ctx.stroke(); }
  }

  // past midnight lies the future: unlit
  if (!full && va1 > 1) { ctx.save(); ctx.fillStyle = 'rgba(5,6,22,0.45)'; ctx.globalAlpha = ramp(t, 153.8, 155); ctx.beginPath(); sectorPath(ctx, cm, Math.max(0, R - 3000 / s), R, 1, va1, false); ctx.fill(); ctx.restore(); }

  // ---- the last 24 minutes: amber ----
  const slA = ramp(t, 154.4, 155.4) * (1 - 0.55 * dive);
  if (slA > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const m0 = proj(cm, pt(SLIVER + 0.5 * (1 - SLIVER), R * 0.8));
    const am = (va0 + va1) / 2 > SLIVER && !full ? clamp((va0 + va1) / 2, SLIVER, 1) : SLIVER + 0.5 * (1 - SLIVER);
    const g0 = proj(cm, pt(am, R)), dep = Math.min(s * R * 0.42, 520), dv = [-Math.cos(ang(am)), -Math.sin(ang(am))];
    ctx.fillStyle = lin(ctx, CL(g0[0]), CL(g0[1]), CL(g0[0] + dv[0] * dep), CL(g0[1] + dv[1] * dep), [[0, rgba(C.amber, 0.62 * slA)], [0.5, rgba(C.amberM, 0.30 * slA)], [1, rgba(C.amberD, 0)]]);
    ctx.beginPath(); sectorPath(ctx, cm, Math.max(R * 0.58, R - 520 / s), R, Math.max(SLIVER, va0), Math.min(1, va1), full); ctx.fill();
    ctx.restore();
    // its edges, drawn as two bright spokes
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.amber, 0.8 * slA); ctx.lineWidth = 2;
    for (const a of [SLIVER]) { const p0 = proj(cm, pt(a, R * 0.58)), p1 = proj(cm, pt(a, R)); ctx.beginPath(); ctx.moveTo(CL(p0[0]), CL(p0[1])); ctx.lineTo(CL(p1[0]), CL(p1[1])); ctx.stroke(); }
    ctx.restore();
    light(ctx, m0[0], m0[1], Math.min(700, 120 * s), C.amber, 0.25 * slA * (1 - dive));
  }

  // ---- the last second: cyan ----
  const lsA = ramp(t, 160.45, 161.1);
  if (lsA > 0) {
    const pulse = 0.85 + 0.15 * Math.sin(t * 3.1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const bandIn = R - 230 / s;
    ctx.fillStyle = lin(ctx, 0, proj(cm, SEC)[1], 0, proj(cm, SEC)[1] + 230, [[0, rgba(C.cyan, 0.65 * lsA * pulse)], [1, rgba(C.cyanD, 0.0)]]);
    ctx.beginPath(); sectorPath(ctx, cm, bandIn, R, LASTS, 1, false); ctx.fill();
    ctx.restore();
    const m = proj(cm, pt(1 - 0.5 / DAY, R - 40 / s));
    light(ctx, m[0], m[1], 520, C.cyan, 0.35 * lsA * pulse);
    light(ctx, m[0], m[1] - 30, 220, C.cyanW, 0.25 * lsA * pulse);
    // the second's two ends, as years
    const e0 = proj(cm, pt(LASTS, R)), e1 = proj(cm, pt(1, R)), ya = ramp(t, 160.9, 161.5);
    ctx.save(); ctx.globalAlpha = ya; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 16;
    ctx.font = '44px "Instrument Serif"'; ctx.fillStyle = C.cream; ctx.fillText('today', e0[0], e0[1] - 22); ctx.fillStyle = C.cyanW; ctx.fillText('2030', e1[0], e1[1] - 22); ctx.restore();
    // sub-second ticks inside it, like the grain of the second
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.cyanW, 0.55 * lsA); ctx.lineWidth = 1.4;
    for (let i = 1; i < 10; i++) { const a = LASTS + i / 10 / DAY, p = proj(cm, pt(a, R)); ctx.beginPath(); ctx.moveTo(p[0], p[1] + 6); ctx.lineTo(p[0], p[1] + (i === 5 ? 34 : 20)); ctx.stroke(); }
    ctx.restore();
  }

  // ---- rim ----
  const rimPath = (c, a0, a1) => { if (full) { if (a1 - a0 > 0.9995) c.arc(cen[0], cen[1], s * R, 0, 7); else c.arc(cen[0], cen[1], s * R, ang(a0), ang(a1)); } else arcPoly(c, cm, R, Math.max(a0, va0), Math.min(a1, va1), 40); };
  ctx.save(); ctx.strokeStyle = rgba(C.lav, 0.22); ctx.lineWidth = 2; ctx.beginPath(); rimPath(ctx, 0, 1); ctx.stroke(); ctx.restore();
  const rimA = Math.max(sw, dive);
  if (rimA > 0) glowStroke(ctx, c => rimPath(c, 0, Math.max(sw, dive > 0 ? 1 : 0)), '#f6d9a8', 2.6, 0.55);

  // ---- ticks at every scale that is legible ----
  const LEV = [{ N: 24 }, { N: 144 }, { N: 1440 }, { N: DAY }, { N: DAY * 10 }];
  ctx.save(); ctx.lineCap = 'round';
  LEV.forEach((lv, li) => {
    const spacing = s * TAU * R / lv.N; if (spacing < 7) return;
    const vis = ramp(spacing, 7, 30), len = 10 + 34 * clamp(Math.log10(spacing / 7) / 2.2);
    const higher = li > 0 ? LEV[li - 1].N : 0, step = higher ? lv.N / higher : 0;
    const i0 = Math.ceil(va0 * lv.N), i1 = Math.floor(va1 * lv.N);
    if (i1 - i0 > 2000) return;
    for (let i = i0; i <= i1; i++) {
      if (step && i % step === 0) continue;
      const a = i / lv.N, swA = full ? ramp(sw, (a % 1) - 0.002, (a % 1) + 0.01) : 1;
      const al = vis * swA * (li === 4 ? 0.0 : 1) * (i > lv.N ? 0.35 : 1) * ramp(t, 147.8, 148.6);
      if (al <= 0.01) continue;
      const p = proj(cm, pt(a, R)), dir = [-Math.cos(ang(a)), -Math.sin(ang(a))];
      ctx.strokeStyle = rgba(C.cream, 0.75 * al); ctx.lineWidth = li === 0 ? 3 : 2;
      ctx.beginPath(); ctx.moveTo(p[0] + dir[0] * 4, p[1] + dir[1] * 4); ctx.lineTo(p[0] + dir[0] * len, p[1] + dir[1] * len); ctx.stroke();
    }
  });
  ctx.restore();

  // ---- numerals and time labels ----
  // hours on the whole dial
  const hA = faceA * (1 - ramp(s, 2.0, 3.2));
  if (hA > 0) {
    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `${Math.round(40 * Math.min(1.6, Math.sqrt(s)))}px "Instrument Serif"`;
    for (let h = 0; h < 24; h += 3) {
      const a = h / 24, swA = h === 0 ? ramp(sw, 0.96, 1) * 0 + 1 : ramp(sw, a - 0.01, a + 0.02);
      const p = proj(cm, pt(a, R * 0.80)); ctx.fillStyle = rgba(C.cream, hA * (0.25 + 0.65 * swA)); ctx.fillText(String(h === 0 ? 24 : h), p[0], p[1]);
    }
    ctx.restore();
  }
  // minute labels near midnight, second labels at the end of the dive
  const timeLabel = (a, txt, al, off) => {
    const p = proj(cm, pt(a, R)), dir = [-Math.cos(ang(a)), -Math.sin(ang(a))];
    ctx.save(); ctx.globalAlpha = al; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '24px "Inter Medium"'; ctx.letterSpacing = '2px';
    ctx.fillStyle = C.lav; ctx.fillText(txt, p[0] + dir[0] * off, p[1] + dir[1] * off); ctx.restore();
  };
  {
    const spacing = s * TAU * R / 144, al = ramp(spacing, 80, 140) * (1 - ramp(s, 60, 140)) * ramp(t, 153.8, 154.6);
    if (al > 0) for (let i = Math.ceil(va0 * 144); i <= Math.min(144, Math.floor(va1 * 144)); i++) { const sec = i * 600; if (i === 144) continue; timeLabel(i / 144, fmtTime(sec), al * 0.9, 74); }
    const sp2 = s * TAU * R / 1440, al2 = ramp(sp2, 150, 260) * ramp(t, 153.8, 154.6) * (1 - ramp(s, 1500, 4000));
    if (al2 > 0) for (let i = Math.ceil(va0 * 1440); i <= Math.min(1440, Math.floor(va1 * 1440)); i++) { if (i % 10 === 0) continue; const sec = i * 60; timeLabel(i / 1440, fmtTime(sec), al2 * 0.8, 74); }
    const sp3 = s * TAU * R / DAY, al3 = ramp(sp3, 220, 420);
    if (al3 > 0) for (let i = Math.ceil(va0 * DAY); i <= Math.min(DAY, Math.floor(va1 * DAY)); i++) {
      const sec = i, h = Math.floor(sec / 3600) % 24, m = Math.floor(sec / 60) % 60, ss = sec % 60, p = v => String(v).padStart(2, '0');
      if (i % DAY !== 0) timeLabel(i / DAY, `${p(h)}:${p(m)}:${p(ss)}`, al3 * 0.75, 84);
    }
  }

  // ---- history: little marks of people, appearing as the hand passes ----
  if (s < 40) {
    for (const g of MARKS) {
      if (g.a < va0 - 0.01 || g.a > va1 + 0.01) continue;
      const k = out((sw - g.a) / 0.04); if (k <= 0) continue;
      const p = proj(cm, pt(g.a, g.r)), z = Math.pow(s, 0.7) * g.sz * 1.3;
      if (p[0] < -60 || p[0] > W + 60 || p[1] < -60 || p[1] > H + 60) continue;
      ctx.save(); ctx.translate(p[0], p[1] - (1 - k) * 8); ctx.scale(z * k, z * k); ctx.rotate(g.rot * 0.3 + 0.05 * Math.sin(t * 0.8 + g.ph));
      ctx.globalAlpha = 0.85 * (1 - 0.6 * dive); glyph(ctx, g, t); ctx.restore();
      if (g.type === 0) light(ctx, p[0], p[1] - 3 * z, 14 * z, C.amber, 0.22 * k * (0.8 + 0.2 * Math.sin(t * 8 + g.ph)) * (1 - dive));
    }
  }
  // writing in the last 24 minutes
  if (s < 200 && slA > 0) {
    WRITING.forEach((g, i) => {
      const k = out((t - 154.6 - i * 0.09) / 0.5); if (k <= 0) return;
      const p = proj(cm, pt(g.a, g.r)), z = Math.pow(s, 0.8) * 1.15;
      if (p[0] < -100 || p[0] > W + 100 || p[1] < -100 || p[1] > H + 100) return;
      ctx.save(); ctx.translate(p[0], p[1] - (1 - k) * 12); ctx.scale(z * k, z * k); ctx.rotate(g.rot + 0.04 * Math.sin(t + i));
      ctx.globalAlpha = (1 - ramp(s, 9, 15)); wglyph(ctx, g); ctx.restore();
    });
  }

  // ---- the clock hand (and the spark it lands on) ----
  {
    const a = t < HAND_T0 ? 0 : sw, tip = proj(cm, pt(a, R * lerp(0.97, 1, ramp(t, 157.1, 158)))), base = proj(cm, [0, 0]);
    const dx = tip[0] - base[0], dy = tip[1] - base[1], d = Math.hypot(dx, dy) || 1, Lh = Math.min(d, 2600);
    const b2 = [tip[0] - dx / d * Lh, tip[1] - dy / d * Lh];
    const handA = ramp(t, 147.7, 148.3);
    if (handA > 0) {
      const col = lsA > 0 ? C.cyanW : '#ffd9a0';
      glowStroke(ctx, c => { c.moveTo(b2[0], b2[1]); c.lineTo(tip[0], tip[1]); }, col, Math.max(2, Math.min(5, 2 + s * 0.5)), 0.7 * handA);
      if (full) { ctx.fillStyle = '#ffd9a0'; ctx.beginPath(); ctx.arc(base[0], base[1], 7 * Math.min(2, s), 0, TAU); ctx.fill(); }
      if (t > HAND_T0 && t < HAND_T1 + 0.4) light(ctx, tip[0], tip[1], 90, C.amber, 0.5 * handA);
    }
    // the spark: this moment
    const sp = proj(cm, pt(1, R)), br = 0.8 + 0.2 * Math.sin(t * 2.6);
    const sA = ramp(t, 144.7, 145.4) * (1 - 0.7 * ramp(t, 157.5, 159));
    const land = Math.exp(-Math.max(0, t - HAND_T1) * 2.5) * (t > HAND_T1 ? 1 : 0);
    const big = 1 + 0.8 * (1 - ramp(t, 147.6, 150));
    light(ctx, sp[0], sp[1], 200 * br * big, C.amber, 0.5 * sA + 0.4 * land);
    light(ctx, sp[0], sp[1], 34 * br * big, '#fff4dc', 0.95 * sA);
  }

  // ---- recent history rushing past during the dive (placed at its true time of day) ----
  for (const ev of EVENTS) {
    const a = 1 - ev.y / 300000, p = proj(cm, pt(a, R)), x = p[0];
    if (x < -120 || x > W + 120 || t < 157.0) continue;
    const spacing = s * TAU * R / DAY * ev.y / 300000 * DAY;   // px between this event and midnight
    const al = ramp(spacing, 150, 300) * (1 - ramp(t, 160.3, 160.8));
    if (al <= 0) continue;
    const y = p[1] + 150;
    ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = rgba(C.amber, 0.6); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, p[1] + 8); ctx.lineTo(x, y - 54); ctx.stroke();
    ctx.translate(x, y); ctx.scale(4.4, 4.4); icon(ctx, ev.k, t); ctx.restore();
    ctx.save(); ctx.globalAlpha = al; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.font = '30px "Inter SemiBold"'; ctx.fillStyle = C.cream; ctx.fillText(ev.lab, x, y + 56); ctx.restore();
    light(ctx, x, y, 90, C.amber, 0.18 * al);
  }

  // ---- speed: faint streaks rushing out of the target during the dive ----
  const sp = Math.sin(Math.PI * clamp((t - 157.3) / 3.3));
  if (sp > 0.02) {
    const tg = proj(cm, SEC);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (let i = 0; i < 46; i++) {
      const ang0 = (i * 2.399) % TAU, ph = ((t * 0.9 + i * 0.137) % 1), d0 = 120 + ph * ph * 1100, d1 = d0 + 40 + 260 * ph;
      const c = Math.cos(ang0), sn = Math.sin(ang0);
      ctx.strokeStyle = rgba(i % 5 ? C.cream : C.cyan, 0.10 * sp * Math.sin(ph * Math.PI)); ctx.lineWidth = 1.2 + ph * 1.5;
      ctx.beginPath(); ctx.moveTo(tg[0] + c * d0, tg[1] + sn * d0); ctx.lineTo(tg[0] + c * d1, tg[1] + sn * d1); ctx.stroke();
    }
    ctx.restore();
  }

  // ---- words ----
  stamp(ctx, t, 150.25, 153.75, '300,000 years', 'the human story, as one day', { size: 104 });
  stamp(ctx, t, 155.35, 157.25, '24 minutes', 'since writing began', { size: 104 });
  stamp(ctx, t, 160.75, T1, '1 second', 'from now until 2030', { size: 104 });
}

module.exports = { T0, T1, draw, grainFill, roundRect, cap, glowStroke, stars, sky, STARS };
