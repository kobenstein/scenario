// "Some of it is code for the next version of that AI."
// A server hall in one-point perspective. The current AI, a cyan ring, pulses as it thinks;
// streams of light pour out of it and draw a second, larger, brighter ring stroke by stroke.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, out, clamp, label } = L;

const T0 = 11.3, T1 = 15.35;
const T_STREAM = 11.6, T_DONE = 13.88;   // streams start / new ring closes on "AI"


// same look as lib grainFill, but the speckle only covers the path's bounding box (far cheaper per frame)
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

// ---------- the hall, one-point perspective ----------
const VP = [960, 400], F = 700, AW = 4.2, YTOP = -1.0, YFLOOR = 8.3, YCEIL = -10;
const P = (X, Y, z) => [VP[0] + X * F / z, VP[1] + Y * F / z];
const RACKS = (() => { const r = rng(12), a = [];
  for (const side of [-1, 1]) { let z = 2.6; let i = 0;
    while (z < 34) { const w = 1.15; a.push({ side, z0: z, z1: z + w, i: i++, units: 30, seed: r() * 1000, tone: r() }); z += w + 0.12 + (r() < 0.12 ? 1.2 : 0); } }
  return a.sort((p, q) => q.z0 - p.z0); })();

function quad(ctx, a, b, c, d) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); }

function hall(ctx, t, glow) {
  // whole backdrop
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, '#05061a'], [0.4, '#0d1236'], [1, '#090b22']]); ctx.fillRect(-300, -300, W + 600, H + 600);
  // far end: misty light
  light(ctx, VP[0], VP[1] + 60, 420, '#4a9cc4', 0.45);
  light(ctx, VP[0], VP[1] - 120, 600, '#2a4f8a', 0.25);
  // back wall far down the aisle: a cross row of racks under a misty light
  { const zb = 36, a0 = P(-AW - 2, YCEIL, zb), a1 = P(AW + 2, YFLOOR, zb);
    ctx.fillStyle = lin(ctx, 0, a0[1], 0, a1[1], [[0, '#101a44'], [0.55, '#2a5a8a'], [1, '#183a66']]); ctx.fillRect(a0[0], a0[1], a1[0] - a0[0], a1[1] - a0[1]);
    for (let i = 0; i < 9; i++) { const X0 = -AW + i * 0.95, q0 = P(X0, YTOP + 1.5, zb - 0.5), q1 = P(X0 + 0.85, YFLOOR, zb - 0.5);
      ctx.fillStyle = '#0f1a40'; ctx.fillRect(q0[0], q0[1], q1[0] - q0[0], q1[1] - q0[1]);
      for (let u = 0; u < 14; u++) if (hash(i, u, Math.floor(t * (2 + (i % 3)))) > 0.5) { ctx.fillStyle = rgba(C.cyan, 0.7); ctx.fillRect(q0[0] + 2 + (u % 2) * 6, q0[1] + 4 + u * (q1[1] - q0[1] - 8) / 14, 2, 1.2); } }
    const rail = P(0, YTOP + 0.8, zb - 1); ctx.fillStyle = 'rgba(6,8,24,0.8)'; ctx.fillRect(a0[0], rail[1], a1[0] - a0[0], 3);
    light(ctx, VP[0], rail[1] - 20, 160, C.cyan, 0.18 + 0.04 * Math.sin(t * 1.3)); }
  // upper walls (above the racks) with pillars, and the ceiling trusses
  for (const s of [-1, 1]) {
    grainFill(ctx, c => { const a = P(s * AW, YCEIL, 2), b = P(s * AW, YCEIL, 40), d = P(s * AW, YTOP, 2), e = P(s * AW, YTOP, 40); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(e[0], e[1]); c.lineTo(d[0], d[1]); c.closePath(); },
      lin(ctx, s < 0 ? 0 : W, 0, VP[0], 0, [[0, '#0a0c26'], [1, '#1c2458']]), 0.55);
    for (let z = 3; z < 38; z += 3.2) { const a = P(s * AW, YCEIL, z), b = P(s * AW, YTOP, z); ctx.strokeStyle = 'rgba(6,7,22,0.9)'; ctx.lineWidth = Math.max(1, 90 / z); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  }
  // ceiling plane
  grainFill(ctx, c => { const a = P(-AW, YCEIL, 2), b = P(AW, YCEIL, 2), d = P(AW, YCEIL, 40), e = P(-AW, YCEIL, 40); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]); c.lineTo(e[0], e[1]); c.closePath(); },
    lin(ctx, 0, 0, 0, VP[1], [[0, '#070818'], [1, '#141a46']]), 0.55);
  for (let z = 3; z < 38; z += 3.2) { const a = P(-AW, YCEIL, z), b = P(AW, YCEIL, z); ctx.strokeStyle = 'rgba(30,40,90,0.7)'; ctx.lineWidth = Math.max(1, 70 / z); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    // a cable tray light strip under each truss
    const c1 = P(-0.6, YCEIL + 0.3, z), c2 = P(0.6, YCEIL + 0.3, z); ctx.strokeStyle = rgba(C.cyan, 0.25 * Math.min(1, 8 / z)); ctx.lineWidth = Math.max(1, 30 / z); ctx.beginPath(); ctx.moveTo(c1[0], c1[1]); ctx.lineTo(c2[0], c2[1]); ctx.stroke(); }
  // floor
  grainFill(ctx, c => { const a = P(-AW, YFLOOR, 1), b = P(AW, YFLOOR, 1), d = P(AW, YFLOOR, 40), e = P(-AW, YFLOOR, 40); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]); c.lineTo(e[0], e[1]); c.closePath(); },
    lin(ctx, 0, VP[1], 0, H, [[0, '#2a3a78'], [0.4, '#1a2152'], [1, '#0b0d26']]), 0.5);
  ctx.strokeStyle = 'rgba(120,150,230,0.08)'; ctx.lineWidth = 1.5;
  for (let X = -AW; X <= AW + 0.01; X += 1.05) { const a = P(X, YFLOOR, 1.2), b = P(X, YFLOOR, 40); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  for (let z = 2; z < 40; z *= 1.12) { const a = P(-AW, YFLOOR, z), b = P(AW, YFLOOR, z); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  // the rings light the floor
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.translate(VP[0] + 60, 690); ctx.scale(1, 0.22); ctx.fillStyle = rad(ctx, 0, 0, 0, 640, [[0, rgba(C.cyan, 0.16 * glow)], [1, rgba(C.cyan, 0)]]); ctx.fillRect(-640, -640, 1280, 1280);
  ctx.restore();
  // rack rows
  for (const rk of RACKS) rack(ctx, t, rk, glow);
}

function rack(ctx, t, rk, glow) {
  const X = rk.side * AW, a = P(X, YTOP, rk.z0), b = P(X, YTOP, rk.z1), c = P(X, YFLOOR, rk.z1), d = P(X, YFLOOR, rk.z0);
  if (Math.max(a[0], b[0]) < -200 && rk.side < 0) return;
  const fade = clamp((rk.z0 - 2) / 30);       // atmospheric: far racks melt into the haze
  const base = rk.tone < 0.5 ? '#111538' : '#0d1030';
  grainFill(ctx, cc => quad(cc, a, b, c, d), lin(ctx, a[0], 0, b[0], 0, [[0, base], [1, rgba('#2a3570', 0.4 + 0.6 * fade)]]), 0.45);
  // side edge (the slice of the rack's depth we see between racks)
  const a2 = P(rk.side * (AW + 1.6), YTOP, rk.z0), d2 = P(rk.side * (AW + 1.6), YFLOOR, rk.z0);
  ctx.fillStyle = '#05061a'; quad(ctx, a, a2, d2, d); ctx.fill();
  ctx.strokeStyle = rgba('#5a6ab8', 0.25 + 0.2 * fade); ctx.lineWidth = Math.max(0.8, 60 / rk.z0 * 0.2);
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(d[0], d[1]); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  // door frame and mesh: a few vertical rails down the face
  ctx.strokeStyle = 'rgba(4,5,18,0.5)'; ctx.lineWidth = Math.max(0.6, 40 / rk.z0 * 0.25);
  for (const f of [0.08, 0.5, 0.56, 0.92]) { const zz = lerp(rk.z0, rk.z1, f), p1 = P(X, YTOP + 0.2, zz), p2 = P(X, YFLOOR - 0.3, zz); ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke(); }
  // unit lines + blinking LEDs
  const n = rk.units, zA = rk.z0 + 0.12, zB = rk.z1 - 0.12, s = F / ((rk.z0 + rk.z1) / 2);
  const ledR = Math.max(0.7, s * 0.022);
  ctx.strokeStyle = 'rgba(4,5,18,0.55)'; ctx.lineWidth = Math.max(0.6, s * 0.012);
  for (let u = 1; u < n; u++) { const Y = lerp(YTOP + 0.3, YFLOOR - 0.5, u / n), p1 = P(X, Y, zA), p2 = P(X, Y, zB); ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke(); }
  for (let u = 0; u < n; u++) {
    const Y = lerp(YTOP + 0.3, YFLOOR - 0.5, (u + 0.5) / n);
    for (let k = 0; k < 6; k++) {
      const hsh = hash(rk.seed, u, k), rate = 1 + hsh * 6, on = hash(rk.seed, u, k, Math.floor(t * rate + hsh * 10)) > 0.45;
      if (!on && hsh > 0.25) continue;
      const zz = lerp(zA + 0.08, zB - 0.08, k < 3 ? k * 0.09 : 0.62 + (k - 3) * 0.12), p = P(X, Y, zz);
      const col = hsh < 0.08 ? C.amber : hsh < 0.3 ? C.cyanW : C.cyan;
      ctx.fillStyle = rgba(col, on ? 0.95 : 0.25); ctx.fillRect(p[0] - ledR, p[1] - ledR * 0.6, ledR * 2, ledR * 1.2);
    }
  }
  // cyan wash from the rings on the rack faces nearest to them
  const mid = P(X, 0, (rk.z0 + rk.z1) / 2);
  ctx.save(); quad(ctx, a, b, c, d); ctx.clip(); light(ctx, mid[0], 330, 380, C.cyan, 0.10 * glow * (1 - fade * 0.5)); ctx.restore();
}

// ---------- the rings ----------
const R1 = { x: 700, y: 330, rx: 58, ry: 86 };
const R2 = { x: 1255, y: 305, rx: 118, ry: 182 };
// strokes of the new ring: each is drawn by a pen travelling round the ellipse; the last closes on "AI"
const STROKES = [
  { k: 1.00, w: 7, t0: 11.95, t1: 13.05, a0: -1.6, dash: null },
  { k: 0.90, w: 2.5, t0: 12.20, t1: 13.30, a0: 1.2, dash: null },
  { k: 1.10, w: 2, t0: 12.45, t1: 13.55, a0: 2.6, dash: [10, 8] },
  { k: 0.82, w: 1.5, t0: 12.70, t1: 13.70, a0: -0.4, dash: [3, 6] },
  { k: 1.19, w: 3, t0: 12.85, t1: T_DONE, a0: 0.5, dash: [40, 14, 6, 14] },
];
const STREAMS = (() => { const r = rng(77), a = [];
  for (let i = 0; i < 40; i++) { const a1 = -1.15 + r() * 2.3, back = r() < 0.3; a.push({ a1, tgt: i % STROKES.length, pen: r() < 0.3, ta: back ? a1 * 1.3 : Math.PI - a1 * 1.35, c1: (r() - 0.5) * 70, c2: (r() - 0.5) * 90, d: r() * 0.5, sp: 180 + r() * 260, w: 0.6 + r() * 1.4 }); }
  return a; })();
const ell = (R, k, a, rot = 0) => { const x = Math.cos(a) * R.rx * k, y = Math.sin(a) * R.ry * k; return [R.x + x * Math.cos(rot) - y * Math.sin(rot), R.y + x * Math.sin(rot) + y * Math.cos(rot)]; };
const penA = (s, t) => s.a0 + Math.PI * 2 * L.ease((t - s.t0) / (s.t1 - s.t0));

function glowStroke(ctx, path, col, w, a) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const [mw, ma] of [[5, 0.10], [2.4, 0.28], [1, 1]]) { ctx.strokeStyle = rgba(col, a * ma); ctx.lineWidth = w * mw; ctx.beginPath(); path(ctx); ctx.stroke(); }
  ctx.restore();
}

function ring1(ctx, t, think) {
  const p = 0.5 + 0.5 * Math.sin(t * 6.2), q = 0.5 + 0.5 * Math.sin(t * 2.3 + 1);
  light(ctx, R1.x, R1.y, 210, C.cyan, 0.18 + 0.12 * p * think);
  glowStroke(ctx, c => c.ellipse(R1.x, R1.y, R1.rx, R1.ry, 0, 0, 7), C.cyan, 6 + 1.5 * p, 0.75 + 0.25 * p);
  glowStroke(ctx, c => c.ellipse(R1.x, R1.y, R1.rx - 3, R1.ry - 4, 0, 0, 7), C.cyanW, 1.6, 0.6 + 0.4 * p);
  // inner thought: rotating arcs and sparks circulating
  // thinking: ripples rising from the centre to the rim, again and again
  for (let k = 0; k < 3; k++) { const ph = (t * 0.9 + k / 3) % 1;
    glowStroke(ctx, c => c.ellipse(R1.x, R1.y, R1.rx * (0.25 + 0.7 * ph), R1.ry * (0.25 + 0.7 * ph), 0, 0, 7), C.cyan, 1.1, 0.4 * think * Math.sin(ph * Math.PI)); }
  for (let i = 0; i < 10; i++) { const a = t * (2 + i * 0.13) + i * 0.63, pt = ell(R1, 1 + 0.06 * Math.sin(t * 3 + i), a); light(ctx, pt[0], pt[1], 7, C.cyanW, 0.6 * (0.5 + 0.5 * Math.sin(t * 9 + i))); }
}

function ring2(ctx, t, rot) {
  const done = ramp(t, T_DONE - 0.05, T_DONE + 0.1), flash = Math.exp(-Math.max(0, t - T_DONE) * 3.2) * (t >= T_DONE - 0.03 ? 1 : 0);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.4);
  let drawn = 0;
  // faint construction guide: where the new ring will be, sketched in before the strokes arrive
  const g = ramp(t, 11.65, 12.2) * (1 - 0.7 * ramp(t, 13.2, T_DONE));
  if (g > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.setLineDash([3, 8]); ctx.lineDashOffset = t * 8; ctx.strokeStyle = rgba(C.cyan, 0.6 * g); ctx.lineWidth = 2;
    for (const k of [1, 1.19]) { ctx.beginPath(); ctx.ellipse(R2.x, R2.y, R2.rx * k, R2.ry * k, rot, 0, 7); ctx.stroke(); }
    ctx.setLineDash([]); ctx.strokeStyle = rgba(C.cyan, 0.18 * g); ctx.beginPath(); ctx.moveTo(R2.x - R2.rx * 1.4, R2.y); ctx.lineTo(R2.x + R2.rx * 1.4, R2.y); ctx.moveTo(R2.x, R2.y - R2.ry * 1.3); ctx.lineTo(R2.x, R2.y + R2.ry * 1.3); ctx.stroke();
    ctx.restore(); }
  for (const s of STROKES) {
    if (t < s.t0) continue;
    const a0 = s.a0, a1 = penA(s, t); drawn += (a1 - a0) / (Math.PI * 2) / STROKES.length;
    const R = { x: R2.x, y: R2.y, rx: R2.rx * s.k, ry: R2.ry * s.k };
    const path = c => { if (s.dash) c.setLineDash(s.dash); else c.setLineDash([]); c.lineDashOffset = -t * 20 * (s.k > 1 ? 1 : -1); c.ellipse(R.x, R.y, R.rx, R.ry, rot * (s.k > 1 ? 1 : -0.6), a0, a1); };
    glowStroke(ctx, path, s.k === 1 ? C.cyanW : C.cyan, s.w * (1 + 0.35 * flash), (0.75 + 0.25 * done) * (1 + 0.6 * flash));
    ctx.setLineDash([]);
    if (a1 - a0 < Math.PI * 2 - 0.01) { const pp = ell(R, 1, a1, rot * (s.k > 1 ? 1 : -0.6)); light(ctx, pp[0], pp[1], 26, C.cyanW, 0.9); light(ctx, pp[0], pp[1], 70, C.cyan, 0.3); }
  }
  // tick marks around the outside once the ring exists
  const tk = ramp(t, 12.9, T_DONE);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.cyan, 0.55 * tk); ctx.lineWidth = 1.5;
  for (let i = 0; i < 72; i++) { if (i / 72 > tk) break; const a = i / 72 * Math.PI * 2 + rot * 0.5, p1 = ell(R2, 1.27, a), p2 = ell(R2, i % 6 ? 1.30 : 1.35, a); ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke(); }
  ctx.restore();
  // its light: grows as it is built, flares on completion, then breathes. The brightest thing in the frame.
  light(ctx, R2.x, R2.y, 320 + 120 * done, C.cyan, 0.10 + 0.22 * drawn + 0.10 * done * pulse + 0.35 * flash);
  light(ctx, R2.x, R2.y, 160, C.cyanW, 0.08 * done + 0.3 * flash);
  if (flash > 0.01) glowStroke(ctx, c => c.ellipse(R2.x, R2.y, R2.rx * (1.2 + (1 - flash) * 0.9), R2.ry * (1.2 + (1 - flash) * 0.9), 0, 0, 7), C.cyanW, 2, flash * 0.6);
}

function streams(ctx, t, rot) {
  if (t < T_STREAM) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const settle = ramp(t, T_DONE, T_DONE + 1.2);
  for (const st of STREAMS) {
    const grow = out((t - T_STREAM - st.d * 0.8) / 0.7); if (grow <= 0) continue;
    const s = STROKES[st.tgt], R = { x: R2.x, y: R2.y, rx: R2.rx * s.k, ry: R2.ry * s.k };
    const ta = st.pen && t < s.t1 ? Math.max(penA(s, t), s.a0) : st.ta;
    const p0 = ell(R1, 1, st.a1), p3 = ell(R, 1, ta, rot), p1 = [p0[0] + 200, R1.y + (p0[1] - R1.y) * 0.4 + st.c1], p2 = [p3[0] - 250, R2.y + (p3[1] - R2.y) * 0.55 + st.c2];
    const N = 36, n = Math.max(2, Math.floor(N * grow));
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const u = i / N, v = 1 - u;
      const x = v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], y = v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1];
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    const a = (st.pen ? 0.5 : 0.28) * (1 - 0.45 * settle);
    ctx.setLineDash([]); ctx.strokeStyle = rgba(C.cyan, a * 0.45); ctx.lineWidth = st.w; ctx.stroke();
    // packets of light flowing along it toward the new ring
    ctx.setLineDash([14 + st.w * 10, 46 + st.d * 60]); ctx.lineDashOffset = -t * st.sp; ctx.strokeStyle = rgba(C.cyanW, a * 1.5); ctx.lineWidth = st.w + 0.8; ctx.stroke();
  }
  ctx.restore(); ctx.setLineDash([]);
}

// ---------- the engineer, seen from behind, far below ----------
function engineer(ctx, x, y, h, t, lookX, lookUp) {
  const u = h / 100, br = Math.sin(t * 1.9), shift = Math.sin(t * 0.6) * 0.8;
  ctx.save(); ctx.translate(x, y); ctx.scale(u, u);
  // warm pool of light on the floor around the engineer
  ctx.save(); ctx.scale(1, 0.18); light(ctx, 0, -10, 150, C.amber, 0.28); ctx.restore();
  ctx.fillStyle = 'rgba(4,4,16,0.45)'; ctx.beginPath(); ctx.ellipse(-4, 0, 26, 5, 0, 0, 7); ctx.fill();
  // legs
  ctx.lineCap = 'round'; ctx.strokeStyle = '#3a1c0e'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(-5 + shift, -48); ctx.lineTo(-8, -2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(5 + shift, -48); ctx.lineTo(8, -2); ctx.stroke();
  // coat
  const sx = shift, coat = c => { c.moveTo(-13 + sx, -38); c.bezierCurveTo(-14 + sx, -60, -15 + sx, -76, -12 + sx, -82 - br * 0.5); c.quadraticCurveTo(0 + sx, -88 - br * 0.6, 12 + sx, -82 - br * 0.5);
    c.bezierCurveTo(15 + sx, -76, 14 + sx, -60, 13 + sx, -38); c.quadraticCurveTo(0 + sx, -35, -13 + sx, -38); c.closePath(); };
  ctx.save(); ctx.translate(0, -1.2); grainFill(ctx, coat, rgba(C.cyan, 0.8), 0); ctx.restore();   // cyan rim from above
  grainFill(ctx, coat, lin(ctx, 0, -86, 0, -36, [[0, '#ffb35c'], [0.55, '#d27a34'], [1, '#7a3b17']]), 0.4);
  ctx.strokeStyle = 'rgba(90,40,14,0.6)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(sx, -80); ctx.lineTo(sx, -40); ctx.stroke();
  // arms hanging, slightly behind
  ctx.strokeStyle = '#b8642a'; ctx.lineWidth = 5.5;
  ctx.beginPath(); ctx.moveTo(-12 + sx, -78); ctx.quadraticCurveTo(-17 + sx, -62, -15 + sx, -48); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12 + sx, -78); ctx.quadraticCurveTo(17 + sx, -62, 15 + sx, -48); ctx.stroke();
  // head: from behind, tilted up and turned toward whichever ring holds its attention
  ctx.save(); ctx.translate(sx + lookX * 2, -86 - br * 0.6); ctx.rotate(lookX * 0.18);
  ctx.fillStyle = '#a35626'; ctx.fillRect(-3.5, -6, 7, 7);
  const hy = -12 + lookUp * 1.5;
  grainFill(ctx, c => c.ellipse(lookX * 1.5, hy, 7.6, 8.6 - lookUp * 1.2, 0, 0, 7), '#3a1a0b', 0.25);
  // the cyan catching the hair edge as the head tilts up
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.cyan, 0.5 + 0.3 * lookUp); ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.ellipse(lookX * 1.5, hy, 7.4, 8.4 - lookUp * 1.2, 0, Math.PI * 1.1 + lookX * 0.4, Math.PI * 1.9 + lookX * 0.4); ctx.stroke(); ctx.restore();
  // ear on the side it turns from
  ctx.fillStyle = '#b8642a'; ctx.beginPath(); ctx.ellipse(-lookX * 7.5, hy + 1, 1.8, 3, 0, 0, 7); ctx.fill();
  ctx.restore();
  ctx.restore();
}

// dust drifting in the light
const DUST = (() => { const r = rng(9), a = []; for (let i = 0; i < 90; i++) a.push({ x: r() * W, y: r() * 800, s: 1 + r() * 2.2, sp: 4 + r() * 10, ph: r() * 6 }); return a; })();

function draw(ctx, t) {
  const z = lerp(1.0, 1.09, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 5) * 6, dy = drift(t, 1, 6) * 4;
  const fx = 1000, fy = 360;
  const layer = (par, fn) => { const zz = 1 + (z - 1) * (0.5 + par * 0.5);
    ctx.save(); ctx.translate(fx, fy); ctx.scale(zz, zz); ctx.translate(-fx + dx * par, -fy + dy * par); fn(); ctx.restore(); };
  const glow = 0.7 + 0.3 * ramp(t, 12, T_DONE) + 0.4 * Math.exp(-Math.max(0, t - T_DONE) * 3) * (t > T_DONE ? 1 : 0);
  const rot = 0.06 * Math.sin(t * 0.4) + 0.02 * (t - T0);
  layer(0.4, () => hall(ctx, t, glow));
  layer(0.7, () => {
    streams(ctx, t, rot);
    ring1(ctx, t, 0.6 + 0.4 * ramp(t, T_STREAM, 12));
    ring2(ctx, t, rot);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const d of DUST) { const x = (d.x + Math.sin(t * 0.3 + d.ph) * 30 + t * d.sp) % W, y = d.y + Math.sin(t * 0.5 + d.ph) * 20; const near = Math.max(0, 1 - Math.hypot(x - 980, y - 320) / 700);
      ctx.fillStyle = rgba(C.cyanW, 0.35 * near * (0.5 + 0.5 * Math.sin(t * 2 + d.ph))); ctx.fillRect(x, y, d.s, d.s); }
    ctx.restore();
  });
  // the engineer looks from the old ring to the new one as it is built
  const follow = L.ease((t - 12.1) / 1.4);
  layer(1.0, () => engineer(ctx, 960, 925, 122, t, lerp(-0.8, 0.9, follow), 0.8 + 0.2 * ramp(t, 13.6, 14.2)));
  label(ctx, t, 12.6, T1 - 0.1, 'the next version', null, 1445, 520, { color: C.cyan });
}

module.exports = { T0, T1, draw };
