// Film 6 · c03 helpers (segment 01b: the split, the first and the second, no one who cares, care from outside, the oldest maps).
// Everything here is a pure function of t; screen space 1920×1080 unless a transform is set first.
//
// COPIED kit code (named in the c03 report, never edited in place):
//   lineGround()  = lib/handoff4.mjs linePlate(), re-drawn under a camera with a dip at the split point and a floor below the frame.
//                   With cam = identity and dip = 0 it is pixel-identical to plate(ctx, t, 'line', { y: 540, tone: 'cool' }).
//   emberBody()   = the ember + flame-like core of lib/f6_kit.mjs splitLight() (so the risen ember can travel to a chest).
//   splitThread() / splitLabels() = the warmth thread and the INTELLIGENCE / CONSCIOUSNESS labels of splitLight().
// Own code: paneBack() (the back of a turned pane: nothing, dark), sheetFace() (one sheet drawn in both worlds: the writer's cream
// sheet that ages into the oldest map), devaScript() (Sanskrit-like scribble: a head bar with hanging strokes, unreadable).
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, rough, poly, text } from '../engine.mjs';
import { F6, once, ember, breathe, view, reveal, layer } from './f6_kit.mjs';
import { vnoise } from './art.mjs';
import { inkStroke } from './paper.mjs';

const TAU = Math.PI * 2;
export const LINE_Y = 540;                       // the plate's line (lib/handoff4.mjs HAND['c02>c03'].o.y)
export const FLOOR_Y = 1090;                     // the stage floor: just below the frame at the plate's camera (identity)
export const quartIO = (x) => (x = clamp(x), x < .5 ? 8 * x * x * x * x : 1 - 8 * Math.pow(1 - x, 4));
export const expoOut = (x) => (x = clamp(x), x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const expoIn = (x) => (x = clamp(x), x <= 0 ? 0 : Math.pow(2, 10 * (x - 1)));
// cubic Hermite through keys [[u, f, m], …] (m = slope), monotone when the slopes are kept small
export function hermite(keys, u) {
  u = clamp(u); let i = 0; while (i < keys.length - 2 && keys[i + 1][0] <= u) i++;
  const [u0, f0, m0] = keys[i], [u1, f1, m1] = keys[i + 1], h = u1 - u0, s = (u - u0) / h, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * f0 + (s3 - 2 * s2 + s) * h * m0 + (-2 * s3 + 3 * s2) * f1 + (s3 - s2) * h * m1;
}
// the world rectangle a camera shows (for fills that must cover the frame in world coordinates)
export const worldBox = (m) => ({ x: -m.tx / m.k, y: -m.ty / m.k, w: W / m.k, h: H / m.k });

// ---------------------------------------------------------------- the line plate as the ground of the stage (copied linePlate)
//   lineGround(ctx, t, { cam, dipX 0 (world x of the split, relative to W/2), dip 0..1, floor true })
export function lineGround(ctx, t, o = {}) {
  const cam = o.cam || {}, y = LINE_Y, dip = clamp(o.dip ?? 0), dipX = o.dipX ?? 0;
  ctx.fillStyle = '#0a0c22'; ctx.fillRect(0, 0, W, H);
  view(ctx, cam, 1, (g, m) => {
    const B = worldBox(m);
    const v = g.createRadialGradient(W / 2, y, 0, W / 2, y, W * .7); v.addColorStop(0, 'rgba(40,36,90,.55)'); v.addColorStop(1, 'rgba(10,12,34,0)'); g.fillStyle = v; g.fillRect(B.x, B.y, B.w, B.h);
    if (o.floor !== false && B.y + B.h > FLOOR_Y) { // the floor of the stage (below the plate's frame): a darker plane, a faint lit edge
      g.fillStyle = '#080a1a'; g.fillRect(B.x, FLOOR_Y, B.w, B.y + B.h - FLOOR_Y + 10);
      const fg = g.createLinearGradient(0, FLOOR_Y, 0, FLOOR_Y + 260); fg.addColorStop(0, 'rgba(60,56,110,.16)'); fg.addColorStop(1, 'rgba(60,56,110,0)'); g.fillStyle = fg; g.fillRect(B.x, FLOOR_Y, B.w, 260);
      g.fillStyle = 'rgba(190,210,240,.09)'; g.fillRect(B.x, FLOOR_Y - 1, B.w, 2);
      g.drawImage(floorMist(), B.x, FLOOR_Y + 2, B.w, 320);
    }
    // the plate's drifting diagonal hatching, extended beyond the frame (identical pixels at identity)
    g.strokeStyle = 'rgba(160,150,220,.05)'; g.lineWidth = 1; g.beginPath();
    for (let k = -120; k < 220; k++) { const x = k * 34 + (t * 6) % 34; g.moveTo(x + 520 * 2000 / 1080, -2000); g.lineTo(x - 520 * 3000 / 1080, 3000); } g.stroke();
    // the line: one engraved filament with its glow, the engraving ticks; a dip where the ember tears itself off
    const col = ['#bfe3ff', '#eef8ff'], L = 1400 + 9 * 300, br = .9 + .1 * Math.sin(t * 2.1);
    g.save(); g.translate(W / 2, y + 2 * Math.sin(t * .9)); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
    const grad = (c, al) => { if (dip <= 0) return rgba(c, al); const gg = g.createLinearGradient(-L, 0, L, 0), s = (x) => clamp((x + L) / (2 * L)); gg.addColorStop(0, rgba(c, al)); gg.addColorStop(s(dipX - 170), rgba(c, al)); gg.addColorStop(s(dipX), rgba(c, al * (1 - dip))); gg.addColorStop(s(dipX + 170), rgba(c, al)); gg.addColorStop(1, rgba(c, al)); return gg; };
    for (const [w, al, c] of [[26, .05, col[0]], [10, .14, col[0]], [3.2, .55 * br, col[0]], [1.4, .95, col[1]]]) { g.strokeStyle = grad(c, al); g.lineWidth = w; g.beginPath(); g.moveTo(-L, 0); g.lineTo(L, 0); g.stroke(); }
    g.strokeStyle = rgba(col[1], .35); g.lineWidth = 1; g.beginPath(); for (let x = -L; x < L; x += 9) { const h = 2 + 1.5 * Math.sin(x * .07 + t); g.moveTo(x, -h); g.lineTo(x + 3, h); } g.stroke();
    g.restore();
  });
}

// a stippled mist lying on the floor (one cached layer, stretched over the visible width)
function floorMist() {
  return layer('c03mist', 1920, 320, (g) => {
    const r = prng(77), vn = vnoise(3);
    for (let i = 0; i < 2600; i++) { const x = r() * 1920, y = Math.pow(r(), 1.6) * 320, n = vn(x * .004, y * .01); if (n < .42) continue; g.fillStyle = rgba('#8c8ccc', (.025 + .05 * (n - .42)) * (1 - y / 320)); g.beginPath(); g.arc(x, y, .8 + r() * 1.4, 0, Math.PI * 2); g.fill(); }
  });
}

// the candle's halo in screen space: a soft radial glow with fine stipple that stays fine at any zoom (the kit bloom is an image
// and goes blotchy when scaled up 9x in the push into the flame)
export function candleHalo(ctx, { x, y, r, a = 1 }) {
  if (r <= 1 || a <= .003) return;
  const P = once('c03halo', () => { const q = prng(31), p = []; for (let i = 0; i < 2600; i++) { const d = Math.sqrt(q()), an = q() * Math.PI * 2; p.push([Math.cos(an) * d, Math.sin(an) * d, d, q()]); } return p; });
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(F6.amberCore, .55 * a)); g.addColorStop(.18, rgba(F6.amber, .3 * a)); g.addColorStop(.55, rgba(F6.amberDeep, .08 * a)); g.addColorStop(1, rgba(F6.amberDeep, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  const dw = 1.3 + Math.min(1.2, r / 900);
  for (const [px, py, d, k] of P) { const al = (1 - d) * (1 - d) * (.12 + .22 * k) * a; if (al < .01) continue; ctx.fillStyle = rgba('#ffd9a0', al); ctx.fillRect(x + px * r - dw / 2, y + py * r - dw / 2, dw, dw); }
  ctx.restore();
}

// ---------------------------------------------------------------- the ember with a body (copied from splitLight), free to travel
//   emberBody(ctx, t, { x, y, r 120, e 1 (0..1 how much of its body it has), a 1, bpm 60 })
export function emberBody(ctx, t, o = {}) {
  const x = o.x, y = o.y, e = clamp(o.e ?? 1), R = o.emberR ?? o.r ?? 120, bpm = o.bpm ?? 60, a = o.a ?? 1;
  ember(ctx, t, { x, y, kind: 'heart', r: R * (.35 + .65 * e), a: (.55 + .45 * e) * a, bpm });
  const n = once('c03splitnoise', () => vnoise(23)), sw = (n(t * 1.6, 1) - .5) * 10 * e, br = breathe(t, bpm, 0, 'heart');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.translate(x, y); const fh = R * .45 * e * br;
  const fg = ctx.createRadialGradient(0, fh * .1, 0, 0, 0, fh * 1.1); fg.addColorStop(0, rgba('#ffffff', .95)); fg.addColorStop(.25, rgba(F6.amberCore, .9)); fg.addColorStop(.6, rgba(F6.amber, .5)); fg.addColorStop(1, rgba(F6.amberDeep, 0));
  ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(0, fh * .55); ctx.bezierCurveTo(-fh * .6, fh * .2, -fh * .45, -fh * .5, sw * .3, -fh); ctx.bezierCurveTo(fh * .45, -fh * .5, fh * .6, fh * .2, 0, fh * .55); ctx.fill(); ctx.restore();
}
// the thread of warmth between the line (x, y) and the rising ember (x, ey) while it separates (u < .85)
export function splitThread(ctx, t, { x, y, ey, u }) {
  if (u <= 0 || u >= .85) return; const k = 1 - clamp((u - .55) / .3);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const tg = ctx.createLinearGradient(0, y, 0, ey); tg.addColorStop(0, rgba(F6.cool, .5 * k)); tg.addColorStop(.5, rgba(F6.amber, .6 * k)); tg.addColorStop(1, rgba(F6.amber, .2 * k));
  ctx.strokeStyle = tg; ctx.lineWidth = 2.2 * k + .4; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 12 * Math.sin(t * 2.3), (y + ey) / 2, x, ey + 18); ctx.stroke(); ctx.restore();
}
// the labels: INTELLIGENCE under the line, CONSCIOUSNESS above the ember (mask reveals, la 0..1; a wipe back out when la falls)
export function splitLabels(ctx, { x, y, ey, emberR = 120, la = 1, size = 17 }) {
  if (la <= 0) return;
  const lab = (s, lx, ly, c) => reveal(ctx, lx - 220, ly - size * 1.4, 440, size * 2.2, la, (g) => text(g, s, lx, ly, { size, weight: 600, color: c, align: 'center', spacing: size * .42 }));
  lab('INTELLIGENCE', x, y + 30 + size * 1.1, rgba(F6.cool, .9)); lab('CONSCIOUSNESS', x, ey - 70 - emberR * .18, rgba(F6.amberCore, .92));
}

// ---------------------------------------------------------------- the BACK of a turned pane: dark glass, nothing behind it
//   paneBack(ctx, t, { x, y, w, h, yaw (rad, measured from the back-facing position: 0 = we look straight at the back), radius 4 })
export function paneBack(ctx, t, o) {
  const { x, y, w, h } = o, yaw = o.yaw || 0, cy = Math.max(.08, Math.cos(yaw)), rad = o.radius ?? 4;
  ctx.save(); ctx.translate(x, y); ctx.scale(cy, 1);
  if (Math.abs(yaw) > .02) { const side = -Math.sign(yaw), th = Math.min(14, Math.abs(Math.sin(yaw)) * 40) / cy; ctx.fillStyle = '#1e2740'; ctx.fillRect(side > 0 ? w / 2 : -w / 2 - th, -h / 2, th, h); }
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, rad); ctx.clip();
  const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, '#070a1a'); g.addColorStop(1, '#04050d'); ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h);
  const sx = w * (.3 + .04 * Math.sin(t * .4)) - w / 2, bw = Math.max(80, w * .27); ctx.save(); ctx.translate(sx, 0); ctx.rotate(.5); const s = ctx.createLinearGradient(-bw, 0, bw, 0); s.addColorStop(0, 'rgba(216,247,255,0)'); s.addColorStop(.5, 'rgba(216,247,255,.035)'); s.addColorStop(1, 'rgba(216,247,255,0)'); ctx.fillStyle = s; ctx.fillRect(-bw, -h * 2, bw * 2, h * 4); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.scale(cy, 1); ctx.strokeStyle = '#1a1f33'; ctx.lineWidth = 3 / cy; ctx.strokeRect(-w / 2 - 1.5, -h / 2 - 1.5, w + 3, h + 3);
  ctx.strokeStyle = rgba(F6.cool, .1); ctx.lineWidth = 1.2 / cy; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, rad); ctx.stroke(); ctx.restore();
}

// ---------------------------------------------------------------- the sheet (drawn in sheet-local units 0..w × 0..h under the caller's transform)
// One function for both worlds so the push into the paper and the pull-out of the old map meet pixel-exact.
//   sheetFace(g, t, { w, h, px (screen px per local unit: fibres and ink keep their pixel width), age 0..1 (cream → parchment),
//                     words: { list, u (words pressed, fractional), rows: [[i0, i1, x, y], …], size }, diag 0..1 (the engraved diagram),
//                     shadow true, seed })
export function sheetFace(g, t, o) {
  const { w, h } = o, px = Math.max(.05, o.px ?? 1), age = clamp(o.age ?? 0), seed = o.seed ?? 9;
  const edge = once(`c03sheet:${w}x${h}:${seed}`, () => rough([[0, 0], [w, 0], [w, h], [0, h]], Math.max(.6, w * .004), seed, { step: Math.max(6, w / 22) }));
  const shk = (o.shadowK ?? 1) * h / 167;
  if (o.shadow !== false) { for (const [dx, dy, al] of [[14, 20, .12], [9, 13, .16], [5, 7, .22]]) { g.save(); g.translate(dx * shk, dy * shk); g.fillStyle = `rgba(2,2,8,${al})`; poly(g, edge); g.fill(); g.restore(); } }
  // the paper: cream when young; with age the tone warms and darkens, the margins brown
  const c0 = mixHex('#fbf3e1', '#e9d6ae', age), c1 = mixHex('#efe4cc', '#d6bf93', age), c2 = mixHex('#c9b894', '#9d7f52', age);
  const pg = g.createLinearGradient(0, 0, w * .8, h); pg.addColorStop(0, c0); pg.addColorStop(.5, c1); pg.addColorStop(1, c2); g.fillStyle = pg; poly(g, edge); g.fill();
  g.save(); poly(g, edge); g.clip();
  // fibres: deterministic short strokes in local units, 1 px wide on screen whatever the zoom
  const FIB = once(`c03fib:${w}x${h}:${seed}`, () => { const r = prng(seed * 7 + 1), f = []; for (let i = 0; i < 900; i++) f.push([r() * w, r() * h, (r() - .5) * 2.6, (.02 + r() * .07) * w, r(), .2 + r() * .3]); return f; });
  g.lineCap = 'round';
  for (const [x, y, a, Ln, k, lw] of FIB) { g.lineWidth = Math.max(lw, .9 / px); g.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', .08 + .1 * k); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * Ln, y + Math.sin(a) * Ln); g.stroke(); }
  if (age > 0) { // foxing and a darker rim as the sheet ages (drawn, no alpha fade of the sheet itself)
    const ST = once(`c03stain:${w}x${h}:${seed}`, () => { const r = prng(seed * 3 + 5), s = []; for (let i = 0; i < 46; i++) s.push([r() * w, r() * h, (.02 + r() * .06) * w, r(), r()]); return s; });
    for (const [x, y, r, k, k2] of ST) { const al = clamp((age - k2 * .5) / .5) * (.05 + .1 * k); if (al <= 0) continue; const sg = g.createRadialGradient(x, y, 0, x, y, r); sg.addColorStop(0, rgba('#7a5a2c', al)); sg.addColorStop(1, rgba('#7a5a2c', 0)); g.fillStyle = sg; g.beginPath(); g.ellipse(x, y, r, r * .7, k * 3, 0, TAU); g.fill(); }
    const rim = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .3, w / 2, h / 2, Math.max(w, h) * .62); rim.addColorStop(0, 'rgba(90,60,20,0)'); rim.addColorStop(1, rgba('#5a3c14', .3 * age)); g.fillStyle = rim; g.fillRect(0, 0, w, h);
  }
  if (o.content) o.content(g, w, h);
  g.restore();
  g.strokeStyle = rgba('#5a4630', .35 + .25 * age); g.lineWidth = 1.3 / px; poly(g, edge); g.stroke();
}
const hex2 = (hh) => { const n = parseInt(hh.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
export const mixHex = (a, b, u) => { const A = hex2(a), B = hex2(b); return '#' + A.map((v, i) => Math.round(mix(v, B[i], clamp(u))).toString(16).padStart(2, '0')).join(''); };

// ---------------------------------------------------------------- the oldest map: an engraved line, a flame above it, Sanskrit-like notes
//   diagram(g, t, { w, h, u 0..1 (drawn in order: the line, the flame, the notes), px, ink, sy (pre-stretch of the flame against the squash) })
export function diagram(g, t, o) {
  const { w, h } = o, u = clamp(o.u ?? 1), ink = o.ink || '#3a2814', px = o.px ?? 1, sy = o.sy ?? 1 / .7; if (u <= 0) return;
  const lw = 1.5 / Math.max(.3, px) * Math.min(px, 3);   // ~1.5 px thin at the map's size, thicker inside the paper
  // 1 · the line (u 0..0.3)
  const y0 = h * .6, x0 = w * .14, x1 = w * .86, LP = Array.from({ length: 48 }, (_, i) => [mix(x0, x1, i / 47), y0 + Math.sin(i * .9) * .25 * h * .004]);
  inkStroke(g, LP, clamp(u / .3), { w: lw * 1.1, ink, seed: 4 });
  // 2 · the flame: two strokes meeting at the tip (u 0.3..0.65), its base on the line
  const fx = w * .5, base = y0 - h * .01, fh = h * .34 * sy, fw = w * .07, pts = (side) => Array.from({ length: 30 }, (_, i) => { const q = i / 29, yy = base - fh * q, ww = fw * Math.sin(Math.PI * Math.min(1, q * 1.15)) * (1 - q * .15); return [fx + side * ww * (1 + .25 * Math.sin(q * 5)), yy]; });
  inkStroke(g, pts(-1), clamp((u - .3) / .18), { w: lw, ink, seed: 5 }); inkStroke(g, pts(1), clamp((u - .46) / .18), { w: lw, ink, seed: 6 });
  // a small inner tongue
  inkStroke(g, Array.from({ length: 22 }, (_, i) => { const a = -Math.PI / 2 + (i / 21) * Math.PI * 2; return [fx + fw * .3 * Math.cos(a) * (1 - .35 * Math.max(0, -Math.sin(a))), base - fh * .28 + fh * .26 * Math.sin(a) * (Math.sin(a) > 0 ? 1.1 : .7)]; }), clamp((u - .6) / .1), { w: lw * .8, ink, seed: 7 });
  // 3 · notes (u 0.65..1): a word under the line's left, a word by the flame, a word under the right
  devaScript(g, w * .15, h * .74, w * .22, h * .034 * sy, clamp((u - .66) / .14), { ink, px, seed: 11, lw: lw * .7 });
  devaScript(g, w * .63, y0 - fh * .5, w * .16, h * .03 * sy, clamp((u - .8) / .12), { ink, px, seed: 12, lw: lw * .7 });
  devaScript(g, w * .62, h * .74, w * .2, h * .034 * sy, clamp((u - .9) / .1), { ink, px, seed: 13, lw: lw * .7 });
}
// unreadable Sanskrit-like writing: a head bar, strokes hanging from it with hooks and loops; u draws it left to right
export function devaScript(g, x, y, w, size, u, o = {}) {
  u = clamp(u); if (u <= 0) return; const r = prng(o.seed ?? 3), px = o.px ?? 1, ink = o.ink || '#3a2814';
  g.save(); g.strokeStyle = ink; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = o.lw ?? Math.max(.4, size * .07);
  const n = 6 + Math.floor(r() * 5), parts = []; let cx = x;
  for (let i = 0; i < n; i++) { const gw = size * (.42 + r() * .4); parts.push([cx, gw, r(), r(), r()]); cx += gw + size * .14; if (r() < .3) cx += size * .4; }
  const total = cx - x, lim = x + total * u;
  g.beginPath(); g.moveTo(x, y); g.lineTo(Math.min(lim, x + total), y); g.stroke();    // the head bar
  for (const [gx, gw, k1, k2, k3] of parts) {
    if (gx > lim) break; const e = Math.min(gw, lim - gx) / gw; g.beginPath();
    g.moveTo(gx + gw * .3, y); g.lineTo(gx + gw * .3, y + size * (.6 + .4 * k1) * e);
    if (k2 < .5) { g.moveTo(gx + gw * .3, y + size * .45 * e); g.quadraticCurveTo(gx + gw * .95, y + size * .5, gx + gw * .8, y + size * .95 * e); }
    else { g.moveTo(gx + gw * .05, y + size * .5); g.lineTo(gx + gw * .3, y + size * .5); }
    if (k3 < .35) { g.moveTo(gx + gw * .4, y - size * .15); g.lineTo(gx + gw * .7, y - size * .32); }
    else if (k3 > .8) { g.moveTo(gx + gw * .3, y + size * .75 * e); g.quadraticCurveTo(gx + gw * .05, y + size * .9, gx + gw * .2, y + size * 1.05 * e); }
    g.stroke();
  }
  g.restore();
}
