// "But look at what they actually propose: more technical experts in government, more transparency,
//  and AI tools for the people defending our systems."
// A government building at night. Three experts carrying glowing laptops climb its steps and go in; then the stone
// wall behind the columns turns to glass and we see inside; then the camera drifts right to a network of systems,
// where a defender holds up a cyan shield that turns away small incoming sparks.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, hash, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const { gf, rr, cap, cached, tiny } = require('./s_k9_kit');

const T0 = 575.55, T1 = 585.8;
const BX0 = 230, BX1 = 1170, BC = 700, FLOOR = 770, TOPC = 380, GROUND = 880;
const COLS = Array.from({ length: 7 }, (_, i) => BX0 + 70 + i * (BX1 - BX0 - 140) / 6);
const WIPE0 = 580.85;

function cityArt(c) {
  gf(c, cc => cc.rect(-400, -200, 3400, 1100), lin(c, 0, -200, 0, 900, [[0, '#070818'], [0.6, '#151640'], [1, '#2c2563']]), 0.55);
  const r = rng(55); let x = -400;
  while (x < 3000) { const w = 80 + r() * 140, h = 200 + r() * 330, top = 820 - h;
    gf(c, cc => cc.rect(x, top, w, h + 80), lin(c, 0, top, 0, 860, [[0, '#191741'], [1, '#100e2c']]), 0.5);
    for (let wy = top + 18; wy < 800; wy += 26) for (let wx = x + 10; wx < x + w - 12; wx += 20) if (r() < 0.07) { c.fillStyle = rgba(r() < 0.3 ? C.cyan : C.amber, 0.2 + r() * 0.3); c.fillRect(wx, wy, 7, 10); }
    x += w + 10 + r() * 40; }
  c.fillStyle = lin(c, 0, 600, 0, 880, [[0, 'rgba(59,47,110,0)'], [1, 'rgba(59,47,110,0.7)']]); c.fillRect(-400, 600, 3400, 300);
  // plaza
  gf(c, cc => cc.rect(-400, GROUND, 3400, 400), lin(c, 0, GROUND, 0, 1200, [[0, '#262252'], [1, '#0c0a20']]), 0.6);
  c.strokeStyle = 'rgba(164,159,196,0.10)'; c.lineWidth = 2;
  for (let k = -20; k < 40; k++) { c.beginPath(); c.moveTo(BC + k * 90, GROUND); c.lineTo(BC + k * 200, 1200); c.stroke(); }
  for (const y of [920, 975, 1050]) { c.beginPath(); c.moveTo(-400, y); c.lineTo(3000, y); c.stroke(); }
}
function buildingArt(c) {
  // podium and steps
  for (let k = 0; k < 6; k++) { const y = FLOOR + k * 18, ext = 40 + k * 26;
    gf(c, cc => cc.rect(BX0 - ext, y, BX1 - BX0 + 2 * ext, 19), lin(c, 0, y, 0, y + 19, [[0, '#6d67a6'], [0.25, '#3f3a78'], [1, '#2a2660']]), 0.45); }
  // entablature and pediment
  gf(c, cc => cc.rect(BX0 - 30, TOPC - 70, BX1 - BX0 + 60, 70), lin(c, 0, TOPC - 70, 0, TOPC, [[0, '#5a5496'], [1, '#2e2a66']]), 0.45);
  gf(c, cc => { cc.moveTo(BX0 - 50, TOPC - 70); cc.lineTo(BC, TOPC - 230); cc.lineTo(BX1 + 50, TOPC - 70); cc.closePath(); }, lin(c, 0, TOPC - 230, 0, TOPC - 70, [[0, '#6d67a6'], [1, '#34307040']]), 0.45);
  gf(c, cc => { cc.moveTo(BX0 - 10, TOPC - 82); cc.lineTo(BC, TOPC - 205); cc.lineTo(BX1 + 10, TOPC - 82); cc.closePath(); }, '#211d50', 0.4);
  c.fillStyle = 'rgba(216,212,240,0.35)'; c.fillRect(BX0 - 30, TOPC - 72, BX1 - BX0 + 60, 4); c.fillRect(BX0 - 30, TOPC - 4, BX1 - BX0 + 60, 4);
  c.font = '30px "Instrument Serif"'; c.letterSpacing = '14px'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = 'rgba(216,212,240,0.45)'; c.fillText('GOVERNMENT', BC + 7, TOPC - 36);
}
function columnsArt(c) {
  for (const x of COLS) {
    gf(c, cc => { cc.moveTo(x - 30, FLOOR); cc.lineTo(x - 24, TOPC + 26); cc.lineTo(x + 24, TOPC + 26); cc.lineTo(x + 30, FLOOR); cc.closePath(); },
      lin(c, x - 30, 0, x + 30, 0, [[0, '#2c2862'], [0.3, '#8a84c4'], [0.6, '#5a5496'], [1, '#221e52']]), 0.45);
    for (let k = -2; k <= 2; k++) { c.strokeStyle = 'rgba(20,18,50,0.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + k * 10, TOPC + 34); c.lineTo(x + k * 12, FLOOR - 14); c.stroke(); }
    gf(c, cc => cc.rect(x - 38, TOPC, 76, 26), '#6d67a6', 0.4); gf(c, cc => cc.rect(x - 38, FLOOR - 16, 76, 16), '#4a4486', 0.4);
  }
}
// the wall behind the columns: stone, and the same wall as glass with the offices behind it
function stoneArt(c) {
  gf(c, cc => cc.rect(BX0, TOPC, BX1 - BX0, FLOOR - TOPC), lin(c, 0, TOPC, 0, FLOOR, [[0, '#1a1744'], [1, '#2a2660']]), 0.55);
  c.strokeStyle = 'rgba(10,8,30,0.35)'; c.lineWidth = 2;
  for (let y = TOPC + 40; y < FLOOR; y += 40) { c.beginPath(); c.moveTo(BX0, y); c.lineTo(BX1, y); c.stroke(); for (let x = BX0 + ((y / 40) % 2) * 50; x < BX1; x += 100) { c.beginPath(); c.moveTo(x, y - 40); c.lineTo(x, y); c.stroke(); } }
  for (const x of [BX0 + 120, BX1 - 160]) for (const y of [TOPC + 70, TOPC + 220]) gf(c, cc => cc.rect(x, y, 40, 90), '#0e0c26', 0.4);
}
function glassArt(c) {
  gf(c, cc => cc.rect(BX0, TOPC, BX1 - BX0, FLOOR - TOPC), lin(c, 0, TOPC, 0, FLOOR, [[0, '#ffd9a0'], [0.5, '#e8964e'], [1, '#b8622a']]), 0.3);
  // two floors of offices
  const MID = (TOPC + FLOOR) / 2 + 10;
  c.fillStyle = '#5a2a12'; c.fillRect(BX0, MID, BX1 - BX0, 10);
  c.fillStyle = 'rgba(255,240,210,0.7)'; for (let x = BX0 + 30; x < BX1; x += 120) { c.fillRect(x, TOPC + 10, 70, 5); c.fillRect(x, MID + 16, 70, 5); }
  const r = rng(61);
  for (const fy of [MID - 6, FLOOR - 16]) for (let x = BX0 + 40; x < BX1 - 40; x += 70 + r() * 40) {
    // desk with a screen, a person at it
    c.fillStyle = 'rgba(90,42,18,0.85)'; c.fillRect(x - 30, fy - 38, 70, 6); c.fillRect(x - 26, fy - 32, 5, 32); c.fillRect(x + 32, fy - 32, 5, 32);
    const cy = r() < 0.5; c.fillStyle = cy ? rgba('#0a6f8c', 0.9) : 'rgba(74,34,16,0.9)'; c.fillRect(x - 6, fy - 66, 34, 24);
    if (cy) { c.fillStyle = rgba(C.cyanW, 0.8); c.fillRect(x - 3, fy - 63, 28, 18); }
    if (r() < 0.75) { const px = x - 34 + r() * 10; c.fillStyle = 'rgba(74,34,16,0.92)'; c.beginPath(); c.ellipse(px, fy - 82, 10, 11, 0, 0, 7); c.fill(); rr(c, px - 15, fy - 70, 30, 44, 10); c.fill(); }
  }
}

function experts(ctx, t) {
  // three people walking from the foreground up to the open door
  for (let i = 0; i < 3; i++) {
    const t0 = 576.6 + i * 0.45, t1 = t0 + 2.9, u = clamp((t - t0) / (t1 - t0));
    if (t < t0 - 0.01) continue;
    const pts = [[1180 + i * 70, 1010 + i * 10], [840 + i * 40, GROUND + 10], [BC + 20 + (i - 1) * 40, FLOOR + 6]];
    const k = u < 0.6 ? u / 0.6 : 1, k2 = u < 0.6 ? 0 : (u - 0.6) / 0.4;
    const x = u < 0.6 ? lerp(pts[0][0], pts[1][0], k) : lerp(pts[1][0], pts[2][0], k2), y = u < 0.6 ? lerp(pts[0][1], pts[1][1], k) : lerp(pts[1][1], pts[2][1], k2);
    const s = lerp(1.0, 0.55, u), fade = 1 - ramp(t, t1 - 0.25, t1 + 0.1);
    if (fade <= 0) continue;
    ctx.save(); ctx.globalAlpha = fade;
    tiny(ctx, x, y, s, { facing: 'back', walk: (t - t0) * 7.5 + i, pal: [['#ffb35c', '#c36a2b', '#5a2a12'], ['#ffc27c', '#cf7a36', '#5a2a12'], ['#e8964e', '#a85424', '#401a0a']][i], hair: ['#2e140a', '#1c0a05', '#4a2210'][i], long: i === 1, br: 0 });
    // the laptop under the arm, glowing
    ctx.fillStyle = rgba(C.cyanW, 0.9); ctx.save(); ctx.translate(x + 30 * s, y - 104 * s); ctx.rotate(0.2); ctx.fillRect(-4 * s, -16 * s, 8 * s, 30 * s); ctx.restore();
    light(ctx, x + 30 * s, y - 104 * s, 40 * s, C.cyan, 0.5);
    ctx.restore();
  }
}

const SPARKS = (() => { const r = rng(71); return Array.from({ length: 14 }, (_, i) => ({ t: 582.6 + i * 0.22 + r() * 0.15, ang: -0.9 + r() * 1.6, y: -260 + r() * 320, sp: 0.6 + r() * 0.3 })); })();
const NODES = (() => { const r = rng(73), a = []; for (let i = 0; i < 16; i++) a.push([1720 + r() * 560, 640 + r() * 200, 4 + r() * 6]); return a; })();
const DOME = { x: 2010, y: 840, rx: 420, ry: 300 };

function network(ctx, t, on) {
  // base: a low plinth with server racks and a lattice of links
  gf(ctx, c => { c.moveTo(1640, GROUND); c.lineTo(1690, 820); c.lineTo(2330, 820); c.lineTo(2380, GROUND); c.closePath(); }, lin(ctx, 0, 820, 0, GROUND, [[0, '#2e2a62'], [1, '#17143a']]), 0.5);
  for (let k = 0; k < 6; k++) { const x = 1740 + k * 95; gf(ctx, c => rr(c, x, 690 + (k % 2) * 30, 60, 130 - (k % 2) * 30, 4), lin(ctx, x, 0, x + 60, 0, [[0, '#1a1a48'], [1, '#0c0c26']]), 0.4);
    for (let j = 0; j < 6; j++) { const b = 0.5 + 0.5 * Math.sin(t * 4 + k * 3 + j * 1.7); ctx.fillStyle = rgba(C.cyan, 0.2 + 0.5 * b * on); ctx.fillRect(x + 10, 706 + (k % 2) * 30 + j * 16, 26, 3); } }
  ctx.strokeStyle = rgba(C.cyan, 0.25 * on); ctx.lineWidth = 1.5;
  for (let i = 0; i < NODES.length; i++) for (let j = i + 1; j < NODES.length; j++) { const a = NODES[i], b = NODES[j]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 170) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
  for (const [x, y, r] of NODES) { const p = 0.6 + 0.4 * Math.sin(t * 2 + x); ctx.fillStyle = rgba(C.cyanW, 0.6 * on); ctx.beginPath(); ctx.arc(x, y, r * 0.6, 0, 7); ctx.fill(); light(ctx, x, y, r * 5, C.cyan, 0.2 * p * on); }
}
function shield(ctx, t, up) {
  if (up <= 0) return;
  const { x, y, rx, ry } = DOME;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.beginPath(); ctx.ellipse(x, y, rx * out(up), ry * out(up), 0, Math.PI, 0); ctx.closePath();
  ctx.fillStyle = rad(ctx, x, y, rx * 0.4, rx, [[0, rgba(C.cyan, 0.02)], [0.85, rgba(C.cyan, 0.10 * up)], [1, rgba(C.cyanW, 0.22 * up)]]); ctx.fill();
  ctx.strokeStyle = rgba(C.cyanW, 0.55 * up); ctx.lineWidth = 3; ctx.stroke();
  // hex lattice shimmer
  ctx.clip(); ctx.strokeStyle = rgba(C.cyan, 0.10 * up); ctx.lineWidth = 1.2;
  for (let gy = y - ry; gy < y; gy += 34) for (let gx = x - rx + ((gy / 34) % 2) * 20; gx < x + rx; gx += 40) { ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; ctx.lineTo(gx + Math.cos(a) * 18, gy + Math.sin(a) * 18); } ctx.closePath(); ctx.stroke(); }
  ctx.restore();
}
function sparks(ctx, t, up) {
  const { x, y, rx, ry } = DOME;
  for (const s of SPARKS) {
    const dt = t - s.t; if (dt < -0.9 || dt > 1.2) continue;
    // impact point on the dome's right side
    const a = -0.25 - 0.9 * ((s.y + 260) / 320), ix = x + Math.cos(a) * rx, iy = y + Math.sin(a) * ry;
    const dir = [Math.cos(s.ang + 0.5), Math.sin(s.ang + 0.5) * 0.4 + 0.2];
    if (dt < 0) { // incoming from the right
      const k = -dt / 0.9, px = ix + 900 * k * s.sp, py = iy - 120 * k + Math.sin(k * 6) * 10;
      ctx.strokeStyle = rgba('#e9c8ff', 0.7 * (1 - k)); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 60, py - 8); ctx.stroke();
      light(ctx, px, py, 26, '#e9c8ff', 0.6 * (1 - k * 0.5));
    } else if (up > 0.5) { // turned away: a ripple on the shield and the spark glancing off upward
      const rr2 = 20 + dt * 120; ctx.strokeStyle = rgba(C.cyanW, 0.6 * (1 - dt / 1.2)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(ix, iy, rr2, rr2 * 0.6, a + Math.PI / 2, 0, 7); ctx.stroke();
      light(ctx, ix, iy, 70, C.cyanW, 0.5 * Math.max(0, 1 - dt * 3));
      const px = ix + dt * 380, py = iy - dt * 300; ctx.fillStyle = rgba('#e9c8ff', 0.6 * (1 - dt / 1.2)); ctx.beginPath(); ctx.arc(px, py, 3, 0, 7); ctx.fill();
    }
  }
}
function defender(ctx, t, up) {
  // stands in front of the network, tablet raised: the shield comes from it
  const x = 1900, y = 935, br = Math.sin(t * 1.7);
  const fig = tiny(ctx, x, y, 1.05, { facing: 'back', pal: ['#ffb35c', '#c36a2b', '#5a2a12'], arm: 0.25 + 0.55 * out(up), armL: 0.15 + 0.4 * out(up), br, hair: '#1c0a05', coat: true });
  const tx = fig.handR[0], ty = fig.handR[1] - 8;
  ctx.fillStyle = '#14123a'; ctx.fillRect(tx - 18, ty - 12, 36, 24); ctx.fillStyle = rgba(C.cyanW, 0.9); ctx.fillRect(tx - 15, ty - 9, 30, 18);
  light(ctx, tx, ty, 120, C.cyan, 0.5 * (0.4 + 0.6 * up));
  if (up > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.cyan, 0.3 * up); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + 20, ty - 160, DOME.x - 40, DOME.y - DOME.ry * out(up)); ctx.stroke(); ctx.restore(); }
}

function draw(ctx, t) {
  const pan = ease((t - 581.7) / 1.4);
  const z = lerp(1.04, 1.0, sm((t - T0) / 6)) + 0.03 * pan;
  const cam = lerp(-260, 1020, pan), dx = drift(t, 1, 31) * 6, dy = drift(t, 1, 32) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, 600); ctx.scale(z, z); ctx.translate(-W / 2 - cam * par + dx * par, -600 + dy * par); fn(); ctx.restore(); };
  layer(0.5, () => cached(ctx, 'k9city', -400, -200, 3000, 1200, cityArt));
  const open = ramp(t, 577.6, 578.4), wipe = clamp((t - WIPE0) / 0.7);
  layer(1, () => {
    // moonlight on the facade, and the glow of the glass when it opens up
    light(ctx, BC, 520, 900, '#7a74c0', 0.10);
    cached(ctx, 'k9stone', BX0, TOPC, BX1, FLOOR, stoneArt);
    if (wipe > 0) {
      const wx = lerp(BX0, BX1, out(wipe));
      ctx.save(); ctx.beginPath(); ctx.rect(BX0, TOPC, wx - BX0, FLOOR - TOPC); ctx.clip();
      cached(ctx, 'k9glass', BX0, TOPC, BX1, FLOOR, glassArt);
      // glass sheen
      ctx.fillStyle = 'rgba(255,255,255,0.08)'; for (const sx of [BX0 + 100, BX0 + 420, BX0 + 760]) { ctx.beginPath(); ctx.moveTo(sx, TOPC); ctx.lineTo(sx + 80, TOPC); ctx.lineTo(sx - 40, FLOOR); ctx.lineTo(sx - 120, FLOOR); ctx.closePath(); ctx.fill(); }
      ctx.restore();
      if (wipe < 1) { ctx.fillStyle = rgba('#fff1cf', 0.9); ctx.fillRect(wx - 2, TOPC, 4, FLOOR - TOPC); light(ctx, wx, (TOPC + FLOOR) / 2, 200, '#ffe2a8', 0.5); }
      light(ctx, BC, (TOPC + FLOOR) / 2, 700, C.amber, 0.22 * out(wipe));
    }
    // the door: opens warm for the experts
    const dw = 120, dh = 210, dx0 = BC - dw / 2, dy0 = FLOOR - dh;
    if (wipe < 1) {
      ctx.save(); ctx.beginPath(); ctx.rect(Math.max(dx0, lerp(BX0, BX1, out(wipe))), dy0, dw, dh); ctx.clip();
      ctx.fillStyle = rgba('#ffd9a0', 0.15 + 0.8 * open); ctx.fillRect(dx0, dy0, dw, dh);
      ctx.fillStyle = '#16123a'; ctx.fillRect(dx0, dy0, dw / 2 * (1 - 0.8 * open), dh); ctx.fillRect(dx0 + dw - dw / 2 * (1 - 0.8 * open), dy0, dw / 2 * (1 - 0.8 * open), dh);
      ctx.restore();
    }
    light(ctx, BC, FLOOR - 90, 260, '#ffd9a0', 0.35 * open * (1 - 0.6 * wipe));
    cone(ctx, BC, FLOOR, dw, 380, 150, '#ffd9a0', 0.16 * open);
    cached(ctx, 'k9cols', BX0 - 40, TOPC - 10, BX1 + 40, FLOOR + 2, columnsArt);
    cached(ctx, 'k9bld', BX0 - 200, TOPC - 240, BX1 + 200, FLOOR + 120, buildingArt);
    experts(ctx, t);
    const up = ramp(t, 582.3, 583.0);
    network(ctx, t, 0.5 + 0.5 * up);
    shield(ctx, t, up);
    sparks(ctx, t, up);
    defender(ctx, t, up);
  });
}

module.exports = { T0, T1, draw };
