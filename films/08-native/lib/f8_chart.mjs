// Film 8 · paper-and-ink cards (owner: B2, chunks c06–c08). Other builders import, never edit.
// Everything draws in the CURRENT transform (call it inside your camera/plane transform; sizes are in those units).
//
//   await chartReady()                           build the cached paper/tile images (call once in your async default export)
//   INK = { paper '#e9e4d8', ink '#2a2420', red '#b23a2a', cream '#f3ecda', faint }
//   paperGround(ctx, x, y, w, h, { tone INK.paper, seed 1, grain 1, light [x,y] })   a sheet of printing paper (fibre, soft light),
//                                                no edge (the paper that fills the world); cached tile, drawn in world units
//   chartCard(ctx, t, o) → { P(u,v) → [x,y] (plot coords, v 0 = bottom), rect, plot {x,y,w,h}, tiles(bar i) → [[x,y,s]…] }
//     o = { x, y, w, h (card rect), rot 0, sheet false (true: no card edge/shadow, the chart is drawn straight on the paper),
//           tone INK.paper, frame 1 (engraved double plate mark 0..1), plot [l,t,r,b] fractions (default [.1,.16,.9,.8]),
//           axis 0..1 (baseline draws itself),
//           bars [{ c (centre u), w (width u), v (height 0..1), grow 0..1 (outline grows up), rain { t0, dur } (tiles fall in),
//                   close 0..1 (top cap + solid edge), label, lu 0..1, value, vu 0..1, valueSize, drop { t0, dur, g } (tiles fall out
//                   downward, staggered) , tile 9 (tile size in units) }],
//           lines [{ pts [[u,v]…] (plot coords) | f(u) → v, u 0..1 (drawn from the left), from 0, col 'ink'|'red', w 3,
//                    dotted 0..1, label, lu, labelAt [u,v], arrow 0..1, extend (px past the last point, arrow) }],
//           texts [{ text, at [u,v] (plot coords) | xy [x,y] (card units 0..w,0..h), size 40, font 'serif'|'caps'|'sans',
//                    col 'ink'|'red', u 0..1 (mask reveal left→right), align 'left', snap 0 (time since the snap: a small
//                    ≤5 % settle) }],
//           marks [{ at [u,v], u 0..1, col 'red', r 18 }] (a hand-drawn circle around a point),
//           source, su 0..1 (Inter caps source line, bottom left of the card) }
//   reportCover(ctx, t, o) → { rect, page {x,y,w,h}, corner [x,y] }
//     o = { x, y, w 760, h 980, rot 0, open 0..1 (the cover swings open to the left about its spine, quart in-out),
//           title 'WORLD DEVELOPMENT REPORT 2026', sub '…', source, su 0..1, page(ctx, t, rect) on the opened right page,
//           mark 0..1 (red margin mark on the open page, drawn along its stroke) }
//   inkStrokePath(ctx, pts, u, { w, col, seed })   a pressure-varying ink line drawn up to u (no fade)
import { loadImage } from '@napi-rs/canvas';
import { rgba, clamp, mix, eio, prng, canvas, rough, poly } from '../engine.mjs';
import { qio, eoutX } from './f8_kit.mjs';

const TAU = Math.PI * 2;
export const INK = { paper: '#e9e4d8', ink: '#2a2420', red: '#b23a2a', cream: '#f3ecda', faint: '#8a7d68' };

// ---------------------------------------------------------------- caches (canvas → Image; drawImage(<Canvas>) leaks)
const IM = new Map(); let PEND = [];
function cached(key, w, h, paint) {
  let e = IM.get(key); if (e) return e.img || e.c;
  const [c, g] = canvas(w, h); paint(g, c); e = { c, img: null }; IM.set(key, e);
  PEND.push(loadImage(c.toBuffer('image/png')).then((im) => { e.img = im; e.c = null; }));
  return c;
}
export async function chartReady() { fibreTile(); tileSprite(INK.ink); while (PEND.length) { const p = PEND; PEND = []; await Promise.all(p); } }

// a 1024² fibre tile: neutral transparent with light and dark fibres + soft clouds (drawn over a flat tone)
const fibreTile = () => cached('fibre', 1024, 1024, (g) => {
  const r = prng(4711), S = 1024; g.lineCap = 'round';
  for (let i = 0; i < 2600; i++) {
    const px = r() * S, py = r() * S, L = 5 + r() * 30, a0 = r() * TAU, bend = (r() - .5) * .9;
    g.strokeStyle = r() < .5 ? `rgba(255,252,244,${.15 + r() * .3})` : `rgba(70,55,35,${.06 + r() * .14})`; g.lineWidth = .5 + r() * .8;
    for (const ox of [0, -S, S]) for (const oy of [0, -S, S]) { if (ox || oy) { if (px + ox < -40 || px + ox > S + 40 || py + oy < -40 || py + oy > S + 40) continue; }
      g.beginPath(); g.moveTo(px + ox, py + oy); g.quadraticCurveTo(px + ox + Math.cos(a0) * L * .5, py + oy + Math.sin(a0) * L * .5, px + ox + Math.cos(a0 + bend) * L, py + oy + Math.sin(a0 + bend) * L); g.stroke(); }
  }
  for (let i = 0; i < 90; i++) { const px = r() * S, py = r() * S, R = 30 + r() * 120, v = r() < .5 ? '255,250,240' : '90,70,40';
    for (const ox of [0, -S, S]) for (const oy of [0, -S, S]) { const gg = g.createRadialGradient(px + ox, py + oy, 0, px + ox, py + oy, R); gg.addColorStop(0, `rgba(${v},${.015 + r() * .02})`); gg.addColorStop(1, `rgba(${v},0)`); g.fillStyle = gg; g.fillRect(px + ox - R, py + oy - R, 2 * R, 2 * R); } }
});
export function paperGround(ctx, x, y, w, h, o = {}) {
  ctx.save(); ctx.fillStyle = o.tone || INK.paper; ctx.fillRect(x, y, w, h);
  if (o.light) { const [lx, ly] = o.light, R = Math.max(w, h) * .8, g = ctx.createRadialGradient(lx, ly, 0, lx, ly, R); g.addColorStop(0, 'rgba(255,252,242,.35)'); g.addColorStop(1, 'rgba(120,100,70,.12)'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); }
  const im = fibreTile(), S = 1024 * (o.scale ?? 1); ctx.globalAlpha = clamp(o.grain ?? 1);
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  // only the tiles that intersect the visible screen (the inverse transform of the screen corners)
  const m = ctx.getTransform(), inv = m.inverse(), cs = [[0, 0], [1920, 0], [0, 1080], [1920, 1080]].map(([a, b]) => [inv.a * a + inv.c * b + inv.e, inv.b * a + inv.d * b + inv.f]);
  const vx0 = Math.max(x, Math.min(...cs.map((p) => p[0]))), vx1 = Math.min(x + w, Math.max(...cs.map((p) => p[0]))), vy0 = Math.max(y, Math.min(...cs.map((p) => p[1]))), vy1 = Math.min(y + h, Math.max(...cs.map((p) => p[1])));
  for (let tx = Math.floor(vx0 / S) * S; tx < vx1; tx += S) for (let ty = Math.floor(vy0 / S) * S; ty < vy1; ty += S) ctx.drawImage(im, tx, ty, S + .5, S + .5);
  ctx.restore();
}

// ---------------------------------------------------------------- ink helpers
export function inkStrokePath(ctx, pts, u = 1, o = {}) {
  u = clamp(u); if (u <= 0 || pts.length < 2) return;
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const end = L[L.length - 1] * u, w = o.w ?? 3, r = prng(o.seed ?? 3);
  ctx.save(); ctx.strokeStyle = o.col || INK.ink; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (o.dash) ctx.setLineDash(o.dash);
  if (o.even || o.dash) { ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { if (L[i] <= end) ctx.lineTo(pts[i][0], pts[i][1]); else { const q = (end - L[i - 1]) / (L[i] - L[i - 1]); ctx.lineTo(mix(pts[i - 1][0], pts[i][0], q), mix(pts[i - 1][1], pts[i][1], q)); break; } } ctx.stroke(); ctx.restore(); return; }
  for (let i = 1; i < pts.length; i++) {
    if (L[i - 1] >= end) break; let [bx, by] = pts[i]; if (L[i] > end) { const q = (end - L[i - 1]) / (L[i] - L[i - 1]); bx = mix(pts[i - 1][0], bx, q); by = mix(pts[i - 1][1], by, q); }
    const f = L[i] / L[L.length - 1]; ctx.lineWidth = w * (.75 + .25 * Math.sin(f * 11 + (o.seed ?? 3)) + .1 * r());
    ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(bx, by); ctx.stroke();
  }
  ctx.restore();
}
function font(ctx, kind, size) { ctx.font = kind === 'serif' ? `${size}px "Instrument Serif"` : `${kind === 'caps' ? 600 : 500} ${size}px "Inter"`; try { ctx.letterSpacing = kind === 'caps' ? `${(size * .22).toFixed(1)}px` : '0px'; } catch { } }
// text with a left→right mask reveal (never moving while read; snap = a small settle when it lands)
export function inkText(ctx, s, x, y, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return 0;
  const size = o.size ?? 40, kind = o.font || 'serif'; ctx.save(); font(ctx, kind, size); ctx.textBaseline = 'alphabetic';
  const tw = ctx.measureText(s).width, align = o.align || 'left', x0 = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
  if (u < 1) { ctx.beginPath(); ctx.rect(x0 - 4, y - size * 1.1, (tw + 8) * eoutX(u) + 2, size * 1.5); ctx.clip(); }
  const sn = o.snap != null && o.snap >= 0 ? 1 + .045 * Math.exp(-o.snap * 9) * Math.cos(o.snap * 26) : 1;
  if (sn !== 1) { ctx.translate(x0 + tw / 2, y - size * .35); ctx.scale(sn, sn); ctx.translate(-(x0 + tw / 2), -(y - size * .35)); }
  ctx.fillStyle = o.color || INK.ink; ctx.globalAlpha = o.alpha ?? 1;
  if (kind === 'serif' && /[≈−]/.test(s)) {   // glyphs Instrument Serif lacks: set them in Inter, matched to the serif's size
    let xx = x0; for (const ch of s) { if (ch === '≈' || ch === '−') { ctx.font = `400 ${size * .78}px "Inter"`; ctx.fillText(ch, xx, y - size * .04); xx += ctx.measureText(ch).width; font(ctx, kind, size); } else { ctx.fillText(ch, xx, y); xx += ctx.measureText(ch).width; } }
  } else ctx.fillText(s, x0, y);
  ctx.restore(); return tw;
}

// one app tile: a tiny rounded square in ink outline with a faint inner mark (no logo), cached
const tileSprite = (col) => cached('tile:' + col, 40, 40, (g) => {
  g.fillStyle = rgba('#f4efe2', 1); g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.roundRect(4, 4, 32, 32, 9); g.fill(); g.stroke();
  g.fillStyle = rgba(col, .55); g.beginPath(); g.arc(20, 20, 5.5, 0, TAU); g.fill();
  g.strokeStyle = rgba(col, .35); g.lineWidth = 1.4; g.beginPath(); for (let k = 8; k < 34; k += 5) { g.moveTo(k, 30); g.lineTo(k + 4, 34); } g.stroke();
});

// ---------------------------------------------------------------- chart card
// the landed slot centres of bar bi (unrotated card; same geometry chartCard uses) → [{ x, y, row, col, k, rows, cols, ts }]
export function barSlots(o, bi) {
  const x = o.x ?? 360, y = o.y ?? 140, w = o.w ?? 1200, h = o.h ?? 760, pl = o.plot || [.1, .16, .9, .8];
  const plot = { x: w * pl[0], y: h * pl[1], w: w * (pl[2] - pl[0]), h: h * (pl[3] - pl[1]) }, B = o.bars[bi], ts = B.tile ?? 9;
  const bw = B.w * plot.w, bh = B.v * plot.h, cx = plot.x + B.c * plot.w, by = plot.y + plot.h, bx = cx - bw / 2, G = barGrid(B, bw, bh, ts), out = [];
  for (let k = 0; k < G.n; k++) { const row = Math.floor(k / G.cols), col = k % G.cols; out.push({ x: x + bx + G.ox + col * (ts + G.gap) + ts / 2, y: y + by - (row + 1) * (ts + G.gap) + ts / 2, row, col, k, rows: G.rows, cols: G.cols, ts }); }
  return out;
}
export function drawTile(ctx, x, y, size, rot = 0) { const im = tileSprite(INK.ink); if (rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.drawImage(im, -size / 2, -size / 2, size, size); ctx.restore(); } else ctx.drawImage(im, x - size / 2, y - size / 2, size, size); }
const barGrid = (B, bw, bh, ts) => { const gap = ts * .28, cols = Math.max(1, Math.floor((bw - gap) / (ts + gap))), rows = Math.max(1, Math.floor((bh - gap) / (ts + gap))); return { cols, rows, gap, n: cols * rows, ox: (bw - cols * (ts + gap) + gap) / 2 }; };
export function chartCard(ctx, t, o = {}) {
  const x = o.x ?? 360, y = o.y ?? 140, w = o.w ?? 1200, h = o.h ?? 760, rot = o.rot ?? 0, seed = o.seed ?? 5;
  const pl = o.plot || [.1, .16, .9, .8], plot = { x: w * pl[0], y: h * pl[1], w: w * (pl[2] - pl[0]), h: h * (pl[3] - pl[1]) };
  const P = (u, v) => [plot.x + u * plot.w, plot.y + (1 - v) * plot.h];
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  // the card: deckled edge, soft shadow, paper, fibre (o.sheet: drawn straight on the surrounding paper)
  if (!o.sheet) {
    const edge = rough([[0, 0], [w, 0], [w, h], [0, h]], Math.max(1.2, w * .003), seed, { step: 14 });
    ctx.save(); ctx.shadowColor = 'rgba(40,28,16,.35)'; ctx.shadowBlur = 22; ctx.shadowOffsetX = 6; ctx.shadowOffsetY = 12; ctx.fillStyle = o.tone || INK.paper; poly(ctx, edge); ctx.fill(); ctx.restore();
    ctx.save(); poly(ctx, edge); ctx.clip(); paperGround(ctx, 0, 0, w, h, { tone: o.tone || INK.paper, light: [w * .3, -h * .2], seed }); ctx.restore();
    ctx.strokeStyle = 'rgba(90,70,50,.4)'; ctx.lineWidth = 1.2; poly(ctx, edge); ctx.stroke();
  }
  const fr = clamp(o.frame ?? 1);
  if (fr > 0) {   // the plate mark: a fine double rule drawn on with a burin
    ctx.save(); ctx.strokeStyle = rgba(INK.ink, .45); ctx.lineCap = 'round';
    for (const [ins, lw] of [[w * .035, 1.3], [w * .035 + 8, .7]]) {
      const Q = [[ins, ins], [w - ins, ins], [w - ins, h - ins], [ins, h - ins], [ins, ins]]; let d = 2 * (w + h - 4 * ins) * eio(fr);
      ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(Q[0][0], Q[0][1]);
      for (let i = 1; i < 5 && d > 0; i++) { const L = Math.hypot(Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1]), q = Math.min(1, d / L); ctx.lineTo(mix(Q[i - 1][0], Q[i][0], q), mix(Q[i - 1][1], Q[i][1], q)); d -= L; }
      ctx.stroke();
    }
    ctx.restore();
  }
  // baseline + faint engraved ticks
  const ax = clamp(o.axis ?? 1);
  if (ax > 0) {
    ctx.save(); ctx.strokeStyle = rgba(INK.ink, .8); ctx.lineWidth = 2; const [bx0, by] = P(0, 0); ctx.beginPath(); ctx.moveTo(bx0 - 10, by); ctx.lineTo(bx0 - 10 + (plot.w + 20) * eio(ax), by); ctx.stroke();
    ctx.strokeStyle = rgba(INK.ink, .22); ctx.lineWidth = 1; ctx.beginPath(); for (let k = 1; k <= 4; k++) { const yy = plot.y + plot.h * (1 - k / 4); ctx.moveTo(plot.x, yy); ctx.lineTo(plot.x + plot.w * eio(ax), yy); } ctx.setLineDash([2, 7]); ctx.stroke(); ctx.restore();
  }
  // bars of falling tiles
  const tilesOf = [];
  (o.bars || []).forEach((B, bi) => {
    const ts = B.tile ?? 9, bw = B.w * plot.w, bh = B.v * plot.h, [cx, by] = P(B.c, 0), bx = cx - bw / 2, top = by - bh, G = barGrid(B, bw, bh, ts);
    const gr = clamp(B.grow ?? 1), im = tileSprite(INK.ink), out = [];
    // the outline: two sides grow up from the foot, the cap closes on `close`
    ctx.save(); ctx.strokeStyle = rgba(INK.ink, .85); ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    const gh = bh * eio(gr); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by - gh); ctx.moveTo(bx + bw, by); ctx.lineTo(bx + bw, by - gh); ctx.stroke();
    const cl = clamp(B.close ?? 0); if (cl > 0) { ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx, top); ctx.lineTo(bx + bw * eoutX(cl), top); ctx.stroke(); }
    ctx.restore();
    // tiles: slot k (row-major from the bottom) lands at t0 + dur * f(k); before that it falls from above with gravity
    if (B.rain) {
      const { t0, dur } = B.rain, drop = B.drop, r = prng(seed * 31 + bi * 7);
      for (let k = 0; k < G.n; k++) {
        const row = Math.floor(k / G.cols), col = k % G.cols, jit = r(), jit2 = r(), sx = bx + G.ox + col * (ts + G.gap), sy = by - (row + 1) * (ts + G.gap);
        const f = Math.pow((row + jit * .9) / G.rows, .85), land = t0 + dur * clamp(f), fallT = .55 + .25 * jit2, s0 = land - fallT;
        if (t < s0 || (B.skip && B.skip(k, t))) continue;
        let px = sx, py = sy, a = 0;
        if (t < land) { const q = (t - s0) / fallT; py = sy - (1 - q * q) * (plot.h * 1.1 + 200 * jit2); px = sx + (1 - q) * (jit - .5) * 60; a = (1 - q) * (jit2 - .5) * 1.6; }
        if (drop && t > drop.t0) {   // released: falls out downward (staggered from the top rows), tumbling
          const st = drop.t0 + (drop.dur ?? 1.2) * ((G.rows - row - jit * .8) / G.rows), dt = t - st;
          if (dt > 0) { const g = drop.g ?? 2600; py += g * dt * dt * .5; px += (jit - .5) * 140 * dt; a += (jit2 - .5) * 5 * dt; if (drop.until && py > drop.until(px, k)) continue; }
        }
        out.push([px + ts / 2, py + ts / 2, ts, k]);
        if (a) { ctx.save(); ctx.translate(px + ts / 2, py + ts / 2); ctx.rotate(a); ctx.drawImage(im, -ts / 2, -ts / 2, ts, ts); ctx.restore(); } else ctx.drawImage(im, px, py, ts, ts);
      }
    }
    tilesOf[bi] = out;
    if (B.label) inkText(ctx, B.label, cx, by + 46, { size: 26, font: 'caps', u: B.lu ?? 1, align: 'center', color: rgba(INK.ink, .85) });
    if (B.value) inkText(ctx, B.value, B.valueAt ? P(...B.valueAt)[0] : cx, B.valueAt ? P(...B.valueAt)[1] : top - 26, { size: B.valueSize ?? 64, font: 'serif', u: B.vu ?? 1, align: B.valueAlign || 'center', snap: B.vsnap });
  });
  // lines (with branches: give each branch its own line starting at the split point)
  for (const Ln of o.lines || []) {
    const n = 90, pts = [];
    if (typeof Ln.f === 'function') { for (let i = 0; i <= n; i++) { const u = mix(Ln.from ?? 0, Ln.to ?? 1, i / n); pts.push(P(u, Ln.f(u, t))); } }
    else for (const [u, v] of Ln.pts) pts.push(P(u, v));
    const col = Ln.col === 'red' ? INK.red : INK.ink, du = clamp(Ln.u ?? 1);
    const dot = clamp(Ln.dotted ?? 0);
    if (dot > 0) inkStrokePath(ctx, pts, du, { w: (Ln.w ?? 3.4) * mix(1, .8, dot), col, dash: [Math.max(.1, mix(30, 5, dot)), mix(.1, 10, dot)] });
    else inkStrokePath(ctx, pts, du, { w: Ln.w ?? 3.4, col, seed: Ln.seed ?? 7 });
    // the end point (a small ink bead) and an optional arrow past it
    if (du >= 1 && Ln.bead !== false) { const e = pts[pts.length - 1]; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(e[0], e[1], (Ln.w ?? 3.4) * 1.7, 0, TAU); ctx.fill(); }
    if (Ln.arrow > 0) {
      const e = pts[pts.length - 1], p0 = pts[pts.length - 4], an = Math.atan2(e[1] - p0[1], e[0] - p0[0]), ex = (Ln.extend ?? 300) * eoutX(Ln.arrow), hx = e[0] + Math.cos(an) * ex, hy = e[1] + Math.sin(an) * ex;
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = Ln.w ?? 3.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hx - Math.cos(an - .45) * 22, hy - Math.sin(an - .45) * 22); ctx.lineTo(hx, hy); ctx.lineTo(hx - Math.cos(an + .45) * 22, hy - Math.sin(an + .45) * 22); ctx.stroke(); ctx.restore();
    }
    if (Ln.label) { const la = Ln.labelAt ? P(...Ln.labelAt) : [pts[pts.length - 1][0] + 18, pts[pts.length - 1][1] + 9]; inkText(ctx, Ln.label, la[0], la[1], { size: Ln.labelSize ?? 24, font: 'caps', u: Ln.lu ?? 1, color: Ln.col === 'red' ? INK.red : rgba(INK.ink, .85), align: Ln.labelAlign }); }
  }
  for (const M of o.marks || []) {   // a hand-drawn circle around a point
    const u = clamp(M.u ?? 1); if (u <= 0) continue; const [mx, my] = P(...M.at), R = M.r ?? 26, r = prng(M.seed ?? 9), pts = [];
    for (let i = 0; i <= 60; i++) { const q = i / 60 * TAU * 1.12 - .6, rr = R * (1 + .08 * Math.sin(q * 3 + r() * .3)); pts.push([mx + Math.cos(q) * rr * 1.25, my + Math.sin(q) * rr]); }
    inkStrokePath(ctx, pts, u, { w: 3, col: M.col === 'ink' ? INK.ink : INK.red, seed: 4 });
  }
  for (const T of o.texts || []) {
    const [tx, ty] = T.at ? P(...T.at) : T.xy; inkText(ctx, T.text, tx, ty, { size: T.size ?? 40, font: T.font || 'serif', u: T.u ?? 1, color: T.col === 'red' ? INK.red : T.col || INK.ink, align: T.align, snap: T.snap, alpha: T.alpha });
  }
  if (o.source) inkText(ctx, o.source.toUpperCase(), w * .07, h - h * .06, { size: o.sourceSize ?? 17, font: 'caps', u: o.su ?? 1, color: rgba(INK.ink, .62) });
  // map plot coords to the caller's space (the card's rotation applied)
  const c = Math.cos(rot), sn = Math.sin(rot), toOuter = ([px, py]) => [x + px * c - py * sn, y + px * sn + py * c];
  ctx.restore();
  return { P: (u, v) => toOuter(P(u, v)), rect: { x, y, w, h }, plot, tiles: (i) => (tilesOf[i] || []).map(([px, py, s, k]) => [...toOuter([px, py]), s, k]) };
}

// ---------------------------------------------------------------- the printed report cover (8.01, 8.11 in c09)
export function reportCover(ctx, t, o = {}) {
  const w = o.w ?? 760, h = o.h ?? 980, x = o.x ?? 960 - w / 2, y = o.y ?? 540 - h / 2, rot = o.rot ?? 0, op = qio(clamp(o.open ?? 0)), seed = o.seed ?? 12;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const edge = (ww, hh, sd) => rough([[0, 0], [ww, 0], [ww, hh], [0, hh]], 1.6, sd, { step: 14 });
  // the inner right page (visible when the cover opens), with the caller's content
  const page = { x: 0, y: 0, w, h };
  ctx.save(); ctx.shadowColor = 'rgba(30,20,10,.4)'; ctx.shadowBlur = 26; ctx.shadowOffsetX = 8; ctx.shadowOffsetY = 14; ctx.fillStyle = '#efe7d4'; poly(ctx, edge(w, h, seed + 1)); ctx.fill(); ctx.restore();
  if (op > 0) {
    ctx.save(); poly(ctx, edge(w, h, seed + 1)); ctx.clip(); paperGround(ctx, 0, 0, w, h, { tone: '#f1eadb', light: [w * .8, -h * .1] });
    // running text as unreadable engraved lines (no readable sentences), a plain column layout
    ctx.strokeStyle = rgba(INK.ink, .32); ctx.lineWidth = 2.2; ctx.lineCap = 'round'; const r = prng(seed + 5); ctx.beginPath();
    for (let yy = h * .16; yy < h * .9; yy += 22) { if (r() < .08) { yy += 14; continue; } const x0 = w * .12, x1 = w * (.86 - (r() < .15 ? r() * .35 : 0)); let xx = x0; while (xx < x1) { const L = 14 + r() * 50; ctx.moveTo(xx, yy); ctx.lineTo(Math.min(x1, xx + L), yy); xx += L + 9; } }
    ctx.stroke();
    if (o.page) o.page(ctx, t, page);
    if (o.mark > 0) { const pts = []; for (let i = 0; i <= 40; i++) { const q = i / 40; pts.push([w * .07 + 6 * Math.sin(q * 9), h * (.32 + .3 * q)]); } inkStrokePath(ctx, pts, o.mark, { w: 5, col: INK.red, seed: 3 }); }
    // the spine shadow on the page
    const sg = ctx.createLinearGradient(0, 0, w * .12, 0); sg.addColorStop(0, `rgba(60,40,20,${.3 * op})`); sg.addColorStop(1, 'rgba(60,40,20,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, w * .12, h);
    ctx.restore();
  }
  // the cover: swings about the spine (x = 0): horizontal scale cos(π·op); past 90° we see its inside (plain board)
  const sx = Math.cos(Math.PI * op);
  ctx.save(); ctx.scale(sx, 1); if (Math.abs(sx) > .002) {
    const front = sx > 0;
    ctx.save(); ctx.shadowColor = 'rgba(30,20,10,.35)'; ctx.shadowBlur = 18; ctx.shadowOffsetX = 6; ctx.shadowOffsetY = 10; ctx.fillStyle = front ? '#e7dcc2' : '#ddd2b6'; poly(ctx, edge(w, h, seed)); ctx.fill(); ctx.restore();
    ctx.save(); poly(ctx, edge(w, h, seed)); ctx.clip(); paperGround(ctx, 0, 0, w, h, { tone: front ? '#e7dcc2' : '#ddd2b6', light: [w * .2, -h * .1] });
    if (front) {
      // a broad engraved band, the title in the band, a fine rule and a guilloche-free plain cover (our typography, no real cover)
      ctx.fillStyle = rgba('#3c4a5e', .9); ctx.fillRect(0, h * .3, w, h * .26);
      ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = -h; k < w; k += 6) { ctx.moveTo(k, h * .56); ctx.lineTo(k + h * .26, h * .3); } ctx.stroke();
      const title = (o.title || 'WORLD DEVELOPMENT REPORT 2026').split(' '), l1 = title.slice(0, 2).join(' '), l2 = title.slice(2).join(' ');
      inkText(ctx, l1, w * .09, h * .4, { size: w * .056, font: 'caps', color: '#f3ecda' });
      inkText(ctx, l2, w * .09, h * .4 + w * .085, { size: w * .056, font: 'caps', color: '#f3ecda' });
      ctx.strokeStyle = rgba(INK.ink, .7); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(w * .09, h * .66); ctx.lineTo(w * .91, h * .66); ctx.stroke();
      ctx.strokeStyle = rgba(INK.ink, .3); ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 3; i++) { ctx.moveTo(w * .09, h * (.71 + i * .035)); ctx.lineTo(w * (.6 - i * .12), h * (.71 + i * .035)); } ctx.stroke();
    }
    ctx.restore(); ctx.strokeStyle = 'rgba(90,70,50,.45)'; ctx.lineWidth = 1.3; poly(ctx, edge(w, h, seed)); ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
  if (o.source) { const [sxp, syp] = [x, y + h + 46]; inkText(ctx, o.source.toUpperCase(), sxp, syp, { size: 17, font: 'caps', u: o.su ?? 1, color: o.sourceCol || rgba(INK.ink, .7) }); }
  const c = Math.cos(rot), s = Math.sin(rot), out = (px, py) => [x + px * c - py * s, y + px * s + py * c];
  return { rect: { x, y, w, h }, page: { x, y, w, h }, corner: out(w - 10, 10) };
}
