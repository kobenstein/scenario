// s00_open.mjs · the scenes of chapter 00 "The Morning" (cold open). Each export returns draw(ctx, t, s).
// Times come in via the `tm` object built in scenes/s00.mjs from the VO word timings.
import {
  W, H, C, K, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, prng, drift, addGlow, glow, text, quart, eoutQ, bell, hash,
  layer, stipple, maskLinear, maskRadial, put, roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, strokes, fog, cone, pool, bloom,
  person, castShadow, vnoise, fbm, mixHex, shade, soften, stratus, limb, qpts, stip,
  once, scratch, camApply, toScreen, lay, bake, breathe, fin, msgLight, stripeTex, stripeQuad, motes, SKY, skyFill, starField, strata,
  harbour, drawHarbour, harbourWindow, HARBOUR_P, bedroom, WIN, curtain, sitter, frameRect, frameLine, nameLabel, clipRole,
} from './s00_world.mjs';
import { clipScreen, clipInfo } from './kit.mjs';

// a hand (palm + fingers as capsules), wrist at (x, y), pointing along angle a; curl 0..1; lit 0..1 (warm)
function capsule(g, x1, y1, r1, x2, y2, r2) { const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(clamp((r1 - r2) / (d || 1), -1, 1)); g.beginPath(); g.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); g.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); g.closePath(); g.fill(); }
// drawn into a scratch canvas so the light overlay (source-atop) only touches the hand
export function hand(ctx, x, y, a, s, o = {}) {
  const [c, g] = scratch('hand', 512, 512); handRaw(g, 256, 256, a, s, o);
  if (o.rim) { const [c2, g2] = scratch('handrim', 512, 512); g2.drawImage(c, 0, 0); g2.globalCompositeOperation = 'source-in'; g2.fillStyle = o.rim; g2.fillRect(0, 0, 512, 512); ctx.drawImage(c2, x - 256 + (o.rimDx ?? 2), y - 256 + (o.rimDy ?? -2)); }
  ctx.drawImage(c, x - 256, y - 256);
}
function handRaw(g, x, y, a, s, { curl = 0, col = '#c9a184', spread = 0, flat = 0, lit = 0, litCol = K.hot } = {}) {
  g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s);
  const skin = mixHex(col, '#ffd6a8', lit * .55);
  g.fillStyle = skin;
  g.beginPath(); g.ellipse(20, 0, 24, 17 + flat * 2, 0, 0, 7); g.fill();
  const fing = [[-9, 30, 1], [-3, 34, .95], [4, 32, .92], [10, 26, .85]];
  fing.forEach(([oy, len, k], i) => { const c2 = curl * (.9 + i * .1), sp = (i - 1.5) * .1 * (1 + spread * 2); const bx = 40, by = oy * 1.1, a1 = sp + c2 * .9, l1 = len * .55 * k, l2 = len * .45 * k;
    const mx = bx + Math.cos(a1) * l1, my = by + Math.sin(a1) * l1, ex = mx + Math.cos(a1 + c2 * 1.1) * l2, ey = my + Math.sin(a1 + c2 * 1.1) * l2;
    capsule(g, bx - 6, by, 6.2, mx, my, 5.4); capsule(g, mx, my, 5.3, ex, ey, 4.4); });
  capsule(g, 14, 12, 7, 30, 26 + curl * 4, 5.5); capsule(g, 30, 26 + curl * 4, 5.5, 42 - curl * 6, 30 + curl * 6, 4.6);
  if (lit > 0) { g.globalCompositeOperation = 'source-atop'; const lg = g.createLinearGradient(0, -30, 0, 30); lg.addColorStop(0, rgba(litCol, .55 * lit)); lg.addColorStop(1, rgba(litCol, 0)); g.fillStyle = lg; g.fillRect(-40, -40, 140, 90); }
  g.restore();
}

// ================================================================ 0.01 the stripe on the floor climbs onto a hand
// low camera at floor level: boards recede; the duvet hangs over the bed edge as a big soft mass (upper right),
// a sleeping hand hangs out of it. The first light draws a hairline across the floor, widens and climbs the fingers.
const DUV = (() => { const p = []; const bz = (a, b, c, d, n) => { for (let i = 0; i <= n; i++) { const q = i / n, u = 1 - q; p.push([u * u * u * a[0] + 3 * u * u * q * b[0] + 3 * u * q * q * c[0] + q * q * q * d[0], u * u * u * a[1] + 3 * u * u * q * b[1] + 3 * u * q * q * c[1] + q * q * q * d[1]]); } };
  bz([700, -260], [760, 200], [820, 520], [1060, 560], 30); bz([1060, 560], [1250, 590], [1300, 660], [1520, 650], 20); bz([1520, 650], [1700, 642], [1850, 610], [2200, 640], 20); p.push([2200, -260]); return p; })();
export function floorStripe(tm) {
  const P = () => once('o01', () => {
    const VP = [1500, -900];
    const floor = bake(-200, -200, W + 400, H + 400, (g) => {
      const lg = g.createLinearGradient(0, -200, 0, H + 200); lg.addColorStop(0, '#0c0c26'); lg.addColorStop(1, '#05051a'); g.fillStyle = lg; g.fillRect(-200, -200, W + 400, H + 400);
      g.strokeStyle = rgba('#000000', .7); g.lineWidth = 2;
      for (let i = -14; i < 20; i++) { const xb = -600 + i * 190; g.beginPath(); g.moveTo(VP[0] + (xb - VP[0]) * .5, VP[1] + (H + 200 - VP[1]) * .5); g.lineTo(xb, H + 200); g.stroke(); }
      strokes(g, 160, (i, q, r) => { const xb = -600 + (i / 160) * 34 * 190 + r() * 40; return [mix(VP[0] + (xb - VP[0]) * .5, xb, q), mix(VP[1] + (H + 200 - VP[1]) * .5, H + 200, q) + Math.sin(q * 12 + i) * 2]; }, { w: 1, col: '#2a2440', a: .35, seed: 3 });
      hatch(g, [-200, -200, W + 400, H + 400], { angle: -.9, gap: 7, w: 1, col: '#000000', a: .25, seed: 5, broken: .35 });
      // shadow on the floor under the overhang
      g.save(); g.filter = 'blur(30px)'; g.fillStyle = 'rgba(0,0,6,.8)'; g.beginPath(); g.moveTo(760, 540); DUV.slice(30, 72).forEach((p) => g.lineTo(p[0] + 20, p[1] + 40)); g.lineTo(2200, 400); g.closePath(); g.fill(); g.restore();
      // the duvet: a big soft mass, lit on its window side, folds following its bulge, hatched in the shadow
      roughPoly(g, DUV, '#17153e', { amp: 2.5, seed: 7 });
      g.save(); g.beginPath(); roughPath(g, DUV, { amp: 2.5, seed: 7 }); g.clip();
      { const rg = g.createRadialGradient(700, 100, 0, 700, 100, 1300); rg.addColorStop(0, rgba('#5a4c98', .38)); rg.addColorStop(.5, rgba('#2e2a68', .16)); rg.addColorStop(1, rgba('#0a0a24', .5)); g.fillStyle = rg; g.fillRect(600, -300, 1700, 1000); }
      strokes(g, 34, (i, q) => { const k = i / 34; return [mix(760 + k * 300, 2200, q), mix(-200 + k * 760, 560 + k * 60, q * .6 + k * .4) + Math.sin(q * 6 + i) * 10]; }, { w: 1.6, col: '#3e3a86', a: .55, seed: 9 });
      strokes(g, 18, (i, q) => [mix(900, 2100, q), 520 + i * 6 + Math.sin(q * 7 + i * .7) * 16], { w: 1.4, col: '#0c0b2a', a: .5, seed: 10 });
      hatch(g, [900, 300, 1400, 400], { angle: .55, gap: 6, w: 1, col: '#06051a', a: .4, seed: 11 });
      // big soft folds: a shadow trough with a lit ridge beside it
      for (const [x0, y0, cx, cy, x1, y1] of [[820, -100, 980, 260, 1240, 470], [1000, -260, 1240, 120, 1600, 420], [1300, -240, 1500, 60, 1900, 300], [1650, -200, 1800, 120, 2200, 260], [900, 120, 1100, 380, 1400, 560]]) {
        g.save(); g.filter = 'blur(14px)'; g.strokeStyle = rgba('#05041a', .55); g.lineWidth = 34; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(cx, cy, x1, y1); g.stroke(); g.restore();
        g.save(); g.filter = 'blur(6px)'; g.strokeStyle = rgba('#7a68b8', .22); g.lineWidth = 10; g.beginPath(); g.moveTo(x0 - 30, y0 + 10); g.quadraticCurveTo(cx - 30, cy + 6, x1 - 34, y1 - 14); g.stroke(); g.restore();
      }
      g.restore();
      // rim light on the duvet's contour (cool dawn from the window)
      g.strokeStyle = rgba('#c8a0c8', .45); g.lineWidth = 2.2; g.beginPath(); DUV.slice(0, 32).forEach((p, i) => i ? g.lineTo(p[0] + 2, p[1]) : g.moveTo(p[0] + 2, p[1])); g.stroke();
    });
    const beam = bake(0, 0, W, H, (g) => { cone(g, -300, -500, { dir: -.55, spread: .08, len: 1700, col: K.amber, a: .16, k: .8, seed: 5, soft: .8 }); }, .5);
    return { floor, beam };
  });
  const path = [[-120, 1010], [1040, 700], [1080, 612]];
  const segL = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1])), total = segL.reduce((a, b) => a + b);
  return (ctx, t, s) => {
    const L = P(), b = breathe(t), u = lin(s.a, s.b, t);
    const cam = { x: 980 + b.dx + 60 * sine(u), y: 560 + b.dy - 40 * sine(u) - 160 * ein(lin(tm.exit - .5, tm.exit + .3, t)), z: 1.04 + .1 * sine(u) + b.dz };
    lay(ctx, L.floor, cam, 1);
    const rev = eout(lin(.15, tm.reach, t)) * total, wdt = mix(1.2, 30, eout(lin(.3, tm.reach + .6, t))), on = sm(lin(0, .5, t));
    ctx.save(); camApply(ctx, cam, 1);
    let acc = 0; const tex = stripeTex();
    for (let i = 0; i < path.length - 1; i++) {
      const A = path[i], B = path[i + 1], l = segL[i], dx = (B[0] - A[0]) / l, dy = (B[1] - A[1]) / l, nx = -dy, ny = dx;
      const show = clamp((rev - acc) / l); acc += l; if (show <= 0) break;
      const ww = wdt * (i === 0 ? 1 : .8) * 3, bw = ww * 7;
      stripeQuad(ctx, [A[0] - nx * bw / 2, A[1] - ny * bw / 2], [B[0] - nx * bw / 2, B[1] - ny * bw / 2], [A[0] + nx * bw / 2, A[1] + ny * bw / 2], .14 * on, 0, show, tex);
      stripeQuad(ctx, [A[0] - nx * ww / 2, A[1] - ny * ww / 2], [B[0] - nx * ww / 2, B[1] - ny * ww / 2], [A[0] + nx * ww / 2, A[1] + ny * ww / 2], .95 * on, 0, show, tex);
    }
    let hx = path[0][0], hy = path[0][1], acc2 = 0;
    for (let i = 0; i < path.length - 1; i++) { const l = segL[i]; if (rev <= acc2 + l) { const q = (rev - acc2) / l; hx = mix(path[i][0], path[i + 1][0], q); hy = mix(path[i][1], path[i + 1][1], q); break; } acc2 += l; hx = path[i + 1][0]; hy = path[i + 1][1]; }
    if (rev < total - 1) addGlow(ctx, hx, hy, 40 + wdt * 2, .5 * on, K.amber, K.hot);
    // the sleeping hand hangs out of the duvet; lit when the stripe arrives, stirs on "wake"
    const lit = sm(lin(tm.reach - .2, tm.reach + .25, t)), stir = bell(t, tm.wake + .12, .22), br = Math.sin(t * 1.3) * .015;
    ctx.fillStyle = '#2a2862'; capsule(ctx, 1080, 520, 30, 1210, 330, 40);
    ctx.fillStyle = '#211f56'; ctx.beginPath(); ctx.ellipse(1150, 470, 90, 40, -.9, 0, 7); ctx.fill();
    hand(ctx, 1110, 540, Math.PI / 2 + .35 + br - .12 * stir, 1.9, { curl: .5 - .38 * stir + .04 * Math.sin(t * 1.7), col: '#5a4258', lit, spread: stir * .5, rim: lit > .1 ? rgba(K.hot, .8 * lit) : null, rimDx: -2, rimDy: 2 });
    if (lit > 0) addGlow(ctx, 1085, 630, 170, .35 * lit, K.amber, K.hot);
    motes(ctx, t, 140, [-100, 200, 1500, 820], { seed: 4, a: .9 * on, inFn: (x, y) => { const d = Math.abs((y - 1010) - (x + 120) * (700 - 1010) / 1160); return clamp(1 - d / 260) * clamp((rev - (x + 120)) / 200); } });
    ctx.restore();
    lay(ctx, L.beam, cam, .7, { a: on * .8 * sm(lin(.5, 2.2, t)), op: 'lighter' });
    fin(ctx, { vig: .4 });
  };
}

// ================================================================ 0.02 bedside table: empty watch dish, phone face down; the phone flips
export function bedside(tm) {
  const P = () => once('o02', () => {
    const back = bake(-200, -200, W + 400, H + 400, (g) => {
      skyFill(g, [[0, '#0d0e2c'], [1, '#141542']], -200, -200, W + 400, 900);
      hatch(g, [-200, -200, W + 400, 900], { angle: -1.25, gap: 8, w: 1, col: '#04051a', a: .3, seed: 3, broken: .3 });
      // table top (perspective trapezoid) and front edge
      const top = [[120, 560], [1880, 540], [2120, 820], [-120, 840]];
      roughPoly(g, top, '#2a1f30', { amp: 1.5, seed: 4 });
      g.save(); g.beginPath(); roughPath(g, top, { amp: 1.5, seed: 4 }); g.clip(); strokes(g, 46, (i, q) => [mix(-120, 2120, q), mix(560, 830, i / 46) + Math.sin(q * 6 + i) * 3], { w: 1.1, col: '#4a3640', a: .45, seed: 5 }); hatch(g, [-120, 540, 2300, 300], { angle: .15, gap: 7, w: 1, col: '#0a0612', a: .3, seed: 6 }); g.restore();
      roughPoly(g, [[-120, 840], [2120, 820], [2120, 1300], [-120, 1300]], '#160f1e', { amp: 1.5, seed: 7 });
      g.save(); g.beginPath(); g.rect(-120, 840, 2300, 500); g.clip(); strokes(g, 40, (i, q) => [mix(-120, 2120, q), 850 + i * 9 + Math.sin(q * 9 + i) * 3], { w: 1, col: '#2a1c28', a: .5, seed: 8 }); g.restore();
      g.strokeStyle = rgba('#e8a3a0', .3); g.lineWidth = 2; g.beginPath(); g.moveTo(-120, 840); g.lineTo(2120, 820); g.stroke();
      // the empty watch dish (ceramic), with the faint ring where the watch used to lie
      const dx = 700, dy = 690; g.fillStyle = 'rgba(0,0,8,.5)'; g.beginPath(); g.ellipse(dx + 14, dy + 16, 128, 34, 0, 0, 7); g.fill();
      g.fillStyle = '#4a4470'; g.beginPath(); g.ellipse(dx, dy, 130, 38, 0, 0, 7); g.fill();
      g.fillStyle = '#2c2850'; g.beginPath(); g.ellipse(dx, dy - 4, 106, 26, 0, 0, 7); g.fill();
      g.strokeStyle = rgba('#8a84b8', .35); g.lineWidth = 3; g.beginPath(); g.ellipse(dx, dy - 4, 50, 12, 0, 0, 7); g.stroke();
      g.strokeStyle = rgba('#c8c0e8', .5); g.lineWidth = 1.5; g.beginPath(); g.ellipse(dx, dy, 130, 38, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
      // a glass of water
      const gx = 330, gy = 640; g.fillStyle = 'rgba(160,170,230,.12)'; g.beginPath(); g.moveTo(gx - 44, gy - 190); g.lineTo(gx + 44, gy - 190); g.lineTo(gx + 38, gy); g.lineTo(gx - 38, gy); g.closePath(); g.fill();
      g.fillStyle = 'rgba(160,170,230,.16)'; g.fillRect(gx - 41, gy - 120, 82, 120); g.strokeStyle = rgba('#c8d0ff', .35); g.lineWidth = 2; g.beginPath(); g.moveTo(gx - 44, gy - 190); g.lineTo(gx - 38, gy); g.moveTo(gx + 44, gy - 190); g.lineTo(gx + 38, gy); g.stroke();
      g.beginPath(); g.ellipse(gx, gy - 190, 44, 9, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(gx, gy - 120, 41, 8, 0, 0, 7); g.stroke();
    });
    return { back };
  });
  // the stripe crosses the table diagonally from the lower left to the phone
  const A = [-140, 1000], B = [1180, 660];
  return (ctx, t, s) => {
    const L = P(), b = breathe(t, .8), u = lin(s.a, s.b, t);
    const cam = { x: 960 + b.dx + 30 * sine(u), y: 540 + b.dy + 30 * (1 - eout(lin(s.a, s.a + 1, t))), z: 1.02 + .06 * sine(u) };
    lay(ctx, L.back, cam, 1);
    ctx.save(); camApply(ctx, cam, 1);
    const rev = eout(lin(s.a, tm.reach, t)), tex = stripeTex();
    const l = Math.hypot(B[0] - A[0], B[1] - A[1]), nx = -(B[1] - A[1]) / l, ny = (B[0] - A[0]) / l, ww = 90, bw = 520;
    const E = [mix(A[0], B[0], 1.25), mix(A[1], B[1], 1.25)];
    stripeQuad(ctx, [A[0] - nx * bw / 2, A[1] - ny * bw / 2], [E[0] - nx * bw / 2, E[1] - ny * bw / 2], [A[0] + nx * bw / 2, A[1] + ny * bw / 2], .16, 0, rev, tex);
    stripeQuad(ctx, [A[0] - nx * ww / 2, A[1] - ny * ww / 2], [E[0] - nx * ww / 2, E[1] - ny * ww / 2], [A[0] + nx * ww / 2, A[1] + ny * ww / 2], .9, 0, rev, tex);
    // stripe on the wall above the table (the same light, broken by the edge)
    stripeQuad(ctx, [500, 210], [2100, -200], [500, 470], .12 * rev, 0, 1, tex);
    // the phone: face down, then flips on "phone" (rotation about its long axis)
    const f = eio(lin(tm.flip, tm.flip + .38, t)), cx = 1180, cy = 660 - 40 * Math.sin(Math.PI * f), wph = 230, hph = 110, sx = Math.cos(Math.PI * f);
    ctx.fillStyle = 'rgba(0,0,8,.55)'; ctx.beginPath(); ctx.ellipse(cx + 18, 676, 150 * (1 - .3 * Math.sin(Math.PI * f)), 34, -.04, 0, 7); ctx.fill();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.04); ctx.scale(1, Math.abs(sx) * .9 + .1);
    ctx.fillStyle = sx > 0 ? '#1a1830' : '#0a0a16'; ctx.beginPath(); ctx.roundRect(-wph / 2, -hph / 2, wph, hph, 16); ctx.fill();
    if (sx > 0) { ctx.fillStyle = '#26243e'; ctx.beginPath(); ctx.roundRect(-wph / 2 + 16, -hph / 2 + 14, 46, 46, 10); ctx.fill(); ctx.strokeStyle = rgba(K.hot, .45 * rev); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-wph / 2, -hph / 2, wph, hph, 16); ctx.stroke(); }
    else { const on = sm(lin(.55, 1, f)) * (1 - .12 * Math.sin(t * 9) * bell(t, tm.flip + .5, .15)); ctx.fillStyle = rgba(K.cyanW, .25 + .7 * on); ctx.beginPath(); ctx.roundRect(-wph / 2 + 8, -hph / 2 + 7, wph - 16, hph - 14, 11); ctx.fill(); ctx.fillStyle = rgba('#3a6a8a', .55 * on); ctx.fillRect(-wph / 2 + 30, -14, 120, 9); ctx.fillRect(-wph / 2 + 30, 4, 80, 7); }
    ctx.restore();
    const on = sm(lin(tm.flip + .2, tm.flip + .5, t));
    if (on > 0) { msgLight(ctx, cx, cy, on, 70 + 40 * eout(lin(tm.flip + .3, s.b, t))); const lg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 900); lg.addColorStop(0, rgba(K.cyan, .12 * on)); lg.addColorStop(1, rgba(K.cyan, 0)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lg; ctx.fillRect(cx - 900, cy - 900, 1800, 1800); ctx.restore(); }
    motes(ctx, t, 60, [200, 200, 1400, 700], { seed: 9, a: .9, inFn: (x, y) => clamp(1 - Math.abs((y - 1000) - (x + 140) * (660 - 1000) / 1320) / 220) * rev });
    ctx.restore();
    fin(ctx, { vig: .4 });
  };
}

// ================================================================ 0.03 the bedroom at blue hour (K1), then the push through the window ★
export const F_PUSH = [1200, 575];
export function hcam04(t, t0) { const b = breathe(t, .7, 3); return { x: 960 + b.dx + 30 * Math.sin((t - t0) * .3), y: 560 + b.dy, z: 1.0 + .022 * (t - t0) + b.dz }; }
export function bedroomBlue(tm) {
  return (ctx, t, s) => {
    const B = bedroom('blue'), b = breathe(t, .8, 1);
    const e = quart(lin(tm.push0, tm.push1, t)), zv0 = .56;
    const hc = hcam04(t, tm.h0);
    const sx = mix(F_PUSH[0], W / 2, e) + b.dx * (1 - e), sy = mix(F_PUSH[1], H / 2, e) + b.dy * (1 - e);
    const zv = mix(zv0, hc.z, e);
    const hcam = { x: mix(960, hc.x, e), y: mix(600, hc.y, e), z: zv, sx, sy };
    drawHarbour(ctx, t, hcam, 'blue', { ign: 0 });
    const zr = Math.pow(zv / zv0, 3.6) * (1 + .03 * sine(lin(s.a, tm.push0, t)));
    const rcam = { x: F_PUSH[0], y: F_PUSH[1], z: zr, sx, sy };
    const roomA = 1 - sm(lin(.86, .97, e));
    if (roomA > 0) {
      ctx.save(); ctx.globalAlpha = roomA;
      lay(ctx, B.room, rcam, 1); lay(ctx, B.patch, rcam, 1, { op: 'lighter', a: .9 });
      ctx.save(); camApply(ctx, rcam, 1);
      curtain(ctx, t, { a: .16 });
      const flare = bell(t, tm.one, .14), ph = .5 + .5 * sm(lin(tm.one - .4, tm.one, t)) + .6 * flare;
      const look = sm(lin(tm.one + .2, tm.one + .9, t));
      const f = sitter(ctx, t, { look, phone: ph });
      const [px, py] = f.hand(0);
      msgLight(ctx, px + 2, py - 12, ph * .9, 40 + 50 * flare);
      const lg = ctx.createRadialGradient(px, py, 0, px, py, 700); lg.addColorStop(0, rgba(K.cyan, .18 * ph)); lg.addColorStop(1, rgba(K.cyan, 0)); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lg; ctx.fillRect(px - 700, py - 700, 1400, 1400); ctx.globalCompositeOperation = 'source-over';
      motes(ctx, t, 90, [300, 760, 1400, 400], { seed: 12, a: .8, inFn: (x, y) => clamp(1 - Math.abs(x - mix(1300, 600, (y - 860) / 300)) / 450) * (y > 840 ? 1 : 0) });
      ctx.restore(); ctx.restore();
    }
    // speed smear on the fastest part of the push (proxy motion blur)
    const sp = quart(lin(tm.push0, tm.push1, t + 1 / 60)) - quart(lin(tm.push0, tm.push1, t - 1 / 60));
    if (sp > .015) { const [c2, g2] = scratch('smear'); g2.drawImage(ctx.canvas, 0, 0); ctx.save(); ctx.globalAlpha = Math.min(.4, sp * 5); ctx.translate(sx, sy); ctx.scale(1.035, 1.035); ctx.translate(-sx, -sy); ctx.drawImage(c2, 0, 0); ctx.restore(); }
    fin(ctx, { vig: .3 });
  };
}
// ================================================================ 0.04 the harbour front: the wave of windows
export function harbourWave(tm) {
  return (ctx, t, s) => {
    const hc = hcam04(t, tm.h0), k = ein(lin(tm.in0, s.b, t));
    const wn = tm.win; const cam = { ...hc, x: mix(hc.x, wn.x, k * .8), y: mix(hc.y, wn.y, k * .8), z: hc.z * (1 + 1.4 * k) };
    drawHarbour(ctx, t, cam, 'blue', { ign: sm(lin(tm.wave, tm.wave + 1.25, t)), cx: 960 });
    fin(ctx, { vig: .25 });
  };
}
// ================================================================ 0.05 a hand turns a single page; it folds into a paper boat and leaves right
const PAGE = [[-150, -200], [0, -200], [150, -200], [150, 0], [150, 200], [0, 200], [-150, 200], [-150, 0]];
const BOAT = [[-55, -14], [0, -130], [55, -14], [128, -14], [88, 44], [0, 46], [-88, 44], [-128, -14]];
export function boatShape(g, cx, cy, s, m, rot = 0, { a = 1, lit = 1, lines = true } = {}) {
  const pts = PAGE.map((p, i) => [mix(p[0], BOAT[i][0], m), mix(p[1], BOAT[i][1], m)]);
  g.save(); g.translate(cx, cy); g.rotate(rot); g.scale(s, s); g.globalAlpha = a;
  g.fillStyle = mixHex('#d8c8a8', '#fff3dc', lit); g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.closePath(); g.fill();
  if (m > .2) { g.strokeStyle = rgba('#a08a6a', .7 * m); g.lineWidth = 1.6 / s; g.beginPath(); g.moveTo(pts[7][0], pts[7][1]); g.lineTo(pts[3][0], pts[3][1]); g.moveTo(pts[1][0], pts[1][1]); g.lineTo(pts[5][0], pts[5][1] - 40 * m); g.stroke();
    g.fillStyle = rgba('#c8b490', .55 * m); g.beginPath(); g.moveTo(...pts[1]); g.lineTo(...pts[2]); g.lineTo(pts[5][0], pts[5][1] - 40 * m); g.closePath(); g.fill();
    g.fillStyle = rgba('#b8a078', .35 * m); g.beginPath(); g.moveTo(...pts[7]); g.lineTo(...pts[3]); g.lineTo(...pts[4]); g.lineTo(...pts[6]); g.closePath(); g.fill(); }
  else if (lines) { g.strokeStyle = rgba('#8a7a6a', .35); g.lineWidth = 1.4 / s; for (let i = 0; i < 11; i++) { g.beginPath(); g.moveTo(-115, -150 + i * 30); g.lineTo(115 - (i === 10 ? 110 : (i * 37) % 50), -150 + i * 30); g.stroke(); } }
  g.strokeStyle = rgba(K.amber, .7 * lit); g.lineWidth = 2 / s; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.closePath(); g.stroke();
  g.restore();
}
export function pageTurn(tm) {
  const P = () => once('o05', () => ({ back: bake(-200, -200, W + 400, H + 400, (g) => {
    skyFill(g, [[0, '#1a0a08'], [1, '#3a1a10']], -200, -200, W + 400, H + 400);
    const tbl = [[-200, 180], [W + 200, 140], [W + 200, H + 200], [-200, H + 200]]; roughPoly(g, tbl, '#6a3418', { amp: 1.5, seed: 3 });
    g.save(); g.beginPath(); roughPath(g, tbl, { amp: 1.5, seed: 3 }); g.clip(); strokes(g, 80, (i, q) => [mix(-200, W + 200, q), 180 + i * 13 + Math.sin(q * 5 + i * .3) * 5 - q * 30], { w: 1.3, col: '#3a1608', a: .55, seed: 4 }); hatch(g, [-200, 140, W + 400, 1300], { angle: .35, gap: 7, w: 1, col: '#1a0804', a: .3, seed: 5 }); g.restore();
    // the lamp's warm pool on the table (the hero light), stippled, and its bloom from upper left
    pool(g, 860, 600, 1200, 560, { col: K.amber, a: .6, k: .7, seed: 6 });
    bloom(g, 300, -160, 800, { col: K.amber, core: K.hot, a: .45, k: .5, seed: 7 });
    // a cup, a pencil, a folded pair of glasses
    g.fillStyle = 'rgba(10,2,0,.45)'; g.beginPath(); g.ellipse(1560, 330, 110, 28, 0, 0, 7); g.fill(); g.fillStyle = '#d8b08a'; g.beginPath(); g.ellipse(1540, 306, 96, 28, 0, 0, 7); g.fill(); g.fillStyle = '#4a2010'; g.beginPath(); g.ellipse(1540, 302, 78, 19, 0, 0, 7); g.fill();
    g.strokeStyle = rgba(K.hot, .6); g.lineWidth = 2; g.beginPath(); g.ellipse(1540, 306, 96, 28, 0, Math.PI * 1.1, Math.PI * 1.7); g.stroke();
    roughLine(g, [[260, 960], [600, 880]], { w: 11, col: '#d88a3a', seed: 2 }); roughLine(g, [[580, 884], [630, 872]], { w: 7, col: '#2a1a10', seed: 3 });
    g.fillStyle = 'rgba(10,2,0,.4)'; g.beginPath(); g.ellipse(900, 830, 330, 60, -.05, 0, 7); g.fill();
  }) }));
  return (ctx, t, s) => {
    const L = P(), b = breathe(t, .7, 4);
    const cam = { x: 960 + b.dx, y: 560 + b.dy, z: 1.05 + .04 * lin(s.a, s.b, t) };
    lay(ctx, L.back, cam, 1);
    ctx.save(); camApply(ctx, cam, 1);
    const lift = sm(lin(s.a + .05, tm.month - .2, t)), flip = eio(lin(tm.month - .25, tm.month + .2, t)), fold = eio(lin(tm.month + .1, tm.month + .55, t)), go = ein(lin(tm.exit - .45, tm.exit + .05, t));
    // the page lies flat (foreshortened); its right edge lifts, it turns over its left edge, rises, and folds
    const flat = mix(.46, 1, sm(flip)), cx = 880 + 300 * fold + 1500 * go, cy = 690 - 190 * sm(flip) - 60 * fold, rot = -.05 + .06 * Math.sin(t * 2.3) * fold;
    if (fold <= 0) {
      const sxk = Math.cos(Math.PI * flip), hinge = 730;
      ctx.save(); ctx.translate(hinge, cy); ctx.scale(sxk, flat * (1 - .06 * lift)); ctx.transform(1, 0, -.18 * (1 - flip), 1, 0, 0); ctx.translate(-hinge, -cy);
      boatShape(ctx, 880, cy, 1.0, 0, -.04, { lit: .7 + .3 * Math.abs(sxk), lines: sxk > 0 });
      ctx.restore();
    } else { ctx.save(); ctx.translate(cx, cy); ctx.scale(1, mix(flat, 1, fold)); ctx.translate(-cx, -cy); boatShape(ctx, cx, cy, 1.0 - .3 * fold, fold, rot, { lit: 1 }); ctx.restore(); }
    addGlow(ctx, cx, cy, 380, .22 * (1 - go), K.amber, K.hot);
    // the hand (from the right) lifts the corner, turns the page, then withdraws
    const away = sm(lin(tm.month + .05, tm.month + .6, t));
    const hx = mix(1180, 1035, lift) - 240 * flip + 520 * away, hy = mix(820, 760, lift) - 120 * flip + 160 * away;
    ctx.fillStyle = '#8a3e22'; capsule(ctx, hx + 50, hy + 16, 34, hx + 700, hy + 300, 52);
    ctx.fillStyle = rgba(K.hot, .35); capsule(ctx, hx + 50, hy + 4, 20, hx + 700, hy + 270, 30);
    hand(ctx, hx, hy, Math.PI + .45 - .3 * flip, 2.3, { curl: .35 + .25 * lift - .2 * flip, col: '#d8a07a', lit: .7, rim: rgba(K.hot, .8) });
    ctx.restore();
    fin(ctx, { vig: .35 });
  };
}

// ================================================================ 0.06 the paper boat drifts through four seasons
const SEASONS = [
  { sky: [[0, '#7aa0d0'], [.7, '#f4dcd0'], [1, '#fff0e0']], hill: '#86a676', hill2: '#5a8a5a', tree: '#8ac070', tree2: '#5a9a50', bloom: '#f8c0d0', ground: '#5a8a4a', water: ['#a8c8dc', '#3a5a7a'], sun: '#fff6e0', light: '#fff0d0' },
  { sky: [[0, '#3a78c8'], [.7, '#c8d8e0'], [1, '#ffe8b0']], hill: '#5a8a4a', hill2: '#3a6a3a', tree: '#2e7a3a', tree2: '#1a5a2a', bloom: null, ground: '#3a6a2a', water: ['#80b0d0', '#1e3e66'], sun: '#fff0b0', light: '#ffe8a0' },
  { sky: [[0, '#5a4a7a'], [.7, '#e8a070'], [1, '#ffc880']], hill: '#9a6a40', hill2: '#7a4a30', tree: '#e0783a', tree2: '#b84a2a', bloom: '#f8b040', ground: '#6a4426', water: ['#b88a70', '#3a2a40'], sun: '#ffd080', light: '#ffb060' },
  { sky: [[0, '#3a4a7a'], [.7, '#b8c4dc'], [1, '#e8ecf4']], hill: '#c4ccdc', hill2: '#9aa6c0', tree: '#4a4a5a', tree2: '#3a3a4a', bloom: '#ffffff', ground: '#eef0f6', water: ['#8a98b8', '#24304a'], sun: '#f4f6ff', light: '#e0e8ff' },
];
function tree(g, r, x, y, h, S, winter) {
  limb(g, qpts([x, y + 4], [x + (r() - .5) * 20, y - h * .5], [x + (r() - .5) * 30, y - h * .78]), 16 * h / 200, 5, winter ? '#3a3a4a' : '#2a1e16', Math.round(x));
  for (let k = 0; k < 4; k++) limb(g, qpts([x, y - h * .5], [x + (r() - .5) * 60, y - h * .7], [x + (r() - .5) * 140, y - h * (.85 + r() * .2)]), 6, 1.5, winter ? '#3a3a4a' : '#2a1e16', k + Math.round(x));
  if (winter) { g.fillStyle = 'rgba(255,255,255,.85)'; for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(x + (r() - .5) * h * .6, y - h * (.7 + r() * .3), 10, 3, 0, 0, 7); g.fill(); } g.beginPath(); g.ellipse(x, y - 2, 36, 7, 0, 0, 7); g.fill(); return; }
  // canopy: lobes of rough blobs, lit on the sun side, darker below, a rim
  const parts = []; for (let k = 0; k < 9; k++) { const a = r() * 6.283, d = Math.sqrt(r()) * h * .3; parts.push([x + Math.cos(a) * d, y - h * .82 + Math.sin(a) * d * .6, h * (.14 + r() * .1)]); }
  const blob = (bx, by, br, seed) => { g.beginPath(); roughPath(g, Array.from({ length: 22 }, (_, i) => { const a = i / 22 * 6.283; return [bx + Math.cos(a) * br * (1 + .14 * Math.sin(a * 3 + seed)), by + Math.sin(a) * br * .78]; }), { amp: 2, step: 7, seed }); g.fill(); };
  g.fillStyle = shade(S.tree2, -.04); for (const [i, [bx, by, br]] of parts.entries()) blob(bx + 3, by + 4, br, i);
  for (const [i, [bx, by, br]] of parts.entries()) { const lg = g.createLinearGradient(bx + br, by - br, bx - br, by + br); lg.addColorStop(0, S.light); lg.addColorStop(.25, S.tree); lg.addColorStop(1, S.tree2); g.fillStyle = lg; blob(bx, by, br, i); }
  if (S.bloom) for (let k = 0; k < 50; k++) { g.fillStyle = rgba(S.bloom, .55 + .45 * r()); g.beginPath(); g.arc(x + (r() - .5) * h * .7, y - h * (.65 + r() * .4), 1.5 + r() * 3, 0, 7); g.fill(); }
}
function seasonBank(i) {
  return once('season' + i, () => {
    const S = SEASONS[i], r = prng(30 + i), n = vnoise(5);
    return bake(-300, -200, W + 1400, H + 400, (g) => {
      skyFill(g, S.sky, -300, -200, W + 1400, 820);
      { const rg = g.createRadialGradient(1500, 160, 0, 1500, 160, 900); rg.addColorStop(0, rgba(S.sun, .8)); rg.addColorStop(.2, rgba(S.sun, .3)); rg.addColorStop(1, rgba(S.sun, 0)); g.fillStyle = rg; g.fillRect(-300, -200, W + 1400, 900); }
      strata(g, [[180, -200, 900, 14], [250, 700, 2100, 18], [120, 1600, 2600, 10]], { fill: '#ffffff', fa: .3, line: '#ffffff', la: .45, seed: 3 + i });
      { const pts = [[-300, 700]]; for (let x = -300; x <= W + 1100; x += 10) pts.push([x, 500 - 140 * fbm(n, x * .0018, 1, 4)]); pts.push([W + 1100, 700]); roughPoly(g, pts, S.hill, { amp: 1.5, seed: 3 }); }
      fog(g, { y0: 360, y1: 600, col: '#ffffff', a: .3, seed: 7 + i, cover: .6, soft: .5, k: .3 });
      { const pts = [[-300, 700]]; for (let x = -300; x <= W + 1100; x += 10) pts.push([x, 580 - 60 * fbm(n, x * .003, 2, 3)]); pts.push([W + 1100, 700]); roughPoly(g, pts, S.hill2, { amp: 1.5, seed: 4 }); }
      { const pts = [[-300, 760]]; for (let x = -300; x <= W + 1100; x += 10) pts.push([x, 650 - 26 * fbm(n, x * .004, 3, 3)]); pts.push([W + 1100, 760]); roughPoly(g, pts, S.ground, { amp: 1.5, seed: 5 }); }
      for (let x = -260; x < W + 1100; x += 150 + r() * 170) { const y = 650 - 26 * fbm(n, x * .004, 3, 3), h = 150 + r() * 130; tree(g, r, x, y, h, S, i === 3); }
      const lg = g.createLinearGradient(0, 690, 0, H + 200); lg.addColorStop(0, S.water[0]); lg.addColorStop(1, S.water[1]); g.fillStyle = lg; g.fillRect(-300, 688, W + 1400, H + 200 - 688);
      g.fillStyle = rgba('#000000', .2); g.fillRect(-300, 688, W + 1400, 6);
      for (let k = 0; k < 1100; k++) { const y = 698 + Math.pow(r(), 1.3) * 520; g.fillStyle = rgba(r() < .3 ? S.sun : '#ffffff', .08 + .18 * r()); g.fillRect(-300 + r() * (W + 1400), y, 20 + r() * 80, 1.4); }
      hatch(g, [-300, 700, W + 1400, 600], { angle: 0, gap: 9, w: 1, col: '#000000', a: .1, seed: 8, broken: .5 });
    }, .75);
  });
}
export function boatSeasons(tm) {
  const ts = [tm.t0, tm.t0 + .3, tm.t0 + .62, tm.t0 + .92];
  return (ctx, t, s) => {
    const b = breathe(t, .6, 5), u = lin(s.a, s.b, t);
    const cam = { x: 900 + 1000 * u + b.dx, y: 540 + b.dy, z: 1.05 };
    for (let i = 0; i < 4; i++) { const a = i === 0 ? 1 : sm(lin(ts[i] - .14, ts[i] + .14, t)); if (a <= 0) continue; ctx.save(); ctx.globalAlpha = a; lay(ctx, seasonBank(i), cam, .7); ctx.restore(); }
    const season = t < ts[1] ? 0 : t < ts[2] ? 1 : t < ts[3] ? 2 : 3, r = prng(77);
    if (season !== 1) for (let k = 0; k < 140; k++) { const x0 = r() * (W + 600) - 300, sp = 60 + r() * 120, y = ((r() * H + (t - tm.t0) * sp) % (H + 100)) - 50, x = x0 - (t - tm.t0) * 220 * (.3 + r()) + Math.sin(t * 2 + k) * 20;
      ctx.fillStyle = season === 0 ? rgba('#f8c8d8', .8) : season === 2 ? rgba(r() < .5 ? '#e8743a' : '#f0a040', .9) : rgba('#ffffff', .85); ctx.beginPath(); ctx.ellipse(((x % (W + 200)) + W + 200) % (W + 200) - 100, y, season === 3 ? 2.6 : 5, 2.6, t * 3 + k, 0, 7); ctx.fill(); }
    const go = ein(lin(tm.exit - .45, tm.exit + .1, t)), bx = mix(-80, 760, eout(lin(s.a, s.a + .6, t))) + 280 * u + 1500 * go, by = 830 + Math.sin(t * 3) * 6;
    ctx.save(); ctx.fillStyle = 'rgba(0,10,30,.25)'; ctx.beginPath(); ctx.ellipse(bx, by + 44, 120, 10, 0, 0, 7); ctx.fill(); ctx.restore();
    boatShape(ctx, bx, by, .9, 1, Math.sin(t * 2.4) * .05, { lit: 1 });
    ctx.save(); ctx.globalAlpha = .25; ctx.scale(1, -1); boatShape(ctx, bx, -(by + 88), .9, 1, -Math.sin(t * 2.4) * .05, { lit: .6 }); ctx.restore();
    ctx.strokeStyle = rgba('#ffffff', .45); ctx.lineWidth = 1.5; for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.moveTo(bx - 110 - k * 40, by + 44 + k * 3); ctx.lineTo(bx - 140 - k * 70, by + 46 + k * 5); ctx.stroke(); }
    ctx.save(); const rr = prng(4), ox = -(cam.x - 900) * 1.4; for (let k = 0; k < 46; k++) { const x = ((rr() * 3600 + ox) % 3600 + 3600) % 3600 - 300, h = 120 + rr() * 220, sw = Math.sin(t * 1.5 + k) * 10; ctx.fillStyle = mixHex(rr() < .5 ? '#1a2a1a' : '#2a3a1a', '#4a5468', season === 3 ? 1 : 0); ctx.beginPath(); ctx.moveTo(x, H + 10); ctx.quadraticCurveTo(x + 8 + sw * .5, H - h * .6, x + 14 + sw, H - h); ctx.quadraticCurveTo(x + 14 + sw * .5, H - h * .5, x + 22, H + 10); ctx.fill(); } ctx.restore();
    fin(ctx, { vig: .3 });
  };
}



// ================================================================ 0.07 the horizon becomes a thread of light that outruns the camera
// the head enters from the left (continuing the boat's motion), overtakes the camera, flares on "rest", then bends up and leaves the top.
export function horizonThread(tm) {
  const P = () => once('o07', () => ({ back: bake(-400, -500, W + 2400, H + 900, (g) => {
    skyFill(g, [[0, '#03051a'], [.55, '#0d1236'], [.85, '#1e2452'], [1, '#2c2c5e']], -400, -500, W + 2400, 1060);
    starField(g, -400, -500, W + 2400, 960, 900, 8, .9);
    { const rg = g.createRadialGradient(1800, 560, 0, 1800, 560, 1400); rg.addColorStop(0, rgba('#8a6aa8', .3)); rg.addColorStop(1, rgba('#8a6aa8', 0)); g.fillStyle = rg; g.fillRect(-400, -500, W + 2400, 1060); }
    // a far coast with a few sleeping lights, low on the horizon
    { const n = vnoise(6), pts = [[-400, 560]]; for (let x = -400; x <= W + 2000; x += 10) pts.push([x, 560 - 26 * fbm(n, x * .002, 1, 3) * clamp(Math.sin(x * .0011) * 1.5)]); pts.push([W + 2000, 560]); roughPoly(g, pts, '#0a0c2a', { amp: 1, seed: 3 }); const r = prng(3); for (let k = 0; k < 40; k++) { g.fillStyle = rgba(K.hot, .5 * r()); g.fillRect(-400 + r() * (W + 2400), 552 + r() * 6, 2, 2); } }
    const lg = g.createLinearGradient(0, 560, 0, H + 400); lg.addColorStop(0, '#121640'); lg.addColorStop(1, '#03040e'); g.fillStyle = lg; g.fillRect(-400, 560, W + 2400, H + 400);
    const r = prng(5); for (let k = 0; k < 2400; k++) { const y = 562 + Math.pow(r(), 1.6) * 900, d = (y - 560) / 900; g.fillStyle = rgba(r() < .2 ? '#cfd8ff' : '#6f8cbc', (.04 + .14 * r()) * (1 - d * .5)); g.fillRect(-400 + r() * (W + 2400), y, (10 + r() * 50) * (1 + d * 3), 1 + d * 2); }
  }, .5) }));
  return (ctx, t, s) => {
    const L = P(), b = breathe(t, .6, 6), up = ein(lin(tm.bend + .2, tm.exit + .1, t));
    const camX = 960 + 700 * lin(s.a, tm.exit, t);
    const cam = { x: camX + b.dx, y: 540 + b.dy - 260 * up, z: 1 };
    lay(ctx, L.back, cam, .6);
    ctx.save(); camApply(ctx, cam, .6);
    const hz = 560, x0 = camX - 2400;
    // head position: from off-screen left to ahead of the camera; then the line lifts off in an arc
    const run = eout(lin(s.a - .25, tm.bend, t)), headRun = mix(camX - 1500, camX + 330, run) + 120 * lin(tm.bend, tm.exit, t);
    const bendK = sm(lin(tm.bend - .1, tm.exit - .3, t)), rise = 1500 * Math.pow(lin(tm.bend, tm.exit + .1, t), 1.6);
    const pts = []; const bx = headRun - 260 * bendK;
    for (let x = x0; x <= bx; x += 14) pts.push([x, hz]);
    for (let k = 1; k <= 30; k++) { const q = k / 30; pts.push([bx + 260 * bendK * Math.sin(q * Math.PI / 2) + 120 * q * bendK, hz - rise * q * q]); }
    const flare = 1 + 1.6 * bell(t, tm.rest, .2);
    const path = () => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba(K.amber, .1 * flare); ctx.lineWidth = 46; path(); ctx.stroke();
    ctx.strokeStyle = rgba(K.amber, .28 * flare); ctx.lineWidth = 10; path(); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = rgba(K.cream, .95); ctx.lineWidth = 2.6; path(); ctx.stroke();
    const hp = pts[pts.length - 1]; addGlow(ctx, hp[0], hp[1], 110 * flare, .95, K.amber, K.cream);
    // streak behind the head (speed)
    ctx.globalCompositeOperation = 'lighter'; const g2 = ctx.createLinearGradient(hp[0] - 600, 0, hp[0], 0); g2.addColorStop(0, rgba(K.hot, 0)); g2.addColorStop(1, rgba(K.hot, .5)); if (bendK < .3) { ctx.fillStyle = g2; ctx.fillRect(hp[0] - 600, hz - 3, 600, 6); }
    const rr = prng(9); for (let k = 0; k < 220; k++) { const x = x0 + rr() * (bx - x0), y = hz + 6 + Math.pow(rr(), 2) * 260; ctx.fillStyle = rgba(K.amber, .28 * rr() * (1 - (y - hz) / 280)); ctx.fillRect(x + drift(t, 5, k), y, 8 + rr() * 34, 1.4); }
    ctx.restore();
    fin(ctx, { vig: .35 });
  };
}

// ================================================================ 0.08/0.09 you on the bed; the coat of the years slides off; "Ever." floods the room
export function bedroomCoat(tm) {
  return (ctx, t, s) => {
    const Bb = bedroom('blue'), Bg = bedroom('gold'), b = breathe(t, .8, 7);
    const ever = tm.ever, punch = t >= ever - .02 ? 1 : 0;
    const flood = eout(lin(ever - .06, ever + .5, t)), swing = eio(lin(tm.swing, tm.exit, t));
    const zA = 1.0 + .05 * sine(lin(tm.t0, ever, t)), zB = 1.34 + .06 * sine(lin(ever, tm.exit, t));
    const cam = punch ? { x: 1040 + b.dx, y: 600 + b.dy, z: zB } : { x: 980 + b.dx, y: 560 + b.dy, z: zA + b.dz };
    const hcam = { x: 960, y: 600, z: .56, sx: toScreen(cam, 1, F_PUSH[0], F_PUSH[1])[0], sy: toScreen(cam, 1, F_PUSH[0], F_PUSH[1])[1] };
    hcam.z = .56 * cam.z;
    drawHarbour(ctx, t, hcam, flood > .5 ? 'gold' : 'blue', { ign: flood > .5 ? 0 : 1 });
    lay(ctx, Bb.room, cam, 1); lay(ctx, Bb.patch, cam, 1, { op: 'lighter', a: .8 });
    // the flood: the gold room grows out of the light patch on the floor
    if (flood > 0) {
      const [c2, g2] = scratch('flood'); camApply(g2, cam, 1);
      const sb = Bg.room; g2.drawImage(sb.c, sb.ox, sb.oy); g2.globalCompositeOperation = 'lighter'; g2.drawImage(Bg.patch.c, Bg.patch.ox, Bg.patch.oy);
      g2.globalCompositeOperation = 'destination-in'; const R = 40 + 2600 * flood; const rg = g2.createRadialGradient(1000, 960, 0, 1000, 960, R); rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(.8, 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); g2.fillStyle = rg; g2.fillRect(-2000, -2000, 6000, 6000);
      ctx.drawImage(c2, 0, 0);
    }
    ctx.save(); camApply(ctx, cam, 1);
    // the coat: slides off the shoulders on "don't", lands on the floor as a dark shadow, which the light swallows
    const off = eio(lin(tm.dont - .1, tm.dont + .9, t));
    const shadowA = sm(lin(tm.dont + .6, tm.dont + 1.0, t)) * (1 - flood);
    if (shadowA > 0) { ctx.fillStyle = rgba('#03030c', .75 * shadowA); ctx.beginPath(); roughPath(ctx, [[620, 900], [880, 880], [1000, 930], [940, 990], [700, 1000], [560, 960]], { amp: 4, seed: 4 }); ctx.fill(); }
    curtain(ctx, t, { a: .16 + .12 * flood, swing, col: flood > .3 ? '#fff0d0' : K.cream });
    sitter(ctx, t, { coat: 1 - off, exhale: bell(t, tm.dont + .3, .35), warm: flood, look: .25 * sm(lin(ever, ever + .6, t)) });
    // the flash of the 3-frame accent on "Ever"
    const fl = clamp(1 - Math.abs(t - ever - .03) / .07);
    if (fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(K.hot, .35 * fl); ctx.fillRect(-2000, -2000, 6000, 6000); ctx.restore(); }
    motes(ctx, t, 110, [200, 300, 1700, 800], { seed: 13, a: .9 * flood + .3, col: K.hot });
    ctx.restore();
    fin(ctx, { vig: .28 });
  };
}

// ================================================================ 0.10 you at the open window, small, over the bay (gold morning)
export function openWindow(tm) {
  const P = () => once('o10', () => ({ wall: bake(-300, -300, 1500, H + 600, (g) => {
    const wq = [[-300, -300], [900, -300], [980, H + 300], [-300, H + 300]];
    roughPoly(g, wq, '#d8a070', { amp: 2, seed: 3 });
    g.save(); g.beginPath(); roughPath(g, wq, { amp: 2, seed: 3 }); g.clip();
    const lg = g.createLinearGradient(-300, 0, 980, 0); lg.addColorStop(0, rgba('#5a2a2a', .6)); lg.addColorStop(1, rgba('#fff0cc', .25)); g.fillStyle = lg; g.fillRect(-300, -300, 1300, H + 600);
    hatch(g, [-300, -300, 700, H + 600], { angle: -1.1, gap: 7, w: 1, col: '#5a2a1a', a: .3, seed: 4 });
    strokes(g, 30, (i, q) => [mix(-300, 960, q), -200 + i * 50 + Math.sin(q * 4 + i) * 6], { w: 1, col: '#b07850', a: .3, seed: 5 });
    // the window opening with the dark room behind and the open casements
    roughRect(g, 360, 300, 380, 470, '#3a1c18', { amp: 1.2, seed: 6 });
    const rg = g.createLinearGradient(360, 300, 740, 770); rg.addColorStop(0, '#2a1210'); rg.addColorStop(1, '#5a2a1c'); g.fillStyle = rg; g.fillRect(372, 312, 356, 446);
    roughPoly(g, [[740, 300], [880, 330], [880, 740], [740, 770]], '#e8c49a', { amp: .8, seed: 7 }); roughPoly(g, [[756, 320], [866, 344], [866, 726], [756, 752]], rgba('#fff3dc', .5), { amp: .5, seed: 8 });
    roughRect(g, 340, 760, 420, 22, '#f0d0a0', { amp: .8, seed: 9 }); g.fillStyle = 'rgba(60,20,10,.4)'; g.fillRect(340, 782, 420, 14);
    // flower box
    roughRect(g, 370, 726, 360, 36, '#7a3a24', { amp: .8, seed: 10 }); const r = prng(3); for (let k = 0; k < 60; k++) { g.fillStyle = r() < .5 ? '#3a5a2a' : (r() < .5 ? '#e8553a' : '#ffb35c'); g.beginPath(); g.arc(380 + r() * 340, 720 - r() * 40, 4 + r() * 6, 0, 7); g.fill(); }
    g.restore();
  }) }));
  return (ctx, t, s) => {
    const L = P(), b = breathe(t, .7, 8), u = lin(s.a, s.b, t);
    const cam = { x: 980 + b.dx - 40 * sine(u), y: 520 + b.dy + 20 * ein(lin(tm.exit - .5, tm.exit, t)), z: 1.0 + .05 * sine(u) };
    drawHarbour(ctx, t, { x: 700 + (cam.x - 980) * .4, y: 520, z: .8, sx: 1300 }, 'gold', { ign: 0 });
    lay(ctx, L.wall, cam, 1.1);
    ctx.save(); camApply(ctx, cam, 1.1);
    const turn = sm(lin(tm.dox - .3, tm.dox + .1, t));
    person(ctx, 560, 700, 1.25, { lean: .25 + .01 * Math.sin(t * 2), head: .1 + .5 * turn, sh: [.9, .7], el: [.6, .5], hip: [0, 0], kn: [0, 0], hair: 'bun' }, { dress: { coat: '#e59a3a', pants: '#2a1a1a', skin: '#e0b090', hair: '#2a1a14' }, light: { x: 1600, y: 200, col: '#fff3dc', a: .6 }, rim: '#fff0cc', rimSide: 1, rimW: 2 });
    roughRect(ctx, 340, 760, 420, 22, '#f0d0a0', { amp: .8, seed: 9 });
    ctx.restore();
    bloom(ctx, 1500, 120, 500, { col: K.gold, core: K.cream, a: .0, k: 0 }); // (no-op placeholder kept cheap)
    addGlow(ctx, 1600, 150, 700, .35, K.gold, K.cream);
    fin(ctx, { vig: .2 });
  };
}

// ================================================================ 0.11 sleep in: a pillow, sunlight slides across as the hours pass
export function pillow(tm) {
  const P = () => once('o11', () => ({ bed: bake(-300, -300, W + 600, H + 600, (g) => {
    g.fillStyle = '#e2c090'; g.fillRect(-300, -300, W + 600, H + 600);
    strokes(g, 60, (i, q) => [mix(-300, W + 300, q), -300 + i * 30 + Math.sin(q * 6 + i * .4) * 20], { w: 2, col: '#c8986a', a: .4, seed: 3 });
    // pillow, with its shadow and seam
    g.save(); g.filter = 'blur(18px)'; g.fillStyle = 'rgba(90,40,20,.45)'; g.beginPath(); g.ellipse(560, 470, 500, 300, -.05, 0, 7); g.fill(); g.restore();
    const pil = Array.from({ length: 40 }, (_, i) => { const a = i / 40 * 6.283; return [530 + Math.cos(a) * 480 * (1 + .05 * Math.cos(a * 4)), 420 + Math.sin(a) * 285 * (1 + .06 * Math.sin(a * 3))]; });
    roughPoly(g, pil, '#f8ead0', { amp: 3, seed: 4 });
    g.save(); g.beginPath(); roughPath(g, pil, { amp: 3, seed: 4 }); g.clip(); strokes(g, 16, (i, q) => [mix(120, 940, q), 260 + i * 22 + Math.sin(q * 3 + i) * 12], { w: 1.6, col: '#d8b888', a: .45, seed: 5 }); hatch(g, [50, 450, 1000, 300], { angle: .4, gap: 6, w: 1, col: '#a87a50', a: .25, seed: 6 }); g.restore();
    // a head of curls seen from above, warm highlights toward the window (upper right)
    g.save(); g.filter = 'blur(10px)'; g.fillStyle = 'rgba(60,20,10,.5)'; g.beginPath(); g.ellipse(600, 470, 170, 130, -.3, 0, 7); g.fill(); g.restore();
    const r = prng(7); g.fillStyle = '#2a1610'; g.beginPath(); g.ellipse(570, 420, 150, 118, -.3, 0, 7); g.fill();
    for (let k = 0; k < 140; k++) { const a = r() * 6.283, d = Math.sqrt(r()), x = 570 + Math.cos(a) * 150 * d, y = 420 + Math.sin(a) * 118 * d, lit = clamp((Math.cos(a) * .6 - Math.sin(a) * .8) * d); g.fillStyle = mixHex('#2a1610', '#a8643a', lit * .8 * r()); g.beginPath(); g.arc(x, y, 9 + r() * 12, 0, 7); g.fill(); g.strokeStyle = rgba('#d89058', .35 * lit); g.lineWidth = 1.4; g.beginPath(); g.arc(x, y, 7 + r() * 8, -2.2, -.4); g.stroke(); }
    // a hand out from under the duvet, near the pillow
    // duvet over the rest, in folds
    const dv = [[760, 600], [W + 300, 360], [W + 300, H + 300], [-300, H + 300], [-300, 780], [300, 720]]; roughPoly(g, dv, '#d8925e', { amp: 4, seed: 8 });
    g.save(); g.beginPath(); roughPath(g, dv, { amp: 4, seed: 8 }); g.clip(); strokes(g, 44, (i, q) => [mix(-300, W + 300, q), 640 + i * 22 - q * 220 + Math.sin(q * 8 + i * .6) * 26], { w: 2.2, col: '#a8663a', a: .5, seed: 9 }); hatch(g, [-300, 500, W + 600, 900], { angle: .6, gap: 7, w: 1, col: '#6a3416', a: .25, seed: 10 }); g.restore();
    g.strokeStyle = rgba('#fff0d0', .5); g.lineWidth = 2; g.beginPath(); g.moveTo(300, 720); g.lineTo(760, 600); g.lineTo(W + 300, 360); g.stroke();
  }) }));
  return (ctx, t, s) => {
    const L = P(), b = breathe(t, .5, 9), u = lin(s.a, s.b, t);
    const wave = ein(lin(tm.exit - .45, tm.exit, t));
    const cam = { x: 960 + b.dx + 60 * u + 200 * wave, y: 540 + b.dy, z: 1.08 + .04 * u };
    lay(ctx, L.bed, cam, 1);
    ctx.save(); camApply(ctx, cam, 1);
    // hand peeking out next to the pillow
    hand(ctx, 840, 640, -.4, 1.6, { curl: .55 + .05 * Math.sin(t * 1.2), col: '#d8a07a', lit: .3 });
    // the window light: four panes, sliding across, warming as the hours pass (time-lapse)
    const k = sine(u), lx = mix(1500, 150, k), ly = mix(260, 520, k), col = mixHex('#fff4d8', '#ff9a40', k);
    ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = mixHex('#c8a0c0', '#b07a8a', k); ctx.fillRect(-500, -500, W + 1000, H + 1000);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const x = lx + i * 330 + j * 60, y = ly + j * 260 - i * 30; ctx.fillStyle = rgba(col, .55); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 300, y - 40); ctx.lineTo(x + 360, y + 200); ctx.lineTo(x + 60, y + 240); ctx.closePath(); ctx.fill(); }
    motes(ctx, t, 60, [lx - 100, ly - 100, 900, 700], { seed: 5, a: .7, col: '#fff0d0' });
    ctx.globalCompositeOperation = 'source-over';
    // breathing: the duvet rises and falls; at the end a wave runs through it to the right
    ctx.strokeStyle = rgba('#7a3a18', .3); ctx.lineWidth = 3; for (let k2 = 0; k2 < 6; k2++) { ctx.beginPath(); for (let x = -300; x < W + 300; x += 20) { const ph = (x - (cam.x - 960)) * .01 - wave * 30; ctx.lineTo(x, 760 + k2 * 70 - x * .1 + Math.sin(ph + k2) * (6 + 30 * wave) + Math.sin(t * 1.6) * 4); } ctx.stroke(); }
    ctx.restore();
    fin(ctx, { vig: .3 });
  };
}

// ================================================================ 0.12 travel: a small ferry on the swell, you at the rail, gulls
function gull(g, x, y, s, flap, a = 1, col = '#1a1a2a') { g.save(); g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = 3 * s; g.lineCap = 'round'; const f = Math.sin(flap) * 10 * s; g.beginPath(); g.moveTo(x - 22 * s, y - f); g.quadraticCurveTo(x - 9 * s, y - 10 * s - f * .4, x, y); g.quadraticCurveTo(x + 9 * s, y - 10 * s - f * .4, x + 22 * s, y - f); g.stroke(); g.restore(); }
export function ferry(tm) {
  const P = () => once('o12', () => ({ sky: bake(-400, -300, W + 800, H + 600, (g) => {
    skyFill(g, [[0, '#4a7ab8'], [.5, '#a8c0d8'], [.75, '#ffe0a8'], [1, '#ffd08a']], -400, -300, W + 800, 900);
    strata(g, [[220, -200, 900, 18], [300, 800, 2000, 14]], { fill: '#ffffff', fa: .4, line: '#ffffff', la: .5, seed: 3 });
    { const n = vnoise(4); const pts = [[-400, 610]]; for (let x = -400; x <= W + 400; x += 10) pts.push([x, 590 - 40 * fbm(n, x * .003, 1, 3) * clamp(1 - Math.abs(x - 300) / 900)]); pts.push([W + 400, 610]); roughPoly(g, pts, '#7a8aa8', { amp: 1.5, seed: 5 }); }
    const lg = g.createLinearGradient(0, 600, 0, H + 300); lg.addColorStop(0, '#5a8ab8'); lg.addColorStop(1, '#1a3a6a'); g.fillStyle = lg; g.fillRect(-400, 600, W + 800, H + 300);
    const r = prng(6); for (let k = 0; k < 1600; k++) { const y = 604 + Math.pow(r(), 1.5) * 800, d = (y - 600) / 800; g.fillStyle = rgba(r() < .4 ? '#ffe8b0' : '#cfe0f0', (.1 + .3 * r()) * (1 - d * .4)); g.fillRect(-400 + r() * (W + 800), y, (8 + r() * 40) * (1 + d * 2), 1.2 + d * 2); }
  }, .5) }));
  return (ctx, t, s) => {
    const L = P(), b = breathe(t, .8, 10), u = lin(s.a, s.b, t);
    const cam = { x: 960 + b.dx + 80 * u, y: 540 + b.dy, z: 1.0 };
    lay(ctx, L.sky, cam, .3);
    // swell: moving bands to the right (continues the duvet wave)
    ctx.save(); camApply(ctx, cam, .8);
    const roll = Math.sin(t * 1.6) * .03, heave = Math.sin(t * 1.6 + .6) * 10, fx = 900 + 120 * u, fy = 760 + heave;
    // the ferry: hull, deck house, a funnel, warm windows; you at the rail (amber coat)
    ctx.save(); ctx.translate(fx, fy); ctx.rotate(roll);
    roughPoly(ctx, [[-360, -40], [400, -50], [340, 50], [-320, 50]], '#f0ece0', { amp: 1.2, seed: 3 }); roughPoly(ctx, [[-340, 20], [370, 14], [340, 50], [-320, 50]], '#2a3a5a', { amp: 1, seed: 4 });
    roughRect(ctx, -200, -120, 300, 82, '#e8e2d2', { amp: 1, seed: 5 }); for (let k = 0; k < 6; k++) roughRect(ctx, -185 + k * 48, -104, 32, 26, '#3a4a6a', { amp: .5, seed: 6 + k });
    roughRect(ctx, 30, -190, 48, 74, '#c8443a', { amp: .8, seed: 13 }); roughRect(ctx, 30, -190, 48, 12, '#1a1a2a', { amp: .5, seed: 14 });
    ctx.strokeStyle = '#2a3048'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-340, -70); ctx.lineTo(380, -78); ctx.stroke(); for (let x = -330; x < 380; x += 40) { ctx.beginPath(); ctx.moveTo(x, -70 - x * .011); ctx.lineTo(x, -42 - x * .011); ctx.stroke(); }
    person(ctx, 250, -104, .62, { lean: .05 + .02 * Math.sin(t * 1.4), head: -.2 + .1 * Math.sin(t * .9), sh: [.7, .5], el: [.6, .5], hip: [.04, -.04], kn: [0, 0], hair: 'bun', coat: .5 }, { dress: { coat: '#e59a3a', pants: '#2a2c3a', skin: '#e0b090', hair: '#2a1a14' }, light: { x: 1800, y: 300, col: '#fff0cc', a: .5 }, rim: '#fff0cc', rimSide: 1, rimW: 1.5 });
    ctx.restore();
    // bow wave and swell lines
    const r = prng(8); ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 90; k++) { const y = 700 + Math.pow(r(), 1.2) * 500, ph = r() * 7, x = ((r() * (W + 900) + (t - s.a) * 260 * (1 + (y - 700) / 300)) % (W + 900)) - 450; ctx.fillStyle = rgba('#ffffff', .12 + .2 * r()); ctx.fillRect(x, y + Math.sin(t * 1.6 + x * .005 + ph) * 6, 40 + r() * 90, 2); }
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
    // gulls arc; one peels off up and right on the way out
    for (let k = 0; k < 4; k++) { const ph = t * 1.2 + k * 1.7, gx = 600 + k * 260 + Math.sin(ph * .7) * 120, gy = 280 + k * 30 + Math.cos(ph * .9) * 50; gull(ctx, gx, gy, .9 - k * .1, t * 7 + k, .85); }
    const pe = eio(lin(tm.peel, tm.exit + .1, t)); gull(ctx, mix(1100, 2050, pe), mix(240, -60, pe) + Math.sin(pe * 3) * 40, 1.3, t * 9, 1);
    fin(ctx, { vig: .22 });
  };
}

// ================================================================ 0.13 finally rest: a sun-warmed rock, arm over the eyes; the sun sets fast
const RK = (() => { const n = vnoise(7), p = []; for (let i = 0; i <= 50; i++) { const q = i / 50, x = mix(120, 1820, q); p.push([x, 760 - 230 * Math.pow(Math.sin(Math.PI * Math.pow(q, .85)), .7) - 30 * n(q * 7, 1)]); } p.push([1900, 1200], [40, 1200]); return p; })();
export function rock(tm) {
  const P = () => once('o13', () => ({ land: bake(-300, 300, W + 600, H + 100, (g) => {
    // the rock: warm granite, stroked along its curve, hatched in its shadow, a lit crest
    roughPoly(g, RK, '#9a6e5a', { amp: 3, seed: 3 });
    g.save(); g.beginPath(); roughPath(g, RK, { amp: 3, seed: 3 }); g.clip();
    { const lg = g.createLinearGradient(0, 520, 0, 1100); lg.addColorStop(0, rgba('#ffd8a8', .55)); lg.addColorStop(.35, rgba('#c08868', .1)); lg.addColorStop(1, rgba('#2a1424', .7)); g.fillStyle = lg; g.fillRect(0, 400, W, 800); }
    strokes(g, 40, (i, q) => { const x = mix(160, 1780, q), k = i / 40; return [x, RK[Math.round(q * 50)][1] + 14 + k * 300 + Math.sin(q * 9 + i) * 8]; }, { w: 1.5, col: '#e8b890', a: .45, seed: 4 });
    hatch(g, [100, 640, 1800, 500], { angle: .7, gap: 6, w: 1, col: '#3a1a2a', a: .4, seed: 5 });
    const r = prng(3); for (let k = 0; k < 900; k++) { g.fillStyle = rgba(r() < .5 ? '#3a2030' : '#ffe0c0', .25 * r()); g.fillRect(150 + r() * 1650, 560 + r() * 520, 2, 2); }
    g.restore();
    g.strokeStyle = rgba('#fff0cc', .7); g.lineWidth = 2.4; g.beginPath(); RK.slice(0, 51).forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke();
    // tall grass in front of the rock's foot
    const gr = prng(9); for (let k = 0; k < 4200; k++) { const x = -300 + gr() * (W + 600), y = 960 + Math.pow(gr(), 1.2) * 260, l = 10 + gr() * 34; g.strokeStyle = gr() < .35 ? '#e8d08a' : gr() < .6 ? '#7a8a4a' : '#3a4a26'; g.globalAlpha = .35 + .5 * gr(); g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (gr() - .4) * 6, y - l); g.stroke(); } g.globalAlpha = 1;
  }) }));
  return (ctx, t, s) => {
    const L = P(), b = breathe(t, .6, 11), u = lin(s.a, s.b, t), set = eio(lin(tm.set0, tm.exit, t));
    const cam = { x: 960 + b.dx - 30 * u, y: 560 + b.dy, z: 1.03 + .03 * u };
    // sky + sea: gold, sinking into violet as the sun sets fast (dynamic, drawn per frame at low cost)
    const sunY = mix(260, 572, ein(set)), sunX = 1480;
    skyFill(ctx, [[0, mixHex('#5a7ab0', '#22184e', set)], [.55, mixHex('#ffd8a0', '#8a4a7a', set)], [1, mixHex('#fff0cc', '#f0907a', set)]], 0, 0, W, 580);
    addGlow(ctx, sunX, sunY, 620, .6 * (1 - set * .4), K.gold, K.cream);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 572); ctx.clip(); ctx.fillStyle = mixHex(K.cream, '#ffb070', set); ctx.beginPath(); ctx.arc(sunX, sunY, 58, 0, 7); ctx.fill(); ctx.restore();
    skyFill(ctx, [[0, mixHex('#5a8ab8', '#5a3a6a', set)], [1, mixHex('#1a3a6a', '#1a1438', set)]], 0, 572, W, 300);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const rr = prng(4); for (let k = 0; k < 160; k++) { const y = 576 + Math.pow(rr(), 1.5) * 200, x = sunX + (rr() - .5) * (60 + (y - 572) * 4) + drift(t, 5, k); ctx.fillStyle = rgba(K.hot, (.2 + .4 * rr()) * (1 - set * .6)); ctx.fillRect(x, y, 8 + rr() * 30, 1.6); } ctx.restore();
    lay(ctx, L.land, cam, 1);
    ctx.save(); camApply(ctx, cam, 1);
    if (set > 0) { ctx.save(); ctx.beginPath(); RK.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.rect(-500, 950, W + 1000, H); ctx.clip('nonzero'); ctx.fillStyle = rgba('#2a1840', .5 * set); ctx.fillRect(-500, 300, W + 1000, H + 400); ctx.restore(); }
    // you, lying on the warm rock, one arm over the eyes; breathing
    ctx.save(); ctx.translate(900, 538); ctx.rotate(-Math.PI / 2 - .03); const br = Math.sin(t * 1.5);
    person(ctx, 0, 0, 1.9, { lean: 0, head: -.12, sh: [2.6 + .02 * br, .3], el: [-2.0, .4], hip: [.06, -.1], kn: [.02, .42], hair: 'bun', bulk: 1 + .015 * br }, { dress: { coat: '#e59a3a', pants: '#2e3044', skin: '#e0b090', hair: '#2a1a14' }, light: { x: 0, y: -900, col: '#fff3dc', a: .5 }, shadeA: .3 * set, rim: '#fff0cc', rimSide: 1, rimW: 2.4 });
    ctx.restore();
    // the gull from the ferry glides in and lands on the rock's right shoulder
    const land = eout(lin(s.a, s.a + .75, t)); gull(ctx, mix(-60, 1500, land), mix(60, 548, land), 1.4, t * (9 - 8 * land), 1, '#1a1a2a');
    const r = prng(14); for (let k = 0; k < 160; k++) { const x = -200 + r() * (W + 400), y = 1010 + r() * 120, l = 40 + r() * 90, sw = Math.sin(t * 1.4 + x * .01) * 12; ctx.strokeStyle = r() < .3 ? '#f0d890' : '#3a4a22'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * .3, y - l * .5, x + sw, y - l); ctx.stroke(); }
    ctx.restore();
    fin(ctx, { vig: .25 });
  };
}

// ================================================================ 0.14 a garden wall at dusk; your hand slides along, stops on "wall"
// the wall recedes from the left foreground to the right; stones laid out in (u,v) and mapped onto the perspective quad.
const WQ = [[-1300, 242], [2300, 560], [2300, 690], [-1300, 1700]];
export function gardenWall(tm) {
  const m = (u, v) => { const tx = mix(WQ[0][0], WQ[1][0], u), ty = mix(WQ[0][1], WQ[1][1], u), bx = mix(WQ[3][0], WQ[2][0], u), by = mix(WQ[3][1], WQ[2][1], u); return [mix(tx, bx, v), mix(ty, by, v)]; };
  const P = () => once('o14', () => ({ wall: bake(-1400, -400, W + 2100, H + 800, (g) => {
    skyFill(g, [[0, '#120f38'], [.5, '#33265e'], [.8, '#7e4674'], [1, '#d07a6a']], -1400, -400, W + 2100, 1060);
    { const gg = g.createLinearGradient(0, 660, 0, H + 400); gg.addColorStop(0, '#2a1e44'); gg.addColorStop(1, '#0c0a1e'); g.fillStyle = gg; g.fillRect(-1400, 660, W + 2100, H + 100); }
    starField(g, -1400, -400, W + 2100, 600, 360, 6, .5);
    // garden behind: hedge and two dark trees against the dusk
    const r = prng(5); g.fillStyle = '#1a1634'; for (let k = 0; k < 36; k++) { const x = -1350 + k * 110 + r() * 50; g.beginPath(); g.ellipse(x, mix(330, 560, (x + 300) / 2600) - 30, 90 + r() * 50, 70 + r() * 40, 0, 0, 7); g.fill(); }
    for (const [x, h] of [[300, 420], [1300, 330]]) { limb(g, qpts([x, 500], [x + 10, 400], [x - 10, 500 - h * .7]), 20, 6, '#120e28', x); g.fillStyle = '#16122e'; for (let k = 0; k < 8; k++) { g.beginPath(); g.ellipse(x + (r() - .5) * 220, 500 - h + r() * 160, 90 + r() * 50, 70, 0, 0, 7); g.fill(); } }
    fog(g, { y0: 380, y1: 640, col: '#a06a90', a: .25, seed: 9, cover: .6, soft: .5, k: .3 });
    // the wall face
    roughPoly(g, WQ, '#3e3262', { amp: 2, seed: 6 });
    g.save(); g.beginPath(); roughPath(g, WQ, { amp: 2, seed: 6 }); g.clip();
    for (let row = 0; row < 9; row++) { const v0 = .03 + row * .108, v1 = v0 + .1; let u = -r() * .02; while (u < 1) { const du = (.018 + r() * .03) * (1 - u * .55); const q = [m(u + .002, v0), m(u + du - .002, v0 + .004), m(u + du - .002, v1), m(u + .002, v1 - .004)]; roughPoly(g, q, shade('#4a3c72', (r() - .5) * .07 - row * .006), { amp: 2.2, seed: Math.round(u * 9000 + row * 77) }); g.strokeStyle = rgba('#d89090', .18); g.lineWidth = 1.2; g.beginPath(); g.moveTo(...q[0]); g.lineTo(...q[1]); g.stroke(); u += du; } }
    const lg = g.createLinearGradient(0, 300, 0, 1400); lg.addColorStop(0, rgba('#f0907a', .25)); lg.addColorStop(.35, rgba('#f0907a', 0)); lg.addColorStop(1, rgba('#06041a', .6)); g.fillStyle = lg; g.fillRect(-1400, 200, W + 2100, 1600);
    hatch(g, [-1400, 600, W + 2100, 1200], { angle: -.35, gap: 7, w: 1, col: '#08061a', a: .3, seed: 7 });
    g.restore();
    // coping stones on top, lit by the last light
    g.strokeStyle = rgba('#ffb0a0', .65); g.lineWidth = 2.5; g.beginPath(); g.moveTo(...WQ[0]); g.lineTo(...WQ[1]); g.stroke();
    for (let k = 0; k < 160; k++) { const u = .55 + r() * .4, v = r() * .7, [x, y] = m(u, v); g.fillStyle = shade('#24402e', (r() - .5) * .1); g.beginPath(); g.ellipse(x, y, 10 * (1.2 - u), 7 * (1.2 - u), r() * 3, 0, 7); g.fill(); }
  }) }));
  return (ctx, t, s) => {
    const L = P(), b = breathe(t, .6, 12);
    const slide = eout(lin(s.a, tm.wall + .05, t)), settle = Math.sin(clamp((t - tm.wall) / .35) * Math.PI) * (1 - clamp((t - tm.wall) / .6));
    const hu = .38 + .26 * slide + .008 * settle, [hx, hy] = m(hu, .02), sc = mix(2.9, 1.9, (hu - .28) / .5);
    const cam = { x: hx + 120 + b.dx, y: 560 + b.dy, z: 1.0 + .08 * lin(tm.wall, s.b, t) };
    lay(ctx, L.wall, cam, 1);
    ctx.save(); camApply(ctx, cam, 1);
    const press = sm(lin(tm.wall - .12, tm.wall + .18, t)), ang = Math.atan2(WQ[1][1] - WQ[0][1], WQ[1][0] - WQ[0][0]);
    const k = sc / 2.6;
    ctx.fillStyle = '#b8827e'; capsule(ctx, hx - 4 * k, hy + 6 * k, 22 * k, hx - 110 * k, hy + 52 * k, 25 * k);
    ctx.fillStyle = '#241c48'; capsule(ctx, hx - 100 * k, hy + 50 * k, 46 * k, hx - 2000 * k, hy + 1170 * k, 120 * k);
    ctx.strokeStyle = rgba('#0c0820', .55); ctx.lineWidth = 2.5 * k; for (const q of [.18, .3, .45]) { const x0 = mix(hx - 100 * k, hx - 2000 * k, q), y0 = mix(hy + 50 * k, hy + 1170 * k, q), w0 = mix(46, 120, q) * k; ctx.beginPath(); ctx.moveTo(x0 - w0 * .5, y0 - w0 * .8); ctx.quadraticCurveTo(x0 + w0 * .3, y0 - w0 * .1, x0 + w0 * .3, y0 + w0 * .9); ctx.stroke(); }
    ctx.fillStyle = '#1a1438'; capsule(ctx, hx - 96 * k, hy + 46 * k, 49 * k, hx - 112 * k, hy + 58 * k, 49 * k);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ff9a8a', .2); capsule(ctx, hx - 104 * k, hy + 16 * k, 12 * k, hx - 1900 * k, hy + 1060 * k, 26 * k); ctx.restore();
    hand(ctx, hx, hy - 6, ang - .1 + .1 * press, sc, { curl: .2 - .15 * press, col: '#c8908a', spread: press * .8, flat: press, lit: .35, litCol: '#ffb0a0', rim: rgba('#ffc0a8', .8) });
    ctx.restore();
    fin(ctx, { vig: .3 });
  };
}

// ================================================================ 0.15 the harbour at nightfall; one window flickers once; its spark rises
export function harbourNight(tm) {
  return (ctx, t, s) => {
    const b = breathe(t, .7, 13), pull = eoutQ(lin(s.a, tm.guess, t)), up = ein(lin(tm.rise, tm.exit + .1, t));
    const wn = tm.win;
    const cam = { x: mix(wn.x, 960, pull) + b.dx, y: mix(wn.y + 20, 560, pull) + b.dy - 160 * up, z: mix(1.9, 1.0, pull) + b.dz };
    const fk = t < tm.guess - .05 ? 1 : t < tm.guess + .05 ? .1 : t < tm.guess + .12 ? 1 : t < tm.guess + .2 ? .05 : 1;
    drawHarbour(ctx, t, cam, 'night', { flick: { x: wn.x, y: wn.y, a: fk, glow: bell(t, tm.guess + .2, .25) } });
    // the spark: lifts off the flickered window and floats up out of the frame
    const k = lin(tm.guess + .2, tm.exit + .2, t);
    if (k > 0) { const [sx, sy] = toScreen(cam, HARBOUR_P.town, wn.x, wn.y); const y = sy - 1300 * ein(k) * .8 - 120 * k, x = sx + Math.sin(k * 6) * 30; addGlow(ctx, x, y, 70, .9, K.amber, K.hot); ctx.fillStyle = K.cream; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); }
    fin(ctx, { vig: .3 });
  };
}

// ================================================================ 0.16 the spark becomes a soap bubble with the bedroom in it
export function bubble(tm) {
  const P = () => once('o16', () => {
    const sky = bake(-200, -400, W + 400, H + 800, (g) => { skyFill(g, [[0, '#060820'], [.55, '#141a48'], [.85, '#2a2a62'], [1, '#3a2c66']], -200, -400, W + 400, H + 800); starField(g, -200, -400, W + 400, H + 300, 520, 21, .85); strata(g, [[300, -200, 900, 10], [420, 900, 2200, 14]], { fill: '#3a3a7a', fa: .4, line: '#8a9ad8', la: .35, seed: 6 }); fog(g, { y0: 700, y1: 1080, col: '#4a5a9a', a: .35, seed: 4, cover: .6, soft: .5, k: .3 }); }, .5);
    // the reflected bedroom (blue hour, window glowing) baked once into a disc
    const [bc, bg] = layer(600, 600); const B = bedroom('blue');
    bg.save(); bg.beginPath(); bg.arc(300, 300, 296, 0, 7); bg.clip();
    skyFill(bg, [[0, '#2a2a6a'], [.6, '#a86a8e'], [1, '#f4b08a']], 0, 0, 600, 600);
    bg.translate(300, 300); bg.scale(.42, .42); bg.translate(-1000, -560); bg.drawImage(B.room.c, B.room.ox, B.room.oy); bg.globalCompositeOperation = 'lighter'; bg.drawImage(B.patch.c, B.patch.ox, B.patch.oy); bg.restore();
    // fish-eye darkening toward the rim
    bg.globalCompositeOperation = 'destination-in'; const rg = bg.createRadialGradient(300, 300, 150, 300, 300, 300); rg.addColorStop(0, 'rgba(0,0,0,.75)'); rg.addColorStop(1, 'rgba(0,0,0,1)'); bg.fillStyle = rg; bg.fillRect(0, 0, 600, 600);
    bg.globalCompositeOperation = 'source-atop'; const sh = bg.createRadialGradient(300, 300, 200, 300, 300, 300); sh.addColorStop(0, 'rgba(10,10,40,0)'); sh.addColorStop(1, 'rgba(10,10,40,.55)'); bg.fillStyle = sh; bg.fillRect(0, 0, 600, 600);
    return { sky, disc: bc };
  });
  return (ctx, t, s) => {
    const L = P(), b = breathe(t, .6, 14);
    const cam = { x: 960 + b.dx, y: 540 + b.dy - 80 * (1 - eout(lin(s.a, s.a + 1, t))), z: 1.0 };
    lay(ctx, L.sky, cam, .5);
    const grow = eout(lin(s.a + .1, s.a + 1.0, t)), dt = t - tm.dd, wob = t > tm.dd - .15 ? Math.sin(dt * 16 + 1) * Math.exp(-Math.max(0, dt) * 3.5) * (t < tm.dd ? (t - tm.dd + .15) / .15 : 1) : 0;
    const fall = eio(lin(tm.fall, tm.exit, t));
    const R = mix(6, 250, grow) * (1 - .55 * fall), x = 960 + Math.sin(t * .8) * 30 * (1 - fall), y = mix(mix(1060, 470, eout(lin(s.a, s.a + 1.1, t))), 820, fall) + Math.sin(t * 1.3) * 8 * (1 - fall);
    const sx = 1 + .2 * wob + .3 * fall * fall, sy = 1 - .2 * wob - .45 * fall * fall;
    if (grow < .35) addGlow(ctx, x, y, 90, .95 * (1 - grow * 2.6), K.amber, K.hot);
    const a = sm(lin(.15, .55, grow)) * (1 - sm(lin(.8, 1, fall)));
    ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy); ctx.rotate(Math.sin(t * .5) * .1); ctx.globalAlpha = a;
    ctx.drawImage(L.disc, -R, -R, 2 * R, 2 * R);
    ctx.globalCompositeOperation = 'lighter';
    // iridescent film: drifting bands of rose, cyan-white, amber, violet; a bright rim; two window highlights
    for (let k = 0; k < 6; k++) { const ph = t * .9 + k * 1.05, c = ['#e8a3a0', '#d8f7ff', '#ffb35c', '#b09aff', '#e8a3a0', '#ffd59a'][k]; ctx.strokeStyle = rgba(c, .32); ctx.lineWidth = R * (.05 + .03 * Math.sin(ph)); ctx.beginPath(); ctx.arc(0, 0, R * (.9 - k * .012), ph, ph + 1.6 + .6 * Math.sin(ph * .7)); ctx.stroke(); }
    ctx.strokeStyle = rgba('#fff3e8', .7); ctx.lineWidth = Math.max(1.5, R / 90); ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.stroke();
    ctx.fillStyle = rgba('#ffffff', .55); ctx.beginPath(); ctx.ellipse(-R * .44, -R * .46, R * .17, R * .07, -.75, 0, 7); ctx.fill(); ctx.fillStyle = rgba('#ffffff', .3); ctx.beginPath(); ctx.ellipse(R * .5, R * .42, R * .07, R * .03, -.75, 0, 7); ctx.fill();
    ctx.restore();
    if (a > 0) addGlow(ctx, x, y, R * 1.6, .12 * a, '#b09aff', '#ffffff');
    // as it lands it flattens into a spot of light on the floor (handover to the spotlight)
    const spot = sm(lin(tm.exit - .35, tm.exit, t)); if (spot > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(960, 820); ctx.scale(1, .27); const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, 300); sg.addColorStop(0, rgba(K.cream, .62 * spot)); sg.addColorStop(.85, rgba(K.cream, .48 * spot)); sg.addColorStop(1, rgba(K.cream, 0)); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, 300 * spot + 1, 0, 7); ctx.fill(); ctx.restore(); }
    fin(ctx, { vig: .35 });
  };
}

// ================================================================ 0.17 a dark stage, a round spotlight, a mic; cyan phone lights in the hall
export function stage(tm) {
  const P = () => once('o17', () => {
    const back = bake(-300, -300, W + 600, H + 600, (g) => {
      skyFill(g, [[0, '#04050f'], [1, '#0a0b22']], -300, -300, W + 600, H + 600);
      // back curtain folds
      for (let x = -300; x < W + 300; x += 46) { const lg = g.createLinearGradient(x, 0, x + 46, 0); lg.addColorStop(0, 'rgba(30,26,70,.0)'); lg.addColorStop(.5, 'rgba(30,26,70,.55)'); lg.addColorStop(1, 'rgba(30,26,70,0)'); g.fillStyle = lg; g.fillRect(x, -300, 46, 1000); }
      // stage floor in perspective
      const fl = [[-300, 700], [W + 300, 700], [W + 300, H + 300], [-300, H + 300]]; roughPoly(g, fl, '#14122e', { amp: 1, seed: 3 });
      g.strokeStyle = rgba('#000000', .6); g.lineWidth = 1.2; for (let i = -20; i < 30; i++) { g.beginPath(); g.moveTo(960 + i * 40, 700); g.lineTo(960 + i * 200, H + 300); g.stroke(); }
      g.strokeStyle = rgba('#8fa0d8', .25); g.lineWidth = 2; g.beginPath(); g.moveTo(-300, 920); g.lineTo(W + 300, 920); g.stroke();
      g.fillStyle = '#05050f'; g.fillRect(-300, 920, W + 600, 400);
      // the light cone from above, stippled
      cone(g, 960, -260, { dir: 0, spread: .17, len: 1080, col: K.cream, a: .26, k: .8, seed: 5, soft: .5 });
    });
    const heads = []; const r = prng(8); for (let row = 0; row < 4; row++) for (let k = 0; k < 16 - row; k++) heads.push({ x: -100 + k * 140 + r() * 60 + row * 40, y: 1040 - row * 46, s: 1.25 - row * .16, ph: r() * 7, phone: r() < .55, py: r() });
    return { back, heads };
  });
  return (ctx, t, s) => {
    const L = P(), b = breathe(t, .5, 15), u = lin(s.a, s.b, t);
    const cam = { x: 960 + b.dx, y: 560 + b.dy, z: 1.0 + .07 * sine(u) };
    lay(ctx, L.back, cam, .8);
    ctx.save(); camApply(ctx, cam, .8);
    const tight = eio(lin(tm.stage - .25, tm.stage + .35, t)), R = mix(300, 210, tight);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(960, 820); ctx.scale(1, .27); const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, R); sg.addColorStop(0, rgba(K.cream, .62)); sg.addColorStop(.85, rgba(K.cream, .48)); sg.addColorStop(1, rgba(K.cream, 0)); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill(); ctx.restore();
    // mic stand in the light
    ctx.fillStyle = '#08080f'; roughLine(ctx, [[960, 822], [962, 560]], { w: 5, col: '#0a0a14', seed: 3 }); roughLine(ctx, [[962, 560], [1010, 520]], { w: 4, col: '#0a0a14', seed: 4 }); ctx.beginPath(); ctx.ellipse(1018, 514, 12, 18, .8, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(960, 824, 50, 10, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = rgba(K.cream, .5); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(963, 820); ctx.lineTo(964, 562); ctx.stroke();
    ctx.restore();
    // the hall: heads in silhouette, phones held up as tiny cyan points (the only machine colour)
    ctx.save(); camApply(ctx, cam, 1.25);
    for (const h of L.heads) { const bob = Math.sin(t * 1.3 + h.ph) * 2; ctx.fillStyle = '#020208'; ctx.beginPath(); ctx.ellipse(h.x, h.y - 70 * h.s + bob, 30 * h.s, 36 * h.s, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(h.x, h.y + 10 * h.s, 70 * h.s, 50 * h.s, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(h.x - 70 * h.s, h.y + 8 * h.s, 140 * h.s, 120);
      ctx.strokeStyle = rgba('#8090c8', .25); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(h.x, h.y - 70 * h.s + bob, 30 * h.s, 36 * h.s, 0, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke();
      if (h.phone) { const px = h.x + 30 * h.s, py = h.y - 120 * h.s - h.py * 40 + bob, tw = .7 + .3 * Math.sin(t * 2 + h.ph); ctx.fillStyle = rgba(K.cyanW, .85 * tw); ctx.fillRect(px - 5 * h.s, py - 8 * h.s, 10 * h.s, 16 * h.s); addGlow(ctx, px, py, 26 * h.s, .35 * tw, K.cyan, K.cyanW); } }
    ctx.restore();
    fin(ctx, { vig: .45 });
  };
}

// ================================================================ CLIP M: the spotlight squares off into the footage frame; exits right as a small lit rectangle
export function clipM(tm, T) {
  const st = stage(tm);
  const role = clipRole('M'), info = clipInfo('M');
  return (ctx, t, s) => {
    const c = T.clip('M');
    st(ctx, t, s);
    // the scene behind dims to ~30 % while the clip plays
    const dim = sm(lin(tm.morph0, tm.morph1, t)) * (1 - sm(lin(c.end - .1, c.end + .3, t)));
    ctx.fillStyle = rgba('#04050f', .62 * dim); ctx.fillRect(0, 0, W, H);
    // frame geometry: circle on the floor (0) -> portrait frame (1) -> small lit rect sliding out right at mid-height (exit)
    const m = eio(lin(tm.morph0, tm.morph1, t)), ex = lin(c.end - .25, c.end + .42, t), sh = eio(clamp(ex / .55)), go = ein(clamp((ex - .3) / .7));
    const fw = 480, fh = 852, fx0 = 720, fy0 = 56 + Math.sin(t * .7) * 3;
    const breatheZ = 1 + .012 * Math.sin((t - c.start) * .9);
    let w = mix(420, fw, m) * breatheZ, h = mix(114, fh, m) * breatheZ, cx = 960, cy = mix(820, fy0 + fh / 2, m), r = mix(57, 12, m);
    if (sh > 0) { w = mix(w, 150, sh); h = mix(h, 94, sh); cy = mix(cy, 540, sh); r = mix(12, 6, sh); cx = mix(960, 2150, go); }
    const x = cx - w / 2, y = cy - h / 2;
    if (m > 0) {
      frameRect(ctx, x, y, w, h, r, m);
      ctx.save(); ctx.globalAlpha = Math.min(1, m * 3); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); const mg = ctx.createLinearGradient(x, y, x, y + h); mg.addColorStop(0, rgba(K.cream, .9 * (1 - m))); mg.addColorStop(1, rgba('#d8d4c8', .9 * (1 - m))); ctx.fillStyle = mixHex('#2a2a3a', '#05060f', m); ctx.fill(); ctx.fillStyle = mg; ctx.fill(); ctx.restore(); if (m < 1) addGlow(ctx, cx, cy, Math.max(w, h) * .8, .4 * (1 - m), K.cream, '#ffffff');
      if (sh < 1) { ctx.save(); ctx.globalAlpha = 1 - sh; clipScreen(ctx, t, T, 'M', x, y, w, h, { radius: r, bezel: false, glow: false }); ctx.restore(); }
      // the shrinking frame turns into a warm lit window (lands as the train's front window in chapter 01)
      if (sh > 0) { ctx.save(); ctx.globalAlpha = sh; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); const lg = ctx.createLinearGradient(x, y, x, y + h); lg.addColorStop(0, '#fff0cc'); lg.addColorStop(1, K.amber); ctx.fillStyle = lg; ctx.fill(); ctx.restore(); addGlow(ctx, cx, cy, 160, .5 * sh, K.amber, K.hot); }
      frameLine(ctx, x, y, w, h, r, m * (1 - sh));
      // smear trail on the way out
      if (go > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 1; k < 5; k++) { ctx.globalAlpha = .18 * (1 - k / 5) * Math.min(1, go * 4); ctx.fillStyle = K.amber; ctx.beginPath(); ctx.roundRect(x - k * 60 * go, y + 6, w, h - 12, r); ctx.fill(); } ctx.restore(); }
    }
    const la = eout(lin(c.start + .2, c.start + .9, t)) * (1 - lin(c.end - .45, c.end - .1, t));
    nameLabel(ctx, 1262, 760, info.name, role, la);
  };
}
