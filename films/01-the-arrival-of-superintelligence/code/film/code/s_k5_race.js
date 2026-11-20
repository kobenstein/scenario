// "This year they graded their own story. Reality was moving at roughly two thirds of its pace."
// A night stadium under one floodlight. Two runners leave the same start line: a ghost runner drawn in dashed
// paper lines (the story) and a solid amber runner (reality). Reality keeps falling behind; on "two thirds"
// a ruler under the track marks where it is: two thirds of the way to the story.
// This file also exports the shared helpers used by the other s_k5_* scenes.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, stamp, label, out, ease } = L;

const T0 = 257.5, T1 = 264.4;

// ---------------------------------------------------------------- shared helpers
// grainFill whose speckle only covers the path's bounding box (same look as lib, far cheaper)
const BB = { b: null, p(x, y) { const b = this.b; if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; },
  moveTo(x, y) { this.p(x, y); }, lineTo(x, y) { this.p(x, y); }, quadraticCurveTo(a, b, x, y) { this.p(a, b); this.p(x, y); },
  bezierCurveTo(a, b, c, d, x, y) { this.p(a, b); this.p(c, d); this.p(x, y); }, rect(x, y, w, h) { this.p(x, y); this.p(x + w, y + h); },
  arc(x, y, r) { this.p(x - r, y - r); this.p(x + r, y + r); }, ellipse(x, y, rx, ry) { const r = Math.max(rx, ry); this.p(x - r, y - r); this.p(x + r, y + r); },
  arcTo(a, b, x, y) { this.p(a, b); this.p(x, y); }, closePath() {}, beginPath() {}, roundRect(x, y, w, h) { this.p(x, y); this.p(x + w, y + h); } };
const PAT = new WeakMap();
function pat(ctx) { let p = PAT.get(ctx); if (!p) { p = ctx.createPattern(L.tex().dark, 'repeat'); PAT.set(ctx, p); } return p; }
function grainFill(ctx, pathFn, fill, grain = 0.5) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    BB.b = [1e9, 1e9, -1e9, -1e9]; pathFn(BB); const b = BB.b;
    ctx.clip(); ctx.globalAlpha *= grain; ctx.fillStyle = pat(ctx);
    const m = ctx.getTransform().invertSelf(); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [px, py] of [[0, 0], [W, 0], [0, H], [W, H]]) { const x = m.a * px + m.c * py + m.e, y = m.b * px + m.d * py + m.f; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    x0 = Math.max(x0, b[0] - 2); y0 = Math.max(y0, b[1] - 2); x1 = Math.min(x1, b[2] + 2); y1 = Math.min(y1, b[3] + 2);
    if (x1 > x0 && y1 > y0) ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
  ctx.restore();
}
function roundRect(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0); c.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  c.arc(x1, y1, r1, n, n - Math.PI, true); c.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0); c.arc(x0, y0, r0, n + Math.PI, n, true); c.closePath();
}
function curve(c, pts, move = true) {
  if (move) c.moveTo(pts[0][0], pts[0][1]); else c.lineTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) { const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]; c.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]); }
  const e = pts[pts.length - 1]; c.lineTo(e[0], e[1]);
}
function glowStroke(ctx, path, col, w, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [mw, ma] of [[5, 0.10], [2.4, 0.28], [1, 1]]) { ctx.strokeStyle = rgba(col, Math.min(1, a * ma)); ctx.lineWidth = w * mw; ctx.beginPath(); path(ctx); ctx.stroke(); }
  ctx.restore();
}
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn, S = 1) {
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}
// camera: slow push toward (fx, fy) plus drift; layer(par, fn) draws with parallax
function cam(ctx, t, t0, t1, z0, z1, fx, fy, seed, zfn) {
  const z = zfn ? zfn(t) : lerp(z0, z1, sm((t - t0) / (t1 - t0)));
  const dx = drift(t, 1, seed) * 6, dy = drift(t, 1, seed + 1) * 4;
  return (par, fn) => { const zz = 1 + (z - 1) * (0.55 + par * 0.45);
    ctx.save(); ctx.translate(fx, fy); ctx.scale(zz, zz); ctx.translate(-fx + dx * par, -fy + dy * par); fn(); ctx.restore(); };
}
// small uppercase tag text (Inter), e.g. a name tag following an object
function tag(ctx, text, x, y, a, opt = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.font = `${opt.size ?? 22}px "Inter Medium"`; ctx.letterSpacing = `${opt.ls ?? 5}px`; ctx.textAlign = opt.align ?? 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(4,4,16,0.85)'; ctx.shadowBlur = 14; ctx.fillStyle = opt.color ?? C.cream; ctx.fillText(text, x, y); ctx.restore();
}
// a warm hand, palm down, fingers pointing +x, wrist/sleeve toward -x (from s_contract, sleeve shorter)
function handArt(c, sleeve = '#2a2560') {
  grainFill(c, cc => { cc.moveTo(-100, -84); cc.bezierCurveTo(-300, -100, -520, -130, -760, -150); cc.lineTo(-760, 190); cc.bezierCurveTo(-520, 150, -300, 110, -100, 88); cc.closePath(); },
    lin(c, 0, -120, 0, 160, [[0, '#3a3378'], [0.45, sleeve], [1, '#0c0b22']]), 0.55);
  c.strokeStyle = 'rgba(8,7,24,0.55)'; c.lineWidth = 4; c.lineCap = 'round';
  for (const [x, y, w] of [[-260, -40, 60], [-380, 20, 80], [-320, 70, 50]]) { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - w * 0.5, y + 12, x - w, y + 4); c.stroke(); }
  grainFill(c, cc => { cc.moveTo(-76, -80); cc.quadraticCurveTo(-100, -84, -128, -88); cc.quadraticCurveTo(-140, 0, -128, 92); cc.quadraticCurveTo(-100, 88, -76, 84); cc.quadraticCurveTo(-66, 0, -76, -80); cc.closePath(); },
    lin(c, -130, 0, -70, 0, [[0, '#8b7a6a'], [1, '#f3e3c4']]), 0.35);
  const fingerFill = lin(c, 20, 0, 190, 0, [[0, '#d98a44'], [1, '#ffc98e']]);
  const F = [[-46, 116, 17, -0.09], [-15, 132, 17.5, -0.025], [16, 124, 16.5, 0.04], [45, 96, 14.5, 0.12]];
  F.forEach(([y, len, r, a]) => grainFill(c, cc => cap(cc, 26, y, 26 + Math.cos(a) * len, y + Math.sin(a) * len, r, r * 0.8), fingerFill, 0.4));
  grainFill(c, cc => { cc.moveTo(-80, -64); cc.bezierCurveTo(-30, -74, 20, -70, 44, -60); cc.bezierCurveTo(60, -36, 62, 40, 50, 62);
    cc.bezierCurveTo(10, 72, -40, 74, -80, 66); cc.bezierCurveTo(-94, 30, -94, -30, -80, -64); cc.closePath(); },
    lin(c, -90, 0, 60, 0, [[0, '#a2521f'], [0.55, '#e08a42'], [1, '#f6aa66']]), 0.42);
  F.forEach(([y, len, r]) => grainFill(c, cc => cc.ellipse(34, y, 11, r * 0.8, 0, 0, 7), 'rgba(255,200,140,0.28)', 0));
  grainFill(c, cc => { cap(cc, -50, -52, 6, -104, 22, 17); cap(cc, 6, -104, 58, -122, 17, 14); }, lin(c, -50, -60, 60, -120, [[0, '#b0602a'], [1, '#ffbf80']]), 0.4);
  grainFill(c, cc => cc.ellipse(52, -121, 9, 7, -0.3, 0, 7), '#ffdcb0', 0.2);
  c.strokeStyle = 'rgba(122,59,23,0.28)'; c.lineWidth = 3;
  for (const [y] of F) { c.beginPath(); c.moveTo(-60, y * 0.55); c.quadraticCurveTo(-10, y * 0.8, 24, y); c.stroke(); }
  c.lineWidth = 2.2; c.strokeStyle = 'rgba(122,59,23,0.5)';
  F.forEach(([y, len, r, a]) => { for (const f of [0.42, 0.72]) { const x0 = 26 + Math.cos(a) * len * f, y0 = y + Math.sin(a) * len * f; c.beginPath(); c.moveTo(x0, y0 - r * 0.6); c.quadraticCurveTo(x0 + 3, y0, x0, y0 + r * 0.6); c.stroke(); } });
  F.forEach(([y, len, r, a]) => { const ex = 26 + Math.cos(a) * (len - 9), ey = y + Math.sin(a) * (len - 9); grainFill(c, cc => cc.ellipse(ex, ey, 9, r * 0.55, a, 0, 7), '#ffdcb0', 0.2); });
}

// ---------------------------------------------------------------- side-view runner
// o: { x (hip), y (ground), s, p (cycle phase), lean, ghost, a }
function runner(ctx, o) {
  const s = o.s, p = o.p, bob = Math.abs(Math.cos(p)) * 5 * s;
  const hip = [o.x, o.y - 92 * s - bob], lean = o.lean ?? 0.2;
  const dir = a => [Math.sin(a), Math.cos(a)];
  const leg = ph => { const th = 0.12 + 0.72 * Math.sin(ph), kn = 0.25 + 1.25 * sm(0.5 + 0.5 * Math.sin(ph + 1.9));
    const k = [hip[0] + dir(th)[0] * 46 * s, hip[1] + dir(th)[1] * 46 * s], sa = th - kn, f = [k[0] + dir(sa)[0] * 46 * s, k[1] + dir(sa)[1] * 46 * s];
    return { k, f, sa }; };
  const sh = [hip[0] + Math.sin(lean) * 64 * s, hip[1] - Math.cos(lean) * 64 * s];
  // the arm hangs from a joint a little below the top of the shoulder line, not from the neckline itself
  const shA = [sh[0] - Math.sin(lean) * 8 * s, sh[1] + Math.cos(lean) * 8 * s];
  const arm = ph => { const ua = -0.85 * Math.sin(ph) + lean, e = [shA[0] + Math.sin(ua) * 30 * s, shA[1] + Math.cos(ua) * 30 * s], fa = ua + 1.5 + 0.2 * Math.sin(ph), h = [e[0] + Math.sin(fa) * 27 * s, e[1] + Math.cos(fa) * 27 * s]; return { e, h }; };
  const head = [sh[0] + Math.sin(lean) * 26 * s + 2 * s, sh[1] - 24 * s];
  const LN = leg(p), LF = leg(p + Math.PI), AN = arm(p + Math.PI), AF = arm(p);
  const skinN = lin(ctx, hip[0], hip[1] - 60 * s, hip[0] + 20 * s, o.y, [[0, '#ffbf80'], [1, '#b0602a']]);
  const parts = [];
  const legParts = (Lg, fill, shoe) => {
    parts.push([c => cap(c, hip[0], hip[1], Lg.k[0], Lg.k[1], 10 * s, 7.5 * s), fill]);
    parts.push([c => cap(c, Lg.k[0], Lg.k[1], Lg.f[0], Lg.f[1], 7.5 * s, 5 * s), fill]);
    parts.push([c => { const r = -Lg.sa * 0.6; c.ellipse(Lg.f[0] + Math.cos(r) * 6 * s, Lg.f[1] + 2 * s + Math.sin(r) * 6 * s, 13 * s, 5.5 * s, r, 0, Math.PI * 2); }, shoe]);
  };
  const shirt = lin(ctx, sh[0] - 20 * s, sh[1], hip[0] + 20 * s, hip[1], [[0, '#ffc488'], [0.5, '#e08a42'], [1, '#9a4c1c']]);
  // upper arm tapers from a rounded shoulder; a short shirt sleeve caps the near arm so it reads as part of the body
  const armParts = (A, fill, sleeve) => { parts.push([c => cap(c, shA[0], shA[1], A.e[0], A.e[1], 7 * s, 5 * s), fill]); parts.push([c => cap(c, A.e[0], A.e[1], A.h[0], A.h[1], 5 * s, 4.2 * s), fill]);
    parts.push([c => c.ellipse(A.h[0], A.h[1], 5.6 * s, 4.8 * s, 0, 0, Math.PI * 2), fill]);
    if (sleeve) parts.push([c => { const u = [(A.e[0] - shA[0]) / 30 / s, (A.e[1] - shA[1]) / 30 / s]; cap(c, shA[0] - u[0] * 2 * s, shA[1] - u[1] * 2 * s, shA[0] + u[0] * 11 * s, shA[1] + u[1] * 11 * s, 9 * s, 7.5 * s); }, sleeve]); };
  armParts(AF, '#7a3b17'); legParts(LF, '#8a4419', '#2a1408');
  // shorts
  parts.push([c => { c.moveTo(hip[0] - 14 * s, hip[1] - 14 * s); c.lineTo(hip[0] + 14 * s, hip[1] - 12 * s); c.lineTo(LN.k[0] * 0.45 + hip[0] * 0.55 + 9 * s, LN.k[1] * 0.45 + hip[1] * 0.55); c.lineTo(hip[0] - 4 * s, hip[1] + 18 * s); c.lineTo(LF.k[0] * 0.4 + hip[0] * 0.6 - 8 * s, LF.k[1] * 0.4 + hip[1] * 0.6); c.closePath(); }, '#3a2a6a']);
  legParts(LN, skinN, '#f3efe2');
  // torso: running shirt
  parts.push([c => { const b = Math.sin(lean), a = Math.cos(lean);
    c.moveTo(hip[0] - 15 * s, hip[1] - 8 * s); c.bezierCurveTo(hip[0] - 18 * s + b * 30 * s, hip[1] - 40 * s, sh[0] - 18 * s, sh[1] + 8 * s, sh[0] - 12 * s, sh[1] - 4 * s);
    c.quadraticCurveTo(sh[0] + 2 * s, sh[1] - 12 * s, sh[0] + 14 * s, sh[1] + 2 * s); c.bezierCurveTo(sh[0] + 18 * s, sh[1] + 20 * s, hip[0] + 18 * s + b * 20 * s, hip[1] - 30 * s * a, hip[0] + 15 * s, hip[1] - 10 * s); c.closePath(); },
    lin(ctx, sh[0] - 20 * s, sh[1], hip[0] + 20 * s, hip[1], [[0, '#ffc488'], [0.5, '#e08a42'], [1, '#9a4c1c']])]);
  // neck, head, hair with a ponytail that swings with the stride
  parts.push([c => cap(c, sh[0] + 1 * s, sh[1] - 2 * s, head[0] - 1 * s, head[1] + 8 * s, 5 * s, 4.5 * s), '#b0602a']);
  parts.push([c => c.ellipse(head[0], head[1], 11.5 * s, 13 * s, lean * 0.5, 0, Math.PI * 2), lin(ctx, head[0] + 10 * s, head[1] - 10 * s, head[0] - 10 * s, head[1] + 10 * s, [[0, '#ffcf98'], [1, '#c06a2c']])]);
  const pt = Math.sin(p * 2) * 0.35;
  parts.push([c => { c.ellipse(head[0] - 2 * s, head[1] - 3 * s, 12 * s, 11.5 * s, lean * 0.5, Math.PI * 0.85, Math.PI * 2.15); c.lineTo(head[0] - 4 * s, head[1] + 4 * s); c.closePath();
    c.moveTo(head[0] - 11 * s, head[1] - 4 * s); c.quadraticCurveTo(head[0] - 26 * s, head[1] - 2 * s + pt * 10 * s, head[0] - 30 * s, head[1] + 10 * s + pt * 12 * s); c.quadraticCurveTo(head[0] - 18 * s, head[1] + 4 * s, head[0] - 9 * s, head[1] + 2 * s); c.closePath(); },
    lin(ctx, head[0], head[1] - 14 * s, head[0], head[1] + 14 * s, [[0, '#5a2a12'], [1, '#1c0a05']])]);
  armParts(AN, skinN, shirt);
  if (o.ghost) {
    // the story: a runner drawn in paper and dashed ink, half transparent
    ctx.save(); ctx.globalAlpha = o.a ?? 1;
    for (const [pf] of parts) { ctx.beginPath(); pf(ctx); ctx.fillStyle = rgba('#e8e2f8', 0.16); ctx.fill(); }
    ctx.setLineDash([7 * s, 5 * s]); ctx.lineDashOffset = -p * 6; ctx.strokeStyle = rgba(C.cream, 0.8); ctx.lineWidth = 2.6;
    for (const [pf] of parts) { ctx.beginPath(); pf(ctx); ctx.stroke(); }
    ctx.restore();
    return { head, hip };
  }
  ctx.save(); ctx.translate(-2.5, -1.5); ctx.globalAlpha = 0.55; for (const [pf] of parts) grainFill(ctx, pf, C.cyanW, 0); ctx.restore();
  for (const [pf, fill] of parts) grainFill(ctx, pf, fill, 0.35);
  return { head, hip };
}

// ---------------------------------------------------------------- the stadium
const X0 = 230, TSTART = 258.4, V = 228, ACC = 0.55;
const LANE_S = { y: 640, s: 1.2 }, LANE_R = { y: 808, s: 1.42 };
const dist = (t, v) => { const u = Math.max(0, t - TSTART); return u < ACC ? v * u * u / (2 * ACC) : v * (u - ACC / 2); };
const R = rng(258);
const CROWD = Array.from({ length: 260 }, () => [R() * (W + 400) - 200, 250 + R() * 230, R()]);

function standsArt(c) {
  c.fillStyle = lin(c, 0, 0, 0, 620, [[0, '#060717'], [0.5, '#0d0f2c'], [1, '#191a44']]); c.fillRect(-200, -200, W + 400, 900);
  // tiers of the stands, rising away
  for (let k = 0; k < 7; k++) { const y = 240 + k * 36; grainFill(c, cc => { cc.moveTo(-200, y); cc.lineTo(W + 200, y - 14); cc.lineTo(W + 200, y + 36); cc.lineTo(-200, y + 50); cc.closePath(); }, lin(c, 0, y, 0, y + 40, [[0, k % 2 ? '#15163a' : '#1a1b46'], [1, '#0c0d26']]), 0.5); }
  // roof edge
  grainFill(c, cc => { cc.moveTo(-200, 170); cc.lineTo(W + 200, 140); cc.lineTo(W + 200, 196); cc.lineTo(-200, 232); cc.closePath(); }, lin(c, 0, 140, 0, 230, [[0, '#090a1e'], [1, '#14153a']]), 0.5);
  // the front wall with plain boards
  grainFill(c, cc => cc.rect(-200, 520, W + 400, 60), lin(c, 0, 520, 0, 580, [[0, '#24204e'], [1, '#121232']]), 0.5);
  for (let x = -100; x < W + 200; x += 260) { c.fillStyle = rgba('#3b2f6e', 0.6); c.fillRect(x, 530, 220, 34); c.fillStyle = rgba(C.lav, 0.10); c.fillRect(x + 16, 543, 120, 6); }
}

function draw(ctx, t) {
  const layer = cam(ctx, t, T0, T1, 1.0, 1.08, 1000, 700, 3);
  const flick = 0.94 + 0.06 * Math.sin(t * 7.1) * Math.sin(t * 2.3);
  const dS = dist(t, V), dR = dist(t, V * 2 / 3);
  const xS = X0 + dS, xR = X0 + dR;
  const meas = ramp(t, 262.5, 263.1);       // the ruler drops in on "two thirds"
  layer(0.3, () => {
    cached(ctx, 'k5race_stands', -200, -200, W + 200, 600, standsArt, 1);
    // a few people in the stands, heads catching the floodlight, swaying
    for (const [x, y, k] of CROWD) { if (k > 0.4) continue; const yy = y + Math.sin(t * (1 + k) + k * 20) * 1.5; const tierY = 240 + Math.floor((y - 240) / 36) * 36 + 20 - (x / W) * 14;
      ctx.fillStyle = rgba(k < 0.05 ? '#a85a26' : '#232050', 0.9); ctx.beginPath(); ctx.ellipse(x, tierY + (yy - y), 6, 7, 0, 0, 7); ctx.fill(); ctx.fillRect(x - 8, tierY + 5 + (yy - y), 16, 12); }
    // floodlight tower: the hero light
    ctx.fillStyle = '#05061a'; ctx.fillRect(1418, 60, 10, 200);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { ctx.fillStyle = rgba('#fff3dc', 0.95 * flick); ctx.fillRect(1350 + i * 38, 26 + j * 22, 30, 16); }
    light(ctx, 1424, 60, 520, '#fff0d8', 0.42 * flick);
    light(ctx, 1424, 60, 160, '#ffffff', 0.5 * flick);
  });
  layer(0.6, () => {
    // the track: two lanes, far lane narrower
    grainFill(ctx, c => { c.moveTo(-300, 560); c.lineTo(W + 300, 560); c.lineTo(W + 300, 860); c.lineTo(-300, 860); c.closePath(); }, lin(ctx, 0, 560, 0, 860, [[0, '#4a2c58'], [0.5, '#5a3060'], [1, '#3a2048']]), 0.5);
    grainFill(ctx, c => { c.moveTo(-300, 860); c.lineTo(W + 300, 860); c.lineTo(W + 300, 1300); c.lineTo(-300, 1300); c.closePath(); }, lin(ctx, 0, 860, 0, H, [[0, '#123040'], [1, '#081420']]), 0.5);
    ctx.strokeStyle = rgba(C.cream, 0.45); ctx.lineWidth = 2;
    for (const y of [570, 690, 852]) { ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); }
    // start line, slanted with the perspective
    ctx.lineWidth = 6; ctx.strokeStyle = rgba(C.cream, 0.8); ctx.beginPath(); ctx.moveTo(X0 - 6, 570); ctx.lineTo(X0 + 6, 852); ctx.stroke();
    // floodlight wash on the track
    cone(ctx, 1424, 80, 120, 1700, 840, '#fff0d8', 0.07 * flick);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(1300, 760); ctx.scale(2.4, 0.5); ctx.fillStyle = rad(ctx, 0, 0, 0, 420, [[0, rgba('#ffe2b8', 0.16 * flick)], [1, 'rgba(255,226,184,0)']]); ctx.fillRect(-420, -420, 840, 840); ctx.restore();
    // the ruler on the infield edge: 0, 1/3, 2/3, 1 of the story's distance
    if (meas > 0) {
      const full = dS, yR = 884, wv = out((t - 262.5) / 0.7);
      ctx.save(); ctx.globalAlpha = meas;
      ctx.strokeStyle = rgba(C.cream, 0.8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0, yR); ctx.lineTo(X0 + full * wv, yR); ctx.stroke();
      for (const [f, lab] of [[0, '0'], [1 / 3, '1/3'], [2 / 3, '2/3'], [1, '1']]) { if (f > wv + 0.001) continue; const x = X0 + full * f, hi = f === 2 / 3;
        ctx.strokeStyle = hi ? C.amber : rgba(C.cream, 0.8); ctx.lineWidth = hi ? 4 : 2; ctx.beginPath(); ctx.moveTo(x, yR - (hi ? 16 : 10)); ctx.lineTo(x, yR + (hi ? 16 : 10)); ctx.stroke();
        ctx.font = `${hi ? 30 : 22}px "Inter SemiBold"`; ctx.textAlign = 'center'; ctx.fillStyle = hi ? C.amber : C.cream; ctx.textBaseline = 'top'; ctx.fillText(lab, x, yR + 18); }
      // dashed drop lines from each runner to the ruler
      ctx.setLineDash([6, 8]); ctx.lineWidth = 2;
      ctx.strokeStyle = rgba(C.cream, 0.5); ctx.beginPath(); ctx.moveTo(xS, 600); ctx.lineTo(xS, yR - 6); ctx.stroke();
      ctx.strokeStyle = rgba(C.amber, 0.8); ctx.beginPath(); ctx.moveTo(xR, 818); ctx.lineTo(xR, yR - 6); ctx.stroke();
      ctx.restore();
    }
  });
  layer(0.75, () => {
    // shadows
    for (const [x, ln] of [[xS, LANE_S], [xR, LANE_R]]) { ctx.fillStyle = 'rgba(10,6,24,0.45)'; ctx.beginPath(); ctx.ellipse(x - 30 * ln.s, ln.y + 2, 46 * ln.s, 6 * ln.s, 0, 0, 7); ctx.fill(); }
    const STRIDE = 150;
    const startA = ramp(t, 257.5, 257.9);
    // the story: a ghost runner, always ahead
    const g = runner(ctx, { x: xS, y: LANE_S.y, s: LANE_S.s, p: dS / (STRIDE * LANE_S.s) * Math.PI * 2 + (t < TSTART ? Math.sin(t * 3) * 0.05 : 0), ghost: true, a: startA, lean: t < TSTART ? 0.3 : 0.2 });
    light(ctx, g.head[0], g.head[1] + 40, 120, C.cream, 0.10);
    // reality: solid amber, two thirds as fast
    const r = runner(ctx, { x: xR, y: LANE_R.y, s: LANE_R.s, p: dR / (STRIDE * LANE_R.s * 0.8) * Math.PI * 2 + 0.6, lean: t < TSTART ? 0.3 : 0.2 });
    light(ctx, r.head[0], r.head[1] + 50, 140, C.amber, 0.22);
    tag(ctx, 'THE STORY', g.head[0] + 6, g.head[1] - 46, ramp(t, 258.3, 258.9));
    tag(ctx, 'REALITY', r.head[0] + 6, r.head[1] - 50, ramp(t, 260.9, 261.4), { color: '#ffd29a' });
  });
  stamp(ctx, t, 262.6, T1 + 0.5, '~2/3', 'the pace of the story', { size: 150 });
}

module.exports = { T0, T1, draw, grainFill, roundRect, cap, curve, glowStroke, cached, cam, tag, handArt, runner };
