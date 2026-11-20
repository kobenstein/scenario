// "It has started."
// A steep San Francisco street at night. A small figure walks uphill, eyes on a phone.
// On "started" one high window in a dark tower lights up cyan; the figure stops and looks up.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, out, clamp } = L;

const T0 = 0.0, T1 = 2.35;
const T_ON = 1.155;                      // "started." @1.16

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

// ---------- a small faceless figure built from joints (feet at 0,0; 100 units tall) ----------
function figure(ctx, x, y, h, o = {}) {
  const amp = o.amp ?? 0, ph = o.ph ?? 0, phone = o.phone ?? 0, look = o.look ?? 0, br = o.br ?? 0, slope = o.slope ?? 0;
  const lean = (o.lean ?? 0) + amp * 0.06;
  ctx.save(); ctx.translate(x, y); ctx.scale((o.dir ?? 1) * h / 100, h / 100);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const s = Math.sin(ph);
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
  // the arm hangs from a rounded shoulder a little below the collar (not from the top of the back),
  // with a tapered sleeve and a small round hand
  const ash = [sh[0] - 2.6 * Math.sin(lean) + 0.6, sh[1] + 2.6 * Math.cos(lean)];
  const arm = (alpha, fore, col, w) => {
    const el = [ash[0] + 14 * Math.sin(alpha), ash[1] + 14 * Math.cos(alpha)];
    const ha = [el[0] + 13 * Math.sin(fore), el[1] + 13 * Math.cos(fore)];
    ctx.strokeStyle = col; ctx.fillStyle = col;
    ctx.lineWidth = w * 1.12; ctx.beginPath(); ctx.moveTo(ash[0], ash[1]); ctx.lineTo(el[0], el[1]); ctx.stroke();
    ctx.lineWidth = w * 0.88; ctx.beginPath(); ctx.moveTo(el[0], el[1]); ctx.lineTo(ha[0], ha[1]); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(ash[0], ash[1] - 0.4, w * 0.72, w * 0.64, 0, 0, Math.PI * 2); ctx.fill();   // shoulder cap
    ctx.beginPath(); ctx.ellipse(ha[0] + 0.8 * Math.sin(fore), ha[1] + 0.8 * Math.cos(fore), w * 0.5, w * 0.44, 0, 0, Math.PI * 2); ctx.fill(); // hand
    return ha;
  };
  const sw = amp * 0.5 * Math.sin(ph);
  // far side (darker)
  arm(sw, sw + 0.25 + amp * 0.2, '#7d3f19', 5.2);
  leg(ph + Math.PI, '#2e1610', 6.6);
  // near leg
  leg(ph, '#6a3218', 6.8);
  // torso: a short coat
  ctx.save(); ctx.translate(hip[0], hip[1]); ctx.rotate(lean);
  const fl = amp * 1.5 * Math.sin(ph * 2);  // hem swings with the stride
  const coat = c => { c.moveTo(-9 - fl, 15); c.bezierCurveTo(-8, 2, -9.5, -16, -8.5, -26); c.quadraticCurveTo(-7, -32 - br * 0.5, -1, -32.5);
    c.quadraticCurveTo(6, -32.5, 7.5, -27); c.bezierCurveTo(8.5, -14, 7, 0, 9 + fl, 15); c.quadraticCurveTo(0, 17, -9 - fl, 15); c.closePath(); };
  if (o.rim) { ctx.save(); ctx.translate(o.rimDx ?? 1, -0.6); grainFill(ctx, coat, o.rim, 0); ctx.restore(); }
  grainFill(ctx, coat, lin(ctx, -7, -30, 7, 15, [[0, '#ffbe6e'], [0.5, '#e58b3c'], [1, '#8a4318']]), 0.35);
  ctx.strokeStyle = 'rgba(90,40,14,0.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-2, -31); ctx.lineTo(2, -20); ctx.lineTo(1.5, 13); ctx.stroke();
  ctx.restore();
  // near arm (holds the phone)
  const na = lerp(-sw, 0.22, phone), nf = lerp(-sw + 0.3 + amp * 0.2, 1.95, phone);
  const hand = arm(na, nf, '#d98a3e', 5.4);
  if (phone > 0.05) {
    ctx.save(); ctx.translate(hand[0] + 1, hand[1] - 1); ctx.rotate(-0.5);
    ctx.fillStyle = rgba(C.cyanW, 0.95 * phone); ctx.fillRect(-1.6, -3, 3.2, 5.6); ctx.restore();
    light(ctx, hand[0] + 1, hand[1] - 2, 16, C.cyan, 0.5 * phone);
  }
  // neck and head
  ctx.save(); ctx.translate(sh[0], sh[1]); ctx.rotate(lean * 0.6 - look * 0.55);
  ctx.strokeStyle = '#a35626'; ctx.lineWidth = 4.2; ctx.beginPath(); ctx.moveTo(0, 1); ctx.lineTo(0.6, -4); ctx.stroke();
  ctx.translate(0.8, -10.5);
  const head = c => c.ellipse(0, 0, 6.6, 7.4, 0, 0, Math.PI * 2);
  grainFill(ctx, head, lin(ctx, 6, -6, -6, 6, [[0, '#d98a3e'], [1, '#7a3b17']]), 0.3);
  grainFill(ctx, c => { c.ellipse(-1.2, -1.2, 6.2, 6.6, 0, Math.PI * 0.5, Math.PI * 1.72); c.closePath(); }, '#3a1a0b', 0.2); // hair, back of head
  if (o.faceLight) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(o.faceLightCol ?? C.cyan, o.faceLight); ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.ellipse(0, 0, 5.6, 6.4, 0, -1.2, 0.9); ctx.stroke(); ctx.restore(); }
  ctx.restore();
  ctx.restore();
}

// ---------- world ----------
const SL = 0.2;
const ground = x => 965 - SL * x;          // the sidewalk line where feet land
const WIN = [1265, 196];                   // the window
const TOWER = { x: 1170, w: 190, top: 70 };

// victorian houses climbing the hill
const HOUSES = (() => {
  const r = rng(41), list = []; let x = 520;
  const pal = ['#17143a', '#1c1744', '#141433', '#211a4c', '#18153e'];
  while (x < 2150) {
    const w = 190 + Math.floor(r() * 50), h = 250 + r() * 60;
    const wins = [];
    for (let f = 0; f < 2; f++) for (let k = 0; k < 3; k++) wins.push({ f, k, lit: r() < 0.13 && x > 600, ph: r() * 6 });
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
const FOG = (() => { const r = rng(19), a = []; for (let i = 0; i < 14; i++) a.push({ x: r() * 2200 - 150, y: 560 + r() * 140, rx: 260 + r() * 340, ry: 26 + r() * 30, sp: 8 + r() * 14, a: 0.03 + r() * 0.05 }); return a; })();

function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

function windowOn(t) {
  if (t < T_ON) return 0;
  const d = t - T_ON;
  if (d < 0.07) return 1; if (d < 0.12) return 0.45; return 0.9 + 0.1 * Math.sin(t * 9) * Math.sin(t * 2.3);
}

function sky(ctx, t) {
  grainFill(ctx, c => c.rect(-300, -300, W + 600, H + 600), lin(ctx, 0, -100, 0, 760, [[0, '#060717'], [0.45, '#121640'], [0.8, '#2f2763'], [1, '#4a3d7d']]), 0.55);
  light(ctx, 200, 620, 620, '#5a4a8a', 0.2);
  // faint stars
  const r = rng(77);
  for (let i = 0; i < 70; i++) { const x = r() * W, y = r() * 380, tw = 0.5 + 0.5 * Math.sin(t * (1 + r() * 2) + i); ctx.fillStyle = rgba(C.cream, 0.08 + 0.18 * tw * r()); ctx.fillRect(x, y, 2, 2); }
}

function bay(ctx, t) {
  // water
  grainFill(ctx, c => c.rect(-300, 628, 1100, 300), lin(ctx, 0, 628, 0, 860, [[0, '#2a2459'], [1, '#100f2c']]), 0.5);
  // far hills of the headlands
  grainFill(ctx, c => { c.moveTo(-300, 632); c.bezierCurveTo(-100, 600, 0, 585, 120, 600); c.bezierCurveTo(220, 612, 300, 618, 380, 628); c.lineTo(380, 640); c.lineTo(-300, 640); c.closePath(); }, '#2b2560', 0.4);
  // the Golden Gate, small and far
  const deck = 600, t1 = 90, t2 = 380, top = 478;
  const col = '#40357a';
  ctx.strokeStyle = col; ctx.lineWidth = 2.2;
  const cab = (x0, y0, x1, y1, sag) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, Math.max(y0, y1) + sag, x1, y1); ctx.stroke(); };
  cab(t1, top + 6, t2, top + 6, 230); cab(-120, deck - 2, t1, top + 6, -30); cab(t2, top + 6, 700, deck + 6, -40);
  // hangers
  ctx.lineWidth = 0.8; ctx.strokeStyle = rgba('#5a4a8a', 0.7);
  for (let x = t1 + 12; x < t2; x += 12) { const k = (x - t1) / (t2 - t1), cy = top + 6 + (1 - (2 * k - 1) ** 2) * 115; ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x, deck); ctx.stroke(); }
  ctx.fillStyle = col; ctx.fillRect(-150, deck, 880, 7);
  for (const tx of [t1, t2]) { ctx.fillRect(tx - 7, top, 5, deck - top + 40); ctx.fillRect(tx + 3, top, 5, deck - top + 40); for (let k = 0; k < 4; k++) ctx.fillRect(tx - 7, top + 8 + k * 32, 15, 3); }
  // deck lights + their twinkling reflection
  for (let i = 0; i < 26; i++) { const x = -120 + i * 32, a = 0.35 + 0.25 * Math.sin(t * 2 + i * 1.7);
    ctx.fillStyle = rgba(C.amber, a); ctx.fillRect(x, deck + 1, 2, 2);
    ctx.fillStyle = rgba(C.amber, a * 0.25); ctx.fillRect(x + Math.sin(t * 3 + i) * 2, deck + 40 + (i % 3) * 12, 2, 6); }
  light(ctx, t1 + 1, top - 2, 9, '#ff4d4d', 0.5 + 0.4 * Math.sin(t * 4));
  light(ctx, t2 + 1, top - 2, 9, '#ff4d4d', 0.5 + 0.4 * Math.sin(t * 4 + 1));
}

function towers(ctx, t) {
  // a couple of dim far towers for the skyline
  grainFill(ctx, c => { c.rect(980, 250, 120, 500); c.rect(1440, 200, 150, 500); c.rect(1640, 300, 110, 500); }, lin(ctx, 0, 200, 0, 700, [[0, '#1b1a48'], [1, '#2c255e']]), 0.5);
  // the tower
  const T = TOWER;
  grainFill(ctx, c => { c.moveTo(T.x, T.top + 30); c.lineTo(T.x + T.w / 2, T.top); c.lineTo(T.x + T.w, T.top + 30); c.lineTo(T.x + T.w, 800); c.lineTo(T.x, 800); c.closePath(); },
    lin(ctx, T.x, 0, T.x + T.w, 0, [[0, '#161543'], [0.55, '#1d1b4d'], [1, '#0f0e30']]), 0.55);
  // mast + aviation light
  ctx.fillStyle = '#121136'; ctx.fillRect(T.x + T.w / 2 - 2, T.top - 60, 4, 62);
  light(ctx, T.x + T.w / 2, T.top - 60, 22, '#ff4d4d', 0.6 * (Math.sin(t * 3.4) > 0.2 ? 1 : 0.15));
  // dark windows, faint
  for (let row = 0; row < 26; row++) for (let c = 0; c < 9; c++) {
    const v = TOWER_WIN[row * 9 + c], x = T.x + 14 + c * 19.5, y = T.top + 54 + row * 26;
    ctx.fillStyle = rgba('#3b3a7a', 0.25 + 0.25 * v); ctx.fillRect(x, y, 12, 15);
  }
  // THE window
  const on = windowOn(t);
  const [wx, wy] = WIN;
  ctx.fillStyle = '#0b0c26'; ctx.fillRect(wx - 12, wy - 15, 24, 31);
  if (on > 0) {
    const grow = out((t - T_ON) / 0.6);
    ctx.fillStyle = rgba(C.cyanW, on); ctx.fillRect(wx - 10, wy - 13, 20, 27);
    ctx.fillStyle = rgba(C.cyan, on * 0.6); ctx.fillRect(wx - 10, wy + 6, 20, 8);
    // a tiny silhouette at the window
    ctx.fillStyle = rgba('#0b2a40', 0.7 * on); ctx.beginPath(); ctx.ellipse(wx + 2, wy - 1, 2.6, 3, 0, 0, 7); ctx.fill(); ctx.fillRect(wx - 1, wy + 2, 6, 8);
    light(ctx, wx, wy, 70 + 60 * grow, C.cyanW, 0.8 * on);
    light(ctx, wx, wy, 300 + 220 * grow, C.cyan, 0.26 * on * (0.6 + 0.4 * grow));
    light(ctx, wx, wy, 900, C.cyanD, 0.12 * on * grow);
    // spill on the facade
    ctx.save(); ctx.beginPath(); ctx.rect(TOWER.x, TOWER.top, TOWER.w, 800); ctx.clip();
    light(ctx, wx, wy + 30, 120, C.cyan, 0.12 * on * grow); ctx.restore();
  }
}

function downhill(ctx, t) {
  for (const d of DOWNHILL) {
    grainFill(ctx, c => { c.moveTo(d.x, d.y); if (d.roof) { c.lineTo(d.x + d.w / 2, d.y - 26); } c.lineTo(d.x + d.w, d.y); c.lineTo(d.x + d.w, 1000); c.lineTo(d.x, 1000); c.closePath(); },
      lin(ctx, 0, d.y - 30, 0, 900, [[0, '#1c1a48'], [1, '#0b0b22']]), 0.55);
    if (d.lit) { const a = 0.35 + 0.1 * Math.sin(t * 1.3 + d.x); ctx.fillStyle = rgba(C.amber, a); ctx.fillRect(d.x + 12 + d.lx * (d.w - 36), d.y + 16, 10, 12); light(ctx, d.x + 17 + d.lx * (d.w - 36), d.y + 22, 30, C.amber, 0.12); }
  }
}

function house(ctx, hs, t) {
  const x0 = hs.x, x1 = hs.x + hs.w, top = ground(x0 + hs.w / 2) - hs.h, base0 = ground(x0) - 10, base1 = ground(x1) - 10;
  // body
  grainFill(ctx, c => { c.moveTo(x0, top); c.lineTo(x1, top); c.lineTo(x1, base1 + 30); c.lineTo(x0, base0 + 30); c.closePath(); },
    lin(ctx, x0, top, x1, base0, [[0, hs.col], [1, '#0d0c26']]), 0.55);
  // roof: gable or cornice
  if (hs.gable) grainFill(ctx, c => { c.moveTo(x0 - 6, top + 2); c.lineTo(x0 + hs.w / 2, top - 70); c.lineTo(x1 + 6, top + 2); c.closePath(); }, lin(ctx, 0, top - 70, 0, top, [[0, '#2a2360'], [1, '#141236']]), 0.55);
  else { ctx.fillStyle = '#2b2462'; ctx.fillRect(x0 - 6, top - 16, hs.w + 12, 14); ctx.fillStyle = '#120f30'; for (let k = 0; k < hs.w; k += 14) ctx.fillRect(x0 + k, top - 2, 6, 6); }
  ctx.fillStyle = 'rgba(160,150,220,0.10)'; ctx.fillRect(x0, top, hs.w, 3);
  // trim between floors
  const fh = (hs.h - 40) / 2;
  ctx.fillStyle = 'rgba(160,150,220,0.08)'; ctx.fillRect(x0, top + fh + 10, hs.w, 4);
  // bay window column
  const bx = x0 + 18, bw = hs.w * 0.52;
  if (hs.bay) { grainFill(ctx, c => { c.moveTo(bx, top + 20); c.lineTo(bx + bw, top + 20); c.lineTo(bx + bw - 8, top + 2 * fh + 6); c.lineTo(bx + 8, top + 2 * fh + 6); c.closePath(); }, 'rgba(8,7,26,0.45)', 0);
    ctx.fillStyle = 'rgba(150,140,220,0.10)'; ctx.fillRect(bx, top + 14, bw, 6); ctx.fillRect(bx, top + 20, 3, 2 * fh - 14); }
  for (const w of hs.wins) {
    const ww = w.k < 2 ? bw / 2 - 18 : hs.w * 0.2, wx = w.k < 2 ? bx + 10 + w.k * (bw / 2 - 4) : x1 - hs.w * 0.3, wy = top + 34 + w.f * fh, wh = fh - 46;
    roundRect(ctx, wx, wy, ww, wh, ww / 2.2); // arched tops
    if (w.lit) {
      const a = 0.42 + 0.08 * Math.sin(t * 1.1 + w.ph);
      ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, rgba('#ffcf8a', a)], [1, rgba(C.amberM, a)]]); ctx.fill();
      light(ctx, wx + ww / 2, wy + wh / 2, 60, C.amber, 0.07);
      ctx.fillStyle = 'rgba(30,14,10,0.5)'; ctx.fillRect(wx + ww / 2 - 1, wy, 2, wh);
    } else { ctx.fillStyle = '#0c0b22'; ctx.fill(); ctx.fillStyle = 'rgba(143,230,255,0.04)'; ctx.fillRect(wx + 2, wy + 4, ww * 0.3, wh - 8); }
  }
  // stair + door
  const dx = x1 - hs.w * 0.3, dy = ground(dx) - 10;
  ctx.fillStyle = '#0a0a1e'; roundRect(ctx, dx, dy - 96, hs.w * 0.2, 86, 10); ctx.fill();
  if (hs.stair) for (let k = 0; k < 4; k++) { ctx.fillStyle = k % 2 ? '#1a1640' : '#221c4e'; ctx.fillRect(dx - 6 - k * 8, dy - 10 + k * 5, hs.w * 0.2 + 12 + k * 8, 5); }
}

function poles(ctx, t) {
  const P = [800, 1390, 1980].map(x => ({ x, y: ground(x) - 12, top: ground(x) - 390 }));
  P.unshift({ x: -90, y: ground(-90), top: ground(-90) - 390 });
  const sway = Math.sin(t * 0.8) * 3;
  ctx.strokeStyle = '#08081a'; ctx.lineWidth = 2;
  for (let i = 0; i < P.length - 1; i++) for (let k = -1; k <= 1; k++) {
    const a = P[i], b = P[i + 1], ya = a.top + 6 + (k === 0 ? 18 : 0), yb = b.top + 6 + (k === 0 ? 18 : 0);
    ctx.beginPath(); ctx.moveTo(a.x + k * 34, ya); ctx.quadraticCurveTo((a.x + b.x) / 2 + k * 34, (ya + yb) / 2 + 60 + sway + k * 4, b.x + k * 34, yb); ctx.stroke();
  }
  for (const p of P) {
    grainFill(ctx, c => { c.moveTo(p.x - 7, p.y); c.lineTo(p.x - 4, p.top); c.lineTo(p.x + 4, p.top); c.lineTo(p.x + 7, p.y); c.closePath(); }, '#0b0a1e', 0.3);
    ctx.fillStyle = '#0b0a1e'; ctx.fillRect(p.x - 44, p.top + 4, 88, 6); ctx.fillRect(p.x - 26, p.top + 22, 52, 5);
  }
  // one long wire across the sky
  ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-100, 120); ctx.quadraticCurveTo(700, 330 + sway, 1390, ground(1390) - 384); ctx.stroke();
}

function street(ctx, t, lampOn, on) {
  // sidewalk + curb + asphalt
  grainFill(ctx, c => { c.moveTo(-300, ground(-300) - 12); c.lineTo(2300, ground(2300) - 12); c.lineTo(2300, ground(2300) + 18); c.lineTo(-300, ground(-300) + 18); c.closePath(); },
    lin(ctx, 0, 500, 0, 1080, [[0, '#221d4c'], [1, '#141134']]), 0.5);
  grainFill(ctx, c => { c.moveTo(-300, ground(-300) + 16); c.lineTo(2300, ground(2300) + 16); c.lineTo(2300, 1400); c.lineTo(-300, 1400); c.closePath(); },
    lin(ctx, 0, 560, 0, 1080, [[0, '#100e2c'], [1, '#060614']]), 0.6);
  ctx.strokeStyle = 'rgba(164,159,196,0.22)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-300, ground(-300) + 16); ctx.lineTo(2300, ground(2300) + 16); ctx.stroke();
  // centre line dashes and cable-car slot
  ctx.strokeStyle = 'rgba(255,179,92,0.18)'; ctx.lineWidth = 4; ctx.setLineDash([46, 40]);
  ctx.beginPath(); ctx.moveTo(-300, ground(-300) + 150); ctx.lineTo(2300, ground(2300) + 150); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(164,159,196,0.10)'; ctx.lineWidth = 2;
  for (const o of [100, 205]) { ctx.beginPath(); ctx.moveTo(-300, ground(-300) + o); ctx.lineTo(2300, ground(2300) + o); ctx.stroke(); }
  // wet asphalt: shimmering reflections of the lamp and, once lit, the window
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const streak = (x, col, a, w) => { const y0 = ground(x) + 30;
    ctx.save(); ctx.translate(x, y0 + 80); ctx.scale(w * 0.7, 95); ctx.fillStyle = rad(ctx, 0, 0, 0, 1, [[0, rgba(col, a * 0.5)], [1, rgba(col, 0)]]);
    ctx.beginPath(); ctx.arc(0, 0, 1, 0, 7); ctx.fill(); ctx.restore();
    ctx.lineCap = 'round';
    for (let k = 0; k < 6; k++) { const y = y0 + 14 + k * 26, wob = Math.sin(t * 2.6 + k * 1.7) * 7, ww = w * (0.9 - k * 0.1) * (0.7 + 0.3 * Math.sin(t * 3.1 + k));
      ctx.strokeStyle = rgba(col, a * (1 - k / 6) * 0.8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - ww / 2 + wob, y); ctx.lineTo(x + ww / 2 + wob, y); ctx.stroke(); } };
  streak(690, C.amber, 0.5 * lampOn, 40);
  if (on > 0) streak(WIN[0], C.cyan, 0.30 * on * ramp(t, T_ON, T_ON + 0.5), 22);
  ctx.restore();
  // street lamp at the back of the sidewalk
  const lx = 650, ly = ground(lx) - 12, lt = ly - 300;
  ctx.fillStyle = '#0a0a1e'; ctx.fillRect(lx - 3, lt, 6, 300); ctx.fillRect(lx - 3, lt, 46, 5);
  ctx.fillStyle = '#0a0a1e'; ctx.beginPath(); ctx.moveTo(lx + 28, lt + 4); ctx.lineTo(lx + 52, lt + 4); ctx.lineTo(lx + 46, lt + 14); ctx.lineTo(lx + 34, lt + 14); ctx.closePath(); ctx.fill();
  const f = lampOn;
  ctx.fillStyle = rgba('#ffd9a0', 0.9 * f); ctx.fillRect(lx + 34, lt + 12, 12, 3);
  cone(ctx, lx + 40, lt + 14, 14, 230, 300, C.amber, 0.085 * f);
  light(ctx, lx + 40, lt + 14, 46, C.amber, 0.35 * f);
  light(ctx, lx + 40, ground(lx + 40) + 4, 150, C.amber, 0.12 * f);
}

function car(ctx, t) {
  // a parked car, nose downhill, on the near curb
  const x = 1330, y = ground(x) + 175;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.atan(SL)); ctx.scale(1.35, 1.35);
  const body = c => { c.moveTo(-10, 0); c.lineTo(-6, -40); c.quadraticCurveTo(10, -48, 60, -50); c.lineTo(110, -88); c.quadraticCurveTo(170, -96, 230, -88); c.lineTo(270, -52);
    c.quadraticCurveTo(330, -48, 340, -30); c.lineTo(342, 0); c.closePath(); };
  ctx.save(); ctx.translate(0, -2); grainFill(ctx, body, rgba('#8fa0ff', 0.12), 0); ctx.restore();
  grainFill(ctx, body, lin(ctx, 0, -96, 0, 0, [[0, '#262058'], [1, '#0a0a1e']]), 0.5);
  ctx.fillStyle = '#0b0b24'; ctx.beginPath(); ctx.moveTo(120, -80); ctx.lineTo(176, -84); ctx.lineTo(176, -54); ctx.lineTo(96, -54); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(186, -84); ctx.lineTo(226, -82); ctx.lineTo(256, -54); ctx.lineTo(186, -54); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#050510'; for (const wx of [60, 270]) { ctx.beginPath(); ctx.arc(wx, 0, 27, 0, 7); ctx.fill(); }
  ctx.fillStyle = 'rgba(164,159,196,0.25)'; for (const wx of [60, 270]) { ctx.beginPath(); ctx.arc(wx, 0, 10, 0, 7); ctx.fill(); }
  light(ctx, 336, -36, 16, '#ff5a4d', 0.25);
  ctx.restore();
}

function fog(ctx, t, band) {
  for (const f of FOG) {
    if ((f.y > 630) !== band) continue;
    const x = ((f.x + t * f.sp + 300) % 2400) - 300;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, 0, 0, 0, 1, [[0, rgba('#8a7fc4', f.a)], [1, rgba('#8a7fc4', 0)]]);
    ctx.translate(x, f.y); ctx.scale(f.rx, f.ry); ctx.beginPath(); ctx.arc(0, 0, 1, 0, 7); ctx.fill(); ctx.restore();
  }
}

// the walker: speed falls to zero after the window lights
const V = 78, X0 = 430;
function walkPos(t) { let p = 0; const dt = 1 / 120; for (let s = 0; s < t; s += dt) p += V * (1 - ramp(s, 1.12, 1.55)) * Math.min(dt, t - s); return p; }

function draw(ctx, t) {
  const on = windowOn(t);
  const z = 1 + 0.05 * sm(t / T1) + 0.07 * ramp(t, 1.0, T1 + 0.6);
  const dx = drift(t, 1, 1) * 5, dy = drift(t, 1, 2) * 3;
  const [fx, fy] = [980, 420];
  const layer = (par, fn) => {
    const zz = 1 + (z - 1) * (0.55 + par * 0.5);
    ctx.save(); ctx.translate(fx, fy); ctx.scale(zz, zz); ctx.translate(-fx + dx * par, -fy + dy * par); fn(); ctx.restore();
  };
  ctx.translate(620, 640); ctx.scale(1.08, 1.08); ctx.translate(-620, -640);
  layer(0.1, () => sky(ctx, t));
  layer(0.2, () => { bay(ctx, t); fog(ctx, t, false); });
  layer(0.3, () => towers(ctx, t));
  layer(0.45, () => { downhill(ctx, t); fog(ctx, t, true); });
  layer(0.6, () => { for (const hs of HOUSES) house(ctx, hs, t); });
  layer(0.7, () => poles(ctx, t));
  const pos = walkPos(t), fxw = X0 + pos, sp = 1 - ramp(t, 1.12, 1.55);
  layer(0.8, () => {
    street(ctx, t, 0.92 + 0.08 * Math.sin(t * 7.3) * Math.sin(t * 1.9), on);
    // shadow under the walker
    ctx.fillStyle = 'rgba(4,4,16,0.35)'; ctx.beginPath(); ctx.ellipse(fxw + 4, ground(fxw) + 2, 34, 5, -Math.atan(SL), 0, 7); ctx.fill();
    const lookT = ease2((t - 1.3) / 0.6);
    figure(ctx, fxw, ground(fxw), 112, {
      ph: pos / 84 * Math.PI * 2, amp: sp * 0.95, slope: SL, br: Math.sin(t * 2.4),
      phone: 1 - 0.75 * ease2((t - 1.45) / 0.55), look: lerp(-0.55, 1.15, lookT), lean: 0.05 - 0.12 * lookT,
      rim: rgba(C.cyan, 0.55 * on), rimDx: 1, faceLight: 0.5 * Math.max(on * lookT, 0.6 * (1 - lookT)),
    });
  });
  layer(1.2, () => car(ctx, t));
  // low fog drifting through the foreground
  layer(1.0, () => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 3; i++) {
    const x = ((i * 900 + t * 30) % 2600) - 400; ctx.fillStyle = rad(ctx, x, 1040, 0, 600, [[0, 'rgba(120,110,190,0.06)'], [1, 'rgba(120,110,190,0)']]); ctx.fillRect(x - 600, 700, 1200, 500); } ctx.restore(); });
}
function ease2(x) { return L.ease(x); }

module.exports = { T0, T1, draw };
