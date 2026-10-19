// s02_b.mjs · chapter 02, shots 2.05–2.08 (the empty square, and the "No to…" triplet: lanyard, platform, shoes/grass)
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, vnoise, fbm, stipple, roughPath, roughPoly, PAL, L, put, cached, sprite, fogL, coneL, poolL, bloomL, glowLive, vgrad, drawLayer, layerXf, figSprite, drawFig, ell, lin, sm, eout, ein, eio, eoutq, drift, back, smear, whipAmt , figure } from './s02_kit.mjs';
import { hatch, roughLine, roughRect, sagLine, person, castShadow, quadMap, quadIn, stratus, limb, qpts } from './art.mjs';
import { YOU } from './s02_a.mjs';

function soft(c, px) { const [o, g] = L(c.width, c.height); g.filter = `blur(${px}px)`; g.drawImage(c, 0, 0); return o; }
// whip smear at the edges of a shot (outgoing / incoming 'left' composites)
function whipSmear(ctx, t, s, { out = 0, inn = 0 } = {}) {
  let a = 0;
  if (out) a += whipAmt(t, s.b - out, s.b);
  if (inn) a += whipAmt(t, s.a, s.a + inn);
  if (a > .05) smear(ctx, a * 40, 10);
}
// walk-cycle sprites (person() once per phase)
function walkSprites(key, s, dress, o = {}) {
  return sprite('walk:' + key, () => {
    const out = [];
    for (let i = 0; i < 8; i++) {
      const ph = i / 8 * Math.PI * 2, a = Math.sin(ph) * .42;
      const pose = { lean: .06, head: o.head ?? .05, sh: [-a * .8 + (o.arm0 ?? 0), a * .8 + (o.arm1 ?? 0)], el: [.35 + (o.el0 ?? 0), .35], hip: [a, -a], kn: [Math.max(0, -Math.cos(ph)) * .7, Math.max(0, Math.cos(ph)) * .7], hair: o.hair || 'short', coat: o.coat || 0, bulk: o.bulk || 1 };
      const w = Math.ceil(300 * s), h = Math.ceil(330 * s), [c, g] = L(w, h), pad = 0;
      person(g, w / 2, 210 * s, s, pose, { dress, flip: !!o.flip, light: o.light, shadeA: o.shadeA, shadeCol: o.shadeCol, rim: o.rim, rimSide: o.rimSide, rimW: o.rimW });
      out.push({ c, ox: w / 2, oy: 210 * s });
    }
    return out;
  });
}
function drawWalk(ctx, frames, x, y, dist, stride = 60) {
  const ph = ((dist / stride) % 1 + 1) % 1, f = frames[Math.floor(ph * 8) % 8], bob = Math.abs(Math.sin(ph * Math.PI * 2)) * 3;
  ctx.drawImage(f.c, x - f.ox, y - f.oy - bob);
}

// ============================================================ 2.05 the empty square: "Finally, you can say no."
// A sun-washed piazza seen from above, you small in the middle with a long shadow. Chin lifts on "no"; the exhale
// becomes wind: leaves and pigeons lift and stream right, the camera follows them -> (c) whip into the lanyard.
const SQ = { LW: 2600, LH: 1320 };
export function buildS5() {
  const { LW, LH } = SQ, VPx = 1300, VPy = 120;
  const [c, g] = L(LW, LH);
  // sky strip + far facades (an arcade)
  g.fillStyle = vgrad(g, 0, 0, 0, 380, [[0, '#7fa6c4'], [.6, '#cfd6c8'], [1, '#ffe2a8']]); g.fillRect(0, 0, LW, 400);
  const r = prng(505);
  let x = -40; while (x < LW + 40) { const w = 160 + r() * 200, h = 150 + r() * 120, col = ['#e2b48e', '#d98e86', '#e9c48a', '#cf9f7a', '#e6cfa4'][Math.floor(r() * 5)];
    roughRect(g, x, 330 - h, w, h + 20, col, { amp: 1, seed: x }); roughRect(g, x - 4, 330 - h - 10, w + 8, 12, shade(col, -.1), { amp: .6, seed: x + 1 });
    // arches on the ground floor, windows above
    for (let ax = x + 18; ax < x + w - 40; ax += 46) { g.fillStyle = shade(col, -.32); g.beginPath(); g.moveTo(ax, 350); g.lineTo(ax, 300); g.arc(ax + 16, 300, 16, Math.PI, 0); g.lineTo(ax + 32, 350); g.fill();
      if (h > 190) { g.fillStyle = shade(col, -.22); g.fillRect(ax + 8, 330 - h + 30, 16, 30); } if (h > 230) { g.fillStyle = shade(col, -.22); g.fillRect(ax + 8, 330 - h + 80, 16, 30); } }
    g.fillStyle = rgba('#fff1cf', .25); g.fillRect(x + w - 8, 330 - h, 8, h); x += w + 2; }
  fogL(g, { y0: 150, y1: 380, col: '#ffe8c0', a: .4, seed: 9, cover: .6, soft: .5, k: .3, sx: .003, sy: .03 });
  // the paving: warm stone, a radiating pattern of joints converging to the vanishing point
  roughPoly(g, [[-40, 345], [LW + 40, 345], [LW + 40, LH], [-40, LH]], '#e3b98a', { amp: 1, seed: 11 });
  g.fillStyle = vgrad(g, 0, 345, 0, LH, [[0, '#f2d0a0'], [.5, '#dba67a'], [1, '#b8806a']]); g.fillRect(-40, 345, LW + 80, LH);
  g.strokeStyle = rgba('#7a4a3a', .25); g.lineWidth = 1.4;
  for (let k = -30; k <= 30; k++) { g.beginPath(); g.moveTo(VPx + k * 30, 345); g.lineTo(VPx + k * 260, LH + 40); g.stroke(); }
  for (let k = 0; k < 26; k++) { const y = 345 + Math.pow(k / 26, 1.7) * (LH - 330); g.globalAlpha = .7; g.beginPath(); g.moveTo(-40, y); g.lineTo(LW + 40, y); g.stroke(); }
  g.globalAlpha = 1;
  // a circle of darker stones in the middle (where you will stand)
  g.strokeStyle = rgba('#7a4a3a', .35); g.lineWidth = 3; for (const rr of [150, 190]) { g.beginPath(); g.ellipse(1300, 760, rr * 2.4, rr * .62, 0, 0, 7); g.stroke(); }
  // a fountain basin at the back right and a plane tree's shadow on the stones
  roughPoly(g, ell(1900, 430, 140, 30), '#c99a7a', { amp: 1, seed: 12 }); roughPoly(g, ell(1900, 424, 120, 22), '#8fb0c0', { amp: 1, seed: 13 }); roughRect(g, 1890, 340, 20, 86, '#c99a7a', { amp: .5, seed: 14 });
  { const [sc, sx] = L(LW, LH); sx.fillStyle = '#5a3a5a'; const rr = prng(15);
    for (let i = 0; i < 70; i++) { const px = 300 + rr() * 700, py = 700 + rr() * 520, rad = 20 + rr() * 60; sx.beginPath(); sx.ellipse(px, py, rad * 1.6, rad * .55, 0, 0, 7); sx.fill(); }
    sx.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 160; i++) { const px = 300 + rr() * 700, py = 700 + rr() * 520; sx.beginPath(); sx.ellipse(px, py, 8 + rr() * 16, 4 + rr() * 5, 0, 0, 7); sx.fill(); }
    put(g, soft(sc, 2), 'multiply', .4); }
  // the light: sun from the upper left, warm wash + stippled pool in the middle of the square
  poolL(g, 1300, 760, 900, 320, { col: '#ffe2a8', a: .35, k: .6, seed: 16, op: 'screen' });
  // a few café chairs stacked at the edge (nobody here yet), a lamp post
  for (let k = 0; k < 3; k++) { const cx = 2200 + k * 70, cy = 560 + k * 10; g.strokeStyle = '#3a2440'; g.lineWidth = 4; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy - 60); g.lineTo(cx + 34, cy - 60); g.lineTo(cx + 34, cy); g.moveTo(cx, cy - 30); g.lineTo(cx + 34, cy - 30); g.stroke(); }
  roughLine(g, [[560, 640], [560, 300]], { w: 9, col: '#2a1c30', seed: 17 }); roughRect(g, 540, 280, 40, 30, '#2a1c30', { amp: .6, seed: 18 });
  // the plane tree (foreground-left) on its own layer
  const [tc, tx] = L(LW, LH);
  limb(tx, qpts([330, 1320], [300, 900], [380, 520]), 90, 40, '#3a2a2a', 3);
  for (const [a2, b2] of [[[370, 620], [180, 300]], [[380, 560], [560, 260]], [[360, 700], [640, 520]]]) limb(tx, qpts(a2, [mix(a2[0], b2[0], .5) + 30, mix(a2[1], b2[1], .5)], b2), 34, 10, '#3a2a2a', a2[0]);
  // bark patches (plane tree camouflage)
  { const rr = prng(19); for (let i = 0; i < 26; i++) { const px = 290 + rr() * 80, py = 700 + rr() * 600; tx.fillStyle = rgba(rr() < .5 ? '#c9b08a' : '#6a5a4a', .7); tx.beginPath(); tx.ellipse(px, py, 8 + rr() * 14, 12 + rr() * 20, 0, 0, 7); tx.fill(); } }
  const canopy = [];
  { const rr = prng(20); for (let i = 0; i < 46; i++) canopy.push([100 + rr() * 640, 40 + rr() * 380, 50 + rr() * 70]); }
  for (const [px, py, rad] of canopy) { tx.fillStyle = mixHex('#4f6a3a', '#2a3a2a', clamp((py - 100) / 400)); tx.beginPath(); roughPath(tx, ell(px, py, rad, rad * .75, 20), { amp: 3, seed: px }); tx.fill(); }
  { tx.save(); tx.globalCompositeOperation = 'source-atop'; const gg = tx.createLinearGradient(100, 40, 700, 420); gg.addColorStop(0, rgba('#ffe2a8', .45)); gg.addColorStop(.5, rgba('#ffe2a8', 0)); gg.addColorStop(1, rgba('#102010', .4)); tx.fillStyle = gg; tx.fillRect(0, 0, 900, 600); hatch(tx, [0, 200, 900, 400], { angle: .9, gap: 6, col: '#0a140a', a: .35, seed: 21 }); tx.restore(); }
  return { ground: c, tree: tc, canopy };
}
function leaves(c, t, t0, n, seed, box, wind) {
  const r = prng(seed);
  for (let i = 0; i < n; i++) {
    const x0 = box[0] + r() * box[2], y0 = box[1] + r() * box[3], d = r() * .5, sp = .6 + r() * .8, ph = r() * 7, col = ['#c9a43a', '#e9b44a', '#8a9a4a', '#d98a4a'][i % 4];
    const age = Math.max(0, t - t0 - d), w = wind(age);
    const x = x0 + w * 900 * sp + Math.sin(t * 2 + ph) * 12, y = y0 - w * 120 * sp + Math.sin(t * 3 + ph) * 10 + (1 - Math.min(1, age)) * 0;
    c.save(); c.translate(x, y); c.rotate(t * 4 * sp + ph); c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, 9, 4.5, 0, 0, 7); c.fill(); c.restore();
  }
}
function pigeon(c, x, y, s, t, flying, ph) {
  c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#5e5a6e';
  c.beginPath(); c.ellipse(0, 0, 18, 10, -.1, 0, 7); c.fill(); c.beginPath(); c.arc(16, -8, 7, 0, 7); c.fill();
  c.fillStyle = '#e9b44a'; c.fillRect(22, -9, 5, 2);
  if (flying) { const f = Math.sin(t * 22 + ph); c.fillStyle = '#7a7690'; c.beginPath(); c.moveTo(-4, -4); c.lineTo(-18, -26 * f); c.lineTo(8, -6); c.fill(); c.beginPath(); c.moveTo(-2, -2); c.lineTo(-10, -20 * f + 4); c.lineTo(10, -4); c.fill(); }
  else { c.fillStyle = '#3a3646'; c.fillRect(-2, 8, 2, 8); c.fillRect(4, 8, 2, 8); }
  c.restore();
}
export const square = (R) => (ctx, t, s) => {
  const P = cached('s205', buildS5);
  const wind = (age) => ein(clamp(age / 1.2)) * 1.4 + Math.max(0, age - 1.2) * 1.6;
  const whip = ein(lin(R.tNo + .35, R.t1 + .25, t));
  const cam = { x: -60 + 30 * lin(R.t0, R.t1, t) + 900 * whip + drift(t, 6, 9), y: -30 * lin(R.t0, R.t1, t) + drift(t, 4, 10), z: 1.03 + .03 * lin(R.t0, R.t1, t) };
  drawLayer(ctx, { c: P.ground, p: .85, cx: 1300, cy: 660 }, cam, (c) => {
    // you: small, centred, a long shadow toward the lower right; the chin lifts on "no"
    const tq = Math.round(t * 15) / 15, lift = back(lin(R.tNo - .25, R.tNo + .35, tq), 1.6), br = Math.sin(tq * 1.5) * .015, exhale = Math.exp(-Math.pow((tq - R.tNo - .45) / .25, 2));
    castShadow(c, 1300, 760, 1.25, 700, 100, { a: .45, len: 3.2, col: '#4a2a40' });
    figure(c, 1300, 760 - 88 * 1.25, 1.25, { lean: -.02 - .04 * exhale + br, head: mix(.3, -.32, clamp(lift)) - .06 * (lift > 1 ? lift - 1 : 0), sh: [.18 + .1 * exhale, -.12 - .1 * exhale], el: [.25, .2], hair: 'short' },
      { dress: YOU, light: { x: 600, y: 0, col: '#ffe2a8', a: .6 }, shadeA: .1, rim: '#fff1cf', rimSide: -1, rimW: 2 });
    // pigeons on the stones, then lift with the wind
    for (let i = 0; i < 6; i++) { const px = 980 + i * 120 + (i % 2) * 40, py = 880 + (i % 3) * 30, ta = R.tNo + .4 + i * .06, age = t - ta;
      if (age < 0) pigeon(c, px + Math.sin(t * 2 + i) * 4, py, 1.1, t, false, i);
      else { const e = age * age; pigeon(c, px + e * 700 + age * 200, py - e * 160 - age * 140, 1.1, t, true, i); } }
    leaves(c, t, R.tNo + .3, 60, 7, [600, 500, 900, 600], wind);
  });
  drawLayer(ctx, { c: P.tree, p: 1.2, cx: 1300, cy: 660 }, cam, (c) => {
    // canopy flutter: a few lit clumps sway with the gust
    const gust = sm(lin(R.tNo + .2, R.tNo + 1, t));
    c.fillStyle = rgba('#ffe2a8', .2);
    for (const [px, py, rad] of P.canopy.slice(0, 18)) { const dx = Math.sin(t * 2 + px) * 3 + gust * 8 * Math.sin(t * 7 + py); c.beginPath(); c.ellipse(px + dx + rad * .2, py - rad * .3, rad * .4, rad * .25, 0, 0, 7); c.fill(); }
    leaves(c, t, R.tNo + .25, 40, 11, [100, 100, 700, 400], wind);
  });
  // the falling rope from the knot arrives as one leaf spiralling down into the square (first .8 s)
  { const a = t - R.t0 + .35; if (a > 0 && a < 1.4) { ctx.save(); ctx.translate(980 + Math.sin(a * 5) * 40, -40 + a * 520); ctx.rotate(a * 6); ctx.fillStyle = '#e9b44a'; ctx.beginPath(); ctx.ellipse(0, 0, 18, 8, 0, 0, 7); ctx.fill(); ctx.restore(); } }
  glowLive(ctx, 300 - cam.x * .3, -100, 1100, .16, '#ffe2a8', '#fff8e6', 'screen');
  whipSmear(ctx, t, s, { out: .7 });
};

// ============================================================ 2.06 "No to the boss." — the lanyard left swinging on a hook
export function buildS6() {
  const LW = 2200, LH = 1240;
  const [c, g] = L(LW, LH);
  g.fillStyle = vgrad(g, 0, 0, LW, 0, [[0, '#5e6a80'], [.5, '#7a7a8a'], [1, '#a8908a']]); g.fillRect(0, 0, LW, LH);
  hatch(g, [0, 0, LW, LH], { angle: -.7, gap: 9, col: '#2a2a3a', a: .1, seed: 61, broken: .55 });
  // door frame at the left, a light switch, the coat-hook board
  roughRect(g, 140, -20, 70, LH + 40, '#4a4a5e', { amp: 1, seed: 62 }); g.fillStyle = rgba('#fff1cf', .25); g.fillRect(204, -20, 5, LH + 40);
  roughRect(g, 300, -20, 300, LH + 40, '#3a3a4e', { amp: 1, seed: 63 });   // open door leaf (dark)
  roughRect(g, 760, 360, 60, 90, '#d8d0c4', { amp: .6, seed: 64 }); roughRect(g, 780, 385, 20, 40, '#b8b0a4', { amp: .4, seed: 65 });
  roughRect(g, 880, 250, 760, 70, '#6a4a3a', { amp: 1, seed: 66 }); hatch(g, [880, 250, 760, 70], { angle: 0, gap: 5, col: '#2a1a14', a: .35, seed: 67 }); g.fillStyle = rgba('#ffe2a8', .4); g.fillRect(880, 250, 760, 3);
  // the warm afternoon stripe crossing the wall diagonally
  const [wc, wx] = L(LW, LH); wx.fillStyle = rgba('#ffc477', .8); wx.beginPath(); roughPath(wx, [[1300, -40], [1760, -40], [1400, 1280], [940, 1280]], { amp: 2, seed: 68 }); wx.fill();
  const ws = soft(wc, 14); stipple(ws, { k: .7, seed: 69 });
  // floor strip
  roughPoly(g, [[-20, 1080], [LW + 20, 1060], [LW + 20, LH], [-20, LH]], '#3a3040', { amp: 1, seed: 70 });
  return { wall: c, warm: ws };
}
export const lanyard = (R) => (ctx, t, s) => {
  const P = cached('s206', buildS6);
  const land = eoutq(lin(R.t0 - .25, R.t0 + .45, t)), out = ein(lin(R.t1 - .35, R.t1 + .25, t));
  const cam = { x: -500 * (1 - land) + 700 * out + drift(t, 6, 11), y: drift(t, 4, 12), z: 1.05 };
  const warm = sm(lin(R.t0, R.tBoss + .4, t));
  drawLayer(ctx, { c: P.wall, p: .8 }, cam, (c) => { c.globalAlpha = .3 + .7 * warm; c.globalCompositeOperation = 'screen'; c.drawImage(P.warm, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; });
  drawLayer(ctx, { c: null, p: 1, cx: 1100, cy: 620 }, cam, (c) => {
    // pendulum: it arrives swinging hard right (continuing the whip), peaks right on "boss", decays
    const tt = t - R.tBoss, th = .55 * Math.exp(-Math.max(0, tt) * .8) * Math.cos(tt * 4.6);
    const ang = -th, hx = 1260, hy = 330, Ls = 560;
    // hooks on the board, two empty
    for (const x of [1040, 1260, 1480]) { c.strokeStyle = '#3a2a24'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, 300); c.lineTo(x, 330); c.quadraticCurveTo(x + 2, 352, x + 26, 344); c.stroke(); c.strokeStyle = rgba('#ffe2a8', .6); c.lineWidth = 3; c.beginPath(); c.moveTo(x + 4, 302); c.lineTo(x + 4, 330); c.stroke(); }
    c.save(); c.translate(hx, hy); c.rotate(ang);
    // shadow of the lanyard on the wall
    c.save(); c.translate(30, 20); c.globalAlpha = .25; c.fillStyle = '#1a1424'; c.beginPath(); c.moveTo(-8, 0); c.lineTo(-40, Ls); c.lineTo(40, Ls); c.lineTo(8, 0); c.fill(); c.fillRect(-80, Ls, 160, 220); c.restore();
    // strap (two ribbons converging on the hook), clip, card
    const flex = Math.sin(t * 9) * 4 * Math.exp(-Math.max(0, tt));
    for (const sd of [-1, 1]) { c.strokeStyle = '#2f4a7a'; c.lineWidth = 16; c.beginPath(); c.moveTo(sd * 4, 0); c.quadraticCurveTo(sd * 24 + flex, Ls * .5, sd * 26, Ls - 40); c.stroke(); c.strokeStyle = rgba('#9ab8e0', .5); c.lineWidth = 3; c.beginPath(); c.moveTo(sd * 4 - 4, 4); c.quadraticCurveTo(sd * 24 + flex - 4, Ls * .5, sd * 26 - 4, Ls - 40); c.stroke(); }
    roughRect(c, -30, Ls - 50, 60, 30, '#9a9aa6', { amp: .4, seed: 3 });
    c.rotate(th * .15);
    roughRect(c, -90, Ls - 24, 180, 250, '#eeeae2', { amp: .8, seed: 4 });
    c.fillStyle = '#c4c0b8'; c.fillRect(-90, Ls - 24, 180, 40); c.fillStyle = '#2f4a7a'; c.fillRect(-90, Ls - 24, 180, 16);
    roughRect(c, -60, Ls + 40, 70, 86, '#b8b4ac', { amp: .4, seed: 5 }); c.fillStyle = '#8a8680'; c.beginPath(); c.arc(-25, Ls + 70, 16, 0, 7); c.fill(); c.fillRect(-46, Ls + 92, 42, 34);
    c.fillStyle = '#9a968e'; for (let k = 0; k < 4; k++) c.fillRect(24, Ls + 46 + k * 22, 50 - k * 8, 6);
    c.fillStyle = vgrad(c, -90, 0, 90, 0, [[0, rgba('#1a1424', .2)], [1, rgba('#ffe2a8', .35 * warm)]]); c.fillRect(-90, Ls - 24, 180, 250);
    c.restore();
  });
  glowLive(ctx, 1500 - cam.x, 200, 700, .1 + .1 * warm, '#ffc477', '#ffe2a8', 'screen');
  whipSmear(ctx, t, s, { out: .45, inn: .45 });
};

// ============================================================ 2.07 "No to the commute." — against the stream, into daylight
const PL = { LW: 3400, LH: 1240 };
export function buildS7() {
  const { LW, LH } = PL;
  const [c, g] = L(LW, LH);
  // cold station hall to the left, daylight opening at the right end
  g.fillStyle = vgrad(g, 0, 0, LW, 0, [[0, '#2a3048'], [.55, '#3e4660'], [.8, '#8a7a7a'], [1, '#ffd59a']]); g.fillRect(0, 0, LW, LH);
  // roof trusses receding
  for (let k = 0; k < 16; k++) { const x = k * 220; roughLine(g, [[x, 0], [x + 80, 160]], { w: 8, col: '#1a1e30', seed: k }); roughLine(g, [[x + 80, 160], [x + 220, 0]], { w: 6, col: '#1a1e30', seed: k + 20 }); }
  roughRect(g, -20, 150, LW + 40, 18, '#1a1e30', { amp: 1, seed: 30 });
  // the train along the back: dark carriages, cold lit windows
  roughRect(g, -20, 330, 2700, 430, '#2a3046', { amp: 1.2, seed: 31 });
  for (let x = 30; x < 2650; x += 150) { roughRect(g, x, 400, 110, 140, '#5a6a88', { amp: .6, seed: x }); g.fillStyle = rgba('#a8c0d8', .25); g.fillRect(x + 6, 404, 98, 40); }
  for (let x = 0; x < 2700; x += 600) roughRect(g, x + 560, 360, 50, 380, '#1e2236', { amp: .6, seed: x + 3 });
  g.fillStyle = rgba('#000', .35); g.fillRect(-20, 700, 2720, 60);
  // the opening: stairs up into daylight
  { const [lc, lx] = L(LW, LH); const rg = lx.createRadialGradient(3250, 500, 0, 3250, 500, 1300); rg.addColorStop(0, rgba('#fff1cf', .95)); rg.addColorStop(.3, rgba('#ffc477', .55)); rg.addColorStop(1, rgba('#ffc477', 0)); lx.fillStyle = rg; lx.fillRect(0, 0, LW, LH); stipple(lc, { k: .5, seed: 33 }); put(g, lc, 'screen'); }
  for (let k = 0; k < 12; k++) { g.fillStyle = rgba('#fff1cf', .3 + k * .03); g.fillRect(2800 + k * 40, 760 - k * 30, 600, 6); }
  coneL(g, 3300, 300, { dir: Math.atan2(-1400, 700), spread: .22, len: 2000, col: '#ffd59a', a: .3, k: .6, seed: 34, op: 'screen', soft: .5 });
  // platform
  roughPoly(g, [[-20, 760], [LW + 20, 760], [LW + 20, LH], [-20, LH]], '#3a3a4a', { amp: 1, seed: 35 });
  g.fillStyle = vgrad(g, 0, 0, LW, 0, [[0, rgba('#000', .2)], [.7, rgba('#000', 0)], [1, rgba('#ffd59a', .5)]]); g.fillRect(-20, 760, LW + 40, 480);
  g.fillStyle = '#d8b84a'; g.fillRect(-20, 772, LW + 40, 10);
  for (let k = 0; k < 9; k++) { g.strokeStyle = rgba('#1a1e30', .4); g.beginPath(); g.moveTo(-20, 800 + k * k * 6); g.lineTo(LW + 20, 800 + k * k * 6); g.stroke(); }
  return { hall: c };
}
const GREY = { coat: '#4a5068', pants: '#22263a', shoes: '#101220', skin: '#9a8a90', hair: '#1a1c2a' };
export const platform = (R) => (ctx, t, s) => {
  const P = cached('s207', buildS7);
  const u = (t - R.t0) / (R.t1 - R.t0), land = eoutq(lin(R.t0 - .25, R.t0 + .45, t)), out = ein(lin(R.t1 - .35, R.t1 + .25, t));
  const youX = 2050 + (t - R.t0) * 300;
  const cam = { x: youX - 1700 + 180 - 400 * (1 - land) + 600 * out + drift(t, 6, 13), y: drift(t, 4, 14), z: 1.04 };
  drawLayer(ctx, { c: P.hall, p: 1, cx: 1700, cy: 760, base: 1.25 }, cam, (c) => {
    const crowd = walkSprites('crowd', 2.0, GREY, { flip: true, coat: .6, light: { x: 3300, y: 300, col: '#ffd59a', a: .3 }, shadeA: .45, shadeCol: '#101428', rim: '#ffd59a', rimSide: 1, rimW: 2.5 });
    const crowd2 = walkSprites('crowd2', 2.0, { ...GREY, coat: '#3a4058', hair: '#2a2a3a' }, { flip: true, hair: 'bun', light: { x: 3300, y: 300, col: '#ffd59a', a: .3 }, shadeA: .5, shadeCol: '#101428', rim: '#ffd59a', rimSide: 1, rimW: 2.5 });
    const me = walkSprites('me', 2.3, YOU, { head: -.12, light: { x: 3300, y: 300, col: '#ffe2a8', a: .6 }, rim: '#fff1cf', rimSide: 1, rimW: 3 });
    const r = prng(77), rows = [];
    for (let i = 0; i < 34; i++) rows.push({ x0: r() * 4200, y: 830 + r() * 260, sp: 150 + r() * 70, k: r() < .5 ? crowd : crowd2, sc: .85 + r() * .3 });
    rows.sort((a, b) => a.y - b.y);
    let drew = false;
    for (const p of rows) {
      if (!drew && p.y > 980) { drawWalk(c, me, youX, 980, youX - 1300, 75); drew = true; }
      const x = ((p.x0 - (t - R.t0) * p.sp) % 4200 + 4200) % 4200 - 400 + 600;
      if (Math.abs(x - youX) < 70 && Math.abs(p.y - 980) < 40) continue;   // they part around you
      c.save(); c.translate(x, p.y); c.scale(p.sc, p.sc); drawWalk(c, p.k, 0, 0, -(t - R.t0) * p.sp + p.x0, 75); c.restore();
    }
    if (!drew) drawWalk(c, me, youX, 980, youX - 1300, 75);
  });
  whipSmear(ctx, t, s, { out: .45, inn: .45 });
};

// ============================================================ 2.08 "No to the job that was slowly wearing you down." — shoes on the step, bare feet in grass
export function buildS8() {
  const LW = 2300, LH = 1240;
  const [bc, bx] = L(LW, LH);
  bx.fillStyle = vgrad(bx, 0, 0, 0, 520, [[0, '#a8c4c0'], [.6, '#f3dca8'], [1, '#ffd59a']]); bx.fillRect(0, 0, LW, 540);
  bloomL(bx, 1900, 260, 520, { col: '#ffc477', core: '#fff8e6', a: .6, k: .3, seed: 81, op: 'screen' });
  { const [hc, hx] = L(LW, LH); hx.save(); hx.beginPath();
    for (const [y, x0, x1, th] of [[160, 300, 1500, 22], [230, 900, 2300, 16], [90, -100, 800, 14], [300, 1400, 2300, 12]]) stratus(hx, y, x0, x1, th, y + 3);
    hx.fillStyle = rgba('#f7c48e', .55); hx.fill(); hx.clip(); hatch(hx, [0, 40, LW, 300], { angle: -0.02, gap: 4, w: 1.1, col: '#fff1cf', a: .6, seed: 87, broken: .3 }); hx.restore(); put(bx, hc); }
  for (const [x, y, k] of [[700, 200, 1], [745, 214, .8], [790, 190, .9]]) { bx.strokeStyle = '#5a5a4a'; bx.lineWidth = 2 * k; bx.beginPath(); bx.moveTo(x - 12 * k, y - 3 * k); bx.quadraticCurveTo(x - 5 * k, y - 8 * k, x, y); bx.quadraticCurveTo(x + 5 * k, y - 8 * k, x + 12 * k, y - 4 * k); bx.stroke(); }
  // far meadow ridge with the railway embankment
  roughPoly(bx, [[-20, 470], [600, 440], [1300, 455], [2320, 430], [2320, 600], [-20, 600]], '#9aa86a', { amp: 2, seed: 82 });
  roughPoly(bx, [[-20, 500], [2320, 492], [2320, 520], [-20, 528]], '#7a7a5a', { amp: 1, seed: 83 });   // embankment
  roughPoly(bx, [[-20, 520], [2320, 512], [2320, 1240], [-20, 1240]], '#6a8a4a', { amp: 1, seed: 84 });
  bx.fillStyle = vgrad(bx, 0, 520, 0, 1240, [[0, rgba('#ffe2a8', .45)], [.4, rgba('#ffe2a8', .05)], [1, rgba('#1a2a14', .4)]]); bx.fillRect(-20, 512, 2340, 730);
  fogL(bx, { y0: 400, y1: 620, col: '#ffe8c0', a: .5, seed: 85, cover: .65, soft: .5, k: .3, sx: .003, sy: .03 });
  // back grass (baked strokes)
  { const r = prng(86); bx.lineCap = 'round'; for (let i = 0; i < 9000; i++) { const x = r() * LW, y = 540 + Math.pow(r(), 1.3) * 700, d = (y - 540) / 700, l = 4 + d * 30 * (.5 + r());
    bx.strokeStyle = r() < .45 - d * .2 ? '#e8d27a' : (r() < .5 ? '#4f7a3a' : '#7a9a4a'); bx.globalAlpha = .3 + .5 * r(); bx.lineWidth = .8 + d * 1.6; bx.beginPath(); bx.moveTo(x, y); bx.lineTo(x + (r() - .4) * 6 * (1 + d * 3), y - l); bx.stroke(); }
    bx.globalAlpha = 1; for (let i = 0; i < 120; i++) { const x = r() * LW, y = 600 + r() * 600; bx.fillStyle = ['#fff1cf', '#ffd84a', '#e85a6a'][i % 3]; bx.beginPath(); bx.arc(x, y, 2 + r() * 3 * (y - 540) / 700, 0, 7); bx.fill(); } }
  // the stone doorstep (left) with the worn shoes on it
  const [sc, sx] = L(LW, LH);
  roughPoly(sx, [[-40, 760], [700, 740], [740, 790], [740, 900], [-40, 920]], '#c9a47a', { amp: 2, seed: 87 });
  roughPoly(sx, [[-40, 740], [700, 722], [700, 742], [-40, 762]], '#d8c4a4', { amp: 1.2, seed: 88 });
  sx.save(); sx.beginPath(); roughPath(sx, [[-40, 760], [700, 740], [740, 790], [740, 900], [-40, 920]], { amp: 2, seed: 87 }); sx.clip();
  sx.fillStyle = vgrad(sx, 0, 740, 760, 0, [[0, rgba('#3a2a20', .4)], [1, rgba('#ffe2a8', .3)]]); sx.fillRect(-40, 700, 820, 600);
  hatch(sx, [-40, 760, 800, 480], { angle: .4, gap: 6, col: '#3a2a20', a: .3, seed: 89 }); sx.restore();
  // door frame dark at far left
  roughRect(sx, -40, -40, 160, 800, '#3a2a24', { amp: 1, seed: 90 }); roughRect(sx, 120, -40, 26, 790, '#5a4434', { amp: .8, seed: 91 });
  // the shoes: heavy, scuffed, laces undone
  for (const [x, y, k] of [[180, 758, .8], [340, 752, .78]]) {
    sx.save(); sx.translate(x, y); sx.scale(k, k);
    sx.fillStyle = rgba('#1a1410', .5); sx.beginPath(); sx.ellipse(10, 6, 130, 18, 0, 0, 7); sx.fill();
    roughPoly(sx, [[-112, 0], [-118, -70], [-104, -128], [-30, -132], [-6, -96], [40, -76], [100, -62], [132, -34], [130, 2]], '#4a3020', { amp: 1.4, seed: x });
    sx.fillStyle = '#140c08'; sx.beginPath(); sx.ellipse(-66, -128, 42, 9, -.04, 0, 7); sx.fill(); roughRect(sx, -112, -16, 46, 18, '#2a1a10', { amp: .5, seed: x + 7 });
    sx.strokeStyle = rgba('#140c08', .7); sx.lineWidth = 2; sx.beginPath(); sx.moveTo(-104, -40); sx.quadraticCurveTo(-20, -30, 20, -70); sx.stroke();
    roughPoly(sx, [[-116, 0], [130, 0], [128, 14], [-116, 14]], '#1a1210', { amp: .8, seed: x + 1 });
    sx.fillStyle = rgba('#c9a070', .5); for (const [a, b, w2] of [[-80, -40, 30], [20, -60, 22], [80, -30, 26]]) { sx.beginPath(); sx.ellipse(a, b, w2, 6, -.3, 0, 7); sx.fill(); }
    sx.strokeStyle = '#d8c4a0'; sx.lineWidth = 3; sx.beginPath(); sx.moveTo(-20, -100); sx.bezierCurveTo(40, -90, 60, -20, 150, 30); sx.stroke(); sx.beginPath(); sx.moveTo(-10, -96); sx.bezierCurveTo(-40, -60, -20, 10, 30, 28); sx.stroke();
    sx.fillStyle = rgba('#ffe2a8', .45); sx.beginPath(); sx.ellipse(-60, -100, 40, 6, -.4, 0, 7); sx.fill();
    sx.restore();
  }
  return { back: bc, step: sc };
}
function foot(c, x, y, s, lift, rot, side) {
  // side view of a bare foot (heel left, toes right) with the ankle and a rolled trouser hem
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  c.fillStyle = side ? '#d9a882' : '#e7b993';
  c.beginPath(); c.moveTo(-50, -10); c.quadraticCurveTo(-62, 10, -40, 14); c.lineTo(60, 16); c.quadraticCurveTo(96, 16, 98, 4); c.quadraticCurveTo(96, -10, 70, -14); c.quadraticCurveTo(20, -24, -6, -50); c.lineTo(-10, -230); c.lineTo(-48, -230); c.quadraticCurveTo(-50, -60, -50, -10); c.fill();
  // toes
  c.fillStyle = side ? '#c99872' : '#ddb08a'; for (let k = 0; k < 4; k++) { c.beginPath(); c.ellipse(78 - k * 9, 10 - k, 9, 7, 0, 0, 7); c.fill(); }
  c.fillStyle = rgba('#fff1cf', .45); c.beginPath(); c.moveTo(-6, -50); c.quadraticCurveTo(20, -26, 70, -14); c.lineTo(66, -10); c.quadraticCurveTo(18, -20, -10, -44); c.fill();
  c.fillStyle = rgba('#5a2a20', .25); c.fillRect(-50, -230, 10, 230);
  // trouser hem rolled up
  roughPoly(c, [[-60, -230], [4, -230], [10, -330], [-66, -330]], '#2f4a6a', { amp: .8, seed: 3 }); roughPoly(c, [[-62, -232], [6, -232], [6, -262], [-62, -262]], '#3e5a7e', { amp: .6, seed: 4 });
  c.restore();
}
export function s8train(R, t) { return { x: 2400 - (t - R.t0) * 260, y: 470 }; }
export const grass = (R) => (ctx, t, s) => {
  const P = cached('s208', buildS8);
  const land = eoutq(lin(R.t0 - .25, R.t0 + .5, t)), fin = eio(lin(R.t1 - 1.2, R.t1 + .3, t));
  const tr = s8train(R, R.t1);
  const cam = { x: -260 - 500 * (1 - land) + drift(t, 6, 15), y: 60 + drift(t, 4, 16) - 200 * fin, z: 1.12 + .06 * lin(R.t0, R.t1, t) };
  drawLayer(ctx, { c: P.back, p: .55 }, cam, (c) => {
    // a little train crossing on the embankment, right to left
    const tp = s8train(R, t);
    for (let k = 0; k < 4; k++) { const x = tp.x + k * 150; roughRect(c, x, tp.y - 28, 140, 34, k ? '#c4482a' : '#8a2a20', { amp: .5, seed: k }); for (let j = 0; j < 4; j++) { c.fillStyle = '#ffe8b0'; c.fillRect(x + 12 + j * 32, tp.y - 22, 20, 12); } }
    c.fillStyle = rgba('#fff', .3); c.beginPath(); c.ellipse(tp.x + 640, tp.y - 50, 80, 16, 0, 0, 7); c.fill();
  });
  drawLayer(ctx, { c: P.step, p: .95 }, cam, (c) => {
    // you sit on the doorstep, boots off beside you, bare feet stretched into the grass; on "down" you lean back into the sun
    const tq = Math.round(t * 15) / 15, rel = sine(lin(R.tDown - .6, R.tDown + .3, tq)), br = Math.sin(tq * 1.5) * .015, wig = Math.sin(tq * 5) * .04 * rel;
    figure(c, 600, 742, 3.3, { lean: mix(.08, -.3, rel) + br, head: mix(.25, -.45, rel), sh: [mix(.65, .25, rel), mix(.5, -.05, rel)], el: [mix(.9, .3, rel), mix(.8, .2, rel)], hip: [mix(1.25, 1.45, rel), mix(1.15, 1.35, rel)], kn: [mix(1.15, .75, rel) + wig, mix(1.0, .6, rel) - wig], hair: 'short' },
      { dress: { ...YOU, pants: '#2f4a6a', shoes: '#e2b48e' }, light: { x: 2000, y: 100, col: '#ffe2a8', a: .6 }, shadeA: .1, rim: '#fff1cf', rimSide: 1, rimW: 3 });
    // live foreground grass blades swaying, flattened under the landed foot
    const r = prng(91), press = sm(lin(R.tDown - .05, R.tDown + .25, t));
    c.lineCap = 'round';
    for (let i = 0; i < 420; i++) { const x = -40 + r() * 2340, y = 880 + r() * 380, l = 30 + r() * 90, ph = r() * 7, col = r() < .4 ? '#e8d27a' : (r() < .5 ? '#4f7a3a' : '#7aa04a');
      const near = Math.exp(-Math.pow((x - 920) / 120, 2)) * press, sw = Math.sin(t * 1.6 + ph + x * .004) * 8 + near * (x < 920 ? -30 : 30);
      c.strokeStyle = col; c.globalAlpha = .7; c.lineWidth = 2 + r() * 2; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + sw * .4, y - l * .5, x + sw, y - l * (1 - near * .5)); c.stroke(); }
    c.globalAlpha = 1;
  });
  glowLive(ctx, 1700 - cam.x * .5, 120 - cam.y * .5, 900, .18, '#ffd59a', '#fff8e6', 'screen');
  whipSmear(ctx, t, s, { inn: .45 });
};
const sine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
export function s8TrainScreen(R, t) { const P = { width: 2300, height: 1240 }; const fin = eio(lin(R.t1 - 1.2, R.t1 + .3, t)); const cam = { x: -260 + drift(t, 6, 15), y: 60 + drift(t, 4, 16) - 200 * fin, z: 1.12 + .06 * lin(R.t0, R.t1, t) }; const m = layerXf({ c: P, p: .55 }, cam), tp = s8train(R, t); return { x: m.X(tp.x + 150 + 60), y: m.Y(tp.y - 16) }; }
