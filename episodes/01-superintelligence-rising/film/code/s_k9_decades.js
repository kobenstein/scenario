// "Arvind Narayanan and Sayash Kapoor at Princeton call AI a 'normal technology,' and expect its effects
//  to play out over decades. They could be right about the timing."
// A night landscape where left-to-right is time. A line of "now" sweeps from 1885 to 2040; behind it, lights come on
// house by house as electricity spreads, cars fill the road, phone masts blink, and at last a slow cyan glow begins.
// Above, each technology's adoption curve climbs over decades. Then the future of the AI curve opens into a band
// of possible timings, and the slow edge brightens: they could be right.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, hash, lin, rad, rgba, light, cone, out, clamp, ease, label } = L;
const { gf, rr, cap, cached, quote } = require('./s_k9_kit');

const T0 = 563.95, T1 = 575.85;
const PX = 26, Y0 = 1870;
const X = y => (y - Y0) * PX;
const HOR = 610, ROAD = 790, BASE = 868;
const S = (y, mid, k) => 1 / (1 + Math.exp(-(y - mid) / k));
const TECH = [
  { name: 'ELECTRICITY', f: y => S(y, 1925, 7), y0: 1890, y1: 1965, col: '#ffb35c' },
  { name: 'CARS', f: y => S(y, 1938, 8), y0: 1905, y1: 1985, col: '#ffcf8c' },
  { name: 'PHONES', f: y => S(y, 2008, 4.5), y0: 1990, y1: 2026, col: '#f3efe2' },
];
const AIslow = y => S(y, 2050, 7.5), AIfast = y => S(y, 2031, 2.4);
// year at the sweeping "now" line
const headYear = t => { const u = clamp((t - 564.2) / 8.6); return lerp(1885, 2040, 0.55 * u + 0.45 * sm(u)); };

// ---------- layout (built once) ----------
const R = rng(909);
const HOUSES = []; for (let x = X(1830); x < X(2062); x += 34 + R() * 44) {
  const yr = Y0 + x / PX, d = R();
  HOUSES.push({ x, yr, w: 50 + R() * 40, h: 34 + R() * 30, yb: HOR + 40 + d * 110, s: 0.85 + d * 0.75, e: R(), a: R(), win: 1 + Math.floor(R() * 3), roof: R() < 0.7 });
}
HOUSES.sort((a, b) => a.yb - b.yb);
const POLES = []; for (let y = 1898; y < 2062; y += 4.6) POLES.push(X(y));
const CARS = []; for (let x = X(1905); x < X(2062); x += 30 + R() * 50) { const yr = Y0 + x / PX; CARS.push({ x, yr, p: R(), v: 14 + R() * 18, dir: R() < 0.5 ? 1 : -1, c: R() }); }
const MASTS = []; for (let y = 1988; y < 2062; y += 6.5) MASTS.push({ x: X(y) + R() * 60, yr: y, h: 150 + R() * 60 });
const TREES = []; for (let x = X(1830); x < X(2062); x += 60 + R() * 90) TREES.push({ x, y: HOR + 30 + R() * 60, r: 16 + R() * 18 });
const STARS = Array.from({ length: 140 }, () => [R() * X(2070), R() * 420, R()]);

function landArt(c) {
  // far hills
  gf(c, cc => { cc.moveTo(-1400, HOR + 40); for (let x = -1400; x <= X(2070) + 200; x += 60) cc.lineTo(x, HOR - 30 - 34 * Math.sin(x * 0.0021) - 22 * Math.sin(x * 0.0057 + 1)); cc.lineTo(X(2070) + 200, 1100); cc.lineTo(-1400, 1100); cc.closePath(); },
    lin(c, 0, HOR - 90, 0, 900, [[0, '#2a2560'], [1, '#14112f']]), 0.5);
  gf(c, cc => { cc.moveTo(-1400, HOR + 60); for (let x = -1400; x <= X(2070) + 200; x += 50) cc.lineTo(x, HOR + 20 - 18 * Math.sin(x * 0.0031 + 2) - 10 * Math.sin(x * 0.009)); cc.lineTo(X(2070) + 200, 1100); cc.lineTo(-1400, 1100); cc.closePath(); },
    lin(c, 0, HOR, 0, 1000, [[0, '#1e1a48'], [1, '#0c0a22']]), 0.55);
  // road
  gf(c, cc => cc.rect(-1400, ROAD - 14, X(2070) + 1600, 40), lin(c, 0, ROAD - 14, 0, ROAD + 26, [[0, '#2a2654'], [1, '#17143a']]), 0.5);
  c.fillStyle = 'rgba(164,159,196,0.18)'; for (let x = X(1905); x < X(2070); x += 70) c.fillRect(x, ROAD + 5, 34, 3);
  // a dirt track before the road was paved
  c.fillStyle = 'rgba(122,59,23,0.25)'; c.fillRect(-1400, ROAD + 2, X(1905) + 1400, 6);
  // timeline base and decade ticks
  c.fillStyle = 'rgba(164,159,196,0.35)'; c.fillRect(-1400, BASE, X(2070) + 1600, 2);
  c.font = '22px "Inter Medium"'; c.textBaseline = 'top'; c.textAlign = 'center';
  for (let y = 1880; y <= 2060; y += 10) { const x = X(y), big = y % 50 === 0; c.fillStyle = rgba('#a49fc4', big ? 0.8 : 0.45); c.fillRect(x - 1, BASE - (big ? 14 : 8), 2, big ? 14 : 8); if (big || y % 20 === 0) c.fillText(String(y), x, BASE + 12); }
}

function house(ctx, h, lit, ai, tt) {
  const { x, yb, s } = h, w = h.w * s, hh = h.h * s;
  gf(ctx, c => { c.moveTo(x, yb); c.lineTo(x, yb - hh); if (h.roof) c.lineTo(x + w / 2, yb - hh - 26 * s); c.lineTo(x + w, yb - hh); c.lineTo(x + w, yb); c.closePath(); },
    lin(ctx, 0, yb - hh - 26 * s, 0, yb, [[0, '#1c1842'], [1, '#0e0c26']]), 0, null);
  ctx.strokeStyle = 'rgba(164,159,196,0.18)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, yb - hh); if (h.roof) ctx.lineTo(x + w / 2, yb - hh - 26 * s); ctx.lineTo(x + w, yb - hh); ctx.stroke();
  for (let k = 0; k < h.win; k++) {
    const wx = x + (k + 0.5) * w / h.win - 6 * s, wy = yb - hh + 10 * s;
    const col = ai > 0 && k === 0 ? C.cyan : '#ffb35c', a = Math.max(lit, ai * (k === 0 ? 1 : 0));
    ctx.fillStyle = a > 0 ? rgba(col, 0.15 + 0.75 * a) : 'rgba(10,8,30,0.9)'; ctx.fillRect(wx, wy, 12 * s, 15 * s);
    if (a > 0.05) light(ctx, wx + 6 * s, wy + 8 * s, (col === C.cyan ? 70 : 40) * s, col, (col === C.cyan ? 0.4 : 0.22) * a);
  }
}

function draw(ctx, t) {
  const Yh = headYear(t), HX = X(Yh), SX = W * 0.6;
  const zoom = lerp(1.0, 0.94, ramp(t, 573.4, 575.5));
  const cam = HX - SX, dx = drift(t, 1, 21) * 5, dy = drift(t, 1, 22) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(SX, 520); ctx.scale(zoom, zoom); ctx.translate(-SX - cam * par + dx * par, -520 + dy * par); fn(); ctx.restore(); };
  // sky
  gf(ctx, c => c.rect(0, 0, W, H), lin(ctx, 0, 0, 0, H, [[0, '#070818'], [0.5, '#141640'], [0.68, '#2e2766'], [1, '#100e2a']]), 0.55);
  for (const [x, y, k] of STARS) { const sx = (((x - cam * 0.12) % W) + W) % W; ctx.fillStyle = rgba('#d8d4f0', 0.2 + 0.4 * k * (0.7 + 0.3 * Math.sin(t * 2 + x))); ctx.fillRect(sx, y, 2, 2); }
  layer(1, () => {
    cached(ctx, 'k9land', -1400, HOR - 120, X(2070) + 200, 1000, landArt, 1);
    // warm haze over the stretch the now-line has already passed
    ctx.fillStyle = lin(ctx, HX - 1600, 0, HX, 0, [[0, rgba(C.amber, 0.0)], [1, rgba(C.amber, 0.07)]]); ctx.fillRect(HX - 1600, HOR - 60, 1600, ROAD - HOR + 80);
    for (const tr of TREES) { if (tr.x < cam - 100 || tr.x > cam + W + 100) continue; const sw = Math.sin(t * 0.8 + tr.x) * 2;
      ctx.fillStyle = '#100e2a'; ctx.fillRect(tr.x - 3, tr.y - 6, 6, 22); ctx.fillStyle = '#17143a'; ctx.beginPath(); ctx.ellipse(tr.x + sw, tr.y - tr.r, tr.r * 0.8, tr.r, 0, 0, 7); ctx.fill(); }
    // electricity poles and wires: they go up as the now-line passes
    for (let i = 0; i < POLES.length; i++) {
      const px = POLES[i]; if (px > HX + 20 || px < cam - 300 || px > cam + W + 300) continue;
      const g = out((HX - px) / 50);
      ctx.fillStyle = '#0c0b22'; ctx.fillRect(px - 4, ROAD - 20 - 150 * g, 8, 150 * g); ctx.fillRect(px - 30, ROAD - 20 - 150 * g + 10, 60 * g, 5);
      if (i > 0 && POLES[i - 1] < HX) { const qx = POLES[i - 1], top = ROAD - 160; ctx.strokeStyle = rgba('#0c0b22', 0.9 * g); ctx.lineWidth = 2;
        for (const o of [-24, 24]) { ctx.beginPath(); ctx.moveTo(qx + o, top); ctx.quadraticCurveTo((qx + px) / 2 + o, top + 34, px + o, top); ctx.stroke(); } }
    }
    // phone masts with blinking lights
    for (const m of MASTS) { if (m.x > HX || m.x < cam - 300 || m.x > cam + W + 300) continue;
      const g = out((HX - m.x) / 60), top = HOR + 20 - m.h * g;
      ctx.strokeStyle = '#0c0b22'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(m.x - 14, HOR + 30); ctx.lineTo(m.x, top); ctx.lineTo(m.x + 14, HOR + 30); ctx.stroke();
      for (let k = 1; k < 5; k++) { const yy = lerp(HOR + 30, top, k / 5), wd = lerp(14, 0, k / 5); ctx.beginPath(); ctx.moveTo(m.x - wd, yy); ctx.lineTo(m.x + wd, yy); ctx.stroke(); }
      const bl = 0.5 + 0.5 * Math.sin(t * 3 + m.x); light(ctx, m.x, top, 22, '#ff8a5c', 0.6 * bl * g); }
    // houses: lights come on behind the now-line, by how far each technology had spread in that house's year
    for (const h of HOUSES) {
      if (h.x < cam - 200 || h.x > cam + W + 200) continue;
      const passed = (HX - h.x) / 40;
      const lit = h.e < TECH[0].f(h.yr) ? out(passed) : 0;
      const ai = h.yr > 2022 && h.a < 0.3 + AIslow(h.yr) * 2.2 ? out(passed) * (0.85 + 0.15 * Math.sin(t * 1.5 + h.x)) : 0;
      house(ctx, h, lit, ai, t);
    }
    // cars on the road, driving slowly
    for (const cr of CARS) {
      if (cr.x > HX || cr.c > TECH[1].f(cr.yr) * 0.9) continue;
      const x = cr.x + Math.sin(t * 0.1 * cr.v / 10 + cr.p * 6) * 30; if (x < cam - 100 || x > cam + W + 100) continue;
      const g = out((HX - cr.x) / 30), y = ROAD + (cr.dir > 0 ? 8 : -6);
      ctx.globalAlpha = g;
      gf(ctx, c => { rr(c, x - 22, y - 12, 44, 12, 4); rr(c, x - 12, y - 20, 24, 10, 4); }, cr.c < 0.5 ? '#3a2f6e' : '#2a2050', 0);
      ctx.fillStyle = '#fff1cf'; ctx.fillRect(x + 20 * cr.dir - 2, y - 9, 4, 3);
      cone(ctx, x + 24 * cr.dir, y - 8, 0, 0, 0, '#fff', 0);
      light(ctx, x + 22 * cr.dir, y - 8, 30, '#ffe2a8', 0.35);
      ctx.globalAlpha = 1;
    }
  });
  // adoption curves in the sky (same pan as the land)
  layer(1, () => {
    const cy0 = 540, cy1 = 250, yAt = f => lerp(cy0, cy1, f);
    for (const tc of [...TECH, { name: 'AI', f: y => y < 2026 ? AIslow(y) : AIslow(y), y0: 2016, y1: 2062, col: C.cyan, ai: true }]) {
      if (Yh < tc.y0) continue;
      const end = Math.min(Yh, tc.y1);
      ctx.save(); ctx.lineCap = 'round';
      const seg = (a, b, dash) => { ctx.beginPath(); for (let y = a; y <= b + 0.01; y += 0.5) { const x = X(y), v = yAt(tc.f(y)); y === a ? ctx.moveTo(x, v) : ctx.lineTo(x, v); } ctx.setLineDash(dash); ctx.stroke(); };
      ctx.strokeStyle = rgba(tc.col, 0.25); ctx.lineWidth = 10; seg(tc.y0, tc.ai ? Math.min(end, 2026) : end, []);
      ctx.strokeStyle = rgba(tc.col, 0.95); ctx.lineWidth = 3; seg(tc.y0, tc.ai ? Math.min(end, 2026) : end, []);
      if (tc.ai && end > 2026) { ctx.strokeStyle = rgba(tc.col, 0.8); ctx.lineWidth = 3; seg(2026, end, [10, 9]); }
      ctx.restore();
      // pen head and label
      const hx = X(end), hy = yAt(tc.f(end));
      if (Yh < tc.y1 + 2) light(ctx, hx, hy, 40, tc.col, 0.6);
      const ly = tc.ai ? 2018 : tc.y1 - 16, la = ramp(Yh, tc.ai ? 2022 : ly, (tc.ai ? 2022 : ly) + 4);
      if (la > 0) { ctx.save(); ctx.globalAlpha = la; ctx.font = '22px "Inter SemiBold"'; ctx.letterSpacing = '5px'; ctx.fillStyle = tc.col; ctx.textBaseline = tc.ai ? 'top' : 'bottom';
        ctx.shadowColor = 'rgba(4,4,16,0.9)'; ctx.shadowBlur = 12; ctx.fillText(tc.name, X(ly), yAt(tc.f(ly)) + (tc.ai ? 16 : -16)); ctx.restore(); }
    }
    // "They could be right about the timing": the AI curve's future opens into a band of possible timings
    const band = ramp(t, 573.87, 574.6);
    if (band > 0) {
      ctx.save(); ctx.globalAlpha = band;
      ctx.beginPath();
      for (let y = 2026; y <= 2062; y += 0.5) ctx.lineTo(X(y), yAt(AIfast(y) * 0.98 + 0.02 * AIslow(y)));
      for (let y = 2062; y >= 2026; y -= 0.5) ctx.lineTo(X(y), yAt(AIslow(y)));
      ctx.closePath(); ctx.fillStyle = lin(ctx, X(2026), 0, X(2062), 0, [[0, rgba(C.cyan, 0.22)], [1, rgba(C.cyan, 0.06)]]); ctx.fill();
      ctx.strokeStyle = rgba(C.cyan, 0.35); ctx.lineWidth = 2; ctx.setLineDash([6, 8]); ctx.beginPath();
      for (let y = 2026; y <= 2062; y += 0.5) ctx.lineTo(X(y), yAt(AIfast(y))); ctx.stroke(); ctx.setLineDash([]);
      // the slow edge: brightens on "right"
      const r = ramp(t, 574.39, 574.9);
      ctx.strokeStyle = rgba(C.cyanW, 0.4 + 0.5 * r); ctx.lineWidth = 3 + 3 * r; ctx.beginPath();
      for (let y = 2026; y <= 2062; y += 0.5) ctx.lineTo(X(y), yAt(AIslow(y))); ctx.stroke();
      ctx.restore();
      ctx.save(); ctx.globalAlpha = band; ctx.font = '22px "Inter Medium"'; ctx.letterSpacing = '5px'; ctx.fillStyle = C.lav; ctx.textBaseline = 'bottom';
      ctx.fillText('FASTER', X(2031.5) + 16, yAt(AIfast(2031.5)) + 4); ctx.fillStyle = rgba(C.cyanW, 0.6 + 0.4 * ramp(t, 574.39, 574.9)); ctx.fillText('SLOWER', X(2052) + 16, yAt(AIslow(2052)) + 30); ctx.restore();
    }
  });
  // the now-line and its year; a soft light where it meets the land (the hero)
  light(ctx, SX, ROAD - 40, 420, '#ffe2a8', 0.22 * (1 - 0.5 * ramp(t, 573.4, 574.2)));
  const nowA = 1 - 0.6 * ramp(t, 573.4, 574.2);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 0, 230, 0, BASE, [[0, rgba(C.cream, 0)], [0.5, rgba(C.cream, 0.18 * nowA)], [1, rgba(C.cream, 0.35 * nowA)]]); ctx.fillRect(SX - 1.5, 230, 3, BASE - 230);
  ctx.restore();
  ctx.save(); ctx.globalAlpha = nowA * ramp(t, 564.0, 564.5); ctx.font = '60px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillStyle = C.cream;
  ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 20; ctx.fillText(String(Math.floor(Yh)), SX, 225); ctx.restore();
  label(ctx, t, 564.55, 568.85, 'Arvind Narayanan & Sayash Kapoor', 'Princeton', 96, 80);
  quote(ctx, t, 568.99, 573.6, 'normal technology', 'Narayanan & Kapoor', 122, 92, { size: 72 });
}

module.exports = { T0, T1, draw };
