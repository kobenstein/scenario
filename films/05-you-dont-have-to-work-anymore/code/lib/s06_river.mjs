// s06_river.mjs · chapter 06, the river (6.07–6.13).
// V valley (the traced line becomes a real river; summers flip) · SG the sign · BK the bank, people start clearing
// RV your river at dawn, "the time" · HP your hands, the help turns amber · SU years later, children jump
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, lin, sm, eio, eout, ein, sine, drift, enter, lay, big, spr, bloomL, poolL, coneL, fogL, vgrad, radial, glowAt, fig, drawFig, figAnim, lerpPose, stage, camAt, paper, vignetteL, tintAll } from './s06_kit.mjs';
import { stipple, roughPath, roughPoly, roughRect, roughLine, hatch, strokes, vnoise, fbm, castShadow, maskRadial, maskLinear, house, stratus, limb, qpts } from './art.mjs';
import { text } from '../engine.mjs';

const GOLD = '#ffc477', ORANGE = '#ff6a3a', CREAM = '#fff1cf', AMB = '#ffb35c';

// ---------------------------------------------------------------- shared landscape pieces
const catmull = (P, q) => {
  const n = P.length - 1, f = clamp(q) * n, i = Math.min(n - 1, Math.floor(f)), u = f - i;
  const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n, i + 2)];
  const c = (a, b, c2, d) => .5 * (2 * b + (-a + c2) * u + (2 * a - 5 * b + 4 * c2 - d) * u * u + (-a + 3 * b - 3 * c2 + d) * u * u * u);
  return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])];
};
function ridgeFn(base, amp, f, seed) { const nn = vnoise(seed); return (x) => base - amp * fbm(nn, x * f, seed * .37, 4); }
// A3-style hill: silhouette, sun-side light, contour hatching that follows the ridge, optional mist in front
function hill(g, f, { col, hc, ha = .45, sun, i = 0, x0 = -20, x1 = W + 20, bottom = H + 20, lightA = .4, gap = 5 } = {}) {
  const pts = [[x0, bottom]]; for (let x = x0; x <= x1; x += 8) pts.push([x, f(x)]); pts.push([x1, bottom]);
  roughPoly(g, pts, col, { amp: 1.2, seed: i + 1 });
  g.save(); g.beginPath(); roughPath(g, pts, { amp: 1.2, seed: i + 1 }); g.clip();
  if (sun) radial(g, sun[0], sun[1], 1200, [[0, rgba(GOLD, lightA)], [1, rgba(GOLD, 0)]]);
  const [hc2, hx2] = lay(); hx2.strokeStyle = hc; hx2.lineCap = 'round'; const rr = prng(40 + i), n = vnoise(12 + i);
  for (let k = 1; k < 28; k++) { const off = k * (gap + i * 1.6) * (1 + k * .045); let x = x0 + rr() * 60;
    while (x < x1) { const len = 30 + rr() * 160; hx2.globalAlpha = ha * (.4 + .6 * rr()); hx2.lineWidth = .9 + i * .2; hx2.beginPath();
      for (let xx = x; xx < Math.min(x1, x + len); xx += 6) hx2.lineTo(xx, f(xx) + off + (n(xx * .02, k + i * 30) - .5) * 3); hx2.stroke(); x += len + 10 + rr() * 70; } }
  if (sun) maskRadial(hc2, sun[0], sun[1], 0, 1500, [[0, 1], [.5, .7], [1, .25]]);
  g.drawImage(hc2, 0, 0); g.restore();
}
function blob(g, bx, by, br, seed, sy = .72) { g.beginPath(); roughPath(g, Array.from({ length: 26 }, (_, i) => { const a = i / 26 * 6.283; return [bx + Math.cos(a) * br * (1 + .14 * Math.sin(a * 3 + seed)), by + Math.sin(a) * br * sy * (1 + .1 * Math.cos(a * 4 + seed))]; }), { amp: Math.max(1, br * .03), step: Math.max(5, br * .08), seed }); g.fill(); }
// a rounded A3-style tree: trunk, lobed canopy, lit toward the sun, rim, leaf arcs on the lit side
function tree(g, x, y, h, { dark = '#10261a', lit = '#9a7a3a', rim = '#ff9a55', sun = [1500, 360], seed = 1, leaf = '#f2b06a', trunk = '#0d1a12', rimA = .8, wide = 1 } = {}) {
  const S = Math.ceil(h * 1.6 * wide), [c, cx] = lay(S, S), ox = S / 2, oy = S * .92, rr = prng(seed);
  roughPoly(cx, [[ox - h * .045, oy], [ox - h * .025, oy - h * .45], [ox + h * .025, oy - h * .45], [ox + h * .05, oy]], trunk, { amp: .8, seed });
  const parts = []; for (let k = 0; k < 11; k++) { const a = rr() * 6.283, d = Math.sqrt(rr()) * h * .3 * wide; parts.push([ox + Math.cos(a) * d * 1.15, oy - h * .58 + Math.sin(a) * d * .62, h * (.16 + rr() * .12)]); }
  cx.fillStyle = dark; for (const [i, [bx, by, br]] of parts.entries()) blob(cx, bx, by, br, i + seed);
  const [rc, rx] = lay(S, S); rx.drawImage(c, 0, 0); rx.globalCompositeOperation = 'source-in'; rx.fillStyle = rim; rx.fillRect(0, 0, S, S);
  const dx = sun[0] - x, dy = sun[1] - (y - h * .66), d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
  cx.globalCompositeOperation = 'source-atop';
  for (const [i, [bx, by, br]] of parts.entries()) { const gr = cx.createLinearGradient(bx + ux * br * .8, by + uy * br * .8, bx - ux * br * .7, by - uy * br * .7); gr.addColorStop(0, rgba(lit, .55)); gr.addColorStop(.45, rgba(dark, .05)); gr.addColorStop(1, 'rgba(2,8,5,.5)'); cx.fillStyle = gr; blob(cx, bx, by, br * .98, i + seed); }
  cx.save(); hatch(cx, [ox - h, oy - h * 1.2, h * 2, h * 1.2], { angle: .9, gap: Math.max(3, h * .025), w: Math.max(.7, h * .004), col: '#020a06', a: .35, seed, broken: .4 }); cx.restore();
  for (let i = 0; i < 26; i++) { const [bx, by, br] = parts[Math.floor(rr() * parts.length)], a = Math.atan2(uy, ux) + (rr() - .5) * 1.6, rad = br * .6 * rr(); cx.strokeStyle = leaf; cx.globalAlpha = .2 + .35 * rr(); cx.lineWidth = Math.max(.8, h * .006); cx.beginPath(); cx.arc(bx + Math.cos(a) * rad, by + Math.sin(a) * rad * .7, h * (.02 + rr() * .03), Math.PI * 1.1, Math.PI * 1.8); cx.stroke(); }
  cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over';
  g.save(); g.globalAlpha = rimA; g.drawImage(rc, x - ox + ux * 2.5, y - oy + uy * 2.5); g.restore(); g.drawImage(c, x - ox, y - oy);
}
function reeds(g, x0, x1, yb, n, h, { col = '#22301c', tip = '#e8c27a', seed = 1, lean = .2, w = 2, tipA = .5, yJit = 20 } = {}) {
  const rr = prng(seed);
  for (let i = 0; i < n; i++) { const x = mix(x0, x1, rr()), y = yb + rr() * yJit, hh = h * (.5 + rr() * .6), l = (rr() - .3) * lean * hh;
    g.strokeStyle = col; g.lineWidth = w * (.6 + rr() * .8); g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l * .3, y - hh * .5, x + l, y - hh); g.stroke();
    if (rr() < .35) { g.strokeStyle = rgba(tip, tipA); g.lineWidth = w * .8; g.beginPath(); g.moveTo(x + l * .8, y - hh * .8); g.lineTo(x + l, y - hh); g.stroke(); }
    if (rr() < .15) { g.fillStyle = '#3a2a1a'; g.beginPath(); g.ellipse(x + l, y - hh, w * 1.3, w * 4, l * .01, 0, 7); g.fill(); } }
}
function grass(g, f, x0, x1, yEnd, n, { lit = '#e8c27a', dark = '#4f7a4a', seed = 8, crest = .5 } = {}) {
  const rr = prng(seed);
  for (let i = 0; i < n; i++) { const x = mix(x0, x1, rr()), y0 = f(x), y = y0 + Math.pow(rr(), 1.8) * (yEnd - y0 + 20), d = (y - y0) / (yEnd - y0 + 1), l = 3 + rr() * 9 * (1 + d * 2);
    g.strokeStyle = rr() < crest - d * .4 ? lit : dark; g.globalAlpha = (.18 + .5 * rr()) * (1 - d * .5); g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rr() - .4) * 4, y - l); g.stroke(); }
  g.globalAlpha = 1;
}
// glints on water inside a clip: short horizontal strokes, denser near (x,y) light column
function glints(g, x0, x1, y0, y1, n, { col = CREAM, a = .5, seed = 3, lx = null, lw = 300, t = 0, wob = 0 } = {}) {
  const rr = prng(seed);
  for (let i = 0; i < n; i++) { const y = y0 + Math.pow(rr(), 1.4) * (y1 - y0), d = (y - y0) / (y1 - y0 + 1); let x = mix(x0, x1, rr()); const ph = rr() * 7;
    x += wob * Math.sin(t * 1.3 + ph) * (4 + d * 8);
    const near = lx === null ? 1 : Math.max(.15, 1 - Math.abs(x - lx) / (lw * (1 + d)));
    const al = a * near * (.3 + .7 * rr()) * (wob ? (.6 + .4 * Math.sin(t * 3 + ph * 3)) : 1);
    g.fillStyle = rgba(col, al); g.fillRect(x, y, (4 + d * 30) * (.4 + rr()), 1.1 + d * 1.6); }
}
function splash(ctx, x, y, u, s = 1, col = CREAM, seed = 5) {     // u 0..1 since impact
  if (u <= 0 || u >= 1) return; const rr = prng(seed);
  for (let k = 0; k < 3; k++) { const v = clamp(u * 1.3 - k * .15); if (v <= 0) continue; ctx.strokeStyle = rgba(col, .6 * (1 - v)); ctx.lineWidth = 1.6 * s; ctx.beginPath(); ctx.ellipse(x, y, (14 + v * 90) * s, (4 + v * 20) * s, 0, 0, 7); ctx.stroke(); }
  for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 + (rr() - .5) * 2.2, sp = (60 + rr() * 140) * s, tt = u * .9, px = x + Math.cos(a) * sp * tt, py = y + Math.sin(a) * sp * tt + 260 * s * tt * tt; if (py > y + 4) continue; ctx.fillStyle = rgba(col, .85 * (1 - u)); ctx.beginPath(); ctx.arc(px, py, (1.5 + rr() * 2.5) * s, 0, 7); ctx.fill(); }
}

// ================================================================ V · the valley, summers flip
const V_SUN = [1500, 330];
const RIVER = [[985, 600], [1065, 618], [1000, 640], [860, 668], [790, 708], [900, 760], [1060, 820], [1050, 890], [880, 960], [700, 1050], [600, 1120]];
const rW = (q) => 3 + 270 * Math.pow(q, 1.8);
const rC = (q) => catmull(RIVER, q);
function riverEdges(off = 0) { const L = [], R = []; for (let i = 0; i <= 120; i++) { const q = i / 120, [x, y] = rC(q), [x2, y2] = rC(Math.min(1, q + .004)), dx = x2 - x, dy = y2 - y, l = Math.hypot(dx, dy) || 1, w = rW(q) / 2 + off; L.push([x - dy / l * w, y + dx / l * w * .35]); R.push([x + dy / l * w, y - dx / l * w * .35]); } return [L, R]; }
const Vcam = (t, a) => ({ x: 960 + drift(t, 7, 1), y: 560 + drift(t, 4, 2), z: mix(1.05, 1.13, sine(lin(a, a + 5.4, t))) });
export function riverScreen(q, A) { const m = camAt(Vcam(A.ago + .55 + .45, A.ago + .55), 1); const [x, y] = rC(q); return [m.X(x), m.Y(y)]; }
function vSky() {
  return big('s06:vsky', () => {
    const [c, g] = lay();
    vgrad(g, 0, 0, W, 700, [[0, '#0e2f33'], [.35, '#1f5552'], [.62, '#9a8a5c'], [.82, '#f0a160'], [1, '#f7cf8e']]); g.fillStyle = '#f7cf8e'; g.fillRect(0, 700, W, H - 700);
    { const [lc, lx] = lay(); const rg = lx.createRadialGradient(V_SUN[0], V_SUN[1], 0, V_SUN[0], V_SUN[1], 900); rg.addColorStop(0, rgba(CREAM, .9)); rg.addColorStop(.12, rgba(GOLD, .7)); rg.addColorStop(.4, rgba(ORANGE, .28)); rg.addColorStop(1, rgba(ORANGE, 0)); lx.fillStyle = rg; lx.fillRect(0, 0, W, H); stipple(lc, { k: .16, g: 1.1, seed: 3 }); g.globalCompositeOperation = 'screen'; g.drawImage(lc, 0, 0); g.globalCompositeOperation = 'source-over'; }
    { const [hc, hx] = lay(); hx.save(); hx.beginPath(); for (const [y, x0, x1, th] of [[250, 880, 2100, 26], [300, 1150, 1820, 12], [190, 1250, 2200, 20], [150, -300, 620, 20], [210, 200, 900, 12]]) stratus(hx, y, x0, x1, th, y); hx.fillStyle = rgba('#e88a58', .5); hx.fill(); hx.clip(); hatch(hx, [0, 100, W, 260], { angle: -0.015, gap: 4, w: 1.1, col: '#ffd9a4', a: .6, seed: 5, broken: .3 }); hx.restore(); maskLinear(hc, 0, 0, W, 0, [[0, .5], [.25, .1], [.45, .2], [.65, .9], [1, .8]]); g.drawImage(hc, 0, 0); }
    g.fillStyle = '#fff4d8'; g.beginPath(); roughPath(g, Array.from({ length: 48 }, (_, i) => [V_SUN[0] + Math.cos(i / 48 * 6.283) * 58, V_SUN[1] + Math.sin(i / 48 * 6.283) * 58]), { amp: .8, seed: 2 }); g.fill();
    bloomL(g, V_SUN[0], V_SUN[1], 240, { col: GOLD, core: CREAM, a: .55, k: .35, seed: 4 });
    for (const [x, y, s] of [[1160, 210, 1], [1205, 232, .8], [1250, 200, .9]]) { g.strokeStyle = '#1a2a24'; g.lineWidth = 2 * s; g.beginPath(); g.moveTo(x - 12 * s, y - 3 * s); g.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y); g.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 12 * s, y - 4 * s); g.stroke(); }
    return c;
  });
}
function vFar() {
  return big('s06:vfar', () => {
    const [c, g] = lay();
    hill(g, ridgeFn(565, 60, .0022, 3), { col: '#b39a73', hc: '#fbe0b0', ha: .5, sun: V_SUN, i: 0 });
    fogL(g, { y0: 520, y1: 660, col: '#f5c58e', a: .55, seed: 20, cover: .75, soft: .45, k: .3, sx: .003, sy: .03 });
    hill(g, ridgeFn(610, 80, .0018, 5), { col: '#8a9262', hc: '#f3cf96', ha: .5, sun: V_SUN, i: 1 });
    fogL(g, { y0: 560, y1: 700, col: '#e9b884', a: .45, seed: 21, cover: .75, soft: .45, k: .3, sx: .003, sy: .03 });
    return c;
  });
}
// valley sides (left slope, right slope with the town), floor, river bed, trees
function vMid() {
  return big('s06:vmid', () => {
    const [c, g] = lay(), r = prng(5);
    // left slope
    const fl = (x) => 500 + x * .19 + 30 * Math.sin(x * .006) - 40 * Math.exp(-Math.pow((x - 300) / 300, 2));
    hill(g, fl, { col: '#46684a', hc: '#e0c88a', ha: .45, sun: V_SUN, i: 2, x1: 980 });
    // right slope (the town sits on it)
    const fr = (x) => 640 - (x - 1000) * .2 - 40 * Math.sin(x * .004) + 25 * Math.exp(-Math.pow((x - 1500) / 200, 2));
    hill(g, fr, { col: '#53704a', hc: '#f0d39a', ha: .45, sun: V_SUN, i: 3, x0: 960 });
    // valley floor meadows
    const ff = (x) => 640 + Math.abs(x - 950) * .02;
    roughPoly(g, [[-20, H + 20], [-20, 700], [600, 650], [950, 625], [1350, 650], [W + 20, 690], [W + 20, H + 20]], '#4f7444', { amp: 1.5, seed: 9 });
    g.save(); g.beginPath(); roughPath(g, [[-20, H + 20], [-20, 700], [600, 650], [950, 625], [1350, 650], [W + 20, 690], [W + 20, H + 20]], { amp: 1.5, seed: 9 }); g.clip();
    radial(g, V_SUN[0], V_SUN[1] + 300, 1100, [[0, rgba(GOLD, .4)], [1, rgba(GOLD, 0)]]);
    // field strips in perspective (hatched in alternating directions)
    for (let k = 0; k < 14; k++) { const y = 650 + Math.pow(k / 14, 1.5) * 420, x = r() * 1700; g.save(); g.beginPath(); g.moveTo(x, y); g.lineTo(x + 380, y - 8); g.lineTo(x + 420, y + 30 + k * 4); g.lineTo(x - 30, y + 36 + k * 4); g.closePath(); g.clip(); hatch(g, [x - 60, y - 20, 520, 120], { angle: k % 2 ? .05 : -.08, gap: 4 + k * .4, col: k % 3 ? '#c9b070' : '#2a4a2a', a: .28, seed: k, broken: .2 }); g.restore(); }
    grass(g, () => 650, 0, W, H, 7000, { seed: 11 });
    g.restore();
    // the town on the right slope: warm stone houses, a few lit windows, a tower
    { const rr = prng(14); const pts = []; for (let i = 0; i < 26; i++) { const x = 1180 + rr() * 560, y = fr(x) + 30 + rr() * 60; pts.push([x, y]); } pts.sort((p, q) => p[1] - q[1]);
      for (const [x, y] of pts) { const w = 26 + rr() * 34, h2 = 22 + rr() * 30; house(g, rr, x, y, w, h2, { wall: mixHex('#c9a774', '#a87850', rr()), roofCol: mixHex('#8a4a2e', '#6a3a28', rr()), lit: (a, b, q) => q() < .18 ? .9 : 0, winOff: '#5a4030', amp: .5, floorH: 14, colW: 12, wscale: .5, trim: false, chimney: .4, roofs: ['gable', 'gable', 'hip', 'steep'], light: { x: V_SUN[0], y: V_SUN[1], col: GOLD, a: .45, r: 700 } }); }
      house(g, rr, 1460, fr(1460) + 50, 22, 70, { wall: '#b88a5a', roof: 'tower', lit: () => 0, amp: .4, trim: false, door: false, chimney: 0, light: { x: V_SUN[0], y: V_SUN[1], col: GOLD, a: .5, r: 500 } }); }
    fogL(g, { y0: 600, y1: 720, col: '#e8b884', a: .35, seed: 22, cover: .7, soft: .45, k: .3, sx: .003, sy: .03 });
    // trees along the banks and on the slopes (small far, bigger near)
    const RT = []; { const rr = prng(15); for (let i = 0; i < 46; i++) { const q = .08 + rr() * .78, [x, y] = rC(q), side = rr() < .5 ? -1 : 1, w = rW(q) / 2 + 18 + rr() * 60 * (q + .2); RT.push([x + side * w, y + 4 + rr() * 6, 18 + 150 * Math.pow(q, 1.6) * (.6 + rr() * .5)]); } }
    for (let i = 0; i < 12; i++) RT.push([60 + r() * 700, fl(0) + 60 + r() * 120, 40 + r() * 50]);
    RT.sort((p, q) => p[1] - q[1]);
    for (const [i, [x, y, h]] of RT.entries()) if (h > 4) tree(g, x, y, h, { sun: V_SUN, seed: 100 + i, dark: '#163020', lit: '#b08a40' });
    return c;
  });
}
// river variants: 0 clear, 1 algae + reeds, 2 grey (cached), drawn on top of the floor
function riverLayer(state) {
  return big('s06:vriver' + state, () => {
    const [c, g] = lay(), [L, R] = riverEdges(), poly = [...L, ...[...R].reverse()];
    const cols = [['#cfe6d8', '#6ab0a8', '#2f6a6e'], ['#c9d6a0', '#7a9a5a', '#3a5a32'], ['#b8b098', '#7a7462', '#4a463c']][state];
    roughPoly(g, poly, cols[1], { amp: 1, seed: 3 });
    g.save(); g.beginPath(); roughPath(g, poly, { amp: 1, seed: 3 }); g.clip();
    vgrad(g, 0, 590, W, 500, [[0, cols[0]], [.4, cols[1]], [1, cols[2]]]);
    // bank shadow inside the edges, sky reflection streaks
    const [L2, R2] = riverEdges(-10); g.strokeStyle = rgba('#0a1a10', .35); g.lineWidth = 10; g.beginPath(); L.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke(); g.beginPath(); R.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke(); void L2; void R2;
    glints(g, 500, 1300, 600, 1100, state === 2 ? 220 : 900, { col: state === 2 ? '#d8d0b8' : CREAM, a: state === 2 ? .25 : .55, seed: 7 + state });
    if (state === 0) { const rr = prng(4); for (let i = 0; i < 120; i++) { const q = .5 + rr() * .5, [x, y] = rC(q); g.fillStyle = rgba('#3a5a4a', .25 + .3 * rr()); g.beginPath(); g.ellipse(x + (rr() - .5) * rW(q) * .6, y + (rr() - .5) * 20, 3 + rr() * 9 * q, 2 + rr() * 4 * q, 0, 0, 7); g.fill(); } }  // stones on the clear bed
    if (state >= 1) { const rr = prng(5); for (let i = 0; i < 260; i++) { const q = .2 + rr() * .8, [x, y] = rC(q), e = (rr() < .5 ? -1 : 1) * rW(q) * (.25 + rr() * .3); g.fillStyle = rgba(state === 1 ? '#5a7a32' : '#5a5440', .35 + .3 * rr()); g.beginPath(); g.ellipse(x + e, y + (rr() - .5) * 10, 4 + rr() * 22 * q, 2 + rr() * 5 * q, 0, 0, 7); g.fill(); } }   // scum along the edges
    if (state === 2) { const rr = prng(6); for (let i = 0; i < 14; i++) { const q = .45 + rr() * .5, [x, y] = rC(q); g.fillStyle = '#2a2622'; g.beginPath(); g.ellipse(x + (rr() - .5) * rW(q) * .5, y, 6 + 16 * q, 3 + 5 * q, rr(), 0, 7); g.fill(); g.strokeStyle = rgba('#e8e0c8', .35); g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - 40 * q, y + 8); g.lineTo(x + 50 * q, y + 6); g.stroke(); } }  // debris, foam
    g.restore();
    // reeds closing in from the banks (state 1, 2)
    if (state >= 1) { const rr = prng(7 + state); for (let i = 0; i < (state === 1 ? 50 : 90); i++) { const q = .25 + rr() * .75, [x, y] = rC(q), side = rr() < .5 ? -1 : 1; const ex = x + side * rW(q) * (.3 + rr() * .25); reeds(g, ex - 30 * q, ex + 30 * q, y - 6, 8, 10 + 70 * q, { col: state === 1 ? '#2f4a22' : '#4a4a36', tip: state === 1 ? '#c9b070' : '#a8a088', seed: i + state * 100, w: 1 + q * 2, yJit: 10 * q }); } }
    return c;
  });
}
// near foreground: rock ledge (left) with grass, reedy bank (right) with the sign
const LEDGE = [[-30, 905], [160, 884], [420, 890], [600, 905], [700, 918], [742, 940], [700, 975], [560, 1000], [-30, 1100]];
const SIGN_V = [1350, 905];
function vNear() {
  return big('s06:vnear', () => {
    const [c, g] = lay();
    { const fl = (x) => 870 + 30 * Math.sin(x * .006) + x * .03; const Gp = [[-30, H + 20]]; for (let x = -30; x <= 640; x += 10) Gp.push([x, fl(x)]); Gp.push([560, H + 20]);
      roughPoly(g, Gp, '#284a30', { amp: 2, seed: 30 }); g.save(); g.beginPath(); roughPath(g, Gp, { amp: 2, seed: 30 }); g.clip(); vgrad(g, 0, 840, 700, 240, [[0, rgba('#d9a85a', .4)], [.3, rgba('#d9a85a', .05)], [1, 'rgba(6,18,11,.55)']]); grass(g, fl, -30, 640, H, 3500, { seed: 31 }); g.restore(); }
    void LEDGE; tree(g, 150, 950, 620, { sun: V_SUN, seed: 77, wide: 1.25, dark: '#10261a', lit: '#9a7a3a' });
    // right bank with reeds and grass
    const fb = (x) => 880 + (x - 1100) * -.03 + 14 * Math.sin(x * .01) + 160 * Math.exp(-Math.pow((x - 1080) / 90, 2));
    const B = [[960, H + 20]]; for (let x = 990; x <= W + 20; x += 10) B.push([x, fb(x) + Math.max(0, 1100 - x) * 1.2]); B.push([W + 20, H + 20]);
    roughPoly(g, B, '#1f3a26', { amp: 2, seed: 6 });
    g.save(); g.beginPath(); roughPath(g, B, { amp: 2, seed: 6 }); g.clip(); vgrad(g, 1000, 820, 920, 260, [[0, rgba('#d9a85a', .35)], [.3, rgba('#d9a85a', .05)], [1, 'rgba(6,18,11,.55)']]); grass(g, fb, 1060, W, H, 3500, { seed: 12 }); g.restore();
    reeds(g, 1120, 1260, 880, 26, 120, { col: '#1a2a18', tip: '#e8c27a', seed: 21, w: 2.6 }); reeds(g, 1420, 1560, 875, 30, 150, { col: '#1a2a18', tip: '#e8c27a', seed: 22, w: 2.6 }); reeds(g, 1780, 1940, 860, 30, 190, { col: '#1a2a18', tip: '#e8c27a', seed: 23, w: 3 });
    { const rr = prng(15); for (let i = 0; i < 120; i++) { const x = 1000 + rr() * 920, y = fb(x) + 30 + Math.pow(rr(), 1.5) * 180; g.fillStyle = rr() < .6 ? '#ffb35c' : '#e8553a'; g.globalAlpha = .55 + .4 * rr(); g.beginPath(); g.arc(x, y, 1.3 + rr() * 2.4, 0, 7); g.fill(); } g.globalAlpha = 1; }
    // the sign (small here; it is the next shot)
    { const [x, y] = SIGN_V; roughLine(g, [[x, y + 40], [x - 10, y - 50]], { w: 4, col: '#2a2420', seed: 1 }); g.save(); g.translate(x - 10, y - 62); g.rotate(-.18); roughRect(g, -26, -16, 52, 32, '#e8e2d2', { amp: .4, seed: 2 }); g.strokeStyle = '#b8402a'; g.lineWidth = 3; g.strokeRect(-23, -13, 46, 26); g.fillStyle = '#2a2a2a'; g.fillRect(-16, -4, 32, 3); g.fillRect(-12, 3, 24, 3); g.restore(); }
    return c;
  });
}
const KIDV = { from: [868, 786], to: [935, 800], s: .3 };
export function valley(ctx, t, s, A) {
  const cam = Vcam(t, s.a);
  const flips = [A.dying, A.more ?? (A.dying + .72), A.summer];
  const st = flips.reduce((k, f) => k + sm(lin(f - .1, f + .14, t)), 0);
  const i0 = Math.min(2, Math.floor(st)), u = st - i0;
  stage(ctx, [
    { c: vSky(), p: .25 }, { c: vFar(), p: .45 }, { c: vMid(), p: .8, dolly: .2 },
    { p: .8, fn: (g) => {
      g.drawImage(riverLayer(i0), 0, 0); if (u > 0 && i0 < 2) { g.globalAlpha = u; g.drawImage(riverLayer(i0 + 1), 0, 0); g.globalAlpha = 1; }
      // living glints on the water (fewer as it dies)
      g.save(); g.beginPath(); const [L, R] = riverEdges(); roughPath(g, [...L, ...[...R].reverse()], { amp: 1, seed: 3 }); g.clip();
      glints(g, 520, 1300, 600, 1100, 140, { a: .5 * (1 - st / 2.6), seed: 40, t, wob: 1 }); g.restore();
      // the kid jumps in (clear water only)
      const tj = A.swam - .35, j = lin(tj, tj + .6, t), kidA = 1 - sm(lin(A.dying - .2, A.dying + .1, t));
      if (kidA > 0) {
        const pose = j <= 0 ? { lean: .15, head: .1, sh: [.6, .3], el: [.4, .5], hip: [.1, -.05], kn: [.1, .1], hair: 'short' } : { lean: .5, head: .3, sh: [2.6, 2.4], el: [.2, .2], hip: [-.3, .2], kn: [.4, .9], hair: 'short' };
        const F = fig('vkid' + (j > 0 ? 'j' : 's'), KIDV.s, pose, { dress: { coat: '#e9c3a0', pants: '#c4482a', shoes: '#e9c3a0', skin: '#e9c3a0', hair: '#3a2214' }, light: { dx: 400, dy: -300, col: '#ffd9a0', a: .5 }, rim: '#ffe0a8', rimSide: 1 });
        if (j < 1) { const x = mix(KIDV.from[0], KIDV.to[0], j), y = mix(KIDV.from[1], KIDV.to[1], j) - Math.sin(Math.PI * j) * 50 - 30 * KIDV.s * 0; g.save(); g.globalAlpha = kidA; drawFig(g, F, x, y - 88 * KIDV.s, t, { breath: 1 }); g.restore(); }
        g.save(); g.globalAlpha = kidA; splash(g, KIDV.to[0], KIDV.to[1] + 6, lin(tj + .6, tj + 1.6, t), .8); g.restore();
      }
    } },
    { c: vNear(), p: 1.15 },
  ], cam);
  // summers passing: a flicker of light, then the colour drains
  const flash = flips.reduce((k, f) => k + Math.exp(-Math.pow((t - f) / .09, 2)), 0);
  tintAll(ctx, '#fff1cf', .12 * flash, 'soft-light');
  tintAll(ctx, '#8a8a84', .22 * st, 'saturation');
  tintAll(ctx, '#2a2a30', .06 * st, 'multiply');
  vignetteL(ctx, .35, '#06110c'); paper(ctx, .08, t);
}
export function signInV(A) { const t = A.nobody0 - .12, m = camAt(Vcam(t, A.ago + .55), 1.15); return [m.X(SIGN_V[0] - 10), m.Y(SIGN_V[1] - 62)]; }

// ================================================================ SG · the sign nobody was paid to save
const SG_PIV = [1040, 780];          // where the post enters the water
export const RIPPLE = [880, 800];
function sgPlate() {
  return big('s06:sg', () => {
    const [c, g] = lay();
    vgrad(g, 0, 0, W, 560, [[0, '#5a5e60'], [.7, '#8a8a80'], [1, '#a8a494']]);
    fogL(g, { y0: 300, y1: 620, col: '#c8c4b4', a: .4, seed: 31, cover: .6, soft: .5, k: .25, sx: .003, sy: .02 });
    // far bank, grey trees
    hill(g, ridgeFn(560, 50, .003, 33), { col: '#4a4e48', hc: '#a8a898', ha: .3, i: 4, gap: 4 });
    { const rr = prng(3); for (let i = 0; i < 16; i++) tree(g, rr() * W, 590 + rr() * 20, 80 + rr() * 90, { dark: '#3a403a', lit: '#8a8a7a', rim: '#b8b4a4', rimA: .3, sun: [500, 100], seed: 300 + i, leaf: '#a8a898' }); }
    fogL(g, { y0: 520, y1: 660, col: '#b0aca0', a: .5, seed: 32, cover: .7, soft: .5, k: .25, sx: .004, sy: .03 });
    // water: dull grey-brown, sky reflection, scum
    vgrad(g, 0, 620, W, 460, [[0, '#8a867a'], [.4, '#5e5a4e'], [1, '#2e2c26']]);
    glints(g, 0, W, 630, 1080, 500, { col: '#d0ccb8', a: .22, seed: 33 });
    { const rr = prng(4); for (let i = 0; i < 160; i++) { const y = 650 + Math.pow(rr(), 1.3) * 430, x = rr() * W, d = (y - 620) / 460; g.fillStyle = rgba('#6a6a4a', .3 + .3 * rr()); g.beginPath(); g.ellipse(x, y, 8 + 50 * d * rr(), 2 + 6 * d, 0, 0, 7); g.fill(); } }
    // grey reeds, back row
    reeds(g, 0, W, 640, 220, 160, { col: '#3a3a30', tip: '#a8a490', seed: 34, w: 2.2, tipA: .4 });
    return c;
  });
}
function sgFront() {
  return big('s06:sgf', () => {
    const [c, g] = lay();
    reeds(g, -20, 620, 1000, 160, 420, { col: '#24241e', tip: '#8a8670', seed: 35, w: 5, tipA: .35, yJit: 90 });
    reeds(g, 1350, W + 20, 990, 140, 380, { col: '#24241e', tip: '#8a8670', seed: 36, w: 5, tipA: .35, yJit: 90 });
    // a plastic bottle and a bag caught in the reeds
    roughRect(g, 1460, 930, 70, 26, 'rgba(200,210,200,.45)', { amp: .5, seed: 2 }); roughPoly(g, [[300, 900], [380, 880], [420, 930], [330, 950]], 'rgba(220,220,210,.35)', { amp: 2, seed: 3 });
    return c;
  });
}
function signSprite() {
  return spr('s06signbig', () => {
    const [c, g] = lay(420, 700); g.translate(210, 640);
    roughRect(g, -9, -560, 18, 600, '#3a322a', { amp: 1, seed: 1 }); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(-9, -560, 5, 600);
    g.save(); g.translate(0, -470);
    roughRect(g, -170, -90, 340, 180, '#e0dccc', { amp: 1.2, seed: 2 });
    g.strokeStyle = '#a83a26'; g.lineWidth = 10; g.strokeRect(-154, -74, 308, 148);
    text(g, 'NO', 0, -10, { size: 50, weight: 600, color: '#2a2a2a', align: 'center', spacing: 6 });
    text(g, 'SWIMMING', 0, 46, { size: 40, weight: 600, color: '#2a2a2a', align: 'center', spacing: 5 });
    const rr = prng(3); for (let i = 0; i < 30; i++) { g.fillStyle = rgba('#7a3a1a', .2 + .4 * rr()); g.beginPath(); g.arc(-170 + rr() * 340, -90 + rr() * 180, 2 + rr() * 9, 0, 7); g.fill(); }
    hatch(g, [-170, -90, 340, 180], { angle: .7, gap: 6, col: '#3a3a30', a: .15, seed: 4, broken: .4 });
    g.restore();
    return c;
  });
}
export function sign(ctx, t, s, A) {
  const cam = { x: 960 + drift(t, 6, 2), y: 560 + drift(t, 4, 3), z: 1.07 + .03 * lin(s.a, s.b, t) };
  const tp = A.paid, fall = ein(lin(tp + .05, tp + .62, t));
  const ant = Math.sin(clamp((t - (tp - .25)) / .3) * Math.PI) * .05;    // anticipation: it rocks back first
  const ang = -.22 + Math.sin(t * 1.1) * .012 + ant - fall * 1.25;
  const sink = Math.max(0, t - (tp + .62)) * 260;
  stage(ctx, [
    { c: sgPlate(), p: .7 },
    { p: 1, fn: (g) => {
      const [x, y] = SG_PIV;
      g.save(); g.beginPath(); g.rect(-500, -500, W + 1000, y + 500 + 20); g.clip();
      g.save(); g.translate(x, y + sink * .3); g.rotate(ang); g.drawImage(signSprite(), -210, -640 + 120 + sink); g.restore(); g.restore();
      // the part under water: murky
      g.save(); g.globalAlpha = .7; g.fillStyle = '#4a463c'; g.fillRect(x - 300, y + 16, 600, 4); g.restore();
      // rings around the post, then the big splash where the sign hits the water
      for (let k = 0; k < 3; k++) { const v = ((t * .35 + k / 3) % 1); g.strokeStyle = rgba('#d8d4c4', .35 * (1 - v)); g.lineWidth = 1.5; g.beginPath(); g.ellipse(x, y + 16, 20 + v * 90, 4 + v * 16, 0, 0, 7); g.stroke(); }
      const hit = tp + .62; splash(g, RIPPLE[0], RIPPLE[1], lin(hit, hit + 1.1, t), 1.6, '#e8e4d4', 9);
      for (let k = 0; k < 4; k++) { const v = lin(hit + k * .18, hit + 2.2 + k * .18, t); if (v <= 0 || v >= 1) continue; g.strokeStyle = rgba('#e8e4d4', .5 * (1 - v)); g.lineWidth = 2; g.beginPath(); g.ellipse(RIPPLE[0], RIPPLE[1], 20 + v * 520, 6 + v * 110, 0, 0, 7); g.stroke(); }
    } },
    { c: sgFront(), p: 1.25 },
  ], cam);
  tintAll(ctx, '#6a6a68', .15, 'saturation'); vignetteL(ctx, .38); paper(ctx, .08, t);
}

// ================================================================ BK · the bank: nobody has to be paid
const BK_W = 2400;    // the plate is wider than the frame; the camera trucks right
function bkPlate() {
  return big('s06:bk', () => {
    const [c, g] = lay(BK_W, H);
    vgrad(g, 0, 0, BK_W, 520, [[0, '#6a7078'], [.6, '#b0a890'], [1, '#d8c8a0']]);
    radial(g, 2000, 380, 900, [[0, rgba('#ffd9a0', .5)], [1, rgba('#ffd9a0', 0)]]);
    // far bank
    const fb = ridgeFn(505, 30, .004, 41);
    { const pts = [[-20, 560]]; for (let x = -20; x <= BK_W + 20; x += 10) pts.push([x, fb(x)]); pts.push([BK_W + 20, 560]); roughPoly(g, pts, '#4e5a48', { amp: 1.5, seed: 4 }); }
    { const rr = prng(5); for (let i = 0; i < 30; i++) tree(g, rr() * BK_W, 520 + rr() * 14, 90 + rr() * 110, { dark: '#3a4a38', lit: '#c0a060', rim: '#e8c890', rimA: .5, sun: [2000, 360], seed: 400 + i, leaf: '#d8c090' }); }
    { const rr = prng(6); for (const x of [380, 1580, 1720]) house(g, rr, x, 535, 70, 54, { wall: '#8a8270', roofCol: '#5a3a2e', lit: () => 0, amp: .6, trim: false }); }
    fogL(g, { x0: 0, x1: BK_W, y0: 470, y1: 600, col: '#c8bca0', a: .45, seed: 42, cover: .7, soft: .5, k: .25, sx: .003, sy: .03 });
    // water across the frame
    vgrad(g, 0, 545, BK_W, 535, [[0, '#a8a088'], [.35, '#6e6a58'], [1, '#34342c']]);
    glints(g, 0, BK_W, 550, 1080, 900, { col: '#f0e0c0', a: .3, seed: 43, lx: 2000, lw: 600 });
    // near bank, bottom (grass, mud)
    const nb = (x) => 975 + 25 * Math.sin(x * .004) + 20 * Math.sin(x * .011);
    { const pts = [[-20, H + 20]]; for (let x = -20; x <= BK_W + 20; x += 10) pts.push([x, nb(x)]); pts.push([BK_W + 20, H + 20]); roughPoly(g, pts, '#2e3a26', { amp: 2, seed: 7 }); g.save(); g.beginPath(); roughPath(g, pts, { amp: 2, seed: 7 }); g.clip(); grass(g, nb, 0, BK_W, H, 4000, { lit: '#d8c090', dark: '#4a5a3a', seed: 8 }); g.restore(); }
    reeds(g, 0, 300, 960, 40, 140, { col: '#3a3a2a', tip: '#c8b890', seed: 9, w: 3 }); reeds(g, 2050, 2400, 960, 40, 140, { col: '#3a3a2a', tip: '#c8b890', seed: 10, w: 3 });
    return c;
  });
}
// people clearing the river: [x (plate), feet y, scale, poseA, poseB, dress, prop, delay, flip, wade]
const CREW = [
  [520, 790, .9, { lean: .9, head: .5, sh: [1.6, 1.4], el: [.2, .3], hip: [-.4, .5], kn: [-.6, .2], hair: 'bun' }, { lean: .25, head: .1, sh: [1.0, .8], el: [1.0, 1.1], hip: [.1, -.1], kn: [.1, .1], hair: 'bun' }, { coat: '#3e6a74', pants: '#2a2c34', skin: '#d9a77e', hair: '#2a1a14' }, 'tyre', 0, false, true],
  [820, 760, .82, { lean: .5, head: .4, sh: [1.2, .9], el: [.5, .4], hip: [.25, -.2], kn: [.1, .3], hair: 'cap' }, { lean: .2, head: .2, sh: [.7, .5], el: [.9, .9], hip: [.1, -.1], kn: [.1, .2], hair: 'cap' }, { coat: '#6a5040', pants: '#3a3a30', skin: '#c9906a', hair: '#2a2420', hairBack: '#3a3028' }, 'rake', .14, true, true],
  [1150, 975, .75, { lean: 1.0, head: .5, sh: [1.5, 1.3], el: [.3, .4], hip: [1.6, 1.2], kn: [2.4, 2.2], hair: 'curly' }, { lean: .7, head: .3, sh: [1.2, 1.0], el: [.6, .7], hip: [1.6, 1.2], kn: [2.4, 2.2], hair: 'curly' }, { coat: '#e59a3a', pants: '#2a2c3a', skin: '#8a5a3a', hair: '#1a1010' }, 'bucket', .28, false, false],
  [1430, 800, .88, { lean: .85, head: .5, sh: [1.5, 1.3], el: [.25, .2], hip: [-.3, .4], kn: [-.4, .3], hair: 'short' }, { lean: .3, head: .1, sh: [1.2, 1.0], el: [1.3, 1.2], hip: [.1, -.1], kn: [.1, .1], hair: 'short' }, { coat: '#7a3a3a', pants: '#2a2a34', skin: '#e9c3a0', hair: '#5a3a20' }, 'cart', .4, true, true],
  [1600, 805, .85, { lean: .85, head: .5, sh: [1.5, 1.3], el: [.25, .2], hip: [-.3, .4], kn: [-.4, .3], hair: 'long' }, { lean: .3, head: .1, sh: [1.2, 1.0], el: [1.3, 1.2], hip: [.1, -.1], kn: [.1, .1], hair: 'long' }, { coat: '#4a5a8a', pants: '#2a2a34', skin: '#c9906a', hair: '#1a1010' }, null, .46, false, true],
  [1980, 985, .8, { lean: .35, head: .3, sh: [1.2, 1.0], el: [.6, .6], hip: [.3, -.25], kn: [.1, .35], hair: 'grey' }, { lean: .4, head: .25, sh: [1.0, .9], el: [.8, .8], hip: [-.25, .3], kn: [.35, .1], hair: 'grey' }, { coat: '#5a6a4a', pants: '#2a2a2a', skin: '#e0b090', hair: '#d0ccc0', hairBack: '#c9c2b6' }, 'barrow', .58, false, false],
];
const bkCam = (t, a) => ({ x: mix(860, 1160, sine(lin(a - .4, a + 2.6, t))) + drift(t, 5, 1), y: 560 + drift(t, 4, 2), z: 1.08 });
export function bank(ctx, t, s, A) {
  const cam = bkCam(t, s.a), tn = A.nobody;
  const m = camAt(cam, 1);
  ctx.save(); m.set(ctx); ctx.drawImage(bkPlate(), 0, 0);
  // the ripple from the sign, still spreading in the foreground water (the iris came out of it)
  for (let k = 0; k < 4; k++) { const v = lin(s.a - .5 + k * .2, s.a + 2.4 + k * .2, t); if (v <= 0 || v >= 1) continue; ctx.strokeStyle = rgba('#f0e4c8', .45 * (1 - v)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cam.x - 80, 860, 60 + v * 900, 14 + v * 120, 0, 0, 7); ctx.stroke(); }
  // warming as they work
  const warm = sm(lin(tn, tn + 1.6, t));
  for (const [i, [x, fy, sc, PA, PB, dress, prop, dl, flip, wade]] of CREW.entries()) {
    const t0 = tn + dl, act = lin(t0 - .15, t0 + .5, t), cyc = act >= 1 ? .5 - .5 * Math.cos((t - t0 - .5) * 2.2) : 0;
    const u = act < 1 ? eout(act) * .0 : cyc;
    const P = (q) => lerpPose(act < 1 ? PB : PA, PA, act < 1 ? eio(act) : 0);
    void P;
    const F = figAnim(`bk${i}`, 9, act < 1 ? eio(act) * .5 : .5 + .5 * u, sc, (q) => q < .5 ? lerpPose(PB, PA, q * 2) : lerpPose(PA, PB, (q - .5) * 2 * .55), { flip, dress, light: { dx: 900, dy: -500, col: '#ffd9a0', a: .45 }, rim: '#ffe0b0', rimSide: flip ? -1 : 1, shadeA: .1 });
    const hip = fy - 88 * sc;
    drawFig(ctx, F, x, hip, t, { ph: i, breath: 1.2 });
    const [hx, hy] = F.hand(0), HX = x + hx, HY = hip + hy;
    if (prop === 'tyre') { const lift = act >= 1 ? u : 0; ctx.save(); ctx.translate(HX + 10, HY + 26 - lift * 10); ctx.rotate(.2); ctx.lineWidth = 13; ctx.strokeStyle = '#1a1a1c'; ctx.beginPath(); ctx.ellipse(0, 0, 40, 22, 0, 0, 7); ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(200,200,190,.25)'; ctx.beginPath(); ctx.ellipse(0, -2, 40, 22, 0, 3.6, 5.8); ctx.stroke(); ctx.restore(); }
    if (prop === 'rake') { roughLine(ctx, [[HX - 60, HY - 90], [HX + 50 * (flip ? -1 : 1) * 2.4, HY + 70]], { w: 4, col: '#2a2018', seed: i }); }
    if (prop === 'bucket') { roughRect(ctx, HX - 4, HY - 6, 34, 30, '#c4482a', { amp: .5, seed: i }); ctx.fillStyle = '#7a2a1a'; ctx.fillRect(HX - 4, HY - 6, 34, 5); }
    if (prop === 'cart' && act > 0) { const lift = u * 30; ctx.save(); ctx.translate(x + 80, fy - 30 - lift); ctx.rotate(-.25 + u * .15); ctx.strokeStyle = '#9a9aa0'; ctx.lineWidth = 3; ctx.strokeRect(-70, -40, 140, 70); for (let k = -60; k < 70; k += 14) { ctx.beginPath(); ctx.moveTo(k, -40); ctx.lineTo(k, 30); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-70, -10); ctx.lineTo(70, -10); ctx.stroke(); ctx.restore(); }
    if (prop === 'barrow') { roughPoly(ctx, [[HX + 10, HY + 2], [HX + 140, HY - 10], [HX + 150, HY + 30], [HX + 30, HY + 40]], '#5a5a52', { amp: .6, seed: 3 }); ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.arc(HX + 130, fy - 10, 20, 0, 7); ctx.fill(); }
    if (wade) { // water in front of the shins: a band of water colour + a ring
      ctx.save(); ctx.fillStyle = rgba('#6e6a58', .82); ctx.beginPath(); ctx.ellipse(x, fy - 22 * sc, 46 * sc, 9 * sc, 0, 0, 7); ctx.fill(); ctx.fillRect(x - 46 * sc, fy - 22 * sc, 92 * sc, 30 * sc); ctx.restore();
      const v = ((t * .5 + i * .3) % 1); ctx.strokeStyle = rgba('#f0e4c8', .4 * (1 - v)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, fy - 22 * sc, (40 + v * 80) * sc, (8 + v * 12) * sc, 0, 0, 7); ctx.stroke();
    }
  }
  ctx.restore();
  tintAll(ctx, '#7a7a74', .28 * (1 - warm), 'saturation'); tintAll(ctx, '#ffb35c', .1 * warm, 'soft-light');
  vignetteL(ctx, .35); paper(ctx, .08, t);
}

// ================================================================ RV · your river at dawn; "the time"
const RV_H = 560;
const YOU_RV = [1180, 960];    // feet (under water), hip computed
function rvBack() {
  return big('s06:rvback', () => {
    const [c, g] = lay();
    // far bank: two soft ridges, then a wooded bank, all silhouettes (the sky is drawn per frame)
    hill(g, ridgeFn(RV_H - 10, 50, .002, 51), { col: '#5a5a7a', hc: '#d8b8c8', ha: .3, i: 5, bottom: RV_H + 40 });
    { const rr = prng(52); for (let i = 0; i < 26; i++) tree(g, rr() * W, RV_H + 6 + rr() * 6, 60 + rr() * 80, { dark: '#2a2a44', lit: '#c08a8a', rim: '#ffb890', rimA: .45, sun: [420, 500], seed: 500 + i, leaf: '#e8b0a0' }); }
    return c;
  });
}
function rvWater() {
  return big('s06:rvwater', () => {
    const [c, g] = lay();
    vgrad(g, 0, RV_H, W, H - RV_H, [[0, '#c8a0a8'], [.3, '#7a6a90'], [1, '#2a2a4a']]);
    // upstream (left) still grey with debris, your stretch (right) clear
    const [gc, gx] = lay(); vgrad(gx, 0, RV_H, 900, H - RV_H, [[0, '#8a8478'], [1, '#3a3830']]); maskLinear(gc, 0, 0, 900, 0, [[0, 1], [.7, .8], [1, 0]]); g.globalAlpha = .75; g.drawImage(gc, 0, 0); g.globalAlpha = 1;
    { const rr = prng(4); for (let i = 0; i < 40; i++) { const x = rr() * 700, y = RV_H + 20 + Math.pow(rr(), 1.3) * 480, d = (y - RV_H) / 520; g.fillStyle = rgba('#3a362e', .5); g.beginPath(); g.ellipse(x, y, 6 + 28 * d, 2 + 5 * d, 0, 0, 7); g.fill(); } }
    glints(g, 0, W, RV_H + 4, H, 700, { col: '#ffe8d0', a: .4, seed: 55 });
    // reeds left and right
    reeds(g, -20, 420, 640, 110, 220, { col: '#2a2440', tip: '#e8b0a0', seed: 56, w: 3.2, tipA: .45, yJit: 80 });
    reeds(g, 1650, W + 20, 660, 90, 240, { col: '#2a2440', tip: '#e8b0a0', seed: 57, w: 3.2, tipA: .45, yJit: 90 });
    return c;
  });
}
function sunPos(t, A) { const u = eio(lin(A.haveTime, A.time + .55, t)); const a = mix(0, Math.PI, u); return [mix(420, 1640, (1 - Math.cos(a)) / 2), RV_H - 40 - Math.sin(a) * 420 + (u <= 0 ? 0 : 0), u]; }
export function dawn(ctx, t, s, A) {
  const cam = { x: 1010 + drift(t, 6, 1), y: 560 + drift(t, 4, 2) - 20 * sine(lin(s.a, s.a + 1.4, t)), z: 1.16 };
  const [sx, sy, su] = sunPos(t, A), hgt = clamp((RV_H - sy) / 420);
  // sky by sun height: dawn rose → day cream-blue → evening gold
  const top = mixHex(su < .5 ? '#2a2a5a' : '#2a3a6a', '#5a7aa8', hgt), mid = mixHex('#c88aa0', '#c8d8e0', hgt), low = mixHex(su < .5 ? '#ffb890' : '#ffb35c', '#f0e8d0', hgt);
  stage(ctx, [
    { p: .3, fn: (g) => { vgrad(g, -200, -200, W + 400, RV_H + 240, [[0, top], [.6, mid], [1, low]]); glowAt(g, sx, sy, 520, .55, mixHex('#ff9a6a', '#fff0c0', hgt), '#fff8e8'); g.fillStyle = '#fff6e0'; g.beginPath(); g.arc(sx, sy, 34, 0, 7); g.fill();
      // streaking clouds (time-lapse)
      const sp = 1 + 30 * Math.sin(Math.PI * su); for (let k = 0; k < 6; k++) { const x = ((k * 400 + t * 20 * sp) % 2600) - 340, y = 120 + k * 55; g.save(); g.globalAlpha = .35; g.beginPath(); stratus(g, y, x, x + 500, 14, k + 3); g.fillStyle = mixHex('#e8a0a0', '#ffffff', hgt); g.fill(); g.restore(); } } },
    { c: rvBack(), p: .55 },
    { c: rvWater(), p: 1 },
    { p: 1, fn: (g) => {
      // the sun's path on the water
      g.save(); g.globalCompositeOperation = 'lighter'; glints(g, sx - 200, sx + 200, RV_H + 6, H, 120, { col: '#fff0d0', a: .6, seed: 60, lx: sx, lw: 140, t, wob: 1 }); g.restore();
      // your clear stretch shines
      glints(g, 900, 1600, 700, H, 120, { col: '#fff8e0', a: .55, seed: 61, t, wob: 1 });
      // you, knee-deep, net pole; splash on "start"
      const ts = A.start, plunge = eio(lin(ts - .4, ts + .05, t)) * (1 - eio(lin(ts + .9, ts + 1.6, t)) * .6);
      const sc = 1.7, hip = YOU_RV[1] - 88 * sc;
      const PA = { lean: .1, head: .15, sh: [.8, .5], el: [.6, .9], hip: [.12, -.1], kn: [.05, .15], hair: 'long' }, PB = { lean: .45, head: .45, sh: [1.25, 1.05], el: [.2, .4], hip: [.25, -.2], kn: [.1, .35], hair: 'long' };
      const F = figAnim('rvyou', 8, plunge, sc, (q) => lerpPose(PA, PB, q), { flip: true, dress: { coat: '#e59a3a', pants: '#2a2c3a', shoes: '#14100c', skin: '#e9c3a0', hair: '#3a2214' }, light: { dx: -500, dy: -300, col: '#ffd9a0', a: .55 }, rim: '#ffe0a8', rimSide: -1, rimW: 2.2, shadeA: .12 });
      // your shadow on the water swings with the sun
      g.save(); g.translate(YOU_RV[0], YOU_RV[1] - 20); g.rotate(Math.atan2(YOU_RV[1] - sy, YOU_RV[0] - sx) * .25); g.fillStyle = 'rgba(20,16,40,.35)'; g.beginPath(); g.ellipse(120, 10, 160, 12, 0, 0, 7); g.fill(); g.restore();
      drawFig(g, F, YOU_RV[0], hip, t, { breath: 1.3 });
      const [hx, hy] = F.hand(0), [hx2, hy2] = F.hand(1);
      const tip = [YOU_RV[0] - 360 + plunge * 40, mix(YOU_RV[1] - 120, YOU_RV[1] + 10, plunge)];
      roughLine(g, [[YOU_RV[0] + hx2 + 30, hip + hy2 - 30], tip], { w: 5, col: '#2a1a14', seed: 3 });
      g.strokeStyle = 'rgba(240,230,210,.7)'; g.lineWidth = 2; g.beginPath(); g.ellipse(tip[0], tip[1], 34, 14, .1, 0, 7); g.stroke(); void hx; void hy;
      // water in front of your shins + rings
      g.fillStyle = rgba('#5a4a78', .85); g.beginPath(); g.ellipse(YOU_RV[0], YOU_RV[1] - 60, 80, 14, 0, 0, 7); g.fill(); g.fillRect(YOU_RV[0] - 80, YOU_RV[1] - 60, 160, 66);
      glints(g, YOU_RV[0] - 60, YOU_RV[0] + 60, YOU_RV[1] - 40, YOU_RV[1] + 4, 14, { col: '#ffe8d0', a: .6, seed: 62, t, wob: 1 });
      for (let k = 0; k < 3; k++) { const v = ((t * .45 + k / 3) % 1); g.strokeStyle = rgba('#ffe8d0', .4 * (1 - v)); g.lineWidth = 1.5; g.beginPath(); g.ellipse(YOU_RV[0], YOU_RV[1] - 40, 50 + v * 140, 10 + v * 22, 0, 0, 7); g.stroke(); }
      splash(g, tip[0], YOU_RV[1] - 6, lin(ts, ts + 1.1, t), 1.3, '#fff0d8', 11);
    } },
  ], cam);
  tintAll(ctx, mixHex('#ff8a6a', '#fff4d0', hgt), .12, 'soft-light');
  vignetteL(ctx, .35, '#0a0818'); paper(ctx, .08, t);
}
export function handsInDawn(A) { const t = A.haveHelp - .05, cam = { x: 1010 + drift(t, 6, 1), y: 560 + drift(t, 4, 2) - 20, z: 1.16 }, m = camAt(cam, 1); return [m.X(YOU_RV[0] - 90), m.Y(YOU_RV[1] - 190)]; }

// ================================================================ HP · your hands, the help turns amber
export const SUN_SU = [470, 250];
function hpPlate() {
  return big('s06:hp', () => {
    const [c, g] = lay();
    // close on the water: reflections of a day sky, the far bank blurred high in frame
    vgrad(g, 0, 0, W, 420, [[0, '#8aa0b8'], [1, '#d8c8a8']]);
    g.save(); g.filter = 'blur(10px)'; { const rr = prng(3); for (let i = 0; i < 14; i++) { g.fillStyle = mixHex('#3a5a3a', '#6a8a4a', rr()); g.beginPath(); g.ellipse(rr() * W, 380 + rr() * 40, 120 + rr() * 140, 80 + rr() * 50, 0, 0, 7); g.fill(); } } g.restore();
    vgrad(g, 0, 430, W, 650, [[0, '#a8b8a8'], [.3, '#5a7a72'], [1, '#1e3a3a']]);
    glints(g, 0, W, 432, 800, 650, { col: '#fff4dc', a: .45, seed: 71 });
    // stones on the bed, seen through clear water near the bottom
    { const rr = prng(4); for (let i = 0; i < 80; i++) { const y = 760 + rr() * 320, x = rr() * W; g.fillStyle = rgba(mixHex('#3a4a3a', '#6a6a52', rr()), .5); g.beginPath(); g.ellipse(x, y, 16 + rr() * 40, 8 + rr() * 16, rr(), 0, 7); g.fill(); } }
    return c;
  });
}
function tyre(ctx, x, y, ang, wet) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.scale(.7, .7); ctx.lineWidth = 64; ctx.strokeStyle = '#141416'; ctx.beginPath(); ctx.ellipse(0, 0, 210, 110, 0, 0, 7); ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(60,60,64,.9)'; for (let k = 0; k < 40; k++) { const a = k / 40 * 6.283; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 180, Math.sin(a) * 82); ctx.lineTo(Math.cos(a) * 240, Math.sin(a) * 138); ctx.stroke(); }
  ctx.lineWidth = 4; ctx.strokeStyle = rgba('#e8f0f0', .35 * wet); ctx.beginPath(); ctx.ellipse(0, -6, 226, 124, 0, 3.4, 5.9); ctx.stroke();
  ctx.restore();
}
function forearm(ctx, x0, y0, x1, y1, s = 1) {   // from the top edge down to a gripping hand
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = '#c47a2a'; ctx.lineWidth = 70 * s; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(mix(x0, x1, .55), mix(y0, y1, .55)); ctx.stroke();
  ctx.strokeStyle = '#e59a3a'; ctx.lineWidth = 58 * s; ctx.beginPath(); ctx.moveTo(x0 - 6, y0); ctx.lineTo(mix(x0, x1, .55) - 6, mix(y0, y1, .55)); ctx.stroke();
  ctx.strokeStyle = '#d9a77e'; ctx.lineWidth = 44 * s; ctx.beginPath(); ctx.moveTo(mix(x0, x1, .55), mix(y0, y1, .55)); ctx.lineTo(x1, y1); ctx.stroke();
  ctx.fillStyle = '#e9c3a0'; ctx.beginPath(); ctx.ellipse(x1, y1 + 8, 34 * s, 28 * s, Math.atan2(y1 - y0, x1 - x0), 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,240,220,.35)'; ctx.beginPath(); ctx.ellipse(x1 - 8, y1, 14 * s, 8 * s, .4, 0, 7); ctx.fill();
  ctx.restore();
}
export function hands(ctx, t, s, A) {
  const cam = { x: 960 + drift(t, 5, 1), y: 560 + drift(t, 4, 3), z: 1.06 + .04 * lin(s.a, s.b, t) };
  const act = A.help2 - .1, lift = eio(lin(act - .2, act + .6, t)), strain = Math.sin(t * 13) * 2 * (1 - lift) * lin(s.a, act - .2, t);
  const WL = 790, sc = 3.0, fx = 760, hip = 770;
  const PA = { lean: .75, head: .55, sh: [1.25, 1.05], el: [.25, .35], hip: [.3, -.2], kn: [.1, .3], hair: 'long' }, PB = { lean: .12, head: .1, sh: [.85, .65], el: [1.25, 1.35], hip: [.12, -.1], kn: [.05, .15], hair: 'long' };
  stage(ctx, [
    { c: hpPlate(), p: .85 },
    { p: 1, fn: (g) => {
      const F = figAnim('hp-you', 10, lift, sc, (q) => lerpPose(PA, PB, q), { dress: { coat: '#e59a3a', pants: '#2a2c3a', shoes: '#14100c', skin: '#e9c3a0', hair: '#3a2214' }, light: { dx: -300, dy: -500, col: '#ffe8c0', a: .55 }, rim: '#fff0c8', rimSide: -1, rimW: 3, shadeA: .1 });
      const [hx, hy] = F.hand(0), HX = fx + hx, HY = hip + hy + strain;
      // body above the water line, then the tyre in the hands, then the water veil over everything below the line
      g.save(); g.beginPath(); g.rect(0, -400, W, WL + 400); g.clip(); drawFig(g, F, fx, hip + strain, t, { breath: 1.2, feet: false }); g.restore();
      g.save(); g.beginPath(); g.rect(0, WL, W, H); g.clip(); g.globalAlpha = .35; drawFig(g, F, fx, hip + strain, t, { breath: 1.2, feet: false }); g.restore();
      tyre(g, HX + 150, HY + 70, -.1 + lift * .2, 1);
      g.save(); g.beginPath(); g.rect(0, WL, W, H); g.clip(); g.fillStyle = rgba('#2e5a5a', .55); g.fillRect(0, WL, W, H); glints(g, 0, W, WL, H, 260, { col: '#fff4dc', a: .4, seed: 77, t, wob: 1 }); g.restore();
      g.fillStyle = rgba('#e8f4f0', .5); g.fillRect(0, WL - 1, W, 2);
      if (lift > 0) for (let k = 0; k < 16; k++) { const x = HX + 20 + k * 18, y0 = HY + 110 + Math.sin(k) * 14, len = Math.max(0, WL - y0); g.strokeStyle = rgba('#e8f4f0', .5 * lift); g.lineWidth = 2; g.beginPath(); g.moveTo(x, y0); g.lineTo(x + Math.sin(t * 5 + k) * 3, y0 + len); g.stroke(); }
      for (let k = 0; k < 4; k++) { const v = ((t * .6 + k / 4) % 1); g.strokeStyle = rgba('#f0f6f0', .4 * (1 - v)); g.lineWidth = 2; g.beginPath(); g.ellipse(HX + 140, WL, 200 + v * 500, 16 + v * 50, 0, 0, 7); g.stroke(); }
      // the help: a small point, cyan while it shows the way, amber the moment you act; then it rises
      const amber = sm(lin(act - .05, act + .35, t)), rise = eio(lin(act + .55, s.b, t));
      const px = mix(HX + 380 + Math.sin(t * 2.2) * 14, SUN_SU[0], rise), py = mix(HY - 120 + Math.cos(t * 1.8) * 10, SUN_SU[1], rise);
      const col = mixHex(C.cyan, AMB, amber), core = mixHex(C.cyanWhite, '#fff1d0', amber);
      glowAt(g, px, py, 70 + 60 * amber + 200 * rise, .8, col, core); g.fillStyle = core; g.beginPath(); g.arc(px, py, 6 + 4 * amber + 10 * rise, 0, 7); g.fill();
      if (amber < .5) { g.strokeStyle = rgba(C.cyanWhite, .5 * (1 - amber * 2)); g.setLineDash([4, 7]); g.lineWidth = 1.6; g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(px - 100, py + 40, HX + 160, HY + 40); g.stroke(); g.setLineDash([]); }
    } },
  ], cam);
  vignetteL(ctx, .3); paper(ctx, .08, t);
}
// ================================================================ SU · years later: clear water, children jump
const SU_ROCK = [[-30, 560], [180, 540], [420, 560], [600, 600], [660, 640], [640, 700], [560, 760], [-30, 820]];
const SU_WL = 690;
function suPlate() {
  return big('s06:su', () => {
    const [c, g] = lay();
    vgrad(g, 0, 0, W, SU_WL, [[0, '#2a6a8a'], [.5, '#8ac0c8'], [.85, '#f0dca8'], [1, '#f8e6b8']]);
    { const [lc, lx] = lay(); const rg = lx.createRadialGradient(SUN_SU[0], SUN_SU[1], 0, SUN_SU[0], SUN_SU[1], 800); rg.addColorStop(0, rgba(CREAM, .95)); rg.addColorStop(.15, rgba(GOLD, .6)); rg.addColorStop(1, rgba(GOLD, 0)); lx.fillStyle = rg; lx.fillRect(0, 0, W, H); stipple(lc, { k: .2, seed: 3 }); g.globalCompositeOperation = 'screen'; g.drawImage(lc, 0, 0); g.globalCompositeOperation = 'source-over'; }
    g.fillStyle = CREAM; g.beginPath(); g.arc(SUN_SU[0], SUN_SU[1], 46, 0, 7); g.fill();
    // far bank: lush trees in gold light, a meadow
    hill(g, ridgeFn(560, 70, .002, 81), { col: '#6a8a4a', hc: '#f0e0a0', ha: .4, sun: SUN_SU, i: 6, bottom: SU_WL + 20 });
    { const rr = prng(82); for (let i = 0; i < 22; i++) tree(g, 700 + rr() * 1300, 620 + rr() * 50, 120 + rr() * 140, { dark: '#1e4a2a', lit: '#e0c060', rim: '#ffd27a', rimA: .7, sun: SUN_SU, seed: 600 + i, leaf: '#ffe8a0' }); }
    fogL(g, { y0: 560, y1: 720, col: '#f8e0b0', a: .3, seed: 83, cover: .7, soft: .5, k: .25, sx: .003, sy: .03 });
    // the water: clear blue-green, you can see the stones on the bed
    vgrad(g, 0, SU_WL, W, H - SU_WL, [[0, '#a8e0d0'], [.3, '#4ab0a8'], [1, '#14605e']]);
    { const rr = prng(84); for (let i = 0; i < 160; i++) { const y = SU_WL + 60 + Math.pow(rr(), .8) * 340, x = rr() * W, d = (y - SU_WL) / 390; g.fillStyle = rgba(mixHex('#2a6a5a', '#8ab890', rr()), .45); g.beginPath(); g.ellipse(x, y, 10 + 50 * d * rr(), 5 + 18 * d * rr(), 0, 0, 7); g.fill(); } }
    glints(g, 0, W, SU_WL + 4, H, 1100, { col: '#fffbe8', a: .6, seed: 85, lx: SUN_SU[0], lw: 500 });
    // the rock (left) the children jump from
    roughPoly(g, SU_ROCK, '#7a6a5a', { amp: 3, step: 10, seed: 86 });
    g.save(); g.beginPath(); roughPath(g, SU_ROCK, { amp: 3, step: 10, seed: 86 }); g.clip(); vgrad(g, 0, 540, 700, 300, [[0, rgba('#ffe0a0', .6)], [.3, rgba('#8a7a6a', .1)], [1, 'rgba(20,16,12,.5)']]); hatch(g, [-40, 560, 720, 280], { angle: .8, gap: 5, col: '#1a1410', a: .35, seed: 87, broken: .4 }); g.restore();
    roughLine(g, SU_ROCK.slice(0, 5), { w: 3, col: rgba('#fff0c0', .7), seed: 88 });
    return c;
  });
}
const KIDS = [
  { x: 330, s: .62, dress: { coat: '#e9c3a0', pants: '#2a6aa8', shoes: '#e9c3a0', skin: '#c9906a', hair: '#1a1010' }, hair: 'curly' },
  { x: 180, s: .55, dress: { coat: '#e9c3a0', pants: '#e85a3a', shoes: '#e9c3a0', skin: '#e9c3a0', hair: '#5a3a1a' }, hair: 'long' },
];
export function summer(ctx, t, s, A) {
  const tr = A.reason, tj = tr - .42;
  const rise = eio(lin(tr + .35, s.b, t));
  const cam = { x: 780 + drift(t, 6, 1), y: 600 + drift(t, 4, 2) - 140 * rise, z: 1.38 + .05 * rise };
  const hitX = 860, hitY = SU_WL + 50;
  stage(ctx, [
    { c: suPlate(), p: 1 },
    { p: 1, fn: (g) => {
      glints(g, 600, W, SU_WL + 10, H, 120, { col: '#ffffff', a: .55, seed: 90, t, wob: 1 });
      // kid on the rock, waving the other in
      const k1 = KIDS[1], F1 = fig('su-k1', k1.s, { lean: -.05, head: .1, sh: [Math.max(.3, 2.4 + Math.sin(t * 5) * .4), .2], el: [.2, .5], hip: [.05, -.05], kn: [0, .1], hair: k1.hair }, { dress: k1.dress, light: { dx: 300, dy: -400, col: '#ffe8b0', a: .5 }, rim: '#fff0c0', rimSide: -1 });
      drawFig(g, F1, k1.x, 548 - 88 * k1.s, t, { breath: 1.3 });
      // the jumper: run-up, leap, arc, into the water on "reason"
      const k0 = KIDS[0], j = lin(tj, tr, t);
      const pose = j <= 0 ? { lean: .25, head: .1, sh: [-.4, .6], el: [.6, .4], hip: [.4, -.35], kn: [.1, .5], hair: k0.hair } : j < .5 ? { lean: .3, head: .2, sh: [2.8, 2.6], el: [.2, .2], hip: [.6, -.5], kn: [1.2, .3], hair: k0.hair } : { lean: .9, head: .5, sh: [2.9, 2.8], el: [.1, .1], hip: [.5, .4], kn: [1.8, 1.7], hair: k0.hair };
      const key = j <= 0 ? 'r' : j < .5 ? 'a' : 'b';
      const F0 = fig('su-k0' + key, k0.s, pose, { dress: k0.dress, light: { dx: 300, dy: -400, col: '#ffe8b0', a: .5 }, rim: '#fff0c0', rimSide: -1 });
      const run = eio(lin(tj - .7, tj, t));
      if (t < tr) { const x = j <= 0 ? mix(k0.x, 590, run) : mix(590, hitX, j), y = j <= 0 ? 600 - 88 * k0.s : mix(600, hitY, j) - Math.sin(Math.PI * j) * 210 - 88 * k0.s; g.save(); g.translate(x, y + 88 * k0.s); g.rotate(j * .9); g.translate(-x, -(y + 88 * k0.s)); drawFig(g, F0, x, y, t, { breath: 1 }); g.restore(); }
      // the splash: a crown, then droplets thrown high (they carry on into the next shot)
      const u = lin(tr, tr + 1.4, t); splash(g, hitX, hitY, u, 2.2, '#ffffff', 13);
      if (t > tr) { const rr = prng(21); for (let i = 0; i < 34; i++) { const a = -Math.PI / 2 + (rr() - .5) * .9, sp = 900 + rr() * 900, tt = t - tr, px = hitX + Math.cos(a) * sp * tt * .35, py = hitY + Math.sin(a) * sp * tt * (1 - tt * .25); if (py > hitY) continue; const sz = 2 + rr() * 4; glowAt(g, px, py, sz * 5, .25 + .4 * lin(tr + .2, s.b, t), '#ffe0a0', '#ffffff'); g.fillStyle = rgba('#ffffff', .9); g.beginPath(); g.arc(px, py, sz, 0, 7); g.fill(); } }
      // a second child already in the water, laughing (arms up)
      const F2 = fig('su-k2', .5, { lean: 0, head: -.2, sh: [2.2, 2.4], el: [.4, .3], hip: [0, 0], kn: [0, 0], hair: 'bun' }, { dress: { coat: '#e9c3a0', pants: '#f0b040', skin: '#8a5a3a', hair: '#1a1010' }, rim: '#fff0c0', rimSide: -1, light: { dx: -300, dy: -300, col: '#ffe8b0', a: .5 } });
      g.save(); g.beginPath(); g.rect(0, 0, W, SU_WL + 112); g.clip(); drawFig(g, F2, 1260, SU_WL + 120 - 88 * .5 + Math.sin(t * 2) * 4, t, { breath: 1.4 }); g.restore();
      g.fillStyle = rgba('#4ab0a8', .7); g.beginPath(); g.ellipse(1260, SU_WL + 112, 40, 8, 0, 0, 7); g.fill();
      for (let k = 0; k < 3; k++) { const v = ((t * .5 + k / 3) % 1); g.strokeStyle = rgba('#ffffff', .5 * (1 - v)); g.lineWidth = 1.5; g.beginPath(); g.ellipse(1260, SU_WL + 112, 40 + v * 100, 8 + v * 16, 0, 0, 7); g.stroke(); }
    } },
  ], cam);
  tintAll(ctx, '#ffd27a', .08, 'soft-light'); vignetteL(ctx, .28, '#06140f'); paper(ctx, .08, t);
}
