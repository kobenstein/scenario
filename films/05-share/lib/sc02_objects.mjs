// C2 objects for §1 (1.07a–1.13): book, envelope, song→lab band, tractor-feed listing, recipe card, paper plane, wooden box,
// the charity print, the Paine sheet. Owner C2. Static parts cached; motion per frame.
import { W, H, rgba, clamp, lin, mix, eout, eio, sm, prng, canvas, text, addGlow } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';
import { stipple, hatch as artHatch } from './art.mjs';
import { gBorder, intaglio, FOIL } from './certificate.mjs';
import { paperSheet, scribble } from './paper.mjs';
import { once, TAU } from './sc02_kit.mjs';

const fillPoly = (ctx, P) => { ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };
// map a unit square image onto a parallelogram (a, b, d = three corners: top-left, top-right, bottom-left)
export function quadImage(ctx, img, a, b, d, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.transform((b[0] - a[0]) / img.width, (b[1] - a[1]) / img.width, (d[0] - a[0]) / img.height, (d[1] - a[1]) / img.height, a[0], a[1]); ctx.drawImage(img, 0, 0); ctx.restore();
}

// ---------- a printed page (book) ----------
function pageTex(seed, w = 320, h = 440) {
  return once('page' + seed, () => {
    const [c, g] = canvas(w, h), r = prng(seed); const pg = g.createLinearGradient(0, 0, w, 0); pg.addColorStop(0, '#d9c8a4'); pg.addColorStop(.12, '#efe2c4'); pg.addColorStop(1, '#f4ead2'); g.fillStyle = pg; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(40,30,25,.42)'; for (let i = 0; i < 24; i++) { let x = 34; const y = 46 + i * 15.5, end = (i % 7 === 6) ? 160 : w - 30 - r() * 8; while (x < end) { const ww = 6 + r() * 30; g.fillRect(x, y, Math.min(ww, end - x), 4.2); x += ww + 5; } }
    stipple(c, { k: .35, g: 1, seed, mid: false, boost: 1.2 }); return c;
  });
}
// book(ctx, x, y, s, t, { flip: 0..n pages turned (fractional = mid-turn), n }) — open book seen from above-front, spine at (x, y)
export function book(ctx, x, y, s, t, o = {}) {
  const pw = 330 * s, ph = 450 * s, tilt = .26, k = Math.cos(tilt);
  const P = (u, v, z = 0) => [x + u * pw, y + (v - .5) * ph * k - z * ph * .55];   // u: -1..1 across the spread, v: 0..1 down, z lift
  // cover and page block (thickness)
  ctx.save();
  ctx.fillStyle = 'rgba(5,3,2,.55)'; ctx.filter = 'none'; fillPoly(ctx, [P(-1.08, -.02), P(1.08, -.02), P(1.1, 1.06), P(-1.1, 1.06)]); ctx.save(); ctx.translate(18 * s, 26 * s); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#5a2418'; fillPoly(ctx, [P(-1.06, -.03), P(1.06, -.03), P(1.06, 1.03), P(-1.06, 1.03)]); ctx.fill();
  ctx.fillStyle = '#c9b48a'; fillPoly(ctx, [P(-1.02, 1), P(1.02, 1), P(1.02, 1.025), P(-1.02, 1.025)]); ctx.fill();
  // the two resting pages
  quadImage(ctx, pageTex(3), P(-1, 0), P(0, 0), P(-1, 1));
  quadImage(ctx, pageTex(4), P(0, 0), P(1, 0), P(0, 1));
  // gutter shadow
  const gs = ctx.createLinearGradient(x - 40 * s, 0, x + 40 * s, 0); gs.addColorStop(0, 'rgba(40,20,10,0)'); gs.addColorStop(.5, 'rgba(40,20,10,.45)'); gs.addColorStop(1, 'rgba(40,20,10,0)'); ctx.fillStyle = gs; fillPoly(ctx, [P(-.15, 0), P(.15, 0), P(.15, 1), P(-.15, 1)]); ctx.fill();
  // turning pages: each a curved sheet from the spine whose free edge sweeps from right to left
  const n = o.n ?? 9, f = o.flip ?? 0, qs = o.qs || Array.from({ length: n }, (_, i) => clamp(f - i));
  for (let i = 0; i < qs.length; i++) {
    const q = clamp(qs[i]); if (q <= 0 || q >= 1) continue;
    const ang = q * Math.PI, ex = Math.cos(ang), ez = Math.sin(ang), bow = .18 * ez;
    const top = [], bot = []; for (let j = 0; j <= 10; j++) { const u = j / 10, cx = ex * u - bow * Math.sin(u * Math.PI) * Math.sign(ex || 1) * .3, cz = ez * u * (1 - .15 * u); top.push(P(cx, 0, cz)); bot.push(P(cx, 1, cz)); }
    const shade = .55 + .45 * Math.abs(ex);
    ctx.fillStyle = q < .5 ? `rgb(${Math.round(244 * shade)},${Math.round(234 * shade)},${Math.round(210 * shade)})` : `rgb(${Math.round(230 * shade)},${Math.round(218 * shade)},${Math.round(192 * shade)})`;
    ctx.beginPath(); top.forEach(([px, py], j) => (j ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); for (let j = bot.length - 1; j >= 0; j--) ctx.lineTo(bot[j][0], bot[j][1]); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(90,70,50,.35)'; ctx.lineWidth = 1; ctx.stroke();
    // a few print lines on the turning page (foreshortened)
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(40,30,25,.25)'; ctx.lineWidth = 3 * s; for (let l = 0; l < 12; l++) { const v = .1 + l * .065; ctx.beginPath(); const a0 = P(ex * .12, v, ez * .12), a1 = P(ex * .9, v, ez * .9); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke(); } ctx.restore();
  }
  ctx.restore();
  return { P };
}
// an envelope (seen flat, flap V and a red seal), w = width px
export function envelope(ctx, x, y, w, rot, o = {}) {
  const h = w * .62, flip = o.flip ?? 1, sx = Math.abs(flip) < .05 ? .05 : flip;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sx, 1); ctx.globalAlpha = o.a ?? 1;
  ctx.fillStyle = 'rgba(5,3,2,.35)'; ctx.fillRect(-w / 2 + 6, -h / 2 + 9, w, h);
  const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, flip > 0 ? '#f6ecd6' : '#d8c8a8'); g.addColorStop(1, flip > 0 ? '#e2d2b0' : '#bba98a'); ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = 'rgba(90,70,50,.5)'; ctx.lineWidth = Math.max(1, w * .008); ctx.strokeRect(-w / 2, -h / 2, w, h);
  if (flip > 0) { ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, h * .08); ctx.lineTo(w / 2, -h / 2); ctx.stroke(); ctx.fillStyle = '#8e2f2a'; ctx.beginPath(); ctx.arc(0, h * .08, w * .065, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,200,180,.35)'; ctx.beginPath(); ctx.arc(-w * .015, h * .065, w * .025, 0, TAU); ctx.fill(); }
  else { scribble(ctx, -w * .3, h * .05, w * .5, w * .05, { seed: 3, ink: 'rgba(40,30,30,.7)', lw: Math.max(1, w * .01) }); }
  ctx.restore();
}

// ---------- 1.07b: a song sheet whose staff lines flow into a lab notebook's grid ----------
export const BAND = { w: 4400, h: 470 };
export function songLabBand() {
  return once('songlab', () => {
    const { w, h } = BAND, [c, g] = canvas(w, h), r = prng(12);
    const pg = g.createLinearGradient(0, 0, 0, h); pg.addColorStop(0, '#f1e6cb'); pg.addColorStop(1, '#e3d4b2'); g.fillStyle = pg; g.fillRect(0, 0, w, h);
    const ink = 'rgba(35,28,30,.8)', staffY = [92, 212, 332], gap = 13, x0 = 60, xm0 = 1500, xm1 = 2150;
    // song sheet: title scribble, three staves with notes
    scribble(g, 80, 48, 300, 16, { seed: 4, ink: 'rgba(35,28,30,.75)', lw: 2.2 });
    for (const sy of staffY) for (let l = 0; l < 5; l++) {
      g.strokeStyle = ink; g.lineWidth = 1.4; g.beginPath();
      for (let x = x0; x <= xm1; x += 10) {
        // past xm0 the five lines of each staff spread toward evenly spaced grid rows (14 px pitch → the notebook's 26 px grid)
        const q = eio(clamp((x - xm0) / (xm1 - xm0))), yy = mix(sy + l * gap, 40 + (staffY.indexOf(sy) * 5 + l) * 26 + 6, q);
        x === x0 ? g.moveTo(x, yy) : g.lineTo(x, yy);
      }
      g.stroke();
    }
    // clefs, bar lines and notes on the song part
    for (const sy of staffY) {
      g.fillStyle = ink; g.strokeStyle = ink; g.lineWidth = 1.6; g.font = '64px "DejaVu Sans"'; try { g.fillText('\u{1D11E}', 66, sy + 50); } catch { }
      for (let x = 160; x < xm0 - 40; x += 34 + r() * 26) {
        if (r() < .12) { g.beginPath(); g.moveTo(x, sy); g.lineTo(x, sy + 4 * gap); g.stroke(); continue; }
        const ny = sy + Math.round(r() * 9) * gap / 2 - gap / 2; g.beginPath(); g.ellipse(x, ny, 7, 5.2, -.4, 0, TAU); r() < .25 ? g.stroke() : g.fill();
        g.beginPath(); g.moveTo(x + 6.5, ny); g.lineTo(x + 6.5, ny - 40); g.stroke(); if (r() < .3) { g.beginPath(); g.moveTo(x + 6.5, ny - 40); g.quadraticCurveTo(x + 20, ny - 30, x + 16, ny - 18); g.stroke(); }
      }
    }
    // lab notebook: squared grid (blue), margin line (red), handwritten header and column of numbers
    g.strokeStyle = 'rgba(70,110,160,.32)'; g.lineWidth = 1;
    for (let x = xm1; x < w; x += 26) { const a = clamp((x - xm1) / 200); g.globalAlpha = a; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    g.globalAlpha = 1; for (let y = 46; y < h; y += 26) { g.beginPath(); g.moveTo(xm1 - 40, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = 'rgba(170,50,40,.55)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(xm1 + 120, 0); g.lineTo(xm1 + 120, h); g.stroke();
    scribble(g, xm1 + 150, 36, 260, 14, { seed: 8, ink: 'rgba(30,40,80,.75)', lw: 2 });
    for (let i = 0; i < 12; i++) scribble(g, xm1 + 140, 84 + i * 26, 70 + r() * 30, 9, { seed: 20 + i, ink: 'rgba(30,40,80,.6)', lw: 1.4 });
    // axes for the data series (drawn live)
    g.strokeStyle = 'rgba(30,40,80,.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(xm1 + 420, 60); g.lineTo(xm1 + 420, 410); g.lineTo(xm1 + 1300, 410); g.stroke();
    stipple(c, { k: .3, g: 1, seed: 6, mid: false, boost: 1.2 });
    return c;
  });
}
// the hand-plotted data series on the notebook (band coordinates), u 0..1 drawn
export function dataSeries(ctx, ox, oy, u, t) {
  const xm1 = 2150, r = prng(31), pts = []; for (let i = 0; i <= 16; i++) { const q = i / 16; pts.push([ox + xm1 + 440 + q * 840, oy + 400 - (40 + 300 * (1 - Math.exp(-q * 2.6)) + (r() - .5) * 26)]); }
  const n = u * (pts.length - 1); ctx.save(); ctx.strokeStyle = 'rgba(30,40,80,.85)'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); for (let i = 0; i <= Math.floor(n); i++) (i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]));
  const fi = Math.floor(n), fr = n - fi; if (fi < pts.length - 1 && fr > 0) ctx.lineTo(mix(pts[fi][0], pts[fi + 1][0], fr), mix(pts[fi][1], pts[fi + 1][1], fr)); ctx.stroke();
  for (let i = 0; i <= Math.floor(n); i++) { const [x, y] = pts[i]; ctx.beginPath(); ctx.moveTo(x - 6, y - 6); ctx.lineTo(x + 6, y + 6); ctx.moveTo(x + 6, y - 6); ctx.lineTo(x - 6, y + 6); ctx.stroke(); }
  ctx.restore();
  const e = pts[Math.min(pts.length - 1, Math.ceil(n))]; return e;
}

// ---------- 1.07c: tractor-feed listing ----------
const CODE = ['function readPage(book, n) {', '  const page = book.pages[n];', '  if (!page) return null;', '  return page.lines.map(clean);', '}', '',
  'function clean(line) {', '  return line.trim();', '}', '', 'for (const book of shelf) {', '  for (let n = 0; n < book.length; n++) {', '    notes.push(readPage(book, n));', '  }', '}', '',
  'export function count(words) {', '  let total = 0;', '  for (const w of words) total += 1;', '  return total;', '}'];
export const LISTING = { w: 980, line: 34, top: 60, x: 110, hot: 12 };
export function listingSheet() {
  return once('listing', () => {
    const { w, line, top } = LISTING, h = top * 2 + CODE.length * line * 2, [c, g] = canvas(w, h);
    g.fillStyle = '#f2ead6'; g.fillRect(0, 0, w, h);
    // faint green-bar bands, sprocket strips with holes, perforated page breaks
    g.fillStyle = 'rgba(120,160,120,.12)'; for (let y = top; y < h; y += line * 4) g.fillRect(70, y - 6, w - 140, line * 2);
    g.fillStyle = 'rgba(160,140,110,.2)'; g.fillRect(0, 0, 58, h); g.fillRect(w - 58, 0, 58, h);
    for (let y = 18; y < h; y += 36) for (const x of [29, w - 29]) { g.fillStyle = '#2b1f18'; g.beginPath(); g.arc(x, y, 8, 0, TAU); g.fill(); g.strokeStyle = 'rgba(255,250,235,.35)'; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y, 8, Math.PI * .9, Math.PI * 1.6); g.stroke(); }
    g.strokeStyle = 'rgba(80,60,40,.4)'; g.setLineDash([3, 5]); for (const x of [58, w - 58]) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } g.setLineDash([]);
    for (let k = 0; k < 2; k++) CODE.forEach((s, i) => text(g, s, LISTING.x, top + (k * CODE.length + i) * line + 24, { size: 24, font: 'JetBrains Mono', color: 'rgba(38,34,44,.88)' }));
    stipple(c, { k: .28, g: 1, seed: 14, mid: false, boost: 1.1 });
    return c;
  });
}
export const codeLine = (i) => CODE[i % CODE.length];

// ---------- 1.08: the grandmother's recipe card ----------
export function recipeCard() {
  return once('recipe', () => {
    const w = 600, h = 400, [c, g] = canvas(w + 60, h + 60); g.translate(30, 30);
    paperSheet(g, 0, 0, w, h, { seed: 41, tone: '#f1e3c2', shadow: false, light: [w * .3, -h * .2] });
    g.strokeStyle = 'rgba(170,50,40,.75)'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(14, 70); g.lineTo(w - 14, 70); g.stroke();
    g.strokeStyle = 'rgba(80,110,160,.35)'; g.lineWidth = 1.2; for (let y = 104; y < h - 10; y += 30) { g.beginPath(); g.moveTo(14, y); g.lineTo(w - 14, y); g.stroke(); }
    scribble(g, 40, 50, 240, 22, { seed: 61, ink: 'rgba(40,30,60,.85)', lw: 2.6 });
    for (let i = 0; i < 9; i++) scribble(g, i < 4 ? 50 : 40, 96 + i * 30, i < 4 ? 160 + (i * 37) % 90 : 420 + (i * 53) % 110, 13, { seed: 70 + i, ink: 'rgba(40,30,60,.72)', lw: 1.9 });
    // stains: a cup ring and a butter spot (it was used for years)
    g.strokeStyle = 'rgba(120,70,30,.22)'; g.lineWidth = 7; g.beginPath(); g.arc(w * .78, h * .66, 54, .3, 5.8); g.stroke();
    const sg = g.createRadialGradient(w * .2, h * .8, 0, w * .2, h * .8, 40); sg.addColorStop(0, 'rgba(190,140,60,.28)'); sg.addColorStop(1, 'rgba(190,140,60,0)'); g.fillStyle = sg; g.fillRect(0, 0, w, h);
    // worn corner and a crease
    g.strokeStyle = 'rgba(90,70,50,.25)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(w * .62, 0); g.quadraticCurveTo(w * .6, h * .5, w * .66, h); g.stroke();
    return c;
  });
}

// ---------- 1.09: the paper plane (fold 0 = flat strip … 1 = plane) ----------
export function plane(ctx, x, y, s, rot, o = {}) {
  const f = clamp(o.fold ?? 1), bank = o.bank ?? 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = o.a ?? 1;
  // flat strip (the answer peeled off the display): 160 × 60 with text lines
  const strip = [[-80, -30], [80, -30], [80, 30], [-80, 30]];
  // plane: nose at +x; two wings and the keel, in plane units
  const wingT = [[90, 0], [-70, -46 * (1 - .4 * bank)], [-56, 0]], wingB = [[90, 0], [-70, 40 * (1 + .4 * bank)], [-56, 0]], keel = [[90, 0], [-64, 14], [-56, 0]];
  const L = (A, B) => A.map((p, i) => [mix(p[0], B[i % B.length][0], f), mix(p[1], B[i % B.length][1], f)]);
  const shadeA = (k) => `rgb(${Math.round(mix(239, 200, k))},${Math.round(mix(228, 186, k))},${Math.round(mix(204, 160, k))})`;
  if (f < 1) { ctx.globalAlpha = (o.a ?? 1) * (1 - f); ctx.fillStyle = '#efe4cc'; fillPoly(ctx, strip); ctx.fill(); ctx.strokeStyle = 'rgba(40,40,60,.55)'; ctx.lineWidth = 3; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-66, -14 + i * 14); ctx.lineTo(i === 2 ? 20 : 66, -14 + i * 14); ctx.stroke(); } ctx.globalAlpha = o.a ?? 1; }
  if (f > 0) {
    ctx.globalAlpha = (o.a ?? 1) * clamp(f * 1.6);
    ctx.fillStyle = shadeA(.6); fillPoly(ctx, L(strip.slice(0, 3), keel)); ctx.fill();
    ctx.fillStyle = shadeA(.1 + .3 * bank); fillPoly(ctx, L(strip.slice(0, 3), wingT)); ctx.fill();
    ctx.fillStyle = shadeA(.35 - .2 * bank); fillPoly(ctx, L([strip[0], strip[1], strip[3]], wingB)); ctx.fill();
    ctx.strokeStyle = 'rgba(90,70,50,.45)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(90 * f - 80 * (1 - f), 0); ctx.lineTo(-56, 0); ctx.stroke();
    if (o.light) { ctx.strokeStyle = rgba(o.light, .6); ctx.lineWidth = 2; ctx.beginPath(); const P = L(strip.slice(0, 3), wingT); ctx.moveTo(P[0][0], P[0][1]); ctx.lineTo(P[1][0], P[1][1]); ctx.stroke(); }
  }
  ctx.restore();
}

// ---------- 1.12: the old wooden box (3D corners, lid on a hinge) ----------
function woodTex(seed, w, h, dark) {
  return once('wood' + seed + w + h, () => {
    const [c, g] = canvas(w, h), r = prng(seed); g.fillStyle = dark ? '#3a2214' : '#6a3e22'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { const y = r() * h, a = .05 + r() * .12; g.strokeStyle = rgba(r() < .5 ? '#2a160a' : '#9a6638', a); g.lineWidth = 1 + r() * 3; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= w; x += 20) g.lineTo(x, y + Math.sin(x * .01 + i) * 4 + Math.sin(x * .037 + i * 3) * 2); g.stroke(); }
    stipple(c, { k: .45, g: 1, seed, mid: false, boost: 1.3 }); return c;
  });
}
// woodBox(ctx, cx, cy, s, t, { open 0..1 (lid angle 0 → 110°), glow 0..1 (light from inside), contents (true) }) → { lidFront: [x, y], mouth: [x, y] }
export function woodBox(ctx, cx, cy, s, t, o = {}) {
  const bw = 520, bd = 300, bh = 220, lt = 34, f = 1500, camY = 520, camZ = 900;
  const op = clamp(o.open ?? 0), ang = op * 1.95;
  // world: x right, y up, z away; box base centred at origin; camera above-front looking down
  const pitch = .5, cp = Math.cos(pitch), sp = Math.sin(pitch);
  const P = (X, Y, Z) => { const y1 = Y - camY, z1 = Z + camZ; const y2 = y1 * cp + z1 * sp, z2 = -y1 * sp + z1 * cp; return [cx + f * X / z2 * s, cy - f * y2 / z2 * s]; };
  const x0 = -bw / 2, x1 = bw / 2, z0 = -bd / 2, z1 = bd / 2;
  // shadow
  ctx.save(); const sc = P(0, 0, 0); const sg = ctx.createRadialGradient(sc[0], sc[1] + 20 * s, 0, sc[0], sc[1] + 20 * s, 420 * s); sg.addColorStop(0, 'rgba(0,0,0,.55)'); sg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sg; ctx.save(); ctx.translate(sc[0], sc[1] + 20 * s); ctx.scale(1, .45); ctx.translate(-sc[0], -sc[1] - 20 * s); ctx.fillRect(sc[0] - 450 * s, sc[1] - 430 * s, 900 * s, 900 * s); ctx.restore(); ctx.restore();
  // a face given its four corners (P0-P1 one edge, P3-P2 the opposite edge): clipped to the true quad, the texture mapped from the wider edge
  const face4 = (P0, P1, P2, P3, tex, shade) => { ctx.save(); ctx.beginPath(); ctx.moveTo(...P0); ctx.lineTo(...P1); ctx.lineTo(...P2); ctx.lineTo(...P3); ctx.closePath(); ctx.clip();
    if (Math.hypot(P1[0] - P0[0], P1[1] - P0[1]) >= Math.hypot(P2[0] - P3[0], P2[1] - P3[1])) quadImage(ctx, tex, P0, P1, P3); else quadImage(ctx, tex, P3, P2, P0);
    if (shade) { ctx.fillStyle = `rgba(0,0,0,${shade})`; ctx.fillRect(-W, -H, W * 3, H * 3); } ctx.restore(); };
  const face = (A, B, D, tex, shade, C) => face4(A, B, C || [B[0] + D[0] - A[0], B[1] + D[1] - A[1]], D, tex, shade);
  const T1 = woodTex(5, 520, 220, false), T2 = woodTex(6, 300, 220, true), TT = woodTex(7, 520, 300, false);
  // the inside (seen when open): back wall inner face, floor with the contents, warm light
  const inner = [P(x0 + 10, bh, z0 + 10), P(x1 - 10, bh, z0 + 10), P(x1 - 10, bh, z1 - 10), P(x0 + 10, bh, z1 - 10)];
  // front face, right side face (visible from the camera at the right-front? camera is centred: only the front and top)
  face(P(x0, bh, z0), P(x1, bh, z0), P(x0, 0, z0), T1, .05, P(x1, 0, z0));
  // brass corner fittings and keyhole plate on the front
  ctx.fillStyle = '#b8863a'; for (const X of [x0, x1 - 30]) { const A = P(X, bh, z0), B = P(X + 30, bh, z0), D = P(X, bh - 30, z0); ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(B[0] + D[0] - A[0], B[1] + D[1] - A[1]); ctx.lineTo(...D); ctx.closePath(); ctx.fill(); }
  // top rim / opening
  if (op > 0) {
    const outer = [P(x0, bh, z0), P(x1, bh, z0), P(x1, bh, z1), P(x0, bh, z1)]; ctx.fillStyle = '#7a4a2a'; ctx.beginPath(); outer.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.beginPath(); inner.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.fillStyle = '#1a0e08'; ctx.fill(); ctx.clip();
    if (o.contents !== false) { // contents: a recipe card, letters, a photo, lying at the top of the stack
      const card = (X, Z, w, d, col, rot) => { const c0 = P(X, bh - 6, Z), c1 = P(X + w, bh - 6, Z + rot), c3 = P(X - rot * .3, bh - 6, Z + d); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(...c0); ctx.lineTo(...c1); ctx.lineTo(c1[0] + c3[0] - c0[0], c1[1] + c3[1] - c0[1]); ctx.lineTo(...c3); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(60,40,20,.4)'; ctx.lineWidth = 1; ctx.stroke(); };
      card(x0 + 30, z0 + 30, 200, 140, '#e9dcc0', 10); card(x0 + 230, z0 + 40, 160, 110, '#d8c49e', -14); card(x0 + 120, z0 + 120, 220, 150, '#f1e3c2', 6); card(x1 - 170, z0 + 110, 140, 160, '#6b5a4a', -8);
      const rc = P(x0 + 160, bh - 6, z0 + 150), re = P(x0 + 300, bh - 6, z0 + 150); ctx.strokeStyle = 'rgba(170,50,40,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...rc); ctx.lineTo(...re); ctx.stroke();
    }
    const gl = clamp(o.glow ?? op); if (gl > 0) { const m = P(0, bh, 0); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, m[0], m[1], 380 * s, .55 * gl, '#ffb35c', '#fff1d6'); }
    ctx.restore();
  }
  // the lid: hinged at the back top edge (z1), rotating up and back
  const hingeY = bh, hingeZ = z1, ca = Math.cos(ang), sa = Math.sin(ang);
  // lid corners: closed lid spans z from z1 (hinge) to z0 (front), thickness lt upward
  const lidPt = (X, front, up) => { const dz = front ? bd : 0, dy = up ? lt : 0; return P(X, hingeY + (dz * sa + dy * ca), hingeZ - dz * ca + dy * sa); };
  const a0 = lidPt(x0, true, true), a1 = lidPt(x1, true, true), b0 = lidPt(x0, false, true), b1 = lidPt(x1, false, true), f0 = lidPt(x0, true, false), f1 = lidPt(x1, true, false);
  // top face of the lid (or its underside when it has turned past vertical)
  if (ang < Math.PI / 2) { face(b0, b1, a0, TT, .0 + ang * .1, a1); face(a0, a1, f0, woodTex(8, 520, 34, true), .1, f1); }
  else { // the underside faces the camera: lit warm from the box
    const us0 = lidPt(x0, true, false), us1 = lidPt(x1, true, false), ub0 = lidPt(x0, false, false), ub1 = lidPt(x1, false, false); face(ub0, ub1, us0, woodTex(9, 520, 300, true), .15, us1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .35 * clamp(o.glow ?? op); ctx.fillStyle = '#ffb35c'; ctx.beginPath(); ctx.moveTo(...ub0); ctx.lineTo(...lidPt(x1, false, false)); ctx.lineTo(...us1); ctx.lineTo(...us0); ctx.closePath(); ctx.fill(); ctx.restore();
    face(us0, us1, a0, woodTex(8, 520, 34, true), .1, a1);
  }
  // edge highlight
  ctx.strokeStyle = 'rgba(255,214,150,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...P(x0, bh, z0)); ctx.lineTo(...P(x1, bh, z0)); ctx.stroke();
  return { lidFront: [(a0[0] + a1[0]) / 2, (a0[1] + a1[1]) / 2], mouth: P(0, bh, 0), P };
}

// ---------- 1.11: the charity print (intaglio: a coin falling into a held-out tin cup) ----------
export function charityPrint(w = 760, h = 540) {
  return once('charity', () => {
    const [c, g] = canvas(w, h);
    g.fillStyle = '#efe4cc'; g.fillRect(0, 0, w, h);
    const ink = '#2a2230';
    // the cup: a dented tin cylinder held out by a hand from the lower right
    const cx = w * .45, cy = h * .62, rw = 92, rh = 26, ch = 150;
    g.save(); g.beginPath(); g.moveTo(cx - rw, cy - ch / 2); g.lineTo(cx - rw * .88, cy + ch / 2); g.ellipse(cx, cy + ch / 2, rw * .88, rh * .9, 0, Math.PI, 0, true); g.lineTo(cx + rw, cy - ch / 2); g.ellipse(cx, cy - ch / 2, rw, rh, 0, 0, Math.PI, false); g.closePath(); g.clip();
    intaglio(g, cx - rw - 4, cy - ch / 2 - rh, rw * 2 + 8, ch + rh * 2, { gap: 4.4, angle: 1.45, col: ink, tone: (x) => .25 + .7 * Math.pow(Math.abs(x - rw - 20) / rw, 1.6) });
    g.restore();
    g.strokeStyle = ink; g.lineWidth = 2.2; g.beginPath(); g.ellipse(cx, cy - ch / 2, rw, rh, 0, 0, TAU); g.stroke(); g.lineWidth = 1.2; g.beginPath(); g.ellipse(cx, cy - ch / 2 + 6, rw * .94, rh * .8, 0, 0, TAU); g.stroke();
    g.fillStyle = 'rgba(42,34,48,.85)'; g.beginPath(); g.ellipse(cx, cy - ch / 2 + 4, rw * .9, rh * .7, 0, 0, TAU); g.fill();
    // the hand holding it out: forearm and sleeve from the right, four fingers wrapped round the cup's front, the thumb on the rim
    const hx = cx + rw, fill = (path, tone, ang) => { g.save(); g.fillStyle = '#efe4cc'; g.fill(path); g.clip(path); intaglio(g, cx - 40, cy - 200, 600, 400, { gap: 4.2, angle: ang, col: ink, tone }); g.restore(); g.strokeStyle = ink; g.lineWidth = 1.8; g.stroke(path); };
    const arm = new Path2D(); arm.moveTo(hx + 30, cy - 44); arm.bezierCurveTo(hx + 120, cy - 60, hx + 220, cy - 48, w + 20, cy - 30); arm.lineTo(w + 20, cy + 70); arm.bezierCurveTo(hx + 210, cy + 66, hx + 110, cy + 60, hx + 26, cy + 46); arm.closePath();
    fill(arm, (x, y) => .2 + .6 * clamp((y - cy + 10) / 70), -.15);
    const cuff = new Path2D(); cuff.moveTo(hx + 190, cy - 52); cuff.lineTo(w + 20, cy - 34); cuff.lineTo(w + 20, cy + 74); cuff.lineTo(hx + 190, cy + 66); cuff.closePath(); fill(cuff, () => .75, -.15);
    const palm = new Path2D(); palm.ellipse(hx + 34, cy + 2, 44, 52, 0, 0, TAU); fill(palm, (x, y) => .3 + .5 * clamp((y - cy + 20) / 60), -.4);
    for (let i = 0; i < 4; i++) { const y0 = cy - 36 + i * 23, f = new Path2D(), x1 = hx - 4, x0 = hx - 58 + i * 5, r = 10.5 - i * .6;
      f.moveTo(x1, y0 - r); f.lineTo(x0 + r, y0 - r + 2); f.arc(x0 + r, y0 + 2, r, -Math.PI / 2, Math.PI / 2, true); f.lineTo(x1, y0 + r); f.closePath();
      fill(f, (x, y) => .18 + .55 * clamp((y - y0 + 4) / 16), 1.45);
      g.strokeStyle = rgba(ink, .55); g.lineWidth = 1.1; g.beginPath(); g.moveTo(x0 + 26, y0 - r + 3); g.quadraticCurveTo(x0 + 22, y0 + 2, x0 + 26, y0 + r - 2); g.stroke(); }
    const th = new Path2D(); th.moveTo(hx + 18, cy - 60); th.quadraticCurveTo(hx - 10, cy - ch / 2 - 30, hx - 44, cy - ch / 2 - 14); th.arc(hx - 44, cy - ch / 2 - 4, 10, -Math.PI / 2, Math.PI / 2, true); th.quadraticCurveTo(hx, cy - ch / 2 + 2, hx + 26, cy - 40); th.closePath();
    fill(th, (x, y) => .2 + .5 * clamp((y - cy + 90) / 40), .4);
    // ground line and a few engraved rays behind (the old charity-poster look)
    g.strokeStyle = rgba(ink, .25); g.lineWidth = 1; for (let i = 0; i < 40; i++) { const a = -Math.PI * (.08 + .84 * i / 40); g.beginPath(); g.moveTo(cx, cy - ch / 2); g.lineTo(cx + Math.cos(a) * 900, cy - ch / 2 + Math.sin(a) * 900); g.stroke(); }
    gBorder(g, 10, 10, w - 20, h - 20, { band: 18, lines: 5, waves: 120, col: ink, a: .55, w: .7, radius: 6 });
    stipple(c, { k: .3, g: 1, seed: 16, mid: false, boost: 1.2 });
    return c;
  });
}
