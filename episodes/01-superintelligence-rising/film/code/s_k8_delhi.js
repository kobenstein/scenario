// "In New Delhi, nearly ninety countries signed a declaration, and the labs promised to test in neglected languages."
// A dotted world map at night. New Delhi lights up; then lights wake across ~90 countries and send threads to it.
// Speech bubbles rise from the lights, each writing a different (abstract, invented) script.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, stamp, label, out, ease } = L;
const { LAND } = require('./s_k8_globe');

const T0 = 535.30, T1 = 542.85;

// map projection (equirectangular)
const MX0 = 60, MX1 = 1860, LON0 = -170, LON1 = 190, LAT0 = 78, LAT1 = -58;
const MY0 = 190, MY1 = MY0 + (MX1 - MX0) * (LAT0 - LAT1) / (LON1 - LON0);
const mp = (la, lo) => { if (lo < LON0) lo += 360; return [MX0 + (lo - LON0) / (LON1 - LON0) * (MX1 - MX0), MY0 + (LAT0 - la) / (LAT0 - LAT1) * (MY1 - MY0)]; };
function inPoly(la, lo, poly) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [ya, xa] = poly[i], [yb, xb] = poly[j]; if ((ya > la) !== (yb > la) && lo < (xb - xa) * (la - ya) / (yb - ya) + xa) c = !c; } return c; }
const DOT = 13;
const DOTS = (() => { const a = []; for (let y = MY0; y <= MY1; y += DOT) for (let x = MX0; x <= MX1; x += DOT) {
  const lo = LON0 + (x - MX0) / (MX1 - MX0) * (LON1 - LON0), la = LAT0 - (y - MY0) / (MY1 - MY0) * (LAT0 - LAT1), lo2 = lo > 180 ? lo - 360 : lo;
  for (const [k, p] of Object.entries(LAND)) if (k !== 'antarctica' && inPoly(la, lo2, p)) { a.push([x, y, la, lo2]); break; } } return a; })();
const DELHI = mp(28.6, 77.2);

// ~90 country lights, spread over the land dots, not too close to each other
const LIGHTS = (() => { const r = rng(90), out = [], tries = DOTS.slice().sort(() => 0).map(d => [r(), d]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  for (const d of tries) { if (out.length >= 89) break; if (Math.hypot(d[0] - DELHI[0], d[1] - DELHI[1]) < 50) continue; if (out.every(o => Math.hypot(o.x - d[0], o.y - d[1]) > 52)) out.push({ x: d[0], y: d[1], ph: r() * 6 }); }
  out.forEach((o, i) => { o.t = 536.75 + 0.85 * r(); o.arc = o.t + 0.15 + 0.2 * r(); o.lift = 0.18 + 0.12 * r(); }); return out; })();
// bubbles: lights in regions whose languages are rarely tested, each in its own invented script
const SPOTS = [[12, -1], [16, -90], [-14, -72], [-1, 37], [43, 66], [-6, 146], [-26, 26], [52, 20]];
const BUB = SPOTS.map(([la, lo], k) => { const [x, y] = mp(la, lo); const l = { x, y, t: 536.9 + k * 0.08, arc: 537.1 + k * 0.08, lift: 0.22, ph: k }; LIGHTS.push(l);
  return { l, t: 540.35 + k * 0.2, style: k % 6, seed: 100 + k, w: 120 }; });

// invented glyph strings, by style
function glyphs(style, seed, w) {
  const r = rng(seed), strokes = []; let x = 0;
  const S = pts => strokes.push(pts);
  const arc = (cx, cy, rx, ry, a0, a1) => { const c = []; for (let k = 0; k <= 10; k++) { const a = lerp(a0, a1, k / 10); c.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return c; };
  while (x < w - 10) {
    const g = 8 + r() * 9, q = Math.floor(r() * 4), h = 6 + r() * 5;
    if (style === 0) { S([[x - 1, -10], [x + g + 2, -10]]); if (q === 0) S([[x + g * 0.7, -10], [x + g * 0.7, 9]]); if (q === 1) S(arc(x + g * 0.4, -2, g * 0.4, 6, -1.6, 2.6)); if (q >= 2) { S([[x + 2, -10], [x + 2, 2], [x + g * 0.6, 4], [x + g * 0.7, -10]]); } if (r() < 0.25) S([[x + g * 0.5, -16], [x + g * 0.7, -14]]); }
    else if (style === 1) { S(arc(x + g / 2, 0, g / 2, h * 0.8, q * 0.8, q * 0.8 + 5.4)); if (q === 2) S(arc(x + g / 2, -h, g / 3, 3, 3.1, 6.3)); }
    else if (style === 2) { S([[x, 8], [x, -h], [x + g * 0.6, -h - 1], [x + g * 0.6, q > 1 ? 8 : 2]]); if (q % 2) S([[x + g * 0.6, 4], [x + g, 6]]); if (q === 3) S([[x - 2, 0], [x + 3, 0]]); }
    else if (style === 3) { S(arc(x + g / 2, 2, g / 2, h * 0.7, 0, Math.PI * (q > 1 ? 1 : 1.6))); if (q === 0) S([[x + g, 2], [x + g, -12]]); if (r() < 0.5) S([[x + g / 2, 12], [x + g / 2 + 1.5, 12]]); if (q === 3) S([[x + g / 2 - 2, -12], [x + g / 2, -12]]); }
    else if (style === 4) { S([[x, -8], [x + g, -8], [x + g, q > 1 ? 0 : 9]]); if (q % 2) S(arc(x + g * 0.45, 4, 4, 4, 0, 6.3)); else S([[x + 2, 1], [x + 2, 9], [x + g, 9]]); }
    else { S([[x, -h], [x + g * 0.5, h * 0.6], [x + g, -h + q * 2]]); if (q > 1) S([[x + g * 0.5, h * 0.6], [x + g * 0.3, 11]]); if (q === 0) S(arc(x + g, -h - 3, 3, 3, 0, 6.3)); }
    x += g + 3 + r() * 3;
  }
  return strokes;
}
BUB.forEach(b => { b.gl = glyphs(b.style, b.seed, b.w); });

function rr(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

let MAP = null;
function mapArt() {
  const cv = L.createCanvas(W, H), c = cv.getContext('2d');
  // faint graticule
  c.strokeStyle = 'rgba(164,159,196,0.07)'; c.lineWidth = 1;
  for (let lo = -150; lo <= 180; lo += 30) { const [x] = mp(0, lo); c.beginPath(); c.moveTo(x, MY0); c.lineTo(x, MY1); c.stroke(); }
  for (let la = -45; la <= 75; la += 30) { const [, y] = mp(la, 0); c.beginPath(); c.moveTo(MX0, y); c.lineTo(MX1, y); c.stroke(); }
  for (const [x, y, la] of DOTS) { const k = 0.5 + 0.5 * Math.sin(x * 0.01 + y * 0.013); c.fillStyle = rgba(k > 0.5 ? '#6a5aa8' : '#564a90', 0.75); c.beginPath(); c.arc(x, y, 3.4, 0, 7); c.fill(); }
  return cv;
}

function draw(ctx, t) {
  if (!MAP) MAP = mapArt();
  const k = (t - T0) / (T1 - T0);
  const z = lerp(1.0, 1.12, sm(k)), dx = drift(t, 1, 4) * 5, dy = drift(t, 1, 8) * 4;
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, '#070820'], [1, '#0e0f30']]); ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(DELHI[0], DELHI[1]); ctx.scale(z, z); ctx.translate(-DELHI[0] + dx, -DELHI[1] + dy);
  ctx.drawImage(MAP, 0, 0);
  // New Delhi: the hero light, landing on "Delhi"
  const dl = ramp(t, 536.0, 536.45), pulse = 0.9 + 0.1 * Math.sin(t * 3);
  light(ctx, DELHI[0], DELHI[1], 260, C.amber, 0.45 * dl * pulse);
  light(ctx, DELHI[0], DELHI[1], 50, '#fff1cf', 0.9 * dl);
  for (let i = 0; i < 2; i++) { const ph = ((t - 536.0) * 0.6 + i * 0.5) % 1; if (t < 536.0) break; ctx.strokeStyle = rgba(C.amber, 0.5 * (1 - ph) * dl); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(DELHI[0], DELHI[1], 10 + ph * 70, 0, 7); ctx.stroke(); }
  // country lights and their threads to Delhi
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const o of LIGHTS) {
    const a = ramp(t, o.t, o.t + 0.25); if (a <= 0) continue;
    const g = ramp(t, o.arc, o.arc + 0.9);
    if (g > 0) {
      const mx = (o.x + DELHI[0]) / 2, my = (o.y + DELHI[1]) / 2 - Math.hypot(o.x - DELHI[0], o.y - DELHI[1]) * o.lift;
      ctx.strokeStyle = rgba(C.amber, 0.22); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(o.x, o.y);
      const N = 24, n = Math.ceil(N * g); let px = o.x, py = o.y;
      for (let i = 1; i <= n; i++) { const u = Math.min(i / N, g); px = (1 - u) * (1 - u) * o.x + 2 * u * (1 - u) * mx + u * u * DELHI[0]; py = (1 - u) * (1 - u) * o.y + 2 * u * (1 - u) * my + u * u * DELHI[1]; ctx.lineTo(px, py); }
      ctx.stroke();
      if (g < 1) { ctx.fillStyle = rgba('#ffe2a8', 0.9); ctx.beginPath(); ctx.arc(px, py, 2.5, 0, 7); ctx.fill(); }
    }
    ctx.fillStyle = rgba('#ffd28c', 0.9 * a); ctx.beginPath(); ctx.arc(o.x, o.y, 3.5, 0, 7); ctx.fill();
  }
  ctx.restore();
  for (const o of LIGHTS) { const a = ramp(t, o.t, o.t + 0.25); if (a > 0) light(ctx, o.x, o.y, 26, C.amber, 0.35 * a * (0.8 + 0.2 * Math.sin(t * 2 + o.ph))); }
  // speech bubbles in many scripts
  for (const b of BUB) {
    const a = ramp(t, b.t, b.t + 0.3), s = out((t - b.t) / 0.45); if (a <= 0) continue;
    const bw = b.w * 1.35 + 40, bh = 66, x = b.l.x - bw * 0.3, y = b.l.y - 34 - bh - 6 * Math.sin(t * 1.2 + b.seed);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(b.l.x, b.l.y - 20); ctx.scale(s, s); ctx.translate(-b.l.x, -(b.l.y - 20));
    ctx.fillStyle = 'rgba(4,4,16,0.4)'; ctx.beginPath(); rr(ctx, x + 4, y + 6, bw, bh, 16); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, y, 0, y + bh, [[0, '#f3efe2'], [1, '#d9d0bc']]); ctx.beginPath(); rr(ctx, x, y, bw, bh, 16); ctx.fill();
    ctx.beginPath(); ctx.moveTo(b.l.x - 6, y + bh - 1); ctx.lineTo(b.l.x + 2, b.l.y - 10); ctx.lineTo(b.l.x + 12, y + bh - 1); ctx.closePath(); ctx.fill();
    // glyphs write themselves in
    const wk = clamp((t - b.t - 0.15) / 0.9), total = b.gl.length;
    ctx.strokeStyle = '#2a2050'; ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    b.gl.forEach((st, i) => { const f = clamp(wk * total - i); if (f <= 0) return; const n = Math.max(2, Math.ceil(st.length * f));
      ctx.beginPath(); ctx.moveTo(x + 20 + st[0][0] * 1.35, y + bh / 2 + st[0][1] * 1.35); for (let j = 1; j < n; j++) ctx.lineTo(x + 20 + st[j][0] * 1.35, y + bh / 2 + st[j][1] * 1.35); ctx.stroke(); });
    ctx.restore();
  }
  ctx.restore();
  stamp(ctx, t, 537.1, T1 + 0.4, '~90 countries', 'signed in New Delhi', { size: 110 });
  label(ctx, t, 536.1, T1 + 0.4, 'New Delhi', 'India', 1330, 480);
}

module.exports = { T0, T1, draw };
