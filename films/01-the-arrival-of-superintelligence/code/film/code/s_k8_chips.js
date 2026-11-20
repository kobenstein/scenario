// "AI has its own countable thing: chips. Huge numbers of them, and they're starting to be trackable."
// Close on a few AI chips lying in rows; on "countable" they light up one, two, three... and the centre one glows on
// "chips". On "huge numbers" the camera lifts away to a floor of thousands reaching to the horizon. Then an amber scan
// line sweeps over them and every chip it passes gets a small amber tag: trackable.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, stamp, out, ease } = L;

const T0 = 528.60, T1 = 535.60;

function rr(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// chip sprite on a unit square (256 px), plus a lit variant
function chipArt(lit) {
  const S = 256, cv = L.createCanvas(S, S), c = cv.getContext('2d');
  // pins
  c.fillStyle = lit ? '#8fe6ff' : '#3a6f8c';
  for (let k = 0; k < 12; k++) { const p = 40 + k * 16; c.fillRect(p, 6, 7, 22); c.fillRect(p, S - 28, 7, 22); c.fillRect(6, p, 22, 7); c.fillRect(S - 28, p, 22, 7); }
  // package
  c.fillStyle = lin(c, 0, 0, S, S, [[0, '#2a2f66'], [1, '#0e1236']]); c.beginPath(); rr(c, 24, 24, S - 48, S - 48, 14); c.fill();
  c.save(); c.globalAlpha = 0.45; c.fillStyle = c.createPattern(L.tex().dark, 'repeat'); c.beginPath(); rr(c, 24, 24, S - 48, S - 48, 14); c.fill(); c.restore();
  c.strokeStyle = 'rgba(143,230,255,0.25)'; c.lineWidth = 3; c.beginPath(); rr(c, 24, 24, S - 48, S - 48, 14); c.stroke();
  // traces
  c.strokeStyle = lit ? 'rgba(143,230,255,0.55)' : 'rgba(143,230,255,0.18)'; c.lineWidth = 2;
  const r = rng(lit ? 3 : 3);
  for (let k = 0; k < 18; k++) { const side = k % 4, u = 60 + r() * 136; c.beginPath();
    if (side === 0) { c.moveTo(u, 34); c.lineTo(u, 70); c.lineTo(lerp(u, 128, 0.4), 84); }
    if (side === 1) { c.moveTo(u, S - 34); c.lineTo(u, S - 70); c.lineTo(lerp(u, 128, 0.4), S - 84); }
    if (side === 2) { c.moveTo(34, u); c.lineTo(70, u); c.lineTo(84, lerp(u, 128, 0.4)); }
    if (side === 3) { c.moveTo(S - 34, u); c.lineTo(S - 70, u); c.lineTo(S - 84, lerp(u, 128, 0.4)); }
    c.stroke(); }
  // the die
  c.fillStyle = lit ? lin(c, 80, 80, 176, 176, [[0, '#d8f7ff'], [0.5, '#8fe6ff'], [1, '#0a6f8c']]) : lin(c, 80, 80, 176, 176, [[0, '#2a7a96'], [1, '#0a3a54']]);
  c.beginPath(); rr(c, 84, 84, 88, 88, 6); c.fill();
  c.fillStyle = lit ? 'rgba(10,111,140,0.5)' : 'rgba(4,20,40,0.5)';
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) c.fillRect(94 + i * 20, 94 + j * 20, 14, 14);
  c.fillStyle = 'rgba(255,255,255,0.18)'; c.fillRect(88, 88, 80, 6);
  return cv;
}
let SPR = null;

// world: chips on the floor plane y=0, at (i*SP, j*SP)
const SP = 1.5, I0 = -60, I1 = 60, J0 = -6, J1 = 115;
const SEEDS = (i, j) => { let h = Math.imul(i + 1013, 374761393) ^ Math.imul(j + 7919, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967295; };
// counting order on "countable": a short row next to the hero chip
const COUNT = [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1]];

function camAt(t) {
  const k = ease(ramp(t, 532.3, 534.1));
  return { x: lerp(0, 0, k), y: lerp(5.5, 34, k), z: lerp(0.75 - 5.5 / Math.tan(1.12), -30, k), pitch: lerp(1.12, 0.5, k), f: lerp(1500, 1100, k) };
}
function project(cam, X, Z) {
  const dx = X - cam.x, dy = -cam.y, dz = Z - cam.z;
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  const zc = dz * cp - dy * sp, yc = dz * sp + dy * cp;
  if (zc < 0.2) return null;
  return [W / 2 + cam.f * dx / zc, H * 0.5 - cam.f * yc / zc, zc];
}

function draw(ctx, t) {
  if (!SPR) SPR = [chipArt(false), chipArt(true)];
  const cam = camAt(t);
  cam.x += drift(t, 0.6, 3) * 0.05 * (1 + cam.y * 0.2); cam.z += drift(t, 0.6, 7) * 0.04;
  // background: dark floor fading to a faint horizon glow
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, '#060718'], [0.5, '#0b0f2a'], [1, '#101438']]); ctx.fillRect(0, 0, W, H);
  const wide = ramp(t, 532.6, 534.0);
  light(ctx, W / 2, H * 0.12, 1100, C.cyanD, 0.25 * wide);
  // scan line position in depth
  const scanZ = lerp(-8, J1 * SP + 10, ease(ramp(t, 533.9, 535.4)));
  const counting = (i, j) => { const k = COUNT.findIndex(([a, b]) => a === i && b === j); return k < 0 ? 0 : ramp(t, 530.15 + k * 0.11, 530.35 + k * 0.11); };
  const hero = ramp(t, 531.35, 531.7);
  // draw far to near
  for (let j = J1; j >= J0; j--) {
    const Z = j * SP;
    const pl = project(cam, 0, Z); if (!pl) continue;
    const scale = cam.f / pl[2];           // px per world unit at this depth
    if (pl[1] < -50 || pl[1] > H + 400) continue;
    const tagged = Z < scanZ, fog = (1 - ramp(Z, 45, J1 * SP)) * Math.min(1, scale / 2.5);
    if (fog <= 0.02) continue;
    ctx.globalAlpha = fog;
    for (let i = I0; i <= I1; i++) {
      const X = i * SP;
      const sx = W / 2 + cam.f * (X - cam.x) / pl[2];
      if (sx < -scale * 2 || sx > W + scale * 2) continue;
      const s = SEEDS(i, j);
      const lit = Math.max(counting(i, j), i === 0 && j === 0 ? hero : 0, (s > 0.93 ? 0.6 + 0.4 * Math.sin(t * 2 + s * 50) : 0) * wide);
      if (scale < 9) {
        // far away: a tiny glint per chip
        const w = Math.max(0.9, scale * 0.68), hgt = Math.max(0.9, scale * 0.68 * Math.sin(cam.pitch + 0.25)), al = Math.min(1, scale * 0.68 / 2);
        ctx.fillStyle = tagged ? rgba('#3a2a4a', al) : rgba('#1e2656', al);
        ctx.fillRect(sx - w / 2, pl[1] - hgt / 2, w, hgt);
        ctx.fillStyle = lit > 0.3 ? rgba(C.cyanW, (0.6 + 0.4 * lit) * al) : rgba('#2f86a4', 0.8 * al);
        ctx.fillRect(sx - w * 0.2, pl[1] - hgt * 0.2, Math.max(0.7, w * 0.4), Math.max(0.7, hgt * 0.4));
        if (tagged) { ctx.fillStyle = rgba(C.amber, 0.95); const d = Math.max(1.3, w * 0.4); ctx.fillRect(sx + w * 0.2, pl[1] - hgt / 2 - d * 0.5, d, d); }
        continue;
      }
      // near: full sprite placed with an affine from three projected corners
      const p0 = project(cam, X - 0.5, Z + 0.5), p1 = project(cam, X + 0.5, Z + 0.5), p2 = project(cam, X - 0.5, Z - 0.5);
      if (!p0 || !p1 || !p2) continue;
      ctx.save(); ctx.transform((p1[0] - p0[0]) / 256, (p1[1] - p0[1]) / 256, (p2[0] - p0[0]) / 256, (p2[1] - p0[1]) / 256, p0[0], p0[1]);
      ctx.drawImage(SPR[0], 0, 0);
      if (lit > 0) { ctx.globalAlpha = lit; ctx.drawImage(SPR[1], 0, 0); ctx.globalAlpha = 1; }
      if (tagged) { ctx.fillStyle = rgba(C.amber, 0.14); ctx.fillRect(24, 24, 208, 208); ctx.fillStyle = C.amber; ctx.beginPath(); ctx.arc(214, 42, 30, 0, 7); ctx.fill(); ctx.strokeStyle = rgba(C.amber, 0.8); ctx.lineWidth = 9; ctx.beginPath(); rr(ctx, 20, 20, 216, 216, 16); ctx.stroke(); }
      ctx.restore();
      if (lit > 0.05) { const c = project(cam, X, Z); light(ctx, c[0], c[1], scale * 1.1, C.cyan, 0.35 * lit); if (i === 0 && j === 0 && hero > 0) light(ctx, c[0], c[1], scale * 2.4, C.cyanW, 0.45 * hero * (0.9 + 0.1 * Math.sin(t * 5))); }
      if (tagged) { const c = project(cam, X + 0.36, Z + 0.36); light(ctx, c[0], c[1], scale * 0.25, C.amber, 0.4); }
    }
  }
  ctx.globalAlpha = 1;
  // the scan line across the floor
  const sc = ramp(t, 533.85, 534.0) * (1 - ramp(t, 535.3, 535.55));
  if (sc > 0) {
    const a = project(cam, -200, scanZ), b = project(cam, 200, scanZ);
    if (a && b) { ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const [w, al] of [[40, 0.08], [14, 0.25], [4, 0.9]]) { ctx.strokeStyle = rgba(w < 10 ? '#ffe2a8' : C.amber, al * sc); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      ctx.restore(); light(ctx, W / 2, (a[1] + b[1]) / 2, 500, C.amber, 0.25 * sc); }
  }
  // the count while they light up
  const n = COUNT.reduce((s, [i, j], k) => s + (t >= 530.15 + k * 0.11 ? 1 : 0), 0);
  ctx.save(); const ca = ramp(t, 530.1, 530.3) * (1 - ramp(t, 532.3, 532.7));
  if (ca > 0) { ctx.globalAlpha = ca; ctx.font = '120px "Instrument Serif"'; ctx.fillStyle = C.cream; ctx.textBaseline = 'top'; ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 24; ctx.fillText(String(n), 96, 70); }
  ctx.restore();
  stamp(ctx, t, 534.3, T1 + 0.4, 'Trackable', 'chips can be counted and traced', { size: 110 });
}

module.exports = { T0, T1, draw };
