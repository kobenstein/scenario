// "Some of it is code for the next version of that AI."
// A server hall in one-point perspective. The current AI, a luminous cyan disc, pulses as it thinks;
// streams of light pour out of it into a second, larger mind that condenses while a pen of light draws its rim.
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

// ---------- the two minds: luminous discs (an eye-like iris), the new one condensing out of the streams ----------
const R1 = { x: 700, y: 330, r: 64 };
const R2 = { x: 1255, y: 300, r: 150 };
const PEN = { t0: 11.95, t1: T_DONE, a0: -Math.PI / 2 };   // the new disc's rim is drawn in one stroke, closing on "AI"
const penA = t => PEN.a0 + Math.PI * 2 * L.ease((t - PEN.t0) / (PEN.t1 - PEN.t0));
const STREAMS = (() => { const r = rng(77), a = [];
  for (let i = 0; i < 34; i++) { const a1 = -1.1 + r() * 2.2; a.push({ a1, pen: r() < 0.3, ta: Math.PI - a1 * 1.2 + (r() - 0.5) * 0.5, c1: (r() - 0.5) * 70, c2: (r() - 0.5) * 90, d: r() * 0.5, sp: 180 + r() * 260, w: 0.6 + r() * 1.3 }); }
  return a; })();
const onRim = (R, a, k = 1) => [R.x + Math.cos(a) * R.r * k, R.y + Math.sin(a) * R.r * k];
const FIB = (() => { const r = rng(31), a = []; for (let i = 0; i < 90; i++) a.push({ a: i / 90 * Math.PI * 2 + r() * 0.05, r0: 0.3 + r() * 0.08, r1: 0.62 + r() * 0.3, al: 0.25 + r() * 0.5, w: 0.6 + r() * 0.9 }); return a; })();

function glowStroke(ctx, path, col, w, a) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const [mw, ma] of [[5, 0.10], [2.4, 0.28], [1, 1]]) { ctx.strokeStyle = rgba(col, a * ma); ctx.lineWidth = w * mw; ctx.beginPath(); path(ctx); ctx.stroke(); }
  ctx.restore();
}

// one mind: a deep cyan disc with a bright core, iris fibres turning slowly, a soft inner ring and a thin bright rim
function orb(ctx, R, t, k, a, spin, think) {
  const r = R.r * k; if (r < 1 || a <= 0) return;
  const br = 0.5 + 0.5 * Math.sin(t * 2.1 + R.x);
  light(ctx, R.x, R.y, r * 3.2, C.cyan, (0.16 + 0.06 * br) * a);
  ctx.save(); ctx.globalAlpha = a;
  grainFill(ctx, c => c.arc(R.x, R.y, r, 0, Math.PI * 2),
    rad(ctx, R.x - r * 0.12, R.y - r * 0.14, r * 0.05, r, [[0, '#e9fbff'], [0.18, '#a8eeff'], [0.45, '#2aa6c8'], [0.78, '#0a5a78'], [1, '#062c46']]), 0.35);
  // iris fibres
  ctx.save(); ctx.beginPath(); ctx.arc(R.x, R.y, r * 0.97, 0, Math.PI * 2); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const f of FIB) { const ang = f.a + spin, wob = 0.04 * Math.sin(t * 1.3 + f.a * 5);
    ctx.strokeStyle = rgba(C.cyanW, f.al * (0.35 + 0.25 * think) * a); ctx.lineWidth = f.w * Math.max(0.6, r / 120);
    ctx.beginPath(); ctx.moveTo(R.x + Math.cos(ang) * r * f.r0, R.y + Math.sin(ang) * r * f.r0); ctx.lineTo(R.x + Math.cos(ang + wob) * r * f.r1, R.y + Math.sin(ang + wob) * r * f.r1); ctx.stroke(); }
  // thinking: soft ripples moving out from the core
  for (let i = 0; i < 2; i++) { const ph = (t * 0.7 + i / 2) % 1; ctx.strokeStyle = rgba(C.cyanW, 0.35 * think * Math.sin(ph * Math.PI)); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(R.x, R.y, r * (0.32 + 0.6 * ph), 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
  // core and rim
  light(ctx, R.x, R.y, r * 0.55, C.cyanW, 0.55 + 0.2 * br);
  ctx.restore();
}

function ring1(ctx, t, think) {
  orb(ctx, R1, t, 1 + 0.025 * Math.sin(t * 6.2) * think, 1, t * 0.25, think);
  glowStroke(ctx, c => c.arc(R1.x, R1.y, R1.r + 1, 0, Math.PI * 2), C.cyanW, 1.6, 0.7);
}

function ring2(ctx, t, rot) {
  const done = ramp(t, T_DONE - 0.05, T_DONE + 0.1), flash = Math.exp(-Math.max(0, t - T_DONE) * 3.2) * (t >= T_DONE - 0.03 ? 1 : 0);
  const build = L.ease((t - PEN.t0) / (PEN.t1 - PEN.t0 + 0.2));
  // the disc condenses as light pours in: it grows from a glow into a full, solid mind
  if (t > PEN.t0) orb(ctx, R2, t, 0.55 + 0.45 * build + 0.03 * flash, Math.min(1, build * 1.3), -t * 0.18 + rot, 0.4 + 0.6 * done);
  // the rim, drawn by a pen of light in one sweep (once closed, a full arc must start at 0 or @napi-rs/canvas draws nothing)
  if (t > PEN.t0) { const a1 = Math.min(penA(t), PEN.a0 + Math.PI * 2);
    glowStroke(ctx, c => a1 >= PEN.a0 + Math.PI * 2 - 1e-3 ? c.arc(R2.x, R2.y, R2.r + 2, 0, Math.PI * 2) : c.arc(R2.x, R2.y, R2.r + 2, PEN.a0, Math.max(PEN.a0 + 0.001, a1)), C.cyanW, 2.4 * (1 + 0.5 * flash), 0.85 + 0.15 * done);
    if (t < PEN.t1) { const pp = onRim({ x: R2.x, y: R2.y, r: R2.r + 2 }, a1); light(ctx, pp[0], pp[1], 26, C.cyanW, 0.9); light(ctx, pp[0], pp[1], 70, C.cyan, 0.3); } }
  // its light: the brightest thing in the frame once it closes
  light(ctx, R2.x, R2.y, 360 + 120 * done, C.cyan, 0.08 + 0.16 * build + 0.08 * done * (0.5 + 0.5 * Math.sin(t * 3.4)) + 0.3 * flash);
  if (flash > 0.01) glowStroke(ctx, c => c.arc(R2.x, R2.y, R2.r * (1.05 + (1 - flash) * 0.7), 0, Math.PI * 2), C.cyanW, 2, flash * 0.5);
}

function streams(ctx, t, rot) {
  if (t < T_STREAM) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const settle = ramp(t, T_DONE, T_DONE + 1.2);
  for (const st of STREAMS) {
    const grow = out((t - T_STREAM - st.d * 0.8) / 0.7); if (grow <= 0) continue;
    const ta = st.pen && t < PEN.t1 && t > PEN.t0 ? penA(t) : st.ta;
    const p0 = onRim(R1, st.a1), p3 = onRim(R2, ta, 0.98), p1 = [p0[0] + 200, R1.y + (p0[1] - R1.y) * 0.4 + st.c1], p2 = [p3[0] - 250, R2.y + (p3[1] - R2.y) * 0.55 + st.c2];
    const N = 36, n = Math.max(2, Math.floor(N * grow));
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const u = i / N, v = 1 - u;
      const x = v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], y = v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1];
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    const a = (st.pen ? 0.45 : 0.26) * (1 - 0.5 * settle);
    ctx.setLineDash([]); ctx.strokeStyle = rgba(C.cyan, a * 0.4); ctx.lineWidth = st.w; ctx.stroke();
    // packets of light flowing along it toward the new mind
    ctx.setLineDash([14 + st.w * 10, 46 + st.d * 60]); ctx.lineDashOffset = -t * st.sp; ctx.strokeStyle = rgba(C.cyanW, a * 1.4); ctx.lineWidth = st.w + 0.8; ctx.stroke();
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

module.exports = { T0, T1, draw, orb };
