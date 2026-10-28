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
// Layout (cached per rect): cladding bays with seams, a louvred vent band under the roof, long ribbon windows onto the server hall
// (rack columns with tiny status lights), a solid panel round the keyhole (the lock sits in plain wall), a plinth with roller doors,
// rooftop cooling units. Everything is still; only the status lights breathe (slowly) and wake left → right.
const DCL = new Map();
function dcLayout(o) {
  const key = [o.x0, o.y0, o.x1, o.y1, o.hole ? o.hole.cx : 0].join(',');
  if (DCL.has(key)) return DCL.get(key);
  const { x0, y0, x1, y1 } = o, r = prng(1414), bay = 260;
  const seams = []; for (let x = x0 + bay; x < x1 - 20; x += bay) seams.push(x);
  const hx = o.hole ? o.hole.cx : -1e9, solid = [hx - 250, hx + 250];             // no window round the lock
  const wy0 = y0 + 196, wy1 = y0 + 446;                                          // the ribbon window (server hall)
  const wins = []; for (let x = x0; x < x1; x += bay) { const a = x + 22, b = Math.min(x + bay - 22, x1 - 22); if (b < solid[0] || a > solid[1]) wins.push([a, b]); else { if (a < solid[0] - 40) wins.push([a, solid[0] - 22]); if (b > solid[1] + 40) wins.push([solid[1] + 22, b]); } }
  const racks = [], lights = [];
  // a closed row of server cabinets (touching, thin dark gaps) with rows of tiny status lights at the same slot heights
  for (const [a, b] of wins) for (let x = a + 10; x + 30 < b - 6; x += 34) {
    const h = 186, top = wy1 - 14 - h; racks.push([x, top, 30, h]);
    for (let yy = top + 14; yy < top + h - 10; yy += 15) if (r() < .5) { const c = r(); lights.push([x + 5 + (r() < .5 ? 0 : 10), yy, c < .05 ? 2 : c < .3 ? 1 : 0, r(), r()]); }
  }
  const louv = []; for (let y = y0 + 40; y < y0 + 128; y += 13) louv.push(y);
  const doors = []; for (const u of [.12, .2, .74, .82]) { const dx = lerp(x0, x1, u); if (Math.abs(dx - hx) > 320) doors.push(dx); }
  const units = []; for (let x = x0 + 70; x < x1 - 160; x += 172) units.push([x + r() * 10, 26 + r() * 6]);
  const res = { seams, wins, wy0, wy1, racks, lights, louv, doors, units, solid };
  DCL.set(key, res); return res;
}
export function dataCentre(ctx, t, o) {
  const { x0, y0, x1, y1 } = o, top = o.top ?? 70, wake = o.wake ?? 1, warm = o.warm ?? 0, L = dcLayout(o);
  const rx = top * .5, ry = top * .45;                                          // roof recession (up right)
  // roof plane
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + rx, y0 - ry); ctx.lineTo(x1 + rx, y0 - ry); ctx.lineTo(x1, y0); ctx.closePath();
  ctx.fillStyle = lin(ctx, 0, y0 - ry, 0, y0, [[0, P.night1], [1, mixHex(P.ind1, P.blue0, .3)]]); ctx.fill();
  // rooftop: big plant boxes (o.roof) and a long row of identical cooling units with fans (reads as a data centre at a glance)
  ctx.fillStyle = P.night1;
  for (const [bx, bw, bh] of o.roof || []) { ctx.fillRect(bx + top * .8, y0 - top * .5 - bh, bw, bh + 2); ctx.fillStyle = rgba(P.blue0, .7); ctx.fillRect(bx + top * .8, y0 - top * .5 - bh, bw, 2); ctx.fillStyle = P.night1; }
  for (const [ux, uh] of L.units) {
    const ub = y0 - ry * .45, uw = 132, ox = rx * .35, oy = ry * .35;
    ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.fillRect(ux, ub - uh, uw, uh);
    ctx.beginPath(); ctx.moveTo(ux, ub - uh); ctx.lineTo(ux + ox, ub - uh - oy); ctx.lineTo(ux + uw + ox, ub - uh - oy); ctx.lineTo(ux + uw, ub - uh); ctx.closePath();
    ctx.fillStyle = mixHex(P.ind1, P.blue0, .25); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 1.6;
    for (const fx of [.3, .72]) { ctx.beginPath(); ctx.ellipse(ux + uw * fx + ox * .5, ub - uh - oy * .5, 19, 4.2, 0, 0, 6.29); ctx.stroke(); }
    ctx.strokeStyle = rgba(P.night0, .8); ctx.lineWidth = 1.4; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(ux + 6, ub - uh + k * uh / 4); ctx.lineTo(ux + uw - 6, ub - uh + k * uh / 4); ctx.stroke(); }
  }
  // the front face, with the keyhole as a real hole
  let face = new Path2D(); face.rect(x0, y0, x1 - x0, y1 - y0);
  let holeP = null;
  if (o.hole && o.hole.u > 0) { const hs = o.hole.s * expoOut(o.hole.u); holeP = keyholePath(o.hole.cx, o.hole.cy, hs); face = face.op(holeP, PathOp.Difference); }
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(P.ind1, P.blue0, .2)], [.55, P.ind1], [1, P.night1]]); ctx.fill(face);
  ctx.save(); ctx.clip(face);
  // vent band under the roof: louvres per bay (dark slats with a hairline of blue light on top)
  for (const y of L.louv) {
    ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(x0 + 18, y, x1 - x0 - 36, 6);
    ctx.fillStyle = rgba(P.blue0, .32); ctx.fillRect(x0 + 18, y - 1.2, x1 - x0 - 36, 1.2);
  }
  // the server hall behind the ribbon windows: dark depth, a cool ceiling strip, rack columns, tiny status lights
  for (const [a, b] of L.wins) {
    ctx.fillStyle = lin(ctx, 0, L.wy0, 0, L.wy1, [[0, mixHex(P.night0, P.ind1, .55)], [.2, P.night0], [1, mixHex(P.night0, P.ind0, .5)]]); ctx.fillRect(a, L.wy0, b - a, L.wy1 - L.wy0);
    ctx.fillStyle = rgba(P.cream, .16); ctx.fillRect(a + 6, L.wy0 + 7, b - a - 12, 2);
  }
  for (const [x, y, w, h] of L.racks) { ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, mixHex(P.ind1, P.blue0, .3)], [1, mixHex(P.ind0, P.night0, .4)]]); ctx.fillRect(x, y, w, h); ctx.fillStyle = rgba(P.night0, .9); ctx.fillRect(x + w, y, 4, h); ctx.fillStyle = rgba(P.blue0, .6); ctx.fillRect(x, y, w, 1.6); }
  for (const [x, y, kind, r1, r2] of L.lights) {
    const u = (x - x0) / (x1 - x0), on = smooth(clamp((wake * 1.25 - u) / .25));
    const tw = .7 + .3 * Math.sin(t * (.35 + r2 * .5) + r1 * 9);                 // slow breathing, never a blink
    ctx.globalAlpha = (.08 + .8 * on * tw) * (kind === 2 ? .9 : 1);
    ctx.fillStyle = kind === 2 ? P.halo0 : kind === 1 ? P.cream : mixHex(P.blue0, P.cream, .55);
    ctx.fillRect(x, y, 5, 3.4);
  }
  ctx.globalAlpha = 1;
  // window frames: sill + head in dark, mullions
  for (const [a, b] of L.wins) {
    ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 5; ctx.strokeRect(a, L.wy0, b - a, L.wy1 - L.wy0);
    ctx.strokeStyle = rgba(P.blue0, .55); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(a, L.wy1 + 4); ctx.lineTo(b, L.wy1 + 4); ctx.stroke();
  }
  // cladding seams (full height), the plinth and its roller doors
  for (const x of L.seams) { ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x - 1.5, y0, 3, y1 - y0); ctx.fillStyle = rgba(P.blue0, .22); ctx.fillRect(x + 1.5, y0, 1.2, y1 - y0); }
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(x0, y1 - 96, x1 - x0, 96);
  ctx.fillStyle = rgba(P.blue0, .45); ctx.fillRect(x0, y1 - 97, x1 - x0, 1.4);
  for (const dx of L.doors) {
    ctx.fillStyle = rgba(P.night0, .55); ctx.fillRect(dx - 70, y1 - 82, 140, 82);
    ctx.strokeStyle = rgba(P.blue0, .4); ctx.lineWidth = 1.2; for (let k = 1; k < 6; k++) { ctx.beginPath(); ctx.moveTo(dx - 66, y1 - 82 + k * 13); ctx.lineTo(dx + 66, y1 - 82 + k * 13); ctx.stroke(); }
    ctx.fillStyle = rgba(P.cream, .55 * (.75 + .25 * Math.sin(t * .5 + dx))); ctx.fillRect(dx + 78, y1 - 70, 4, 4);   // a tiny lamp by each door
  }
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
// o: { gather 0..1 (numbers flow into the file), file: fileShape(...), a, onlyFile (just the file's digits), noFile (just the field), cool }
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
    if (o.noFile && d.tgt) continue;
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
