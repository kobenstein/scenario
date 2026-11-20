// Film 8 · c02 (B1, local): the night shore of "what the singularity really is". One world in metres (s8 camera): a bay opening to +Z with
// the horizon light straight ahead (az LAZ), sand, dunes on both horns, the open-air cinema on the left beach, two beach houses on the right
// dune (Vinge's study, your room: their windows are portals into s8_desk rooms), the long pier toward the light, the headland with the lab,
// the forecast lines, the black heart, the self-building stair and the painted backdrop.
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, camera, projPoly, projRuns, fillPoly, mixHex, nz, eoX, eiX, sio, u01, hash } from './s8_kit.mjs';
import { skyDir, drawSky } from './s8_sky.mjs';
import { drawSea, waterY } from './s8_sea.mjs';
import { crowd, rows } from './s8_crowd.mjs';
import { backFig } from './s8_people.mjs';
import { room, texQuad, DESK } from './s8_desk.mjs';
import { label } from './s8_card.mjs';
import { layer } from './art.mjs';

export const LAZ = .02, LEL = .0025;
export const shoreZ = (x) => 9 + .02 * Math.min(x * x, 3600) + .25 * Math.sin(x * .21);
// ---------------------------------------------------------------- sand, foam, dunes
const DUNES = (() => { const r = prng(61), out = []; for (const side of [-1, 1]) for (let j = 0; j < 3; j++) { const pts = []; for (let i = 0; i <= 50; i++) { const x = side * (14 + i * 2.4 + j * 6), z = shoreZ(x) - 10 - j * 9 - 6 * Math.max(0, 1 - i / 8), h = (3 + j * 2.2) * (.6 + .4 * nz(i * .35 + j * 3, side + 5)) * clamp(i / 6); pts.push([x, h, z]); } out.push({ pts, j }); } return out; })();
export function beach(ctx, t, C, o = {}) {
  // dunes (far → near), dark indigo with a thin starlight rim
  for (const d of DUNES.slice().sort((a, b) => b.j - a.j)) {
    const P = projPoly(C, [...d.pts, ...d.pts.slice().reverse().map(([x, , z]) => [x, -.2, z])]);
    if (fillPoly(ctx, P, mixHex('#0b0a1a', '#141230', d.j * .25))) { for (const run of projRuns(C, d.pts)) { ctx.strokeStyle = rgba('#a4b0dc', .16); ctx.lineWidth = 1; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
  }
  // the sand: everything landward of the shoreline
  const wash = (x) => .35 * Math.sin(t * .7 + x * .13) + .2 * Math.sin(t * 1.3 + x * .31);
  const S = []; for (let i = 0; i <= 120; i++) { const x = -90 + i * 1.5; S.push([x, 0, shoreZ(x) + wash(x)]); }
  const P = projPoly(C, [...S, [90, 0, -120], [-90, 0, -120]]);
  if (fillPoly(ctx, P, '#121022')) {
    ctx.save(); fillPoly(ctx, P); ctx.clip();
    const g = ctx.createLinearGradient(0, C.hy, 0, 1080); g.addColorStop(0, 'rgba(40,36,70,.5)'); g.addColorStop(1, 'rgba(20,16,30,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    // ripples in the sand (engraved, starlit)
    ctx.strokeStyle = rgba('#a4b0dc', .07); ctx.lineWidth = 1;
    for (let k = 0; k < 30; k++) { const z = 7.5 - k * 1.3; const pts = []; for (let i = 0; i <= 30; i++) { const x = -40 + i * 2.7; pts.push([x, 0, Math.min(shoreZ(x) - 1, z + .3 * Math.sin(x * .7 + k))]); } for (const run of projRuns(C, pts)) { ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
    ctx.restore();
    // wet band + foam line
    for (const run of projRuns(C, S.map(([x, , z]) => [x, .01, z - .6]))) { ctx.strokeStyle = 'rgba(8,8,20,.5)'; ctx.lineWidth = 6; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
    for (const run of projRuns(C, S.map(([x, , z]) => [x, .02, z]))) { ctx.strokeStyle = rgba('#e9e6f6', .5 + .15 * Math.sin(t * 1.2)); ctx.lineWidth = 1.6; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  }
}

// ---------------------------------------------------------------- the open-air cinema (c02.02–c02.05)
export const CIN = (() => {
  const yaw = -1.3, f = [Math.sin(yaw), 0, Math.cos(yaw)], r = [Math.cos(yaw), 0, -Math.sin(yaw)], at = (x, y, z) => [x * r[0] + z * f[0], y, x * r[2] + z * f[2]];
  const ppl = rows({ n: 9, rows: 5, x0: -5, x1: 5, z0: 22, dz: -1.5, seed: 4 }).map((p) => { const w = at(p.x, 0, p.z); return { ...p, lx: p.x, lz: p.z, x: w[0], z: w[2] }; });
  const back = ppl.filter((p) => p.lz < 16.5).sort((a, b) => Math.abs(a.lx - 1.6) - Math.abs(b.lx - 1.6))[0];
  return { yaw, f, r, at, dist: 31, w: 11, h: 6.2, y0: 1.5, ppl, back, proj: at(2.6, 2.3, 12.5) };
})();
const SPARKS = (() => { const r = prng(71), s = []; for (let i = 0; i < 70; i++) s.push([r(), r(), .4 + r() * .6, r()]); return s; })();
const [SCRc, SCRg] = layer(480, 270);
function screenTex(t, s) {
  const g = SCRg, W = 480, H = 270; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over';
  const fl = .85 + .1 * Math.sin(t * 23) * Math.sin(t * 7.1) + .05 * Math.sin(t * 61);
  if (s.mode === 'off') { g.fillStyle = '#1a1a2c'; g.fillRect(0, 0, W, H); return; }
  if (s.mode === 'white') { const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * .7); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#e8eef8'); g.fillStyle = gr; g.fillRect(0, 0, W, H); return; }
  if (s.mode === 'red') {
    const gr = g.createRadialGradient(W * .5, H * .45, 0, W * .5, H * .5, W * .7); gr.addColorStop(0, '#ffd0a0'); gr.addColorStop(.25, '#ff4a26'); gr.addColorStop(1, '#5a0a0a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // searchlight sweeps: bright bands that swing across
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) { const a = Math.sin(t * (2.2 + i * .7) + i * 2) * .9, x = W * (.25 + .25 * i); g.save(); g.translate(x, H * 1.1); g.rotate(a); const bg = g.createLinearGradient(-30, 0, 30, 0); bg.addColorStop(0, 'rgba(255,220,180,0)'); bg.addColorStop(.5, 'rgba(255,230,200,.55)'); bg.addColorStop(1, 'rgba(255,220,180,0)'); g.fillStyle = bg; g.fillRect(-30, -H * 1.4, 60, H * 1.4); g.restore(); }
    // sparks falling from the top edge
    const age = t - (s.t0 ?? t);
    for (const [u, v, k, ph] of SPARKS) { const y = ((age * (120 + 140 * k) + v * 90) % (H + 20)) - 10, x = u * W + 8 * Math.sin(age * 3 + ph * 9); g.fillStyle = `rgba(255,${200 + 55 * k | 0},150,${.9 * k})`; g.fillRect(x, y, 2, 4 + 6 * k); }
    return;
  }
  // a film: warm flicker, soft moving forms (never an image of anything)
  const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, mixHex('#d8c8a8', '#a89878', .5 + .5 * Math.sin(t * .9))); gr.addColorStop(1, mixHex('#8a7a68', '#b8a888', .5 + .5 * Math.sin(t * 1.3))); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.globalAlpha = .25; g.fillStyle = '#4a3a30'; g.beginPath(); g.ellipse(W * (.4 + .1 * Math.sin(t * .5)), H * .6, W * .25, H * .3, 0, 0, TAU); g.fill(); g.globalAlpha = 1;
  g.fillStyle = `rgba(0,0,0,${.12 * (1 - fl)})`; g.fillRect(0, 0, W, H);
}
// s: { mode 'film'|'red'|'white'|'off', t0 (when the mode started), beam 0..1, flinch: t (the audience flinches at t), turn 0..1 (the back-row
//      person turns to the sea), shadows 0..1, glow 1 }  → { screen: 4 screen points, back: [sx, sy] the turning person's head }
export function cinema(ctx, t, C, s) {
  const { at, w, h, y0, dist } = CIN, sc = [at(-w / 2, y0 + h, dist), at(w / 2, y0 + h, dist), at(w / 2, y0, dist), at(-w / 2, y0, dist)], out = {};
  const col = s.mode === 'red' ? '#ff4a26' : s.mode === 'white' ? '#ffffff' : s.mode === 'off' ? '#2a2a40' : '#e8c890', I = s.mode === 'off' ? 0 : (s.glow ?? 1);
  // the posts and the frame
  for (const x of [-w / 2 - .15, w / 2 + .15]) for (const run of projRuns(C, [at(x, 0, dist + .05), at(x, y0 + h + .3, dist + .05)])) { ctx.strokeStyle = '#0a0812'; ctx.lineWidth = Math.max(2, run[0][2] * .2); ctx.beginPath(); ctx.moveTo(run[0][0], run[0][1]); ctx.lineTo(run[1][0], run[1][1]); ctx.stroke(); }
  // the glow of the screen on the sand in front of it
  const sp = C.P(...at(0, 0, dist - 3));
  if (sp && I > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = sp[2] * 14, g = ctx.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], r); g.addColorStop(0, rgba(col, .22 * I)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.save(); ctx.translate(sp[0], sp[1]); ctx.scale(1, .3); ctx.translate(-sp[0], -sp[1]); ctx.fillRect(sp[0] - r, sp[1] - r, 2 * r, 2 * r); ctx.restore(); ctx.restore(); }
  // the canvas
  screenTex(t, s);
  const PP = sc.map((p) => C.P(...p));
  if (PP.every(Boolean)) {
    texQuad(ctx, SCRc, 480, 270, (u, v) => { const p = [0, 1, 2].map((i) => (1 - v) * ((1 - u) * sc[0][i] + u * sc[1][i]) + v * ((1 - u) * sc[3][i] + u * sc[2][i])), q = C.P(...p); return q ? [q[0], q[1]] : null; }, 3);
    out.screen = PP;
    if (I > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const c = PP.reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4], [0, 0]), r = Math.abs(PP[1][0] - PP[0][0]) * 1.1, g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], r); g.addColorStop(0, rgba(col, .25 * I)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(c[0] - r, c[1] - r, 2 * r, 2 * r); ctx.restore(); }
  }
  // the long shadows (white blast): each person throws a shadow backward over the sand, away from the screen
  if ((s.shadows || 0) > 0) for (const p of CIN.ppl) {
    const L = 6 + 22 * s.shadows, a = at(p.lx - .25, .01, p.lz), b = at(p.lx + .25, .01, p.lz), c = at(p.lx + .5, .01, p.lz - L), d = at(p.lx - .5, .01, p.lz - L);
    fillPoly(ctx, projPoly(C, [a, b, c, d]), `rgba(4,3,10,${.75 * s.shadows})`);
  }
  // the projector beam (behind the audience, over their heads)
  const pj = C.P(...CIN.proj);
  if ((s.beam ?? 1) > 0 && PP.every(Boolean) && pj) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const B = projPoly(C, [CIN.proj, sc[0], sc[1], CIN.proj, sc[2], sc[3]]);
    const tri = (a, b) => { const P = projPoly(C, [CIN.proj, a, b]); if (P.length < 3) return; const g = ctx.createLinearGradient(pj[0], pj[1], (PP[0][0] + PP[2][0]) / 2, (PP[0][1] + PP[2][1]) / 2); g.addColorStop(0, rgba(s.mode === 'red' ? '#ff9a7a' : '#fff1d6', .14 * s.beam)); g.addColorStop(1, rgba(s.mode === 'red' ? '#ff4a26' : '#e8c890', .03 * s.beam)); fillPoly(ctx, P, g); };
    tri(sc[0], sc[1]); tri(sc[1], sc[2]); tri(sc[2], sc[3]); tri(sc[3], sc[0]);
    ctx.restore();
  }
  // the audience: rim from the screen, they flinch 80 ms after the red flare, one turns to the sea
  const L = C.P(...at(0, y0 + h / 2, dist)), fl = s.flinch != null ? clamp(Math.sin(clamp((t - s.flinch) / .35) * Math.PI)) : 0;
  const ppl = CIN.ppl.map((p) => ({ ...p, flinch: fl * (.6 + .4 * hash(p.seed)), turn: p === CIN.back ? s.turn || 0 : 0 }));
  const res = crowd(ctx, t, C, ppl, { light: at(0, y0 + h / 2, dist), lightCol: s.mode === 'red' ? '#ff6a40' : s.mode === 'white' ? '#ffffff' : s.mode === 'off' ? '#8a90c0' : '#ffcf8a', dim: s.mode === 'off' ? .5 : 0 });
  const bi = CIN.ppl.indexOf(CIN.back), hb = res.find((q) => q.i === bi); if (hb) out.back = hb.head;
  // the projector itself: a dark box on a tripod, the lens glowing
  if (pj) { const k = pj[2]; ctx.fillStyle = '#0c0a14'; ctx.fillRect(pj[0] - .25 * k, pj[1] - .12 * k, .5 * k, .3 * k); ctx.strokeStyle = '#0c0a14'; ctx.lineWidth = Math.max(1.5, .03 * k); ctx.beginPath(); ctx.moveTo(pj[0], pj[1] + .15 * k); ctx.lineTo(pj[0] - .3 * k, pj[1] + 2.3 * k); ctx.moveTo(pj[0], pj[1] + .15 * k); ctx.lineTo(pj[0] + .3 * k, pj[1] + 2.3 * k); ctx.stroke(); if ((s.beam ?? 1) > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(pj[0], pj[1], 0, pj[0], pj[1], .5 * k); g.addColorStop(0, rgba('#fff1d6', .8 * s.beam)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(pj[0] - .5 * k, pj[1] - .5 * k, k, k); ctx.restore(); } }
  return out;
}

// ---------------------------------------------------------------- beach houses on the right dune: portals into s8_desk rooms
// H: { x, y (floor height), z, face (yaw of the window's outward normal) }; desk coords → shore: O + R·(dx, dz), dy
export const HOUSES = {
  vinge: { x: 30, y: 4.2, z: 22, face: -2.2, kind: 'desk' },
  yours: { x: 20, y: 3.4, z: 13.5, face: -1.85, kind: 'oil' },
};
export const toShore = (H, p) => { const c = Math.cos(H.face), s = Math.sin(H.face); return [H.x + p[0] * c + p[2] * s, H.y + p[1], H.z - p[0] * s + p[2] * c]; };
export function deskCam(H, C) {   // the shore camera expressed in the house's desk coords
  const dx = C.x - H.x, dz = C.z - H.z, c = Math.cos(H.face), s = Math.sin(H.face);
  return camera({ x: dx * c - dz * s, y: C.y - H.y, z: dx * s + dz * c, yaw: C.yaw - H.face, pitch: C.pitch, F: C.F });
}
export function shoreCam(H, Cd) {   // a desk-coords camera expressed in shore coords
  const p = toShore(H, [Cd.x, Cd.y, Cd.z]);
  return camera({ x: p[0], y: p[1], z: p[2], yaw: Cd.yaw + H.face, pitch: Cd.pitch, F: Cd.F });
}
// the house seen from outside; the window shows the room (o.room: room() options); returns the window's screen polygon
export function house(ctx, t, C, H, o = {}) {
  const T = (x, y, z) => toShore(H, [x, y, z]), wz = DESK.wallZ + .02, X0 = -3, X1 = 3, Ht = 2.9, ZB = -3.2;
  // the dune mound under it
  { const m = []; for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI; m.push(T(-6 * Math.cos(a), -H.y + H.y * Math.sin(a) * 1.02, wz + 2 - 5 * Math.sin(a))); } const P = projPoly(C, m); if (fillPoly(ctx, P, '#0d0b1b')) { ctx.strokeStyle = rgba('#a4b0dc', .12); ctx.lineWidth = 1; ctx.stroke(); } }
  // side wall (the one we see) and roof
  const side = C.depth(...T(X0, 1, -1)) < C.depth(...T(X1, 1, -1)) ? X0 : X1;
  fillPoly(ctx, projPoly(C, [T(side, 0, wz), T(side, 0, ZB), T(side, Ht, ZB), T(side, Ht + 1.3, (wz + ZB) / 2), T(side, Ht, wz)]), '#100e1c');
  fillPoly(ctx, projPoly(C, [T(X0 - .3, Ht, wz + .3), T(X1 + .3, Ht, wz + .3), T(X1 + .3, Ht + 1.3, (wz + ZB) / 2), T(X0 - .3, Ht + 1.3, (wz + ZB) / 2)]), '#0a0814');
  // front wall with the window opening (even-odd)
  const FW = projPoly(C, [T(X0, 0, wz), T(X1, 0, wz), T(X1, Ht, wz), T(X0, Ht, wz)]), { x0, x1, y0, y1 } = DESK.win, WP = projPoly(C, [T(x0, y1, wz), T(x1, y1, wz), T(x1, y0, wz), T(x0, y0, wz)]);
  if (FW.length > 2) {
    ctx.save(); ctx.beginPath(); FW.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
    if (WP.length > 2) { WP.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); }
    ctx.fillStyle = '#16121f'; ctx.fill('evenodd');
    // planks, starlit
    ctx.clip('evenodd'); ctx.strokeStyle = rgba('#a4b0dc', .08); ctx.lineWidth = 1;
    for (let y = .3; y < Ht; y += .3) for (const run of projRuns(C, [T(X0, y, wz), T(X1, y, wz)])) { ctx.beginPath(); ctx.moveTo(run[0][0], run[0][1]); ctx.lineTo(run[run.length - 1][0], run[run.length - 1][1]); ctx.stroke(); }
    ctx.restore();
  }
  if (WP.length > 2) {
    // the room through the window (its own camera), the warm spill on the sill and the sand
    ctx.save(); fillPoly(ctx, WP); ctx.clip(); room(ctx, t, deskCam(H, C), { ...(o.room || {}), lampKind: H.kind }); ctx.restore();
    const c = WP.reduce((a, p) => [a[0] + p[0] / WP.length, a[1] + p[1] / WP.length], [0, 0]), k = C.P(...T(0, 1.4, wz))?.[2] ?? 30;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = 2.4 * k, g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], r); g.addColorStop(0, rgba('#ffb35c', .16)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(c[0] - r, c[1] - r, 2 * r, 2 * r); ctx.restore();
  }
  return WP;
}

// ---------------------------------------------------------------- the pier (c02.08, c02.12–c02.14)
export const PIER = { x: 3.5, z0: 6, z1: 72, y: 1.25, w: 1.6, marks: [['+1 YR', 22], ['+2', 32], ['+3', 42], ['+5', 54], ['+10', 68]] };
// o: { tear 0..1 (beyond +3: boards torn away, posts tilt and sink in spray), marks 0..1 (labels), figure: { z, lamp } | null, tSea }
export function pier(ctx, t, C, o = {}) {
  const { x, z0, z1, y, w } = PIER, tear = clamp(o.tear || 0), zt = 44, out = {};
  const gone = (z) => (z > zt ? clamp(tear * 1.6 - (z - zt) / (z1 - zt) * .6) : 0);
  // posts (pairs every 4 m), far → near
  const posts = []; for (let z = z0 + 2; z <= z1; z += 4) posts.push(z);
  const drawPost = (z, side) => {
    const g = gone(z), tilt = g * 1.3 * (side > 0 ? 1 : -.8), sink = eiX(clamp(g * 1.4 - .3)) * 4;
    const top = [x + side * w / 2 + Math.sin(tilt) * 1.6, y + .5 - sink + (Math.cos(tilt) - 1) * 1.6, z], bot = [x + side * w / 2, -1.5 - sink, z];
    for (const run of projRuns(C, [bot, top])) { ctx.strokeStyle = '#08070f'; ctx.lineWidth = Math.max(1.2, run[0][2] * .2); ctx.beginPath(); ctx.moveTo(run[0][0], run[0][1]); ctx.lineTo(run[run.length - 1][0], run[run.length - 1][1]); ctx.stroke(); ctx.strokeStyle = rgba('#a4b0dc', .2); ctx.lineWidth = 1; ctx.stroke(); }
    if (g > .05 && g < .95) { const p = C.P(x + side * w / 2, .2, z); if (p) { const r = prng(Math.floor(z * 10 + t * 12)); ctx.fillStyle = 'rgba(230,236,250,.7)'; for (let i = 0; i < 30; i++) { const a = r() * Math.PI, d = r() * p[2] * 1.6 * g; ctx.fillRect(p[0] + Math.cos(a) * d, p[1] - Math.sin(a) * d, 1.5, 1.5); } } }
  };
  for (const z of posts.slice().sort((a, b) => b - a)) { drawPost(z, -1); drawPost(z, 1); }
  // the deck: boards across, as one strip per 4 m (torn boards are missing)
  for (let z = z1; z > z0; z -= .5) {
    if (gone(z) > .3 + .5 * hash(z * 3)) continue;
    const P = projPoly(C, [[x - w / 2, y, z], [x + w / 2, y, z], [x + w / 2, y, z - .42], [x - w / 2, y, z - .42]]);
    if (fillPoly(ctx, P, '#191424')) { ctx.strokeStyle = rgba('#a4b0dc', .14); ctx.lineWidth = 1; ctx.stroke(); }
  }
  // the marker posts with their labels (small, cream)
  for (const [txt, z] of PIER.marks) {
    const g = gone(z), top = C.P(x + w / 2 + .1, y + 1.3 - g * 3, z); if (!top || g > .8) continue;
    const bot = C.P(x + w / 2 + .1, y, z); if (bot) { ctx.strokeStyle = '#0c0a14'; ctx.lineWidth = Math.max(1.5, top[2] * .12); ctx.beginPath(); ctx.moveTo(bot[0], bot[1]); ctx.lineTo(top[0], top[1]); ctx.stroke(); }
    if ((o.marks ?? 0) > 0) label(ctx, t, top[0], top[1], clamp((o.marks - (z - 22) / 80) * 1.5) * (1 - g), txt, '', { dx: 14, len: 26, size: Math.max(14, Math.min(26, top[2] * .9)) });
  }
  // the figure with the lantern
  if (o.figure) {
    const fz = o.figure.z, f = C.P(x + .2, y, fz);
    if (f && C.depth(x, y + 1, fz) > .5) {
      const s = f[2] * 1.75 / 178, ly = C.P(x + .45, y + .95, fz + .2);
      const lightS = ly ? { x: ly[0], y: ly[1], col: '#ffb35c', a: 1 } : undefined;
      backFig(ctx, t, f[0], f[1], s, { seed: 9, hold: 'none', light: lightS, dress: { coat: '#18141f', pants: '#0b0a14', skin: '#3a2a26', hair: '#0c0a12' }, accent: '#2a1e1a' });
      if (ly) { const r = Math.max(8, ly[2] * 1.2), fl = .9 + .1 * Math.sin(t * 9) * Math.sin(t * 5.3); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(ly[0], ly[1], 0, ly[0], ly[1], r); g.addColorStop(0, rgba('#fff1d6', .9 * fl)); g.addColorStop(.15, rgba('#ffb35c', .45)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(ly[0] - r, ly[1] - r, 2 * r, 2 * r); ctx.restore(); out.lantern = [ly[0], ly[1]]; }
      out.figure = [f[0], f[1] - f[2] * 1.75];
    }
  }
  return out;
}

// ---------------------------------------------------------------- the headland with the lab (c02.09)
export const LAB = { x: 72, z: 170, top: 21 };   // well right of the light (az ≈ .4)
const COINS = (() => { const r = prng(81), c = []; for (let i = 0; i < 90; i++) c.push([r(), r(), r()]); return c; })();
// o: { coins 0..1 (the stream runs), crowd 1 }
export function headland(ctx, t, C, o = {}) {
  const { x, z, top } = LAB, out = {};
  // the cliff mass: a ragged dark profile from the sea up to the plateau
  const prof = []; for (let i = 0; i <= 40; i++) { const u = i / 40, xx = x - 40 + u * 90; prof.push([xx, (top + .3) * clamp(Math.sin(Math.PI * clamp((u - .02) / .96)) * 2.2) * (.95 + .05 * nz(u * 9, 4)), z - 4 + 3 * Math.sin(u * 3)]); }
  fillPoly(ctx, projPoly(C, [...prof, [x + 50, -2, z + 10], [x - 40, -2, z]]), '#0b0a18');
  for (const run of projRuns(C, prof)) { ctx.strokeStyle = rgba('#a4b0dc', .18); ctx.lineWidth = 1; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  // the lab: a long glass front facing us, cool light inside, mullions, people at work
  const ly = top, L0 = [x - 9, ly, z - 2], L1 = [x + 9, ly, z - 2], gh = 4.2;
  const G = projPoly(C, [L0, L1, [L1[0], ly + gh, z - 2], [L0[0], ly + gh, z - 2]]);
  if (fillPoly(ctx, G, '#bfe8ff')) {
    ctx.save(); fillPoly(ctx, G); ctx.clip();
    const c = C.P(x, ly + 2, z - 2) || [G[0][0], G[0][1], 10], k = c[2]; const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 12 * k); g.addColorStop(0, '#e8f8ff'); g.addColorStop(.5, '#8fc8e8'); g.addColorStop(1, '#3a5a80'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    for (let i = 0; i <= 8; i++) { const a = C.P(x - 9 + i * 2.25, ly, z - 2), b = C.P(x - 9 + i * 2.25, ly + gh, z - 2); if (a && b) { ctx.strokeStyle = '#1a2a40'; ctx.lineWidth = Math.max(1, k * .08); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
    ctx.restore();
  }
  fillPoly(ctx, projPoly(C, [[x - 9.5, ly + gh, z - 2.3], [x + 9.5, ly + gh, z - 2.3], [x + 9.5, ly + gh + .5, z - 2.3], [x - 9.5, ly + gh + .5, z - 2.3]]), '#0a0a16');
  // the terrace: the builders stand before the glass facing the crowd (backlit silhouettes), the crowd faces them (their backs to us)
  const bld = [[-2.2, -3], [0, -3.4], [2.1, -3.1]].map(([dx, dz], i) => ({ x: x + dx, z: z + dz, h: 1.8, pose: 'stand', seed: 40 + i }));
  const pc = []; const r = prng(83); for (let i = 0; i < 34; i++) pc.push({ x: x - 7 + r() * 14 + .25 * Math.sin(t * 1.1 + i * 1.7), z: z - 7 - r() * 6, h: 1.6 + r() * .3, pose: 'stand', seed: 60 + i, raise: (i % 3 === 0) ? .45 + .45 * Math.sin(t * 3 + i) : (i % 3 === 1 ? .25 + .25 * Math.sin(t * 2.2 + i * .7) : 0) });
  // the chest at the lab door, and the coins: a stream from the crowd's raised hands into it
  const ch = C.P(x + 3.6, ly, z - 2.6);
  crowd(ctx, t, C, bld.map((b) => ({ ...b, y: ly })), { y: ly, light: [x, ly + 6, z + 10], lightCol: '#bfe8ff' });
  if (ch) { const k = ch[2]; ctx.fillStyle = '#2a1a0a'; ctx.fillRect(ch[0] - .5 * k, ch[1] - .55 * k, k, .55 * k); ctx.fillStyle = '#c99a3a'; ctx.fillRect(ch[0] - .5 * k, ch[1] - .58 * k, k, .08 * k); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(ch[0], ch[1] - .55 * k, 0, ch[0], ch[1] - .55 * k, 1.4 * k); g.addColorStop(0, rgba('#ffd27a', .6 * (o.coins ?? 0))); g.addColorStop(1, rgba('#ffd27a', 0)); ctx.fillStyle = g; ctx.fillRect(ch[0] - 1.4 * k, ch[1] - 2 * k, 2.8 * k, 2.8 * k); ctx.restore(); out.chest = ch; }
  const hands = crowd(ctx, t, C, pc.map((p) => ({ ...p })), { y: ly, light: [x, ly + 3, z - 2], lightCol: '#bfe8ff' });
  if ((o.coins ?? 0) > 0 && ch && hands.length) {
    const cu = clamp(o.coins);
    for (const [a, b, c] of COINS) {
      const hnd = hands[Math.floor(a * hands.length)].hand, ph = (t * (.5 + .3 * c) + b) % 1; if (ph > cu) continue;
      const X = hnd[0] + (ch[0] - hnd[0]) * ph, Y = hnd[1] + (ch[1] - .6 * ch[2] - hnd[1]) * ph - Math.sin(Math.PI * ph) * ch[2] * 2.5;
      const s = Math.max(1.5, ch[2] * .08), spin = Math.abs(Math.sin(t * 9 + c * 20));
      ctx.fillStyle = '#ffd27a'; ctx.beginPath(); ctx.ellipse(X, Y, s * (.3 + .7 * spin), s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,248,220,.8)'; ctx.fillRect(X - s * .2, Y - s * .5, s * .3, s * .3);
    }
  }
  return out;
}

// ---------------------------------------------------------------- the forecast lines (c02.07)
// dotted cream lines from points on the shore toward the light; each bends round the ring and ends on it. u 0..1 (drawn), L light, th ring px
export function forecasts(ctx, t, C, L, th, u, starts) {
  if (!L || u <= 0) return;
  ctx.save(); ctx.setLineDash([3, 8]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba('#f3ecda', .9); ctx.lineWidth = 2.4;
  const N0 = starts.length;
  for (let i = 0; i < N0; i++) {
    const v = clamp(u * 1.4 - i * .06); if (v <= 0) continue;
    const s = C.P(starts[i][0], .1, starts[i][1]); if (!s) continue;
    const side = i < N0 / 2 ? -1 : 1, a0 = Math.PI + side * (.25 + .12 * Math.abs(i - N0 / 2)), end = [L.x + Math.cos(a0 + Math.PI) * th * 1.02 * -1, L.y - Math.abs(Math.sin(a0)) * th * 1.02];
    const cpx = (s[0] + end[0]) / 2 + side * 80, cpy = Math.min(s[1], end[1]) - 120 - 30 * (i % 3);
    const N = 40, pts = []; for (let j = 0; j <= N; j++) { const q = j / N; pts.push([(1 - q) * (1 - q) * s[0] + 2 * (1 - q) * q * cpx + q * q * end[0], (1 - q) * (1 - q) * s[1] + 2 * (1 - q) * q * cpy + q * q * end[1]]); }
    // bend round the ring
    const aE = Math.atan2(end[1] - L.y, end[0] - L.x), sweep = -side * .7; for (let j = 1; j <= 12; j++) { const a = aE + sweep * j / 12; pts.push([L.x + Math.cos(a) * th * 1.02, L.y + Math.sin(a) * th * 1.02]); }
    const n = Math.max(2, Math.floor(pts.length * eoX(v)));
    ctx.lineDashOffset = -t * 18; ctx.beginPath(); pts.slice(0, n).forEach((p, j) => (j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the black heart (c02.07 accent): a disc of black with a photon ring
export function heart(ctx, t, L, R, a = 1) {
  if (!L || R < 2) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'lighter';
  for (const [w, al, c] of [[R * .35, .06, '#8fe6ff'], [R * .12, .16, '#bfefff'], [Math.max(1.5, R * .025), .9, '#eefcff']]) { ctx.strokeStyle = rgba(c, al * a); ctx.lineWidth = w; ctx.beginPath(); ctx.arc(L.x, L.y, R * 1.06, 0, TAU); ctx.stroke(); }
  // bent starlight arcs (thin, round the ring)
  const r = prng(17); for (let i = 0; i < 26; i++) { const rr = R * (1.15 + r() * .9), a0 = r() * TAU, sw = .2 + r() * .6; ctx.strokeStyle = rgba('#d8f7ff', (.15 + .3 * r()) * a); ctx.lineWidth = 1 + r(); ctx.beginPath(); ctx.arc(L.x, L.y, rr, a0 + t * .05, a0 + sw + t * .05); ctx.stroke(); }
  ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, R); g.addColorStop(0, '#010104'); g.addColorStop(.85, '#02030a'); g.addColorStop(1, 'rgba(3,4,12,.0)');
  ctx.fillStyle = g; ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(L.x, L.y, R, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- the stair of light above the horizon light (c02.10) and the backdrop
const SD = 2600;   // the stair's distance (m)
export const stairBase = () => { const d = skyDir(LAZ, 0); return [d[0] * SD, 0, d[2] * SD]; };
const STEPS = 34, SR = 150, RISE = 24;
export function stepPos(i) { const B = stairBase(), a = i * .42; return [B[0] + Math.sin(a) * SR, 6 + i * RISE, B[2] + Math.cos(a) * SR * .6]; }
// o: { built 0..STEPS (solid steps), dotted (how many dotted outline steps above), climb (the light's step, float) } → { light: [sx, sy] }
export function stair(ctx, t, C, o = {}) {
  const built = o.built ?? 0, dot = o.dotted ?? 0;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i = 0; i < Math.min(STEPS, Math.ceil(built) + dot); i++) {
    const solid = i < built, a = i * .42, p = stepPos(i), q = [p[0] + Math.cos(a) * 60, p[1], p[2] - Math.sin(a) * 36], r0 = [p[0], p[1] - RISE, p[2]];
    const A = C.P(...p), B = C.P(...q), R0 = C.P(...r0); if (!A || !B) continue;
    const grow = solid ? clamp(built - i) : 1;
    if (solid) { for (const [w, al] of [[12, .08], [4, .3], [1.8, .95]]) { ctx.strokeStyle = rgba(w < 2 ? '#eefcff' : '#8fe6ff', al * grow); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(A[0] + (B[0] - A[0]) * grow, A[1] + (B[1] - A[1]) * grow); if (R0) { ctx.moveTo(A[0], A[1]); ctx.lineTo(R0[0], R0[1]); } ctx.stroke(); } }
    else { ctx.setLineDash([2, 6]); ctx.strokeStyle = rgba('#bfefff', .45); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); if (R0) { ctx.moveTo(A[0], A[1]); ctx.lineTo(R0[0], R0[1]); } ctx.stroke(); ctx.setLineDash([]); }
  }
  ctx.restore();
  const c = o.climb ?? 0, i0 = Math.floor(c), f = c - i0, p0 = stepPos(i0), p1 = stepPos(i0 + 1), P = c <= 0 ? null : C.P(p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f + Math.sin(Math.PI * f) * RISE * .4, p0[2] + (p1[2] - p0[2]) * f);
  return { light: P ? [P[0], P[1]] : null };
}
// the backdrop: a canvas on a wooden frame standing far out on the sea in front of the stair. Its corners in world space
export const BD = (() => { const B = stairBase(), d = skyDir(LAZ, 0), r = [d[2], 0, -d[0]], D = 1500, c = [d[0] * D, 0, d[2] * D], w = 1100, h = 700; const at = (u, v) => [c[0] + r[0] * (u - .5) * w, h * (1 - v), c[2] + r[2] * (u - .5) * w]; return { at, c, w, h, r, d }; })();

// ---------------------------------------------------------------- the big swell (c02.12–c02.14): long crests rolling in toward the shore
// o: { A (m, crest height), tS (sea time: warp it to make the swell race), speed 6 (m/s), gap 14 (m between crests), z0 12, z1 160 }
export function swell(ctx, t, C, o = {}) {
  const A = o.A ?? 0; if (A <= .01) return;
  const sp = o.speed ?? 6, gap = o.gap ?? 14, z0 = o.z0 ?? 12, z1 = o.z1 ?? 160, ts = o.tS ?? t, off = (ts * sp) % gap, rows = [];
  for (let Z = z1 - (gap - off); Z > z0; Z -= gap) rows.push(Z);
  for (const Zc of rows) {   // far → near
    const fade = clamp((Zc - z0) / 10) * clamp((z1 - Zc) / 30), h = A * fade; if (h < .02) continue;
    const crest = [], back = [];
    for (let i = 0; i <= 60; i++) { const x = -70 + i * 140 / 60, wob = .6 * Math.sin(x * .09 + Zc * .2 + ts * .3); if (Zc + wob < shoreZ(x) + 1) continue; crest.push([x, h * (.85 + .15 * Math.sin(x * .13 + Zc)), Zc + wob]); back.push([x, 0, Zc + wob + h * 3.2]); }
    if (crest.length < 2) continue;
    const P = projPoly(C, [...crest, ...back.slice().reverse()]);
    if (fillPoly(ctx, P, '#0e0d2a')) {
      const F = projPoly(C, [...crest, ...crest.slice().reverse().map(([x, , z]) => [x, 0, z - h * 1.6])]); fillPoly(ctx, F, '#05050f');   // the steep front face, dark
      for (const run of projRuns(C, crest)) { ctx.strokeStyle = rgba('#c8d2f0', .55 * fade); ctx.lineWidth = clamp(run[0][2] * .004, 1, 3); ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
    }
  }
}
