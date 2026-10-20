// C08 · the hall of forms (8.08): a benefits office at dusk, empty — rows of clerks' desks, each with a green banker's lamp, a lone
// form and stacks of forms, chairs pushed in; pigeonhole cabinets along the walls, a long counter with brass grilles at the far end;
// above, a glass barrel vault on iron ribs with its ridge vent opened (the forms leave through it).
// World: metres, Y up, the floor at 0. The hero form lies on the hero desk at the origin: FU (fx, fy) → fuW(fx, fy).
//   drawHall(ctx, t, cam, st)   st: { lamps 0..1 (lamp light), heroDraw(ctx, cam) (draws the hero sheet), stackU(d, k) → 0..1 (how much of
//                               stack k of desk d is left), layers: 'all' | 'interior' }
import { W, H, rgba, clamp, mix, prng, canvas, memo, once, hash, TAU, noise1 } from './v2_c08_core.mjs';
import { rgb, css, lerpC, mulC, fillS, pathS, poolOn, linOn, boxVis, depthOf, distOf, Painter, glowAt, gridTex, onScreen, bboxS, line3, mips, mipPick } from './v2_c08_space.mjs';
import { DESK } from './v2_c08_form.mjs';

export const U = 0.00021, DESK_Y = .762;
export const fuW = (fx, fy, y = DESK_Y + .0006) => [(fx - 500) * U, y, -(fy - 707) * U];
// the hall
export const HALL = { x0: -17.5, x1: 17.5, z0: -11, z1: 46, cornice: 11, vaultR: 9.257, vaultC: 6.343, ridge: 15.6, vent: .95 };   // vault: circle centre Y vaultC, radius vaultR, springing at X ±8, Y 11
// desks: columns × rows; desk-local frame = the hero desk's (top X ±1.197, Z −0.408 … 0.694 around the row origin)
const COLS = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => i * 3.6), ROWS = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((j) => j * 3.2);
const TOPX = [(DESK.x0 - 500) * U, (DESK.x1 - 500) * U], TOPZ = [-(DESK.y1 - 707) * U, -(DESK.y0 - 707) * U];   // [-1.197, 1.197], [-0.408, 0.694]
export const DESKS = memo('c08desks', () => {
  const r = prng(5150), out = [];
  for (const cz of ROWS) for (const cx of COLS) {
    const hero = cx === 0 && cz === 0, id = out.length;
    const stacks = [];
    // two or three stacks of forms to the right of the working sheet, slightly askew
    const ns = hero ? 2 : 2 + (r() < .35 ? 1 : 0);
    const spots = [[.46, -.06], [.8, .2], [-.62, .16]];
    for (let k = 0; k < ns; k++) stacks.push({ x: cx + spots[k][0] + (r() - .5) * .05, z: cz + spots[k][1] + (r() - .5) * .05, h: .035 + r() * .1, rot: (r() - .5) * .14, n: 5 + Math.floor(r() * 4) });
    out.push({ id, cx, cz, hero, stacks,
      sheet: hero ? null : { x: cx + (r() - .5) * .05, z: cz + (r() - .5) * .04, rot: (r() - .5) * .16 },
      lamp: { x: cx - .16, z: cz + .6 }, chair: { x: cx + (r() - .5) * .25, z: cz - .78 - r() * .22, rot: (r() - .5) * .35 },
      lit: hero ? 1 : .55 + r() * .45, ph: r() * TAU });
  }
  return out;
});
// ---------------------------------------------------------------- textures (built once)
const DESKTEX_PPM = 420;
// the walnut top at full light (the lamp's falloff is multiplied on per desk); grain identical to form.mjs drawDesk
export const deskMips = () => mips('c08desk', () => {
  const w = Math.ceil((TOPX[1] - TOPX[0]) * DESKTEX_PPM), h = Math.ceil((TOPZ[1] - TOPZ[0]) * DESKTEX_PPM), [c, g] = canvas(w, h);
  const k = U * DESKTEX_PPM;   // FU → px: x = (fx − DESK.x0)·k, y = (fy − DESK.y0)·k
  g.fillStyle = '#7a4d2a'; g.fillRect(0, 0, w, h);
  const r = prng(3131); g.lineCap = 'round';
  for (let y = DESK.y0; y < DESK.y1; y += 16 + r() * 22) {
    const ph = r() * 100, amp = 6 + r() * 16, kk = r(), lw = .8 + r() * 2.6;
    g.beginPath(); let first = true;
    for (let x = DESK.x0; x <= DESK.x1; x += 120) { const yy = y + amp * noise1(x * .0016 + ph, 3) + 30 * noise1(x * .00031 + ph, 5); const px = (x - DESK.x0) * k, py = (yy - DESK.y0) * k; first ? g.moveTo(px, py) : g.lineTo(px, py); first = false; }
    g.strokeStyle = kk < .6 ? 'rgba(18,10,6,.35)' : 'rgba(150,100,60,.16)'; g.lineWidth = Math.max(.5, lw * k); g.stroke();
  }
  g.getImageData(0, 0, 1, 1); return c;
});
// pigeonholes: a wall of wooden cells with the ends of papers (texture for the side walls, 1 px = 1 cm)
export const holesMips = () => mips('c08holes', () => {
  const w = 1400, h = 400, [c, g] = canvas(w, h), r = prng(717);
  g.fillStyle = '#1d1424'; g.fillRect(0, 0, w, h);
  const cw = 28, ch = 22;
  for (let y = 8; y + ch <= h - 30; y += ch + 3) for (let x = 6; x + cw <= w; x += cw + 3) {
    g.fillStyle = '#0c0a14'; g.fillRect(x, y, cw, ch);
    const n = Math.floor(r() * 4); for (let i = 0; i < n; i++) { const ph = 3 + r() * (ch - 8); g.fillStyle = r() < .5 ? '#cbbd9c' : '#a89a80'; g.fillRect(x + 2 + r() * 3, y + ph, cw - 5 - r() * 6, 2.2 + r() * 2); }
    g.fillStyle = 'rgba(160,120,80,.25)'; g.fillRect(x, y + ch, cw, 1.5);
  }
  g.fillStyle = '#2a1c22'; g.fillRect(0, h - 30, w, 30);   // plinth
  g.getImageData(0, 0, 1, 1); return c;
});

// ---------------------------------------------------------------- colours
const C = {
  floorA: rgb('#181b36'), floorB: rgb('#20244a'), slab: rgb('#232750'), wall: rgb('#1e1c3a'), ceil: rgb('#15152e'),
  iron: rgb('#0b0c1c'), glassZen: rgb('#1f2a5c'), glassMid: rgb('#3b3f78'), glassWarm: rgb('#a07482'),
  wood: rgb('#2b1c14'), woodSide: rgb('#24170f'), paper: rgb('#e9dfc7'), paperEdge: rgb('#d2c4a3'),
  shade: rgb('#174c3b'), shadeHi: rgb('#9fe3c0'), brass: rgb('#b88a44'), lampCore: rgb('#fff1d6'), lamp: rgb('#ffbe72'),
  chair: rgb('#2c1b12'), chairTop: rgb('#4a2f1e'), counter: rgb('#2c1c18'), fog: rgb('#272548'),
};
const fogK = (d) => .62 * (1 - Math.exp(-d / 48));
const fogC = (c, d) => lerpC(c, C.fog, fogK(d));
// ---------------------------------------------------------------- small geometry
// an oriented box (yaw about Y): centre c, half sizes [hx, hy, hz] → visible faces [{pts, n, side, m}]
function obox(cam, c, hs, yaw = 0) {
  const cs = Math.cos(yaw), sn = Math.sin(yaw), P = (x, y, z) => [c[0] + x * cs + z * sn, c[1] + y, c[2] - x * sn + z * cs];
  const [hx, hy, hz] = hs, out = [];
  const faces = [
    ['top', [0, 1, 0], [P(-hx, hy, -hz), P(hx, hy, -hz), P(hx, hy, hz), P(-hx, hy, hz)]],
    ['xn', [-cs, 0, sn], [P(-hx, -hy, -hz), P(-hx, hy, -hz), P(-hx, hy, hz), P(-hx, -hy, hz)]],
    ['xp', [cs, 0, -sn], [P(hx, -hy, -hz), P(hx, hy, -hz), P(hx, hy, hz), P(hx, -hy, hz)]],
    ['zn', [-sn, 0, -cs], [P(-hx, -hy, -hz), P(hx, -hy, -hz), P(hx, hy, -hz), P(-hx, hy, -hz)]],
    ['zp', [sn, 0, cs], [P(-hx, -hy, hz), P(hx, -hy, hz), P(hx, hy, hz), P(-hx, hy, hz)]],
  ];
  for (const [side, n, pts] of faces) {
    const m = [(pts[0][0] + pts[2][0]) / 2, (pts[0][1] + pts[2][1]) / 2, (pts[0][2] + pts[2][2]) / 2];
    const d = (cam.pos[0] - m[0]) * n[0] + (cam.pos[1] - m[1]) * n[1] + (cam.pos[2] - m[2]) * n[2];
    if (d > 0) out.push({ side, n, pts, m });
  }
  return out;
}
const mid4 = (pts) => [(pts[0][0] + pts[2][0]) / 2, (pts[0][1] + pts[2][1]) / 2, (pts[0][2] + pts[2][2]) / 2];
// warm light from a desk lamp (bulb at L) on a point p with normal n → 0..1
function lampOn(L, p, n, k = 1) {
  const dx = L[0] - p[0], dy = L[1] - p[1], dz = L[2] - p[2], d = Math.hypot(dx, dy, dz) || 1, cosn = Math.max(0, (dx * n[0] + dy * n[1] + dz * n[2]) / d);
  const down = clamp(-dy / d * 1.6 + .25);
  return k * cosn * down / (1 + (d / .55) ** 2);
}
// a surface colour: cool top light from the vault, warm lamp light, haze with distance
function litC(base, p, n, lampK, L, cam, amb = .55) {
  const sky = .3 + .7 * Math.max(0, n[1]), a = amb * sky, w = L ? lampOn(L, p, n, lampK) : 0;
  const c = [base[0] * (a * .9 + w * 2.4) + 255 * w * .35, base[1] * (a * .95 + w * 1.9) + 190 * w * .3, base[2] * (a * 1.25 + w * 1.2) + 110 * w * .2];
  return cam ? fogC(c, distOf(cam, p)) : c;
}
const BULB = (d) => [d.lamp.x, DESK_Y + .33, d.lamp.z - .05];

// ---------------------------------------------------------------- one desk
// the walnut top with the lamp's falloff multiplied on (the same light as form.mjs drawDesk), then haze
const POOL_MUL = [[0, 'rgb(255,255,255)'], [.35, 'rgb(178,169,176)'], [.7, 'rgb(96,96,121)'], [1, 'rgb(42,53,152)']];
function drawDeskTop(ctx, cam, d) {
  const y = DESK_Y, x0 = d.cx + TOPX[0], x1 = d.cx + TOPX[1], z0 = d.cz + TOPZ[0], z1 = d.cz + TOPZ[1];
  const sp = cam.poly([[x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0]]); if (sp.length < 3 || !onScreen(sp, 4)) return null;
  const bb = bboxS(sp), size = Math.max(bb[2] - bb[0], bb[3] - bb[1]), dist = distOf(cam, [d.cx, y, d.cz]);
  if (size > 26) {
    const img = mipPick(deskMips(), size), n = size > 700 ? [4, 3] : size > 220 ? [2, 2] : [1, 1];
    gridTex(ctx, cam, img, (u, v) => [mix(x0, x1, u), y, mix(z1, z0, v)], n[0], n[1], { pad: .5, flat: size < 90, cull: true });
    poolOn(ctx, cam, sp, [d.lamp.x, y, d.cz + .182], [1, 0, 0], [0, 0, 1], .7245 * (d.hero ? 1 : .85 + .15 * d.lit), POOL_MUL, 'multiply', 4);
  } else fillS(ctx, sp, css([62 * d.lit + 20, 40 * d.lit + 14, 24 * d.lit + 16]));
  const fk = fogK(dist); if (fk > .01) fillS(ctx, sp, css(C.fog, fk));
  return sp;
}
const SHEET = (s, h) => { const cs = Math.cos(s.rot), sn = Math.sin(s.rot); return (u, v) => { const x = (u - .5) * .21, z = (.5 - v) * .297; return [s.x + x * cs + z * sn, DESK_Y + h, s.z - x * sn + z * cs]; }; };
function paperOn(ctx, cam, P, d, mipsF, lit) {
  const sp = cam.poly([P(0, 0), P(1, 0), P(1, 1), P(0, 1)]); if (sp.length < 3 || !onScreen(sp, 2)) return;
  const bb = bboxS(sp), size = Math.max(bb[2] - bb[0], bb[3] - bb[1]), dist = distOf(cam, P(.5, .5));
  if (size > 12 && mipsF) gridTex(ctx, cam, mipPick(mipsF, size, 'h'), P, 1, size > 200 ? 2 : 1, { pad: .4, flat: size < 70 });
  else fillS(ctx, sp, css(mulC(C.paper, .9)));
  // the lamp light on the paper (bright near the lamp, falling off), haze
  const k = clamp(lit), shadeA = .5 * (1 - k);
  if (shadeA > .01) fillS(ctx, sp, `rgba(26,24,52,${shadeA.toFixed(3)})`);
  const fk = fogK(dist); if (fk > .01) fillS(ctx, sp, css(C.fog, fk));
}
function drawStack(ctx, cam, s, d, left, mipsF) {
  const h = s.h * left; if (h < .002) return;
  const c = [s.x, DESK_Y + h / 2, s.z], F = obox(cam, c, [.105, h / 2, .1485], s.rot), L = BULB(d);
  for (const f of F) {
    if (f.side === 'top') continue;
    const col = litC(C.paperEdge, f.m, f.n, d.lit, L, cam, .5), sp = cam.poly(f.pts); fillS(ctx, sp, css(col));
    if (sp.length >= 4) { const bb = bboxS(sp), hh = bb[3] - bb[1]; if (hh > 7) {   // the edges of the sheets
      ctx.save(); ctx.beginPath(); pathS(ctx, sp); ctx.clip(); ctx.strokeStyle = 'rgba(70,52,34,.3)'; ctx.lineWidth = .7; ctx.beginPath();
      const n = Math.min(26, Math.floor(hh / 2.6));
      for (let i = 1; i < n; i++) { const k = i / n, a = [mix(f.pts[0][0], f.pts[1][0], k), mix(f.pts[0][1], f.pts[1][1], k), mix(f.pts[0][2], f.pts[1][2], k)], b = [mix(f.pts[3][0], f.pts[2][0], k), mix(f.pts[3][1], f.pts[2][1], k), mix(f.pts[3][2], f.pts[2][2], k)]; line3(ctx, cam, [a, b]); }
      ctx.stroke(); ctx.restore(); } }
  }
  const lit = lampOn(L, [s.x, DESK_Y + h, s.z], [0, 1, 0], 1) * 3.2 * d.lit;
  paperOn(ctx, cam, SHEET(s, h + .0005), d, mipsF, lit);
}
function drawLamp(ctx, cam, d) {
  const lk = d.lit, bx = d.lamp.x, bz = d.lamp.z, y = DESK_Y, L = BULB(d);
  const c0 = cam.P(bx, y + .2, bz); if (!(c0[2] > cam.near)) return;
  const scr = cam.f / c0[2] * .3;   // screen size of the lamp
  if (scr < 3) { glowAt(ctx, c0[0], c0[1], 3, C.lamp, .6); return; }
  // base (brass disc), stem
  const ring = (r, yy, n = 12) => { const o = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; o.push([bx + r * Math.cos(a), yy, bz + r * Math.sin(a)]); } return o; };
  const bt = ring(.07, y + .022), bb = ring(.072, y);
  for (let i = 0; i < 12; i++) { const j = (i + 1) % 12, q = [bb[i], bb[j], bt[j], bt[i]], m = mid4(q), n = [Math.cos((i + .5) / 12 * TAU), 0, Math.sin((i + .5) / 12 * TAU)]; if ((cam.pos[0] - m[0]) * n[0] + (cam.pos[2] - m[2]) * n[2] <= 0) continue; fillS(ctx, cam.poly(q), css(litC(C.brass, m, n, lk, L, cam, .5))); }
  fillS(ctx, cam.poly(bt), css(fogC(mulC(C.brass, .6 + .45 * lk), distOf(cam, [bx, y, bz]))));
  for (const f of obox(cam, [bx, y + .175, bz], [.007, .155, .007])) fillS(ctx, cam.poly(f.pts), css(litC(C.brass, f.m, f.n, lk, L, cam, .55)));
  // shade: a half cylinder of green glass along X (radius .072, length .3), the bulb inside
  const sy = y + .345, R = .072, hl = .15, sz = bz - .05, N = 9;
  const arc = (x) => { const p = []; for (let i = 0; i <= N; i++) { const a = Math.PI * i / N; p.push([x, sy + R * Math.sin(a) * .92, sz + R * Math.cos(a)]); } return p; };
  const A = arc(bx - hl), B = arc(bx + hl), dist = distOf(cam, [bx, sy, sz]);
  if (cam.pos[1] < sy + .02) fillS(ctx, cam.poly([[bx - hl, sy, sz - R], [bx + hl, sy, sz - R], [bx + hl, sy, sz + R], [bx - hl, sy, sz + R]]), css(lerpC(C.lamp, C.lampCore, .6)));
  // view direction for the specular stripe
  const vd = [cam.pos[0] - bx, cam.pos[1] - sy, cam.pos[2] - sz], vl = Math.hypot(...vd); vd[0] /= vl; vd[1] /= vl; vd[2] /= vl;
  const Lt = [0, .9, -.43];   // the room's top light (vault), a little from the front
  const hv = [Lt[0] + vd[0], Lt[1] + vd[1], Lt[2] + vd[2]], hl2 = Math.hypot(...hv);
  for (let i = 0; i < N; i++) {
    const a = Math.PI * (i + .5) / N, n = [0, Math.sin(a), Math.cos(a)], m = [bx, sy + R * Math.sin(a) * .92, sz + R * Math.cos(a)];
    if ((cam.pos[1] - m[1]) * n[1] + (cam.pos[2] - m[2]) * n[2] <= 0) continue;
    const spec = Math.pow(Math.max(0, (n[1] * hv[1] + n[2] * hv[2]) / hl2), 24), diff = .45 + .55 * Math.max(0, n[1]);
    const col = fogC(lerpC(mulC(C.shade, diff), C.shadeHi, Math.min(1, spec * 1.2 + .06)), dist);
    fillS(ctx, cam.poly([A[i], A[i + 1], B[i + 1], B[i]]), css(col));
  }
  for (const [x, rg] of [[bx - hl, A], [bx + hl, B]]) { const n = [x < bx ? -1 : 1, 0, 0]; if ((cam.pos[0] - x) * n[0] > 0) fillS(ctx, cam.poly(rg), css(litC(C.brass, [x, sy, sz], n, lk, L, cam, .55))); }
  // the bulb's glow, under the shade
  const q = cam.P(L[0], L[1] - .045, L[2]); if (q[2] > cam.near) glowAt(ctx, q[0], q[1], clamp(cam.f / q[2] * .12, 2, 260), C.lamp, .5 * lk);
}
function drawChair(ctx, cam, d) {
  const c = d.chair, L = BULB(d), yaw = c.rot, cs = Math.cos(yaw), sn = Math.sin(yaw), P = (x, z) => [c.x + x * cs + z * sn, c.z - x * sn + z * cs];
  const k = d.lit * .45;
  const part = (ctr, hs, top) => { for (const f of obox(cam, ctr, hs, yaw)) fillS(ctx, cam.poly(f.pts), css(litC(f.side === 'top' && top ? C.chairTop : C.chair, f.m, f.n, k, L, cam, .55))); };
  for (const [lx, lz] of [[-.19, -.19], [.19, -.19], [-.19, .17], [.19, .17]]) { const [x, z] = P(lx, lz); part([x, .22, z], [.017, .22, .017], false); }
  part([c.x, .455, c.z], [.22, .022, .21], true);
  for (const lx of [-.18, .18]) { const [x, z] = P(lx, -.2); part([x, .67, z], [.015, .2, .015], false); }
  const [bx, bz] = P(0, -.2); part([bx, .83, bz], [.22, .055, .022], true);
}
function drawDeskBody(ctx, cam, d) {
  const L = BULB(d), x0 = d.cx + TOPX[0], x1 = d.cx + TOPX[1], z0 = d.cz + TOPZ[0], z1 = d.cz + TOPZ[1], lk = d.lit * .7;
  for (const [a, b] of [[x0 + .03, x0 + .48], [x1 - .48, x1 - .03]]) for (const f of boxVis(cam, { x0: a, x1: b, y0: 0, y1: DESK_Y - .035, z0: z0 + .05, z1: z1 - .04 })) {
    if (f.side === 'top') continue;
    const m = mid4(f.pts), sp = cam.poly(f.pts); fillS(ctx, sp, css(litC(C.woodSide, m, f.n, lk, L, cam, .6)));
    if (f.side === 'zn' && sp.length >= 4) {
      const bb = bboxS(sp); if (bb[3] - bb[1] > 14) {
        ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1; ctx.beginPath(); for (const yy of [.25, .48]) line3(ctx, cam, [[a + .02, yy, z0 + .049], [b - .02, yy, z0 + .049]]); ctx.stroke();
        for (const yy of [.13, .37, .6]) { const p = cam.P((a + b) / 2, yy, z0 + .045); if (p[2] > cam.near) { const r = Math.max(.7, cam.f / p[2] * .012); ctx.fillStyle = css(fogC(mulC(C.brass, .45 + .35 * d.lit), distOf(cam, [a, yy, z0]))); ctx.fillRect(p[0] - r * 2, p[1] - r * .55, r * 4, r * 1.1); } }
      }
    }
  }
  for (const f of boxVis(cam, { x0: x0 + .48, x1: x1 - .48, y0: .28, y1: DESK_Y - .035, z0: z1 - .07, z1: z1 - .045 })) fillS(ctx, cam.poly(f.pts), css(litC(C.woodSide, mid4(f.pts), f.n, lk * .5, L, cam, .55)));
  for (const f of boxVis(cam, { x0, x1, y0: DESK_Y - .035, y1: DESK_Y, z0, z1 })) { if (f.side === 'top' || f.side === 'bottom') continue; fillS(ctx, cam.poly(f.pts), css(litC(rgb('#4a2f1d'), mid4(f.pts), f.n, d.lit, L, cam, .65))); }
}
function deskFloor(ctx, cam, d) {
  const z0 = d.cz + TOPZ[0], z1 = d.cz + TOPZ[1];
  poolOn(ctx, cam, null, [d.cx, .001, (z0 + z1) / 2], [1, 0, 0], [0, 0, 1], 1.5, [[0, 'rgba(5,5,14,.62)'], [.6, 'rgba(5,5,14,.3)'], [1, 'rgba(5,5,14,0)']]);
  poolOn(ctx, cam, null, [d.cx - .1, .001, z0 - .65], [1, 0, 0], [0, 0, 1], 1.8, [[0, `rgba(240,150,70,${.12 * d.lit})`], [.5, `rgba(240,150,70,${.045 * d.lit})`], [1, 'rgba(240,150,70,0)']], 'lighter');
}

// ---------------------------------------------------------------- the room
function drawFloor(ctx, cam) {
  const h = HALL, sp = cam.poly([[h.x0, 0, h.z0], [h.x1, 0, h.z0], [h.x1, 0, h.z1], [h.x0, 0, h.z1]]); if (sp.length < 3) return;
  fillS(ctx, sp, css(C.floorA));
  // slabs: every other one a shade lighter, faded with distance; joints
  const S = 1.75;
  for (let i = 0; i < 20; i++) for (let j = 0; j < 33; j++) {
    if ((i + j) % 2) continue;
    const x = h.x0 + i * S, z = h.z0 + j * S, m = [x + S / 2, 0, z + S / 2], dd = distOf(cam, m); if (dd > 70) continue;
    const q = cam.poly([[x, 0, z], [x + S, 0, z], [x + S, 0, z + S], [x, 0, z + S]]); if (q.length < 3 || !onScreen(q, 1)) continue;
    fillS(ctx, q, css(fogC(C.slab, dd)));
  }
  ctx.save(); ctx.beginPath(); pathS(ctx, sp); ctx.clip(); ctx.strokeStyle = 'rgba(8,8,20,.45)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = h.x0; x <= h.x1 + .01; x += S) line3(ctx, cam, [[x, 0, h.z0], [x, 0, h.z1]]);
  for (let z = h.z0; z <= h.z1 + .01; z += S) line3(ctx, cam, [[h.x0, 0, z], [h.x1, 0, z]]);
  ctx.stroke(); ctx.restore();
  // haze toward the far end
  linOn(ctx, cam, sp, [0, 0, cam.pos[2] + 4], [0, 0, h.z1], [[0, css(C.fog, 0)], [1, css(C.fog, .55)]]);
}
// glossy floor: the lamps mirrored in the stone (soft streaks), drawn after the floor, before the desks
function floorGloss(ctx, cam) {
  for (const d of DESKS) {
    const L = BULB(d), p = cam.P(L[0], -L[1], L[2]); if (!(p[2] > cam.near) || p[0] < -200 || p[0] > W + 200 || p[1] < -200 || p[1] > H + 300) continue;
    const r = clamp(cam.f / p[2] * .5, 2, 200), a = .16 * d.lit;
    ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(.45, 1.6); glowAt(ctx, 0, 0, r, C.lamp, a); ctx.restore();
  }
}
const vaultPt = (a, z) => { const h = HALL; return [h.vaultR * Math.sin(a), h.vaultC + h.vaultR * Math.cos(a), z]; };   // a = −VA..VA
const VA = Math.asin(8 / HALL.vaultR), VENT_A = .055;
function drawCeiling(ctx, cam, t) {
  const h = HALL;
  for (const [x0, x1] of [[h.x0, -8], [8, h.x1]]) {
    const q = [[x0, h.cornice, h.z0], [x1, h.cornice, h.z0], [x1, h.cornice, h.z1], [x0, h.cornice, h.z1]], sp = cam.poly(q); if (sp.length < 3) continue;
    fillS(ctx, sp, css(C.ceil));
    ctx.save(); ctx.beginPath(); pathS(ctx, sp); ctx.clip(); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let z = h.z0; z < h.z1; z += 3) line3(ctx, cam, [[x0, h.cornice, z], [x1, h.cornice, z]]); for (let x = x0; x <= x1; x += 2.4) line3(ctx, cam, [[x, h.cornice, h.z0], [x, h.cornice, h.z1]]); ctx.stroke(); ctx.restore();
  }
  // glass: the dusk sky through the panes (deep at the zenith, warm toward the far end), the lamps' reflections
  const NA = 12, rows = [];
  for (let z = h.z0 + 1; z < h.z1 - 1; z += 3) rows.push(z);
  for (const z of rows) for (let i = 0; i < NA; i++) {
    const a0 = -VA + 2 * VA * i / NA, a1 = -VA + 2 * VA * (i + 1) / NA; if (Math.max(Math.abs(a0), Math.abs(a1)) <= VENT_A + 1e-6 || (a0 < VENT_A && a1 > -VENT_A)) continue;
    const q = [vaultPt(a0, z), vaultPt(a1, z), vaultPt(a1, z + 3), vaultPt(a0, z + 3)], sp = cam.poly(q); if (sp.length < 3 || !onScreen(sp, 2)) continue;
    const kz = clamp((z - h.z0) / (h.z1 - h.z0)), up = Math.cos((a0 + a1) / 2);
    let col = lerpC(C.glassMid, C.glassZen, clamp((up - .5) * 2));
    col = lerpC(col, C.glassWarm, .5 * kz * kz * (1 - .6 * clamp((up - .5) * 2)));
    fillS(ctx, sp, css(col));
  }
  // the open vent along the ridge: the sky shows through the slot; the two rows of hinged panes stand open above it
  for (const z of rows) for (const sgn of [-1, 1]) {
    const a = sgn * VENT_A, p0 = vaultPt(a, z), p1 = vaultPt(a, z + 3), up = [sgn * .5, 1.2, 0];
    const q = [p0, p1, [p1[0] + up[0], p1[1] + up[1], p1[2]], [p0[0] + up[0], p0[1] + up[1], p0[2]]], sp = cam.poly(q); if (sp.length < 3 || !onScreen(sp, 2)) continue;
    fillS(ctx, sp, css(lerpC(C.glassZen, C.iron, .55)));
    ctx.beginPath(); pathS(ctx, sp); ctx.strokeStyle = css(C.iron); ctx.lineWidth = 1.2; ctx.stroke();
  }
  // ribs (iron, with a little width in the world) and purlins
  ctx.lineCap = 'butt';
  for (const z of [...rows, rows[rows.length - 1] + 3]) {
    const pts = []; for (let i = 0; i <= 24; i++) pts.push(vaultPt(-VA + 2 * VA * i / 24, z));
    const p = cam.P(0, h.ridge, z); if (!(p[2] > cam.near)) continue;
    ctx.beginPath(); line3(ctx, cam, pts); ctx.strokeStyle = css(C.iron); ctx.lineWidth = clamp(cam.f / p[2] * .16, .7, 60); ctx.stroke();
  }
  for (let i = 0; i <= NA; i++) {
    const a = -VA + 2 * VA * i / NA; if (Math.abs(a) < VENT_A) continue;
    const p0 = vaultPt(a, h.z0 + 1), p1 = vaultPt(a, h.z1 - 1), pm = cam.P(p0[0], p0[1], clamp(cam.pos[2] + 10, h.z0, h.z1));
    ctx.beginPath(); line3(ctx, cam, [p0, p1]); ctx.strokeStyle = css(C.iron); ctx.lineWidth = pm[2] > cam.near ? clamp(cam.f / pm[2] * .06, .5, 20) : 1; ctx.stroke();
  }
  // reflections of the hall's lamps in the glass: a few warm specks
  for (let k = 0; k < 60; k++) { const d = DESKS[(k * 37) % DESKS.length], a = (hash(k, 3) - .5) * 1.4, p0 = vaultPt(a, d.cz + 1.5), p = cam.P(p0[0], p0[1] - .05, p0[2]); if (p[2] > cam.near) glowAt(ctx, p[0], p[1], clamp(cam.f / p[2] * .12, 1.2, 14), C.lamp, .22); }
}
function drawWalls(ctx, cam, t) {
  const h = HALL;
  for (const x of [h.x0, h.x1]) {
    const nx = x < 0 ? 1 : -1; if ((cam.pos[0] - x) * nx <= 0) continue;
    const sp = cam.poly([[x, 0, h.z1], [x, h.cornice, h.z1], [x, h.cornice, h.z0], [x, 0, h.z0]]); if (sp.length < 3) continue;
    linOn(ctx, cam, sp, [x, 0, 0], [x, h.cornice, 0], [[0, css(mulC(C.wall, .8))], [.4, css(C.wall)], [1, css(mulC(C.wall, 1.15))]]);
    for (let z = h.z0; z < h.z1; z += 14) {   // the pigeonhole cabinets (texture), 14 m per piece
      const za = z, zb = Math.min(h.z1, z + 14), P = nx > 0 ? (u, v) => [x + .01, mix(4, 0, v), mix(za, zb, u)] : (u, v) => [x - .01, mix(4, 0, v), mix(zb, za, u)];
      const s4 = cam.poly([P(0, 0), P(1, 0), P(1, 1), P(0, 1)]); if (s4.length < 3 || !onScreen(s4, 2)) continue;
      const bb = bboxS(s4); gridTex(ctx, cam, mipPick(holesMips(), Math.max(bb[2] - bb[0], 200)), P, 8, 1, { pad: .5, cull: true });
      fillS(ctx, s4, css(C.fog, fogK(distOf(cam, P(.5, .5))) * .9));
    }
    for (let z = h.z0 + 3; z < h.z1 - 2; z += 6) {   // tall arched windows (dusk), mullions
      const zc = z + 1.5, s2 = nx > 0 ? 1 : -1, pts = [[x + nx * .02, 5.2, zc - 1.2 * s2]];
      for (let i = 0; i <= 12; i++) { const a = Math.PI * i / 12; pts.push([x + nx * .02, 9 + 1.2 * Math.sin(a), zc - 1.2 * Math.cos(a) * s2]); }
      pts.push([x + nx * .02, 5.2, zc + 1.2 * s2]);
      const ws = cam.poly(pts); if (ws.length < 3 || !onScreen(ws, 2)) continue;
      linOn(ctx, cam, ws, [x, 5.2, zc], [x, 10.2, zc], [[0, css(fogC(rgb('#2c2d5e'), 20))], [1, css(fogC(rgb('#4c4683'), 20))]]);
      const pm = cam.P(x, 7, zc); ctx.save(); ctx.beginPath(); pathS(ctx, ws); ctx.clip(); ctx.strokeStyle = 'rgba(8,8,22,.85)'; ctx.lineWidth = pm[2] > cam.near ? clamp(cam.f / pm[2] * .06, .6, 8) : 1; ctx.beginPath(); line3(ctx, cam, [[x, 5.2, zc], [x, 10.2, zc]]); for (const yy of [6.8, 8.4]) line3(ctx, cam, [[x, yy, zc - 1.2], [x, yy, zc + 1.2]]); ctx.stroke(); ctx.restore();
    }
  }
  const zf = h.z1;
  if (cam.pos[2] < zf) {
    const sp = cam.poly([[h.x0, 0, zf], [h.x1, 0, zf], [h.x1, h.cornice, zf], [h.x0, h.cornice, zf]]); if (sp.length >= 3) linOn(ctx, cam, sp, [0, 0, zf], [0, h.cornice, zf], [[0, css(fogC(mulC(C.wall, .8), 50))], [1, css(fogC(C.wall, 50))]]);
    const lun = []; for (let i = 0; i <= 24; i++) { const p = vaultPt(-VA + 2 * VA * i / 24, zf); lun.push(p); }
    const ls = cam.poly(lun); if (ls.length >= 3) { linOn(ctx, cam, ls, [0, h.cornice, zf], [0, h.ridge, zf], [[0, css(rgb('#8a6a86'))], [1, css(rgb('#3a4280'))]]); ctx.save(); ctx.beginPath(); pathS(ctx, ls); ctx.clip(); ctx.strokeStyle = css(C.iron); ctx.lineWidth = 2; ctx.beginPath(); for (let x = -6; x <= 6; x += 2) line3(ctx, cam, [[x, h.cornice, zf], [x, h.ridge, zf]]); line3(ctx, cam, [[-8, 13, zf], [8, 13, zf]]); ctx.stroke(); ctx.restore(); }
  }
}
function drawCounter(ctx, cam) {
  const z0 = 41.6, z1 = 42.4, h = HALL;
  for (const f of boxVis(cam, { x0: h.x0 + .5, x1: h.x1 - .5, y0: 0, y1: 1.1, z0, z1 })) fillS(ctx, cam.poly(f.pts), css(fogC(f.side === 'top' ? mulC(C.counter, 1.7) : C.counter, 45)));
  ctx.strokeStyle = css(fogC(mulC(C.brass, .7), 45)); ctx.lineWidth = 1; ctx.beginPath();
  for (let x = h.x0 + .6; x < h.x1 - .5; x += .12) line3(ctx, cam, [[x, 1.1, z0 + .3], [x, 2.3, z0 + .3]]);
  line3(ctx, cam, [[h.x0 + .5, 2.3, z0 + .3], [h.x1 - .5, 2.3, z0 + .3]]); ctx.stroke();
  for (let x = h.x0 + 2; x < h.x1 - 1; x += 3.2) { const p = cam.P(x, 1.9, z0 + .1); if (p[2] > cam.near) glowAt(ctx, p[0], p[1], clamp(cam.f / p[2] * .5, 2, 60), C.lamp, .45); }
}

// ---------------------------------------------------------------- the whole hall
// st: { formMips (stack tops / lone sheets), stackLeft(d, k) → 0..1, heroDraw(ctx, cam) | null }
export function drawHall(ctx, t, cam, st = {}) {
  drawCeiling(ctx, cam, t);
  drawWalls(ctx, cam, t);
  drawFloor(ctx, cam);
  floorGloss(ctx, cam);
  drawCounter(ctx, cam);
  for (const d of DESKS) { const p = cam.P(d.cx, 0, d.cz); if (!(p[2] > cam.near) || p[0] < -W || p[0] > 2 * W || p[1] < -H || p[1] > 2 * H) continue; deskFloor(ctx, cam, d); }
  const pt = new Painter();
  for (const d of DESKS) {
    const c = [d.cx, DESK_Y, d.cz + .14], p = cam.P(c[0], c[1], c[2]); if (!(p[2] > cam.near)) continue;
    if (p[0] < -900 || p[0] > W + 900 || p[1] < -900 || p[1] > H + 900) continue;
    pt.add(depthOf(cam, c), (g) => {
      const chairFar = distOf(cam, [d.chair.x, .5, d.chair.z]) > distOf(cam, c);
      if (chairFar) drawChair(g, cam, d);
      drawDeskBody(g, cam, d);
      if (cam.pos[1] > DESK_Y) {
        drawDeskTop(g, cam, d);
        if (d.hero && st.heroDraw) st.heroDraw(g, cam);
        else if (d.sheet) paperOn(g, cam, SHEET(d.sheet, .0006), d, st.formMips, lampOn(BULB(d), [d.sheet.x, DESK_Y, d.sheet.z], [0, 1, 0], 1) * 3.2 * d.lit);
        d.stacks.forEach((s, k) => drawStack(g, cam, s, d, st.stackLeft ? st.stackLeft(d, k) : 1, st.formMips));
      }
      drawLamp(g, cam, d);
      if (!chairFar) drawChair(g, cam, d);
    });
  }
  pt.draw(ctx);
}
export { TOPX, TOPZ, C as HALLC, obox, litC, lampOn, BULB, vaultPt, VA, fogK, fogC, SHEET };
