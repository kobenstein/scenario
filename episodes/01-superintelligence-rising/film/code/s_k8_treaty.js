// "Two years later, the Montreal Protocol was signed."
// Looking down a long table under warm lamps: hands from both sides, one after another, sign the same document.
// The signatures spread along the table and the last lands on "signed".
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, stamp, label, out, ease } = L;

const T0 = 519.20, T1 = 522.55;

let PAT = null;
function gf(ctx, pathFn, fill, grain = 0.45, box = null) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) { if (!PAT) PAT = ctx.createPattern(L.tex().dark, 'repeat'); ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = PAT;
    if (box) ctx.fillRect(box[0], box[1], box[2], box[3]); else ctx.fillRect(-2000, -2000, 4000, 4000); }
  ctx.restore();
}
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn, S = 1) {
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0); c.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  c.arc(x1, y1, r1, n, n - Math.PI, true); c.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0); c.arc(x0, y0, r0, n + Math.PI, n, true); c.closePath();
}
function rr(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// table plane: u along the table (into depth, up-right), v across it (toward the viewer)
const PO = [880, 600], PU = [0.62, -0.30], PV = [0.62, 0.42];
const plane = c => c.transform(PU[0], PU[1], PV[0], PV[1], PO[0], PO[1]);
const TU = [-1500, 1700], TV = [-300, 300];

const SLEEVES = [['#ffb35c', '#a2521f'], ['#2e2a5c', '#141236'], ['#c9702e', '#5a2a12'], ['#3b2f6e', '#1a1640'], ['#e8964e', '#7a3b17'], ['#24204e', '#0e0c26']];
const R0 = rng(1987);
function sig(r) { // a looped signature in local sheet coords, roughly 150 x 40
  const pts = [], n = 3 + Math.floor(r() * 3), f = 0.18 + r() * 0.08, amp = 12 + r() * 8;
  for (let u = 0; u <= 150; u += 2) { let y = -amp * Math.sin(u * f) * Math.exp(-u / 220); if (u < 20) y -= (20 - u) * 1.2; pts.push([u - 75 - 8 * Math.sin(u * f * 1.3), y + u * 0.06]); }
  pts.push([75, 6]); pts.push([-60, 14]);   // the flourish underline
  return pts;
}
const SEATS = [];
{
  const us = [-1100, -800, -500, -200, 100, 400, 700, 1000, 1300];
  us.forEach((u, i) => {
    for (const side of [1, -1]) {
      if ((i + (side > 0 ? 0 : 1)) % 2) continue;
      SEATS.push({ u: u + (R0() - 0.5) * 60, side, rot: (R0() - 0.5) * 0.2, sig: sig(rng(1 + Math.floor(R0() * 1e6))), sl: SLEEVES[Math.floor(R0() * SLEEVES.length)], hand: R0() < 0.5 ? ['#e0904a', '#8a451c'] : ['#c36a2b', '#5a2a12'] });
    }
  });
  // signing order: from the near end down the table, the last one landing on "signed" (521.71)
  SEATS.sort((a, b) => a.u - b.u);
  SEATS.forEach((s, i) => { s.t0 = lerp(519.5, 520.95, i / (SEATS.length - 1)); s.dur = 0.75; });
}

function roomArt(c) {
  gf(c, cc => cc.rect(-100, -100, W + 200, H + 200), lin(c, 0, 0, 0, H, [[0, '#0a0b24'], [1, '#141236']]), 0.6);
  c.save(); plane(c);
  // floor tiles around the table
  c.strokeStyle = 'rgba(164,159,196,0.06)'; c.lineWidth = 3;
  for (let u = -3000; u < 3000; u += 260) { c.beginPath(); c.moveTo(u, -2000); c.lineTo(u, 2000); c.stroke(); }
  for (let v = -2000; v < 2000; v += 260) { c.beginPath(); c.moveTo(-3000, v); c.lineTo(3000, v); c.stroke(); }
  // table shadow, edge and top
  c.fillStyle = 'rgba(4,4,16,0.5)'; c.fillRect(TU[0] + 30, TV[0] + 40, TU[1] - TU[0], TV[1] - TV[0] + 30);
  gf(c, cc => cc.rect(TU[0], TV[0], TU[1] - TU[0], TV[1] - TV[0] + 24), '#120f2c', 0.4);
  gf(c, cc => cc.rect(TU[0], TV[0], TU[1] - TU[0], TV[1] - TV[0]), lin(c, 0, TV[0], 0, TV[1], [[0, '#2e2660'], [0.5, '#3a3070'], [1, '#262052']]), 0.55);
  // runner cloth down the middle
  gf(c, cc => cc.rect(TU[0], -40, TU[1] - TU[0], 80), lin(c, 0, -40, 0, 40, [[0, '#4a2a52'], [1, '#3a1f44']]), 0.45);
  c.fillStyle = 'rgba(255,179,92,0.25)'; c.fillRect(TU[0], -40, TU[1] - TU[0], 3); c.fillRect(TU[0], 37, TU[1] - TU[0], 3);
  // water glasses and microphones on the centre line
  for (let u = -1300; u < 1600; u += 300) {
    c.fillStyle = 'rgba(216,247,255,0.16)'; c.beginPath(); c.arc(u + 60, -70, 14, 0, 7); c.fill(); c.beginPath(); c.arc(u + 200, 70, 14, 0, 7); c.fill();
    c.strokeStyle = 'rgba(216,247,255,0.35)'; c.lineWidth = 2; c.beginPath(); c.arc(u + 60, -70, 14, 0, 7); c.stroke(); c.beginPath(); c.arc(u + 200, 70, 14, 0, 7); c.stroke();
    c.strokeStyle = '#0e0c26'; c.lineWidth = 5; c.beginPath(); c.moveTo(u + 130, 0); c.lineTo(u + 100, -60); c.stroke();
  }
  // chairs on both sides
  for (let u = -1350; u < 1650; u += 300) for (const v of [-380, 380]) gf(c, cc => rr(cc, u - 70, v - 60, 140, 120, 30), '#18143a', 0.5);
  c.restore();
}

function sheet(ctx, s, t) {
  // in plane coords: sheet centred at (u, side*170)
  const v = s.side * 165;
  ctx.save(); ctx.translate(s.u, v); ctx.rotate(s.rot + (s.side < 0 ? Math.PI : 0));
  ctx.fillStyle = 'rgba(4,4,16,0.35)'; ctx.fillRect(-100, -120, 210, 250);
  gf(ctx, c => c.rect(-105, -125, 210, 250), lin(ctx, 0, -125, 0, 125, [[0, '#f3ead6'], [1, '#c9bca4']]), 0.25, [-110, -130, 220, 260]);
  ctx.fillStyle = 'rgba(40,30,70,0.55)'; for (let j = 0; j < 7; j++) ctx.fillRect(-80, -100 + j * 18, 160 - (j % 3) * 30, 5);
  ctx.fillStyle = 'rgba(40,30,70,0.35)'; ctx.fillRect(-80, 80, 160, 2);
  // the signature, drawn as the pen moves
  const k = clamp((t - s.t0) / s.dur), n = Math.floor(s.sig.length * k);
  let tip = null;
  if (n > 1) { ctx.strokeStyle = '#1a1446'; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(s.sig[0][0] * 0.9, 50 + s.sig[0][1] * 0.9);
    for (let i = 1; i < n; i++) ctx.lineTo(s.sig[i][0] * 0.9, 50 + s.sig[i][1] * 0.9); ctx.stroke(); }
  const idx = clamp(n, 0, s.sig.length - 1), P = s.sig[idx];
  tip = [P[0] * 0.9, 50 + P[1] * 0.9];
  ctx.restore();
  // tip in plane coords
  const a = s.rot + (s.side < 0 ? Math.PI : 0), ca = Math.cos(a), sa = Math.sin(a);
  return [s.u + tip[0] * ca - tip[1] * sa, v + tip[0] * sa + tip[1] * ca, k];
}

function handDraw(ctx, s, tip, k, t) {
  // hand approaches before signing, rests on the paper while the pen moves, then draws back a little
  const app = ease(ramp(t, s.t0 - 0.5, s.t0)), wd = ease(ramp(t, s.t0 + s.dur + 0.1, s.t0 + s.dur + 0.7));
  const reach = app * (1 - wd * 0.45);
  if (reach <= 0.01) return;
  const side = s.side, lift = (k > 0 && k < 1) ? 3 * Math.abs(Math.sin(t * 17)) : 0;
  const rest = [tip[0] + 60, side * 520];
  const px = lerp(rest[0], tip[0], reach), pv = lerp(rest[1], tip[1], reach);
  const hx = px + 34, hv = pv + side * (66 - lift);
  const ex = hx + 150, ev = hv + side * 950;
  const box = [Math.min(px, ex) - 140, Math.min(pv, ev) - 140, Math.abs(ex - px) + 280, Math.abs(ev - pv) + 280];
  // shadow on the table
  ctx.fillStyle = 'rgba(4,4,16,0.32)'; ctx.beginPath(); cap(ctx, ex + 26, ev + 30, hx + 26, hv + 30, 58, 46); ctx.fill();
  // pen, under the fingers
  ctx.strokeStyle = '#0c0a22'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(px, pv); ctx.lineTo(px + 52, pv + side * 118); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,179,92,0.85)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(px + 38, pv + side * 86); ctx.lineTo(px + 46, pv + side * 104); ctx.stroke();
  // sleeve and cuff
  gf(ctx, c => cap(c, ex, ev, hx + 12, hv + side * 70, 62, 50), lin(ctx, ex, ev, hx, hv, [[0, s.sl[1]], [1, s.sl[0]]]), 0.45, box);
  gf(ctx, c => cap(c, hx + 14, hv + side * 74, hx + 10, hv + side * 56, 46, 45), '#e9e2cc', 0.25, box);
  // the hand: back of the hand, knuckles toward the pen, thumb pinching it
  const hf = lin(ctx, hx - 40, hv - side * 50, hx + 40, hv + side * 50, [[0, s.hand[0]], [1, s.hand[1]]]);
  gf(ctx, c => { c.ellipse(hx + 4, hv + side * 10, 46, 52, 0.25 * side, 0, 7); }, hf, 0.35, box);
  gf(ctx, c => { for (let j = 0; j < 4; j++) c.ellipse(hx - 30 + j * 18, hv - side * (34 - Math.abs(j - 1.5) * 4), 12, 16, 0, 0, 7); }, hf, 0.3, box);
  gf(ctx, c => c.ellipse(hx - 40, hv - side * 4, 15, 30, -0.5 * side, 0, 7), s.hand[0], 0.3, box);
  ctx.strokeStyle = rgba('#5a2a12', 0.45); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hx - 24, hv - side * 18); ctx.quadraticCurveTo(hx, hv - side * 24, hx + 26, hv - side * 16); ctx.stroke();
}

function draw(ctx, t) {
  const k = (t - T0) / (T1 - T0);
  const z = lerp(1.0, 1.08, sm(k)), dx = drift(t, 1, 5) * 6 - 120 * sm(k), dy = drift(t, 1, 6) * 4 + 50 * sm(k);
  const fl = 0.95 + 0.05 * Math.sin(t * 1.9);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx, -H / 2 + dy);
  cached(ctx, 'room', -100, -100, W + 300, H + 200, roomArt);
  // warm pools of light from lamps above the table
  for (const u of [-700, 0, 700]) { const x = PO[0] + PU[0] * u, y = PO[1] + PU[1] * u; light(ctx, x, y, 520, '#ffb35c', 0.20 * fl); }
  light(ctx, PO[0], PO[1], 260, '#ffe2a8', 0.12 * fl);
  ctx.save(); plane(ctx);
  const items = SEATS.map(s => ({ s, tip: sheet(ctx, s, t) }));
  // far side hands first (they reach toward us), then near side
  items.filter(i => i.s.side < 0).forEach(i => handDraw(ctx, i.s, i.tip, i.tip[2], t));
  items.filter(i => i.s.side > 0).forEach(i => handDraw(ctx, i.s, i.tip, i.tip[2], t));
  // a small warm glint where each signature completes
  ctx.restore();
  for (const it of items) { const g = ramp(t, it.s.t0 + it.s.dur - 0.1, it.s.t0 + it.s.dur + 0.2) * (1 - ramp(t, it.s.t0 + it.s.dur + 0.4, it.s.t0 + it.s.dur + 1.4));
    if (g > 0) { const x = PO[0] + PU[0] * it.tip[0] + PV[0] * it.tip[1], y = PO[1] + PU[1] * it.tip[0] + PV[1] * it.tip[1]; light(ctx, x, y, 80, '#ffb35c', 0.5 * g); } }
  ctx.restore();
  stamp(ctx, t, 519.3, T1 + 0.4, '1987', 'two years later');
  label(ctx, t, 520.42, T1 + 0.4, 'Montreal Protocol', 'the ozone treaty', 1300, 800);
}

module.exports = { T0, T1, draw };
