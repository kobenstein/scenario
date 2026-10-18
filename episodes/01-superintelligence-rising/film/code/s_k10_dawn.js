// "Let's imagine it's 2035. Just a scenario. Same street, early morning."
// We open on a rose-and-amber dawn sky; the year rolls from 2026 to 2035. On "Same street" the camera cranes down
// onto the hook's San Francisco street, now at sunrise: warm windows, the street lamp clicks off on "morning",
// a person walks uphill, a jogger comes down. The tower window is still cyan, but calm.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const { gf: grainFill } = require('./s_k10_kit');

const T0 = 609.0, T1 = 615.85;

// ---------- the hook's walker figure (feet at 0,0; 100 units tall) ----------
function figure(ctx, x, y, h, o = {}) {
  const amp = o.amp ?? 0, ph = o.ph ?? 0, look = o.look ?? 0, br = o.br ?? 0, slope = o.slope ?? 0;
  const lean = (o.lean ?? 0) + amp * 0.06;
  ctx.save(); ctx.translate(x, y); ctx.scale((o.dir ?? 1) * h / 100, h / 100);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const s = Math.sin(ph), pal = o.pal || ['#ffbe6e', '#e58b3c', '#8a4318'];
  const hip = [0, -50 + amp * 1.6 * s * s];
  const leg = (p, col, w) => {
    const a = amp * 0.42 * Math.sin(p), k = 0.06 + amp * 0.85 * Math.max(0, Math.cos(p)) * (0.5 + 0.5 * Math.sin(p + 0.6));
    const b = a - k;
    const kn = [hip[0] + 24 * Math.sin(a), hip[1] + 24 * Math.cos(a)];
    const an = [kn[0] + 24 * Math.sin(b), kn[1] + 24 * Math.cos(b)];
    kn[1] -= slope * kn[0]; an[1] -= slope * an[0];
    ctx.strokeStyle = col; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(hip[0], hip[1]); ctx.lineTo(kn[0], kn[1]); ctx.lineTo(an[0], an[1]); ctx.stroke();
    ctx.lineWidth = w * 0.75; ctx.beginPath(); ctx.moveTo(an[0] - 1.5, an[1] + 0.5); ctx.lineTo(an[0] + 6.5, an[1] + 0.5 - slope * 6); ctx.stroke();
  };
  const sh = [hip[0] + 30 * Math.sin(lean), hip[1] - 30 * Math.cos(lean) - br * 0.6];
  const arm = (alpha, fore, col, w) => {
    const el = [sh[0] + 15 * Math.sin(alpha), sh[1] + 15 * Math.cos(alpha)];
    const ha = [el[0] + 14 * Math.sin(fore), el[1] + 14 * Math.cos(fore)];
    ctx.strokeStyle = col; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(sh[0], sh[1]); ctx.lineTo(el[0], el[1]); ctx.lineTo(ha[0], ha[1]); ctx.stroke();
    return ha;
  };
  const sw = amp * 0.5 * Math.sin(ph);
  arm(sw, sw + 0.25 + amp * 0.2, o.armFar || '#7d3f19', 5.2);
  leg(ph + Math.PI, o.legFar || '#2e1610', 6.6);
  leg(ph, o.legNear || '#6a3218', 6.8);
  ctx.save(); ctx.translate(hip[0], hip[1]); ctx.rotate(lean);
  const fl = amp * 1.5 * Math.sin(ph * 2);
  const coat = c => { c.moveTo(-9 - fl, 15); c.bezierCurveTo(-8, 2, -9.5, -16, -8.5, -26); c.quadraticCurveTo(-7, -32 - br * 0.5, -1, -32.5);
    c.quadraticCurveTo(6, -32.5, 7.5, -27); c.bezierCurveTo(8.5, -14, 7, 0, 9 + fl, 15); c.quadraticCurveTo(0, 17, -9 - fl, 15); c.closePath(); };
  if (o.rim) { ctx.save(); ctx.translate(o.rimDx ?? 1, -0.6); grainFill(ctx, coat, o.rim, 0); ctx.restore(); }
  grainFill(ctx, coat, lin(ctx, -7, -30, 7, 15, [[0, pal[0]], [0.5, pal[1]], [1, pal[2]]]), 0.35);
  ctx.strokeStyle = 'rgba(90,40,14,0.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-2, -31); ctx.lineTo(2, -20); ctx.lineTo(1.5, 13); ctx.stroke();
  ctx.restore();
  const na = -sw, nf = -sw + 0.3 + amp * 0.2;
  const hand = arm(na, nf, o.armNear || '#d98a3e', 5.4);
  if (o.cup) { ctx.fillStyle = '#f3efe2'; ctx.fillRect(hand[0] - 2.2, hand[1] - 5, 4.4, 6); ctx.fillStyle = '#7a3b17'; ctx.fillRect(hand[0] - 2.4, hand[1] - 2.5, 4.8, 1.6); }
  ctx.save(); ctx.translate(sh[0], sh[1]); ctx.rotate(lean * 0.6 - look * 0.55);
  ctx.strokeStyle = '#a35626'; ctx.lineWidth = 4.2; ctx.beginPath(); ctx.moveTo(0, 1); ctx.lineTo(0.6, -4); ctx.stroke();
  ctx.translate(0.8, -10.5);
  const head = c => c.ellipse(0, 0, 6.6, 7.4, 0, 0, Math.PI * 2);
  grainFill(ctx, head, lin(ctx, 6, -6, -6, 6, [[0, '#ffc488'], [1, '#7a3b17']]), 0.3);
  grainFill(ctx, c => { c.ellipse(-1.2, -1.2, 6.2, 6.6, 0, Math.PI * 0.5, Math.PI * 1.72); c.closePath(); }, o.hair || '#3a1a0b', 0.2);
  if (o.ponytail) grainFill(ctx, c => c.ellipse(-7, -1 + Math.sin(ph * 2) * 1.2, 3.2, 5.5, 0.5 + Math.sin(ph * 2) * 0.2, 0, 7), o.hair || '#3a1a0b', 0.2);
  ctx.restore();
  ctx.restore();
}

// ---------- world (same street as s_hook.js) ----------
const SL = 0.2;
const ground = x => 965 - SL * x;
const WIN = [1265, 196];
const TOWER = { x: 1170, w: 190, top: 70 };
const SUN = t => [255, 612 - 40 * sm((t - T0) / (T1 - T0))];

const HOUSES = (() => {
  const r = rng(41), list = []; let x = 520;
  const pal = ['#3c2f66', '#46356e', '#36305e', '#4c3772', '#41336a'];
  while (x < 2150) {
    const w = 190 + Math.floor(r() * 50), h = 250 + r() * 60;
    const wins = [];
    for (let f = 0; f < 2; f++) for (let k = 0; k < 3; k++) { const v = r(); wins.push({ f, k, lit: v < 0.13 && x > 600, late: v >= 0.13 && v < 0.4 ? 613.6 + r() * 2 : 0, ph: r() * 6 }); }
    list.push({ x, w, h, col: pal[Math.floor(r() * pal.length)], gable: r() < 0.5, bay: r() < 0.75, wins, stair: r() < 0.6 });
    x += w + 2;
  }
  return list;
})();
const DOWNHILL = (() => {
  const r = rng(7), list = []; let x = -60;
  while (x < 620) { const w = 70 + r() * 70; list.push({ x, w, h: 50 + r() * 70, y: 700 + (x + 60) * 0.12 + r() * 30, lit: r() < 0.5, lx: r(), roof: r() < 0.5 }); x += w * 0.7; }
  return list;
})();
const TOWER_WIN = (() => { const r = rng(3), a = []; for (let row = 0; row < 26; row++) for (let c = 0; c < 9; c++) a.push(r()); return a; })();
const HAZE = (() => { const r = rng(19), a = []; for (let i = 0; i < 12; i++) a.push({ x: r() * 2200 - 150, y: 560 + r() * 140, rx: 260 + r() * 340, ry: 26 + r() * 30, sp: 8 + r() * 14, a: 0.04 + r() * 0.05 }); return a; })();
const BIRDS = (() => { const r = rng(23), a = []; for (let i = 0; i < 7; i++) a.push({ x: -200 - r() * 500, y: 160 + r() * 220, v: 70 + r() * 40, s: 5 + r() * 5, ph: r() * 6 }); return a; })();

function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

function sky(ctx, t) {
  const [sx, sy] = SUN(t);
  ctx.fillStyle = lin(ctx, 0, -560, 0, 650, [[0, '#1d1b4a'], [0.3, '#3f3474'], [0.56, '#8a5482'], [0.78, '#e48a72'], [0.93, '#ffc283'], [1, '#ffe0a8']]);
  ctx.fillRect(-400, -1400, W + 800, 2500);
  grainFill(ctx, c => c.rect(-400, -700, W + 800, 1400), 'rgba(0,0,0,0)', 0.35);
  light(ctx, sx, sy, 1300, '#ff9a5a', 0.30);
  light(ctx, sx, sy, 420, '#ffd9a0', 0.42);
  // the last stars, fading at the top
  const r = rng(77);
  for (let i = 0; i < 40; i++) { const x = r() * W, y = -500 + r() * 420, tw = 0.5 + 0.5 * Math.sin(t * (1 + r() * 2) + i); ctx.fillStyle = rgba(C.cream, (0.06 + 0.16 * tw * r()) * 0.7); ctx.fillRect(x, y, 2, 2); }
  // long clouds, lit from below by the sun
  const rc = rng(33);
  for (let i = 0; i < 9; i++) {
    const w = 360 + rc() * 600, cy = -380 + rc() * 820, x = ((rc() * 2400 + (t - T0) * (6 + rc() * 8)) % 2600) - 340, h = 12 + rc() * 18;
    const near = clamp(1 - Math.abs(x - sx) / 1600) * clamp((cy + 400) / 900);
    ctx.save(); ctx.translate(x, cy);
    grainFill(ctx, c => { c.moveTo(-w / 2, 0); c.bezierCurveTo(-w * 0.3, -h, -w * 0.12, -h * 1.7, w * 0.08, -h * 1.1); c.bezierCurveTo(w * 0.3, -h * 1.5, w * 0.44, -h * 0.4, w / 2, 0); c.quadraticCurveTo(0, h * 0.4, -w / 2, 0); c.closePath(); },
      lin(ctx, 0, -h * 1.7, 0, h * 0.4, [[0, rgba('#3e3270', 0.55)], [0.7, rgba('#d27a7a', 0.3 + 0.3 * near)], [1, rgba('#ffc890', 0.45 + 0.4 * near)]]), 0.3);
    ctx.restore();
  }
  // a few birds crossing the dawn
  ctx.strokeStyle = 'rgba(40,24,50,0.75)'; ctx.lineCap = 'round'; ctx.lineWidth = 2;
  for (const b of BIRDS) { const x = b.x + (t - T0) * b.v, y = b.y + Math.sin(t * 0.8 + b.ph) * 8, f = Math.sin(t * 9 + b.ph) * 0.6;
    ctx.beginPath(); ctx.moveTo(x - b.s, y - b.s * f); ctx.quadraticCurveTo(x - b.s * 0.4, y - b.s * 0.3, x, y); ctx.quadraticCurveTo(x + b.s * 0.4, y - b.s * 0.3, x + b.s, y - b.s * f); ctx.stroke(); }
}

function bay(ctx, t) {
  const [sx, sy] = SUN(t);
  grainFill(ctx, c => c.rect(-300, 628, 1100, 300), lin(ctx, 0, 628, 0, 860, [[0, '#d88a7a'], [0.4, '#8a5a82'], [1, '#3a2e62']]), 0.45);
  // sun glitter on the water
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let k = 0; k < 14; k++) { const y = 640 + k * 14, w = (120 - k * 6) * (0.7 + 0.3 * Math.sin(t * 2.6 + k * 1.3)), wob = Math.sin(t * 1.9 + k) * 10;
    ctx.strokeStyle = rgba('#ffe0a8', 0.5 * (1 - k / 14)); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx - w / 2 + wob, y); ctx.lineTo(sx + w / 2 + wob, y); ctx.stroke(); }
  ctx.restore();
  // the sun itself, just clearing the headlands: the hero light
  ctx.fillStyle = rgba('#fff2cf', 0.95); ctx.beginPath(); ctx.arc(sx, sy, 44, 0, 7); ctx.fill();
  light(ctx, sx, sy, 140, '#fff0c0', 0.75); light(ctx, sx, sy, 380, '#ffc890', 0.3);
  grainFill(ctx, c => { c.moveTo(-300, 632); c.bezierCurveTo(-100, 600, 0, 585, 120, 600); c.bezierCurveTo(220, 612, 300, 618, 380, 628); c.lineTo(380, 640); c.lineTo(-300, 640); c.closePath(); }, '#6a3f6e', 0.4);
  const deck = 600, t1 = 90, t2 = 380, top = 478, col = '#5a2e4e';
  ctx.strokeStyle = col; ctx.lineWidth = 2.2;
  const cab = (x0, y0, x1, y1, sag) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, Math.max(y0, y1) + sag, x1, y1); ctx.stroke(); };
  cab(t1, top + 6, t2, top + 6, 230); cab(-120, deck - 2, t1, top + 6, -30); cab(t2, top + 6, 700, deck + 6, -40);
  ctx.lineWidth = 0.8; ctx.strokeStyle = rgba('#6a3a5a', 0.7);
  for (let x = t1 + 12; x < t2; x += 12) { const k = (x - t1) / (t2 - t1), cy = top + 6 + (1 - (2 * k - 1) ** 2) * 115; ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x, deck); ctx.stroke(); }
  ctx.fillStyle = col; ctx.fillRect(-150, deck, 880, 7);
  for (const tx of [t1, t2]) { ctx.fillRect(tx - 7, top, 5, deck - top + 40); ctx.fillRect(tx + 3, top, 5, deck - top + 40); for (let k = 0; k < 4; k++) ctx.fillRect(tx - 7, top + 8 + k * 32, 15, 3); }
  // a few cars' lights on the deck, morning traffic
  for (let i = 0; i < 6; i++) { const x = ((i * 150 + t * 40) % 880) - 150; ctx.fillStyle = rgba('#ffe2a8', 0.7); ctx.fillRect(x, deck + 1, 3, 2); }
}

function towers(ctx, t) {
  grainFill(ctx, c => { c.rect(980, 250, 120, 500); c.rect(1440, 200, 150, 500); c.rect(1640, 300, 110, 500); }, lin(ctx, 0, 200, 0, 700, [[0, '#5a3f78'], [1, '#6a4a7c']]), 0.45);
  // sunlit left edges
  ctx.fillStyle = rgba('#ffb38a', 0.35); ctx.fillRect(980, 250, 8, 500); ctx.fillRect(1440, 200, 9, 500); ctx.fillRect(1640, 300, 7, 500);
  const T = TOWER;
  grainFill(ctx, c => { c.moveTo(T.x, T.top + 30); c.lineTo(T.x + T.w / 2, T.top); c.lineTo(T.x + T.w, T.top + 30); c.lineTo(T.x + T.w, 800); c.lineTo(T.x, 800); c.closePath(); },
    lin(ctx, T.x, 0, T.x + T.w, 0, [[0, '#8a5a82'], [0.18, '#55407a'], [1, '#3a2e64']]), 0.5);
  ctx.fillStyle = '#3a2e64'; ctx.fillRect(T.x + T.w / 2 - 2, T.top - 60, 4, 62);
  light(ctx, T.x + T.w / 2, T.top - 60, 18, '#ff6d5d', 0.4 * (Math.sin(t * 3.4) > 0.2 ? 1 : 0.15));
  for (let row = 0; row < 26; row++) for (let c = 0; c < 9; c++) {
    const v = TOWER_WIN[row * 9 + c], x = T.x + 14 + c * 19.5, y = T.top + 54 + row * 26;
    ctx.fillStyle = v > 0.86 ? rgba('#ffcf8a', 0.55) : rgba(c < 3 ? '#ffc8a0' : '#2a2252', c < 3 ? 0.18 + 0.2 * v : 0.35 + 0.25 * v); ctx.fillRect(x, y, 12, 15);
  }
  // THE window, still cyan, but calm now
  const [wx, wy] = WIN, br = 0.9 + 0.1 * Math.sin(t * 1.3);
  ctx.fillStyle = rgba(C.cyanW, 0.85); ctx.fillRect(wx - 10, wy - 13, 20, 27);
  ctx.fillStyle = rgba(C.cyan, 0.5); ctx.fillRect(wx - 10, wy + 6, 20, 8);
  light(ctx, wx, wy, 70, C.cyanW, 0.35 * br);
  light(ctx, wx, wy, 240, C.cyan, 0.12 * br);
}

function hospital(ctx, t) {
  // a small hospital down the road (it is the next sentence)
  const x = 150, y = 668, w = 230, h = 120;
  grainFill(ctx, c => c.rect(x, y, w, h + 60), lin(ctx, x, y, x + w, y, [[0, '#f0c8b0'], [0.25, '#b88aa0'], [1, '#6a4f80']]), 0.4);
  grainFill(ctx, c => c.rect(x + w - 70, y - 40, 70, h + 100), lin(ctx, x, y, x + w, y, [[0, '#d8a8a8'], [1, '#5a4478']]), 0.4);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 7; k++) { const lit = (r * 7 + k) % 3 === 0; ctx.fillStyle = lit ? rgba('#ffd59a', 0.8) : 'rgba(60,40,90,0.55)'; ctx.fillRect(x + 12 + k * 22, y + 14 + r * 26, 12, 12); }
  // the sign
  ctx.fillStyle = '#f3efe2'; ctx.fillRect(x + w - 56, y - 34, 42, 42);
  ctx.fillStyle = '#2e6f8c'; ctx.font = '36px "Inter SemiBold"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('H', x + w - 35, y - 12);
  light(ctx, x + w - 35, y - 12, 50, '#ffe2b0', 0.12);
}

function downhill(ctx, t) {
  for (const d of DOWNHILL) {
    if (d.x > 120 && d.x < 360) continue;
    grainFill(ctx, c => { c.moveTo(d.x, d.y); if (d.roof) { c.lineTo(d.x + d.w / 2, d.y - 26); } c.lineTo(d.x + d.w, d.y); c.lineTo(d.x + d.w, 1000); c.lineTo(d.x, 1000); c.closePath(); },
      lin(ctx, 0, d.y - 30, 0, 900, [[0, '#6a4a7e'], [1, '#2e2656']]), 0.5);
    ctx.fillStyle = rgba('#ffb38a', 0.3); ctx.fillRect(d.x, d.y, 4, 120);
    if (d.lit) { ctx.fillStyle = rgba(C.amber, 0.6); ctx.fillRect(d.x + 12 + d.lx * (d.w - 36), d.y + 16, 10, 12); }
  }
  hospital(ctx, t);
}

function house(ctx, hs, t) {
  const x0 = hs.x, x1 = hs.x + hs.w, top = ground(x0 + hs.w / 2) - hs.h, base0 = ground(x0) - 10, base1 = ground(x1) - 10;
  grainFill(ctx, c => { c.moveTo(x0, top); c.lineTo(x1, top); c.lineTo(x1, base1 + 30); c.lineTo(x0, base0 + 30); c.closePath(); },
    lin(ctx, x0, top, x1, base0, [[0, '#7a5a8e'], [0.22, hs.col], [1, '#241e48']]), 0.5);
  if (hs.gable) grainFill(ctx, c => { c.moveTo(x0 - 6, top + 2); c.lineTo(x0 + hs.w / 2, top - 70); c.lineTo(x1 + 6, top + 2); c.closePath(); }, lin(ctx, x0, 0, x1, 0, [[0, '#9a6a8a'], [0.5, '#4e3a74'], [1, '#33295c']]), 0.5);
  else { ctx.fillStyle = '#5a4580'; ctx.fillRect(x0 - 6, top - 16, hs.w + 12, 14); ctx.fillStyle = '#2e2656'; for (let k = 0; k < hs.w; k += 14) ctx.fillRect(x0 + k, top - 2, 6, 6); }
  // the sun catches the roof edge and the left side
  ctx.fillStyle = 'rgba(255,190,150,0.35)'; ctx.fillRect(x0, top, hs.w, 3); ctx.fillRect(x0, top, 5, hs.h);
  const fh = (hs.h - 40) / 2;
  ctx.fillStyle = 'rgba(255,210,180,0.10)'; ctx.fillRect(x0, top + fh + 10, hs.w, 4);
  const bx = x0 + 18, bw = hs.w * 0.52;
  if (hs.bay) { grainFill(ctx, c => { c.moveTo(bx, top + 20); c.lineTo(bx + bw, top + 20); c.lineTo(bx + bw - 8, top + 2 * fh + 6); c.lineTo(bx + 8, top + 2 * fh + 6); c.closePath(); }, 'rgba(30,20,60,0.25)', 0);
    ctx.fillStyle = 'rgba(255,210,180,0.14)'; ctx.fillRect(bx, top + 14, bw, 6); ctx.fillRect(bx, top + 20, 3, 2 * fh - 14); }
  for (const w of hs.wins) {
    const ww = w.k < 2 ? bw / 2 - 18 : hs.w * 0.2, wx = w.k < 2 ? bx + 10 + w.k * (bw / 2 - 4) : x1 - hs.w * 0.3, wy = top + 34 + w.f * fh, wh = fh - 46;
    roundRect(ctx, wx, wy, ww, wh, ww / 2.2);
    const on = w.lit ? 1 : w.late ? ramp(t, w.late, w.late + 0.25) : 0;
    ctx.fillStyle = '#2a2250'; ctx.fill();
    ctx.fillStyle = 'rgba(255,170,150,0.16)'; ctx.fillRect(wx + 2, wy + 4, ww * 0.3, wh - 8);   // sky reflection
    if (on > 0) {
      const a = (0.7 + 0.08 * Math.sin(t * 1.1 + w.ph)) * on;
      roundRect(ctx, wx, wy, ww, wh, ww / 2.2);
      ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, rgba('#ffdba0', a)], [1, rgba(C.amberM, a)]]); ctx.fill();
      light(ctx, wx + ww / 2, wy + wh / 2, 60, C.amber, 0.10 * on);
      ctx.fillStyle = rgba('#3a1a0a', 0.45 * on); ctx.fillRect(wx + ww / 2 - 1, wy, 2, wh);
    }
  }
  const dx = x1 - hs.w * 0.3, dy = ground(dx) - 10;
  ctx.fillStyle = '#2a1e48'; roundRect(ctx, dx, dy - 96, hs.w * 0.2, 86, 10); ctx.fill();
  if (hs.stair) for (let k = 0; k < 4; k++) { ctx.fillStyle = k % 2 ? '#3a2e62' : '#463670'; ctx.fillRect(dx - 6 - k * 8, dy - 10 + k * 5, hs.w * 0.2 + 12 + k * 8, 5); }
}

function poles(ctx, t) {
  const P = [800, 1390, 1980].map(x => ({ x, y: ground(x) - 12, top: ground(x) - 390 }));
  P.unshift({ x: -90, y: ground(-90), top: ground(-90) - 390 });
  const sway = Math.sin(t * 0.8) * 3;
  ctx.strokeStyle = '#2a1e46'; ctx.lineWidth = 2;
  for (let i = 0; i < P.length - 1; i++) for (let k = -1; k <= 1; k++) {
    const a = P[i], b = P[i + 1], ya = a.top + 6 + (k === 0 ? 18 : 0), yb = b.top + 6 + (k === 0 ? 18 : 0);
    ctx.beginPath(); ctx.moveTo(a.x + k * 34, ya); ctx.quadraticCurveTo((a.x + b.x) / 2 + k * 34, (ya + yb) / 2 + 60 + sway + k * 4, b.x + k * 34, yb); ctx.stroke();
  }
  for (const p of P) {
    grainFill(ctx, c => { c.moveTo(p.x - 7, p.y); c.lineTo(p.x - 4, p.top); c.lineTo(p.x + 4, p.top); c.lineTo(p.x + 7, p.y); c.closePath(); }, '#2a1e46', 0.3);
    ctx.fillStyle = '#2a1e46'; ctx.fillRect(p.x - 44, p.top + 4, 88, 6); ctx.fillRect(p.x - 26, p.top + 22, 52, 5);
  }
  ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-100, 120); ctx.quadraticCurveTo(700, 330 + sway, 1390, ground(1390) - 384); ctx.stroke();
  // two birds sitting on the wire, one hops
  const hop = Math.max(0, Math.sin((t - 612) * 2.2)) ** 8 * 10;
  for (const [bx, k] of [[1010, 0], [1050, 1]]) { const y = ground(1390) - 384 + 40 + (bx - 1000) * -0.06 - (k ? hop : 0);
    ctx.fillStyle = '#2a1e46'; ctx.beginPath(); ctx.ellipse(bx, y - 6, 7, 5, -0.2, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(bx + 6, y - 11, 3.5, 0, 7); ctx.fill(); }
}

function street(ctx, t, lampOn) {
  grainFill(ctx, c => { c.moveTo(-300, ground(-300) - 12); c.lineTo(2300, ground(2300) - 12); c.lineTo(2300, ground(2300) + 18); c.lineTo(-300, ground(-300) + 18); c.closePath(); },
    lin(ctx, 0, 500, 0, 1080, [[0, '#7a5a86'], [1, '#4a3a6e']]), 0.45);
  grainFill(ctx, c => { c.moveTo(-300, ground(-300) + 16); c.lineTo(2300, ground(2300) + 16); c.lineTo(2300, 1400); c.lineTo(-300, 1400); c.closePath(); },
    lin(ctx, 0, 560, 0, 1080, [[0, '#45375f'], [1, '#1c1838']]), 0.55);
  ctx.strokeStyle = 'rgba(255,210,180,0.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-300, ground(-300) + 16); ctx.lineTo(2300, ground(2300) + 16); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,200,140,0.32)'; ctx.lineWidth = 4; ctx.setLineDash([46, 40]);
  ctx.beginPath(); ctx.moveTo(-300, ground(-300) + 150); ctx.lineTo(2300, ground(2300) + 150); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(255,210,180,0.12)'; ctx.lineWidth = 2;
  for (const o of [100, 205]) { ctx.beginPath(); ctx.moveTo(-300, ground(-300) + o); ctx.lineTo(2300, ground(2300) + o); ctx.stroke(); }
  // low sun raking across the asphalt from the left
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 0, 0, 1600, 0, [[0, 'rgba(255,170,110,0.16)'], [1, 'rgba(255,170,110,0)']]); ctx.beginPath(); ctx.moveTo(-300, ground(-300) + 16); ctx.lineTo(2300, ground(2300) + 16); ctx.lineTo(2300, 1400); ctx.lineTo(-300, 1400); ctx.closePath(); ctx.fill();
  ctx.restore();
  const lx = 650, ly = ground(lx) - 12, lt = ly - 300;
  ctx.fillStyle = '#2a1e46'; ctx.fillRect(lx - 3, lt, 6, 300); ctx.fillRect(lx - 3, lt, 46, 5);
  ctx.beginPath(); ctx.moveTo(lx + 28, lt + 4); ctx.lineTo(lx + 52, lt + 4); ctx.lineTo(lx + 46, lt + 14); ctx.lineTo(lx + 34, lt + 14); ctx.closePath(); ctx.fill();
  const f = lampOn;
  ctx.fillStyle = f > 0.02 ? rgba('#ffd9a0', 0.9 * f) : '#5a4a6e'; ctx.fillRect(lx + 34, lt + 12, 12, 3);
  cone(ctx, lx + 40, lt + 14, 14, 230, 300, C.amber, 0.06 * f);
  light(ctx, lx + 40, lt + 14, 46, C.amber, 0.35 * f);
}

function car(ctx, t) {
  const x = 1330, y = ground(x) + 175;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.atan(SL)); ctx.scale(1.35, 1.35);
  const body = c => { c.moveTo(-10, 0); c.lineTo(-6, -40); c.quadraticCurveTo(10, -48, 60, -50); c.lineTo(110, -88); c.quadraticCurveTo(170, -96, 230, -88); c.lineTo(270, -52);
    c.quadraticCurveTo(330, -48, 340, -30); c.lineTo(342, 0); c.closePath(); };
  ctx.save(); ctx.translate(-3, -2); grainFill(ctx, body, rgba('#ffc0a0', 0.4), 0); ctx.restore();
  grainFill(ctx, body, lin(ctx, 0, -96, 0, 0, [[0, '#5a4580'], [1, '#221c44']]), 0.5);
  ctx.fillStyle = '#2a2250'; ctx.beginPath(); ctx.moveTo(120, -80); ctx.lineTo(176, -84); ctx.lineTo(176, -54); ctx.lineTo(96, -54); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(186, -84); ctx.lineTo(226, -82); ctx.lineTo(256, -54); ctx.lineTo(186, -54); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,190,160,0.25)'; ctx.fillRect(130, -80, 20, 24);
  ctx.fillStyle = '#120f26'; for (const wx of [60, 270]) { ctx.beginPath(); ctx.arc(wx, 0, 27, 0, 7); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,210,180,0.3)'; for (const wx of [60, 270]) { ctx.beginPath(); ctx.arc(wx, 0, 10, 0, 7); ctx.fill(); }
  ctx.restore();
}

function haze(ctx, t, band) {
  for (const f of HAZE) {
    if ((f.y > 630) !== band) continue;
    const x = ((f.x + t * f.sp + 300) % 2400) - 300;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, 0, 0, 0, 1, [[0, rgba('#ffb09a', f.a)], [1, rgba('#ffb09a', 0)]]);
    ctx.translate(x, f.y); ctx.scale(f.rx, f.ry); ctx.beginPath(); ctx.arc(0, 0, 1, 0, 7); ctx.fill(); ctx.restore();
  }
}

// odometer: the year's last two digits roll from 26 to 35
function year(ctx, t) {
  const a = ramp(t, 609.15, 609.7) * (1 - ramp(t, 615.2, 615.75)); if (a <= 0) return;
  const v = 26 + 9 * ease((t - 610.2) / 1.15), size = 168, x = 96, y = 70 + (1 - out((t - 609.15) / 0.9)) * 18;
  ctx.save(); ctx.globalAlpha = a; ctx.font = `${size}px "Instrument Serif"`; ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(30,14,40,0.55)'; ctx.shadowBlur = 24; ctx.fillStyle = C.cream;
  ctx.fillText('20', x, y);
  const dw = ctx.measureText('0').width, x2 = x + ctx.measureText('20').width;
  const ones = v % 10, tensV = Math.floor(v / 10) + (ones > 9 ? ones - 9 : 0);
  const slot = (val, sx) => {
    const d = Math.floor(val) % 10, fr = val - Math.floor(val);
    ctx.save(); ctx.beginPath(); ctx.rect(sx - 10, y + size * 0.1, dw + 20, size * 0.8); ctx.clip();
    ctx.fillText(String(d), sx, y - fr * size * 0.9);
    if (fr > 0.001) ctx.fillText(String((d + 1) % 10), sx, y + (1 - fr) * size * 0.9);
    ctx.restore();
  };
  slot(tensV, x2); slot(ones, x2 + dw);
  // sub line
  const sa = ramp(t, 611.95, 612.5);
  if (sa > 0) { ctx.globalAlpha = a * sa; ctx.font = '28px "Inter Medium"'; ctx.letterSpacing = '6px'; ctx.fillStyle = '#ffe6c4'; ctx.shadowBlur = 16;
    ctx.fillText('JUST A SCENARIO', x + 6, y + size * 1.0 + (1 - out((t - 611.95) / 0.8)) * 10); }
  ctx.restore();
}

const V = 74, X0 = 270;
function draw(ctx, t) {
  const z = 1 + 0.06 * sm((t - T0) / (T1 - T0));
  const dx = drift(t, 1, 1) * 5, dy = drift(t, 1, 2) * 3;
  const crane = 430 * (1 - ease((t - 612.9) / 2.1));          // start looking at the sky, crane down on "Same street"
  const [fx, fy] = [980, 420];
  const layer = (par, fn) => {
    const zz = 1 + (z - 1) * (0.55 + par * 0.5);
    ctx.save(); ctx.translate(fx, fy); ctx.scale(zz, zz); ctx.translate(-fx + dx * par, -fy + dy * par + crane * (0.45 + 0.7 * par)); fn(); ctx.restore();
  };
  ctx.translate(620, 640); ctx.scale(1.08, 1.08); ctx.translate(-620, -640);
  layer(0.1, () => sky(ctx, t));
  layer(0.2, () => { bay(ctx, t); haze(ctx, t, false); });
  layer(0.3, () => towers(ctx, t));
  layer(0.45, () => { downhill(ctx, t); haze(ctx, t, true); });
  layer(0.6, () => { for (const hs of HOUSES) house(ctx, hs, t); });
  layer(0.7, () => poles(ctx, t));
  layer(0.8, () => {
    street(ctx, t, 1 - ramp(t, 614.6, 614.75));
    // the walker, uphill, coffee in hand; turns to the sun for a moment
    const pos = (t - T0) * V, fxw = X0 + pos;
    ctx.fillStyle = 'rgba(40,20,50,0.3)'; ctx.beginPath(); ctx.ellipse(fxw + 30, ground(fxw) + 2, 50, 5, -Math.atan(SL), 0, 7); ctx.fill();   // long shadow away from the sun
    figure(ctx, fxw, ground(fxw), 112, { ph: pos / 84 * Math.PI * 2, amp: 0.9, slope: SL, br: Math.sin(t * 2.4), cup: true,
      look: -0.4 * ramp(t, 614.0, 614.7) * (1 - ramp(t, 615.2, 615.8)), lean: 0.04, rim: rgba('#ffe2b8', 0.8), rimDx: -1.2 });
    // a jogger coming downhill
    const jx = 1720 - (t - T0) * 150, jph = (t - T0) * 2 * Math.PI * 1.45;
    figure(ctx, jx, ground(jx) + 4, 104, { ph: jph, amp: 1.35, slope: -SL, dir: -1, br: Math.sin(t * 4), lean: 0.1, ponytail: true, hair: '#2a1208',
      pal: ['#6fb8c8', '#3d7d92', '#1e4a5e'], legNear: '#2a2448', legFar: '#1a1634', armNear: '#c47a3c', armFar: '#8a4a22', rim: rgba('#ffe2b8', 0.7), rimDx: 1.2 });
  });
  layer(1.2, () => car(ctx, t));
  layer(1.0, () => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 3; i++) {
    const x = ((i * 900 + t * 30) % 2600) - 400; ctx.fillStyle = rad(ctx, x, 1040, 0, 600, [[0, 'rgba(255,170,140,0.06)'], [1, 'rgba(255,170,140,0)']]); ctx.fillRect(x - 600, 700, 1200, 500); } ctx.restore(); });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  year(ctx, t);
}

module.exports = { T0, T1, draw };
