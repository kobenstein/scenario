// "Remember the two million dollars? He didn't lose it. After his refusal became public, OpenAI dropped the clause."
// The same dark table as s_contract.js, now in morning light. On "two million" the coins and share certificates
// glint under the cold light on the far side; on "He didn't lose it" the whole pile slides across the table to his
// side, into warm light. The camera pushes into the contract: the gag clause is highlighted, struck through in
// amber on "dropped" and fades off the page on "the clause".
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, grainFill, lin, rad, rgba, light, cone, label, stamp, out, clamp, ease } = L;

const T0 = 641.0, T1 = 649.1;

// ---------- helpers ----------
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn, S = 1.25) {
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}
function roundRect(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0); c.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  c.arc(x1, y1, r1, n, n - Math.PI, true); c.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0); c.arc(x0, y0, r0, n + Math.PI, n, true); c.closePath();
}

// ---------- the table plane: u runs along the table, v toward the viewer ----------
const PO = [900, 620], PU = [0.97, -0.16], PV = [0.30, 0.55];
const P = (u, v) => [PO[0] + PU[0] * u + PV[0] * v, PO[1] + PU[1] * u + PV[1] * v];
const plane = ctx => ctx.transform(PU[0], PU[1], PV[0], PV[1], PO[0], PO[1]);

// contract motion: pushed along (+u,-v), fast, landing on "sign" (39.72), settling by 40.4
const C0 = [-330, 190], PUSH = 300;
function contractPos(t) {
  const k = ease(clamp((t - 39.0) / 0.74));
  const settle = Math.sin(clamp((t - 39.74) / 0.66) * Math.PI) * 6 * (1 - clamp((t - 39.74) / 0.66));
  const d = PUSH * k + settle;
  return [C0[0] + d * 0.7071, C0[1] - d * 0.7071];
}
const SHEET_W = 400, SHEET_H = 520;

// ---------- static art ----------
function roomArt(c) {
  // back wall
  grainFill(c, cc => cc.rect(-100, -100, W + 200, 700), lin(c, 0, 0, 0, 600, [[0, '#0a0b22'], [1, '#161538']]), 0.6);
  // window with a dim city
  const r = rng(12);
  grainFill(c, cc => cc.rect(40, 30, 820, 360), lin(c, 0, 30, 0, 390, [[0, '#121238'], [1, '#2a2458']]), 0.5);
  let x = 40; while (x < 860) { const w = 30 + r() * 70, h = 60 + r() * 220; c.fillStyle = '#0e0d2a'; c.fillRect(x, 390 - h, w, h);
    for (let wy = 400 - h; wy < 380; wy += 16) for (let wx = x + 6; wx < x + w - 6; wx += 12) if (r() < 0.12) { c.fillStyle = rgba(r() < 0.3 ? C.cyan : '#ffb35c', 0.3 + r() * 0.3); c.fillRect(wx, wy, 4, 6); }
    x += w + 4; }
  c.fillStyle = '#07081a'; for (const mx of [40, 313, 586, 856]) c.fillRect(mx - 6, 24, 12, 372); c.fillRect(34, 24, 832, 12); c.fillRect(34, 200, 832, 8); c.fillRect(34, 386, 832, 14);
  // tall wall panels on the right, catching a little cyan
  for (let k = 0; k < 5; k++) { const px = 980 + k * 200; grainFill(c, cc => cc.rect(px, 0, 186, 560), lin(c, px, 0, px + 186, 0, [[0, '#121232'], [1, '#1b1a44']]), 0.5); }
}
function chair(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  grainFill(c, cc => { roundRect(cc, -110, -260, 220, 290, 60); }, lin(c, -110, -260, 110, 30, [[0, '#211d4c'], [1, '#0b0a1e']]), 0.55);
  c.strokeStyle = 'rgba(143,230,255,0.22)'; c.lineWidth = 4; c.beginPath(); c.moveTo(70, -250); c.quadraticCurveTo(110, -240, 110, -170); c.stroke();
  c.restore();
}
function tableArt(c) {
  // chairs on the far side, behind the table edge
  chair(c, 330, 470, 1.0); chair(c, 720, 420, 0.92); chair(c, 1130, 360, 0.84);
  // the table top
  const corners = [P(-1600, -560), P(1500, -560), P(1500, 900), P(-1600, 900)];
  grainFill(c, cc => { cc.moveTo(...corners[0]); for (let i = 1; i < 4; i++) cc.lineTo(...corners[i]); cc.closePath(); },
    lin(c, 0, 150, 0, H, [[0, '#2a2252'], [0.5, '#1c1840'], [1, '#0d0b22']]), 0.6);
  // wood grain along u
  c.save(); plane(c);
  const r = rng(3);
  for (let i = 0; i < 46; i++) { const v = -540 + i * 30 + r() * 12; c.strokeStyle = rgba('#06051a', 0.25 + r() * 0.35); c.lineWidth = 1 + r() * 2.2;
    c.beginPath(); c.moveTo(-1600, v); c.bezierCurveTo(-600, v + r() * 14 - 7, 400, v + r() * 14 - 7, 1500, v); c.stroke(); }
  c.restore();
  // far edge lip catching the light
  const [ax, ay] = P(-1600, -560), [bx, by] = P(1500, -560);
  c.strokeStyle = 'rgba(143,230,255,0.35)'; c.lineWidth = 3; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke();
}
// share certificates: a small stack with ornate borders and a seal
function certArt(c) {
  for (let k = 3; k >= 0; k--) {
    c.save(); c.translate(0, k * 4); plane(c); c.translate(560, -420); c.rotate(0.08 - k * 0.05);
    grainFill(c, cc => cc.rect(-170, -110, 340, 220), k === 0 ? lin(c, -170, -110, 170, 110, [[0, '#e9f8fb'], [1, '#9ccfdb']]) : '#7fb2c2', 0.3);
    if (k === 0) {
      c.strokeStyle = 'rgba(10,111,140,0.7)'; c.lineWidth = 3; c.strokeRect(-155, -95, 310, 190); c.lineWidth = 1.5; c.strokeRect(-146, -86, 292, 172);
      c.fillStyle = 'rgba(10,111,140,0.55)'; c.fillRect(-90, -64, 180, 14);
      for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(10,80,110,0.35)'; c.fillRect(-120, -30 + i * 20, 240 - (i % 2) * 60, 7); }
      c.beginPath(); c.arc(100, 60, 22, 0, 7); c.fillStyle = 'rgba(201,112,46,0.85)'; c.fill();
      c.strokeStyle = 'rgba(255,226,170,0.8)'; c.lineWidth = 2; c.beginPath(); c.arc(100, 60, 15, 0, 7); c.stroke();
    }
    c.restore();
  }
}
// coin stacks (upright cylinders in screen space)
const STACKS = [[470, -300, 9], [540, -270, 13], [620, -300, 7], [500, -230, 5], [600, -220, 10], [680, -260, 4], [430, -250, 3]].map(([u, v, n]) => ({ u, v, n }))
  .sort((a, b) => (P(a.u, a.v)[1]) - (P(b.u, b.v)[1]));
function coinsArt(c) {
  for (const s of STACKS) {
    const [x, y] = P(s.u, s.v);
    c.fillStyle = 'rgba(4,4,16,0.5)'; c.beginPath(); c.ellipse(x + 8, y + 4, 36, 13, 0, 0, 7); c.fill();
    for (let i = 0; i < s.n; i++) {
      const cy = y - i * 7, jit = Math.sin(i * 2.3 + s.u) * 1.5;
      grainFill(c, cc => { cc.ellipse(x + jit, cy, 30, 10, 0, 0, Math.PI); cc.lineTo(x + jit - 30, cy - 7); cc.ellipse(x + jit, cy - 7, 30, 10, 0, Math.PI, 0, true); cc.closePath(); },
        lin(c, x - 30, 0, x + 30, 0, [[0, '#7a3b17'], [0.35, '#e0a050'], [0.7, '#c9702e'], [1, '#5a2a12']]), 0.35);
      c.strokeStyle = 'rgba(40,16,6,0.5)'; c.lineWidth = 1; c.beginPath(); c.ellipse(x + jit, cy, 30, 10, 0, 0.2, Math.PI - 0.2); c.stroke();
    }
    const ty = y - s.n * 7, jt = Math.sin(s.n * 2.3 + s.u) * 1.5;
    grainFill(c, cc => cc.ellipse(x + jt, ty, 30, 10, 0, 0, 7), rad(c, x + jt - 6, ty - 3, 2, 32, [[0, '#ffe2a8'], [0.6, '#e8a456'], [1, '#a2521f']]), 0.3);
    c.strokeStyle = 'rgba(122,59,23,0.6)'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x + jt, ty, 20, 6.5, 0, 0, 7); c.stroke();
    // cold rim from the light above
    c.strokeStyle = 'rgba(216,247,255,0.55)'; c.lineWidth = 2; c.beginPath(); c.ellipse(x + jt, ty, 30, 10, 0, Math.PI * 1.05, Math.PI * 1.7); c.stroke();
  }
}
// the contract: a thick stack; the top sheet has an empty signature line
function contractTop(c) {
  grainFill(c, cc => cc.rect(-SHEET_W / 2, -SHEET_H / 2, SHEET_W, SHEET_H), lin(c, -SHEET_W / 2, -SHEET_H / 2, SHEET_W / 2, SHEET_H / 2, [[0, '#f3efe2'], [0.6, '#cfc8dc'], [1, '#9a93b8']]), 0.3);
  c.fillStyle = 'rgba(21,26,68,0.85)'; c.fillRect(-120, -220, 240, 18);
  c.fillStyle = 'rgba(21,26,68,0.5)'; c.fillRect(-80, -190, 160, 8);
  const r = rng(44);
  for (let i = 0; i < 17; i++) { const y = -160 + i * 18; if (i === 6 || i === 12 || i <= 4) continue; c.fillStyle = 'rgba(40,38,90,0.38)'; c.fillRect(-160, y, 320 - (r() < 0.25 ? r() * 140 : r() * 20), 6); }
  // signature block, near right: X and an empty line
  c.strokeStyle = 'rgba(21,26,68,0.85)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(10, 222); c.lineTo(170, 222); c.stroke();
  c.lineWidth = 3; c.beginPath(); c.moveTo(-6, 200); c.lineTo(6, 214); c.moveTo(6, 200); c.lineTo(-6, 214); c.stroke();
  // a "sign here" flag sticking out of the edge
  grainFill(c, cc => { cc.moveTo(SHEET_W / 2 - 8, 196); cc.lineTo(SHEET_W / 2 + 48, 196); cc.lineTo(SHEET_W / 2 + 36, 211); cc.lineTo(SHEET_W / 2 + 48, 226); cc.lineTo(SHEET_W / 2 - 8, 226); cc.closePath(); }, '#ffb35c', 0.25);
}
function contractArt(c) {
  // pre-rendered in plane space with the stack's thickness as screen-down offsets is not possible in one cache, so cache the top sheet only
  contractTop(c);
}

// ---------- the hand (in plane space, fingers pointing along the push) ----------
function handArt(c) {
  // suit sleeve running back toward the viewer, off frame, with a shirt cuff
  grainFill(c, cc => { cc.moveTo(-100, -84); cc.bezierCurveTo(-300, -100, -520, -130, -760, -150); cc.lineTo(-760, 190); cc.bezierCurveTo(-520, 150, -300, 110, -100, 88); cc.closePath(); },
    lin(c, 0, -120, 0, 160, [[0, '#3a3378'], [0.45, '#241f55'], [1, '#0c0b22']]), 0.55);
  c.strokeStyle = 'rgba(8,7,24,0.55)'; c.lineWidth = 4; c.lineCap = 'round';
  for (const [x, y, w] of [[-260, -40, 60], [-380, 20, 80], [-320, 70, 50]]) { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - w * 0.5, y + 12, x - w, y + 4); c.stroke(); }
  grainFill(c, cc => { cc.moveTo(-76, -80); cc.quadraticCurveTo(-100, -84, -128, -88); cc.quadraticCurveTo(-140, 0, -128, 92); cc.quadraticCurveTo(-100, 88, -76, 84); cc.quadraticCurveTo(-66, 0, -76, -80); cc.closePath(); },
    lin(c, -130, 0, -70, 0, [[0, '#8b7a6a'], [1, '#f3e3c4']]), 0.35);
  const fingerFill = lin(c, 20, 0, 190, 0, [[0, '#d98a44'], [1, '#ffc98e']]);
  // fingers flat on the paper, slightly spread
  const F = [[-46, 116, 17, -0.09], [-15, 132, 17.5, -0.025], [16, 124, 16.5, 0.04], [45, 96, 14.5, 0.12]];
  F.forEach(([y, len, r, a]) => grainFill(c, cc => cap(cc, 26, y, 26 + Math.cos(a) * len, y + Math.sin(a) * len, r, r * 0.8), fingerFill, 0.4));
  // back of the hand
  grainFill(c, cc => { cc.moveTo(-80, -64); cc.bezierCurveTo(-30, -74, 20, -70, 44, -60); cc.bezierCurveTo(60, -36, 62, 40, 50, 62);
    cc.bezierCurveTo(10, 72, -40, 74, -80, 66); cc.bezierCurveTo(-94, 30, -94, -30, -80, -64); cc.closePath(); },
    lin(c, -90, 0, 60, 0, [[0, '#a2521f'], [0.55, '#e08a42'], [1, '#f6aa66']]), 0.42);
  // knuckles
  F.forEach(([y, len, r, a]) => grainFill(c, cc => cc.ellipse(34, y, 11, r * 0.8, 0, 0, 7), 'rgba(255,200,140,0.28)', 0));
  // thumb, out to the side, in two segments
  grainFill(c, cc => { cap(cc, -50, -52, 6, -104, 22, 17); cap(cc, 6, -104, 58, -122, 17, 14); }, lin(c, -50, -60, 60, -120, [[0, '#b0602a'], [1, '#ffbf80']]), 0.4);
  grainFill(c, cc => cc.ellipse(52, -121, 9, 7, -0.3, 0, 7), '#ffdcb0', 0.2);
  // tendons and finger creases
  c.strokeStyle = 'rgba(122,59,23,0.28)'; c.lineWidth = 3;
  for (const [y] of F) { c.beginPath(); c.moveTo(-60, y * 0.55); c.quadraticCurveTo(-10, y * 0.8, 24, y); c.stroke(); }
  c.lineWidth = 2.2; c.strokeStyle = 'rgba(122,59,23,0.5)';
  F.forEach(([y, len, r, a]) => { for (const f of [0.42, 0.72]) { const x0 = 26 + Math.cos(a) * len * f, y0 = y + Math.sin(a) * len * f; c.beginPath(); c.moveTo(x0, y0 - r * 0.6); c.quadraticCurveTo(x0 + 3, y0, x0, y0 + r * 0.6); c.stroke(); } });
  F.forEach(([y, len, r, a]) => { const ex = 26 + Math.cos(a) * (len - 9), ey = y + Math.sin(a) * (len - 9); grainFill(c, cc => cc.ellipse(ex, ey, 9, r * 0.55, a, 0, 7), '#ffdcb0', 0.2); });
}

// ---------- dust in the cone ----------
const DUST = (() => { const r = rng(61), a = []; for (let i = 0; i < 40; i++) a.push({ x: r(), y: r(), s: 1 + r() * 2.2, p: r() * 6, v: 4 + r() * 10 }); return a; })();


// the gag clause, drawn live on the top sheet (sheet coordinates)
const CL = (() => { const r = rng(45), a = []; for (let i = 0; i <= 4; i++) a.push(300 - (r() < 0.3 ? r() * 120 : r() * 20)); return a; })();
function clause(ctx, t) {
  const hi = ramp(t, 645.4, 645.9), strike = t - 647.5, gone = ramp(t, 648.05, 648.6);
  ctx.save(); ctx.globalAlpha = 1 - gone;
  if (hi > 0) { ctx.fillStyle = rgba(C.cyan, 0.16 * hi); ctx.fillRect(-176, -172, 352, 92); ctx.strokeStyle = rgba(C.cyanD, 0.7 * hi); ctx.lineWidth = 2.5; ctx.strokeRect(-176, -172, 352, 92);
    ctx.fillStyle = rgba(C.cyanD, 0.9 * hi); ctx.font = '30px "Instrument Serif"'; ctx.textBaseline = 'middle'; ctx.fillText('§', -200, -154); }
  CL.forEach((w, k) => { const y = -160 + k * 18; ctx.fillStyle = 'rgba(40,38,90,0.5)'; ctx.fillRect(-160, y, w, 6);
    const s = clamp((strike - k * 0.09) / 0.16); if (s > 0) { ctx.strokeStyle = '#d2702e'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-166, y + 3); ctx.lineTo(-166 + (w + 12) * s, y + 3 + Math.sin(k) * 1.5); ctx.stroke(); } });
  ctx.restore();
  if (gone > 0 && gone < 1) light(ctx, 0, -126, 200, '#ffe0b0', 0.35 * Math.sin(gone * Math.PI));
}

function draw(ctx, t) {
  const push = ease((t - 644.5) / 2.3);
  const z = lerp(1.0, 1.04, sm((t - T0) / (T1 - T0))) * lerp(1, 1.7, push);
  const dx = drift(t, 1, 2) * 6, dy = drift(t, 1, 5) * 4;
  const glow = ramp(t, 641.85, 642.3) * (1 - 0.6 * ramp(t, 643.4, 644.2));       // "two million"
  const hum = 0.94 + 0.04 * Math.sin(t * 8.3) * Math.sin(t * 2.9) + 0.02 * Math.sin(t * 1.3);
  const [cu, cv] = contractPos(1e9);
  const F = P(cu, cv);
  const layer = (par, fn) => { ctx.save(); ctx.translate(lerp(F[0], 960, push), lerp(F[1], 500, push)); ctx.scale(z, z); ctx.translate(-F[0] + dx * par, -F[1] + dy * par); fn(); ctx.restore(); };
  const [lx, ly] = P(560, -300);
  const slide = ease((t - 643.3) / 0.85);                                          // "He didn't lose it"
  const DU = -100 * slide, DV = 560 * slide, sdx = PU[0] * DU + PV[0] * DV, sdy = PU[1] * DU + PV[1] * DV;
  const [wx, wy] = P(560 - 100, -300 + 560);
  layer(0.4, () => { cached(ctx, 'room', -100, -100, W + 100, 640, roomArt, 1);
    // morning now: a warm wash through the window
    light(ctx, 450, 250, 700, '#ff9a6a', 0.22); });
  layer(1.0, () => {
    cached(ctx, 'table', -120, 100, W + 120, H + 120, tableArt, 1);
    // cold pool on the far side, warm pool on his side
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(lx, ly); ctx.scale(1, 0.42);
    ctx.fillStyle = rad(ctx, 0, 0, 0, 420, [[0, rgba(C.cyan, (0.32 + 0.25 * glow) * hum * (1 - 0.6 * slide))], [0.6, rgba(C.cyan, 0.08 * hum)], [1, rgba(C.cyan, 0)]]); ctx.fillRect(-420, -420, 840, 840); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(wx, wy); ctx.scale(1, 0.42);
    ctx.fillStyle = rad(ctx, 0, 0, 0, 460, [[0, rgba(C.amber, 0.08 + 0.4 * slide)], [0.6, rgba(C.amber, 0.12 * slide)], [1, rgba(C.amber, 0)]]); ctx.fillRect(-460, -460, 920, 920); ctx.restore();
    // the money slides across the table toward him
    ctx.save(); ctx.translate(sdx, sdy);
    cached(ctx, 'cert', 900, 120, 1920, 560, certArt, 1);
    cached(ctx, 'coins', 1200, 120, 1650, 560, coinsArt, 1);
    if (slide > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.35 * slide; light(ctx, lx, ly - 60, 260, C.amber, 0.5); ctx.restore(); }
    for (let i = 0; i < STACKS.length; i++) {
      const st = STACKS[i], [sx, sy] = P(st.u, st.v), gy = sy - st.n * 7 - 2, gx = sx - 12 + (i % 3) * 9;
      const t0 = 41.6 + 600.25 + i * 0.09, pop = Math.exp(-Math.max(0, t - t0 - 0.12) * 3.5) * ramp(t, t0, t0 + 0.12);
      const t1 = 644.1 + i * 0.07, pop2 = Math.exp(-Math.max(0, t - t1 - 0.1) * 3.5) * ramp(t, t1, t1 + 0.1);
      const tw = 0.25 * Math.max(0, Math.sin(t * 2.3 + i * 1.7)) ** 6;
      const g = Math.max(pop, pop2, tw), col = pop2 > pop ? '#ffe2a8' : C.cyanW;
      if (g > 0.01) {
        light(ctx, gx, gy, 50 + 50 * g, col, 0.6 * g);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ffffff', 0.9 * g); ctx.translate(gx, gy); ctx.rotate(0.3);
        const R = 8 + 26 * g; ctx.beginPath(); ctx.moveTo(-R, 0); ctx.quadraticCurveTo(0, 0, 0, -R); ctx.quadraticCurveTo(0, 0, R, 0); ctx.quadraticCurveTo(0, 0, 0, R); ctx.quadraticCurveTo(0, 0, -R, 0); ctx.fill(); ctx.restore();
      }
    }
    ctx.restore();
    // the pen, at rest
    ctx.save();
    const [px, py] = P(110, 330);
    ctx.translate(px, py); ctx.rotate(-1.13);
    ctx.fillStyle = 'rgba(4,4,16,0.5)'; ctx.beginPath(); ctx.ellipse(6, 10, 150, 12, 0, 0, 7); ctx.fill();
    grainFill(ctx, c => roundRect(c, -140, -11, 260, 22, 10), lin(ctx, 0, -11, 0, 11, [[0, '#4a3f8a'], [0.45, '#241e52'], [1, '#0d0b22']]), 0.4);
    grainFill(ctx, c => { c.moveTo(120, -10); c.lineTo(166, 0); c.lineTo(120, 10); c.closePath(); }, lin(ctx, 120, -10, 160, 10, [[0, '#ffd28c'], [1, '#a2521f']]), 0.2);
    ctx.fillStyle = '#e0a050'; ctx.fillRect(66, -11, 9, 22);
    ctx.restore();
    // the contract stack
    const N = 14;
    ctx.save(); ctx.fillStyle = 'rgba(4,4,16,0.55)';
    ctx.translate(10, N * 2.2 + 8); plane(ctx); ctx.translate(cu, cv);
    ctx.beginPath(); roundRect(ctx, -SHEET_W / 2 - 10, -SHEET_H / 2 - 4, SHEET_W + 24, SHEET_H + 18, 16); ctx.fill(); ctx.restore();
    for (let k = N; k >= 1; k--) {
      ctx.save(); ctx.translate(Math.sin(k * 1.7) * 2, k * 2.2); plane(ctx); ctx.translate(cu, cv); ctx.rotate(Math.sin(k * 2.9) * 0.008);
      ctx.fillStyle = k % 3 === 0 ? '#8f88aa' : '#bdb6cc'; ctx.fillRect(-SHEET_W / 2, -SHEET_H / 2, SHEET_W, SHEET_H);
      ctx.restore();
    }
    ctx.save(); plane(ctx); ctx.translate(cu, cv);
    cached(ctx, 'sheet', -SHEET_W / 2 - 4, -SHEET_H / 2 - 4, SHEET_W / 2 + 60, SHEET_H / 2 + 4, contractArt, 1.4);
    clause(ctx, t);
    // his hand rests on the stack, breathing; it relaxes once the clause is gone
    const br = Math.sin(t * 1.8) * 2, rel = ease((t - 644.2) / 1.0) * 230;
    ctx.translate(-150 - 26 * 0.7071 + br - rel, 150 + 26 * 0.7071 + rel); ctx.rotate(-Math.PI / 4 + 0.03 * Math.sin(t * 1.1));
    ctx.scale(1.35, 1.35);
    cached(ctx, 'hand', -770, -160, 200, 200, handArt, 1.0);
    ctx.restore();
    // the cold light above the far side dims as the money leaves; a warm light grows over his side
    cone(ctx, lx, -60, 120, 760, ly + 160, C.cyan, (0.10 + 0.12 * glow) * hum * (1 - 0.5 * slide));
    light(ctx, lx, ly - 40, 360 + 80 * glow, C.cyanW, (0.14 + 0.26 * glow) * hum * (1 - 0.5 * slide));
    light(ctx, wx, wy - 40, 380, '#ffc880', 0.1 + 0.3 * slide);
    light(ctx, 200, 1000, 700, '#ffb35c', 0.18);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const d of DUST) {
      const yy = ((d.y * (ly + 160)) + t * d.v) % (ly + 160), spread = 60 + 320 * yy / (ly + 160), xx = lx + (d.x - 0.5) * 2 * spread + Math.sin(t * 0.6 + d.p) * 12;
      ctx.fillStyle = rgba(C.cyanW, (0.3 + 0.3 * glow) * (0.6 + 0.4 * Math.sin(t * 2 + d.p)) * (1 - 0.5 * slide));
      ctx.beginPath(); ctx.arc(xx, yy - 60, d.s, 0, 7); ctx.fill();
    }
    ctx.restore();
  });
  stamp(ctx, t, 641.85, 645.3, '$2 million', 'his equity', { size: 120 });
  label(ctx, t, 646.8, T1 - 0.1, 'OpenAI', 'dropped the clause · May 2024', 1180, 120);
}

module.exports = { T0, T1, draw };
