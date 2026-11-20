// Film 7 · c09/c10's COPY of lib/f7_c05_props.mjs (identical code; only the table import points at c09's copy). Original header:
// Film 7 · c05 props on the test table (cards II–IV): the copper mine block, ingot bundles with the "needed" ghost, x-ray standees (robot,
// car), the light tiles that copy themselves (software), the nine planetary dials around a small engraved Earth, figures + the key ring,
// solar rows, grid battery containers, the price column, and the lamp-plate disc for the c05>c06 push. Builder: c05.
// World units and camera from lib/f7_c05_table.mjs (c05's copy of the c04 table). Pure functions of t, deterministic.
//
//   propsPrepare() async            pre-render every texture (mine faces, standees, dials, Earth, robot sprites) → Images (call once)
//   solid(ctx, cam, V, F, col(n, c)) a convex solid: world vertices, faces (index lists); back faces culled → drawn faces
//   lightAt(n, c, spot)             0..1.6 light on a face (lamp diffuse + the pool)          shade(rgb, k, warm) → css colour
//   mineBlock(ctx, t, cam, o)       the open-pit block diagram: { X, Z, rot, rise 0..1, glow 0..1 (copper veins), spot }
//   bundle(ctx, t, cam, o)          a stack of ingots: { X, Z, rot, need (layers), fill [per layer 0..1 arrival], metal 'cu'|'li'|'ni',
//                                    src [X, Y, Z] (where ingots fly in from), ghost 0..1, ghostHot 0..1, spot }
//   ingot(ctx, cam, X, Y, Z, rot, o) one ingot { L, D, Hh, metal, spot, warm }
//   standee(ctx, t, cam, o)         an upright engraved card-cutout (robot | car) with its x-ray: { kind, X, Z, hgt (cm), rise, scan 0..1 }
//   tiles(ctx, t, cam, o)           the software tiles: { O [X, Z], t0 (copy wave), off (switch-off wave start), hole [X, Z, r] }
//   dials(ctx, t, cam, o)           the nine dials + Earth: { C [X, Z], R, fan 0..1, val(i) → needle 0..1, hot(i) → 0..1, icon(i) 0..1,
//                                    earth 0..1 (slide in), spot }   DIALS = names in ring order
//   people(ctx, t, cam, o)          figures at table scale: list [{ X, Z, flip, pose, seed, lit }], o: { spot, keys 0..1 }
//   robots(ctx, t, cam, o)          the robot block (c04 sprites): { X0, Z0, nx, nz, dx, dz, t0 (rise), sink 0..1, spot }
//   solarRows / containers / priceColumn (ctx, t, cam, o)   the fair part (5.09)
//   lampDisc(ctx, t, M, plateT)     the handoff4 'light' (lamp) plate drawn under the affine M as a disc (= the plate at M = identity)
//   label(...)                      the film's label (copied from c04)
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, canvas, text, drift } from '../engine.mjs';
import { F7, ease, n1 } from './f7_kit.mjs';
import { vnoise, fbm } from './art.mjs';
import { figureFlat, handPos, POSES } from './figure.mjs';
import { apply, spotAt, TB, LAMP, shadowQuad, SPOT } from './f7_c09_table.mjs';
import { TSHIFT } from './handoff4.mjs';

const TAU = Math.PI * 2;
const toImg = async (c) => loadImage(c.toBuffer('image/png'));
const hexRGB = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const cen = (P) => { const c = [0, 0, 0]; for (const p of P) { c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; } return c.map((v) => v / P.length); };
const pathP = (ctx, P) => { ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };

// ================================================================ light and solids
const WARMT = [1.06, .92, .74];
export function lightAt(n, c, spot) {
  const L = norm(sub(LAMP, c)), diff = Math.max(0, dot(n, L)), s = spotAt(c[0], c[2], spot);
  return .16 + (.22 + .95 * s) * (.35 + .75 * diff) + (n[1] > .9 ? .08 * s : 0);
}
export function shade(rgb, k, warm = 0) {
  const tint = [mix(1, WARMT[0], warm), mix(1, WARMT[1], warm), mix(1, WARMT[2], warm)], over = Math.max(0, k - 1) * 70;
  return `rgb(${Math.round(clamp(rgb[0] * k * tint[0] + over, 0, 255))},${Math.round(clamp(rgb[1] * k * tint[1] + over, 0, 255))},${Math.round(clamp(rgb[2] * k * tint[2] + over, 0, 255))})`;
}
export function solid(ctx, cam, V, F, col, o = {}) {
  const C = cen(V), out = [], cp = [cam.x, cam.y, cam.z];
  for (const f of F) {
    const pts = f.map((i) => V[i]), fc = cen(pts);
    let n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))); if (dot(n, sub(fc, C)) < 0) n = n.map((v) => -v);
    if (dot(n, sub(cp, fc)) <= 1e-4) continue;
    const P = cam.poly(pts); if (P.length < 3) continue;
    pathP(ctx, P); ctx.fillStyle = col(n, fc, f); ctx.fill();
    if (o.edge) { ctx.strokeStyle = o.edge; ctx.lineWidth = o.lw ?? 1; ctx.stroke(); }
    out.push({ n, P, pts, fc });
  }
  return out;
}
// box vertices: centre X, Z, bottom Y0, size w (local x) × d (local z) × h, rot about Y, top inset
export function boxV(X, Y0, Z, w, h, d, rot = 0, inset = 0) {
  const c = Math.cos(rot), s = Math.sin(rot), P = (a, b, y) => [X + a * c - b * s, y, Z + a * s + b * c];
  const a = w / 2, b = d / 2, ai = a - inset, bi = b - inset;
  return [P(-a, -b, Y0), P(a, -b, Y0), P(a, b, Y0), P(-a, b, Y0), P(-ai, -bi, Y0 + h), P(ai, -bi, Y0 + h), P(ai, bi, Y0 + h), P(-ai, bi, Y0 + h)];
}
export const BOXF = [[4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
// engraved lines across a drawn face (parallel to its first edge) — no clip
function engrave(ctx, cam, pts, n, col, lw = .8) {
  const [a, b, c, d] = pts; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
  for (let i = 1; i < n; i++) { const u = i / n, p = cam.p(...[0, 1, 2].map((k) => mix(a[k], d[k], u))), q = cam.p(...[0, 1, 2].map((k) => mix(b[k], c[k], u))); if (p[3] < 1 || q[3] < 1) continue; ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); }
  ctx.stroke();
}

// ================================================================ ingots and bundles
const METAL = { cu: { col: hexRGB('#c07a45'), hi: '#ffd2a6', edge: 'rgba(40,16,6,.55)' }, li: { col: hexRGB('#cfd6dc'), hi: '#ffffff', edge: 'rgba(20,24,34,.5)' }, ni: { col: hexRGB('#9aa29a'), hi: '#f2f6ee', edge: 'rgba(16,20,18,.55)' } };
export function ingot(ctx, cam, X, Y, Z, rot, o = {}) {
  const L = o.L ?? 2.5, D = o.D ?? .8, M = METAL[o.metal || 'cu'], warm = o.warm ?? 0, H0 = o.Hh ?? .5;
  let Hh = H0; if (Y < 0) { Hh += Y; Y = 0; } if (Hh <= .01) return [];
  const V = boxV(X, Y, Z, L, Hh, D, rot, .14 * H0 / .5 * Hh / H0);
  const faces = solid(ctx, cam, V, BOXF, (n, c) => shade(M.col, lightAt(n, c, o.spot) * (n[1] > .9 ? 1.18 : .82), warm), { edge: M.edge, lw: .8 });
  // the top catches the lamp: a bright line along the far top edge
  const top = faces.find((f) => f.n[1] > .9);
  if (top && top.P.length === 4) { const s = spotAt(X, Z, o.spot); ctx.strokeStyle = rgba(M.hi, .25 + .55 * s); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(top.P[3][0], top.P[3][1]); ctx.lineTo(top.P[2][0], top.P[2][1]); ctx.stroke(); }
  return faces;
}
const LAYER = .52, SLOT = .84;
// one bundle: layers of three ingots, crosswise; each ingot flies in from o.src on an arc and settles
export function bundle(ctx, t, cam, o) {
  const rot = o.rot ?? 0, c = Math.cos(rot), s = Math.sin(rot), need = o.need ?? 8, fill = o.fill || [];
  const at = (a, b) => [o.X + a * c - b * s, o.Z + a * s + b * c];
  const items = [];
  for (let i = 0; i < need; i++) {
    const u0 = fill[i] ?? 0; if (u0 <= 0) continue;
    for (let j = 0; j < 3; j++) {
      const u = clamp(u0 * 1.4 - j * .2); if (u <= 0) continue;
      const off = (j - 1) * SLOT, [px, pz] = i % 2 ? at(off, 0) : at(0, off), r = rot + (i % 2 ? Math.PI / 2 : 0);
      const e = ease.out(u), src = o.src || [o.X, 8, o.Z];
      const X = mix(src[0], px, e), Z = mix(src[2], pz, e), Y = mix(src[1], i * LAYER, ease.io(u)) + 2.2 * Math.sin(Math.PI * clamp(u * 1.2)) * (1 - u);
      items.push({ i, X, Y: Y - (o.sinkY ?? 0), Z, r: r + (1 - e) * .8, d: Math.hypot(X - cam.x, Z - cam.z) });
    }
  }
  // bottom layers first; inside a layer far to near
  items.sort((p, q) => p.i - q.i || q.d - p.d);
  if (fill[0] > .5) shadowQuad(ctx, cam, o.X, o.Z, rot, 2.7, 2.7, { a: .9 * clamp(1 - (o.sinkY ?? 0) / 2) });
  for (const it of items) ingot(ctx, cam, it.X, it.Y, it.Z, it.r, { metal: o.metal, spot: o.spot, warm: o.warm });
  // the ghost: what is needed but missing (engraved outline, red hatching)
  const g = o.ghost ?? 0;
  if (g > 0) {
    const nf = o.filled ?? 0, sy = o.sinkY ?? 0, y0 = Math.max(0, nf * LAYER - sy), y1 = need * LAYER - sy; if (y1 <= y0 + .02) return;
    const V = boxV(o.X, y0, o.Z, 2.62, (y1 - y0) * ease.out(g), 2.62, rot);
    const hot = o.ghostHot ?? 0, col = rgba('#e8b0a0', .45 + .4 * hot);
    const fs = solid(ctx, cam, V, BOXF, () => `rgba(178,58,42,${.05 + .12 * hot})`);
    for (const f of fs) engrave(ctx, cam, f.n[1] > .9 ? f.pts : [f.pts[3], f.pts[2], f.pts[1], f.pts[0]], 7, rgba('#d0604a', .35 + .45 * hot), 1);
    ctx.setLineDash([5, 4]); ctx.strokeStyle = col; ctx.lineWidth = 1.3;
    for (const f of fs) { pathP(ctx, f.P); ctx.stroke(); }
    ctx.setLineDash([]);
  }
}

// ================================================================ the open-pit block diagram
const MB = { w: 15, d: 10, h: 5.5, pit: [6.2, 5.0, 3.9, 2.8, 1.7], step: 1.0, slope: .4, pz: .78 };
const MPX = 40;   // texture px per cm
let MTX = null;   // { front, frontGlow, side, top }
function mineProfile() {   // the stepped notch in the front face (local x from the block centre, y from the top down), left to right
  const P = [], n = MB.pit.length;
  P.push([-MB.pit[0], 0]);
  for (let k = 0; k < n - 1; k++) { P.push([-MB.pit[k] + MB.slope, (k + 1) * MB.step]); P.push([-MB.pit[k + 1], (k + 1) * MB.step]); }
  P.push([-MB.pit[n - 1] + MB.slope, n * MB.step]); P.push([MB.pit[n - 1] - MB.slope, n * MB.step]);
  for (let k = n - 2; k >= 0; k--) { P.push([MB.pit[k + 1], (k + 1) * MB.step]); P.push([MB.pit[k] - MB.slope, (k + 1) * MB.step]); }
  P.push([MB.pit[0], 0]);
  return P;
}
const STRATA = [[0, .45, '#3a3a2c'], [.45, 1.6, '#6b5a40'], [1.6, 2.9, '#4d4a52'], [2.9, 4.2, '#3a3448'], [4.2, 5.5, '#2a2638']];
function strataTex(wcm, seed, notch) {
  const w = Math.round(wcm * MPX), h = Math.round(MB.h * MPX), [c, g] = canvas(w, h), r = prng(seed), nz = vnoise(seed);
  for (const [a, b, col] of STRATA) { g.fillStyle = col; g.beginPath(); g.moveTo(0, a * MPX); for (let x = 0; x <= w; x += 20) g.lineTo(x, (a + .12 * Math.sin(x * .01 + a * 3) + .1 * (nz(x * .02, a) - .5)) * MPX); g.lineTo(w, h); g.lineTo(0, h); g.closePath(); g.fill(); }
  // engraved hatching along the layers + stipple
  g.lineCap = 'round';
  for (let y = 3; y < h; y += 4.2) { g.strokeStyle = `rgba(8,6,14,${.18 + .14 * r()})`; g.lineWidth = .9; g.beginPath(); for (let x = 0; x <= w; x += 12) { const yy = y + 1.6 * Math.sin(x * .013 + y * .07) + (nz(x * .03, y * .05) - .5) * 3; x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
  for (let i = 0; i < w * h / 70; i++) { const x = r() * w, y = r() * h; g.fillStyle = r() < .6 ? `rgba(230,214,190,${.05 + .08 * r()})` : `rgba(0,0,0,${.12 + .1 * r()})`; g.fillRect(x, y, 1.2, 1.2); }
  // pebbles in the upper layers
  for (let i = 0; i < w / 9; i++) { const x = r() * w, y = (.5 + r() * 1.1) * MPX; g.strokeStyle = 'rgba(20,14,10,.5)'; g.lineWidth = 1; g.beginPath(); g.ellipse(x, y, 2 + r() * 4, 1.5 + r() * 2.5, r(), 0, TAU); g.stroke(); }
  // copper veins: branching seams (drawn into a separate layer too, for the glow)
  const [cv, gv] = canvas(w, h), veins = [];
  for (let k = 0; k < 7; k++) { let x = r() * w, y = (2.4 + r() * 2.9) * MPX, a = (r() - .5) * .9; const pts = [[x, y]]; for (let i = 0; i < 26; i++) { a += (r() - .5) * .5; x += Math.cos(a) * 12; y += Math.sin(a) * 6; y = clamp(y, 2.1 * MPX, h - 4); pts.push([x, y]); } veins.push(pts); }
  const drawV = (gg, lw, col) => { gg.strokeStyle = col; gg.lineWidth = lw; gg.lineCap = 'round'; gg.lineJoin = 'round'; for (const v of veins) { gg.beginPath(); v.forEach(([x, y], i) => (i ? gg.lineTo(x, y) : gg.moveTo(x, y))); gg.stroke(); } };
  drawV(g, 4.5, 'rgba(120,64,30,.9)'); drawV(g, 2.2, '#c07a45'); drawV(g, .9, '#f0b07a');
  for (let i = 0; i < 140; i++) { const v = veins[Math.floor(r() * veins.length)], p = v[Math.floor(r() * v.length)]; g.fillStyle = r() < .5 ? '#d08850' : '#8a4a24'; g.beginPath(); g.arc(p[0] + (r() - .5) * 16, p[1] + (r() - .5) * 10, 1 + r() * 2.4, 0, TAU); g.fill(); }
  drawV(gv, 16, 'rgba(255,150,80,.10)'); drawV(gv, 7, 'rgba(255,170,100,.22)'); drawV(gv, 2.4, 'rgba(255,214,170,.7)');
  if (notch) {
    const P = mineProfile().map(([x, y]) => [w / 2 + x * MPX, y * MPX]);
    for (const gg of [g, gv]) { gg.save(); gg.globalCompositeOperation = 'destination-out'; gg.beginPath(); gg.moveTo(P[0][0], -2); P.forEach(([x, y]) => gg.lineTo(x, y)); gg.lineTo(P[P.length - 1][0], -2); gg.closePath(); gg.fill(); gg.restore(); }
    g.strokeStyle = 'rgba(10,8,16,.85)'; g.lineWidth = 2; g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
  }
  // the cut edge: a fine light line along the top, dark border
  g.strokeStyle = 'rgba(10,8,16,.9)'; g.lineWidth = 2.5; g.strokeRect(1, 1, w - 2, h - 2);
  return [c, cv];
}
function mineTopTex() {
  const w = Math.round(MB.w * MPX), h = Math.round(MB.d * MPX), [c, g] = canvas(w, h), r = prng(818), nz = vnoise(818);
  g.fillStyle = '#2c2f2a'; g.fillRect(0, 0, w, h);
  // ground: engraved grass hatch, some scrub
  for (let i = 0; i < 2600; i++) { const x = r() * w, y = r() * h, k = nz(x * .02, y * .02); g.strokeStyle = `rgba(${k > .5 ? '120,130,96' : '20,22,18'},${.25 + .2 * r()})`; g.lineWidth = .9; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 2 + r() * 3, y - 3 - r() * 3); g.stroke(); }
  // contour rings around the pit (the pit centre sits on the front edge = bottom of this texture, v = d)
  const cx = w / 2, cy = h;
  g.strokeStyle = 'rgba(200,180,140,.25)'; g.lineWidth = 1;
  for (let k = 1; k < 5; k++) { g.beginPath(); g.ellipse(cx, cy, (MB.pit[0] + k * .8) * MPX, (MB.pit[0] + k * .8) * MB.pz * MPX, 0, Math.PI, TAU); g.stroke(); }
  // a haul road climbing out of the pit
  g.strokeStyle = 'rgba(170,150,120,.5)'; g.lineWidth = 5; g.beginPath(); g.moveTo(cx + MB.pit[0] * MPX * .9, cy - MB.pit[0] * MB.pz * MPX * .4); g.quadraticCurveTo(cx + 8 * MPX, cy - 6 * MPX, w - 10, 30); g.stroke();
  g.save(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.ellipse(cx, cy, MB.pit[0] * MPX, MB.pit[0] * MB.pz * MPX, 0, Math.PI, TAU); g.closePath(); g.fill(); g.restore();
  g.strokeStyle = 'rgba(10,8,16,.9)'; g.lineWidth = 2; g.beginPath(); g.ellipse(cx, cy, MB.pit[0] * MPX, MB.pit[0] * MB.pz * MPX, 0, Math.PI, TAU); g.stroke();
  g.strokeRect(1, 1, w - 2, h - 2);
  return c;
}
// an Image laid on a world quad at(u, v), source sub-rect (sx, sy, sw, sh) of the image (px), perspective mesh (copy of the table's meshImage
// with a source window, so a rising block can show only its part above the lacquer)
function meshSub(ctx, cam, img, sx0, sy0, sw0, sh0, at, nu = 4, nv = 2) {
  const P = []; for (let j = 0; j <= nv; j++) { const row = []; for (let i = 0; i <= nu; i++) row.push(cam.p(...at(i / nu, j / nv))); P.push(row); }
  const sw = sw0 / nu, sh = sh0 / nv;
  const tri = (d0, d1, d2, M) => {
    const cx = (d0[0] + d1[0] + d2[0]) / 3, cy = (d0[1] + d1[1] + d2[1]) / 3, ex = (q) => { const dx = q[0] - cx, dy = q[1] - cy, l = Math.hypot(dx, dy) || 1; return [q[0] + dx / l * .7, q[1] + dy / l * .7]; };
    ctx.save(); ctx.beginPath(); [d0, d1, d2].map(ex).forEach((q, k) => (k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.clip();
    ctx.transform(M[0], M[1], M[2], M[3], M[4], M[5]); ctx.drawImage(img, sx0, sy0, sw0, sh0, 0, 0, sw0, sh0); ctx.restore();
  };
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const a = P[j][i], b = P[j][i + 1], c = P[j + 1][i], d = P[j + 1][i + 1];
    if (Math.min(a[3], b[3], c[3], d[3]) < 1.2) continue;
    const sx = i * sw, sy = j * sh;
    { const m0 = (b[0] - a[0]) / sw, m1 = (b[1] - a[1]) / sw, m2 = (c[0] - a[0]) / sh, m3 = (c[1] - a[1]) / sh; tri(a, b, c, [m0, m1, m2, m3, a[0] - m0 * sx - m2 * sy, a[1] - m1 * sx - m3 * sy]); }
    { const m0 = (d[0] - c[0]) / sw, m1 = (d[1] - c[1]) / sw, m2 = (d[0] - b[0]) / sh, m3 = (d[1] - b[1]) / sh, X = sx + sw, Y = sy + sh; tri(b, d, c, [m0, m1, m2, m3, d[0] - m0 * X - m2 * Y, d[1] - m1 * X - m3 * Y]); }
  }
}
export function mineBlock(ctx, t, cam, o) {
  const rise = ease.out(clamp(o.rise ?? 1)); if (rise <= 0) return;
  const rot = o.rot ?? 0, c = Math.cos(rot), s = Math.sin(rot), yT = MB.h * rise, hv = yT;   // visible height above the lacquer
  const W2 = (a, y, b) => [o.X + a * c - b * s, y, o.Z + a * s + b * c];   // local a (x), b (z, + = away), y
  const a0 = -MB.w / 2, a1 = MB.w / 2, b0 = -MB.d / 2, b1 = MB.d / 2, sp = o.spot, light = (n, cc) => lightAt(n, cc, sp);
  shadowQuad(ctx, cam, o.X, o.Z, rot, MB.w, MB.d, { a: rise });
  const dim = (k) => { if (k >= .999) return; };
  // side face (the one turned to the camera)
  const sideA = cam.x > o.X ? a1 : a0, nS = [sideA > 0 ? c : -c, 0, sideA > 0 ? s : -s];
  const vis = (n, p) => dot(n, sub([cam.x, cam.y, cam.z], p)) > 0;
  const crop = MB.h * (1 - rise);   // texture rows hidden below the table (cm)
  const darken = (P, k) => { if (k >= 1) return; pathP(ctx, P); ctx.fillStyle = `rgba(4,4,10,${clamp(1 - k) * .85})`; ctx.fill(); };
  if (vis(nS, W2(sideA, yT / 2, 0))) {
    const at = (u, v) => sideA > 0 ? W2(a1, yT - v * hv, b0 + u * MB.d) : W2(a0, yT - v * hv, b1 - u * MB.d);
    meshSub(ctx, cam, MTX.side, 0, 0, MTX.side.width, MTX.side.height * rise, at, 3, 2);
    darken([at(0, 0), at(1, 0), at(1, 1), at(0, 1)].map((q) => cam.p(...q)), light(nS, W2(sideA, yT / 2, 0)) * .9);
  }
  // back face when seen from behind (rare)
  // the top: ground with the pit opening
  { const at = (u, v) => W2(a0 + u * MB.w, yT, b1 - v * MB.d);
    meshSub(ctx, cam, MTX.top, 0, 0, MTX.top.width, MTX.top.height, at, 4, 3);
    darken([at(0, 0), at(1, 0), at(1, 1), at(0, 1)].map((q) => cam.p(...q)), light([0, 1, 0], W2(0, yT, 0)) * 1.05); }
  // the terraces inside the pit, top down (half ellipses behind the front face)
  const N = 28;
  const half = (r, y) => { const P = []; for (let i = 0; i <= N; i++) { const q = Math.PI * i / N; P.push(W2(-r * Math.cos(q), y, b0 + r * MB.pz * Math.sin(q))); } return P; };
  for (let k = 0; k < MB.pit.length; k++) {
    const yTop = yT - k * MB.step, yBot = yT - (k + 1) * MB.step; if (yBot < -.01) break;
    const outer = half(MB.pit[k], yTop), inner = half(MB.pit[k] - MB.slope, yBot);
    // the wall (seen from the inside: the far half faces the camera)
    const ring = cam.poly([...outer, ...inner.slice().reverse()]); pathP(ctx, ring);
    const lk = light([0, .6, -.8], W2(0, yBot, b0 + 2)) * (.75 - k * .06);
    ctx.fillStyle = shade([92, 70, 56], lk, o.warm); ctx.fill();
    // terrace ribs on the wall
    ctx.strokeStyle = 'rgba(14,10,10,.45)'; ctx.lineWidth = .8; ctx.beginPath();
    for (let i = 1; i < N; i += 2) { const p = cam.p(...outer[i]), q = cam.p(...inner[i]); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } ctx.stroke();
    // the bench
    const nb = k + 1 < MB.pit.length ? MB.pit[k + 1] : 0, bench = cam.poly(inner);
    pathP(ctx, bench); ctx.fillStyle = shade(k === MB.pit.length - 1 ? [120, 78, 50] : [128, 112, 92], light([0, 1, 0], W2(0, yBot, b0 + 1)) * (.85 - k * .05), o.warm); ctx.fill();
    ctx.strokeStyle = 'rgba(230,210,180,.35)'; ctx.lineWidth = 1; ctx.beginPath(); inner.map((q) => cam.p(...q)).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  }
  // copper glinting at the bottom of the pit (the ore being dug)
  { const yb = yT - MB.pit.length * MB.step; if (yb > -.01) { const p = cam.p(...W2(0, yb, b0 + .6)); const r = 40 * p[2] / 30; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], Math.max(4, r)); g.addColorStop(0, rgba('#ffb070', .35 * (o.glow ?? 1))); g.addColorStop(1, 'rgba(255,176,112,0)'); ctx.fillStyle = g; ctx.fillRect(p[0] - r, p[1] - r, 2 * r, 2 * r); ctx.restore(); } }
  // the front face: the cross-section (strata, copper veins), with the stepped notch of the pit
  { const at = (u, v) => W2(a0 + u * MB.w, yT - v * hv, b0);
    meshSub(ctx, cam, MTX.front, 0, 0, MTX.front.width, MTX.front.height * rise, at, 5, 2);
    const lf = light([-s, 0, -c], W2(0, yT / 2, b0));
    // keep the face's own light (no dark overlay over the notch: draw the dimming as the notch-free part only via the glow below)
    const gl = (o.glow ?? 0);
    if (gl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(gl); meshSub(ctx, cam, MTX.frontGlow, 0, 0, MTX.frontGlow.width, MTX.frontGlow.height * rise, at, 5, 2); ctx.restore(); }
    // the cut edge catches the light
    const e0 = cam.p(...W2(a0, yT, b0)), e1 = cam.p(...W2(-MB.pit[0], yT, b0)), e2 = cam.p(...W2(MB.pit[0], yT, b0)), e3 = cam.p(...W2(a1, yT, b0));
    ctx.strokeStyle = rgba('#f3e6cc', .35 + .3 * lf); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(e0[0], e0[1]); ctx.lineTo(e1[0], e1[1]); ctx.moveTo(e2[0], e2[1]); ctx.lineTo(e3[0], e3[1]); ctx.stroke(); }
}

// ================================================================ x-ray standees: an engraved robot / car, the metal inside lights up
const SPX = 60;   // px per cm
const ST = { robot: { w: 4.2, h: 6.6 }, car: { w: 10, h: 3.8 } };
let STX = null;
function robotShape(g, w, h, fill) {
  // a simple, friendly humanoid in profile-free front view (no face): head, torso, arms beside, legs
  const k = h / 6.6 * SPX, cx = w * SPX / 2, base = h * SPX;
  g.save(); g.translate(cx, base); g.scale(k, k); g.fillStyle = fill;
  const rr = (x, y, ww, hh, r) => { g.beginPath(); g.roundRect(x, y, ww, hh, r); g.fill(); };
  rr(-.55, -6.5, 1.1, 1.05, .42);        // head
  rr(-.18, -5.5, .36, .3, .08);          // neck
  rr(-1.15, -5.25, 2.3, 2.5, .45);       // torso
  rr(-.95, -2.85, 1.9, .7, .25);         // hips
  rr(-1.62, -5.1, .5, 2.4, .25); rr(1.12, -5.1, .5, 2.4, .25);   // arms (beside the body)
  rr(-1.62, -2.8, .48, .55, .2); rr(1.14, -2.8, .48, .55, .2);   // hands
  rr(-.85, -2.25, .68, 2.2, .26); rr(.17, -2.25, .68, 2.2, .26);  // legs
  rr(-.95, -.22, .88, .22, .1); rr(.07, -.22, .88, .22, .1);     // feet
  g.restore();
}
function carShape(g, w, h, fill) {
  const k = SPX, base = h * SPX - 2;
  g.save(); g.translate(0, base); g.scale(k, k); g.fillStyle = fill;
  g.beginPath(); g.moveTo(.4, -.55); g.lineTo(.35, -1.25); g.quadraticCurveTo(.5, -1.55, 1.4, -1.65); g.lineTo(2.8, -1.8); g.quadraticCurveTo(3.6, -2.9, 5.2, -3.0); g.quadraticCurveTo(6.8, -3.0, 7.6, -2.0); g.lineTo(9.2, -1.75); g.quadraticCurveTo(9.7, -1.6, 9.7, -1.0); g.lineTo(9.6, -.55); g.closePath(); g.fill();
  g.restore();
}
function wheel(g, x, y, r, col, rim) { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.strokeStyle = rim; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r * .55, 0, TAU); g.stroke(); }
async function standeePrepare() {
  STX = {};
  for (const kind of ['robot', 'car']) {
    const { w, h } = ST[kind], cw = Math.ceil(w * SPX), ch = Math.ceil(h * SPX);
    const [cb, gb] = canvas(cw, ch), [cx, gx] = canvas(cw, ch);
    const shape = kind === 'robot' ? robotShape : carShape;
    // the body: dark engraved silhouette with a cool rim and hatching
    shape(gb, w, h, '#cfe0f0'); gb.save(); gb.translate(-3, 2); shape(gb, w, h, '#14132c'); gb.restore();
    gb.save(); gb.globalCompositeOperation = 'source-atop';
    gb.strokeStyle = 'rgba(150,160,220,.16)'; gb.lineWidth = 1.2; for (let y = 0; y < ch; y += 5) { gb.beginPath(); gb.moveTo(0, y); gb.lineTo(cw, y + cw * .25); gb.stroke(); }
    const vg = gb.createLinearGradient(0, 0, cw, 0); vg.addColorStop(0, 'rgba(0,0,0,.35)'); vg.addColorStop(.6, 'rgba(0,0,0,0)'); gb.fillStyle = vg; gb.fillRect(0, 0, cw, ch);
    gb.restore();
    if (kind === 'car') { wheel(gb, 2.3 * SPX, ch - .6 * SPX, .62 * SPX, '#0c0b1e', 'rgba(200,214,240,.5)'); wheel(gb, 7.7 * SPX, ch - .6 * SPX, .62 * SPX, '#0c0b1e', 'rgba(200,214,240,.5)');
      gb.fillStyle = 'rgba(160,180,230,.18)'; gb.beginPath(); gb.moveTo(3.3 * SPX, ch - 2.0 * SPX); gb.quadraticCurveTo(3.9 * SPX, ch - 2.8 * SPX, 5.2 * SPX, ch - 2.85 * SPX); gb.lineTo(6.9 * SPX, ch - 2.0 * SPX); gb.closePath(); gb.fill(); }
    // the x-ray: copper wiring (glowing) and the lithium cells (silver)
    const r = prng(kind === 'robot' ? 41 : 42), cu = (pts, lw) => { for (const [ww, col] of [[lw * 5, 'rgba(255,150,80,.12)'], [lw * 2.4, 'rgba(240,150,90,.45)'], [lw, '#ffd2a6']]) { gx.strokeStyle = col; gx.lineWidth = ww; gx.lineCap = 'round'; gx.lineJoin = 'round'; gx.beginPath(); pts.forEach(([x, y], i) => (i ? gx.lineTo(x * SPX, y * SPX) : gx.moveTo(x * SPX, y * SPX))); gx.stroke(); } };
    const cell = (x, y, ww, hh, n) => { gx.fillStyle = 'rgba(207,214,220,.9)'; gx.strokeStyle = 'rgba(40,46,60,.9)'; gx.lineWidth = 1.5; for (let i = 0; i < n; i++) { const cx0 = (x + i * ww / n) * SPX; gx.beginPath(); gx.roundRect(cx0 + 1, y * SPX, ww / n * SPX - 2, hh * SPX, 3); gx.fill(); gx.stroke(); gx.fillStyle = 'rgba(255,255,255,.55)'; gx.fillRect(cx0 + 3, y * SPX + 2, 2, hh * SPX - 4); gx.fillStyle = 'rgba(207,214,220,.9)'; }
      gx.save(); gx.globalCompositeOperation = 'lighter'; const g2 = gx.createRadialGradient((x + ww / 2) * SPX, (y + hh / 2) * SPX, 0, (x + ww / 2) * SPX, (y + hh / 2) * SPX, ww * SPX); g2.addColorStop(0, 'rgba(220,235,255,.25)'); g2.addColorStop(1, 'rgba(220,235,255,0)'); gx.fillStyle = g2; gx.fillRect(x * SPX - ww * SPX / 2, y * SPX - ww * SPX / 2, ww * SPX * 2, ww * SPX * 2); gx.restore(); };
    if (kind === 'robot') {
      const cx0 = w / 2, top = h - 6.6;
      cell(cx0 - .7, top + 2.1, 1.4, 1.2, 3);
      cu([[cx0, top + .55], [cx0, top + 1.6], [cx0 - .3, top + 2.0]], 1.6); cu([[cx0, top + 1.6], [cx0 + .3, top + 2.0]], 1.6);
      for (const sx of [-1, 1]) { cu([[cx0 + sx * .7, top + 2.4], [cx0 + sx * 1.0, top + 1.8], [cx0 + sx * 1.37, top + 2.0], [cx0 + sx * 1.37, top + 3.9]], 1.3); cu([[cx0 + sx * .3, top + 3.3], [cx0 + sx * .4, top + 4.2], [cx0 + sx * .5, top + 6.1]], 1.3); }
      for (const sx of [-1, 1]) for (const yy of [top + 2.0, top + 5.0]) { gx.strokeStyle = '#e09a62'; gx.lineWidth = 1.4; for (let i = 0; i < 6; i++) { gx.beginPath(); gx.ellipse((cx0 + sx * 1.37) * SPX, (yy + i * .07) * SPX, 9, 3, 0, 0, TAU); gx.stroke(); } }
    } else {
      cell(2.2, h - 1.45, 5.6, .55, 9);
      cu([[1.0, h - 1.2], [2.0, h - 1.6], [8.0, h - 1.6], [9.0, h - 1.3]], 1.4); cu([[1.4, h - 1.5], [3.5, h - 2.4], [6.5, h - 2.5], [8.6, h - 1.9]], 1.1);
      for (const ax of [2.3, 7.7]) { gx.strokeStyle = '#e09a62'; gx.lineWidth = 1.5; for (let i = 0; i < 7; i++) { gx.beginPath(); gx.arc(ax * SPX, (h - .6) * SPX, (.22 + i * .035) * SPX, 0, TAU); gx.stroke(); } }
    }
    // keep the x-ray inside the body outline
    const [cm, gm] = canvas(cw, ch); shape(gm, w, h, '#fff'); if (kind === 'car') { gm.fillStyle = '#fff'; for (const ax of [2.3, 7.7]) { gm.beginPath(); gm.arc(ax * SPX, ch - .6 * SPX, .62 * SPX, 0, TAU); gm.fill(); } }
    gx.save(); gx.globalCompositeOperation = 'destination-in'; gx.drawImage(cm, 0, 0); gx.restore();
    const [cs, gs] = canvas(cw, ch); shape(gs, w, h, '#dcecff'); if (kind === 'car') { gs.fillStyle = '#dcecff'; for (const ax of [2.3, 7.7]) { gs.beginPath(); gs.arc(ax * SPX, ch - .6 * SPX, .62 * SPX, 0, TAU); gs.fill(); } }
    STX[kind] = { body: await toImg(cb), xray: await toImg(cx), scan: await toImg(cs), w, h, cw, ch };
  }
}
export function standee(ctx, t, cam, o) {
  const S = STX[o.kind], rise = clamp(o.rise ?? 1); if (!S || rise <= 0) return;
  const hgt = o.hgt ?? S.h, k = hgt / S.h, ww = S.w * k, rot = o.rot ?? 0, c = Math.cos(rot), s = Math.sin(rot), u = 1 / SPX * k;
  const sink = S.ch * (1 - ease.out(rise));   // px hidden below the lacquer
  // upright plane facing −Z (rotated by rot): px (0,0) = top-left at height hgt
  const C = [o.X, hgt / 2, o.Z], A = cam.M3(C, [c * u, 0, s * u], [0, -u, 0], S.cw / 2); if (!A) return;
  shadowQuad(ctx, cam, o.X, o.Z + .3, rot, ww * .9, .8, { a: .8 * rise });
  ctx.save(); apply(ctx, A); ctx.translate(-S.cw / 2, -S.ch / 2 + sink);
  const vis = S.ch - sink;
  if (vis > 1) ctx.drawImage(S.body, 0, 0, S.cw, vis, 0, 0, S.cw, vis);
  const sc = clamp(o.scan ?? 0);
  if (sc > 0 && vis > 1) {
    const yS = S.ch * (1 - ease.io(sc)), hh = Math.max(0, vis - yS);
    if (hh > 1) { ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(S.xray, 0, yS, S.cw, hh, 0, yS, S.cw, hh); ctx.globalCompositeOperation = 'source-over'; }
    if (sc < 1) {   // the scan line: a band of light inside the silhouette (three rows of the mask, brightest in the middle)
      ctx.globalCompositeOperation = 'lighter';
      for (const [hb, al] of [[16, .12], [8, .22], [3, .5]]) { const y0 = clamp(yS - hb, 0, vis), y1 = clamp(yS + hb, 0, vis); if (y1 - y0 < .5) continue; ctx.globalAlpha = al; ctx.drawImage(S.scan, 0, y0, S.cw, y1 - y0, 0, y0, S.cw, y1 - y0); }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
  }
  ctx.restore();
}

// ================================================================ software: light tiles that copy themselves
export const TILES = (() => {
  const out = [], r = prng(2207);
  for (let j = -5; j <= 8; j++) for (let i = -11; i <= 11; i++) { const X = i * 1.6 + (j % 2) * .8 + (r() - .5) * .18, Z = j * 1.25 + (r() - .5) * .18; out.push({ X, Z, d: Math.hypot(X, Z), ph: r() * TAU, rot: (r() - .5) * .06 }); }
  return out;
})();
export function tiles(ctx, t, cam, o) {
  if (t < o.t0 - .6) return;
  const [ox, oz] = o.O, hole = o.hole, sp = o.speed ?? 55;
  const lightOn = (q) => { const ta = q.d < .01 ? o.t0 - .55 : o.t0 + q.d / sp; let u = ease.out(clamp((t - ta) / .22)); if (o.off != null) u *= 1 - clamp((t - (o.off + (q.dmax ?? 30) / 60 - q.d / 60)) / .2); return u; };
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  let sum = 0;
  for (const q of TILES) {
    const X = ox + q.X, Z = oz + q.Z; if (X * X + Z * Z > (TB.R - 3) ** 2) continue;
    if (hole && Math.hypot(X - hole[0], Z - hole[1]) < hole[2]) continue;
    if (o.zMin != null && Z < o.zMin) continue;
    if (q.d > 0.01 && t < o.t0) continue;
    const u = lightOn(q); if (u <= .01) continue;
    const hw = .5 * u, hd = .31 * u, c = Math.cos(q.rot), s = Math.sin(q.rot), tw = .82 + .18 * Math.sin(t * 2.2 + q.ph);
    const quad = (k) => cam.poly([[-hw * k, hd * k], [hw * k, hd * k], [hw * k, -hd * k], [-hw * k, -hd * k]].map(([a, b]) => [X + a * c - b * s, .05, Z + a * s + b * c]));
    const G = quad(1.9); if (G.length < 3) continue;
    pathP(ctx, G); ctx.fillStyle = `rgba(255,214,150,${.09 * tw * u})`; ctx.fill();
    const G2 = quad(1.35); pathP(ctx, G2); ctx.fillStyle = `rgba(255,226,175,${.14 * tw * u})`; ctx.fill();
    const P = quad(1); pathP(ctx, P); ctx.fillStyle = `rgba(255,246,222,${.72 * tw * u})`; ctx.fill();
    sum += u;
  }
  // one soft field of light over the tiles (no per-tile gradients)
  if (sum > 0) { const M = cam.flatM(ox, oz + 2, 0, 1, 20); if (M) { ctx.save(); apply(ctx, M); const k = clamp(sum / 120); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 22); g.addColorStop(0, `rgba(255,232,190,${.10 * k})`); g.addColorStop(1, 'rgba(255,232,190,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fill(); ctx.restore(); } }
  ctx.restore();
}

// ================================================================ the nine dials (planetary boundaries) around a small engraved Earth
export const DIALS = ['CARBON', 'OCEANS', 'FRESH WATER', 'LAND', 'WILDLIFE', 'NITROGEN', 'NEW CHEMICALS', 'OZONE', 'AEROSOLS'];
export const DIAL_R = 3.1, EARTH_R = 4.6;
const DPX = 512;
let DTX = null;   // { face[i], glass, earth }
const ANG = (v) => -Math.PI * .75 + v * Math.PI * 1.5;   // needle angle from 12 o'clock, v 0..1 (0.62 = the boundary)
export const BOUND = .56;
function icon(g, i, x, y, s, col) {
  g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 2.2; g.lineCap = 'round'; g.lineJoin = 'round';
  const nm = DIALS[i];
  if (nm === 'FRESH WATER') { g.beginPath(); g.moveTo(0, -14); g.bezierCurveTo(8, -3, 10, 3, 0, 10); g.bezierCurveTo(-10, 3, -8, -3, 0, -14); g.stroke(); g.beginPath(); g.moveTo(-3, 2); g.quadraticCurveTo(-3, 6, 1, 7); g.stroke(); }
  else if (nm === 'LAND') { for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(-14, 6 + k * 3); g.quadraticCurveTo(0, -2 + k * 3.4, 14, 4 + k * 3); g.stroke(); } g.beginPath(); g.moveTo(-14, -8); g.lineTo(14, -8); g.stroke(); }
  else if (nm === 'WILDLIFE') { g.beginPath(); g.moveTo(-10, 2); g.quadraticCurveTo(-8, -4, 2, -3); g.lineTo(7, -7); g.lineTo(10, -6); g.lineTo(8, -2); g.quadraticCurveTo(6, 2, 4, 3); g.lineTo(4, 10); g.moveTo(-8, 2); g.lineTo(-9, 10); g.moveTo(-4, 3); g.lineTo(-4, 10); g.moveTo(1, 3); g.lineTo(1, 10); g.moveTo(7, -7); g.lineTo(5, -13); g.moveTo(5, -11); g.lineTo(2, -13); g.moveTo(8, -7); g.lineTo(11, -13); g.stroke(); }
  else if (nm === 'NITROGEN') { g.beginPath(); g.moveTo(-9, 10); g.quadraticCurveTo(-12, -6, 10, -12); g.quadraticCurveTo(8, 8, -9, 10); g.stroke(); g.beginPath(); g.moveTo(-9, 10); g.lineTo(5, -5); g.stroke(); }
  else if (nm === 'CARBON') { text(g, 'CO₂', 0, 7, { size: 20, font: 'Instrument Serif', color: col, align: 'center' }); }
  else if (nm === 'OCEANS') { for (let k = 0; k < 3; k++) { g.beginPath(); for (let x = -14; x <= 14; x += 2) { const yy = -6 + k * 6 + 2.5 * Math.sin(x * .45 + k); x > -14 ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); } }
  else if (nm === 'NEW CHEMICALS') { g.beginPath(); g.moveTo(-5, -12); g.lineTo(-5, -3); g.lineTo(-12, 9); g.lineTo(12, 9); g.lineTo(5, -3); g.lineTo(5, -12); g.stroke(); g.beginPath(); g.moveTo(-8, 3); g.lineTo(8, 3); g.stroke(); }
  else if (nm === 'OZONE') { g.beginPath(); g.arc(0, 4, 12, Math.PI, TAU); g.stroke(); g.beginPath(); g.arc(0, 4, 4, 0, TAU); g.fill(); }
  else if (nm === 'AEROSOLS') { for (const [x, yy, r] of [[-7, -3, 3], [3, -7, 2.2], [7, 2, 3.4], [-2, 6, 2.4], [-10, 6, 1.6]]) { g.beginPath(); g.arc(x, yy, r, 0, TAU); g.stroke(); } }
  g.restore();
}
function dialFace(i) {
  const [c, g] = canvas(DPX, DPX), R = DPX / 2, cx = R, cy = R, r = prng(900 + i);
  // brass bezel
  const bz = g.createRadialGradient(cx - R * .3, cy - R * .4, R * .2, cx, cy, R); bz.addColorStop(0, '#f0d9a0'); bz.addColorStop(.55, '#b08a4a'); bz.addColorStop(1, '#5c4422');
  g.fillStyle = bz; g.beginPath(); g.arc(cx, cy, R - 2, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(40,26,8,.5)'; g.lineWidth = 1.2; for (let k = 0; k < 120; k++) { const a = k / 120 * TAU; g.beginPath(); g.moveTo(cx + Math.cos(a) * (R - 3), cy + Math.sin(a) * (R - 3)); g.lineTo(cx + Math.cos(a) * (R - 14), cy + Math.sin(a) * (R - 14)); g.stroke(); }
  g.strokeStyle = 'rgba(40,26,8,.8)'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, R * .86, 0, TAU); g.stroke();
  // the cream face
  const fr = R * .84, fc = g.createRadialGradient(cx - fr * .3, cy - fr * .3, 0, cx, cy, fr); fc.addColorStop(0, '#f8f2e2'); fc.addColorStop(1, '#e4d8bc');
  g.fillStyle = fc; g.beginPath(); g.arc(cx, cy, fr, 0, TAU); g.fill();
  for (let k = 0; k < 500; k++) { const a = r() * TAU, d = Math.sqrt(r()) * fr; g.fillStyle = r() < .5 ? 'rgba(120,96,60,.06)' : 'rgba(255,255,255,.2)'; g.fillRect(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.5, 1.5); }
  // the scale: safe (green), the boundary, beyond (red)
  const ar = fr * .78, seg = (v0, v1, col, w) => { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.arc(cx, cy, ar, ANG(v0) - Math.PI / 2, ANG(v1) - Math.PI / 2); g.stroke(); };
  seg(0, BOUND, '#5f8f6a', 18); seg(BOUND, BOUND + .1, '#d39a4a', 18); seg(BOUND + .1, 1, '#b23a2a', 18);
  // hatch the red zone (engraved)
  g.strokeStyle = 'rgba(60,10,6,.35)'; g.lineWidth = 1; for (let v = BOUND + .1; v < 1; v += .012) { const a = ANG(v) - Math.PI / 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * (ar - 9), cy + Math.sin(a) * (ar - 9)); g.lineTo(cx + Math.cos(a + .02) * (ar + 9), cy + Math.sin(a + .02) * (ar + 9)); g.stroke(); }
  for (let k = 0; k <= 30; k++) { const v = k / 30, a = ANG(v) - Math.PI / 2, L = k % 5 ? 10 : 20; g.strokeStyle = rgba(F7.ink, .8); g.lineWidth = k % 5 ? 1.4 : 2.6; g.beginPath(); g.moveTo(cx + Math.cos(a) * (ar - 14), cy + Math.sin(a) * (ar - 14)); g.lineTo(cx + Math.cos(a) * (ar - 14 - L), cy + Math.sin(a) * (ar - 14 - L)); g.stroke(); }
  // the boundary mark
  { const a = ANG(BOUND) - Math.PI / 2; g.strokeStyle = F7.ink; g.lineWidth = 3.5; g.beginPath(); g.moveTo(cx + Math.cos(a) * (ar + 12), cy + Math.sin(a) * (ar + 12)); g.lineTo(cx + Math.cos(a) * (ar - 40), cy + Math.sin(a) * (ar - 40)); g.stroke(); }
  // the name (Inter caps) below the pivot, the icon above it (faint; it inks in live)
  const nm = DIALS[i], fs = nm.length > 10 ? 25 : 30;
  text(g, nm, cx, cy + fr * .56, { size: fs, weight: 700, color: rgba(F7.ink, .9), align: 'center', spacing: 2.5 });
  icon(g, i, cx, cy - fr * .36, 2.1, rgba(F7.ink, .22));
  return c;
}
function dialGlass() {   // the glass over the face: a soft reflection crescent
  const [c, g] = canvas(DPX, DPX), R = DPX / 2;
  const gr = g.createLinearGradient(0, 0, DPX, DPX); gr.addColorStop(0, 'rgba(255,255,255,.28)'); gr.addColorStop(.35, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.beginPath(); g.arc(R, R, R * .84, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(255,248,230,.5)'; g.lineWidth = 3; g.beginPath(); g.arc(R, R, R * .8, Math.PI * 1.05, Math.PI * 1.45); g.stroke();
  return c;
}
function earthMedal() {
  const S = 640, [c, g] = canvas(S, S), R = S / 2, nz = vnoise(1771), r = prng(1772);
  // brass ring
  const bz = g.createRadialGradient(R - R * .3, R - R * .4, R * .2, R, R, R); bz.addColorStop(0, '#f0d9a0'); bz.addColorStop(.6, '#a8823e'); bz.addColorStop(1, '#4a3518');
  g.fillStyle = bz; g.beginPath(); g.arc(R, R, R - 2, 0, TAU); g.fill();
  const er = R * .88;
  // the globe: deep sea, engraved land, a thin violet atmosphere (the film's Earth at night, as a print)
  g.save(); g.beginPath(); g.arc(R, R, er, 0, TAU); g.clip();
  const sea = g.createRadialGradient(R - er * .35, R - er * .35, 0, R, R, er); sea.addColorStop(0, '#2b4f7a'); sea.addColorStop(.7, '#14254a'); sea.addColorStop(1, '#0a1230'); g.fillStyle = sea; g.fillRect(0, 0, S, S);
  g.strokeStyle = 'rgba(160,190,230,.10)'; g.lineWidth = 1; for (let y = 0; y < S; y += 5) { g.beginPath(); g.moveTo(0, y); g.lineTo(S, y); g.stroke(); }
  const img = g.getImageData(0, 0, S, S), d = img.data;
  for (let y = 0; y < S; y += 1) for (let x = 0; x < S; x += 1) {
    const dx = (x - R) / er, dy = (y - R) / er, rr = dx * dx + dy * dy; if (rr > 1) continue;
    const z = Math.sqrt(1 - rr), lon = Math.atan2(dx, z) + .6, lat = Math.asin(dy);
    const v = fbm(nz, lon * 1.6 + 5, lat * 2.2 + 3, 5); if (v < .53) continue;
    const k = (y * S + x) * 4, sh = .55 + .45 * (1 - (dx + .35) * .5 - (dy + .35) * .3), hatch = ((x + y) % 6 < 1.4) ? .7 : 1;
    const isHi = v > .62, col = isHi ? [138, 120, 82] : [82, 112, 74];
    d[k] = col[0] * sh * hatch; d[k + 1] = col[1] * sh * hatch; d[k + 2] = col[2] * sh * hatch;
  }
  g.putImageData(img, 0, 0);
  // coast lines and graticule
  g.strokeStyle = 'rgba(240,226,190,.22)'; g.lineWidth = 1.2;
  for (let k = -2; k <= 2; k++) { g.beginPath(); g.ellipse(R, R + k * er * .32, er * Math.sqrt(1 - (k * .32) ** 2), er * .08, 0, 0, TAU); g.stroke(); }
  for (let k = -2; k <= 2; k++) { g.beginPath(); g.ellipse(R, R, er * Math.abs(Math.sin(k * .55)), er, 0, 0, TAU); g.stroke(); }
  // terminator: the night side with city stipple
  const nt = g.createLinearGradient(R - er * .2, 0, R + er, 0); nt.addColorStop(0, 'rgba(6,8,26,0)'); nt.addColorStop(.45, 'rgba(6,8,26,.55)'); nt.addColorStop(1, 'rgba(6,8,26,.8)'); g.fillStyle = nt; g.fillRect(0, 0, S, S);
  for (let i = 0; i < 260; i++) { const a = r() * TAU, dd = Math.sqrt(r()) * er; const x = R + Math.cos(a) * dd, y = R + Math.sin(a) * dd; if (x < R + er * .15) continue; g.fillStyle = `rgba(255,190,110,${.4 + .5 * r()})`; g.fillRect(x, y, 1.6, 1.6); }
  g.restore();
  const at = g.createRadialGradient(R, R, er * .9, R, R, er * 1.02); at.addColorStop(0, 'rgba(106,88,192,0)'); at.addColorStop(.7, 'rgba(140,120,230,.45)'); at.addColorStop(1, 'rgba(106,88,192,0)'); g.fillStyle = at; g.beginPath(); g.arc(R, R, er * 1.02, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(30,20,8,.8)'; g.lineWidth = 3; g.beginPath(); g.arc(R, R, er + 2, 0, TAU); g.stroke();
  return c;
}
// a flat disc on the table (world circle at Y) as a screen polygon
const discPoly = (cam, X, Z, r, Y = 0, n = 40) => { const P = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; P.push([X + r * Math.cos(a), Y, Z + r * Math.sin(a)]); } return cam.poly(P); };
function discSide(ctx, cam, X, Z, r, h, col) {   // the short cylinder wall of a flat instrument, seen when the camera is not straight above
  const n = 40, P = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; const q0 = cam.p(X + r * Math.cos(a), 0, Z + r * Math.sin(a)), q1 = cam.p(X + r * Math.cos(a), h, Z + r * Math.sin(a)); if (q0[3] < 1 || q1[3] < 1) return; P.push([q0[0], q0[1]], [q1[0], q1[1]]); }
  const hull = convexHull(P); if (hull.length < 3) return; pathP(ctx, hull); ctx.fillStyle = col; ctx.fill();
}
function convexHull(P) {
  const pts = P.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]); if (pts.length < 3) return pts;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  up.pop(); lo.pop(); return lo.concat(up);
}
function discShadow(ctx, cam, X, Z, r, a = 1) {
  for (const [g, al] of [[1.05, .3], [1.16, .14], [1.32, .07]]) { const P = discPoly(cam, X + .25, Z - .3, r * g, 0, 32); if (P.length > 2) { pathP(ctx, P); ctx.fillStyle = `rgba(2,2,6,${al * a})`; ctx.fill(); } }
}
export function dialPos(o, i) {
  const a = Math.PI / 2 - i / 9 * TAU + (o.turn ?? 0), f = ease.out(clamp((o.fan ?? 1) * 1.6 - i * .07));   // i = 0 at the far side (screen top)
  return [o.C[0] + Math.cos(a) * o.R * f, o.C[1] + Math.sin(a) * o.R * f, f];
}
export function dials(ctx, t, cam, o) {
  const sp = o.spot, Y = .55, warm = o.warm ?? 0;
  // the Earth slides in from the far side, the dials fan out from under it
  const eu = ease.out(clamp(o.earth ?? 1)); if (eu <= 0) return;
  const EX = o.C[0], EZ = mix(o.C[1] + 40, o.C[1], eu);
  const list = [];
  for (let i = 0; i < 9; i++) { const [X, Z, f] = dialPos(o, i); if ((o.fan ?? 1) <= 0) continue; list.push({ i, X: mix(EX, X, 1), Z: mix(EZ, Z, 1), f }); }
  for (const q of list) {
    const lk = clamp(.25 + 1.0 * spotAt(q.X, q.Z, sp)) * (1 + .25 * (o.hot?.(q.i) ?? 0));
    discShadow(ctx, cam, q.X, q.Z, DIAL_R);
    if (cam.pitch > -1.45) discSide(ctx, cam, q.X, q.Z, DIAL_R * .99, Y, shade([92, 66, 30], lk * .8, warm));
    const M = cam.flatM(q.X, q.Z, 0, DIAL_R * 2 / DPX, DIAL_R, Y); if (!M) continue;
    ctx.save(); apply(ctx, M); ctx.translate(-DPX / 2, -DPX / 2);
    ctx.drawImage(DTX.face[q.i], 0, 0);
    // the icon inks in when its word is spoken
    const ic = o.icon?.(q.i) ?? 0;
    if (ic > 0) icon(ctx, q.i, DPX / 2, DPX / 2 - DPX / 2 * .84 * .36, 2.1, rgba('#7a2a18', .9 * ic));
    // the needle
    const v = o.val(q.i), a = ANG(v), L = DPX * .36;
    ctx.save(); ctx.translate(DPX / 2, DPX / 2); ctx.rotate(a);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.moveTo(-6 + 6, 14 + 6); ctx.lineTo(6, -L + 6); ctx.lineTo(10, 14 + 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1c1714'; ctx.beginPath(); ctx.moveTo(-7, 18); ctx.lineTo(0, -L); ctx.lineTo(7, 18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = v > BOUND + .02 ? '#b23a2a' : '#1c1714'; ctx.beginPath(); ctx.moveTo(-3.5, -L * .62); ctx.lineTo(0, -L); ctx.lineTo(3.5, -L * .62); ctx.closePath(); ctx.fill();
    const hb = ctx.createRadialGradient(-4, -4, 0, 0, 0, 16); hb.addColorStop(0, '#f6e2b0'); hb.addColorStop(1, '#7a5a26'); ctx.fillStyle = hb; ctx.beginPath(); ctx.arc(0, 0, 15, 0, TAU); ctx.fill();
    ctx.restore();
    // the red zone glows when the needle is in it
    const hot = clamp((v - BOUND) / .1) * (o.redA ?? 1);
    if (hot > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,90,60,${.22 * hot * (.8 + .2 * Math.sin(t * 3 + q.i))})`; ctx.lineWidth = 34; ctx.beginPath(); ctx.arc(DPX / 2, DPX / 2, DPX / 2 * .84 * .78, ANG(BOUND + .1) - Math.PI / 2, ANG(1) - Math.PI / 2); ctx.stroke(); ctx.restore(); }
    ctx.drawImage(DTX.glass, 0, 0);
    // clean power: a warm sun glint lies on this dial
    const sun = o.sun?.(q.i) ?? 0;
    if (sun > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(DPX * .38, DPX * .32, 0, DPX * .45, DPX * .45, DPX * .62); g.addColorStop(0, `rgba(255,214,150,${.42 * sun})`); g.addColorStop(.5, `rgba(255,190,110,${.16 * sun})`); g.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(DPX / 2, DPX / 2, DPX * .62, 0, TAU); ctx.fill();
      ctx.strokeStyle = `rgba(255,236,200,${.6 * sun})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(DPX / 2, DPX / 2, DPX / 2 * .8, Math.PI * 1.08, Math.PI * 1.5); ctx.stroke(); ctx.restore(); }
    // light falls off outside the pool (the face is an image: darken it with the pool)
    if (lk < 1) { ctx.fillStyle = `rgba(6,6,12,${clamp(1 - lk) * .8})`; ctx.beginPath(); ctx.arc(DPX / 2, DPX / 2, DPX / 2 - 1, 0, TAU); ctx.fill(); }
    // a highlight ring when the spot singles it out
    const hl = o.ring?.(q.i) ?? 0;
    if (hl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#fff1d6', .5 * hl); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(DPX / 2, DPX / 2, DPX / 2 + 10, 0, TAU); ctx.stroke(); ctx.restore(); }
    ctx.restore();
  }
  // the Earth medallion (on top: the dials fan out from under it)
  discShadow(ctx, cam, EX, EZ, EARTH_R, eu);
  if (cam.pitch > -1.45) discSide(ctx, cam, EX, EZ, EARTH_R * .99, .8, shade([96, 70, 32], .8, warm));
  const M = cam.flatM(EX, EZ, -t * .02, EARTH_R * 2 / 640, EARTH_R, .8);
  if (M) { ctx.save(); apply(ctx, M); ctx.drawImage(DTX.earth, -320, -320); const lk = clamp(.3 + spotAt(EX, EZ, sp)); if (lk < 1) { ctx.fillStyle = `rgba(6,6,12,${(1 - lk) * .75})`; ctx.beginPath(); ctx.arc(0, 0, 318, 0, TAU); ctx.fill(); } ctx.restore(); }
}

// ================================================================ people at table scale (figureFlat, alive), the key ring
const FIG_H = 1.95;   // cm, standing
export function person(ctx, t, cam, q, o = {}) {
  const F = cam.p(q.X, 0, q.Z); if (F[3] < 1.5) return null;
  const Hd = cam.p(q.X, FIG_H, q.Z), hpx = Math.hypot(Hd[0] - F[0], Hd[1] - F[1]); if (hpx < 3) return null;
  if (F[0] < -hpx || F[0] > W + hpx || F[1] < -20 || Hd[1] > H + 20) return null;
  const s = hpx / 185, lit = clamp(q.lit ?? spotAt(q.X, q.Z, o.spot));
  const pose = q.pose || POSES.stand, warm = o.warm ?? 0;
  const col = shade([16, 14, 40], .55 + .45 * lit, warm), rim = rgba(warm > .5 ? '#ffd8a8' : '#d8e6f4', .18 + .7 * lit);
  figureFlat(ctx, F[0], F[1] - 90 * s, s, pose, { t, seed: q.seed, col, rim, rimW: Math.max(.8, .9 * s), rimSide: -1, flip: q.flip, fast: true, shadow: true });
  return { x: F[0], y: F[1] - 90 * s, s, pose };
}
export function keyRing(ctx, t, x, y, s, a = 1, glint = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a;
  const sw = .12 * Math.sin(t * 2.1);
  ctx.strokeStyle = '#e9d6a0'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.stroke();
  for (const [k, ang, L] of [[0, -.5, 20], [1, .05, 23], [2, .55, 18]]) {
    ctx.save(); ctx.rotate(ang + sw * (1 + k * .3)); ctx.translate(0, 7);
    ctx.fillStyle = '#e9d6a0'; ctx.strokeStyle = 'rgba(60,40,10,.7)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 4, 4.2, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillRect(-1.3, 7, 2.6, L - 7); ctx.fillRect(1.3, L - 6, 3.5, 2.2); ctx.fillRect(1.3, L - 2.6, 2.6, 2.2);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  if (glint > 0) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(4, 14, 0, 4, 14, 26); g.addColorStop(0, `rgba(255,244,210,${.7 * glint})`); g.addColorStop(1, 'rgba(255,244,210,0)'); ctx.fillStyle = g; ctx.fillRect(-26, -12, 60, 60);
    ctx.strokeStyle = `rgba(255,250,235,${.8 * glint})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(4 - 14 * glint, 14); ctx.lineTo(4 + 14 * glint, 14); ctx.moveTo(4, 14 - 14 * glint); ctx.lineTo(4, 14 + 14 * glint); ctx.stroke(); }
  ctx.restore();
}

// ================================================================ the robots (copied from c04: f7_c04_props robot + sprites)
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
const SPR = { lv: [12, 17, 24, 34, 48, 68, 96, 136, 192, 272], rims: 5, img: null };
const sprBox = (s) => ({ w: Math.ceil(s * 1.0) + 4, h: Math.ceil(s * 1.12) + 4 });
async function robotsPrepare() {
  if (SPR.img) return; SPR.img = [];
  for (const s of SPR.lv) { const row = [];
    for (let k = 0; k < SPR.rims; k++) { const b = sprBox(s), [c, g] = canvas(b.w, b.h);
      if (s > 8) { g.fillStyle = 'rgba(2,2,8,.35)'; g.beginPath(); g.ellipse(b.w / 2 + s * .12, b.h - 2, s * .32, s * .07, 0, 0, TAU); g.fill(); }
      robot(g, 0, b.w / 2, b.h - 2, s, { seed: 0, rimA: k / (SPR.rims - 1) * .92, rim: '#d8e6f4' }); row.push(await toImg(c)); }
    SPR.img.push(row); }
}
function sprite(ctx, x, y, hpx, rimA, sink = 0) {
  let li = SPR.lv.findIndex((s) => s >= hpx); if (li < 0) li = SPR.lv.length - 1;
  const s = SPR.lv[li], img = SPR.img[li][Math.round(clamp(rimA / .92) * (SPR.rims - 1))], b = sprBox(s), k = hpx / s;
  const dw = b.w * k, dh = b.h * k, dx = x - dw / 2, dy = y + sink - (b.h - 2) * k;
  if (!sink) { ctx.drawImage(img, dx, dy, dw, dh); return; }
  const vis = (y + 2 * k) - dy; if (vis <= .5) return;
  ctx.drawImage(img, 0, 0, b.w, Math.min(b.h, vis / k), dx, dy, dw, Math.min(dh, vis));
}
export const ROBOT_H = 1.65;
// robots on a grid, rising out of the lacquer row by row (front first) and sinking back
export function robots(ctx, t, cam, o) {
  const list = [];
  for (let j = o.nz - 1; j >= 0; j--) for (let i = 0; i < o.nx; i++) {
    const X = o.X0 + i * o.dx + (j % 2) * .25, Z = o.Z0 + j * o.dz;
    const ta = o.t0 + j * .07 + i * .025, u = clamp((t - ta) / .38) * (1 - clamp(o.sink ?? 0));
    if (u <= 0) continue;
    const F = cam.p(X, 0, Z); if (F[3] < 1.2) continue;
    const Hd = cam.p(X, ROBOT_H, Z), hpx = Math.hypot(Hd[0] - F[0], Hd[1] - F[1]);
    if (F[0] < -hpx || F[0] > W + hpx || F[1] < -10 || Hd[1] > H + 10) continue;
    const lit = spotAt(X, Z, o.spot), rimA = (.22 + .7 * lit) * clamp((u - .45) * 2.2);
    list.push({ d: F[3], x: F[0], y: F[1] + Math.sin(t * 1.3 + i * 1.7 + j) * .006 * hpx, hpx, rimA, sink: u < 1 ? hpx * (1 - ease.out(u)) : 0 });
  }
  list.sort((a, b) => b.d - a.d);
  for (const q of list) sprite(ctx, q.x, q.y, q.hpx, q.rimA, q.sink);
}

// ================================================================ the fair part: solar rows, grid batteries, the price column
export function solarRow(ctx, t, cam, o) {
  const rise = ease.out(clamp(o.rise ?? 1)); if (rise <= 0) return;
  const L = o.L ?? 16, D = 2.2, tilt = .42, h0 = .45 * rise, X = o.X, Z = o.Z, warm = o.warm ?? 0;
  const yb = h0, yt = h0 + Math.sin(tilt) * D * rise, zb = Z - Math.cos(tilt) * D / 2, zt = Z + Math.cos(tilt) * D / 2;
  // legs
  ctx.strokeStyle = 'rgba(20,20,34,.9)'; ctx.lineWidth = 1.2; ctx.beginPath();
  for (let x = X - L / 2 + .6; x < X + L / 2; x += 2.4) for (const [zz, yy] of [[zb, yb], [zt, yt]]) { const a = cam.p(x, 0, zz), b = cam.p(x, yy, zz); if (a[3] > 1) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } }
  ctx.stroke();
  const P = cam.poly([[X - L / 2, yb, zb], [X + L / 2, yb, zb], [X + L / 2, yt, zt], [X - L / 2, yt, zt]]); if (P.length < 3) return;
  const lk = lightAt(norm([0, Math.cos(tilt), -Math.sin(tilt)]), [X, yt, Z], o.spot);
  pathP(ctx, P); ctx.fillStyle = shade([30, 44, 86], lk, warm * .5); ctx.fill(); ctx.strokeStyle = rgba('#cfe0f0', .45); ctx.lineWidth = 1; ctx.stroke();
  // the cells (engraved grid)
  ctx.strokeStyle = 'rgba(150,180,230,.28)'; ctx.lineWidth = .8; ctx.beginPath();
  for (let i = 1; i < 24; i++) { const x = X - L / 2 + L * i / 24, a = cam.p(x, yb, zb), b = cam.p(x, yt, zt); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  for (let j = 1; j < 3; j++) { const u = j / 3, a = cam.p(X - L / 2, mix(yb, yt, u), mix(zb, zt, u)), b = cam.p(X + L / 2, mix(yb, yt, u), mix(zb, zt, u)); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  ctx.stroke();
  // the warm reflection sliding along the row (the sun / the lamp in the glass)
  const gx = X - L / 2 + L * (((t * .06 + (o.ph ?? 0)) % 1.3) - .15), a = cam.p(gx - 1.2, mix(yb, yt, .5), Z), b = cam.p(gx + 1.2, mix(yb, yt, .5), Z);
  if (a[3] > 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g.addColorStop(0, 'rgba(255,220,170,0)'); g.addColorStop(.5, `rgba(255,226,180,${.35 * (.4 + .6 * warm) * rise})`); g.addColorStop(1, 'rgba(255,220,170,0)'); ctx.fillStyle = g; pathP(ctx, P); ctx.fill(); ctx.restore(); }
}
export function container(ctx, t, cam, o) {
  const rise = ease.out(clamp(o.rise ?? 1)); if (rise <= 0) return;
  const w = 3.4, d = 1.3, h = 1.35 * rise, warm = o.warm ?? 0;
  shadowQuad(ctx, cam, o.X, o.Z, 0, w, d, { a: rise });
  const V = boxV(o.X, 0, o.Z, w, h, d, 0);
  const fs = solid(ctx, cam, V, BOXF, (n, c) => shade([214, 216, 208], lightAt(n, c, o.spot) * (n[1] > .9 ? 1.1 : .85), warm), { edge: 'rgba(30,30,40,.6)', lw: .9 });
  for (const f of fs) if (Math.abs(f.n[2]) > .9) { const [a, b, c2, d2] = f.pts; ctx.strokeStyle = 'rgba(40,40,50,.35)'; ctx.lineWidth = .8; ctx.beginPath(); for (let i = 1; i < 14; i++) { const u = i / 14, p = cam.p(...[0, 1, 2].map((k) => mix(a[k], b[k], u))), q = cam.p(...[0, 1, 2].map((k) => mix(d2[k], c2[k], u))); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } ctx.stroke(); }
  // a status light on the front: breathes
  const L = cam.p(o.X + w / 2 - .35, h * .75, o.Z - d / 2 - .01); if (L[3] > 1 && rise > .9) { const br = .6 + .4 * Math.sin(t * 2 + o.X); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#9fe0a8', .8 * br); ctx.beginPath(); ctx.arc(L[0], L[1], Math.max(1.2, .09 * L[2]), 0, TAU); ctx.fill(); const g = ctx.createRadialGradient(L[0], L[1], 0, L[0], L[1], .5 * L[2]); g.addColorStop(0, rgba('#9fe0a8', .3 * br)); g.addColorStop(1, 'rgba(159,224,168,0)'); ctx.fillStyle = g; ctx.fillRect(L[0] - .5 * L[2], L[1] - .5 * L[2], L[2], L[2]); ctx.restore(); }
}
// the price column: a brass-coloured block; it drops by o.drop (0..1 of its height) and leaves its old height as an engraved ghost
export function priceColumn(ctx, t, cam, o) {
  const rise = ease.out(clamp(o.rise ?? 1)); if (rise <= 0) return;
  const w = 2.4, h0 = (o.h ?? 9) * rise, hNow = h0 * (1 - (o.drop ?? 0) * (o.fall ?? 0)), warm = o.warm ?? 0;
  shadowQuad(ctx, cam, o.X, o.Z, 0, w, w, { a: rise });
  const V = boxV(o.X, 0, o.Z, w, hNow, w, 0);
  const fs = solid(ctx, cam, V, BOXF, (n, c) => shade([196, 150, 80], lightAt(n, c, o.spot) * (n[1] > .9 ? 1.15 : .8), warm), { edge: 'rgba(50,30,10,.6)', lw: 1 });
  for (const f of fs) if (f.n[1] < .5) engrave(ctx, cam, [f.pts[3], f.pts[2], f.pts[1], f.pts[0]], Math.round(hNow * 3), 'rgba(60,36,10,.22)', .8);
  if ((o.fall ?? 0) > 0 && (o.drop ?? 0) > 0) {
    const g = clamp(o.ghost ?? 1), Vg = boxV(o.X, hNow, o.Z, w, h0 - hNow, w, 0);
    const gs = solid(ctx, cam, Vg, BOXF, () => 'rgba(243,236,218,.06)');
    for (const f of gs) engrave(ctx, cam, f.n[1] > .9 ? f.pts : [f.pts[3], f.pts[2], f.pts[1], f.pts[0]], 9, rgba('#f3ecda', .22 * g), 1);
    ctx.setLineDash([6, 4]); ctx.strokeStyle = rgba('#f3ecda', .75 * g); ctx.lineWidth = 1.6; for (const f of gs) { pathP(ctx, f.P); ctx.stroke(); } ctx.setLineDash([]);
  }
}

// ================================================================ the lamp plate (handoff4 'light', tone lamp) under an affine, as a disc
const LIGHT = ['#fff1d6', '#ffcf8a', '#e08a3c'];
const DOTS = (() => { const r = prng(901), d = []; for (let i = 0; i < 2600; i++) d.push([r(), r(), r()]); return d; })();
const DOTX = (() => { const r = prng(9017), d = []; for (let i = 0; i < 1400; i++) d.push([r() * 2.6 - .8, r() * 2.6 - .8, r()]); return d.filter(([u, v]) => u < 0 || u > 1 || v < 0 || v > 1); })();
// the same image as handoff4's lightPlate at M = identity; beyond the frame rect (only visible while M is smaller than the frame) the
// gradient's edge colour and the same stipple rule continue, so the disc is round and whole
export function lampDisc(ctx, t, M, o = {}) {
  t += TSHIFT;
  const [c0, c1, c2] = LIGHT, br = 1 + .03 * Math.sin(t * 1.7) + .015 * Math.sin(t * 4.3);
  const cx = W / 2 + 18 * drift(t, 1, 3), cy = H / 2 + 12 * drift(t, 1, 7), R = 1150;
  ctx.save(); apply(ctx, M);
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip();
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * br); g.addColorStop(0, c0); g.addColorStop(.42, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(cx - R - 40, cy - R - 40, 2 * R + 80, 2 * R + 80);
  const r = prng(31 + Math.floor(t * 12)); ctx.fillStyle = rgba(c2, .32);
  for (const [u, v, k] of DOTS) { const x = u * W, y = v * H, d = Math.hypot(x - cx, y - cy) / 1100; if (d < .35) continue; if (k > (d - .35) * 1.4) continue; const s = .8 + r() * 1.1; ctx.fillRect(x + (r() - .5) * 2, y + (r() - .5) * 2, s, s); }
  if (o.outside !== false) { const r2 = prng(77 + Math.floor(t * 12)); for (const [u, v, k] of DOTX) { const x = u * W, y = v * H, d = Math.hypot(x - cx, y - cy) / 1100; if (d < .35 || d > 1.04) continue; if (k > (d - .35) * 1.4) continue; const s = .8 + r2() * 1.1; ctx.fillRect(x + (r2() - .5) * 2, y + (r2() - .5) * 2, s, s); } }
  ctx.restore();
  return { cx, cy, R };
}

// ================================================================ the label (copied from c04: big serif value + small caps source, wiped)
export function label(ctx, t, big, small, x, y, t0, t1, o = {}) {
  const a = ease.out(lin(t0, t0 + .6, t)), b = ease.inn(lin(t1 - .4, t1, t)); if (a <= 0 || b >= 1) return;
  const bs = o.size ?? 76;
  ctx.save(); ctx.font = `${bs}px "Instrument Serif"`; const bw = big ? ctx.measureText(big).width : 0; ctx.restore();
  const wv = Math.max(bw, small.length * 15.5, (o.small2 || '').length * 15.5, (o.small3 || '').length * 15.5) + 40;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 10 + wv * b, y - bs * 1.2, wv * (a - b), bs * 1.2 + 110); ctx.clip();
  if (big) text(ctx, big, x, y, { size: bs, font: 'Instrument Serif', color: '#f6efdc' });
  text(ctx, small, x + 2, y + (big ? 44 : 0), { size: 18, weight: 600, color: rgba('#cfd6ee', .9), spacing: 4 });
  if (o.small2) text(ctx, o.small2, x + 2, y + (big ? 72 : 28), { size: 18, weight: 600, color: rgba('#cfd6ee', .75), spacing: 4 });
  if (o.small3) text(ctx, o.small3, x + 2, y + (big ? 100 : 56), { size: 18, weight: 600, color: rgba('#cfd6ee', .75), spacing: 4 });
  ctx.restore();
  ctx.fillStyle = rgba(F7.amber, .9); ctx.fillRect(x - 24, y - bs * .82, 3, (bs * .82 + (big ? 52 : 8) + (o.small2 ? 28 : 0) + (o.small3 ? 28 : 0)) * (a - b));
}

// ================================================================ prepare
let PREP = null;
export function propsPrepare() {
  if (PREP) return PREP;
  PREP = (async () => {
    const [f, fg] = strataTex(MB.w, 501, true), [sd] = strataTex(MB.d, 502, false);
    MTX = { front: await toImg(f), frontGlow: await toImg(fg), side: await toImg(sd), top: await toImg(mineTopTex()) };
    await standeePrepare();
    DTX = { face: [], glass: await toImg(dialGlass()), earth: await toImg(earthMedal()) };
    for (let i = 0; i < 9; i++) DTX.face.push(await toImg(dialFace(i)));
    await robotsPrepare();
  })();
  return PREP;
}
