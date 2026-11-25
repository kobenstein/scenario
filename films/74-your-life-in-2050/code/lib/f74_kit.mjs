// Film 74 kit: 2.5D daylight places in the editorial look (flat shapes on cards at real depth, cam3/card of lib/f10_editorial.mjs),
// living figures (du / person / robot of the kit), the paper card (MIX), the HUD (day clock + GONE counter), carriers (portal, iris, sweep).
// All drawing of a shot goes through card() or scr(): both respect the OUTER transform, so carriers can zoom a whole shot crisply.
import * as E from './f10_editorial.mjs';
import { maskLine, measure } from './f13_kit.mjs';
import { rise } from './f16_kit.mjs';
export const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rad, prng, drift, cam3, card, camAt, withOuter, glowText, du, person, robot, figureRaw, COAT } = E;
export { maskLine, measure, rise };
const lin = E.lin;
export { lin };
export const { project, aim, F0, halo, stars, dust } = E;
// camera keys [[t, cam3, ease]] + the perpetual drift (nothing ever stands still)
export const camK = (t, keys, amt = 1) => { const c = camAt(t, keys, Math.max(1700, ...keys.map((k) => (k[1].z ?? 0) + 400))); c.x += drift(t, 7 * amt, 3.1); c.y += drift(t, 4 * amt, 7.3); c.z += drift(t, 20 * amt, 1.7); return c; };
export const PRINT74 = { grain: 12, floor: 3, vig: .38 };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
export const ease = { s: sineIO, q: quartIO, o: expoOut, i: expoIn };
// screen-space drawing that respects the OUTER transform of a carrier
let OUT = null;
export function outer(m, fn) { const p = OUT; OUT = m; try { return withOuter(m, fn); } finally { OUT = p; } }
export function scr(ctx, fn) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (OUT) ctx.transform(OUT.k, 0, 0, OUT.k, OUT.e, OUT.f); fn(ctx); ctx.restore(); }

// ---------------------------------------------------------------- light of the hours (the corner clock drives the sky)
const LOOKS = [   // h, sky top, sky low, sun colour, light (warm side), shade (cool side), haze, night (stars/windows)
  [6.5, '#2b3f86', '#f3c98c', '#fff1c4', '#ffd58a', '#2a3c7c', '#e9c89a', .25],
  [8.2, '#3b5aa2', '#f6dcaa', '#fff6d6', '#ffe0a0', '#314a8c', '#efd9b0', 0],
  [12, '#4a72bb', '#e8e4cc', '#fffbe6', '#fff0c8', '#3a5598', '#e2e0cc', 0],
  [16, '#3d62ad', '#f2d6a0', '#fff1c8', '#ffd99a', '#334c90', '#ecd2a6', 0],
  [18.2, '#2c4590', '#f1ad7c', '#ffe0a8', '#ffc27e', '#2b3d7e', '#e9a982', .05],
  [19.6, '#151f52', '#c8735c', '#ffd49a', '#ffb06a', '#1c2a62', '#9a6a72', .55],
  [21, '#0a1236', '#2a2f6a', '#ffe6b0', '#f2b26a', '#141d4c', '#3a3a70', .95],
];
export function hourLook(h) {
  let i = 0; while (i < LOOKS.length - 2 && h > LOOKS[i + 1][0]) i++;
  const a = LOOKS[i], b = LOOKS[i + 1], u = smooth(clamp((h - a[0]) / (b[0] - a[0])));
  const m = (k) => mixHex(a[k], b[k], u);
  const L = { h, top: m(1), low: m(2), sunCol: m(3), light: m(4), shade: m(5), haze: m(6), night: lerp(a[7], b[7], u) };
  // the sun: low east in the morning, high at noon, low west in the evening (design coords of the sky card)
  const x = lerp(-0.1, 1.1, clamp((h - 6) / 14)), arc = Math.sin(Math.PI * clamp((h - 6) / 14));
  L.sun = [W * x, H * (0.62 - 0.5 * arc)]; L.dir = h < 13 ? -1 : 1;   // light comes from the left in the morning
  L.ink = mixHex('#0c1745', L.shade, .25); L.wall = mixHex('#c9b48e', L.light, .35); L.wallS = mixHex('#7f7a8e', L.shade, .55);
  L.roof = mixHex('#a4553a', L.shade, .25); L.roofS = mixHex('#6a3a3c', L.shade, .5);
  L.leaf = mixHex('#5f8f4a', L.light, .18); L.leafS = mixHex('#2f5c4a', L.shade, .45); L.grass = mixHex('#86a85a', L.light, .25);
  L.road = mixHex('#8b8aa0', L.light, .2); L.roadS = mixHex('#5a5f86', L.shade, .4); L.walk = mixHex('#d8c9a6', L.light, .3);
  if (L.night > 0) for (const k of ['wall', 'wallS', 'roof', 'roofS', 'leaf', 'leafS', 'grass', 'road', 'roadS', 'walk']) L[k] = mixHex(L[k], '#141c4a', L.night * .72);
  return L;
}
// depth haze: far things take the colour of the air (aerial perspective); Z = card depth
export const hz = (c, Z, L, k = 1) => mixHex(c, L.haze, clamp((Z - 1700) / 16000) * .78 * k);

// ---------------------------------------------------------------- stage: cards back to front
export function stage(ctx, cam, layers) { for (const [Z, fn] of [...layers].sort((p, q) => q[0] - p[0])) card(ctx, cam, Z, fn); }
// camera of a shot: glide from c0 to c1 over [a, b] (sine), plus the perpetual drift (amplitude grows with distance)
export function glide(t, a, b, c0, c1, o = {}) {
  const u = (o.e || sineIO)(clamp((t - a) / Math.max(.1, b - a))), c = cam3();
  for (const k of ['x', 'y', 'z']) c[k] = lerp(c0[k] ?? 0, c1[k] ?? 0, u);
  const amt = o.drift ?? 1;
  c.x += drift(t, 9 * amt, 3.1); c.y += drift(t, 5 * amt, 7.3); c.z += drift(t, 22 * amt, 1.7);
  return c;
}

// ---------------------------------------------------------------- sky and land
export function sky(ctx, t, L, o = {}) {
  ctx.fillStyle = lin(ctx, 0, -400, 0, o.horizon ?? 760, [[0, L.top], [1, L.low]]); ctx.fillRect(-1600, -1200, W + 3200, H + 2400);
  if (L.night > .05) E.stars(ctx, 41, 160, t, [-600, -300, W + 1200, 700], L.night);
  if (o.sun !== false) sunDisc(ctx, t, o.sunAt || L.sun, L, o.sunR ?? 70);
  clouds(ctx, t, L, o.cloudY ?? 180, o.seed ?? 3, o.clouds ?? 5);
}
export function sunDisc(ctx, t, [x, y], L, r = 70) {
  const b = 1 + .015 * Math.sin(t * .7);
  ctx.fillStyle = rad(ctx, x, y, r * 7, [[0, rgba(L.sunCol, .55)], [.25, rgba(L.light, .22)], [1, rgba(L.light, 0)]]); ctx.fillRect(x - r * 7, y - r * 7, r * 14, r * 14);
  ctx.fillStyle = rad(ctx, x, y, r * b, [[0, '#fffdf2'], [.7, L.sunCol], [1, mixHex(L.sunCol, L.light, .5)]]); ctx.beginPath(); ctx.arc(x, y, r * b, 0, 7); ctx.fill();
}
export function clouds(ctx, t, L, y0, seed, n) {
  const r = prng(seed);
  for (let i = 0; i < n; i++) {
    const w = 160 + r() * 260, x = ((r() * (W + 1400) + t * (6 + r() * 8)) % (W + 1400)) - 700, y = y0 + r() * 160, a = .5 + r() * .3;
    ctx.fillStyle = lin(ctx, 0, y - 40, 0, y + 30, [[0, rgba(mixHex('#fffaf0', L.low, .3), a)], [1, rgba(mixHex(L.low, L.top, .35), a * .6)]]);
    ctx.beginPath(); ctx.ellipse(x, y, w * .5, 26, 0, 0, 7); ctx.ellipse(x - w * .2, y - 18, w * .22, 26, 0, 0, 7); ctx.ellipse(x + w * .12, y - 24, w * .26, 30, 0, 0, 7); ctx.fill();
  }
}
// rolling hills: a band from y with bumps, filled to below the frame
export function hills(ctx, y, amp, col, seed = 1, o = {}) {
  const r = prng(seed), x0 = o.x0 ?? -1400, x1 = o.x1 ?? W + 1400, n = 9;
  const ph = [r() * 6, r() * 6, r() * 6];
  ctx.beginPath(); ctx.moveTo(x0, H + 900);
  for (let x = x0; x <= x1; x += 40) ctx.lineTo(x, y - amp * (.55 * Math.sin(x / 520 + ph[0]) + .3 * Math.sin(x / 210 + ph[1]) + .15 * Math.sin(x / 90 + ph[2])) - amp * .3);
  ctx.lineTo(x1, H + 900); ctx.closePath();
  ctx.fillStyle = o.grad ? lin(ctx, 0, y - amp, 0, y + (o.depth ?? 300), [[0, o.grad[0]], [1, o.grad[1]]]) : col; ctx.fill();
}
// a strip of ground (sidewalk, road, verge) between y0 and y1 with a soft shade
export function band(ctx, y0, y1, c0, c1, x0 = -1600, x1 = W + 1600) { ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, c0], [1, c1]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0); }
// soft ground shadow (ellipse), cast to the side away from the sun
export function shadowEl(ctx, x, y, w, L, a = .35, len = 1) { ctx.save(); ctx.fillStyle = rgba(L.ink, a); ctx.beginPath(); ctx.ellipse(x - L.dir * w * .5 * len, y, w * (.6 + .4 * len), w * .09, 0, 0, 7); ctx.fill(); ctx.restore(); }

// ---------------------------------------------------------------- buildings
// a row house seen from the street: front facade (w × h) + a thin side face for volume; roof 'gable' | 'flat' | 'none'
// o: side (+1 right face visible, -1 left), lit 0..1 windows lit, door ('yellow' = yours), solar (0..1 panels on the roof), tiles (gap 0..1),
//    col (facade base), garage (0..1 open) → { x, base, w, h, roofTop, door: [x,y,w,h], win: [[x,y,w,h],…], roofPts }
export function house(ctx, x, base, w, h, L, o = {}) {
  const side = o.side ?? 0, sw = Math.abs(side) * w * .16, rh = o.roof === 'flat' ? 0 : (o.roofH ?? w * .38);
  const wall = mixHex(o.col || L.wall, L.light, .12), wallS = mixHex(o.col || L.wall, L.shade, .55);
  const g = { x, base, w, h, win: [], roofTop: base - h - rh };
  if (side) {   // side face
    const xs = side > 0 ? x + w : x - sw;
    ctx.fillStyle = side * L.dir > 0 ? wallS : mixHex(wall, L.shade, .25);
    ctx.beginPath(); ctx.moveTo(side > 0 ? x + w : x, base); ctx.lineTo(side > 0 ? xs + sw : xs, base - sw * .35); ctx.lineTo(side > 0 ? xs + sw : xs, base - h - sw * .35); ctx.lineTo(side > 0 ? x + w : x, base - h); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = lin(ctx, x, 0, x + w, 0, L.dir < 0 ? [[0, wall], [1, mixHex(wall, wallS, .35)]] : [[0, mixHex(wall, wallS, .35)], [1, wall]]); ctx.fillRect(x, base - h, w, h);
  // plinth
  ctx.fillStyle = rgba(L.ink, .18); ctx.fillRect(x, base - h * .06, w, h * .06);
  if (o.roof !== 'flat' && o.roof !== 'none') {
    const ov = w * .06, pts = [[x - ov, base - h], [x + w / 2, base - h - rh], [x + w + ov, base - h]];
    g.roofPts = pts;
    ctx.fillStyle = lin(ctx, 0, base - h - rh, 0, base - h, [[0, mixHex(L.roof, L.light, .15)], [1, L.roofS]]);
    ctx.beginPath(); ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); ctx.lineTo(...pts[2]); ctx.closePath(); ctx.fill();
    if (o.solar) {   // panels on the sunny slope
      const s = o.solar, sl = L.dir < 0 ? 0 : 1;
      ctx.save(); ctx.beginPath(); ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); ctx.lineTo(...pts[2]); ctx.closePath(); ctx.clip();
      const px0 = sl ? x + w / 2 + w * .04 : x + w * .04, pw = w * .42;
      ctx.fillStyle = lin(ctx, 0, base - h - rh, 0, base - h, [[0, mixHex('#3c5fb0', L.light, .25)], [1, '#1f2f6e']]);
      ctx.fillRect(px0, base - h - rh * .86, pw * s, rh * .74);
      ctx.strokeStyle = rgba(L.light, .35); ctx.lineWidth = 1.5;
      for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(px0 + pw * k / 4, base - h - rh); ctx.lineTo(px0 + pw * k / 4, base - h); ctx.stroke(); }
      ctx.fillStyle = rgba('#fff8dc', .25 + .15 * Math.sin((o.t || 0) * 1.3 + x)); ctx.fillRect(px0, base - h - rh * .86, pw * s * .3, rh * .74);
      ctx.restore();
    }
    if (o.tiles) {   // a storm gap in the roof (0..1 = how much is still missing)
      ctx.save(); ctx.fillStyle = mixHex(L.ink, '#000', .2); const gx = x + w * .3, gy = base - h - rh * .45;
      for (let k = 0; k < 5; k++) if (k / 5 < o.tiles) ctx.fillRect(gx + k * w * .045, gy + (k % 2) * 8, w * .04, 14);
      ctx.restore();
    }
  }
  // windows 2 × 2 (+ door)
  const cols = o.cols ?? 2, rows = o.rows ?? 2, ww = w * .2, wh = h * .2;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (r === rows - 1 && c === (o.doorCol ?? 0) && o.door !== false) continue;
    const wx = x + w * (cols === 1 ? .4 : .18 + c * (.64 / (cols - 1 || 1))) - (cols === 1 ? 0 : ww / 2 * 0), wy = base - h + h * (.16 + r * (.62 / Math.max(1, rows - 1 || 1))) * (rows === 1 ? 1 : 1);
    const lit = o.lit ?? L.night * .8, rr = prng(Math.round(x * 7 + r * 13 + c))();
    const on = lit > rr;
    ctx.fillStyle = on ? lin(ctx, 0, wy, 0, wy + wh, [[0, '#fff2c4'], [1, '#f2b25e']]) : lin(ctx, 0, wy, 0, wy + wh, [[0, mixHex('#33497a', L.light, .25)], [1, mixHex('#1c2a5c', L.shade, .3)]]);
    ctx.fillRect(wx, wy, ww, wh);
    if (!on) { ctx.fillStyle = rgba('#fffaf0', .18); ctx.beginPath(); ctx.moveTo(wx, wy + wh); ctx.lineTo(wx + ww * .5, wy); ctx.lineTo(wx + ww * .75, wy); ctx.lineTo(wx + ww * .25, wy + wh); ctx.fill(); }
    ctx.fillStyle = rgba(L.ink, .3); ctx.fillRect(wx - 3, wy + wh, ww + 6, 4);
    g.win.push([wx, wy, ww, wh, on]);
  }
  if (o.door !== false) {
    const dw = w * .2, dh = h * .34, dx = x + w * (o.doorCol === 1 ? .66 : .16), dy = base - dh;
    ctx.fillStyle = o.door === 'yellow' ? lin(ctx, 0, dy, 0, base, [[0, '#ffd36a'], [1, '#d99a2a']]) : mixHex(o.doorC || '#2e4a8a', L.shade, .3);
    ctx.fillRect(dx, dy, dw, dh); ctx.fillStyle = rgba(L.ink, .35); ctx.fillRect(dx + dw * .78, dy + dh * .5, 4, 4);
    if (o.garage) { const gw = w * .44, gx = x + w * (o.garageAt ?? .5), gh = h * .4; ctx.fillStyle = mixHex('#2b2240', L.shade, .3); ctx.fillRect(gx, base - gh, gw, gh); ctx.fillStyle = lin(ctx, 0, base - gh, 0, base, [[0, '#ffe7a8'], [1, '#e0a14c']]); ctx.globalAlpha = o.garage; ctx.fillRect(gx + 6, base - gh + 6, gw - 12, gh - 6); ctx.globalAlpha = 1; g.garage = [gx, base - gh, gw, gh]; }
    g.door = [dx, dy, dw, dh];
  }
  return g;
}
// a round-crowned tree (thumbnail style), o.apples (count), o.trunk colour, o.wind; returns crown centre
export function tree(ctx, t, x, base, s, L, o = {}) {
  const sway = Math.sin(t * .8 + x * .01) * 4 * s * (o.wind ?? 1), th = 150 * s, cr = 95 * s;
  ctx.fillStyle = lin(ctx, x - 10 * s, 0, x + 10 * s, 0, [[0, mixHex('#5a3e3a', L.light, .1)], [1, mixHex('#2a2238', L.shade, .4)]]);
  ctx.beginPath(); ctx.moveTo(x - 9 * s, base); ctx.quadraticCurveTo(x - 6 * s, base - th * .6, x + sway * .3 - 4 * s, base - th); ctx.lineTo(x + sway * .3 + 4 * s, base - th); ctx.quadraticCurveTo(x + 6 * s, base - th * .6, x + 9 * s, base); ctx.fill();
  const cx = x + sway, cy = base - th - cr * .55;
  const lc = o.leaf || L.leaf, ls = o.leafS || L.leafS;
  ctx.fillStyle = rad(ctx, cx + L.dir * -cr * .35, cy - cr * .35, cr * 1.5, [[0, mixHex(lc, L.light, .35)], [.55, lc], [1, ls]]);
  ctx.beginPath(); ctx.arc(cx, cy, cr, 0, 7); ctx.arc(cx - cr * .55, cy + cr * .3, cr * .62, 0, 7); ctx.arc(cx + cr * .6, cy + cr * .25, cr * .6, 0, 7); ctx.fill();
  if (o.apples) { const r = prng(Math.round(x)); for (let i = 0; i < o.apples; i++) { const a = r() * 6.28, d = r() * cr * .85; ctx.fillStyle = r() > .3 ? '#e2553f' : '#f0a23a'; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d * .8, 6.5 * s, 0, 7); ctx.fill(); } }
  shadowEl(ctx, x, base, cr * .9, L, .22);
  return [cx, cy, cr];
}
// a tall slim cypress / poplar (far layers)
export function poplar(ctx, x, base, h, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, base - h * .55, h * .12, h * .5, 0, 0, 7); ctx.fill(); ctx.fillRect(x - 2, base - h * .1, 4, h * .1); }
// a far town silhouette with a clock tower (the square)
export function townLine(ctx, x0, x1, base, col, L, o = {}) {
  const r = prng(o.seed ?? 5); ctx.fillStyle = col;
  for (let x = x0; x < x1;) { const w = 40 + r() * 70, h = 30 + r() * 60; ctx.fillRect(x, base - h, w + 1, h); ctx.beginPath(); ctx.moveTo(x - 3, base - h); ctx.lineTo(x + w / 2, base - h - w * .35); ctx.lineTo(x + w + 3, base - h); ctx.fill(); x += w; }
  if (o.tower !== false) { const tx = o.towerX ?? (x0 + x1) / 2; ctx.fillRect(tx - 18, base - 190, 36, 190); ctx.beginPath(); ctx.moveTo(tx - 24, base - 190); ctx.lineTo(tx, base - 240); ctx.lineTo(tx + 24, base - 190); ctx.fill(); ctx.fillStyle = mixHex(col, '#fff2c4', .55); ctx.beginPath(); ctx.arc(tx, base - 160, 10, 0, 7); ctx.fill(); }
}
export function ladder(ctx, x0, y0, x1, y1, L, w = 34) {
  const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy), nx = -dy / l * w / 2, ny = dx / l * w / 2;
  ctx.strokeStyle = mixHex('#c9a46a', L.shade, .35); ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0 + nx, y0 + ny); ctx.lineTo(x1 + nx, y1 + ny); ctx.moveTo(x0 - nx, y0 - ny); ctx.lineTo(x1 - nx, y1 - ny);
  for (let k = 1; k < l / 34; k++) { const u = k * 34 / l; ctx.moveTo(x0 + dx * u + nx, y0 + dy * u + ny); ctx.lineTo(x0 + dx * u - nx, y0 + dy * u - ny); } ctx.stroke();
}
// the quiet round car of 2050 (no driver), facing dir; o.lit headlights
export function pod(ctx, x, base, s, L, o = {}) {
  const d = o.dir ?? 1, w = 230 * s, h = 110 * s;
  shadowEl(ctx, x, base, w * .55, L, .3);
  ctx.save(); ctx.translate(x, base); ctx.scale(d, 1);
  ctx.fillStyle = lin(ctx, 0, -h, 0, 0, [[0, mixHex('#f4efe2', L.light, .3)], [1, mixHex('#a9a8bd', L.shade, .4)]]);
  ctx.beginPath(); ctx.moveTo(-w / 2, -h * .22); ctx.bezierCurveTo(-w / 2, -h * .8, -w * .25, -h, w * .05, -h); ctx.bezierCurveTo(w * .35, -h, w / 2, -h * .6, w / 2, -h * .22); ctx.lineTo(w / 2, -h * .12); ctx.lineTo(-w / 2, -h * .12); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -h, 0, -h * .45, [[0, mixHex('#2c4f99', L.light, .2)], [1, '#16245a']]);
  ctx.beginPath(); ctx.moveTo(-w * .32, -h * .48); ctx.bezierCurveTo(-w * .3, -h * .82, -w * .12, -h * .9, w * .08, -h * .9); ctx.bezierCurveTo(w * .28, -h * .9, w * .36, -h * .7, w * .38, -h * .48); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba('#fffaf0', .25); ctx.beginPath(); ctx.moveTo(-w * .1, -h * .5); ctx.lineTo(w * .02, -h * .88); ctx.lineTo(w * .1, -h * .88); ctx.lineTo(-w * .02, -h * .5); ctx.fill();
  ctx.fillStyle = mixHex('#1d2150', L.shade, .2); for (const wx of [-w * .3, w * .3]) { ctx.beginPath(); ctx.arc(wx, -h * .12, h * .17, 0, 7); ctx.fill(); }
  ctx.fillStyle = o.cyan === false ? '#fff2c4' : '#bff1ff'; ctx.beginPath(); ctx.ellipse(w * .47, -h * .34, 5 * s, 8 * s, 0, 0, 7); ctx.fill();
  ctx.restore();
}
// a cast-shadow-free classic car of 2026 as a cold blue-ink outline (flashbacks, the ghost line on the kerb)
export function inkCar(ctx, x, base, s, a = 1, col = '#2c4a9a') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.lineJoin = 'round'; const w = 250 * s, h = 90 * s;
  ctx.beginPath(); ctx.moveTo(x - w / 2, base - h * .25); ctx.lineTo(x - w / 2, base - h * .55); ctx.lineTo(x - w * .28, base - h * .6); ctx.lineTo(x - w * .16, base - h); ctx.lineTo(x + w * .2, base - h); ctx.lineTo(x + w * .32, base - h * .6); ctx.lineTo(x + w / 2, base - h * .52); ctx.lineTo(x + w / 2, base - h * .25); ctx.closePath(); ctx.stroke();
  for (const wx of [-w * .3, w * .3]) { ctx.beginPath(); ctx.arc(x + wx, base - h * .2, h * .2, 0, 7); ctx.stroke(); }
  ctx.fillStyle = rgba('#e0443a', .85); ctx.fillRect(x - w / 2 - 2, base - h * .5, 8, 10); ctx.restore();
}

// ---------------------------------------------------------------- figures (all breathe; gelenkige silhouettes, no faces)
export const RUST = { base: '#c4583a', lit: '#e88a5e', shade: '#7e3428', deep: '#3e1c28', hem: .3 };
const PALS = [
  { base: '#3e5a9a', lit: '#6a86c4', shade: '#1c2a5c', deep: '#0e1638', hem: .44 }, { base: '#5d6b8f', lit: '#8a98bb', shade: '#2c3456', deep: '#141a34', hem: .44 },
  { base: '#7a4f7e', lit: '#a676a6', shade: '#3c2446', deep: '#1c1028', hem: .3 }, { base: '#2f6f73', lit: '#5a9a96', shade: '#173a46', deep: '#0b1c2a', hem: .44 },
  { base: '#8a6a4a', lit: '#b8946a', shade: '#4a3428', deep: '#221812', hem: .3 }, { base: '#4a4f7e', lit: '#7479ab', shade: '#22264a', deep: '#10122a', hem: .22 },
];
export const pal = (i) => PALS[((i % PALS.length) + PALS.length) % PALS.length];
const breathe = (t, ph = 0) => 1 + .008 * Math.sin(t * 1.9 + ph);
export function you(ctx, t, x, y, h, o = {}) { return du(ctx, x, y, h * breathe(t, 1), { hood: false, look: o.look ?? .15 * Math.sin(t * .4), ...o }); }
export function girl(ctx, t, x, y, h, o = {}) { return figureRaw(ctx, x, y, h * breathe(t, 2), { hood: false, look: o.look ?? .2 * Math.sin(t * .5 + 1), ...o }, RUST, false); }
export function folk(ctx, t, i, x, y, h, o = {}) { return figureRaw(ctx, x, y, h * breathe(t, i), { look: o.look ?? .12 * Math.sin(t * .45 + i), ...o }, pal(i), false); }
export function bot(ctx, t, x, y, h, L, o = {}) { return robot(ctx, x, y, h * (1 + .004 * Math.sin(t * 2.3)), { body: mixHex('#e9e6dc', L.shade, .18), rim: mixHex('#fffaf0', L.light, .4), seam: rgba(L.shade, .45), joint: mixHex('#3b4a7e', L.shade, .2), ...o }); }
// walking phase for a figure that walks with speed v (px/s) and stride s
export const walkPh = (t, v = 1) => t * 5.2 * v;

// ---------------------------------------------------------------- the paper card (MIX): unfolds out of an object, folds back
// u 0..1 open (unfold), o: from [x,y] (origin, the object), head ('BACK IN THE TWENTIES' | 'TODAY:' …), lines [text], src, draw(ctx, x, y, w, h) (blue-ink drawing area),
// tone 'paper' | 'night' (a dusk explainer plate); returns the inner rect
export const PAPER = { body: '#f1e8d0', lit: '#fbf5e4', edge: '#cdbf9c', ink: '#1f3c8a', ink2: '#5a6fa6', red: '#c8473a' };
export function paper(ctx, t, x, y, w, h, u, o = {}) {
  if (u <= 0) return null;
  const e = expoOut(clamp(u)), from = o.from || [x + w / 2, y + h / 2];
  const cx = lerp(from[0], x + w / 2, e), cy = lerp(from[1], y + h / 2, e), sx = lerp(.06, 1, e), sy = lerp(.02, 1, expoOut(clamp(u * 1.25 - .15)));
  const rot = (1 - e) * (o.rot ?? -.08) + .006 * Math.sin(t * .6 + x);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(sx, sy); ctx.translate(-w / 2, -h / 2);
  ctx.fillStyle = rgba('#0a1030', .28); ctx.beginPath(); ctx.roundRect(10, 16, w, h, 6); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, 0, w, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(0, 0, w, h, 6); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  let yy = 46;
  if (o.head) { ctx.font = '600 22px Inter'; ctx.letterSpacing = '0.18em'; ctx.fillStyle = o.headCol || PAPER.ink2; ctx.fillText(o.head, 28, yy); ctx.letterSpacing = '0em'; yy += 14; ctx.fillStyle = rgba(PAPER.ink2, .5); ctx.fillRect(28, yy, w - 56, 2); yy += 22; }
  const inner = [28, yy, w - 56, h - yy - (o.src ? 52 : 26)];
  if (o.draw) { ctx.save(); ctx.beginPath(); ctx.rect(inner[0] - 4, inner[1] - 4, inner[2] + 8, inner[3] + 8); ctx.clip(); o.draw(ctx, ...inner, clamp(u * 1.4 - .4)); ctx.restore(); }
  if (o.lines) { let ly = yy + (o.lineSize ?? 38); for (const l of o.lines) { ctx.font = `${o.serif === false ? '600 ' : ''}${o.lineSize ?? 38}px ${o.serif === false ? 'Inter' : '"Instrument Serif"'}`; ctx.fillStyle = PAPER.ink; ctx.fillText(l, 28, ly); ly += (o.lineSize ?? 38) * 1.22; } }
  if (o.src) { ctx.font = '500 22px Inter'; ctx.fillStyle = rgba(PAPER.ink2, .9); ctx.fillText(o.src, 28, h - 22); }
  ctx.restore();
  return inner;
}
// the open/close envelope of a card inside [t0, t1]: opens over .7 s, closes (folds back) in the last .5 s
export const cardU = (t, t0, t1) => clamp(span(t, t0, t0 + .7) - span(t, t1 - .5, t1)) * (t < t1 ? 1 : 0);
// a TODAY card (fact from the day the film is made), top right by default, never over the subtitle band
export function today(ctx, t, t0, t1, lines, src, o = {}) {
  const u = cardU(t, t0, t1); if (u <= 0) return;
  const size = o.size ?? 34, w = o.w ?? Math.max(...lines.map((l) => measure(l, size, false, 600)), src ? measure(src, 22, false, 500) : 0) + 64, h = 88 + lines.length * size * 1.25 + (src ? 30 : 0);
  const x = o.x ?? W - w - 90, y = o.y ?? 96;
  scr(ctx, (c) => paper(c, t, x, y, w, h, u, { head: o.head ?? 'TODAY', headCol: PAPER.red, lines, src, serif: false, lineSize: size, from: o.from }));
}
// blue-ink drawing helpers (inside paper cards)
export function ink(ctx, col = PAPER.ink, w = 2.6) { ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; }
export function strokeIn(ctx, pts, u) { // draw a polyline up to u
  if (u <= 0) return; let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  let rem = L * clamp(u); ctx.beginPath(); ctx.moveTo(...pts[0]);
  for (let i = 1; i < pts.length && rem > 0; i++) { const f = Math.min(1, rem / seg[i - 1]); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); rem -= seg[i - 1]; }
  ctx.stroke();
}

// ---------------------------------------------------------------- type
// a line of type rising out of its own mask on the word; segs [[text, warmth]]; o.col, o.serif, o.align
export function words(ctx, segs, x, y, size, u, o = {}) { if (u <= 0) return; scr(ctx, (c) => maskLine(c, typeof segs === 'string' ? [[segs, o.warm ?? 0]] : segs, x, y, size, rise(u), { glow: o.glow ?? true, ...o })); }
// word-by-word reveal on the voice: list of [text, t]
export function wordRun(ctx, t, items, x, y, size, o = {}) {
  let xx = x; const tot = items.reduce((s, [w]) => s + measure(w + ' ', size, o.serif ?? true, o.weight), 0);
  if (o.align === 'center') xx = x - tot / 2;
  for (const [w, t0, warm] of items) { const u = span(t, t0 - .08, t0 + .45); if (u > 0) words(ctx, [[w, warm ?? 0]], xx, y, size, u, { ...o, align: 'left' }); xx += measure(w + ' ', size, o.serif ?? true, o.weight); }
}
export function caps(ctx, s, x, y, u, o = {}) { if (u <= 0) return; scr(ctx, (c) => maskLine(c, [[s, 0]], x, y, o.size ?? 26, rise(u), { serif: false, weight: 600, col: o.col ?? P.cream, glow: o.glow ?? false, align: o.align })); }
// a dark soft plate behind type that sits on a bright scene (keeps contrast without a box look)
export function scrim(ctx, x, y, w, h, a = .55) { scr(ctx, (c) => { const r = w * .7; c.translate(x + w / 2, y + h / 2); c.scale(1, Math.min(1, h * 1.5 / w)); c.fillStyle = rad(c, 0, 0, r, [[0, rgba('#0b1440', a)], [.6, rgba('#0b1440', a * .55)], [1, rgba('#0b1440', 0)]]); c.fillRect(-r, -r, 2 * r, 2 * r); }); }

// ---------------------------------------------------------------- explainer ground (dusk blue, gold light) for EXPL rows
export function dusk(ctx, t, o = {}) {
  scr(ctx, (c) => {
    c.fillStyle = lin(c, 0, 0, 0, H, [[0, '#0b1340'], [.6, '#132058'], [1, '#1d2a6a']]); c.fillRect(-W, -H, W * 3, H * 3);
    const gx = o.glow?.[0] ?? W * .5, gy = o.glow?.[1] ?? H * .45;
    c.fillStyle = rad(c, gx, gy, 900, [[0, rgba('#f2c27a', .16)], [1, rgba('#f2c27a', 0)]]); c.fillRect(-W, -H, W * 3, H * 3);
    c.strokeStyle = rgba('#8aa0e0', .07); c.lineWidth = 1; const off = (t * 6) % 60;
    for (let x = -60 + off; x < W + 60; x += 60) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    for (let y = -60 + off * .5; y < H + 60; y += 60) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  });
}
export const GOLD = { core: '#fff8dc', body: '#f6c95c', mid: '#e3a63f', line: '#ffd982', deep: '#6e4416' };
export const CYAN = { core: '#e8fbff', body: '#8fe6ff', deep: '#0a6f8c' };
export function goldLine(ctx, pts, u, o = {}) { if (u <= 0) return; ctx.save(); ctx.shadowColor = rgba('#f2b632', .8); ctx.shadowBlur = o.blur ?? 12; ctx.strokeStyle = o.col || GOLD.line; ctx.lineWidth = o.w ?? 4; ctx.lineCap = 'round'; strokeIn(ctx, pts, u); ctx.restore(); }
// the machine as a ring (scenario-motion: never a robot face for "the machine" as an idea): cyan rings that pulse inward
export function ring(ctx, t, x, y, r, a = 1, o = {}) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rad(ctx, x, y, r * 2.4, [[0, rgba(CYAN.body, .35)], [1, rgba(CYAN.body, 0)]]); ctx.fillRect(x - r * 2.4, y - r * 2.4, r * 4.8, r * 4.8);
  for (let k = 0; k < 3; k++) { const p = ((t * .35 + k / 3) % 1), rr = r * (1.25 - .55 * p); ctx.strokeStyle = rgba(CYAN.core, (1 - p) * .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.stroke(); }
  ctx.fillStyle = rad(ctx, x, y, r * .55, [[0, CYAN.core], [1, rgba(CYAN.body, .2)]]); ctx.beginPath(); ctx.arc(x, y, r * .55, 0, 7); ctx.fill();
  ctx.restore();
}
export function coin(ctx, x, y, r, t) { const sq = Math.abs(Math.cos(t * 1.3)) * .85 + .15; ctx.save(); ctx.translate(x, y); ctx.scale(sq, 1); ctx.fillStyle = rad(ctx, -r * .3, -r * .3, r * 1.4, [[0, GOLD.core], [.5, GOLD.body], [1, GOLD.mid]]); ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.strokeStyle = rgba(GOLD.deep, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r * .72, 0, 7); ctx.stroke(); ctx.restore(); E.halo(ctx, x, y, r * 3, .35); }

// ---------------------------------------------------------------- carriers
// portal: push through a window rect of A; B lives inside it (identity at u = 1). drawA/drawB draw full shots (card()/scr()).
export function portal(ctx, u, win, drawA, drawB, o = {}) {
  const e = quartIO(clamp(u)), cx = win[0] + win[2] / 2, cy = win[1] + win[3] / 2, zEnd = Math.max(W / win[2], H / win[3]) * 1.04, z = Math.pow(zEnd, e);
  const ox = lerp(cx, W / 2, e), oy = lerp(cy, H / 2, e), mA = { k: z, e: ox - cx * z, f: oy - cy * z };
  outer(mA, () => drawA(ctx));
  const kb0 = Math.max(win[2] / W, win[3] / H), kb = Math.exp(lerp(Math.log(kb0), Math.log(1 / zEnd), e)) * z;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(mA.e + win[0] * z, mA.f + win[1] * z, win[2] * z, win[3] * z); ctx.clip();
  outer({ k: kb, e: ox - W / 2 * kb, f: oy - H / 2 * kb }, () => drawB(ctx)); ctx.restore();
  if (o.frame) outer(mA, () => o.frame(ctx));
}
// iris: B opens inside a growing circle that starts as a round object of A at (cx, cy, r0); A pushes gently toward it
export function iris(ctx, u, [cx, cy, r0], drawA, drawB, o = {}) {
  const e = quartIO(clamp(u)), R = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) * 1.02, r = Math.exp(lerp(Math.log(Math.max(4, r0)), Math.log(R), e));
  const zA = 1 + e * (o.pushA ?? .5); outer({ k: zA, e: cx - cx * zA, f: cy - cy * zA }, () => drawA(ctx));
  // B: starts as the full frame seen at r0/R scale centred on the shape, ends at identity
  const k = Math.exp(lerp(Math.log(clamp(r0 * 2.2 / H, .05, 1)), 0, e)), bx = lerp(cx, W / 2, e), by = lerp(cy, H / 2, e);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
  outer({ k, e: bx - W / 2 * k, f: by - H / 2 * k }, () => drawB(ctx)); ctx.restore();
  if (o.rim !== false && e < .98) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = rgba(o.rim || '#fff2c4', .9 * (1 - e)); ctx.lineWidth = 4; ctx.shadowColor = rgba('#f2b632', .9); ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.restore(); }
}
// lens sweep: a near silhouette (tree trunk + leaves / a post) passes the lens in direction dir (-1 = right→left); B behind its trailing side
export function sweep(ctx, u, drawA, drawB, o = {}) {
  const dir = o.dir ?? -1, e = sineIO(clamp(u)), bw = o.w ?? 420, x = dir < 0 ? lerp(W + bw, -bw, e) : lerp(-bw, W + bw, e);
  drawA(ctx);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); if (dir < 0) ctx.rect(x, -10, W - x + 20, H + 20); else ctx.rect(-10, -10, x + 10, H + 20); ctx.clip(); drawB(ctx); ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const col = o.col || '#141a3e';
  if (o.kind === 'post') { ctx.fillStyle = lin(ctx, x - 40, 0, x + 40, 0, [[0, col], [.5, mixHex(col, '#4a5a9a', .4)], [1, col]]); ctx.fillRect(x - 46, -20, 92, H + 40); }
  else {
    ctx.fillStyle = lin(ctx, x - bw / 2, 0, x + bw / 2, 0, [[0, col], [.45, mixHex(col, '#3a4a8a', .35)], [1, col]]);
    ctx.beginPath(); ctx.moveTo(x - bw * .32, H + 20); ctx.bezierCurveTo(x - bw * .3, H * .5, x - bw * .42, H * .25, x - bw * .5, -20); ctx.lineTo(x + bw * .5, -20); ctx.bezierCurveTo(x + bw * .4, H * .3, x + bw * .3, H * .55, x + bw * .34, H + 20); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(col, '#2f5c4a', .5); ctx.beginPath(); ctx.arc(x - bw * .2, 40, bw * .55, 0, 7); ctx.arc(x + bw * .45, 120, bw * .4, 0, 7); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- HUD: day clock + GONE counter (persistent layer, top left)
export function hud(ctx, t, st) {
  if (!st || st.a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = st.a;
  const x = 96, y = 92;
  ctx.fillStyle = rad(ctx, x + 200, y + 10, 460, [[0, rgba('#0b1440', .4)], [.6, rgba('#0b1440', .16)], [1, rgba('#0b1440', 0)]]); ctx.fillRect(x + 200 - 460, y + 10 - 460, 920, 920);
  if (st.clock) {
    const u = st.clockU ?? 1; ctx.save(); ctx.beginPath(); ctx.rect(x - 4, y - 30, 600, 40); ctx.clip();
    E.glowText(ctx, st.clock, x, y + (1 - expoOut(u)) * 34, { size: 26, weight: 600, col: P.cream, spacing: .14, glow: false }); ctx.restore();
  }
  if (st.n > 0) {
    const y2 = y + 52, u = st.nU ?? 1;
    E.glowText(ctx, 'GONE', x, y2, { size: 22, weight: 600, col: '#e7d19a', spacing: .22, glow: false });
    ctx.save(); ctx.beginPath(); ctx.rect(x + 92, y2 - 44, 70, 54); ctx.clip();
    if (u < 1 && st.n > 1) E.glowText(ctx, String(st.n - 1), x + 96, y2 + 6 - expoOut(u) * 50, { size: 46, serif: true, col: '#ffe7a8' });
    E.glowText(ctx, String(st.n), x + 96, y2 + 6 + (1 - expoOut(u)) * 50, { size: 46, serif: true, col: '#ffe7a8' });
    ctx.restore();
    if (st.line) { ctx.save(); ctx.beginPath(); ctx.rect(x + 140, y2 - 30, 900, 40); ctx.clip(); E.glowText(ctx, '· ' + st.line, x + 140, y2 + (1 - expoOut(st.lineU ?? 1)) * 34, { size: 22, weight: 600, col: P.cream, spacing: .1, glow: false }); ctx.restore(); }
  }
  ctx.restore();
}
