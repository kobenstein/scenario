// c09 · the night courtyard (one continuous 3D world): the far wall W with its rows of dark windows, the two side walls, the
// cobbled floor in mist, the roofs around, the ground-floor pane P the take starts in (the glass plate, redrawn on its glass),
// the top-floor window L with the storm lantern on its outer sill. The far field (sky, bay, the Maslow hill) is lib/maslow4.mjs
// drawHill() on a plane beyond W, mapped from this camera (camFar) so that the last camera IS VIEWS.H2.
// World: metres, Y up, the camera looks along −Z. W's courtyard face is the plane Z = 0, its centre X = 0.
// Look: an engraving at night. World-anchored line work (courses, cross-hatching in the shadows) with a level of detail that keeps
// the line pitch on screen at a few px while the camera travels 100×; ink outlines; moonlit top edges; one amber lantern.
import { W, H, rgba, clamp, mix, lin, sm, prng } from '../engine.mjs';
import { cs, P3, path3, line3, plane, scaleAt, TAU, toScr } from './v2_c09_kit.mjs';
import { VIEWS } from './maslow4.mjs';

export const FL = [0, 4, 7.3, 10.6, 13.9, 17.2, 20.5, 23.8];          // floor lines (ground floor 4 m, then 3.3 m); cornice from 23.8
export const CW = 22, CD = 45, STEP = 2.75;                              // courtyard half width, depth, window axis spacing
export const ROOF = 25.5, RAIL = 25.8;
const GLASSZ = -.2;
export const winOf = (k) => ({ sill: FL[k] + (k ? .9 : .85), h: k ? (k === 6 ? 1.85 : 1.95) : 2.15, arch: k ? 0 : .42, w: 1.25 });
export const WP = { c: -2, k: 0 }, WL = { c: -5, k: 6 };
export const XP = WP.c * STEP, XL = WL.c * STEP, SILL_L = winOf(6).sill;
// the start pane: the right lower light of window P (ground floor). Plate space ↔ glass: s0 px per metre at H.b
export const PANE = (() => {
  const w = winOf(0), x0 = XP + .025, x1 = XP + w.w / 2 - .06, y0 = w.sill + .06, y1 = w.sill + w.h - .03;
  const s0 = 1960 / (x1 - x0), cx = (x0 + x1) / 2, cy = 2.0;
  return { x0, x1, y0, y1, s0, cx, cy, z: GLASSZ };
})();
export const CAM_PANE = { x: PANE.cx, y: PANE.cy, z: GLASSZ + 1000 / PANE.s0, f: 1000, pitch: 0, oy: 540 };
// the far field: the last camera of the take must show exactly VIEWS.H2 → plane depth Zh and metres per hill unit k
export const CAM_END = { x: 0, y: 46, z: 22, f: 1000, pitch: 0, oy: 540 };
const YW = -3;
export const FAR = (() => {
  const v = VIEWS.H2.cam, c = CAM_END, hy = (792 - v.y) * v.z + 540;
  const d = c.f * (c.y - YW) / (hy - c.oy), k = v.z * d / c.f;
  return { Zh: c.z - d, k, Yw: YW };
})();
export function camFar(cam) {
  const d = cam.z - FAR.Zh, z = cam.f * FAR.k / d, oy = (cam.oy ?? 540) + cam.f * Math.tan(cam.pitch || 0);
  return { x: 960 + cam.x / FAR.k, y: 792 + (540 - oy + cam.f * (FAR.Yw - cam.y) / d) / z, z };
}
export const hillPt = (hx, hy) => [(hx - 960) * FAR.k, FAR.Yw + (792 - hy) * FAR.k, FAR.Zh];

// ---------------------------------------------------------------- colours (night engraving)
const INK = '#05061a';
const C2 = {
  wTop: '#333a74', wMid: '#232858', wLow: '#161a3e', trim: '#3c4484', trimSh: '#252a5c', trimLit: '#5a63a8', moon: '#9aa3e6',
  glassT: '#141b40', glassB: '#04050e', frame: '#1d2148', frameLit: '#3a4282', sideLit: '#2a305f', sideDk: '#11132e', roof: '#1b1f42', roofLit: '#2c3266',
};
const inShadowW = (X, Y) => Y <= 25 - 2 * (X + CW);   // the left wing's moon shadow on W
const hash = (a, b = 0) => { const v = Math.sin(a * 127.1 + b * 311.7 + 7.3) * 43758.5453; return v - Math.floor(v); };
function mixHex(a, b, u) { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], clamp(u)))).join(',')})`; }

// ---------------------------------------------------------------- helpers
const rectZ = (ctx, cam, x0, y0, x1, y1, z) => path3(ctx, cam, [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], true);
const rectX = (ctx, cam, X, z0, y0, z1, y1) => path3(ctx, cam, [[X, y0, z0], [X, y0, z1], [X, y1, z1], [X, y1, z0]], true);
const rectY = (ctx, cam, Y, x0, z0, x1, z1) => path3(ctx, cam, [[x0, Y, z0], [x1, Y, z0], [x1, Y, z1], [x0, Y, z1]], true);
function fillPath(ctx, col, build) { ctx.beginPath(); build(); ctx.fillStyle = col; ctx.fill(); }
function fillInk(ctx, col, build, lw, a = .7) { ctx.beginPath(); build(); ctx.fillStyle = col; ctx.fill(); if (lw > 0) { ctx.strokeStyle = rgba(INK, a); ctx.lineWidth = lw; ctx.stroke(); } }
function grad3(ctx, cam, a, b, stops) { const p = P3(cam, ...a), q = P3(cam, ...b), g = ctx.createLinearGradient(p[0], p[1], q[0], q[1]); for (const [o, c] of stops) g.addColorStop(o, c); return g; }
// the world rectangle of the plane Z = z0 that the frame shows (corners unprojected)
function unprojZ(cam, sx, sy, z0) {
  const p = cam.pitch || 0, cp = Math.cos(p), sp = Math.sin(p), xc = (sx - W / 2) / cam.f, yc = ((cam.oy ?? H / 2) - sy) / cam.f, den = cp - yc * sp;
  if (den <= 1e-4) return null; const lam = (cam.z - z0) / den; return [cam.x + xc * lam, cam.y + lam * (yc * cp + sp)];
}
function visZ(cam, z0, m = 60) {
  const pts = [[-m, -m], [W + m, -m], [-m, H + m], [W + m, H + m]].map(([x, y]) => unprojZ(cam, x, y, z0));
  if (pts.some((p) => !p)) return { x0: -1e3, x1: 1e3, y0: -1e3, y1: 1e3 };
  return { x0: Math.min(...pts.map((p) => p[0])), x1: Math.max(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), y1: Math.max(...pts.map((p) => p[1])) };
}
// level of detail for line work: spacing d (a power of 2 in metres) so that d·s ≈ px; the in-between lines grow in with r
function lod(px, s) { const L = Math.log2(px / Math.max(1e-6, s)), n = Math.floor(L); return { d: 2 ** n, r: L - n }; }
// engraved parallel lines on W (plane Z = 0) inside a world box: horizontal (dir 'h') or diagonal ('d': X − Y = const)
function linesW(ctx, cam, box, vis, px, col, a, lw, dir = 'h') {
  const x0 = Math.max(box[0], vis.x0), x1 = Math.min(box[2], vis.x1), y0 = Math.max(box[1], vis.y0), y1 = Math.min(box[3], vis.y1);
  if (x1 <= x0 || y1 <= y0) return;
  const s = scaleAt(cam, (x0 + x1) / 2, (y0 + y1) / 2, 0), { d, r } = lod(px, s);
  ctx.lineWidth = lw;
  for (const odd of [0, 1]) {
    const al = odd ? a * (1 - r) : a; if (al < .01) continue;
    ctx.strokeStyle = rgba(col, al); ctx.beginPath();
    if (dir === 'h') { for (let k = Math.ceil(y0 / d); k * d <= y1; k++) if ((Math.abs(k) & 1) === odd) line3(ctx, cam, [[x0, k * d, 0], [x1, k * d, 0]], true); }
    else { for (let k = Math.ceil((x0 - y1) / d); k * d <= x1 - y0; k++) if ((Math.abs(k) & 1) === odd) { const c = k * d; line3(ctx, cam, [[Math.max(x0, c + y0), Math.max(x0, c + y0) - c, 0], [Math.min(x1, c + y1), Math.min(x1, c + y1) - c, 0]], true); } }
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- the glass plate on pane P (lib/handoff4.mjs glassPlate, same numbers)
function plateToScreen(cam) {
  const a0 = PANE.cx - 960 / PANE.s0, b0 = PANE.cy + 540 / PANE.s0, m = plane(cam, PANE.cx, PANE.cy, PANE.z).m, s0 = PANE.s0;
  return [m[0] / s0, m[1] / s0, -m[2] / s0, -m[3] / s0, m[0] * a0 + m[2] * b0 + m[4], m[1] * a0 + m[3] * b0 + m[5]];
}
const DUST2 = (() => { const r = prng(1312), d = []; for (let i = 0; i < 360; i++) d.push([r(), r(), r(), r()]); return d; })();
function glassPlateContent(ctx, t, uv) {
  const [u0, v0, u1, v1] = uv;
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0a0f24'); g.addColorStop(1, '#05060f'); ctx.fillStyle = g; ctx.fillRect(u0, v0, u1 - u0, v1 - v0);
  const x = W * (.3 + .04 * Math.sin(t * .4)); ctx.save(); ctx.translate(x, H / 2); ctx.rotate(.5);
  const s = ctx.createLinearGradient(-260, 0, 260, 0); s.addColorStop(0, 'rgba(216,247,255,0)'); s.addColorStop(.5, 'rgba(216,247,255,.06)'); s.addColorStop(1, 'rgba(216,247,255,0)');
  ctx.fillStyle = s; ctx.fillRect(-260, -6000, 520, 12000); ctx.restore();
  const r = prng(12); for (let i = 0; i < 70; i++) { const px = r() * W, py = (r() * H + t * 8 * (r() + .3)) % H; ctx.fillStyle = `rgba(216,247,255,${.05 + .08 * r()})`; ctx.fillRect(px, py, 1.6, 1.6); }
  const top = -v0 > 0 ? -v0 : 0, bot = v1 - H > 0 ? v1 - H : 0, span = top + bot;
  if (span > 0) for (const [a, b, c, e] of DUST2) {
    const yy = ((b * span + t * 8 * (c + .3)) % span), py = yy < top ? v0 + yy : H + (yy - top);
    ctx.fillStyle = `rgba(216,247,255,${.05 + .08 * e})`; ctx.fillRect(u0 + a * (u1 - u0), py, 1.6, 1.6);
  }
}
export function paneP(ctx, t, cam) {
  ctx.save();
  path3(ctx, cam, [[PANE.x0, PANE.y0, PANE.z], [PANE.x1, PANE.y0, PANE.z], [PANE.x1, PANE.y1, PANE.z], [PANE.x0, PANE.y1, PANE.z]]); ctx.clip();
  ctx.setTransform(...plateToScreen(cam));
  const s0 = PANE.s0, uv = [(PANE.x0 - PANE.cx) * s0 + 960 - 2, (PANE.cy - PANE.y1) * s0 + 540 - 2, (PANE.x1 - PANE.cx) * s0 + 960 + 2, (PANE.cy - PANE.y0) * s0 + 540 + 2];
  glassPlateContent(ctx, t, uv);
  ctx.restore();
}

// ---------------------------------------------------------------- glass (all the other panes: the same dark glass, a sheen anchored to it)
function glass(ctx, cam, x0, y0, x1, y1, z, seed, warm = 0, clipBuild = null) {
  const top = warm > 0 ? mixHex(C2.glassT, '#3a2414', warm) : C2.glassT, bot = warm > 0 ? mixHex(C2.glassB, '#120804', warm) : C2.glassB;
  ctx.save(); ctx.beginPath(); if (clipBuild) clipBuild(); else rectZ(ctx, cam, x0, y0, x1, y1, z); ctx.clip();
  fillPath(ctx, grad3(ctx, cam, [x0, y1, z], [x0, y0, z], [[0, top], [1, bot]]), () => rectZ(ctx, cam, x0 - .5, y0 - .5, x1 + .5, y1 + .5, z));
  const k = hash(seed) * .7, xm = mix(x0, x1, k), w2 = (y1 - y0) * .55, glint = hash(seed, 3) > .86 ? 2.2 : 1;
  fillPath(ctx, `rgba(200,230,255,${.045 * glint})`, () => path3(ctx, cam, [[xm - .14, y0, z], [xm + .02, y0, z], [xm + .02 + w2, y1, z], [xm - .14 + w2, y1, z]], true));
  ctx.restore();
}

// ---------------------------------------------------------------- one window of W
const TVS = new Set(['3,2', '-1,4', '6,1', '-6,3', '1,5']);
function windowW(ctx, t, cam, c, k, S, lw) {
  const X = c * STEP, w = winOf(k), x0 = X - w.w / 2, x1 = X + w.w / 2, y0 = w.sill, y1 = w.sill + w.h, top = y1 + w.arch;
  const s = scaleAt(cam, X, y0 + w.h / 2, 0), px = s * w.w; if (px < 1.2) return;
  const isL = c === WL.c && k === WL.k, isP = c === WP.c && k === WP.k, lit = inShadowW(X, y1) ? 0 : 1;
  const warm = isL ? S.lampWarm : 0, ol = px > 14 ? lw : 0;
  const arch = (z, ins = 0) => { const pts = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * i / 12; pts.push([X - (w.w / 2 - ins) * Math.cos(a), y1 + (w.arch - ins * .5) * Math.sin(a), z]); } return pts; };
  // stone surround (architrave), keystone on the arched ground floor
  const trim = lit ? C2.trim : C2.trimSh;
  if (w.arch) fillInk(ctx, trim, () => path3(ctx, cam, [[x0 - .16, y0 - .06, 0], [x1 + .16, y0 - .06, 0], ...arch(0, -.16).reverse()], true), ol);
  else fillInk(ctx, trim, () => rectZ(ctx, cam, x0 - .14, y0 - .05, x1 + .14, top + .17, 0), ol);
  if (w.arch && px > 8) fillInk(ctx, lit ? C2.trimLit : C2.trim, () => path3(ctx, cam, [[X - .09, top - .02, .01], [X + .09, top - .02, .01], [X + .12, top + .2, .01], [X - .12, top + .2, .01]], true), ol);
  if (!w.arch && px > 8) { fillPath(ctx, rgba(C2.moon, lit ? .22 : .1), () => rectZ(ctx, cam, x0 - .14, top + .13, x1 + .14, top + .17, 0)); }
  // the opening
  const opening = () => (w.arch ? path3(ctx, cam, [[x0, y0, 0], [x1, y0, 0], ...arch(0).reverse()], true) : rectZ(ctx, cam, x0, y0, x1, top, 0));
  fillPath(ctx, warm > 0 ? mixHex('#04050e', '#1e0e06', warm) : '#04050e', opening);
  if (px < 5) return;
  // glass (P's right lower light carries the glass plate itself)
  if (w.arch) {
    if (isP && S.paneDetail) paneP(ctx, t, cam); else glass(ctx, cam, X + .025, y0 + .06, x1 - .06, y1 - .03, GLASSZ, c * 7 + k + 1);
    glass(ctx, cam, x0 + .06, y0 + .06, X - .025, y1 - .03, GLASSZ, c * 7 + k + 2);
    glass(ctx, cam, x0, y1, x1, top, GLASSZ, c * 7 + k + 3, 0, () => path3(ctx, cam, [[x0 + .06, y1 + .03, GLASSZ], [x1 - .06, y1 + .03, GLASSZ], ...arch(GLASSZ, .06).reverse()], true));
  } else glass(ctx, cam, x0, y0, x1, y1, GLASSZ, c * 7 + k, warm);
  // curtains half drawn, a screen's cold flicker in a few rooms
  const key = `${c},${k}`, hv = hash(c * 13 + 1, k * 7 + 2);
  if (!isL && !isP && px >= 9 && hv < .32) {
    const left = hv < .16, cx0 = left ? x0 + .05 : X + .12, cx1 = left ? X - .12 : x1 - .05;
    fillPath(ctx, lit ? 'rgba(120,128,196,.2)' : 'rgba(90,96,150,.13)', () => rectZ(ctx, cam, cx0, y0 + .05, cx1, y1 - .05, GLASSZ));
    if (px > 40) { ctx.strokeStyle = 'rgba(10,12,30,.3)'; ctx.lineWidth = lw; ctx.beginPath(); for (let i = 1; i < 5; i++) { const xx = mix(cx0, cx1, i / 5); line3(ctx, cam, [[xx, y0 + .06, GLASSZ], [xx + .02, y1 - .06, GLASSZ]], true); } ctx.stroke(); }
  }
  if (TVS.has(key)) {
    const f = .55 + .45 * Math.sin(t * 7.3 + c) * Math.sin(t * 2.9 + k * 3), q = S.tvs ?? 1;
    fillPath(ctx, rgba('#8fe6ff', (.06 + .06 * f) * q), () => rectZ(ctx, cam, x0 + .05, y0 + .05, x1 - .05, y1 - .05, GLASSZ));
  }
  // the reveals (side faces of the recess) where the camera can see them
  if (px > 12) {
    const rv = (xr, nx) => { if ((cam.x - xr) * nx <= 0) return; const lt = nx > 0 ? (lit ? .9 : .5) : .25; fillPath(ctx, warm > 0 && nx > 0 ? mixHex('#262a58', '#8a5a2c', warm) : mixHex('#0b0d24', '#2b3166', lt), () => path3(ctx, cam, [[xr, y0, 0], [xr, y0, GLASSZ], [xr, y1, GLASSZ], [xr, y1, 0]], true)); };
    rv(x0, 1); rv(x1, -1);
    if (!w.arch && cam.y < top) fillPath(ctx, '#080a1e', () => path3(ctx, cam, [[x0, top, 0], [x1, top, 0], [x1, top, GLASSZ], [x0, top, GLASSZ]], true));
  }
  if (px < 9) { fillPath(ctx, lit ? C2.trimLit : C2.trim, () => rectZ(ctx, cam, x0 - .1, y0 - .07, x1 + .1, y0, .12)); return; }
  // casement frame (painted wood): outer frame, mullion, transom; moonlit top edges
  const fz = GLASSZ + .02, fb = .05, fcol = warm > .05 ? mixHex(C2.frame, '#5a3418', warm) : C2.frame;
  const bars = () => {
    if (!w.arch) {
      rectZ(ctx, cam, x0, y0, x1, y0 + fb, fz); rectZ(ctx, cam, x0, y1 - fb, x1, y1, fz); rectZ(ctx, cam, x0, y0, x0 + fb, y1, fz); rectZ(ctx, cam, x1 - fb, y0, x1, y1, fz);
      rectZ(ctx, cam, X - fb / 2, y0, X + fb / 2, y1, fz); const ty = y0 + w.h * .68; rectZ(ctx, cam, x0, ty - fb / 2, x1, ty + fb / 2, fz);
    } else {
      rectZ(ctx, cam, x0, y0, x1, y0 + .06, fz); rectZ(ctx, cam, x0, y0, x0 + .06, y1, fz); rectZ(ctx, cam, x1 - .06, y0, x1, y1, fz);
      rectZ(ctx, cam, X - .025, y0, X + .025, y1, fz); rectZ(ctx, cam, x0, y1 - .03, x1, y1 + .03, fz);
    }
  };
  fillInk(ctx, fcol, bars, px > 60 ? lw * .8 : 0, .5);
  if (px > 30) { ctx.strokeStyle = rgba(warm > .05 ? '#ffcf8a' : C2.moon, warm > .05 ? .35 * warm : (lit ? .3 : .14)); ctx.lineWidth = lw; ctx.beginPath(); const ty = y0 + w.h * .68; if (!w.arch) { line3(ctx, cam, [[x0 + fb, y1 - fb, fz], [x1 - fb, y1 - fb, fz]], true); line3(ctx, cam, [[x0 + fb, ty + fb / 2, fz], [x1 - fb, ty + fb / 2, fz]], true); } line3(ctx, cam, [[x0 + .05, y0 + .05, fz], [x0 + .05, y1 - .05, fz]], true); ctx.stroke(); }
  // the sill: a stone slab (top face lit by the moon or the lantern, front face, a shadow on the wall under it)
  const sx0 = x0 - .1, sx1 = x1 + .1, sz1 = .12;
  if (cam.y > y0) fillInk(ctx, warm > 0 ? mixHex(lit ? C2.trimLit : C2.trim, '#d6995a', warm) : (lit ? C2.trimLit : C2.trim), () => rectY(ctx, cam, y0, sx0, GLASSZ, sx1, sz1), ol * .8, .5);
  fillInk(ctx, warm > 0 ? mixHex(C2.trim, '#9a6232', warm * .8) : C2.trim, () => rectZ(ctx, cam, sx0, y0 - .07, sx1, y0, sz1), ol);
  fillPath(ctx, 'rgba(4,5,16,.5)', () => rectZ(ctx, cam, sx0 + .02, y0 - .24, sx1 - .02, y0 - .07, 0));
  if (px > 20) { ctx.strokeStyle = rgba(C2.moon, lit ? .45 : .2); ctx.lineWidth = lw; ctx.beginPath(); line3(ctx, cam, [[sx0, y0, sz1], [sx1, y0, sz1]], true); ctx.stroke(); }
  // flower pots on a few sills (a pot and a small plant)
  if (!isL && !isP && hv > .8 && px > 30) {
    for (let i = 0; i < 2; i++) {
      const pxw = X - .3 + i * .5 + hash(c, k + i) * .1;
      fillInk(ctx, lit ? '#4a3448' : '#2e2236', () => path3(ctx, cam, [[pxw - .06, y0, .04], [pxw + .06, y0, .04], [pxw + .08, y0 + .12, .04], [pxw - .08, y0 + .12, .04]], true), ol * .7, .5);
      ctx.beginPath(); for (let j = 0; j < 6; j++) { const a = -1 + j * .4; path3(ctx, cam, [[pxw, y0 + .12, .04], [pxw + Math.sin(a) * .17 - .025, y0 + .12 + Math.cos(a) * .22, .04], [pxw + Math.sin(a) * .17 + .025, y0 + .12 + Math.cos(a) * .22, .04]], true); }
      ctx.fillStyle = lit ? '#2c3e52' : '#182232'; ctx.fill();
    }
  }
}
function gate(ctx, t, cam, lw) {
  const x0 = -1.5, x1 = 1.5, y1 = 3.0, r = 1.5;
  const arc = (ins, z = 0) => { const a = []; for (let i = 0; i <= 16; i++) { const q = Math.PI * i / 16; a.push([-(r - ins) * Math.cos(q), y1 + (r - ins) * Math.sin(q) * .7, z]); } return a; };
  fillInk(ctx, C2.trim, () => path3(ctx, cam, [[x0 - .28, 0, 0], [x1 + .28, 0, 0], ...arc(-.28).reverse()], true), lw);
  fillPath(ctx, '#05061a', () => path3(ctx, cam, [[x0, 0, 0], [x1, 0, 0], ...arc(0).reverse()], true));
  fillInk(ctx, '#1b1c38', () => path3(ctx, cam, [[x0 + .08, 0, -.15], [x1 - .08, 0, -.15], ...arc(.08, -.15).reverse()], true), lw * .7, .5);
  ctx.save(); ctx.strokeStyle = 'rgba(4,5,16,.55)'; ctx.lineWidth = lw;
  ctx.beginPath(); line3(ctx, cam, [[0, 0, -.15], [0, y1 + r * .7 - .08, -.15]], true);
  for (let x = -1.25; x <= 1.26; x += .25) if (Math.abs(x) > .05) line3(ctx, cam, [[x, .1, -.15], [x, y1 + Math.sqrt(Math.max(0, (r - .08) ** 2 - x * x)) * .7 - .1, -.15]], true);
  ctx.stroke(); ctx.restore();
}
// a turned baluster's outline (half profile, from the foot up): [half width, height] pairs, mirrored
const BAL = [[.07, 0], [.07, .08], [.05, .1], [.065, .22], [.075, .32], [.06, .44], [.032, .56], [.028, .62], [.045, .66], [.06, .7], [.06, .74]];
function balustrade(ctx, cam, X0, X1, z, lw, side = null) {
  // side: null → along X on the plane Z = z; { X, z0, z1 } → along Z on the plane X
  const P = side ? (u, y) => [side.X, y, mix(side.z0, side.z1, u)] : (u, y) => [mix(X0, X1, u), y, z];
  const len = side ? Math.abs(side.z1 - side.z0) : X1 - X0, y0 = 24.6;
  const quad = (u0, u1, ya, yb) => path3(ctx, cam, [P(u0, ya), P(u1, ya), P(u1, yb), P(u0, yb)], true);
  const s = side ? scaleAt(cam, side.X, y0, clamp(cam.z - 6, side.z0, side.z1)) : scaleAt(cam, clamp(cam.x, X0, X1), y0, z);
  fillInk(ctx, C2.trim, () => { quad(0, 1, y0, y0 + .14); }, lw);
  const n = Math.round(len / .3);
  if (s * .3 > 3) {
    const lit = [], dk = [];
    for (let i = 0; i < n; i++) {
      const u = (i + .5) / n, du = 1 / len, yb = y0 + .14;
      const L = BAL.map(([hw, hh]) => P(u - hw * du, yb + hh)), R = BAL.map(([hw, hh]) => P(u + hw * du, yb + hh)).reverse(), M = BAL.map(([, hh]) => P(u, yb + hh)).reverse();
      dk.push([...L, ...R]); lit.push([...L, ...M]);
    }
    ctx.beginPath(); for (const p of dk) path3(ctx, cam, p, true); ctx.fillStyle = C2.trimSh; ctx.fill();
    ctx.beginPath(); for (const p of lit) path3(ctx, cam, p, true); ctx.fillStyle = C2.trimLit; ctx.fill();
    if (s * .3 > 9) { ctx.beginPath(); for (const p of dk) path3(ctx, cam, p, true); ctx.strokeStyle = rgba(INK, .55); ctx.lineWidth = lw * .8; ctx.stroke(); }
  } else fillPath(ctx, 'rgba(46,52,104,.85)', () => quad(0, 1, y0 + .14, RAIL - .16));
  fillInk(ctx, C2.trim, () => quad(0, 1, RAIL - .16, RAIL), lw);
  ctx.strokeStyle = rgba(C2.moon, .5); ctx.lineWidth = lw; ctx.beginPath(); line3(ctx, cam, [P(0, RAIL), P(1, RAIL)], true); ctx.stroke();
}

// ---------------------------------------------------------------- the far wall W
function wallW(ctx, t, cam, S, lw) {
  const vis = visZ(cam, 0);
  fillPath(ctx, grad3(ctx, cam, [0, 0, 0], [0, 24.6, 0], [[0, C2.wLow], [.5, C2.wMid], [1, C2.wTop]]), () => rectZ(ctx, cam, -CW, 0, CW, 24.6, 0));
  // engraved courses all over (world-anchored, pitch ≈ 6 px on screen), stronger cross-hatching in the moon shadow and low down
  linesW(ctx, cam, [-CW, 0, CW, 23.8], vis, 6, '#070820', .34, lw);
  ctx.save(); ctx.beginPath(); path3(ctx, cam, [[-CW, 0, 0], [-CW + 12.5, 0, 0], [-CW, 25, 0]], true); ctx.fillStyle = 'rgba(4,5,16,.42)'; ctx.fill(); ctx.clip();
  linesW(ctx, cam, [-CW, 0, CW, 25], vis, 5, '#05061a', .5, lw, 'd'); ctx.restore();
  ctx.save(); ctx.beginPath(); rectZ(ctx, cam, -CW, 0, CW, 4, 0); ctx.clip(); linesW(ctx, cam, [-CW, 0, CW, 4], vis, 7, '#05061a', .3, lw, 'd'); ctx.restore();
  // string courses at each floor (a projecting band: moonlit top, ink edge, shadow below)
  for (let k = 1; k < 7; k++) {
    const y = FL[k]; if (y < vis.y0 - 1 || y > vis.y1 + 1) continue;
    fillInk(ctx, C2.trim, () => rectZ(ctx, cam, -CW, y - .1, CW, y + .14, 0), lw);
    fillPath(ctx, 'rgba(4,5,16,.45)', () => rectZ(ctx, cam, -CW, y - .32, CW, y - .1, 0));
    ctx.strokeStyle = rgba(C2.moon, .4); ctx.lineWidth = lw; ctx.beginPath(); line3(ctx, cam, [[-CW, y + .14, 0], [CW, y + .14, 0]], true); ctx.stroke();
  }
  for (let k = 0; k < 7; k++) for (let c = -7; c <= 7; c++) {
    const X = c * STEP, wv = winOf(k); if (X + 1 < vis.x0 || X - 1 > vis.x1 || wv.sill + wv.h + 1 < vis.y0 || wv.sill - 1 > vis.y1) continue;
    if (k === 0 && c === 0) { gate(ctx, t, cam, lw); continue; }
    windowW(ctx, t, cam, c, k, S, lw);
  }
  // cornice (dentils when near) + balustrade
  if (vis.y1 > 23) {
    fillPath(ctx, 'rgba(4,5,16,.55)', () => rectZ(ctx, cam, -CW, 23.5, CW, 23.8, 0));
    fillInk(ctx, C2.trim, () => rectZ(ctx, cam, -CW, 23.8, CW, 24.6, 0), lw);
    fillPath(ctx, C2.trimLit, () => rectZ(ctx, cam, -CW, 24.44, CW, 24.6, 0));
    const s = scaleAt(cam, clamp(cam.x, -CW, CW), 24, 0);
    if (s * .12 > 2.5) { ctx.beginPath(); for (let x = -CW + .1; x < CW; x += .24) { if (x < vis.x0 - 1 || x > vis.x1 + 1) continue; rectZ(ctx, cam, x, 23.86, x + .12, 24.06, 0); } ctx.fillStyle = 'rgba(4,5,16,.5)'; ctx.fill(); }
    balustrade(ctx, cam, -CW, CW, 0, lw);
  }
}

// ---------------------------------------------------------------- the side walls (inner faces X = ±CW, from Z = 0 to CD)
function sideWall(ctx, t, cam, sgn, S, lw) {
  const X = sgn * CW, lit = sgn > 0;
  if ((cam.x - X) * sgn > 0) return;
  const zMax = Math.min(CD, cam.z - .05); if (zMax <= 0) return;
  fillPath(ctx, grad3(ctx, cam, [X, 0, 6], [X, 24.6, 6], [[0, lit ? C2.wLow : '#0a0c22'], [1, lit ? C2.sideLit : C2.sideDk]]), () => rectX(ctx, cam, X, 0, 0, zMax, 24.6));
  // courses (perspective), denser hatch on the shadow wall
  const sm2 = scaleAt(cam, X, clamp(cam.y, 0, 24), Math.max(0, cam.z - 12)), { d, r } = lod(lit ? 7 : 5, sm2);
  ctx.lineWidth = lw;
  for (const odd of [0, 1]) { const a = (lit ? .3 : .45) * (odd ? 1 - r : 1); if (a < .01) continue; ctx.strokeStyle = rgba('#05061a', a); ctx.beginPath(); for (let k = 1; k * d < 24.6; k++) if ((k & 1) === odd) line3(ctx, cam, [[X, k * d, 0], [X, k * d, zMax]], true); ctx.stroke(); }
  for (let k = 1; k < 7; k++) { fillInk(ctx, lit ? C2.trim : '#1d2148', () => rectX(ctx, cam, X, 0, FL[k] - .1, zMax, FL[k] + .14), lw * .8, .5); fillPath(ctx, 'rgba(4,5,16,.4)', () => rectX(ctx, cam, X, 0, FL[k] - .3, zMax, FL[k] - .1)); }
  for (let k = 0; k < 7; k++) {
    const w = winOf(k), y0 = w.sill, y1 = w.sill + w.h + w.arch * .6;
    for (let j = 0; j < 15; j++) {
      const z = 2.6 + j * STEP, z0 = z - w.w / 2, z1 = z + w.w / 2;
      if (z1 > zMax - .3) continue;
      const px = scaleAt(cam, X, y0, z) * w.w;
      fillInk(ctx, lit ? C2.trim : '#1a1e44', () => rectX(ctx, cam, X, z0 - .14, y0 - .05, z1 + .14, y1 + .16), px > 20 ? lw * .8 : 0, .5);
      fillPath(ctx, '#04050e', () => rectX(ctx, cam, X, z0, y0, z1, y1));
      const hv = hash(j * 5 + sgn, k * 3);
      fillPath(ctx, grad3(ctx, cam, [X, y1, z], [X, y0, z], [[0, lit ? '#1a2148' : '#10142e'], [1, '#04050e']]), () => rectX(ctx, cam, X, z0 + .05, y0 + .05, z1 - .05, y1 - .05));
      if (hv < .2) fillPath(ctx, rgba('#8fe6ff', .05 + .04 * Math.sin(t * 6.1 + j) * Math.sin(t * 2.3 + k)), () => rectX(ctx, cam, X, z0 + .05, y0 + .05, z1 - .05, y1 - .05));
      if (px > 6) { ctx.strokeStyle = lit ? C2.frameLit : C2.frame; ctx.lineWidth = Math.max(lw, px * .03); ctx.beginPath(); line3(ctx, cam, [[X, y0, z], [X, y1, z]], true); line3(ctx, cam, [[X, y0 + w.h * .68, z0], [X, y0 + w.h * .68, z1]], true); ctx.stroke(); }
      fillPath(ctx, lit ? C2.trimLit : C2.trim, () => rectX(ctx, cam, X, z0 - .1, y0 - .07, z1 + .1, y0));
    }
  }
  fillInk(ctx, C2.trim, () => rectX(ctx, cam, X, 0, 23.8, zMax, 24.6), lw * .8, .5);
  fillPath(ctx, lit ? C2.trimLit : C2.trim, () => rectX(ctx, cam, X, 0, 24.44, zMax, 24.6));
  balustrade(ctx, cam, 0, 0, 0, lw, { X, z0: 0, z1: zMax });
}

// ---------------------------------------------------------------- floor (cobbles in mist)
function floor(ctx, t, cam, lw) {
  if (cam.y < .05) return;
  const zMax = Math.min(CD, cam.z - .1); if (zMax <= 0) return;
  fillPath(ctx, grad3(ctx, cam, [0, 0, 0], [0, 0, zMax], [[0, '#1b1e40'], [1, '#0a0b20']]), () => path3(ctx, cam, [[-CW, 0, 0], [CW, 0, 0], [CW, 0, zMax], [-CW, 0, zMax]], true));
  ctx.save(); ctx.lineWidth = lw; ctx.strokeStyle = 'rgba(4,5,16,.45)'; ctx.beginPath();
  for (let z = .3; z < zMax; z += .3) line3(ctx, cam, [[-CW, 0, z], [CW, 0, z]], true);
  ctx.stroke(); ctx.strokeStyle = 'rgba(4,5,16,.3)'; ctx.beginPath();
  for (let j = 0; j * .3 < zMax; j++) for (let x = -CW + (j % 2) * .2; x < CW; x += .4) { const z = j * .3; if (cs(cam, x, 0, z)[2] < 4 || cs(cam, x, 0, z)[2] > 26) continue; line3(ctx, cam, [[x, 0, z], [x, 0, Math.min(zMax, z + .3)]], true); }
  ctx.stroke(); ctx.restore();
}
// ---------------------------------------------------------------- roofs (zinc with standing seams), chimney stacks, skylights
function chimney(ctx, cam, x, z, w, h, lw, seed) {
  const y0 = ROOF, y1 = ROOF + h, d = .7, s = scaleAt(cam, x, y1, z);
  // body: the face toward the camera (+Z, moonlit), the side we see, brick courses, the cap slab, two clay pots
  if (cam.x < x - w / 2) fillInk(ctx, '#2a2f60', () => path3(ctx, cam, [[x - w / 2, y0, z + d / 2], [x - w / 2, y1, z + d / 2], [x - w / 2, y1, z - d / 2], [x - w / 2, y0, z - d / 2]], true), lw);
  if (cam.x > x + w / 2) fillInk(ctx, '#151834', () => path3(ctx, cam, [[x + w / 2, y0, z + d / 2], [x + w / 2, y1, z + d / 2], [x + w / 2, y1, z - d / 2], [x + w / 2, y0, z - d / 2]], true), lw);
  fillInk(ctx, '#2c2a52', () => rectZ(ctx, cam, x - w / 2, y0, x + w / 2, y1, z + d / 2), lw);
  if (s * .12 > 2) { ctx.strokeStyle = 'rgba(5,6,26,.5)'; ctx.lineWidth = lw * .8; ctx.beginPath(); for (let y = y0 + .12; y < y1 - .1; y += .12) line3(ctx, cam, [[x - w / 2, y, z + d / 2], [x + w / 2, y, z + d / 2]], true); ctx.stroke(); }
  fillInk(ctx, '#4a528f', () => path3(ctx, cam, [[x - w / 2 - .06, y1, z - d / 2 - .06], [x + w / 2 + .06, y1, z - d / 2 - .06], [x + w / 2 + .06, y1, z + d / 2 + .06], [x - w / 2 - .06, y1, z + d / 2 + .06]], true), lw);
  fillInk(ctx, '#3c4380', () => rectZ(ctx, cam, x - w / 2 - .06, y1 - .1, x + w / 2 + .06, y1, z + d / 2 + .06), lw);
  for (const dx of [-w * .22, w * .22]) {
    const px0 = x + dx, r = .1, ph = .36 + .1 * hash(seed, dx);
    fillInk(ctx, '#3a2c44', () => rectZ(ctx, cam, px0 - r, y1, px0 + r, y1 + ph, z), lw);
    fillPath(ctx, 'rgba(154,163,230,.25)', () => rectZ(ctx, cam, px0 - r, y1, px0 - r * .4, y1 + ph, z + .001));
    fillInk(ctx, '#4a3a56', () => rectZ(ctx, cam, px0 - r * 1.2, y1 + ph - .05, px0 + r * 1.2, y1 + ph, z + .002), lw);
  }
}
function roofs(ctx, t, cam, lw) {
  if (cam.y < ROOF - 4) return;
  const top = (x0, z0, x1, z1, y, col) => fillPath(ctx, col, () => path3(ctx, cam, [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], true));
  top(-90, -12, 90, 0, ROOF, grad3(ctx, cam, [0, ROOF, 0], [0, ROOF, -12], [[0, C2.roof], [1, C2.roofLit]]));
  top(-34, 0, -CW, CD, ROOF, C2.roof); top(CW, 0, 34, CD, ROOF, C2.roof);
  top(-90, 0, -34, CD, ROOF - 1.4, '#141634'); top(34, 0, 90, CD, ROOF + .8, '#161838');
  // standing seams
  ctx.save(); ctx.lineWidth = lw; ctx.strokeStyle = 'rgba(150,160,230,.16)'; ctx.beginPath();
  for (let x = -80; x <= 80; x += 1.2) line3(ctx, cam, [[x, ROOF, -12], [x, ROOF, 0]], true);
  for (let z = 1.2; z < CD; z += 1.2) { line3(ctx, cam, [[-34, ROOF, z], [-CW, ROOF, z]], true); line3(ctx, cam, [[CW, ROOF, z], [34, ROOF, z]], true); }
  ctx.stroke(); ctx.restore();
  // the waterfront parapet of W's roof
  fillInk(ctx, C2.trim, () => path3(ctx, cam, [[-90, ROOF, -12], [90, ROOF, -12], [90, ROOF + .5, -12], [-90, ROOF + .5, -12]], true), lw * .8, .5);
  fillPath(ctx, C2.trimLit, () => path3(ctx, cam, [[-90, ROOF + .5, -12.3], [90, ROOF + .5, -12.3], [90, ROOF + .5, -12], [-90, ROOF + .5, -12]], true));
  // skylights: dark glass in a frame, catching the sky
  for (const [x, z] of [[-11, -4], [6, -6.5], [15, -3], [-29, 20], [28, 9]]) {
    fillInk(ctx, '#2a3064', () => path3(ctx, cam, [[x - .7, ROOF + .2, z - .5], [x + .7, ROOF + .2, z - .5], [x + .7, ROOF + .2, z + .5], [x - .7, ROOF + .2, z + .5]], true), lw);
    fillPath(ctx, grad3(ctx, cam, [x, ROOF + .21, z - .4], [x, ROOF + .21, z + .4], [[0, '#2a3470'], [1, '#080a1c']]), () => path3(ctx, cam, [[x - .6, ROOF + .21, z - .4], [x + .6, ROOF + .21, z - .4], [x + .6, ROOF + .21, z + .4], [x - .6, ROOF + .21, z + .4]], true));
  }
  // chimney stacks, back to front
  const CH = [[-40, -4, 1.4, 2.6], [-17, -5, 1.2, 2.3], [-8.5, -8, 1.4, 2.7], [2.5, -4.5, 1.1, 2.1], [11, -7.5, 1.3, 2.5], [19, -3.5, 1, 2], [44, -6, 1.2, 2.4], [-28, 14, 1.2, 2.3], [28, 22, 1.2, 2.5]];
  CH.sort((a, b) => a[1] - b[1]).forEach(([x, z, w, h], i) => chimney(ctx, cam, x, z, w, h, lw, i));
}
function mist(ctx, t, cam) {
  if (cam.y > 30) return;
  for (let i = 0; i < 4; i++) {
    const z = 3 + i * 8 + 1.5 * Math.sin(t * .2 + i), y = .4 + i * .35;
    if (cs(cam, 0, y, z)[2] < .8) continue;
    const a = P3(cam, -CW, y, z), b = P3(cam, CW, y, z), q = P3(cam, 0, y + 2.4, z), hgt = Math.max(4, a[1] - q[1]);
    const g = ctx.createLinearGradient(0, a[1] - hgt, 0, a[1] + hgt * .5);
    g.addColorStop(0, 'rgba(76,90,160,0)'); g.addColorStop(.62, `rgba(76,90,160,${.13 - i * .02})`); g.addColorStop(1, 'rgba(76,90,160,0)');
    ctx.fillStyle = g; ctx.fillRect(Math.min(a[0], b[0]), a[1] - hgt, Math.abs(b[0] - a[0]), hgt * 1.5);
  }
}

// ---------------------------------------------------------------- the storm lantern on L's sill (about 23 cm tall)
export const LANTERN = { x: XL - .34, y: SILL_L, z: -.07 };
export function lantern(ctx, t, cam, on) {
  const pl = plane(cam, LANTERN.x, LANTERN.y + .1, LANTERN.z), s = pl.s; if (s * .23 < 1.5) return;
  ctx.save(); pl.set(ctx);
  const x = LANTERN.x, y = LANTERN.y, ink = 'rgba(5,6,20,.85)', u = 1 / s;
  const fl = on > 0 ? on * (.93 + .05 * Math.sin(t * 13) + .02 * Math.sin(t * 29 + 1)) : 0;
  const metal = (a) => mixHex('#22202e', '#c08a48', a * fl);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // contact shadow on the sill
  ctx.fillStyle = 'rgba(4,4,12,.45)'; ctx.beginPath(); ctx.ellipse(x + .01, y + .002, .07, .008, 0, 0, TAU); ctx.fill();
  // fuel tank: a squat drum with a rim
  ctx.fillStyle = metal(.55); ctx.beginPath(); ctx.moveTo(x - .055, y); ctx.lineTo(x + .055, y); ctx.lineTo(x + .058, y + .03); ctx.quadraticCurveTo(x, y + .042, x - .058, y + .03); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = 1.2 * u; ctx.stroke();
  ctx.strokeStyle = rgba('#ffd9a0', .35 * fl); ctx.lineWidth = 1 * u; ctx.beginPath(); ctx.moveTo(x - .05, y + .012); ctx.lineTo(x - .05, y + .028); ctx.stroke();
  // the burner collar
  ctx.fillStyle = metal(.7); ctx.fillRect(x - .02, y + .036, .04, .012); ctx.strokeStyle = ink; ctx.lineWidth = 1 * u; ctx.strokeRect(x - .02, y + .036, .04, .012);
  // the glass globe (clear): the flame inside, the glow, reflections; wire guards over it
  const gy = y + .1, gw = .042, gh = .052;
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, gy, gw, gh, 0, 0, TAU); ctx.clip();
  ctx.fillStyle = fl > 0 ? rgba('#2a1406', .6) : 'rgba(14,20,44,.85)'; ctx.fillRect(x - gw, gy - gh, gw * 2, gh * 2);
  if (fl > 0) {
    const g = ctx.createRadialGradient(x, gy - .008, 0, x, gy, gw * 1.3); g.addColorStop(0, rgba('#fff4dc', .95 * fl)); g.addColorStop(.3, rgba('#ffc46e', .75 * fl)); g.addColorStop(1, rgba('#b4581c', .25 * fl));
    ctx.fillStyle = g; ctx.fillRect(x - gw, gy - gh, gw * 2, gh * 2);
  }
  ctx.restore();
  if (fl > .02) {
    const fh = .036 * Math.min(1, on * 1.5) * (1 + .07 * Math.sin(t * 11)), fx = x + .0015 * Math.sin(t * 9);
    ctx.fillStyle = rgba('#fffaf0', Math.min(1, fl * 1.1)); ctx.beginPath(); ctx.moveTo(fx, gy - .022 + fh); ctx.bezierCurveTo(fx + .011, gy - .005, fx + .009, gy - .02, fx, gy - .026); ctx.bezierCurveTo(fx - .009, gy - .02, fx - .011, gy - .005, fx, gy - .022 + fh); ctx.fill();
    ctx.fillStyle = rgba('#ffb35c', .8 * fl); ctx.beginPath(); ctx.ellipse(fx, gy - .023, .005, .004, 0, 0, TAU); ctx.fill();
  }
  ctx.strokeStyle = rgba(fl > 0 ? '#fff6e6' : '#aab4e8', fl > 0 ? .55 : .3); ctx.lineWidth = 1.4 * u; ctx.beginPath(); ctx.ellipse(x - .012, gy - .005, .018, .036, -.15, Math.PI * .95, Math.PI * 1.45); ctx.stroke();
  ctx.strokeStyle = ink; ctx.lineWidth = 1.1 * u; ctx.beginPath(); ctx.ellipse(x, gy, gw, gh, 0, 0, TAU); ctx.stroke();
  // guard wires and the two side tubes of the frame
  ctx.strokeStyle = metal(.6); ctx.lineWidth = 2.2 * u; ctx.beginPath();
  for (const dx of [-.62, 0, .62]) { ctx.moveTo(x + dx * gw, gy - gh - .004); ctx.quadraticCurveTo(x + dx * gw * 1.55, gy, x + dx * gw, gy + gh + .004); }
  ctx.stroke(); ctx.strokeStyle = ink; ctx.lineWidth = .8 * u; ctx.stroke();
  ctx.fillStyle = metal(.5);
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.roundRect(x + sx * (gw + .012) - .004, y + .03, .008, .125, .003); ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 1 * u; ctx.stroke(); }
  // the top: chimney cap with vents, the bail handle
  ctx.fillStyle = metal(.65); ctx.beginPath(); ctx.moveTo(x - .058, gy + gh + .004); ctx.lineTo(x + .058, gy + gh + .004); ctx.lineTo(x + .032, gy + gh + .03); ctx.lineTo(x - .032, gy + gh + .03); ctx.closePath(); ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 1.1 * u; ctx.stroke();
  ctx.fillStyle = metal(.5); ctx.fillRect(x - .016, gy + gh + .03, .032, .022); ctx.strokeRect(x - .016, gy + gh + .03, .032, .022);
  ctx.strokeStyle = metal(.55); ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(x - .066, gy + gh - .005); ctx.bezierCurveTo(x - .072, gy + gh + .09, x + .072, gy + gh + .09, x + .066, gy + gh - .005); ctx.stroke();
  ctx.strokeStyle = ink; ctx.lineWidth = .7 * u; ctx.stroke();
  ctx.restore();
}
// the lantern's warm light on everything around it (additive): a hot pool on the sill, a quick falloff over the wall
export function lanternLight(ctx, t, cam, on, k = 1) {
  if (on <= 0) return;
  const p = P3(cam, LANTERN.x, LANTERN.y + .09, LANTERN.z), s = scaleAt(cam, LANTERN.x, LANTERN.y, LANTERN.z), br = on * (.94 + .04 * Math.sin(t * 13) + .02 * Math.sin(t * 31));
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const R = 1.7 * s, g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R);
  g.addColorStop(0, rgba('#ffb35c', .3 * br * k)); g.addColorStop(.06, rgba('#ff9a40', .2 * br * k)); g.addColorStop(.25, rgba('#c8642a', .07 * br * k)); g.addColorStop(1, 'rgba(120,50,20,0)');
  ctx.fillStyle = g; ctx.fillRect(p[0] - R, p[1] - R, 2 * R, 2 * R);
  const r2 = .07 * s, g2 = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r2);
  g2.addColorStop(0, rgba('#fff1d6', .5 * br)); g2.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = g2; ctx.fillRect(p[0] - r2, p[1] - r2, 2 * r2, 2 * r2);
  ctx.restore();
}

// ---------------------------------------------------------------- the whole near world
// S: { lamp 0..1, lampWarm, paneDetail, tvs }
export function court(ctx, t, cam, S) {
  const lw = 1.05;
  roofs(ctx, t, cam, lw);
  wallW(ctx, t, cam, S, lw);
  sideWall(ctx, t, cam, -1, S, lw); sideWall(ctx, t, cam, 1, S, lw);
  floor(ctx, t, cam, lw);
  mist(ctx, t, cam);
}
