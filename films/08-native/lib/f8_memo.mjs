// Film 8 · the Shopify memo as a typed sheet (owner: B1; used in 4.10 by c05 and 7.17–7.19 by c08). Other builders import, never edit.
// Signature is FINAL.
//
//   await memoReady()                        cached paper texture as an Image (call once in your async default export)
//   paperMemo(ctx, t, o) → { rect, toScreen(px, py), word(i|'text') → {x,y,w,h}, side 'front'|'back' }
//     A typed memo on off-white paper (our typography, no replica): a small header MEMO, a rule, the rule typed in a typewriter face
//     (Courier 10 Pitch), an ink underline drawn by hand, the source line at the foot. It can turn around its vertical axis (flip) and show
//     an engraved back: (A) a firefly taking a figure's place, the figure dotted and fading; an ink line strikes A through; (B) a figure and a
//     firefly building one big arch together, the arch turns gold.
//     o = { x, y (centre, screen), s 1 (sheet = 820 × 1060 px at s 1), rot 0, tilt 0 (slight perspective lean, −.2….2),
//           type 0..1 (typing progress of the body; 1 = all typed), typeAt (time: types at ~22 chars/s from then; overrides type),
//           underline 0..1 (the ink line under "demonstrate why"), header true, source 0..1 (the source line at the foot),
//           text (override the body), under 'demonstrate why' (the phrase to underline), sourceText 'TOBI LÜTKE · SHOPIFY MEMO · 7 APR 2025',
//           flip 0..1 (0 front, .5 edge-on, 1 back; the sheet turns about its vertical axis, front and back are both drawn correctly),
//           backA 0..1 (engraving A drawn in), strike 0..1 (ink line through A), backB 0..1 (engraving B drawn in), gold 0..1 (B's arch turns gold),
//           light 1, shadow 1, lift 0 (px above the ground: bigger, softer shadow) }
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, sm, eio, eout, prng, canvas, rough, poly, text } from '../engine.mjs';

const TAU = Math.PI * 2;
const eoutX = (x) => (x = clamp(x), x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const MEMO = { w: 820, h: 1060, ink: '#2a2420', paper: '#f1ead8', red: '#b23a2a' };
export const SHOPIFY = 'Before asking for more Headcount and resources, teams must demonstrate why they cannot get what they want done using AI.';

const IM = new Map(); let PEND = [];
function cached(key, w, h, paint) {
  let e = IM.get(key); if (e) return e.img || e.c;
  const [c, g] = canvas(w, h); paint(g, c); e = { c, img: null }; IM.set(key, e);
  PEND.push(loadImage(c.toBuffer('image/png')).then((im) => { e.img = im; e.c = null; }));
  return c;
}
export async function memoReady() { paperTex(false); paperTex(true); while (PEND.length) { const p = PEND; PEND = []; await Promise.all(p); } }
function paperTex(back) {
  return cached('memo:' + (back ? 'b' : 'f'), MEMO.w, MEMO.h, (g) => {
    const w = MEMO.w, h = MEMO.h, r = prng(back ? 41 : 29);
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, back ? '#ece3cf' : '#f7f1e2'); gr.addColorStop(1, back ? '#d9ccb0' : '#e6dcc4'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.lineCap = 'round';
    for (let i = 0; i < 2600; i++) { const x = r() * w, y = r() * h, L = 4 + r() * 22, a = r() * TAU; g.strokeStyle = r() < .55 ? `rgba(120,96,60,${.04 + r() * .08})` : `rgba(255,252,244,${.1 + r() * .2})`; g.lineWidth = .5 + r() * .8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); }
    // two soft folds (it was folded in three)
    for (const fy of [h / 3, 2 * h / 3]) { const fg = g.createLinearGradient(0, fy - 18, 0, fy + 18); fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(.48, 'rgba(90,70,40,.1)'); fg.addColorStop(.52, 'rgba(255,252,244,.3)'); fg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = fg; g.fillRect(0, fy - 18, w, 36); }
    if (back) { g.save(); g.translate(w, 0); g.scale(-1, 1); g.globalAlpha = .06; g.fillStyle = '#2a2420'; for (let i = 0; i < 9; i++) g.fillRect(90, 260 + i * 62, 560 - (i % 3) * 90, 18); g.restore(); }   // show-through of the typing
    const v = g.createRadialGradient(w / 2, h / 2, h * .3, w / 2, h / 2, h * .75); v.addColorStop(0, 'rgba(80,60,30,0)'); v.addColorStop(1, 'rgba(80,60,30,.14)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
  });
}
// typed layout (local units, origin top-left of the sheet)
const LAYC = new Map();
function lay(body) {
  if (LAYC.has(body)) return LAYC.get(body);
  const [, g] = canvas(8, 8), size = 34, font = `${size}px "Courier 10 Pitch"`; g.font = font;
  const maxW = MEMO.w - 170, words = body.split(' '), out = []; let x = 0, y = 0, line = 0, ci = 0; const sp = g.measureText(' ').width, lh = size * 1.55;
  for (const w of words) { const ww = g.measureText(w).width; if (x > 0 && x + ww > maxW) { x = 0; line++; } out.push({ w, x: 85 + x, y: 330 + line * lh, wd: ww, c0: ci }); x += ww + sp; ci += w.length + 1; }
  const L = { words: out, size, font, lh, chars: ci, lines: line + 1 }; LAYC.set(body, L); return L;
}

export function paperMemo(ctx, t, o = {}) {
  const x = o.x ?? W / 2, y = o.y ?? H / 2, s = o.s ?? 1, rot = o.rot ?? 0, flip = clamp(o.flip ?? 0), body = o.text || SHOPIFY, L = lay(body);
  const ang = flip * Math.PI, cs = Math.cos(ang), back = cs < 0, sx = Math.max(.002, Math.abs(cs)), w = MEMO.w, h = MEMO.h;
  const typed = o.typeAt != null ? clamp((t - o.typeAt) * (o.cps ?? 22), 0, L.chars) : clamp(o.type ?? 1) * L.chars;
  const edge = rough([[0, 0], [w, 0], [w, h], [0, h]], 2, 13, { step: 16 });
  // shadow (drawn in screen space under the sheet, follows the turning width)
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const lift = o.lift ?? 0;
  if ((o.shadow ?? 1) > 0) { ctx.save(); ctx.scale(s * sx, s); ctx.shadowColor = `rgba(0,0,0,${.5 * (o.shadow ?? 1)})`; ctx.shadowBlur = (24 + lift) * s; ctx.shadowOffsetX = (10 + lift * .5) * s; ctx.shadowOffsetY = (16 + lift) * s; ctx.translate(-w / 2, -h / 2); ctx.fillStyle = '#000'; poly(ctx, edge); ctx.fill(); ctx.restore(); }
  // the turning: scale x by |cos|, with a slight perspective shear while edge-on
  const tilt = (o.tilt ?? 0) + Math.sin(ang) * .12;
  ctx.transform(sx, tilt * sx * .25, 0, 1, 0, 0); ctx.scale(s, s); if (back) ctx.scale(-1, 1); ctx.translate(-w / 2, -h / 2);
  ctx.save(); poly(ctx, edge); ctx.clip(); ctx.drawImage(paperTex(back), 0, 0, w, h);
  // the light across the sheet changes as it turns
  const lg = ctx.createLinearGradient(0, 0, w, 0); lg.addColorStop(0, rgba('#fffaf0', .12 * (o.light ?? 1) * (1 - Math.abs(Math.sin(ang))))); lg.addColorStop(1, rgba('#3a2a10', .1 + .25 * Math.abs(Math.sin(ang)))); ctx.fillStyle = lg; ctx.fillRect(0, 0, w, h);
  if (!back) front(ctx, t, o, L, typed); else backSide(ctx, t, o);
  ctx.restore();
  ctx.strokeStyle = 'rgba(90,70,50,.4)'; ctx.lineWidth = 1.2; poly(ctx, edge); ctx.stroke();
  ctx.restore();
  // screen mapping of a local point (front side)
  const toScreen = (px, py) => { const X = (px - w / 2) * s * sx * (back ? -1 : 1), Y = (py - h / 2) * s + X * tilt * .25, c = Math.cos(rot), sn = Math.sin(rot); return [x + X * c - Y * sn, y + X * sn + Y * c]; };
  const word = (k) => { const wd = typeof k === 'number' ? L.words[k] : L.words.find((q) => q.w.replace(/\W/g, '') === String(k).replace(/\W/g, '')); if (!wd) return null; const a = toScreen(wd.x, wd.y - L.size * .75), b = toScreen(wd.x + wd.wd, wd.y + L.size * .2); return { x: Math.min(a[0], b[0]), y: a[1], w: Math.abs(b[0] - a[0]), h: b[1] - a[1] }; };
  const a = toScreen(0, 0);
  return { rect: { x: a[0], y: a[1], w: w * s * sx, h: h * s }, toScreen, word, side: back ? 'back' : 'front' };
}

function front(ctx, t, o, L, typed) {
  const ink = MEMO.ink;
  if (o.header !== false) {
    text(ctx, 'MEMO', 85, 150, { size: 30, weight: 600, color: rgba(ink, .9), spacing: 14 });
    ctx.strokeStyle = rgba(ink, .55); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(85, 182); ctx.lineTo(MEMO.w - 85, 182); ctx.stroke();
    // header fields as unreadable typed marks (no invented names)
    ctx.fillStyle = rgba(ink, .35); for (let i = 0; i < 2; i++) { ctx.fillRect(85, 212 + i * 34, 52, 3); for (let j = 0; j < 7; j++) ctx.fillRect(160 + j * 38, 212 + i * 34, 26 - (j * 7 % 11), 3); }
  }
  // the typed body: characters appear one by one, each struck with a little more ink at first
  ctx.font = L.font; ctx.textBaseline = 'alphabetic';
  for (const wd of L.words) {
    const n = clamp(typed - wd.c0, 0, wd.w.length); if (n <= 0) continue;
    const part = wd.w.slice(0, Math.floor(n)), r = prng(wd.c0 + 3);
    let xx = wd.x; for (let i = 0; i < part.length; i++) { const ch = part[i], age = typed - wd.c0 - i, a = .82 + .1 * r() + .08 * Math.exp(-age * .5); ctx.fillStyle = rgba(ink, a); ctx.fillText(ch, xx + (r() - .5) * .8, wd.y + (r() - .5) * 1.1); xx += ctx.measureText(ch).width; }
  }
  // the hand-drawn ink underline under the phrase
  const under = (o.under || 'demonstrate why').split(' '), i0 = L.words.findIndex((q, i) => under.every((u, j) => L.words[i + j] && L.words[i + j].w.replace(/\W/g, '') === u.replace(/\W/g, '')));
  const uu = clamp(o.underline ?? 0);
  if (i0 >= 0 && uu > 0) {
    const segs = []; for (let j = 0; j < under.length; j++) segs.push(L.words[i0 + j]);
    const lines = []; for (const sg of segs) { const l = lines.find((q) => q.y === sg.y); if (l) l.x1 = sg.x + sg.wd; else lines.push({ y: sg.y, x0: sg.x, x1: sg.x + sg.wd }); }
    const tot = lines.reduce((a, l) => a + l.x1 - l.x0, 0); let left = tot * eoutX(uu);
    ctx.save(); ctx.strokeStyle = rgba('#1b2a6b', .9); ctx.lineCap = 'round';
    for (const l of lines) { const len = Math.min(left, l.x1 - l.x0 + 12); if (len <= 0) break; left -= len;
      ctx.beginPath(); const yb = l.y + 12; for (let k = 0; k <= 24; k++) { const q = k / 24, xx = l.x0 - 6 + len * q, yy = yb + 2.2 * Math.sin(q * 5 + 1) - q * 2; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = 3.2; ctx.stroke(); }
    ctx.restore();
  }
  const su = clamp(o.source ?? 0);
  if (su > 0) { ctx.save(); ctx.beginPath(); ctx.rect(80, MEMO.h - 130, (MEMO.w - 160) * eoutX(su), 60); ctx.clip(); ctx.strokeStyle = rgba(ink, .4); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(85, MEMO.h - 118); ctx.lineTo(MEMO.w - 85, MEMO.h - 118); ctx.stroke();
    text(ctx, o.sourceText || 'TOBI LÜTKE · SHOPIFY MEMO · 7 APR 2025', 85, MEMO.h - 86, { size: 19, weight: 600, color: rgba(ink, .75), spacing: 3.5 }); ctx.restore(); }
}

// the engraved back: (A) top half, (B) bottom half
function backSide(ctx, t, o) {
  const ink = MEMO.ink, w = MEMO.w, A = clamp(o.backA ?? 0), S = clamp(o.strike ?? 0), B = clamp(o.backB ?? 0), G = clamp(o.gold ?? 0);
  const engr = (u, draw) => { if (u <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w * eoutX(u), MEMO.h); ctx.clip(); draw(); ctx.restore(); };
  // (A): a figure, dotted and fading, and a firefly in its place
  engr(A, () => {
    const gx = 300, gy = 440; ctx.strokeStyle = rgba(ink, .7); ctx.lineWidth = 1.4; ctx.setLineDash([2, 6]); figLine(ctx, gx, gy, 1.5); ctx.setLineDash([]);
    ctx.strokeStyle = rgba(ink, .9); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(520, 330, 14, 0, TAU); ctx.stroke(); for (let k = 0; k < 10; k++) { const q = k / 10 * TAU; ctx.moveTo(520 + Math.cos(q) * 20, 330 + Math.sin(q) * 20); ctx.lineTo(520 + Math.cos(q) * 30, 330 + Math.sin(q) * 30); } ctx.stroke();
    ctx.beginPath(); ctx.moveTo(505, 335); ctx.quadraticCurveTo(420, 360, 330, 300); ctx.setLineDash([3, 5]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(150, gy + 4); ctx.lineTo(650, gy + 4); ctx.stroke(); hatchBand(ctx, 150, gy + 6, 500, 14, ink);
  });
  if (S > 0) { ctx.save(); ctx.strokeStyle = rgba(MEMO.red, .9); ctx.lineCap = 'round'; ctx.lineWidth = 5; ctx.beginPath(); const e = eoutX(S); for (let k = 0; k <= 20; k++) { const q = k / 20 * e, xx = 130 + 560 * q, yy = 470 - 260 * q + 6 * Math.sin(q * 7); k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore(); }
  // (B): a figure and a firefly building one big arch together
  engr(B, () => {
    const by = 900, ax = 410; ctx.strokeStyle = rgba(ink, .9); ctx.lineWidth = 1.4; figLine(ctx, 210, by, 1.4);
    ctx.beginPath(); ctx.moveTo(150, by + 4); ctx.lineTo(670, by + 4); ctx.stroke(); hatchBand(ctx, 150, by + 6, 520, 14, ink);
    // the arch of stones
    for (let k = 0; k < 13; k++) { const q0 = Math.PI - k / 13 * Math.PI, q1 = Math.PI - (k + 1) / 13 * Math.PI, R0 = 150, R1 = 190; ctx.beginPath(); ctx.moveTo(ax + 60 + Math.cos(q0) * R0, by - Math.sin(q0) * R0); ctx.lineTo(ax + 60 + Math.cos(q0) * R1, by - Math.sin(q0) * R1); ctx.lineTo(ax + 60 + Math.cos(q1) * R1, by - Math.sin(q1) * R1); ctx.lineTo(ax + 60 + Math.cos(q1) * R0, by - Math.sin(q1) * R0); ctx.closePath();
      ctx.fillStyle = G > 0 ? rgba('#d9a441', .85 * G) : 'rgba(0,0,0,0)'; ctx.fill(); ctx.strokeStyle = rgba(ink, .85); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(ax + 60, by - 230, 12, 0, TAU); ctx.stroke(); for (let k = 0; k < 10; k++) { const q = k / 10 * TAU; ctx.moveTo(ax + 60 + Math.cos(q) * 17, by - 230 + Math.sin(q) * 17); ctx.lineTo(ax + 60 + Math.cos(q) * 26, by - 230 + Math.sin(q) * 26); } ctx.stroke();
    if (G > 0) { const g = ctx.createRadialGradient(ax + 60, by - 120, 0, ax + 60, by - 120, 260); g.addColorStop(0, rgba('#f3d9a0', .35 * G)); g.addColorStop(1, 'rgba(243,217,160,0)'); ctx.fillStyle = g; ctx.fillRect(ax - 220, by - 380, 560, 400); }
  });
}
function figLine(ctx, x, y, k) {   // an engraved standing figure in outline (feet at x, y)
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.beginPath();
  ctx.moveTo(-6, 0); ctx.lineTo(-5, -42); ctx.moveTo(6, 0); ctx.lineTo(5, -42);
  ctx.moveTo(-12, -38); ctx.bezierCurveTo(-13, -60, -12, -76, -8, -82); ctx.quadraticCurveTo(0, -87, 8, -82); ctx.bezierCurveTo(12, -76, 13, -60, 12, -38); ctx.closePath();
  ctx.moveTo(8.5, -94); ctx.arc(0, -94, 8.5, 0, TAU); ctx.moveTo(10, -76); ctx.lineTo(24, -66); ctx.lineTo(34, -78); ctx.stroke(); ctx.restore();
}
function hatchBand(ctx, x, y, w, h, ink) { ctx.save(); ctx.strokeStyle = rgba(ink, .35); ctx.lineWidth = 1; ctx.beginPath(); for (let q = x; q < x + w; q += 6) { ctx.moveTo(q, y); ctx.lineTo(q - 8, y + h); } ctx.stroke(); ctx.restore(); }
