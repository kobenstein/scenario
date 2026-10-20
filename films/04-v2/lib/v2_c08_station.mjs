// C08 · the station (8.11–8.14): an iron-and-glass train shed at dusk next to the hall. A commuter (back view) caught mid-stride for
// the train relaxes into standing as the station clock's hands slow and stop; the train leaves; he stands alone before the big
// dark screen at the platform's end and sees himself in it (a silhouette, the work badge on its lanyard; the title line goes up
// as dotted smoke on "job"); the screen lights with clip S, goes dark, and the camera is in its glass (the glass plate).
import { W, H, rgba, clamp, mix, prng, memo, hash, TAU, seg, sio, eo3, text, canvas } from './v2_c08_core.mjs';
import { rgb, css, lerpC, mulC, fillS, pathS, poolOn, linOn, boxVis, distOf, glowAt, onScreen, bboxS, line3, skyFill } from './v2_c08_space.mjs';
import { capsule } from './figure.mjs';
import { scribble } from './paper.mjs';

export const ST = {
  sx: 34, py: 1.0, xh: 36.2, zp: 20, zs: 22.4,                                  // platform edge X = sx − 2; the person at (xh, zp); screen plane z
  scr: { x0: 32.8, x1: 37.2, y0: 1.75, y1: 4.225 },                             // the big screen (16:9, 4.4 m)
  lamp: [36.0, 5.2, 19.4], clock: [35.0, 6.15, 21.55, .62],
  vault: { cx: 30, half: 10, y0: 9, ridge: 15.5, z0: -40, z1: 30, vent: .05 },
  train: { x0: 28.45, x1: 31.55, y0: .55, y1: 3.95, front: 25.4, len: 36 },
};
const C = {
  plat: rgb('#262a4c'), platLit: rgb('#7a5a48'), edge: rgb('#c9b48a'), bed: rgb('#0e0f20'), rail: rgb('#7c7f9c'),
  wall: rgb('#1d1f3e'), stone: rgb('#2a2a48'), iron: rgb('#0b0c1c'), glassZ: rgb('#1d275a'), glassM: rgb('#3a3f7c'), glassW: rgb('#9a6e7c'),
  carr: rgb('#1d3a3a'), carrLit: rgb('#2e5552'), win: rgb('#ffd9a0'), winDim: rgb('#c99a62'), lamp: rgb('#ffbe72'), core: rgb('#fff1d6'),
  fog: rgb('#24264a'),
};
const fogK = (d) => .55 * (1 - Math.exp(-d / 45));
const fogC = (c, d) => lerpC(c, C.fog, fogK(d));
// the warm pool of the hero lamp + the dimmer platform lamps
const LAMPS = [[36.0, 5.2, 19.4, 1], [35.6, 5.4, 10.5, .55], [35.6, 5.4, 1.5, .5], [35.6, 5.4, -7.5, .45], [35.6, 5.4, -16.5, .4], [24.8, 5.4, 14, .35], [24.8, 5.4, 2, .3]];

// ---------------------------------------------------------------- the shed: vault (inside), walls, platforms, track
function vaultIn(ctx, cam) {
  const V = ST.vault, R = (V.half * V.half + (V.ridge - V.y0) ** 2) / (2 * (V.ridge - V.y0)), yc = V.ridge - R, A = Math.asin(V.half / R);
  const P = (a, z) => [V.cx + R * Math.sin(a), yc + R * Math.cos(a), z];
  const NA = 12, rows = []; for (let z = V.z0; z < V.z1 - .01; z += 4.5) rows.push(z);
  for (const z of rows) for (let i = 0; i < NA; i++) {
    const a0 = -A + 2 * A * i / NA, a1 = -A + 2 * A * (i + 1) / NA; if (a0 < V.vent && a1 > -V.vent) continue;
    const sp = cam.poly([P(a0, z), P(a1, z), P(a1, z + 4.5), P(a0, z + 4.5)]); if (sp.length < 3 || !onScreen(sp, 2)) continue;
    const up = Math.cos((a0 + a1) / 2), kz = clamp((z - V.z0) / (V.z1 - V.z0));
    fillS(ctx, sp, css(lerpC(lerpC(C.glassM, C.glassZ, clamp((up - .5) * 2)), C.glassW, .45 * kz * kz)));
  }
  for (const z of rows) for (const sg of [-1, 1]) { const p0 = P(sg * V.vent, z), p1 = P(sg * V.vent, z + 4.5), q = cam.poly([p0, p1, [p1[0] + sg * .5, p1[1] + 1.2, p1[2]], [p0[0] + sg * .5, p0[1] + 1.2, p0[2]]]); if (q.length >= 3) fillS(ctx, q, css(lerpC(C.glassZ, C.iron, .55))); }
  ctx.strokeStyle = css(C.iron); ctx.lineCap = 'butt';
  for (const z of [...rows, V.z1]) { const pts = []; for (let i = 0; i <= 24; i++) pts.push(P(-A + 2 * A * i / 24, z)); const p = cam.P(V.cx, V.ridge, z); if (!(p[2] > cam.near)) continue; ctx.beginPath(); line3(ctx, cam, pts); ctx.lineWidth = clamp(cam.f / p[2] * .22, .7, 70); ctx.stroke();
    // tie rod of each arch
    ctx.beginPath(); line3(ctx, cam, [[V.cx - V.half, V.y0, z], [V.cx + V.half, V.y0, z]]); ctx.lineWidth = clamp(cam.f / p[2] * .05, .5, 20); ctx.stroke(); }
  for (let i = 0; i <= NA; i++) { const a = -A + 2 * A * i / NA; if (Math.abs(a) < V.vent) continue; const pm = cam.P(...P(a, clamp(cam.pos[2] + 12, V.z0, V.z1))); ctx.beginPath(); line3(ctx, cam, [P(a, V.z0), P(a, V.z1)]); ctx.lineWidth = pm[2] > cam.near ? clamp(cam.f / pm[2] * .07, .5, 24) : 1; ctx.stroke(); }
  return { P, A };
}
function shedWalls(ctx, cam) {
  const V = ST.vault;
  for (const [x, nx] of [[V.cx - V.half, 1], [V.cx + V.half, -1]]) {
    if ((cam.pos[0] - x) * nx <= 0) continue;
    const sp = cam.poly([[x, 0, V.z0], [x, V.y0, V.z0], [x, V.y0, V.z1], [x, 0, V.z1]]); if (sp.length < 3) continue;
    linOn(ctx, cam, sp, [x, 0, 10], [x, V.y0, 10], [[0, css(mulC(C.wall, .75))], [1, css(C.wall)]]);
    for (let z = V.z0 + 2; z < V.z1 - 2; z += 9) {   // tall arched openings (dusk outside)
      const pts = [[x + nx * .03, 1.2, z]]; for (let i = 0; i <= 10; i++) { const a = Math.PI * i / 10; pts.push([x + nx * .03, 6 + 2.2 * Math.sin(a), z + 2.2 - 2.2 * Math.cos(a)]); } pts.push([x + nx * .03, 1.2, z + 4.4]);
      const ws = cam.poly(pts); if (ws.length >= 3 && onScreen(ws, 2)) linOn(ctx, cam, ws, [x, 1.2, z], [x, 8.2, z], [[0, css(fogC(rgb('#3a3770'), 30))], [1, css(fogC(rgb('#5a4c86'), 30))]]);
    }
  }
  // the far opening of the shed (dusk) beyond z1
  const z = V.z1, sp = cam.poly([[V.cx - V.half, 0, z], [V.cx + V.half, 0, z], [V.cx + V.half, V.y0, z], [V.cx - V.half, V.y0, z]]);
  if (sp.length >= 3) linOn(ctx, cam, sp, [30, 0, z], [30, V.y0, z], [[0, css(rgb('#c78a6e'))], [.3, css(rgb('#6a5486'))], [1, css(rgb('#2c3270'))]]);
}
function platforms(ctx, cam, t) {
  const py = ST.py, V = ST.vault;
  // track beds (two tracks) and the far platform
  const bed = cam.poly([[22.0 + 5.7, 0, V.z0], [32.0, 0, V.z0], [32.0, 0, V.z1 + 30], [27.7, 0, V.z1 + 30]]); fillS(ctx, bed, css(C.bed));
  ctx.strokeStyle = css(mulC(C.rail, .8)); ctx.lineWidth = 1.2; ctx.beginPath();
  for (const x of [29.28, 30.72]) line3(ctx, cam, [[x, .15, V.z0], [x, .15, V.z1 + 30]]);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1; ctx.beginPath(); for (let z = Math.floor(cam.pos[2]) - 2; z < V.z1 + 30; z += .65) { if (z < V.z0) continue; line3(ctx, cam, [[28.9, .08, z], [31.1, .08, z]]); } ctx.stroke();
  // the far platform (left) and the main platform; edges, a lit pool under every lamp
  for (const [x0, x1, edgeX] of [[22.0, 27.7, 27.7], [32.0, 40.0, 32.0]]) {
    for (const f of boxVis(cam, { x0, x1, y0: 0, y1: py, z0: V.z0, z1: x0 > 30 ? ST.zs + .15 : V.z1 })) {
      const sp = cam.poly(f.pts); if (sp.length < 3) continue;
      if (f.side === 'top') linOn(ctx, cam, sp, [x0, py, cam.pos[2]], [x0, py, cam.pos[2] + 40], [[0, css(C.plat)], [1, css(fogC(C.plat, 40))]]);
      else fillS(ctx, sp, css(mulC(C.wall, .7)));
    }
    ctx.strokeStyle = css(fogC(C.edge, 12)); ctx.lineWidth = 2; ctx.beginPath(); const ex = edgeX + (x0 > 30 ? .35 : -.35); line3(ctx, cam, [[ex, py + .002, V.z0], [ex, py + .002, x0 > 30 ? ST.zs : V.z1]]); ctx.stroke();
  }
  for (const [x, y, z, k] of LAMPS) poolOn(ctx, cam, null, [x + .2, py + .003, z + .4], [1, 0, 0], [0, 0, 1], 3.4 * (k > .9 ? 1 : .8), [[0, `rgba(255,170,90,${.42 * k})`], [.45, `rgba(255,150,80,${.16 * k})`], [1, 'rgba(255,150,80,0)']], 'lighter');
}
function columns(ctx, cam) {
  for (const x of [38.6, 24.6]) for (const z of [-16, -7, 2, 11]) {
    const c = [x, 0, z]; if (cam.P(x, 4, z)[2] <= cam.near) continue;
    for (const f of boxVis(cam, { x0: x - .14, x1: x + .14, y0: ST.py, y1: ST.vault.y0, z0: z - .14, z1: z + .14 })) { if (f.side === 'top' || f.side === 'bottom') continue; fillS(ctx, cam.poly(f.pts), css(fogC(f.side === 'xn' ? rgb('#1a1c34') : C.iron, distOf(cam, c)))); }
    for (const f of boxVis(cam, { x0: x - .3, x1: x + .3, y0: ST.vault.y0 - .5, y1: ST.vault.y0, z0: z - .3, z1: z + .3 })) fillS(ctx, cam.poly(f.pts), css(fogC(C.iron, distOf(cam, c))));
  }
}
// ---------------------------------------------------------------- the train (two carriages; dz = how far it has moved toward +z)
function drawTrain(ctx, cam, t, dz, doors) {
  const T = ST.train, front = T.front + dz, back = front - T.len, cars = [[front - 18, front], [back, front - 18.2]];
  const winRow = (z0, z1, i) => { // lit windows on the platform side (x1), a passenger's head and shoulders in some
    const out = []; for (let z = z0 + 1.6; z < z1 - 1.4; z += 1.55) { const k = Math.floor((z - z0) / 1.55); if (k % 4 === 3) continue; out.push([z, z + 1.15, hash(k + i * 13, 5)]); } return out;
  };
  cars.forEach(([z0, z1], i) => {
    const d = distOf(cam, [30, 2, (z0 + z1) / 2]);
    for (const f of boxVis(cam, { x0: T.x0, x1: T.x1, y0: T.y0, y1: T.y1, z0, z1 })) {
      const sp = cam.poly(f.pts); if (sp.length < 3 || !onScreen(sp, 2)) continue;
      if (f.side === 'xp') linOn(ctx, cam, sp, [T.x1, T.y0, z0], [T.x1, T.y1, z0], [[0, css(fogC(mulC(C.carr, .7), d))], [.55, css(fogC(C.carrLit, d))], [1, css(fogC(C.carr, d))]]);
      else fillS(ctx, sp, css(fogC(f.side === 'top' ? rgb('#16262a') : mulC(C.carr, .75), d)));
    }
    // a cream band under the windows, the windows, the doors (two per car, dark glass; open ones show the lit inside)
    const x = T.x1 + .005;
    ctx.strokeStyle = css(fogC(rgb('#cdbb92'), d)); ctx.lineWidth = clamp(cam.f / d * .07, .6, 8); ctx.beginPath(); line3(ctx, cam, [[x, 1.75, z0 + .3], [x, 1.75, z1 - .3]]); ctx.stroke();
    for (const [a, b, k] of winRow(z0, z1, i)) {
      const sp = cam.poly([[x, 1.95, a], [x, 1.95, b], [x, 3.05, b], [x, 3.05, a]]); if (sp.length < 3 || !onScreen(sp, 2)) continue;
      linOn(ctx, cam, sp, [x, 1.95, a], [x, 3.05, a], [[0, css(fogC(C.winDim, d * .6))], [1, css(fogC(C.win, d * .6))]]);
      if (k > .45) { // a passenger seated by the window
        const hc = cam.P(x - .25, 2.42, (a + b) / 2 + (k - .7) * .5), r = cam.f / hc[2] * .11; if (hc[2] > cam.near) { ctx.save(); ctx.beginPath(); pathS(ctx, sp); ctx.clip(); ctx.fillStyle = 'rgba(40,26,30,.75)'; ctx.beginPath(); ctx.ellipse(hc[0], hc[1], r * .85, r, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(hc[0], hc[1] + r * 2.4, r * 2.2, r * 1.6, 0, 0, TAU); ctx.fill(); ctx.restore(); }
      }
    }
    for (const dzD of [3.2, 18 - 3.2 - 1.3]) {
      const a = z0 + dzD, b = a + 1.3, sp = cam.poly([[x, 1.12, a], [x, 1.12, b], [x, 3.1, b], [x, 3.1, a]]); if (sp.length < 3) continue;
      const open = clamp(doors) * (i === 0 && dzD > 10 ? 1 : 0);
      fillS(ctx, sp, css(fogC(mulC(C.carr, .55), d)));
      // door leaves slide apart; the gap shows the lit vestibule
      if (open > 0) { const m = (a + b) / 2, g = .62 * open, gp = cam.poly([[x, 1.12, m - g], [x, 1.12, m + g], [x, 3.1, m + g], [x, 3.1, m - g]]); if (gp.length >= 3) fillS(ctx, gp, css(fogC(lerpC(C.win, C.core, .3), d * .6))); }
      const w1 = cam.poly([[x + .002, 2.05, a + .12], [x + .002, 2.05, a + .5], [x + .002, 2.9, a + .5], [x + .002, 2.9, a + .12]]), w2 = cam.poly([[x + .002, 2.05, b - .5], [x + .002, 2.05, b - .12], [x + .002, 2.9, b - .12], [x + .002, 2.9, b - .5]]);
      if (open < .5) { fillS(ctx, w1, css(fogC(C.winDim, d * .6))); fillS(ctx, w2, css(fogC(C.winDim, d * .6))); }
    }
  });
  // the tail lights of the last car, the head lamps glow at the front
  for (const xx of [T.x0 + .4, T.x1 - .4]) { const p = cam.P(xx, 1.0, back - .01); if (p[2] > cam.near) glowAt(ctx, p[0], p[1], clamp(cam.f / p[2] * .25, 2, 40), [255, 60, 50], .8); }
}
// ---------------------------------------------------------------- the end wall, the big screen (frame + glass), the clock, the lamps
export function screenRect(cam) {
  const s = ST.scr, z = ST.zs, q = [cam.P(s.x0, s.y1, z), cam.P(s.x1, s.y1, z), cam.P(s.x1, s.y0, z), cam.P(s.x0, s.y0, z)];
  if (q.some((p) => !(p[2] > cam.near))) return null;
  return q;
}
function endWall(ctx, cam) {
  const z = ST.zs + .15, sp = cam.poly([[32.0, ST.py, z], [40.0, ST.py, z], [40.0, 6.6, z], [32.0, 6.6, z]]); if (sp.length < 3) return;
  linOn(ctx, cam, sp, [36, ST.py, z], [36, 6.6, z], [[0, css(mulC(C.stone, .8))], [1, css(mulC(C.stone, 1.05))]]);
  ctx.save(); ctx.beginPath(); pathS(ctx, sp); ctx.clip(); ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 1; ctx.beginPath(); for (let y = ST.py + .45; y < 6.6; y += .45) line3(ctx, cam, [[32, y, z], [40, y, z]]); ctx.stroke(); ctx.restore();
  // the frame of the screen (iron, slightly proud of the wall)
  const s = ST.scr, m = .14, fz = ST.zs - .02, fr = cam.poly([[s.x0 - m, s.y0 - m, fz], [s.x1 + m, s.y0 - m, fz], [s.x1 + m, s.y1 + m, fz], [s.x0 - m, s.y1 + m, fz]]);
  if (fr.length >= 3) { fillS(ctx, fr, '#0c0d1a'); ctx.beginPath(); pathS(ctx, fr); ctx.strokeStyle = 'rgba(160,170,210,.25)'; ctx.lineWidth = 1.2; ctx.stroke(); }
}
function drawClock(ctx, cam, t, M) {
  const [x, y, z, r] = ST.clock, c = cam.P(x, y, z); if (!(c[2] > cam.near)) return;
  const R = cam.f / c[2] * r; if (R < 2) return;
  // hanging rod and the drum of the clock
  ctx.strokeStyle = css(C.iron); ctx.lineWidth = Math.max(1, R * .05); ctx.beginPath(); line3(ctx, cam, [[x, y + r, z], [x, ST.vault.y0, z]]); ctx.stroke();
  ctx.fillStyle = '#10111f'; ctx.beginPath(); ctx.arc(c[0], c[1], R * 1.1, 0, TAU); ctx.fill();
  const g = ctx.createRadialGradient(c[0], c[1] - R * .2, 0, c[0], c[1], R); g.addColorStop(0, '#fbf3df'); g.addColorStop(1, '#e2d3b0'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#1a1820'; ctx.lineCap = 'butt';
  for (let i = 0; i < 60; i++) { const a = i / 60 * TAU, big = i % 5 === 0, r0 = R * (big ? .74 : .86), r1 = R * .93; ctx.lineWidth = Math.max(.6, R * (big ? .055 : .018)); ctx.beginPath(); ctx.moveTo(c[0] + Math.sin(a) * r0, c[1] - Math.cos(a) * r0); ctx.lineTo(c[0] + Math.sin(a) * r1, c[1] - Math.cos(a) * r1); ctx.stroke(); }
  // hands: hour (short, wide), minute (long)
  const hand = (a, L, w) => { ctx.lineWidth = Math.max(1, w); ctx.beginPath(); ctx.moveTo(c[0] - Math.sin(a) * L * .18, c[1] + Math.cos(a) * L * .18); ctx.lineTo(c[0] + Math.sin(a) * L, c[1] - Math.cos(a) * L); ctx.stroke(); };
  ctx.lineCap = 'round'; hand((6 + M) / 12 * TAU, R * .52, R * .085); hand(M * TAU, R * .8, R * .055);
  ctx.fillStyle = '#1a1820'; ctx.beginPath(); ctx.arc(c[0], c[1], R * .05, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(200,170,110,.6)'; ctx.lineWidth = Math.max(1, R * .03); ctx.beginPath(); ctx.arc(c[0], c[1], R * 1.05, 0, TAU); ctx.stroke();
  glowAt(ctx, c[0], c[1], R * 1.8, [255, 235, 200], .12);
}
function drawLamps(ctx, cam) {
  for (const [x, y, z, k] of LAMPS) {
    const p = cam.P(x, y, z); if (!(p[2] > cam.near)) continue; const s = cam.f / p[2];
    if (s * .5 < 1.5) { glowAt(ctx, p[0], p[1], 4, C.lamp, .5 * k); continue; }
    ctx.strokeStyle = css(C.iron); ctx.lineWidth = Math.max(.8, s * .02); ctx.beginPath(); line3(ctx, cam, [[x, y, z], [x, ST.vault.y0, z]]); ctx.stroke();
    // an enamel shade: dark outside, warm white inside, the bulb
    const rw = s * .42, rh = s * .2; ctx.fillStyle = '#1f3a34'; ctx.beginPath(); ctx.moveTo(p[0] - rw, p[1] + rh * .6); ctx.quadraticCurveTo(p[0], p[1] - rh * 1.5, p[0] + rw, p[1] + rh * .6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(lerpC(C.lamp, C.core, .5)); ctx.beginPath(); ctx.ellipse(p[0], p[1] + rh * .6, rw, rh * .28, 0, 0, TAU); ctx.fill();
    glowAt(ctx, p[0], p[1] + rh * .7, s * 1.3 * (.6 + .4 * k), C.lamp, .55 * k);
  }
}
// ---------------------------------------------------------------- the person (back view), with a real stride: feet placed in the world
// o: { t, seed, hip: [x, z] (world), feet: [[x, z, lift], [x, z, lift]] (left, right), swing (-1..1), lean, relax (0..1), light: {x,y,col,a}, mono (a flat colour: the reflection), front (lanyard + badge), title (0..1 left of the title line) }
const DRESS = { coat: '#2a3150', pants: '#15162a', shoes: '#0a0a12', skin: '#8d5f40', hair: '#17121a', strap: '#c8843a' };
export function person(ctx, cam, o) {
  const hipW = [o.hip[0], ST.py, o.hip[1]], g0 = cam.P(hipW[0], ST.py, hipW[2]); if (!(g0[2] > cam.near)) return null;
  const s = cam.f / g0[2] * 1.75 / 185;   // px per figure unit (185 units = 1.75 m)
  const footS = (f) => { const p = cam.P(f[0], ST.py, f[1]); return [(p[0] - g0[0]) / s, (p[1] - g0[1]) / s, f[2] || 0]; };
  const F0 = footS(o.feet[0]), F1 = footS(o.feet[1]);
  const t = o.t, b = Math.sin(t * TAU / 4.3 + (o.seed || 0)) * .8 * (o.mono ? 1 : 1), rel = o.relax || 0, sw = o.swing || 0, ln = o.lean || 0;
  const D = DRESS, mono = o.mono || null, col = (k) => mono || D[k], sh = (k, d) => mono || shade(D[k], d);
  ctx.save(); ctx.translate(g0[0], g0[1]); ctx.scale(o.flip ? -s : s, s);
  const sy = -b + ln * 6 + rel * 1.5, hx = 0;
  // legs: hip joints → knees → ankles at the feet (the knee bends forward, which from behind shows as a slight outward kink)
  const leg = (i, F, fill) => {
    const hx0 = i ? 8 : -8, hy = -92 + ln * 2, ax = F[0], ay = F[1] - 9 - F[2] * 60, kx = (hx0 + ax) / 2 + (i ? 1.2 : -1.2), ky = (hy + ay) / 2 + 1 - F[2] * 25;
    ctx.fillStyle = fill; capsule(ctx, hx0, hy, 9, kx, ky, 6.9); capsule(ctx, kx, ky, 6.7, ax, ay, 5.2);
    ctx.fillStyle = col('shoes'); ctx.beginPath(); ctx.ellipse(ax, ay + 4.4 - F[2] * 10, 6.2, 4.6, 0, 0, TAU); ctx.fill();
    if (F[2] > .02 && !mono) { ctx.fillStyle = '#3a3440'; ctx.beginPath(); ctx.ellipse(ax, ay + 6.5, 5.4, 3.2 * clamp(F[2] * 6), 0, 0, TAU); ctx.fill(); }   // the sole, as the heel lifts
  };
  // the farther foot first
  const order = F0[1] < F1[1] ? [[0, F0], [1, F1]] : [[1, F1], [0, F0]];
  for (const [i, F] of order) leg(i, F, i ? sh('pants', .03) : col('pants'));
  // arms: the hands swing opposite to the feet (never behind the back): forward = up and in, back = down and out
  const armL = { e: [-24 + sw * 3, -113 - sw * 6], h: [-22 + sw * 6, -87 - sw * 14] }, armR = { e: [24 + sw * 2, -113 + sw * 3], h: [22 + sw * 3, -87 + sw * 4] };
  ctx.fillStyle = sh('coat', -.04); capsule(ctx, -19, -142 + sy, 6.9, armL.e[0], armL.e[1], 5.9); capsule(ctx, armL.e[0], armL.e[1], 5.7, armL.h[0], armL.h[1], 4.7);
  ctx.fillStyle = col('skin'); ctx.beginPath(); ctx.ellipse(armL.h[0] + .6, armL.h[1] + 5.5, 3.9, 5.2, .15, 0, TAU); ctx.fill();
  // coat
  ctx.fillStyle = col('coat'); ctx.beginPath();
  ctx.moveTo(-18.5, -77); ctx.bezierCurveTo(-19.5, -92, -16.2, -106, -16.4, -120); ctx.bezierCurveTo(-16.8, -134, -23, -140 + sy, -18.5, -147 + sy); ctx.bezierCurveTo(-13, -152 + sy, -6, -151.5 + sy, 0, -151.5 + sy);
  ctx.bezierCurveTo(6, -151.5 + sy, 13, -152 + sy, 18.5, -147 + sy); ctx.bezierCurveTo(23, -140 + sy, 16.8, -134, 16.4, -120); ctx.bezierCurveTo(16.2, -106, 19.5, -92, 18.5, -77);
  ctx.quadraticCurveTo(0, -73.5, -18.5, -77); ctx.closePath(); ctx.fill();
  ctx.fillStyle = col('coat'); capsule(ctx, 19, -142 + sy, 6.9, armR.e[0], armR.e[1], 5.9); capsule(ctx, armR.e[0], armR.e[1], 5.7, armR.h[0], armR.h[1], 4.7);
  ctx.fillStyle = col('skin'); ctx.beginPath(); ctx.ellipse(armR.h[0] - .6, armR.h[1] + 5.5, 3.9, 5.2, -.15, 0, TAU); ctx.fill();
  // collar, neck, head (a little lifted as he relaxes), hair; the lanyard's strap round the neck
  const tilt = .12 - rel * .14 + ln * .3;
  ctx.fillStyle = sh('coat', .08); ctx.beginPath(); ctx.moveTo(-9.5, -148 + sy); ctx.quadraticCurveTo(0, -146 + sy, 9.5, -148 + sy); ctx.lineTo(8.5, -154 + sy); ctx.quadraticCurveTo(0, -152.5 + sy, -8.5, -154 + sy); ctx.closePath(); ctx.fill();
  ctx.fillStyle = sh('skin', -.18); capsule(ctx, 0, -151 + sy, 4.6, 0, -158 + sy + tilt * 3, 4.3);
  ctx.strokeStyle = mono ? mono : D.strap; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-5.4, -153 + sy); ctx.quadraticCurveTo(0, -150.2 + sy, 5.4, -153 + sy); ctx.stroke();
  ctx.save(); ctx.translate(0, -166.5 + sy + tilt * 5);
  ctx.fillStyle = col('hair'); ctx.beginPath(); ctx.ellipse(0, 0, 9.3, 11.4 - tilt * 2, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-8.6, 3); ctx.quadraticCurveTo(0, 12.5 - tilt * 3, 8.6, 3); ctx.lineTo(7.8, 6.5); ctx.quadraticCurveTo(0, 11, -7.8, 6.5); ctx.closePath(); ctx.fill();
  ctx.restore();
  if (!mono) {   // form: the coat seam, darker toward the ground, the lamp's light on the shoulders and the head
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(0, -146 + sy); ctx.lineTo(.5, -78); ctx.stroke();
    const L = o.light; if (L) { const gl = ctx.createLinearGradient(0, -175, 0, -90); gl.addColorStop(0, rgba(L.col, .5 * L.a)); gl.addColorStop(1, rgba(L.col, 0)); ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = gl; ctx.fillRect(-30, -180, 60, 100); ctx.globalCompositeOperation = 'source-over'; }
  }
  // the front (the reflection): lanyard and badge on the chest
  if (o.front) {
    ctx.strokeStyle = o.front.strap; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(-5.5, -151 + sy); ctx.lineTo(-2.4, -121 + sy * .3); ctx.moveTo(5.5, -151 + sy); ctx.lineTo(2.4, -121 + sy * .3); ctx.stroke();
    ctx.save(); ctx.translate(0, -114 + sy * .3); ctx.rotate(.04 * Math.sin(t * 1.3));
    ctx.fillStyle = o.front.card; ctx.fillRect(-5.6, -7.6, 11.2, 15.2);
    ctx.fillStyle = o.front.ink; ctx.fillRect(-4.4, -6.2, 3.6, 4.4);                     // the photo square
    scribble(ctx, -4.2, 1.6, 8.4, 2.2, { seed: 91, ink: o.front.ink, lw: .55 });         // the name (a scribble)
    if (o.title > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-4.4 + 8.8 * (1 - o.title), 3.4, 8.8 * o.title, 2.6); ctx.clip(); ctx.fillStyle = o.front.band; ctx.fillRect(-4.4, 3.4, 8.8, 2.6); ctx.restore(); }   // the title line
    ctx.restore();
  }
  ctx.restore();
  return { s, g: g0, badge: [g0[0] + 0 * s, g0[1] + (-114 + sy * .3 + 4.7) * s] };
}
function shade(hex, d) { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(clamp(v + d * 255, 0, 255)); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join(''); }

// ---------------------------------------------------------------- the whole station
// st: { trainDz, doors, clockM, man: person options (without cam), refl (0..1 the reflections show), screen: { on (0..1 switch-on), off (0..1 switch-off), clip(ctx, x, y, w, h) }, plate(ctx, t), smoke: { u, dots } }
export function drawStation(ctx, t, cam, st) {
  // the dusk behind everything (seen through the roof glass and the openings)
  skyFill(ctx, cam, [[-.2, rgb('#14163a')], [0, rgb('#c88a6e')], [.15, rgb('#5a4c86')], [.6, rgb('#1d2560')], [1.4, rgb('#0e1230')]]);
  vaultIn(ctx, cam);
  shedWalls(ctx, cam);
  platforms(ctx, cam, t);
  drawTrain(ctx, cam, t, st.trainDz, st.doors);
  columns(ctx, cam);
  endWall(ctx, cam);
  // the screen: glass = the glass plate itself (screen space, clipped to the pane), reflections on it, or the lit clip
  const q = screenRect(cam);
  if (q) {
    ctx.save(); ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(q[i][0], q[i][1]); ctx.closePath(); ctx.clip();
    st.plate(ctx, t);
    if (st.refl > 0) reflections(ctx, cam, t, st);
    ctx.restore();
    if (st.screen && (st.screen.on > 0 && st.screen.off < 1)) screenOn(ctx, q, st.screen);
  }
  drawClock(ctx, cam, t, st.clockM);
  // the person
  if (st.man) person(ctx, cam, { ...st.man, t });
  drawLamps(ctx, cam);
  // the screen's light on the platform and on him while it plays
  if (q && st.screen && st.screen.on > 0) { const sc = st.screen, a = .22 * clamp(sc.on) * (1 - clamp(sc.off)); const p = cam.P(35, ST.py, ST.zs - 1.6); if (p[2] > cam.near) { ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(1, .3); glowAt(ctx, 0, 0, cam.f / p[2] * 3.4, [150, 180, 230], a); ctx.restore(); } }
  return q;
}
// the reflections in the dark pane: the person's front (a silhouette with the badge), the hero lamp, the platform lamps, the train's windows
function reflections(ctx, cam, t, st) {
  const z2 = (z) => 2 * ST.zs - z, a = st.refl;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, z, k] of LAMPS) { const p = cam.P(x, y, z2(z)); if (p[2] > cam.near) glowAt(ctx, p[0], p[1], clamp(cam.f / p[2] * .9, 2, 160), C.lamp, .32 * k * a); }
  // the train's lit windows, mirrored
  const T = ST.train, front = T.front + st.trainDz;
  for (let z = front - T.len + 1.6; z < front - 1.4; z += 1.55) { const p = cam.P(T.x1, 2.5, z2(z)); if (!(p[2] > cam.near)) continue; const w = cam.f / p[2] * .5, h = cam.f / p[2] * .55; ctx.fillStyle = `rgba(255,200,140,${(.14 * a).toFixed(3)})`; ctx.fillRect(p[0] - w / 2, p[1] - h / 2, w, h); }
  ctx.restore();
  // the person, mirrored: his front, dark against the lamp behind him, a warm rim on the head and shoulders, the badge
  if (st.man) {
    const m = st.man, mir = { ...m, t, hip: [m.hip[0], z2(m.hip[1])], feet: m.feet.map((f) => [f[0], z2(f[1]), f[2]]), flip: true, mono: '#05060f', light: null,
      front: { strap: 'rgba(200,132,58,.85)', card: 'rgba(206,214,232,.9)', ink: 'rgba(30,34,60,.95)', band: 'rgba(30,34,60,.95)' }, title: st.title };
    ctx.save(); ctx.globalAlpha = .92 * a; const r = person(ctx, cam, mir); ctx.restore();
    // the rim of the lamp light around the reflection's head and shoulders
    if (r) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, r.g[0], r.g[1] - 165 * r.s, 30 * r.s, C.lamp, .2 * a); ctx.restore(); }
    // the title line going up as dotted smoke
    if (r && st.smoke && st.smoke.u > 0 && st.smoke.u < 1.6) {
      const u = st.smoke.u, R = prng(733); ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 46; i++) { const px = -4.4 + R() * 8.8, py = 3.4 + R() * 2.6, k = R(), q = clamp((u - px / 8.8 * .25 - .02) / 1.2); if (q <= 0) continue; const dx = (R() - .5) * 18 * q + Math.sin(i + u * 3) * 2 * q, dy = -(10 + 26 * k) * q * q - 6 * q;
        const sx = r.g[0] - (px + dx) * r.s, sy = r.g[1] + (-114 + 4.7 - 7.6 + py + dy) * r.s; ctx.fillStyle = `rgba(200,210,235,${(.75 * (1 - q)).toFixed(3)})`; const rr = Math.max(1, r.s * (.55 + q * .5)); ctx.fillRect(sx - rr / 2, sy - rr / 2, rr, rr); }
      ctx.restore();
    }
  }
}
// switching on: a bright line opens to the full picture; switching off: the picture folds to a line, the line to a point
function screenOn(ctx, q, sc) {
  const x0 = Math.min(q[0][0], q[3][0]), x1 = Math.max(q[1][0], q[2][0]), y0 = Math.min(q[0][1], q[1][1]), y1 = Math.max(q[2][1], q[3][1]), cy = (y0 + y1) / 2, w = x1 - x0, h = y1 - y0;
  const on = clamp(sc.on), off = clamp(sc.off);
  let hh = h * eo3(on), ww = w;
  if (off > 0) { const a = clamp(off / .6), b = clamp((off - .6) / .4); hh = h * (1 - sio(a)) + 2 * (1 - b); ww = w * (1 - sio(b)); }
  if (hh < .5 || ww < .5) return;
  ctx.save(); ctx.beginPath(); ctx.rect((x0 + x1) / 2 - ww / 2, cy - hh / 2, ww, hh); ctx.clip();
  sc.clip(ctx, x0, y0, w, h);
  ctx.restore();
  // the bright edge of the opening / closing line
  if (on < 1 || off > 0) { const k = off > 0 ? clamp(off * 1.6) : 1 - on; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(220,235,255,${(.85 * k).toFixed(3)})`; ctx.fillRect((x0 + x1) / 2 - ww / 2, cy - hh / 2 - 1, ww, 2); ctx.fillRect((x0 + x1) / 2 - ww / 2, cy + hh / 2 - 1, ww, 2); ctx.restore(); }
}
