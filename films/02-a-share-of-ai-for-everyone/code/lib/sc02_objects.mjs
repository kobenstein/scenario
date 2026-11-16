// C2 objects for §1 (1.07a–1.13): book, envelope, song→lab band, tractor-feed listing, recipe card, paper plane, the inheritance print,
// the charity print, the Paine sheet. Owner C2. Static parts cached; motion per frame.
import { W, H, rgba, clamp, lin, mix, eout, eio, sm, prng, canvas, text, addGlow } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';
import { stipple, hatch as artHatch, vnoise, fbm } from './art.mjs';
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

// ---------- 1.12: the inheritance print (the next plate of the charity print's book) ----------
// An heirloom blanket chest seen slightly from above, engraved like charityPrint() (same paper, ink, line gap and guilloche border),
// full of what all of us made and pass on: books, letters tied with string, sheet music, a recipe card, a fan-fold code listing.
// Drawn in parallel projection like an engraver's vignette, so every face is a parallelogram: each face is a hatched texture in
// object space (cached once), mapped with an affine transform; the lid re-maps its faces per frame (an animated engraving).
//   inheritancePrint(ctx, t, o)  draws at the current transform in print units (0..760 × 0..540, like charityPrint's canvas)
//     o: { open 0..1 (the lid swings 0 → 93°), light 0..1 (beams, rays and the warm glow), seam 0..1 (light leaking at the
//          closed lid), draft 0..1 (the loose letter on top lifts in the warm air), motes 0..1 (dust drifting in the beams) }
//          base (true: draw the paper and engraved ground; false when the caller baked inheritanceBase() into its own sheet) }
//     → { mouth: [x, y] (the glowing opening), lidFront: [x, y] (middle of the lid's front edge), P(X, Y, Z) → [x, y] }
//   inheritanceBase()          the static paper + engraved ground + border (cached canvas, print units × 2) to bake into a sheet
//   IPRINT = { w, h, mouth }   print size and the glowing opening in print units
export const IPRINT = { w: 760, h: 540, mouth: [0, 0] };
// world: X right, Y up, Z away from us; the plinth stands on Y = 0, the carcass from by to by + bh, the lid hinges at the back top edge
const IP = { cx: 378, cy: 404, yaw: .2, pitch: .7, bw: 404, bd: 150, bh: 118, by: 17, pl: 6, wt: 8, lt: 16, ov: 6, maxA: 1.63, ink: '#2a2230', paper: '#efe4cc', res: 2 };
IP.top = IP.by + IP.bh;
const IPc = { ct: Math.cos(IP.yaw), st: Math.sin(IP.yaw), cp: Math.cos(IP.pitch), sp: Math.sin(IP.pitch) };
const ipP = (X, Y, Z) => [IP.cx + X * IPc.ct + Z * IPc.st, IP.cy - (Y * IPc.cp + (-X * IPc.st + Z * IPc.ct) * IPc.sp)];
const INTO = [-IPc.st * IPc.cp, -IPc.sp, IPc.ct * IPc.cp];   // view direction in world space: a face shows when normal · INTO < 0
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const ipPath = (g, pts) => { g.beginPath(); pts.forEach((p, i) => { const [x, y] = ipP(...p); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); };
const ipMap = (g, tex, A, B, D, a = 1) => quadImage(g, tex, ipP(...A), ipP(...B), ipP(...D), a);
// texture gap that lands at `gap` print units after the projection, for lines along a face's u axis (ipGapU) or v axis (ipGapV)
const faceVec = (A, B, D) => { const a = ipP(...A), b = ipP(...B), d = ipP(...D), lu = Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]), lv = Math.hypot(D[0] - A[0], D[1] - A[1], D[2] - A[2]); return [[(b[0] - a[0]) / lu, (b[1] - a[1]) / lu], [(d[0] - a[0]) / lv, (d[1] - a[1]) / lv]]; };
const ipGapU = (A, B, D, gap = 4.4) => { const [U, V] = faceVec(A, B, D); return gap / (Math.abs(U[0] * V[1] - U[1] * V[0]) / Math.hypot(...U)); };
const ipGapV = (A, B, D, gap = 4.4) => { const [U, V] = faceVec(A, B, D); return gap / (Math.abs(U[0] * V[1] - U[1] * V[0]) / Math.hypot(...V)); };
function ipTex(key, w, h, draw, res = 2.6) {
  return once('ip:' + key, () => { const [c, g] = canvas(Math.round(w * res), Math.round(h * res)); g.scale(c.width / w, c.height / h); g.fillStyle = IP.paper; g.fillRect(0, 0, w, h); g.lineCap = 'round'; g.lineJoin = 'round'; draw(g, w, h); return c; });
}
function ipLayer(key, draw) { return once('ipL:' + key, () => { const [c, g] = canvas(IPRINT.w * IP.res, IPRINT.h * IP.res); g.scale(IP.res, IP.res); g.lineCap = 'round'; g.lineJoin = 'round'; draw(g); return c; }); }
// wood: engraved grain lines (along u, or along v with o.vertical), bent round a knot or two, swelling with tone
function ipGrain(g, x, y, w, h, o = {}) {
  const r = prng(o.seed ?? 1), k1 = r() * 9, k2 = r() * 9, vert = !!o.vertical, A = vert ? h : w, B = vert ? w : h;
  const knots = Array.from({ length: o.knots ?? 1 }, () => [A * (.15 + .7 * r()), B * (.25 + .5 * r()), 2.2 + r() * 2.6]);
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  intaglio(g, x, y, w, h, { gap: o.gap ?? 4.6, angle: vert ? Math.PI / 2 : 0, col: IP.ink, a: .92, tone: o.tone || (() => .4),
    warp: (px, py) => { const al = vert ? py : px, ac = vert ? px : py; let d = 1.1 * Math.sin(al / 27 + k1) + .45 * Math.sin(al / 7.9 + ac * .19 + k2); for (const [ka, kb, kr] of knots) { const da = (al - ka) / (kr * 3.2), db = (ac - kb) / kr, q = da * da + db * db; if (q < 7) d += Math.sign(ac - kb || 1) * kr * .9 * Math.exp(-q * .8); } return vert ? -d : d; } });
  g.restore();
}
function ipRivet(g, x, y, r = 2) {
  g.fillStyle = IP.paper; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  g.fillStyle = rgba(IP.ink, .85); g.beginPath(); g.arc(x, y, r, -.5, Math.PI * .95); g.arc(x - r * .32, y - r * .32, r * .82, Math.PI * .95, -.5, true); g.closePath(); g.fill();
  g.strokeStyle = IP.ink; g.lineWidth = .6; g.beginPath(); g.arc(x, y, r, 0, TAU); g.stroke();
}
// hatch a polygon (iron, bevels): engraved lines at angle, tone 0..1
function ipHatchPoly(g, pts, o = {}) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
  g.save(); g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fillStyle = IP.paper; g.fill(); g.clip();
  intaglio(g, x0, y0, w, h, { gap: o.gap ?? 3.4, angle: o.angle ?? 0, col: IP.ink, tone: o.tone || (() => .5) }); g.restore();
  if (o.stroke !== false) { g.strokeStyle = IP.ink; g.lineWidth = o.lw ?? 1; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.stroke(); }
}
// a raised panel in a frame: field with level grain, bevels lit at top/left and shaded at bottom/right
function ipPanel(g, x, y, w, h, o) {
  const b = o.bevel ?? 8, gh = o.gapH, gv = o.gapV;
  ipHatchPoly(g, [[x, y], [x + w, y], [x + w - b, y + b], [x + b, y + b]], { gap: gh, angle: 0, tone: () => .06, lw: .7 });
  ipHatchPoly(g, [[x, y], [x + b, y + b], [x + b, y + h - b], [x, y + h]], { gap: gv, angle: Math.PI / 2, tone: () => .18, lw: .7 });
  ipHatchPoly(g, [[x, y + h], [x + b, y + h - b], [x + w - b, y + h - b], [x + w, y + h]], { gap: gh, angle: 0, tone: () => .72, lw: .7 });
  ipHatchPoly(g, [[x + w, y], [x + w, y + h], [x + w - b, y + h - b], [x + w - b, y + b]], { gap: gv, angle: Math.PI / 2, tone: () => .58, lw: .7 });
  ipGrain(g, x + b, y + b, w - 2 * b, h - 2 * b, { seed: o.seed, gap: gh, knots: 1, tone: (px, py) => o.tone + .1 * py / (h - 2 * b) });
  g.strokeStyle = IP.ink; g.lineWidth = 1.1; g.strokeRect(x + b, y + b, w - 2 * b, h - 2 * b); g.lineWidth = 1.3; g.strokeRect(x, y, w, h);
}
// frame-and-panel carcass side: rails (level grain), stiles (upright grain), n raised panels
function ipFramed(g, w, h, o) {
  const s = o.stile, rt = o.rail, rb = o.railB, n = o.n, mid = o.mid ?? 0, T = o.tone, gh = o.gapH, gv = o.gapV;
  ipGrain(g, 0, 0, w, rt, { seed: o.seed, gap: gh, knots: 1, tone: (px, py) => T + .08 + .16 * Math.exp(-(rt - py) / 3) * 0 });
  ipGrain(g, 0, h - rb, w, rb, { seed: o.seed + 1, gap: gh, knots: 1, tone: (px, py) => T + .14 });
  const pw = (w - 2 * s - (n - 1) * mid) / n, stiles = [[0, s], [w - s, s]]; for (let i = 1; i < n; i++) stiles.push([s + i * pw + (i - 1) * mid, mid]);
  stiles.forEach(([sx, sw], i) => ipGrain(g, sx, rt, sw, h - rt - rb, { seed: o.seed + 2 + i, gap: gv, vertical: true, knots: 0, tone: () => T + .06 }));
  for (let i = 0; i < n; i++) ipPanel(g, s + i * (pw + mid), rt, pw, h - rt - rb, { seed: o.seed + 7 + i, gapH: gh, gapV: gv, tone: T });
  // the rails' joint lines and a shadow under the top rail's edge
  g.strokeStyle = IP.ink; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, rt); g.lineTo(w, rt); g.moveTo(0, h - rb); g.lineTo(w, h - rb); g.stroke();
}
// a forged corner bracket (an L of iron with spear tips), corner at (x, y), arms along +dx and +dy
function ipBracket(g, x, y, dx, dy, L = 30, wd = 9) {
  const P = (u, v) => [x + u * dx, y + v * dy], tip = (u0, v0, u1, v1) => [P(u0, v0), P(u1, v1)];
  const pts = [P(0, 0), P(L, 0), P(L + 6, wd / 2), P(L, wd), P(wd, wd), P(wd, L), P(wd / 2, L + 6), P(0, L)];
  ipHatchPoly(g, pts, { gap: 2.6, angle: .8, tone: () => .62, lw: 1 });
  ipRivet(g, ...P(wd / 2, wd / 2), 1.8); ipRivet(g, ...P(L - 4, wd / 2), 1.6); ipRivet(g, ...P(wd / 2, L - 4), 1.6); void tip;
}
// ---- the faces (object space) ----
const L_W = () => IP.bw + 2 * IP.ov, L_D = () => IP.bd + IP.ov;
const FRONT = () => [[-IP.bw / 2, IP.top, -IP.bd / 2], [IP.bw / 2, IP.top, -IP.bd / 2], [-IP.bw / 2, IP.by, -IP.bd / 2]];
const END = () => [[IP.bw / 2, IP.top, -IP.bd / 2], [IP.bw / 2, IP.top, IP.bd / 2], [IP.bw / 2, IP.by, -IP.bd / 2]];
const texFront = () => ipTex('front', IP.bw, IP.bh, (g, w, h) => {
  ipFramed(g, w, h, { seed: 11, stile: 24, rail: 20, railB: 22, n: 3, mid: 20, tone: .34, gapH: ipGapU(...FRONT()), gapV: ipGapV(...FRONT()) });
  ipBracket(g, 0, 0, 1, 1); ipBracket(g, w, 0, -1, 1); ipBracket(g, 0, h, 1, -1, 24); ipBracket(g, w, h, -1, -1, 24);
  g.strokeStyle = IP.ink; g.lineWidth = 1.9; g.strokeRect(0, 0, w, h);
});
const texEnd = () => ipTex('end', IP.bd, IP.bh, (g, w, h) => {
  ipFramed(g, w, h, { seed: 21, stile: 20, rail: 20, railB: 22, n: 1, tone: .5, gapH: ipGapU(...END()) * .8, gapV: ipGapV(...END()) });
  ipBracket(g, 0, 0, 1, 1); ipBracket(g, 0, h, 1, -1, 24);
  // the iron handle: a plate with two eyes and a hanging bail
  const hx = w / 2; ipHatchPoly(g, [[hx - 24, 40], [hx + 24, 40], [hx + 24, 50], [hx - 24, 50]], { gap: 2.4, angle: 0, tone: (px, py) => .35 + .5 * (py - 40) / 10 }); ipRivet(g, hx - 19, 45, 1.6); ipRivet(g, hx + 19, 45, 1.6);
  g.strokeStyle = IP.ink; g.lineWidth = 3.6; g.beginPath(); g.moveTo(hx - 13, 47); g.bezierCurveTo(hx - 14, 68, hx + 14, 68, hx + 13, 47); g.stroke();
  g.strokeStyle = IP.paper; g.lineWidth = 1; g.beginPath(); g.moveTo(hx - 12, 49); g.bezierCurveTo(hx - 12.5, 64, hx + 12.5, 64, hx + 12, 49); g.stroke();
  g.strokeStyle = IP.ink; g.lineWidth = 1.7; g.strokeRect(0, 0, w, h);
});
// the plinth: a moulded base on bracket feet (the arch between the feet is cut out, the ground shows through)
const plinthTex = (key, w, seed, gap) => ipTex(key, w, IP.by, (g, ww, h) => {
  ipGrain(g, 0, 0, ww, h, { seed, gap, knots: 0, tone: (px, py) => .45 + .3 * py / h });
  ipHatchPoly(g, [[0, 0], [ww, 0], [ww, 4], [0, 4]], { gap: 2.2, angle: 0, tone: () => .08, lw: .8 });   // the lit moulding
  g.strokeStyle = IP.ink; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 6); g.lineTo(ww, 6); g.stroke();
  const f = 26; g.save(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.moveTo(f, h + 1); g.bezierCurveTo(f + 2, h - 8, f + 10, h - 9, f + 18, h - 9); g.lineTo(ww - f - 18, h - 9); g.bezierCurveTo(ww - f - 10, h - 9, ww - f - 2, h - 8, ww - f, h + 1); g.closePath(); g.fill(); g.restore();
  g.strokeStyle = IP.ink; g.lineWidth = 1.4; g.beginPath(); g.moveTo(0, h); g.lineTo(f, h); g.bezierCurveTo(f + 2, h - 8, f + 10, h - 9, f + 18, h - 9); g.lineTo(ww - f - 18, h - 9); g.bezierCurveTo(ww - f - 10, h - 9, ww - f - 2, h - 8, ww - f, h); g.lineTo(ww, h); g.lineTo(ww, 0); g.lineTo(0, 0); g.closePath(); g.stroke();
});
const texLidTop = () => ipTex('lidTop', L_W(), L_D(), (g, w, h) => {
  const gap = ipGapU([0, 0, 0], [1, 0, 0], [0, 0, -1]);
  ipGrain(g, 0, 0, w, h, { seed: 31, gap, knots: 2, tone: (px, py) => .16 + .1 * py / h + .08 * px / w });
  ipHatchPoly(g, [[14, 14], [w - 14, 14], [w - 22, 22], [22, 22]], { gap, angle: 0, tone: () => .55, lw: .8 });   // the moulded field: shaded far bevel, lit near one
  g.strokeStyle = IP.ink; g.lineWidth = .9; g.strokeRect(14, 14, w - 28, h - 28); g.strokeRect(22, 22, w - 44, h - 44);
  g.lineWidth = 1.9; g.strokeRect(0, 0, w, h);
});
const texLidEdge = () => ipTex('lidEdge', L_W(), IP.lt, (g, w, h) => {   // the lid's moulded edge: lit roundel, groove, shaded cove
  ipHatchPoly(g, [[0, 0], [w, 0], [w, 5], [0, 5]], { gap: 2.4, angle: 0, tone: () => .1, stroke: false });
  ipGrain(g, 0, 5, w, h - 9, { seed: 41, gap: 3, knots: 0, tone: () => .42 });
  ipHatchPoly(g, [[0, h - 4], [w, h - 4], [w, h], [0, h]], { gap: 2, angle: 0, tone: () => .75, stroke: false });
  g.strokeStyle = IP.ink; g.lineWidth = .9; g.beginPath(); g.moveTo(0, 5); g.lineTo(w, 5); g.moveTo(0, h - 4); g.lineTo(w, h - 4); g.stroke();
  g.lineWidth = 1.4; g.strokeRect(0, 0, w, h);
});
const texLidSide = () => ipTex('lidSide', L_D(), IP.lt, (g, w, h) => { ipGrain(g, 0, 0, w, h, { seed: 43, gap: 3.2, knots: 0, tone: () => .6 }); g.strokeStyle = IP.ink; g.lineWidth = 1.4; g.strokeRect(0, 0, w, h); });
// the lid's inside (seen once it stands open): a wooden frame round a lining paper engraved like a certificate, lit from the box
const texLidIn = () => ipTex('lidIn', L_W(), L_D(), (g, w, h) => {
  ipGrain(g, 0, 0, w, h, { seed: 51, gap: 4.8, knots: 2, tone: (px, py) => .62 - .22 * py / h });
  const f = 16; g.save(); g.beginPath(); g.rect(f, f, w - 2 * f, h - 2 * f); g.fillStyle = IP.paper; g.fill(); g.clip();
  intaglio(g, f, f, w - 2 * f, h - 2 * f, { gap: 4.6, angle: 0, col: IP.ink, warp: (px, py) => .5 * Math.sin(px / 23 + py / 31), tone: (px, py) => .1 + .3 * (1 - py / (h - 2 * f)) });
  gBorder(g, f + 6, f + 6, w - 2 * f - 12, h - 2 * f - 12, { band: 13, lines: 4, waves: 70, col: IP.ink, a: .75, w: .7, radius: 4, u: .99999 });
  g.restore();
  g.strokeStyle = IP.ink; g.lineWidth = 1.1; g.strokeRect(f, f, w - 2 * f, h - 2 * f); g.lineWidth = 1.9; g.strokeRect(0, 0, w, h);
});
const texBack = () => ipTex('back', IP.bw - 2 * IP.wt, IP.bh, (g, w, h) => {
  ipGrain(g, 0, 0, w, h, { seed: 61, gap: 5.4, knots: 2, tone: (px, py) => .74 - .12 * py / h });
  g.strokeStyle = IP.ink; g.lineWidth = 1.1; for (const y of [40, 82]) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
});
const texLeftIn = () => ipTex('leftIn', IP.bd - 2 * IP.wt, IP.bh, (g, w, h) => { ipGrain(g, 0, 0, w, h, { seed: 71, gap: 7.5, knots: 0, tone: (px, py) => .8 - .1 * py / h }); });
// ---- what all of us made and pass on ----
const texMusic = () => ipTex('music', 150, 70, (g, w, h) => {
  const r = prng(83); scribble(g, w * .3, 7, w * .4, 3.5, { seed: 9, ink: IP.ink, lw: .9 });
  g.strokeStyle = IP.ink; g.fillStyle = IP.ink;
  for (const sy of [16, 37, 57]) {
    g.lineWidth = .5; for (let l = 0; l < 5; l++) { g.beginPath(); g.moveTo(5, sy + l * 2.5); g.lineTo(w - 5, sy + l * 2.5); g.stroke(); }
    g.lineWidth = 1.1; g.beginPath(); g.moveTo(10, sy - 3); g.bezierCurveTo(5, sy + 3, 14, sy + 9, 9, sy + 12.5); g.stroke();   // a clef, roughly
    for (let x = 19; x < w - 8; x += 5.5 + r() * 4.5) { if (r() < .14) { g.lineWidth = .7; g.beginPath(); g.moveTo(x, sy); g.lineTo(x, sy + 10); g.stroke(); continue; }
      const ny = sy + Math.round(r() * 8) * 1.25; g.beginPath(); g.ellipse(x, ny, 1.7, 1.25, -.4, 0, TAU); r() < .25 ? (g.lineWidth = .55, g.stroke()) : g.fill(); g.lineWidth = .55; g.beginPath(); g.moveTo(x + 1.6, ny); g.lineTo(x + 1.6, ny - 7.5); g.stroke(); }
  }
  g.lineWidth = 1; g.strokeRect(0, 0, w, h);
});
const texRecipe = () => ipTex('recipe', 104, 58, (g, w, h) => {
  g.strokeStyle = IP.ink; g.lineWidth = 1.1; g.beginPath(); g.moveTo(3, 11); g.lineTo(w - 3, 11); g.stroke(); g.lineWidth = .45; g.beginPath(); g.moveTo(3, 12.6); g.lineTo(w - 3, 12.6); g.stroke();
  for (let y = 18; y < h - 2; y += 5.4) { g.lineWidth = .32; g.beginPath(); g.moveTo(3, y); g.lineTo(w - 3, y); g.stroke(); }
  scribble(g, 6, 9, 32, 3.8, { seed: 61, ink: IP.ink, lw: 1 }); for (let i = 0; i < 5; i++) scribble(g, 7, 17 + i * 5.4, 26 + (i * 17) % 34, 2.6, { seed: 70 + i, ink: IP.ink, lw: .65 });
  g.strokeStyle = rgba(IP.ink, .3); g.lineWidth = 1.7; g.beginPath(); g.arc(w * .77, h * .62, 10, .4, 5.6); g.stroke();   // the cup ring: it was used for years
  g.strokeStyle = IP.ink; g.lineWidth = .9; g.strokeRect(0, 0, w, h);
});
const texCode = () => ipTex('code', 122, 112, (g, w, h) => {
  const r = prng(17); g.fillStyle = rgba(IP.ink, .07); for (let y = 3; y < h; y += 18) g.fillRect(12, y, w - 24, 9);   // the green-bar bands, as a faint tint
  g.fillStyle = rgba(IP.ink, .85); for (const x of [5.5, w - 5.5]) for (let y = 3.5; y < h; y += 6) { g.beginPath(); g.arc(x, y, 1.5, 0, TAU); g.fill(); }
  g.strokeStyle = rgba(IP.ink, .6); g.lineWidth = .5; g.setLineDash([1.6, 1.4]); for (const x of [10.5, w - 10.5]) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } g.setLineDash([]);
  const ind = [0, 1, 2, 2, 1, 0, 0, 1, 2, 3, 3, 2, 1, 0, 0, 1, 2, 1, 0]; g.fillStyle = rgba(IP.ink, .85);
  ind.forEach((k, i) => { let x = 15 + k * 5; const y = 5 + i * 5.2, n = 1 + (r() * 4 | 0); for (let j = 0; j < n && x < w - 15; j++) { const L = 3.5 + r() * 11; g.fillRect(x, y - .85, Math.min(L, w - 15 - x), 1.7); x += L + 2.6; } });
  g.strokeStyle = IP.ink; g.lineWidth = 1; g.strokeRect(0, 0, w, h);
});
const texStackEdge = () => ipTex('stackEdge', 104, 30, (g, w, h) => { g.strokeStyle = rgba(IP.ink, .75); g.lineWidth = .55; for (let y = 1.2; y < h; y += 1.9) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + (Math.floor(y / 1.9) % 2 ? .5 : -.5)); g.stroke(); } g.strokeStyle = IP.ink; g.lineWidth = 1; g.strokeRect(0, 0, w, h); });
// books standing against the left wall: the page block seen from above, the spine with raised bands facing us
const texBookTop = (k) => ipTex('bookTop' + k, 64, 20, (g, w, h) => { g.fillStyle = rgba(IP.ink, .9); g.fillRect(0, 0, w, 2.6); g.fillRect(0, h - 2.6, w, 2.6); g.fillRect(0, 0, 3, h); g.strokeStyle = rgba(IP.ink, .5); g.lineWidth = .35; for (let y = 4; y < h - 3; y += 1.25) { g.beginPath(); g.moveTo(3, y); g.lineTo(w - 2, y); g.stroke(); } g.strokeStyle = IP.ink; g.lineWidth = .9; g.strokeRect(0, 0, w, h); });
const texSpine = (k, hgt) => ipTex('spine' + k, 20, hgt, (g, w, h) => {
  intaglio(g, 0, 0, w, h, { gap: 2.8, angle: Math.PI / 2, col: IP.ink, tone: (px) => .62 + .35 * Math.abs(px / w - .4) * 2 });
  for (const y of [10, 18, h * .62, h * .62 + 8, h - 12]) { ipHatchPoly(g, [[0, y - 1.8], [w, y - 1.8], [w, y + 1.8], [0, y + 1.8]], { gap: 1.4, angle: 0, tone: () => .05, lw: .6 }); }
  g.fillStyle = IP.paper; g.fillRect(3, 24, w - 6, 18); g.strokeStyle = IP.ink; g.lineWidth = .6; g.strokeRect(3, 24, w - 6, 18);
  scribble(g, 5, 31, w - 10, 2.4, { seed: 30 + k, ink: IP.ink, lw: .6 }); scribble(g, 6, 37, w - 13, 2, { seed: 40 + k, ink: IP.ink, lw: .5 });
  g.strokeStyle = IP.ink; g.lineWidth = 1; g.strokeRect(0, 0, w, h);
});
const texLetters = () => ipTex('letters', 104, 68, (g, w, h) => {
  g.strokeStyle = rgba(IP.ink, .7); g.lineWidth = .7; g.strokeRect(4, -1, w - 2, h - 3); g.strokeRect(-2, 2.5, w - 1, h - 1);   // the envelopes underneath
  g.fillStyle = IP.paper; g.fillRect(1, 1, w - 2, h - 2);
  intaglio(g, 1, 1, w - 2, h - 2, { gap: 6.6, angle: 0, col: IP.ink, tone: (px, py) => .04 + .1 * py / h });
  g.strokeStyle = IP.ink; g.lineWidth = 1; g.beginPath(); g.moveTo(1, 1); g.lineTo(w / 2, h * .52); g.lineTo(w - 1, 1); g.stroke();   // the flap
  g.beginPath(); g.moveTo(1, h - 1); g.lineTo(w * .4, h * .6); g.moveTo(w - 1, h - 1); g.lineTo(w * .6, h * .6); g.lineWidth = .55; g.stroke();
  g.fillStyle = rgba(IP.ink, .9); g.beginPath(); for (let i = 0; i <= 16; i++) { const a = i / 16 * TAU, rr = 5.5 * (1 + .1 * Math.sin(a * 5)); g.lineTo(w / 2 + Math.cos(a) * rr, h * .52 + Math.sin(a) * rr * .9); } g.fill();   // the wax seal
  g.strokeStyle = IP.paper; g.lineWidth = .6; g.beginPath(); g.arc(w / 2, h * .52, 2.8, 0, TAU); g.stroke();
  // the string, tied round the bundle
  g.strokeStyle = IP.ink; g.lineWidth = 1.6; g.beginPath(); g.moveTo(w * .28, 0); g.lineTo(w * .28, h); g.moveTo(0, h * .74); g.lineTo(w, h * .74); g.stroke();
  g.lineWidth = 1.1; g.beginPath(); g.ellipse(w * .28 - 5, h * .74 - 3, 5, 3, .5, 0, TAU); g.moveTo(w * .28 + 10, h * .74 - 3); g.ellipse(w * .28 + 5, h * .74 - 3, 5, 3, -.5, 0, TAU); g.moveTo(w * .28, h * .74); g.lineTo(w * .28 - 6, h * .74 + 9); g.moveTo(w * .28, h * .74); g.lineTo(w * .28 + 7, h * .74 + 8); g.stroke();
  g.strokeStyle = IP.ink; g.lineWidth = 1.1; g.strokeRect(1, 1, w - 2, h - 2);
});
// the pile everything rests on: loose sheets at odd angles
const texPile = () => ipTex('pile', IP.bw - 2 * IP.wt, IP.bd - 2 * IP.wt, (g, w, h) => {
  const r = prng(97); intaglio(g, 0, 0, w, h, { gap: 7, angle: 0, col: IP.ink, tone: () => .5 });
  for (let i = 0; i < 13; i++) { const x = r() * w, y = r() * h, sw = 60 + r() * 60, sh = 44 + r() * 40, a = (r() - .5) * .6; g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = IP.paper; g.fillRect(-sw / 2, -sh / 2, sw, sh); g.strokeStyle = rgba(IP.ink, .8); g.lineWidth = .7; g.strokeRect(-sw / 2, -sh / 2, sw, sh); g.strokeStyle = rgba(IP.ink, .35); g.lineWidth = .5; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(-sw / 2 + 5, -sh / 2 + 7 + k * 6); g.lineTo(sw / 2 - 5 - r() * 12, -sh / 2 + 7 + k * 6); g.stroke(); } g.restore(); }
});
// a box-shaped item: top, front and right faces (the left and back never show)
function ipItem(g, x0, x1, y0, y1, z0, z1, top, front, side) {
  if (side) ipMap(g, side, [x1, y1, z0], [x1, y1, z1], [x1, y0, z0]);
  if (front) ipMap(g, front, [x0, y1, z0], [x1, y1, z0], [x0, y0, z0]);
  ipMap(g, top, [x0, y1, z1], [x1, y1, z1], [x0, y1, z0]);
}
// a sheet standing in the box, leaning back (bottom edge at (yb, zb), top edge at (yt, zt))
const ipLean = (g, tex, x0, x1, yb, zb, yt, zt) => ipMap(g, tex, [x0, yt, zt], [x1, yt, zt], [x0, yb, zb]);
const IN = () => { const { bw, bd, wt } = IP; return { x0: -bw / 2 + wt, x1: bw / 2 - wt, z0: -bd / 2 + wt, z1: bd / 2 - wt, top: IP.top }; };
const ipMouthW = [12, IP.top - 24, 36];   // where the light comes from: among the papers at the back, under the lifting letter
IPRINT.mouth = ipP(...ipMouthW);
// ---- cached layers (print units × res) ----
const ipBase = () => ipLayer('base', (g) => {
  const { w, h } = IPRINT, [mx, my] = ipP(...ipMouthW), nz = vnoise(5);
  g.fillStyle = IP.paper; g.fillRect(0, 0, w, h);
  // the engraved ground: fine level lines, slightly wavering, cloudy in tone; open round the chest, deeper toward the plate's edges
  g.save(); g.beginPath(); g.rect(29, 29, w - 58, h - 58); g.clip();
  intaglio(g, 29, 29, w - 58, h - 58, { gap: 4.4, angle: 0, col: IP.ink, a: .9,
    warp: (px, py) => .7 * Math.sin(px / 61 + py / 37) + .35 * Math.sin(px / 19 + py * .3),
    tone: (px, py) => { const x = px + 29, y = py + 29, d = Math.hypot((x - mx) / 390, (y - my) / 290), up = clamp(1 - (y - 29) / 300), cl = fbm(nz, x / 150, y / 60, 3); return (.025 + .32 * sm(clamp(d * 1.1)) * (.3 + .7 * up)) * (.45 + 1 * cl); } });
  // the floor: the contact shadow under the plinth, crossed lines that die away from the foot
  const fl = (x, y) => { const a = x - IP.cx, b = (IP.cy - y) / IPc.sp, X = a * IPc.ct - b * IPc.st, Z = a * IPc.st + b * IPc.ct; return [X, Z]; };
  const foot = (x, y) => { const [X, Z] = fl(x, y), dx = Math.max(0, Math.abs(X) - IP.bw / 2 - IP.pl), dz = Math.max(0, Math.abs(Z) - IP.bd / 2 - IP.pl); return Math.hypot(dx, dz) + (Z > IP.bd / 2 ? 999 : 0); };
  const [fx0, fy0] = ipP(-IP.bw / 2 - 60, 0, -IP.bd / 2 - 40), [fx1, fy1] = ipP(IP.bw / 2 + 60, 0, IP.bd / 2 + 10);
  for (const ang of [.5, -.5]) intaglio(g, fx0, Math.min(fy0, fy1) - 120, fx1 - fx0, 260, { gap: 3.6, angle: ang, col: IP.ink, tone: (px, py) => .62 * Math.exp(-foot(px + fx0, py + Math.min(fy0, fy1) - 120) / 9) });
  g.restore();
  gBorder(g, 10, 10, w - 20, h - 20, { band: 18, lines: 5, waves: 120, col: IP.ink, a: .55, w: .7, radius: 6, u: .99999 });
});
const ipInterior = () => ipLayer('in', (g) => {
  const { x0, x1, z0, z1, top } = IN();
  g.save(); ipPath(g, [[x0, top, z0], [x1, top, z0], [x1, top, z1], [x0, top, z1]]); g.fillStyle = rgba(IP.ink, .85); g.fill(); g.clip();
  ipMap(g, texBack(), [x0, top, z1], [x1, top, z1], [x0, IP.by, z1]);
  ipMap(g, texLeftIn(), [x0, top, z0], [x0, top, z1], [x0, IP.by, z0]);
  const py = top - 42; ipMap(g, texPile(), [x0, py, z1], [x1, py, z1], [x0, py, z0]);   // the pile of papers it is full of
  // leaning on the back wall: a song sheet and the recipe card
  ipLean(g, texMusic(), -112, 38, py - 8, z1 - 12, top - 3, z1 - 2);
  ipLean(g, texRecipe(), 58, 162, py - 6, z1 - 16, top - 8, z1 - 6);
  // three books standing against the left wall, spines toward us
  [[60, 19, 14, 0], [41, 23, 22, 1], [18, 16, 10, 2], [2, 21, 18, 3]].forEach(([zb, th, hb, k]) => { const y1 = top - hb, za = zb - th, xr = x0 + 70 - (k % 2) * 5;
    ipMap(g, texSpine(k, 110), [xr, y1, za], [xr, y1, zb], [xr, py - 20, za]); ipMap(g, texBookTop(k), [x0, y1, zb], [xr, y1, zb], [x0, y1, za]); });
  // the listing (fan-folded) and the bundle of letters
  ipItem(g, 66, 188, py, py + 24, -62, 50, texCode(), texStackEdge(), texStackEdge());
  ipItem(g, -114, -10, py, py + 16, -64, 4, texLetters(), texStackEdge(), texStackEdge());
  g.restore();
});
const ipRim = (g, A, B, C, D) => { ipPath(g, [A, B, C, D]); g.fillStyle = IP.paper; g.fill(); g.strokeStyle = IP.ink; g.lineWidth = 1; g.stroke();
  g.strokeStyle = rgba(IP.ink, .45); g.lineWidth = .45; g.beginPath(); g.moveTo(...ipP(...A.map((v, i) => mix(v, D[i], .5)))); g.lineTo(...ipP(...B.map((v, i) => mix(v, C[i], .5)))); g.stroke(); };
// the chest itself, one cached layer: far rims, the inside with its contents, then plinth, front, end and near rims
const ipBody = () => ipLayer('body', (g) => {
  const { bw, bd, wt, top, by, pl } = IP, X = bw / 2, Z = bd / 2, PX = X + pl, PZ = Z + pl;
  ipRim(g, [-X, top, Z], [X, top, Z], [X - wt, top, Z - wt], [-X + wt, top, Z - wt]);
  ipRim(g, [-X, top, -Z], [-X, top, Z], [-X + wt, top, Z - wt], [-X + wt, top, -Z + wt]);
  g.drawImage(ipInterior(), 0, 0, IPRINT.w, IPRINT.h);
  // plinth: front and end on bracket feet, its top ledge
  ipMap(g, plinthTex('plF', bw + 2 * pl, 81, 3.4), [-PX, by, -PZ], [PX, by, -PZ], [-PX, 0, -PZ]);
  ipMap(g, plinthTex('plE', bd + 2 * pl, 82, 5), [PX, by, -PZ], [PX, by, PZ], [PX, 0, -PZ]);
  for (const q of [[[-PX, by, -PZ], [PX, by, -PZ], [X, by, -Z], [-X, by, -Z]], [[PX, by, -PZ], [PX, by, PZ], [X, by, Z], [X, by, -Z]]]) { ipPath(g, q); g.fillStyle = IP.paper; g.fill(); g.strokeStyle = IP.ink; g.lineWidth = .9; g.stroke(); }
  ipMap(g, texFront(), ...FRONT());
  ipMap(g, texEnd(), ...END());
  ipRim(g, [-X, top, -Z], [X, top, -Z], [X - wt, top, -Z + wt], [-X + wt, top, -Z + wt]);
  ipRim(g, [X, top, -Z], [X, top, Z], [X - wt, top, Z - wt], [X - wt, top, -Z + wt]);
  g.strokeStyle = IP.ink; g.lineWidth = 2.1; ipPath(g, [[-X, by, -Z], [X, by, -Z], [X, by, Z], [X, top, Z], [X, top, -Z], [-X, top, -Z]]); g.stroke();
});
// ---- the lid at angle a (0 closed): faces re-mapped per frame ----
const lidPt = (u, w, n, a) => [u, IP.top + w * Math.sin(a) + n * Math.cos(a), IP.bd / 2 - w * Math.cos(a) + n * Math.sin(a)];
function ipLid(g, a, light) {
  const u0 = -IP.bw / 2 - IP.ov, u1 = IP.bw / 2 + IP.ov, D = L_D(), lt = IP.lt, L = (u, w, n) => lidPt(u, w, n, a);
  const nOut = [0, Math.cos(a), Math.sin(a)], nFront = [0, Math.sin(a), -Math.cos(a)], outer = dot3(nOut, INTO) < 0;
  ipMap(g, texLidSide(), L(u1, 0, lt), L(u1, D, lt), L(u1, 0, 0));
  if (dot3(nFront, INTO) < 0) ipMap(g, texLidEdge(), L(u0, D, lt), L(u1, D, lt), L(u0, D, 0));
  if (outer) ipMap(g, texLidTop(), L(u0, 0, lt), L(u1, 0, lt), L(u0, D, lt));
  else {
    ipMap(g, texLidIn(), L(u0, D, 0), L(u1, D, 0), L(u0, 0, 0));
    if (light > 0) {   // the inside of the lid catches the light from the box (strongest at the hinge)
      const A = ipP(...L(0, D, 0)), B = ipP(...L(0, 0, 0)), gr = g.createLinearGradient(A[0], A[1], B[0], B[1]);
      gr.addColorStop(0, rgba('#ffb35c', .05 * light)); gr.addColorStop(.7, rgba('#ffb35c', .14 * light)); gr.addColorStop(1, rgba('#ffd09a', .28 * light));
      g.save(); ipPath(g, [L(u0, D, 0), L(u1, D, 0), L(u1, 0, 0), L(u0, 0, 0)]); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.fill(); g.restore();
    }
  }
  return ipP(...L(0, D, outer ? lt : 0));
}
// ---- the light: beams that open out of the box, engraved rays inside them, a warm glow, dust ----
const BEAMS = (() => { const r = prng(29), out = []; let a = -Math.PI / 2 - 1.38; while (a < -Math.PI / 2 + 1.38) { const w = .028 + r() * .08; out.push({ a: a + w / 2, w, L: 300 + r() * 260, ph: r() * TAU, sp: .6 + r() * 1.1, k: .5 + r() * .5, rays: 1 + (r() * 3 | 0) }); a += w + .02 + r() * .08; } return out; })();
const MOTES = (() => { const r = prng(37); return Array.from({ length: 60 }, () => ({ a: -Math.PI / 2 + (r() - .5) * 2.2, d: 60 + r() * 280, v: 5 + r() * 9, ph: r() * TAU, s: 1 + r() * 1.1 })); })();
function ipLight(g, t, light, open, [mx, my]) {
  if (light <= 0) return;
  const spread = mix(.2, 1.35, eout(clamp(open * 1.1))), grow = eout(light);
  g.save(); g.beginPath(); g.rect(29, 29, IPRINT.w - 58, IPRINT.h - 58); g.clip();
  for (const b of BEAMS) {
    const off = Math.abs(b.a + Math.PI / 2); if (off > spread) continue;
    const edge = clamp((spread - off) / .25), shim = .75 + .25 * Math.sin(t * b.sp + b.ph) * Math.sin(t * b.sp * .53 + b.ph * 2), L = b.L * grow * (.75 + .25 * edge), r0 = 30;
    const p = (ang, d) => [mx + Math.cos(ang) * d, my + Math.sin(ang) * d];
    const gr = g.createRadialGradient(mx, my, r0, mx, my, L); gr.addColorStop(0, rgba('#fdeccb', .97 * b.k * edge * shim)); gr.addColorStop(.5, rgba('#f9e6c2', .7 * b.k * edge * shim)); gr.addColorStop(1, rgba('#f6e4c4', 0));
    g.fillStyle = gr; g.beginPath(); g.moveTo(...p(b.a - b.w / 2, r0)); g.lineTo(...p(b.a - b.w / 2, L)); g.lineTo(...p(b.a + b.w / 2, L)); g.lineTo(...p(b.a + b.w / 2, r0)); g.closePath(); g.fill();
    // the engraved rays: fine lines that run out of the light
    g.lineWidth = .55; for (let k = 0; k < b.rays; k++) { const aa = b.a + (k / b.rays - .5 + .5 / b.rays) * b.w * .8, Lk = L * (.7 + .3 * Math.sin(b.ph + k * 2.1 + t * .9 * b.sp) ** 2);
      const s0 = Lk * .38, lg = g.createLinearGradient(...p(aa, s0), ...p(aa, Lk)); lg.addColorStop(0, rgba(IP.ink, 0)); lg.addColorStop(.3, rgba(IP.ink, .42 * edge)); lg.addColorStop(1, rgba(IP.ink, 0)); g.strokeStyle = lg; g.beginPath(); g.moveTo(...p(aa, s0)); g.lineTo(...p(aa, Lk)); g.stroke(); }
  }
  g.restore();
}
function ipGlow(g, t, light, [mx, my], seam, seamPts) {
  g.save(); g.globalCompositeOperation = 'lighter';
  if (light > 0) {
    const br = 1 + .04 * Math.sin(t * 2.3) + .025 * Math.sin(t * 5.1 + 1);
    let gr = g.createRadialGradient(mx, my, 0, mx, my, 330 * br); gr.addColorStop(0, rgba('#ffb35c', .34 * light)); gr.addColorStop(.4, rgba('#e9a54b', .15 * light)); gr.addColorStop(1, rgba('#e9a54b', 0)); g.fillStyle = gr; g.fillRect(mx - 340, my - 340, 680, 680);
    gr = g.createRadialGradient(mx, my, 0, mx, my, 74 * br); gr.addColorStop(0, rgba('#fff1d6', .34 * light)); gr.addColorStop(.35, rgba('#ffcf8a', .18 * light)); gr.addColorStop(1, rgba('#ffb35c', 0)); g.fillStyle = gr; g.fillRect(mx - 90, my - 90, 180, 180);
  }
  if (seam > 0) {   // light leaking at the closed lid: a hot hairline along the seam and a soft spill
    const fl = .85 + .15 * Math.sin(t * 7.3) * Math.sin(t * 3.1);
    const [p0, p1] = seamPts, sp = g.createLinearGradient(p0[0], p0[1], p0[0], p0[1] + 30); sp.addColorStop(0, rgba('#ffb35c', .5 * seam * fl)); sp.addColorStop(1, rgba('#ffb35c', 0)); g.fillStyle = sp;
    g.beginPath(); g.moveTo(...p0); g.lineTo(...p1); g.lineTo(p1[0], p1[1] + 30); g.lineTo(p0[0], p0[1] + 30); g.closePath(); g.fill();
    g.lineCap = 'round'; for (const [lw, a] of [[18, .14], [7, .38], [2.4, 1]]) { g.strokeStyle = rgba(lw < 2 ? '#fff1d6' : '#ffb35c', a * seam * fl); g.lineWidth = lw; g.beginPath(); seamPts.forEach((q, i) => (i ? g.lineTo(...q) : g.moveTo(...q))); g.stroke(); }
  }
  g.restore();
}
function ipMotes(g, t, a, [mx, my]) {
  if (a <= 0) return;
  for (const m of MOTES) {
    const d = m.d + ((t * m.v + m.ph * 40) % 80) - 40, ang = m.a + .05 * Math.sin(t * .4 + m.ph), x = mx + Math.cos(ang) * d + 3 * Math.sin(t * .7 + m.ph), y = my + Math.sin(ang) * d - ((t * m.v * .6 + m.ph * 13) % 30);
    const tw = .5 + .5 * Math.sin(t * 2.2 + m.ph * 3), al = a * clamp(1 - d / 340) * clamp((d - 40) / 40);
    if (al <= .02) continue;
    g.fillStyle = rgba('#6a4520', .55 * al); g.beginPath(); g.arc(x, y, m.s, 0, TAU); g.fill();   // a speck of dust: dark against the paper, a lit spark when it turns
    g.fillStyle = rgba('#ffe6b0', al * tw); g.beginPath(); g.arc(x - m.s * .2, y - m.s * .2, m.s * .62, 0, TAU); g.fill();
  }
}
// the loose letter on top of the pile: its far edge lifts and breathes in the warm air
function ipPage(g, t, draft) {
  const x0 = -4, x1 = 64, zf = -2, depth = 58, y = IP.top - 37, N = 12;
  const lift = draft * (.5 + .14 * Math.sin(t * 2.1) + .06 * Math.sin(t * 5.3 + 1));
  const row = (u) => { const pts = []; let z = zf, yy = y; for (let k = 0; k <= N; k++) { const s = k / N; pts.push([z, yy]); const tw = mix(.8, 1.2, u), al = lift * tw * Math.pow(clamp((s - .3) / .7), 2) * 1.3; z += Math.cos(al) * depth / N; yy += Math.sin(al) * depth / N; } return pts; };
  const L = row(0), R = row(1), at = (u, k) => { const A = L[k], B = R[k]; return [mix(x0, x1, u), mix(A[1], B[1], u), mix(A[0], B[0], u)]; };
  for (let k = 0; k < N; k++) {
    const q = [at(0, k), at(1, k), at(1, k + 1), at(0, k + 1)], sl = Math.atan2(L[k + 1][1] - L[k][1], L[k + 1][0] - L[k][0]);
    ipPath(g, q); const sh = clamp(sl * 1.1); g.fillStyle = `rgb(${Math.round(mix(236, 200, sh))},${Math.round(mix(224, 186, sh))},${Math.round(mix(198, 158, sh))})`; g.fill();
  }
  // the handwriting, riding the curl
  g.strokeStyle = rgba(IP.ink, .9); g.lineWidth = .75;
  for (let j = 0; j < 9; j++) { const kk = 1 + j * 1.15, k = Math.floor(kk), f = kk - k; if (k >= N) break; const r = prng(90 + j), len = j === 8 ? .45 : .8 + r() * .1;
    g.beginPath(); for (let i = 0; i <= 20; i++) { const u = .09 + len * i / 20, A = at(u, k), B = at(u, k + 1), P = [A[0], mix(A[1], B[1], f) + .7 * Math.sin(i * 2.7 + j), mix(A[2], B[2], f)], s = ipP(...P); i ? g.lineTo(...s) : g.moveTo(...s); } g.stroke(); }
  g.strokeStyle = IP.ink; g.lineWidth = .9; g.beginPath(); [...Array(N + 1).keys()].forEach((k) => g.lineTo(...ipP(...at(0, k)))); [...Array(N + 1).keys()].reverse().forEach((k) => g.lineTo(...ipP(...at(1, k)))); g.closePath(); g.stroke();
}
export const inheritanceBase = () => ipBase();
export function inheritancePrint(ctx, t, o = {}) {
  const open = clamp(o.open ?? 0), light = clamp(o.light ?? 0), seam = clamp(o.seam ?? 0), draft = clamp(o.draft ?? 0), a = IP.maxA * open;
  const mouth = IPRINT.mouth, behind = dot3([0, Math.cos(a), Math.sin(a)], INTO) >= 0, { w, h } = IPRINT;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.base !== false) ctx.drawImage(ipBase(), 0, 0, w, h);
  let lidFront = null;
  if (behind) lidFront = ipLid(ctx, a, light);
  ipLight(ctx, t, light, open, mouth);
  ctx.drawImage(ipBody(), 0, 0, w, h);
  if (open > 0 && draft > 0) ipPage(ctx, t, draft);   // inside the box but clear of the near rim on screen, so it can go on top
  if (!behind) lidFront = ipLid(ctx, a, light);
  const X = IP.bw / 2 + IP.ov, D = L_D(), seamPts = [ipP(...lidPt(-X, D, 0, a)), ipP(...lidPt(X, D, 0, a)), ipP(...lidPt(X, 0, 0, a))];
  ipGlow(ctx, t, light, mouth, seam * (1 - sm(clamp(open * 6))), seamPts);
  ipMotes(ctx, t, clamp(o.motes ?? light), mouth);
  ctx.restore();
  return { mouth, lidFront, P: ipP };
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
