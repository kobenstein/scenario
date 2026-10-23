// Film 7 · c04 props on the test table: the printed plan page, the robot field, the data-center halls, the newspaper clipping, labels.
// World units and camera from lib/f7_c04_table.mjs. Builder: c04. Pure functions of t, deterministic.
//   planPage(ctx, t, A, o)   A: page mm (0..210 × 0..297, top-left origin) → screen affine. o: { reveal [3× 0..1] (the principle, per
//                            phrase), pencil 0..1 (red-pencil underline under "infinite."), blank 0..1 (the red-pencil "? GW" ring) }
//   PAGE = { w: 210, h: 297, mark: [u, v] (mm, the "? GW" ring) }      pagePrepare() async (paper texture → Image)
//   robot(ctx, t, x, y, hpx, o)     one small engraved robot silhouette (copied from c01's ground; no face), feet at x,y, height hpx
//   robotsPrepare() async (robot sprites → Images; call once before robotField)
//   robotField(ctx, t, cam, o)      the grid on the table: o: { t0 (first robot rises), wave (s after t0 when the wave starts), speed cm/s, spot }
//   hall(ctx, t, cam, o)            a long low data-center hall (engraved box, vents, roof fans): { X, Z, L, D, h, rise 0..1, light 0..1 }
//   clipping(ctx, t, A, o)          the newspaper clipping (Bloomberg paraphrase): A: card mm (0..112 × 0..64) → screen
//   label(ctx, t, big, small, x, y, t0, t1)   the film's label (as c01): big serif + small caps source, wiped in/out, amber bar
import { loadImage, Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, canvas, text } from '../engine.mjs';
import { F7, ease, n1 } from './f7_kit.mjs';
import { apply, spotAt, TB } from './f7_c04_table.mjs';

const TAU = Math.PI * 2;
export const PAGE = { w: 210, h: 297, mark: [168, 268] };
const INK = '#2a2622', GREY = 'rgba(60,54,48,.34)', PEN = '#b23a2a';
let PIMG = null;
export async function pagePrepare() {
  if (PIMG) return;
  const S = 4, [c, g] = canvas(PAGE.w * S, PAGE.h * S), r = prng(612);
  const gr = g.createLinearGradient(0, 0, c.width, c.height); gr.addColorStop(0, '#f4efe3'); gr.addColorStop(1, '#e4dccb'); g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
  g.lineCap = 'round';
  for (let i = 0; i < 2600; i++) { const x = r() * c.width, y = r() * c.height, L = 3 + r() * 14, a0 = r() * TAU; g.strokeStyle = r() < .5 ? `rgba(120,100,70,${.04 + .05 * r()})` : `rgba(255,253,246,${.12 + .16 * r()})`; g.lineWidth = .5 + r() * .7; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a0) * L, y + Math.sin(a0) * L); g.stroke(); }
  // a soft fold across the middle and a little curl shade at the edges
  const fo = g.createLinearGradient(0, c.height * .47, 0, c.height * .53); fo.addColorStop(0, 'rgba(90,70,40,0)'); fo.addColorStop(.5, 'rgba(90,70,40,.06)'); fo.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = fo; g.fillRect(0, c.height * .47, c.width, c.height * .06);
  const v = g.createRadialGradient(c.width / 2, c.height / 2, c.height * .3, c.width / 2, c.height / 2, c.height * .75); v.addColorStop(0, 'rgba(110,85,50,0)'); v.addColorStop(1, 'rgba(110,85,50,.14)'); g.fillStyle = v; g.fillRect(0, 0, c.width, c.height);
  PIMG = await loadImage(c.toBuffer('image/png'));
  // the finished page (all revealed, pencil done), for perspective views (meshImage)
  const [c2, g2] = canvas(PAGE.w * S, PAGE.h * S); planPage(g2, 0, [S, 0, 0, S, 0, 0], { reveal: [1, 1, 1], pencil: 1, blank: 0 });
  PFIN = await loadImage(c2.toBuffer('image/png'));
}
let PFIN = null;
export const pageImage = () => PFIN;
// grey bars = the running text of the page (unreadable on purpose); deterministic lengths
const BARS = (() => {
  const r = prng(77), out = [];
  const para = (y0, n, x0 = 18, x1 = 192, gap = 4.6) => { for (let i = 0; i < n; i++) { const last = i === n - 1, L = (x1 - x0) * (last ? .35 + .4 * r() : .9 + .1 * r()); let x = x0; while (x < x0 + L - 4) { const wl = 4 + r() * 11; out.push([x, y0 + i * gap, Math.min(wl, x0 + L - x)]); x += wl + 1.6; } } };
  para(52, 6); para(160, 5); para(190, 7); para(229, 4); para(253, 3, 18, 120);
  return out;
})();
const P1 = 'Growth is infinite.', P2 = 'Growth in one area does not require decline in another.', P3 = 'Shortages in resources can be remedied by improved technology, greater innovation and new ideas.';
function wrap(g, s, maxW) { const ws = s.split(' '), out = []; let cur = ''; for (const w of ws) { const nx = cur ? cur + ' ' + w : w; if (cur && g.measureText(nx).width > maxW) { out.push(cur); cur = w; } else cur = nx; } if (cur) out.push(cur); return out; }
export function planPage(ctx, t, A, o = {}) {
  ctx.save(); apply(ctx, A);
  if (PIMG) ctx.drawImage(PIMG, 0, 0, PAGE.w, PAGE.h); else { ctx.fillStyle = '#efe8d8'; ctx.fillRect(0, 0, PAGE.w, PAGE.h); }
  // header
  text(ctx, 'MASTER PLAN PART IV', 18, 33, { size: 12.5, font: 'Instrument Serif', color: INK });
  text(ctx, 'TESLA', 192, 26.5, { size: 3.3, weight: 600, color: rgba(INK, .8), align: 'right', spacing: 1.1 });
  text(ctx, 'SEPT 2025', 192, 32.5, { size: 3.3, weight: 600, color: rgba(INK, .8), align: 'right', spacing: 1.1 });
  ctx.fillStyle = rgba(INK, .75); ctx.fillRect(18, 40, 174, .45);
  // running text as grey bars
  ctx.fillStyle = GREY; for (const [x, y, w] of BARS) ctx.fillRect(x, y, w, 1.7);
  // the principle (rules above and below; the words are set in type and revealed per phrase)
  ctx.fillStyle = rgba(INK, .5); ctx.fillRect(18, 85, 174, .3); ctx.fillRect(18, 141, 174, .3);
  const rv = o.reveal || [1, 1, 1];
  const line = (s, x, y, size, u, font = 'Instrument Serif') => {
    if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(.1, .1); ctx.font = `${size * 10}px "${font}"`; const w = ctx.measureText(s).width;
    ctx.beginPath(); ctx.rect(-10, -size * 10.5, (w + 20) * ease.out(u), size * 14); ctx.clip(); text(ctx, s, 0, 0, { size: size * 10, font, color: INK }); ctx.restore();
  };
  line(P1, 18, 104, 15, rv[0]);
  line(P2, 18, 116, 6.4, rv[1]);
  { ctx.save(); ctx.font = '64px "Instrument Serif"'; const ls = wrap(ctx, P3, 1740); ctx.restore(); ls.forEach((s, i) => line(s, 18, 126 + i * 8, 6.4, clamp(rv[2] * ls.length - i))); }
  // red pencil: two quick strokes under "infinite."
  const pu = o.pencil ?? 0;
  if (pu > 0) {
    ctx.save(); ctx.font = '150px "Instrument Serif"'; const x0 = 18 + ctx.measureText('Growth is ').width / 10 - 1, x1 = 18 + ctx.measureText(P1).width / 10 + 2; ctx.restore();
    pencilLine(ctx, x0, 107.4, x1, 106.8, clamp(pu * 2), 1); pencilLine(ctx, x0 + 3, 109.4, x1 - 2, 109.1, clamp(pu * 2 - 1), 2);
  }
  if ((o.blank ?? 0) > 0) pageRing(ctx, o.blank);
  ctx.restore();
}
// the red-pencil ring "? GW" (call inside the page's mm transform)
export function pageRing(ctx, bu) {
  if (bu <= 0) return;
    const [mx, my] = PAGE.mark, rr = 11;
    ctx.save(); ctx.strokeStyle = rgba(PEN, .85); ctx.lineCap = 'round';
    for (const [dw, al, ph] of [[.55, .85, 0], [.3, .5, .4]]) { ctx.lineWidth = dw; ctx.globalAlpha = al; ctx.beginPath(); const a1 = -2.2 + ph * .1, sweep = TAU * 1.06 * ease.out(clamp(bu * 1.6)); for (let i = 0; i <= 60; i++) { const a = a1 + sweep * i / 60, r2 = rr * (1 + .05 * Math.sin(a * 3 + ph)) + ph; const x = mx + r2 * Math.cos(a) * 1.25, y = my + r2 * Math.sin(a) * .8; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
    ctx.restore();
    const tu = clamp(bu * 1.6 - .55); if (tu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(mx - 12, my - 9, 24 * ease.out(tu), 16); ctx.clip(); text(ctx, '? GW', mx, my + 3.2, { size: 9, font: 'Instrument Serif Italic', color: rgba(PEN, .9), align: 'center' }); ctx.restore(); }
}
function pencilLine(ctx, x0, y0, x1, y1, u, seed) {
  if (u <= 0) return; const r = prng(seed * 13), n = 24, m = Math.max(2, Math.round(n * ease.out(u)));
  ctx.save(); ctx.lineCap = 'round';
  for (const [w, a, dy] of [[.7, .8, 0], [.35, .5, .25], [.3, .4, -.2]]) { ctx.strokeStyle = rgba(PEN, a); ctx.lineWidth = w; ctx.beginPath(); for (let i = 0; i <= m; i++) { const q = i / n, x = mix(x0, x1, q), y = mix(y0, y1, q) + .35 * Math.sin(q * 9 + seed) + dy + (r() - .5) * .15; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  ctx.restore();
}

// ================================================================ the robots (copied from f7_c01_ground.robot, colours as options)
export function robot(ctx, t, x, y, s, o = {}) {
  const step = o.step ?? 0, sw = Math.sin(Math.PI * step), ph = o.seed || 0, br = Math.sin(t * 1.3 + ph) * .006;
  ctx.save(); ctx.translate(x, y); const k = s / 100; ctx.scale(k, k);
  const body = o.col || '#0c0b22', rim = o.rim || '#cfe0f0', ra = o.rimA ?? .8;
  const limb = (x1, y1, x2, y2, w) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineWidth = w; ctx.stroke(); };
  ctx.lineCap = 'round'; ctx.strokeStyle = body; ctx.fillStyle = body;
  const lift = sw * 6, hip = -48 - lift * .3;
  limb(-6, hip, -7 - sw * 2, -2, 9); limb(6, hip, 7 + sw * 2, -2 - lift, 9);
  ctx.beginPath(); ctx.moveTo(-14, hip); ctx.lineTo(-17, hip - 34); ctx.quadraticCurveTo(0, hip - 41, 17, hip - 34); ctx.lineTo(14, hip); ctx.closePath(); ctx.fill();
  limb(-17, hip - 30, -21 + sw * 3, hip - 6, 6.5); limb(17, hip - 30, 21 - sw * 3, hip - 6, 6.5);
  ctx.beginPath(); ctx.roundRect(-8, hip - 58 + br * 100, 16, 18, 7); ctx.fill();
  if (ra > 0) {
    ctx.strokeStyle = rgba(rim, ra); ctx.lineWidth = 1.6 / Math.max(.4, k) * Math.min(1, k * 1.6);
    ctx.beginPath(); ctx.roundRect(-8, hip - 58 + br * 100, 16, 18, 7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-17, hip - 33); ctx.quadraticCurveTo(0, hip - 40, 17, hip - 33); ctx.stroke();
    ctx.lineWidth *= .7; ctx.beginPath(); ctx.moveTo(-21, hip - 26); ctx.lineTo(-23, hip - 8); ctx.moveTo(21, hip - 26); ctx.lineTo(23, hip - 8); ctx.moveTo(-8, hip - 2); ctx.lineTo(-9, -4); ctx.stroke();
    ctx.strokeStyle = rgba('#3a3670', .9); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-6, hip - 50 + br * 100); ctx.lineTo(6, hip - 50 + br * 100); ctx.stroke();
  }
  ctx.restore();
}
// the field: a grid on the table that multiplies outward from the first robot to the dark horizon of the table
export const FIELD = (() => {
  const r = prng(5150), out = [], R = TB.R - 7;
  for (let j = 0; j < 27; j++) for (let i = 0; i < 21; i++) {
    const jx = (r() - .5) * .25, jz = (r() - .5) * .25, o0 = i === 3 && j === 2, X = 4 + 2.1 * (i - 3) + (o0 ? 0 : jx), Z = 14 + 2.3 * (j - 2) + (o0 ? 0 : jz);
    if (X * X + Z * Z > R * R) continue;
    out.push({ X, Z, d: Math.hypot(X - 4, Z - 14), seed: i * 7 + j * 13, ph: r() * TAU });
  }
  out.sort((a, b) => b.Z - a.Z || a.X - b.X);
  return out;
})();
// sprites: robot() pre-rendered at 5 sizes × 5 rim levels (Images), drawn scaled; rising robots crop the sprite at the feet
const SPR = { lv: [12, 17, 24, 34, 48, 68, 96, 136, 192, 272], rims: 5, img: null };
const sprBox = (s) => ({ w: Math.ceil(s * 1.0) + 4, h: Math.ceil(s * 1.12) + 4 });   // wide enough for the foot shadow
export async function robotsPrepare() {
  if (SPR.img) return;
  SPR.img = [];
  for (const s of SPR.lv) {
    const row = [];
    for (let k = 0; k < SPR.rims; k++) {
      const b = sprBox(s), [c, g] = canvas(b.w, b.h);
      if (s > 8) { g.fillStyle = 'rgba(2,2,8,.35)'; g.beginPath(); g.ellipse(b.w / 2 + s * .12, b.h - 2, s * .32, s * .07, 0, 0, TAU); g.fill(); }
      robot(g, 0, b.w / 2, b.h - 2, s, { seed: 0, rimA: k / (SPR.rims - 1) * .92, rim: '#d8e6f4' });
      row.push(await loadImage(c.toBuffer('image/png')));
    }
    SPR.img.push(row);
  }
}
function sprite(ctx, x, y, hpx, rimA, sink = 0) {
  let li = SPR.lv.findIndex(s => s >= hpx); if (li < 0) li = SPR.lv.length - 1;
  const s = SPR.lv[li], img = SPR.img[li][Math.round(clamp(rimA / .92) * (SPR.rims - 1))], b = sprBox(s), k = hpx / s;
  const dw = b.w * k, dh = b.h * k, dx = x - dw / 2, dy = y + sink - (b.h - 2) * k;
  if (!sink) { ctx.drawImage(img, dx, dy, dw, dh); return; }
  const vis = (y + 2 * k) - dy; if (vis <= .5) return;           // only the part above the lacquer
  ctx.drawImage(img, 0, 0, b.w, Math.min(b.h, vis / k), dx, dy, dw, Math.min(dh, vis));
}
export function robotField(ctx, t, cam, o = {}) {
  if (!SPR.img) throw new Error('robotsPrepare() first');
  const t0 = o.t0, tw = t0 + (o.wave ?? 1.6), sp = o.speed ?? 50, hh = 1.65;
  const list = [];
  for (const q of FIELD) {
    const first = q.d < .01, ta = first ? t0 : tw + q.d / sp;
    const u = clamp((t - ta) / .38); if (u <= 0) continue;
    const F = cam.p(q.X, 0, q.Z); if (F[3] < 1.2) continue;
    const Hd = cam.p(q.X, hh, q.Z), hpx = Math.hypot(Hd[0] - F[0], Hd[1] - F[1]);
    if (F[0] < -hpx || F[0] > W + hpx || F[1] < -10 || Hd[1] > H + 10) continue;
    const lit = spotAt(q.X, q.Z, o.spot), rimA = (.22 + .7 * lit) * clamp((u - .45) * 2.2);
    if (hpx < 2.6) { if (u >= 1) list.push([F[0], F[1], hpx, -1, 0]); continue; }
    // a slow breath: the sprite bobs by a fraction of a pixel-scale (keeps the field alive without per-robot vectors)
    const br = Math.sin(t * 1.3 + q.ph) * .006 * hpx;
    list.push([F[0], F[1] + br, hpx, rimA, u < 1 ? hpx * (1 - ease.out(u)) : 0]);
  }
  ctx.fillStyle = rgba('#cfe0f0', .45);
  for (const [x, y, hpx, rimA, sink] of list) if (rimA < 0) ctx.fillRect(x - .5, y - hpx, 1.1, hpx + .2); else sprite(ctx, x, y, hpx, rimA, sink);
}

// ================================================================ a data-center hall (engraved box with vents and roof fans)
export function hall(ctx, t, cam, o) {
  const rise = ease.out(clamp(o.rise ?? 1)); if (rise <= 0) return;
  const { X, Z, L, D } = o, h = o.h * rise, li = o.light ?? 1, x0 = X - L / 2, x1 = X + L / 2, z0 = Z - D / 2, z1 = Z + D / 2;
  const P = (x, y, z) => cam.p(x, y, z), poly = (pts, fill, stroke) => { const Q = pts.map((q) => P(...q)); if (Q.some((q) => q[3] < 1)) return null; ctx.beginPath(); Q.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); } return Q; };
  // the end that faces the camera
  const endX = cam.x < X ? x0 : x1;
  poly([[endX, 0, z0], [endX, h, z0], [endX, h, z1], [endX, 0, z1]], '#0d0f20', rgba('#8ea4d8', .25));
  // front face with ribs and a band of lit vents
  const F = poly([[x0, 0, z0], [x1, 0, z0], [x1, h, z0], [x0, h, z0]], '#13162c', null);
  if (F) {
    ctx.save(); ctx.beginPath(); F.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.closePath(); ctx.clip();
    ctx.strokeStyle = rgba('#7f93c8', .22); ctx.lineWidth = .8; ctx.beginPath();
    for (let x = x0 + .35; x < x1; x += .35) { const a = P(x, 0, z0), b = P(x, h, z0); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
    ctx.stroke();
    // vents: a row of small cool-lit louvres (the machines inside), breathing slowly
    for (let i = 0; i < Math.floor(L / .9); i++) {
      const vx = x0 + .5 + i * .9, a = P(vx, h * .42, z0 - .01), b = P(vx + .55, h * .62, z0 - .01);
      const fl = .55 + .25 * Math.sin(t * 1.7 + i * 1.3 + X);
      ctx.fillStyle = rgba('#9fc6ff', .5 * fl * li); ctx.fillRect(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
    }
    ctx.restore();
  }
  // the roof with fans
  const R = poly([[x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]], '#191d36', rgba('#cfe6ff', .4));
  if (R && rise > .98) {
    for (let i = 0; i < Math.floor(L / 1.6); i++) {
      const fx = x0 + 1 + i * 1.6, fz = Z, A = cam.flatM(fx, fz, 0, .48, 1, h + .02); if (!A) continue;
      ctx.save(); apply(ctx, A);
      ctx.fillStyle = '#0b0d1c'; ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba('#a9bce6', .6); ctx.lineWidth = .08; ctx.stroke();
      const sp = t * (3.2 + (i % 3) * .4) + i; ctx.strokeStyle = rgba('#a9bce6', .5); ctx.lineWidth = .14; ctx.beginPath(); for (let k = 0; k < 3; k++) { const a = sp + k * TAU / 3; ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * .85, Math.sin(a) * .85); } ctx.stroke();
      ctx.restore();
    }
  }
  // the warm hum of the hall rising into the cold air
  const c = P(X, h + .3, Z); if (c[3] > 1) { const r = L * .6 * c[2]; const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], r); g.addColorStop(0, rgba('#9fc6ff', .1 * li * rise)); g.addColorStop(1, 'rgba(159,198,255,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(c[0] - r, c[1] - r, 2 * r, 2 * r); ctx.restore(); }
}

// ================================================================ the newspaper clipping (a paraphrase, said so on the card)
export const CLIP = { w: 112, h: 64 };
export function clipping(ctx, t, A, o = {}) {
  ctx.save(); apply(ctx, A);
  // torn newsprint: straight top/bottom, a torn right edge
  const r = prng(71); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(CLIP.w - 3, 0);
  for (let y = 0; y <= CLIP.h; y += 2.2) ctx.lineTo(CLIP.w - 3 + (r() - .5) * 2.6, y); ctx.lineTo(0, CLIP.h); ctx.closePath();
  const g = ctx.createLinearGradient(0, 0, CLIP.w, CLIP.h); g.addColorStop(0, '#f2eee4'); g.addColorStop(1, '#ddd6c6'); ctx.fillStyle = g; ctx.fill();
  ctx.clip();
  const rr = prng(72); ctx.lineCap = 'round'; for (let i = 0; i < 260; i++) { const x = rr() * CLIP.w, y = rr() * CLIP.h, L = 1 + rr() * 4, a0 = rr() * TAU; ctx.strokeStyle = rr() < .5 ? `rgba(110,95,70,${.05 + .05 * rr()})` : `rgba(255,253,246,${.12 + .14 * rr()})`; ctx.lineWidth = .2 + rr() * .2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a0) * L, y + Math.sin(a0) * L); ctx.stroke(); }
  text(ctx, 'BLOOMBERG OPINION · SEPT 2025', 8, 11, { size: 3.4, weight: 600, color: rgba(INK, .78), spacing: 1 });
  ctx.fillStyle = rgba(INK, .55); ctx.fillRect(8, 14, CLIP.w - 18, .3);
  const u = o.reveal ?? 1, wl = (s, y, uu) => { if (uu <= 0) return; ctx.save(); ctx.font = '11px "Instrument Serif"'; const w = ctx.measureText(s).width; ctx.beginPath(); ctx.rect(7, y - 11, (w + 3) * ease.out(uu), 15); ctx.clip(); text(ctx, s, 8, y, { size: 11, font: 'Instrument Serif', color: INK }); ctx.restore(); };
  wl('It wasn’t really', 31, clamp(u * 2)); wl('a plan at all.', 44, clamp(u * 2 - 1));
  text(ctx, 'A COLUMNIST, PARAPHRASED', 8, 56, { size: 2.9, weight: 600, color: rgba(INK, .6), spacing: .9 });
  ctx.restore();
}

// ================================================================ the label (as c01: big serif value + small caps source, wiped)
export function label(ctx, t, big, small, x, y, t0, t1, o = {}) {
  const a = ease.out(lin(t0, t0 + .6, t)), b = ease.inn(lin(t1 - .4, t1, t)); if (a <= 0 || b >= 1) return;
  const bs = o.size ?? 76;
  ctx.save(); ctx.font = `${bs}px "Instrument Serif"`; const bw = big ? ctx.measureText(big).width : 0; ctx.restore();
  const wv = Math.max(bw, small.length * 15.5) + 40;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 10 + wv * b, y - bs * 1.2, wv * (a - b), bs * 1.2 + 80); ctx.clip();
  if (big) text(ctx, big, x, y, { size: bs, font: 'Instrument Serif', color: '#f6efdc' });
  text(ctx, small, x + 2, y + (big ? 44 : 0), { size: 18, weight: 600, color: rgba('#cfd6ee', .9), spacing: 4 });
  if (o.small2) text(ctx, o.small2, x + 2, y + (big ? 72 : 28), { size: 18, weight: 600, color: rgba('#cfd6ee', .75), spacing: 4 });
  ctx.restore();
  ctx.fillStyle = rgba(F7.amber, .9); ctx.fillRect(x - 24, y - bs * .82, 3, (bs * .82 + (big ? 52 : 8) + (o.small2 ? 28 : 0)) * (a - b));
}
