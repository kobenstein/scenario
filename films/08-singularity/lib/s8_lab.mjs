// Film 8 · 1.02 the lab at night: a glass wall on a cliff over the sea (Z = 0), four people standing at the glass with their backs to us,
// looking out at the horizon light; desks, a laptop's back, a whiteboard with diagrams, dark ceiling lights. Lab floor at Y = FLOOR.
//   drawLab(ctx, t, C, o)   o: { L (light on screen), lightA (0..1 rim strength), pulse 0..1, turn 0..1 (one head turns), K }
// Everything is projected through the camera; the camera starts OUTSIDE the glass (only sea and sky) and pulls back through it.
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projPoly, fillPoly, mixHex, hash } from './s8_kit.mjs';
import { backFig } from './s8_people.mjs';

export const FLOOR = 12, CEIL = 15.3, WALLX = 6.2, BACKZ = -9;
const PEOPLE = [
  { x: -2.35, z: -1.05, h: 1.74, seed: 3, dress: { coat: '#0f0f1d', pants: '#08080f', hair: '#07060a', skin: '#2a1c18', shoes: '#050508' }, accent: '#121222' },
  { x: -.78, z: -1.45, h: 1.82, seed: 5, dress: { coat: '#12121f', pants: '#09090f', hair: '#100b09', skin: '#2e1e18', shoes: '#050508' }, accent: '#161626', turn: true },
  { x: .66, z: -.95, h: 1.66, seed: 7, dress: { coat: '#141224', pants: '#09080f', hair: '#09070a', skin: '#33231c', shoes: '#050508' }, accent: '#1a1628' },
  { x: 2.1, z: -1.3, h: 1.78, seed: 11, dress: { coat: '#10111e', pants: '#08080e', hair: '#0c0908', skin: '#2a1c16', shoes: '#050508' }, accent: '#141526' },
];
const MULL = [-4.6, -1.55, 1.55, 4.6];
export const labPeople = PEOPLE;

function quad(C, a, b, c, d) { return projPoly(C, [a, b, c, d]); }
export function drawLab(ctx, t, C, o = {}) {
  const L = o.L, la = o.lightA ?? 1, pu = o.pulse || 0;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the glass: a faint sheen and a cool reflection band (it is there, but you look through it)
  const G = quad(C, [-WALLX, FLOOR + .12, 0], [WALLX, FLOOR + .12, 0], [WALLX, CEIL - .2, 0], [-WALLX, CEIL - .2, 0]);
  if (G.length > 2 && C.z < -.02) {
    ctx.save(); fillPoly(ctx, G); ctx.clip();
    const xs = G.map((p) => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs), sg = ctx.createLinearGradient(x0, 0, x1, 0);
    sg.addColorStop(0, 'rgba(150,180,230,.0)'); sg.addColorStop(.3 + .02 * Math.sin(t * .3), 'rgba(150,180,230,.05)'); sg.addColorStop(.36 + .02 * Math.sin(t * .3), 'rgba(150,180,230,0)'); sg.addColorStop(.7, 'rgba(150,180,230,.03)'); sg.addColorStop(1, 'rgba(150,180,230,0)');
    ctx.fillStyle = sg; ctx.fillRect(x0, 0, x1 - x0, 1080); ctx.restore();
  }
  // floor (polished, dark), the light's long reflection on it, the window's shadow bars
  const FL = quad(C, [-WALLX, FLOOR, 0], [WALLX, FLOOR, 0], [WALLX, FLOOR, BACKZ], [-WALLX, FLOOR, BACKZ]);
  if (fillPoly(ctx, FL)) {
    const pN = C.P(0, FLOOR, -.3), pF = C.P(0, FLOOR, BACKZ + 1);
    const g = ctx.createLinearGradient(0, pN ? pN[1] : 0, 0, pF ? pF[1] : 1080);
    g.addColorStop(0, '#12122a'); g.addColorStop(1, '#07070f'); ctx.fillStyle = g; ctx.fill();
    ctx.save(); fillPoly(ctx, FL); ctx.clip();
    if (L) {   // the light's reflection: a long cool streak toward us on the polished floor
      const a = C.P(L.wx ?? .3, FLOOR, -.15), b = C.P(L.wx2 ?? .9, FLOOR, BACKZ);
      if (a && b) { ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); lg.addColorStop(0, rgba('#8fe6ff', .16 * la * (1 + pu))); lg.addColorStop(1, rgba('#8fe6ff', 0));
        ctx.strokeStyle = lg; ctx.lineWidth = Math.max(2, (a[1] - (C.hy)) * .05); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.globalCompositeOperation = 'source-over'; }
    }
    // floor seams (engraved), receding
    ctx.strokeStyle = 'rgba(120,130,190,.07)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let z = -1; z > BACKZ; z -= 1.2) { const a = C.P(-WALLX, FLOOR, z), b = C.P(WALLX, FLOOR, z); if (a && b) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } }
    ctx.stroke(); ctx.restore();
  }
  // ceiling with two rows of dark linear lights (switched off: the room is lit only from outside)
  const CE = quad(C, [-WALLX, CEIL, 0], [WALLX, CEIL, 0], [WALLX, CEIL, BACKZ], [-WALLX, CEIL, BACKZ]);
  if (fillPoly(ctx, CE, '#0a0a18')) {
    ctx.save(); fillPoly(ctx, CE); ctx.clip();
    for (const X of [-2.6, 2.6]) for (let z = -.8; z > BACKZ; z -= 2.6) { const P = quad(C, [X - .9, CEIL - .01, z], [X + .9, CEIL - .01, z], [X + .9, CEIL - .01, z - .25], [X - .9, CEIL - .01, z - .25]); fillPoly(ctx, P, '#1c1e36'); }
    ctx.restore();
  }
  // side walls (left: a whiteboard with diagrams; right: dark panels)
  for (const sx of [-1, 1]) {
    const X = sx * WALLX, P = quad(C, [X, FLOOR, 0], [X, CEIL, 0], [X, CEIL, BACKZ], [X, FLOOR, BACKZ]);
    if (fillPoly(ctx, P, sx < 0 ? '#0d0d1e' : '#0b0b19')) {
      ctx.save(); fillPoly(ctx, P); ctx.clip();
      if (L) { const a = C.P(X, FLOOR + 1.8, -.2); if (a) { const g = ctx.createRadialGradient(a[0], a[1], 0, a[0], a[1], 600); g.addColorStop(0, rgba('#6fa0d8', .1 * la)); g.addColorStop(1, rgba('#6fa0d8', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); } }
      if (sx < 0) whiteboard(ctx, t, C, X + .02);
      ctx.restore();
    }
  }
  // mullions and sill (the window's frame, black against the night)
  ctx.fillStyle = '#04040a';
  for (const X of MULL) fillPoly(ctx, quad(C, [X - .05, FLOOR, .02], [X + .05, FLOOR, .02], [X + .05, CEIL, .02], [X - .05, CEIL, .02]), '#05050c');
  fillPoly(ctx, quad(C, [-WALLX, FLOOR, .02], [WALLX, FLOOR, .02], [WALLX, FLOOR + .14, .02], [-WALLX, FLOOR + .14, .02]), '#05050c');
  fillPoly(ctx, quad(C, [-WALLX, CEIL - .22, .02], [WALLX, CEIL - .22, .02], [WALLX, CEIL, .02], [-WALLX, CEIL, .02]), '#05050c');
  // the cool edge light on the mullions facing the room
  if (L) { ctx.strokeStyle = rgba('#8fb8e8', .22 * la); ctx.lineWidth = 1.2; ctx.beginPath(); for (const X of MULL) { const a = C.P(X - .05, FLOOR + .14, -.02), b = C.P(X - .05, CEIL - .22, -.02); if (a && b) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } } ctx.stroke(); }
  // a desk near the back right with a laptop seen from behind (its screen faces the glass; the spill lights the desk)
  desk(ctx, t, C, 3.3, -4.6);
  desk(ctx, t, C, -3.6, -5.6);
  // the people, far to near
  const order = PEOPLE.map((P, i) => [P, i]).sort((a, b) => a[0].z - b[0].z);
  for (const [P] of order) {
    if (C.depth(P.x, FLOOR + .9, P.z) < .25) continue;
    const f = C.P(P.x, FLOOR, P.z); if (!f) continue;
    const s = f[2] * P.h / 178;
    const turn = P.turn ? (o.turn || 0) : 0;
    backFig(ctx, t, f[0], f[1], s, { seed: P.seed, dress: P.dress, accent: P.accent, hold: 'none', headTilt: -.08 - .04 * turn, light: L ? { x: L.x + turn * 400, y: L.y, col: '#bfe8ff', a: Math.min(1, (.5 + .45 * pu) * la) } : undefined, rimFloor: 95, shade: .25 });
  }
  workbench(ctx, t, C, -.2, -3.9);
  ctx.restore();
}
function desk(ctx, t, C, X, Z) {
  const y = FLOOR + .74, w = 1.5, d = .75;
  const top = projPoly(C, [[X - w / 2, y, Z + d / 2], [X + w / 2, y, Z + d / 2], [X + w / 2, y, Z - d / 2], [X - w / 2, y, Z - d / 2]]);
  if (top.length < 3) return;
  // legs
  ctx.strokeStyle = '#05050b'; ctx.lineWidth = 3;
  for (const [dx, dz] of [[-.7, .33], [.7, .33], [-.7, -.33], [.7, -.33]]) { const a = C.P(X + dx, FLOOR, Z + dz), b = C.P(X + dx, y, Z + dz); if (a && b) { ctx.lineWidth = Math.max(1.5, a[2] * .04); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
  fillPoly(ctx, top, '#141428');
  // the laptop: base + lid, the lid's back toward us; the screen's cool spill on the desk in front of it
  const lb = projPoly(C, [[X - .2, y + .01, Z + .05], [X + .2, y + .01, Z + .05], [X + .2, y + .01, Z - .22], [X - .2, y + .01, Z - .22]]);
  const sp = C.P(X, y + .02, Z + .12);
  if (sp) { ctx.save(); fillPoly(ctx, top); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], sp[2] * .55); g.addColorStop(0, rgba('#8fd8ff', .22 + .03 * Math.sin(t * 3.1))); g.addColorStop(1, rgba('#8fd8ff', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); }
  fillPoly(ctx, lb, '#1e2038');
  const lid = projPoly(C, [[X - .2, y + .01, Z + .05], [X + .2, y + .01, Z + .05], [X + .2, y + .27, Z + .11], [X - .2, y + .27, Z + .11]]);
  fillPoly(ctx, lid, '#2a2c46');
  if (lid.length > 2) { ctx.strokeStyle = rgba('#8fd8ff', .35); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lid[2][0], lid[2][1]); ctx.lineTo(lid[3][0], lid[3][1]); ctx.stroke(); }
}
// the long bench between us and the people: two monitors facing us (cool graphs and lines of work, dim), a lamp switched off, cables
function workbench(ctx, t, C, X, Z) {
  const y = FLOOR + .76, w = 3.4, d = .8;
  if (C.depth(X, y, Z) < .3) return;
  const top = projPoly(C, [[X - w / 2, y, Z + d / 2], [X + w / 2, y, Z + d / 2], [X + w / 2, y, Z - d / 2], [X - w / 2, y, Z - d / 2]]);
  const front = projPoly(C, [[X - w / 2, y, Z - d / 2], [X + w / 2, y, Z - d / 2], [X + w / 2, FLOOR + .02, Z - d / 2], [X - w / 2, FLOOR + .02, Z - d / 2]]);
  fillPoly(ctx, front, '#07070f'); fillPoly(ctx, top, '#161630');
  for (const [mx, tilt] of [[-.75, .2], [.7, -.15]]) {
    const cx = X + mx, cz = Z + .1, hw = .34, my0 = y + .16, my1 = y + .56, dx = Math.sin(tilt) * hw, dz = Math.cos(tilt) * hw * .3;
    const st = projPoly(C, [[cx - .03, y, cz], [cx + .03, y, cz], [cx + .03, my0 + .05, cz], [cx - .03, my0 + .05, cz]]); fillPoly(ctx, st, '#0a0a14');
    const P = projPoly(C, [[cx - hw, my0, cz + dz], [cx + hw, my0, cz - dz], [cx + hw, my1, cz - dz], [cx - hw, my1, cz + dz]]);
    if (P.length !== 4) continue;
    fillPoly(ctx, P, '#05060e');
    // the screen: inset, dark glass with cool lines (a curve, bars, lines of text as strokes) — never readable, never code rain
    const ins = (u, v) => { const a = P[0], b = P[1], c = P[2], e = P[3]; const tx = a[0] + (b[0] - a[0]) * u, ty = a[1] + (b[1] - a[1]) * u, bx = e[0] + (c[0] - e[0]) * u, by = e[1] + (c[1] - e[1]) * u; return [tx + (bx - tx) * v, ty + (by - ty) * v]; };
    const S = [ins(.04, .06), ins(.96, .06), ins(.96, .94), ins(.04, .94)]; fillPoly(ctx, S, '#0b1630');
    ctx.save(); fillPoly(ctx, S); ctx.clip(); ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(143,214,255,.5)'; ctx.lineWidth = 1.2; ctx.beginPath();
    if (mx < 0) { for (let i = 0; i <= 24; i++) { const u = i / 24, v = .85 - .7 * (Math.exp(u * 2.6) - 1) / (Math.exp(2.6) - 1) + .02 * Math.sin(u * 30 + t * 2); const p = ins(.08 + u * .84, v); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } }
    else { for (let i = 0; i < 7; i++) { const v = .14 + i * .11, L = .3 + .5 * hash(i * 3.1 + 1) * (i === 6 ? (.5 + .5 * Math.sin(t * 1.3)) : 1); const a = ins(.1, v), b = ins(.1 + L * .8, v); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } }
    ctx.stroke();
    const gl = ctx.createLinearGradient(S[0][0], S[0][1], S[2][0], S[2][1]); gl.addColorStop(0, 'rgba(216,247,255,.06)'); gl.addColorStop(1, 'rgba(216,247,255,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, 1920, 1080);
    ctx.restore();
    // spill on the bench
    const sp = C.P(cx, y + .01, cz - .25); if (sp) { ctx.save(); fillPoly(ctx, top); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], sp[2] * .6); g.addColorStop(0, 'rgba(110,180,240,.16)'); g.addColorStop(1, 'rgba(110,180,240,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); }
  }
  if (top.length > 2) { ctx.strokeStyle = 'rgba(150,170,220,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(top[3][0], top[3][1]); ctx.lineTo(top[2][0], top[2][1]); ctx.stroke(); }
}
// diagrams on the whiteboard (boxes, arrows, a curve going up): scribbled, unreadable, but clearly "people building something"
const WB = (() => { const r = prng(91), a = []; for (let i = 0; i < 7; i++) a.push({ z: -2.2 - i * .55 - r() * .2, y: FLOOR + 1.1 + r() * 1.1, w: .25 + r() * .3, h: .14 + r() * .12 }); return a; })();
function whiteboard(ctx, t, C, X) {
  const z0 = -1.6, z1 = -6.2, y0 = FLOOR + .95, y1 = FLOOR + 2.35;
  const P = projPoly(C, [[X, y0, z0], [X, y1, z0], [X, y1, z1], [X, y0, z1]]);
  if (!fillPoly(ctx, P, '#2b2d44')) return;
  ctx.save(); fillPoly(ctx, P); ctx.clip();
  ctx.strokeStyle = 'rgba(12,14,30,.75)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.beginPath();
  for (const B of WB) { const q = projPoly(C, [[X, B.y, B.z], [X, B.y + B.h, B.z], [X, B.y + B.h, B.z - B.w], [X, B.y, B.z - B.w]]); if (q.length === 4) { ctx.moveTo(q[0][0], q[0][1]); for (const p of q.slice(1)) ctx.lineTo(p[0], p[1]); ctx.closePath(); } }
  for (let i = 0; i + 1 < WB.length; i++) { const a = C.P(X, WB[i].y + WB[i].h / 2, WB[i].z - WB[i].w), b = C.P(X, WB[i + 1].y + WB[i + 1].h / 2, WB[i + 1].z); if (a && b) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } }
  // an exponential curve
  let first = true; for (let u = 0; u <= 1.001; u += .05) { const p = C.P(X, FLOOR + 1.05 + .9 * (Math.exp(u * 3.2) - 1) / (Math.exp(3.2) - 1), -4.9 - u * 1.1); if (p) { first ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); first = false; } }
  ctx.stroke(); ctx.restore();
}
