// Copied unchanged from Film 4 (films/04-work/lib/artbase.mjs): base helpers + the K5/K6 figure kit used by art.mjs.
// Film 04 key-frame kit: standalone @napi-rs/canvas renderer in the Scenario "editorial grain" look.
// Everything is drawn in code. Deterministic (seeded PRNG), every function takes time t so it can animate.
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import fs from 'node:fs';

export const W = 1920, H = 1080;
const FONTS = '/home/user/scenario/style-tests/shared/fonts/';
GlobalFonts.registerFromPath(FONTS + 'InstrumentSerif.woff2', 'Instrument Serif');
GlobalFonts.registerFromPath(FONTS + 'InstrumentSerif-400-italic.woff2', 'Instrument Serif Italic');
for (const w of [400, 500, 600]) GlobalFonts.registerFromPath(FONTS + `Inter-${w}-normal.woff2`, 'Inter');

export const C = {
  amber: '#ffb35c', amberDeep: '#7a3b17', amberHot: '#ffd59a', cyan: '#8fe6ff', cyanWhite: '#d8f7ff', cyanDeep: '#0a6f8c',
  indigo: '#0b0f2a', violet: '#3b2f6e', ink: '#070918', cream: '#f3efe2', muted: '#a49fc4', rose: '#e8a3a0', dusk: '#e9a07f',
  night: '#121540', deep: '#1b1f55', mid: '#262c6e', haze: '#3a4a92',
};
export const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lin = (a, b, t) => clamp((t - a) / (b - a));
export const mix = (a, b, x) => a + (b - a) * x;
export const sm = (x) => x * x * (3 - 2 * x);
export const eout = (x) => 1 - Math.pow(1 - x, 3);
export const ein = (x) => x * x * x;
export const eio = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export function prng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
export const drift = (t, a = 1, ph = 0) => a * (Math.sin(t * 0.37 + ph) * 0.6 + Math.sin(t * 0.91 + ph * 1.7) * 0.3 + Math.sin(t * 1.73 + ph * 2.3) * 0.1);
export function mixHex(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
export function shade(hex, d) { const n = parseInt(hex.slice(1), 16); const f = (v) => Math.round(clamp(v + d * 255, 0, 255)); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join(''); }

export function canvas(w = W, h = H) { const c = createCanvas(w, h); return [c, c.getContext('2d')]; }

// ---------- backgrounds ----------
export function vgrad(ctx, stops, x = 0, y = 0, w = W, h = H) {
  const g = ctx.createLinearGradient(x, y, x, y + h); stops.forEach(([o, c]) => g.addColorStop(o, c)); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
}
export function glow(ctx, cx, cy, r, a, hex = C.amber, core = C.amberHot, { add = true, sy = 1 } = {}) {
  if (r <= 0 || a <= 0) return;
  ctx.save(); if (add) ctx.globalCompositeOperation = 'lighter';
  ctx.translate(cx, cy); ctx.scale(1, sy);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  g.addColorStop(0, rgba(core, a)); g.addColorStop(.18, rgba(hex, .6 * a)); g.addColorStop(.5, rgba(hex, .18 * a)); g.addColorStop(1, rgba(hex, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.restore();
}
// stars
export function stars(ctx, t, { n = 300, seed = 5, y0 = 0, y1 = H * .7, a = 1, hex = C.cyanWhite, x0 = 0, x1 = W } = {}) {
  const r = prng(seed);
  for (let i = 0; i < n; i++) {
    const x = mix(x0, x1, r()), y = mix(y0, y1, Math.pow(r(), 1.3)), m = r(), p = r() * 7;
    const al = a * (0.18 + 0.6 * m * m) * (0.7 + 0.3 * Math.sin(t * (0.7 + m) + p)) * (1 - 0.6 * (y - y0) / (y1 - y0 + 1));
    const s = m > .96 ? 2.4 : m > .8 ? 1.7 : 1.2;
    ctx.fillStyle = rgba(hex, al); ctx.fillRect(x + drift(t, 1.5, p), y, s, s);
  }
}
// speckle dither inside a region already drawn (risograph falloff), only in light falloffs
export function speckle(ctx, x, y, w, h, n, hex, a, seed = 1) {
  const r = prng(seed); ctx.save(); ctx.fillStyle = hex;
  for (let i = 0; i < n; i++) { ctx.globalAlpha = a * r(); const s = r() < .85 ? 1.3 : 2; ctx.fillRect(x + r() * w, y + r() * h, s, s); }
  ctx.restore();
}
// light beam (parallelogram/cone) with grainy falloff
export function beam(ctx, pts, hex, a, { from = null, to = null } = {}) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = from ? ctx.createLinearGradient(from[0], from[1], to[0], to[1]) : null;
  if (g) { g.addColorStop(0, rgba(hex, a)); g.addColorStop(1, rgba(hex, 0)); ctx.fillStyle = g; } else ctx.fillStyle = rgba(hex, a);
  ctx.beginPath(); ctx.moveTo(...pts[0]); for (const p of pts.slice(1)) ctx.lineTo(...p); ctx.closePath(); ctx.fill(); ctx.restore();
}

// ---------- final finish: dither + film grain + vignette ----------
const [grainC, grainX] = canvas(512, 512);
{ const r = prng(11), d = grainX.createImageData(512, 512); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } grainX.putImageData(d, 0, 0); }
export function finish(ctx, t, { grain = .055, vig = .5, dither = 3 } = {}) {
  // vignette
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .38, W / 2, H / 2, H * 1.05);
  g.addColorStop(0, 'rgba(7,9,24,0)'); g.addColorStop(1, `rgba(7,9,24,${vig})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // ordered + random dither so gradients never band (grain cells 1px)
  if (dither) {
    const d = ctx.getImageData(0, 0, W, H), p = d.data, r = prng(Math.floor(t * 24) + 3);
    for (let i = 0; i < p.length; i += 4) { const n = (r() - .5) * dither * 2; p[i] += n; p[i + 1] += n; p[i + 2] += n; }
    ctx.putImageData(d, 0, 0);
  }
  const f = Math.floor(t * 24), ox = (f * 197) % 512, oy = (f * 331) % 512;
  ctx.save(); ctx.globalAlpha = grain; ctx.globalCompositeOperation = 'overlay';
  for (let x = -ox; x < W; x += 512) for (let y = -oy; y < H; y += 512) ctx.drawImage(grainC, x, y);
  ctx.restore();
}

// ---------- typography ----------
export function text(ctx, s, x, y, { size = 40, font = 'Inter', weight = 500, color = C.cream, align = 'left', alpha = 1, spacing = 0 } = {}) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.textAlign = align;
  ctx.font = `${font.startsWith('Instrument') ? '' : weight + ' '}${size}px "${font}"`;
  if (spacing) { try { ctx.letterSpacing = spacing + 'px'; } catch { } }
  ctx.fillText(s, x, y); ctx.restore();
}

// ---------- figure ----------
// Articulated faceless silhouette with volume: tapered capsule limbs, rounded sloping shoulders, hands in front.
// Pose angles in radians, 0 = straight down; positive = forward (toward +x before flip).
// x,y = hip joint in screen px, s = scale (s = 1 -> about 185 px standing figure).
function capsule(ctx, x1, y1, r1, x2, y2, r2) {
  const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(Math.max(-1, Math.min(1, (r1 - r2) / (d || 1))));
  ctx.beginPath();
  ctx.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k);
  ctx.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k);
  ctx.closePath(); ctx.fill();
}
const FIGDEF = { lean: 0, head: 0, sh: [0.15, -0.1], el: [0.3, 0.25], hip: [0.05, -0.05], kn: [0, 0], hair: 'short', coat: false, skirt: false, bulk: 1 };
function limbs(P) {
  const shY = -64, out = {};
  out.arm = (i) => {
    const a = P.sh[i], e = P.el[i], sx = i ? -3 : 3, sy = shY + 7;
    const ex = sx + Math.sin(a) * 29, ey = sy + Math.cos(a) * 29, hx = ex + Math.sin(a + e) * 26, hy = ey + Math.cos(a + e) * 26;
    return { sx, sy, ex, ey, hx, hy, ang: a + e };
  };
  out.leg = (i) => {
    const a = P.hip[i], k = P.kn[i], sx = i ? -4 : 4;
    const kx = sx + Math.sin(a) * 45, ky = Math.cos(a) * 45, fx = kx + Math.sin(a - k) * 43, fy = ky + Math.cos(a - k) * 43;
    return { sx, kx, ky, fx, fy };
  };
  out.shY = shY; return out;
}
export function figure(ctx, x, y, s, pose = {}, o = {}) {
  const P = Object.assign({}, FIGDEF, pose);
  const col = o.col || '#120f30', rim = o.rim || null, rimSide = o.rimSide ?? 1, flip = o.flip ? -1 : 1, B = P.bulk;
  const L = limbs(P);
  const parts = (c, dx, dy, grow) => {
    ctx.save(); ctx.translate(x + dx, y + dy); ctx.scale(s * flip, s); ctx.fillStyle = c;
    const g = grow;
    const leg = (i) => { const l = L.leg(i); capsule(ctx, l.sx, 0, 9.5 * B + g, l.kx, l.ky, 6.5 + g); capsule(ctx, l.kx, l.ky, 6.5 + g, l.fx, l.fy, 4.6 + g); ctx.beginPath(); ctx.ellipse(l.fx + 6, l.fy + 2.5, 9.5 + g, 4.6 + g, 0, 0, 7); ctx.fill(); };
    leg(1); leg(0);
    ctx.save(); ctx.rotate(P.lean);
    const arm = (i) => { const m = L.arm(i); capsule(ctx, m.sx, m.sy, 8.6 * B + g, m.ex, m.ey, 6.4 + g); capsule(ctx, m.ex, m.ey, 6.2 + g, m.hx, m.hy, 4.6 + g); ctx.beginPath(); ctx.ellipse(m.hx + Math.sin(m.ang) * 3.5, m.hy + Math.cos(m.ang) * 3.5, 4.8 + g, 5.6 + g, -m.ang, 0, 7); ctx.fill(); };
    arm(1);
    // torso: round sloping shoulders, chest, gentle waist, hips (side / three-quarter view)
    const sY = L.shY, w = B;
    ctx.beginPath();
    ctx.moveTo(-15 * w - g, 4);
    ctx.bezierCurveTo(-17 * w - g, -14, -13 * w - g, -30, -14 * w - g, -46);
    ctx.bezierCurveTo(-15 * w - g, sY + 4, -12 * w - g, sY - 3 - g, -4, sY - 4 - g);
    ctx.lineTo(5, sY - 4 - g);
    ctx.bezierCurveTo(14 * w + g, sY - 3 - g, 20 * w + g, sY + 6, 19 * w + g, -44);
    ctx.bezierCurveTo(18 * w + g, -30, 13 * w + g, -14, 15 * w + g, 4);
    if (P.coat) { ctx.lineTo(19 * w + g, 34); ctx.lineTo(-19 * w - g, 34); }
    else if (P.skirt) { ctx.lineTo(22 * w + g, 44); ctx.quadraticCurveTo(0, 48, -22 * w - g, 44); }
    else ctx.quadraticCurveTo(0, 12 + g, -15 * w - g, 4);
    ctx.closePath(); ctx.fill();
    // neck + head (small, faceless), hair shapes
    ctx.save(); ctx.translate(1, sY - 2); ctx.rotate(P.head);
    capsule(ctx, 0, 3, 5.6 + g, 1.5, -5, 5 + g);
    ctx.beginPath(); ctx.ellipse(2.5, -16, 10.4 + g, 12 + g, .12, 0, 7); ctx.fill();
    if (P.hair === 'long') { ctx.beginPath(); ctx.moveTo(-6, -29 - g); ctx.quadraticCurveTo(-15 - g, -14, -11 - g, 12); ctx.quadraticCurveTo(-4, 14, 1, 6); ctx.quadraticCurveTo(-5, -10, 2, -28); ctx.closePath(); ctx.fill(); }
    if (P.hair === 'bun') { ctx.beginPath(); ctx.arc(-6, -28, 5.8 + g, 0, 7); ctx.fill(); }
    if (P.hair === 'curly') { for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(-6 + i * 3.4, -29 + Math.sin(i * 2) * 1.5, 5 + g, 0, 7); ctx.fill(); } }
    if (P.hair === 'grey') { ctx.beginPath(); ctx.ellipse(-1, -24, 10 + g, 8 + g, -.3, Math.PI * .8, Math.PI * 2.1); ctx.fill(); }
    ctx.restore();
    arm(0);
    if (o.prop) o.prop(ctx, L.arm(0), L.arm(1), c);
    ctx.restore(); ctx.restore();
  };
  // rim light only on the side facing the light: rim copy shifted toward the light, body on top
  const off = o.rimW ?? Math.max(1.6, 1.4 * s);
  if (rim) parts(rim, rimSide * off, -off * .35, 0);
  parts(col, 0, 0, 0);
}
// screen position of a hand (i = 0 front, 1 back)
export function handPos(x, y, s, pose, i = 0, flip = false) {
  const P = Object.assign({}, FIGDEF, pose), f = flip ? -1 : 1, m = limbs(P).arm(i);
  const hx = m.hx + Math.sin(m.ang) * 4, hy = m.hy + Math.cos(m.ang) * 4;
  const c = Math.cos(P.lean), sn = Math.sin(P.lean);
  return [x + (hx * c - hy * sn) * s * f, y + (hx * sn + hy * c) * s];
}

// ---------- the Hill (Maslow thread): a terraced town on a pyramid-shaped hill ----------
// tiers: 5 bands from shore (0) to summit (4). lit[i] 0..1 per tier. open = apex opening 0..1.
// Returns geometry for further drawing.
export function hillGeo(cx, baseY, halfW, apexY, steps = 0) {
  const hgt = baseY - apexY;
  const u = (y) => Math.max(0, (y - apexY) / hgt);
  // flanks: slightly concave like a real peak, foot spreads into the shore
  const xAt = (y, side) => cx + side * (halfW * Math.pow(u(y), 1.04) + halfW * .14 * Math.pow(Math.max(0, (u(y) - .8) / .2), 2));
  const bands = [0, .30, .53, .72, .87, 1].map((u) => baseY - u * hgt); // band boundaries (bottom to top)
  // terrace ledges: inside each band the flank bulges out toward its top, then steps in at the boundary
  const ledge = (y) => { for (let b = 0; b < 4; b++) if (y <= bands[b] && y > bands[b + 1]) return steps * Math.pow((bands[b] - y) / (bands[b] - bands[b + 1]), 1.5); return 0; };
  const edge = (y, side) => xAt(y, side) + side * (ledge(y) + (Math.sin(y * .05 + side) * 4 + Math.sin(y * .013 + side * 3) * 7) * Math.min(1, u(y) * 4) * (steps ? .4 : 1));
  return { cx, baseY, halfW, apexY, hgt, xAt, edge, bands };
}
const HOUSES = new Map();
export function drawHill(ctx, t, G, { sep = 0, noTrees = false, litFn = null, lit = [0, 0, 0, 0, 0], body = '#141640', body2 = '#0c0e2b', rimHex = null, rimA = .5, seed = 3, tv = 0, festoon = 0, river = 0, path = 0, scale = 1, winHex = C.amber, darkWin = 0.12 } = {}) {
  const { cx, baseY, apexY, xAt, bands, hgt } = G;
  // body silhouette with a subtle vertical gradient
  ctx.save();
  ctx.beginPath(); ctx.moveTo(G.edge(baseY, -1), baseY);
  for (let y = baseY; y >= apexY + 4; y -= 6) ctx.lineTo(G.edge(y, -1), y);
  ctx.quadraticCurveTo(cx, apexY - 4, cx + 4, apexY + 4);
  for (let y = apexY + 4; y <= baseY; y += 6) ctx.lineTo(G.edge(y, 1), y);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, apexY, 0, baseY); g.addColorStop(0, body); g.addColorStop(1, body2); ctx.fillStyle = g; ctx.fill();
  ctx.clip();
  if (rimHex) { // sky light catching the left flank
    const rg = ctx.createLinearGradient(cx - G.halfW, 0, cx, 0); rg.addColorStop(0, rgba(rimHex, rimA * .5)); rg.addColorStop(.6, rgba(rimHex, 0)); ctx.fillStyle = rg; ctx.fillRect(cx - G.halfW - 80, apexY, G.halfW + 80, hgt);
  }
  // terraces: a darker retaining wall line + a lighter ledge per band
  if (sep) for (let b = 0; b < 5; b++) { // each level its own tone so the five read as stacked levels
    ctx.fillStyle = rgba(b % 2 ? '#05061a' : '#6a7ac8', b % 2 ? .10 * sep : .05 * sep); ctx.fillRect(cx - G.halfW * 1.3, bands[b + 1], G.halfW * 2.6, bands[b] - bands[b + 1]);
    if (lit[b] > 0) { const lg = ctx.createLinearGradient(0, bands[b + 1], 0, bands[b]); lg.addColorStop(0, rgba(C.amber, .0)); lg.addColorStop(1, rgba(C.amber, .16 * lit[b])); ctx.fillStyle = lg; ctx.fillRect(cx - G.halfW * 1.3, bands[b + 1], G.halfW * 2.6, bands[b] - bands[b + 1]); }
  }
  for (let b = 1; b < 5; b++) {
    const y = bands[b];
    const xl = xAt(y, -1) - 10 - G.halfW * .2, xr = xAt(y, 1) + 10 + G.halfW * .2, amp = sep ? 1.2 : 5, th = sep ? 5 + 7 * sep : 5;
    for (const [hex, a, dy, tt] of [['#05061a', sep ? .75 : .5, 0, th], [sep ? '#8a9ae0' : '#3a4a92', sep ? .35 : .2, -2, 2]]) {
      ctx.fillStyle = rgba(hex, a); ctx.beginPath(); ctx.moveTo(xl, y + dy * scale);
      for (let x = xl; x <= xr; x += 12) ctx.lineTo(x, y + dy * scale + Math.sin(x * .011 + b * 2) * amp * scale);
      for (let x = xr; x >= xl; x -= 12) ctx.lineTo(x, y + (dy + tt) * scale + Math.sin(x * .011 + b * 2) * amp * scale);
      ctx.closePath(); ctx.fill();
    }
    if (sep && lit[b - 1] > 0) { ctx.fillStyle = rgba(C.amberHot, .25 * lit[b - 1]); ctx.fillRect(xl, y + th * scale, xr - xl, 1.5); }
  }
  // trees: cypresses and round crowns between the houses and along the flanks (darker than the hill)
  { const r = prng(seed * 7 + 1);
    if (!noTrees) for (let i = 0; i < 40 * (G.halfW / 600); i++) {
      const b = Math.floor(r() * 4.6), y = bands[b] - 4 * scale - r() * (bands[b] - bands[b + 1]) * .2, side = r() < .5 ? -1 : 1;
      const x = r() < .55 ? xAt(y, side) - side * (6 + r() * 40) * scale : mix(xAt(y, -1), xAt(y, 1), r());
      ctx.fillStyle = mixHex(body, '#05061a', .35 + r() * .25);
      if (r() < .5) { const h = (16 + r() * 22) * scale; ctx.beginPath(); ctx.ellipse(x, y - h / 2, h * .17, h / 2, 0, 0, 7); ctx.fill(); }
      else { const rr = (6 + r() * 9) * scale; ctx.beginPath(); ctx.arc(x, y - rr, rr, 0, 7); ctx.arc(x + rr * .7, y - rr * .7, rr * .7, 0, 7); ctx.fill(); }
    } }
  // houses per band
  const key = `${cx}|${baseY}|${seed}|${G.halfW}`;
  if (!HOUSES.has(key)) {
    const r = prng(seed), hs = [];
    for (let b = 0; b < 5; b++) {
      const y0 = bands[b], y1 = bands[b + 1], bh = y0 - y1;
      const rows = b === 4 ? 0 : b === 3 ? 1 : 2;
      for (let row = 0; row < rows; row++) {
        const yb = y0 - 6 * scale - row * bh * .47;
        const xl = xAt(yb - bh * .3, -1) + 14 * scale, xr = xAt(yb - bh * .3, 1) - 14 * scale;
        let x = xl + r() * 10;
        while (x < xr - 20 * scale) {
          const w = (24 + r() * 34) * scale * (b < 2 ? 1 : .85), h = Math.min(bh * .44, (22 + r() * 26) * scale);
          if (x + w > xr) break;
          const wins = []; const nw = Math.max(1, Math.round(w / (14 * scale)));
          for (let k = 0; k < nw; k++) for (let fl = 0; fl < (h > 30 * scale ? 2 : 1); fl++) wins.push({ x: x + (k + .5) * w / nw, y: yb - h + 9 * scale + fl * 15 * scale, on: r(), flick: r() * 7, tv: r() });
          hs.push({ b, x, y: yb, w, h, roof: r() < .55 ? 'gable' : 'flat', tone: r(), wins });
          x += w + (2 + r() * 8) * scale;
        }
      }
    }
    HOUSES.set(key, hs);
  }
  for (const h of HOUSES.get(key)) {
    const L = lit[h.b];
    ctx.fillStyle = mixHex('#0f1238', '#1c2058', h.tone * .7);
    ctx.beginPath(); ctx.moveTo(h.x, h.y); ctx.lineTo(h.x, h.y - h.h);
    if (h.roof === 'gable') ctx.lineTo(h.x + h.w / 2, h.y - h.h - h.w * .32);
    ctx.lineTo(h.x + h.w, h.y - h.h); ctx.lineTo(h.x + h.w, h.y); ctx.closePath(); ctx.fill();
    for (const wn of h.wins) {
      const on = litFn ? litFn(wn, h) > 0 : L > 0 && wn.on < .25 + .7 * L;
      const ww = 5 * scale, wh = 7 * scale;
      if (on) {
        const isTv = tv > 0 && wn.tv < tv;
        const hex = isTv ? C.cyan : winHex;
        const fl = isTv ? .6 + .4 * Math.sin(t * 9 + wn.flick * 3) * Math.sin(t * 3.1 + wn.flick) : .9 + .1 * Math.sin(t * 1.3 + wn.flick);
        ctx.fillStyle = rgba(isTv ? C.cyanWhite : C.amberHot, clamp((litFn ? litFn(wn, h) : L) * 1.2) * fl);
        ctx.fillRect(wn.x - ww / 2, wn.y, ww, wh);
      } else { ctx.fillStyle = rgba('#05061a', .5 + darkWin); ctx.fillRect(wn.x - 2.5 * scale, wn.y, 5 * scale, 7 * scale); }
    }
  }
  ctx.restore();
  // window glows (additive, outside clip so they bloom)
  for (const h of HOUSES.get(key)) {
    const L = lit[h.b]; if (L <= 0 && !litFn) continue;
    for (const wn of h.wins) if (litFn ? (litFn(wn, h) > 0 && wn.on < .5) : (wn.on < .25 + .7 * L && wn.on < .5)) {
      const isTv = tv > 0 && wn.tv < tv;
      glow(ctx, wn.x, wn.y + 4 * scale, 16 * scale, .22 * (litFn ? litFn(wn, h) : L), isTv ? C.cyan : C.amber, isTv ? C.cyanWhite : C.amberHot);
    }
  }
  return HOUSES.get(key);
}
// festoon strings between houses in a band
export function festoons(ctx, t, G, band, u, { seed = 7, n = 6, hex = C.amber, sag = 16 } = {}) {
  if (u <= 0) return;
  const r = prng(seed + band), { bands, xAt } = G;
  const y0 = bands[band], y1 = bands[band + 1], bh = y0 - y1;
  for (let i = 0; i < n; i++) {
    const yy = y0 - bh * (.35 + r() * .45), xl = xAt(yy, -1) + 10, xr = xAt(yy, 1) - 10;
    const a = mix(xl, xr, r() * .5), b = Math.min(xr, a + (xr - xl) * (.35 + r() * .4));
    const prog = clamp(u * 1.6 - i / n * .6);
    const bulbs = Math.floor((b - a) / 11);
    ctx.strokeStyle = rgba('#05061a', .8); ctx.lineWidth = 1.2; ctx.beginPath();
    for (let k = 0; k <= 20; k++) { const q = k / 20, x = mix(a, b, q), y = yy + Math.sin(Math.PI * q) * sag; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    for (let k = 0; k <= bulbs; k++) {
      const q = k / bulbs; if (q > prog) break;
      const x = mix(a, b, q), y = yy + Math.sin(Math.PI * q) * sag + 2, tw = .75 + .25 * Math.sin(t * 2 + k * 1.7 + i);
      const c = [C.amberHot, C.rose, C.cream][(k + i) % 3];
      ctx.fillStyle = rgba(c, .95 * tw); ctx.beginPath(); ctx.arc(x, y, 1.9, 0, 7); ctx.fill();
      glow(ctx, x, y, 9, .35 * tw, hex, C.amberHot);
    }
  }
}
// hill reflection in water
export function reflect(ctx, srcCanvas, yLine, { a = .35, t = 0, h = 260 } = {}) {
  ctx.save(); ctx.beginPath(); ctx.rect(0, yLine, W, H - yLine); ctx.clip();
  for (let y = 0; y < h; y += 3) {
    const off = Math.sin(y * .09 + t * 2) * (2 + y * .03);
    ctx.globalAlpha = a * (1 - y / h);
    ctx.drawImage(srcCanvas, 0, yLine - y - 3, W, 3, off, yLine + y, W, 3);
  }
  ctx.restore();
}
// sea surface with glints
export function sea(ctx, t, y0, { top = '#141a4c', bottom = '#070918', seed = 2, glint = C.amber, glintA = .3, gx = W / 2, gw = 400 } = {}) {
  vgrad(ctx, [[0, top], [1, bottom]], 0, y0, W, H - y0);
  const r = prng(seed);
  for (let i = 0; i < 260; i++) {
    const y = y0 + Math.pow(r(), 1.6) * (H - y0), spread = gw * (0.4 + (y - y0) / (H - y0)), x = gx + (r() - .5) * 2 * spread + drift(t, 6, i);
    const w = (6 + r() * 30) * (0.5 + (y - y0) / (H - y0)), a = glintA * (1 - Math.abs(x - gx) / spread) * (.4 + .6 * Math.sin(t * 2 + i));
    if (a <= 0) continue; ctx.fillStyle = rgba(glint, a); ctx.fillRect(x - w / 2, y, w, 1.6);
  }
}

export function save(c, file) { fs.writeFileSync(file, c.toBuffer('image/png')); }
