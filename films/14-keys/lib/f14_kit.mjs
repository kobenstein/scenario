// Film 14 · additions to the editorial-night kit (lib/f10_editorial.mjs + lib/f13_kit.mjs stay the base; import all three).
//   keyPath / lightKey()   the key of light (ONLY at the 4 key anchors: hook, two-person rule, second key, key ring) · docs/MOTION.md §3
//   dataCentre()           the vast data centre: a dark monolith with rows of dim rack lights, rim light, a keyhole that can open
//   keyholePath()          the keyhole shape (also the carrier into the giant file)
//   darkHand()             a plain human hand as an indigo silhouette with rim light ("they" hold the key; never yellow, never light)
//   numberField()          the weights: a field of numbers that can gather into the giant file (fileShape) · station-1 world
//   fileShape()            a document with a folded corner, drawn in light (the giant file)
//   blueprint()            thin cream plan lines over a shape (understanding = a drawn plan)
// Rules as in the base kit: no canvas / pattern per frame, seeded randomness only, everything driven by t (words → state).
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, glowFill, halo, dust, lin, rad, prng } = E;

// ---------- the key ----------
// local units: height ≈ 1, origin = centre, bow (ring) on top, shaft down, the bit (teeth) bottom right. Built once.
const KEY = (() => {
  const U = (a, b) => a.op(b, PathOp.Union), D = (a, b) => a.op(b, PathOp.Difference);
  const c = (x, y, r) => { const p = new Path2D(); p.arc(x, y, r, 0, Math.PI * 2); return p; };
  const r = (x, y, w, h, rr = 0) => { const p = new Path2D(); p.roundRect(x, y, w, h, rr); return p; };
  let p = c(0, -.3, .2);
  p = D(p, c(0, -.3, .088));
  p = U(p, r(-.07, -.125, .14, .05, .012));          // collar
  p = U(p, r(-.033, -.11, .066, .58, .02));           // shaft
  p = U(p, r(-.07, .055, .14, .035, .01));            // a second collar ring on the shaft
  let bit = r(.02, .29, .175, .18, .01);
  bit = D(bit, r(.085, .25, .04, .1));
  bit = D(bit, r(.14, .37, .07, .045));
  p = U(p, bit);
  return p;
})();
export const KEY_BOW = [0, -.3], KEY_TIP = [0, .47], KEY_TOP = [0, -.5];
// the key as a light form; (x, y) = centre, h = height. o: { rot (in-plane, rad), turn (rad round its long axis: 0 = face on),
//   lum 0..1, a, glow, dust } · returns { path, at(u, v) → [x, y] (local → caller space) }
export function keyMatrix(x, y, h, rot = 0, turn = 0) {
  const cx = Math.cos(turn), c = Math.cos(rot), s = Math.sin(rot);
  const sx = h * (Math.abs(cx) < .04 ? .04 * Math.sign(cx || 1) : cx);
  return { a: c * sx, b: s * sx, c: -s * h, d: c * h, e: x, f: y };
}
export function lightKey(ctx, x, y, h, t, o = {}) {
  const m = keyMatrix(x, y, h, o.rot ?? 0, o.turn ?? 0), a = o.a ?? 1, lum = clamp(o.lum ?? 1), g = o.glow ?? 1, blue = o.blue ?? 1;
  const path = new Path2D(); path.addPath(KEY, m);
  const at = (u, v) => E.applyM(m, u, v);
  const [bx, by] = at(0, -.18);
  // the night lifts to blue round it, a warm bloom, then the body: white-gold core in the bow, gold toward the tip
  glowFill(ctx, path, h * .5 * g, .55 * a * lum * blue, P.blue0);
  glowFill(ctx, path, h * .16 * g, .55 * a * lum, P.halo1);
  glowFill(ctx, path, h * .04, .5 * a * lum, P.halo0);
  halo(ctx, bx, by, h * 1.1 * g, .2 * a * lum, P.halo1, P.halo0);
  ctx.save(); ctx.globalAlpha = a;
  const k = (col) => mixHex(col, P.shade0, .7 * (1 - lum));
  ctx.fillStyle = rad(ctx, bx, by, h * .8, [[0, k(P.core0)], [.22, k(P.core0)], [.42, k(P.core1)], [.7, k(P.halo0)], [1, k(P.halo1)]]); ctx.fill(path);
  ctx.clip(path); ctx.filter = `blur(${h * .012}px)`; ctx.strokeStyle = rgba(P.shade0, .5); ctx.lineWidth = h * .022; ctx.stroke(path);
  ctx.restore();
  if ((o.dust ?? 1) > 0) dust(ctx, o.seed ?? 14, o.dust > 1 ? o.dust : 2600, bx, by + h * .1, h * .42, h * .5, t, .75 * a * lum, P.halo0);
  return { path, at, m };
}

// ---------- the keyhole ----------
// centre (cx, cy) = centre of the round part; s = width of the round part. Classic: circle on top, a flared slot below.
export function keyholePath(cx, cy, s) {
  const r = s / 2, circ = new Path2D(); circ.ellipse(cx, cy, r, r, 0, 0, Math.PI * 2);
  const slot = new Path2D(); slot.moveTo(cx - r * .4, cy + r * .4); slot.lineTo(cx + r * .4, cy + r * .4); slot.lineTo(cx + r * .62, cy + r * 2.5);
  slot.quadraticCurveTo(cx, cy + r * 2.62, cx - r * .62, cy + r * 2.5); slot.closePath();
  return circ.op(slot, PathOp.Union);
}

// ---------- the data centre ----------
// o: { x0, y0, x1, y1 (front face, design coords of its card), top (height of the receding roof), wake 0..1 (rack lights wake
//      left → right), warm (key light on the left edge 0..1), hole: { cx, cy, s, u 0..1 (open), rim 0..1 } }
// The keyhole is a real hole (even-odd): what is drawn BEFORE (a deeper card) shows through it.
const RACKS = new Map();
function racks(o) {
  const key = [o.x0, o.y0, o.x1, o.y1].join(',');
  if (RACKS.has(key)) return RACKS.get(key);
  const r = prng(1414), out = [], rows = 11, rowH = (o.y1 - o.y0 - 70) / rows;
  for (let i = 0; i < rows; i++) {
    const y = o.y0 + 46 + i * rowH;
    for (let x = o.x0 + 30 + r() * 30; x < o.x1 - 30;) {
      const w = 8 + r() * 26; out.push([x, y + (r() - .5) * 2, w, r(), r()]); x += w + 10 + r() * (r() < .18 ? 120 : 22);
    }
  }
  RACKS.set(key, out); return out;
}
export function dataCentre(ctx, t, o) {
  const { x0, y0, x1, y1 } = o, top = o.top ?? 70, wake = o.wake ?? 1, warm = o.warm ?? 0;
  // roof (receding toward a vanishing point up left of centre: a thin lit plane)
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + top * .5, y0 - top * .45); ctx.lineTo(x1 + top * .5, y0 - top * .45); ctx.lineTo(x1, y0); ctx.closePath();
  ctx.fillStyle = lin(ctx, 0, y0 - top * .45, 0, y0, [[0, P.night1], [1, mixHex(P.ind1, P.blue0, .3)]]); ctx.fill();
  // the front face, with the keyhole as a real hole
  let face = new Path2D(); face.rect(x0, y0, x1 - x0, y1 - y0);
  let holeP = null;
  if (o.hole && o.hole.u > 0) { const hs = o.hole.s * expoOut(o.hole.u); holeP = keyholePath(o.hole.cx, o.hole.cy, hs); face = face.op(holeP, PathOp.Difference); }
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(P.ind2, P.blue0, .14)], [.55, P.ind2], [1, P.night1]]); ctx.fill(face);
  // rooftop plant: a few low dark boxes (reads as a building, not a wall)
  ctx.fillStyle = P.night1;
  for (const [bx, bw, bh] of o.roof || []) { ctx.fillRect(bx + top * .8, y0 - top * .5 - bh, bw, bh + 2); ctx.fillStyle = rgba(P.blue0, .7); ctx.fillRect(bx + top * .8, y0 - top * .5 - bh, bw, 2); ctx.fillStyle = P.night1; }
  ctx.save(); ctx.clip(face);
  // rack lights: dim cool dashes; the wake runs left → right (a soft front), then they breathe very slightly
  for (const [x, y, w, r1, r2] of racks(o)) {
    const u = (x - x0) / (x1 - x0), on = smooth(clamp((wake * 1.25 - u) / .25));
    const tw = .75 + .25 * Math.sin(t * (.6 + r2 * 1.1) + r1 * 9);
    ctx.globalAlpha = (.1 + .5 * on * tw) * (r1 < .1 ? 1.3 : 1);
    ctx.fillStyle = r1 < .08 ? P.cream : mixHex(P.blue0, P.cream, .35 + .3 * r2);
    ctx.fillRect(x, y, w, 2.4);
  }
  ctx.globalAlpha = 1;
  // the key's warm light on the left part of the face
  if (warm > 0) { ctx.fillStyle = lin(ctx, x0, 0, x0 + 700, 0, [[0, rgba(P.halo1, .22 * warm)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(x0, y0, 700, y1 - y0); }
  ctx.restore();
  // lit edges: the roof edge (blue key light), the left corner (warm)
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
  ctx.strokeStyle = lin(ctx, 0, y0, 0, y1, [[0, rgba(P.halo1, .7 * warm + .15)], [1, rgba(P.halo1, .05)]]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
  ctx.restore();
  // the keyhole rim: a thin cream line traced round the hole as it opens
  if (holeP && (o.hole.rim ?? 1) > 0) {   // o.hole.px = design px per screen px (keeps the rim a hairline when the camera flies in)
    const px = o.hole.px ?? 1;
    ctx.save(); ctx.strokeStyle = rgba(P.cream, .8 * (o.hole.rim ?? 1)); ctx.lineWidth = 2.2 * px; ctx.stroke(holeP);
    ctx.globalCompositeOperation = 'lighter'; ctx.filter = `blur(${6 * px}px)`; ctx.strokeStyle = rgba(P.blue0, .9 * (o.hole.rim ?? 1)); ctx.lineWidth = 8 * px; ctx.stroke(holeP); ctx.restore();
  }
  return { face, hole: holeP };
}

// ---------- a plain human hand (indigo silhouette, rim light) ----------
// m = E.handMatrix(...). o: { pose, curl, spread, warm (light from the key side 0..1), side ±1 (which edge gets the warm rim) }
export function darkHand(ctx, m, o = {}) {
  const path = new Path2D(); path.addPath(E.handPath(o), m); const L = Math.hypot(m.a, m.b);
  ctx.save(); ctx.globalAlpha = o.a ?? 1;
  const [sx, sy] = E.applyM(m, -1.5, 0), [ex, ey] = E.applyM(m, 1.4, 0);
  ctx.fillStyle = lin(ctx, sx, sy, ex, ey, [[0, P.night0], [.65, P.night0], [1, P.night1]]); ctx.fill(path);
  ctx.clip(path); ctx.globalCompositeOperation = 'lighter';
  ctx.filter = `blur(${L * .015}px)`; ctx.strokeStyle = rgba(P.blue0, .55); ctx.lineWidth = L * .025; ctx.stroke(path);
  if ((o.warm ?? 0) > 0) { const [wx, wy] = E.applyM(m, 1.2, -.6 * (o.side ?? 1)); ctx.filter = `blur(${L * .06}px)`; ctx.strokeStyle = rad(ctx, wx, wy, L * 1.4, [[0, rgba(P.halo0, .85 * o.warm)], [1, rgba(P.halo1, 0)]]); ctx.lineWidth = L * .1; ctx.stroke(path); }
  ctx.restore();
  return path;
}

// ---------- blueprint lines: the plan of a building (understanding) ----------
// rect [x0, y0, x1, y1]; u0 outline 0..1, u1 the inner grid 0..1; a alpha
export function blueprint(ctx, rect, u0, u1, o = {}) {
  const [x0, y0, x1, y1] = rect, a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.strokeStyle = rgba(P.cream, .8 * a); ctx.lineWidth = o.w ?? 1.8; ctx.lineCap = 'round';
  const per = 2 * (x1 - x0 + y1 - y0), d = per * clamp(u0);
  const pts = [[x0, y1], [x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  let left = d; ctx.beginPath(); ctx.moveTo(...pts[0]);
  for (let i = 1; i < pts.length && left > 0; i++) { const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), f = Math.min(1, left / L); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); left -= L; }
  ctx.stroke();
  // inner grid: verticals grow down from the roof, staggered left → right; one horizontal per floor grows from the left
  const nx = o.nx ?? 9, ny = o.ny ?? 4;
  ctx.strokeStyle = rgba(P.cream, .42 * a); ctx.lineWidth = (o.w ?? 1.8) * .75;
  for (let i = 1; i < nx; i++) { const k = sineIO(span(u1, (i - 1) / nx * .6, (i - 1) / nx * .6 + .4)); if (k <= 0) continue; const x = lerp(x0, x1, i / nx); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, lerp(y0, y1, k)); ctx.stroke(); }
  for (let j = 1; j < ny; j++) { const k = sineIO(span(u1, .2 + (j - 1) / ny * .5, .2 + (j - 1) / ny * .5 + .45)); if (k <= 0) continue; const y = lerp(y0, y1, j / ny); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, k), y); ctx.stroke(); }
  // corner ticks (a drawing, not a building)
  ctx.strokeStyle = rgba(P.cream, .5 * a * clamp(u0 * 2 - 1));
  for (const [x, y, sx, sy] of [[x0, y0, -1, -1], [x1, y0, 1, -1], [x0, y1, -1, 1], [x1, y1, 1, 1]]) { ctx.beginPath(); ctx.moveTo(x + sx * 6, y); ctx.lineTo(x + sx * 26, y); ctx.moveTo(x, y + sy * 6); ctx.lineTo(x, y + sy * 26); ctx.stroke(); }
  ctx.restore();
}

// ---------- the giant file ----------
// a document with a folded corner, centre (cx, cy), w × h, fold f. Returns the outline as points (for the trail) and a Path2D.
export function fileShape(cx, cy, w, h, f = 90) {
  const x0 = cx - w / 2, y0 = cy - h / 2, x1 = cx + w / 2, y1 = cy + h / 2;
  const pts = [[x1 - f, y0], [x0 + 14, y0], [x0, y0 + 14], [x0, y1 - 14], [x0 + 14, y1], [x1 - 14, y1], [x1, y1 - 14], [x1, y0 + f], [x1 - f, y0]];
  const path = new Path2D(); pts.forEach((p, i) => (i ? path.lineTo(...p) : path.moveTo(...p))); path.closePath();
  const fold = new Path2D(); fold.moveTo(x1 - f, y0); fold.lineTo(x1 - f, y0 + f - 10); fold.quadraticCurveTo(x1 - f, y0 + f, x1 - f + 10, y0 + f); fold.lineTo(x1, y0 + f); fold.closePath();
  return { pts, path, fold, rect: [x0, y0, x1, y1] };
}

// ---------- the weights: a field of numbers ----------
// Field coordinates are SCREEN-LIKE (1920×1080 as it looks at the end of the dive); the caller maps them onto its card.
// o: { gather 0..1 (numbers flow into the file), file: fileShape(...), a, glow 0..1 (warm light from inside the file), focus [x,y] }
const DIGITS = new Map();
function digits(file) {
  const key = file.rect.join(','); if (DIGITS.has(key)) return DIGITS.get(key);
  const r = prng(2025), out = [], [fx0, fy0, fx1, fy1] = file.rect;
  const cols = 5, rows = 15, cw = (fx1 - fx0 - 70) / cols, rh = (fy1 - fy0 - 120) / rows;
  const targets = []; for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) targets.push([fx0 + 48 + i * cw, fy0 + 92 + j * rh]);
  // the wider field: a loose grid over the whole frame and beyond (they are what the file is made of)
  for (let j = -7; j < 26; j++) for (let i = -7; i < 29; i++) {
    const x = i * 92 + (j % 2) * 46 + (r() - .5) * 14, y = j * 58 + (r() - .5) * 8;
    const v = (r() * 2 - 1) * (r() < .2 ? 3 : 1), s = (v < 0 ? '−' : '') + Math.abs(v).toFixed(r() < .5 ? 2 : 3);
    out.push({ x, y, s, r1: r(), r2: r(), tgt: null });
  }
  // the digits nearest the file move into it (each target gets one); the rest stay in the field
  const free = out.slice();
  for (const tg of targets) {
    let bi = -1, bd = 1e12; for (let i = 0; i < free.length; i++) { const d = (free[i].x - tg[0]) ** 2 + (free[i].y - tg[1]) ** 2 + free[i].r1 * 9000; if (d < bd) { bd = d; bi = i; } }
    free[bi].tgt = tg; free.splice(bi, 1);
  }
  const res = { out, cols, rows }; DIGITS.set(key, res); return res;
}
export function numberField(ctx, t, o) {
  const a = o.a ?? 1, g = clamp(o.gather ?? 0), file = o.file, { out } = digits(file), size = o.size ?? 20;
  const [fcx, fcy] = [(file.rect[0] + file.rect[2]) / 2, (file.rect[1] + file.rect[3]) / 2];
  ctx.save(); ctx.font = `500 ${size}px Inter`; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  for (const d of out) {
    if (o.onlyFile && !d.tgt) continue;
    const dist = Math.hypot(d.x - fcx, d.y - fcy);
    if (!d.tgt && dist > 2600) continue;
    // the field breathes: a slow wave of brightness crosses it (values "learned"); near the file it is brighter
    const wave = .5 + .5 * Math.sin(t * .4 - dist * .004 + d.r1 * 2), near = Math.exp(-dist / 700);
    let x = d.x, y = d.y, al = (.3 + .4 * wave) * (.55 + .45 * near) * Math.exp(-Math.max(0, dist - 1050) / 450), col = mixHex(P.blue2, P.cream, .45 + .3 * d.r2);
    if (d.tgt) {
      const k = smooth(span(g, d.r1 * .45, d.r1 * .45 + .55));
      const bend = Math.sin(k * Math.PI) * 40 * (d.r2 - .5);   // arcs, not straight slides
      x = lerp(d.x, d.tgt[0], k) + bend; y = lerp(d.y, d.tgt[1], k) - bend * .4;
      al = lerp(al, .7 + .3 * wave, k); col = o.cool ? mixHex(P.blue2, P.cream, .6) : mixHex(col, d.r2 > .35 ? P.core1 : P.halo0, k);
    } else al *= 1 - .8 * smooth(g);   // the rest of the field steps back
    ctx.globalAlpha = a * clamp(al); ctx.fillStyle = col;
    ctx.fillText(d.s, x + Math.sin(t * .25 + d.r1 * 7) * .6, y);
  }
  ctx.restore();
}
